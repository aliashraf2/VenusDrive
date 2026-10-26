# VenusDrive continuation

Current implementation and verification are in `FIXES-REPORT.md` (26 October 2026). This update modifies the actual site in `public/`; it is not just a saved prompt.

Completed: mobile hidden/inert navigation with focus trap/Escape; consistent explorer search/selection; canonical reminder conversion with global/vehicle/task scopes; visible Add vehicle; public copy/imagery cleanup; public runtime Supabase config, auth contract improvements and read-only live-check harness; an original WebGL educational model with selectable component geometry and text/2D fallback. Existing catalog, approved logo and core rules were retained. No user data was reset.

Verification: 38 JavaScript tests, 2 Python config tests and 62 static checks pass. Logs and model coverage are in `design-review/`. Node is available here at `/Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node` even though it is not in shell PATH. Run `node --test tests/*.test.mjs`, `python3 tests/server_config_test.py`, `node scripts/check-static.mjs`, `node scripts/inspect-educational-model.mjs`, and `node scripts/build-offline-review.mjs` using that runtime path if necessary. Syntax-check all public modules and the review bundle after edits.

Outstanding user requirements:

1. **Realistic downloaded mechanical asset not delivered.** No candidate binary was downloaded/inspected. Current generic original parametric geometry is actual 3D but approximate and not a production car. `ASSET-RESEARCH.md` records candidates, access failures, all 16 groups and gaps. Do not describe exterior-only assets or listing metadata as verified internal coverage. Never use Spectral GT RS. No purchase authorized.
2. **Live Supabase not connected/tested.** No project URL/key or two real accounts were supplied. See `ACCOUNT-CONNECTION.md`. Existing SQL policies/RPC and private bucket still need execution and direct two-account isolation tests. Mocked contract tests are not proof of RLS or delivered emails. Explicit Refresh loads another session's snapshot; do not imply realtime sync.
3. **Rendered desktop/mobile checks and screenshots absent.** Local Python socket binding denied. Structured browser list empty; native Chrome changed active windows; separate Safari local-file dialog disabled Open and later lost its window. No real WebGL rendering, 390px overflow, touch/menu keyboard behavior or browser save interaction was verified. Try a stable authorized browser/local preview and follow `VERIFICATION.md`; fix issues found before claiming completion.

Keep changes reversible and preserve user data/local storage keys. Ask before deleting existing files/records, spending money or accepting paid services. Do not publish site/source, connect venusdrive.com or change DNS without explicit request. Android remains a later stage, not delivered by responsive web.
