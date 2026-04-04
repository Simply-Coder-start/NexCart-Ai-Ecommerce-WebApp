const API_BASE = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
  loadComparisonData();
});

async function loadComparisonData() {
  const container = document.getElementById('compare-container');
  const compareList = getCompareList();

  if (compareList.length < 2) {
    renderEmptyState(container, compareList.length);
    return;
  }

  container.innerHTML = '<div style="text-align:center;padding:100px;color:#888;">Loading comparison...</div>';

  try {
    const response = await fetch(`${API_BASE}/products/compare?ids=${compareList.join(',')}`);
    const result = await response.json();

    if (!result.success || !result.data || result.data.length < 2) {
      if (result.data) pruneStaleIds(result.data.map(p => p.id));
      renderEmptyState(container, result.data ? result.data.length : 0);
      return;
    }

    pruneStaleIds(result.data.map(p => p.id));
    renderComparison(container, result.data);
  } catch (error) {
    container.innerHTML = '<div style="text-align:center;padding:100px;color:#e94560;">Failed to load comparison data. Please try again.</div>';
    console.error('Compare fetch error:', error);
  }
}

function renderEmptyState(container, count) {
  container.innerHTML = `
    <div class="compare-empty">
      <div class="compare-empty-icon">⚖️</div>
      <h2>Nothing to Compare Yet</h2>
      <p>${count === 0 
        ? 'Add at least 2 items to compare them side-by-side.' 
        : 'Add one more item to start comparing.'}</p>
      <a href="./shop.html">Browse Products</a>
    </div>
  `;
}

function renderComparison(container, products) {
  const cols = products.length;
  
  container.innerHTML = `
    <div class="compare-header">
      <h1>Compare Products (${cols})</h1>
      <button id="clear-all-btn" class="clear-all-btn">Clear All</button>
    </div>
    <div class="compare-grid" style="--compare-cols: ${cols};">
      ${renderRow('image', products)}
      ${renderRow('price', products)}
      ${renderRow('rating', products)}
      ${renderRow('action', products)}
    </div>
  `;

  document.getElementById('clear-all-btn').addEventListener('click', () => {
    clearCompareList();
    loadComparisonData();
  });

  document.querySelectorAll('.compare-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromCompare(btn.dataset.productId);
      loadComparisonData();
    });
  });

  document.querySelectorAll('.compare-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      handleAddToCartFromCompare(btn.dataset.productId, btn.dataset.productName, parseFloat(btn.dataset.price), btn.dataset.image);
    });
  });
}

function renderRow(type, products) {
  return products.map(p => {
    switch(type) {
      case 'image':
        return `
          <div class="compare-cell compare-cell-image">
            <button class="compare-remove-btn" data-product-id="${p.id}" title="Remove">✕</button>
            <div class="compare-product-image">
              ${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy">` : '📦'}
            </div>
            <div class="compare-product-name">${p.name}</div>
          </div>`;
      case 'price':
        const hasDiscount = p.originalPrice && p.originalPrice > p.price;
        const discountPct = hasDiscount ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
        return `
          <div class="compare-cell compare-cell-price">
            <div class="compare-price">$${p.price.toFixed(2)}</div>
            ${hasDiscount ? `
              <div class="compare-original-price">$${p.originalPrice.toFixed(2)}</div>
              <div class="compare-discount">-${discountPct}% OFF</div>
            ` : ''}
          </div>`;
      case 'rating':
        return `
          <div class="compare-cell compare-cell-rating">
            <div class="compare-stars">${renderStars(p.rating)}</div>
            <div class="compare-review-count">${p.rating.toFixed(1)} (${p.reviewCount} reviews)</div>
          </div>`;
      case 'action':
        if (!p.inStock) {
          return `
            <div class="compare-cell compare-cell-action">
              <button class="compare-cart-btn disabled" disabled>Out of Stock</button>
            </div>`;
        }
        return `
          <div class="compare-cell compare-cell-action">
            <button class="compare-cart-btn" 
                    data-product-id="${p.id}" 
                    data-product-name="${p.name}" 
                    data-price="${p.price}"
                    data-image="${p.image || ''}">
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
  const full = Math.max(0, Math.min(5, Math.floor(rating)));
  const half = (rating % 1 >= 0.5 && full < 5) ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

function handleAddToCartFromCompare(productId, productName, price, image) {
  const token = localStorage.getItem('nexcart_token') || localStorage.getItem('token');
  
  if (!token) {
    let cart = JSON.parse(localStorage.getItem('guestCart') || '[]');
    const existing = cart.findIndex(item => item.productId === productId);
    if (existing > -1) {
      cart[existing].quantity += 1;
    } else {
      cart.push({ productId, productName, price, quantity: 1, productImage: image });
    }
    localStorage.setItem('guestCart', JSON.stringify(cart));
    showCompareMessage('Added to cart!');
    return;
  }

  fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ productId, productName, price, quantity: 1, productImage: image })
  })
  .then(r => r.json())
  .then(data => {
    showCompareMessage(data.message || 'Added to cart!');
  })
  .catch(() => {
    showCompareMessage('Failed to add to cart', true);
  });
}

function showCompareMessage(text, isError = false) {
  const existing = document.querySelector('.compare-message');
  if (existing) existing.remove();
  const msg = document.createElement('div');
  msg.className = `compare-message ${isError ? 'error' : ''}`;
  msg.textContent = text;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);
}
