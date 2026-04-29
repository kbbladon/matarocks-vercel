import { formatDateTime } from '@/utilities/formatDateTime'
import React from 'react'
import Image from 'next/image'
import type { Post } from '@/payload-types'
import { formatAuthors } from '@/utilities/formatAuthors'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { optimizedCloudinaryUrl } from '@/utilities/optimizedCloudinaryUrl'

export const PostHero: React.FC<{ post: Post }> = async ({ post }) => {
  const { categories, heroImage, populatedAuthors, publishedAt, title } = post

  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({ slug: 'settings' })

  const secondaryColor = settings?.colors?.secondaryColor || '#E6B800'
  const linkColor = settings?.colors?.linkColor || '#FFD700'
  const headingFont = settings?.typography?.headingFontFamily || 'Baskervville, serif'
  const bodyFont = settings?.typography?.bodyFontFamily || 'Prompt, sans-serif'

  const hasAuthors = populatedAuthors?.length && formatAuthors(populatedAuthors) !== ''

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/posts' },
  ]

  const primaryCategory = categories?.[0]
  if (primaryCategory && typeof primaryCategory === 'object') {
    breadcrumbItems.push({
      label: primaryCategory.title,
      href: `/posts/category/${primaryCategory.slug}`,
    })
  }
  breadcrumbItems.push({ label: title, href: '' })

  const formattedDate = publishedAt ? formatDateTime(publishedAt) : null

  // Extract and optimize hero image URL
  const heroImageUrlRaw =
    heroImage && typeof heroImage === 'object' && 'url' in heroImage ? (heroImage as any).url : null
  const heroImageUrl = heroImageUrlRaw ? optimizedCloudinaryUrl(heroImageUrlRaw) : null

  return (
    <div className="relative -mt-[10.4rem] flex items-end min-h-[70vh]">
      <div className="absolute inset-0">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      <div className="container relative z-10 lg:grid lg:grid-cols-[1fr_48rem_1fr] text-white pb-8">
        <div className="col-start-1 col-span-1 md:col-start-2 md:col-span-2">
          <h1 className="mb-6 text-3xl md:text-5xl lg:text-6xl" style={{ fontFamily: headingFont }}>
            {title}
          </h1>

          <div className="mb-4">
            <Breadcrumbs items={breadcrumbItems} linkColor={linkColor} />
          </div>

          <div className="flex items-center gap-4 text-sm mb-6" style={{ fontFamily: bodyFont }}>
            {primaryCategory && typeof primaryCategory === 'object' && (
              <span
                className="px-3 py-1 border-2"
                style={{
                  borderColor: secondaryColor,
                  color: secondaryColor,
                  fontFamily: headingFont,
                }}
              >
                {primaryCategory.title}
              </span>
            )}
            {formattedDate && (
              <time dateTime={publishedAt!} className="text-white/80">
                {formattedDate}
              </time>
            )}
          </div>

          {hasAuthors && (
            <div className="flex flex-col gap-1" style={{ fontFamily: bodyFont }}>
              <p className="text-sm text-white/60">Author</p>
              <p>{formatAuthors(populatedAuthors)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
