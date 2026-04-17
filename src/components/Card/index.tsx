'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

import type { Post } from '@/payload-types'
import { Media } from '@/components/Media'

// Update the type to reflect that we primarily rely on meta.image,
// but keep heroImage as an optional fallback.
export type CardPostData = Pick<Post, 'slug' | 'categories' | 'meta' | 'title' | 'heroImage'>

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
  linkColor?: string
  shadowColor?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const {
    className,
    doc,
    relationTo,
    showCategories,
    title: titleFromProps,
    linkColor = '#FFD700',
    shadowColor = '#ffa01a',
  } = props

  const { slug, categories, meta, title, heroImage } = doc || {}
  const { description, image: metaImage } = meta || {}

  // Primary image = meta.image, fallback to heroImage (optional)
  const imageToUse = metaImage

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const titleToUse = titleFromProps || title
  const sanitizedDescription = description?.replace(/\s/g, ' ')
  const href = `/${relationTo}/${slug}`
  console.log('meta.image:', metaImage)
  console.log('heroImage:', heroImage)
  return (
    <article
      className={cn(
        'border border-white rounded-lg overflow-hidden bg-card hover:cursor-pointer transition-shadow duration-300 h-full flex flex-col',
        className,
      )}
      style={{ boxShadow: `4px 6px 4px 0px ${shadowColor}` }}
      ref={card.ref}
    >
      {/* Image container with fixed aspect ratio */}
      <div className="relative w-full aspect-video bg-gray-800">
        {imageToUse && typeof imageToUse === 'object' && imageToUse.url ? (
          <img
            src={imageToUse.url}
            alt={imageToUse.alt || ''}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No image
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        {showCategories && hasCategories && (
          <div className="uppercase text-sm mb-2 text-gray-400">
            {categories.map((category, index) => {
              if (typeof category === 'object' && category.title) {
                const isLast = index === categories.length - 1
                return (
                  <Fragment key={index}>
                    {category.title}
                    {!isLast && <Fragment>, &nbsp;</Fragment>}
                  </Fragment>
                )
              }
              return null
            })}
          </div>
        )}

        {titleToUse && (
          <h3 className="text-xl font-semibold">
            <Link
              href={href}
              ref={link.ref}
              className="hover:underline"
              style={{ color: linkColor }}
            >
              {titleToUse}
            </Link>
          </h3>
        )}

        {description && (
          <div className="mt-2">
            <p className="text-gray-400 text-sm line-clamp-3">{sanitizedDescription}</p>
          </div>
        )}
      </div>
    </article>
  )
}
