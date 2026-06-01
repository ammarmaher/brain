---
name: Folder-structure audit 2026-05-17
description: Read-only architecture audit of falcon-web-platform-ui — 8 reports at C:\Falcon\architecture-reports\folder-structure-audit\
type: project
originSessionId: b75c62a9-8230-4966-9c8d-ff61c990ed39
---
🟢 LANDED 2026-05-17 (read-only audit pass). Eight Markdown reports at `C:\Falcon\architecture-reports\folder-structure-audit\`: CURRENT_STRUCTURE (2,780 lines workspace-wide total). Scanned `C:\Falcon\Falcon\falcon-web-platform-ui` — 17 Nx projects (3 apps + 9 libs + 4 meta), Angular 21.2.9, Nx 22.7.1, zoneless, **zero PrimeNG**. 

**Two HIGH-risk findings to fix in ONE PR before anything else:** (1) `adminConsoleGuard` is COMMENTED OUT on `apps/admin-console/src/app/app.routes.ts:7` — admin remote has no PES gate. (2) Three dev-only routes in `apps/host-shell/src/app/app.routes.ts:55-105` (`/preview-shell`, `/preview-hierarchy`, `/preview-hierarchy-prime`) reach INTO the admin-console remote via `loadRemoteModule` + cherry-pick child `path === 'organization-hierarchy'` and bypass the guard — ship in every build despite source comment "DEV-ONLY preview route — remove before production".

**MEDIUM debts (no immediate harm but compound):** `libs/falcon/` umbrella packs 5 sub-areas under one Nx project (blocks tree-shaking); `falcon-ui-core` + `falcon-ui-core-angular` share a source root (two Nx projects on one folder); SIX duplicate Angular UI components between `libs/falcon/src/shared-ui/lib/components/` and `libs/falcon-ui-core/.../angular-wrapper/components/` (calendar, stepper, multi-select, mobile-number↔phone-field, photo-uploader↔single-uploader, send-credentials-popup↔falcon-sending-credentials-dialog); FOUR icon implementations (falcon-icon × 3 in `libs/falcon` + falcon-icon in `libs/falcon-ui-core`); `falcon-organization-hierarchy-tree-tw` is a domain component sitting in UI-core; `apps/host-shell/falcon-facades/` + `apps/host-shell/falcon-sdk/` sit OUTSIDE `src/`; `falcon-ui-showcase` + `playground` ship in production host bundle.

**Migration recommended:** 12-phase plan in `MIGRATION_PLAN.md`. Phase 0–2 are zero-risk (baseline + docs + empty-folder standardization). Phase 6 is the HIGH-priority security PR. Phases 3+4+5+7 split the umbrella into `libs/shared/{ui-angular, models, data-access, icons, theme, tokens, …}` libs with `@falcon` as a transition barrel. Phase 9 graduates org-hierarchy to `libs/admin/organization-hierarchy/`. Estimated 25–35 PRs, 4–6 weeks at 30% time. **NO files moved, renamed, deleted, or edited in this audit pass — reports only.**

**Trigger to resume:** `start folder-structure migration phase 0` or `run T-XX from ACTIONABLE_TASKS`.
