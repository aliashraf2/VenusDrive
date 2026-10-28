> Current implementation: [Static explorer delivery](STATIC-EXPLORER-DELIVERY.md). The older WebGL/model requirements and earlier check counts below are historical and superseded by that report.

# VenusDrive implementation fixes — 27 October 2026

## Implemented

- Closed mobile navigation is hidden and inert. Opening focuses its close control, makes the workspace inert and traps Tab inside navigation. Escape, close and backdrop restore focus to the menu button. Menu labels/expanded state and desktop resizing are handled by a separate controller. Hidden backdrops cannot cover the page.
- Explorer search and filters reconcile the selection. `xyznotapart` clears the result selection, highlight and explanation; empty states include suggestions and clear-search controls. Layout changes remove incompatible selections. Camera changes retain the same selected component. Entries without geometry are explicitly text-only.
- Actual local WebGL triangle rendering replaces the primary flat explorer. It includes orbit, pointer/touch pinch, keyboard and button zoom/reset, named camera views, ray-picked component selection, highlighting and hide/transparent body modes. Rendering is on demand, pixel ratio capped, and the renderer is loaded on the explorer route. Text and lightweight 2D fallback remain available, including graphics failure handling. No automatic camera motion is used.
- **The realistic downloaded-model requirement is incomplete.** This is an original approximate educational chassis, not a verified production-car asset. No downloaded file was inspected or integrated. See `ASSET-RESEARCH.md` and `design-review/model-inspection.json`. No Spectral GT RS asset is used.
- Reminder distances display/edit in the selected vehicle's mi/km unit. Canonical storage remains kilometers. Unchanged display values preserve the exact stored distance, avoiding repeated rounding drift. Global defaults, per-vehicle overrides and per-task overrides have explicit precedence. Vehicle overrides also control stale-mileage prompting. Existing task overrides are preserved.
- Add vehicle appears beside the vehicle switcher and in dashboard actions. Update mileage, Record service, switching and the no-vehicle flow remain available.
- Public DESIGN STUDY labels and logo-review links were removed. Backend setup belongs in project documentation; local-storage/account-availability notices remain. Repeated cartoon cars were replaced by precise mileage instruments and a component summary. One original, labeled generic concept illustration remains on the landing page. The approved VD asset files, bright Swiss styling and catalog were retained.
- Supabase connection can be supplied via server public environment variables or static runtime configuration. Privileged keys are rejected by the server's public-config response. Added verification resend UI, provider-request handling tests, candidate-session cleanup, refresh deduplication and client attachment-path validation. Existing owner RLS, revision-checked RPC and private receipts policies remain intact. Client checks do not establish server-side isolation.

## Bright studio redesign

- Reworked the public landing page around the supplied white studio reference and the second mockup's content sequence. Kept VenusDrive name, VD mark, existing signup/signin links, app router, local/cloud state and catalog intact. The landing page is one scrolling experience with keyboard-accessible navigation, feature labels, process steps, an explainer section, interactive demo preview, garage CTA and working About/Contact/Privacy/Terms destinations.
- Applied a consistent light theme to the existing workspace as well as landing/auth/info pages. Primary actions are graphite with white labels, links/focus are blue, and maintenance status colors remain labeled. The interface uses neutral surfaces and no green/teal brand accents.
- Added generated, optimized, unbranded silver-sedan studio views and a daylight garage image. They are generic illustrations, not exact saved vehicles. The landing tour is a **three-angle image tour**, not real-time 3D; its draggable/keyboard angle switching, approximate visible-component markers, selection text, accessible part buttons, reset, and close behavior are implemented in `studio-tour.js`. It does not expose hidden component geometry. The existing app's separate approximate educational WebGL explorer remains available.
- Added a separate demo preview with sample vehicles, interval status, service records, reminders, spending, unit display, mileage, service entry, snoozing, and reset. These changes live only in memory and do not modify local/cloud records.
- New verified accounts with no active vehicle now land on My Garage after session restore; returning account sessions with a vehicle remain on their dashboard. Email/push delivery and authentication remain dependent on the user's Supabase configuration.
- Source/art provenance and limitations are in `public/assets/studio/README.md`. The supplied mockups remain in the repository for reference. No production publish, domain/DNS work, paid asset, account activation, or data deletion occurred.

### Redesign validation status

