'use client'
import { useEffect, useState } from 'react'
import { Star, MessageSquare, Send } from 'lucide-react'
import { toast } from 'sonner'

export function Comments({ slug }) {
  const [list, setList] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)

  const load = async () => {
    const r = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
    const d = await r.json(); setList(d.comments || [])
  }
  useEffect(() => { load() }, [slug])

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return
    setLoading(true)
    try {
      const r = await fetch('/api/comments', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resource_slug: slug, guest_name: name.trim(), content: content.trim(), rating }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'error')
      toast.success('Comment posted!')
      setContent(''); setRating(5)
      load()
    } catch (e) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-[#F5C518]" />评论 · Reviews ({list.length})</h2>
      <form onSubmit={submit} className="p-5 rounded-xl border border-app bg-surface">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="你的昵称 · Your name" maxLength={80} className="px-3 py-2 rounded-lg bg-app border border-app text-primary placeholder-tertiary text-sm focus:border-[#F5C518]/40 focus:outline-none" required />
          <div className="flex items-center gap-1 md:col-span-2">
            <span className="text-xs text-secondary mr-1">评分:</span>
            {[1,2,3,4,5].map(n => (
              <button type="button" key={n} onClick={() => setRating(n)} className="p-0.5">
                <Star className={`w-4 h-4 ${n <= rating ? 'fill-[#F5C518] text-[#F5C518]' : 'text-tertiary'}`} />
              </button>
            ))}
          </div>
        </div>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="分享你的使用体验..." maxLength={2000} rows={3} className="w-full px-3 py-2 rounded-lg bg-app border border-app text-primary placeholder-tertiary text-sm focus:border-[#F5C518]/40 focus:outline-none resize-none" required />
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-tertiary">{content.length}/2000</span>
          <button disabled={loading} className="px-4 py-2 rounded-lg bg-[#F5C518] hover:bg-[#e6b800] text-black text-sm font-medium inline-flex items-center gap-1.5 disabled:opacity-50">
            <Send className="w-3.5 h-3.5" />发布
          </button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {list.length === 0 ? (
          <div className="text-center py-10 text-tertiary text-sm border border-dashed border-app rounded-xl">还没有评论,做第一个分享者吧</div>
        ) : list.map(c => (
          <div key={c.id} className="p-4 rounded-xl border border-app bg-surface">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F5C518] to-orange-500 flex items-center justify-center text-black text-xs font-bold">{c.guest_name[0].toUpperCase()}</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-primary">{c.guest_name}</div>
                <div className="text-[11px] text-tertiary">{new Date(c.created_at).toLocaleString()}</div>
              </div>
              {c.rating > 0 && <div className="flex items-center gap-0.5">{[1,2,3,4,5].map(n => <Star key={n} className={`w-3 h-3 ${n <= c.rating ? 'fill-[#F5C518] text-[#F5C518]' : 'text-tertiary'}`} />)}</div>}
            </div>
            <div className="text-sm text-secondary leading-relaxed whitespace-pre-wrap">{c.content}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
