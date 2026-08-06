'use client'
import { Toaster } from '@/components/ui/sonner'
import { useEffect, useState } from 'react'

export function ThemedToaster() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  return <Toaster theme={isDark ? 'dark' : 'light'} position="top-center" />
}
