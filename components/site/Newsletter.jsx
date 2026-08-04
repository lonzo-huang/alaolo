'use client'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { toast } from 'sonner'
import { Mail, ArrowRight } from 'lucide-react'

export function Newsletter() {
  const t = useTranslations('newsletter')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error(t('invalidEmail')); return }
    setLoading(true)
    try {
      const res = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, locale }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'error')
      if (data.already) toast.info(t('alreadySubscribed'))
      else toast.success(t('success'))
      setEmail('')
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="newsletter" className="relative rounded-2xl border border-white/10 bg-gradient-to-br from-[#151A26] via-[#10141C] to-[#0D1119] p-8 md:p-10 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#F5C518]/15 blur-[100px] rounded-full pointer-events-none" />
      <div className="relative max-w-2xl">
        <div className="inline-flex items-center gap-2 mb-3 text-[11px] font-semibold tracking-[0.15em] text-[#F5C518]">
          <Mail className="w-3.5 h-3.5" />NEWSLETTER
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{t('title')}</h2>
        <p className="mt-2 text-slate-400 text-[14.5px]">{t('subtitle')}</p>
        <form onSubmit={submit} className="mt-5 flex gap-2 max-w-md">
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={t('placeholder')} className="flex-1 px-4 py-2.5 rounded-lg bg-[#0A0D14] border border-white/10 text-white placeholder-slate-500 focus:border-[#F5C518]/40 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/30 text-sm" />
          <button disabled={loading} className="px-4 py-2.5 rounded-lg bg-[#F5C518] hover:bg-[#e6b800] text-black text-sm font-medium inline-flex items-center gap-1.5 disabled:opacity-50">
            {t('subscribe')}<ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  )
}
