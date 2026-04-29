import React from 'react'
import Image from 'next/image'
import type { Page } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { optimizedCloudinaryUrl } from '@/utilities/optimizedCloudinaryUrl'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  // Safely extract image URL and alt from the media object
  let imgUrl = ''
  let imgAlt = ''
  if (media && typeof media === 'object' && 'url' in media) {
    imgUrl = (media as any).url || ''
    imgAlt = (media as any).alt || ''
  } else if (typeof media === 'string') {
    imgUrl = ''
  }

  const optimizedSrc = imgUrl ? optimizedCloudinaryUrl(imgUrl) : ''

  return (
    <div className="">
      <div className="container mb-8">
        {richText && <RichText className="mb-6" data={richText} enableGutter={false} />}

        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-4">
            {links.map(({ link }, i) => (
              <li key={i}>
                <CMSLink {...link} />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="container">
        {optimizedSrc && (
          <div>
            <div className="-mx-4 md:-mx-8 2xl:-mx-16">
              <Image
                src={optimizedSrc}
                alt={imgAlt}
                width={1920}
                height={1080}
                className="w-full h-auto object-cover"
                priority
                sizes="100vw"
              />
            </div>
            {media && typeof media === 'object' && (media as any).caption && (
              <div className="mt-3">
                <RichText data={(media as any).caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
