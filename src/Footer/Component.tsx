'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { optimizedCloudinaryUrl } from '@/utilities/optimizedCloudinaryUrl'

type FooterProps = { footer?: any; className?: string }

const useInlineSvg = (url: string | undefined) => {
  const [svgContent, setSvgContent] = useState<string | null>(null)
  useEffect(() => {
    if (!url) return
    fetch(url)
      .then((res) => (res.ok ? res.text() : null))
      .then(setSvgContent)
      .catch(() => {})
  }, [url])
  return svgContent
}

export const Footer: React.FC<FooterProps> = ({ footer, className }) => {
  if (!footer) return null
  const layout = footer.layout || 'simple'

  if (layout === 'simple') {
    const navItems = footer.navItems || []
    return (
      <footer className="mt-auto border-t border-border bg-black dark:bg-card text-white">
        <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
          <Link className="flex items-center" href="/">
            <Logo />
          </Link>
          <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
            <ThemeSelector />
            <nav className="flex flex-col md:flex-row gap-4">
              {navItems.map(({ link }: any, i: number) => (
                <CMSLink className="text-white" key={i} {...link} />
              ))}
            </nav>
          </div>
        </div>
      </footer>
    )
  }

  const { description, socialBadges = [], reachUs, mapEmbedUrl, copyright } = footer
  const logoValue = footer.logo
  const [logoMedia, setLogoMedia] = useState<any>(null)

  useEffect(() => {
    if (!logoValue) return
    if (typeof logoValue === 'object' && logoValue !== null) {
      setLogoMedia(logoValue)
      return
    }
    fetch(`/api/media/${logoValue}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setLogoMedia(data))
  }, [logoValue])

  const isSvg = logoMedia?.mimeType === 'image/svg+xml' || logoMedia?.format === 'svg'
  const svgContent = useInlineSvg(isSvg ? logoMedia?.url : undefined)

  const renderFooterLogo = () => {
    if (!logoMedia) return null
    if (isSvg && svgContent) {
      return (
        <div
          className="[&>svg]:max-w-[200px] [&>svg]:h-auto"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )
    }
    if (!isSvg && logoMedia?.url) {
      return (
        <Image
          src={optimizedCloudinaryUrl(logoMedia.url)}
          alt="Footer logo"
          width={200}
          height={80}
          className="h-auto w-auto max-w-[200px]"
          // unoptimized removed – Next.js will further compress if needed
        />
      )
    }
    return null
  }

  return (
    <footer className={cn('bg-[#040d10] pt-16', className)}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
          <div className="footer-content">
            {logoMedia && <div className="mb-6">{renderFooterLogo()}</div>}
            {description && (
              <div className="text-white/80 text-sm mb-6">
                <RichText data={description} enableGutter={false} />
              </div>
            )}
            {socialBadges.length > 0 && (
              <ul className="flex gap-4 mt-4 flex-wrap">
                {socialBadges.map((badge: any, idx: number) => (
                  <li key={idx}>
                    {badge.link ? (
                      <a href={badge.link} target="_blank" rel="noopener noreferrer">
                        {badge.image?.url && (
                          <Image
                            src={optimizedCloudinaryUrl(badge.image.url)}
                            alt="Badge"
                            width={80}
                            height={80}
                            className="h-auto w-auto max-w-[80px]"
                            // unoptimized removed
                          />
                        )}
                      </a>
                    ) : (
                      badge.image?.url && (
                        <Image
                          src={optimizedCloudinaryUrl(badge.image.url)}
                          alt="Badge"
                          width={80}
                          height={80}
                          className="h-auto w-auto max-w-[80px]"
                          // unoptimized removed
                        />
                      )
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="footer-content">
            {reachUs?.heading && (
              <h2 className="font-serif text-3xl italic text-white mb-4">{reachUs.heading}</h2>
            )}
            <div className="space-y-3 text-white/80 text-sm">
              {reachUs?.phone && (
                <p>
                  Tel:{' '}
                  <a
                    href={`tel:${reachUs.phone.replace(/\s/g, '')}`}
                    className="hover:text-[#ffd28d] transition"
                  >
                    {reachUs.phone}
                  </a>
                </p>
              )}
              {reachUs?.email && (
                <p>
                  Email:{' '}
                  <a href={`mailto:${reachUs.email}`} className="hover:text-[#ffd28d] transition">
                    {reachUs.email}
                  </a>
                </p>
              )}
              {reachUs?.hours && <p>Hours: {reachUs.hours}</p>}
              {reachUs?.partnerHotel?.link && (
                <p className="text-[#ffd28d] font-bold pt-4">
                  {reachUs.partnerHotel.label || 'Book a room at our Flagship Hotel.'}
                  <a
                    href={reachUs.partnerHotel.link}
                    target={reachUs.partnerHotel.newTab ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="block mt-2"
                  >
                    {reachUs.partnerHotel.logo?.url && (
                      <Image
                        src={optimizedCloudinaryUrl(reachUs.partnerHotel.logo.url)}
                        alt="Partner hotel logo"
                        width={150}
                        height={60}
                        className="h-auto w-auto max-w-[150px]"
                        // unoptimized removed
                      />
                    )}
                  </a>
                </p>
              )}
            </div>
          </div>
          <div className="footer-content">
            {mapEmbedUrl && (
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg"
              />
            )}
          </div>
        </div>
        {copyright && (
          <div className="border-t border-white/10 text-center text-white/60 text-sm py-4">
            {copyright}
          </div>
        )}
      </div>
    </footer>
  )
}

export default Footer
