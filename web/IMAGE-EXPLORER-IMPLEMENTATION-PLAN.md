# VenusDrive implementation plan: bright showroom and static component explorer

Date: 2026-10-27
Status: Implemented; see `STATIC-EXPLORER-DELIVERY.md` for verification and outstanding rendered-browser acceptance.
Scope: Refine the existing landing page, replace the explorer, and make necessary onboarding improvements while preserving the working garage and saved data.

## 1. Agreed outcome

Deliver the existing VenusDrive website with a polished bright showroom presentation and an image-based learning experience. A driver must be able to choose a part, recognize its representative appearance, and understand its purpose and basic care.

Use `../VenusDrive New Mockup ideas/Picture website idea.png` for the bright visual treatment and `../VenusDrive New Mockup ideas/VenusDrive_ Your car, understood mockup design.png` for the content sequence. Keep white and warm-gray surfaces, realistic silver-car imagery, black typography and primary buttons, rounded cards, soft shadows, and restrained blue selection/focus accents. Preserve the existing VenusDrive branding.

This document is the deliverable for the current planning phase. No application code, images, dependencies, storage, or user records are changed in this phase.

## 2. Existing implementation and preservation boundaries

The production site is buildless HTML, CSS, and JavaScript ES modules in `public/`, served by `python3 server.py` at `http://localhost:4173`. Keep this architecture; do not introduce a framework, bundler, 3D package, or backend migration.

Relevant existing modules:

| Area | Existing files | Intended treatment |
| --- | --- | --- |
| Landing page and preview | `public/landing.js`, `public/interactions.js`, `public/studio-tour.js` | Refine composition, replace simulated rotation interactions, connect real destinations, preserve preview isolation. |
| Explorer | `public/explorer.js`, `public/explorer-selection.js` | Replace rendering and selection behavior with the static-image browser/detail experience. |
| Educational content | `public/content.js` | Extend structured data; retain all 27 IDs, aliases, guide connections, and useful explanations. |
| Routing, forms, garage | `public/app.js` | Make focused route, onboarding, detail-link, and presentation changes. Reuse working forms and garage flows. |
| Visual system | `public/style.css`, `public/light-theme.css` | Extend existing tokens and responsive styles; remove obsolete explorer rules after reference checks. |
| Maintenance and storage | `public/core.js`, `public/persistence.js`, `public/reminder-preferences.js` | Preserve calculations, schemas, unit conversions, ownership boundaries, and storage behavior. |
| Catalog and backend preparation | Catalog modules/data, `public/config.js`, `public/runtime-config.js`, `supabase/` | Preserve catalog provenance, branding, authentication capability, and backend contracts. |

The current library has the requested 25 entries plus `traction-battery` and `electric-drive`. Keep all 27. Existing 3D geometry covers only some entries; it will not be used to satisfy image coverage.

Preserve vehicle IDs, selected vehicle, archived vehicles, service/task IDs and relationships, mileage logs, photos, receipts, expenses, reminder preferences, local/demo storage keys, and account data formats. No data migration is expected. Preserve archive/restore as the existing way to remove a vehicle from the active garage without losing its history.

Do not rebuild service recording, expense tracking, reminder calculations, catalog selection, or vehicle editing. Keep optional advanced vehicle fields and manual entry available. Do not read, reset, or seed the user's real browser workspace during testing; use isolated fixtures and disposable test workspaces.

## 3. Final experience

### Landing page

Use the following sequence:

1. Floating rounded navigation: VenusDrive, How It Works, Explore, Features, garage/account access, and black Get Started action. Retain a concise How It Works anchor in the page. Collapse navigation accessibly on mobile.
2. Hero with exact headline **“Your car. Understood.”**, subtitle **“Know your car. Track maintenance. Drive with confidence.”**, Create My Garage, and Explore the Car. Place the silver sedan prominently beneath the copy in a bright architectural setting.
3. Learning section with exact heading **“A little knowledge. A better drive.”**, a separate static cutaway-car illustration, and the three category cards.
4. Garage preview with exact heading **“Your car care, in one place.”**, readable sample vehicles, mileage, maintenance, history, reminders, and multiple-vehicle switching. Keep it visibly labeled Demo Preview.
5. Large rounded sunlit-garage card with exact heading **“Give your car a home.”** and Build My Garage.
6. Minimal footer with VenusDrive, About, Contact, Privacy, and Terms linked to existing destinations.

