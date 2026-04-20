import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { CardGrid } from '@/blocks/CardGrid/config'
import { ParallaxHero } from '@/blocks/ParallaxHero/config'
import { SplitContent } from '@/blocks/SplitContent/config'
import { VideoHero } from '@/blocks/VideoHero/config'
import { ImageGrid } from '@/blocks/ImageGrid/config'
import { CrossSectionCTA } from '@/blocks/CrossSectionCTA/config'
import { Cards } from '@/blocks/Cards/config'
import { SlickerSlide } from '@/blocks/SlickerSlide/config'
import { MenuTabs } from '@/blocks/MenuTabs/config'
import { MenuTable } from '@/blocks/MenuTable/config'
import { ImageRow } from '@/blocks/ImageRow/config'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: () => true, // 👈 Allow anyone for testing
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            // ---------- NEW PAGE BACKGROUND FIELDS ----------
            {
              type: 'collapsible',
              label: 'Page Background (optional)',
              fields: [
                {
                  name: 'backgroundImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Background Image',
                  admin: {
                    description: 'Leave empty to use the default site background.',
                  },
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
                    description: 'Applied as a transparent overlay over the background image.',
                  },
                },
                {
                  name: 'overlayOpacity',
                  type: 'number',
                  label: 'Overlay Opacity',
                  defaultValue: 0.7,
                  min: 0,
                  max: 1,
                  // step removed – users can still enter decimal values manually
                  admin: {
                    description: '0 = fully transparent, 1 = solid colour.',
                  },
                },
                {
                  name: 'contentWidth',
                  type: 'select',
                  label: 'Content Width',
                  defaultValue: 'contained',
                  options: [
                    { label: 'Contained (max-width, centered)', value: 'contained' },
                    { label: 'Full Width (edge to edge)', value: 'full' },
                  ],
                  admin: {
                    description: 'How the inner blocks are constrained horizontally.',
                  },
                },
              ],
            },
            // ---------- END OF BACKGROUND FIELDS ----------
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                CardGrid,
                ParallaxHero,
                SplitContent,
                VideoHero,
                ImageGrid,
                CrossSectionCTA,
                Cards,
                SlickerSlide,
                MenuTabs,
                MenuTable,
                ImageRow,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            {
              name: 'keywords',
              type: 'text',
              label: 'Meta Keywords (comma separated)',
              admin: {
                description: 'Separate keywords with commas',
              },
            },
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
