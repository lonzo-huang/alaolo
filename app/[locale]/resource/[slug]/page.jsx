import { getResourceBySlug, getRelated, getAdjacentResources } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { t as tt } from '@/lib/i18n/config'
import { getTranslations } from 'next-intl/server'
import { ScreenshotCarousel } from '@/components/site/ScreenshotCarousel'
import { ShareModal } from '@/components/site/ShareModal'
import { Comments } from '@/components/site/Comments'
import { ArrowUpRight, Check, X as XIcon, ChevronRight, ChevronLeft, Star, Calendar, Globe, Monitor, DollarSign, Zap, AlertTriangle, Home as HomeIcon, ExternalLink, PlayCircle } from 'lucide-react'

export async function generateMetadata({ params }) {
  const { locale, slug } = await params
  const resource = await getResourceBySlug(slug)
  if (!resource) return {}
  const name = tt(resource.name, locale)
  return {
    title: name, description: tt(resource.slogan, locale),
    openGraph: { title: name, description: tt(resource.slogan, locale), images: resource.logo_url ? [resource.logo_url] : [] },
    alternates: { canonical: `/${locale}/resource/${slug}` },
    other: {
      'application/ld+json': JSON.stringify({
        '@context': 'https://schema.org', '@type': 'SoftwareApplication',
        name, description: tt(resource.description, locale), image: resource.logo_url, url: resource.website_url,
        applicationCategory: resource.subcategory, operatingSystem: resource.platforms?.list?.join(', '),
        aggregateRating: { '@type': 'AggregateRating', ratingValue: resource.rating, ratingCount: Math.max(1, resource.view_count / 100) },
      }),
    },
  }
}

