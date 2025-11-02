/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3446931122")

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "file740683085",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "csv_file",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3446931122")

  // remove field
  collection.fields.removeById("file740683085")

  return app.save(collection)
})
