'use client'
import { useState } from 'react'
import { t as tt } from '@/lib/i18n/config'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function ScreenshotCarousel({ screenshots, locale }) {
  const [idx, setIdx] = useState(0)
  if (!screenshots?.length) return null
  const cur = screenshots[idx]
  return (
    <div className="relative rounded-2xl overflow-hidden border border-app bg-black">
      <div className="aspect-[16/9] relative">
        <img src={cur.url} alt={tt(cur.caption, locale)} className="w-full h-full object-cover" />
      </div>
      {screenshots.length > 1 && (
        <>
          <button onClick={() => setIdx((idx - 1 + screenshots.length) % screenshots.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/70"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => setIdx((idx + 1) % screenshots.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-black/70"><ChevronRight className="w-4 h-4" /></button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {screenshots.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} className={`w-1.5 h-1.5 rounded-full transition-all ${i === idx ? 'bg-white w-6' : 'bg-white/40'}`} />
            ))}
          </div>
        </>
      )}
      {cur.caption && <div className="absolute bottom-4 left-4 text-sm text-white/90 bg-black/60 backdrop-blur px-3 py-1 rounded">{tt(cur.caption, locale)}</div>}
    </div>
  )
}
