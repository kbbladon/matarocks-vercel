// scripts/fixMediaNow.ts
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

// Check that we have everything
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ PAYLOAD_SECRET not found. Add it to .env.local')
  process.exit(1)
}

// Now import payload and config
const { getPayload } = await import('payload')
const { default: config } = await import('../src/payload.config.js')
const { v2: cloudinary } = await import('cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

const payload = await getPayload({ config })

const mediaItems = await payload.find({ collection: 'media', limit: 9999 })
console.log(`Found ${mediaItems.totalDocs} items.`)

for (const doc of mediaItems.docs) {
  if (doc.url?.startsWith('https://res.cloudinary.com/')) {
    console.log(`✅ Already OK: ${doc.filename}`)
    continue
  }

  if (!doc.cloudinaryPublicId) {
    console.warn(`⚠️  No public ID for ${doc.filename} – skip`)
    continue
  }

  const newUrl = cloudinary.url(doc.cloudinaryPublicId, {
    secure: true,
    resource_type: doc.cloudinaryResourceType || 'image',
  })

  await payload.update({
    collection: 'media',
    id: doc.id,
    data: { url: newUrl },
  })
  console.log(`🔧 Fixed: ${doc.filename} → ${newUrl}`)
}

console.log('🎉 Done!')
process.exit(0)
