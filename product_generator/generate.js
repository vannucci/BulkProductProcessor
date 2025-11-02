import { faker } from '@faker-js/faker'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure output directory exists
const outputDir = path.join(__dirname, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}

function generateProduct() {
  return {
    name: faker.commerce.productName(),
    price: faker.commerce.price({ min: 5, max: 500, dec: 2 }),
    department: faker.commerce.department()
  }
}

function generateCSV(count) {
  const products = []
  
  for (let i = 0; i < count; i++) {
    products.push(generateProduct())
  }
  
  // Build CSV
  let csv = 'name,price,department\n'
  products.forEach(p => {
    // Escape commas in product names
    const name = p.name.replace(/,/g, '')
    csv += `${name},${p.price},${p.department}\n`
  })
  
  return csv
}

// Get count from command line or default to 100
const count = parseInt(process.argv[2]) || 100
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
const filename = process.argv[3] || `products_${count}_${timestamp}.csv`

console.log(`🔄 Generating ${count} products...`)

const csv = generateCSV(count)
const outputPath = path.join(outputDir, filename)

fs.writeFileSync(outputPath, csv)

console.log(`✅ Generated ${count} products`)
console.log(`📁 Saved to: output/${filename}`)
console.log(`\nTo import: Copy this file to ../import_files/`)