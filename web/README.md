# VenusDrive website

Current delivery and verification limits are in [`STATIC-EXPLORER-DELIVERY.md`](STATIC-EXPLORER-DELIVERY.md). Account connection steps are in `ACCOUNT-CONNECTION.md`. Older redesign/model records are historical.

The current visual system is a bright showroom landing page and static image-based learning interface, built on the existing light theme. The hero uses a compact 40/60 split with left-aligned text and a full-vehicle silver sedan image; mobile stacks text, buttons and car. The learning section uses selectable icon tabs and three matching static cutaways, with a blue button leading to the selected category. The actual public site remains in `public/`; `design-review/VenusDrive-offline-review.html` is an optional self-contained review aid with separate review-only storage and no cloud connection.

Responsive website first. Android is a later client, not delivered by this website. Nothing has been published and no domain/DNS settings have been changed.

## Run locally

From this directory, run `python3 server.py`, then open **http://localhost:4173**. This serves only `public/`, not research files or backend functions. No installation is needed for the website. Use Node 20+ to run `node --test tests/*.test.mjs`.

This task environment denied binding the local server socket. Run the command in your own Terminal. Browser interaction, layout, touch and live backend checks still need to be completed there. The implementation does not treat those checks as passed.

## Delivered workflow

- Landing page and responsive workspace, navigation and modal forms.
- Separate browser-local and demo workspaces. Local means this browser only, with no account or device sync.
- Multiple vehicles, catalog or manual selection, editing, archival, configuration qualifiers, optional VIN/photo, explicit mileage correction history and physical distance conversion between miles and kilometers.
- User-defined and general intervals with optional time and mileage thresholds. No bundled manufacturer schedules. Unknown baselines remain unknown. Equipment-dependent tasks need confirmation; EVs exclude combustion oil, intake-filter, spark-plug and timing-belt tasks.
- Service visit creation, editing, deletion, multiple completed tasks, DIY/mechanic, shop, parts notes, total and optional itemized costs, private cloud or browser-local receipt attachments.
- Dashboard, due explanations, actual spending, currency separation, expense grouping/filters, reminder preferences, snoozing and CSV/data export.
- 27 introductory components in five explorer categories, eight guides, source links and alias search. The static image explorer has 28 separate component images, matching thumbnails, five educational sections, image failure/retry, search plus category filtering, and a dedicated mobile detail view with Back. There is no rotatable model or geometry requirement.
- Managed account client: sign-up, sign-in, verification callback, recovery, password update, sign-out, optimistic revision checks, account export and account-deletion function. These require Supabase configuration and have not been live-tested.

## Important limitations

- Cloud accounts, email verification/recovery delivery, private storage and shared persistence are **not operational until you connect a Supabase project**. No provider account has been created. No paid service was activated.
- Cloud is a revision-checked saved snapshot. Refresh loads the latest other-device data; it is not realtime background sync. A conflicting save is rejected, with the form preserved. There is no offline cloud write queue.
- Browser-local attachments are base64 inside the workspace. Each file must be JPG/PNG/PDF, under 1 MB, with a matching signature. Serialized local data is capped at 4 MB. Local browser storage is not a substitute for private accounts. Export before clearing storage. Cloud documents are capped at 8 MB in this first version.
- Cloud files use a private bucket. Downloads are included in the JSON account export. If file cleanup fails after a service save/delete, the UI reports that separately. Periodic orphan cleanup and production malware scanning remain production work.
- Expenses use the service total once. Category charts assign the full visit total to its chosen primary category; itemized lines are explanatory allocations inside that total. No exchange-rate conversion is performed. The offered currencies use two decimal places.
- No diagnosis, replacement recommendation from a catalog listing, verified manufacturer schedule, exact 3D vehicle model, or replacement-parts compatibility engine is included.
- Unknown powertrain vehicles can track universal or explicitly confirmed tasks; identify the powertrain before configuring combustion-specific templates. Custom tasks are user-defined.
- Demo maintenance intervals are examples, not recommendations. Changing a vehicle to EV pauses previously configured combustion tasks without deleting its history.
- Android, iPhone, email reminders, push notifications, household sharing, administrative UI and vehicle-specific diagrams are not implemented. No fictitious account screens for a local account system exist: cloud screens are clearly gated by configuration.

## Structure

`public/config.js` owns name, tagline, domain, logo and public backend settings. `style.css` owns design tokens and typography. `core.js` is dependency-free maintenance/service/expense logic for reuse by a later Android client or shared-package wrapper. `persistence.js` separates local and Supabase adapters. `catalog.js` provides the replaceable catalog interface. `content.js` owns educational content; `component-data.js` owns category and image metadata; `component-detail.js` renders shared detail content; `explorer.js` is loaded only on its route. `app.js` composes the UI. Supabase migration and account-deletion function live under `supabase/`.

The initial backend uses one versioned JSON document per user to keep cross-feature updates atomic without complex infrastructure. Other users cannot select that document through RLS, and writes derive the owner from the authenticated token. This is a first-version contract, not a large-fleet analytics schema. Normalize into vehicle/service tables with a migration when document size, concurrent editing or reporting warrants it, retaining record IDs and original history.

