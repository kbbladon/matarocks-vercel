'use client'

import type { StaticImageData } from 'next/image'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'
import type { MediaBlock as MediaBlockProps } from '@/payload-types'
import { Media } from '../../components/Media'

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

  // Use caption from props if provided, otherwise fallback to media.caption
  let caption = captionFromProps
  if (!caption && media && typeof media === 'object') caption = media.caption

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment]

  const imageWrapperStyle: React.CSSProperties = {}
  if (width) {
    imageWrapperStyle.maxWidth = `${width}px`
    imageWrapperStyle.marginLeft = alignment === 'center' ? 'auto' : undefined
    imageWrapperStyle.marginRight = alignment === 'center' ? 'auto' : undefined
  }

  const ImageElement = (
    <div
      className={cn(
        'relative inline-block',
        alignment === 'center' && 'mx-auto',
        alignment === 'left' && 'mr-auto',
        alignment === 'right' && 'ml-auto',
      )}
      style={imageWrapperStyle}
    >
      {/* Background wrapper (if enabled) */}
      <div
        className={cn(
          enableBackground && backgroundColor,
          enableBackground && backgroundPadding,
          roundedCorners,
        )}
        style={enableBackground ? { backgroundColor } : undefined}
      >
        <Media
          imgClassName={cn('border border-border rounded-[0.8rem]', imgClassName)}
          resource={media}
          src={staticImage}
        />
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
          {ImageElement}
        </Link>
      ) : (
        ImageElement
      )}
      {caption && (
        <div
          className={cn(
            'mt-6',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          <RichText data={caption} enableGutter={false} />
        </div>
      )}
    </div>
  )

  if (!enableGutter) return content

  return <div className="container">{content}</div>
}
