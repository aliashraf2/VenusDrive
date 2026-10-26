# Connect real accounts

No Supabase project URL/key, administrator connection or two real test accounts were available in this session. No live authentication, email delivery, persistence or server-side isolation result is claimed. Local and demo storage stay separate; neither is a cloud account.

## User configuration required

1. Choose or create a Supabase project you control without selecting a paid plan or add-on. Review its current terms/limits yourself. No project was created here.
2. In that project's SQL editor, review and apply `supabase/migrations/001_initial.sql` to a new VenusDrive database. It creates owner-protected `account_data`, the revision-checked save RPC and private `receipts` bucket. Do not apply to an unrelated database. Review RLS/grants using the project's security tools.
3. Under Authentication, enable email/password and email confirmation. Set Site URL to `http://localhost:4173`. Allow redirects to `http://localhost:4173/`, `http://localhost:4173/#dashboard` and `http://localhost:4173/#recovery`. This client uses the client-side implicit callback flow. Do not change the production domain or DNS.
4. Obtain the public project URL and **publishable key** from project settings. In your Terminal, from this directory, run:

   ```sh
   export SUPABASE_URL='https://YOUR_PROJECT.supabase.co'
   export SUPABASE_PUBLISHABLE_KEY='YOUR_PUBLIC_PUBLISHABLE_KEY'
   python3 server.py
   ```

   Open `http://localhost:4173`. The server generates `/runtime-config.js` using only those public settings; it rejects a privileged key in that variable. Never use a service-role/secret key. Do not send secret credentials in chat. For a future static host, supply the equivalent public values in `public/runtime-config.js` through that host's build/configuration process. The offline review HTML intentionally disables cloud access.
5. Configure an email sender/SMTP service you already own if required to send to arbitrary users. Do not purchase one without approval. Check actual inboxes and delivery logs. A successful API response means the request was accepted, not that mail arrived. See [Supabase password authentication](https://supabase.com/docs/guides/auth/passwords), [redirect configuration](https://supabase.com/docs/guides/auth/redirect-urls) and [SMTP setup](https://supabase.com/docs/guides/auth/auth-smtp).
6. When ready, deploy `supabase/functions/delete-account` to that backend and set `APP_ORIGIN=http://localhost:4173`; keep JWT verification enabled. The server-only service credential belongs in the Supabase function environment, never client configuration. This function was prepared but not deployed or executed here. Account deletion requires a deliberate user action; no existing account was deleted.

## Acceptance test after connecting

Use two dedicated test accounts A/B and two independent browser profiles. Complete sign-up, received verification link, sign-in, sign-out, recovery email and password recovery yourself. Create a vehicle, settings, task, service and receipt in each account. Reload and verify persistence. Sign into A in a second profile, refresh, and confirm its actual saved records appear. Save in profile one, then attempt a stale save in profile two: expect conflict protection and preserved form input. Disconnect the network and confirm no success or synchronization message appears.

For each account, directly attempt the other owner's document and attachment read/write/delete with that account's bearer token. Also test unauthenticated requests. Hiding controls is not an ownership check. A forged `user_id` inside payload must not change the RPC's actual owner. Do not perform destructive checks against real records; use only explicitly disposable test data.

`scripts/check-live-accounts.mjs` provides **read-only** checks. Set `VENUSDRIVE_TEST_TOKEN_A` and `_B` in your local environment, plus the public project configuration above. Both accounts must already have saved rows. Optionally set `VENUSDRIVE_TEST_ATTACHMENT_A` and `_B` to their existing owner-prefixed receipt paths and `VENUSDRIVE_TEST_TOKEN_A_SECOND_SESSION` to a second A session. Run `node scripts/check-live-accounts.mjs`. It does not print tokens or alter records. Missing credentials/rows fail rather than reporting an empty test as a successful isolation check. It does not replace the write-denial, delivery, save and browser acceptance tests.

Cloud persistence uses one versioned document per account: vehicles, services, maintenance, settings and expenses share its ownership boundary. Attachments have separate private owner-folder policies. Sessions use tab-scoped sessionStorage. Cross-session updates load through explicit Refresh; no realtime/background sync is advertised. A later Android app must use this same backend and secure native token storage.
