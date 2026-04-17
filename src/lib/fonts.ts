// src/lib/fonts.ts
import {
  Montserrat,
  Mulish,
  Playfair_Display,
  Inter,
  Poppins,
  Open_Sans,
  Cormorant_Garamond,
  Raleway,
  Baskervville,
  Prompt,
} from 'next/font/google'

// Existing fonts
export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-heading',
})

export const mulish = Mulish({
  subsets: ['latin'],
  variable: '--font-body',
})

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-heading',
})

export const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-body',
})

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-heading',
})

export const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-body',
})

// New fonts for the Baskervville + Prompt pairing
export const baskervville = Baskervville({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-baskervville',
  display: 'swap',
})

export const prompt = Prompt({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-prompt',
  display: 'swap',
})

// Font map with all presets
export const fontMap = {
  luxury: {
    heading: montserrat,
    body: mulish,
  },
  elegant: {
    heading: playfair,
    body: inter,
  },
  minimal: {
    heading: inter,
    body: inter,
  },
  caribbean: {
    heading: poppins,
    body: openSans,
  },
  boutique: {
    heading: cormorant,
    body: raleway,
  },
  // All‑serif Baskervville (uniform)
  baskervville: {
    heading: baskervville,
    body: baskervville,
  },
  // ✨ Recommended: Baskervville headings + Prompt body
  baskervvillePrompt: {
    heading: baskervville,
    body: prompt,
  },
  mataRocks: {
    heading: playfair,
    body: poppins,
  },
} as const
