---
phase: 6
plan: 1
wave: 1
---

# Plan 6.1: Advanced Try-On Prompt Formatting

## Objective
Update the `AiService.js` IDM-VTON prompt format to strictly adhere to the user's detailed structured list of constraints, ensuring maximum realism, texture preservation, and accurate body scaling.

## Context
- `src/services/AiService.js`
- Hugging Face IDM-VTON Predict parameters

## Tasks

<task type="auto">
  <name>Refine IDM-VTON Prompt to Structured Format</name>
  <files>
    - src/services/AiService.js
  </files>
  <action>
    - Open `src/services/AiService.js` and locate the `_tryIDMVTON` method.
    - Replace the existing `prompt` string with the exact structured text requested by the user:
      `"Task: Virtual clothing try-on. Use the uploaded base photo as the main person. Replace the current clothing with the selected dress image. Instructions: Keep the face, hair, and body shape of the base person unchanged. Remove the original clothing from the base photo. Extract only the dress from the selected dress image. Fit the dress naturally on the body with correct proportions. Match lighting, shadows, and perspective. Do not create a second person. Do not overlay the dress image as a separate photo. Output a single realistic image of the person wearing the selected dress. Style: realistic fashion photography, high quality, detailed fabric, natural pose. Task: virtual try-on. Preserve Face: true. Remove Old Clothing: true. Output: single realistic person wearing the selected dress."`
    - Retain `is_checked_crop: false` and `denoise_steps: 40`.
  </action>
  <verify>node -c src/services/AiService.js</verify>
  <done>Structured prompt string is updated in `AiService.js`.</done>
</task>

## Success Criteria
- [ ] `AiService.js` passes the detailed structured prompt to Hugging Face.
