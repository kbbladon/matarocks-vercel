// lib/fontMapping.ts
export const presetFonts = {
  luxury: {
    heading: 'Playfair Display',
    headingVariable: '--font-playfair',
    body: 'Poppins',
    bodyVariable: '--font-poppins',
  },
  elegant: {
    heading: 'Cormorant Garamond',
    headingVariable: '--font-cormorant',
    body: 'Montserrat',
    bodyVariable: '--font-montserrat',
  },
  minimal: {
    heading: 'Inter',
    headingVariable: '--font-inter',
    body: 'Inter',
    bodyVariable: '--font-inter',
  },
  caribbean: {
    heading: 'Pacifico',
    headingVariable: '--font-pacifico',
    body: 'Nunito',
    bodyVariable: '--font-nunito',
  },
  boutique: {
    heading: 'Cormorant',
    headingVariable: '--font-cormorant',
    body: 'Lato',
    bodyVariable: '--font-lato',
  },
}
// Hero fonts (always available)
export const heroFonts = [
  {
    label: 'Baskervville (Hero Serif)',
    value: 'var(--font-baskervville), serif',
    fontName: 'Baskervville',
  },
  {
    label: 'Prompt (Hero Sans)',
    value: 'var(--font-prompt), sans-serif',
    fontName: 'Prompt',
  },
]
