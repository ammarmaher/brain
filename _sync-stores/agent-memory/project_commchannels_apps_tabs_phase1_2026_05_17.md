---
name: CommChannels + Apps Tabs — Phase 1 (Models + HTTP layer) — LANDED
description: Phase 1 of the integration plan complete. Models + shared HTTP services + per-tab list services are in place and admin-console builds GREEN. Behavior unchanged (no consumer wired yet).
type: project
originSessionId: 2e67055a-ab2f-4c7a-a9e8-929adeb9f8b1
---
🟢 LANDED 2026-05-17. `nx build admin-console` GREEN `4ba5afb74fba800b`/22.58s.

## Files created (8 new, 0 edits, 0 deletes)

Under `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/`:

- `_shared/models/details.dto.ts` — `DetailsPriceTypeChange | DetailsPriceValueChange` discriminated union + type guards
- `_shared/models/service.models.ts` — `AccountServiceWire` (single shared wire shape — `AccountCommunicationChannelResponseWire` + `AccountApplicationResponseWire` are aliases), 14 typed Request DTOs (visibility/price-type/price-value/do-payment/enable/disable/delete-pending × cc+app), 14 Response types, `CommChannelPriority`, `DoPaymentResponse`, canonical FE `ServiceRow`, `ServiceScheduledChange` union (kind: 'price-type-change' | 'price-value-change' — superset of current FE `ApplicationScheduledChange`), mappers `toFalconItemStatus` / `toPricingTypeOrNull` / `toScheduledChanges` / `mapServiceRow` / `mapServiceRows`
- `_shared/models/index.ts` — barrel
- `_shared/services/commerce-gateway.service.ts` — `providedIn: 'root'`, 17 typed methods (2 reads + 15 mutations), single `baseUrl = 'commerce/Node'` (PascalCase matches `OrderStatusService` at `libs/falcon/.../order-status.service.ts:15`), uses `useGateway()` only (no hardcoded URLs), HttpService.delete with body via `{ body, context }` per Wave-11 single-options-object pattern (prevents HttpContext clobber from shallow spread)
- `_shared/services/commerce-actions.service.ts` — `providedIn: 'root'`, 15 1:1 wrapper methods over the gateway; future hook point for telemetry/retry/optimistic policies
- `_shared/services/index.ts` — barrel
- `_shared/index.ts` — top-level barrel (`import { ... } from '../_shared'`)
- `comm-channels-tab/services/comm-channels.service.ts` — `providedIn: 'root'`, single `getList(nodeId)` calling `GET commerce/Node/{nodeId}/comm-channels/visible/details` (the **details** variant — bare `/comm-channels` would skip shadow-row payloads), maps via `mapServiceRows`
- `apps-services-tab/services/apps.service.ts` — `providedIn: 'root'`, single `getList(nodeId)` calling `GET commerce/Node/{nodeId}/applications`, maps via `mapServiceRows`

## Doctrine confirmed during Phase 1

1. **URL casing**: `commerce/Node` (PascalCase N) is the project convention — matches existing canonical `OrderStatusService`. ASP.NET Core router is case-insensitive but FE convention stays consistent.
2. **JSON wire shape**: camelCase per .NET 6+ Mvc.JsonOptions default (regardless of PascalCase C# property names). Verified for the parallel Settings tab; same convention applies here.
3. **Single shared wire shape**: `AccountCommunicationChannelResponse` and `AccountApplicationResponse` are structurally identical at the backend → modeled as one `AccountServiceWire` interface with two type aliases. Halves the surface; eliminates copy-paste drift.
4. **Single shared FE row shape**: `ServiceRow` replaces main's per-tab `AppServiceItem` + `CommChannelServiceItem` (which were 95% identical). Both tabs render the same `<app-applications-table>` already — no template change needed.
5. **Defensive narrowing in mappers**:
   - `toPricingTypeOrNull`: backend `None=0` and unexpected numerics → `null`
   - `toAvailableActions`: drop unknown numerics (default-deny on row-action whitelist)
   - `toFalconItemStatus`: accepts number OR string (resilience)
   - `toScheduledChanges`: synthesises stable composite id (`{rowId}-pt` / `{rowId}-pv`) since backend doesn't ship one
6. **HttpContext clobber prevention**: `DELETE` / `POST` with custom headers use single options object pattern (`const gw = useGateway(); options = { context: gw.context as HttpContext, ... }`) — never shallow-spread `...useGateway()` alongside other context-touching options. Per Wave-11 trap docs in `settings.service.ts:83-90`.

## Trap caught during build

JSDoc-block-comment closure trap: writing `*/visible/details` inside a `/*** ... ***/` comment closes the comment prematurely at the `*/`. **Rule**: never write the two-char sequence `*/` inside a `/* */` comment. Fixed at line 86 of `commerce-gateway.service.ts` by dropping the leading `*` glob notation.

## Behavior change

**None.** Phase 1 is type-only + service-only. Both tab components still read mocks from `mock-applications.ts`. Phase 3 will wire them through state slices. The new services are now injectable everywhere (`providedIn: 'root'`) and ready for Phase 2 (state slices).

## Trigger

`phase 2 commchannels integration` / `state slices commchannels apps` / `comm-channels tab state`