All text and controls remain real HTML over separate image assets. Use modest hover/transitions and reduced-motion support. Reserve image space at every breakpoint.

### Calls to action and onboarding

| Action | Behavior |
| --- | --- |
| Create My Garage / Build My Garage / Get Started | Enter the browser-local workspace and open the existing add-vehicle form after loading saved data successfully. Never create a blank replacement workspace. An existing garage remains intact and adding another vehicle is allowed. |
| Garage access when cloud is unavailable | Use a clearly labeled Open My Garage action that reaches the local dashboard or empty garage. Do not present unavailable signup as the primary path. |
| Sign In when cloud is configured | Keep the existing real authentication route; local onboarding remains usable without authentication. Preserve an already active cloud session rather than silently changing its save destination. |
| Explore the Car / Explore Car Parts | Open the full static component browser. |
| Engine & Oil card | Open the explorer filtered to Engine & Fluids. |
| Tires & Brakes card | Open the explorer filtered to Tires, Brakes & Suspension. |
| Battery & Electrical card | Open the explorer filtered to Electrical & Lighting. |
| Component thumbnail or retained hotspot | Open the matching stable component ID, never a generic unrelated explanation. |

Reuse the existing vehicle form for year, make, model, nickname, current mileage, and preferred mi/km unit. Keep catalog/manual entry, validation, equipment qualifiers, editing, photos, and mileage-correction behavior. Visually prioritize the required fields; group optional details only where necessary. On save, show the selected vehicle's usable dashboard. Cancel returns focus appropriately and makes no record changes. Storage-load/save errors must preserve input and report failure without claiming success.

Distinguish three existing contexts: the user's browser-local garage, the separate persistent demo workspace, and the landing page's in-memory preview. Keep their data isolated. Retain Reset preview; provide a clearly labeled Reset demo control limited to the demo workspace with explicit confirmation. Never reset the user's local garage through either control. State that local data stays in this browser and reminders are in-app; do not imply sync, email, or push delivery.

### Static vehicle imagery and hotspots

Reuse suitable `public/assets/studio/` silver-car and garage images after visual review. Existing views are front, front three-quarter, and rear; do not mislabel the three-quarter image as a side view. If view selectors remain, name each actual static angle explicitly. No 360° label, rotation hint, draggable tour, orbit, camera controls, or simulated continuous rotation remains.

Tire hotspots may anchor to visible tires. Engine and battery must not be marked as if visible through an opaque body panel. Use actual visible parts in the cutaway or an additional open-hood image if needed; otherwise use separate component-thumbnail links alongside the hero. Prefer accurate links over speculative hotspot positions. Any retained hotspot has a visible name, keyboard access, and the same matching detail destination as the component browser.

The learning cards are links into filtered explorer results. Their descriptions remain visible on the landing page. Hover/focus can highlight the corresponding region of the static cutaway using simple overlays; this is an image treatment, not generated geometry or a rotatable model. If a region cannot be placed credibly, leave it unmarked and retain the functional card link. No essential information depends on hover.

### Desktop and tablet explorer

At wide widths, use a browser column and a larger detail area. At narrower/tablet widths, stack them or switch to the dedicated detail pattern when two columns no longer fit comfortably.

- Browser: labeled search, five rounded category filters plus All components, result count, clear-filters action, and a scrollable thumbnail-card list.
- Detail: component name, large matching image, representative-example caption, short description, applicability note, and the five educational sections.
- Cards: native buttons/links, thumbnail, name, subtle blue selected border/background, and programmatically exposed selection. Do not rely on blue alone.
- Initial desktop view: show Engine as the first selected item when opening the unfiltered browser; a valid deep link overrides it. A category-only destination selects its first result on desktop.
- Search matches name, existing aliases, category, and short description; case-insensitive and whitespace-tolerant. Search and category use AND logic. All 27 entries are discoverable regardless of the selected garage vehicle; applicability is explained rather than silently filtering content out.
- Retain a selection only while it belongs to the current results. If it no longer matches, clear the detail until another result is selected. No-result searches clear old image/content and show a helpful empty state and reset action.
- Image load failure shows an explicit unavailable-image message and retry option with the educational content still available. Never substitute an unrelated part image.

