/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/api/files/process/{id}", (e) => {
  try {
    const fileId = e.request.pathValue("id")
    const fileRecord = $app.findRecordById("files", fileId)
    
    if (fileRecord.get("status") !== "pending") {
      return e.json(400, {
        success: false,
        error: "File is not in pending status"
      })
    }
    
    fileRecord.set("status", "processing")
    $app.save(fileRecord)
    
    const filename = fileRecord.get("filename")
    const filePath = __hooks + "/../import_files/" + filename
    const fileBytes = $os.readFile(filePath)
    const fileContent = toString(fileBytes)
    
    const lines = fileContent.split('\n').filter(line => line.trim())
    
    let processedCount = 0
    let skippedCount = 0
    const errors = []
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      const values = line.split(',')
      
      if (values.length >= 3) {
        try {
          const name = values[0].trim()
          const price = parseFloat(values[1].trim())
          const department = values[2].trim()
          
          // Check if product already exists with same name, price, and department
          try {
            const existing = $app.findFirstRecordByFilter(
              "products",
              "name = {:name} && price = {:price} && department = {:dept}",
              { name: name, price: price, dept: department }
            )
            
            // Product exists, skip
            skippedCount++
            console.log("Skipping duplicate product:", name)
            continue
            
          } catch (err) {
            // No existing product, proceed with insert
          }
          
          const collection = $app.findCollectionByNameOrId("products")
          const record = new Record(collection)
          record.set("name", name)
          record.set("price", price)
          record.set("department", department)
          
          $app.save(record)
          processedCount++
          
        } catch (err) {
          errors.push("Line " + i + ": " + err.message)
          console.error("Failed to insert row", i, ":", err.message)
        }
      }
    }
    
    fileRecord.set("status", "complete")
    fileRecord.set("row_count", processedCount)
    if (errors.length > 0 || skippedCount > 0) {
      fileRecord.set("error_message", 
        (skippedCount > 0 ? skippedCount + " duplicates skipped. " : "") +
        (errors.length > 0 ? errors.join("; ") : "")
      )
    }
    $app.save(fileRecord)
    
    return e.json(200, {
      success: true,
      filename: filename,
      processed: processedCount,
      skipped: skippedCount,
      totalLines: lines.length - 1,
      errors: errors.length
    })
    
  } catch (err) {
    try {
      const fileRecord = $app.findRecordById(e.request.pathValue("id"))
      fileRecord.set("status", "error")
      fileRecord.set("error_message", err.message)
      $app.save(fileRecord)
    } catch (e) {
      console.error("Failed to update error status:", e)
    }
    
    return e.json(500, {
      success: false,
      error: err.message
    })
  }
})