const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "Classic Black Watch",
    price: 2500,
    image: "p11.jpeg",
    description: "Stylish classic black watch for everyday use.",
    brand: "TIMEZONE",
    category: "Men",
    type: "Classic Watch",
  },
  {
    name: "Luxury Silver Watch",
    price: 4500,
    image: "p12.jpeg",
    description: "Elegant silver watch with a premium design.",
    brand: "TIMEZONE",
    category: "Men",
    type: "Luxury Watch",
  },
  {
    name: "Golden Classic Watch",
    price: 3500,
    image: "p2.jpeg",
    description: "Beautiful golden watch for special occasions.",
    brand: "TIMEZONE",
    category: "Men",
    type: "Classic Watch",
  },
  {
    name: "Sport Watch",
    price: 3000,
    image: "p3.jpeg",
    description: "Comfortable sports watch for an active lifestyle.",
    brand: "TIMEZONE",
    category: "Men",
    type: "Sport Watch",
  },
  {
    name: "Premium Blue Watch",
    price: 4000,
    image: "p4.jpeg",
    description: "Premium blue watch with a modern look.",
    brand: "TIMEZONE",
    category: "Women",
    type: "Luxury Watch",
  },
  {
    name: "Elegant Leather Watch",
    price: 3200,
    image: "p5.jpeg",
    description: "Elegant leather watch suitable for daily wear.",
    brand: "TIMEZONE",
    category: "Women",
    type: "Classic Watch",
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(
      "mongodb://127.0.0.1:27017/timezone"
    );

    // Avoid inserting the same six products repeatedly
    for (const product of products) {
      await Product.findOneAndUpdate(
        { name: product.name },
        product,
        {
          upsert: true,
          new: true,
          runValidators: true,
        }
      );
    }

    console.log("Products added to MongoDB successfully!");
  } catch (error) {
    console.error("Error adding products:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();