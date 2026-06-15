'use client'

import { Check } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/** 応募/依頼の主アクション。タップで「完了」状態まで見せ、目的達成を実感させる。 */
export function ApplyButton({
  label = '応募する',
  doneLabel = '応募しました！',
  className,
}: {
  label?: string
  doneLabel?: string
  className?: string
}) {
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div
        className={cn(
          'animate-pop flex items-center justify-center gap-1.5 rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white',
          className,
        )}
      >
        <Check className="size-4" />
        {doneLabel} 🎉
      </div>
    )
  }

  return (
    <Button
      onClick={() => setDone(true)}
      className={cn('bg-brand rounded-full text-white', className)}
    >
      {label}
    </Button>
  )
}
