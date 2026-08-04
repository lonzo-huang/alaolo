'use client'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const t = useTranslations('admin')
  const locale = useLocale()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const sb = createSupabaseBrowser()
    try {
      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push(`/${locale}/admin`)
      router.refresh()
    } catch (e) {
      toast.error(e.message || t('loginError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <div className="p-8 rounded-2xl border border-white/10 bg-[#10141C]">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-lg bg-[#F5C518] flex items-center justify-center font-black text-black text-xl mx-auto">a</div>
          <h1 className="mt-4 text-xl font-bold text-white">{t('title')} · {t('login')}</h1>
        </div>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400">{t('email')}</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white focus:border-[#F5C518]/40 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/30 text-sm" placeholder="admin@alaolo.com" />
          </div>
          <div>
            <label className="text-xs text-slate-400">{t('password')}</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-white focus:border-[#F5C518]/40 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/30 text-sm" placeholder="••••••••" />
          </div>
          <button disabled={loading} className="w-full py-2 rounded-lg bg-[#F5C518] hover:bg-[#e6b800] text-black font-medium text-sm disabled:opacity-50">{t('submit')}</button>
        </form>
      </div>
    </div>
  )
}