The redesign's prior regression run passed 38 JavaScript tests, 67 static checks, two Python public-config tests, and JavaScript syntax checks. Four additional source tests were authored for the studio tour, preview isolation and new-account routing, but could not be executed after the latest edits in this resumed environment: neither `node` nor `npm` is installed or reachable on `PATH`. `git diff --check` passes and the two Python server configuration tests pass. The earlier JavaScript run is reported as a prior result, not a fresh run on the final tree. The environment also denied the local preview server bind; Safari opened an “Open” local-file confirmation panel instead of rendering the offline page. No rendered desktop/mobile screenshots or browser workflow results were captured in this resumed session.

## Checks performed

| Check | Result and boundary |
|---|---|
| JavaScript automated tests | **38 pass**. Core maintenance/vehicle/service history, either threshold, expenses/currencies, duplicate prevention, exports, persistence adapters, catalog/content, reminder conversion/scopes, search/selection, geometry/picking and mocked auth/navigation contracts. See `design-review/fixes-test-results.txt`. |
| Python public-config tests | **2 pass**. Public keys accepted; malformed/privileged keys not emitted. |
| Static imports/config/contrast | **62 checks pass**. Six measured foreground/background pairs exceed 4.5:1; this does not establish complete rendered accessibility. See `design-review/fixes-static-checks.json`. |
| Syntax | All public JavaScript modules and generated offline review bundle pass Node syntax checks. |
| Model inspection | Original combustion/hybrid scene: 29 meshes, 27,520 triangles, 16 groups. Electric filter: 19 meshes, 23,904 triangles, 8 groups. Tests validate finite triangles/normals and group presence; not realism or engineering accuracy. |
| Preservation | Core calculations, catalog provider/data, VD logos/favicon, SQL migration and deletion function match their prior hashes. Existing local/demo keys and schemas retained. No user records were read, reset or deleted. See `design-review/fixes-preservation-check.json`. |
| Live Supabase | **Not run.** No project configuration or test credentials were available. No email delivery, authentication, isolation or cross-session synchronization claim. |
| Rendered browser checks/screenshots | **Not completed.** Python preview binding was denied with `PermissionError: [Errno 1] Operation not permitted`. Browser inventory exposed no structured tabs; native Chrome attempts encountered active-window changes. Separate Safari reached a local-file confirmation dialog with Open disabled, then reported `noWindowsAvailable`. No VenusDrive desktop/mobile screenshot was obtained. |

No screenshot, keyboard-in-browser, touch, actual WebGL GPU rendering, 390px layout/overflow or immediate successful-save UI result is claimed verified. Controller mocks, source checks and triangle counts do not establish those outcomes. The generated offline review aid is available at `design-review/VenusDrive-offline-review.html`; it uses isolated review-only storage and disables cloud access.

## Content and component coverage

Catalog unchanged: **15,599 make/year/model rows, 57 brands**, incomplete by design; no engines/schedules/fitment inferred. Library: **27 components / 17 systems / 8 guides**.

Original approximate 3D groups: engine, oil filter, dipstick, engine air filter, low-voltage battery, alternator, radiator, coolant reservoir, brake-fluid reservoir, washer reservoir, accessory belts, disc brakes/pads, tires, suspension, transmission and exhaust/converter. Generic EV filtering is not a verified EV architecture; high-voltage and hybrid-specific geometry is absent. All other entries remain text-only. Exact positions vary by vehicle; the selected saved vehicle is explicitly distinguished from the illustration.

## Required next steps

1. Connect your own Supabase project following **`ACCOUNT-CONNECTION.md`**: apply the migration, enable email verification, configure local redirects and public URL/key, configure an owned sender as needed, and deploy the prepared account-deletion function when appropriate. Then run two-account read/write/attachment isolation, delivery and two-session persistence/conflict tests. `scripts/check-live-accounts.mjs` supports read-only checks without modifying records.
2. Retrieve and inspect a suitably licensed mechanical model. Retain asset notices/hash/provenance and validate every required component before integrating it. Current original geometry is an interim implementation, not a substitute for that inspection.
3. Run `python3 server.py` from this folder in your Terminal; perform the browser acceptance matrix in `VERIFICATION.md` at desktop, tablet and **390px**, including WebGL/touch/fallback, menu focus/Escape, no-result search, reminder unit changes, multiple vehicles and service save/edit/delete. Capture screenshots and resolve any visual defects before production.

No services were purchased/activated, no source was published, no existing file or user record was deleted, and no website publication, domain connection or DNS change was performed.
