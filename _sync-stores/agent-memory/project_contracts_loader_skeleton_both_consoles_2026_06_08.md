---
name: project-contracts-loader-skeleton-both-consoles-2026-06-08
description: "Contracts feature now has Falcon loaders/table-skeletons on every API touchpoint in admin + mgmt consoles — house pattern (data-table [loading] skeleton for reads + FalconLoaderService.showOverlay for mutations)."
metadata: 
  node_type: memory
  type: project
  originSessionId: 524d8a37-cca7-452a-b738-e4d440f665e0
---

**Injected Falcon loaders + table skeletons across ALL contracts-cost-management API touchpoints, both consoles** (2026-06-08, claude, FE-only, NO commits). User ask: *"add our Falcon loader inside the contract when calling the API … inject the table skeleton and the loader itself … cover all the areas … both admin and management console."* Scope confirmed via AskUserQuestion = **contracts feature only, both apps** (not platform-wide).

**The house pattern applied** (verified against existing code, NOT invented):
- **Table-backed reads → data-table skeleton**: `<falcon-angular-data-table [loading]>` (built-in; provided app-wide via `provideFalconDataTableSkeleton()` in all 3 apps' app.config.ts). The list table already had `[loading]`.
- **Mutations (create/update) → global blocking overlay**: `FalconLoaderService.showOverlay(reason)` from `@falcon/studio/runtime` → returns a `FalconLoaderDismiss` disposer; dismiss in `finalize()` (clears on success/error/unsubscribe). The service is MF-singleton-shared (admin/mgmt MF config wildcard default `singleton:true`), so a REMOTE's `showOverlay()` drives the SAME always-mounted inline loader in `host-shell/src/app/app.ts` (`data-fl-global-loader`, z-2000). `FALCON_LOADER_DEFAULTS` token is `providedIn:'root'` w/ factory → service auto-constructs even in unit TestBed (no provider needed; the EXISTING edit/wizard specs did NOT break from the new `inject(FalconLoaderService)`).
- **Non-table read region (addons form grid) → lightweight `animate-pulse` Tailwind skeleton block** (no inner data-table to reuse), 2 cards × 6 slots, mirrors `falcon-page-skeleton` style.

**Reusable change**: added optional `readonly loading = input<boolean>(false)` to the 3 shared section components (rate-card, contract-details → thread to inner `[loading]`; addons → `@if(loading()){skeleton}@else{grid}`), in BOTH apps' local copies. Defaults false → zero impact on prior call sites.

**Wired** (admin): view pane (removed plain-text "Loading…" box, thread `[loading]="loadingContract()"` to 3 sections), edit pane (removed 2 text hints → `[loading]="loadingDetail()||loadingLookups()"` to sections + `showOverlay('contracts:update')` on `onSubmit`), add-wizard (removed text hint → `[loading]="loadingLookups()"` to step-2/3 sections + `showOverlay('contracts:create')` on `onFinish`). **(mgmt)**: view-only — list (already skeleton) + view pane (same skeleton wiring); NO mutations there so no overlay.

**Files**: ~21 (admin: 3 section .ts/.html + view.html + edit .ts/.html + wizard .ts/.html; mgmt: 3 section .ts/.html + view.html; +3 admin specs). **Tests** are LOGIC-only (`TestBed.runInInjectionContext(()=>new Cmp())`, no DOM render — Stencil dist OOMs the worker; see `apps/admin-console/tests/contracts/_support.ts`). Added: edit+wizard `showOverlay` called-once-and-dismissed-on-save (stub `FalconLoaderService` provider) + invalid-form-no-overlay; addons `loading` input default/settable.

**GATES**: `nx build admin-console` exit 0 + `nx build management-console` SUCCESS (hash 05752284dbec89af). `nx test admin-console` 47 files green (addons-section 18, edit 17, wizard 27 — +5 new). `eslint` on the exact 21 touched files = **0 errors** (2 pre-existing warnings in addons spec lines 28-29, not mine). ⚠️ `nx test management-console` = pre-existing infra breakage (`Failed to resolve import "@falcon/ui-core/angular"` across 23 files incl. org-hierarchy/contact-groups/contracts — NOT my changes, I added zero new imports; webpack build proves correctness). ⚠️ `nx lint admin-console` project-wide = 45 PRE-EXISTING errors in legacy files (`*ngFor`/`*ngIf` prefer-control-flow, `<button> content`, label-assoc) — none in my files. Live UI walkthrough = user-gated (no password typing per brain rule). Plan: `C:\Users\User\.claude\plans\elegant-discovering-toucan.md`.

Related [[reference_fe_structure_standard_angular21_2026_06_02]] · [[reference_wallet_balance_knowledge_map_2026_06_07]].
