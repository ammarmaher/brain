*** Task B — Real-auth Interactive Test Pass — BLOCKED ***

## Status

**BLOCKED — no seeded portal-login credentials available.**

Per the user's explicit instruction in the brief:

> If Plan A creds are not findable after thorough grep, STOP Task B and document it as BLOCKED with the exact creds needed — do NOT reapply the Plan B dev bypass.

The Plan B `?visual-test=1` bypass is for visual capture only; running the 10 interactive tests through a fake guard would produce false positives, so the bypass was NOT re-applied.

## Search performed (Plan A)

The following workspaces were searched for seeded admin-console / org-hierarchy test users:

- `C:\Falcon\Falcon\falcon-web-platform-ui` — entire workspace including `apps/`, `libs/`, all JSON / YAML / env files
- `C:\Falcon\Falcon\falcon-core-identity-svc` — Identity Service repo (Zitadel-backed)
- `C:\Falcon\Brain Outputs\understanding` — Brain knowledge tree
- `C:\Falcon\Brain Outputs\reports` — all prior night-shift reports
- `C:\falcon\` and `C:\Falcon\` — searched for `falcon-essentials` directory
- `C:\Falcon` and `C:\falcon` — `docker-compose*.yml`, `.env*`, `zitadel*.json`

### Grep patterns used

- `password`, `Pass@`, `P@ssw0rd`
- `seed`, `test-user`, `dev-user`
- `admin@`, `falcon@`, `falconhub`
- `zitadel.*seed`, `SEED_USER`, `SEEDED_USER`
- `portal.*login`, `loginUser`, `TestCredentials`

## Findings

1. **`falcon-essentials` directory does NOT exist** at `C:\falcon` or `C:\Falcon`. The repo expected by the brief is not present on this machine.
2. **No `.env*` files** in `falcon-web-platform-ui`.
3. **No Zitadel seed JSON** anywhere on disk.
4. **Only credential hit:** `falcon-core-identity-svc/tests/Falcon.Identity.Tests/appsettings.Test.json` contains `j.lababneh@t2.sa` / `P@ssw0rdP@ssw0rdP@ssw0rd` — but this is a **third-party SMS-service** credential (RiCH service for OTP delivery), not a Zitadel/portal login.
5. **`@t2.sa` emails in `02-react-source-discovery.md`** are **mock data** in the React SoT — `thamer@t2.sa`, `anas@t2.sa`, etc. — not real seeded users in any backend.

## Exact creds needed to unblock Task B

To unblock real-auth Plan A, the operator needs ONE of:

1. **A seeded Zitadel user** with `admin-console` + `org-hierarchy:read|write` permissions, exposed via:
   - `falcon-essentials/docker-compose.yml` with `zitadel-seed` service that pre-creates the user, OR
   - A shared dev account documented in a place an AI agent can grep (e.g. `Brain Outputs/credentials/dev-test-user.md`, gitignored)

2. **A short-lived Zitadel personal access token** (PAT) for an admin user — the destination's `AuthService` would need a manual `sessionStorage.setItem('access_token', '<PAT>')` injection path for E2E. This is not currently supported.

3. **A signed-in browser session** the operator hands to the agent — open Chrome at `http://localhost:4200/#/admin-console/org-hierarchy-page` already logged in, then the agent connects to that tab via the claude-in-chrome MCP. **Recommended path.**

## Items blocked

The following items from the brief cannot be executed without auth:

1. **Falcon Eyes re-capture for the P3-affected sections** — the new `hierarchy.users.emptyTitle/emptyBody` strings only render when the users table is in empty state with REAL data, and the paginator default = 20 only manifests in the dropdown once the table is populated. Both require a logged-in session.
2. **All 10 deferred interactive tests:**
   - tab switching, header hover/active states
   - toggles in comm-channels table cells
   - row actions menus
   - org info uploader interaction
   - OTP popup: zeros pass, non-zero fails
   - status/role dropdowns
   - permissions dropdown/checkboxes
   - settings view↔edit mode toggle
   - dashed Add IP button + IPv4/IPv6 valid + invalid error + Enter to add + Clear/Cancel + chip delete + delete-confirm popup
   - account limitation increment/decrement

## Items still completable in this session

- Task A — 4 P3 polish fixes (i18n keys + paginator default + status-badge token verify) — **DONE**
- Task A — `nx build admin-console` — **GREEN** (hash `439d98a8dd333f51`)
- Task C — PDF generation (uses static screenshots from the prior Round 1 run) — **PROCEEDING**

## Next operator action

Either:
- (a) hand the agent a signed-in browser at `http://localhost:4200/#/admin-console/org-hierarchy-page` and re-trigger Task B, OR
- (b) drop a dev-test-user JSON at `Brain Outputs/credentials/dev-test-user.md` and re-trigger Task B, OR
- (c) accept the current 96.5% parity and defer interactive tests to a backend-stack session.
