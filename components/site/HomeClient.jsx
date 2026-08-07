'use client'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, ArrowRight, ArrowUpRight, Star, Zap, BookOpen, Sparkles, Clock, Tag, Check } from 'lucide-react'
import { t as tt } from '@/lib/i18n/config'
import { useSpotlight, SPOTLIGHT_CLASS } from '@/lib/hooks/useSpotlight'

const SUB_ACCENT = { AI: 'from-purple-500', Dev: 'from-blue-500', Productivity: 'from-cyan-500', Design: 'from-pink-500', Notes: 'from-violet-500', Quantum: 'from-emerald-500', Web: 'from-orange-500', DevOps: 'from-indigo-500', API: 'from-teal-500', SelfHosted: 'from-lime-500', Learning: 'from-amber-500', Community: 'from-rose-500', VPN: 'from-yellow-500', Cloud: 'from-red-500', Analytics: 'from-fuchsia-500', macOS: 'from-slate-500', Hosting: 'from-black', Network: 'from-orange-500', chat: 'from-violet-500', coding: 'from-blue-500', image: 'from-pink-500', video: 'from-red-500', audio: 'from-amber-500', knowledge: 'from-teal-500', search: 'from-cyan-500', agent: 'from-indigo-500', data: 'from-emerald-500', '3d': 'from-fuchsia-500', office: 'from-slate-500', legal: 'from-stone-500', medical: 'from-rose-500', quant: 'from-green-500', devops: 'from-orange-500', career: 'from-yellow-500' }