### Mobile detail navigation

Mobile opens with the component browser first. Selecting a component opens a dedicated detail view with a visible **Back to components** button. A valid component deep link opens its detail directly.

Preserve query, active category, list scroll, and originating card during browser/detail navigation. Back restores that state and keyboard focus to the originating card. When opened directly, Back goes to the full browser. Browser Back/Forward must agree with the visible view; do not add a history entry per search keystroke. Move focus to the detail heading on selection. Breakpoint changes retain the chosen component and filters without trapping focus in hidden content.

Extend the current hash routing deliberately: retain existing `#explorer/<stable-id>` links and support browser/filter URLs such as `#explorer?category=engine-fluids`. Parse path and query separately, validate IDs/categories, and handle unknown values with a useful browser state. Keep explorer UI state separate from garage records and preserve authentication callback parsing.

### Educational detail content

Every detail view includes:

1. Component name and short plain-English description.
2. Matching main image; two separately labeled images for Differential and transfer case.
3. Exact caption beneath each main image: **“Example component. Appearance and location vary by vehicle.”**
4. **What it does**.
5. **Where it is usually located**.
6. **Common warning signs**.
7. **Basic care**.
8. **When to get professional help**.

Explain technical terms on first use, distinguish symptoms from diagnosis, and make basic-care guidance component-specific rather than repeating a generic paragraph. State relevant configuration exceptions, including belt versus chain, spark ignition versus diesel, low-voltage versus traction battery, conventional alternator versus other charging arrangements, and optional transfer cases. Representative illustrations never establish exact location, compatibility, installation procedure, or the user's equipment.

Reuse useful existing content and guide links. During implementation, verify revised safety/care statements against authoritative sources and retain source attribution in structured data. Use manufacturer documentation for vehicle-specific intervals when actually available; otherwise keep user-entered intervals and clearly label general guidance. This scope does not add a manufacturer-schedule database or infer schedules from make/model selection. Mileage reminders continue to depend on the driver updating mileage.

## 4. Structured data and asset contract

Extend the existing `PARTS` records in `public/content.js` rather than creating a competing content list. Keep all current stable IDs, aliases, task references, source references, and guide links. Add category IDs and structured image/content fields. Suggested shape:

```js
{
  id: 'oil-filter',
  categoryId: 'engine-fluids',
  name: 'Oil filter',
  aliases: ['engine filter', 'oil cartridge'],
  description: '...',
  images: [{ src: '/assets/components/oil-filter.webp', alt: '...', width: 1024, height: 1024 }],
  thumbnail: { src: '/assets/components/thumbs/oil-filter.webp', alt: '...', width: 192, height: 192 },
  applicability: '...',
  education: { whatItDoes: '...', location: '...', warningSigns: [], basicCare: [], professionalHelp: '...' },
  // Retain existing fields consumed by guides, tasks, and other screens.
}
```

Use one canonical selected ID to derive card highlight, thumbnail, title, images, and content. Other part-detail entry points must reuse the same data; avoid a second stale text-only detail definition. Categories are fixed UI records with stable IDs, not inferred from changing display text.

### Complete component asset list

Store optimized main images under `public/assets/components/` with matching thumbnail derivatives in `public/assets/components/thumbs/`. The filenames below are planned assets, not images already generated. Each row needs its own image; the final drivetrain entry uses two. Thumbnail derivatives may share a main image's source artwork.

