'use client'

import { Send } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type Msg = { from: 'me' | 'them'; text: string }

const QUICK = [
  '活動できる曜日は？',
  'オンラインでも見てもらえますか？',
  '一度見学に来ていただけますか？',
]

/**
 * 募集側 ⇄ 匿名候補 の「気軽に相談」チャット（プロトのモック）。
 * 実名は出さず、まずは軽く会話して相性を確かめる導線。
 */
export function ConsultChat({ candidateLabel }: { candidateLabel: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: 'them',
      text: `はじめまして、${candidateLabel}です。気になることがあれば何でも聞いてください。`,
    },
  ])
  const [text, setText] = useState('')

  function send(body: string) {
    const t = body.trim()
    if (!t) return
    setMsgs((m) => [...m, { from: 'me', text: t }])
    setText('')
    // デモ用の自動返信
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          from: 'them',
          text: 'ありがとうございます。平日夜と週末なら対応できます。まずは一度オンラインでお話ししましょうか。',
        },
      ])
    }, 700)
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="label text-muted-foreground mb-2">{candidateLabel} と相談</div>
      <div className="bg-muted/40 max-h-56 space-y-2 overflow-y-auto rounded-md border p-3">
        {msgs.map((m, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: チャットは追記のみで並び替えなし
            key={i}
            className={cn('flex', m.from === 'me' ? 'justify-end' : 'justify-start')}
          >
            <span
              className={cn(
                'max-w-[80%] rounded-2xl px-3 py-1.5 text-sm',
                m.from === 'me' ? 'bg-foreground text-background' : 'bg-card border',
              )}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>

      {/* クイック返信 */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {QUICK.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => send(q)}
            className="border-border hover:border-foreground/40 rounded-full border px-2.5 py-1 text-xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 入力 */}
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          send(text)
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="メッセージを入力"
          className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 flex-1 rounded-md border bg-transparent px-3 text-sm outline-none focus-visible:ring-[3px]"
        />
        <button
          type="submit"
          aria-label="送信"
          className="bg-foreground text-background flex size-9 items-center justify-center rounded-md"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  )
}
