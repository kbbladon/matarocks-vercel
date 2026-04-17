import React, { Fragment } from 'react'
import dynamic from 'next/dynamic'
import type { Page } from '@/payload-types'

// Dynamically import each block component
const blockComponents: Record<string, any> = {
  archive: dynamic(() => import('@/blocks/ArchiveBlock/Component').then((mod) => mod.ArchiveBlock)),
  content: dynamic(() => import('@/blocks/Content/Component').then((mod) => mod.ContentBlock)),
  cta: dynamic(() =>
    import('@/blocks/CallToAction/Component').then((mod) => mod.CallToActionBlock),
  ),
  formBlock: dynamic(() => import('@/blocks/Form/Component').then((mod) => mod.FormBlock)),
  mediaBlock: dynamic(() => import('@/blocks/MediaBlock/Component').then((mod) => mod.MediaBlock)),
  cardGrid: dynamic(() => import('@/blocks/CardGrid/Component').then((mod) => mod.CardGridBlock)),
  parallaxHero: dynamic(() =>
    import('@/blocks/ParallaxHero/Component').then((mod) => mod.ParallaxHeroBlock),
  ),
  splitContent: dynamic(() =>
    import('@/blocks/SplitContent/Component').then((mod) => mod.SplitContentBlock),
  ),
  videoHero: dynamic(() =>
    import('@/blocks/VideoHero/Component').then((mod) => mod.VideoHeroBlock),
  ),
  imageGrid: dynamic(() =>
    import('@/blocks/ImageGrid/Component').then((mod) => mod.ImageGridBlock),
  ),
  crossSectionCta: dynamic(() =>
    import('@/blocks/CrossSectionCTA/Component').then((mod) => mod.CrossSectionCTA),
  ),
  cards: dynamic(() => import('@/blocks/Cards/Component').then((mod) => mod.CardsBlock)),
  slickerSlide: dynamic(() => import('./SlickerSlide').then((mod) => mod.SlickerSlide)),
  menuTabs: dynamic(() => import('@/blocks/MenuTabs/Component').then((mod) => mod.MenuTabsBlock)),
  menuTable: dynamic(() =>
    import('@/blocks/MenuTable/Component').then((mod) => mod.MenuTableBlock),
  ),
  imageRow: dynamic(() => import('@/blocks/ImageRow/Component').then((mod) => mod.ImageRowBlock)),
}

// Optional loading fallback for all blocks
const BlockLoading = () => (
  <div className="w-full py-12 flex justify-center">
    <div className="animate-pulse bg-gray-200 dark:bg-gray-800 h-32 w-full max-w-7xl rounded-lg" />
  </div>
)

export const RenderBlocks: React.FC<{ blocks: Page['layout'][0][] }> = ({ blocks }) => {
  if (!blocks?.length) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block
        const Block = blockComponents[blockType]
        if (!Block) return null

        // Pass loading fallback to each dynamic import
        return <Block key={index} {...block} />
      })}
    </Fragment>
  )
}
