'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type VideoHeroProps = {
  mediaType?: 'youtube' | 'upload'
  youtubeUrl?: string
  uploadedVideo?: { url: string }
  mobilePlaceholder?: { url: string }
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  overlayOpacity?: number
  title?: string
  subtitle?: string
  description?: any
  enableButton?: boolean
  button?: {
    label?: string
    link?: string
    newTab?: boolean
  }
  verticalPadding?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  className?: string
}

const paddingMap = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
  '2xl': 'py-32',
  '3xl': 'py-40',
}

const extractYouTubeID = (url: string) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export const VideoHeroBlock: React.FC<VideoHeroProps> = ({
  mediaType = 'youtube',
  youtubeUrl,
  uploadedVideo,
  mobilePlaceholder,
  autoplay = true,
  loop = true,
  muted = true,
  controls = false,
  overlayOpacity = 0.5,
  title,
  subtitle,
  description,
  enableButton = false,
  button,
  verticalPadding = 'lg',
  className,
}) => {
  const paddingClass = paddingMap[verticalPadding] || 'py-16'
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const videoUrl = uploadedVideo?.url || ''
  const placeholderUrl = mobilePlaceholder?.url || ''

  // YouTube embed URL
  let embedUrl = ''
  if (mediaType === 'youtube' && youtubeUrl) {
    const videoId = extractYouTubeID(youtubeUrl)
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`
      const params = new URLSearchParams()
      if (autoplay) params.set('autoplay', '1')
      if (loop) params.set('loop', '1')
      if (muted) params.set('mute', '1')
      if (!controls) params.set('controls', '0')
      if (loop && videoId) params.set('playlist', videoId)
      embedUrl += `?${params.toString()}`
    }
  }

  const showVideo = !isMobile || !placeholderUrl

  return (
    <section className={cn('relative w-full overflow-hidden mb-16', paddingClass, className)}>
      {/* Background Video / Placeholder – guaranteed full cover, no black bars */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {showVideo ? (
          <>
            {mediaType === 'youtube' && embedUrl ? (
              // 200% scaling technique ensures the iframe covers the container edge‑to‑edge
              <iframe
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              />
            ) : mediaType === 'upload' && videoUrl ? (
              <video
                autoPlay={autoplay}
                loop={loop}
                muted={muted}
                playsInline
                className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
              >
                <source src={videoUrl} type="video/mp4" />
              </video>
            ) : null}
          </>
        ) : (
          placeholderUrl && (
            <Image
              src={placeholderUrl}
              alt="Video placeholder"
              fill
              sizes="100vw" // ✅ added sizes prop for performance
              className="object-cover"
              priority
            />
          )
        )}
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 text-center text-white">
        {subtitle && (
          <motion.p
            className="text-sm uppercase tracking-wider mb-4 text-[#ffd28d] inline-flex items-center gap-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {subtitle}
            <ArrowRight className="w-4 h-4" />
          </motion.p>
        )}

        {title && (
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {title}
          </motion.h1>
        )}

        {description && (
          <motion.div
            className="max-w-3xl mx-auto mt-6 text-base md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <RichText data={description} enableGutter={false} />
          </motion.div>
        )}

        {enableButton && button?.link && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href={button.link}
              target={button.newTab ? '_blank' : undefined}
              rel={button.newTab ? 'noopener noreferrer' : undefined}
              className="btn-gold-live"
            >
              {button.label || 'View Tours'}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
