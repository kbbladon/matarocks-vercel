'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import { optimizedCloudinaryUrl } from '@/utilities/optimizedCloudinaryUrl'

type SplitContentProps = {
  title?: string
  content?: any
  backgroundImage?: { url: string }
  overlayOpacity?: number
  textColor?: string
  verticalPadding?: 'sm' | 'md' | 'lg' | 'xl'
  enableButton?: boolean
  button?: {
    label?: string
    link?: string
    newTab?: boolean
    alignment?: 'left' | 'center' | 'right'
  }
  className?: string
}

const paddingMap = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
}

const alignmentClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export const SplitContentBlock: React.FC<SplitContentProps> = ({
  title,
  content,
  backgroundImage,
  overlayOpacity = 0.85,
  textColor = '#ffffff',
  verticalPadding = 'lg',
  enableButton = false,
  button,
  className,
}) => {
  const paddingClass = paddingMap[verticalPadding] || 'py-16'

  // Get the raw background URL and optimize it for Cloudinary
  const rawBgUrl = backgroundImage?.url || ''
  const optimizedBgUrl = rawBgUrl ? optimizedCloudinaryUrl(rawBgUrl) : ''

  const btnAlignment = button?.alignment || 'left'
  const alignmentClass = alignmentClasses[btnAlignment] || 'text-left'

  return (
    <section
      className={cn('relative w-full bg-cover bg-center bg-fixed', paddingClass, className)}
      style={{
        backgroundImage: optimizedBgUrl ? `url(${optimizedBgUrl})` : undefined,
        color: textColor,
      }}
    >
      {/* Dark overlay preserved exactly as before */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {title && <h2 className="text-3xl md:text-4xl text-center mb-12 font-light">{title}</h2>}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column: content + optional button */}
          <motion.div
            className="rounded-xl p-8 md:p-12 backdrop-blur-sm"
            style={{
              backgroundColor: `rgba(12, 12, 12, ${overlayOpacity})`,
            }}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <RichText data={content} enableGutter={false} />

            {enableButton && button?.link && (
              <div className={cn('mt-8', alignmentClass)}>
                <Link
                  href={button.link}
                  target={button.newTab ? '_blank' : undefined}
                  rel={button.newTab ? 'noopener noreferrer' : undefined}
                  className="btn-gold-live"
                >
                  {button.label || 'Dine With Us'}
                </Link>
              </div>
            )}
          </motion.div>

          {/* Right column: empty – shows the background image through */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  )
}
