'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, ChevronDown, GripVertical } from 'lucide-react'
import { cn } from '@/utilities/ui'
import type { Category, Post } from '@/payload-types'

type RecentPost = Pick<Post, 'id' | 'title' | 'slug' | 'heroImage' | 'publishedAt'>

type StyleProps = {
  primaryColor?: string
  secondaryColor?: string
  linkColor?: string
  bodyBgColor?: string
  headingFont?: string
  bodyFont?: string
}

type Props = {
  categories: Category[]
  recentPosts: RecentPost[]
} & StyleProps

export const Sidebar: React.FC<Props> = ({
  categories,
  recentPosts,
  primaryColor = '#FFD700',
  secondaryColor = '#E6B800',
  linkColor = '#FFD700',
  bodyBgColor = '#040d10',
  headingFont = 'Baskervville, serif',
  bodyFont = 'Prompt, sans-serif',
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const SidebarContent = () => (
    <div className="space-y-8" style={{ fontFamily: bodyFont }}>
      <div>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: secondaryColor, fontFamily: headingFont }}
        >
          Categories
        </h3>
        <ul className="space-y-2">
          <li>
            <Link
              href="/posts"
              className="transition"
              style={{ color: linkColor }}
              onClick={() => {
                setIsDrawerOpen(false)
                setIsDropdownOpen(false)
              }}
            >
              All Posts
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/posts/category/${cat.slug}`}
                className="flex items-center gap-2 transition"
                style={{ color: linkColor }}
                onClick={() => {
                  setIsDrawerOpen(false)
                  setIsDropdownOpen(false)
                }}
              >
                {cat.image && typeof cat.image === 'object' && cat.image.url && (
                  <Image
                    src={cat.image.url}
                    alt={cat.title}
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                )}
                {cat.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: secondaryColor, fontFamily: headingFont }}
        >
          Recent Posts
        </h3>
        <ul className="space-y-4">
          {recentPosts.map((post) => (
            <li key={post.id} className="flex gap-3">
              {/* Uniform square image container */}
              <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden bg-gray-800">
                {post.heroImage && typeof post.heroImage === 'object' && post.heroImage.url ? (
                  <Image src={post.heroImage.url} alt={post.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/posts/${post.slug}`}
                  className="text-sm font-medium transition line-clamp-2"
                  style={{ color: linkColor }}
                  onClick={() => {
                    setIsDrawerOpen(false)
                    setIsDropdownOpen(false)
                  }}
                >
                  {post.title}
                </Link>
                {post.publishedAt && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  // Mobile: top dropdown
  if (isMobile) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3 border rounded-lg text-left"
          style={{
            borderColor: secondaryColor,
            color: secondaryColor,
            fontFamily: bodyFont,
            backgroundColor: bodyBgColor,
          }}
        >
          <span className="font-medium">Explore</span>
          <ChevronDown
            size={18}
            className={cn('transition-transform', isDropdownOpen && 'rotate-180')}
          />
        </button>
        {isDropdownOpen && (
          <div
            className="mt-4 p-4 border border-white/10 rounded-lg"
            style={{ backgroundColor: bodyBgColor }}
          >
            <SidebarContent />
          </div>
        )}
      </div>
    )
  }

  // Desktop: left-side vertical tab
  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-30 px-2 py-6 rounded-r-lg shadow-lg flex flex-col items-center gap-1"
        style={{
          backgroundColor: bodyBgColor,
          borderColor: secondaryColor,
          color: secondaryColor,
          borderWidth: 1,
          borderStyle: 'solid',
          borderLeft: 'none',
        }}
      >
        <GripVertical size={20} />
        <span
          className="text-xs font-medium"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: headingFont,
          }}
        >
          EXPLORE
        </span>
      </button>

      {/* Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsDrawerOpen(false)} />
      )}

      {/* Drawer panel - slides from left */}
      <div
        className={cn(
          'fixed top-0 left-0 h-full w-80 border-r border-white/10 z-50 transition-transform duration-300 overflow-y-auto',
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        style={{ backgroundColor: bodyBgColor }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3
              className="text-lg font-semibold"
              style={{ color: secondaryColor, fontFamily: headingFont }}
            >
              Explore
            </h3>
            <button onClick={() => setIsDrawerOpen(false)}>
              <X size={20} className="text-white" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>
    </>
  )
}
