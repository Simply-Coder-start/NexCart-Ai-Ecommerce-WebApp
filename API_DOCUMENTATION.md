# 🚀 NexCart API Quick-Ref (v1.0)

**Base URL:** `/api` | **Header:** `Authorization: Bearer <token>`

---

### 🔑 1. Authentication (Public)
| Route | Method | Body |
| :--- | :--- | :--- |
| `/auth/register` | `POST` | `name, email, password` |
| `/auth/login` | `POST` | `email, password` |

### 📦 2. Products (Public)
| Route | Method | Description |
| :--- | :--- | :--- |
| `/products` | `GET` | Get all products |
| `/products/:id` | `GET` | Get single product |

### 🛒 3. Cart (Protected)
| Route | Method | Body |
| :--- | :--- | :--- |
| `/cart` | `GET` | Get user cart |
| `/cart/add` | `POST` | `productId, quantity, color` |

### 📜 4. Orders (Protected)
| Route | Method | Body |
| :--- | :--- | :--- |
| `/orders/myorders` | `GET` | Get order history |
| `/orders` | `POST` | `shippingAddress, paymentMethod` |

---
*⚡ Brief & High Intensity API Docs.*
