import type { Block } from 'payload'
import { richTextEditor } from '@/fields/richTextEditor'

export const ImageGrid: Block = {
  slug: 'imageGrid',
  labels: {
    singular: 'Image Grid',
    plural: 'Image Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading (optional)',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Section Subheading (optional)',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Grid Items',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'richContent',
          type: 'richText',
          label: 'Rich Content (above title)',
          editor: richTextEditor,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Item Title (optional)',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Button Link URL (optional)',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'Learn More',
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
      name: 'transitionSpeed',
      type: 'select',
      label: 'Background Transition Speed',
      defaultValue: 'medium',
      options: [
        { label: 'Slow (1.5s)', value: 'slow' },
        { label: 'Medium (1s)', value: 'medium' },
        { label: 'Fast (0.5s)', value: 'fast' },
      ],
    },
    {
      name: 'columnHeight',
      type: 'select',
      label: 'Column Height',
      defaultValue: 'tall',
      options: [
        { label: 'Normal (450px)', value: 'normal' },
        { label: 'Tall (550px)', value: 'tall' },
        { label: 'Extra Tall (650px)', value: 'xtall' },
      ],
    },
    {
      name: 'desktopHeight',
      type: 'select',
      label: 'Desktop Column Height Override',
      defaultValue: 'default',
      options: [
        { label: 'Same as mobile', value: 'default' },
        { label: 'Taller (600px)', value: 'taller' },
        { label: 'Extra Tall (700px)', value: 'xtall' },
        { label: 'Custom (px)', value: 'custom' },
      ],
    },
    {
      name: 'customDesktopHeight',
      type: 'number',
      label: 'Custom Desktop Height (px)',
      admin: {
        condition: (_, siblingData) => siblingData?.desktopHeight === 'custom',
      },
    },
    {
      name: 'buttonStyle',
      type: 'select',
      label: 'Button Style',
      defaultValue: 'gold',
      options: [
        { label: 'Gold (btn-gold-live)', value: 'gold' },
        { label: 'White Outline', value: 'white' },
      ],
    },
  ],
}
