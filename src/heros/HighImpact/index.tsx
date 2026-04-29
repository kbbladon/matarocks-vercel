'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import Image from 'next/image'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { optimizedCloudinaryUrl } from '@/utilities/optimizedCloudinaryUrl'

export const HighImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('dark')
  }, [setHeaderTheme])

  // Safely extract the image URL from the media object
  let imgUrl = ''
  let imgAlt = ''
  if (media && typeof media === 'object' && 'url' in media) {
    imgUrl = (media as any).url || ''
    imgAlt = (media as any).alt || ''
  } else if (typeof media === 'string') {
    // In rare cases media might be a string ID (not resolved), skip
    imgUrl = ''
  }

  const optimizedSrc = imgUrl ? optimizedCloudinaryUrl(imgUrl) : ''

  return (
    <div
      className="relative -mt-[10.4rem] flex items-center justify-center text-white w-full"
      data-theme="dark"
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 w-full h-full">
        <div className="relative w-full h-full min-h-[80vh]">
          {optimizedSrc && (
            <Image
              src={optimizedSrc}
              alt={imgAlt}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
        </div>
        {/* Optional: dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Centered Content Layer */}
      <div className="relative z-10 container mx-auto px-6 flex items-center justify-center min-h-[80vh]">
        <div className="max-w-[36.5rem] text-center">
          {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}
          {Array.isArray(links) && links.length > 0 && (
            <ul className="flex justify-center gap-4">
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
