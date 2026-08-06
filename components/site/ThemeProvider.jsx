'use client'
import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'

const ThemeCtx = createContext({ theme: 'dark', setTheme: () => {}, source: 'auto' })
export const useTheme = () => useContext(ThemeCtx)

async function detectByGeo() {
  try {
    // Get user's approximate lat/lng from browser geolocation (with fallback to IP)
    const now = new Date()
    const hour = now.getHours()
    // Simple heuristic: 6am-6pm = light, else dark
    // (Real sunrise/sunset would need lat/lng + calculation)
    if (navigator.geolocation) {
      const pos = await new Promise((res) => {
        navigator.geolocation.getCurrentPosition(p => res(p), () => res(null), { timeout: 3000, maximumAge: 3600000 })
      })
      if (pos) {
        const { latitude, longitude } = pos.coords
        // Compute sunrise/sunset using simple algorithm (NOAA approximation)
        const { sunrise, sunset } = getSunTimes(latitude, longitude, now)
        const t = now.getTime()
        return t >= sunrise && t < sunset ? 'light' : 'dark'
      }
    }
    return hour >= 6 && hour < 18 ? 'light' : 'dark'
  } catch { return 'dark' }
}

// Simplified sunrise/sunset calculation (NOAA algorithm)
function getSunTimes(lat, lng, date) {
  const rad = Math.PI / 180
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000)
  const decl = 23.45 * rad * Math.sin(rad * (360 / 365) * (dayOfYear - 81))
  const latRad = lat * rad
  const cosH = -Math.tan(latRad) * Math.tan(decl)
  if (cosH > 1) return { sunrise: 0, sunset: 0 }
  if (cosH < -1) return { sunrise: 0, sunset: 24*3600*1000 }
  const H = Math.acos(cosH) / rad / 15  // hours from noon
  const noonUTC = 12 - lng / 15
  const base = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  return {
    sunrise: base + (noonUTC - H) * 3600 * 1000,
    sunset: base + (noonUTC + H) * 3600 * 1000,
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark')
  const [source, setSource] = useState('auto')
  const autoCancelled = useRef(false)

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
      autoCancelled.current = false
      detectByGeo().then(t => { if (!autoCancelled.current) { setThemeState(t); apply(t) } })
    }
  }, [apply])

  const setTheme = useCallback((t) => {
    autoCancelled.current = true
    setThemeState(t)
    setSource('manual')
    localStorage.setItem('theme', t)
    localStorage.setItem('theme-source', 'manual')
    apply(t)
  }, [apply])

  const resetAuto = useCallback(() => {
    autoCancelled.current = false
    setSource('auto')
    localStorage.setItem('theme-source', 'auto')
    localStorage.removeItem('theme')
    detectByGeo().then(t => { if (!autoCancelled.current) { setThemeState(t); apply(t) } })
  }, [apply])

  return <ThemeCtx.Provider value={{ theme, setTheme, source, resetAuto }}>{children}</ThemeCtx.Provider>
}
