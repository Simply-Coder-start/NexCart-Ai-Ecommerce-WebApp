// shop.js - Shop page logic with cart functionality

const API_BASE = 'http://localhost:5000/api';

// Mock products (in real app, fetch from backend)
const PRODUCTS = [
  { id: 'prod-1', name: 'Premium Wireless Headphones', price: 79.99, originalPrice: 129.99, rating: 4.8, reviewCount: 342, inStock: true, brand: 'AudioTech', category: 'Audio', description: 'High-fidelity audio with active noise cancellation.', image: '🎧' },
  { id: 'prod-2', name: 'Smart Fitness Watch', price: 129.99, originalPrice: 199.99, rating: 4.6, reviewCount: 856, inStock: true, brand: 'FitGear', category: 'Wearables', description: 'Track your health metrics with precision and style.', image: '⌚' },
  { id: 'prod-3', name: 'Portable Bluetooth Speaker', price: 49.99, originalPrice: 69.99, rating: 4.5, reviewCount: 210, inStock: true, brand: 'SoundWave', category: 'Audio', description: 'Waterproof design with 360-degree booming bass.', image: '🔊' },
  { id: 'prod-4', name: 'HD Webcam Pro', price: 89.99, originalPrice: 109.99, rating: 4.2, reviewCount: 154, inStock: false, brand: 'VisionStream', category: 'Accessories', description: '1080p 60fps clarity for streams and meetings.', image: '📷' },
  { id: 'prod-5', name: 'Wireless Gaming Mouse', price: 59.99, originalPrice: 79.99, rating: 4.7, reviewCount: 432, inStock: true, brand: 'ClickMaste', category: 'Gaming', description: 'Ultra-low latency with customizable RGB lighting.', image: '🖱️' },
  { id: 'prod-6', name: 'Mechanical Keyboard', price: 119.99, originalPrice: 149.99, rating: 4.9, reviewCount: 620, inStock: true, brand: 'KeyPro', category: 'Gaming', description: 'Tactile switches built for durability and speed.', image: '⌨️' },
  { id: 'prod-7', name: 'USB-C Hub Adapter', price: 39.99, originalPrice: 49.99, rating: 4.3, reviewCount: 189, inStock: true, brand: 'ConnectX', category: 'Accessories', description: '7-in-1 dongle providing essential ports.', image: '🔌' },
  { id: 'prod-8', name: 'Smartphone Stand', price: 24.99, originalPrice: 29.99, rating: 4.4, reviewCount: 88, inStock: true, brand: 'DeskMate', category: 'Accessories', description: 'Adjustable, foldable, ergonomic aluminum design.', image: '📱' },
  { id: 'prod-9', name: 'Noise Cancelling Earbuds', price: 99.99, originalPrice: 139.99, rating: 4.5, reviewCount: 512, inStock: true, brand: 'AudioTech', category: 'Audio', description: 'Compact ear pieces with deep sound isolation.', image: '🎵' },
  { id: 'prod-10', name: 'LED Desk Lamp', price: 44.99, originalPrice: 59.99, rating: 4.7, reviewCount: 220, inStock: true, brand: 'Lumiere', category: 'Home', description: 'Adjustable brightness and color temperatures.', image: '💡' },
  { id: 'prod-11', name: 'Laptop Cooling Pad', price: 34.99, originalPrice: 45.99, rating: 4.1, reviewCount: 145, inStock: true, brand: 'ChillAir', category: 'Accessories', description: 'Silent triple fans to keep temperatures low.', image: '❄️' },
  { id: 'prod-12', name: 'Portable Power Bank', price: 29.99, originalPrice: 39.99, rating: 4.6, reviewCount: 375, inStock: true, brand: 'ChargeGo', category: 'Accessories', description: '10000mAh capacity for charging on the move.', image: '🔋' }
];

let currentUser = null;
let isLoggedIn = false;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  renderProducts();
  updateCartBadge();
  setupLogout();
  updateCompareTray();
});

// Sync tray on compare changes
window.addEventListener('compareListChanged', () => {
  updateCompareTray();
});

