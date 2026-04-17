import type { Block } from 'payload'
import { richTextEditor } from '@/fields/richTextEditor'

export const MenuTable: Block = {
  slug: 'menuTable',
  labels: {
    singular: 'Menu Table',
    plural: 'Menu Tables',
  },
  fields: [
    {
      name: 'heading',
      type: 'richText',
      label: 'Section Heading (optional)',
      editor: richTextEditor,
    },
    {
      name: 'subheading',
      type: 'richText',
      label: 'Section Subheading (optional)',
      editor: richTextEditor,
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Menu Categories (Tabs)',
      minRows: 1,
      fields: [
        {
          name: 'tabLabel',
          type: 'text',
          label: 'Tab Label',
          required: true,
        },
        {
          name: 'sections',
          type: 'array',
          label: 'Sections / Tables (e.g., Appetizers, Mains, Desserts)',
          minRows: 1,
          maxRows: 6,
          fields: [
            {
              name: 'sectionHeading',
              type: 'richText',
              label: 'Section Heading (optional)',
              editor: richTextEditor,
            },
            {
              name: 'menuItems',
              type: 'array',
              label: 'Menu Items',
              minRows: 1,
              fields: [
                {
                  name: 'itemName',
                  type: 'richText',
                  label: 'Item Name',
                  required: true,
                  editor: richTextEditor,
                },
                {
                  name: 'description',
                  type: 'richText',
                  label: 'Description',
                  editor: richTextEditor,
                },
                {
                  name: 'price',
                  type: 'text',
                  label: 'Price (e.g., $12USD)',
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'columnsPerRow',
      type: 'select',
      label: 'Columns per row (desktop) – applies to each section',
      defaultValue: '2',
      options: [
        { label: '2 columns', value: '2' },
        { label: '3 columns', value: '3' },
      ],
    },
    {
      name: 'tableStyle',
      type: 'select',
      label: 'Table Style',
      defaultValue: 'default',
      options: [
        { label: 'Default (no extra lines)', value: 'default' },
        { label: 'Striped rows', value: 'striped' },
        { label: 'Bordered rows', value: 'bordered' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color',
      defaultValue: 'transparent',
      admin: {
        components: { Field: '@/components/ColorPicker' } as any,
        description: 'Leave empty or set to transparent for no background.',
      },
    },
    {
      name: 'backgroundOpacity',
      type: 'number',
      label: 'Background Opacity',
      defaultValue: 1,
      min: 0,
      max: 1,
      // step removed
      admin: {
        description: 'Only applies if a background color is selected.',
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
  ],
}
