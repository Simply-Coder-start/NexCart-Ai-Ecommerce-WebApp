---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Node.js Foundation & Express Server

## Objective
Set up the Node.js project, install essential dependencies, and create the foundational Express server to serve the frontend and handle basic requests.

## Context
- .gsd/SPEC.md
- id.html (Frontend)

## Tasks

<task type="auto">
  <name>Initialize Node Project</name>
  <files>package.json</files>
  <action>
    - Run `npm init -y` in the root backend directory (or root project directory, since front/back are combined here). Wait, the project root `c:\Users\prita\OneDrive\Documents\code\making 3com\making 3com` contains `id.html` and a `backend/` folder. We will initialize Node in the root directory.
    - Run `npm install express cors dotenv multer mongoose` (Mongoose is for Phase 2, but good to add now).
    - Run `npm install --save-dev nodemon`.
    - Update `package.json` to include `"start": "node src/server.js"` and `"dev": "nodemon src/server.js"`.
  </action>
  <verify>Get-Content package.json | Select-String "express"</verify>
  <done>package.json exists with express, cors, dotenv, and multer dependencies listed.</done>
</task>

<task type="auto">
  <name>Create Express Server Foundation</name>
  <files>
    - src/server.js
    - .env
  </files>
  <action>
    - Ensure `.env` exists with `PORT=5000`.
    - Create `src/server.js` matching the FastAPI configuration.
    - Setup `express()`, `cors()`, `express.json()`, and `express.static()`.
    - Serve `id.html` on the root route `/` so the frontend is accessible.
    - Mount the `/uploads` folder as a static directory.
    - Add a basic health check endpoint at `[GET] /health`.
    - Listen on `process.env.PORT`.
  </action>
  <verify>node -e "require('express')"</verify>
  <done>src/server.js exists and is configured to serve the frontend and static uploads.</done>
</task>

## Success Criteria
- [ ] Node dependencies installed successfully.
- [ ] `src/server.js` can be started without errors.
- [ ] Server responds to `/health` with 200 OK.
