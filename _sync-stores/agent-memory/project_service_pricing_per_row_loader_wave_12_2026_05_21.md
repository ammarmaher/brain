---
name: project-service-pricing-per-row-loader-wave-12-2026-05-21
description: "Service-pricing FE — Wave 11 (patch row from PUT, no reload) + Wave 12 (per-row loader, no whole-table skeleton) — BROWSER-VERIFIED root-cause fix for 'data is removed after every visibility/enable/disable/price-edit/delete-pending click' in the Org Hierarchy CommChannels + Apps & Services tabs. Commits 029b7bdd + 0f943248 on fix/visibility-switch-disabled-binding (off polishing-v0.4)."
metadata: 
  node_type: memory
  originSessionId: 276b5eac-e45c-41f3-8004-7835a02f7f36
---

# Service-Pricing — Per-Row Loader + Patch-Locally (Wave 11 + Wave 12) — 2026-05-21

## Status

🟢 **BROWSER-VERIFIED 2026-05-21** — user explicit confirmation: *"It's working 100%."*

Verified on host-shell dev server (localhost:4200) — BMW account, CommChannels & Services tab, visibility toggle. PUT `http://localhost:7256/commerce/Node/comm-channel/visibility` → 200. Row stays rendered, switch shows inline spinner during the round-trip, switch reflects new visibility after the response. Other rows remain fully interactive throughout.

## Symptom

User screenshot (Org Hierarchy → CommChannels & Services tab → BMW): every visibility click made the data table go blank, footer showed "Showing 0 - 0 from 0" and "1 of 1" pagination. Other row actions (enable / disable / price-type / price-value / delete-pending) had the same symptom. Repeated for both Apps & Services and CommChannels tabs.

User's framing was correct: *"The issue is not related to the API. The issue is that, on click, some event will happen inside the data table, and the data table does not receive the actions very well."*

## Root cause — confirmed

The Stencil `<falcon-table-tw>` render guard at [CODE] `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx:1437-1451` is a HARD SWAP:

```tsx
{this.loading && Array.from({length: this.skeletonRows}).map(renderSkeletonRow)}
{!this.loading && rows.length === 0 && (<empty-state-row />)}
{!this.loading && rows.map(<data-row />)}
```

When `loading=true`, every `<tr>` data row is UNMOUNTED from the DOM and only skeleton rows render. That swap is correct for the **first GET** (no rows yet) but WRONG for a row-level toggle — the operator must keep seeing the other rows; only the one being mutated should communicate "busy."

The chain that produced the symptom:

1. Click visibility switch → `onToggleVisibility` emits → wrapper's `onVisibilityToggle`
2. Wrapper's `runMutation` flipped `state.submitting.set(true)`
3. Wrapper's `submitting` computed (`state.mode==='loading' || state.submitting() || doPaymentInFlight()`) went `true`
4. Table got `[loading]="true"` → Stencil swapped all `<tr>` data rows to skeleton rows
5. Footer recomputed from the swapped state → "Showing 0 - 0 from 0"
6. PUT returned 200 → row got patched correctly, but the visible artifact was already burned in

**Wave 7 (G-23, commit `31d13af9`) made it worse** by adding a 3-second `scheduleDelayedReload` to the success path under the wrong diagnosis ("backend eventual consistency"). Verified live via curl on 2026-05-21: the BE has **NO** eventual-consistency window — the immediate GET after PUT returns consistent state every time. The 3-second window stretched the skeleton flash from ~200ms to 3+ seconds, making the bug user-blocking.

## Fix — Wave 11 (patch-locally) + Wave 12 (per-row loader)

Two cooperating waves landed in three commits on `fix/visibility-switch-disabled-binding`:

### Wave 11 — drop the post-mutation reload, patch the row from the PUT response

