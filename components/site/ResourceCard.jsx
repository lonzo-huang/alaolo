'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Star } from 'lucide-react'
import { t as tt } from '@/lib/i18n/config'

const CAT_COLORS = {
  ai: { text: 'text-purple-300', border: 'border-purple-500/30', bg: 'bg-purple-500/10', glow: 'shadow-purple-500/20' },
  dev: { text: 'text-blue-300', border: 'border-blue-500/30', bg: 'bg-blue-500/10', glow: 'shadow-blue-500/20' },
  network: { text: 'text-emerald-300', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', glow: 'shadow-emerald-500/20' },
  learning: { text: 'text-orange-300', border: 'border-orange-500/30', bg: 'bg-orange-500/10', glow: 'shadow-orange-500/20' },
  productivity: { text: 'text-cyan-300', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', glow: 'shadow-cyan-500/20' },
}

export function ResourceCard({ resource, locale }) {
  const cat = resource.categories
  const catSlug = cat?.slug || 'dev'
  const c = CAT_COLORS[catSlug] || CAT_COLORS.dev

  return (
    <Link
      href={`/${locale}/resource/${resource.slug}`}
      className={`group relative flex flex-col gap-3 p-5 rounded-xl border border-white/[0.08] bg-gradient-to-b from-[#151A26] to-[#0F131C] hover:border-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:${c.glow} transition-all duration-200 overflow-hidden`}
    >
      {/* subtle brand glow */}
      <div className={`absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-20 blur-3xl ${c.bg}`} />

      <div className="flex items-start justify-between gap-3 relative">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {resource.logo_url ? (
              <img src={resource.logo_url} alt="" className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span class='text-lg font-bold text-white'>${(tt(resource.name, locale) || '?')[0]}</span>` }} />
            ) : (
              <span className="text-lg font-bold text-white">{(tt(resource.name, locale) || '?')[0]}</span>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white truncate">{tt(resource.name, locale)}</h3>
            <div className="flex items-center gap-2 mt-0.5 text-xs">
              {cat && (
                <span className={`px-1.5 py-0.5 rounded border ${c.border} ${c.text} ${c.bg}`}>{tt(cat.name, locale)}</span>
              )}
              {resource.rating > 0 && (
                <span className="flex items-center gap-0.5 text-slate-400"><Star className="w-3 h-3 fill-[#F5C518] text-[#F5C518]" />{resource.rating}</span>
              )}
            </div>
          </div>
        </div>
        <a
          href={resource.website_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 p-1.5 rounded-md text-slate-400 hover:text-[#F5C518] hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Visit website"
        >
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{tt(resource.slogan, locale)}</p>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
        <span>{resource.view_count?.toLocaleString?.() || 0} views</span>
        {resource.editors_pick && <span className="text-[#F5C518]">★ Editor's pick</span>}
      </div>
    </Link>
  )
}
