---
name: project-service-pricing-visibility-and-reload-delay-2026-05-21
description: "Service-pricing FE — dropped `!!r.visible` precondition from row actions (G-22) + added 3s post-save reload delay for BE eventual consistency (G-23). Commit 31d13af9 on polishing-v0.4."
metadata: 
  node_type: memory
  type: project
  originSessionId: 276b5eac-e45c-41f3-8004-7835a02f7f36
---

# Service-pricing visibility & reload-delay fix — 2026-05-21

🟢 SHIPPED 2026-05-21. Commit `31d13af9` on `polishing-v0.4`. 2 files modified, FE-only, backend untouched.

## Why (user-reported bugs)

1. **Visibility toggle action disappearance**: after hiding a row, kebab menu became empty → operator couldn't enable / pay / edit the hidden row.
2. **Save returns null data**: after price-type / price-value save, the immediate post-save GET returned null or stale rows → saved change appeared to vanish until manual refresh.
3. **No empty state**: when rows looked empty, no empty state shown.
4. **Date picker limits**: user wanted to confirm BE date constraints are applied (was already wired, verified).

## Root causes

### G-22 (visibility-precondition regression)

NEW `libs/falcon/.../service-pricing-table/models/table-config.ts:50-86` added `!!r.visible &&` precondition to ALL row action `visible` predicates. `origin/main` apps-services-tab.component.ts:725-748 gated action visibility ENTIRELY on `row.allowedActions.includes(actionEnum)` — the backend is the single source of truth via `_allowedFalconServiceActionsGenerator`. NEW double-gated and hid every action on `visibility=false` rows even when the BE explicitly returned actions for that hidden state.

### G-23 (backend eventual-consistency window)

User QA-confirmed BE has a ~3s write→read propagation gap. The Commerce mutation PUT returns synchronously after the Mongo WRITE commits, but Commerce's read path can hit the read-replica which lags ~200-3000ms under normal load. Immediate post-save GET was returning STALE or NULL rows because the read replica hadn't yet seeded the projection.

## Fixes

### G-22 — table-config.ts

Dropped `!!r.visible &&` from all 5 row action predicates:
- `doPayment.visible: (r) => flags.canPayment && hasAction(r, FalconRowAction.DoPayment)`
- `enable.visible: (r) => hasAction(r, FalconRowAction.Enable)`
- `disable.visible: (r) => hasAction(r, FalconRowAction.Disable)`
- `editPriceType.visible: (r) => flags.canEditPriceType && hasAction(r, FalconRowAction.EditPriceType)`
- `editPriceValue.visible: (r) => flags.canEditPriceValue && hasAction(r, FalconRowAction.EditPriceValue)`

Matches main contract: PES flag AND `availableActions` whitelist — backend is the sole authority.

### G-23 — service-pricing.component.ts

New constants + helpers:
- `RELOAD_DELAY_PRICE_MS = 3000` + `RELOAD_DELAY_SIMPLE_MS = 3000` (single 3s default per user directive)
- `reloadTimer: ReturnType<typeof setTimeout> | null = null` (private field)
- `clearReloadTimer()` (idempotent)
- `scheduleDelayedReload(delayMs)` — clears any prior timer + retry budget + pendingSaveReload, then sets new timer that fires `state.reload()` with `pendingSaveReload=true` set IMMEDIATELY before the reload (so mode-watching success-toast effect doesn't fire prematurely while mode==='view' from prior load)

Modified call sites:
- `onMutationResult` success → `scheduleDelayedReload(RELOAD_DELAY_SIMPLE_MS)` (was: immediate `state.reload()`)
- `onPriceMutationResult` success → `scheduleDelayedReload(RELOAD_DELAY_PRICE_MS)` (was: immediate)
- `runMutation` start → `clearReloadTimer()` + `pendingSaveReload.set(false)` (defense in depth)
- `onMutationError` + `onVisibilityError` → `clearReloadTimer()` added
- DestroyRef.onDestroy → `clearReloadTimer()` added
- nodeId-change effect → cancels pending reload + clears retry budget

Visibility error path keeps IMMEDIATE corrective reload (PUT failed → BE state unchanged → GET is pure visual snap-back).

## What was already correct (no change)

- **Empty state**: data-table's `[emptyData]` binding fires automatically when `rows.length === 0`.
- **Date picker constraints**: `[disabledDates]="disabledDatesForShadow(row)"` + `[min]="minDateForShadow(row)"` in service-pricing-table.component.html:224-226. Predicate at validations.ts:204-254 mirrors BE `Operations.cs:21-78` rules (past + Fri/Sat + Monthly/Yearly periodic constraint). Date-picker wrapper at falcon-date-picker.component.ts:94 forwards predicates to the Stencil element.

## Build status

🟢 admin-console + host-shell + falcon lib all green post-Wave-7.

## Rules emitted

- Row action visibility predicates MUST be backend-driven via `row.availableActions.includes(actionEnum)`. Adding FE-side preconditions like `!!r.visible &&` is a regression — the backend's `_allowedFalconServiceActionsGenerator` already decides what's permitted per row state.
- Post-mutation GET reload MUST be delayed by ~3s to allow BE write→read replica propagation. Set `pendingSaveReload` INSIDE the timer callback (not before) to prevent premature success-toast firing.
- nodeId change MUST cancel any pending post-save reload (preventing the wrong-node GET overwriting fresh data).

## Concurrent session note

The `service-pricing.component.ts` file in this commit also bundles the `pendingSaveReload` + retry-timer + mode-watching effect scaffold from the parallel loader-status-data-table session (`local_cd96445a`). That scaffold was uncommitted in the working tree; my Wave 7 builds directly on top of it (`scheduleDelayedReload` uses `pendingSaveReload.set(true)` + the existing mode-watching effect fires the toast). Loader session should pull `polishing-v0.4` before continuing.

## See also

- [[project_org_hierarchy_fe_be_integration_realign_2026_05_21]] — preceding Waves 1-5 commit `df6973b2`
- [[project_shared_service_pricing_investigation_2026_05_21]] — initial investigation that found 3 of the gaps
- `universal-brain/state/session-coordination-2026-05-21.md` — cross-session coordination notes
