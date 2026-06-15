#!/bin/bash
# Claude Code セッション開始時の自動セットアップ
# - pnpm が無ければ corepack 経由で有効化 (package.json の packageManager ピンを採用)
# - 依存をインストール (lockfile があれば --frozen-lockfile)
set -euo pipefail

# Web 版 Claude Code (CLAUDE_CODE_REMOTE=true) でのみ自動実行
# ローカルでも動かしたい場合はこの if を外す
if [ "${CLAUDE_CODE_REMOTE:-}" = "true" ]; then
  if ! command -v pnpm &> /dev/null; then
    echo "▶ pnpm が見つからないため corepack で有効化します"
    corepack enable 2>/dev/null || true
    # 引数なし = package.json の packageManager フィールドのバージョンを採用
    corepack prepare --activate 2>/dev/null || true
  fi

  if ! command -v pnpm &> /dev/null; then
    # npm fallback は置かない (pnpm-lock.yaml しか無いので npm ci は必ず失敗する)
    echo "⚠ pnpm を用意できませんでした。手動で corepack enable → pnpm install を実行してください"
    exit 0
  fi

  if [ -f "pnpm-lock.yaml" ]; then
    echo "▶ pnpm install --prefer-offline --frozen-lockfile"
    pnpm install --prefer-offline --frozen-lockfile 2>&1 | tail -5
  else
    echo "▶ pnpm install (lockfile なし)"
    pnpm install 2>&1 | tail -5
  fi
fi
