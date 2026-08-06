'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Search, Menu, X, Globe, Check, Command } from 'lucide-react'
import { locales, localeNames, localeFlags } from '@/lib/i18n/config'
import { CommandPalette } from './CommandPalette'

export function Header({ locale }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const langRef = useRef(null)

  useEffect(() => {
    const h = (e) => { if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false) }
    const k = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen(true) } }
    document.addEventListener('mousedown', h)
    document.addEventListener('keydown', k)
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k) }
  }, [])

  const switchLocale = (nextLocale) => {
    const segments = pathname.split('/')
    segments[1] = nextLocale
    router.push(segments.join('/') + (typeof window !== 'undefined' ? window.location.search : ''))
    setLangOpen(false)
  }

  const nav = [
    { label: t('tools'), href: `/${locale}?cat=tools` },
    { label: t('knowledge'), href: `/${locale}?cat=knowledge` },
    { label: t('resources'), href: `/${locale}?cat=resources` },
    { label: t('recommendations'), href: `/${locale}?cat=recommendations` },
  ]

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 border-b border-white/[0.06] bg-[#09090B]/85 backdrop-blur-xl">
        <div className="container mx-auto max-w-7xl h-14 flex items-center gap-6 px-4">
          <Link href={`/${locale}`} className="flex items-center gap-2 group shrink-0">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#F5C518] to-orange-500 flex items-center justify-center font-black text-black text-sm">a</div>
            <span className="font-semibold text-white text-[15px] tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden sm:inline">alaolo</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {nav.map(n => (
              <Link key={n.label} href={n.href} className="px-3 py-1.5 text-[13px] text-slate-400 hover:text-white rounded-md hover:bg-white/[0.04] transition-colors">{n.label}</Link>
            ))}
          </nav>

          <div className="flex-1" />

          <button onClick={() => setCmdOpen(true)} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white hover:border-white/10 text-[13px] group min-w-[280px]">
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">{t('searchPlaceholder')}</span>
            <kbd className="font-mono text-[10.5px] text-slate-500 bg-white/[0.04] border border-white/[0.06] rounded px-1 py-0.5">⌘K</kbd>
          </button>

          <Link href={`/${locale}/submit`} className="hidden lg:inline-flex text-[13px] text-slate-400 hover:text-white px-2 py-1.5">{t('submit')}</Link>

          <div className="relative hidden md:block" ref={langRef}>
            <button onClick={() => setLangOpen(v => !v)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/[0.04] text-sm">
              <Globe className="w-4 h-4" />
              <span className="text-[12.5px] hidden xl:inline">{localeNames[locale]}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-white/10 bg-[#121215] shadow-2xl py-1 z-50">
                {locales.map(l => (
                  <button key={l} onClick={() => switchLocale(l)} className={`w-full flex items-center justify-between px-3 py-1.5 text-[13px] hover:bg-white/5 ${l === locale ? 'text-[#F5C518]' : 'text-slate-200'}`}>
                    <span className="flex items-center gap-2"><span>{localeFlags[l]}</span>{localeNames[l]}</span>
                    {l === locale && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setOpen(v => !v)} className="md:hidden text-slate-300 p-1">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#09090B] px-4 py-4 space-y-3">
            <button onClick={() => { setCmdOpen(true); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-white/[0.03] border border-white/10 text-slate-400 text-sm">
              <Search className="w-3.5 h-3.5" />{t('searchPlaceholder')}
            </button>
            <div className="flex flex-col gap-1">
              {nav.map(n => (
                <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="px-2 py-2 text-sm text-slate-300 hover:text-white">{n.label}</Link>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1 pt-2 border-t border-white/10">
              {locales.map(l => (
                <button key={l} onClick={() => { switchLocale(l); setOpen(false) }} className={`px-2 py-1.5 rounded text-[13px] text-left ${l === locale ? 'bg-[#F5C518] text-black font-medium' : 'text-slate-300 hover:bg-white/5'}`}>{localeFlags[l]} {localeNames[l]}</button>
              ))}
            </div>
          </div>
        )}
      </header>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} locale={locale} />
    </>
  )
}
