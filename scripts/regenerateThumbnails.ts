// scripts/regenerateThumbnails.ts
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

  console.log(`Found ${mediaItems.totalDocs} media items. Regenerating thumbnails...`)

  let updated = 0
  let failed = 0

  for (const doc of mediaItems.docs) {
    try {
      // A minimal update triggers the plugin to rebuild URLs and sizes
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          // Toggle a non‑critical field or just bump updatedAt
          updatedAt: new Date().toISOString(),
        },
      })
      console.log(`✅ Regenerated: ${doc.filename}`)
      updated++
    } catch (err) {
      console.error(`❌ Failed: ${doc.filename}`, err)
      failed++
    }
  }

  console.log(`\n📊 Updated: ${updated}, Failed: ${failed}`)
  process.exit(0)
}

run()
