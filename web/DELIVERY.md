# Website stage delivery

The source is in `web/public/`. Start it with `python3 server.py` from `web/`, then open `http://localhost:4173`. It is not published.

Implemented: responsive landing/workspace, multiple vehicles and manual/catalog entry, mileage logs and explicit corrections, maintenance intervals and explanations, service visits with multiple tasks and attachments, history editing/deletion, actual expenses with separate currencies, in-app reminder settings/snoozing, data/CSV export, separate demo, educational parts/guides and a lazy-loaded multi-angle car explorer. Prepared Supabase auth, private-data adapter, ownership policies, version checks, private attachment policies and account-deletion function.

Coverage: 15,599 supplied catalog rows, 57 brands, collected years 1984–2027. No inferred engines, manufacturer schedules or replacement-part fitment. 25 introductory components across 17 systems, eight guides and seven explorer angles. RockAuto data has not been integrated because reuse and sample compatibility remain unresolved.

Checks: **18 automated tests passed**, **33 static checks passed**, all public JavaScript syntax checks passed. Essential color-pair contrast calculations range from 5.65:1 to 14.85:1. The logo SVG was rendered for visual review. Browser/device interaction and live Supabase tests were not performed: this environment denied the preview server’s socket bind with Operation not permitted, and no backend credentials are configured. See `VERIFICATION.md` for the required acceptance checks. This is not a verified production-ready deployment.

Explorer format: original generic multi-angle SVG illustration, **not true 3D**. Includes part search/aliases, approximate highlighted regions, seven discrete views, zoom, reset, touch-swipe handler, hotspots, layout variants and accessible text navigation. All remain subject to browser/device validation.

Required connections: a Supabase project with public URL/publishable key, the migration applied, email confirmation enabled, a configured sender/SMTP account for dependable verification/recovery, and the account-deletion function deployed with its origin configured. Do not place service-role or email secrets in client files. No provider account or paid service was created. Cloud screens explicitly explain missing setup; local storage never claims account synchronization.

Remaining: review the VD recreation, run browser/accessibility/device checks, run two-account authorization/file-isolation and recovery/delivery checks against Supabase, verify multi-device conflict handling, select a website host, and complete production security/operational review including receipt cleanup and scanning. Cloud saves use refreshable snapshots rather than background realtime sync. Android is the next client stage; no native app has been delivered in this website stage.

`README.md` contains setup, content-import, integration/license and domain instructions. Hosting provider is unselected. Provider-specific DNS targets cannot be supplied until it is chosen. Apex `venusdrive.com` is the canonical configuration; HTTPS, apex/www redirects and auth callback origins must be tested after authorized host configuration. **Publication, custom-domain connection and DNS changes remain pending explicit approval.**
