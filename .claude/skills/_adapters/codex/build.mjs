#!/usr/bin/env node
// adapters/codex/build — Claude フォーマットの SKILL.md を Codex Skills 形式に変換 (依存ゼロ)
//
// 使い方: node adapters/codex/build.mjs [--out <dir>|--out=<dir>] [--plugin <name>|--plugin=<name>]
//   --out:    出力先 (default: .codex/skills)
//   --plugin: 単一 plugin だけ変換 (default: 全 plugin)
//
// 変換ルール:
// 1. この adapter がある repo の plugins/<name>/skills/<name>/SKILL.md を読む
// 2. frontmatter (YAML) を Codex Skills 互換に変換
//    - `name` / `description` は同じ
//    - `allowed-tools: [Bash, Edit, Read, Write]` → Codex の tool 名にマップ
// 3. body の "Claude" 表記は維持 (Codex が読んでも文脈で理解できる)
// 4. <out>/<name>/SKILL.md を書き出し、plugin 同梱アセット
//    (references/ scripts/ templates/ workflows-template/ __fixtures__/) を <out>/<name>/ 配下へコピー。
//    docs/ は <out>/_docs/、adapters/ は <out>/_adapters/、examples/ は <out>/_examples/、
//    README.md は <out>/_README.md として同梱する
// 5. Markdown 内の相対リンク (.md / .mjs / .yml / .yaml / .json / .sh / .ts / ディレクトリ参照) と
//    `${CLAUDE_PLUGIN_ROOT}/...` 形式のリンクを、生成先レイアウトに合わせて書き換える
// 6. ビルド後、出力内の全 .md の相対リンクを自己検証し、リンク切れがあれば一覧表示して exit 1
//
// 注: Codex Skills 仕様は変化が早い。本スクリプトは設計どおり動く最小プロト。

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, cpSync, rmSync } from 'node:fs';
import { join, dirname, resolve, isAbsolute, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const opts = {};
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--out') opts.out = args[++i];
  else if (a.startsWith('--out=')) opts.out = a.slice('--out='.length);
  else if (a === '--plugin') opts.plugin = args[++i];
  else if (a.startsWith('--plugin=')) opts.plugin = a.slice('--plugin='.length);
}
const SOURCE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT_ARG = opts.out ?? '.codex/skills';
const OUT_ROOT = isAbsolute(OUT_ARG) ? OUT_ARG : resolve(process.cwd(), OUT_ARG);

// allowed-tools 名前空間マップ
const TOOL_MAP = {
  Bash: 'shell',
  Edit: 'edit_file',
  Read: 'read_file',
  Write: 'write_file',
  Glob: 'glob',
  Grep: 'grep',
};

// SKILL.md / references から相対参照される plugin 同梱アセットのディレクトリ
const PLUGIN_ASSET_DIRS = ['references', 'scripts', 'templates', 'workflows-template', '__fixtures__'];

// リンク書き換えの対象とする拡張子 (.md に加え、同梱アセットで使われる拡張子)
const LINKABLE_EXTENSIONS = new Set(['.md', '.mjs', '.yml', '.yaml', '.json', '.sh', '.ts']);

function listPlugins() {
  const pluginsDir = join(SOURCE_ROOT, 'plugins');
  if (!existsSync(pluginsDir)) return [];
  return readdirSync(pluginsDir).filter((name) =>
    existsSync(join(pluginsDir, name, '.claude-plugin', 'plugin.json'))
  );
}

// BOM 除去と CRLF/CR → LF 正規化 (frontmatter regex が \n 前提のため)
function normalizeMarkdown(text) {
  return text.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}

function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { frontmatter: {}, body: md };
  const lines = m[1].split('\n');
  const fm = {};
  for (const line of lines) {
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    }
    fm[key] = value;
  }
  return { frontmatter: fm, body: m[2] };
}

function buildCodexFrontmatter(fm) {
  const out = {};
  // 値が欠けている場合に `name: undefined` と書き出さないようガード
  if (fm.name != null && fm.name !== '') out.name = fm.name;
  if (fm.description != null && fm.description !== '') out.description = fm.description;
  if (Array.isArray(fm['allowed-tools'])) {
    out.tools = fm['allowed-tools'].map((t) => TOOL_MAP[t] ?? t.toLowerCase());
  }
  return out;
}

