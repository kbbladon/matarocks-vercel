import type { Block } from 'payload'
import { richTextEditor } from '@/fields/richTextEditor'

export const SlickerSlide: Block = {
  slug: 'slickerSlide',
  labels: {
    singular: 'Slicker Slide',
    plural: 'Slicker Slides',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading (optional)',
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Slides',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Slide Image',
        },
        {
          name: 'title',
          type: 'text',
          label: 'Slide Title (optional)',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Slide Description (optional)',
          editor: richTextEditor,
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Button Label (optional)',
        },
        {
          name: 'buttonLink',
          type: 'text',
          label: 'Button Link URL (optional)',
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
      name: 'showArrows',
      type: 'checkbox',
      label: 'Show Navigation Arrows',
      defaultValue: false,
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay',
      defaultValue: true,
    },
    {
      name: 'autoplaySpeed',
      type: 'number',
      label: 'Autoplay Speed (ms)',
      defaultValue: 5000,
      admin: {
        condition: (_, siblingData) => siblingData?.autoplay === true,
      },
    },
    {
      name: 'showDots',
      type: 'checkbox',
      label: 'Show Pagination Dots',
      defaultValue: true,
    },
    {
      name: 'slidesPerView',
      type: 'select',
      label: 'Slides Per View (Desktop)',
      defaultValue: '1',
      options: [
        { label: '1 slide', value: '1' },
        { label: '2 slides', value: '2' },
        { label: '3 slides', value: '3' },
        { label: '4 slides', value: '4' },
      ],
    },
    {
      name: 'gap',
      type: 'number',
      label: 'Gap Between Slides (px)',
      defaultValue: 20,
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color (solid)',
      defaultValue: '#040d10',
      admin: {
        components: { Field: '@/components/ColorPicker' } as any,
        description: 'Used only if no gradient is provided.',
      },
    },
    {
      name: 'backgroundOpacity',
      type: 'number',
      label: 'Background Opacity (0‑1)',
      defaultValue: 1,
      min: 0,
      max: 1,
      admin: {
        description: 'Applies to the solid background colour.',
      },
    },
    {
      name: 'backgroundGradient',
      type: 'text',
      label: 'Background Gradient (CSS)',
      admin: {
        description: 'Example: linear-gradient(135deg, #ffd28d, #040d10). Overrides solid colour.',
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
