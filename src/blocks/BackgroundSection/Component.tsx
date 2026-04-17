'use client'

import React from 'react'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { cn } from '@/utilities/ui'

type BackgroundSectionProps = {
  backgroundImage?: { url: string }
  overlayColor?: string
  overlayOpacity?: number
  contentWidth?: 'contained' | 'full'
  innerBackground?: string
  verticalPadding?: 'sm' | 'md' | 'lg' | 'xl'
  blocks?: any[]
  className?: string
}

const paddingMap = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-20',
  xl: 'py-28',
}

// Helper to convert hex to rgba
const hexToRgba = (hex: string, opacity: number): string => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

export const BackgroundSectionBlock: React.FC<BackgroundSectionProps> = ({
  backgroundImage,
  overlayColor = '#0f3d2e',
  overlayOpacity = 0.7,
  contentWidth = 'contained',
  innerBackground,
  verticalPadding = 'lg',
  blocks = [],
  className,
}) => {
  const paddingClass = paddingMap[verticalPadding] || 'py-20'
  const imageUrl = backgroundImage?.url

  // Build the overlay as a solid colour with opacity using rgba
  const overlayRgba = hexToRgba(overlayColor, overlayOpacity)

  // Background style: solid colour + image (if provided)
  const bgStyle: React.CSSProperties = imageUrl
    ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: overlayRgba,
        backgroundBlendMode: 'normal', // you can change to 'multiply', 'overlay', etc.
      }
    : { backgroundColor: overlayRgba }

  const innerWidthClass =
    contentWidth === 'contained'
      ? 'max-w-7xl mx-auto px-6 md:px-10 lg:px-16'
      : 'px-6 md:px-10 lg:px-16'

  return (
    <section className={cn('w-full', paddingClass, className)} style={bgStyle}>
      <div className={innerWidthClass}>
        {innerBackground ? (
          <div className="p-8 rounded-xl" style={{ backgroundColor: innerBackground }}>
            <RenderBlocks blocks={blocks} />
          </div>
        ) : (
          <RenderBlocks blocks={blocks} />
        )}
      </div>
    </section>
  )
}
