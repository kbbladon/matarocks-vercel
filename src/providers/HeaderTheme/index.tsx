'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { Theme } from '@/providers/Theme/types'
import canUseDOM from '@/utilities/canUseDOM'

export interface ContextType {
  headerTheme?: Theme | null
  setHeaderTheme: (theme: Theme | null) => void
}

const HeaderThemeContext = createContext<ContextType | undefined>(undefined)

export const HeaderThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [headerTheme, setHeaderThemeState] = useState<Theme | null>(null)

  const setHeaderTheme = useCallback((theme: Theme | null) => {
    setHeaderThemeState(theme)
  }, [])

  // Sync with data-theme attribute on mount (client only)
  useEffect(() => {
    if (canUseDOM) {
      const initial = document.documentElement.getAttribute('data-theme') as Theme | null
      setHeaderThemeState(initial)
    }
  }, [])

  return (
    <HeaderThemeContext.Provider value={{ headerTheme, setHeaderTheme }}>
      {children}
    </HeaderThemeContext.Provider>
  )
}

export const useHeaderTheme = (): ContextType => {
  const context = useContext(HeaderThemeContext)
  if (!context) {
    throw new Error('useHeaderTheme must be used within HeaderThemeProvider')
  }
  return context
}