- **Commit `43a7af6f`** (prior session, bulk refactor — landed inside the "login screen polish" commit because compaction interrupted before a dedicated commit could be made):
  - `apps/host-shell/.../service-pricing-state.slice.ts:107-148` — new `applyPartialRowPatch(rowId, patch: Partial<ServiceRow>): void` method that merges a partial wire-shape row into the local snapshot (no-ops if row id isn't in the current snapshot)
  - `apps/host-shell/.../service-pricing.component.ts` — refactored: dropped `scheduleDelayedReload`, `reloadTimer`, `pendingSaveReload`, `reloadRetryCount`, mode-watching effect, retry budget, 3-second delays, `DestroyRef` timer cleanup. `onMutationResult` now patches the row locally + clears submitting + fires the success toast synchronously (no reload). `onPriceMutationResult` uses the existing `applyOptimisticRow` for the full-row response. Visibility-error path keeps a corrective `state.reload()` so the one-way `[checkedInput]` binding snaps the switch back to BE truth.
- **Commit `029b7bdd`** (this session, build-fix):
  - `libs/falcon/.../service-pricing-table/models/models.ts` — new `mapPartialServiceRow(patch: Partial<AccountServiceWire>): Partial<ServiceRow>` helper that converts the partial wire shape to a `Partial<ServiceRow>` via `toFalconItemStatus` + `toAvailableActions` (made the latter exported). Uses a local `type Mutable<T> = { -readonly [P in keyof T]: T[P] }` to build the patch object since `ServiceRow` is fully `readonly` and `Partial<ServiceRow>` inherits the readonly props.

### Wave 12 — per-row loader (drops the whole-table skeleton flash on mutations)

- **Commit `0f943248`** (this session):
  - `apps/host-shell/.../service-pricing.component.ts`:
    - new `busyRowIds = signal<ReadonlySet<string>>(new Set())` + `setRowBusy(rowId, busy)` helper
    - `submitting` computed dropped `state.submitting()` from the OR — now only true for **initial GET / explicit `state.reload()` / do-payment** (the legit whole-table cases). Row-level mutations no longer flip it.
    - `runMutation(rowId, op)` — new signature, three-tier gate: account → table-busy → row-busy. Other rows' clicks pass through untouched.
    - `onMutationResult` / `onPriceMutationResult` / `onMutationError` / `onVisibilityError` now take `rowId` and use `setRowBusy(rowId, false)` instead of `state.submitting.set(false)`.
    - All five event handlers (visibility / row-action / price-type / price-value / scheduled-delete) thread `event.rowId` through.
  - `apps/host-shell/.../service-pricing.component.html` — `+[busyRowIds]="busyRowIds()"` pass-through.
  - `libs/falcon/.../service-pricing-table.component.ts` — new `busyRowIds` input + `isRowBusy(rowId)` helper. `onToggleVisibility` and `onRowAction` also gate by `isRowBusy(row.id)`.
  - `libs/falcon/.../service-pricing-table.component.html` — visibility cell: `@if (isRowBusy(row.id))` renders a 4×4px Tailwind spinner; `@else` renders the existing `<falcon-angular-switch>` unchanged.

## Behaviour after Wave 11 + Wave 12

- **Row mutation success**: click visibility on row A → only row A's switch swaps to a spinner. Rows B, C, D stay rendered + interactive. PUT returns 200 → `mapPartialServiceRow(res.result)` → `applyPartialRowPatch(rowId, patch)` → spinner clears → patched switch reappears with the new state from the BE response. Top-right success toast.
- **Row mutation envelope failure (HTTP 200 but `isSuccessful=false`)**: spinner clears, local snapshot left intact (operator can retry), inline error toast with the localized envelope detail.
- **Row mutation transport error (4xx/5xx/network)**: spinner clears via `onMutationError(rowId)`. Global `errorRules` interceptor fires the error toast (component doesn't double-fire).
- **Visibility error**: spinner clears + `state.reload()` reconciles. The reload DOES legitimately trigger the whole-table skeleton flow (mode='loading' for the round-trip) because we're replacing rows[] from authority — the one case where a global loader is the right UX.
- **Initial GET / explicit reload / do-payment in flight**: whole-table skeleton flow stays as-is (correct because rows[] is genuinely empty or about to be replaced wholesale).

## Files (Wave 11 + Wave 12 combined — 6 files)

| Path | Change | Wave |
|---|---|---|
| `apps/host-shell/src/app/shared-components/service-pricing/signals/service-pricing-state.slice.ts` | +`applyPartialRowPatch` | 11 |
| `apps/host-shell/src/app/shared-components/service-pricing/service-pricing.component.ts` | drop reload machinery, add `busyRowIds`, `setRowBusy`, refactor result handlers | 11+12 |
| `apps/host-shell/src/app/shared-components/service-pricing/service-pricing.component.html` | `+[busyRowIds]` pass-through | 12 |
| `libs/falcon/src/shared-features/service-pricing-table/models/models.ts` | +`mapPartialServiceRow`, +`toAvailableActions` exported, `Mutable<>` writable intermediate | 11 |
| `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.ts` | +`busyRowIds` input, +`isRowBusy` helper, gate `onToggleVisibility` + `onRowAction` | 12 |
| `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.html` | visibility cell: `@if (isRowBusy)` inline spinner else switch | 12 |

## Commits

```
0f943248  fix(service-pricing): per-row loader to stop whole-table skeleton flash (Wave 12 / G-27)
029b7bdd  fix(service-pricing): writable intermediate for partial row mapper (Wave 11 build-fix)
43a7af6f  Fixing and polishing The login screen  ← Wave 11 bulk landed here (mixed commit)
e6b4eac5  fix(service-pricing): wire [disabled] on visibility switch for non-hideable rows (G-25)
```

All on branch **`fix/visibility-switch-disabled-binding`** (off `polishing-v0.4`).
Pushed to remote `https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/falcon-web-platform-ui`.

## Build verification

`nx build host-shell admin-console management-console --skip-nx-cache` — all three green:
- host-shell hash `9f189a8dd24c5992` (13.5s) Wave 12 final
- admin-console + management-console green via `nx run-many`

## Coexistence with parallel sessions

The `FalconLoaderService.showOverlay('service-pricing-do-payment')` effect added in a parallel session co-exists with Wave 12 cleanly — it gates on `doPaymentInFlight()` (untouched by Wave 12) and the wrapper's `destroyRef.onDestroy` releases the slot on unmount. The `submitting` computed I refactored still ORs `doPaymentInFlight()` in (intentional — do-payment IS a whole-table flow because it replaces rows wholesale via the popup's terminal `state.reload()`).

## Rules emitted (platform-wide)

1. **Stencil `<falcon-table-tw>` `loading=true` is a HARD SWAP — every data `<tr>` is unmounted.** Never bind `[loading]` to a flag that flips during a row-level mutation. The only correct triggers for `[loading]` are: initial GET, explicit `state.reload()`, full-row replacement (do-payment terminal).
2. **Row-level mutations need a row-level busy affordance.** A `busyRowIds: Set<string>` signal driven by the wrapper, passed to the presentation table, consumed via an `isRowBusy(rowId)` cell-template guard. Other rows stay interactive.
3. **`Partial<ServiceRow>` does NOT strip `readonly`.** Use a local `type Mutable<T> = { -readonly [P in keyof T]: T[P] }` to build up a patch object, then cast back to `Partial<ServiceRow>` at return time.
4. **BE PUT responses come in two shapes:**
   - PARTIAL (visibility / enable / disable / delete-pending): `{ commChannelId|applicationId, accountId, visibility, status, canHide, availableActions }` — merge with `mapPartialServiceRow + applyPartialRowPatch`.
   - FULL (price-type / price-value): full `AccountServiceWire` — use `mapServiceRow + applyOptimisticRow`.
5. **The BE has NO eventual-consistency window for Commerce service-pricing mutations.** Immediate GET after PUT returns consistent state every time (verified via curl 2026-05-21). Any code that adds a "wait N seconds before reload" delay is wrong — fix the cause (HARD SWAP), not the symptom (timing).
6. **Wave 7's `scheduleDelayedReload` (G-23, commit `31d13af9`) is SUPERSEDED.** All the reload machinery (`scheduleDelayedReload`, `reloadTimer`, `pendingSaveReload`, `reloadRetryCount`, retry budget, mode-watching effect, `RELOAD_DELAY_*_MS` constants) is removed by Wave 11. Don't reintroduce it without re-verifying the HARD SWAP hypothesis first.

## What this REPLACES

- Wave 6 (commit `b36e9285` "Fixing bugs related Shadow Raw") — earlier visibility-corruption investigation. SUPERSEDED.
- Wave 7 / G-23 (commit `31d13af9` "backend-eventual-consistency reload delay") — 3-second post-save reload delay under the wrong diagnosis. SUPERSEDED.
- H1-safe mode-watching effect + H3 optimistic-row patch (commit `71f2040f`) — kept as residual scaffolding (now only fires on the visibility-error corrective reload path).

## Open work

- **PRs not yet opened.** Branches pushed; PR-creation URLs documented in session message. Recommend stacked merge order: `fix/order-status-realtime-502` → `fix/mgmt-console-password-security-mirror` → `fix/visibility-switch-disabled-binding`, all targeting `polishing-v0.4`. User to decide whether to spawn Task Manager agent to open them.
- **Apps & Services tab** — same fix applies (the wrapper + library presentation table are kind-parameterised; both kinds share the same code path). Browser-verified for `comm-channel`; `application` not explicitly screenshot-verified by user but follows from architecture.
