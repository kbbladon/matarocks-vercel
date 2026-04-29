'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import { optimizedCloudinaryUrl } from '@/utilities/optimizedCloudinaryUrl'

type ImageItem = {
  image?: { url: string; alt?: string }
  alt?: string
  link?: string
  newTab?: boolean
}

type ImageRowProps = {
  images?: ImageItem[]
  imageHeight?: number
  gap?: number
  desktopWidth?: string
  mobileWidth?: string
  borderRadius?: string
  boxShadow?: string
  justifyContent?: string
  verticalPadding?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const paddingMap = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
}

export const ImageRowBlock: React.FC<ImageRowProps> = ({
  images = [],
  imageHeight = 300,
  gap = 20,
  desktopWidth = '45%',
  mobileWidth = '85%',
  borderRadius = '8px',
  boxShadow = '7px 7px 18px 1px #333',
  justifyContent = 'space-around',
  verticalPadding = 'md',
  className,
}) => {
  const paddingClass = paddingMap[verticalPadding] || 'py-12'

  // Build a responsive sizes string from the percentage values
  const mobileSizes = mobileWidth.replace('%', 'vw')
  const desktopSizes = desktopWidth.replace('%', 'vw')
  const imageSizes = `(max-width: 767px) ${mobileSizes}, ${desktopSizes}`

  return (
    <section className={cn('w-full', paddingClass, className)}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <style>
          {`
            .image-row-container {
              display: flex;
              flex-wrap: wrap;
              gap: ${gap}px;
              justify-content: ${justifyContent};
            }
            .image-row-item {
              flex: 0 0 ${mobileWidth};
              max-width: ${mobileWidth};
            }
            @media (min-width: 768px) {
              .image-row-item {
                flex: 0 0 ${desktopWidth};
                max-width: ${desktopWidth};
              }
            }
            .image-row-img {
              border-radius: ${borderRadius};
              box-shadow: ${boxShadow || 'none'};
              height: ${imageHeight}px;
              object-fit: cover;
              width: 100%;
            }
          `}
        </style>
        <div className="image-row-container">
          {images.map((item, idx) => {
            const imageUrl = item.image?.url
            if (!imageUrl) return null // skip empty images

            const altText = item.alt || item.image?.alt || ''
            const linkUrl = item.link

            const img = (
              <Image
                src={optimizedCloudinaryUrl(imageUrl)}
                alt={altText}
                width={800} // intrinsic size; actual display is determined by CSS + sizes
                height={imageHeight}
                className="image-row-img"
                sizes={imageSizes} // tells the browser how wide the image will be
              />
            )

            if (linkUrl) {
              return (
                <Link
                  key={idx}
                  href={linkUrl}
                  target={item.newTab ? '_blank' : undefined}
                  rel={item.newTab ? 'noopener noreferrer' : undefined}
                  className="image-row-item"
                >
                  {img}
                </Link>
              )
            }
            return (
              <div key={idx} className="image-row-item">
                {img}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
