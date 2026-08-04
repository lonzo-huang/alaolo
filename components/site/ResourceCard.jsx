'use client'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { t as tt } from '@/lib/i18n/config'
import { Star } from 'lucide-react'

// category slug -> pill classes (colored primary chip)
const CAT_CHIP = {
  ai: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  dev: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  network: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  learning: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  productivity: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
}

export function ResourceCard({ resource, locale, compact = false }) {
  const t = useTranslations('home')
  const cat = resource.categories
  const catSlug = cat?.slug || 'dev'
  const chip = CAT_CHIP[catSlug] || CAT_CHIP.dev
  const highlights = resource.highlights?.[locale] || resource.highlights?.en || []
  const catName = tt(cat?.name, locale)
  const price = resource.pricing_summary || (resource.rating >= 4.7 ? 'Freemium' : '免费')

  return (
    <div className="group rounded-xl border border-white/[0.07] bg-[#10141C] hover:border-white/15 transition-all p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
          {resource.logo_url ? (
            <img src={resource.logo_url} alt="" className="w-7 h-7 object-contain" onError={(e) => { e.target.style.display = 'none' }} />
          ) : (
            <span className="text-base font-bold text-white">{tt(resource.name, locale)[0]}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-[15px] leading-tight truncate">{tt(resource.name, locale)}</h3>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{tt(resource.slogan, locale)}</p>
        </div>
        <button className="shrink-0 text-slate-500 hover:text-[#F5C518] p-1 opacity-70 hover:opacity-100" aria-label="favorite">
          <Star className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[13px] text-slate-300 leading-relaxed line-clamp-2">{tt(resource.description, locale)}</p>

      {(highlights.length > 0 || catName) && (
        <div className="flex flex-wrap gap-1.5">
          {catName && (
            <span className={`px-2 py-0.5 rounded-md border text-[11px] font-medium ${chip}`}>{catName}</span>
          )}
          {highlights.slice(0, 4).map((h, i) => (
            <span key={i} className="px-2 py-0.5 rounded-md text-[11px] text-slate-400 bg-white/[0.03] border border-white/[0.08]">{h}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 mt-auto">
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/resource/${resource.slug}`} className="px-3 py-1.5 rounded-md bg-[#F5C518] hover:bg-[#e6b800] text-black text-[12.5px] font-medium">{t('details')}</Link>
          <a href={resource.website_url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 text-slate-200 text-[12.5px]">{t('visit')}</a>
        </div>
        <div className="flex items-center gap-2 text-[11.5px] text-slate-500">
          <span>{catName} · {price}</span>
          {resource.rating > 0 && <span className="text-slate-300"><span className="text-[#F5C518]">★</span> {resource.rating}</span>}
        </div>
      </div>
    </div>
  )
}
