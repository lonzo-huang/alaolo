'use client'
import { useMemo, useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams, useRouter } from 'next/navigation'
import { ResourceCard } from './ResourceCard'
import { Flame, Sparkles, Star as StarIcon, Clock } from 'lucide-react'

const CATS = [
  { slug: 'all', key: 'filterAll' },
  { slug: 'dev', key: 'filterDev' },
  { slug: 'network', key: 'filterNetwork' },
  { slug: 'ai', key: 'filterAI' },
  { slug: 'learning', key: 'filterLearning' },
  { slug: 'productivity', key: 'filterProductivity' },
]
const SORTS = [
  { key: 'recommended', label: 'sortRecommended' },
  { key: 'latest', label: 'sortLatest' },
  { key: 'popular', label: 'sortPopular' },
]

export function HomeClient({ locale, resources, trending, latest, picks }) {
  const t = useTranslations('home')
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialCat = searchParams.get('cat') || 'all'
  const [cat, setCat] = useState(initialCat)
  const [sort, setSort] = useState('recommended')

  useEffect(() => {
    const c = searchParams.get('cat') || 'all'
    setCat(c)
  }, [searchParams])

  const filtered = useMemo(() => {
    let arr = resources
    if (cat !== 'all') arr = arr.filter(r => r.categories?.slug === cat)
    if (sort === 'latest') arr = [...arr].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    else if (sort === 'popular') arr = [...arr].sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
    else arr = [...arr].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.rating || 0) - (a.rating || 0))
    return arr
  }, [resources, cat, sort])

  const setCatUrl = (c) => {
    setCat(c)
    const url = new URL(window.location.href)
    if (c === 'all') url.searchParams.delete('cat'); else url.searchParams.set('cat', c)
    router.replace(url.pathname + url.search, { scroll: false })
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 pb-24">
      {/* Hero (compact) */}
      <section className="relative pt-10 pb-8 md:pt-14 md:pb-10">
        <div className="absolute inset-0 -z-10 opacity-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F5C518]/10 blur-[120px] rounded-full" />
        </div>
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5C518] animate-pulse" />
            {t('heroSubtitle')}
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
            {t('heroTitle')}
          </h1>
        </div>
      </section>

      {/* Filter + Sort */}
      <section className="sticky top-16 z-30 -mx-4 px-4 py-3 mb-6 bg-[#0B0E14]/85 backdrop-blur-md border-b border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-1.5">
            {CATS.map(c => (
              <button key={c.slug} onClick={() => setCatUrl(c.slug)} className={`px-3 py-1.5 text-sm rounded-full border transition-all ${cat === c.slug ? 'bg-[#F5C518] text-black border-[#F5C518] font-medium' : 'text-slate-300 border-white/10 hover:border-white/20 hover:text-white'}`}>{t(c.key)}</button>
            ))}
          </div>
          <div className="flex gap-1 rounded-lg bg-white/5 p-1 border border-white/10">
            {SORTS.map(s => (
              <button key={s.key} onClick={() => setSort(s.key)} className={`px-3 py-1 text-xs rounded-md ${sort === s.key ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}>{t(s.label)}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Trending / Editor picks / Latest sections (only when 'all') */}
      {cat === 'all' && (
        <>
          {trending.length > 0 && (
            <Section title={t('trending')} icon={<Flame className="w-4 h-4 text-orange-400" />} accent="from-orange-500/20">
              <Grid resources={trending} locale={locale} />
            </Section>
          )}
          {picks.length > 0 && (
            <Section title={t('editorsPick')} icon={<Sparkles className="w-4 h-4 text-[#F5C518]" />} accent="from-yellow-500/20">
              <Grid resources={picks} locale={locale} />
            </Section>
          )}
          {latest.length > 0 && (
            <Section title={t('latest')} icon={<Clock className="w-4 h-4 text-blue-400" />} accent="from-blue-500/20">
              <Grid resources={latest} locale={locale} />
            </Section>
          )}
        </>
      )}

      {/* Main grid */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><StarIcon className="w-4 h-4 text-[#F5C518]" />{cat === 'all' ? t('sortRecommended') : t(CATS.find(c => c.slug === cat)?.key || 'filterAll')}</h2>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500 border border-dashed border-white/10 rounded-xl">{t('empty')}</div>
        ) : (
          <Grid resources={filtered} locale={locale} />
        )}
      </section>
    </div>
  )
}

function Section({ title, icon, accent, children }) {
  return (
    <section className="mt-6 relative">
      <div className={`absolute -top-4 left-0 right-0 h-32 bg-gradient-to-b ${accent} to-transparent blur-2xl -z-10 opacity-30`} />
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">{icon}{title}</h2>
      {children}
    </section>
  )
}

function Grid({ resources, locale }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {resources.map(r => <ResourceCard key={r.id} resource={r} locale={locale} />)}
    </div>
  )
}
