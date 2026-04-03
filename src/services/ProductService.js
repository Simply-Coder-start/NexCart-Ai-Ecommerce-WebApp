// src/services/ProductService.js
const { getDb } = require('../db');

const parseProduct = (row) => {
    if (!row) return null;
    return {
        ...row,
        tryOnEligible: Boolean(row.tryOnEligible),
        isNew: Boolean(row.isNew),
        colors: JSON.parse(row.colors || '[]')
    };
};

const UNSPLASH_IMAGES = {
    // ── Fashion: Local professional product images (no models) ──
    "fashion": {
        "Dresses": ["/images/products/dress-1.jpg", "/images/products/dress-2.jpg", "/images/products/dress-3.jpg"],
        "Tops": ["/images/products/top-1.jpg", "/images/products/top-2.jpg", "/images/products/top-3.jpg"],
        "Suits": ["/images/products/suit-1.jpg", "/images/products/suit-2.jpg", "/images/products/suit-3.jpg"],
        "Outerwear": ["/images/products/outerwear-1.jpg", "/images/products/outerwear-2.jpg", "/images/products/outerwear-3.jpg"],
        "Accessories": ["/images/products/accessories-1.jpg", "/images/products/accessories-2.jpg"],
    },
    "electronics": [
        "photo-1498049794561-7780e7231661", "photo-1505740420928-5e560c06d30e", "photo-1523206489230-c012c64b2b48", "photo-1546868871-af0de0ae72be",
        "photo-1583394838336-acd977736f90", "photo-1608043152269-423dbba4e7e1", "photo-1517404215738-15263e9f9178", "photo-1588508065123-287b28e0131b",
        "photo-1574944985070-8f3ebc6b79d2", "photo-1611186871348-b1ce696e52c9", "photo-1593642632823-8f785ba67e45", "photo-1527661591475-527312dd65f5"
    ],
    "home": [
        "photo-1484101403633-562f891dc89a", "photo-1493663284031-b7e3aefcae8e", "photo-1505691938895-1758d7feb511", "photo-1507473885765-e6ed057ab6fe",
        "photo-1513161455079-7dc1de15ef3e", "photo-1540518614846-7eded433c457", "photo-1524758631624-e2822e304c36", "photo-1531390494498-842217cbf0f3",
        "photo-1555041469-a586c61ea9bc", "photo-1558904541-efa843a96f09", "photo-1567225557594-56b107ebdc2d", "photo-1578683010236-d716f9a3f461"
    ],
    "books": [
        "photo-1544947950-fa07a98d237f", "photo-1495446815901-a7297e633e8d", "photo-1512820790803-83ca734da794", "photo-1524578271613-d550eacf6090",
        "photo-1532012197267-da84d127e765", "photo-1457369804613-52c61a468e7d", "photo-1589998059171-989d887dda6e", "photo-1513475382585-d06e58bcb0e0",
        "photo-1474932430478-367d16b99031", "photo-1516979187457-637dc4a990f2"
    ],
    "sports": [
        "photo-1517836357463-d25dfeac3438", "photo-1534438327276-14e5300c3a48", "photo-1541534741688-6078c6bfb5c5", "photo-1542291026-7eec264c27ff",
        "photo-1515523110800-9415d13b84a8", "photo-1579952363873-27f3bade9f55", "photo-1530549387720-bc8d3e4293cc", "photo-1483721310020-03333e577078",
        "photo-1540206276207-3af25c08abc4", "photo-1580087612141-8656c1d7cc91"
    ],
    "beauty": [
        "photo-1522335155122-f0bcdf368d18", "photo-1596462502278-27bf85033e5a", "photo-1556228578-0d85b1a4d571", "photo-1571781926291-c477eb69260c",
        "photo-1599305090598-fe179d501227", "photo-1590156546946-cb59005669f6", "photo-1620916566398-39f1143ab7be", "photo-1616683693504-3ea7e9ad6ece",
        "photo-1611005234140-5aaceeb4dcb7", "photo-1631730486784-5456119f69ae"
    ]
};

