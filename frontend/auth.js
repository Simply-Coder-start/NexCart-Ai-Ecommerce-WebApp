const API_BASE = 'http://localhost:5000/api/auth';

function showMessage(el, message, type = 'error') {
  if (!el) return;
  el.textContent = message;
  el.style.display = 'block';
  el.style.color = type === 'success' ? '#16a34a' : '#dc2626';
}

function clearMessage(el) {
  if (!el) return;
  el.textContent = '';
  el.style.display = 'none';
}

function setLoading(button, loadingText, isLoading) {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
  }
}

async function apiRequest(path, payload) {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await response.json();
  } catch (_err) {
    // non-json fallback
  }

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

function validatePhone(phone) {
  return /^\+?[1-9]\d{9,14}$/.test(phone);
}

function setupSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  const messageEl = document.getElementById('signup-message');
  const submitBtn = document.getElementById('signup-submit');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessage(messageEl);

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirm_password.value;

    if (!name || !email || !phone || !password || !confirmPassword) {
      return showMessage(messageEl, 'Please fill in all fields.');
    }

    if (password.length < 8) {
      return showMessage(messageEl, 'Password must be at least 8 characters.');
    }

    if (password !== confirmPassword) {
      return showMessage(messageEl, 'Confirm password does not match.');
    }

    if (!validatePhone(phone)) {
      return showMessage(messageEl, 'Please enter a valid phone number.');
    }

    try {
      setLoading(submitBtn, 'Creating account...', true);
      const data = await apiRequest('/register', {
        name,
        email,
        phone,
        password,
        confirm_password: confirmPassword,
      });

      showMessage(messageEl, data.message || 'Registration successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = './login.html';
      }, 900);
    } catch (error) {
      showMessage(messageEl, error.message);
    } finally {
      setLoading(submitBtn, 'Creating account...', false);
    }
  });
}

function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  const messageEl = document.getElementById('login-message');
  const submitBtn = document.getElementById('login-submit');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    clearMessage(messageEl);

    const identifier = form.identifier.value.trim();
    const password = form.password.value;

    if (!identifier || !password) {
      return showMessage(messageEl, 'Please enter email/phone and password.');
    }

    try {
      setLoading(submitBtn, 'Signing in...', true);
      const data = await apiRequest('/login', { identifier, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      window.location.href = './id.html';
    } catch (error) {
      showMessage(messageEl, error.message);
    } finally {
      setLoading(submitBtn, 'Signing in...', false);
    }
  });
}

function setupLogoutButton() {
  const btn = document.getElementById('logout-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = './login.html';
  });
}

async function hydrateSession() {
  const token = localStorage.getItem('token');
  const userEl = document.getElementById('session-user');
  if (!token || !userEl) return;

  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Session invalid');
    const data = await res.json();
    userEl.textContent = `${data.user.name} (${data.user.email})`;
  } catch (_err) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('signup.html')) return;
    window.location.href = './login.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupSignupForm();
  setupLoginForm();
  setupLogoutButton();
  hydrateSession();
});
