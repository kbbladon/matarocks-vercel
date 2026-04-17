import type { Metadata } from 'next'
import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import type { Post } from '@/payload-types'
import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Sidebar } from '@/components/Sidebar'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return posts.docs.map(({ slug }) => ({ slug }))
}

type Args = { params: Promise<{ slug?: string }> }

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />

  const payload = await getPayload({ config: configPromise })

  // Fetch sidebar data
  const { docs: categories } = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 100,
    sort: 'title',
  })
  const { docs: recentPosts } = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 5,
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    select: { title: true, slug: true, heroImage: true, publishedAt: true },
  })

  const settings = await payload.findGlobal({ slug: 'settings' })
  const primaryColor = settings?.colors?.primaryColor || '#FFD700'
  const secondaryColor = settings?.colors?.secondaryColor || '#E6B800'
  const linkColor = settings?.colors?.linkColor || secondaryColor
  const bodyBgColor = settings?.colors?.bodyBgColor || '#040d10'
  const headingFont = settings?.typography?.headingFontFamily || 'Baskervville, serif'
  const bodyFont = settings?.typography?.bodyFontFamily || 'Prompt, sans-serif'

  return (
    <article className="pt-16 pb-16" style={{ backgroundColor: bodyBgColor, fontFamily: bodyFont }}>
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}

      {/* Hero image will display if post.heroImage exists */}
      <PostHero post={post} />

      <div className="flex flex-col items-center gap-4 pt-8">
        <div className="container">
          <div className="prose-wrapper">
            <RichText
              className="max-w-[48rem] mx-auto shadow-[1px_3px_9px_6px_#f7d188] p-[20px] mb-8 md:mb-0"
              data={post.content}
              enableGutter={false}
            />
          </div>
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((p) => typeof p === 'object')}
            />
          )}
        </div>
      </div>

      {/* Sidebar - desktop: floating button, mobile: top dropdown */}
      <Sidebar
        categories={categories}
        recentPosts={recentPosts}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        linkColor={linkColor}
        bodyBgColor={bodyBgColor}
        headingFont={headingFont}
        bodyFont={bodyFont}
      />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })
  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})