// Check if user is logged in
function checkAuthStatus() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  if (token && userStr) {
    try {
      currentUser = JSON.parse(userStr);
      isLoggedIn = true;
      document.getElementById('user-info').style.display = 'flex';
      document.getElementById('user-name').textContent = currentUser.name || 'User';
      document.getElementById('login-prompt').style.display = 'none';
    } catch (e) {
      console.error('Error parsing user data:', e);
      isLoggedIn = false;
      document.getElementById('login-prompt').style.display = 'block';
    }
  } else {
    isLoggedIn = false;
    document.getElementById('login-prompt').style.display = 'none';
    document.getElementById('user-info').style.display = 'none';
  }
}

// Render products
function renderProducts() {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';

  PRODUCTS.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
      <div class="product-image">${product.image}</div>
      <div class="product-info">
        <div class="product-title">${product.name}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="add-to-cart-btn" data-product-id="${product.id}">
          Add to Cart
        </button>
        <button class="compare-btn ${isInCompareList(product.id) ? 'active' : ''}" 
                data-product-id="${product.id}"
                onclick="handleToggleCompare('${product.id}', this)">
          ${isInCompareList(product.id) ? '✓ Comparing' : '⚖️ Compare'}
        </button>
      </div>
    `;

    // Add event listener to button
    const btn = card.querySelector('.add-to-cart-btn');
    btn.addEventListener('click', () => handleAddToCart(product));

    grid.appendChild(card);
  });
}

// Handle Compare Toggle
function handleToggleCompare(productId, btn) {
  if (isInCompareList(productId)) {
    removeFromCompare(productId);
    btn.classList.remove('active');
    btn.textContent = '⚖️ Compare';
    showMessage('Removed from compare');
  } else {
    const result = addToCompare(productId);
    if (result.success) {
      btn.classList.add('active');
      btn.textContent = '✓ Comparing';
      showMessage('Added to compare');
    } else {
      showMessage(result.message, true);
    }
  }
  updateCompareTray();
}

// Update compare tray UI
function updateCompareTray() {
  const count = getCompareCount();
  const tray = document.getElementById('compare-tray');
  const countEl = document.getElementById('compare-tray-count');
  
  if (count > 0) {
    tray.style.display = 'flex';
    countEl.textContent = count;
  } else {
    tray.style.display = 'none';
  }
}

// Handle add to cart
async function handleAddToCart(product) {
  if (!isLoggedIn) {
    // Guest user - use localStorage
    addToCartLocalStorage(product);
    updateCartBadge();
    showMessage('Added to cart (Guest Mode)');
    return;
  }

  // Logged in user - use backend API
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(`${API_BASE}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        productImage: product.image
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to add to cart');
    }

    updateCartBadge();
    showMessage('Added to cart successfully!');
  } catch (error) {
    console.error('Add to cart error:', error);
    showMessage(error.message || 'Failed to add to cart', true);
  }
}

// Add to cart using localStorage (for guests)
function addToCartLocalStorage(product) {
  let cart = JSON.parse(localStorage.getItem('guestCart') || '[]');
  
  // Check if product already exists
  const existingIndex = cart.findIndex(item => item.productId === product.id);
  
  if (existingIndex > -1) {
    // Increase quantity
    cart[existingIndex].quantity += 1;
  } else {
    // Add new item
    cart.push({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
      productImage: product.image
    });
  }
  
  localStorage.setItem('guestCart', JSON.stringify(cart));
}

// Update cart badge count
async function updateCartBadge() {
  let totalItems = 0;

  if (isLoggedIn) {
    // Get count from backend
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${API_BASE}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        totalItems = data.cart.totalItems || 0;
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  } else {
    // Get count from localStorage
    const cart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  const badge = document.getElementById('cart-badge');
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? 'flex' : 'none';
}

// Show message
function showMessage(text, isError = false) {
  const existingMsg = document.querySelector('.message');
  if (existingMsg) {
    existingMsg.remove();
  }

  const msg = document.createElement('div');
  msg.className = `message ${isError ? 'error' : ''}`;
  msg.textContent = text;
  document.body.appendChild(msg);

  setTimeout(() => {
    msg.remove();
  }, 3000);
}

// Setup logout
function setupLogout() {
  const logoutBtn = document.getElementById('logout-btn');
  
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('guestCart'); // Clear guest cart on logout
    window.location.href = './login.html';
  });
}

