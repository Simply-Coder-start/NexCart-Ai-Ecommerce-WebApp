---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: API Route Implementation & Frontend Parity

## Objective
Wire up all REST API endpoints inside Express to match the Python API contracts.

## Context
- `src/server.js`
- `src/routes/api.js` (To be created)
- Frontend endpoints fetched in `id.html`

## Tasks

<task type="auto">
  <name>Implement API Routes and Multer Config</name>
  <files>
    - src/routes/api.js
    - src/server.js
  </files>
  <action>
    - Create `src/routes/api.js` with `express.Router()`.
    - Configure `multer` to store files in the `uploads/` directory with unique names.
    - Implement `GET /products`, `GET /products/search`, `GET /products/:id` using `ProductService`.
    - Implement `POST /auth/register` and `POST /auth/login` returning dummy tokens or basic mocks for now since auth wasn't explicitly backed by DB in the Python version.
    - Implement `GET /tryon/config` returning `{ aiEnabled: true, providers: { "yisol/IDM-VTON": true } }`.
    - Implement `POST /upload-user` and `POST /upload-dress` endpoints using `multer` returning `user_image_id` and `dress_image_id` respectively (the filename).
    - Implement `POST /generate` reading `{ user_image_id, dress_image_id, view_mode, category }` and calling `AiService.createJob(userPath, dressUrl, category)`.
    - Implement `GET /result/:job_id` calling `AiService.getJobStatus()`.
    - Update `src/server.js` to mount these routes at `app.use('/api', require('./routes/api'));`.
  </action>
  <verify>node -c src/routes/api.js</verify>
  <done>src/routes/api.js exports a router handling all frontend required endpoints.</done>
</task>

## Success Criteria
- [ ] API routes map exactly to what the frontend fetches.
- [ ] Multer saves uploaded images seamlessly.
- [ ] `AiService` is hooked up to the generate endpoint.
