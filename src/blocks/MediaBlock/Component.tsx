'use client'

import type { StaticImageData } from 'next/image'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'
import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { optimizedCloudinaryUrl } from '@/utilities/optimizedCloudinaryUrl'

type Props = MediaBlockProps & {
  breakout?: boolean
  captionClassName?: string
  className?: string
  enableGutter?: boolean
  imgClassName?: string
  staticImage?: StaticImageData
  disableInnerContainer?: boolean
  // New props from config
  width?: number
  alignment?: 'left' | 'center' | 'right'
  enableBackground?: boolean
  backgroundColor?: string
  backgroundPadding?: string
  roundedCorners?: string
  enableOverlay?: boolean
  overlayOpacity?: number
  caption?: any
  link?: string
  newTab?: boolean
}

export const MediaBlock: React.FC<Props> = (props) => {
  const {
    captionClassName,
    className,
    enableGutter = true,
    imgClassName,
    media,
    staticImage,
    disableInnerContainer,
    // New props
    width,
    alignment = 'center',
    enableBackground = false,
    backgroundColor = '#000000',
    backgroundPadding = 'p-6',
    roundedCorners = 'rounded-md',
    enableOverlay = false,
    overlayOpacity = 0.5,
    caption: captionFromProps,
    link,
    newTab = false,
  } = props

  // Determine the image source (dynamic media vs static import)
  const imgSrc =
    media && typeof media === 'object' && 'url' in media
      ? ((media as any).url as string)
      : staticImage?.src || ''

  // Apply Cloudinary auto‑optimizations (f_auto,q_auto) and explicit width if needed
  const optimizedSrc = optimizedCloudinaryUrl(
    imgSrc,
    width ?? undefined, // pass width only if defined
  )

  // Caption logic
  let caption = captionFromProps
  if (!caption && media && typeof media === 'object') caption = (media as any).caption

  // Alignment mapping
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment]

  // If a specific width is set, we use it as a max‑width container.
  // Next.js Image with `fill` is used when no fixed width is given,
  // so we need a relative container with defined aspect‑ratio.
  const isFixedWidth = Boolean(width)

  const imageElement = (
    <div
      className={cn(
        'relative inline-block',
        alignment === 'center' && 'mx-auto',
        alignment === 'left' && 'mr-auto',
        alignment === 'right' && 'ml-auto',
      )}
      style={isFixedWidth ? { maxWidth: `${width}px` } : undefined}
    >
      {/* Background wrapper (if enabled) */}
      <div
        className={cn(
          enableBackground && backgroundColor,
          enableBackground && backgroundPadding,
          roundedCorners,
          'overflow-hidden', // ensures the image respects rounded corners
        )}
        style={enableBackground ? { backgroundColor } : undefined}
      >
        {isFixedWidth ? (
          // Fixed‑width image: use the width/height from media metadata
          <Image
            src={optimizedSrc}
            alt={(media as any)?.alt || ''}
            width={width}
            height={
              media && typeof media === 'object'
                ? Math.round((width! / (media as any).width) * (media as any).height)
                : 800
            }
            className={cn('rounded-[0.8rem] border border-border', imgClassName)}
            sizes={`${width}px`}
          />
        ) : (
          // Fluid image: fill the available container
          <div className="relative w-full aspect-[16/9]">
            <Image
              src={optimizedSrc}
              alt={(media as any)?.alt || ''}
              fill
              className={cn('rounded-[0.8rem] border border-border object-cover', imgClassName)}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}
      </div>

      {/* Overlay (if enabled) */}
      {enableOverlay && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[0.8rem]"
          style={{
            background: `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${overlayOpacity}))`,
          }}
        />
      )}
    </div>
  )

  const content = (
    <div className={cn('my-8', alignmentClass, className)}>
      {link ? (
        <Link
          href={link}
          target={newTab ? '_blank' : undefined}
          rel={newTab ? 'noopener noreferrer' : undefined}
        >
          {imageElement}
        </Link>
      ) : (
        imageElement
      )}
      {caption && (
        <div className={cn('mt-6', { container: !disableInnerContainer }, captionClassName)}>
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )

  if (!enableGutter) return content

  return <div className="container">{content}</div>
}
