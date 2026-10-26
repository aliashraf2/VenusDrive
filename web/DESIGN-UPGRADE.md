# Swiss / International design upgrade

## Implemented

The existing website was updated in place. The public landing page is one cohesive scrolling experience, with in-page wayfinding, large editorial typography, a generic concept-vehicle exhibit with working side/front/rear controls, the maintenance approach, an interactive product preview, parts education links and a clear garage entry point. The approved VD SVG, white version and favicon remain unchanged.

The shared application design now uses white/cool-gray surfaces, graphite text, electric blue actions, disciplined grid spacing, 3–7 px component radii, delicate borders, monoline navigation icons and restrained status colors. The theme applies to the dashboard, vehicles, schedules, history, parts, explorer, expenses, settings, account screens and dialogs. No downloaded font, image, dependency or paid API was added. The automotive illustration is original SVG, not a model-specific representation of a saved vehicle.

The dashboard emphasizes the selected vehicle, actual reading and next maintenance action. Existing vehicle switching, task-detail dialogs and expense filtering remain wired to the saved state. Service records now expand inline to show the shop, parts, notes, primary category and itemized costs. Save buttons show a pending state and preserve the form on errors. Successful saves still update state only after persistence succeeds, then repaint the relevant values.

The landing preview uses the same maintenance/service/spending functions as the app. It supports two illustrative demo vehicles, maintenance/history/expense tabs, expandable calculation explanations, sample service recording, demo mileage updates and reset. It is explicitly labeled demo data and operates in memory only. It never reads or writes saved browser data and does not represent cloud synchronization or manufacturer guidance.

Controlled motion includes scroll-driven reveals with IntersectionObserver, brief hover/focus feedback, chart-bar updates, dialog/detail entrances and explorer view changes. All animation/transition effects and reveal hiding are removed for reduced-motion preferences. Touch targets, keyboard-operable preview tabs, explicit status labels, native expandable service details and larger explorer hotspot hit regions support accessible interaction. Parts filtering announces its result count and expense updates have a labeled live region.

Explorer search and deep links retain their requested part. A link to a traction battery now opens a compatible generic layout instead of substituting the low-voltage battery when the selected saved vehicle has a combustion powertrain. An explicit combustion-part link can similarly switch the educational layout without changing the saved vehicle. The generic-location notice, safety copy, seven views, touch-swipe handler and text alternative remain. Keyboard selection restores focus after hotspot repainting. The explorer is still a multi-angle educational illustration, not true 3D.

Two small existing UI issues were addressed: an empty service-history route no longer tries to bind missing filters, and the “Try demo” action consistently opens demo mode rather than toggling into a local garage. No storage migration or user-record deletion was added.

## Verification performed

- **26 automated tests passed**, including the original 18 maintenance, catalog, content and persistence tests. Additional tests cover preview calculations, immutable input, repeated service cost counting, switching/mileage separation, lack of preview storage access, explicit part/layout selection, landing labels/anchors, route wiring, expansion markup and reduced-motion/focus rules.
- **43 static checks passed**, covering expected files, imports, canonical/brand configuration and selected text/action/status color pairs. Calculated contrast ratios range from **5.80:1 to 15.43:1**. These are mathematical color checks, not a complete rendered accessibility audit.
- All **11 public JavaScript modules** passed Node syntax checking. The review bundle also passed syntax checking.
- SHA-256 comparisons confirmed these ten files were unchanged: core maintenance logic, persistence adapters, catalog provider, public configuration, all 15,599 catalog records, the three VD logo/favicon assets, database migration and account-deletion function. Source hashes were captured before editing. No script accessed or modified actual browser user records.
- Exact logs are in `design-review/test-results.txt` and `design-review/static-checks.json`.

## Review and remaining limits

The local server could not bind: `PermissionError: [Errno 1] Operation not permitted`. Native browser review was also unreliable: the Chrome interaction was interrupted by a foreground application change and the separate Safari control attempt timed out. **No reliable desktop or mobile screenshots were obtained, and no rendered browser, real touch or screen-reader interaction is reported as verified.** The automated tests verify business logic and selected source contracts; they do not substitute for an end-to-end browser test.

For normal local preview, run `python3 server.py` from `web/` and open `http://localhost:4173` in your own browser. Review at phone, tablet and desktop widths, including the landing preview, vehicle switching, mileage/service forms, expanded history, expenses and explorer. Follow `VERIFICATION.md` for the remaining acceptance matrix.

`design-review/VenusDrive-offline-review.html` is also available for opening directly in a browser. It packages the actual UI source and catalog into a single review file to avoid needing a local server. The file deliberately disables cloud configuration and uses **separate review-only local-storage keys**. Its inline catalog provider supplies the same bundled catalog records instead of making a network request. It is a review aid, not a production build or proof of live networking, email, storage policy or cross-device behavior. Regenerate with `node scripts/build-offline-review.mjs` after source changes.

Supabase remains unconfigured, as before. Live authentication, email delivery, account/file isolation and multi-device synchronization still require connected credentials and acceptance testing. Android remains a later client stage. No paid services were activated, no site was published, no domain was connected, and no DNS records were changed.
