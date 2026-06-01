*** Archived task — service-pricing shadow-row delete branching ***
*** Archived 2026-05-27 (was sitting in current-task.json with status=completed since 2026-05-21) ***

# Task

ID: `service-pricing-shadow-row-delete-persisted-vs-synthetic-2026-05-21`
Title: Service-pricing shadow-row delete — branch on persisted (popup + API) vs synthetic (drop locally, no popup, no API)
Status: completed
Started: 2026-05-21T14:35:00Z
Completed: 2026-05-21T14:50:00Z
Owner: claude

## Files changed

- `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.ts`

## Root cause

`onShadowRowDelete()` at `service-pricing-table.component.ts:607-611` unconditionally set `pendingDelete` → confirm popup ALWAYS opened → on confirm, `scheduledDelete` fired the backend DELETE API. Synthetic shadows (created locally by `openShadowEdit` at line 452 with id ``${parentRowId}-{pt|pv}-${Date.now()}``) have no backend `NewPricingInfo` entry, so popup + API on those rows was both wrong UX and wrong wire call.

## Fix

Branch on `rows()` (immutable backend snapshot input). If `rows().find(r => r.id===parentId).scheduledChanges.some(c => c.id===event.shadow.id)` is TRUE → persisted → keep current path (popup → scheduledDelete emit → host fires DELETE API). FALSE → synthetic → `dropLocalShadow()` strips it from `apps()`, clears `editForms` + `shadowRowModes` + `shadowError`, collapses expansion if no shadows remain. No model change, no event payload change, no host wrapper change. Uses semantic source-of-truth (the backend snapshot) instead of parsing the id format.

## Build evidence

- admin-console: OK 20.97s hash=f6f9659310e86381 (production)
- host-shell: OK 15.67s hash=dfe8df8d5e9ad34a (development)
- management-console: FAIL on pre-existing TS2540 in `models.ts:357-378 mapPartialServiceRow` (Partial<ServiceRow> preserves readonly) — NOT introduced by this edit; `service-pricing-table.component.ts` compiles clean

## Runtime verification

Not yet runtime-verified. Pending user browser test:
1. Click Edit Price Type / Edit Price Value on a row with NO existing pending change → synthetic shadow appears → click trash → shadow disappears with NO popup, NO network call.
2. On a row WITH a backend-persisted pending change → click trash on shadow → popup appears → confirm → DELETE API fires.

## Commits

None made (no explicit user commit/push instruction).
