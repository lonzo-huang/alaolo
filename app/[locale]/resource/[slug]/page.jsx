import { getResourceBySlug, getRelated, getAdjacentResources } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { t as tt } from '@/lib/i18n/config'
import { getTranslations } from 'next-intl/server'
import { ScreenshotCarousel } from '@/components/site/ScreenshotCarousel'
import { ResourceCard } from '@/components/site/ResourceCard'
import * as Icons from 'lucide-react'
import { ArrowUpRight, Check, X as XIcon, ChevronRight, ChevronLeft } from 'lucide-react'

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
      images: resource.logo_url ? [resource.logo_url] : [],
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
  const catName = tt(cat?.name, locale)
  const brandColor = resource.brand_color || '#F5C518'

  const [related, adj] = await Promise.all([
    getRelated(cat?.id, slug, 3),
    getAdjacentResources(slug, cat?.id),
  ])

  // Build horizontal meta bar from info_grid (first 4-5)
  const metaItems = (resource.info_grid || []).slice(0, 5)

  return (
    <div className="relative pb-24">
      {/* Brand ambient glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] -z-10 opacity-25 pointer-events-none" style={{ background: `radial-gradient(ellipse at top right, ${brandColor}30 0%, transparent 60%)` }} />

      <div className="container mx-auto max-w-5xl px-4">
        {/* Breadcrumb */}
        <nav className="pt-6 text-[13px] text-slate-500 flex items-center gap-1.5">
          <Link href={`/${locale}`} className="hover:text-white">{t('breadcrumbHome')}</Link>
          <span>/</span>
          <Link href={`/${locale}?cat=${cat?.slug}`} className="hover:text-white">{t('breadcrumbList')}</Link>
          <span>/</span>
          <span className="text-slate-300">{tt(resource.name, locale)}</span>
        </nav>

        {/* Hero */}
        <section className="pt-8">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
              {resource.logo_url ? (
                <img src={resource.logo_url} alt="" className="w-11 h-11 object-contain" />
              ) : (
                <span className="text-3xl font-bold text-white">{tt(resource.name, locale)[0]}</span>
              )}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <div className="text-[11px] font-semibold tracking-[0.15em] text-[#F5C518] mb-1">{t('labelResources')}</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{tt(resource.name, locale)}</h1>
              <p className="mt-2 text-slate-400 text-[15px]">{tt(resource.slogan, locale)}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <a href={resource.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F5C518] hover:bg-[#e6b800] text-black font-medium text-sm shadow-[0_0_20px_rgba(245,197,24,0.25)]">
              {t('openResource')}<ArrowUpRight className="w-4 h-4" />
            </a>
            <Link href={`/${locale}?cat=learning`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/10 text-slate-200 hover:bg-white/[0.08] text-sm">
              {t('learningPath')}
            </Link>
          </div>
        </section>

        {/* Horizontal meta bar */}
        {metaItems.length > 0 && (
          <section className="mt-8">
            <div className="rounded-xl border border-white/[0.07] bg-[#10141C] px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {metaItems.map(g => (
                  <div key={g.id}>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider">{tt(g.label, locale)}</div>
                    <div className="text-sm text-white mt-1 font-medium">{tt(g.value, locale)}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Description */}
        <section className="mt-10">
          <div className="text-slate-300 text-[15px] leading-[1.85] space-y-4">
            {tt(resource.description, locale).split('\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        {/* Use cases */}
        {resource.use_cases?.[locale]?.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-white mb-4">{t('useCases')}</h2>
            <ul className="space-y-2.5">
              {resource.use_cases[locale].map((u, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[14.5px] text-slate-300">
                  <span className="text-slate-500 mt-0.5">—</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Screenshots */}
        <section className="mt-12">
          <h2 className="text-lg font-bold text-white mb-4">{t('screenshots')}</h2>
          {resource.screenshots?.length > 0 ? (
            <ScreenshotCarousel screenshots={resource.screenshots} locale={locale} />
          ) : (
            <div className="aspect-[16/7] rounded-xl border border-white/10 bg-[#0D1119] flex items-center justify-center text-slate-500 text-sm" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
              {t('screenshotPlaceholder')}
            </div>
          )}
          {resource.screenshots?.[0]?.caption && (
            <p className="mt-3 text-xs text-slate-500">{tt(resource.screenshots[0].caption, locale)}</p>
          )}
        </section>

        {/* Highlights */}
        {resource.highlights?.[locale]?.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-white mb-4">{t('highlights')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resource.highlights[locale].map((h, i) => (
                <div key={i} className="p-4 rounded-lg border border-white/[0.07] bg-white/[0.02] text-sm text-slate-300 flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#F5C518] mt-2.5 shrink-0" />
                  {h}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pros / Cons */}
        {(resource.pros?.length > 0 || resource.cons?.length > 0) && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-white mb-4">{t('prosCons')}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04]">
                <h3 className="text-emerald-300 font-medium mb-3 flex items-center gap-2 text-sm"><Check className="w-4 h-4" />{t('pros')}</h3>
                <ul className="space-y-2">
                  {resource.pros.map(p => (
                    <li key={p.id} className="flex items-start gap-2 text-[14px] text-slate-200"><Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />{tt(p.content, locale)}</li>
                  ))}
                </ul>
              </div>
              <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-500/[0.04]">
                <h3 className="text-rose-300 font-medium mb-3 flex items-center gap-2 text-sm"><XIcon className="w-4 h-4" />{t('cons')}</h3>
                <ul className="space-y-2">
                  {resource.cons.map(c => (
                    <li key={c.id} className="flex items-start gap-2 text-[14px] text-slate-200"><XIcon className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />{tt(c.content, locale)}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* Pricing */}
        {resource.pricing_plans?.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-white mb-4">{t('pricing')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {resource.pricing_plans.map(p => (
                <div key={p.id} className={`p-5 rounded-xl border ${p.highlighted ? 'border-[#F5C518]/40 bg-[#F5C518]/[0.04]' : 'border-white/[0.08] bg-white/[0.02]'}`}>
                  <div className="text-sm text-slate-400 mb-1">{tt(p.name, locale)}</div>
                  <div className="text-2xl font-bold text-white">{p.price}<span className="text-xs text-slate-500 font-normal ml-1">{tt(p.price_period, locale)}</span></div>
                  <ul className="mt-4 space-y-1.5">
                    {(p.features || []).map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[12.5px] text-slate-300"><Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />{tt(f, locale)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related?.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold text-white mb-4">{t('related')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {related.map(r => <ResourceCard key={r.id} resource={r} locale={locale} />)}
            </div>
          </section>
        )}

        {/* Pager */}
        <section className="mt-12 pt-8 flex items-center justify-between border-t border-white/[0.06]">
          {adj.prev ? (
            <Link href={`/${locale}/resource/${adj.prev.slug}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
              <ChevronLeft className="w-4 h-4" />
              <div>
                <div className="text-xs text-slate-500">{t('prev')}</div>
                <div className="text-slate-200 font-medium">{tt(adj.prev.name, locale)}</div>
              </div>
            </Link>
          ) : <div />}
          {adj.next ? (
            <Link href={`/${locale}/resource/${adj.next.slug}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white text-right">
              <div>
                <div className="text-xs text-slate-500">{t('next')}</div>
                <div className="text-slate-200 font-medium">{tt(adj.next.name, locale)}</div>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : <div />}
        </section>
      </div>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-[#0A0D14]/95 backdrop-blur border-t border-white/10">
        <a href={resource.website_url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#F5C518] hover:bg-[#e6b800] text-black font-medium text-sm">
          {t('openResource')}<ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  )
}
