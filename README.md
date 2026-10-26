# VenusDrive

Responsive vehicle-maintenance website. The application, tests, backend preparation and setup instructions live in [`web/`](web/README.md).

```sh
cd web
python3 server.py
```

Open http://localhost:4173. Use Node 20+ for `node --test tests/*.test.mjs`.

See [implementation status](web/FIXES-REPORT.md), [account configuration](web/ACCOUNT-CONNECTION.md), [3D asset evaluation](web/ASSET-RESEARCH.md), and [verification requirements](web/VERIFICATION.md). Cloud accounts require your own Supabase connection. The current 3D geometry is an original approximate educational prototype; the downloaded realistic mechanical model remains outstanding.

Original reference images, source archives, research output workbooks and generated offline review bundles are kept out of the website source commit. No website deployment, domain connection or DNS change is implied by publishing this repository.
