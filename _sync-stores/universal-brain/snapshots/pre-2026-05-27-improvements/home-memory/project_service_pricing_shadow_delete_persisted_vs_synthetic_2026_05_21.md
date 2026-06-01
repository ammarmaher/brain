---
name: project-service-pricing-shadow-delete-persisted-vs-synthetic-2026-05-21
description: "Service-pricing shadow-row delete now branches on persisted (popup + DELETE API) vs synthetic-local (drop locally, no popup, no API). G-26 (2026-05-21)."
metadata: 
  node_type: memory
  type: project
  originSessionId: ea59211d-4fd8-45de-b308-d364f37e9280
---

# Service-pricing shadow-row delete — persisted vs synthetic branch (G-26)

🟢 SHIPPED 2026-05-21. 1 file modified FE-only: `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.ts`.

## What changed

`onShadowRowDelete()` now branches on whether the shadow exists in the backend snapshot (`rows()` immutable input) before deciding whether to show the confirmation popup + fire the DELETE API.

- **Persisted shadow** (id `${parentRowId}-pt` / `${parentRowId}-pv`, built by `toScheduledChanges()` at `models.ts:282/291` from backend `details[]`) → confirm popup → on accept, emit `scheduledDelete` → host wrapper hits DELETE API. Unchanged from before.
- **Synthetic shadow** (id `${parentRowId}-pt-${Date.now()}` / `${parentRowId}-pv-${Date.now()}`, built by `openShadowEdit()` at `service-pricing-table.component.ts:452` when the operator clicks Edit Price Type/Value on a row with NO existing pending change) → new helper `dropLocalShadow()` strips it from `apps()`, clears `editForms` + `shadowRowModes` + `shadowError`, collapses the parent's `expandedShadowRowIds` if no shadows remain. No popup, no API call.

## Why

Before the fix: `onShadowRowDelete()` unconditionally set `pendingDelete` → popup ALWAYS opened → on confirm, DELETE API fired even for synthetic shadows that had no backend NewPricingInfo entry. Operator UX: spurious "are you sure you want to delete?" confirmation on a row they just spawned by clicking Edit, plus the backend received a DELETE for a record that does not exist (rejected by Commerce's validator with no operator-actionable error).

User direct quote (2026-05-21): "If I create a new edit price value, the rows show but exactly, it's not saved in DB, so I can delete it without any API call or unsaved changes, sorry, without any pop-up delete messages. If it is saved in DB or it already has data for this shadow row and is coming from the backend and it has an ID, it should show the deleted message, and you can delete the row."

## How the distinguisher works

Compares against `this.rows()` (the immutable input from the host wrapper, derived from `state.rows()` which holds the backend GET response):

```ts
const persisted = this.rows()
  .find((r) => String(r.id) === rowId)
  ?.scheduledChanges?.some((c) => c.id === shadowId) ?? false;
```

Semantic question: "is this shadow in the backend snapshot?" — direct, NOT id-format-parsing. If the id-builder in `toScheduledChanges()` or `openShadowEdit()` ever changes, this branch stays correct because it asks the snapshot, not the string.

## Build evidence

- admin-console: OK 20.97s hash=f6f9659310e86381 (production)
- host-shell: OK 15.67s hash=dfe8df8d5e9ad34a (development)
- management-console: FAILS on PRE-EXISTING TS2540 errors in `models.ts:357-378` `mapPartialServiceRow` (`Partial<ServiceRow>` preserves readonly modifiers from ServiceRow → assigning into `out` fails strict TS). NOT introduced by this edit; `service-pricing-table.component.ts` itself compiles clean across all configs.

## Not browser-runtime-verified

Workspace blocked on 40+ pre-existing Stencil/Angular compile errors per [VAULT] `Brain Outputs/datasets/authority-dataset/VERIFICATION-STATUS.md`. Live verification path for the user:

1. Open Hierarchy → CommChannels & Services tab on a row WITH NO existing pending change.
2. Click kebab → Edit Price Type (or Edit Price Value) → synthetic shadow appears in edit mode.
3. Click the trash icon in that shadow row → expect: shadow disappears, NO confirm popup, NO network call. Open Network tab in devtools to confirm zero DELETE requests fired.
4. Repeat on a row WITH a backend-persisted pending change (e.g. WhatsApp with `details[]` set after a prior save → reload). Click trash → expect: popup opens → confirm → DELETE network call fires → 200 response → 3s delay → reload picks up the cleared state.

## Rules emitted

- Shadow-row delete handlers MUST branch on persisted-vs-local using the IMMUTABLE input snapshot (`rows()`), NEVER by parsing the id format. Id format is implementation detail; the snapshot is the contract.
- Local presentation state (`apps()`, `editForms`, `shadowRowModes`, `expandedShadowRowIds`, `shadowError`) is the ONLY mutable surface the table owns; any operation that adds a synthetic shadow MUST have a symmetric local-only removal path that cleans up ALL five.
- Any new "synthetic shadow" feature (e.g. add bulk-pending, add what-if scenarios) MUST go through the same persisted-vs-local discriminator at delete time.

## See also

- `models.ts:282/291 toScheduledChanges` — persisted shadow id-builder.
- `service-pricing-table.component.ts:452 openShadowEdit` — synthetic shadow id-builder.
- `service-pricing-table.component.ts:607-680 onShadowRowDelete + dropLocalShadow` — G-26 branch + cleanup helper.
- [[project-service-pricing-visibility-and-reload-delay-2026-05-21]] — G-22 + G-23 prior pass (visibility precondition + reload delay).
- [[project-org-hierarchy-fe-be-integration-realign-2026-05-21]] — overall org hierarchy realign series.
