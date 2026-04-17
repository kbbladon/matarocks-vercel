import type { Block } from 'payload'
import { richTextEditor } from '@/fields/richTextEditor'

export const MenuTabs: Block = {
  slug: 'menuTabs',
  labels: {
    singular: 'Menu Tabs',
    plural: 'Menu Tabs',
  },
  fields: [
    {
      name: 'heading',
      type: 'richText',
      label: 'Section Heading (rich text)',
      editor: richTextEditor,
    },
    {
      name: 'tabs',
      type: 'array',
      label: 'Tabs',
      minRows: 1,
      fields: [
        {
          name: 'tabName',
          type: 'text',
          label: 'Tab Name',
          required: true,
        },
        {
          name: 'items',
          type: 'array',
          label: 'Menu Items',
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Item Name',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
              label: 'Description (optional)',
            },
            {
              name: 'price',
              type: 'text',
              label: 'Price (e.g., $12USD)',
            },
          ],
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Columns per row (desktop)',
      defaultValue: '2',
      options: [
        { label: '1 column', value: '1' },
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
      ],
    },
    {
      name: 'width',
      type: 'select',
      label: 'Content Width',
      defaultValue: 'contained',
      options: [
        { label: 'Contained (centered, max-width)', value: 'contained' },
        { label: 'Full Width (edge to edge)', value: 'full' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color',
      defaultValue: '#040d10',
      admin: { components: { Field: '@/components/ColorPicker' } as any },
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
