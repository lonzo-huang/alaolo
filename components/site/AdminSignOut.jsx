'use client'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function AdminSignOut({ label, locale, className }) {
  const router = useRouter()
  const handle = async () => {
    const sb = createSupabaseBrowser()
    await sb.auth.signOut()
    router.push(`/${locale}/admin/login`)
    router.refresh()
  }
  return <button onClick={handle} className={className}>{label}</button>
}
