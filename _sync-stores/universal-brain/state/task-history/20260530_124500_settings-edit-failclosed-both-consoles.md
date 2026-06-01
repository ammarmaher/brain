# Task — Settings-tab Edit gate FAIL-CLOSED (both consoles) + live-PES verified

- **Date:** 2026-05-30
- **Status:** ✅ COMPLETED + build-green + **live-PES-verified** · NO COMMITS
- **Repo / branch:** `C:/Falcon/Falcon/falcon-web-platform-ui` · `polishing-v0.4`

## User ask
"Who can edit Settings? If a user can't edit, the Edit button shouldn't show. Implement for management-console + admin-console, make sure it works, use brain skills."

## Authority answer (who can edit) — brain-grounded
- `[CODE]` PES seed `Falcon/Falcon/Falcon/falcon-essentials/zitadel/pes-account-role-rules.json`; `[BRAIN-OUT]` `03-pes-keys/REGISTRY-RAW.md:41-44,79-84`; `[BRAIN-OUT]` PRD `prd/modules/01-account-management/WORKFLOWS.md:84-87` + `latest-prd.md:33-45`.
- **Management Console (Client editing own account):** **acc-owner = edit all 3** (Password Security / Allowed IPs / Account Limits); **acc-admin = DENY all 3**; **acc-user = DENY all 3** (+ can't reach the tab).
- **Admin Console (Falcon):** Password Security = **sys-admin only**; Allowed IPs = **sys-admin + sys-ops**; Account Quota = **sys-admin + sys-products**; Root pwd-security/IPs = **sys-admin only**.

## Bug → fix
`[CODE]` `settings-tab.signals.ts` (both consoles) had a fail-open guard: `failOpen = !editSecurity && !editAllowedIps && !editQuota; canEditX = failOpen ? true : !!f['editX']`. When ALL three PES edit flags were genuinely false (acc-admin/acc-user on mgmt; sys-ops/sys-products on the Falcon root in admin) it flipped them to **allow**, so the Edit button (`@if canEditSecurity||canEditAllowedIps||canEditQuota`, `org-hierarchy-page-menu.component.html:180`) showed → doomed 403 on Save.
**Fix = FAIL-CLOSED:** `canEditX = !!f['editX']` (strict PES). Mirrors the approved add-user-wizard gate (`[CODE]` add-user-wizard.component.ts:329 "never fails open"). acc-owner/sys-admin keep real `allow` flags → no-op for them.

## Verification — LIVE PES (real running stack, non-fabricated)
`POST http://localhost:7777/api/auth/login` (OTP off) → JWT. Batch `POST http://localhost:5296/pes/authorize/resources` (request shape from `[CODE]` access-control.client.ts + access-control.types.ts; subject `u:<jwt.sub>@test-tenant-001`):
- **accadmin** → `acc.account-password-security-level` / `acc.account-allowed-ips` / `acc.account-quota` edit = **false / false / false** ⇒ fail-closed ⇒ all `pesFlags` false ⇒ **Edit button HIDDEN**.
- **accowner** → **true / true / true** ⇒ Edit button shown (no regression).
- Build: `nx run-many --target=build --projects=management-console,admin-console --configuration=development --skip-nx-cache` → **EXIT 0**.

## Notes
- Running Docker `:4301` still serves the PRE-fix bundle; the fix is in the working tree (build-green + PES-proven). A visual click-through needs a rebuild/redeploy or `nx serve`.
- Paired with the earlier defense-in-depth fix (error popup now shows "Permission denied (HTTP 403)" + backend message) — see `20260530_121300_settings-edit-error-readable-backend-message.md`.
- 2 files changed. NO COMMITS.
