# ⚡ NexCart API Quick-Reference Guide (MERN)

![API Quick Start](file:///C:/Users/SOUMYADIP%20SINGHA/.gemini/antigravity/brain/4fa660e7-84fe-4d8f-b061-b581ff6b942f/api_quick_guide_infographic_1775498063546.png)

---

## 🛠️ 1. Centralized Axios Setup
**Path:** `src/api/api.js`
Creates a reusable instance with automatic JWT injection.

```javascript
import axios from 'axios';
const api = axios.create({ baseURL: 'YOUR_API_URL' });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default api;
```

## 📦 2. Service Layer (Cleanup)
**Path:** `src/services/CartService.js`
Decouples UI from API URLs.

```javascript
/* Service Example */
const CartService = {
  add: async (id) => (await api.post('/cart/add', { id })).data
};
```

## ⚛️ 3. Component Usage
**Path:** `Shop.jsx`
Use the service and handle UI states.

```javascript
try {
  setLoading(true);
  await CartService.add(product.id);
  toast.success('Sync Successful');
} catch (err) {
  setError(err.message);
} finally {
  setLoading(false);
}
```

## 🛡️ 4. Security Flow
1. **Frontend:** Inject JWT in Axios header.
2. **Backend:** Verify token in middleware.
3. **Controller:** Access User ID from `req.user`.

---
⚡ **Keep it Brief. Keep it Fast.** 🚀
