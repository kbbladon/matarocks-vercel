'use client'

import React from 'react'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'
import type { Media as MediaType } from '@/payload-types'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

type LowGradientHeroProps = {
  gradientTitle?: DefaultTypedEditorState | null
  gradientSubtitle?: string | null
  gradientBackground?: MediaType | string | null
  gradientOverlayOpacity?: number | null
  gradientHeight?: string | null // e.g., '520px', '60vh', 'min-h-[500px]'
  className?: string
}

export const LowGradientHero: React.FC<LowGradientHeroProps> = ({
  gradientTitle,
  gradientSubtitle,
  gradientBackground,
  gradientOverlayOpacity = 0.6,
  gradientHeight = '520px',
  className,
}) => {
  const opacity = typeof gradientOverlayOpacity === 'number' ? gradientOverlayOpacity : 0.6
  const height = gradientHeight ?? '520px' // Handles null case

  return (
    <div className={cn('relative w-full overflow-hidden', className)} style={{ height }}>
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {gradientBackground ? (
          <Media
            resource={gradientBackground}
            fill
            imgClassName="object-cover"
            priority
            sizes="100vw"
            className="w-full h-full"
            pictureClassName="w-full h-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,${opacity}) 40%, rgba(0,0,0,${
            opacity * 0.6
          }) 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        {gradientTitle ? (
          <div className="max-w-4xl">
            <RichText data={gradientTitle} enableGutter={false} />
          </div>
        ) : (
          <p className="text-white/60">No title provided</p>
        )}

        {gradientSubtitle && (
          <p className="text-sm uppercase tracking-wider mt-4 text-[#ffd28d]">{gradientSubtitle}</p>
        )}
      </div>
    </div>
  )
}
