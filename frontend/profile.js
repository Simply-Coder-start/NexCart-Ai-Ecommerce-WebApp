const API = 'http://localhost:5000/api';
let currentUser = null;
const token = localStorage.getItem('nexcart_token');

// ─── INITIALIZATION ───
document.addEventListener('DOMContentLoaded', () => {
    if (!token) {
        window.location.href = 'id.html#login';
        return;
    }
    loadUserProfile();
    loadUserOrders();
    updateCartCount();
});

// ─── UTILS ───
function handleAuthError() {
    localStorage.removeItem('nexcart_token');
    localStorage.removeItem('nexcart_user');
    window.location.href = 'id.html#login';
}

function showToast(message, color = '#10b981') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="ph-fill ph-info" style="color:${color};"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showPanel(panelId, element) {
    document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
    document.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));

    element.classList.add('active');
    document.getElementById('panel-' + panelId).classList.add('active');
}

async function updateCartCount() {
    const badge = document.getElementById('cart-count');
    try {
        const res = await fetch(`${API}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        const count = data.cart.totalItems || 0;
        badge.textContent = count;
    } catch (e) {
        const guestItems = JSON.parse(localStorage.getItem('guestCart') || '[]');
        badge.textContent = guestItems.length;
    }
}

// ─── PROFILE LOGIC ───
async function loadUserProfile() {
    try {
        const res = await fetch(`${API}/user/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401) return handleAuthError();
        if (!res.ok) throw new Error();
        const data = await res.json();
        currentUser = data.user;

        renderProfile(currentUser);
        renderAddresses(currentUser.addresses);
    } catch (e) {
        showToast('Failed to load profile', '#ef4444');
    }
}

function renderProfile(user) {
    document.getElementById('display-name').textContent = user.name;
    document.getElementById('display-email').textContent = user.email;
    document.getElementById('input-name').value = user.name;
    document.getElementById('input-phone').value = user.phone || '';

    const initial = user.name[0].toUpperCase();
    document.getElementById('profile-initials').textContent = initial;
}

document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('input-name').value;
    const phone = document.getElementById('input-phone').value;

    try {
        const res = await fetch(`${API}/user/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, phone })
        });
        if (res.ok) {
            showToast('Profile updated successfully!');
            loadUserProfile();
        }
    } catch (e) {
        showToast('Check your connection', '#ef4444');
    }
});

// ─── ORDERS LOGIC ───
async function loadUserOrders() {
    try {
        const res = await fetch(`${API}/orders/my-orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401) return handleAuthError();
        const data = await res.json();
        renderOrders(data.orders);
    } catch (e) {
        console.error('Orders load error', e);
    }
}

