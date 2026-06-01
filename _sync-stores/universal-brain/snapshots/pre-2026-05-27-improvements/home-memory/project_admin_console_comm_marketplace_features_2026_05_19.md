---
name: Admin comm-channels + marketplace features
description: Two new admin-console feature pages (org-hierarchy tree + node-details header + service data table) built self-contained
type: project
originSessionId: d8806b7a-b9e8-4b3b-874d-a1cbd7f59d59
---
🟢 BUILD-GREEN 2026-05-19. admin-console got two full feature pages — Step 1 created routable placeholders, Step 2 built them into full pages.

**Routing (Step 1):** host-shell sidebar already had nav items "CommChannels & Services .Mng" → `/admin-console/comm-channels` and "Marketplace & Applications .Mng" → `/admin-console/marketplace`; admin-console had no routes → added lazy routes in `apps/admin-console/src/app/app.routes.ts` (slugs `comm-channels` + `marketplace`, parent `adminConsoleGuard` only).

**Pages (Step 2):** Each feature mirrors the org-hierarchy-page layout, simplified — LEFT `<app-organization-hierarchy-tree>` tree (`[rootSelectable]="false"` — Falcon root NOT clickable; page-state auto-selects the FIRST client under root via `firstChildOf`), RIGHT `<falcon-node-details-section>` header (NO back-arrow — never a built-in; empty actions slot) + the data table below.
- `comm-channels-services/` — 1:1 functional port of `comm-channels-tab` (visibility toggle, edit price-type/value shadow rows, enable/disable, do-payment, PES, validations). Endpoints `commerce/Node/{nodeId}/comm-channels/...`.
- `marketplace-applications/` — 1:1 port of `apps-services-tab`. Endpoints `commerce/Node/{nodeId}/applications` + `application/...`.

**Self-contained:** each feature owns copied `models/` + `models/table-config.ts` + `validations/` + `services/services.ts` (trimmed gateway+actions) + `services/page-state.service.ts` (minimal tree-selection slice) + `signals/*.signals.ts` (list state slice, page-scoped, provided in `.routes.ts`) + `components/` table + `stencil-prop-patches.ts`. ZERO imports from `features/org-hierarchy-page`. Reuses only shared libs/components (`@falcon`, `@falcon/ui-core/angular`, `@host-shell/shared/organization-hierarchy-tree`, `@host-shell/shared/do-payment-priority-popup`, `@falcon/org-node-avatar`).

**"Show" filter:** BUILT then REMOVED — user decided it was a placeholder. The status-filter dropdown, client-side `applyShowFilter`, `?status=` query param, state-slice `lastFilter`, and `hierarchy.showFilter.*` i18n keys were all stripped end-to-end. Header actions slot is now empty.

**Tree config:** `[rootSelectable]=false` `[showArrows]=false` `[showActions]=false` `[showRootActions]=false` — flat, action-free clients list.

**Shadow-save bugs fixed (2026-05-19, all 4 service tables — comm-channels-tab, apps-services-tab + the 2 ported tables):**
- BUG 1 cause B (LIBRARY): `falcon-data-table.component.ts` `onShadowAction('save')` unconditionally flipped the shadow to `view` mode right after emitting `shadowRowSave` → consumer's edit `<form>` torn down before validation ran → silent no-op. FIXED: removed the auto-flip; consumer owns the mode.
- BUG 1 cause A (component): `openShadowEdit` seeded `effectiveDate = today+10`, invalid for Monthly/Yearly periodic pricing (`invalidEffectiveDateForPeriodicPricingChange` needs `renewDate.Day-1`) → save silently aborted. FIXED: new `defaultEffectiveDateIso()` in validations.ts seeds a valid date. Also moved clipped inline error to in-flow `mt-1`.
- BUG 2: backend `FalconServiceConfigurationBase.Operations.cs:122-129` `SetVisibility()` does NOT delete `NewPricingInfo` — pending price changes survive a hide. FE: `shadowRowMap()` now skips `!visible` rows; `onToggleVisibility` collapses shadow state on hide.

**Builds (final):** admin-console GREEN `cc9f5c37c2bc1410`; host-shell GREEN `aa3dd0273d9bb0e3`.

**How to apply:** Resume here for further work inside these two pages.
