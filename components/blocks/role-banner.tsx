/** 「いま誰の画面か」を明示する控えめなバナー。 */
export function RoleBanner({
  roleLabel,
  description,
}: {
  emoji?: string
  roleLabel: string
  description: string
  gradient?: string
}) {
  return (
    <div className="border-foreground/15 mb-8 border-l-2 pl-4">
      <div className="label text-brand">{roleLabel}</div>
      <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
