# Repository Guidelines

## Project Structure & Module Organization

The website lives in `web/`. `web/public/` contains HTML, CSS, JavaScript ES modules, SVG branding in `assets/`, and the vehicle catalog in `data/`. Keep maintenance calculations in `core.js`, persistence adapters in `persistence.js`, educational content in `content.js`, and explorer geometry/rendering in their dedicated modules. `app.js` composes the interface.

Tests live in `web/tests/`; validation and import utilities live in `web/scripts/`. Supabase migrations and the account-deletion Edge Function live in `web/supabase/`. Read `web/README.md`, `FIXES-REPORT.md`, and `VERIFICATION.md` before changing behavior. Research outputs and generated review bundles are intentionally excluded from the website commit.

## Build, Test, and Development Commands

Run these commands from `web/`:

- `python3 server.py` — serve the site at `http://localhost:4173`.
- `npm test` — run JavaScript tests with Node 20+; equivalently, `node --test tests/*.test.mjs`.
- `python3 tests/server_config_test.py` — test public configuration safeguards.
- `node scripts/check-static.mjs` — check module references, configuration, and selected contrast ratios.
- `node scripts/inspect-educational-model.mjs` — regenerate the geometry coverage report.
- `node scripts/build-offline-review.mjs` — generate an isolated offline review aid.

Production source is buildless; the offline review bundle is not the deployed application.

## Coding Style & Naming Conventions

Use plain JavaScript ES modules and explicit relative imports. Prefer camelCase identifiers, kebab-case module filenames, two-space JavaScript indentation, and four-space Python indentation for new code. Avoid unrelated reformatting of existing compact modules. No formatter or lint tool is configured. Keep presentation, calculations, persistence, and content separate; avoid unnecessary dependencies.

## Testing Guidelines

JavaScript uses `node:test` and strict assertions; name tests `*.test.mjs`. Python configuration tests use `unittest`. Add behavior-focused regression tests for changed calculations, ownership boundaries, unit conversions, and selection state. No coverage percentage is enforced. Browser-check affected flows at desktop and 390px widths, including keyboard navigation and overflow; capture screenshots for visual changes. Report blocked checks explicitly.

## Commit & Pull Request Guidelines

Existing history uses imperative subjects, such as “Add VenusDrive website and verified implementation fixes”; no stricter convention is established. Keep commits focused. PRs should explain behavior changes, validation results, remaining limitations, related issues, and screenshots when applicable.

## Security & Data Preservation

Never commit credentials or environment files. Follow `web/ACCOUNT-CONNECTION.md` for Supabase setup. Preserve local/demo storage keys, historical records, catalog provenance, and asset notices. Do not claim live isolation, model accuracy, or browser behavior from mocked/static tests. Deployment, DNS changes, and paid services require explicit authorization.
