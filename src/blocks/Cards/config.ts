import type { Block } from 'payload'
import { richTextEditor } from '@/fields/richTextEditor'

export const Cards: Block = {
  slug: 'cards',
  labels: {
    singular: 'Cards',
    plural: 'Cards',
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
      label: 'Cards',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Card Image',
          required: true,
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'Read More',
        },
        {
          name: 'buttonLink',
          type: 'text',
          label: 'Button Link URL',
          required: true,
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open link in new tab',
          defaultValue: false,
        },
        {
          name: 'richContent',
          type: 'richText',
          label: 'Card Content (Title & Description)',
          required: true,
          editor: richTextEditor,
          admin: {
            description: 'Use the toolbar to format title and description freely.',
          },
        },
      ],
    },
    {
      name: 'width',
      type: 'select',
      label: 'Content Width',
      defaultValue: 'contained',
      options: [
        { label: 'Contained (max-width, centered)', value: 'contained' },
        { label: 'Full Width (edge to edge)', value: 'full' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Columns per row',
      defaultValue: '3',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
    {
      name: 'cardHeight',
      type: 'select',
      label: 'Card Height',
      defaultValue: 'tall',
      options: [
        { label: 'Small (400px)', value: 'sm' },
        { label: 'Medium (500px)', value: 'md' },
        { label: 'Tall (600px)', value: 'tall' },
        { label: 'Extra Tall (700px)', value: 'xtall' },
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