// --- Overlay Render Logic ---

function openCompareOverlay() {
  const overlay = document.getElementById('compare-modal-overlay');
  renderOverlayComparison();
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeCompareOverlay() {
  const overlay = document.getElementById('compare-modal-overlay');
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function renderOverlayComparison() {
  const container = document.getElementById('compare-modal-content');
  const compareIds = getCompareList();
  
  if (compareIds.length < 2) {
    container.innerHTML = `
      <div class="compare-empty">
        <div class="compare-empty-icon">⚖️</div>
        <h2>Nothing to Compare Yet</h2>
        <p>${compareIds.length === 0 ? 'Add at least 2 items to compare them side-by-side.' : 'Add one more item to start comparing.'}</p>
        <button onclick="closeCompareOverlay()" style="margin-top:20px; padding: 10px 20px; background:#667eea; border:none; cursor:pointer; color:white; border-radius:5px;">Continue Shopping</button>
      </div>`;
    return;
  }

  const productsToCompare = compareIds.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);
  const cols = productsToCompare.length;

  container.innerHTML = `
    <div class="compare-header">
      <h1>Compare Products (${cols})</h1>
      <button class="clear-all-btn" onclick="clearCompareList(); renderOverlayComparison(); window.dispatchEvent(new Event('compareListChanged'));">Clear All</button>
    </div>
    <div class="compare-grid" style="--compare-cols: ${cols};">
      ${renderOverlayRow('image', productsToCompare)}
      ${renderOverlayRow('price', productsToCompare)}
      ${renderOverlayRow('specs', productsToCompare)}
      ${renderOverlayRow('rating', productsToCompare)}
      ${renderOverlayRow('action', productsToCompare)}
    </div>
  `;
}

function renderOverlayRow(type, products) {
  return products.map(p => {
    switch(type) {
      case 'image':
        return `
          <div class="compare-cell">
            <button class="compare-remove-btn" onclick="removeFromCompare('${p.id}'); renderOverlayComparison(); window.dispatchEvent(new Event('compareListChanged'));" title="Remove">✕</button>
            <div class="compare-product-image">${p.image}</div>
            <div class="compare-product-name">${p.name}</div>
          </div>`;
      case 'price':
        const discountPct = Math.round((1 - p.price / p.originalPrice) * 100);
        return `
          <div class="compare-cell">
            <div class="compare-price">$${p.price.toFixed(2)}</div>
            <div class="compare-original-price">$${p.originalPrice.toFixed(2)}</div>
            <div class="compare-discount">-${discountPct}% OFF</div>
          </div>`;
      case 'specs':
        return `
          <div class="compare-cell" style="align-items:flex-start; text-align:left;">
            <div class="compare-cell-title">Specifications</div>
            <div class="compare-badge">${p.category}</div>
            <div class="compare-badge" style="background:rgba(233,69,96,0.2); color:#fb7185;">${p.brand}</div>
            <div class="compare-desc" style="margin-top:10px;">${p.description}</div>
          </div>`;
      case 'rating':
        return `
          <div class="compare-cell">
            <div class="compare-stars">${renderStars(p.rating)}</div>
            <div class="compare-review-count">${p.rating.toFixed(1)} (${p.reviewCount} reviews)</div>
          </div>`;
      case 'action':
        if (!p.inStock) {
          return `
            <div class="compare-cell">
              <button class="compare-cart-btn disabled" disabled>Out of Stock</button>
            </div>`;
        }
        return `
          <div class="compare-cell">
            <button class="compare-cart-btn" onclick="handleAddToCartFromCompare('${p.id}')">
              Add to Cart 🛒
            </button>
          </div>`;
      default:
        return '<div></div>';
    }
  }).join('');
}

function renderStars(rating) {
  if (typeof rating !== 'number') return '☆☆☆☆☆';
  const full = Math.floor(rating);
  const half = (rating % 1 >= 0.5 && full < 5) ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function handleAddToCartFromCompare(productId) {
  const p = PRODUCTS.find(prod => prod.id === productId);
  if (p) handleAddToCart(p);
}
