// cart.js - Cart page management

const API_BASE = 'http://localhost:5000/api';

let currentCart = { items: [], totalItems: 0, totalPrice: 0 };
let isLoggedIn = false;

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  loadCart();
});

// Check authentication status
function checkAuthStatus() {
  const token = localStorage.getItem('nexcart_token');
  isLoggedIn = !!token;
}

// Load cart data
async function loadCart() {
  try {
    if (isLoggedIn) {
      await loadCartFromBackend();
    } else {
      loadCartFromLocalStorage();
    }
    
    renderCart();
    updateCartBadge();
  } catch (error) {
    console.error('Error loading cart:', error);
    showMessage('Failed to load cart', true);
  }
}

// Load cart from backend (logged in users)
async function loadCartFromBackend() {
  const token = localStorage.getItem('nexcart_token');
  
  const response = await fetch(`${API_BASE}/cart`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }

  const data = await response.json();
  currentCart = data.cart;
}

// Load cart from localStorage (guest users)
function loadCartFromLocalStorage() {
  const items = JSON.parse(localStorage.getItem('guestCart') || '[]');
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  currentCart = { items, totalItems, totalPrice };
}

// Render cart
function renderCart() {
  const container = document.getElementById('cart-content');
  
  if (currentCart.items.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <a href="./shop.html">Continue Shopping</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="cart-layout">
      <!-- Cart Items -->
      <div class="cart-items">
        <h2>Cart Items (${currentCart.totalItems})</h2>
        <div id="items-list"></div>
      </div>

      <!-- Cart Summary -->
      <div class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span>Items:</span>
          <span>${currentCart.totalItems}</span>
        </div>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>$${currentCart.totalPrice.toFixed(2)}</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>$${currentCart.totalPrice.toFixed(2)}</span>
        </div>
        <button class="checkout-btn" onclick="handleCheckout()">
          Proceed to Checkout
        </button>
        <a href="./shop.html" class="continue-shopping">Continue Shopping</a>
      </div>
    </div>
  `;

  renderCartItems();
}

// Render cart items
function renderCartItems() {
  const itemsList = document.getElementById('items-list');
  
  itemsList.innerHTML = currentCart.items.map(item => `
    <div class="cart-item" data-product-id="${item.productId}">
      <div class="item-image">${item.productImage || '📦'}</div>
      <div class="item-details">
        <div class="item-name">${item.productName}</div>
        <div class="item-price">$${item.price.toFixed(2)}</div>
      </div>
      <div class="item-controls">
        <div class="quantity-controls">
          <button class="qty-btn" onclick="updateQuantity('${item.productId}', ${item.quantity - 1})" ${item.quantity <= 1 ? 'disabled' : ''}>
            −
          </button>
          <span class="quantity">${item.quantity}</span>
          <button class="qty-btn" onclick="updateQuantity('${item.productId}', ${item.quantity + 1})">
            +
          </button>
        </div>
        <div class="item-subtotal">
          Subtotal: $${(item.price * item.quantity).toFixed(2)}
        </div>
        <button class="remove-btn" onclick="removeItem('${item.productId}')">
          Remove
        </button>
      </div>
    </div>
  `).join('');
}

// Update quantity
async function updateQuantity(productId, newQuantity) {
  if (newQuantity < 1) return;

  try {
    if (isLoggedIn) {
      await updateQuantityBackend(productId, newQuantity);
    } else {
      updateQuantityLocalStorage(productId, newQuantity);
    }

    await loadCart();
    showMessage('Quantity updated');
  } catch (error) {
    console.error('Error updating quantity:', error);
    showMessage('Failed to update quantity', true);
  }
}

// Update quantity via backend
async function updateQuantityBackend(productId, quantity) {
  const token = localStorage.getItem('nexcart_token');
  
  const response = await fetch(`${API_BASE}/cart/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId, quantity })
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to update quantity');
  }
}

// Update quantity in localStorage
function updateQuantityLocalStorage(productId, quantity) {
  let cart = JSON.parse(localStorage.getItem('guestCart') || '[]');
  
  const itemIndex = cart.findIndex(item => item.productId === productId);
  
  if (itemIndex > -1) {
    cart[itemIndex].quantity = quantity;
    localStorage.setItem('guestCart', JSON.stringify(cart));
  }
}

// Remove item
async function removeItem(productId) {
  if (!confirm('Remove this item from cart?')) return;

  try {
    if (isLoggedIn) {
      await removeItemBackend(productId);
    } else {
      removeItemLocalStorage(productId);
    }

    await loadCart();
    showMessage('Item removed from cart');
  } catch (error) {
    console.error('Error removing item:', error);
    showMessage('Failed to remove item', true);
  }
}

// Remove item via backend
async function removeItemBackend(productId) {
  const token = localStorage.getItem('nexcart_token');
  
  const response = await fetch(`${API_BASE}/cart/remove`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId })
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to remove item');
  }
}

// Remove item from localStorage
function removeItemLocalStorage(productId) {
  let cart = JSON.parse(localStorage.getItem('guestCart') || '[]');
  cart = cart.filter(item => item.productId !== productId);
  localStorage.setItem('guestCart', JSON.stringify(cart));
}

// Update cart badge
function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  badge.textContent = currentCart.totalItems;
  badge.style.display = currentCart.totalItems > 0 ? 'flex' : 'none';
}

// Handle checkout
function handleCheckout() {
  if (currentCart.items.length === 0) {
    showMessage('Your cart is empty', true);
    return;
  }

  if (!isLoggedIn) {
    if (confirm('You need to log in to checkout. Go to login page?')) {
      window.location.href = './login.html';
    }
    return;
  }

  showMessage('Checkout feature coming soon!');
  // In real app, redirect to checkout page
  // window.location.href = './checkout.html';
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
