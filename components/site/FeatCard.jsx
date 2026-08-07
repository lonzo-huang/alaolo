'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Star, ArrowUpRight } from 'lucide-react'
import { t as tt } from '@/lib/i18n/config'
import { useSpotlight, SPOTLIGHT_CLASS } from '@/lib/hooks/useSpotlight'

export function FeatCard({ r, locale, big }) {
  const t = useTranslations('tools')
  const spotlight = useSpotlight()
  return (
    <Link ref={spotlight.ref} onMouseMove={spotlight.onMouseMove} onMouseLeave={spotlight.onMouseLeave} href={`/${locale}/resource/${r.slug}`} className={`group relative overflow-hidden rounded-xl border border-app hover:border-app-strong bg-surface hover:bg-surface-hover p-5 flex flex-col gap-3 transition-all ${SPOTLIGHT_CLASS} ${big ? 'md:col-span-1' : ''}`}>
      <div className="flex items-start gap-3 relative z-[2]">
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
      <p className="text-[13px] text-secondary line-clamp-2 leading-relaxed relative z-[2]">{tt(r.slogan, locale)}</p>
      <div className="flex items-center gap-2 pt-1 flex-wrap text-[10.5px] text-tertiary relative z-[2]">
        {r.platforms?.list?.slice(0, 3).map(p => <span key={p} className="font-mono">{p}</span>)}
        <div className="flex-1" />
        {r.rating > 0 && <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-[#F5C518] text-[#F5C518]" />{r.rating}</span>}
      </div>
    </Link>
  )
}