function serializeFrontmatter(fm) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(fm)) {
    if (v == null) continue;
    if (Array.isArray(v)) {
      lines.push(`${k}: [${v.join(', ')}]`);
    } else {
      lines.push(`${k}: ${v}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

function isInside(parent, child) {
  const rel = relative(parent, child);
  return rel !== '' && !rel.startsWith('..') && !isAbsolute(rel);
}

function slashPath(p) {
  return p.split('\\').join('/');
}

function shouldSkipSourcePath(sourcePath) {
  const rel = slashPath(relative(SOURCE_ROOT, sourcePath));
  // .DS_Store 等のドットファイル (OS / エディタ生成物) は生成物に焼き込まない
  if (rel.split('/').pop().startsWith('.')) return true;
  return rel === 'docs/skill-tests/latest.md'
    || rel.startsWith('docs/skill-tests/outputs/')
    || rel.startsWith('docs/skill-tests/reports/');
}

function relativeMarkdownLink(fromFile, toFile) {
  const rel = slashPath(relative(dirname(fromFile), toFile));
  return rel.startsWith('.') ? rel : `./${rel}`;
}

// 変換元パス → 生成先パスのマッピング。マップできないものは null (リンクは書き換えない)
function generatedPathForSource(sourcePath) {
  const docsRoot = join(SOURCE_ROOT, 'docs');
  if (isInside(docsRoot, sourcePath)) {
    return join(OUT_ROOT, '_docs', relative(docsRoot, sourcePath));
  }

  if (sourcePath === join(SOURCE_ROOT, 'README.md')) {
    return join(OUT_ROOT, '_README.md');
  }

  const adaptersRoot = join(SOURCE_ROOT, 'adapters');
  if (isInside(adaptersRoot, sourcePath)) {
    return join(OUT_ROOT, '_adapters', relative(adaptersRoot, sourcePath));
  }

  const examplesRoot = join(SOURCE_ROOT, 'examples');
  if (isInside(examplesRoot, sourcePath)) {
    return join(OUT_ROOT, '_examples', relative(examplesRoot, sourcePath));
  }

  const pluginsRoot = join(SOURCE_ROOT, 'plugins');
  if (isInside(pluginsRoot, sourcePath)) {
    const parts = slashPath(relative(pluginsRoot, sourcePath)).split('/');
    // plugins/<p> ディレクトリ自体への参照 → <out>/<p>
    if (parts.length === 1) {
      return join(OUT_ROOT, parts[0]);
    }
    // 同梱アセット: plugins/<p>/<asset>/... → <out>/<p>/<asset>/...
    if (PLUGIN_ASSET_DIRS.includes(parts[1])) {
      return join(OUT_ROOT, parts[0], ...parts.slice(1));
    }
    // SKILL.md 本体への cross-link: plugins/<p>/skills/<skill>/... → <out>/<p>/...
    if (parts[1] === 'skills') {
      if (parts.length <= 3) return join(OUT_ROOT, parts[0]);
      return join(OUT_ROOT, parts[0], ...parts.slice(3));
    }
    // commands/ hooks/ .claude-plugin/ などは出力に同梱しないため書き換えない
    return null;
  }

  return null;
}

// 変換元ファイルが属する plugin 名 (plugin 配下でなければ null)
function pluginNameForSource(sourcePath) {
  const pluginsRoot = join(SOURCE_ROOT, 'plugins');
  if (!isInside(pluginsRoot, sourcePath)) return null;
  return slashPath(relative(pluginsRoot, sourcePath)).split('/')[0];
}

function transformMarkdownLinks(text, srcFile, dstFile) {
  return text.replace(/\]\(([^)\s]+)\)/g, (match, rawLink) => {
    const hashIndex = rawLink.indexOf('#');
    const link = hashIndex >= 0 ? rawLink.slice(0, hashIndex) : rawLink;
    const hash = hashIndex >= 0 ? rawLink.slice(hashIndex) : '';
    if (!link) return match; // ページ内アンカー (#...)
    // URL (scheme:) / 絶対パス / <...> 形式は対象外
    if (/^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith('/') || link.startsWith('<')) return match;

    let sourceTarget;
    if (link.startsWith('${CLAUDE_PLUGIN_ROOT}/')) {
      // plugin root 相対リンク。変換先では plugin root = <out>/<p>/ になる
      const pluginName = pluginNameForSource(srcFile);
      if (!pluginName) return match;
      sourceTarget = join(SOURCE_ROOT, 'plugins', pluginName, link.slice('${CLAUDE_PLUGIN_ROOT}/'.length));
    } else if (link.includes('${')) {
      return match; // その他の未解決変数はそのまま残す
    } else {
      // ディレクトリ参照 (`/` 終わり) か、対象拡張子のファイルだけ書き換える
      if (!link.endsWith('/') && !LINKABLE_EXTENSIONS.has(extname(link))) return match;
      sourceTarget = resolve(dirname(srcFile), link);
    }

    const generatedTarget = generatedPathForSource(sourceTarget);
    if (!generatedTarget) return match;
    const trailingSlash = link.endsWith('/') ? '/' : '';
    return `](${relativeMarkdownLink(dstFile, generatedTarget)}${trailingSlash}${hash})`;
  });
}

function copyTransformedTree(src, dst) {
  if (!existsSync(src)) return false;
  for (const entry of readdirSync(src, { withFileTypes: true })) {
    const from = join(src, entry.name);
    if (shouldSkipSourcePath(from)) continue;
    const to = join(dst, entry.name);
    if (entry.isDirectory()) {
      copyTransformedTree(from, to);
    } else {
      mkdirSync(dirname(to), { recursive: true });
      if (extname(entry.name) === '.md') {
        writeFileSync(to, transformMarkdownLinks(normalizeMarkdown(readFileSync(from, 'utf8')), from, to));
      } else {
        cpSync(from, to);
      }
    }
  }
  return true;
}

function copyTransformedMarkdownFile(src, dst) {
  if (!existsSync(src)) return false;
  if (shouldSkipSourcePath(src)) return false;
  mkdirSync(dirname(dst), { recursive: true });
  writeFileSync(dst, transformMarkdownLinks(normalizeMarkdown(readFileSync(src, 'utf8')), src, dst));
  return true;
}

// plugin の同梱アセット (references/ scripts/ templates/ workflows-template/ __fixtures__/) をコピー
function copyPluginAssets(pluginName) {
  const copied = [];
  for (const assetDir of PLUGIN_ASSET_DIRS) {
    const ok = copyTransformedTree(
      join(SOURCE_ROOT, 'plugins', pluginName, assetDir),
      join(OUT_ROOT, pluginName, assetDir),
    );
    if (ok) copied.push(assetDir);
  }
  return copied;
}

// docs/ など共有物が全 plugin のアセットへリンクするため、--plugin 指定時も全 plugin 分コピーする
function copyAllPluginAssets() {
  for (const pluginName of listPlugins()) copyPluginAssets(pluginName);
}

// --out が変換元 (plugins/ docs/ adapters/) 内を指していたら拒否 (出力が走査対象に混入する汚染防止)
function assertSafeOutRoot() {
  for (const dirName of ['plugins', 'docs', 'adapters']) {
    const guarded = join(SOURCE_ROOT, dirName);
    if (OUT_ROOT === guarded || isInside(guarded, OUT_ROOT)) {
      console.error(`[error] --out が変換元の ${dirName}/ 内を指しています: ${OUT_ROOT}`);
      console.error('        出力が変換元に混入するため拒否します。別の出力先を指定してください。');
      process.exit(1);
    }
  }
}

// これから書き直す場所だけを事前削除する (残骸の蓄積防止)。
// ユーザーの --out 誤指定から保護するため、出力先全体の rm -rf はしない。
function cleanPreviousOutputs(targets) {
  const paths = [
    ...targets.map((p) => join(OUT_ROOT, p)),
    join(OUT_ROOT, '_docs'),
    join(OUT_ROOT, '_adapters'),
    join(OUT_ROOT, '_examples'),
    join(OUT_ROOT, '_README.md'),
  ];
  for (const p of paths) rmSync(p, { recursive: true, force: true });
}

function listMarkdownFilesRecursively(dir) {
  const acc = [];
  if (!existsSync(dir)) return acc;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) acc.push(...listMarkdownFilesRecursively(p));
    else if (extname(entry.name) === '.md') acc.push(p);
  }
  return acc;
}

// ビルド後の自己検証: scopeDir 配下の全 .md の相対リンクを解決し、切れているものを返す
function verifyOutputLinks(scopeDir) {
  const files = listMarkdownFilesRecursively(scopeDir);
  const broken = [];
  for (const file of files) {
    // コードブロック / インラインコード内の例示リンクは検証対象外
    const text = readFileSync(file, 'utf8')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`\n]*`/g, '');
    for (const m of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      const rawLink = m[1];
      const link = rawLink.split('#')[0];
      if (!link) continue;
      if (/^[a-z][a-z0-9+.-]*:/i.test(link) || link.startsWith('/') || link.startsWith('<')) continue;
      if (link.includes('${')) continue; // 未解決の変数を含むリンクは対象外
      if (!existsSync(resolve(dirname(file), link))) {
        broken.push({ file: slashPath(relative(OUT_ROOT, file)), link: rawLink });
      }
    }
  }
  return { checkedFiles: files.length, broken };
}

function convert(pluginName) {
  const src = join(SOURCE_ROOT, 'plugins', pluginName, 'skills', pluginName, 'SKILL.md');
  if (!existsSync(src)) {
    console.warn(`[skip] ${pluginName}: SKILL.md not found at ${src}`);
    return null;
  }
  const raw = normalizeMarkdown(readFileSync(src, 'utf8'));
  const { frontmatter, body } = parseFrontmatter(raw);
  const codexFm = buildCodexFrontmatter(frontmatter);
  const skillDir = join(OUT_ROOT, pluginName);
  const dst = join(skillDir, 'SKILL.md');
  const output = serializeFrontmatter(codexFm) + '\n' + transformMarkdownLinks(body, src, dst);

  mkdirSync(dirname(dst), { recursive: true });
  writeFileSync(dst, output);

  return {
    src,
    dst,
    plugin: pluginName,
    tools: codexFm.tools,
    bundledAssets: PLUGIN_ASSET_DIRS.filter((d) =>
      existsSync(join(SOURCE_ROOT, 'plugins', pluginName, d))
    ),
  };
}

// --- メイン処理 ---

assertSafeOutRoot();

const allPlugins = listPlugins();
if (opts.plugin && !allPlugins.includes(opts.plugin)) {
  console.error(`[error] plugin が見つかりません: ${opts.plugin}`);
  console.error(`        利用可能: ${allPlugins.join(', ') || '(なし)'}`);
  process.exit(1);
}

const targets = opts.plugin ? [opts.plugin] : allPlugins;

cleanPreviousOutputs(targets);

const results = [];
for (const p of targets) {
  const r = convert(p);
  if (r) results.push(r);
}

if (opts.plugin && results.length === 0) {
  console.error(`[error] --plugin ${opts.plugin} で変換された SKILL.md が 0 件です`);
  process.exit(1);
}

copyAllPluginAssets();
const copiedDocs = copyTransformedTree(join(SOURCE_ROOT, 'docs'), join(OUT_ROOT, '_docs'));
copyTransformedTree(join(SOURCE_ROOT, 'adapters'), join(OUT_ROOT, '_adapters'));
copyTransformedTree(join(SOURCE_ROOT, 'examples'), join(OUT_ROOT, '_examples'));
copyTransformedMarkdownFile(join(SOURCE_ROOT, 'README.md'), join(OUT_ROOT, '_README.md'));

// 自己検証。--plugin 指定時は対象 plugin 配下のみ検証する
// (共有物 _docs などは全 plugin の出力前提でリンクするため、全体検証は全体ビルドで行う)
const checkScope = opts.plugin ? join(OUT_ROOT, opts.plugin) : OUT_ROOT;
const { checkedFiles, broken } = verifyOutputLinks(checkScope);

console.log(JSON.stringify({
  ok: broken.length === 0,
  count: results.length,
  out: OUT_ROOT,
  copiedDocs,
  linkCheck: {
    scope: slashPath(relative(OUT_ROOT, checkScope)) || '.',
    checkedFiles,
    brokenLinks: broken.length,
  },
  results,
}, null, 2));

if (broken.length > 0) {
  console.error(`[error] 出力内にリンク切れが ${broken.length} 件あります:`);
  for (const b of broken) console.error(`  ${b.file} -> ${b.link}`);
  process.exit(1);
}
