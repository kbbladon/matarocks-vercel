// scripts/updateMediaUrls.ts
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Load .env.local explicitly
const envPath = path.resolve(dirname, '../.env.local')
dotenv.config({ path: envPath })

// Verify required variables
const requiredVars = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'PAYLOAD_SECRET',
  'DATABASE_URL',
]

const missing = requiredVars.filter((v) => !process.env[v])
if (missing.length) {
  console.error('❌ Missing environment variables:', missing.join(', '))
  console.error('Make sure .env.local contains all of them.')
  process.exit(1)
}

// Now import and run
const run = async () => {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../src/payload.config.js')

  const payload = await getPayload({ config })

  const mediaItems = await payload.find({
    collection: 'media',
    limit: 999,
  })

  console.log(`Found ${mediaItems.totalDocs} media items. Updating...`)

  for (const doc of mediaItems.docs) {
    try {
      const updated = await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          updatedAt: new Date().toISOString(),
        },
      })
      console.log(`✅ Updated: ${doc.filename} → ${updated.url}`)
    } catch (error) {
      console.error(`❌ Failed: ${doc.filename}`, error)
    }
  }

  console.log('Done.')
  process.exit(0)
}

run()
