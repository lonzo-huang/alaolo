import { getResourceBySlug, getRelated, getAdjacentResources } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { t as tt } from '@/lib/i18n/config'
import { getTranslations } from 'next-intl/server'
import { FavoriteButton } from '@/components/site/FavoriteButton'
import { ShareButtons } from '@/components/site/ShareButtons'
import { ScreenshotCarousel } from '@/components/site/ScreenshotCarousel'
import { ResourceCard } from '@/components/site/ResourceCard'
import * as Icons from 'lucide-react'
import { ArrowUpRight, Star, Eye, Calendar, Check, X as XIcon, ChevronLeft, ChevronRight } from 'lucide-react'

const CAT_HEX = { ai: '#a855f7', dev: '#3b82f6', network: '#10b981', learning: '#f97316', productivity: '#06b6d4' }

export async function generateMetadata({ params }) {
  const { locale, slug } = await params
  const resource = await getResourceBySlug(slug)
  if (!resource) return {}
  const name = tt(resource.name, locale)
  const slogan = tt(resource.slogan, locale)
  return {
    title: `${name} · ${slogan}`,
    description: tt(resource.description, locale)?.slice(0, 200),
    openGraph: {
      title: name,
      description: slogan,
      images: resource.cover_url || resource.logo_url ? [resource.cover_url || resource.logo_url] : [],
      url: `/${locale}/resource/${slug}`,
    },
    alternates: {
      canonical: `/${locale}/resource/${slug}`,
      languages: {
        zh: `/zh/resource/${slug}`,
        en: `/en/resource/${slug}`,
        ja: `/ja/resource/${slug}`,
        ko: `/ko/resource/${slug}`,
      },
    },
  }
}

