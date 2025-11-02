import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import chokidar from 'chokidar'
import PocketBase from 'pocketbase'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const IMPORT_DIR = path.join(__dirname, '../import_files')
const pb = new PocketBase('http://127.0.0.1:8090')

if (!fs.existsSync(IMPORT_DIR)) {
  fs.mkdirSync(IMPORT_DIR, { recursive: true })
}

async function registerFile(filename) {
  try {
    const record = await pb.collection('files').create({
      filename: filename,
      file_hash: 'n/a',
      status: 'pending',
      row_count: 0
    })

    console.log(`✅ Registered: ${filename}`)
    return record
    
  } catch (err) {
    console.error(`❌ Failed to register ${filename}:`, err.message)
    return null
  }
}

async function checkFilenameExists(filename) {
  try {
    // Use getFirstListItem - throws error if not found
    await pb.collection('files').getFirstListItem(`filename="${filename}"`)
    console.log(`🔍 ${filename}: EXISTS in DB`)
    return true
    
  } catch (err) {
    // Error means not found
    console.log(`🔍 ${filename}: NOT in DB`)
    return false
  }
}


async function scanExistingFiles() {
  console.log('🔍 Scanning existing files...\n')
  
  const files = fs.readdirSync(IMPORT_DIR).filter(f => f.endsWith('.csv'))
  
  for (const filename of files) {
      console.log('🔍 Scanning existing files...\n', filename)

    const exists = await checkFilenameExists(filename)
    
    if (exists) {
      console.log(`⏭️  Skipping (already in DB): ${filename}`)
    } else {
      await registerFile(filename)
    }
  }
  
  console.log('\n✅ Initial scan complete\n')
}

console.log(`👀 Watching: ${IMPORT_DIR}`)

const watcher = chokidar.watch(IMPORT_DIR, {
  ignored: /^\./,
  persistent: true,
  ignoreInitial: true
})

watcher.on('add', async (filePath) => {
  const filename = path.basename(filePath)
  
  if (!filename.endsWith('.csv')) {
    return
  }
  
  console.log(`\n📁 New file detected: ${filename}`)
  
  setTimeout(async () => {
    const exists = await checkFilenameExists(filename)
    
    if (exists) {
      console.log(`❌ DUPLICATE FILENAME: ${filename}`)
    } else {
      await registerFile(filename)
    }
  }, 500)
})

scanExistingFiles()