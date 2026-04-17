import type { Field } from 'payload'
import { linkGroup } from '@/fields/linkGroup'
import { richTextEditor } from '@/fields/richTextEditor'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
        { label: 'Slider', value: 'slider' },
        { label: 'Low Gradient', value: 'lowGradient' },
      ],
      required: true,
    },

    // ---------- LOW GRADIENT FIELDS (new) ----------
    {
      name: 'gradientTitle',
      type: 'richText',
      label: 'Gradient Hero Title (Rich Text)',
      editor: richTextEditor,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'lowGradient',
      },
    },
    {
      name: 'gradientSubtitle',
      type: 'text',
      label: 'Gradient Hero Subtitle (optional)',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'lowGradient',
      },
    },
    {
      name: 'gradientBackground',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'lowGradient',
      },
    },
    {
      name: 'gradientOverlayOpacity',
      type: 'number',
      label: 'Overlay Opacity',
      defaultValue: 0.6,
      min: 0,
      max: 1,
      admin: {
        step: 0.05,
        condition: (_, siblingData) => siblingData?.type === 'lowGradient',
      },
    },
    {
      name: 'gradientHeight',
      type: 'select',
      label: 'Hero Height',
      defaultValue: '520px',
      options: [
        { label: 'Small (400px)', value: '400px' },
        { label: 'Medium (520px)', value: '520px' },
        { label: 'Large (600px)', value: '600px' },
        { label: 'Full Screen', value: '100vh' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'lowGradient',
      },
    },

    // -----------------------------
    // NON-SLIDER FIELDS
    // -----------------------------
    {
      name: 'richText',
      type: 'richText',
      editor: richTextEditor,
      admin: {
        condition: (_, { type } = {}) => type !== 'slider',
      },
    },

    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { type } = {}) => type !== 'slider',
        },
      },
    }),

    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_, siblingData) => ['highImpact', 'mediumImpact'].includes(siblingData?.type),
      },
    },

    // -----------------------------
    // SLIDER CONFIG
    // -----------------------------
    {
      name: 'slider',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'slider',
      },
      fields: [
        {
          name: 'mode',
          type: 'select',
          defaultValue: 'static',
          label: 'Slider Content Mode',
          options: [
            { label: 'Static Overlay (Recommended)', value: 'static' },
            { label: 'Per Slide Content (Advanced)', value: 'dynamic' },
          ],
        },
        {
          name: 'staticContent',
          type: 'group',
          label: 'Static Content',
          required: true,
          admin: {
            condition: (_, siblingData) => siblingData?.mode === 'static' || !siblingData?.mode,
          },
          fields: [
            {
              name: 'overlayText',
              type: 'richText',
              label: 'Overlay Text (Rich Text)',
              editor: richTextEditor,
              admin: {
                description: 'Use the toolbar to add formatted text and colors.',
              },
            },
            {
              name: 'cta',
              type: 'group',
              label: 'Call To Action',
              fields: [
                { name: 'label', type: 'text', defaultValue: 'Learn More' },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          name: 'slides',
          type: 'array',
          label: 'Slides',
          minRows: 1,
          maxRows: 10,
          fields: [
            {
              name: 'media',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Slide Image',
            },
          ],
        },
        {
          type: 'collapsible',
          label: 'Slider Behavior',
          fields: [
            { name: 'autoplay', type: 'checkbox', defaultValue: true, label: 'Auto-play slides' },
            {
              name: 'autoplaySpeed',
              type: 'number',
              defaultValue: 4000,
              admin: { condition: (_, siblingData) => siblingData?.autoplay === true },
            },
            { name: 'showArrows', type: 'checkbox', defaultValue: true, label: 'Show arrows' },
            { name: 'showDots', type: 'checkbox', defaultValue: true, label: 'Show dots' },
          ],
        },
        {
          type: 'collapsible',
          label: 'Appearance',
          fields: [
            {
              name: 'height',
              type: 'select',
              defaultValue: 'full',
              options: [
                { label: 'Full Screen', value: 'full' },
                { label: 'Large (80vh)', value: 'large' },
                { label: 'Medium (60vh)', value: 'medium' },
              ],
            },
            {
              name: 'animationPreset',
              type: 'select',
              defaultValue: 'cinematic',
              options: [
                { label: 'Slide (Default)', value: 'slide' },
                { label: 'Fade', value: 'fade' },
                { label: 'Cinematic (Luxury)', value: 'cinematic' },
              ],
            },
            {
              name: 'overlayColor',
              type: 'text',
              defaultValue: '#000000',
              admin: {
                components: { Field: '@/components/ColorPicker' } as any,
              },
            },
          ],
        },
      ],
    },
  ],
}
