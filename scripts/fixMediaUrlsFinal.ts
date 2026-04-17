import { getPayload } from 'payload'
import config from '../src/payload.config.js'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

const run = async () => {
  const payload = await getPayload({ config })

  const mediaItems = await payload.find({
    collection: 'media',
    limit: 9999,
  })

  console.log(`Found ${mediaItems.totalDocs} media items.`)

  for (const doc of mediaItems.docs) {
    // Skip if URL already looks like a proper Cloudinary image URL
    if (doc.url?.startsWith('https://res.cloudinary.com/')) {
      console.log(`⏭️  Already OK: ${doc.filename}`)
      continue
    }

    let newUrl: string | null = null

    // If we have cloudinaryPublicId, generate URL from it
    if (doc.cloudinaryPublicId) {
      newUrl = cloudinary.url(doc.cloudinaryPublicId, {
        secure: true,
        resource_type: doc.cloudinaryResourceType || 'image',
      })
    } else {
      // Fallback: try to extract public_id from existing url (if any)
      // Or skip and log for manual fix
      console.warn(`⚠️  No cloudinaryPublicId for ${doc.filename} – requires manual URL`)
      continue
    }

    if (newUrl) {
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          url: newUrl,
        },
      })
      console.log(`✅ Updated: ${doc.filename} → ${newUrl}`)
    }
  }

  console.log('Done.')
  process.exit(0)
}

run()
