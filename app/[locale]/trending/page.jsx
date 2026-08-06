import { createSupabaseServer } from '@/lib/supabase/server'
import Link from 'next/link'
import { t as tt } from '@/lib/i18n/config'
import { TrendingUp, ArrowUpRight, Flame } from 'lucide-react'

export const dynamic = 'force-dynamic'
export async function generateMetadata({ params }) { return { title: 'Today\'s Hot · alaolo' } }

export default async function TrendingPage({ params }) {
  const { locale } = await params
  const sb = await createSupabaseServer()
  const { data } = await sb.from('resources').select('*').order('trending', { ascending: false }).order('view_count', { ascending: false }).limit(30)

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#F5C518] mb-2 flex items-center gap-1.5"><Flame className="w-3.5 h-3.5" />TODAY'S HOT</div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">🔥 今日热榜</h1>
        <p className="mt-2 text-secondary">基于访问量与编辑推荐的实时排行</p>
      </div>
      <div className="space-y-2">
        {(data || []).map((r, i) => (
          <Link key={r.id} href={`/${locale}/resource/${r.slug}`} className="group flex items-center gap-4 p-4 rounded-xl border border-app bg-surface hover:bg-surface-hover hover:border-app-strong transition-all">
            <div className={`w-8 text-2xl font-black tabular-nums text-center ${i < 3 ? 'text-[#F5C518]' : 'text-tertiary'}`}>{i + 1}</div>
            <div className="w-10 h-10 rounded-lg bg-app border border-app flex items-center justify-center overflow-hidden shrink-0">
              {r.logo_url && <img src={r.logo_url} alt="" className="w-6 h-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-primary text-[15px] truncate">{tt(r.name, locale)}</div>
              <div className="text-[12.5px] text-secondary truncate">{tt(r.slogan, locale)}</div>
            </div>
            <div className="flex flex-col items-end text-[11px] text-tertiary shrink-0">
              <span className="font-mono">{r.view_count.toLocaleString()} views</span>
              <span className="font-mono uppercase tracking-wider">{r.super_category}</span>
            </div>
            <ArrowUpRight className="w-4 h-4 text-tertiary group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  )
}
