'use client'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import React from 'react'
import { motion } from 'framer-motion'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'

type Props = { className?: string } & ContentBlockProps

// Helper to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const ContentBlock: React.FC<Props> = ({
  className,
  columns,
  containerMaxWidth,
  backgroundColor,
  backgroundOpacity,
}) => {
  const sizeToClass = {
    full: 'lg:col-span-12',
    half: 'lg:col-span-6',
    oneThird: 'lg:col-span-4',
    twoThirds: 'lg:col-span-8',
  }

  const buttonAlignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }
  const opacity = backgroundOpacity ?? 1
  // Background style
  let bgStyle: React.CSSProperties = {}
  if (backgroundColor && backgroundColor !== 'transparent') {
    if (opacity < 1) {
      bgStyle.backgroundColor = hexToRgba(backgroundColor, opacity)
    } else {
      bgStyle.backgroundColor = backgroundColor
    }
  } else {
    bgStyle.backgroundColor = 'transparent'
  }

  // Container width style
  const containerStyle: React.CSSProperties = containerMaxWidth
    ? { maxWidth: `${containerMaxWidth}px` }
    : {}

  return (
    <section className={cn('w-full py-6 lg:py-8', className)} style={bgStyle}>
      <div className="flex justify-center px-6">
        <div className="w-full" style={containerStyle}>
          <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-12 gap-x-8 lg:gap-x-16">
            {columns?.map((col, index) => {
              const enableLink = col.enableLink ?? false
              const link = col.link
              const richText = col.richText
              const size = col.size ?? 'full'
              const buttonAlignment = (link as any)?.alignment ?? 'center'
              const alignmentClass =
                buttonAlignmentClasses[buttonAlignment as keyof typeof buttonAlignmentClasses] ||
                'text-center'
              const spanClass = sizeToClass[size] || 'lg:col-span-4'

              return (
                <motion.div
                  key={index}
                  className={cn('col-span-4 flex flex-col', spanClass)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={fadeUpVariant}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  {richText && (
                    <div className="w-full">
                      <RichText data={richText} enableGutter={false} />
                    </div>
                  )}
                  {enableLink && link && (
                    <div className={cn('mt-8', alignmentClass)}>
                      <CMSLink {...link} className="btn-gold-live" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContentBlock
