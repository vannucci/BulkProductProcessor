/// <reference path="../pb_data/types.d.ts" />

onRecordAfterCreateSuccess((e) => {
  if (e.record.collection().name !== "products") {
    return;
  }

  const productName = e.record.get("name");
  const productId = e.record.id;

  const words = [...new Set(productName.toLowerCase().split(/\s+/))];

  const collection = $app.findCollectionByNameOrId("word_index");

  words.forEach((word) => {
    const record = new Record(collection);
    record.set("word", word);
    record.set("products", productId);
    $app.save(record);
  });
});
