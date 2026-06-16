'use client'

import { AlertCircle, CalendarDays, Check, Megaphone, MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type Audience, announcements, attendance, schedule, shareMessages } from '@/lib/mock/share'
import { cn } from '@/lib/utils'

const audienceStyle: Record<Audience, string> = {
  全員: 'bg-foreground text-background',
  保護者: 'bg-info/15 text-info',
  生徒: 'bg-brand/15 text-brand',
  指導者: 'bg-emerald-500/15 text-emerald-600',
}

const kindStyle: Record<string, string> = {
  練習: 'bg-secondary text-secondary-foreground',
  大会: 'bg-brand/15 text-brand',
  送迎: 'bg-info/15 text-info',
  イベント: 'bg-emerald-500/15 text-emerald-600',
}

export function ShareBoard() {
  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="space-y-6">
        <Announcements />
        <Schedule />
      </div>
      <div className="space-y-6">
        <Attendance />
        <Messages />
      </div>
    </div>
  )
}

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Megaphone
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="card-soft overflow-hidden">
      <div className="flex items-center gap-2 border-b px-5 py-3.5">
        <Icon className="text-brand size-4" />
        <h2 className="display text-base font-bold">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  )
}

function Announcements() {
  return (
    <Section icon={Megaphone} title="お知らせ">
      <div className="space-y-3">
        {announcements.map((a) => (
          <article
            key={a.id}
            className={cn(
              'rounded-xl border p-4',
              a.urgent && 'border-destructive/40 bg-destructive/5',
            )}
          >
            <div className="mb-1 flex items-center gap-2">
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px] font-bold',
                  audienceStyle[a.audience],
                )}
              >
                {a.audience}
              </span>
              {a.urgent && (
                <span className="text-destructive flex items-center gap-0.5 text-[10px] font-bold">
                  <AlertCircle className="size-3" />
                  重要
                </span>
              )}
              <span className="text-muted-foreground ml-auto text-xs">{a.when}</span>
            </div>
            <h3 className="text-sm font-bold">{a.title}</h3>
            <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{a.body}</p>
            <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
              <span>{a.from}</span>
              <span className="bg-border h-3 w-px" />
              <span>既読 {a.readRate}%</span>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}

function Schedule() {
  return (
    <Section icon={CalendarDays} title="予定・カレンダー">
      <ol className="divide-border divide-y">
        {schedule.map((s) => (
          <li key={s.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className="bg-muted w-24 shrink-0 rounded-lg px-2 py-1.5 text-center text-xs font-bold">
              {s.date}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{s.title}</span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-bold',
                    kindStyle[s.kind],
                  )}
                >
                  {s.kind}
                </span>
              </div>
              <p className="text-muted-foreground text-xs">
                {s.place}
                {s.note ? `・${s.note}` : ''}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function Attendance() {
  const [going, setGoing] = useState(attendance.going)
  const [pending, setPending] = useState(attendance.pending)
  const [done, setDone] = useState<null | '出席' | '欠席'>(null)
  const total = going + attendance.notGoing + pending

  function respond(kind: '出席' | '欠席') {
    if (done) return
    if (kind === '出席') setGoing((n) => n + 1)
    setPending((n) => Math.max(0, n - 1))
    setDone(kind)
  }

  return (
    <Section icon={Check} title="出欠確認">
      <div className="mb-3">
        <h3 className="text-sm font-bold">{attendance.title}</h3>
        <p className="text-muted-foreground text-xs">{attendance.date}</p>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-2 text-center">
        <Count value={going} label="出席" accent />
        <Count value={attendance.notGoing} label="欠席" />
        <Count value={pending} label="未回答" />
      </div>
      <div className="bg-muted mb-4 flex h-2 overflow-hidden rounded-full">
        <div className="bg-brand" style={{ width: `${(going / total) * 100}%` }} />
        <div
          className="bg-muted-foreground/40"
          style={{ width: `${(attendance.notGoing / total) * 100}%` }}
        />
      </div>
      {done ? (
        <div className="bg-muted flex items-center justify-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium">
          <Check className="text-brand size-4" />「{done}」で回答しました
        </div>
      ) : (
        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => respond('出席')}>
            出席する
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => respond('欠席')}>
            欠席
          </Button>
        </div>
      )}
    </Section>
  )
}

function Count({ value, label, accent }: { value: number; label: string; accent?: boolean }) {
  return (
    <div className="bg-secondary/50 rounded-lg py-2">
      <div className={cn('display text-xl leading-none font-bold', accent && 'text-brand')}>
        {value}
      </div>
      <div className="text-muted-foreground mt-1 text-xs">{label}</div>
    </div>
  )
}

function Messages() {
  const [messages, setMessages] = useState(shareMessages)
  const [text, setText] = useState('')

  function send() {
    const t = text.trim()
    if (!t) return
    setMessages((prev) => [
      ...prev,
      { id: `me-${prev.length}`, from: 'あなた', role: '保護者', text: t, when: 'たった今' },
    ])
    setText('')
  }

  return (
    <Section icon={MessageCircle} title="連絡">
      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="flex gap-2 text-sm">
            <span className="text-muted-foreground w-24 shrink-0 truncate text-xs">{m.from}</span>
            <p className="flex-1 leading-snug">{m.text}</p>
            <span className="text-muted-foreground/70 shrink-0 text-[10px]">{m.when}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="連絡を入力（保護者⇄指導者）"
        />
        <Button size="icon" onClick={send} aria-label="送信">
          <Send className="size-4" />
        </Button>
      </div>
    </Section>
  )
}
