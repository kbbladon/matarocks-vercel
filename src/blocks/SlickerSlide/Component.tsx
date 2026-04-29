'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.css'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { optimizedCloudinaryUrl } from '@/utilities/optimizedCloudinaryUrl'

type Slide = {
  image?: any // media object or ID
  title?: string
  description?: any
  buttonLabel?: string
  buttonLink?: string
  newTab?: boolean
}

type SlickerSlideProps = {
  heading?: string
  slides?: Slide[]
  autoplay?: boolean
  autoplaySpeed?: string | number
  showArrows?: boolean
  showDots?: boolean
  slidesPerView?: string | number
  gap?: number
  backgroundColor?: string
  backgroundOpacity?: number
  backgroundGradient?: string
  verticalPadding?: 'sm' | 'md' | 'lg' | 'xl'
  width?: 'contained' | 'full'
  className?: string
}

const paddingMap = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
}

const hexToRgba = (hex: string, alpha: number): string => {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// Helper to safely extract image URL and alt from a media object
const getSlideMedia = (media: any): { url: string; alt: string } | null => {
  if (!media || typeof media === 'string') return null
  if (typeof media === 'object' && media.url) {
    return {
      url: media.url,
      alt: media.alt || '',
    }
  }
  return null
}

export const SlickerSlideComponent: React.FC<SlickerSlideProps> = ({
  heading,
  slides = [],
  autoplay = true,
  autoplaySpeed = 5000,
  showArrows = true,
  showDots = true,
  slidesPerView = 1,
  gap = 20,
  backgroundColor = '#040d10',
  backgroundOpacity = 1,
  backgroundGradient,
  verticalPadding = 'md',
  width = 'contained',
  className,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const perView =
    typeof slidesPerView === 'string' ? parseInt(slidesPerView, 10) : slidesPerView || 1
  const speed =
    typeof autoplaySpeed === 'string' ? parseInt(autoplaySpeed, 10) : autoplaySpeed || 5000
  const spacing = typeof gap === 'number' ? gap : 20

  const [sliderRef, instanceRef] = useKeenSlider({
    slides: { perView, spacing },
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
  })

  useEffect(() => {
    if (!autoplay || !instanceRef.current) return
    const interval = setInterval(() => {
      instanceRef.current?.next()
    }, speed)
    return () => clearInterval(interval)
  }, [autoplay, speed, instanceRef])

  const paddingClass = paddingMap[verticalPadding] || 'py-12'
  const containerClasses =
    width === 'full' ? 'px-6 md:px-10 lg:px-16' : 'max-w-7xl mx-auto px-6 md:px-10 lg:px-16'
  const totalSlides = slides.length

  let bgStyle: React.CSSProperties = {}
  if (backgroundGradient) {
    bgStyle.backgroundImage = backgroundGradient
    bgStyle.backgroundSize = 'cover'
  } else if (backgroundColor) {
    if (backgroundOpacity !== undefined && backgroundOpacity < 1) {
      bgStyle.backgroundColor = hexToRgba(backgroundColor, backgroundOpacity)
    } else {
      bgStyle.backgroundColor = backgroundColor
    }
  }

  // Responsive image sizes – adjust according to slidesPerView
  const sizePerSlide = perView > 1 ? `${100 / perView}vw` : '100vw'
  const imageSizesDefault = `(max-width: 768px) 100vw, ${sizePerSlide}`

  return (
    <section className={cn('w-full', paddingClass, className)} style={bgStyle}>
      <div className={containerClasses}>
        {heading && (
          <h2 className="text-3xl md:text-4xl text-center mb-12 font-light">{heading}</h2>
        )}

        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {slides.map((slide, idx) => {
              const media = getSlideMedia(slide.image)
              const imageUrl = media ? optimizedCloudinaryUrl(media.url) : ''
              const altText = media?.alt || ''
              return (
                <div key={idx} className="keen-slider__slide">
                  <div className="relative rounded-xl overflow-hidden group aspect-[4/3]">
                    {media ? (
                      <Image
                        src={imageUrl}
                        alt={altText}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes={imageSizesDefault}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      {slide.title && <h3 className="text-2xl font-light mb-2">{slide.title}</h3>}
                      {slide.description && (
                        <div className="text-sm opacity-90">
                          <RichText data={slide.description} enableGutter={false} />
                        </div>
                      )}
                      {slide.buttonLink && slide.buttonLabel && (
                        <Link
                          href={slide.buttonLink}
                          target={slide.newTab ? '_blank' : undefined}
                          rel={slide.newTab ? 'noopener noreferrer' : undefined}
                          className="inline-block mt-4 px-6 py-2 border border-white text-white text-sm uppercase tracking-wider transition-all hover:bg-white hover:text-black"
                        >
                          {slide.buttonLabel}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {showArrows && loaded && totalSlides > perView && (
            <>
              <button
                onClick={() => instanceRef.current?.prev()}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
                aria-label="Previous slide"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => instanceRef.current?.next()}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition"
                aria-label="Next slide"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {showDots && loaded && totalSlides > 1 && (
            <div className="flex justify-center gap-3 mt-6">
              {Array.from({ length: totalSlides }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => instanceRef.current?.moveToIdx(idx)}
                  className={cn(
                    'w-3 h-3 rounded-full transition-all duration-300',
                    'border border-[#ffd28d]',
                    currentSlide === idx
                      ? 'bg-[#ffd28d] scale-125 ring-2 ring-[#ffd28d]/50'
                      : 'bg-transparent',
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
