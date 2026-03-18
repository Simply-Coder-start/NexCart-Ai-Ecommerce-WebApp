const { connectDB, getDb } = require('./db');
const ProductService = require('./services/ProductService');

async function seed() {
    await connectDB();
    const db = getDb();
    if (!db) {
        console.error("Failed to connect to SQLite. Cannot seed.");
        process.exit(1);
    }

    console.log("Creating products table...");
    await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            subcategory TEXT NOT NULL,
            price REAL NOT NULL,
            originalPrice REAL,
            badge TEXT,
            tryOnEligible INTEGER DEFAULT 0,
            image TEXT,
            colors TEXT DEFAULT '[]',
            isNew INTEGER DEFAULT 0,
            rating REAL DEFAULT 0,
            reviewCount INTEGER DEFAULT 0
        )
    `);

    console.log("Clearing existing data...");
    await db.exec('DELETE FROM products');

    console.log("Inserting ALL_PRODUCTS...");
    const products = ProductService.ALL_PRODUCTS;
    let count = 0;

    if (!products) {
        console.error("ALL_PRODUCTS not found in ProductService!");
        process.exit(1);
    }

    const stmt = await db.prepare(`
        INSERT INTO products (
            id, name, category, subcategory, price, originalPrice, badge, 
            tryOnEligible, image, colors, isNew, rating, reviewCount
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of products) {
        await stmt.run(
            p.id, p.name, p.category, p.subcategory, p.price, p.originalPrice, p.badge,
            p.tryOnEligible ? 1 : 0, p.image, JSON.stringify(p.colors), p.isNew ? 1 : 0, p.rating, p.reviewCount
        );
        count++;
    }
    await stmt.finalize();

    console.log(`Successfully seeded ${count} products to database.sqlite!`);
    process.exit(0);
}

seed();
