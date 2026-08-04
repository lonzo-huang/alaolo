'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search, Star, Menu, X } from 'lucide-react'
import { locales, localeNames } from '@/lib/i18n/config'

export function Header({ locale }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)

  const switchLocale = (nextLocale) => {
    const segments = pathname.split('/')
    segments[1] = nextLocale
    router.push(segments.join('/') + (typeof window !== 'undefined' ? window.location.search : ''))
  }

  const submitSearch = (e) => {
    e.preventDefault()
    if (q.trim()) router.push(`/${locale}?q=${encodeURIComponent(q.trim())}`)
  }

  const nav = [
    { label: t('discover'), href: `/${locale}` },
    { label: t('ai'), href: `/${locale}?cat=ai` },
    { label: t('downloads'), href: `/${locale}?cat=productivity` },
    { label: t('learning'), href: `/${locale}?cat=learning` },
  ]

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-white/[0.06] bg-[#0A0D14]/90 backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl h-16 flex items-center gap-4 px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 group shrink-0">
          <div className="w-7 h-7 rounded-md bg-[#F5C518] flex items-center justify-center font-black text-black text-base shadow-[0_0_18px_rgba(245,197,24,0.4)] group-hover:shadow-[0_0_24px_rgba(245,197,24,0.6)] transition-all">a</div>
          <span className="font-semibold text-white text-[15px] tracking-tight hidden sm:inline">alaolo.com</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {nav.map(n => (
            <Link key={n.label} href={n.href} className="px-3 py-1.5 text-[13.5px] text-slate-300 hover:text-white rounded-md transition-colors">{n.label}</Link>
          ))}
        </nav>

        <div className="flex-1" />

        <form onSubmit={submitSearch} className="hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('searchPlaceholder')} className="w-56 lg:w-64 pl-8 pr-3 py-1.5 text-sm rounded-md bg-white/[0.04] border border-white/10 text-white placeholder-slate-500 focus:border-[#F5C518]/40 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/30" />
          </div>
          <button type="submit" className="px-3 py-1.5 rounded-md bg-[#F5C518] hover:bg-[#e6b800] text-black text-sm font-medium">{t('searchBtn')}</button>
        </form>

        <Link href={`/${locale}/favorites`} className="hidden md:inline-flex text-slate-400 hover:text-[#F5C518] p-1.5" aria-label="favorites"><Star className="w-4 h-4" /></Link>

        <Link href={`/${locale}/submit`} className="hidden lg:inline-flex text-[13.5px] text-slate-300 hover:text-white px-2 py-1">{t('submit')}</Link>

        <div className="hidden md:flex items-center text-[13px] text-slate-400">
          {locales.map((l, i) => (
            <span key={l} className="flex items-center">
              {i > 0 && <span className="mx-1 text-slate-600">/</span>}
              <button onClick={() => switchLocale(l)} className={`hover:text-white transition-colors ${l === locale ? 'text-[#F5C518]' : ''}`}>{localeNames[l]}</button>
            </span>
          ))}
        </div>

        <button onClick={() => setOpen(v => !v)} className="md:hidden text-slate-300 p-1">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#0A0D14] px-4 py-4 space-y-3">
          <form onSubmit={(e) => { submitSearch(e); setOpen(false) }} className="flex gap-2">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('searchPlaceholder')} className="flex-1 px-3 py-2 text-sm rounded-md bg-white/[0.04] border border-white/10 text-white placeholder-slate-500" />
            <button className="px-3 py-2 rounded-md bg-[#F5C518] text-black text-sm font-medium">{t('searchBtn')}</button>
          </form>
          <div className="flex flex-col gap-1">
            {nav.map(n => (
              <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="px-2 py-2 text-sm text-slate-300 hover:text-white">{n.label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400 pt-2 border-t border-white/10">
            {locales.map(l => (
              <button key={l} onClick={() => { switchLocale(l); setOpen(false) }} className={`px-2 py-1 rounded ${l === locale ? 'bg-[#F5C518] text-black font-medium' : 'text-slate-300'}`}>{localeNames[l]}</button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
