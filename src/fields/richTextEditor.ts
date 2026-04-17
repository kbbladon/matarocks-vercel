// richTextEditor.ts
import {
  lexicalEditor,
  FixedToolbarFeature,
  InlineToolbarFeature,
  HeadingFeature,
  AlignFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
} from '@payloadcms/richtext-lexical'
import {
  TextColorFeature,
  TextSizeFeature,
  TextFontFamilyFeature,
  TextLetterSpacingFeature,
  TextLineHeightFeature,
} from 'payload-lexical-typography'

console.log('🔥 richTextEditor is being loaded!')

export const richTextEditor = lexicalEditor({
  features: ({ defaultFeatures }) => [
    ...defaultFeatures,
    FixedToolbarFeature(),
    InlineToolbarFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
    AlignFeature(),
    LinkFeature(),
    UnorderedListFeature(),
    OrderedListFeature(),
    // Horizontal swatch row – no labels, just colours
    TextColorFeature({
      colors: ['#ffd28d', '#FFFFFF', '#000000', '#C0C0C0', '#FF0000', '#00FF00', '#0000FF'],
      colorPicker: true,
    }),
    TextSizeFeature(),
    // Predefined font families as a dropdown
    TextFontFamilyFeature({
      fontFamilies: [
        { label: 'Baskervville', value: 'Baskervville, sans-serif' },
        { label: 'Prompt', value: 'Prompt, sans-serif' },
      ],
      customFontFamily: true, // still allows typing a custom font if needed
    }),
    TextLetterSpacingFeature(),
    TextLineHeightFeature(),
  ],
})
