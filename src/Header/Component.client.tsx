'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { optimizedCloudinaryUrl } from '@/utilities/optimizedCloudinaryUrl'

type HeaderProps = { settings?: any }

// ----- robust href & label resolvers (unchanged) -----
const getLinkHref = (linkItem: any): string => {
  if (!linkItem) return '#'
  if (typeof linkItem === 'string') return linkItem
  if (linkItem.link && typeof linkItem.link === 'string') return linkItem.link
  if (linkItem.type === 'reference' && linkItem.reference?.value?.slug)
    return `/${linkItem.reference.value.slug}`
  if (linkItem.type === 'custom' && linkItem.url) return linkItem.url
  if (linkItem.type === 'internal' && linkItem.reference?.slug) return `/${linkItem.reference.slug}`
  if (linkItem.type === 'external' && linkItem.url) return linkItem.url
  return '#'
}

const getLinkLabel = (linkItem: any): string => {
  if (!linkItem) return 'Link'
  if (typeof linkItem === 'string') return linkItem
  if (linkItem.label) return linkItem.label
  if (linkItem.link && typeof linkItem.link === 'string') return linkItem.link
  return 'Link'
}

// Custom hook to fetch and inline SVG content
const useInlineSvg = (url: string | undefined) => {
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!url) return
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch SVG')
        return res.text()
      })
      .then((text) => setSvgContent(text))
      .catch(() => setError(true))
  }, [url])

  return { svgContent, error }
}

