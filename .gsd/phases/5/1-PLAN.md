---
phase: 5
plan: 1
wave: 1
---

# Plan 5.1: High-Quality Try-On Generation (Prompt Engineering)

## Objective
Refine the `AiService.js` integration with IDM-VTON to fulfill strict user requirements for model preservation, ultra-realistic 4K quality, professional lighting, and texture preservation.

## Context
- `src/services/AiService.js`
- Hugging Face IDM-VTON Predict parameters

## Tasks

<task type="auto">
  <name>Enhance IDM-VTON Inference Prompts</name>
  <files>
    - src/services/AiService.js
  </files>
  <action>
    - Modify the `_tryIDMVTON` method.
    - Currently, the garment description is an empty string `""`.
    - Inject the following prompt structure into the `garment description` parameter to guide the diffusion model:
      `"ultra realistic, 4k resolution, professional fashion photography lighting, sharp details, natural shadows, neutral studio background. Maintain original body proportions, exact facial features, natural skin tone, and confident expression. Perfect garment fitting, preserve fabric texture, color, and design patterns."`
    - Ensure `is_checked_crop` is explicitly set to `true` (already is) or `false` based on best practices for IDM-VTON preserving body proportions. Best practice is `false` to avoid extreme cropping which can warp proportions if we want to maintain the original uploaded frame exactly.
    - Set the `seed` dynamically or keep it fixed, but increase `denoise_steps` from `30` to `40` for higher quality refinement if supported (usually IDM-VTON supports up to 50).
  </action>
  <verify>node -c src/services/AiService.js</verify>
  <done>Prompt string and inference parameters are updated in `AiService.js`.</done>
</task>

## Success Criteria
- [ ] `AiService.js` passes the detailed prompt to Hugging Face.
- [ ] Denoise steps increased for higher photo-realism.
