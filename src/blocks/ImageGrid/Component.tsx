'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'

type GridItem = {
  richContent?: any
  title?: string
  image?: { url: string }
  link?: string
  buttonLabel?: string
  newTab?: boolean
}

type ImageGridProps = {
  heading?: string
  subheading?: string
  items?: GridItem[]
  transitionSpeed?: 'slow' | 'medium' | 'fast'
  columnHeight?: 'normal' | 'tall' | 'xtall'
  desktopHeight?: 'default' | 'taller' | 'xtall' | 'custom'
  customDesktopHeight?: number
  buttonStyle?: 'gold' | 'white'
  className?: string
}

const heightMap = {
  normal: 'min-h-[500px] sm:aspect-[4/3] lg:h-[450px] lg:aspect-auto',
  tall: 'min-h-[560px] sm:aspect-[3/4] lg:h-[550px] lg:aspect-auto',
  xtall: 'min-h-[640px] sm:aspect-[2/3] lg:h-[650px] lg:aspect-auto',
}

const speedMap = {
  slow: 1.2,
  medium: 0.9,
  fast: 0.6,
}

const buttonClasses = {
  gold: 'inline-block px-6 py-2 border border-white text-white text-sm uppercase tracking-wider transition-all duration-300 hover:bg-[#ffd28d] hover:text-black hover:border-[#ffd28d]',
  white:
    'inline-block px-6 py-2 border border-white text-white text-sm uppercase tracking-wider transition-all duration-300 hover:bg-white hover:text-black hover:border-white',
}

export const ImageGridBlock: React.FC<ImageGridProps> = ({
  heading,
  subheading,
  items = [],
  transitionSpeed = 'medium',
  columnHeight = 'tall',
  desktopHeight = 'default',
  customDesktopHeight,
  buttonStyle = 'gold',
  className,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const handleHover = (index: number) => {
    setActiveIndex(index)
    setHoveredIndex(index)
  }

  const handleLeave = () => {
    setHoveredIndex(null)
  }

  const heightClass = heightMap[columnHeight] || heightMap.tall
  const transitionDuration = speedMap[transitionSpeed] || 0.9

  // Desktop height override (applies to lg breakpoint)
  let desktopHeightClass = ''
  if (desktopHeight === 'taller') desktopHeightClass = 'lg:h-[600px] lg:aspect-auto'
  else if (desktopHeight === 'xtall') desktopHeightClass = 'lg:h-[700px] lg:aspect-auto'
  else if (desktopHeight === 'custom' && customDesktopHeight) {
    desktopHeightClass = `lg:h-[${customDesktopHeight}px] lg:aspect-auto`
  }

  const transitionStyle = {
    transition: `opacity ${transitionDuration}s ease, transform ${transitionDuration}s ease`,
  }

  return (
    <section className={cn('relative w-full py-8 md:py-12', className)}>
      {/* Headings */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mb-6">
        {(heading || subheading) && (
          <div className="text-center">
            {subheading && (
              <p className="text-sm uppercase tracking-wider text-[#ffd28d] mb-2">{subheading}</p>
            )}
            {heading && <h2 className="text-3xl md:text-4xl font-light">{heading}</h2>}
          </div>
        )}
      </div>

      {/* Full‑width Grid Container */}
      <div className="relative w-full">
        {/* Shared Background Images */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          {items.map((item, idx) => {
            const isActive = idx === activeIndex
            // Only scale on desktop
            const scaleClass = isActive ? 'lg:scale-105' : 'scale-100'
            return (
              <div
                key={idx}
                className={cn(
                  'absolute inset-0 w-full h-full bg-cover bg-center',
                  isActive ? 'opacity-100' : 'opacity-0',
                  scaleClass,
                )}
                style={{
                  backgroundImage: `url(${item.image?.url || ''})`,
                  ...transitionStyle,
                }}
              />
            )
          })}
        </div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-0" />

        {/* Grid Columns */}
        <div
          className={cn(
            'relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
            heightClass,
            desktopHeightClass,
          )}
        >
          {items.map((item, index) => {
            const isHovered = hoveredIndex === index
            const isLastMobile = index === items.length - 1
            const isOddTablet = (index + 1) % 2 !== 0
            const isFirstRowTablet = index < 2 && items.length > 2
            const isLastDesktop = (index + 1) % 4 === 0
            const isOddDesktop = (index + 1) % 4 !== 0

            return (
              <div
                key={index}
                className={cn(
                  'relative overflow-hidden cursor-pointer',
                  // Borders (unchanged)
                  !isLastMobile && 'border-b border-white/20 sm:border-b-0',
                  isOddTablet && 'sm:border-r border-white/20',
                  isFirstRowTablet && 'sm:border-b border-white/20 lg:border-b-0',
                  isOddDesktop && 'lg:border-r border-white/20',
                  !isOddTablet && 'sm:border-r-0',
                  isLastDesktop && 'lg:border-r-0',
                )}
                onMouseEnter={() => handleHover(index)}
                onMouseLeave={handleLeave}
              >
                {/* "After" overlay – expands from top on hover */}
                <div
                  className={cn(
                    'absolute top-0 left-0 w-full bg-[#051114] transition-all duration-400 z-10',
                    isHovered ? 'h-[20%]' : 'h-0',
                  )}
                />

                {/* Content wrapper */}
                <div
                  className={cn(
                    'absolute inset-0 flex flex-col items-center justify-center text-center p-6 transition-transform duration-300 ease-out z-20',
                    isHovered ? '-translate-y-6' : 'translate-y-0',
                  )}
                >
                  {item.richContent && (
                    <div className="mb-2 text-sm opacity-90">
                      <RichText data={item.richContent} enableGutter={false} />
                    </div>
                  )}
                  {item.title && (
                    <h3 className="text-xl sm:text-2xl font-light text-white mb-2">{item.title}</h3>
                  )}
                  {/* Button appears below content on hover */}
                  <div
                    className={cn(
                      'mt-4 transition-all duration-300',
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                    )}
                  >
                    {item.link && (
                      <Link
                        href={item.link}
                        target={item.newTab ? '_blank' : undefined}
                        rel={item.newTab ? 'noopener noreferrer' : undefined}
                        className={buttonClasses[buttonStyle]}
                      >
                        {item.buttonLabel || 'Learn More'}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
