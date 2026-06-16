#!/usr/bin/env node
// adapters/claude/build — Claude フォーマットの SKILL.md を .claude/skills/ へ vendoring (依存ゼロ)
//
// 使い方: node adapters/claude/build.mjs [--out <dir>|--out=<dir>] [--plugin <name>|--plugin=<name>]
//   --out:    出力先 (default: .claude/skills)
//   --plugin: 単一 plugin だけ変換 (default: 全 plugin)
//
// なぜこの adapter が要るか:
//   `.claude/settings.json` の marketplace 参照 (extraKnownMarketplaces + enabledPlugins) は
//   ローカルの Claude Code (CLI / VS Code) でしか install されない。Claude Web (クラウド) では
//   marketplace の clone がセッション初期化に間に合わず、初回セッションで plugin が無効になりがち
//   (`/reload-plugins` も Web では無効)。一方 `.claude/skills/` に **commit された** skill は
//   リポジトリ本体の一部なので、Web/クラウドでも毎回・即ロードされる。
//   そこで「marketplace の skill を .claude/skills/ に焼き込む (vendoring)」のがこの adapter。
//
// Codex/Antigravity adapter との違い:
//   SKILL.md は Claude **ネイティブ形式**なので frontmatter は一切変換しない (verbatim 保持)。
//   tool 名のマップも model の削除もしない。body の相対リンクだけ生成先レイアウトへ書き換える。
//
// 変換ルール:
// 1. この adapter がある repo の plugins/<name>/skills/<name>/SKILL.md を読む
// 2. frontmatter (YAML) は **そのまま** 維持する
// 3. <out>/<name>/SKILL.md を書き出し、plugin 同梱アセット
//    (references/ scripts/ templates/ workflows-template/ __fixtures__/) を <out>/<name>/ 配下へコピー。
//    docs/ は <out>/_docs/、adapters/ は <out>/_adapters/、examples/ は <out>/_examples/、
//    README.md は <out>/_README.md として同梱する (先頭 _ なので Claude は skill として走査しない)
// 4. Markdown 内の相対リンクと `${CLAUDE_PLUGIN_ROOT}/...` 形式のリンクを生成先レイアウトに書き換える
// 5. ビルド後、出力内の全 .md の相対リンクを自己検証し、リンク切れがあれば一覧表示して exit 1

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
const OUT_ARG = opts.out ?? '.claude/skills';
const OUT_ROOT = isAbsolute(OUT_ARG) ? OUT_ARG : resolve(process.cwd(), OUT_ARG);

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

// frontmatter ブロックを verbatim (生のまま) で取り出す。Claude ネイティブ形式なので無変換で残す。
function splitFrontmatter(md) {
  const m = md.match(/^(---\n[\s\S]*?\n---)\n([\s\S]*)$/);
  if (!m) return { fmBlock: null, body: md };
  return { fmBlock: m[1], body: m[2] };
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
  // .DS_Store 等のドットファイル (OS / エディタ生成物) は生成物に焼き込まない。
  // Claude 版は commit する設計なので、利用側 .gitignore に依存せずアダプタ側で弾く。
  if (rel.split('/').pop().startsWith('.')) return true;
  return rel === 'docs/skill-tests/latest.md'
    || rel === 'docs/skill-tests/report.md' // 廃止済みの旧スナップショット (残骸対策)
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

// この adapter が生成した plugin 一覧を記録する manifest。reconcile はこれを基準にするため、
// 利用者が .claude/skills/ に手で置いた独自 skill を絶対に消さない (= adapter 生成物だけを掃除)。
const MANIFEST_NAME = '.vendored-skills.json';

function readManifestPlugins() {
  const p = join(OUT_ROOT, MANIFEST_NAME);
  if (!existsSync(p)) return null; // manifest 無し (初回 / 旧出力) → 何も消さない安全側
  try {
    const j = JSON.parse(readFileSync(p, 'utf8'));
    return Array.isArray(j.plugins) ? j.plugins : null;
  } catch {
    return null;
  }
}

function writeManifest(plugins) {
  mkdirSync(OUT_ROOT, { recursive: true });
  const body = {
    generatedBy: 'adapters/claude/build.mjs',
    note: 'この adapter が生成した skill の記録。reconcile はこの一覧に基づき、source から消えた plugin の出力だけを掃除する。利用者が手で置いた skill は対象外なので消さない。',
    plugins: [...plugins].sort(),
  };
  writeFileSync(join(OUT_ROOT, MANIFEST_NAME), `${JSON.stringify(body, null, 2)}\n`);
}

// source から削除/rename された plugin の生成物が出力に残ると、Claude 版は commit する設計のため
// stale な SKILL.md が Web にロードされてしまう。出力ツリーを「現存 source plugin の鏡」に保つため、
// **前回の manifest に載っていた (= この adapter が過去に生成した) が、現存 plugin に無い** ものだけを削除する。
// manifest に載らない利用者独自 skill や、先頭 _ の共有物は対象外。manifest が無ければ何も消さない (安全側)。
function reconcileStaleOutputs(currentPlugins) {
  if (!existsSync(OUT_ROOT)) return [];
  const prev = readManifestPlugins();
  if (!prev) return []; // 初回 / 旧出力: 何が adapter 生成かを判別できないので消さない
  const known = new Set(currentPlugins);
  const removed = [];
  for (const name of prev) {
    if (known.has(name)) continue; // まだ現存する plugin は残す
    if (name.startsWith('_')) continue; // 共有物は別管理 (通常 manifest には入らない)
    const dir = join(OUT_ROOT, name);
    // 念のため SKILL.md を持つ adapter 生成ディレクトリであることを確認してから削除
    if (existsSync(join(dir, 'SKILL.md'))) {
      rmSync(dir, { recursive: true, force: true });
      removed.push(name);
    }
  }
  return removed;
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
  const { fmBlock, body } = splitFrontmatter(raw);
  const skillDir = join(OUT_ROOT, pluginName);
  const dst = join(skillDir, 'SKILL.md');
  // frontmatter は Claude ネイティブ形式なので verbatim 維持。body のリンクのみ書き換える。
  const transformedBody = transformMarkdownLinks(body, src, dst);
  const output = fmBlock ? `${fmBlock}\n${transformedBody}` : transformedBody;

  mkdirSync(dirname(dst), { recursive: true });
  writeFileSync(dst, output);

  return {
    src,
    dst,
    plugin: pluginName,
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
// --plugin 指定時も含め、source から消えた plugin の生成物は出力ツリーから掃除する
const removedStale = reconcileStaleOutputs(allPlugins);

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

// 次回 reconcile の基準として、現存 source plugin 一覧を manifest に記録する
// (--plugin 指定時も全 source を記録し、出力を現存 source の鏡として管理する)
writeManifest(allPlugins);

// 自己検証。--plugin 指定時は対象 plugin 配下のみ検証する
// (共有物 _docs などは全 plugin の出力前提でリンクするため、全体検証は全体ビルドで行う)
const checkScope = opts.plugin ? join(OUT_ROOT, opts.plugin) : OUT_ROOT;
const { checkedFiles, broken } = verifyOutputLinks(checkScope);

console.log(JSON.stringify({
  ok: broken.length === 0,
  count: results.length,
  out: OUT_ROOT,
  removedStale,
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
