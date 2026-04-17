import type { Block } from 'payload'
import { richTextEditor } from '@/fields/richTextEditor'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    // ----- Advanced options -----
    {
      name: 'width',
      type: 'number',
      label: 'Image Width (pixels)',
      defaultValue: undefined,
      admin: {
        description: 'Leave empty for full width (within container)',
      },
    },
    {
      name: 'alignment',
      type: 'select',
      label: 'Alignment',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'enableBackground',
      type: 'checkbox',
      label: 'Enable Background Color',
      defaultValue: false,
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color',
      admin: {
        condition: (_, siblingData) => siblingData?.enableBackground === true,
        components: { Field: '@/components/ColorPicker' } as any,
      },
    },
    {
      name: 'backgroundPadding',
      type: 'select',
      label: 'Background Padding',
      defaultValue: 'md',
      options: [
        { label: 'None', value: '0' },
        { label: 'Small (p-4)', value: 'p-4' },
        { label: 'Medium (p-6)', value: 'p-6' },
        { label: 'Large (p-8)', value: 'p-8' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.enableBackground === true,
      },
    },
    {
      name: 'roundedCorners',
      type: 'select',
      label: 'Rounded Corners',
      defaultValue: 'md',
      options: [
        { label: 'None', value: 'rounded-none' },
        { label: 'Small', value: 'rounded' },
        { label: 'Medium', value: 'rounded-md' },
        { label: 'Large', value: 'rounded-lg' },
        { label: 'Extra Large', value: 'rounded-xl' },
        { label: 'Full', value: 'rounded-full' },
      ],
    },
    {
      name: 'enableOverlay',
      type: 'checkbox',
      label: 'Enable Overlay (dark gradient)',
      defaultValue: false,
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      label: 'Overlay Opacity',
      defaultValue: 0.5,
      min: 0,
      max: 1,
      admin: {
        step: 0.05,
        condition: (_, siblingData) => siblingData?.enableOverlay === true,
      },
    },
    {
      name: 'caption',
      type: 'richText',
      label: 'Caption',
      editor: richTextEditor,
    },
    {
      name: 'link',
      type: 'text',
      label: 'Link URL (optional)',
    },
    {
      name: 'newTab',
      type: 'checkbox',
      label: 'Open link in new tab',
      defaultValue: false,
    },
  ],
}
