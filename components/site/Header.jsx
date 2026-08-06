'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Search, Menu, X, Globe, Check, Command } from 'lucide-react'
import { locales, localeNames, localeFlags } from '@/lib/i18n/config'
import { CommandPalette } from './CommandPalette'
import { ThemeToggle } from './ThemeToggle'
import { SubNav } from './SubNav'

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
    { label: t('home'), href: `/${locale}` },
    { label: t('tools'), href: `/${locale}/tools` },
    { label: t('knowledge'), href: `/${locale}?cat=knowledge` },
    { label: t('resources'), href: `/${locale}?cat=resources` },
    { label: t('recommendations'), href: `/${locale}?cat=recommendations` },
  ]

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 border-b border-app glass">
        <div className="container mx-auto max-w-7xl h-14 flex items-center gap-6 px-4">
          <Link href={`/${locale}`} className="flex items-center gap-2.5 group shrink-0">
            <Image src="/logo.png" alt="alaolo" width={96} height={28} className="w-auto h-6 sm:h-7 dark:brightness-110" priority />
          </Link>

          <SubNav locale={locale} />

          <div className="flex-1" />

          <button onClick={() => setCmdOpen(true)} className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-app hover:border-app-strong text-secondary hover:text-primary text-[13px] group min-w-[280px]">
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">{t('searchPlaceholder')}</span>
            <kbd className="font-mono text-[10.5px] text-tertiary bg-surface-hover border border-app rounded px-1 py-0.5">⌘K</kbd>
          </button>

          <Link href={`/${locale}/submit`} className="hidden lg:inline-flex text-[13px] text-secondary hover:text-primary px-2 py-1.5">{t('submit')}</Link>

          <ThemeToggle />

          <div className="relative hidden md:block" ref={langRef}>
            <button onClick={() => setLangOpen(v => !v)} className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface-hover text-sm">
              <Globe className="w-4 h-4" />
              <span className="text-[12.5px] hidden xl:inline">{localeNames[locale]}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 rounded-lg border border-app-strong bg-surface shadow-2xl py-1 z-50">
                {locales.map(l => (
                  <button key={l} onClick={() => switchLocale(l)} className={`w-full flex items-center justify-between px-3 py-1.5 text-[13px] hover:bg-surface-hover ${l === locale ? 'text-[#F5C518]' : 'text-primary'}`}>
                    <span className="flex items-center gap-2"><span>{localeFlags[l]}</span>{localeNames[l]}</span>
                    {l === locale && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => setOpen(v => !v)} className="md:hidden text-secondary p-1">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-app bg-app px-4 py-4 space-y-3">
            <button onClick={() => { setCmdOpen(true); setOpen(false) }} className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-surface border border-app text-secondary text-sm">
              <Search className="w-3.5 h-3.5" />{t('searchPlaceholder')}
            </button>
            <div className="flex flex-col gap-1">
              {nav.map(n => (
                <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="px-2 py-2 text-sm text-secondary hover:text-primary">{n.label}</Link>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-1 pt-2 border-t border-app">
              {locales.map(l => (
                <button key={l} onClick={() => { switchLocale(l); setOpen(false) }} className={`px-2 py-1.5 rounded text-[13px] text-left ${l === locale ? 'bg-[#F5C518] text-black font-medium' : 'text-secondary hover:bg-surface-hover'}`}>{localeFlags[l]} {localeNames[l]}</button>
              ))}
            </div>
          </div>
        )}
      </header>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} locale={locale} />
    </>
  )
}
