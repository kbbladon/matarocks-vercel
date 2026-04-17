'use client'

import React, { createContext, useContext } from 'react'

// Define the shape of your settings (you can expand as needed)
type Settings = {
  typography?: {
    fontPreset?: string
    bodyFontFamily?: string
    headingFontFamily?: string
    // ... other fields
  }
  // ... other settings
}

const SiteSettingsContext = createContext<Settings | null>(null)

export const SiteSettingsProvider = ({
  children,
  settings,
}: {
  children: React.ReactNode
  settings: Settings
}) => {
  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>
}

export const useSiteSettings = () => {
  const context = useContext(SiteSettingsContext)
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider')
  }
  return context
}
