import type { Block, Field } from 'payload'
import { link } from '@/fields/link'
import { richTextEditor } from '@/fields/richTextEditor'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      { label: 'One Third', value: 'oneThird' },
      { label: 'Half', value: 'half' },
      { label: 'Two Thirds', value: 'twoThirds' },
      { label: 'Full', value: 'full' },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    editor: richTextEditor,
    label: false,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  {
    name: 'alignment',
    type: 'select',
    defaultValue: 'center',
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
    ],
    admin: {
      description: 'Align content inside the column',
    },
  },
  link({
    overrides: {
      admin: {
        condition: (_data: any, siblingData: any) => {
          return Boolean(siblingData?.enableLink)
        },
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
    // NEW: Container max width
    {
      name: 'containerMaxWidth',
      type: 'number',
      label: 'Container Max Width (px)',
      defaultValue: 850,
      admin: {
        placeholder: '850',
        description: 'Maximum width of the content container. Leave empty for no max width.',
      },
    },
    // NEW: Background color
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
    // NEW: Background opacity
    {
      name: 'backgroundOpacity',
      type: 'number',
      label: 'Background Opacity',
      defaultValue: 1,
      min: 0,
      max: 1,
      admin: {
        step: 0.05,
        description: 'Only applies if a background color is selected.',
      },
    },
  ],
}
