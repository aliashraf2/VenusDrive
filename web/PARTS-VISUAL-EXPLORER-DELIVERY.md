# Combined Car Parts visual explorer

Implemented on `#parts` above the approved compact card grid. The landing learning section’s Explore Car Parts button preserves its selected category and opens this combined page. Existing `#explorer` and `#explorer/<component>` educational routes remain available.

## Delivered behavior

- All 27 components, original short descriptions, alias search and 17 system filters remain. A category filter supports the five existing broad categories.
- A shared selection drives the main image, blue treatment, caption, native component selector, concise explanation and highlighted card. Search/system/category filters combine; zero results clear the old image and selected state.
- Locate part selects the matching component, scrolls the visual into view and focuses its title. Learn about this part opens the existing five-section educational detail. The selection and filters survive return navigation through URL parameters.
- Differential and transfer case retain separate labeled images and assembly selection. Image failure exposes retry and keeps the educational destination available.
- Desktop places the image on the left and selectors/details on the right. Mobile stacks image, selectors, details and cards; no nested component scrolling is added. Controls support native keyboard selection and visible focus. Reduced-motion preference suppresses transition/scroll animation.
- Existing individual images are reused at recognition size. A blue luminance treatment keeps texture visible and white backgrounds neutral. Reservoir/filter masks leave surrounding assemblies neutral. Belt paths use image-coordinate masks intersected with dark rubber pixels. Image and highlight share the same responsive coordinate system.
- A separate neutral car cutaway is available through Vehicle orientation. EV selections use a separate EV cutaway. The new exploded brake example distinguishes the blue pads from the neutral tire, disc and caliper. It is explicitly a recognition illustration, not an assembly instruction.
- Fixed an older unclosed comment in the shared stylesheet that had disabled disclosure, responsive and navigation rules. The desktop Close navigation control is hidden by those restored rules.

## Verification

51 JavaScript tests pass, including controller checks of all 27 matching images/content/card states, combined filters, zero results, Locate focus, native selector changes, deep-link restoration, both differential assemblies and retry. Existing garage, service history, reminders, local/demo isolation and onboarding regressions pass. Public configuration tests: 2 pass. Static import/asset/contrast checks, JavaScript syntax, offline-review packaging, image decoding/dimensions and Git whitespace checks pass.

The live desktop page was visually inspected with a timing-belt highlight. This review exposed the shared CSS comment defect, which was repaired. The belt mask was then tightened to exclude bright metal pixels. Subsequent browser review was interrupted by a native-tool timeout and concurrent browser tab changes; no completed final mobile screenshot, full browser flow, touch test or exhaustive rendered mask-alignment claim is made. Automated checks establish mappings/state, not browser pixel alignment.

## Assets and preservation

New files in `public/assets/parts-visuals/` are documented in their README. Both are 1536×1024 optimized WebP images. No required component image is missing. Small/hidden parts intentionally use their matching isolated or assembly images instead of obscure marks on a full car. Exact vehicle-specific contextual layouts are outside these representative examples.

Core calculations, persistence, configuration, catalog, saved-data schemas and garage records were not changed. No backend, notification delivery, WebGL renderer or compatibility claim was added.
