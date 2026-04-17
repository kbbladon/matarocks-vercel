import type { Block } from 'payload'
import { richTextEditor } from '@/fields/richTextEditor' // 👈 import your custom editor

export const ParallaxHero: Block = {
  slug: 'parallaxHero',
  labels: {
    singular: 'Parallax Hero',
    plural: 'Parallax Heroes',
  },
  fields: [
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Background Image',
    },
    // Overlay settings
    {
      type: 'group',
      name: 'overlay',
      label: 'Overlay Effect',
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'solid',
          options: [
            { label: 'Solid Color', value: 'solid' },
            { label: 'Gradient', value: 'gradient' },
          ],
        },
        {
          name: 'solidColor',
          type: 'text',
          label: 'Solid Color (with opacity)',
          defaultValue: 'rgba(0, 0, 0, 0.6)',
          admin: {
            placeholder: 'rgba(0, 0, 0, 0.6)',
            description: 'Use rgba() or hex with opacity',
          },
        },
        {
          name: 'gradientDirection',
          type: 'select',
          defaultValue: 'to bottom',
          options: [
            { label: 'To Bottom', value: 'to bottom' },
            { label: 'To Top', value: 'to top' },
            { label: 'To Right', value: 'to right' },
            { label: 'To Left', value: 'to left' },
            { label: 'Diagonal 135deg', value: '135deg' },
            { label: 'Diagonal 45deg', value: '45deg' },
          ],
        },
        {
          name: 'gradientStart',
          type: 'text',
          label: 'Start Color',
          defaultValue: 'rgba(3, 11, 13, 0.9)',
          admin: {
            placeholder: 'rgba(3, 11, 13, 0.9)',
            components: {
              Field: '@/components/ColorPicker',
            } as any,
          },
        },
        {
          name: 'gradientEnd',
          type: 'text',
          label: 'End Color',
          defaultValue: 'rgba(3, 11, 13, 0.3)',
          admin: {
            placeholder: 'rgba(3, 11, 13, 0.3)',
            components: {
              Field: '@/components/ColorPicker',
            } as any,
          },
        },
        {
          name: 'gradientStopPosition',
          type: 'number',
          label: 'Gradient Stop Position (%)',
          defaultValue: 30,
          admin: {
            step: 5,
            placeholder: '30',
            description: 'Where the first color ends (percentage)',
          },
        },
      ],
    },
    // Spacing
    {
      name: 'paddingTop',
      type: 'number',
      label: 'Padding Top (px)',
      defaultValue: 80,
      admin: { step: 10, placeholder: '80' },
    },
    {
      name: 'paddingBottom',
      type: 'number',
      label: 'Padding Bottom (px)',
      defaultValue: 180,
      admin: { step: 10, placeholder: '180' },
    },
    {
      name: 'height',
      type: 'text',
      label: 'Section Height',
      defaultValue: '100vh',
      admin: {
        placeholder: 'e.g., 100vh, 56vh, 600px, auto',
        description: 'Set a custom height (CSS units like vh, px, %)',
      },
    },
    // Text Colors
    {
      name: 'welcomeTextColor',
      type: 'text',
      label: 'Welcome Text Color',
      defaultValue: '#ffd28d',
      admin: {
        placeholder: 'e.g., #ffd28d, rgb(255,210,141)',
        description: 'Color for the small welcome text above the title.',
      },
    },
    {
      name: 'titleColor',
      type: 'text',
      label: 'Title Color',
      defaultValue: '#ffffff',
      admin: {
        placeholder: 'e.g., #ffffff, white',
        description: 'Color for the main title text (fallback for unformatted text).',
      },
    },
    {
      name: 'descriptionColor',
      type: 'text',
      label: 'Description Color',
      defaultValue: '#ffffff',
      admin: {
        placeholder: 'e.g., #ffffff, white',
        description: 'Color for the description text.',
      },
    },
    // Title (Rich Text) – using standard richText with your custom editor
    {
      name: 'title',
      type: 'richText', // 👈 changed from 'json'
      editor: richTextEditor, // 👈 use your custom editor
      label: 'Title (Rich Text)',
    },
    // Welcome text (plain)
    {
      name: 'welcomeText',
      type: 'text',
      label: 'Welcome Text (small, above title)',
    },
    // Description (Rich Text) – using standard richText with your custom editor
    {
      name: 'description',
      type: 'richText', // 👈 changed from 'json'
      editor: richTextEditor, // 👈 use your custom editor
      label: 'Description (Rich Text)',
    },
    // CTA
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action Button',
      fields: [
        {
          name: 'label',
          type: 'text',
          defaultValue: 'Read More',
        },
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'internal',
          options: [
            { label: 'Internal Page', value: 'internal' },
            { label: 'External URL', value: 'external' },
          ],
        },
        {
          name: 'reference',
          type: 'relationship',
          relationTo: ['pages'],
        },
        {
          name: 'url',
          type: 'text',
          label: 'External URL',
        },
        {
          name: 'newTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
      ],
    },
    // Scroll animation
    {
      name: 'scrollAnimation',
      type: 'select',
      defaultValue: 'fadeUp',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Fade Up', value: 'fadeUp' },
        { label: 'Fade In', value: 'fade' },
        { label: 'Slide In (left)', value: 'slideLeft' },
        { label: 'Slide In (right)', value: 'slideRight' },
      ],
      label: 'Scroll Animation',
    },
  ],
}
