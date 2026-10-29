# Parts-page contextual illustrations

Generated for VenusDrive with the built-in OpenAI image-generation tool on 2026-10-29. These are representative educational illustrations; they do not establish vehicle-specific locations, assembly instructions or parts compatibility.

- `brake-pads-wheel-cutaway.webp`, 1536×1024: an exploded recognition view distinguishing blue brake pads from the neutral wheel/tire, brake disc and caliper. Exploded positioning is illustrative, not an assembly instruction. Source: `exec-8d02b425-12a0-42d0-a1c4-d6d62f9bfc60.png` in the original generated-images session directory.
- `electric-sedan-orientation.webp`, 1536×1024: a neutral representative EV cutaway showing the underfloor battery enclosure and rear drive unit. Source: `exec-b27edc08-3e96-4cf4-a6e1-01cb09c38394.png` in the same original generation directory.

The generation direction requested white studio backgrounds, realistic silver/black materials, clear component relationships, no brands or baked-in UI/text. Output images were visually reviewed and converted to WebP without semantic edits. The original PNG files remain in `/Users/aliashraf/.codex/generated_images/01a17ff3-144b-7e52-a737-6d7dd66d3986/`.

Other main visuals reuse the matching existing images in `../components/`, not unrelated photos. `parts-visual-data.js` maps focused masks to source-image coordinates for the belt/hose, timing belt, brake reservoir and cabin-filter views. The UI blue tint preserves mechanical texture and leaves white background and non-selected context unchanged. The neutral vehicle orientation image is separate and explicitly labeled. No asset for the required 27 component selections is missing; close-ups are used where an in-car view would hide the part.
