---
name: Night Shift — remaining work checklist
description: Outstanding Night Shift items for falcon-web-platform-ui after the 2026-05-18/19 run; answer here when asked "what is left from night shift"
type: project
originSessionId: 35b8c7d3-e5bb-4f95-a251-4d5abbc4b7d4
---
Night Shift Mode finished its main run on 2026-05-19 (Levels 1+2+3, all waves). Work paused at **~78% of full scope**. Workspace: `C:\Falcon\Falcon\falcon-web-platform-ui`, branch `polishing-v0.4`. Both apps build GREEN. **The 49-file changeset was uncommitted when the run stopped** — confirm whether it has since been committed before re-auditing.

**Why kept:** the user stopped Night Shift to start regular day work; this is the parked backlog to resume later.

**How to apply:** when the user asks "what is remaining from Night Shift" / "night shift backlog", answer from this list. Before quoting any item, re-verify against the live repo (lint counts, git state) since it may have changed.

## Remaining checklist (in priority order)

- [ ] **1. Commit the Night Shift changeset** — ~49 files uncommitted on `polishing-v0.4` (~5 min, user decision). Rollback path documented in `C:\Falcon\architecture-reports\night-shift\level-3-deep-cleaner\09_LEVEL_3_DEEP_CLEANER_REPORT.md`.
- [ ] **2. ESLint `argsIgnorePattern: '^_'`** — so underscore-prefixed unused params (`_event`, `_nodeId`) stop being flagged (~15 min).
- [ ] **3. Visual-verify the 7 migrated screens** — change-password, enter-otp, forgot-password-flow, get-started, login-layout, dashboard, layout. SCSS→Tailwind migration was a refactor; auth screens need eyeballing (~1–1.5 h). Known deltas to check: `100dvh`→`100vh` (mobile chrome), one warning-amber hue shift.
- [ ] **4. host-shell's 123 lint problems** — pre-existing debt revealed once the `nx lint host-shell` crash was fixed (~46 errors / ~77 warnings; much is `falcon-ui-showcase` demo-area debt). ~4–6 h; scoping to real app code (skipping showcase) cuts it to ~2 h.
- [ ] **5. 3 `@falcon/env` re-export boundary errors** — needs an architecture decision (promote environment to a library) then the refactor (~2–3 h, decision-gated).

## Estimates (as given to the user 2026-05-19)
- Progress: **~78%** of full Night Shift scope complete.
- Finish everything: **~8–11 h** (~6–8 h autonomous + ~2–3 h decision-gated).
- Practical finish (skip `falcon-ui-showcase` noise, defer env decision): **~3–4 h**, which would put progress at **~88%**.

## NOT a defect — leave as-is
3 cross-app `@host-shell/shared/*` imports of `OrganizationHierarchyTreeComponent` + `DoPaymentPriorityPopupComponent` in admin-console are the **intended architecture** (API-calling components live in host-shell; see `feedback_api_code_stays_in_host_app.md`). `enforce-module-boundaries` flags them but they must not be "fixed" by moving to a lib.

## Reference
Full reports: `C:\Falcon\architecture-reports\night-shift\` (Level 1+2) and `…\night-shift\level-3-deep-cleaner\` (Level 3). Run detail: `project_night_shift_host_admin_2026_05_18.md`.
