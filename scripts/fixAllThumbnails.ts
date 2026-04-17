// scripts/fixAllThumbnails.ts
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const run = async () => {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config.js')

  const payload = await getPayload({ config })

  const mediaItems = await payload.find({
    collection: 'media',
    limit: 9999,
  })

  console.log(`Found ${mediaItems.totalDocs} items. Fixing thumbnails...`)

  for (const doc of mediaItems.docs) {
    try {
      // First, clear sizes to force a full rebuild
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          sizes: {},
        },
      })

      // Then, trigger a normal update to regenerate sizes
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          updatedAt: new Date().toISOString(),
        },
      })

      console.log(`✅ Fixed thumbnails for ${doc.filename}`)
    } catch (err) {
      console.error(`❌ Failed: ${doc.filename}`, err)
    }
  }

  console.log('All done. Restart your dev server and hard refresh the admin panel.')
  process.exit(0)
}

run()
