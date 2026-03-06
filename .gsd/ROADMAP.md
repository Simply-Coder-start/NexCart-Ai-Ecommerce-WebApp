# ROADMAP.md

> **Current Phase**: Not started
> **Milestone**: v1.0

## Must-Haves (from SPEC)
- [ ] Node.js/Express server foundation.
- [ ] MongoDB integration with in-memory fallback.
- [ ] IDM-VTON and Gemini AI Services integration.
- [ ] Matching API contracts with the FastAPI backend.

## Phases

### Phase 1: Foundation & Setup
**Status**: ✅ Complete
**Objective**: Setup Node.js project, Express server, routing structure, and static file serving for the frontend.

### Phase 2: Data Layer (MongoDB & Fallbacks)
**Status**: ✅ Complete
**Objective**: Implement product and cart stores using MongoDB with an in-memory fallback mechanism.

### Phase 3: AI Services & Integration
**Status**: ✅ Complete
**Objective**: Port the `ai_service.py` logic to Node.js, integrating Hugging Face and Gemini models.

### Phase 4: Route Implementation & Parity
**Status**: ✅ Complete
**Objective**: Implement REST API endpoints (`/api/products`, `/api/tryon/config`, `/api/generate`, `/api/result/*`) referencing Express route handlers.

### Phase 5: High-Quality Try-On Generation
**Status**: ✅ Complete
**Objective**: Refine IDM-VTON prompts and parameters to enforce ultra-realistic 4K constraints and precise model preservation.

### Phase 6: Advanced Try-On Prompt Formatting
**Status**: ✅ Complete
**Objective**: Implement structured, highly specific prompt engineering for the IDM-VTON model to ensure maximum adherence to physical constraints and rendering quality.
