import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers' // ✅ Import
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { LivePreviewListener } from '@/components/LivePreviewListener' // ✅ Your existing component
import type { Metadata } from 'next'

type Args = {
  params: Promise<{ slug: string }>
}

const getPageData = cache(async (slug: string, draft = false) => {
  // ✅ Accept draft flag
  const payload = await getPayload({ config: configPromise })

  const [pageResult, settings] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
      draft: draft, // ✅ Pass draft mode
      select: {
        title: true,
        slug: true,
        hero: true,
        layout: true,
        meta: true,
      },
    }),
    payload.findGlobal({
      slug: 'settings',
      depth: 1,
    }),
  ])

  const page = pageResult.docs[0] || null
  return { page, settings }
})

// Only cache published data; never cache draft data
const getCachedPageData = (slug: string) =>
  unstable_cache(async () => getPageData(slug, false), [`page-${slug}`], {
    revalidate: 3600,
    tags: [`page-${slug}`],
  })()

export default async function Page({ params }: Args) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  // ✅ Enable Draft Mode
  const { isEnabled: isDraftMode } = await draftMode()

  // ✅ Fetch data with draft flag when previewing
  const { page, settings } = isDraftMode
    ? await getPageData(decodedSlug, true) // Draft – no cache
    : process.env.NODE_ENV === 'production'
      ? await getCachedPageData(decodedSlug) // Published + cached
      : await getPageData(decodedSlug, false) // Published, dev

  if (!page) {
    notFound()
  }

  const bodyBgColor = settings?.colors?.bodyBgColor || '#040d10'
  const bodyFont = settings?.typography?.bodyFontFamily || 'Prompt, sans-serif'

  return (
    <div style={{ backgroundColor: bodyBgColor, fontFamily: bodyFont }}>
      {/* ✅ LivePreviewListener only renders during preview */}
      {isDraftMode && <LivePreviewListener />}

      <RenderHero {...page.hero} />
      <RenderBlocks blocks={page.layout} />
    </div>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  // Metadata doesn't need draft data
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
