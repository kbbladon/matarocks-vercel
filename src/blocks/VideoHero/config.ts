import type { Block } from 'payload'
import { richTextEditor } from '@/fields/richTextEditor'

export const VideoHero: Block = {
  slug: 'videoHero',
  labels: {
    singular: 'Video Hero',
    plural: 'Video Heroes',
  },
  fields: [
    {
      name: 'mediaType',
      type: 'select',
      label: 'Video Source',
      defaultValue: 'youtube',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Uploaded Video (MP4)', value: 'upload' },
      ],
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube URL or ID',
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType === 'youtube',
        description: 'Example: https://www.youtube.com/watch?v=pdzR0Tv8fcQ or just the ID',
      },
    },
    {
      name: 'uploadedVideo',
      type: 'upload',
      relationTo: 'media',
      label: 'Uploaded Video File (MP4)',
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType === 'upload',
      },
    },
    {
      name: 'mobilePlaceholder',
      type: 'upload',
      relationTo: 'media',
      label: 'Mobile Placeholder Image',
      admin: {
        description: 'Optional – replaces video on mobile devices to improve performance.',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay',
      defaultValue: true,
    },
    {
      name: 'loop',
      type: 'checkbox',
      label: 'Loop',
      defaultValue: true,
    },
    {
      name: 'muted',
      type: 'checkbox',
      label: 'Muted',
      defaultValue: true,
    },
    {
      name: 'controls',
      type: 'checkbox',
      label: 'Show Controls (YouTube only)',
      defaultValue: false,
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      label: 'Overlay Opacity (dark layer over video)',
      defaultValue: 0.5,
      min: 0,
      max: 1,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      editor: richTextEditor,
    },
    {
      name: 'enableButton',
      type: 'checkbox',
      label: 'Enable CTA Button',
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
          defaultValue: 'View Tours',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Button Link URL',
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
      ],
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
  ],
}
