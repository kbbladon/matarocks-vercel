// scripts/migrate-to-cloudinary.ts
import { config } from 'dotenv'
import { MongoClient } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

// Load .env.local
config({ path: path.resolve(process.cwd(), '.env.local') })

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const MONGODB_URI = process.env.DATABASE_URL
if (!MONGODB_URI) throw new Error('DATABASE_URL not set in .env.local')
const DB_NAME = new URL(MONGODB_URI).pathname.substring(1)

// ✅ FORCE to use public/media
const LOCAL_STORAGE_DIR = path.join(process.cwd(), 'public', 'media')
if (!fs.existsSync(LOCAL_STORAGE_DIR)) {
  console.error(`❌ Local media directory not found: ${LOCAL_STORAGE_DIR}`)
  console.error(
    'Please ensure your Payload static files are stored there, or adjust the path in the script.',
  )
  process.exit(1)
}
console.log(`📁 Using local media directory: ${LOCAL_STORAGE_DIR}`)

async function uploadToCloudinary(filePath: string, originalFilename: string): Promise<string> {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: `media/${originalFilename.replace(/\.[^/.]+$/, '')}`,
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    })
    return result.secure_url
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error)
    throw error
  }
}

async function migrateImages() {
  const client = new MongoClient(MONGODB_URI)
  try {
    await client.connect()
    const db = client.db(DB_NAME)
    const mediaCollection = db.collection('media')

    const allMedia = await mediaCollection.find({}).toArray()
    console.log(`Found ${allMedia.length} media documents`)

    for (const doc of allMedia) {
      let updated = false
      const updates: any = {}

      const migrateUrl = async (oldUrl: string | undefined, fieldPath: string) => {
        if (!oldUrl) return
        if (oldUrl.startsWith('http')) {
          console.log(`⏭️ Already cloud: ${oldUrl} (${fieldPath})`)
          return
        }
        const match = oldUrl.match(/\/api\/media\/file\/([^?]+)/)
        if (!match) {
          console.warn(`⚠️ Could not parse filename from ${oldUrl} (doc ${doc._id})`)
          return
        }
        const filename = match[1]
        const localPath = path.join(LOCAL_STORAGE_DIR, filename)
        if (!fs.existsSync(localPath)) {
          console.warn(`❌ File not found: ${localPath} (doc ${doc._id})`)
          return
        }
        console.log(`📤 Uploading ${filename}...`)
        const cloudUrl = await uploadToCloudinary(localPath, filename)
        updates[fieldPath] = cloudUrl
        updated = true
        console.log(`✅ Updated ${fieldPath} -> ${cloudUrl}`)
      }

      await migrateUrl(doc.url, 'url')

      if (doc.sizes && typeof doc.sizes === 'object') {
        for (const [sizeName, sizeValue] of Object.entries(doc.sizes) as any) {
          if (sizeValue && sizeValue.url) {
            await migrateUrl(sizeValue.url, `sizes.${sizeName}.url`)
          }
        }
      }

      if (updated) {
        await mediaCollection.updateOne({ _id: doc._id }, { $set: updates })
        console.log(`✅ Updated document ${doc._id}`)
      } else {
        console.log(`⏭️ Skipped document ${doc._id}`)
      }
    }

    console.log('🎉 Migration complete!')
  } catch (error) {
    console.error('Migration failed:', error)
  } finally {
    await client.close()
  }
}

migrateImages().catch(console.error)
