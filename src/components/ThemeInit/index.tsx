'use client'

import { useEffect } from 'react'

export default function ThemeInit() {
  useEffect(() => {
    try {
      const theme = localStorage.getItem('theme') || 'light'
      document.documentElement.setAttribute('data-theme', theme)
    } catch (e) {}
  }, [])

  return null
}
