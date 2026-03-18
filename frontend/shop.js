// shop.js - Shop page logic with cart functionality

const API_BASE = 'http://localhost:5000/api';

// Mock products (in real app, fetch from backend)
const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Premium Wireless Headphones',
    price: 79.99,
    image: '🎧'
  },
  {
    id: 'prod-2',
    name: 'Smart Fitness Watch',
    price: 129.99,
    image: '⌚'
  },
  {
    id: 'prod-3',
    name: 'Portable Bluetooth Speaker',
    price: 49.99,
    image: '🔊'
  },
  {
    id: 'prod-4',
    name: 'HD Webcam Pro',
    price: 89.99,
    image: '📷'
  },
  {
    id: 'prod-5',
    name: 'Wireless Gaming Mouse',
    price: 59.99,
    image: '🖱️'
  },
  {
    id: 'prod-6',
    name: 'Mechanical Keyboard',
    price: 119.99,
    image: '⌨️'
  },
  {
    id: 'prod-7',
    name: 'USB-C Hub Adapter',
    price: 39.99,
    image: '🔌'
  },
  {
    id: 'prod-8',
    name: 'Smartphone Stand',
    price: 24.99,
    image: '📱'
  },
  {
    id: 'prod-9',
    name: 'Noise Cancelling Earbuds',
    price: 99.99,
    image: '🎵'
  },
  {
    id: 'prod-10',
    name: 'LED Desk Lamp',
    price: 44.99,
    image: '💡'
  },
  {
    id: 'prod-11',
    name: 'Laptop Cooling Pad',
    price: 34.99,
    image: '❄️'
  },
  {
    id: 'prod-12',
    name: 'Portable Power Bank',
    price: 29.99,
    image: '🔋'
  }
];

let currentUser = null;
let isLoggedIn = false;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  renderProducts();
  updateCartBadge();
  setupLogout();
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
      </div>
    `;

    // Add event listener to button
    const btn = card.querySelector('.add-to-cart-btn');
    btn.addEventListener('click', () => handleAddToCart(product));

    grid.appendChild(card);
  });
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
