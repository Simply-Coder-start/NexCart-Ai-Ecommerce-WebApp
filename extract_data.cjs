const fs = require('fs');

const shopPath = 'src/pages/Shop.jsx';
let shop = fs.readFileSync(shopPath, 'utf8');

// Find the start and end of ALL_PRODUCTS
const startContent = "const ALL_PRODUCTS = [";
const endContent = "];\nconst SIZES";

const startIndex = shop.indexOf(startContent);
const endIndex = shop.indexOf(endContent);

if (startIndex !== -1 && endIndex !== -1) {
  // Extract string representing exactly the ALL_PRODUCTS array definition
  const arrayString = shop.substring(startIndex, endIndex + 2);
  
  // Change "const ALL_PRODUCTS" to "export const products"
  let dataFileContent = arrayString.replace("const ALL_PRODUCTS", "export const products");

  // Write to src/data/products.js
  if (!fs.existsSync('src/data')) {
    fs.mkdirSync('src/data');
  }
  fs.writeFileSync('src/data/products.js', dataFileContent, 'utf8');

  // Replace that chunk in Shop.jsx with an import statement
  const importStatement = "import { products as ALL_PRODUCTS } from '../data/products';\n";
  // Then stitch it together
  const firstPart = shop.substring(0, startIndex);
  const secondPart = shop.substring(endIndex + 2); // starts right at "\nconst SIZES"
  
  fs.writeFileSync(shopPath, firstPart + importStatement + secondPart, 'utf8');
  console.log("Refactoring complete: Data moved out of Shop.jsx into src/data/products.js");
} else {
  console.log("Error: Boundaries not found in Shop.jsx. Indices: " + startIndex + ", " + endIndex);
}