export default async function ResourceDetailPage({ params }) {
  const { locale, slug } = await params
  const resource = await getResourceBySlug(slug)
  if (!resource) notFound()

  const t = await getTranslations({ locale, namespace: 'detail' })
  const cat = resource.categories
  const catSlug = cat?.slug || 'dev'
  const brandColor = resource.brand_color || CAT_HEX[catSlug] || '#F5C518'

  const [related, adj] = await Promise.all([
    getRelated(cat?.id, slug, 4),
    getAdjacentResources(slug, cat?.id),
  ])

  const updated = new Date(resource.updated_at).toLocaleDateString(locale)
  const created = new Date(resource.created_at).toLocaleDateString(locale)

  return (
    <div className="relative pb-32 md:pb-24">
      {/* Brand ambient glow */}
      <div className="absolute top-0 inset-x-0 h-[400px] -z-10 opacity-20 pointer-events-none" style={{ background: `radial-gradient(ellipse at top, ${brandColor}30 0%, transparent 60%)` }} />

      <div className="container mx-auto max-w-5xl px-4">
        {/* Back */}
        <div className="pt-6">
          <Link href={`/${locale}`} className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"><ChevronLeft className="w-4 h-4" />{tt({zh:'返回',en:'Back',ja:'戻る',ko:'뒤로'}, locale)}</Link>
        </div>

        {/* 1. Hero */}
        <section className="pt-8 pb-8 border-b border-white/[0.06]">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              {resource.logo_url ? (
                <img src={resource.logo_url} alt="" className="w-14 h-14 md:w-16 md:h-16 object-contain" />
              ) : (
                <span className="text-4xl font-bold text-white">{tt(resource.name, locale)[0]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                {cat && (
                  <span className="px-2 py-0.5 rounded border text-xs" style={{ color: brandColor, borderColor: `${brandColor}55`, background: `${brandColor}15` }}>{tt(cat.name, locale)}</span>
                )}
                {resource.editors_pick && <span className="px-2 py-0.5 rounded border border-[#F5C518]/40 bg-[#F5C518]/10 text-[#F5C518] text-xs">★ Editor's Pick</span>}
                {resource.trending && <span className="px-2 py-0.5 rounded border border-orange-500/40 bg-orange-500/10 text-orange-300 text-xs">🔥 Trending</span>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{tt(resource.name, locale)}</h1>
              <p className="mt-2 text-slate-400 text-base leading-relaxed max-w-2xl">{tt(resource.slogan, locale)}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <a href={resource.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F5C518] hover:bg-[#e6b800] text-black font-medium text-sm shadow-[0_0_20px_rgba(245,197,24,0.3)]">
                  {t('visitSite')}<ArrowUpRight className="w-4 h-4" />
                </a>
                <FavoriteButton resourceId={resource.id} locale={locale} />
                <ShareButtons url={`${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/resource/${resource.slug}`} />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Meta bar */}
        <section className="py-4 border-b border-white/[0.06]">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
            <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{t('updated')}: {updated}</span>
            <span className="inline-flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{t('added')}: {created}</span>
            <span className="inline-flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{t('views')}: {resource.view_count?.toLocaleString?.() || 0}</span>
            {resource.rating > 0 && <span className="inline-flex items-center gap-1.5"><Star className="w-3.5 h-3.5 fill-[#F5C518] text-[#F5C518]" />{t('rating')}: {resource.rating}</span>}
          </div>
        </section>

        {/* 3. Quick info grid */}
        {resource.info_grid?.length > 0 && (
          <section className="py-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">{t('quickInfo')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {resource.info_grid.map(g => {
                const Icon = Icons[g.icon] || Icons.Info
                return (
                  <div key={g.id} className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${brandColor}15`, color: brandColor }}><Icon className="w-4 h-4" /></div>
                    <div className="min-w-0">
                      <div className="text-xs text-slate-500">{tt(g.label, locale)}</div>
                      <div className="text-sm font-medium text-white truncate">{tt(g.value, locale)}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* 4. Screenshots */}
        {resource.screenshots?.length > 0 && (
          <section className="py-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">{t('screenshots')}</h2>
            <ScreenshotCarousel screenshots={resource.screenshots} locale={locale} />
          </section>
        )}

        {/* 5. Description + use cases + highlights */}
        <section className="py-8 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('description')}</h2>
            <p className="text-slate-300 leading-[1.8] whitespace-pre-line">{tt(resource.description, locale)}</p>
          </div>
          <div className="space-y-6">
            {resource.use_cases?.[locale]?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('useCases')}</h3>
                <ul className="space-y-2">
                  {resource.use_cases[locale].map((u, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300"><span className="w-1 h-1 rounded-full bg-[#F5C518] mt-2" />{u}</li>
                  ))}
                </ul>
              </div>
            )}
            {resource.highlights?.[locale]?.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">{t('highlights')}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {resource.highlights[locale].map((h, i) => (
                    <span key={i} className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-slate-300">{h}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 6. Pros / Cons */}
        {(resource.pros?.length > 0 || resource.cons?.length > 0) && (
          <section className="py-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">{t('prosCons')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05]">
                <h3 className="text-emerald-300 font-medium mb-3 flex items-center gap-2"><Check className="w-4 h-4" />{t('pros')}</h3>
                <ul className="space-y-2">
                  {resource.pros.map(p => (
                    <li key={p.id} className="flex items-start gap-2 text-sm text-slate-200"><Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />{tt(p.content, locale)}</li>
                  ))}
                </ul>
              </div>
              <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-500/[0.05]">
                <h3 className="text-rose-300 font-medium mb-3 flex items-center gap-2"><XIcon className="w-4 h-4" />{t('cons')}</h3>
                <ul className="space-y-2">
                  {resource.cons.map(c => (
                    <li key={c.id} className="flex items-start gap-2 text-sm text-slate-200"><XIcon className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />{tt(c.content, locale)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* 7. Pricing */}
        {resource.pricing_plans?.length > 0 && (
          <section className="py-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">{t('pricing')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {resource.pricing_plans.map(p => (
                <div key={p.id} className={`p-5 rounded-xl border ${p.highlighted ? 'border-[#F5C518]/40 bg-[#F5C518]/[0.05]' : 'border-white/10 bg-white/[0.03]'}`}>
                  <div className="text-sm text-slate-400 mb-1">{tt(p.name, locale)}</div>
                  <div className="text-2xl font-bold text-white">{p.price}<span className="text-sm text-slate-500 font-normal ml-1">{tt(p.price_period, locale)}</span></div>
                  <ul className="mt-4 space-y-1.5">
                    {(p.features || []).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-slate-300"><Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />{tt(f, locale)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. Alternatives */}
        {resource.alternatives_resources?.length > 0 && (
          <section className="py-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">{t('alternatives')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {resource.alternatives_resources.map(a => <ResourceCard key={a.id} resource={a} locale={locale} />)}
            </div>
          </section>
        )}

        {/* 9. Reviews (placeholder) */}
        <section className="py-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">{t('reviews')}</h2>
          <div className="p-8 rounded-xl border border-dashed border-white/10 text-center text-slate-500 text-sm">{t('reviewsPlaceholder')}</div>
        </section>

        {/* 10. Related + Pager */}
        {related?.length > 0 && (
          <section className="py-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">{t('related')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {related.map(r => <ResourceCard key={r.id} resource={r} locale={locale} />)}
            </div>
          </section>
        )}

        <section className="py-8 flex items-center justify-between border-t border-white/[0.06]">
          {adj.prev ? (
            <Link href={`/${locale}/resource/${adj.prev.slug}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white group">
              <ChevronLeft className="w-4 h-4" />
              <div>
                <div className="text-xs text-slate-500">{t('prev')}</div>
                <div className="font-medium">{tt(adj.prev.name, locale)}</div>
              </div>
            </Link>
          ) : <div />}
          {adj.next ? (
            <Link href={`/${locale}/resource/${adj.next.slug}`} className="flex items-center gap-2 text-sm text-slate-300 hover:text-white group text-right">
              <div>
                <div className="text-xs text-slate-500">{t('next')}</div>
                <div className="font-medium">{tt(adj.next.name, locale)}</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : <div />}
        </section>
      </div>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-[#0B0E14]/95 backdrop-blur border-t border-white/10 flex gap-2">
        <FavoriteButton resourceId={resource.id} locale={locale} />
        <a href={resource.website_url} target="_blank" rel="noopener noreferrer" className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#F5C518] hover:bg-[#e6b800] text-black font-medium text-sm">
          {t('visitSite')}<ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
