import React, { useMemo } from 'react'
import type { Page } from '@/payload-types'

import { HighImpactHero } from '@/heros/HighImpact'
import { LowImpactHero } from '@/heros/LowImpact'
import { MediumImpactHero } from '@/heros/MediumImpact'
import { SliderHero } from '@/heros/SliderHero'
import { LowGradientHero } from '@/heros/LowGradientHero'

/**
 * 1. Single source of truth for hero registry
 */
const HEROES = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  lowGradient: LowGradientHero,
} as const

type HeroType = keyof typeof HEROES | 'slider' | 'sliderHero' | 'none'

/**
 * 2. Slider normalization (kept isolated + clean)
 */
function normalizeSliderData(slider: any) {
  if (!slider) return slider

  const cleaned = { ...slider }

  if (cleaned.staticContent) {
    cleaned.staticContent = { ...cleaned.staticContent }

    if (cleaned.staticContent.cta) {
      cleaned.staticContent.cta = {
        ...cleaned.staticContent.cta,
        label: cleaned.staticContent.cta.label ?? undefined,
        url: cleaned.staticContent.cta.url ?? undefined,
      }
    }

    if (cleaned.staticContent.overlayText == null) {
      cleaned.staticContent.overlayText = undefined
    }
  }

  const nullableFields = [
    'animationPreset',
    'height',
    'autoplay',
    'showArrows',
    'showDots',
    'autoplaySpeed',
    'overlayColor',
    'mode',
  ] as const

  for (const field of nullableFields) {
    if (cleaned[field] === null) {
      cleaned[field] = undefined
    }
  }

  return cleaned
}

/**
 * 3. Safe hero data extractor (only used for nested hero types)
 */
function getHeroData(props: any, type: string) {
  return props?.[type]
}

/**
 * 4. RenderHero
 */
export const RenderHero: React.FC<Page['hero']> = (props) => {
  const isDev = process.env.NODE_ENV === 'development'

  const heroType = (props?.type as HeroType) ?? 'none'

  if (isDev) {
    console.log('🦸 Hero type:', heroType)
  }

  if (!heroType || heroType === 'none') return null

  /**
   * 5. Slider handling (isolated, early return)
   */
  if (heroType === 'slider' || heroType === 'sliderHero') {
    const slider = (props as any)?.slider
    if (!slider) return null

    return <SliderHero sliderData={normalizeSliderData(slider)} />
  }

  /**
   * 6. Resolve hero component
   */
  const HeroComponent = HEROES[heroType as keyof typeof HEROES]

  if (!HeroComponent) {
    if (isDev) {
      console.warn(`⚠️ Unknown hero type: ${heroType}`)
    }
    return null
  }

  /**
   * 7. Handle flat-structured hero types (e.g., lowGradient)
   *    These expect all props directly, not nested under `props[heroType]`.
   */
  if (heroType === 'lowGradient') {
    if (isDev) {
      console.log(`✅ Rendering ${heroType} hero (flat props)`, props)
    }
    return <LowGradientHero {...props} />
  }

  /**
   * 8. For other hero types, extract nested data
   */
  const heroData = getHeroData(props, heroType)

  if (!heroData) return null

  if (isDev) {
    console.log(`✅ Rendering ${heroType} hero (nested props)`, heroData)
  }

  return <HeroComponent {...heroData} />
}

export default RenderHero
