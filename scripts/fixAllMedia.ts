// scripts/fixAllMedia.ts
import { getPayload } from 'payload'
import config from '../src/payload.config.js'

const run = async () => {
  // Verify env is loaded (should be via --env-file)
  if (!process.env.PAYLOAD_SECRET) {
    console.error('❌ PAYLOAD_SECRET not found in environment.')
    console.error(
      'Make sure you run with: node --env-file=.env.local --import tsx scripts/fixAllMedia.ts',
    )
    process.exit(1)
  }

  const payload = await getPayload({ config })

  const mediaItems = await payload.find({
    collection: 'media',
    limit: 9999,
  })

  console.log(`Found ${mediaItems.totalDocs} media items. Processing...`)

  let fixed = 0
  let skipped = 0
  let failed = 0

  for (const doc of mediaItems.docs) {
    // Skip if URL already contains '/image/upload' and '/media/'
    if (doc.url?.includes('/image/upload') && doc.url?.includes('/media/')) {
      console.log(`⏭️  Already correct: ${doc.filename}`)
      skipped++
      continue
    }

    try {
      const updated = await payload.update({
        collection: 'media',
        id: doc.id,
        data: {
          updatedAt: new Date().toISOString(),
        },
      })
      console.log(`✅ Fixed: ${doc.filename} → ${updated.url}`)
      fixed++
    } catch (err) {
      console.error(`❌ Failed: ${doc.filename}`, err)
      failed++
    }
  }

  console.log('\n📊 Summary:')
  console.log(`   ✅ Fixed: ${fixed}`)
  console.log(`   ⏭️  Skipped (already correct): ${skipped}`)
  console.log(`   ❌ Failed: ${failed}`)
  process.exit(0)
}

run()
