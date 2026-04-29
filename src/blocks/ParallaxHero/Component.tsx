'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import RichText from '@/components/RichText'
import { optimizedCloudinaryUrl } from '@/utilities/optimizedCloudinaryUrl'

type ParallaxHeroProps = {
  backgroundImage?: { url?: string }
  overlay?: {
    type?: 'solid' | 'gradient'
    solidColor?: string
    gradientDirection?: string
    gradientStart?: string
    gradientEnd?: string
    gradientStopPosition?: number
  }
  paddingTop?: number
  paddingBottom?: number
  height?: string
  welcomeTextColor?: string
  titleColor?: string
  descriptionColor?: string
  welcomeText?: string
  title?: any
  description?: any
  cta?: {
    label?: string
    type?: 'internal' | 'external'
    reference?: { slug?: string }
    url?: string
    newTab?: boolean
  }
  scrollAnimation?: 'none' | 'fadeUp' | 'fade' | 'slideLeft' | 'slideRight'
}

const getHref = (cta: ParallaxHeroProps['cta']) => {
  if (!cta) return '#'
  if (cta.type === 'internal' && cta.reference?.slug) return `/${cta.reference.slug}`
  if (cta.type === 'external' && cta.url) return cta.url
  return '#'
}

const toRgba = (color: string, alpha: number): string => {
  if (color.startsWith('rgba')) {
    const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
    if (match) return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`
  }
  if (color.startsWith('rgb(')) {
    const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
    if (match) return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`
  }
  if (color.startsWith('#')) {
    let hex = color.slice(1)
    if (hex.length === 3)
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  return color
}

export const ParallaxHeroBlock: React.FC<ParallaxHeroProps> = ({
  backgroundImage,
  overlay,
  paddingTop = 80,
  paddingBottom = 180,
  height = '100vh',
  welcomeText,
  title,
  description,
  cta,
  scrollAnimation = 'fadeUp',
  welcomeTextColor = '#ffd28d',
  titleColor = '#ffffff',
  descriptionColor = '#ffffff',
}) => {
  const contentRef = useRef(null)
  const isInView = useInView(contentRef, { once: true, margin: '-100px' })

  // Get and optimize the background image URL
  const getOptimizedBackgroundUrl = (): string => {
    if (!backgroundImage?.url) return ''
    let url = backgroundImage.url
    // Ensure it's absolute (if relative, prepend server URL)
    if (!url.startsWith('http')) {
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''
      url = `${baseUrl}${url}`
    }
    // Apply Cloudinary auto-optimizations (f_auto,q_auto)
    return optimizedCloudinaryUrl(url)
  }

  const bgUrl = getOptimizedBackgroundUrl()

  const getGradientStyle = () => {
    if (!overlay) return 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6))'
    if (overlay.type === 'solid') {
      const rawColor = overlay.solidColor || 'rgba(0,0,0,0.6)'
      const rgbaColor = toRgba(rawColor, 0.6)
      return `linear-gradient(180deg, ${rgbaColor}, ${rgbaColor})`
    }
    if (overlay.type === 'gradient') {
      const direction = overlay.gradientDirection || 'to bottom'
      let start = overlay.gradientStart || 'rgba(3, 11, 13, 0.9)'
      let end = overlay.gradientEnd || 'rgba(3, 11, 13, 0.3)'
      start = toRgba(start, 0.9)
      end = toRgba(end, 0.3)
      const stop = overlay.gradientStopPosition ?? 30
      return `linear-gradient(${direction}, ${start} ${stop}%, ${end})`
    }
    return 'linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6))'
  }

  const getVariants = () => {
    switch (scrollAnimation) {
      case 'fade':
        return { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
        }
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
        }
      default:
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }
    }
  }

  const variants = getVariants()
  const gradient = getGradientStyle()

  const sectionStyles: React.CSSProperties = {
    backgroundAttachment: 'fixed',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    paddingTop: `${paddingTop}px`,
    paddingBottom: `${paddingBottom}px`,
    minHeight: height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  if (bgUrl) {
    // Combine the gradient overlay with the optimized background image
    sectionStyles.backgroundImage = `${gradient}, url(${bgUrl})`
  } else {
    sectionStyles.backgroundImage = gradient
  }

  return (
    <section
      className="relative md:py-12 w-full overflow-hidden bg-cover bg-center bg-no-repeat"
      style={sectionStyles}
    >
      <motion.div
        ref={contentRef}
        initial="hidden"
        animate={isInView && scrollAnimation !== 'none' ? 'visible' : undefined}
        variants={variants}
        className="relative z-10 flex flex-col items-center justify-center px-4 text-center text-white w-full"
        style={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        {welcomeText && (
          <p className="text-sm uppercase tracking-wider mb-4" style={{ color: welcomeTextColor }}>
            {welcomeText}
          </p>
        )}

        {title && title.root && (
          <div
            className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight"
            style={{ color: titleColor }}
          >
            <RichText data={title} enableGutter={false} />
          </div>
        )}
        {description && (
          <div
            className="max-w-2xl mt-6 text-base md:text-lg opacity-90"
            style={{ color: descriptionColor }}
          >
            <RichText data={description} enableGutter={false} />
          </div>
        )}
        {cta && (cta.reference?.slug || cta.url) && (
          <div className="mt-8">
            <Link
              href={getHref(cta)}
              target={cta.newTab ? '_blank' : undefined}
              rel={cta.newTab ? 'noopener noreferrer' : undefined}
              className="inline-block px-8 py-3 border-t border-b border-white text-white text-sm uppercase tracking-wider transition-all duration-300 hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700]"
            >
              {cta.label || 'Read More'}
            </Link>
          </div>
        )}
      </motion.div>
    </section>
  )
}
