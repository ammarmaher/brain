---
ruleId: R-FE-009
ruleName: Feature folder structure — one file per type-folder
severity: should
violationCount: 9
estimatedEffort: small
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
---

## 1. Rule restatement (1 sentence)

Every feature folder's type-subfolders (`models/`, `services/`, `resolvers/`, `directives/`, `tokens/`) must contain exactly ONE file named after the folder in plural form (`models/models.ts`, `services/services.ts`, etc.), OR (services only) a single `<feature>-service.ts` — splitting across multiple files is forbidden unless the consolidated equivalent exceeds ~500 lines.

## 2. What we found (counts + top 5 offender files)

Structural sweep on `C:\Falcon\Falcon\falcon-web-platform-ui\apps`:

| Pattern | Hits |
|---|---|
| `services/<feature>.service.ts` (dot not dash) | 5 |
| `models/<feature>.models.ts` (dot not dash) | 4 |
| `services/<feature>-service.ts` (correct alt form) | 0 |
| `services/services.ts` (canonical) | 0 |
| `models/models.ts` (canonical) | 0 |

Total violations: **9 files using the `<feature>.<type>.ts` (dot-separated) naming instead of canonical `<type>/<type>.ts` or `<type>/<feature>-<type>.ts`.**

Top 5 offender files:

1. `apps/host-shell/src/app/features/auth/change-password/services/change-password.service.ts`
2. `apps/host-shell/src/app/features/auth/change-password/models/change-password.models.ts`
3. `apps/host-shell/src/app/features/auth/enter-otp/services/otp.service.ts`
4. `apps/host-shell/src/app/features/auth/enter-otp/models/otp.models.ts`
5. `apps/host-shell/src/app/features/auth/get-started/services/login.service.ts`

(Remaining 4 follow the same pattern in `forgot-password-flow` and `enter-otp`.)

Per app:
- admin-console: 0 violations (org-hierarchy-page family uses a different folder pattern — `components/` based — which the rule scope doesn't strictly mandate)
- host-shell: 9 violations (all in `features/auth/*/`)
- management-console: 0 violations

Notable: the rule's `<feature>-service.ts` alternative (dash, not dot) is *also* not in use anywhere. Every existing service file uses `<feature>.service.ts` (Angular CLI default), which violates the rule.

## 3. Why this matters (the architectural cost of leaving it)

Per `feedback_folder_structure_pattern`: predictable navigation, fewer imports (one barrel per type-slice), forced cohesion. The current `auth/change-password/services/change-password.service.ts` works fine — but the moment a second service joins (`change-password-validation.service.ts`?), the convention forks. The whole point of the rule is to prevent that fork before it happens.

Severity is `should`, not `must`, so this is hygiene work. But the 9 hits all sit in the auth flow which is also being rewritten under R-FE-002 (SCSS purge) — combine the passes and the cost amortizes to near-zero.

## 4. Fix plan — concrete steps the morning agent should follow

- **Step 1 — Decide the canonical form per feature.** For each of the 5 auth features:
  - If there's exactly ONE service file → use `<feature>-service.ts` (dash form). Rename: `change-password.service.ts` → `change-password-service.ts`.
  - If there are 2+ service files → use `services.ts` (single consolidated file).
  - Same logic for `<feature>.models.ts` → `models.ts` (or `<feature>-models.ts`).

  Per the audit, every auth feature has exactly one of each, so the dash form applies uniformly.

- **Step 2 — Rename the 9 files.**
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\features\auth
  git mv change-password/services/change-password.service.ts  change-password/services/change-password-service.ts
  git mv change-password/models/change-password.models.ts      change-password/models/change-password-models.ts
  git mv enter-otp/services/otp.service.ts                     enter-otp/services/otp-service.ts
  git mv enter-otp/models/otp.models.ts                        enter-otp/models/otp-models.ts
  git mv get-started/services/login.service.ts                 get-started/services/login-service.ts
  git mv get-started/models/login.models.ts                    get-started/models/login-models.ts
  git mv forgot-password-flow/services/forgot-password-flow.service.ts forgot-password-flow/services/forgot-password-flow-service.ts
  git mv forgot-password-flow/models/forgot-password-flow.models.ts    forgot-password-flow/models/forgot-password-flow-models.ts
  git mv services/auth-flow-state.service.ts                   services/auth-flow-state-service.ts
  ```

- **Step 3 — Update every import path.** Grep + sed:
  ```
  rg -l 'change-password\.service' apps libs | ForEach-Object { (Get-Content $_) -replace 'change-password\.service', 'change-password-service' | Set-Content $_ }
  ```
  Repeat for each rename.

- **Step 4 — Add or refresh `index.ts` barrels per feature.**
  ```
  // apps/host-shell/src/app/features/auth/change-password/index.ts
  export * from './services/change-password-service';
  export * from './models/change-password-models';
  ```

- **Step 5 — Build verification.** `nx build host-shell --configuration=development` must exit 0.

- **Step 6 — Re-run detector.**

## 5. Estimated effort + complexity rationale

**small** — 9 file renames + import-path find-replace + barrel creation. Fully mechanical. Risk is broken import paths; mitigated by `nx build` after each rename batch. Realistic: 1–2 hours.

Alternative: if the agent prefers `services.ts` (single-file form) it's still 9 renames but additionally consolidates content into one file. That's medium effort and probably not worth it for the auth flow's 5 features.

## 6. Rollback hint (how to undo if the fix is wrong)

`git reset --hard HEAD~1` undoes the rename commit. If an import was missed and `nx build` fails, the error message names the unresolved module — fix the import path and re-run. Renames are pure mechanical; rollback is clean.

## 7. Verification (how to confirm the fix worked)

- run command:
  ```
  cd C:\Falcon\Falcon\falcon-web-platform-ui
  # Should match zero
  Get-ChildItem -Recurse -File apps/host-shell/src/app/features -Include *.service.ts,*.models.ts |
    Where-Object { $_.Name -match '\.(service|models)\.ts$' } |
    Measure-Object | Select-Object -ExpandProperty Count
  UV_THREADPOOL_SIZE=128 npx nx build host-shell --configuration=development
  ```
- expected output:
  - Count: `0`
  - Build: exit code 0

## 8. Risk flags (anything that could break)

- **Angular CLI generates `<name>.service.ts` by default.** If you generate a new service via `ng g s` after this fix, you'll re-introduce a violation. Add a lint or pre-commit hook to catch.
- **Webpack module federation imports** in `webpack.config.ts` may use absolute paths to renamed files. Check `apps/host-shell/webpack.config.ts` for explicit references.
- **VSCode "Go to Definition"** caches paths — after the rename, restart the TS server (or VSCode) or it returns stale results.
- **`*.spec.ts` test files** colocated next to renamed files may need their import paths updated too. The `rg -l` step in the fix plan covers this.

## 9. Related rules (other rules that might overlap with this fix)

- **R-FE-010** — paired clean-code convention from same author; both rules originated from `feedback_folder_structure_pattern` + `feedback_comment_style`
- **R-FE-011** — paired clean-code convention; folder structure that supports cohesion
- **R-FE-002** — same auth flow is being rewritten for SCSS purge; combine passes
- **R-FE-012** — build must stay green after each rename batch
