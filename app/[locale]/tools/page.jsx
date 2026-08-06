import { createSupabaseServer } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { t as tt } from '@/lib/i18n/config'
import { ArrowUpRight, Star, Search, Filter } from 'lucide-react'

export const dynamic = 'force-dynamic'

const AI_CATEGORIES = [
  { key: 'chat', icon: '💬' },
  { key: 'coding', icon: '💻' },
  { key: 'image', icon: '🎨' },
  { key: 'video', icon: '🎬' },
  { key: 'audio', icon: '🎵' },
  { key: 'knowledge', icon: '📚' },
  { key: 'search', icon: '🔍' },
  { key: 'agent', icon: '🤖' },
  { key: 'data', icon: '📊' },
  { key: '3d', icon: '🔬' },
  { key: 'office', icon: '📄' },
  { key: 'legal', icon: '⚖️' },
  { key: 'medical', icon: '💊' },
  { key: 'quant', icon: '📈' },
  { key: 'devops', icon: '🛠️' },
  { key: 'career', icon: '💼' },
]

const FILTERS = {
  deployment: ['saas', 'api', 'selfhost', 'private'],
  pricing: ['free', 'freemium', 'token', 'subscription', 'lifetime'],
  platform: ['web', 'app', 'desktop', 'vscode', 'api', 'sdk'],
  os: ['windows', 'android', 'ios', 'linux', 'arm'],
}

export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'tools' })
  return { title: t('metaTitle'), description: t('metaDesc') }
}

