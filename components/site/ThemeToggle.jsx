'use client'
import { Sun, Moon, MonitorSmartphone } from 'lucide-react'
import { useTheme } from './ThemeProvider'
import { useState, useRef, useEffect } from 'react'

export function ThemeToggle() {
  const { theme, setTheme, source, resetAuto } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const Icon = theme === 'dark' ? Moon : Sun

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)} className="p-1.5 rounded-md text-secondary hover:text-primary hover:bg-surface-hover transition-colors" aria-label="theme">
        <Icon className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-app-strong bg-surface shadow-2xl py-1 z-50">
          <button onClick={() => { setTheme('light'); setOpen(false) }} className={`w-full flex items-center gap-2 px-3 py-1.5 text-[13px] hover:bg-surface-hover ${theme === 'light' && source === 'manual' ? 'text-[#F5C518]' : 'text-primary'}`}><Sun className="w-3.5 h-3.5" />Light</button>
          <button onClick={() => { setTheme('dark'); setOpen(false) }} className={`w-full flex items-center gap-2 px-3 py-1.5 text-[13px] hover:bg-surface-hover ${theme === 'dark' && source === 'manual' ? 'text-[#F5C518]' : 'text-primary'}`}><Moon className="w-3.5 h-3.5" />Dark</button>
          <button onClick={() => { resetAuto(); setOpen(false) }} className={`w-full flex items-center gap-2 px-3 py-1.5 text-[13px] hover:bg-surface-hover ${source === 'auto' ? 'text-[#F5C518]' : 'text-primary'}`}><MonitorSmartphone className="w-3.5 h-3.5" />Auto (sunset)</button>
        </div>
      )}
    </div>
  )
}
