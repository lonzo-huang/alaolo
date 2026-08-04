'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Globe, Menu, X, Star } from 'lucide-react'
import { locales, localeNames } from '@/lib/i18n/config'
import { createSupabaseBrowser } from '@/lib/supabase/client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function Header({ locale }) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const sb = createSupabaseBrowser()
    sb.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => setUser(session?.user || null))
    return () => sub.subscription.unsubscribe()
  }, [])

  const switchLocale = (nextLocale) => {
    const segments = pathname.split('/')
    segments[1] = nextLocale
    router.push(segments.join('/'))
  }

  const signOut = async () => {
    const sb = createSupabaseBrowser()
    await sb.auth.signOut()
    router.refresh()
  }

  const nav = [
    { label: t('resources'), href: `/${locale}?cat=all` },
    { label: t('ai'), href: `/${locale}?cat=ai` },
    { label: t('tutorials'), href: `/${locale}?cat=learning` },
    { label: t('articles'), href: `/${locale}?cat=productivity` },
    { label: t('picks'), href: `/${locale}?cat=dev` },
  ]

  return (
    <header className="fixed top-0 inset-x-0 z-40 border-b border-white/[0.06] bg-[#0B0E14]/85 backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl h-16 flex items-center gap-6 px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 group shrink-0">
          <div className="relative">
            <div className="w-8 h-8 rounded-md bg-[#F5C518] flex items-center justify-center font-black text-black text-lg shadow-[0_0_20px_rgba(245,197,24,0.35)] group-hover:shadow-[0_0_28px_rgba(245,197,24,0.55)] transition-all group-hover:-translate-y-[1px]">a</div>
          </div>
          <span className="font-semibold text-white tracking-tight text-lg hidden sm:inline">alaolo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-2">
          {nav.map(n => (
            <Link key={n.label} href={n.href} className="px-3 py-1.5 text-sm text-slate-300 hover:text-white rounded-md hover:bg-white/5 transition-colors">{n.label}</Link>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-white/5">
                <Globe className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#151A26] border-white/10">
              {locales.map(l => (
                <DropdownMenuItem key={l} onClick={() => switchLocale(l)} className={`text-slate-200 focus:bg-white/5 ${l === locale ? 'text-[#F5C518]' : ''}`}>{localeNames[l]}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-slate-200 hover:bg-white/5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#F5C518] to-orange-500 flex items-center justify-center text-black text-xs font-bold">{(user.email || 'U')[0].toUpperCase()}</div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#151A26] border-white/10">
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/favorites`} className="text-slate-200 focus:bg-white/5"><Star className="w-4 h-4 mr-2" />{t('favorites')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem onClick={signOut} className="text-slate-200 focus:bg-white/5">{t('logout')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="bg-[#F5C518] hover:bg-[#e6b800] text-black font-medium">
              <Link href={`/${locale}/login`}>{t('login')}</Link>
            </Button>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden text-slate-200" onClick={() => setOpen(v => !v)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0B0E14]">
          <div className="container mx-auto max-w-7xl px-4 py-3 flex flex-col gap-1">
            {nav.map(n => (
              <Link key={n.label} href={n.href} onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-slate-300 hover:text-white rounded-md hover:bg-white/5">{n.label}</Link>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-2">
              <div className="flex gap-1">
                {locales.map(l => (
                  <button key={l} onClick={() => { switchLocale(l); setOpen(false) }} className={`px-2 py-1 text-xs rounded ${l === locale ? 'bg-[#F5C518] text-black' : 'text-slate-300 hover:bg-white/5'}`}>{localeNames[l]}</button>
                ))}
              </div>
              {user ? (
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="ghost" className="text-slate-200"><Link href={`/${locale}/favorites`} onClick={() => setOpen(false)}><Star className="w-4 h-4" /></Link></Button>
                  <Button size="sm" variant="ghost" onClick={signOut} className="text-slate-200">{t('logout')}</Button>
                </div>
              ) : (
                <Button asChild size="sm" className="bg-[#F5C518] hover:bg-[#e6b800] text-black"><Link href={`/${locale}/login`} onClick={() => setOpen(false)}>{t('login')}</Link></Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
