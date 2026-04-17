// scripts/fixCloudinaryIds.ts
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET not found. Add it to .env.local')
  process.exit(1)
}

const run = async () => {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config.js')

  const payload = await getPayload({ config })

  const mediaItems = await payload.find({
    collection: 'media',
    limit: 9999,
  })

  console.log(`Found ${mediaItems.totalDocs} media items.`)

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const doc of mediaItems.docs) {
    if (doc.cloudinaryPublicId) {
      console.log(`⏭️  Already has publicId: ${doc.filename}`)
      skipped++
      continue
    }

    if (!doc.filename) {
      console.warn(`⚠️  Missing filename for doc ${doc.id}`)
      continue
    }

    const filenameWithoutExt = doc.filename.replace(/\.[^/.]+$/, '')
    const publicId = `media/${filenameWithoutExt}`

    // Ensure alt text exists (required field)
    const altText = doc.alt || doc.filename || 'Image'

    try {
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          alt: altText, // 👈 Provide default if missing
          cloudinaryPublicId: publicId,
          cloudinaryResourceType: 'image',
        },
      })
      console.log(`✅ Set publicId for ${doc.filename} → ${publicId}`)
      updated++
    } catch (err) {
      console.error(`❌ Failed to update ${doc.filename}:`, err)
      failed++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Updated: ${updated}`)
  console.log(`   ⏭️  Skipped (already had publicId): ${skipped}`)
  console.log(`   ❌ Failed: ${failed}`)
  console.log('🎉 Done!')
  process.exit(0)
}

run().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