export const Header: React.FC<HeaderProps> = ({ settings }) => {
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openMobileParent, setOpenMobileParent] = useState<number | null>(null)

  const branding = settings?.branding || {}
  const colors = settings?.colors || {}
  const navItems = settings?.navItems || []
  const cta = settings?.ctaButton
  const phoneNumber = settings?.phoneNumber

  const primaryColor = colors.primaryColor || '#FFD700'
  const secondaryColor = colors.secondaryColor || '#E6B800'
  const bodyBgColor = colors.bodyBgColor || '#0a0a0a'

  const [logoMedia, setLogoMedia] = useState<any>(null)

  useEffect(() => {
    const logoValue = branding?.logo
    if (!logoValue) return
    if (typeof logoValue === 'object' && logoValue !== null) {
      setLogoMedia(logoValue)
      return
    }
    fetch(`/api/media/${logoValue}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setLogoMedia(data))
      .catch(() => {})
  }, [branding?.logo])

  const logoDarkMedia = branding?.logoDark
  const logoSrc = isScrolled ? logoDarkMedia?.url || logoMedia?.url : logoMedia?.url
  const isSvg = logoMedia?.mimeType === 'image/svg+xml' || logoMedia?.format === 'svg'

  const { svgContent, error: svgError } = useInlineSvg(isSvg ? logoSrc : undefined)

  const opacity = branding?.headerOverlayOpacity ?? 0.9
  const gradient =
    branding?.headerGradient ||
    `linear-gradient(to bottom, rgba(0,0,0,${opacity}), rgba(0,0,0,${opacity * 0.6}), transparent)`

  const logoNaturalWidth = logoMedia?.width ?? 350
  const logoNaturalHeight = logoMedia?.height ?? 150
  const desktopWidth = branding?.logoWidthDesktop ?? logoNaturalWidth
  const mobileWidth = branding?.logoWidthMobile ?? Math.min(200, logoNaturalWidth)
  const logoAspectRatio = logoNaturalWidth / logoNaturalHeight

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  const cleanPhone = phoneNumber?.replace(/\s+/g, '') || ''
  const toggleMobileParent = (index: number) =>
    setOpenMobileParent(openMobileParent === index ? null : index)

  const renderLogo = () => {
    if (!logoMedia) return null

    // Render inline SVG from fetched content
    if (isSvg && svgContent) {
      return (
        <div
          className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain [&>svg]:object-center"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )
    }

    // Fallback for raster images – now optimized
    if (!isSvg && logoSrc) {
      const optimizedSrc = optimizedCloudinaryUrl(logoSrc)
      return (
        <Image
          src={optimizedSrc}
          alt="Logo"
          fill
          sizes={`(max-width: 768px) ${mobileWidth}px, ${desktopWidth}px`}
          className="object-contain object-center"
          priority
          // unoptimized removed – Next.js will serve the optimized src correctly
        />
      )
    }

    // Loading / error state
    return null
  }

  return (
    <>
      <header
        style={{
          backgroundImage: !isScrolled ? gradient : 'none',
          borderBottom: isScrolled ? `1px solid ${primaryColor}` : 'none',
        }}
        className={`
          sticky top-0 md:fixed md:top-0 md:left-0 md:right-0
          w-full z-50 transition-all duration-500 ease-in-out
          ${isScrolled ? 'bg-black/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}
        `}
      >
        <div className="flex justify-center">
          <div
            className={`w-full max-w-7xl px-6 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-6'}`}
          >
            <div className="flex items-center justify-between gap-2 md:gap-4 lg:gap-8">
              <div className="flex items-center gap-2 md:gap-4 lg:gap-6 shrink-0">
                <Link href="/" className="relative shrink-0">
                  <div
                    style={
                      {
                        '--mobile-w': isScrolled
                          ? `${Math.round(mobileWidth * 0.85)}px`
                          : `${mobileWidth}px`,
                        '--desktop-w': isScrolled
                          ? `${Math.round(desktopWidth * 0.75)}px`
                          : `${desktopWidth}px`,
                        transition: 'width 0.5s ease-in-out',
                      } as React.CSSProperties
                    }
                    className="relative w-[var(--mobile-w)] md:w-[var(--desktop-w)]"
                  >
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        aspectRatio: String(logoAspectRatio),
                      }}
                    >
                      {renderLogo()}
                    </div>
                  </div>
                </Link>
                {phoneNumber && (
                  <div className="hidden lg:block">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="flex items-center gap-2 text-white/80 text-xs md:text-sm font-medium hover:text-white transition-colors whitespace-nowrap"
                    >
                      <Phone size={12} className="md:w-3.5 md:h-3.5" />
                      <span>TEL: {phoneNumber}</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Desktop Navigation */}
              <div className="flex-1 flex justify-center">
                <nav className="hidden lg:flex flex-wrap justify-center gap-2 xl:gap-4 2xl:gap-8">
                  {navItems.map((item: any, idx: number) => {
                    const linkObj = item.parentLink || item
                    const href = getLinkHref(linkObj)
                    const label = getLinkLabel(linkObj)
                    const newTab = linkObj?.newTab || false
                    const hasChildren = item.children?.length > 0

                    return (
                      <div key={idx} className="relative group">
                        <Link
                          href={href}
                          target={newTab ? '_blank' : undefined}
                          rel={newTab ? 'noopener noreferrer' : undefined}
                          className="text-xs md:text-sm font-semibold uppercase tracking-wider text-white hover:text-yellow-400 transition-colors whitespace-nowrap"
                        >
                          {label}
                        </Link>
                        {hasChildren && (
                          <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-black/90 backdrop-blur-sm border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="py-2">
                              {item.children.map((child: any, childIdx: number) => (
                                <Link
                                  key={childIdx}
                                  href={getLinkHref(child.childLink || child)}
                                  target={child.childLink?.newTab ? '_blank' : undefined}
                                  rel={child.childLink?.newTab ? 'noopener noreferrer' : undefined}
                                  className="block px-4 py-2 text-xs text-white hover:bg-yellow-500/20 hover:text-yellow-400 transition-colors whitespace-nowrap"
                                >
                                  {getLinkLabel(child.childLink || child)}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </nav>
              </div>

              <div className="shrink-0">
                {cta?.ctaLink && (
                  <div className="hidden lg:block book-button">
                    <Link
                      href={getLinkHref(cta.ctaLink)}
                      target={cta.ctaLink?.newTab ? '_blank' : undefined}
                      rel={cta.ctaLink?.newTab ? 'noopener noreferrer' : undefined}
                      className="btn-book-now whitespace-nowrap text-xs md:text-sm px-4 py-2"
                    >
                      {cta.ctaLink?.label}
                    </Link>
                  </div>
                )}
                {/* Mobile Hamburger Button */}
                <div className="lg:hidden">
                  <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                    <div className="w-6 h-5 flex flex-col justify-between">
                      <span
                        style={{ backgroundColor: secondaryColor }}
                        className={`h-0.5 w-full transition-all ${
                          isMenuOpen ? 'rotate-45 translate-y-2' : ''
                        }`}
                      />
                      <span
                        style={{ backgroundColor: secondaryColor }}
                        className={`h-0.5 w-full transition-all ${isMenuOpen ? 'opacity-0' : ''}`}
                      />
                      <span
                        style={{ backgroundColor: secondaryColor }}
                        className={`h-0.5 w-full transition-all ${
                          isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                        }`}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-transform duration-500 lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ backgroundColor: bodyBgColor }}
      >
        <div className="flex flex-col p-12 gap-8 items-center justify-center h-full overflow-y-auto">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute top-8 right-8 text-2xl"
            style={{ color: secondaryColor }}
          >
            &times;
          </button>
          <nav className="flex flex-col gap-6 text-center w-full">
            {navItems.map((item: any, idx: number) => {
              const linkObj = item.parentLink || item
              const href = getLinkHref(linkObj)
              const label = getLinkLabel(linkObj)
              const newTab = linkObj?.newTab || false
              const hasChildren = item.children?.length > 0
              const isOpen = openMobileParent === idx

              return (
                <div key={idx} className="w-full">
                  <div className="flex justify-between items-center">
                    <Link
                      href={href}
                      target={newTab ? '_blank' : undefined}
                      rel={newTab ? 'noopener noreferrer' : undefined}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-2xl font-bold uppercase flex-1 text-left"
                      style={{ color: secondaryColor }}
                    >
                      {label}
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={() => toggleMobileParent(idx)}
                        className="ml-4 p-2"
                        style={{ color: secondaryColor }}
                      >
                        <svg
                          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {hasChildren && isOpen && (
                    <div className="mt-4 pl-4 flex flex-col gap-4">
                      {item.children.map((child: any, childIdx: number) => (
                        <Link
                          key={childIdx}
                          href={getLinkHref(child.childLink || child)}
                          target={child.childLink?.newTab ? '_blank' : undefined}
                          rel={child.childLink?.newTab ? 'noopener noreferrer' : undefined}
                          onClick={() => setIsMenuOpen(false)}
                          className="text-lg hover:opacity-80 transition-opacity"
                          style={{ color: secondaryColor }}
                        >
                          {getLinkLabel(child.childLink || child)}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            {phoneNumber && (
              <a
                href={`tel:${cleanPhone}`}
                className="text-xl mt-4"
                style={{ color: secondaryColor }}
              >
                TEL: {phoneNumber}
              </a>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}

export default Header
