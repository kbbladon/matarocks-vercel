import type { Block } from 'payload'

export const BackgroundSection: Block = {
  slug: 'backgroundSection',
  labels: {
    singular: 'Background Section',
    plural: 'Background Sections',
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
    },
    {
      name: 'overlayColor',
      type: 'text',
      label: 'Overlay Color',
      defaultValue: '#0f3d2e',
      admin: {
        components: {
          Field: '@/components/ColorPicker',
        } as any,
      },
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      label: 'Overlay Opacity',
      defaultValue: 0.7,
      min: 0,
      max: 1,
      // step removed – users can type decimal values
    },
    {
      name: 'contentWidth',
      type: 'select',
      label: 'Inner Content Width',
      defaultValue: 'contained',
      options: [
        { label: 'Contained (max-width, centered)', value: 'contained' },
        { label: 'Full Width (edge to edge)', value: 'full' },
      ],
    },
    {
      name: 'innerBackground',
      type: 'text',
      label: 'Inner Content Background (optional)',
      admin: {
        components: {
          Field: '@/components/ColorPicker',
        } as any,
        description: 'Leave empty for transparent background',
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
        { label: 'Large (py-20)', value: 'lg' },
        { label: 'Extra Large (py-28)', value: 'xl' },
      ],
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Inner Blocks',
      blocks: [
        // You'll import and list your blocks here
      ],
    },
  ],
}
