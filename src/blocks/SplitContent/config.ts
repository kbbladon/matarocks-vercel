// src/blocks/SplitContent/config.ts
import type { Block } from 'payload'
import { richTextEditor } from '@/fields/richTextEditor'

export const SplitContent: Block = {
  slug: 'splitContent',
  labels: {
    singular: 'Split Content (Parallax BG)',
    plural: 'Split Content Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title (optional)',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Left Side Content',
      required: true,
      editor: richTextEditor,
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image (parallax)',
      required: true,
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      label: 'Left Side Background Opacity',
      defaultValue: 0.85,
      min: 0,
      max: 1,
      admin: {
        description: 'Dark overlay on the left column to improve text readability',
      },
    },
    {
      name: 'textColor',
      type: 'text',
      label: 'Text Color',
      defaultValue: '#ffffff',
      admin: {
        components: { Field: '@/components/ColorPicker' } as any,
      },
    },
    {
      name: 'verticalPadding',
      type: 'select',
      label: 'Vertical Padding',
      defaultValue: 'lg',
      options: [
        { label: 'Small (py-8)', value: 'sm' },
        { label: 'Medium (py-12)', value: 'md' },
        { label: 'Large (py-16)', value: 'lg' },
        { label: 'Extra Large (py-24)', value: 'xl' },
      ],
    },
    {
      name: 'enableButton',
      type: 'checkbox',
      label: 'Enable Call‑to‑Action Button',
      defaultValue: false,
    },
    {
      name: 'button',
      type: 'group',
      label: 'Button Settings',
      admin: {
        condition: (_, siblingData) => siblingData?.enableButton === true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'Dine With Us',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Button Link URL',
          required: true,
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
        {
          name: 'alignment',
          type: 'select',
          label: 'Button Alignment',
          defaultValue: 'left',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
      ],
    },
  ],
}
