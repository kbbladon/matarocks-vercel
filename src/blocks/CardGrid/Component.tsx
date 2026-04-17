'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type CardGridItem = {
  title: string
  richDescription?: any
  price?: number
  image: { url?: string }
  features?: { text: string }[]
  cta?: {
    label?: string
    type?: 'internal' | 'external'
    reference?: any // can be an object with relationTo/value or a populated page object
    url?: string
    newTab?: boolean
  }
}

type CardGridProps = {
  heading?: string
  items?: CardGridItem[]
  hoverStyle?: 'fade' | 'slideUp' | 'cinematic'
  overlayColor?: string
  scrollAnimation?: 'none' | 'fadeUp' | 'fade' | 'slide'
  width?: 'contained' | 'full'
  cardHeight?: number | string
  cardColumns?: number | string
  className?: string
  enableFooterCta?: boolean
  footerCta?: {
    label?: string
    link?: string
    newTab?: boolean
  }
}

function hexToRgb(hex: string) {
  const cleaned = hex.replace('#', '')
  const bigint = parseInt(cleaned, 16)
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  }
}

// Updated getHref to handle nested reference.value.slug
const getHref = (cta: CardGridItem['cta']): string => {
  if (!cta) return '#'

  // Internal link: the reference could be in the format { relationTo, value: { slug } } or already populated { slug }
  if (cta.reference) {
    // Case 1: reference is an object with a 'value' property (unpopulated link)
    if (typeof cta.reference === 'object' && 'value' in cta.reference && cta.reference.value) {
      const refValue = cta.reference.value
      if (typeof refValue === 'object' && 'slug' in refValue) {
        return `/${refValue.slug}`
      }
    }
    // Case 2: reference is directly populated (depth > 0)
    if (typeof cta.reference === 'object' && 'slug' in cta.reference) {
      return `/${cta.reference.slug}`
    }
  }

  // External link
  if (cta.url) return cta.url

  return '#'
}

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return null
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const getSizes = (columns: number): string => {
  if (columns === 2) return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw'
  if (columns === 4) return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
  return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
}

