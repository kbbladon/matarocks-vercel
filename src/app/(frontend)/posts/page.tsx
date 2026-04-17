import type { Metadata } from 'next/types'
import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import { Sidebar } from '@/components/Sidebar'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const currentPage = page ? parseInt(page) : 1

  const payload = await getPayload({ config: configPromise })

  const settings = await payload.findGlobal({ slug: 'settings' })

  const { docs: categories } = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 100,
    sort: 'title',
  })

  const posts = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 12,
    page: currentPage,
    where: { _status: { equals: 'published' } },
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true,
      excerpt: true,
      publishedAt: true,
    },
  })

  const { docs: recentPosts } = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 5,
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    select: {
      title: true,
      slug: true,
      heroImage: true,
      publishedAt: true,
    },
  })

  const primaryColor = settings?.colors?.primaryColor || '#FFD700'
  const secondaryColor = settings?.colors?.secondaryColor || '#E6B800'
  const linkColor = settings?.colors?.linkColor || secondaryColor
  const bodyBgColor = settings?.colors?.bodyBgColor || '#040d10'
  const headingFont = settings?.typography?.headingFontFamily || 'Baskervville, serif'
  const bodyFont = settings?.typography?.bodyFontFamily || 'Prompt, sans-serif'

  const logoAlt =
    typeof settings?.branding?.logo === 'object' && settings.branding.logo?.alt
      ? settings.branding.logo.alt
      : 'our site'

  return (
    <div
      className="pt-24 pb-24"
      style={{
        backgroundColor: bodyBgColor,
        fontFamily: bodyFont,
      }}
    >
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1
            style={{
              color: primaryColor,
              fontFamily: headingFont,
            }}
          >
            Blog
          </h1>
          {settings?.branding?.logo && (
            <p className="text-muted-foreground">Welcome to the official blog of {logoAlt}</p>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="container mb-8">
        <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: headingFont }}>
          Filter by Category
        </h2>
        <div className="flex flex-wrap gap-3">
          {/* "All Blogs" pill */}
          <Link
            href="/posts"
            prefetch={true}
            className="px-4 py-2 border rounded-full text-sm transition-all duration-200 hover:scale-105 hover:shadow-md"
            style={{
              borderColor: linkColor,
              color: '#fff',
              backgroundColor: linkColor,
            }}
          >
            All Blogs
          </Link>

          {/* Category pills */}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/posts/category/${cat.slug}`}
              prefetch={true}
              className="px-4 py-2 border rounded-full text-sm transition-all duration-200 hover:scale-105 hover:shadow-md flex items-center gap-2"
              style={{
                borderColor: linkColor,
                color: linkColor,
                backgroundColor: 'transparent',
              }}
            >
              {cat.image && typeof cat.image === 'object' && (
                <Image
                  src={cat.image.url!}
                  alt={cat.title}
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
              )}
              {cat.title}
            </Link>
          ))}
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="posts"
          currentPage={posts.page}
          limit={12}
          totalDocs={posts.totalDocs}
        />
      </div>

      <CollectionArchive posts={posts.docs} linkColor={linkColor} shadowColor={secondaryColor} />

      <div className="container">
        {posts.totalPages > 1 && posts.page && (
          <Pagination page={posts.page} totalPages={posts.totalPages} basePath="/posts" />
        )}
      </div>

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
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const settings = await payload.findGlobal({ slug: 'settings' })

  return {
    title: settings?.defaultSeo?.title || 'Blog',
    description: settings?.defaultSeo?.description || 'Read the latest articles and updates.',
  }
}
