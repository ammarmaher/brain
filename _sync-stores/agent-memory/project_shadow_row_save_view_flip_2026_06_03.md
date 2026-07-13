---
name: project_shadow_row_save_view_flip_2026_06_03
description: "Service-pricing shadow-row Save now deterministically flips to VIEW mode (hides Save/Cancel, shows entered values) the instant Save is clicked, calls the API, and rolls back on error. Build-green 3 apps, dev env restored, NO COMMITS."
metadata: 
  node_type: memory
  type: project
  originSessionId: 0e68794e-7930-4af7-9389-5f661f468e13
---

# Shadow-row Save → instant VIEW-mode flip + error rollback — 2026-06-03

**Request (Ammar):** "Fix in shadow row: sometimes I click Save. It should call the API on success or error. It should make it on view mode that it's saved and not show the Save and Cancel."

## What was actually true (traced end-to-end, do NOT re-investigate from scratch)
- **View-mode-on-SUCCESS already worked** in the normal flow. Backend `ChangeApplication/CommChannelPriceType|Value` PUT returns the full row; `AutoMapping.cs GetNewPriceInfoDetails()` (commerce-svc) correctly echoes the pending change as `details:[{type:'priceType',newPriceType,effectiveDate}]` / `[{type:'priceValue',newPriceValue}]` — matches FE `ServiceDetailsItem`. So on Active row + future date → backend schedules `NewPricingInfo` → PUT `details` populated → `applyOptimisticRow` re-emits → `mergeInProgressShadows` drops the synthetic (persisted same-kind present) → persisted shadow renders in `view`. **Default library Save button deliberately does NOT auto-flip** (`falcon-data-table.component.ts:1582-1590`); it defers to the consumer's re-emit.
- **The real defect** = between click and the API round-trip the row visibly **stayed in `edit` (Save/Cancel showing)**, PLUS the documented intermittent **lost-click after a date change** ("I can click Save but it's not clicked; works when date NOT changed"). Date-picker auto-closes on select (`falcon-date-picker-tw.tsx:284 closeInternal('select')`); the close re-render + form-CD settling window is when the Stencil Save `<button>` (fires on `onClick`, line ~1105) can be lost mousedown↔mouseup. **That deepest lost-click is a Stencil/portal-layer race — UNCONFIRMED, NOT fixed by this change.**

## The fix (deterministic + instant; logic-only, no templates)
1. **`libs/falcon/.../service-pricing-table/service-pricing-table.component.ts`** — `onShadowRowSave` now calls new `commitShadowEditToView(rowId, updatedChange)` on a VALID save BEFORE emitting: (a) writes the entered form values into the matching `apps()` scheduled-change (so VIEW shows what was submitted, not the seed defaults), (b) flips that shadow's `shadowRowModes` key to `'view'` (hides Save/Cancel instantly). Flipping to `'view'` takes the synthetic OUT of the "open edit" set → `mergeInProgressShadows`/`inProgressEditKeys` (carry only `'edit'`) stop stranding it → host SUCCESS re-emit swaps in the persisted shadow seamlessly (same values, no flicker); also fixes the latent "stranded in edit if backend ever omits `details`" case. **Genuinely-open edits (still `'edit'`) stay protected by the 2026-05-31 carry-forward.**
2. **`apps/host-shell/.../service-pricing/signals/service-pricing-state.slice.ts`** — new `refreshFromCurrent()`: `rows.set([...rows()])` — re-emits authoritative snapshot with a NEW array ref, NO GET / NO `mode='loading'` → NO skeleton flash (keeps Wave-11/12 "data stays visible").
3. **`apps/host-shell/.../service-pricing/service-pricing.component.ts`** — new `onPriceMutationError(rowId)` = clear busy + `refreshFromCurrent()` (rolls back the optimistic flip; global errorRules already toasts, so NO double-toast). Wired into `onPriceTypeSave`/`onPriceValueSave` `error:` callbacks (was `onMutationError`). Envelope-failure branch of `onPriceMutationResult` (HTTP 200 isSuccessful=false) also calls `refreshFromCurrent()` before its toast. `onMutationError` still used by visibility/enable/disable/delete (not dead).

## Verification (build-runtime evidence only — NOT browser-clicked)
- `tsc -p apps/host-shell/tsconfig.app.json --noEmit` EXIT 0 (covers all 3 files via import graph).
- `nx build host-shell` EXIT 0 + `nx run-many -t build -p admin-console,management-console` EXIT 0 (only pre-existing unused-TS + 10.21MB bundle-budget baseline warnings). `node node_modules/nx/dist/bin/nx.js` (npx nx broken in this shell).
- Dev env restored per 504-recipe: stopped run-executor+http-server, built, restarted ONE `nx serve host-shell` → :4200/:4204/:4301 all 200. **NO COMMITS, tree dirty, branch polishing-v0.4.**
- ⚠️ NOT verified by real browser click-through (intermittent lost-click can't be reliably reproduced). Live QA via `ammar-qa-web` (sysadmin/Admin@1234 → Org Hierarchy → node → Apps&Services → kebab Edit Price Type/Value → change → Save) would confirm the deterministic view-flip.

Supersedes/continues [[project_shadow_row_save_after_date_change_2026_05_31]] (that session fixed the state-wipe carry-forward; lost-click left open — still open). Related [[reference_504_admin_console_mf_duplicate_servers_2026_05_31]].
