'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'
import {
  Wifi,
  Waves,
  Umbrella,
  Sun,
  Utensils,
  Sparkles,
  Dumbbell,
  ParkingCircle,
  Dog,
  type LucideIcon,
} from 'lucide-react'

type Item = {
  icon?: string
  titlePrefix?: string
  title: string
  description: any
  link?: string
  newTab?: boolean
}

type CrossSectionCTAProps = {
  heading?: any
  items?: Item[]
  columns?: 2 | 3 | 4 | string
  backgroundColor?: string
  verticalPadding?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const paddingMap = {
  sm: 'py-8',
  md: 'py-12',
  lg: 'py-16',
  xl: 'py-24',
}

const iconMap: Record<string, LucideIcon> = {
  wifi: Wifi,
  pool: Waves,
  beach: Umbrella,
  umbrella: Umbrella,
  sun: Sun,
  restaurant: Utensils,
  spa: Sparkles,
  gym: Dumbbell,
  parking: ParkingCircle,
  pet: Dog,
}

const getIcon = (iconName?: string): LucideIcon | null => {
  if (!iconName) return null
  return iconMap[iconName] || Wifi
}

const columnClasses = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export const CrossSectionCTA: React.FC<CrossSectionCTAProps> = ({
  heading,
  items = [],
  columns = 3,
  backgroundColor = '#051114',
  verticalPadding = 'md',
  className,
}) => {
  const paddingClass = paddingMap[verticalPadding] || 'py-12'
  const columnsNum = typeof columns === 'string' ? parseInt(columns, 10) : columns || 3
  const gridCols = columnClasses[columnsNum as 2 | 3 | 4] || 'grid-cols-1 md:grid-cols-3'

  // Split items into rows
  const rows: Item[][] = []
  for (let i = 0; i < items.length; i += columnsNum) {
    rows.push(items.slice(i, i + columnsNum))
  }

  // Border color used for both vertical and horizontal separators
  const borderColor = 'rgba(255, 210, 141, 0.3)'

  return (
    <section className={cn('w-full', paddingClass, className)} style={{ backgroundColor }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        {heading && (
          <div className="text-center mb-12">
            <RichText data={heading} enableGutter={false} />
          </div>
        )}

        {rows.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {/* Grid row – no gap, borders handled manually */}
            <div className={cn('grid', gridCols, 'divide-y md:divide-y-0')}>
              {row.map((item, colIndex) => {
                const IconComponent = getIcon(item.icon)
                const isLastInRow = colIndex === row.length - 1
                return (
                  <div
                    key={colIndex}
                    className={cn(
                      'relative transition-all duration-300 hover:bg-[rgba(255,210,141,0.1)]',
                      // Right border (gold) for all except last column in the row
                      !isLastInRow && `border-r border-[${borderColor}]`,
                      // Bottom border for all except last row? No, we'll use a separate separator.
                    )}
                  >
                    <Link
                      href={item.link || '#'}
                      target={item.newTab ? '_blank' : undefined}
                      rel={item.newTab ? 'noopener noreferrer' : undefined}
                      className="block p-8 transition-all duration-300"
                    >
                      {IconComponent && (
                        <div className="mb-4">
                          <IconComponent className="w-6 h-6 text-[#ffd28d]" />
                        </div>
                      )}
                      <h3 className="font-serif text-2xl font-light text-white mb-3">
                        {item.titlePrefix && (
                          <span className="text-[#ffd28d]">{item.titlePrefix}</span>
                        )}
                        {item.title}
                      </h3>
                      <div className="text-white/80 text-sm font-sans">
                        <RichText data={item.description} enableGutter={false} />
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
            {/* Horizontal separator between rows – gold tint, no margins */}
            {rowIndex < rows.length - 1 && (
              <hr className="border-0 h-px bg-[rgba(255,210,141,0.3)] my-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  )
}
