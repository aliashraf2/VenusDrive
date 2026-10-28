> Latest learning-section revision: [rounded icon tabs and system-specific cutaways](design-review/learning-tabs/DELIVERY.md). The latest suite has 46 passing tests; mobile visual checks for this revision are deferred at the user’s request.

# VenusDrive static explorer delivery

Implemented 2026-10-27 against `IMAGE-EXPLORER-IMPLEMENTATION-PLAN.md`.

## Delivered

- Bright showroom landing page: floating rounded navigation; compact desktop 40/60 split hero with a two-line left-aligned headline, vertically centered text and buttons, and a full-vehicle transparent silver sedan; stacked compact mobile content; named static photo views, component-thumbnail links, separate cutaway illustration, category links, interactive isolated demo preview and sunlit-garage CTA. Desktop side spacing is 48–64px, and the next section starts directly after the hero.
- All 27 existing stable component IDs retained, including High-voltage traction battery and Electric drive unit. Five explorer categories use blue selected states and readable thumbnail cards.
- 28 separate generated main component images, 27 thumbnail derivatives and one separately generated cutaway car, plus a transparent hero edit of the existing sedan. Differential and transfer case has two independently labeled assembly images. Every required image is present and was visually reviewed; no missing-asset substitution is used.
- Search and category filters combine. Selection drives the title, thumbnail, main image(s) and five educational sections from shared structured data. Unknown routes and empty searches have useful fallback states. Failed images have an explicit message and retry.
- Mobile uses a browser-first view and a dedicated detail screen with Back. Search/category, list/page scroll and originating-card focus are restored. Component links remain addressable as `#explorer/<id>`; category URLs use `#explorer?category=<id>`.
- Each main image displays “Example component. Appearance and location vary by vehicle.” Applicability notes explain configuration differences; symptoms are distinguished from diagnosis. Existing guides and sources remain available.
- Landing garage actions load the existing local workspace and reuse the current vehicle form. Optional configuration fields are grouped without losing existing entry/editing behavior. A newly saved vehicle opens its dashboard. A signed-in cloud workspace is preserved when already active.
- Unavailable signup is no longer the primary garage path. Local records, persistent demo and in-memory preview remain separate. Reset preview and confirmed Reset demo are scoped to their own sample data. Mileage-based reminders explain that the driver must update mileage; no email/push delivery is implied.
- Removed WebGL renderer, generated geometry, fallback geometry, unused location mappings, geometry inspection script, camera/orbit/rotation controls and obsolete styles/tests. Static front/quarter/rear view buttons remain ordinary image selectors. No 3D dependency was declared in the package manifest.

## Data preservation

No storage-key, schema or backend migration. No real browser-local user records were read, seeded, reset or deleted during verification. The offline preview uses `venusdrive.review.v1.*` keys, separate from the product's `venusdrive.v1.*` keys.

SHA-256 comparisons confirm 11 protected files are unchanged: core calculations, persistence adapter, reminder conversions/preferences, catalog provider/data, VD logos/favicon, public configuration, initial SQL migration and deletion function. Results are in `design-review/static-explorer/preservation-result.json`.

The onboarding controller regression loads an old-format fixture with active/archived vehicles and recorded tasks/services, opens the real add-vehicle action, cancels without mutation, saves another vehicle, and checks prior records remain intact. It also resets only the separate demo and checks unreadable local data is not overwritten. Existing tests cover service editing/deletion, unit conversion, either-threshold reminders, history preservation, expense counting and store isolation.

## Verification

Current command outputs are saved under `design-review/static-explorer/`.

