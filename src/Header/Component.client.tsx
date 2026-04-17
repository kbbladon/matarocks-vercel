// src/Header/Component.tsx (or wherever)
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export const Header: React.FC<{ settings?: any }> = ({ settings }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll effect (unchanged)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Theme handling (unchanged)
  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme])

  // Logo URL from settings
  const logoUrl = settings?.branding?.logo?.url
  const logoDarkUrl = settings?.branding?.logoDark?.url

  // For simplicity, we'll use the light logo; you can add dark mode logic
  const logoSrc = logoUrl || '/placeholder.svg'

  return (
    <header
      className={`sticky top-0 z-20 transition-all duration-300 ${
        isScrolled
          ? 'border-b-2 border-yellow-500 bg-white/95 backdrop-blur-sm shadow-sm'
          : 'border-b-2 border-transparent bg-transparent'
      }`}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container py-8 flex justify-between items-center">
        <Link href="/">
          <Image
            src={logoSrc}
            alt="Mata Rocks Resort"
            width={isScrolled ? 100 : 150}
            height={isScrolled ? 40 : 60}
            className="transition-all duration-300"
            priority
          />
        </Link>
        <nav className="flex gap-3 items-center">{/* your nav items */}</nav>
      </div>
    </header>
  )
}
