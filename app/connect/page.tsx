import { redirect } from 'next/navigation'

// つながりイベントはトップ(/)に統合した。
export default function ConnectRedirect() {
  redirect('/')
}
