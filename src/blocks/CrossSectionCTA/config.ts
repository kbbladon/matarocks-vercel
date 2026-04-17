import type { Block } from 'payload'
import { richTextEditor } from '@/fields/richTextEditor'

export const CrossSectionCTA: Block = {
  slug: 'crossSectionCta',
  labels: {
    singular: 'Cross Section CTA',
    plural: 'Cross Section CTAs',
  },
  fields: [
    {
      name: 'heading',
      type: 'richText',
      label: 'Section Heading (optional)',
      editor: richTextEditor,
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Icon',
          defaultValue: 'wifi',
          options: [
            { label: 'WiFi', value: 'wifi' },
            { label: 'Swimming Pool', value: 'pool' },
            { label: 'Beachfront', value: 'beach' },
            { label: 'Umbrella', value: 'umbrella' },
            { label: 'Sun', value: 'sun' },
            { label: 'Restaurant', value: 'restaurant' },
            { label: 'Spa', value: 'spa' },
            { label: 'Gym', value: 'gym' },
            { label: 'Parking', value: 'parking' },
            { label: 'Pet Friendly', value: 'pet' },
          ],
        },
        {
          name: 'titlePrefix',
          type: 'text',
          label: 'Title Prefix (e.g., "01 / ")',
          defaultValue: '',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Description',
          editor: richTextEditor,
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
          required: true,
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open link in new tab',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Columns per row',
      defaultValue: '3', // ✅ string, not number
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color',
      defaultValue: '#051114',
      admin: {
        components: { Field: '@/components/ColorPicker' } as any,
      },
    },
    {
      name: 'verticalPadding',
      type: 'select',
      label: 'Vertical Padding',
      defaultValue: 'md',
      options: [
        { label: 'Small (py-8)', value: 'sm' },
        { label: 'Medium (py-12)', value: 'md' },
        { label: 'Large (py-16)', value: 'lg' },
        { label: 'Extra Large (py-24)', value: 'xl' },
      ],
    },
  ],
}
