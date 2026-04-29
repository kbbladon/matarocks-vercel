'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useKeenSlider } from 'keen-slider/react'
import type { KeenSliderInstance } from 'keen-slider/react'
import 'keen-slider/keen-slider.css'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import RichText from '@/components/RichText'
import { optimizedCloudinaryUrl } from '@/utilities/optimizedCloudinaryUrl'

type Slide = {
  media?: { url: string } | string
}

type StaticContent = {
  overlayText?: any
  cta?: { label?: string; url?: string }
}

type SliderHeroProps = {
  sliderData: {
    animationPreset?: 'slide' | 'fade' | 'cinematic'
    staticContent?: StaticContent
    slides?: Slide[]
    autoplay?: boolean
    autoplaySpeed?: number
    showArrows?: boolean
    showDots?: boolean
    height?: 'full' | 'large' | 'medium'
    overlayColor?: string
  }
}

function hexToRgb(hex: string) {
  let cleaned = hex.replace(/^#/, '')
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('')
  }
  if (cleaned.length !== 6) return null
  return {
    r: parseInt(cleaned.slice(0, 2), 16),
    g: parseInt(cleaned.slice(2, 4), 16),
    b: parseInt(cleaned.slice(4, 6), 16),
  }
}

const isDev = process.env.NODE_ENV === 'development'

export const SliderHero: React.FC<SliderHeroProps> = ({ sliderData }) => {
  const { setHeaderTheme } = useHeaderTheme()

  const {
    animationPreset = 'cinematic',
    staticContent,
    slides = [],
    autoplay = true,
    autoplaySpeed = 5000,
    showArrows = true,
    showDots = true,
    height = 'full',
    overlayColor = '#000000',
  } = sliderData

  const isSlide = animationPreset === 'slide'
  const isFade = animationPreset === 'fade'
  const isCinematic = animationPreset === 'cinematic'

  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    setHasAnimated(true)
  }, [])

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    renderMode: 'precision',
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created(slider: KeenSliderInstance) {
      if (!autoplay || !isSlide) return
      let timeout: NodeJS.Timeout
      let mouseOver = false
      const nextTimeout = () => {
        clearTimeout(timeout)
        if (mouseOver) return
        timeout = setTimeout(() => slider.next(), autoplaySpeed)
      }
      slider.container.addEventListener('mouseover', () => {
        mouseOver = true
      })
      slider.container.addEventListener('mouseout', () => {
        mouseOver = false
        nextTimeout()
      })
      nextTimeout()
    },
  })

  useEffect(() => {
    if (isSlide || !autoplay || slides.length <= 1) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoplaySpeed)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isSlide, autoplay, autoplaySpeed, slides.length])

  const goToSlide = useCallback(
    (index: number) => {
      if (isSlide && instanceRef.current) instanceRef.current.moveToIdx(index)
      else setCurrentSlide(index)
    },
    [isSlide, instanceRef],
  )

  const nextSlide = useCallback(() => {
    if (isSlide && instanceRef.current) instanceRef.current.next()
    else setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [isSlide, slides.length, instanceRef])

  const prevSlide = useCallback(() => {
    if (isSlide && instanceRef.current) instanceRef.current.prev()
    else setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [isSlide, slides.length, instanceRef])

  const heightClass = {
    full: 'h-screen min-h-[500px]',
    large: 'h-[80vh]',
    medium: 'h-[60vh]',
  }[height]

  const rgb = hexToRgb(overlayColor)
  const overlayRgba = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)` : 'rgba(0,0,0,0.5)'

  const imageSizes = '100vw'

  return (
    <div className={`relative ${heightClass} w-full overflow-hidden md:-mt-24 md:pt-24 pt-24`}>
      {/* BACKGROUND IMAGES */}
      <div className="absolute inset-0 w-full h-full">
        {isSlide ? (
          <div ref={sliderRef} className="keen-slider h-full w-full">
            {slides.map((slide, idx) => {
              const rawUrl = typeof slide.media === 'string' ? slide.media : slide.media?.url
              const imageUrl = rawUrl ? optimizedCloudinaryUrl(rawUrl) : ''
              return (
                <div key={idx} className="keen-slider__slide relative w-full h-full">
                  {imageUrl && (
                    <Image
                      src={imageUrl}
                      alt=""
                      fill
                      className="object-cover"
                      priority={idx === 0}
                      fetchPriority={idx === 0 ? 'high' : 'auto'}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      sizes={imageSizes}
                    />
                  )}
                  <div className="absolute inset-0" style={{ background: overlayRgba }} />
                </div>
              )
            })}
          </div>
        ) : (
          slides.map((slide, idx) => {
            const rawUrl = typeof slide.media === 'string' ? slide.media : slide.media?.url
            const imageUrl = rawUrl ? optimizedCloudinaryUrl(rawUrl) : ''
            const isActive = currentSlide === idx
            const cinematicTransform =
              isCinematic && isActive
                ? idx % 2 === 0
                  ? 'scale-110 translate-x-2'
                  : 'scale-110 -translate-x-2'
                : 'scale-100'

            return (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-[1800ms] ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt=""
                    fill
                    className={`object-cover transition-transform duration-[14000ms] ${cinematicTransform}`}
                    priority={idx === 0}
                    fetchPriority={idx === 0 ? 'high' : 'auto'}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    sizes={imageSizes}
                  />
                )}
                <div className="absolute inset-0" style={{ background: overlayRgba }} />
              </div>
            )
          })
        )}
      </div>

      {/* RICH TEXT + CTA */}
      <div className="absolute inset-0 z-30 flex items-center justify-center text-white text-center">
        <div className="w-full h-full flex flex-col items-center justify-center md:px-32 lg:px-48 xl:px-64 pt-24">
          <div className={`max-w-4xl ${hasAnimated ? 'animate-[cinematicIn_1s_0.1s_both]' : ''}`}>
            {staticContent?.overlayText ? (
              <RichText data={staticContent.overlayText} enableProse={false} />
            ) : null}
            {staticContent?.cta?.url && (
              <div className="mt-10">
                <Link
                  href={staticContent.cta.url}
                  className="cta-button inline-block px-10 py-4 text-white font-medium transition-all duration-300 border-t-2 border-b-2 border-[#FFD28D] hover:bg-[#FFD28D] hover:text-black hover:border-transparent"
                >
                  {staticContent.cta.label || 'Learn More'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ARROWS & DOTS */}
      {showArrows && slides.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-40 pointer-events-none">
          <div className="flex justify-between items-center w-full 2xl:max-w-[1530px] mx-auto px-4 md:px-12 lg:px-16">
            <button
              onClick={prevSlide}
              className="pointer-events-auto text-white/50 hover:text-[#ffd28d] transition-all transform hover:scale-110 active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft size={56} strokeWidth={1} />
            </button>
            <button
              onClick={nextSlide}
              className="pointer-events-auto text-white/50 hover:text-[#ffd28d] transition-all transform hover:scale-110 active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight size={56} strokeWidth={1} />
            </button>
          </div>
        </div>
      )}

      {showDots && slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className="group py-2"
              aria-label={`Go to slide ${idx + 1}`}
            >
              <div
                className={`h-[2px] transition-all duration-500 ${currentSlide === idx ? 'bg-white w-12' : 'bg-white/30 group-hover:bg-white/60 w-8'}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
