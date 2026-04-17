'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'

type CardItem = {
  image?: { url: string }
  buttonLabel?: string
  buttonLink?: string
  newTab?: boolean
  richContent?: any
}

type CardsProps = {
  heading?: any
  items?: CardItem[]
  columns?: 2 | 3 | 4 | string
  cardHeight?: 'sm' | 'md' | 'tall' | 'xtall'
  backgroundColor?: string
  verticalPadding?: 'sm' | 'md' | 'lg' | 'xl'
  width?: 'contained' | 'full'
  className?: string
}

const paddingMap = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
}

const heightMap = {
  sm: 'h-[400px]',
  md: 'h-[500px]',
  tall: 'h-[600px]',
  xtall: 'h-[700px]',
}

const columnClasses = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

// Helper to generate sizes based on number of columns
const getSizes = (columns: number): string => {
  if (columns === 2) return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw'
  if (columns === 4) return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw'
  return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw' // default 3 columns
}

export const CardsBlock: React.FC<CardsProps> = ({
  heading,
  items = [],
  columns = 3,
  cardHeight = 'tall',
  backgroundColor = '#051114',
  verticalPadding = 'md',
  width = 'contained',
  className,
}) => {
  const paddingClass = paddingMap[verticalPadding] || 'py-12'
  const columnsNum = typeof columns === 'string' ? parseInt(columns, 10) : columns || 3
  const gridCols = columnClasses[columnsNum as 2 | 3 | 4] || 'grid-cols-1 md:grid-cols-3'
  const heightClass = heightMap[cardHeight] || 'h-[600px]'
  const containerClasses =
    width === 'full' ? 'px-6 md:px-10 lg:px-16' : 'max-w-7xl mx-auto px-6 md:px-10 lg:px-16'

  const sizesValue = getSizes(columnsNum)

  return (
    <section className={cn('w-full', paddingClass, className)} style={{ backgroundColor }}>
      <div className={containerClasses}>
        {heading && (
          <div className="text-center mb-12">
            <RichText data={heading} enableGutter={false} />
          </div>
        )}

        <div className={cn('grid', gridCols, 'gap-6')}>
          {items.map((item, idx) => (
            <div key={idx} className="group relative overflow-hidden rounded-xl">
              <Link
                href={item.buttonLink || '#'}
                target={item.newTab ? '_blank' : undefined}
                rel={item.newTab ? 'noopener noreferrer' : undefined}
                className="block relative overflow-hidden rounded-xl"
              >
                {/* Image with zoom on hover */}
                <div className={cn('relative w-full overflow-hidden', heightClass)}>
                  {item.image?.url && (
                    <Image
                      src={item.image.url}
                      alt="Card image"
                      fill
                      sizes={sizesValue}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  )}
                </div>

                {/* Full overlay gradient (hero-button) – covers entire card */}
                <div
                  className="absolute inset-0 w-full h-full z-10"
                  style={{
                    background: 'linear-gradient(80deg, #030b0d, rgba(3, 11, 13, 0))',
                  }}
                />

                {/* Button overlay (top‑right) */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="inline-block bg-[#040d10] text-[#ffd28d] font-serif italic text-lg px-6 py-3 rounded-md">
                    {item.buttonLabel || 'Read More'}
                  </span>
                </div>

                {/* Content overlay (bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
                  <div className="text-white">
                    <RichText data={item.richContent} enableGutter={false} />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
