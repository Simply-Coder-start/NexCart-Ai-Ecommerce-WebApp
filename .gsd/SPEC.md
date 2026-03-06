# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
Migrate the existing Python/FastAPI virtual try-on backend to a scalable Node.js and Express application, establishing a robust foundation with MongoDB for job persistence while maintaining the current frontend integration.

## Goals
1. Re-implement all existing FastAPI endpoints (`/api/try-on`, `/api/try-on/{job_id}`, `/api/products`) in Node.js/Express.
2. Integrate MongoDB for persisting try-on jobs and product catalog data.
3. Implement an in-memory fallback for job and product storage to ensure the system works if MongoDB is unavailable.
4. Integrate Hugging Face IDM-VTON API for core AI try-on logic, including Gemini fallbacks.
5. Ensure 100% compatibility with the existing vanilla HTML/JS frontend.

## Non-Goals (Out of Scope)
- Redesigning the frontend UI or migrating the frontend to React/Vite (this is a backend-only migration).
- Adding new user-facing features not present in the current system.

## Users
- End-users exploring the virtual try-on frontend.
- Future developers maintaining the Node.js backend.

## Constraints
- Must match existing API contracts exactly so the frontend continues to function without changes.
- Must gracefully handle missing MongoDB connections (fallback to in-memory).
- Must handle `multipart/form-data` for image uploads.

## Success Criteria
- [ ] Node.js server starts and successfully serves the `id.html` frontend.
- [ ] Product list loads correctly from the new `[GET] /api/products` Express endpoint.
- [ ] Users can submit a virtual try-on job and poll for results until completion.
- [ ] System handles AI API timeouts or failures gracefully.
