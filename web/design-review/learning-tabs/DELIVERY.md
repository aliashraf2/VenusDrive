# Learning section revision — 2026-10-27

The “A little knowledge. A better drive.” section now uses real button tabs for Engine & Oil, Tires & Brakes, and Battery & Electrical, with circular component thumbnails. Titles, descriptions and interaction states have no underlines or arrow decorations. The blue rounded Explore Car Parts button also has no arrow.

Default tabs are white with a subtle border and shadow. Hover uses pale blue and a stronger shadow. Selection consistently applies the same blue background, border, icon treatment and shadow to the active tab. Keyboard focus remains a separate visible outline. Arrow keys, Home and End move focus and selection; native Enter/Space activation remains available.

Tabs preview the matching system in place. The Explore Car Parts link targets the selected category using the existing `#explorer?category=engine-fluids`, `#explorer?category=tires-brakes-suspension`, or `#explorer?category=electrical-lighting` destination. The explorer's All components filter and full browser remain available. No garage route, calculation, storage key or saved-data format was changed.

Three separately generated 1536 × 1024 WebP cutaways keep the entire car visible with consistent framing. They highlight engine/oil, tires/brakes, or the low-voltage battery/electrical system. Selection, image alt text, caption, tab attributes and explorer link use shared structured data in `public/learning-systems.js`. A failed image has an explicit retry state. Offscreen artwork and tab thumbnails are lazy-loaded; selected images load on demand with fixed dimensions to avoid layout shifts.

The images are production assets under `public/assets/studio/silver-cutaway-*.webp`. Their full built-in `image_gen` prompts, references and saved output locations are in the adjacent JSON files. The images contain no UI labels. Circular tab icons reuse the existing component images.

## Verification

- 46 JavaScript tests pass, including three learning-tab tests for shared asset/category mapping, whole-card selection, keyboard wrapping/focus, cleanup and image retry. Existing onboarding, garage, maintenance and storage regression tests also pass.
- Static imports/assets/contrast checks pass; see `static-checks.json` for the exact count. Image audit confirms all three new files decode at 1536 × 1024; see `image-audit.json`.
- Two public configuration tests pass. JavaScript syntax and `git diff --check` pass.
- Eleven protected calculation, persistence, catalog, branding and backend files retain their recorded SHA-256 hashes. No real garage records were modified for testing.
- The running HTTP preview at `http://localhost:4173/` exposed the new tabs, matching image descriptions and selected state. Desktop screenshot inspection confirmed the whole car, circular icons, no underlines/arrows, the blue Tires & Brakes selected tab and the filled blue Explore Car Parts button.
- Mobile layout verification is deferred at the user’s explicit request. The responsive rules and keyboard/controller checks are saved; no completed mobile screenshot or touch check is claimed. Desktop image/tab selection was visually checked. End-to-end browser navigation was interrupted by changes in the controlled window, so the category destinations are verified by controller tests rather than a completed browser navigation run.

No deployment, DNS, provider/account setup, new tracking, or data reset was performed.