| # | Stable ID | Component | Category | Main filename and visual brief |
| --- | --- | --- | --- | --- |
| 1 | `dipstick` | Engine-oil dipstick | Engine & Fluids | `engine-oil-dipstick.webp`: full slender metal dipstick, recognizable loop handle, and visible marked measuring tip. |
| 2 | `coolant-reservoir` | Coolant expansion reservoir | Engine & Fluids | `coolant-expansion-reservoir.webp`: translucent reservoir, cap, fluid level and molded level marks; no invented textual labels. |
| 3 | `engine` | Engine | Engine & Fluids | `engine.webp`: recognizable combustion-engine assembly with useful visible mechanical features. |
| 4 | `oil-filter` | Oil filter | Engine & Fluids | `oil-filter.webp`: unbranded spin-on oil filter with visible threaded base; explain that cartridge designs also exist. |
| 5 | `radiator` | Radiator | Engine & Fluids | `radiator.webp`: finned rectangular heat exchanger with tanks and hose connections. |
| 6 | `air-filter` | Engine air filter | Engine & Fluids | `engine-air-filter.webp`: pleated intake filter with recognizable sealing frame. |
| 7 | `fuel-system` | Fuel system | Engine & Fluids | `fuel-system.webp`: coherent contextual assembly showing tank, pump, lines, and engine-side delivery; relationships must be visually understandable. |
| 8 | `spark-plugs` | Spark plugs | Engine & Fluids | `spark-plugs.webp`: ceramic insulator, threaded metal body, and electrode visible. |
| 9 | `catalyst` | Catalytic converter | Engine & Fluids | `catalytic-converter.webp`: exhaust housing with pipe connections and restrained sectional view of the internal honeycomb. |
| 10 | `transmission` | Transmission | Drivetrain | `transmission.webp`: complete conventional gearbox/transaxle with recognizable bellhousing; label its configuration in HTML. |
| 11 | `brake-pads` | Brake pads | Tires, Brakes & Suspension | `brake-pads.webp`: recognizable pair showing friction material and metal backing, not a wheel-only image. |
| 12 | `brake-fluid` | Brake fluid reservoir | Tires, Brakes & Suspension | `brake-fluid-reservoir.webp`: translucent reservoir and cap attached to a master cylinder for context. |
| 13 | `steering` | Steering system | Tires, Brakes & Suspension | `steering-system.webp`: coherent rack, tie rods, and column relationship; identify representative assistance type in HTML. |
| 14 | `suspension` | Suspension | Tires, Brakes & Suspension | `suspension.webp`: coherent corner assembly showing spring, strut/damper, hub, and control arm. |
| 15 | `tires` | Wheels and tires | Tires, Brakes & Suspension | `wheels-and-tires.webp`: mounted wheel/tire at an angle showing tread and sidewall clearly. |
| 16 | `battery` | Low-voltage battery | Electrical & Lighting | `low-voltage-battery.webp`: conventional low-voltage example with case and two recognizable terminals. |
| 17 | `alternator` | Alternator | Electrical & Lighting | `alternator.webp`: vented metal housing and belt pulley visible. |
| 18 | `lights` | Exterior lights | Electrical & Lighting | `exterior-lights.webp`: coherent front/rear lighting assembly illustration with separate HTML labels if needed. |
| 19 | `cabin-filter` | Cabin air filter | Cabin & Visibility | `cabin-air-filter.webp`: pleated cabin filter and contextual housing/glovebox opening to distinguish it from the engine filter. |
| 20 | `ac` | Air conditioning | Cabin & Visibility | `air-conditioning.webp`: coherent compressor, condenser, evaporator, and connecting-line illustration. |
| 21 | `wipers` | Wiper blades | Cabin & Visibility | `wiper-blades.webp`: blade pair with rubber edge and mounting connector visible. |
| 22 | `washer` | Washer reservoir | Cabin & Visibility | `washer-reservoir.webp`: recognizable shaped tank, filler neck, pump, and washer-symbol cap. |
| 23 | `belts` | Drive belts and hoses | Engine & Fluids | `drive-belts-and-hoses.webp`: contextual accessory-belt path and nearby coolant hoses, clearly distinct from enclosed engine timing hardware. |
| 24 | `timing-belt` | Timing belt | Engine & Fluids | `timing-belt.webp`: toothed belt with representative crank/cam sprockets; explain removed cover as educational exposure. |
| 25 | `differential` | Differential and transfer case | Drivetrain | `differential.webp` and `transfer-case.webp`: two distinct assembly images, each with its own HTML heading and alt text. |
| 26 | `traction-battery` | High-voltage traction battery | Electrical & Lighting | `high-voltage-traction-battery.webp`: recognizable underfloor battery-pack enclosure; explain restricted professional access. |
| 27 | `electric-drive` | Electric drive unit | Drivetrain | `electric-drive-unit.webp`: coherent motor/inverter/reduction-drive assembly with distinct parts explained in HTML. |

