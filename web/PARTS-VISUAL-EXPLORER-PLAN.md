# Parts visual explorer implementation

Use the existing `#parts` card library for the combined visual and cards experience. Point the landing learning CTA there while preserving all `#explorer` and component-detail routes. These are the recommended defaults discussed during the grillme review; no additional product decision is required for implementation.

- Retain all 27 stable component IDs, original descriptions, 17 system filters and alias search.
- Add a reusable visual/selector controller above the card grid. One URL-backed selection drives the visual, component choice, concise explanation and card state.
- Locate selects and focuses the in-page visual. Learn opens the existing detailed educational route. Search and filters reconcile selection and show explicit empty states.
- Reuse the separate component images and neutral combustion-car cutaway. Use anchored blue image overlays for close-ups; mask belts, reservoir and filter regions so surrounding assemblies remain neutral. Use a separate generated brake-pad/wheel view and EV cutaway where useful. Explain representative appearance, illustrative blue color, and generic location.
- Stack visual, selectors, concise details and cards on mobile. Keep controls at least 44px high, keyboard focus visible, image dimensions reserved and reduced-motion behavior.
- Verify all mappings, both differential/transfer-case assets, selection/filter/deep-link restoration, Locate versus Learn, missing-image retry, garage regressions, static imports and image inventory. Inspect desktop and mobile in a browser where tooling permits; report any concrete blocker.
