import { createSupabaseServer } from '@/lib/supabase/server'
import Link from 'next/link'
import { t as tt } from '@/lib/i18n/config'
import { getTranslations } from 'next-intl/server'
import { Trophy, ArrowUpRight, Star } from 'lucide-react'

export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'leaderboard' })
  return { title: `${t('title')} · alaolo` }
}

export default async function LeaderboardPage({ params }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'leaderboard' })
  const sb = await createSupabaseServer()
  const cats = ['tools', 'knowledge']
  const results = {}
  for (const c of cats) {
    const { data } = await sb.from('resources').select('*').eq('super_category', c).order('rating', { ascending: false }).order('view_count', { ascending: false }).limit(10)
    results[c] = data || []
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="mb-10">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#F5C518] mb-2 flex items-center gap-1.5"><Trophy className="w-3.5 h-3.5" />{t('label')}</div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">🏆 {t('title')}</h1>
        <p className="mt-2 text-secondary">{t('subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cats.map(c => (
          <section key={c} className="rounded-xl border border-app bg-surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-primary uppercase font-mono tracking-wider">{c}</h2>
              <Link href={`/${locale}?cat=${c}`} className="text-xs text-tertiary hover:text-primary">{t('allLink')}</Link>
            </div>
            <div className="space-y-1.5">
              {results[c].map((r, i) => (
                <Link key={r.id} href={`/${locale}/resource/${r.slug}`} className="group flex items-center gap-2.5 p-2 rounded-lg hover:bg-surface-hover">
                  <span className={`w-6 text-sm font-bold tabular-nums text-center ${i < 3 ? 'text-[#F5C518]' : 'text-tertiary'}`}>{i + 1}</span>
                  <div className="w-6 h-6 rounded bg-app border border-app flex items-center justify-center overflow-hidden shrink-0">
                    {r.logo_url && <img src={r.logo_url} alt="" className="w-4 h-4" />}
                  </div>
                  <span className="flex-1 truncate text-[13.5px] text-primary">{tt(r.name, locale)}</span>
                  <span className="text-[11px] text-tertiary flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-[#F5C518] text-[#F5C518]" />{r.rating}</span>
                  <ArrowUpRight className="w-3 h-3 text-tertiary group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