The five category IDs are `engine-fluids`, `drivetrain`, `tires-brakes-suspension`, `electrical-lighting`, and `cabin-visibility`. Category counts are respectively 11, 3, 5, 4, and 4: 27 entries total. Existing finer-grained `system` labels may remain for other consumers.

### Landing assets

| Asset | Plan |
| --- | --- |
| `assets/studio/silver-front.jpg`, `silver-quarter.jpg`, `silver-rear.jpg` | Review and reuse as explicitly named static views where suitable. No claim of actual side-view or 360° coverage. |
| `assets/studio/daylight-garage.jpg` | Reuse for the closing CTA if it meets the agreed bright composition. |
| `assets/studio/silver-sedan-cutaway.webp` | Generate a separate high-resolution static three-quarter illustration with coherent internal engine, braking, and low-voltage electrical systems. Match the bright silver-car visual direction. |
| Optional `assets/studio/silver-sedan-open-hood.webp` | Generate only if necessary to make retained engine/battery hotspots truthful and legible; otherwise use component thumbnails. |

Required new artwork: **28 main component images covering 27 entries, plus one static cutaway-car illustration**. Generate 27 matching thumbnail derivatives, choosing the differential image for that entry's thumbnail. Optional landing replacements or an open-hood asset are additional, conditional work.

### Image production and review

Use the built-in image-generation tool during implementation, following the imagegen skill. Generate each distinct asset separately; do not generate a UI screenshot or crop a component collage to simulate separate assets. Use a shared art-direction prompt plus each row's subject brief: realistic materials, soft consistent studio lighting, white background, useful viewing angle, generous object margins, no brands, no UI text, no decorative unrelated parts, and no baked-in headings.

Review every output for recognizability, plausible relationships, misleading details, cropping, and consistency before integration. Regenerate failures. Generated art is educational illustration, not engineering verification. Keep image-specific caveats and labels in HTML. Save approved files in the project, retain prompts and generation/provenance notes in `assets/components/README.md`, and update the existing studio provenance notes for new landing art.

Target approximately 1024px square main component exports and 192px thumbnails; allow landscape dimensions for assemblies/cutaway where clarity requires them. Record actual dimensions in the manifest. Optimize to WebP without losing small distinguishing features. Aim for main component files around 200 KB or less and thumbnails around 25 KB or less; record exceptions for complex assemblies. Lazy-load offscreen imagery and load only selected main images, with the hero image prioritized. If image generation is unavailable or fails, finish the interface/data work, retain explicit missing-asset states and a per-file outstanding list, and report the image acceptance gate as incomplete. Do not substitute unrelated pictures.

## 5. Implementation sequence

### Step 1 — Establish the baseline

- Read repository instructions and current README, fixes, verification, and asset provenance documents.
- Record working-tree status; preserve unrelated mockups/research and existing changes.
- Run the existing JavaScript, Python, and static checks where supported; record pre-existing failures separately.
- Capture current landing, explorer, and garage screenshots at representative widths if the preview can run.
- Record source/data boundaries for core calculations, storage keys/schema, catalog, branding, and backend preparation. Prepare isolated old-format data fixtures for preservation checks.

### Step 2 — Extend content and specify assets

- Add the five categories, complete 27-entry mapping, image metadata, applicability, and five educational sections.
- Preserve aliases and stable IDs used by task and guide links.
- Add data-integrity checks for counts, image paths, unique IDs, required content, and correct category assignment. Make absent assets explicit until generated.
- Review rewritten care statements against authoritative references; add no unsupported universal intervals.

### Step 3 — Produce and inspect image assets

- Generate and approve the 28 main component images and separate static cutaway.
- Create thumbnail derivatives; inspect them at actual card size and main images at mobile detail size.
- Optimize exports, record dimensions and provenance, and ensure every manifest path resolves. Do not mark asset coverage complete until all required images pass visual review.

### Step 4 — Replace the explorer

- Rewrite `explorer.js` as ordinary image-based browser/detail UI using the canonical component data.
- Update selection/filter helpers, route parsing, deep links, history, and mobile Back/focus/scroll restoration.
- Build desktop browser/detail layout and mobile dedicated detail view, including empty/error/loading states and both differential/transfer-case images.
- Route Parts-library, task, guide, thumbnail, and hotspot entry points to synchronized content. Retain useful guides and related-maintenance links without a second competing explorer.

