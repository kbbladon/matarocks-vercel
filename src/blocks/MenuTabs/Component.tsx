'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

type MenuItem = {
  title: string
  description?: string
  price?: string
}

type Tab = {
  tabName: string
  items?: MenuItem[]
}

type MenuTabsProps = {
  heading?: any
  tabs?: Tab[]
  columns?: string | number
  width?: 'contained' | 'full'
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

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
}

export const MenuTabsBlock: React.FC<MenuTabsProps> = ({
  heading,
  tabs = [],
  columns = 2,
  width = 'contained',
  backgroundColor = '#040d10',
  verticalPadding = 'md',
  className,
}) => {
  const [activeTab, setActiveTab] = useState(0)

  const paddingClass = paddingMap[verticalPadding] || 'py-12'
  const cols = typeof columns === 'string' ? parseInt(columns, 10) : columns || 2
  const gridCols = columnClasses[cols as keyof typeof columnClasses] || 'grid-cols-1 md:grid-cols-2'

  const containerClasses =
    width === 'full' ? 'px-6 md:px-10 lg:px-16' : 'max-w-7xl mx-auto px-6 md:px-10 lg:px-16'

  const activeItems = tabs[activeTab]?.items || []

  // Split items evenly across columns
  const splitItems = () => {
    const itemsPerColumn = Math.ceil(activeItems.length / cols)
    const columnsArray = []
    for (let i = 0; i < cols; i++) {
      const start = i * itemsPerColumn
      const end = start + itemsPerColumn
      columnsArray.push(activeItems.slice(start, end))
    }
    return columnsArray
  }

  const columnsData = splitItems()

  return (
    <section className={cn('w-full', paddingClass, className)} style={{ backgroundColor }}>
      <div className={containerClasses}>
        {heading && (
          <div className="text-center mb-8">
            <RichText data={heading} enableGutter={false} />
          </div>
        )}

        {/* Tab navigation */}
        <div className="flex flex-wrap justify-center gap-4 border-b border-white/20 mb-8">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={cn(
                'px-4 py-2 text-sm uppercase tracking-wider font-sans transition-colors',
                activeTab === idx
                  ? 'text-[#ffd28d] border-b-2 border-[#ffd28d]'
                  : 'text-white/70 hover:text-white',
              )}
            >
              {tab.tabName}
            </button>
          ))}
        </div>

        {/* Tab content with animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className={cn('grid', gridCols, 'gap-8')}>
              {columnsData.map((column, colIdx) => (
                <ul key={colIdx} className="space-y-6">
                  {column.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-[#ffd28d] font-sans text-base md:text-lg uppercase tracking-wide">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-white/70 text-xs md:text-sm font-sans mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      {item.price && (
                        <div className="text-white font-sans text-base md:text-lg whitespace-nowrap">
                          {item.price}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