export default async function DetailPage({ params }) {
  const { locale, slug } = await params
  const r = await getResourceBySlug(slug)
  if (!r) notFound()
  const t = await getTranslations({ locale, namespace: 'detail' })
  const [related, adj] = await Promise.all([
    getRelated(r.categories?.id, slug, 6),
    getAdjacentResources(slug, r.categories?.id),
  ])

  return (
    <div className="pb-32 md:pb-16">
      {/* Breadcrumb */}
      <div className="container mx-auto max-w-5xl px-4 pt-6 text-[13px] text-tertiary flex items-center gap-1.5">
        <Link href={`/${locale}`} className="hover:text-primary"><HomeIcon className="w-3.5 h-3.5 inline mr-1" />Home</Link>
        <span>/</span>
        <Link href={`/${locale}?cat=${r.super_category}`} className="hover:text-primary capitalize">{r.super_category}</Link>
        <span>/</span>
        <span className="text-primary">{tt(r.name, locale)}</span>
      </div>

      <div className="container mx-auto max-w-5xl px-4">
        {/* 1. HERO */}
        <section className="pt-8 pb-6">
          <div className="flex flex-col md:flex-row items-start gap-5">
            <div className="w-20 h-20 rounded-2xl bg-surface border border-app flex items-center justify-center overflow-hidden shrink-0">
              {r.logo_url ? <img src={r.logo_url} alt="" className="w-12 h-12" /> : <span className="text-3xl text-primary">{tt(r.name, locale)[0]}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-[10.5px] font-mono uppercase tracking-widest text-[#F5C518]">{r.super_category}</span>
                {r.subcategory && <span className="text-[10.5px] font-mono uppercase tracking-widest text-tertiary">· {r.subcategory}</span>}
                {r.trending && <span className="px-2 py-0.5 rounded text-[10.5px] font-mono text-orange-500 bg-orange-500/10 border border-orange-500/40">🔥 Trending</span>}
                {r.editors_pick && <span className="px-2 py-0.5 rounded text-[10.5px] font-mono text-[#F5C518] bg-[#F5C518]/10 border border-[#F5C518]/40">★ Editor's Pick</span>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">{tt(r.name, locale)}</h1>
              <p className="mt-2 text-secondary text-[15px]">{tt(r.slogan, locale)}</p>
              {r.rating > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex">{[1,2,3,4,5].map(n => <Star key={n} className={`w-4 h-4 ${n <= Math.round(r.rating) ? 'fill-[#F5C518] text-[#F5C518]' : 'text-tertiary'}`} />)}</div>
                  <span className="text-sm text-secondary font-medium">{r.rating}</span>
                  <span className="text-xs text-tertiary">· {r.view_count.toLocaleString()} {t('views')}</span>
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={r.website_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#F5C518] hover:bg-[#e6b800] text-black font-semibold text-sm"><ExternalLink className="w-3.5 h-3.5" />{t('useNow')}</a>
                <Link href={`/${locale}?cat=knowledge&sub=Tutorial`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-surface border border-app text-primary hover:bg-surface-hover text-sm"><PlayCircle className="w-3.5 h-3.5" />{t('viewTutorial')}</Link>
                <ShareModal url={`${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/resource/${r.slug}`} title={`${tt(r.name, locale)} · ${tt(r.slogan, locale)}`} />
              </div>
            </div>
          </div>
        </section>

        {/* 2. INFO BAR */}
        <section className="mb-8 rounded-xl border border-app bg-surface px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            <InfoCell icon={<Zap className="w-3.5 h-3.5" />} label={t('category')} value={r.super_category} />
            <InfoCell icon={<Monitor className="w-3.5 h-3.5" />} label={t('platform')} value={r.platforms?.list?.join(' · ') || 'Web'} />
            <InfoCell icon={<DollarSign className="w-3.5 h-3.5" />} label={t('pricingLabel')} value={r.price_type || 'Free'} />
            <InfoCell icon={<Globe className="w-3.5 h-3.5" />} label={t('language')} value="Multi" />
            <InfoCell icon={<Calendar className="w-3.5 h-3.5" />} label={t('updated')} value={new Date(r.updated_at).toLocaleDateString()} />
          </div>
        </section>

        {/* 3. OVERVIEW */}
        <Section title={t('overview')}>
          <p className="text-[15px] text-secondary leading-[1.8]">{tt(r.description, locale)}</p>
        </Section>

        {/* 4. FEATURES (highlights) */}
        {r.highlights?.[locale]?.length > 0 && (
          <Section title={t('features')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(r.highlights[locale] || r.highlights.en || []).map((h, i) => (
                <div key={i} className="p-4 rounded-xl border border-app bg-surface flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F5C518]/15 flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-[#F5C518]" /></div>
                  <div className="text-sm text-primary leading-relaxed">{h}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 5. USE CASES */}
        {r.use_cases?.[locale]?.length > 0 && (
          <Section title={t('useCases')}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {(r.use_cases[locale] || r.use_cases.en || []).map((u, i) => (
                <div key={i} className="p-3 rounded-lg border border-app bg-surface text-center text-sm text-secondary hover:bg-surface-hover">{u}</div>
              ))}
            </div>
          </Section>
        )}

        {/* 6. SCREENSHOTS */}
        {r.screenshots?.length > 0 && (
          <Section title={t('screenshots')}>
            <ScreenshotCarousel screenshots={r.screenshots} locale={locale} />
          </Section>
        )}

        {/* 8. PRICING */}
        {r.pricing_plans?.length > 0 && (
          <Section title={t('pricing')}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {r.pricing_plans.map(p => (
                <div key={p.id} className={`p-5 rounded-xl border ${p.highlighted ? 'border-[#F5C518]/40 bg-[#F5C518]/[0.05]' : 'border-app bg-surface'}`}>
                  <div className="text-sm text-secondary">{tt(p.name, locale)}</div>
                  <div className="text-2xl font-bold text-primary mt-1">{p.price}<span className="text-xs text-tertiary font-normal ml-1">{tt(p.price_period, locale)}</span></div>
                  <ul className="mt-4 space-y-1.5">{(p.features || []).map((f, i) => <li key={i} className="flex items-start gap-1.5 text-[12.5px] text-secondary"><Check className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />{tt(f, locale)}</li>)}</ul>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* 9. PROS / CONS */}
        {(r.pros?.length > 0 || r.cons?.length > 0) && (
          <Section title={t('prosCons')}>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04]">
                <h3 className="text-emerald-500 font-semibold mb-3 flex items-center gap-2 text-sm"><Check className="w-4 h-4" />{t('pros')}</h3>
                <ul className="space-y-2">{r.pros.map(p => <li key={p.id} className="flex items-start gap-2 text-[14px] text-primary"><Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />{tt(p.content, locale)}</li>)}</ul>
              </div>
              <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-500/[0.04]">
                <h3 className="text-rose-500 font-semibold mb-3 flex items-center gap-2 text-sm"><XIcon className="w-4 h-4" />{t('cons')}</h3>
                <ul className="space-y-2">{r.cons.map(c => <li key={c.id} className="flex items-start gap-2 text-[14px] text-primary"><XIcon className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />{tt(c.content, locale)}</li>)}</ul>
              </div>
            </div>
          </Section>
        )}

        {/* 10. LIMITATIONS */}
        {r.cons?.length > 0 && (
          <Section title={t('limitations')}>
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="text-sm text-secondary leading-relaxed">{t('noticeBefore')}{r.cons.map(c => tt(c.content, locale)).join(' · ')}</div>
            </div>
          </Section>
        )}

        {/* 11. RELATED */}
        {related?.length > 0 && (
          <Section title={t('relatedTools')}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {related.map(rr => (
                <Link key={rr.id} href={`/${locale}/resource/${rr.slug}`} className="group flex items-center gap-3 p-4 rounded-xl border border-app bg-surface hover:bg-surface-hover">
                  <div className="w-9 h-9 rounded-lg bg-app border border-app flex items-center justify-center overflow-hidden shrink-0">
                    {rr.logo_url && <img src={rr.logo_url} alt="" className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-medium text-primary truncate">{tt(rr.name, locale)}</div>
                    <div className="text-[11.5px] text-tertiary truncate">{tt(rr.slogan, locale)}</div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-tertiary group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </Section>
        )}

        {/* 12. COMMENTS */}
        <Comments slug={r.slug} />

        {/* PAGER */}
        <section className="mt-12 pt-6 flex items-center justify-between border-t border-app">
          {adj.prev ? (
            <Link href={`/${locale}/resource/${adj.prev.slug}`} className="flex items-center gap-2 text-sm text-secondary hover:text-primary"><ChevronLeft className="w-4 h-4" /><span>{tt(adj.prev.name, locale)}</span></Link>
          ) : <div />}
          {adj.next ? (
            <Link href={`/${locale}/resource/${adj.next.slug}`} className="flex items-center gap-2 text-sm text-secondary hover:text-primary"><span>{tt(adj.next.name, locale)}</span><ChevronRight className="w-4 h-4" /></Link>
          ) : <div />}
        </section>
      </div>

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 p-3 glass border-t border-app">
        <a href={r.website_url} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#F5C518] text-black font-semibold text-sm">{t('useNow')}<ArrowUpRight className="w-4 h-4" /></a>
      </div>
    </div>
  )
}

function InfoCell({ icon, label, value }) {
  return (
    <div>
      <div className="text-[10.5px] font-mono uppercase tracking-widest text-tertiary flex items-center gap-1">{icon}{label}</div>
      <div className="text-sm text-primary font-medium mt-1 truncate">{value}</div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold text-primary mb-4">{title}</h2>
      {children}
    </section>
  )
}
