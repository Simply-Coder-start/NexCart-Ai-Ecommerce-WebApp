---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: AI Service Integration (IDM-VTON & Gemini)

## Objective
Port the `ai_service.py` logic to a Node.js `AiService.js`, integrating the Hugging Face Gradio client for IDM-VTON and setting up Gemini fallbacks. Also implement the in-memory job store.

## Context
- `backend/services/ai_service.py` (Old Python logic)
- `@gradio/client` (Node.js SDK)

## Tasks

<task type="auto">
  <name>Install Gradio Client and Google Gen AI</name>
  <files>package.json</files>
  <action>
    - Run `npm install @gradio/client @google/genai node-fetch` in the project root to support the AI SDKs and fetching images.
  </action>
  <verify>Get-Content package.json | Select-String "@gradio/client"</verify>
  <done>NPM packages are installed.</done>
</task>

<task type="auto">
  <name>Create AI Service Logic</name>
  <files>
    - src/services/AiService.js
  </files>
  <action>
    - Create `src/services/AiService.js` to manage try-on jobs (using an in-memory dictionary `jobs = {}`).
    - Expose `createJob(humanImage, garmentImage, category)` and `getJobStatus(jobId)`.
    - Implement a background worker `_processJob(jobId, hImage, gImage, cat)` that attempts IDM-VTON.
    - IDM-VTON: use `@gradio/client` connecting to `"yisol/IDM-VTON"`. Pass the required parameters (crop, category, etc.). Handle the blob/URL logic, downloading the result to the `/uploads` directory.
    - Setup Gemini Fallback using `@google/genai` if Hugging Face fails.
    - Fallback: Simple image composition logic using sharp/canvas or simply return original human image (since Gemini can't compose locally, we will mimic the Python server's simple compositing or just fake it for fallback as Python did).
  </action>
  <verify>node -c src/services/AiService.js</verify>
  <done>AiService handles job polling and communicates with Hugging Face Space for IDM-VTON.</done>
</task>

## Success Criteria
- [ ] `AiService` manages asynchronous jobs and allows polling via Job ID.
- [ ] Connects successfully to Hugging Face IDM-VTON using the JS SDK.
- [ ] Saves output files correctly to `/uploads`.
