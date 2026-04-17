'use client'

import React, { useState } from 'react'
import { cn } from '@/utilities/ui'
import RichText from '@/components/RichText'

type MenuItem = {
  itemName: any
  description?: any
  price?: string
}

type Section = {
  sectionHeading?: any
  menuItems: MenuItem[]
}

type Category = {
  tabLabel: string
  sections: Section[]
}

type MenuTableProps = {
  heading?: any
  subheading?: any
  categories?: Category[]
  columnsPerRow?: '2' | '3'
  tableStyle?: 'default' | 'striped' | 'bordered'
  backgroundColor?: string
  backgroundOpacity?: number
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

const columnMap = {
  '2': 'grid-cols-1 md:grid-cols-2',
  '3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}

// Helper to convert hex to rgba
const hexToRgba = (hex: string, alpha: number): string => {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export const MenuTableBlock: React.FC<MenuTableProps> = ({
  heading,
  subheading,
  categories = [],
  columnsPerRow = '2',
  tableStyle = 'default',
  backgroundColor = 'transparent',
  backgroundOpacity = 1,
  verticalPadding = 'md',
  width = 'contained',
  className,
}) => {
  const [activeTab, setActiveTab] = useState(0)
  const paddingClass = paddingMap[verticalPadding] || 'py-12'
  const gridCols = columnMap[columnsPerRow] || 'grid-cols-1 md:grid-cols-2'
  const containerClasses =
    width === 'full' ? 'px-6 md:px-10 lg:px-16' : 'max-w-7xl mx-auto px-6 md:px-10 lg:px-16'

  const activeCategory = categories[activeTab]

  // Background style
  let bgStyle: React.CSSProperties = {}
  if (backgroundColor && backgroundColor !== 'transparent') {
    if (backgroundOpacity !== undefined && backgroundOpacity < 1) {
      bgStyle.backgroundColor = hexToRgba(backgroundColor, backgroundOpacity)
    } else {
      bgStyle.backgroundColor = backgroundColor
    }
  } else {
    bgStyle.backgroundColor = 'transparent'
  }

  const rowClasses = cn(
    'py-4',
    tableStyle === 'striped' && 'even:bg-white/5',
    tableStyle === 'bordered' && 'border-b border-white/10 last:border-0',
  )

  return (
    <section className={cn('w-full', paddingClass, className)} style={bgStyle}>
      <div className={containerClasses}>
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {subheading && (
              <div className="text-sm uppercase tracking-wider text-[#ffd28d] mb-2">
                <RichText data={subheading} enableGutter={false} />
              </div>
            )}
            {heading && (
              <div className="text-3xl md:text-4xl font-light">
                <RichText data={heading} enableGutter={false} />
              </div>
            )}
          </div>
        )}

        {/* Tabs – centred, gold underline on active */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mb-10 border-b border-white/20 pb-2">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={cn(
                  'px-4 py-2 text-sm uppercase tracking-wider font-sans transition-colors duration-200',
                  activeTab === idx
                    ? 'text-[#ffd28d] border-b-2 border-[#ffd28d]'
                    : 'text-white/70 hover:text-[#ffd28d]',
                )}
              >
                {cat.tabLabel}
              </button>
            ))}
          </div>
        )}

        {/* Only render the active tab’s content */}
        {activeCategory &&
          activeCategory.sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="mb-12 last:mb-0">
              {section.sectionHeading && (
                <div className="text-center mb-6">
                  <RichText data={section.sectionHeading} enableGutter={false} />
                </div>
              )}
              <div className={cn('grid', gridCols, 'gap-x-8 gap-y-0')}>
                {section.menuItems.map((item, idx) => (
                  <div key={idx} className={rowClasses}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="text-[#ffd28d] font-sans uppercase tracking-wider text-lg">
                          <RichText data={item.itemName} enableGutter={false} />
                        </div>
                        {item.description && (
                          <div className="text-white/80 text-sm mt-1">
                            <RichText data={item.description} enableGutter={false} />
                          </div>
                        )}
                      </div>
                      {item.price && (
                        <div className="text-[#ffd28d] font-['Prompt','sans-serif'] text-lg whitespace-nowrap">
                          {item.price}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
