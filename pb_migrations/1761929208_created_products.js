/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_4092854851",
    "indexes": [],
    "listRule": null,
    "name": "products",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  app.save(collection);

    // Seed data with raw SQL
  const products = [
    ["Unbranded Wooden Pizza", "599.00", "Jewelery"],
    ["Luxurious Steel Keyboard", "39.00", "Home"],
    ["Handmade Cotton Towels", "569.00", "Music"],
    ["Modern Wooden Cheese", "171.00", "Games"],
    ["Licensed Granite Fish", "435.00", "Shoes"],
    ["Rustic Granite Soap", "817.00", "Industrial"],
    ["Recycled Granite Soap", "137.00", "Electronics"],
    ["Elegant Plastic Hat", "530.00", "Toys"],
    ["Luxurious Metal Car", "244.00", "Toys"],
    ["Modern Soft Salad", "971.00", "Shoes"],
    ["Rustic Metal Bacon", "770.00", "Games"],
    ["Handcrafted Frozen Chair", "330.00", "Health"],
    ["Unbranded Fresh Sausages", "844.00", "Garden"],
    ["Recycled Concrete Gloves", "497.00", "Sports"],
    ["Fantastic Granite Bike", "16.00", "Books"],
    ["Fantastic Wooden Car", "574.00", "Shoes"],
    ["Tasty Cotton Soap", "17.00", "Electronics"],
    ["Luxurious Granite Tuna", "716.00", "Baby"],
    ["Awesome Plastic Soap", "685.00", "Games"],
    ["Rustic Plastic Tuna", "197.00", "Garden"]
  ];

  products.forEach(p => {
    app.db().newQuery(`
      INSERT INTO products (product_name, price, category) 
      VALUES ({:name}, {:price}, {:category})
    `).bind({
      name: p[0],
      price: p[1],
      category: p[2]
    }).execute();
  });
  
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851");

  return app.delete(collection);
})
