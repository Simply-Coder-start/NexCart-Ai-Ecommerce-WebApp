const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Product = require('./models/Product');

// We need to load the environment variables from the root .env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing from .env");
  process.exit(1);
}

// Ensure the frontend products can be loaded
const ProductService = require('./services/ProductService');
const productsToSeed = ProductService.ALL_PRODUCTS;

if (!productsToSeed || productsToSeed.length === 0) {
  console.error("❌ No products found to seed in ProductService");
  process.exit(1);
}

async function seedDatabase() {
  try {
    console.log(`⏳ Connecting to MongoDB... (${MONGODB_URI})`);
    await mongoose.connect(MONGODB_URI, {
      autoIndex: true,
    });
    console.log("✅ MongoDB Connected");

    console.log("🗑️  Clearing existing products...");
    await Product.deleteMany({});
    
    console.log(`🌱 Seeding ${productsToSeed.length} products...`);
    
    // Transform products to match our Mongoose schema 
    // (removing old sqlite ID, let MongoDB create objectId)
    const formattedProducts = productsToSeed.map(p => {
      const { id, ...rest } = p;
      return rest;
    });

    await Product.insertMany(formattedProducts);
    
    console.log("🎉 Seeding complete! You can now view the data in MongoDB Compass.");
    process.exit(0);

  } catch (error) {
    console.error("❌ Seeding Error:", error.message);
    process.exit(1);
  }
}

seedDatabase();
