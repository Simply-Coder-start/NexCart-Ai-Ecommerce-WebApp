// backend/services/ProductService.js

// This file is used primarily for seeding the Product model in MongoDB.
// It generates a set of mock products based on Unsplash categories.

const UNSPLASH_IMAGES = {
    "fashion": [
        "photo-1595777457583-95e059d581b8", "photo-1572804013309-59a88b7e92f1",
        "photo-1541099649105-f69ad21f3246", "photo-1617114919297-3c8ddb01f599",
        "photo-1515886657613-9f3515b0c78f", "photo-1509631179647-0177331693ae",
    ],
    "electronics": [
        "photo-1590658268037-6bf12f032f55", "photo-1546868871-af0de0ae72be",
        "photo-1608043152269-423dbba4e7e1", "photo-1583394838336-acd977736f90",
    ],
    "home": [
        "photo-1485955900006-10f4d324d411", "photo-1507473885765-e6ed057ab6fe",
        "photo-1594226801341-41427b4e5c22", "photo-1602028915047-37269d1a73f7",
    ],
    "books": [
        "photo-1544947950-fa07a98d237f", "photo-1532012197267-da84d127e765",
        "photo-1512820790803-83ca734da794", "photo-1497633762265-9d179a990aa6",
    ],
    "sports": [
        "photo-1542291026-7eec264c27ff", "photo-1601925260368-ae2f83cf8b7f",
        "photo-1598289431512-b97b0917affc", "photo-1602143407151-7111542de6e8",
    ],
    "beauty": [
        "photo-1556228578-0d85b1a4d571", "photo-1586495777744-4413f21062fa",
        "photo-1522338242992-e1a54571a9f7", "photo-1608571423902-eed4a5ad8108",
    ]
};

const PRODUCT_NAMES = {
    "fashion": {
        "Dresses": ["Silk Aurora Gown", "Velvet Midnight Dress"],
        "Tops": ["Cloud Cotton Blouse", "Silk Drape Top"],
        "Suits": ["Executive Edge Suit", "Metropolitan Blazer"],
        "Outerwear": ["Arctic Explorer Parka", "Suede Horizon Jacket"],
        "Accessories": ["Luxe Silk Scarf", "Woven Leather Belt"]
    },
    "electronics": {
        "Audio": ["ProMax Wireless Earbuds", "Studio Monitor Pro"]
    },
    // Truncated for example...
};

const COLORS_BY_CATEGORY = {
    "fashion": [["#000", "#881337"], ["#ef4444", "#fff"], ["#6366f1"]],
    "electronics": [["#000", "#fff"], ["#1f2937", "#d97706"]],
    "home": [["#d6d3d1", "#10b981"]],
    "books": [],
    "sports": [["#ef4444", "#000", "#fff"]],
    "beauty": [["#fdf2f8", "#fce7f3"]],
};

function _unsplash_url(photo_id) {
    return `https://images.unsplash.com/${photo_id}?q=80&w=800&auto=format&fit=crop`;
}

function generate_products() {
    let products = [];
    let product_id = 1;

    for (const [category, subcategories] of Object.entries(PRODUCT_NAMES)) {
        const images = UNSPLASH_IMAGES[category] || [];
        const colors_pool = COLORS_BY_CATEGORY[category] || [];

        for (const [subcategory, names] of Object.entries(subcategories)) {
            for (const name of names) {
                let price = parseFloat((Math.random() * (199.99 - 9.99) + 9.99).toFixed(2));
                let rating = parseFloat((Math.random() * (5.0 - 3.2) + 3.2).toFixed(1));
                const img_id = images.length > 0 ? images[product_id % images.length] : "photo-1544947950-fa07a98d237f";
                const image = _unsplash_url(img_id);

                products.push({
                    name,
                    category,
                    subcategory,
                    price,
                    tryOnEligible: category === "fashion",
                    image,
                    colors: colors_pool.length > 0 ? colors_pool[product_id % colors_pool.length] : [],
                    rating,
                    reviewCount: Math.floor(Math.random() * 1000) + 10,
                });
                product_id++;
            }
        }
    }
    return products;
}

const ALL_PRODUCTS = generate_products();

module.exports = {
    ALL_PRODUCTS
};