export default async function ToolsHubPage({ params, searchParams }) {
  const { locale } = await params
  const sp = await searchParams
  const activeSub = sp?.sub || null
  const activePrice = sp?.price || null
  const t = await getTranslations({ locale, namespace: 'tools' })

  const sb = await createSupabaseServer()
  let q = sb.from('resources').select('*').eq('super_category', 'tools').order('rating', { ascending: false })
  if (activePrice) q = q.eq('price_type', activePrice)
  const { data: all } = await q

  const bySub = {}
  for (const r of (all || [])) {
    const s = r.subcategory || 'Other'
    if (!bySub[s]) bySub[s] = []
    bySub[s].push(r)
  }
  const featured = (all || []).filter(r => r.featured || r.editors_pick).slice(0, 4)

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-20 h-fit">
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#F5C518] mb-3">{t('categories')}</div>
          <div className="flex flex-col gap-0.5">
            <Link href={`/${locale}/tools`} className={`px-3 py-2 rounded-md text-[13px] ${!activeSub ? 'bg-surface-hover text-primary font-medium' : 'text-secondary hover:bg-surface-hover'}`}>🔥 {t('all')}</Link>
            {AI_CATEGORIES.map(c => (
              <Link key={c.key} href={`/${locale}/tools?sub=${c.key}`} className={`px-3 py-2 rounded-md text-[13px] ${activeSub === c.key ? 'bg-surface-hover text-primary font-medium' : 'text-secondary hover:bg-surface-hover'}`}>
                {c.icon} {t(`cat_${c.key}`)}
              </Link>
            ))}
          </div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-[#F5C518] mt-6 mb-3">{t('filters')}</div>
          <div className="flex flex-col gap-3">
            <div>
              <div className="text-[11px] text-tertiary mb-1">{t('filterDeployment')}</div>
              <div className="flex flex-col gap-0.5">
                {FILTERS.deployment.map(f => (
                  <Link key={f} href={`/${locale}/tools?${activeSub ? `sub=${activeSub}&` : ''}deploy=${f}`} className={`px-3 py-1.5 rounded-md text-[12.5px] ${sp?.deploy === f ? 'bg-surface-hover text-primary font-medium' : 'text-secondary hover:bg-surface-hover'}`}>{t(`deploy_${f}`)}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-tertiary mb-1">{t('filterPricing')}</div>
              <div className="flex flex-col gap-0.5">
                {FILTERS.pricing.map(f => (
                  <Link key={f} href={`/${locale}/tools?${activeSub ? `sub=${activeSub}&` : ''}price=${f}`} className={`px-3 py-1.5 rounded-md text-[12.5px] ${activePrice === f ? 'bg-surface-hover text-primary font-medium' : 'text-secondary hover:bg-surface-hover'}`}>{t(`price_${f}`)}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-tertiary mb-1">{t('filterPlatform')}</div>
              <div className="flex flex-col gap-0.5">
                {FILTERS.platform.map(f => (
                  <Link key={f} href={`/${locale}/tools?${activeSub ? `sub=${activeSub}&` : ''}platform=${f}`} className={`px-3 py-1.5 rounded-md text-[12.5px] ${sp?.platform === f ? 'bg-surface-hover text-primary font-medium' : 'text-secondary hover:bg-surface-hover'}`}>{t(`platform_${f}`)}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-tertiary mb-1">{t('filterOS')}</div>
              <div className="flex flex-col gap-0.5">
                {FILTERS.os.map(f => (
                  <Link key={f} href={`/${locale}/tools?${activeSub ? `sub=${activeSub}&` : ''}os=${f}`} className={`px-3 py-1.5 rounded-md text-[12.5px] ${sp?.os === f ? 'bg-surface-hover text-primary font-medium' : 'text-secondary hover:bg-surface-hover'}`}>{t(`os_${f}`)}</Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-8">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#F5C518] mb-2">{t('hubTitle')}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">🤖 {activeSub ? t(`cat_${activeSub}`) : t('all')} {t('toolsSuffix')}</h1>
            <p className="mt-2 text-secondary">{t('toolsCount', { count: all?.length || 0 })}</p>
          </div>

          {!activeSub && !activePrice && featured.length > 0 && (
            <section className="mb-10">
              <div className="text-[11px] font-mono uppercase tracking-widest text-[#F5C518] mb-3">{t('featured')}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {featured.slice(0, 2).map(r => <FeatCard key={r.id} r={r} locale={locale} big t={t} />)}
              </div>
            </section>
          )}

          {Object.entries(bySub).filter(([s]) => !activeSub || s === activeSub).map(([sub, items]) => (
            <section key={sub} className="mb-10">
              <div className="flex items-end justify-between mb-4">
                <h2 className="text-lg font-bold text-primary">{AI_CATEGORIES.find(c => c.key === sub)?.icon || '📝'} {t(`cat_${sub}`) || sub}</h2>
                <span className="text-xs text-tertiary">{items.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map(r => <FeatCard key={r.id} r={r} locale={locale} t={t} />)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

function FeatCard({ r, locale, big, t }) {
  return (
    <Link href={`/${locale}/resource/${r.slug}`} className={`group rounded-xl border border-app hover:border-app-strong bg-surface hover:bg-surface-hover p-5 flex flex-col gap-3 transition-all ${big ? 'md:col-span-1' : ''}`}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-app border border-app flex items-center justify-center overflow-hidden shrink-0">
          {r.logo_url && <img src={r.logo_url} alt="" className="w-6 h-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-primary text-[14.5px] truncate">{tt(r.name, locale)}</div>
            <ArrowUpRight className="w-3.5 h-3.5 text-tertiary group-hover:text-primary shrink-0" />
          </div>
          <div className="text-[10.5px] font-mono uppercase tracking-wider text-tertiary mt-0.5">{t(`cat_${r.subcategory}`) || r.subcategory}</div>
        </div>
        {r.price_type && <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${r.price_type === 'Free' ? 'text-emerald-500 border-emerald-500/40 bg-emerald-500/10' : r.price_type === 'Paid' ? 'text-orange-500 border-orange-500/40 bg-orange-500/10' : 'text-blue-500 border-blue-500/40 bg-blue-500/10'}`}>{r.price_type}</span>}
      </div>
      <p className="text-[13px] text-secondary line-clamp-2 leading-relaxed">{tt(r.slogan, locale)}</p>
      <div className="flex items-center gap-2 pt-1 flex-wrap text-[10.5px] text-tertiary">
        {r.platforms?.list?.slice(0, 3).map(p => <span key={p} className="font-mono">{p}</span>)}
        <div className="flex-1" />
        {r.rating > 0 && <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-[#F5C518] text-[#F5C518]" />{r.rating}</span>}
      </div>
    </Link>
  )
}
