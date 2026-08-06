'use client'
import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ArrowRight, Command as CmdIcon } from 'lucide-react'
import { t as tt } from '@/lib/i18n/config'
import { createSupabaseBrowser } from '@/lib/supabase/client'

export function CommandPalette({ open, onClose, locale }) {
  const [q, setQ] = useState('')
  const [items, setItems] = useState([])
  const [selectedIdx, setSelectedIdx] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (!open) return
    const sb = createSupabaseBrowser()
    sb.from('resources').select('slug, name, slogan, super_category, subcategory, logo_url').limit(60).then(({ data }) => setItems(data || []))
  }, [open])

  useEffect(() => { if (open) setQ(''); setSelectedIdx(0) }, [open])

  const filtered = useMemo(() => {
    if (!q.trim()) return items.slice(0, 12)
    const query = q.toLowerCase()
    return items.filter(r => {
      const n = tt(r.name, locale).toLowerCase()
      const s = tt(r.slogan, locale).toLowerCase()
      return n.includes(query) || s.includes(query) || r.subcategory?.toLowerCase().includes(query)
    }).slice(0, 12)
  }, [q, items, locale])

  useEffect(() => {
    if (!open) return
    const kh = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(filtered.length - 1, i + 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(0, i - 1)) }
      if (e.key === 'Enter' && filtered[selectedIdx]) { router.push(`/${locale}/resource/${filtered[selectedIdx].slug}`); onClose() }
    }
    document.addEventListener('keydown', kh)
    return () => document.removeEventListener('keydown', kh)
  }, [open, filtered, selectedIdx, locale, router, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-[#121215] shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 border-b border-white/[0.06]">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input autoFocus value={q} onChange={e => { setQ(e.target.value); setSelectedIdx(0) }} placeholder="Search tools, knowledge, resources..." className="flex-1 py-3.5 bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none" />
          <kbd className="font-mono text-[10px] text-slate-500 bg-white/[0.04] border border-white/[0.06] rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <div className="max-h-[50vh] overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500">No results</div>
          ) : filtered.map((r, i) => (
            <button key={r.slug} onClick={() => { router.push(`/${locale}/resource/${r.slug}`); onClose() }} onMouseEnter={() => setSelectedIdx(i)} className={`w-full flex items-center gap-3 px-4 py-2.5 text-left ${i === selectedIdx ? 'bg-white/[0.05]' : ''}`}>
              <div className="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                {r.logo_url ? <img src={r.logo_url} alt="" className="w-5 h-5" /> : <span className="text-xs text-white">{tt(r.name, locale)[0]}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] text-white truncate">{tt(r.name, locale)}</div>
                <div className="text-[12px] text-slate-500 truncate">{tt(r.slogan, locale)}</div>
              </div>
              <span className="text-[10.5px] font-mono text-slate-500 uppercase tracking-wider">{r.super_category}</span>
              <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${i === selectedIdx ? 'text-[#F5C518]' : 'text-slate-600'}`} />
            </button>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-white/[0.06] flex items-center gap-4 text-[10.5px] text-slate-500">
          <span className="flex items-center gap-1"><kbd className="font-mono bg-white/[0.04] px-1 rounded">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="font-mono bg-white/[0.04] px-1 rounded">↵</kbd> open</span>
          <span className="flex items-center gap-1"><CmdIcon className="w-2.5 h-2.5" /><kbd className="font-mono bg-white/[0.04] px-1 rounded">K</kbd> toggle</span>
        </div>
      </div>
    </div>
  )
}
