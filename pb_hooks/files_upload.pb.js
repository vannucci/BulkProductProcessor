/// <reference path="../pb_data/types.d.ts" />

// Calculate hash after file upload
onRecordAfterCreateSuccess((e) => {
  if (e.record.collection().name !== 'files') {
    return
  }

  // Get the uploaded file
  const csvFile = e.record.get('csv_file')
  if (!csvFile) {
    return
  }

  // Read file and calculate hash
  const filePath = e.record.baseFilesPath() + '/' + csvFile
  const fileContent = $os.readFile(filePath)
  const hash = $security.md5(fileContent)

  // Check for duplicate
  try {
    const existing = $app.findFirstRecordByFilter(
      'files',
      'file_hash = {:hash} && id != {:id}',
      { hash: hash, id: e.record.id }
    )
    
    // Duplicate found - mark as error and delete this record
    e.record.set('status', 'error')
    e.record.set('error_message', 'Duplicate file detected')
    e.record.set('file_hash', hash)
    $app.save(e.record)
    
  } catch (err) {
    // No duplicate - update with real hash
    e.record.set('file_hash', hash)
    $app.save(e.record)
  }
})