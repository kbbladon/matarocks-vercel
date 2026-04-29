// app/(frontend)/[slug]/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import type { Metadata } from 'next'

type Args = {
  params: Promise<{ slug: string }>
}

const hexToRgba = (hex: string, alpha: number): string => {
  hex = hex.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const getImageUrl = (media: any): string | null => {
  if (!media || typeof media === 'string') return null
  if (typeof media === 'object' && 'url' in media) return media.url as string
  return null
}

const getPageData = cache(async (slug: string, draft = false) => {
  const payload = await getPayload({ config: configPromise })

  const [pageResult, settings] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      draft,
      select: {
        title: true,
        slug: true,
        hero: true,
        layout: true,
        meta: true,
        backgroundImage: true,
        overlayColor: true,
        overlayOpacity: true,
        contentWidth: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    payload.findGlobal({ slug: 'settings', depth: 1 }),
  ])

  const page = pageResult.docs[0] || null
  return { page, settings }
})

const getCachedPageData = (slug: string) =>
  unstable_cache(async () => getPageData(slug, false), [`page-${slug}`], {
    revalidate: 3600,
    tags: [`page-${slug}`],
  })()

export default async function Page({ params }: Args) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  const { isEnabled: isDraftMode } = await draftMode()

  const { page, settings } = isDraftMode
    ? await getPageData(decodedSlug, true)
    : process.env.NODE_ENV === 'production'
      ? await getCachedPageData(decodedSlug)
      : await getPageData(decodedSlug, false)

  if (!page) notFound()

  const bodyBgColor = settings?.colors?.bodyBgColor || '#040d10'
  const bodyFont = settings?.typography?.bodyFontFamily || 'Prompt, sans-serif'

  const overlayColor = page.overlayColor || '#0f3d2e'
  const overlayOpacity = page.overlayOpacity ?? 0.7
  const bgUrl = getImageUrl(page.backgroundImage)
  const contentWidth = page.contentWidth || 'contained'

  // Show the overlay colour if opacity > 0 (regardless of background image)
  const showOverlay = overlayOpacity > 0

  return (
    <div style={{ backgroundColor: bodyBgColor, fontFamily: bodyFont }}>
      {isDraftMode && <LivePreviewListener />}

      {/* All hero & content wrapped in a relative container for absolute layering */}
      <div className="relative">
        {/* BACKGROUND IMAGE (if any) – behind the overlay */}
        {bgUrl && (
          <img src={bgUrl} alt="" className="absolute inset-0 w-full h-full object-cover z-0" />
        )}

        {/* PAGE OVERLAY COLOUR – always present if showOverlay */}
        {showOverlay && (
          <div
            className="absolute inset-0 z-0"
            style={{ backgroundColor: hexToRgba(overlayColor, overlayOpacity) }}
          />
        )}

        {/* HERO & LAYOUT BLOCKS – appear above the background */}
        <div className="relative z-10">
          <RenderHero {...page.hero} />
          <div className={contentWidth === 'contained' ? 'max-w-7xl mx-auto px-4' : ''}>
            <RenderBlocks
              blocks={page.layout}
              settings={{
                headingFontFamily: settings?.typography?.headingFontFamily,
                bodyFontFamily: settings?.typography?.bodyFontFamily,
                primaryColor: settings?.colors?.primaryColor,
                secondaryColor: settings?.colors?.secondaryColor,
                linkColor: settings?.colors?.linkColor,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const { page } = await getPageData(decodedSlug, false)
  if (!page) return {}
  return generateMeta({ doc: page })
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    limit: 1000,
    where: { _status: { equals: 'published' } },
    select: { slug: true },
  })
  return pages.docs.map(({ slug }) => ({ slug: slug! }))
}
