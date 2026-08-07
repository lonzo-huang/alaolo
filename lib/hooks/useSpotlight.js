'use client'
import { useRef, useCallback } from 'react'

// Cursor-following spotlight highlight + subtle 3D tilt for cards.
// Spread the returned handlers onto any element (Link, div, etc.) and
// append SPOTLIGHT_CLASS to its className.
export const SPOTLIGHT_CLASS = 'card-spotlight card-tilt'

export function useSpotlight() {
  const ref = useRef(null)

  const onMouseMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = x / rect.width - 0.5
    const py = y / rect.height - 0.5
    el.style.setProperty('--spot-x', `${x}px`)
    el.style.setProperty('--spot-y', `${y}px`)
    el.style.setProperty('--tilt-x', `${py * -5}deg`)
    el.style.setProperty('--tilt-y', `${px * 5}deg`)
  }, [])

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