## Connect Supabase

1. Create or choose a Supabase project that you control. Review its current free-tier limits and select no paid plan or add-on without approval. Project creation is intentionally left to you.
2. Apply `supabase/migrations/001_initial.sql` in a new project using its SQL editor or your normal Supabase CLI migration workflow. It creates the versioned account document, owner-only read policy, revision-checked write RPC, and private `receipts` bucket with owner-folder policies. Do not apply it to unrelated applications without review.
3. In Authentication, enable email/password and **Confirm email**. Set allowed redirect URLs to the local preview origin initially. Configure a sender and SMTP provider you own before relying on delivery to arbitrary users. No email provider was subscribed or configured. Check provider restrictions and logs; an accepted request does not prove an email was delivered.
4. Follow `ACCOUNT-CONNECTION.md`: set `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in the local server environment, or supply those public values in `public/runtime-config.js` on a future static host. These are public configuration, not authorization secrets. Never add the service-role key, SMTP password, or admin credential to client files. The adapter accepts standard `https://<project>.supabase.co` origins. Custom backend domains need a deliberate config/CSP change.
5. Deploy `supabase/functions/delete-account` through your normal Supabase tooling once authorized. Keep Supabase JWT verification enabled, and set its `APP_ORIGIN` to the client origin. The function verifies the caller against Supabase Auth, removes only that user’s files, then deletes that user. Supabase supplies the server-only URL and service-role secret to the function environment. Failed cleanup keeps the account and reports failure.
6. Test the acceptance matrix in `VERIFICATION.md` with two real disposable test accounts before production use. No live identity or isolation test has been performed here. Test authorization by using each account token against the other’s row and file path, not just by hiding UI controls.
7. Sessions live in tab-scoped sessionStorage; the provider issues and refreshes the tokens. No custom password storage exists. Serve over HTTPS in production. Preserve the supplied CSP, avoid third-party scripts, and review session/token security before launch. A later Android client must use secure platform credential storage and the same Supabase project.

Official references: [Auth](https://supabase.com/docs/guides/auth), [password flows](https://supabase.com/docs/guides/auth/passwords), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security), [private storage policies](https://supabase.com/docs/guides/storage/security/access-control).

## Catalog and content updates

The supplied ZIP contains 15,599 model-year rows, 57 brands and collected years 1984–2027. Schema: `make`, `year`, `model`, nullable `nhtsa_model_id`, `vehicle_types_across_make`, `source_url`, `retrieved`. `scripts/import_catalog.py` validates the source and derives stable IDs without inferring configuration. Run it only on a reviewed, permitted input. Existing vehicles retain their names and provenance even if the source catalog changes. Read `public/data/catalog-README.txt` for the source's exclusions, NHTSA/EPA precedence, earlier-year and coverage gaps. This is not all historical vehicles.

Production catalog/content updates must go through a reviewed source change and authorized deployment. No public administrative write endpoint is exposed. Add components in `content.js`, mappings in `locations.js`, and run the content tests. Guides are original short summaries with links supporting the relevant care topics; manufacturer-specific instructions and maintenance schedules require separately verified sources. Preserve source dates and conditions when adding those.

RockAuto research remains in the parent project. Its reuse permission and sample fitment are unresolved. None of those collected listings have been imported into the product. Manual parts-used entry and links to supporting sources remain available. Do not convert educational component names into fitment claims.

## Assets and branding

`assets/vd.svg`, `vd-white.svg` and `favicon.svg` are original scalable recreations from your supplied monogram reference. They are not the whole presentation board or a claim of exact tracing. Open `/logo-review.html` for review. Showroom and component images are original generated assets, with provenance and prompt records in their asset README files and `design-review/static-explorer/image-generation/`. A separate static cutaway supports the learning section. Legacy geometry was removed; no external 3D model is required or integrated. Public navigation no longer links to the logo review. Typography uses system fonts. No CDN JavaScript or separately billed API is used.

## Deployment and venusdrive.com — pending

No hosting provider or production Site has been created/configured, so provider-specific DNS targets are intentionally not invented. Supabase is the selected backend, not the chosen website host. This is a portable static website: a future authorized host serves `public/` and uses `index.html` at `/`; routes use fragments, so server-side route rewrites are not required. Copy security headers from `server.py` into that provider’s configuration, and configure its preview origin in Supabase Auth.

After explicit publication approval and host selection: verify the full acceptance matrix on its preview, upload the static files, enable HTTPS, add `venusdrive.com` through that host’s domain workflow, and use only the exact records it provides. Choose apex as canonical, redirect `www.venusdrive.com` to apex with a permanent redirect while preserving path/query, and ensure both names have valid TLS certificates. Set Supabase Site URL/redirect allowlist and the deletion function origin to the approved HTTPS origin. Confirm canonical metadata matches `BRAND.domain`, remove temporary preview redirect URLs, and test verification/recovery callbacks. Keep provider/database credentials server-side. **Do not perform any of these publication or DNS steps without explicit approval.**
