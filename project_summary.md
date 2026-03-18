# Project Summary: making-3com

This document provides a comprehensive overview of the `making-3com` project structure, technologies, and key files based on the repository contents. 

## Overview
The project is a web application with strong e-commerce and AI-powered Virtual Try-On (VTON) functionality. It features two distinct backend implementations (likely one for standard e-commerce features via MongoDB, and another for AI image processing via SQLite/Gradio/Gemini) and a vanilla JavaScript frontend.

Furthermore, the project strictly adheres to the "Get Shit Done" (GSD) AI-assistant methodology, utilizing `.gsd/` directories and explicit workflow rules (`PROJECT_RULES.md`, `GSD-STYLE.md`) to guide development.

## Technology Stack
- **Dependencies (package.json):**
  - **Core Backend:** Node.js, Express, `cors`, `dotenv`, `helmet`.
  - **Databases:** 
    - MongoDB (`mongoose`, `express-mongo-sanitize`)
    - SQLite (`sqlite`, `sqlite3`)
  - **AI & Integrations:** `@google/genai`, `@gradio/client`, `node-fetch`, `multer` (for image uploads).
  - **Authentication:** `jsonwebtoken`, `bcryptjs`.
  - **Other Utils:** `pdfkit`.
- **Frontend:** Vanilla HTML, CSS, JavaScript.

## Project Structure & Key Files

### 1. Dual Backend Setup

#### A. The E-commerce Backend (`/backend`)
Handles standard e-commerce operations like users, products, carts, and orders. Uses **MongoDB** for storage.
- **Entry Point:** [`backend/server.js`](backend/server.js) — Connects to MongoDB, sets up `express` server on port 5000, and mounts API routes.
- **Models (`backend/models/`):** 
  - `Product.js`, `User.js`, `Cart.js`, `Order.js`
- **Routes (`backend/routes/`):** 
  - `auth.js`, `userRoutes.js`, `productRoutes.js`, `cartRoutes.js`, `orderRoutes.js`
- **Other:** `backend/middleware/authMiddleware.js`, `backend/seedProducts.js`.

#### B. The AI VTON Backend (`/src`)
Handles the Virtual Try-On capabilities, utilizing Gradio clients (IDM-VTON) and Gemini fallbacks. Uses **SQLite** for any local relational tracking.
- **Entry Point:** [`src/server.js`](src/server.js) — Serves the frontend from the root `/`, mounts the `/api` for uploads/generation, and starts the server on port 3000.
- **Database Loader:** [`src/db.js`](src/db.js) — Connects to the local `database.sqlite` file.
- **Routes:** [`src/routes/api.js`](src/routes/api.js) — Contains unified mock auth endpoints, product endpoints, and importantly, the **AI Try-on endpoints** (`/upload-dress`, `/upload-user`, `/generate`, `/result/:job_id`).
- **Services:** `src/services/ProductService.js`, `src/services/AiService.js`, and `src/services/invoiceGenerator.js`.

### 2. Frontend (`/frontend`)
The frontend primarily exists as vanilla web pages served statically or dynamically via the Node servers.
- **Key Interface:** [`frontend/id.html`](frontend/id.html) — A large (200KB+) HTML file serving as the primary interface, likely specifically housing the AI Try-on interactive UI. It is directly served by `src/server.js`.
- **Pages & Logic:** 
  - `shop.html` & `shop.js`
  - `cart.html` & `cart.js`
  - `login.html`, `signup.html`
- **Root Level:** `profile.html`, `profile.js`, `app1.jsx`.

### 3. Workflow & AI Agent Directives
The project employs a structured framework for code generation and maintenance, leveraging LLMs via strict guidelines.
- **Rules File:** [`PROJECT_RULES.md`](PROJECT_RULES.md) — The canonical "Single Source of Truth" defining a `SPEC -> PLAN -> EXECUTE -> VERIFY -> COMMIT` lifecycle. It mandates search-first disciplines for file reading, wave-execution, and explicit evidence logging.
- **Style File:** [`GSD-STYLE.md`](GSD-STYLE.md) — Defines coding patterns, stylistic conventions, and architectural preferences.
- **Workflows:** Stored in `.agent/workflows/` (with slash commands like `/plan`, `/execute`).
- **Agent State:** `.gsd/` directory tracks current specifications, planning roadmap (`ROADMAP.md`), and state (`STATE.md`).

### 4. Other Significant Files
- [`package.json`](package.json) / [`package-lock.json`](package-lock.json): Project manifest outlining scripts like `start` (running `node src/server.js`) and `auth:start` (running `node backend/server.js`).
- `.env`: Environment variables (holds `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, etc.).
- `/uploads`: Directory to hold user/dress images uploaded via `multer` for AI processing.