### Step 5 — Refine landing and connect onboarding

- Apply the agreed bright treatment and section sequence using the existing design system.
- Replace the learning section's current exterior-image stand-in with the new cutaway illustration.
- Make category cards and explorer links reach the new browser/filter/detail routes.
- Replace draggable image-tour behavior with explicitly labeled static views where retained; remove all rotation suggestions.
- Reuse local workspace loading and vehicle form logic for garage CTAs. Preserve existing data/session state and working edit behavior.
- Keep the interactive demo preview isolated; provide scoped reset behavior and honest local/reminder messaging.
- Present required maintenance states as Upcoming, Due, and Overdue with text and icons. Preserve meaningful additional states such as missing history or paused tasks. Define the display mapping from existing calculation states explicitly; do not change due thresholds merely to change a label.

### Step 6 — Remove obsolete 3D code and update documentation

- Audit references before deletion. Expected obsolete candidates: `public/webgl-explorer.js`, `public/educational-model.js`, `public/explorer-2d.js`, and `scripts/inspect-educational-model.mjs`.
- Remove old explorer geometry, camera/orbit/picking controls, coverage labels, and geometry-only CSS, exports, tests, and generated reports from active workflows.
- Inspect `public/locations.js` before removal; preserve/refactor anything still needed for static hotspots or guides. `public/vehicle-art.js` is used outside the explorer and must not be deleted indiscriminately.
- Update mixed test files (`content.test.mjs`, `fixes.test.mjs`, `design.test.mjs`, `studio-tour.test.mjs`) without discarding unrelated garage, account, catalog, reminder, or navigation coverage.
- Update the offline-review builder to package static assets correctly; regenerate a review bundle only if it remains a supported deliverable.
- Update active README/fixes/verification/asset documentation to describe static imagery. Mark historical 3D records as superseded rather than rewriting historical test results as current evidence.
- No external 3D dependency is currently declared in `package.json`; verify imports and any newly discovered manifests before removing dependency entries or lockfile data.

### Step 7 — Verify and deliver

- Complete the acceptance matrix below, fix failures, and capture desktop/tablet/mobile evidence.
- Deliver code, reviewed assets, structured data, targeted regression updates, provenance notes, and an accurate verification report listing remaining blockers.
- Keep the result local. Hosting, DNS, paid assets/services, backend activation, and production deployment are outside this implementation scope.

## 6. Verification and completion criteria

### Automated and static checks

From `web/`, run `npm test` (Node 20+), `python3 tests/server_config_test.py`, `node scripts/check-static.mjs`, JavaScript syntax checks for changed modules, and `git diff --check`. Update retired geometry checks to useful static-explorer coverage rather than retaining irrelevant passing geometry tests.

Add focused behavior checks for:

- Exactly 27 unique component IDs; category counts total 27; 28 required main component paths and 27 thumbnails exist and decode with nonzero recorded dimensions.
- Every entry has image alt text, applicability, short description, all five educational sections, and representative-image caption support.
- Oil filter maps to the oil-filter image/content; low-voltage and traction battery aliases stay distinct; differential detail includes both correctly labeled assemblies.
- Search/category AND behavior, alias matching, no-result clearing, valid/invalid links, and selection reconciliation.
- Mobile browser/detail transitions and restoration; route parsing does not break existing route or authentication handling.
- Local onboarding loads existing records before opening the form; cancelling or failing a save makes no mutation; successful addition preserves existing records.
- Preview/demo resets cannot write into local/cloud records, and explorer navigation alone never writes garage data.
- No production explorer imports of WebGL/geometry remain. No rotation, orbit, 360°, or “Text explanation; no geometry” controls/labels remain in the active experience.

File-existence checks alone do not establish a correct image/content match; manually inspect all 27 entries.

### Browser acceptance matrix

