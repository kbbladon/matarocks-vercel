// src/collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  access: {
    read: () => true,
  },
  upload: {
    disableLocalStorage: true,
    imageSizes: [],
    adminThumbnail: ({ doc }) => {
      const url = doc?.url as string | undefined
      if (!url) return null

      // Always use Cloudinary optimized thumbnail
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'db9py7ztw'

      // If already Cloudinary URL → just transform it
      if (url.includes('res.cloudinary.com')) {
        return url.replace('/upload/', '/upload/c_fill,w_400,h_300,q_auto,f_auto/')
      }

      // fallback for non-cloudinary assets
      return `https://res.cloudinary.com/${cloudName}/image/fetch/c_fill,w_400,h_300,q_auto,f_auto/${encodeURIComponent(url)}`
    },
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Alt Text',
      required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      label: 'Caption',
    },
  ],
}