export function HomeClient({ locale, byCategory, all }) {
  const t = useTranslations('home')
  const tNav = useTranslations('nav')
  const params = useSearchParams()
  const router = useRouter()
  const [q, setQ] = useState(params.get('q') || '')
  const chip = params.get('cat') || 'all'

  const filtered = useMemo(() => {
    const query = (params.get('q') || '').toLowerCase()
    let a = chip === 'all' ? all : (byCategory[chip] || [])
    if (chip === 'quantum') a = all.filter(r => r.subcategory === 'Quantum')
    if (query) a = a.filter(r => tt(r.name, locale).toLowerCase().includes(query) || tt(r.slogan, locale).toLowerCase().includes(query) || tt(r.description, locale).toLowerCase().includes(query))
    return a
  }, [chip, all, byCategory, params, locale])

  const submitSearch = (e) => {
    e.preventDefault()
    const u = new URL(window.location.href)
    if (q.trim()) u.searchParams.set('q', q.trim()); else u.searchParams.delete('q')
    router.push(u.pathname + u.search)
  }

  const chips = [
    { key: 'all', label: t('chipAll') },
    { key: 'tools', label: '#' + tNav('tools') },
    { key: 'knowledge', label: '#' + tNav('knowledge') },
    { key: 'recommendations', label: '#' + tNav('recommendations') },
    { key: 'quantum', label: t('chipQuantum') },
  ]

  const heroParallax = (e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--px', `${px * 40}px`)
    el.style.setProperty('--py', `${py * 40}px`)
  }
  const resetHeroParallax = (e) => {
    e.currentTarget.style.setProperty('--px', '0px')
    e.currentTarget.style.setProperty('--py', '0px')
  }

  return (
    <div className="pb-24">
      {/* Hero */}
      <section onMouseMove={heroParallax} onMouseLeave={resetHeroParallax} className="relative overflow-hidden border-b border-app">
        <div className="absolute inset-0 pattern-dots opacity-50 pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)' }} />
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-[#F5C518]/8 blur-[140px] rounded-full -z-0 pointer-events-none transition-transform duration-300 ease-out" style={{ transform: 'translate(calc(var(--px, 0px) * 1), calc(var(--py, 0px) * 1))' }} />
        <div className="absolute top-20 right-1/4 w-[500px] h-[300px] bg-purple-500/8 blur-[130px] rounded-full pointer-events-none transition-transform duration-300 ease-out" style={{ transform: 'translate(calc(var(--px, 0px) * -1.4), calc(var(--py, 0px) * -1.4))' }} />

        <div className="container mx-auto max-w-5xl px-4 pt-20 pb-14 relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-app text-[11.5px] text-secondary mb-8 font-mono uppercase tracking-wider">
            <span className="w-1 h-1 rounded-full bg-[#F5C518] animate-pulse" />
            {t('heroBadge')}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[58px] font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto text-primary">
            ✨ {t('heroHead')}
          </h1>
          <p className="mt-6 text-secondary text-[15px] md:text-base leading-relaxed max-w-2xl mx-auto">{t('heroSub')}</p>

          <form onSubmit={submitSearch} className="mt-9 relative max-w-2xl mx-auto">
            <Search className="w-4 h-4 text-tertiary absolute left-4 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('heroSearchLong')} className="w-full pl-11 pr-32 py-3.5 rounded-xl bg-surface border border-app-strong text-primary placeholder-tertiary focus:border-[#F5C518]/40 focus:outline-none focus:ring-2 focus:ring-[#F5C518]/20 text-[14px]" />
            <kbd className="absolute right-24 top-1/2 -translate-y-1/2 font-mono text-[10.5px] text-tertiary bg-surface-hover border border-app rounded px-1.5 py-0.5">⌘K</kbd>
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-[#F5C518] hover:bg-[#e6b800] text-black text-[12.5px] font-semibold">{tNav('searchBtn')}</button>
          </form>

          <div className="mt-5 flex flex-wrap justify-center items-center gap-2 text-[12px] text-tertiary">
            <span className="text-tertiary font-medium">🔥</span>
            {['DeepSeek', 'Qiskit', 'Cursor', 'Self-Hosted', 'AWS Braket'].map(kw => (
              <Link key={kw} href={`/${locale}?q=${encodeURIComponent(kw)}`} className="px-2.5 py-1 rounded-full bg-surface border border-app text-secondary hover:text-primary hover:border-app-strong transition-all">{kw}</Link>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {chips.map(c => (
              <Link key={c.key} href={c.key === 'all' ? `/${locale}` : `/${locale}?cat=${c.key}`} className={`px-3 py-1 rounded-full text-[12.5px] border transition-all ${chip === c.key ? 'bg-[#F5C518] text-black border-[#F5C518] font-medium' : 'bg-surface text-secondary border-app hover:text-primary hover:border-app-strong'}`}>{c.label}</Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4">
        {(chip === 'all' && !params.get('q')) ? (
          <>
            {/* SECTION 1: TOOLS (Bento) */}
            <SectionHeader icon={<Zap className="w-3.5 h-3.5" />} label={t('secToolsLabel')} title={tNav('tools')} href={`/${locale}?cat=tools`} />
            <ToolsBento locale={locale} items={byCategory.tools || []} />

            {/* SECTION 2: KNOWLEDGE (Magazine) */}
            <SectionHeader icon={<BookOpen className="w-3.5 h-3.5" />} label={t('secKnowledgeLabel')} title={tNav('knowledge')} href={`/${locale}?cat=knowledge`} />
            <KnowledgeMagazine locale={locale} items={byCategory.knowledge || []} />

            {/* SECTION 4: RECOMMENDATIONS (Review cards) */}
            <SectionHeader icon={<Sparkles className="w-3.5 h-3.5" />} label={t('secRecommendationsLabel')} title={tNav('recommendations')} href={`/${locale}?cat=recommendations`} />
            <RecommendationsReview locale={locale} items={byCategory.recommendations || []} />
          </>
        ) : (
          <section className="pt-12">
            <SectionHeader icon={<Search className="w-3.5 h-3.5" />} label={t('resultsCount', { count: filtered.length })} title={params.get('q') ? `“${params.get('q')}”` : (chip === 'quantum' ? '#Quantum' : tNav(chip))} />
            <ToolsBento locale={locale} items={filtered} />
          </section>
        )}
      </div>
    </div>
  )
}

function SectionHeader({ icon, label, title, href }) {
  const t = useTranslations('home')
  return (
    <div className="flex items-end justify-between pt-16 pb-6">
      <div>
        <div className="inline-flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-[0.2em] text-[#F5C518]">{icon}{label}</div>
        <h2 className="mt-2 text-2xl md:text-3xl font-bold text-primary tracking-tight">{title}</h2>
      </div>
      {href && <Link href={href} className="text-[12.5px] text-secondary hover:text-primary flex items-center gap-1">{t('viewAll')}</Link>}
    </div>
  )
}

// ============= 1. TOOLS · BENTO GRID =============
function ToolsBento({ locale, items }) {
  if (!items?.length) return <Empty />
  // First 5 in bento arrangement: [big, sm, sm, sm, sm]
  const [a, b, c, d, e, ...rest] = items
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 auto-rows-[180px]">
        {a && <BentoCard locale={locale} r={a} className="md:col-span-2 md:row-span-2" featured />}
        {b && <BentoCard locale={locale} r={b} className="md:col-span-2" />}
        {c && <BentoCard locale={locale} r={c} />}
        {d && <BentoCard locale={locale} r={d} />}
        {e && <BentoCard locale={locale} r={e} className="md:col-span-2" />}
      </div>
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {rest.map(r => <BentoCard locale={locale} r={r} key={r.id} small />)}
        </div>
      )}
    </>
  )
}

function BentoCard({ r, locale, className = '', featured, small }) {
  const t = useTranslations('home')
  const accent = SUB_ACCENT[r.subcategory] || 'from-slate-500'
  const spotlight = useSpotlight()
  return (
    <Link ref={spotlight.ref} onMouseMove={spotlight.onMouseMove} onMouseLeave={spotlight.onMouseLeave} href={`/${locale}/resource/${r.slug}`} className={`group relative rounded-xl border border-app bg-surface hover:border-app-strong hover:bg-surface-hover transition-all overflow-hidden flex flex-col p-5 ${SPOTLIGHT_CLASS} ${className} ${small ? 'min-h-[160px]' : ''}`}>
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-[0.18] bg-gradient-radial ${accent} to-transparent pointer-events-none`} style={{ background: `radial-gradient(circle, ${r.brand_color || '#F5C518'}55, transparent 70%)` }} />

      <div className="flex items-start justify-between gap-2 relative z-[2]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-surface-hover border border-app flex items-center justify-center overflow-hidden shrink-0">
            {r.logo_url && <img src={r.logo_url} alt="" className="w-5 h-5 object-contain" />}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-primary text-[14px] tracking-tight truncate">{tt(r.name, locale)}</div>
            <div className="text-[10.5px] font-mono text-tertiary uppercase tracking-wider">{r.subcategory}</div>
          </div>
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-tertiary group-hover:text-primary transition-colors shrink-0" />
      </div>

      <div className={`mt-3 text-[13px] text-secondary leading-relaxed ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>{tt(r.slogan, locale)}</div>

      {featured && <div className="mt-2 text-[12px] text-tertiary leading-relaxed line-clamp-3">{tt(r.description, locale)}</div>}

      <div className="mt-auto pt-3 flex items-center gap-2 flex-wrap">
        {r.price_type && <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${r.price_type === 'Free' ? 'text-emerald-600 dark:text-emerald-300 border-emerald-500/30 bg-emerald-500/10' : r.price_type === 'Paid' ? 'text-orange-600 dark:text-orange-300 border-orange-500/30 bg-orange-500/10' : 'text-blue-600 dark:text-blue-300 border-blue-500/30 bg-blue-500/10'}`}>{r.price_type}</span>}
        {r.platforms?.list?.slice(0, 3).map(p => <span key={p} className="text-[10px] text-tertiary font-mono">{p}</span>)}
        <div className="flex-1" />
        {r.rating > 0 && <span className="text-[10.5px] text-secondary flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-[#F5C518] text-[#F5C518]" />{r.rating}</span>}
      </div>
    </Link>
  )
}

// ============= 2. KNOWLEDGE · MAGAZINE =============
function KnowledgeMagazine({ locale, items }) {
  const t = useTranslations('home')
  const spotlight = useSpotlight()
  if (!items?.length) return <Empty />
  const [feat, ...rest] = items
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {feat && (
        <Link ref={spotlight.ref} onMouseMove={spotlight.onMouseMove} onMouseLeave={spotlight.onMouseLeave} href={`/${locale}/resource/${feat.slug}`} className={`lg:col-span-3 group relative rounded-2xl border border-app bg-surface overflow-hidden hover:border-app-strong transition-all ${SPOTLIGHT_CLASS}`}>
          <div className="aspect-[16/10] relative overflow-hidden z-[2]">
            {feat.cover_image ? (
              <img src={feat.cover_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur border border-white/10 text-[10.5px] font-mono uppercase tracking-widest text-[#F5C518]">{t('featured')}</div>
            {feat.difficulty && <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-black/50 backdrop-blur border border-white/10 text-[10.5px] font-mono text-white">{feat.difficulty}</div>}
          </div>
          <div className="p-6">
            <div className="text-[10.5px] font-mono uppercase tracking-widest text-tertiary mb-2">{feat.subcategory}{feat.read_time && ` · ${feat.read_time}`}</div>
            <h3 className="text-2xl font-bold text-primary tracking-tight leading-snug">{tt(feat.name, locale)}</h3>
            <p className="mt-2 text-[14px] text-secondary leading-relaxed line-clamp-2">{tt(feat.slogan, locale)}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-[13px] text-[#F5C518]">{t('readMore')}<ArrowRight className="w-3.5 h-3.5" /></div>
          </div>
        </Link>
      )}
      <div className="lg:col-span-2 flex flex-col gap-3">
        {rest.slice(0, 4).map(r => (
          <Link key={r.id} href={`/${locale}/resource/${r.slug}`} className="group relative flex gap-4 rounded-xl border border-app bg-surface hover:border-app-strong hover:bg-surface-hover p-4 transition-all">
            <div className="w-16 h-16 rounded-lg bg-surface-hover border border-app flex items-center justify-center overflow-hidden shrink-0">
              {r.logo_url && <img src={r.logo_url} alt="" className="w-9 h-9 object-contain" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-widest text-tertiary mb-1">{r.subcategory}{r.read_time && ` · ${r.read_time}`}{r.difficulty && ` · ${r.difficulty}`}</div>
              <div className="text-[14.5px] font-semibold text-primary tracking-tight leading-tight group-hover:text-primary">{tt(r.name, locale)}</div>
              <div className="text-[12.5px] text-secondary line-clamp-2 mt-1">{tt(r.slogan, locale)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


// ============= 4. RECOMMENDATIONS · REVIEW CARDS =============
function RecommendationsReview({ locale, items }) {
  const t = useTranslations('home')
  if (!items?.length) return <Empty />
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map(r => {
        let discount = null
        try { discount = r.discount ? JSON.parse(r.discount) : null } catch {}
        const discountLabel = discount ? tt(discount, locale) : null
        return <RecommendationCard key={r.id} r={r} locale={locale} t={t} discountLabel={discountLabel} />
      })}
    </div>
  )
}

function RecommendationCard({ r, locale, t, discountLabel }) {
  const spotlight = useSpotlight()
  return (
    <div ref={spotlight.ref} onMouseMove={spotlight.onMouseMove} onMouseLeave={spotlight.onMouseLeave} className={`group relative rounded-2xl border border-app bg-surface p-6 hover:border-app-strong transition-all overflow-hidden ${SPOTLIGHT_CLASS}`}>
            <div className="absolute -top-24 -right-24 w-56 h-56 blur-3xl opacity-[0.15] pointer-events-none" style={{ background: `radial-gradient(circle, ${r.brand_color || '#F5C518'}, transparent 70%)` }} />

            <div className="flex items-start gap-3 relative z-[2]">
              <div className="w-11 h-11 rounded-xl bg-surface-hover border border-app flex items-center justify-center overflow-hidden shrink-0">
                {r.logo_url && <img src={r.logo_url} alt="" className="w-7 h-7 object-contain" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-primary text-[16px] tracking-tight truncate">{tt(r.name, locale)}</h3>
                  {r.rating > 0 && (
                    <span className="flex items-center gap-0.5 text-[11px] text-secondary shrink-0">
                      {[1,2,3,4,5].map(n => <Star key={n} className={`w-3 h-3 ${n <= Math.round(r.rating) ? 'fill-[#F5C518] text-[#F5C518]' : 'text-tertiary'}`} />)}
                      <span className="ml-1 font-mono text-tertiary">{r.rating}</span>
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-secondary mt-0.5">{tt(r.slogan, locale)}</p>
              </div>
              {discountLabel && <span className="text-[10.5px] font-mono px-2 py-1 rounded-md bg-[#F5C518]/15 border border-[#F5C518]/40 text-[#F5C518] shrink-0">{discountLabel}</span>}
            </div>

            {r.recommendation_reason && (
              <div className="mt-4 p-3.5 rounded-lg border-l-2 border-[#F5C518] bg-surface-hover relative z-[2]">
                <div className="text-[10.5px] font-mono uppercase tracking-widest text-[#F5C518] mb-1.5">{t('whyRecommend')}</div>
                <div className="text-[13.5px] text-primary leading-relaxed">{tt(r.recommendation_reason, locale)}</div>
              </div>
            )}

            <p className="mt-3 text-[13px] text-secondary leading-relaxed line-clamp-2 relative z-[2]">{tt(r.description, locale)}</p>

            <div className="mt-4 flex items-center gap-2 relative z-[2]">
              <a href={r.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F5C518] hover:bg-[#e6b800] text-black text-[12.5px] font-medium">
                {t('getDeal')}<ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <Link href={`/${locale}/resource/${r.slug}`} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-surface-hover border border-app text-primary hover:bg-surface text-[12.5px]">{t('fullReview')}</Link>
              <div className="flex-1" />
              <span className="text-[10.5px] font-mono text-tertiary uppercase tracking-wider">{r.subcategory}</span>
            </div>
    </div>
  )
}

function Empty() { return <div className="text-center py-16 text-tertiary text-sm border border-dashed border-app rounded-xl">—</div> }