const PRODUCT_NAMES = {
    "fashion": {
        "Dresses": ["Silk Aurora Gown", "Velvet Midnight Dress", "Floral Summer Maxi", "Ruby Evening Gown", "Sapphire Cocktail Dress"],
        "Tops": ["Cloud Cotton Blouse", "Silk Drape Top", "Linen Breeze Shirt", "Cashmere Blend Sweater", "Lace Detail Camisole"],
        "Suits": ["Executive Edge Suit", "Metropolitan Blazer", "Classic Navy Tuxedo", "Charcoal Wool Suit", "Pinstripe Double Breasted"],
        "Outerwear": ["Arctic Explorer Parka", "Suede Horizon Jacket", "Classic Trench Coat", "Vegan Leather Moto", "Puffer Winter Jacket"]
    },
    "electronics": {
        "Audio": ["ProMax Wireless Earbuds", "Studio Monitor Pro", "Noise Cancelling Headphones", "Portable Bluetooth Speaker", "Soundbar Home Theater"],
        "Computers": ["UltraBook Pro 15", "Gaming Desktop Max", "Convertible 2-in-1 Laptop", "Curved Ultrawide Monitor", "Ergonomic Mechanical Keyboard"],
        "Mobile": ["Quantum X Smartphone", "Flip Fold 3", "Elite Tablet Pro", "Wireless Charging Pad", "High-capacity Power Bank"],
        "Cameras": ["Alpha DSLR Body", "4K Action Camera", "Vlogging Kit Complete", "Drone with 4K Gimbal", "Instant Film Camera"]
    },
    "home": {
        "Furniture": ["Ergonomic Desk Chair", "Velvet Accent Sofa", "Oak Coffee Table", "Minimalist TV Stand", "Platform Bed Frame"],
        "Kitchen": ["Espresso Master 5000", "Non-stick Ceramic Set", "Smart Air Fryer", "High-Speed Blender", "Chef's Knife Collection"],
        "Decor": ["Abstract Canvas Art", "Geometric Throw Pillows", "Hand-woven Area Rug", "LED Floor Lamp", "Ceramic Vases Set"],
        "Bedding": ["Luxury Silk Sheets", "Weighted Blanket", "Memory Foam Pillows", "Duvet Cover Set", "Blackout Curtains"]
    },
    "books": {
        "Fiction": ["The Midnight Library", "Echoes of Eternity", "The Last Chronicle", "Shadows of the Forgotten", "Winds of Change"],
        "Non-Fiction": ["Atomic Habits: Expanded", "Sapiens: A Brief History", "The Art of Thinking", "Deep Work Principles", "Quiet Power"],
        "Sci-Fi": ["Neuromancer Updated", "Dune: Imperial Edition", "The Martian Rescue", "Foundation Chronicles", "Cyberpunk Futures"],
        "Business": ["Zero to Mastery", "The Lean Startup", "Good to Outstanding", "Thinking Fast and Slow", "Principles in Action"]
    },
    "sports": {
        "Fitness": ["Pro Yoga Mat", "Adjustable Dumbbells", "Resistance Bands Set", "Foam Roller Pro", "Kettlebell 15kg"],
        "Outdoor": ["Camping Tent 4-Person", "Hiking Backpack 50L", "Insulated Water Bottle", "Trekking Poles", "Sleeping Bag -10C"],
        "Cycling": ["Road Bike Helmet", "LED Bike Lights", "Cycling Gloves", "Bike Phone Mount", "Portable Bike Pump"],
        "Apparel": ["Compression Shorts", "Dry-Fit Running Tee", "Sports Bra Max Support", "Athletic Socks Pack", "Running Visor"]
    },
    "beauty": {
        "Skincare": ["Hyaluronic Acid Serum", "Vitamin C Brightening", "Night Repair Cream", "Gentle Salicylic Cleanser", "SPF 50 Sunscreen"],
        "Makeup": ["Flawless Foundation", "Volumizing Mascara", "Matte Liquid Lipstick", "Eyeshadow Palette", "Setting Spray"],
        "Haircare": ["Argan Oil Treatment", "Heat Protectant Spray", "Dry Shampoo Pro", "Ceramic Flat Iron", "Ionic Hair Dryer"],
        "Fragrance": ["Ocean Breeze Perfume", "Midnight Amber Cologne", "Floral Bloom Eau de Toilette", "Citrus Splash Body Mist", "Wood & Spice Parfum"]
    }
};

const WEARABLE_CATEGORIES = new Set(["fashion", "sports"]);
const WEARABLE_SUBCATEGORIES = new Set(["Dresses", "Tops", "Suits", "Outerwear", "Accessories", "Footwear", "Apparel"]);

function _unsplash_url(photo_id) {
    return `https://images.unsplash.com/${photo_id}?q=85&w=600&h=750&auto=format&fit=crop&crop=top`;
}
function _unsplash_thumb(photo_id) {
    return `https://images.unsplash.com/${photo_id}?q=60&w=200&h=250&auto=format&fit=crop&crop=top`;
}

