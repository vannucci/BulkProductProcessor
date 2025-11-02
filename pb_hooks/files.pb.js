/// <reference path="../pb_data/types.d.ts" />

routerAdd("POST", "/api/files/scan", (c) => {
  const importDir = __hooks + '/../import_files'
  
  try {
    const dirEntries = $os.readDir(importDir)
    
    // Return ALL files without filtering
    const allFiles = []
    dirEntries.forEach(entry => {
      allFiles.push({
        name: entry.name,
        isDir: entry.isDir()
      })
    })
    
    return c.json(200, {
      success: true,
      totalEntries: dirEntries.length,
      allFiles: allFiles,
      scannedDir: importDir
    })
    
  } catch (err) {
    return c.json(500, {
      success: false,
      error: err.message,
      dir: importDir
    })
  }
})