# Product Generator

Generate realistic product CSV files for testing.

## Setup
```bash
npm install
```

## Usage
```bash
# Generate 100 products (default)
npm run generate

# Generate 500 products
npm run generate 500

# Generate with custom filename
npm run generate 1000 my_products.csv
```

## Output

Files are saved to `output/` directory. To import them:
```bash
# Copy to import directory
cp output/products_*.csv ../import_files/

# Or use the file watcher's directory
mv output/products_*.csv ../import_files/
```

## Product Format

Generated CSVs include:
- **name**: Realistic product names (e.g., "Ergonomic Cotton Keyboard")
- **price**: Random prices between $5-$500
- **department**: Standard retail departments
```

**Create `product_generator/.gitignore`:**
```
node_modules/
output/
*.csv