import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CLIENT_ID = 'D0nPIOXBYgZv9o3j3VXg75Bpt4YzisMCrb-kurnaVDY';
const FILE_PATH = path.join(__dirname, 'src', 'data', 'products.js');

async function fetchUnsplashImage(query) {
    try {
        console.log(`🔍 Searching Unsplash for: "${query}"...`);
        const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${CLIENT_ID}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const imageUrl = data.results?.[0]?.urls?.regular;
        
        if (imageUrl) {
            return `${imageUrl}&auto=format&fit=crop&q=80&w=800`;
        }
        return null;
    } catch (error) {
        console.error(`❌ Error fetching image for "${query}":`, error.message);
        return null;
    }
}

function isBrokenImage(img) {
    if (!img || typeof img !== 'string') return true;
    const lower = img.toLowerCase();
    
    // Check for dummy patterns
    const isDummy = lower.includes('placeholder') || 
                  lower.includes('dummy') || 
                  lower.includes('example') || 
                  lower.includes('test');
    
    // Check if it's a local/broken path (doesn't start with http)
    const isNotRemote = !img.startsWith('http');
    
    return isDummy || isNotRemote;
}

async function run() {
    try {
        // Read file as text to preserve exports and structure
        const fileContent = fs.readFileSync(FILE_PATH, 'utf-8');
        
        // Dynamically import to get access to all exported lists
        const modulePath = path.resolve(FILE_PATH);
        const allExports = await import(`file://${modulePath}?update=${Date.now()}`);

        console.log('🚀 Starting deep scan of all product data...');
        let totalUpdated = 0;

        for (const [exportName, productList] of Object.entries(allExports)) {
            if (!Array.isArray(productList)) continue;

            console.log(`📦 Scanning collection: "${exportName}" (${productList.length} items)...`);
            
            for (let product of productList) {
                // Check primary image
                const primaryBroken = isBrokenImage(product.image);
                
                // Check gallery (if exists and is empty or has broken links)
                const galleryBroken = !product.images || 
                                    !Array.isArray(product.images) || 
                                    product.images.length === 0 || 
                                    product.images.some(img => isBrokenImage(img));

                if (primaryBroken || galleryBroken) {
                    console.log(`⚠️  Broken/Placeholder found for: "${product.title || 'Untitled'}" (ID: ${product.id})`);
                    
                    const query = product.title || product.category || 'Product';
                    const newImageUrl = await fetchUnsplashImage(query);

                    if (newImageUrl) {
                        if (primaryBroken) product.image = newImageUrl;
                        if (galleryBroken) {
                            product.images = [newImageUrl];
                        }
                        totalUpdated++;
                        console.log(`✅ Fixed: ${product.title}`);
                        
                        // Wait 1s between requests (Unsplash Demo Limit)
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
        }

        if (totalUpdated > 0) {
            // Re-generate file content while preserving export names
            let newFileContent = '';
            for (const [exportName, productList] of Object.entries(allExports)) {
                newFileContent += `export const ${exportName} = ${JSON.stringify(productList, null, 2)};\n\n`;
            }
            
            fs.writeFileSync(FILE_PATH, newFileContent.trim() + '\n', 'utf-8');
            console.log(`\n🎉 Success! Overwrote ${FILE_PATH} with ${totalUpdated} new images.`);
        } else {
            console.log('\n✨ No broken or placeholder images found across all exported collections.');
        }

    } catch (error) {
        console.error('💥 Critical script error:', error.message);
        console.error(error.stack);
    }
}

run();
