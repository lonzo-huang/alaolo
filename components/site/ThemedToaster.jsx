'use client'
import { Toaster } from '@/components/ui/sonner'
import { useTheme } from 'next-themes'

export function ThemedToaster() {
  const { theme } = useTheme()
  return <Toaster theme={theme === 'light' ? 'light' : 'dark'} position="top-center" />
}
