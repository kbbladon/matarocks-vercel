import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Site Settings',
  fields: [
    // ==========================================
    // 1. BRAND IDENTITY
    // ==========================================
    {
      type: 'collapsible',
      label: '🏰 Brand Identity',
      fields: [
        {
          type: 'group',
          name: 'branding',
          label: false,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'logo',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  label: 'Logo (Light Background)',
                },
                {
                  name: 'logoDark',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Logo (Dark Background)',
                  admin: { description: 'Optional. Used on transparent/dark sections.' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'logoWidthDesktop',
                  type: 'number',
                  label: 'Desktop Logo Width (px)',
                  defaultValue: 180,
                  admin: { step: 10 },
                },
                {
                  name: 'logoWidthMobile',
                  type: 'number',
                  label: 'Mobile Logo Width (px)',
                  defaultValue: 140,
                  admin: { step: 10 },
                },
              ],
            },
            {
              type: 'collapsible',
              label: 'Favicons & App Icons',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'favicon',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Favicon (32x32)',
                    },
                    {
                      name: 'favicon16',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Favicon (16x16)',
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'appleTouchIcon',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Apple Touch Icon (180x180)',
                    },
                    {
                      name: 'manifest',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Web Manifest File',
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'androidChrome192',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Android Icon (192x192)',
                    },
                    {
                      name: 'androidChrome512',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Android Icon (512x512)',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: '🔍 Global SEO',
      fields: [
        {
          name: 'defaultSeo',
          type: 'group',
          fields: [
            { name: 'title', type: 'text', label: 'Default Meta Title' },
            { name: 'description', type: 'textarea', label: 'Default Meta Description' },
            { name: 'image', type: 'upload', relationTo: 'media', label: 'Default OG Image' },
          ],
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Meta Keywords (comma separated)',
          admin: { description: 'Separate keywords with commas' },
        },
      ],
    },
    // ==========================================
    // 2. HEADER & NAVIGATION
    // ==========================================
    {
      type: 'collapsible',
      label: '⚓ Navigation & Header Layout',
      fields: [
        {
          name: 'phoneNumber',
          type: 'text',
          label: 'Header Phone Number',
          admin: { description: 'e.g., +1 (501) 226-2345 (Leave blank to hide)' },
        },
        {
          name: 'navItems',
          type: 'array',
          label: 'Navigation Menu Links',
          labels: { singular: 'Link', plural: 'Links' },
          fields: [
            link({
              appearances: false,
              overrides: { name: 'parentLink', label: 'Link', required: true },
            }),
            {
              name: 'children',
              type: 'array',
              label: 'Dropdown Items (optional)',
              fields: [
                link({
                  appearances: false,
                  overrides: { name: 'childLink', label: 'Child Link', required: true },
                }),
              ],
              admin: { description: 'Add sub‑links to create a dropdown menu.' },
            },
          ],
          admin: {
            initCollapsed: true,
            components: { RowLabel: '@/Header/RowLabel#RowLabel' },
          },
        },
        {
          name: 'ctaButton',
          type: 'group',
          label: 'Navigation Action Button (CTA)',
          fields: [
            link({
              appearances: false,
              overrides: { name: 'ctaLink', label: 'CTA Button' },
            }),
          ],
        },
        {
          type: 'collapsible',
          label: 'Header Visual Effects',
          admin: { initCollapsed: true },
          fields: [
            {
              name: 'headerGradient',
              type: 'text',
              label: 'Transparent Header Gradient',
              defaultValue:
                'linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.6), transparent)',
              admin: { description: 'Overlay applied before the user scrolls.' },
            },
            {
              name: 'headerOverlayOpacity',
              type: 'number',
              label: 'Gradient Opacity',
              defaultValue: 0.9,
              min: 0,
              max: 1,
              admin: { step: 0.1 },
            },
          ],
        },
      ],
    },
    // ==========================================
    // 3. GLOBAL COLORS
    // ==========================================
    {
      type: 'collapsible',
      label: '🎨 Global Theme Colors',
      fields: [
        {
          type: 'group',
          name: 'colors',
          label: false,
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  label: 'Primary Color',
                  required: true,
                  defaultValue: '#FFD700',
                  admin: { components: { Field: '@/components/ColorPicker' } as any },
                },
                {
                  name: 'secondaryColor',
                  type: 'text',
                  label: 'Secondary Color',
                  required: true,
                  defaultValue: '#E6B800',
                  admin: { components: { Field: '@/components/ColorPicker' } as any },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'linkColor',
                  type: 'text',
                  label: 'Link Color',
                  required: true,
                  defaultValue: '#FFD700',
                  admin: { components: { Field: '@/components/ColorPicker' } as any },
                },
                {
                  name: 'bodyBgColor',
                  type: 'text',
                  label: 'Site Background Color',
                  required: true,
                  defaultValue: '#0a0a0a',
                  admin: { components: { Field: '@/components/ColorPicker' } as any },
                },
              ],
            },
          ],
        },
      ],
    },
    // ==========================================
    // 🌍 GLOBAL PAGE BACKGROUND DEFAULTS
    // ==========================================
    {
      type: 'collapsible',
      label: '🌍 Page Background (Global Default)',
      fields: [
        {
          name: 'defaultBackgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Default Background Image',
          admin: { description: 'Used on pages that do not specify their own background image.' },
        },
        {
          name: 'defaultOverlayColor',
          type: 'text',
          label: 'Default Overlay Color',
          defaultValue: '#0f3d2e',
          admin: {
            components: { Field: '@/components/ColorPicker' } as any,
            description: 'Overlay colour for the default background.',
          },
        },
        {
          name: 'defaultOverlayOpacity',
          type: 'number',
          label: 'Default Overlay Opacity',
          defaultValue: 0.7,
          min: 0,
          max: 1,
          admin: { description: '0 = fully transparent, 1 = solid.' },
        },
        {
          name: 'defaultContentWidth',
          type: 'select',
          label: 'Default Content Width',
          defaultValue: 'contained',
          options: [
            { label: 'Contained (max-width, centered)', value: 'contained' },
            { label: 'Full Width (edge to edge)', value: 'full' },
          ],
          admin: { description: 'Used when a page does not specify its own content width.' },
        },
      ],
    },
    // ==========================================
    // 4. GLOBAL TYPOGRAPHY
    // ==========================================
    {
      type: 'collapsible',
      label: '✏️ Typography Rules',
      fields: [
        {
          type: 'group',
          name: 'typography',
          label: false,
          fields: [
            {
              name: 'fontPreset',
              type: 'select',
              label: 'Visual Font Theme',
              defaultValue: 'luxury',
              options: [
                { label: 'Luxury Tropical (Clean & Modern)', value: 'luxury' },
                { label: 'Elegant Resort (Editorial Luxury)', value: 'elegant' },
                { label: 'Modern Minimal (SaaS Vibe)', value: 'minimal' },
                { label: 'Caribbean Personality (Vibrant Island)', value: 'caribbean' },
                { label: '⭐ Mata Rocks (Baskervville + Prompt)', value: 'baskervvillePrompt' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'headingFontFamily', type: 'text', label: 'Custom Heading Font' },
                { name: 'bodyFontFamily', type: 'text', label: 'Custom Body Font' },
              ],
            },
            {
              type: 'collapsible',
              label: 'Heading Scale Overrides (Advanced)',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'h1FontSize', type: 'text', defaultValue: '2.5rem' },
                    { name: 'h1FontWeight', type: 'text', defaultValue: '700' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'h2FontSize', type: 'text', defaultValue: '2rem' },
                    { name: 'h2FontWeight', type: 'text', defaultValue: '700' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'h3FontSize', type: 'text', defaultValue: '1.75rem' },
                    { name: 'h3FontWeight', type: 'text', defaultValue: '600' },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'h4FontSize', type: 'text', defaultValue: '1.5rem' },
                    { name: 'h4FontWeight', type: 'text', defaultValue: '600' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    // ==========================================
    // 5. COMPONENT SPECIFIC: HERO & BUTTONS
    // ==========================================
    {
      type: 'collapsible',
      label: '🧱 Component Stylings',
      fields: [
        {
          type: 'group',
          name: 'hero',
          label: 'Hero Banners',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'headingFontFamily',
                  type: 'text',
                  label: 'Headline Font',
                  defaultValue: 'Baskervville, serif',
                },
                {
                  name: 'subheadingFontFamily',
                  type: 'text',
                  label: 'Subtitle Font',
                  defaultValue: 'Prompt, sans-serif',
                },
              ],
            },
          ],
        },
        {
          type: 'group',
          name: 'buttons',
          label: 'Interactive Buttons',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'buttonBgColor',
                  type: 'text',
                  defaultValue: '#FFD700',
                  admin: { components: { Field: '@/components/ColorPicker' } as any },
                },
                {
                  name: 'buttonTextColor',
                  type: 'text',
                  defaultValue: '#000000',
                  admin: { components: { Field: '@/components/ColorPicker' } as any },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'buttonHoverBgColor',
                  type: 'text',
                  defaultValue: '#E6B800',
                  admin: { components: { Field: '@/components/ColorPicker' } as any },
                },
                {
                  name: 'buttonHoverTextColor',
                  type: 'text',
                  defaultValue: '#000000',
                  admin: { components: { Field: '@/components/ColorPicker' } as any },
                },
              ],
            },
            {
              name: 'buttonBorderRadius',
              type: 'text',
              defaultValue: '0.375rem',
              label: 'Corner Roundness',
            },
          ],
        },
      ],
    },
    // ==========================================
    // 6. TRACKING & ANALYTICS
    // ==========================================
    {
      type: 'collapsible',
      label: '📊 Tracking & Analytics',
      fields: [
        {
          type: 'group',
          name: 'tracking',
          label: false,
          fields: [
            {
              name: 'googleAnalyticsId',
              type: 'text',
              label: 'Google Analytics ID',
              admin: {
                placeholder: 'G-XXXXXXXXXX',
                description: 'Your GA4 measurement ID (starts with G-)',
              },
            },
            {
              name: 'googleTagManagerId',
              type: 'text',
              label: 'Google Tag Manager ID',
              admin: { placeholder: 'GTM-XXXXXX', description: 'Container ID (starts with GTM-)' },
            },
            {
              name: 'metaPixelId',
              type: 'text',
              label: 'Meta Pixel ID',
              admin: {
                placeholder: '123456789012345',
                description: 'Your Facebook/Meta Pixel ID (numeric)',
              },
            },
            {
              name: 'customHeadScripts',
              type: 'code',
              label: 'Custom Head Scripts',
              admin: {
                language: 'html',
                description: 'Paste any custom scripts to be inserted in the <head>.',
              },
            },
            {
              name: 'customBodyScripts',
              type: 'code',
              label: 'Custom Body Scripts',
              admin: {
                language: 'html',
                description: 'Paste scripts to be placed at the end of the <body>.',
              },
            },
          ],
        },
      ],
    },
  ],
}
