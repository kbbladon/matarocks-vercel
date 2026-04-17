import type { Metadata } from 'next'
import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from '../../page.client'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import Image from 'next/image'

export const dynamic = 'force-static'
export const revalidate = 600

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 100,
  })
  return categories.map((cat) => ({ slug: cat.slug }))
}

type Args = {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs: categories } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const category = categories[0]
  // ✅ Add this line here
  console.log('Category image:', category.image)
  if (!category) notFound()

  const settings = await payload.findGlobal({ slug: 'settings' })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    where: {
      _status: { equals: 'published' },
      'categories.slug': { equals: slug },
    },
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true, // ✅ Correct field name
      excerpt: true,
      publishedAt: true,
    },
  })

  const primaryColor = settings?.colors?.primaryColor || '#FFD700'
  const secondaryColor = settings?.colors?.secondaryColor || '#E6B800'
  const linkColor = settings?.colors?.linkColor || secondaryColor
  const bodyBgColor = settings?.colors?.bodyBgColor || '#040d10'
  const headingFont = settings?.typography?.headingFontFamily || 'Baskervville, serif'
  const bodyFont = settings?.typography?.bodyFontFamily || 'Prompt, sans-serif'

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/posts' },
    { label: category.title },
  ]

  return (
    <div className="pt-24 pb-24" style={{ backgroundColor: bodyBgColor, fontFamily: bodyFont }}>
      <PageClient />
      <div className="container mb-4">
        <Breadcrumbs items={breadcrumbItems} linkColor={linkColor} />
      </div>

      {category.image && typeof category.image === 'object' && (
        <div className="container mb-6">
          <div className="relative h-64 w-full rounded-lg overflow-hidden">
            <Image src={category.image.url!} alt={category.title} fill className="object-cover" />
          </div>
        </div>
      )}

      <div className="container mb-8">
        <h1 style={{ color: primaryColor, fontFamily: headingFont }}>Category: {category.title}</h1>
      </div>

      <CollectionArchive posts={posts.docs} linkColor={linkColor} shadowColor={secondaryColor} />
    </div>
  )
}
