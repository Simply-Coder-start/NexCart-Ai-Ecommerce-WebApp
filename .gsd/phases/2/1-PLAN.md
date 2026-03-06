---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: Data Layer (MongoDB & Fallback)

## Objective
Implement product storage logic that uses MongoDB if available, but gracefully falls back to an in-memory database mirroring the Python logic to ensure zero disruption.

## Context
- `backend/services/product_store.py` (Old Python logic)
- `src/server.js`

## Tasks

<task type="auto">
  <name>Create MongoDB Config and Mongoose Models</name>
  <files>
    - src/db.js
    - src/models/Product.js
  </files>
  <action>
    - Create `src/db.js` with a `connectDB` function that attempts to connect to `process.env.MONGODB_URI`.
    - If `MONGODB_URI` isn't set or connection fails, log a warning and set a global flag `global.useInMemory = true`.
    - Create a Mongoose schema in `src/models/Product.js` matching the Python product schema:`id` (String), `name` (String), `price` (Number), `category` (String), `image_url` (String).
  </action>
  <verify>node -e "require('./src/db.js')"</verify>
  <done>Mongoose config and Product model exist.</done>
</task>

<task type="auto">
  <name>Port Product Store Logic (Node.js)</name>
  <files>
    - src/services/ProductService.js
    - backend/services/product_store.py
  </files>
  <action>
    - Analyze the `backend/services/product_store.py`. Port the `get_all_products`, `get_products_by_category`, and `get_product_by_id` methods to JavaScript.
    - Implement a `ProductService` class.
    - If `global.useInMemory` is true, return data from an array that matches the seeded data logic from the Python file (including the `_unsplash_url` helper for generating dummy images). 
    - Include at least a subset of the ~350 default products exactly as formatted in the Python file for the in-memory fallback.
  </action>
  <verify>node -c src/services/ProductService.js</verify>
  <done>ProductService exposes fetch methods and has an in-memory fallback mimicking the original FastAPI logic.</done>
</task>

## Success Criteria
- [ ] Database connection script handles failures gracefully (fallback enabled).
- [ ] Product models are ready for MongoDB if the URI is provided via env vars.
- [ ] `ProductService` works completely autonomously without MongoDB.
