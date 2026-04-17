import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { richTextEditor } from '@/fields/richTextEditor'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      label: 'Footer Layout',
      defaultValue: 'simple',
      options: [
        { label: 'Simple (navigation links only)', value: 'simple' },
        { label: 'Advanced (multi‑column, rich content)', value: 'advanced' },
      ],
    },
    // Simple layout fields
    {
      name: 'navItems',
      type: 'array',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'simple',
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
    // Advanced layout fields
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Footer Logo (SVG or image)',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'advanced',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description Text',
      editor: richTextEditor,
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'advanced',
      },
    },
    {
      name: 'socialBadges',
      type: 'array',
      label: 'Social / Trust Badges',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'advanced',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Badge Image',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL (optional)',
        },
      ],
    },
    {
      name: 'reachUs',
      type: 'group',
      label: 'Reach Us Section',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'advanced',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          label: 'Heading',
          defaultValue: 'Reach Us',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'email',
          type: 'text',
          label: 'Email Address',
        },
        {
          name: 'hours',
          type: 'text',
          label: 'Business Hours',
        },
        {
          name: 'partnerHotel',
          type: 'group',
          label: 'Partner Hotel',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Label Text',
              defaultValue: 'Book a room at our Flagship Hotel.',
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Partner Hotel Logo',
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link URL',
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Open in new tab',
              defaultValue: true,
            },
          ],
        },
      ],
    },
    {
      name: 'mapEmbedUrl',
      type: 'text',
      label: 'Google Maps Embed URL',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'advanced',
        description: 'Paste the full embed URL from Google Maps',
      },
    },
    {
      name: 'copyright',
      type: 'text',
      label: 'Copyright Text',
      defaultValue: 'Copyright © 2026 Mata Rocks Resort. All Rights Reserved. Belize.',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'advanced',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