const COLORS_POOL = ["black", "white", "red", "blue", "green", "orange", "purple"];
const SIZES_POOL = ["XS", "S", "M", "L", "XL", "XXL"];

// Create realistic sounding descriptions
const getGenericDescription = (name, cat, price) => {
    return `Experience premium quality with the ${name}. Carefully crafted for maximum performance and style, this piece from our ${cat} collection is an essential addition to your lifestyle. Combining modern design with timeless functionality, it delivers exceptional value. Rated highly by experts, it stands out with unparalleled reliability.`;
};

function generate_products() {
    let products = [];
    let product_id = 1;

    for (const [category, subcategories] of Object.entries(PRODUCT_NAMES)) {
        const images = UNSPLASH_IMAGES[category] || ["photo-1544947950-fa07a98d237f"];
        
        for (const [subcategory, names] of Object.entries(subcategories)) {
            for (const name of names) {
                let price = parseFloat((Math.random() * (499.99 - 19.99) + 19.99).toFixed(2));
                
                let original_price = null;
                if (Math.random() < 0.4) {
                    original_price = parseFloat((price * (Math.random() * (1.4 - 1.1) + 1.1)).toFixed(2));
                }

                let badge = null;
                const r = Math.random();
                if (r < 0.15) badge = "hot";
                else if (r < 0.3) badge = "new";
                else if (original_price) badge = "sale";

                let rating = parseFloat((Math.random() * (5.0 - 3.8) + 3.8).toFixed(1));
                let review_count = Math.floor(Math.random() * 500) + 10;

                let image = "";
                let gallery = [];

                if (category === "fashion") {
                    const subImgs = UNSPLASH_IMAGES.fashion[subcategory] || UNSPLASH_IMAGES.fashion["Dresses"];
                    image = subImgs[product_id % subImgs.length];
                    gallery = [
                        subImgs[product_id % subImgs.length],
                        subImgs[(product_id + 1) % subImgs.length],
                        subImgs[(product_id + 2) % subImgs.length]
                    ].filter(Boolean);
                } else {
                    const img_id = images[product_id % images.length];
                    image = _unsplash_url(img_id);
                    gallery = [
                        _unsplash_url(images[product_id % images.length]), 
                        _unsplash_url(images[(product_id + 1) % images.length]),
                        _unsplash_url(images[(product_id + 2) % images.length])
                    ];
                }

                // Pick 1-3 random colors
                const colors = [];
                const colorCount = Math.floor(Math.random() * 3) + 1;
                for(let i=0; i<colorCount; i++) {
                    const c = COLORS_POOL[Math.floor(Math.random() * COLORS_POOL.length)];
                    if(!colors.includes(c)) colors.push(c);
                }

                const try_on = WEARABLE_CATEGORIES.has(category) && WEARABLE_SUBCATEGORIES.has(subcategory);
                
                const description = getGenericDescription(name, category, price);
                const highlights = [
                    "Premium Materials and Build Quality",
                    "Modern, Ergonomic Design",
                    "1-Year Global Warranty included",
                    "Free Express Shipping Eligible"
                ];

                products.push({
                    id: product_id,
                    name,
                    category,
                    subcategory,
                    price,
                    originalPrice: original_price,
                    badge,
                    tryOnEligible: try_on,
                    image,
                    gallery,
                    colors,
                    sizes: SIZES_POOL, // All products support all sizes in this mock
                    isNew: badge === "new",
                    rating,
                    reviewCount: review_count,
                    description,
                    highlights
                });
                product_id++;
            }
        }
    }
    return products;
}

const ALL_PRODUCTS = generate_products();

class ProductService {
    static async getAllProducts() {
        return ALL_PRODUCTS; // Force in-memory use to get all 120 rich products
    }

    static async getProductById(id) {
        return ALL_PRODUCTS.find(p => p.id === parseInt(id));
    }

    static async searchProducts(query, category = null, filters = {}) {
        const { minPrice, maxPrice, color, size } = filters;
        
        const q = query.toLowerCase().trim();
        return ALL_PRODUCTS.filter(p => {
            if (category && category !== "all" && p.category !== category) return false;
            if (minPrice && p.price < Number(minPrice)) return false;
            if (maxPrice && p.price > Number(maxPrice)) return false;
            if (color && color !== 'all' && (!p.colors || !p.colors.includes(color))) return false;
            if (size && size !== 'all' && (!p.sizes || !p.sizes.includes(size))) return false;
            return (p.name.toLowerCase().includes(q) ||
                p.subcategory.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q));
        });
    }
}

ProductService.ALL_PRODUCTS = ALL_PRODUCTS;
module.exports = ProductService;