| Check | Result / boundary |
| --- | --- |
| JavaScript regression suite | 43 tests pass, including six static-explorer tests and the actual onboarding action/submit flow using DOM fixtures. These are controller tests, not browser rendering or real keyboard/touch execution. |
| Python public configuration tests | 2 pass. |
| Static imports, asset paths, content and sampled contrast | Pass; see `static-checks.json` for the current count. Contrast sampling does not establish complete rendered accessibility. |
| Image audit | 28 main component images decode at 1024 × 1024, 27 thumbnails at 192 × 192, cutaway at 1536 × 1024, transparent hero at 1600 × 742. All separate parts reviewed visually, including the differential and transfer case. |
| Syntax and whitespace | Public modules, script modules and offline bundle checked; `git diff --check` passes. |
| Protected source/data files | 11/11 hashes unchanged. |
| Rendered browser evidence | Chrome rendered the final split hero in the isolated offline page. Screenshots with the full window and a narrower docked-tools viewport show the navigation, two-line headline, subtitle, both actions and whole car together, with the next section directly below. The final heading and image were also checked in the accessibility tree. |
| Remaining browser acceptance | Native Chrome initially timed out on explorer navigation and later rendered the final desktop hero successfully. Its browser connector is unavailable. Responsive tooling was intermittent. The fixed-viewport review initially appeared blank, then exposed its 1366 × 768 laptop page and app headings in the accessibility tree; the subsequent screenshot timed out. Exact laptop/mobile/tablet screenshots were not obtained. Safari remained in its local-file confirmation panel with Open disabled, then returned `noWindowsAvailable`. Desktop explorer, exact mobile/tablet layouts, keyboard/touch flows, complete overflow/contrast and HTTP behavior remain unverified. |
| HTTP preview | `python3 server.py` still fails to bind `127.0.0.1:4173` here with `PermissionError: [Errno 1] Operation not permitted`. No sandbox bypass was attempted. |
| Live backend | Not configured/tested in this task. No cloud isolation, email delivery or device-sync verification is claimed. |

## Run and finish browser acceptance

From `web/`, run:

```sh
python3 server.py
```

Open `http://localhost:4173`. For a serverless visual review, open `design-review/VenusDrive-offline-review.html`; it packages the real modules and images, disables cloud configuration and isolates review storage. Its storage/catalog/URL context differs from the actual HTTP site, so it does not replace live local acceptance.

Re-run:

```sh
node --test tests/*.test.mjs
python3 tests/server_config_test.py
node scripts/check-static.mjs
python3 scripts/check-component-images.py
```

Node 20+ is required. This environment's installed runtime was found at `/Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node`; no global runtime/dependency installation was needed.

Complete the browser matrix in the implementation plan at desktop, 1024px, 768px, 390px and 320px: all 27 selections, image matching, search/filter combinations, mobile Back/history/scroll/focus, accessible menus and forms, reduced motion, image failure/retry, all primary/footer links, and garage add/edit/switch/archive/service/reminder flows in a disposable workspace. Do not mark these browser checks passed from the controller tests alone.

## Artwork and care sources

The complete built-in `image_gen` prompt/source records are in `design-review/static-explorer/image-generation/`. Production exports are under `public/assets/components/` and `public/assets/studio/`; see their README files. Generated illustrations establish recognizability, not engineering accuracy or compatibility.

Related care sources reviewed during implementation: [NHTSA TireWise](https://www.nhtsa.gov/vehicle-safety/tires), [NHTSA seasonal vehicle checks](https://www.nhtsa.gov/summer-driving-tips), [US DOE electric-vehicle maintenance and safety](https://afdc.energy.gov/vehicles/electric-maintenance), and [Bosch routine inspection](https://www.boschcarservice.com/ae/en/services/inspection-and-checks/car-servicing/). These support general care context; exact vehicle procedures and intervals require the applicable manufacturer's documentation. No manufacturer-schedule database or universal replacement intervals were introduced.

No website publication, deployment, DNS changes, paid-service activation or backend setup was performed. Implementation, including the requested split-hero revision, is delivered; the blocked rendered-browser acceptance checks above remain outstanding.
# Interface refinement update — 2026-10-28

Decorative action arrows and their empty icon elements have been removed. Shared spacing and controls are consistent across the landing page, demo preview, dashboard, parts library, guides and feedback form. The dashboard now shows mileage and its last update without a decorative gauge. Feedback downloads remain local and have accessible inline validation.

Latest validation: 47 JavaScript tests, 2 public-configuration tests, 154 static checks, image inventory, syntax and whitespace checks passed. The desktop landing page was visually inspected. Native Chrome returned stale screenshots after navigation and the active session changed during review; rendered tablet/mobile layout checks and a complete browser feedback-download run remain unverified. Core calculations, persistence, configuration and catalog files were unchanged by this refinement.
