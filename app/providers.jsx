'use client'
import { ThemeProvider } from '@/components/site/ThemeProvider'

export function Providers({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