const AnimatedCard = ({
  children,
  animation,
  index,
}: {
  children: React.ReactNode
  animation: CardGridProps['scrollAnimation']
  index: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const variants = {
    hidden: {
      opacity: 0,
      y: animation === 'fadeUp' ? 50 : animation === 'slide' ? 100 : 0,
      x: animation === 'slide' ? -50 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.6, delay: index * 0.1 },
    },
  }

  if (animation === 'none') return <>{children}</>

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

export const CardGridBlock: React.FC<CardGridProps> = ({
  heading,
  items = [],
  hoverStyle = 'slideUp',
  overlayColor = '#000000',
  scrollAnimation = 'fadeUp',
  width = 'contained',
  cardHeight = 540,
  cardColumns = 3,
  className = '',
  enableFooterCta,
  footerCta,
}) => {
  const rgb = hexToRgb(overlayColor)
  const panelBg = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`
  const overlay = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.85)`

  const height = typeof cardHeight === 'number' ? cardHeight : Number(cardHeight) || 540
  const columns = typeof cardColumns === 'number' ? cardColumns : Number(cardColumns) || 3

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [isDesktop, setIsDesktop] = useState(true)

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024)
    checkDesktop()
    window.addEventListener('resize', checkDesktop)
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  const handleCardClick = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const handleCardHover = (index: number) => {
    setExpandedIndex(index)
  }

  const handleCardLeave = () => {
    setExpandedIndex(null)
  }

  const getGridCols = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 md:grid-cols-2'
      case 4:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  const sizesValue = getSizes(columns)

  return (
    <section className={cn('w-full pt-12 pb-16', className)}>
      <div
        className={
          width === 'full'
            ? 'w-full px-6 md:px-10 lg:px-16'
            : 'max-w-7xl mx-auto px-6 md:px-10 lg:px-16'
        }
      >
        {heading && (
          <h2 className="text-3xl md:text-4xl text-center mb-12 font-light uppercase">{heading}</h2>
        )}

        <div className={`grid gap-6 ${getGridCols()}`}>
          {items.map((item, i) => {
            const isExpanded = expandedIndex === i
            return (
              <AnimatedCard key={i} animation={scrollAnimation} index={i}>
                <div
                  className="group relative overflow-hidden rounded-xl bg-gray-900 cursor-pointer"
                  style={{ height: `${height}px` }}
                  onClick={() => handleCardClick(i)}
                  onMouseEnter={() => isDesktop && handleCardHover(i)}
                  onMouseLeave={() => isDesktop && handleCardLeave()}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={item.image?.url || ''}
                      alt={item.title}
                      fill
                      sizes={sizesValue}
                      className={cn(
                        'object-cover transition-transform duration-700 ease-out',
                        isExpanded ? 'scale-110' : 'scale-100',
                      )}
                    />
                  </div>

                  {/* Dark Overlays */}
                  <div
                    className={cn(
                      'absolute inset-0 transition-opacity duration-500',
                      isExpanded ? 'opacity-100' : 'opacity-0',
                    )}
                    style={{ background: overlay }}
                  />
                  <div
                    className={cn(
                      'absolute inset-0 backdrop-blur-[2px] transition-opacity duration-500',
                      isExpanded ? 'opacity-100' : 'opacity-0',
                    )}
                  />

                  {/* Expanding Panel */}
                  <div
                    className={cn(
                      'absolute bottom-0 left-0 right-0 z-20 transition-all duration-500 ease-out overflow-hidden',
                      isExpanded ? 'inset-0' : 'h-20',
                    )}
                    style={{ background: panelBg }}
                  >
                    {/* Collapsed View */}
                    <div
                      className={cn(
                        'absolute bottom-0 left-0 right-0 h-20 px-6 flex items-center justify-between transition-opacity duration-300',
                        isExpanded ? 'opacity-0' : 'opacity-100',
                      )}
                    >
                      <h3 className="text-xl font-light uppercase">{item.title}</h3>
                      {item.price !== undefined && item.price !== null && (
                        <span className="text-xl font-light">{formatPrice(item.price)}</span>
                      )}
                    </div>

                    {/* Expanded Content */}
                    <div
                      className={cn(
                        'absolute inset-0 p-6 flex flex-col transition-all duration-500 ease-out',
                        isExpanded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
                      )}
                    >
                      <div className="flex-1 overflow-y-auto space-y-4 text-white">
                        {item.richDescription && (
                          <div className="text-sm opacity-90">
                            <RichText data={item.richDescription} enableGutter={false} />
                          </div>
                        )}
                        {item.price !== undefined && item.price !== null && (
                          <div className="text-lg font-semibold">{formatPrice(item.price)}</div>
                        )}
                        {item.features && item.features.length > 0 && (
                          <ul className="text-sm space-y-1">
                            {item.features.map((f, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span>•</span>
                                <span>{f.text}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* CTA Button – only when expanded and a valid link exists */}
                      {(() => {
                        const href = getHref(item.cta)
                        if (href !== '#') {
                          return (
                            <div className="mt-4 pt-2 text-center">
                              <Link
                                href={href}
                                target={item.cta?.newTab ? '_blank' : undefined}
                                rel={item.cta?.newTab ? 'noopener noreferrer' : undefined}
                                className="inline-block px-6 py-2 text-sm font-medium border border-white text-white bg-transparent transition-all duration-300 hover:bg-[#FFD700] hover:text-black hover:border-[#FFD700]"
                              >
                                {item.cta?.label || 'View Details'}
                              </Link>
                            </div>
                          )
                        }
                        return null
                      })()}
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            )
          })}
        </div>

        {/* Optional Global Footer CTA */}
        {enableFooterCta && footerCta?.link && (
          <div className="mt-12 text-center">
            <Link
              href={footerCta.link}
              target={footerCta.newTab ? '_blank' : undefined}
              rel={footerCta.newTab ? 'noopener noreferrer' : undefined}
              className="btn-gold-live"
            >
              {footerCta.label || 'View All Rooms'}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
