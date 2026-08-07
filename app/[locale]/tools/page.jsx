import { createSupabaseServer } from '@/lib/supabase/server'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { t as tt } from '@/lib/i18n/config'
import ToolsFilters from '@/components/site/ToolsFilters'
import { FeatCard } from '@/components/site/FeatCard'

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
          <ToolsFilters locale={locale} />
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
                {featured.slice(0, 2).map(r => <FeatCard key={r.id} r={r} locale={locale} big />)}
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
                {items.map(r => <FeatCard key={r.id} r={r} locale={locale} />)}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
