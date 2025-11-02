import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import chokidar from 'chokidar'
import PocketBase from 'pocketbase'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SERVICE_EMAIL = 'watcher@service.local'
const SERVICE_PASSWORD = 'WatcherService2024!'  // Use whatever password you set

const IMPORT_DIR = path.join(__dirname, '../import_files')
const pb = new PocketBase('http://127.0.0.1:8090')

// Update the authenticate function
async function authenticate() {
  try {
    // Authenticate as a regular user (not admin)
    await pb.collection('users').authWithPassword(SERVICE_EMAIL, SERVICE_PASSWORD)
    console.log('✅ Authenticated as:', pb.authStore.model?.email)
  } catch (err) {
    console.error('❌ Failed to authenticate:', err.message)
    console.error('Make sure the user exists and is verified in PocketBase')
    process.exit(1)
  }
}
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
    await pb.collection('files').getFirstListItem(`filename="${filename}"`)
    console.log(`🔍 ${filename}: EXISTS in DB`)
    return true
    
  } catch (err) {
    console.log(`🔍 ${filename}: NOT in DB`)
    return false
  }
}

async function scanExistingFiles() {
  console.log('🔍 Scanning existing files...\n')
  
  const files = fs.readdirSync(IMPORT_DIR).filter(f => f.endsWith('.csv'))
  
  for (const filename of files) {
    console.log(`🔍 Checking: ${filename}`)

    const exists = await checkFilenameExists(filename)
    
    if (exists) {
      console.log(`⏭️  Skipping (already in DB): ${filename}`)
    } else {
      await registerFile(filename)
    }
  }
  
  console.log('\n✅ Initial scan complete\n')
}

async function startWatcher() {
  // 🔥 Authenticate first
  await authenticate()
  
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
    
    // Wait for file to finish writing
    setTimeout(async () => {
      const exists = await checkFilenameExists(filename)
      
      if (exists) {
        console.log(`❌ DUPLICATE FILENAME: ${filename}`)
      } else {
        await registerFile(filename)
      }
    }, 500)
  })

  // Scan existing files after authentication
  await scanExistingFiles()
}

// Start the watcher
startWatcher()