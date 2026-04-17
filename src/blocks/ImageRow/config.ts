import type { Block } from 'payload'

export const ImageRow: Block = {
  slug: 'imageRow',
  labels: {
    singular: 'Image Row',
    plural: 'Image Rows',
  },
  fields: [
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Optional Link URL',
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
      name: 'imageHeight',
      type: 'number',
      label: 'Image Height (px)',
      defaultValue: 300,
      admin: { step: 10, placeholder: '300' },
    },
    {
      name: 'gap',
      type: 'number',
      label: 'Gap Between Images (px)',
      defaultValue: 20,
    },
    {
      name: 'desktopWidth',
      type: 'select',
      label: 'Desktop Image Width',
      defaultValue: '45%',
      options: [
        { label: '45% (approx 2 per row)', value: '45%' },
        { label: '30% (approx 3 per row)', value: '30%' },
        { label: '22% (approx 4 per row)', value: '22%' },
        { label: 'Full width', value: '100%' },
      ],
    },
    {
      name: 'mobileWidth',
      type: 'select',
      label: 'Mobile Image Width',
      defaultValue: '85%',
      options: [
        { label: '85%', value: '85%' },
        { label: '100%', value: '100%' },
      ],
    },
    {
      name: 'borderRadius',
      type: 'text',
      label: 'Border Radius',
      defaultValue: '8px',
    },
    {
      name: 'boxShadow',
      type: 'text',
      label: 'Box Shadow',
      defaultValue: '7px 7px 18px 1px #333',
      admin: {
        description: 'CSS box-shadow value. Leave empty to disable.',
      },
    },
    {
      name: 'justifyContent',
      type: 'select',
      label: 'Justify Content',
      defaultValue: 'space-around',
      options: [
        { label: 'Space Around', value: 'space-around' },
        { label: 'Space Between', value: 'space-between' },
        { label: 'Center', value: 'center' },
        { label: 'Flex Start', value: 'flex-start' },
        { label: 'Flex End', value: 'flex-end' },
      ],
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
