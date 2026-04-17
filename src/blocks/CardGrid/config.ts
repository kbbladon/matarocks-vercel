import type { Block } from 'payload'
import { richTextEditor } from '@/fields/richTextEditor'

export const CardGrid: Block = {
  slug: 'cardGrid',
  labels: {
    singular: 'Card Grid',
    plural: 'Card Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
    },

    {
      type: 'collapsible',
      label: 'Appearance',
      fields: [
        {
          name: 'width',
          type: 'select',
          defaultValue: 'contained',
          options: [
            { label: 'Contained (centered, max-width)', value: 'contained' },
            { label: 'Full Width', value: 'full' },
          ],
        },
        {
          name: 'cardHeight',
          type: 'number',
          label: 'Card Height (px)',
          defaultValue: 540,
          admin: { step: 10, placeholder: '540' },
        },
        {
          name: 'cardColumns',
          type: 'select',
          label: 'Columns (Desktop)',
          defaultValue: '3',
          options: [
            { label: '2 columns', value: '2' },
            { label: '3 columns', value: '3' },
            { label: '4 columns', value: '4' },
          ],
        },
        {
          name: 'overlayColor',
          type: 'text',
          defaultValue: '#000000',
          admin: { components: { Field: '@/components/ColorPicker' } as any },
        },
        {
          name: 'scrollAnimation',
          type: 'select',
          defaultValue: 'fadeUp',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Fade Up', value: 'fadeUp' },
            { label: 'Fade In', value: 'fade' },
            { label: 'Slide In', value: 'slide' },
          ],
        },
      ],
    },

    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Card Title',
        },
        {
          name: 'richDescription',
          type: 'richText',
          editor: richTextEditor,
        },
        {
          name: 'price',
          type: 'number',
          label: 'Price (optional)',
          admin: {
            placeholder: '0.00',
            step: 0.01,
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Card Image',
        },
        {
          name: 'features',
          type: 'array',
          label: 'Feature List',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Feature Item',
            },
          ],
        },
        {
          name: 'cta',
          type: 'group',
          label: 'Call to Action',
          fields: [
            {
              name: 'label',
              type: 'text',
              defaultValue: 'View Details',
              label: 'Button Text',
            },
            {
              name: 'type',
              type: 'radio',
              defaultValue: 'internal',
              options: [
                { label: 'Internal Page', value: 'internal' },
                { label: 'External URL', value: 'external' },
              ],
            },
            {
              name: 'reference',
              type: 'relationship',
              relationTo: ['pages'],
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'internal',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'External URL',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'external',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in new tab',
              defaultValue: false,
            },
          ],
        },
      ],
    },

    // 🆕 Footer CTA – now truly optional
    {
      name: 'enableFooterCta',
      type: 'checkbox',
      label: 'Enable Footer Call to Action',
      defaultValue: false,
    },
    {
      name: 'footerCta',
      type: 'group',
      label: 'Footer Call to Action Settings',
      admin: {
        condition: (_, siblingData) => siblingData?.enableFooterCta === true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'View All Rooms',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          label: 'Link URL',
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
      ],
    },
  ],
}
