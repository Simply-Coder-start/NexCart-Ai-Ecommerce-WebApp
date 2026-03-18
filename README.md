<div align="center">
  <h1>🛍️ NexCart</h1>
  <p><strong>Next-Generation E-commerce with AI-Powered Virtual Try-On</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
    <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/badge/Artificial_Intelligence-FF6F00?style=for-the-badge&logo=ai&logoColor=white" alt="AI Virtual Try-On" />
  </p>
</div>

<br />

## 📖 Overview

**NexCart** is a modern, full-stack e-commerce web application designed to revolutionize the online shopping experience. Beyond standard features like secure authentication, dynamic cart management, and seamless order processing, NexCart integrates cutting-edge **Stable Diffusion / IDM-VTON** AI models. This allows users to actively upload their photos and preview exactly how garments fit them in real-time before making a purchase.

---

## ✨ Key Features

- 🔐 **Secure Authentication:** Robust user login and registration system utilizing **JWT (JSON Web Tokens)** and password hashing.
- 🛒 **Dynamic Cart System:** Fluid product browsing, cart updating, and seamless checkout flow.
- 👔 **AI Virtual Try-On:** The flagship feature. Users can upload a photo of themselves and a garment to generate an incredibly realistic "try-on" preview.
- 📦 **Order Management:** Comprehensive order tracking from placement to fulfillment.
- 📄 **Automated Invoicing:** System-generated PDF invoices downloadable immediately after a successful checkout.
- 👤 **Profile Dashboard:** A personalized space for users to view order history and manage account details.

---

## 🛠 Tech Stack

### Frontend
- **Languages:** HTML5, CSS3, Vanilla JavaScript
- **Design:** Fully responsive, modern UI/UX tailored for both desktop and mobile viewing.

### Backend
- **Core Server:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Primary Database:** [MongoDB](https://www.mongodb.com/) (using Mongoose for Object Data Modeling)
- **Secondary Database:** [SQLite](https://www.sqlite.org/) (for localized, lightning-fast AI job tracking)
- **File Handling:** [Multer](https://github.com/expressjs/multer) for secure image uploads

### AI & Machine Learning
- **Integrations:** `@gradio/client` and `@google/genai`
- **Models:** Built to support cutting-edge Image-to-Image models (e.g., IDM-VTON, Stable Diffusion).

---

## 🚀 Getting Started

Follow these steps to get a local copy of NexCart up and running on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or a MongoDB Atlas URI)
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/Simply-Coder-start/NexCart-Ai-Ecommerce-WebApp.git
cd NexCart-Ai-Ecommerce-WebApp
```

**2. Install all dependencies**
```bash
npm install
```

**3. Configure Environment Variables**
Create a `.env` file in the root directory. You can use `.env.example` as a template.
```env
# Server Configuration
PORT=5000
FRONTEND_PORT=3000

# Database
MONGODB_URI=mongodb+srv://<your_username>:<your_password>@cluster.mongodb.net/nexcart?retryWrites=true&w=majority

# Security
JWT_SECRET=your_super_secret_jwt_key

# AI Api Keys (Optional)
GEMINI_API_KEY=your_gemini_api_key_here
HF_TOKEN=your_huggingface_token_here
```

**4. Start the Application**

NexCart utilizes a dual-server architecture for routing management during development.

**Terminal 1: Start the primary E-commerce API (MongoDB/Auth)**
```bash
npm run auth:start
```

**Terminal 2: Start the secondary Frontend & AI Proxy Server**
```bash
npm start
```

**5. View in Browser**
Open your preferred web browser and navigate to:
```
http://localhost:3000
```

---

## 📡 API Reference

Below is a highlight of the primary RESTful endpoints.

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/register` | Register a new user account |
| `POST` | `/login` | Authenticate an existing user |

### Products & Cart (`/api/products` & `/api/cart`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/products` | Fetch all available products |
| `GET` | `/products/:id` | Get details of a specific product |
| `GET` | `/cart` | Retrieve the current user's cart |
| `POST` | `/cart/add` | Add an item to the cart |

### AI Try-On (`/api`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/upload-dress` | Upload garment reference image |
| `POST` | `/upload-user` | Upload human reference image |
| `POST` | `/generate` | Initialize the AI Try-on rendering job |
| `GET` | `/result/:job_id`| Poll for the completed AI-generated image |

---

## 📁 Project Structure

```text
NexCart/
├── frontend/             # Client-side HTML, CSS, JavaScript logic
├── backend/              # Primary Node/Express Server (Auth, Orders, Products, MongoDB)
│   ├── models/           # Mongoose Database Schemas
│   ├── routes/           # API Endpoints for e-commerce logic
│   └── middleware/       # JWT Authorization and protection logic
├── src/                  # Secondary Node Server (AI Logic, Frontend Serving, SQLite)
│   ├── routes/           # Routing for file uploads and Gradio Clients
│   └── services/         # Generation logic, status polling, and Invoicing
├── uploads/              # Temporary storage for User & Dress images
├── .env.example          # Template for required environment variables
├── package.json          # Dependencies and script definitions
└── README.md             # Project documentation
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! 
Feel free to check the [issues page](https://github.com/Simply-Coder-start/NexCart-Ai-Ecommerce-WebApp/issues) for any open tasks or bugs.

### Core Contributors
A special thanks to the following developers for bringing this project to life:
- [@Simply-Coder-start](https://github.com/Simply-Coder-start)
- [@Immortalcoder0](https://github.com/Immortalcoder0)
- [@rishavsingh181](https://github.com/rishavsingh181)

## 📜 License
This project is licensed under the [MIT License](LICENSE).
