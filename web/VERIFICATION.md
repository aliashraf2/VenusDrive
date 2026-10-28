> Current implementation: [Static explorer delivery](STATIC-EXPLORER-DELIVERY.md). The older WebGL/model requirements and earlier check counts below are historical and superseded by that report.

# Verification record

## Fixes on 26 October 2026

The current checks and exact limitations are in `FIXES-REPORT.md` and `design-review/fixes-test-results.txt`. New tests exercise reminder conversion and scopes, search/selection consistency, generated geometry and picking, mocked managed-auth contracts, and a mocked navigation controller. Python tests exercise safe public runtime configuration. These are not rendered-browser or live-backend tests. The earlier record below is retained as historical evidence; its 26-test count and unchanged-persistence statement do not describe the current update.

## Earlier design upgrade

26 automated tests and 43 static checks pass after the Swiss / International update. See `DESIGN-UPGRADE.md` and `design-review/` for exact scope and logs. Core/persistence/backend/catalog/logo source files were hash-checked as unchanged. Desktop/mobile screenshots and rendered UI interaction remain unverified because the server socket was denied and native browser control was interrupted or timed out. The offline review aid is isolated from product storage and does not establish live-backend behavior.

## Performed in this task

- Node automated tests: core vehicle operations, unit conversion, mileage correction, calendar end-of-month handling, either-threshold behavior, unknown/partial history, EV applicability, service add/edit/delete recalculation, history preservation, multi-task visit cost counting, currency separation, duplicate prevention, reminder snooze/disable behavior, and CSV escaping.
- Adapter tests: persistence across store instances, separate demo/local namespaces, conflicting tab rejection, quota errors, malformed-data preservation, attachment size/type validation, and explicit rejection of unconfigured cloud authentication.
- Catalog/content tests: 15,599 rows, 57 makes, stable-ID uniqueness, dependent selectors, source provenance, aliases, battery distinction, mappings for every component, applicable layouts, guide connections, and generation of all seven illustration views.
- JavaScript syntax checks. Static source/link/config checks and color contrast checks are recorded by the validation script.

The local HTTP server failed to bind with `PermissionError: [Errno 1] Operation not permitted`. Browser UI behavior, mobile layouts, touch controls and visual contrast as rendered were not tested. Mathematical color ratios do not establish full accessibility.

## Required acceptance checks on a runnable local preview

1. Start with a clean local workspace. Add a vehicle using the dependent catalog selectors and a second using manual entry. Refresh. Switch vehicles and confirm their tasks/history remain separate. Edit fields and archive/restore a vehicle without losing records.
2. Update miles, switch display to kilometers and confirm the physical reading does not change. Reject negative/blank readings. Correct to a lower reading with a reason, then export and check the original mileage log still exists.
3. Configure a time-only, distance-only and combined task. Use a baseline that reaches each boundary independently. Confirm due explanations identify the actual baseline and either-threshold rule. Leave a baseline unknown and check the missing-history state.
4. Configure equipment-dependent tasks only after confirmation. Change a combustion vehicle to EV: combustion-only tasks should pause without erasing old services. Verify custom task behavior is clearly user-defined.
5. Save a single visit completing two tasks with one total and optional itemized costs. Check spending counts the visit once. Double-submit/retry it and confirm no duplicate. Edit and delete the visit and inspect the recalculated reminders. Change an interval and check the history remains unchanged.
6. Upload a real small JPG/PNG/PDF. Download it. Reject oversized or wrong-content files. Reach the local data limit and confirm no save-success message or silent data loss. Export JSON and CSV, including notes with commas, quotes and formula-like values.
7. Record USD and EUR expenses. Filter by vehicle, month, year, category and DIY/mechanic. Verify currencies are never summed together. Confirm the category uses the visit’s primary category and itemized costs do not double-count.
8. Change global and vehicle reminder advance settings in miles and kilometers; switch units and save unchanged values repeatedly without physical-distance drift. With the mobile menu closed, Tab must never reach its hidden links. Open it, verify focus trapping, close by Escape and confirm focus returns to the menu button. Search `xyznotapart` and confirm no old explanation or highlight remains. Change reminder advance settings; disable and snooze a task. Confirm in-app notification suppression while its due threshold remains unchanged. No email/push success should appear.
9. Search aliases, distinguish 12V from traction battery, use the accessible component list, select visible 3D meshes, orbit through camera views, zoom/reset, pinch and drag on a real touch device, change layouts and system filters, and use text alternative. Review every safety label and generic-location notice.
10. Navigate at 390 px, 768 px and desktop sizes; check for overflow, menu operation, readable forms, keyboard focus, modal escape/return focus, and reduced-motion preferences. Test catalog/explorer asset failures and retry recovery. Examine browser console/CSP errors.
11. Review `/logo-review.html` against the approved reference. Confirm favicon, product name, metadata and canonical domain are consistent.

## Required live Supabase checks — NOT performed

- Sign-up, verification delivery/link return, sign-in, sign-out, recovery delivery and password update. Try an expired and invalid session. Verify delivery in the configured provider’s logs, not merely an accepted request.
- Two accounts A/B: after each saves data, send direct requests using A’s token for B’s `account_data.user_id` and B’s private object path. Row read should yield no B data; file read/write/delete must be denied. An unauthenticated request must fail. Test the RPC with a forged user ID in payload; it must still write only the caller’s account row.
- Two browsers/devices on account A: refresh both, save on one, attempt a stale save on the other. Confirm the stale save is rejected and unsaved form input stays present. Refresh and verify shared values. Disconnect network and ensure save failure does not simulate sync or clear forms.
- Upload receipts and vehicle photos, sign out, and confirm their URLs are inaccessible without the owner’s authenticated token. Verify export includes files. Delete a test account and verify authentication, document and files are removed. Exercise file-cleanup failures and retry.
- Apply migration to a disposable project, test payload constraints, and review database grants/RLS with Supabase’s security tools. SQL and Edge Function deployment/execution were not tested in this task.

## Not delivered in this website stage

Android/iPhone clients, cross-client live verification, email/push reminders, licensed manufacturer schedules/parts fitment, background offline synchronization, realtime collaborative editing, vehicle-specific diagrams and production hosting/domain connection.
