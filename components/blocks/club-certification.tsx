'use client'

import { BadgeCheck, Check, ClipboardCheck, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { CertStatus } from '@/lib/mock/org'
import { cn } from '@/lib/utils'

const CHECKLIST = [
  '指導者の資格・県研修の修了',
  'スポーツ安全保険への加入',
  '会則・会計（年間予算）の整備',
  '安全・ハラスメント対策の方針',
  '年間活動計画の提出',
]

const statusStyle: Record<CertStatus, string> = {
  未申請: 'bg-secondary text-secondary-foreground',
  申請中: 'bg-amber-500/15 text-amber-600',
  認定済: 'bg-emerald-500/15 text-emerald-600',
}

/** クラブ登録・認定申請（自治体の認定事務フローのプロト）。 */
export function ClubCertification({ initial }: { initial: CertStatus }) {
  const [status, setStatus] = useState<CertStatus>(initial)
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState<boolean[]>(CHECKLIST.map(() => false))
  const allChecked = checked.every(Boolean)

  function submit() {
    setStatus('申請中')
    setOpen(false)
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold',
            statusStyle[status],
          )}
        >
          <BadgeCheck className="size-3.5" />
          認定: {status}
        </span>
        {status !== '認定済' && (
          <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
            <ClipboardCheck className="size-4" />
            {status === '申請中' ? '申請内容を確認' : 'クラブ登録・認定申請'}
          </Button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="bg-background w-full max-w-md rounded-t-2xl border p-6 shadow-xl sm:rounded-2xl">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="label text-brand">地域クラブ 認定申請</div>
                <h3 className="display mt-1 text-lg font-bold">認定基準のチェック</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="閉じる"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
              自治体の地域クラブ認定に必要な項目です。すべて満たしたら申請できます。
            </p>

            <ul className="space-y-2">
              {CHECKLIST.map((item, i) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors',
                      checked[i] ? 'border-brand/40 bg-brand/5' : 'hover:bg-muted',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded-md border',
                        checked[i] ? 'bg-brand border-transparent text-white' : 'border-border',
                      )}
                    >
                      {checked[i] && <Check className="size-3.5" />}
                    </span>
                    {item}
                  </button>
                </li>
              ))}
            </ul>

            <Button className="mt-5 w-full" disabled={!allChecked} onClick={submit}>
              この内容で認定申請する
            </Button>
            {!allChecked && (
              <p className="text-muted-foreground mt-2 text-center text-xs">
                すべての項目を満たすと申請できます
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
