---
name: Night Shift host/admin run 2026-05-18
description: Night Shift Mode controlled-autopilot run over Host Shell + Admin Console + shared libs; 7 safe fixes, reports, governance findings
type: project
originSessionId: 35b8c7d3-e5bb-4f95-a251-4d5abbc4b7d4
---
Falcon Night Shift Mode ran in controlled autopilot (Level 1 audit + Level 2 safe-fix; Level 3 NOT run) over `C:\Falcon\Falcon\falcon-web-platform-ui` (branch `polishing-v0.4`), scope = Host Shell + Admin Console + shared libs. Management Console excluded by request.

**Why:** scheduled overnight structure/security/warning/Tailwind/config governance pass.

**How to apply:** when resuming Night Shift or auditing host/admin health, read the 5 reports at `C:\Falcon\architecture-reports\night-shift\` (00_BEFORE, 01_AUDIT, 02_FIX_PLAN, 08_AFTER, 09_NIGHT_SHIFT_REPORT) before re-auditing — they list every deferred item with reasons.

**Result (Level 1+2):** overall health 75 → 76. 7 safe fixes across 8 files: 3 `no-useless-escape`, 2 unused-symbol removals, 4-interface extraction → `dashboard/models/`, 3-interface extraction → `sidebar/models/`, dead `@let` removal in `falcon-studio` `loader-studio.component.html` (cleared NG8112).

**Result (Level 3 Multi-Agent Deep Cleaner, 2026-05-19):** overall health 76 → 79. Reports at `architecture-reports/night-shift/level-3-deep-cleaner/`. 17 files modified + 1 dead file deleted (`translate.initializer.ts`). admin-console lint 44 → 23 problems. Fixes: 5 `no-output-native` output renames (`cancel`→`cancelled`, `submit`→`submitted` on drawer + 2 wizards, all consumers in `org-hierarchy-page-menu.component.html` updated), 1 `no-input-rename` (`falcon-native-input` `@Input('disabled')` → plain `disabled`), 9 `label-has-associated-control` (6 caption `<label>`→`<span>`, 3 radio-wrapping via admin-console `eslint.config.mjs` `controlComponents:['falcon-angular-radio']`), 5 `no-non-null-assertion` (`isUsableImageSrc` made a type predicate + optional chaining), 8 junk comments + 4 commented-out code blocks removed. Both apps build GREEN. No commit/push.

**Result (Level 3 Wave 2 — Boundary Refactor, 2026-05-19):** overall health 79 → 81. 3 of 4 host-shell shared components promoted to `libs/falcon/src/shared-features/`: `organization-hierarchy-tree`, `org-node-avatar`, `falcon-brand-logo` — new tsconfig aliases `@falcon/organization-hierarchy-tree`, `@falcon/org-node-avatar`, `@falcon/falcon-brand-logo`. Compatibility shims (`export * from '@falcon/...'`) left at old `apps/host-shell/.../shared-components/*/index.ts` so Management Console keeps working untouched (MC also consumes these). The moved components' `@falcon` imports repointed to relative `../../index` to avoid within-lib self-alias. admin-console lint 23 → 16. Both apps build GREEN.

**Result (Level 3 Wave 3 — parallel multi-agent finish, 2026-05-19):** overall health 81 → 83. 3 specialist agents ran in parallel on disjoint file sets. (1) `do-payment-priority-popup` made env-agnostic via `InjectionToken DO_PAYMENT_POLLING_CONFIG` (host-shell app.config provides from `environment.orderStatus`, admin uses default), promoted to `libs/falcon/src/shared-features/do-payment-priority-popup/`, alias `@falcon/do-payment-priority-popup`, shim left for MC → 2 boundary errors gone. (2) 7 host-shell SCSS files (auth + dashboard + layout) migrated to Tailwind — ~2,449→~311 authored SCSS lines (−87%), each trimmed to a small justified residual (keyframes/scrollbar/ng-deep/placeholder/calc). (3) 3 webpack-config boundary errors + the `nx lint host-shell` ENOENT crash fixed via scoped ESLint overrides (`webpack*.config.ts` + `tests/**`). Both apps build GREEN.

**Final cumulative state (all 3 levels):** `nx lint admin-console` **49 → 11** (3 errors = intentional `@falcon/env` re-exports, 8 warnings). `nx lint host-shell` — crash FIXED, now runs and reveals **123 pre-existing problems** (mostly `falcon-ui-showcase` boundary + selector debt — newly *revealed*, not created; the crash had masked them). All 4 cross-app shared components now in `libs/falcon`. Both apps build GREEN. No commit/push.

**Recommended follow-ups:** host-shell's 123 now-visible lint issues; visual verification of the 7 migrated auth/dashboard/layout screens; the 3 intentional `@falcon/env` re-export boundary errors (env-as-lib decision).

**Key standing facts discovered:**
- `nx lint host-shell` CRASHES (ENOENT) — pre-existing `@nx/eslint-plugin` `enforce-module-boundaries` autofix reads the tsconfig glob alias `@falcon/ui-core/angular/*` as a literal path. Tooling bug, not code. host-shell build is GREEN regardless.
- `nx lint admin-console` = 44 problems after fixes (was 49). Bulk are intentional: 10 cross-app `@host-shell/shared/*` boundary imports (documented SSOT architecture — Level 3 to fix), 9 `label-has-associated-control` (rule doesn't see Falcon custom components as controls), 5 `no-output-native`.
- Notification governance is healthy: centralized `ResponseInterceptor` + `FalconHttpUiDispatcherService` + `core/http-ui/falcon-http-ui.config.ts`. Toast duration centralized at 12000ms.
- Unsafe-changes governance present: `org-hierarchy-page.can-deactivate.guard.ts` + dirty signals.
- Neither app has a `configuration/` folder; config lives distributed in `falcon-http-ui.config.ts`.
- 8 host-shell SCSS files (2,449 lines, auth + dashboard + layout) remain un-migrated to Tailwind — top recommended next task.
- Security audit clean: no hardcoded secrets; tokens in sessionStorage; one controlled `bypassSecurityTrustHtml` in showcase docs panel.
