import type { Metadata } from 'next'
import type { Media, Page, Post, Config } from '../payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

export const getImageUrl = (image: any, serverUrl: string): string => {
  let url = serverUrl + '/website-template-OG.webp'
  if (image && typeof image === 'object' && 'url' in image) {
    // Safely access any size key
    const sizes = image.sizes as any
    const ogUrl = sizes?.og?.url
    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }
  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args
  const ogImage = getImageUrl(doc?.meta?.image, getServerSideURL())

  // Use meta title > doc title > fallback site name
  const pageTitle = doc?.meta?.title || doc?.title || ''
  const siteName = 'Mata Rocks Resort'
  const title = pageTitle ? `${pageTitle} | ${siteName}` : siteName

  return {
    title,
    description: doc?.meta?.description || '',
    keywords: (doc?.meta as any)?.keywords || '',
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
  }
}
