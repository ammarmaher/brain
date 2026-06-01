---
name: project_account_mgmt_bug_fixes_2026_05_29
description: "Account Management admin-console QA bug-fix session — 10 FE fix waves landed + build-green, plus verified-already-fixed/backend-flagged/blocked verdicts"
metadata: 
  node_type: memory
  type: project
  originSessionId: 38ebd9e8-721a-41ef-bbaf-169bfd310ef9
---

QA bug sheet `Account Mngmnt Module - Bugs.xlsx` tab "Admin Screens - New Design" (16 rows/~19 issues, 12 private Drive videos=403). Frontend-only fixes, NO COMMITS (working tree). Each bug = a wave (fixer agent + independent re-verification). Evidence bundle: `C:\Falcon\qa\runs\account-mgmt-bugs-2026-05-29\` (FINAL-SUMMARY.md, WAVE-LOG.md, FINDINGS.md, BUG-INVENTORY.md).

**Fixed (10 waves, all build-green):** BUG-08 nodeName()→accountName() parity (allow `'`/`-`/space/`&`); BUG-09 price 0 falsy-zero `@if(row.priceValue != null)`; BUG-10 loader `ringDirection:'cw'`; BUG-05 steps3&4 drop forbidden `grid h-full`→flex; BUG-13 node-type-aware roleOptionsForNode (acc-owner=main node only, admin+mgmt); BUG-12 fail-open in resolveRoleFlags (per user approval); BUG-14 surface backend msg + add normalUserLimitReached i18n; BUG-15 OTP timer markForCheck (zoneless) + 120→60s; BUG-06 step-5 uses rule-map (behavior-preserving, same ValidatorFn singletons); BUG-03 explicit [maxBytes]=1MB + persistent oversize error.

**Already-fixed (verified, no change):** BUG-02 (inline error+blocks Update, 2026-05-21), BUG-04b/07 (1-char rejected), BUG-04a-charset. QA videos predate Wave-F hardening (2026-05-21/24).

**Backend-flagged (NOT FE-fixable):** BUG-17 Commerce UpdateSettingsHandler lacks Falcon-root/null-owner PUT path; BUG-11 no live enum drift (5 copies agree) but no single SoT/trust-rank. BE defense-in-depth: BUG-13 (CreateUserProcess) + BUG-07 (min-len).

**Blocked:** BUG-16 Edit-User-V2 needs ADO story 120380 criteria (token lacks work-item scope).

KEY LESSONS: (1) `npx nx build <app>` WITHOUT `--skip-nx-cache` exited 1 on downstream graph tasks (`npm install` falcon-ui-core:install network + falcon-studio tsc) — environmental, NOT app code; `--skip-nx-cache` per-app = all green (admin-console/host-shell/management-console). Use `--skip-nx-cache` for clean FE build verdict. (2) admin-console/host-shell/mgmt DO build green (contradicts "FE blocked on compile errors" startup truth — that's the tsconfig.base moduleResolution typecheck artifact, not nx builds). (3) ADO REST: token via CredRead `git:https://t2development.visualstudio.com` works org-level (projects) but 401 on work-items (scope-limited) — can't read work items. NO COMMITS · 2026-05-29
