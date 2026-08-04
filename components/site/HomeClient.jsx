'use client'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Sparkles, BookOpen, Zap, FileCode } from 'lucide-react'
import { ResourceCard } from './ResourceCard'
import { t as tt } from '@/lib/i18n/config'

export function HomeClient({ locale, resources, trending, latest, picks, hotAI }) {
  const t = useTranslations('home')
  const tNav = useTranslations('nav')
  const searchParams = useSearchParams()
  const router = useRouter()
  const [q, setQ] = useState(searchParams.get('q') || '')
  const cat = searchParams.get('cat') || 'all'
  const query = (searchParams.get('q') || '').toLowerCase()

  const filtered = useMemo(() => {
    let arr = resources
    if (cat !== 'all') arr = arr.filter(r => r.categories?.slug === cat)
    if (query) arr = arr.filter(r => {
      const name = tt(r.name, locale).toLowerCase()
      const slogan = tt(r.slogan, locale).toLowerCase()
      const desc = tt(r.description, locale).toLowerCase()
      return name.includes(query) || slogan.includes(query) || desc.includes(query)
    })
    return arr
  }, [resources, cat, query, locale])

  const doSearch = (e) => {
    e.preventDefault()
    const url = new URL(window.location.href)
    if (q.trim()) url.searchParams.set('q', q.trim()); else url.searchParams.delete('q')
    router.push(url.pathname + url.search)
  }

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        {/* Grid pattern background */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 90%)',
        }} />
        <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-[#F5C518]/10 blur-[140px] rounded-full -z-0 pointer-events-none" />

        <div className="container mx-auto max-w-7xl px-4 pt-14 md:pt-20 pb-12 md:pb-16 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[12px] text-slate-300 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] animate-pulse" />
              {t('heroBadge')}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold tracking-tight leading-[1.15]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-teal-300">{t('heroKw1')}</span>
              <span className="text-white">{t('heroSep')}</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-fuchsia-400">{t('heroKw2')}</span>
              <span className="text-white">{t('heroSep')}</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F5C518] to-amber-400">{t('heroKw3')}</span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-lime-300">{t('heroTail')}</span>
            </h1>

            <p className="mt-5 text-slate-400 text-[15px] leading-[1.7] max-w-2xl">{t('heroDesc')}</p>

            <form onSubmit={doSearch} className="mt-8 flex items-center gap-2 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('heroSearchPh')} className="w-full pl-11 pr-4 py-3 rounded-lg bg-[#10141C] border border-white/10 text-white placeholder-slate-500 focus:border-[#F5C518]/40 focus:outline-none focus:ring-1 focus:ring-[#F5C518]/30 text-[14px]" />
              </div>
              <button type="submit" className="px-5 py-3 rounded-lg bg-[#F5C518] hover:bg-[#e6b800] text-black font-medium text-sm shadow-[0_0_20px_rgba(245,197,24,0.25)]">{tNav('searchBtn')}</button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { icon: <Sparkles className="w-3.5 h-3.5" />, label: t('quickBrowse'), href: `/${locale}?cat=dev` },
                { icon: <BookOpen className="w-3.5 h-3.5" />, label: t('quickTutorials'), href: `/${locale}?cat=learning` },
                { icon: <Zap className="w-3.5 h-3.5" />, label: t('quickAI'), href: `/${locale}?cat=ai` },
                { icon: <FileCode className="w-3.5 h-3.5" />, label: t('quickAPI'), href: `/${locale}?cat=network` },
              ].map(p => (
                <Link key={p.label} href={p.href} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] text-[12.5px] transition-colors">
                  {p.icon}{p.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="container mx-auto max-w-7xl px-4 pt-10">
        {(cat === 'all' && !query) ? (
          <>
            {/* Row 1: Updated + Trending */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TwoColSection label={t('labelUpdated')} title={t('secUpdated')} locale={locale} resources={latest} />
              <TwoColSection label={t('labelTrending')} title={t('secTrending')} locale={locale} resources={trending} />
            </div>
            {/* Row 2: Featured + Hot AI */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
              <TwoColSection label={t('labelFeatured')} title={t('secFeatured')} locale={locale} resources={picks} />
              <TwoColSection label={t('labelHotAI')} title={t('secHotAI')} locale={locale} resources={hotAI} />
            </div>
            {/* Row 3: All resources */}
            <FullSection label={t('labelResources')} title={t('secResources')} locale={locale} resources={resources} />
          </>
        ) : (
          <section>
            <SectionHeader label={t('labelResources')} title={query ? `“${query}” ${filtered.length}` : t('secResources')} />
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-slate-500 border border-dashed border-white/10 rounded-xl">{t('empty')}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(r => <ResourceCard key={r.id} resource={r} locale={locale} />)}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

function SectionHeader({ label, title, showViewAll = false, viewAllHref = '#', viewAllLabel = '' }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <div className="text-[11px] font-semibold tracking-[0.15em] text-[#F5C518] mb-1">{label}</div>
        <h2 className="text-xl md:text-[22px] font-bold text-white tracking-tight">{title}</h2>
      </div>
      {showViewAll && <Link href={viewAllHref} className="text-[12.5px] text-slate-400 hover:text-white">{viewAllLabel}</Link>}
    </div>
  )
}

function TwoColSection({ label, title, locale, resources }) {
  const t = useTranslations('home')
  return (
    <section>
      <SectionHeader label={label} title={title} showViewAll viewAllLabel={t('viewAll')} viewAllHref={`/${locale}`} />
      <div className="flex flex-col gap-3">
        {(resources || []).slice(0, 3).map(r => <ResourceCard key={r.id} resource={r} locale={locale} />)}
      </div>
    </section>
  )
}

function FullSection({ label, title, locale, resources }) {
  const t = useTranslations('home')
  return (
    <section className="mt-12">
      <SectionHeader label={label} title={title} showViewAll viewAllLabel={t('viewAll')} viewAllHref={`/${locale}`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map(r => <ResourceCard key={r.id} resource={r} locale={locale} />)}
      </div>
    </section>
  )
}