function renderOrders(orders) {
    const container = document.getElementById('orders-container');
    if (!orders || orders.length === 0) {
        container.innerHTML = '<p style="padding:40px; text-align:center; color:var(--text-muted);">No orders yet.</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-item" onclick="showOrderDetails('${order.orderId}')" style="cursor:pointer; transition:0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='none'">
            <div style="flex:1;">
                <p style="font-size:0.8rem; color:var(--text-muted);">ID: ${order.orderId}</p>
                <p style="font-weight:600;">${order.items.length} Items</p>
                <p style="font-size:0.85rem; color:var(--text-muted);">${new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <div style="text-align:right;">
                <p style="font-weight:700; font-size:1.1rem; color:var(--primary);">₹${order.totalPrice.toFixed(2)}</p>
                <span class="status-badge status-${order.status}">${order.status}</span>
            </div>
        </div>
    `).join('');
}

async function showOrderDetails(orderId) {
    showPanel('order-details', document.querySelector('[onclick*="orders"]'));
    const container = document.getElementById('detail-content');
    container.innerHTML = '<p style="padding:20px; text-align:center;">Loading details...</p>';

    try {
        const res = await fetch(`${API}/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401) return handleAuthError();
        const { order } = await res.json();

        const itemsHTML = order.items.map(item => `
            <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--border-glass);">
                <div style="display:flex; gap:15px; align-items:center;">
                    <img src="${item.productImage}" style="width:50px; height:60px; object-fit:cover; border-radius:6px; background:#27272a;">
                    <div>
                        <p style="font-weight:600; font-size:0.95rem;">${item.productName}</p>
                        <p style="font-size:0.85rem; color:var(--text-muted);">Qty: ${item.quantity}</p>
                    </div>
                </div>
                <p style="font-weight:600;">₹${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        `).join('');

        container.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:30px; border-bottom:1px solid var(--border-glass); padding-bottom:20px;">
                <div>
                    <h2 style="font-family:var(--font-display); font-size:1.5rem; margin-bottom:5px;">Order #${order.orderId}</h2>
                    <p style="color:var(--text-muted); font-size:0.9rem;">Placed on ${new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <button class="btn-primary" onclick="downloadInvoice('${order.orderId}')">
                    <i class="ph ph-file-pdf"></i> Download Invoice
                </button>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; margin-bottom:30px;">
                <div>
                    <h4 style="margin-bottom:12px; color:var(--text-muted); text-transform:uppercase; font-size:0.75rem; letter-spacing:1px;">Shipping Details</h4>
                    <p style="font-weight:600; font-size:1rem;">${order.shippingAddress.street}</p>
                    <p style="color:var(--text-muted); font-size:0.9rem;">${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}</p>
                    <div style="margin-top:15px; background:rgba(16, 185, 129, 0.05); padding:10px; border-radius:8px; border:1px solid rgba(16, 185, 129, 0.2);">
                         <p style="color:#10b981; font-size:0.85rem; font-weight:600;"><i class="ph-fill ph-truck"></i> Expected by: ${new Date(order.expectedDeliveryDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div>
                    <h4 style="margin-bottom:12px; color:var(--text-muted); text-transform:uppercase; font-size:0.75rem; letter-spacing:1px;">Price Summary</h4>
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="color:var(--text-muted);">Subtotal</span>
                        <span>₹${order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="color:var(--text-muted);">Shipping</span>
                        <span style="color:#10b981;">FREE</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; margin-top:10px; padding-top:10px; border-top:1px solid var(--border-glass); font-weight:700; font-size:1.2rem;">
                        <span>Total Paid</span>
                        <span style="color:var(--primary);">₹${order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <h4 style="margin-bottom:15px; color:var(--text-muted); text-transform:uppercase; font-size:0.75rem; letter-spacing:1px;">Order Items</h4>
            <div style="background:rgba(255,255,255,0.02); border-radius:12px; padding:0 20px;">
                ${itemsHTML}
            </div>
        `;

    } catch (e) {
        container.innerHTML = `<p style="padding:20px; color:var(--error);">Failed to load order details: ${e.message}</p>`;
    }
}

async function downloadInvoice(orderId) {
    try {
        const res = await fetch(`${API}/orders/invoice/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401) return handleAuthError();
        if (!res.ok) throw new Error('Could not generate PDF');

        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Invoice_${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        showToast('Invoice downloaded successfully!');
    } catch (e) {
        showToast('Download failed: ' + e.message, '#ef4444');
    }
}

// ─── ADDRESS LOGIC ───
function renderAddresses(addresses) {
    const list = document.getElementById('address-list');
    if (!addresses || addresses.length === 0) {
        list.innerHTML = '<p style="color:var(--text-muted);">No addresses saved.</p>';
        return;
    }

    list.innerHTML = addresses.map(addr => `
        <div class="address-item">
            <div class="address-actions">
                <button onclick="editAddress('${addr.id}')" style="background:none; border:none; color:var(--text-muted); cursor:pointer;"><i class="ph ph-pencil"></i></button>
                <button onclick="deleteAddress('${addr.id}')" style="background:none; border:none; color:var(--error); cursor:pointer;"><i class="ph ph-trash"></i></button>
            </div>
            <p style="font-weight:600;">${addr.street} ${addr.isDefault ? '<span style="color:var(--success); font-size:0.75rem;">(Default)</span>' : ''}</p>
            <p style="color:var(--text-muted); font-size:0.9rem;">${addr.city}, ${addr.state} - ${addr.zipCode}</p>
        </div>
    `).join('');
}

function showAddressForm() {
    document.getElementById('address-list').style.display = 'none';
    document.getElementById('address-form-wrap').style.display = 'block';
    document.getElementById('address-form').reset();
    document.getElementById('addr-id').value = '';
    document.getElementById('addr-form-title').textContent = 'Add New Address';
}

function hideAddressForm() {
    document.getElementById('address-list').style.display = 'block';
    document.getElementById('address-form-wrap').style.display = 'none';
}

async function editAddress(id) {
    const addr = currentUser.addresses.find(a => a.id === id);
    if (!addr) return;

    showAddressForm();
    document.getElementById('addr-form-title').textContent = 'Edit Address';
    document.getElementById('addr-id').value = addr.id;
    document.getElementById('addr-street').value = addr.street;
    document.getElementById('addr-city').value = addr.city;
    document.getElementById('addr-state').value = addr.state;
    document.getElementById('addr-zip').value = addr.zipCode;
    document.getElementById('addr-default').checked = addr.isDefault;
}

document.getElementById('address-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('addr-id').value;
    const body = {
        street: document.getElementById('addr-street').value,
        city: document.getElementById('addr-city').value,
        state: document.getElementById('addr-state').value,
        zipCode: document.getElementById('addr-zip').value,
        isDefault: document.getElementById('addr-default').checked
    };

    const method = id ? 'PUT' : 'POST';
    if (id) body.id = id;

    try {
        const res = await fetch(`${API}/user/address`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });
        if (res.ok) {
            showToast(id ? 'Address updated!' : 'Address added!');
            hideAddressForm();
            loadUserProfile();
        }
    } catch (e) {
        showToast('Error saving address', '#ef4444');
    }
});

async function deleteAddress(id) {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
        const res = await fetch(`${API}/user/address`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id })
        });
        if (res.ok) {
            showToast('Address deleted');
            loadUserProfile();
        }
    } catch (e) {
        showToast('Error deleting address', '#ef4444');
    }
}

// ─── SETTINGS LOGIC ───
document.getElementById('password-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('current-pass').value;
    const newPassword = document.getElementById('new-pass').value;

    if (newPassword.length < 8) {
        showToast('New password too short', '#ef4444');
        return;
    }

    try {
        const res = await fetch(`${API}/user/change-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        if (res.ok) {
            showToast('Password updated!');
            e.target.reset();
        } else {
            const data = await res.json();
            showToast(data.message || 'Error updating password', '#ef4444');
        }
    } catch (e) {
        showToast('Error updating password', '#ef4444');
    }
});

// ─── LOGOUT ───
function logoutUser() {
    localStorage.removeItem('nexcart_token');
    localStorage.removeItem('nexcart_user');
    window.location.href = 'id.html';
}