| Area | Required evidence |
| --- | --- |
| Component coverage | Select every one of the 27 entries. Verify selected card, thumbnail, name, main image(s), category, caption, applicability, and five educational sections agree. Inspect the two drivetrain assemblies separately. |
| Search and filters | Try exact names, aliases such as “12v battery,” mixed case, whitespace, category plus query, clear/reset, and no results. Confirm old content does not remain selected outside results. |
| Desktop/tablet/mobile | Review approximately 1440px, 1024px, 768px, and 390px; also check 320px for overflow. Verify readable forms, usable category controls, fitting images, no unintended horizontal overflow, and no layout shifts while images load. |
| Mobile navigation | Open/close landing and workspace menus, Escape, focus restoration, browser/detail Back, direct links, browser Back/Forward, preserved list state, and breakpoint changes. |
| Keyboard/accessibility | Use only keyboard to navigate menus, search, filters, cards, details, and onboarding. Verify visible focus, Enter/Space behavior for appropriate controls, heading focus on detail entry, meaningful image alternatives, result announcements without excessive repetition, and hidden controls excluded from focus. Check contrast and reduced motion. |
| Landing actions | Exercise every primary CTA, each category card, retained hotspot/thumbnail, static angle selector, footer link, and demo control. Confirm local onboarding and garage destinations work without cloud setup. |
| Failure states | Simulate a missing/failed image, unknown part/category, slow image, unavailable catalog, and storage read/write failure. Verify honest fallback text, retry where useful, no unrelated artwork, and no false save-success message. |
| Runtime | Check console/network/CSP errors, selected-image loading, lazy offscreen assets, and cleanup across repeated route changes. Verify no WebGL context or obsolete 3D assets are requested. |

### Garage regression matrix

Use a disposable workspace containing fixtures in the existing format; do not reset the user's real data.

1. Load an existing multi-vehicle fixture containing archived vehicles, mileage history, custom tasks, services, expenses, photos/receipts, preferences, and selected vehicle. Open the landing page and explorer, return, and reload. Confirm no record mutation, ID changes, resets, or schema replacement.
2. Add a vehicle by catalog selection and another by manual entry. Edit details, switch vehicles, archive/restore, and refresh. Confirm vehicle-specific records remain associated correctly.
3. Update mileage, switch mi/km repeatedly, and perform an existing supported lower-mileage correction with a reason. Confirm physical distances/history remain correct and unchanged saves do not introduce rounding drift.
4. Record service date, mileage, type/task, cost, and notes; edit and delete the test visit. Confirm the existing service form works, history remains editable, totals count visits once, and next reminders recalculate correctly.
5. Create date-only, mileage-only, and combined reminders; complete a task through service recording. Verify either-threshold behavior, next reminders, snooze/disable behavior, and the explanation that mileage must be updated manually.
6. Reset the in-memory preview and persistent demo independently. Confirm local fixture data remains byte-for-byte unchanged where no intentional mutation occurred. Confirm ordinary preview changes do not write garage storage.
7. Retain existing account/backend contract and configuration safeguards in automated checks. Do not claim live cloud authentication, isolation, delivery, or sync verification without a configured backend and actual execution.

### Completion gates and limitations

The implementation is complete only when all 27 components have reviewed matching images and complete content; search, filters, keyboard access, mobile details and Back work; landing actions reach usable screens; obsolete 3D interactions are removed; and the garage regression checks show preserved behavior/data.

The current environment previously denied the local server socket bind, and Node/npm were not found during the planning inspection. Recheck capabilities during implementation. If browser execution or required checks remain blocked, document exactly what could not run and provide the commands/matrix for a runnable local session. Do not report browser behavior, rendered layouts, image coverage, or data preservation as verified based only on source checks. Missing artwork or unexecuted acceptance gates remain explicit outstanding work.

## 7. Planned implementation deliverables

- Refined responsive bright-showroom landing page with working local garage/onboarding actions.
- Static component browser and dedicated mobile detail flow for all 27 entries.
- Structured stable-ID content with five categories, matching imagery, applicability, and beginner-friendly educational sections.
- 28 reviewed main component images, 27 thumbnail derivatives, and one separate static cutaway illustration; suitable existing showroom assets reused.
- Removal of unused 3D rendering/control code and accurate updates to affected tests, build helpers, and active documentation.
- Regression and visual verification record, screenshots where executable, image provenance/prompt manifest, and an explicit list of any unresolved checks or missing assets.

No implementation approval question remains for this plan. The current user instruction limits this phase to producing this Markdown document; application implementation begins in a subsequent requested phase.
