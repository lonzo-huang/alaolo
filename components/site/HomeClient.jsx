'use client'
import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, ArrowRight, ArrowUpRight, Star, Zap, BookOpen, FolderOpen, Sparkles, Github, Clock, Tag, Check } from 'lucide-react'
import { t as tt } from '@/lib/i18n/config'

const SUB_ACCENT = { AI: 'from-purple-500', Dev: 'from-blue-500', Productivity: 'from-cyan-500', Design: 'from-pink-500', Notes: 'from-violet-500', Quantum: 'from-emerald-500', Web: 'from-orange-500', DevOps: 'from-indigo-500', API: 'from-teal-500', SelfHosted: 'from-lime-500', Learning: 'from-amber-500', Community: 'from-rose-500', VPN: 'from-yellow-500', Cloud: 'from-red-500', Analytics: 'from-fuchsia-500', macOS: 'from-slate-500', Hosting: 'from-black', Network: 'from-orange-500' }

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
    { key: 'resources', label: '#' + tNav('resources') },
    { key: 'recommendations', label: '#' + tNav('recommendations') },
    { key: 'quantum', label: t('chipQuantum') },
  ]

  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 pattern-dots opacity-50 pointer-events-none" style={{ maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)', WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, black 20%, transparent 80%)' }} />
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-[#F5C518]/8 blur-[140px] rounded-full -z-0 pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[300px] bg-purple-500/8 blur-[130px] rounded-full pointer-events-none" />

        <div className="container mx-auto max-w-5xl px-4 pt-20 pb-14 relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11.5px] text-slate-400 mb-8 font-mono uppercase tracking-wider">
            <span className="w-1 h-1 rounded-full bg-[#F5C518] animate-pulse" />
            AI-crawled · Structured · Multi-lingual
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[62px] font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-500">{t('heroHead')}</span>
          </h1>
          <p className="mt-6 text-slate-400 text-[15px] md:text-base leading-relaxed max-w-2xl mx-auto">{t('heroSub')}</p>

          <form onSubmit={submitSearch} className="mt-9 relative max-w-xl mx-auto">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search anything..." className="w-full pl-11 pr-24 py-3 rounded-xl bg-[#121215] border border-white/[0.08] text-white placeholder-slate-500 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10 text-[14px]" />
            <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white text-[12.5px] font-medium">Search</button>
          </form>

          <div className="mt-5 flex flex-wrap justify-center gap-1.5">
            {chips.map(c => (
              <Link key={c.key} href={c.key === 'all' ? `/${locale}` : `/${locale}?cat=${c.key}`} className={`px-3 py-1 rounded-full text-[12.5px] border transition-all ${chip === c.key ? 'bg-white text-black border-white font-medium' : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:text-white hover:border-white/20'}`}>{c.label}</Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4">
        {(chip === 'all' && !params.get('q')) ? (
          <>
            {/* SECTION 1: TOOLS (Bento) */}
            <SectionHeader icon={<Zap className="w-3.5 h-3.5" />} label="01 // TOOLS" title={tNav('tools')} href={`/${locale}?cat=tools`} />
            <ToolsBento locale={locale} items={byCategory.tools || []} />

            {/* SECTION 2: KNOWLEDGE (Magazine) */}
            <SectionHeader icon={<BookOpen className="w-3.5 h-3.5" />} label="02 // KNOWLEDGE" title={tNav('knowledge')} href={`/${locale}?cat=knowledge`} />
            <KnowledgeMagazine locale={locale} items={byCategory.knowledge || []} />

            {/* SECTION 3: RESOURCES (Compact) */}
            <SectionHeader icon={<FolderOpen className="w-3.5 h-3.5" />} label="03 // RESOURCES" title={tNav('resources')} href={`/${locale}?cat=resources`} />
            <ResourcesCompact locale={locale} items={byCategory.resources || []} />

            {/* SECTION 4: RECOMMENDATIONS (Review cards) */}
            <SectionHeader icon={<Sparkles className="w-3.5 h-3.5" />} label="04 // RECOMMENDATIONS" title={tNav('recommendations')} href={`/${locale}?cat=recommendations`} />
            <RecommendationsReview locale={locale} items={byCategory.recommendations || []} />
          </>
        ) : (
          <section className="pt-12">
            <SectionHeader icon={<Search className="w-3.5 h-3.5" />} label={`${filtered.length} results`} title={params.get('q') ? `“${params.get('q')}”` : (chip === 'quantum' ? '#Quantum' : tNav(chip))} />
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
        <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white tracking-tight">{title}</h2>
      </div>
      {href && <Link href={href} className="text-[12.5px] text-slate-400 hover:text-white flex items-center gap-1">{t('viewAll')}</Link>}
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
  return (
    <Link href={`/${locale}/resource/${r.slug}`} className={`group relative rounded-xl border border-white/[0.06] bg-[#121215] hover:border-white/[0.14] hover:bg-[#14141A] transition-all overflow-hidden flex flex-col p-5 card-glow ${className} ${small ? 'min-h-[160px]' : ''}`}>
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-[0.18] bg-gradient-radial ${accent} to-transparent pointer-events-none`} style={{ background: `radial-gradient(circle, ${r.brand_color || '#F5C518'}55, transparent 70%)` }} />

      <div className="flex items-start justify-between gap-2 relative">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center overflow-hidden shrink-0">
            {r.logo_url && <img src={r.logo_url} alt="" className="w-5 h-5 object-contain" />}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-white text-[14px] tracking-tight truncate">{tt(r.name, locale)}</div>
            <div className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider">{r.subcategory}</div>
          </div>
        </div>
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-white transition-colors shrink-0" />
      </div>

      <div className={`mt-3 text-[13px] text-slate-400 leading-relaxed ${featured ? 'line-clamp-3' : 'line-clamp-2'}`}>{tt(r.slogan, locale)}</div>

      {featured && <div className="mt-2 text-[12px] text-slate-500 leading-relaxed line-clamp-3">{tt(r.description, locale)}</div>}

      <div className="mt-auto pt-3 flex items-center gap-2 flex-wrap">
        {r.price_type && <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${r.price_type === 'Free' ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' : r.price_type === 'Paid' ? 'text-orange-300 border-orange-500/30 bg-orange-500/10' : 'text-blue-300 border-blue-500/30 bg-blue-500/10'}`}>{r.price_type}</span>}
        {r.platforms?.list?.slice(0, 3).map(p => <span key={p} className="text-[10px] text-slate-500 font-mono">{p}</span>)}
        <div className="flex-1" />
        {r.rating > 0 && <span className="text-[10.5px] text-slate-400 flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-[#F5C518] text-[#F5C518]" />{r.rating}</span>}
      </div>
    </Link>
  )
}

// ============= 2. KNOWLEDGE · MAGAZINE =============
function KnowledgeMagazine({ locale, items }) {
  const t = useTranslations('home')
  if (!items?.length) return <Empty />
  const [feat, ...rest] = items
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {feat && (
        <Link href={`/${locale}/resource/${feat.slug}`} className="lg:col-span-3 group relative rounded-2xl border border-white/[0.06] bg-[#121215] overflow-hidden hover:border-white/15 transition-all card-glow">
          <div className="aspect-[16/10] relative overflow-hidden">
            {feat.cover_image ? (
              <img src={feat.cover_image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/60 to-transparent" />
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur border border-white/10 text-[10.5px] font-mono uppercase tracking-widest text-[#F5C518]">Featured</div>
            {feat.difficulty && <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-black/50 backdrop-blur border border-white/10 text-[10.5px] font-mono text-slate-300">{feat.difficulty}</div>}
          </div>
          <div className="p-6">
            <div className="text-[10.5px] font-mono uppercase tracking-widest text-slate-500 mb-2">{feat.subcategory}{feat.read_time && ` · ${feat.read_time}`}</div>
            <h3 className="text-2xl font-bold text-white tracking-tight leading-snug">{tt(feat.name, locale)}</h3>
            <p className="mt-2 text-[14px] text-slate-400 leading-relaxed line-clamp-2">{tt(feat.slogan, locale)}</p>
            <div className="mt-4 inline-flex items-center gap-1 text-[13px] text-[#F5C518]">{t('readMore')}<ArrowRight className="w-3.5 h-3.5" /></div>
          </div>
        </Link>
      )}
      <div className="lg:col-span-2 flex flex-col gap-3">
        {rest.slice(0, 4).map(r => (
          <Link key={r.id} href={`/${locale}/resource/${r.slug}`} className="group relative flex gap-4 rounded-xl border border-white/[0.06] bg-[#121215] hover:border-white/15 hover:bg-[#141419] p-4 transition-all">
            <div className="w-16 h-16 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              {r.logo_url && <img src={r.logo_url} alt="" className="w-9 h-9 object-contain" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">{r.subcategory}{r.read_time && ` · ${r.read_time}`}{r.difficulty && ` · ${r.difficulty}`}</div>
              <div className="text-[14.5px] font-semibold text-white tracking-tight leading-tight group-hover:text-white">{tt(r.name, locale)}</div>
              <div className="text-[12.5px] text-slate-400 line-clamp-2 mt-1">{tt(r.slogan, locale)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ============= 3. RESOURCES · COMPACT =============
function ResourcesCompact({ locale, items }) {
  if (!items?.length) return <Empty />
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map(r => (
        <Link key={r.id} href={`/${locale}/resource/${r.slug}`} className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#121215] hover:border-white/15 hover:bg-[#141419] p-4 transition-all">
          <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {r.logo_url && <img src={r.logo_url} alt="" className="w-6 h-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-[14px] font-semibold text-white tracking-tight truncate">{tt(r.name, locale)}</div>
              <ArrowUpRight className="w-3 h-3 text-slate-600 group-hover:text-white shrink-0" />
            </div>
            <div className="text-[12px] text-slate-500 truncate">{tt(r.slogan, locale)}</div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0 text-[10px] font-mono text-slate-500">
            {r.github_stars > 0 && <span className="flex items-center gap-1"><Github className="w-2.5 h-2.5" />{r.github_stars > 1000 ? `${Math.round(r.github_stars / 1000)}k` : r.github_stars}</span>}
            <span className="uppercase tracking-wider">{r.subcategory}</span>
          </div>
        </Link>
      ))}
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
        return (
          <div key={r.id} className="group relative rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#141419] to-[#0F0F13] p-6 hover:border-white/[0.16] transition-all overflow-hidden card-glow">
            <div className="absolute -top-24 -right-24 w-56 h-56 blur-3xl opacity-[0.15] pointer-events-none" style={{ background: `radial-gradient(circle, ${r.brand_color || '#F5C518'}, transparent 70%)` }} />

            <div className="flex items-start gap-3 relative">
              <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {r.logo_url && <img src={r.logo_url} alt="" className="w-7 h-7 object-contain" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white text-[16px] tracking-tight truncate">{tt(r.name, locale)}</h3>
                  {r.rating > 0 && (
                    <span className="flex items-center gap-0.5 text-[11px] text-slate-300 shrink-0">
                      {[1,2,3,4,5].map(n => <Star key={n} className={`w-3 h-3 ${n <= Math.round(r.rating) ? 'fill-[#F5C518] text-[#F5C518]' : 'text-slate-700'}`} />)}
                      <span className="ml-1 font-mono text-slate-500">{r.rating}</span>
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-slate-400 mt-0.5">{tt(r.slogan, locale)}</p>
              </div>
              {discountLabel && <span className="text-[10.5px] font-mono px-2 py-1 rounded-md bg-[#F5C518]/15 border border-[#F5C518]/40 text-[#F5C518] shrink-0">{discountLabel}</span>}
            </div>

            {r.recommendation_reason && (
              <div className="mt-4 p-3.5 rounded-lg border-l-2 border-[#F5C518] bg-white/[0.02]">
                <div className="text-[10.5px] font-mono uppercase tracking-widest text-[#F5C518] mb-1.5">{t('whyRecommend')}</div>
                <div className="text-[13.5px] text-slate-200 leading-relaxed">{tt(r.recommendation_reason, locale)}</div>
              </div>
            )}

            <p className="mt-3 text-[13px] text-slate-400 leading-relaxed line-clamp-2">{tt(r.description, locale)}</p>

            <div className="mt-4 flex items-center gap-2">
              <a href={r.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F5C518] hover:bg-[#e6b800] text-black text-[12.5px] font-medium">
                Get deal<ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <Link href={`/${locale}/resource/${r.slug}`} className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-slate-200 hover:bg-white/[0.08] text-[12.5px]">Full review</Link>
              <div className="flex-1" />
              <span className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider">{r.subcategory}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Empty() { return <div className="text-center py-16 text-slate-600 text-sm border border-dashed border-white/[0.06] rounded-xl">—</div> }
