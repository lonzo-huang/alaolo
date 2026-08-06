'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const ThemeCtx = createContext({ theme: 'dark', setTheme: () => {}, source: 'auto' })
export const useTheme = () => useContext(ThemeCtx)

function getSystemTheme() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return 'dark'
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark')
  const [source, setSource] = useState('auto')

  const apply = useCallback((t) => {
    document.documentElement.classList.toggle('dark', t === 'dark')
    document.documentElement.classList.toggle('light', t === 'light')
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const src = localStorage.getItem('theme-source') || 'auto'
    setSource(src)
    if (src === 'manual' && stored) {
      setThemeState(stored)
      apply(stored)
    } else {
      const sys = getSystemTheme()
      setThemeState(sys)
      apply(sys)
    }
  }, [apply])

  const setTheme = useCallback((t) => {
    setThemeState(t)
    setSource('manual')
    localStorage.setItem('theme', t)
    localStorage.setItem('theme-source', 'manual')
    apply(t)
  }, [apply])

  const resetAuto = useCallback(() => {
    setSource('auto')
    localStorage.setItem('theme-source', 'auto')
    localStorage.removeItem('theme')
    const sys = getSystemTheme()
    setThemeState(sys)
    apply(sys)
  }, [apply])

  return <ThemeCtx.Provider value={{ theme, setTheme, source, resetAuto }}>{children}</ThemeCtx.Provider>
}
