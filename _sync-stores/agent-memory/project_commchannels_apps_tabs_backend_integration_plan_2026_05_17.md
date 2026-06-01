---
name: CommChannels + Apps Services Tabs — Backend Integration Plan (Wave 14 follow-up)
description: SSOT integration plan for the org-hierarchy CommChannels & Apps tabs to drop mocks and wire to Commerce backend via System Gateway. Includes full endpoint map, DTO shapes, FSM rules, validation rules, and 7-phase build order.
type: project
originSessionId: 2e67055a-ab2f-4c7a-a9e8-929adeb9f8b1
---
🟡 PLANNED 2026-05-17. Two admin-console tabs (`comm-channels-tab` + `apps-services-tab`) currently mocked via `mock-applications.ts`. Plan to wire to real Commerce backend through `Gateway.SystemGateway` (`provideAppDefaultGateway` already set, `app.config.ts:63`).

## Backend SSOT (Commerce Service, port 7045 or via Core/System Gateway)

**Read endpoints** (under `/api/commerce/Node/...`, controller `NodeController.cs:142-318`):
- `GET {nodeId}/comm-channels/visible/details` ← **the one for the tab — includes `details[]` pending changes**
- `GET {nodeId}/applications` ← includes `details[]` too

**Write endpoints** (15 total, all symmetric between `comm-channel/` and `application/`):
- `PUT  comm-channel/visibility` — FalconOnly
- `PUT  comm-channel/price-type` — FalconOnly
- `PUT  comm-channel/price-value` — FalconOnly
- `POST comm-channel/do-payment` → returns `{orderId}`, poll via `GET order/{orderId}/status`
- `POST comm-channel/enable` / `disable`
- `DELETE comm-channel/new-price-type` — FalconOnly (cancel pending change)
- `DELETE comm-channel/new-price-value` — FalconOnly
- Same 8 for `application/...`

YARP route: `/commerce/{**remainder}` → strip `/commerce` → prepend `/api` → forward to `commerce-cluster (localhost:7045)` per `appsettings.json:66-79` of the Core Gateway. Same gateway pattern in System Gateway.

## Backend Response shape (the SAVA object)

`AccountCommunicationChannelResponse.cs` + `AccountApplicationResponse.cs` are identical:
```jsonc
{
  id, name, pricingType: 1|2|3|null,    // None=0, Monthly=1, Yearly=2, OneTimePayment=3 — NO Quarterly
  priceValue: number|null,
  firstActivationDate, activationDate, renewDate,   // ISO|null
  icon, subTitle, description, visibility,
  status: 0..4,                          // None, InActive, Active, Expired, Disabled
  details: [
    { type: 'priceType',  newPriceType, effectiveDate },
    { type: 'priceValue', newPriceValue }
  ] | null,
  canHide: boolean,                      // = visibility && status==InActive
  availableActions: number[]             // FalconRowAction enum: DoPayment=1, Disable=2, Enable=3, EditPriceType=4, EditPriceValue=5
}
```

`details[]` is built by `AutoMapping.cs:187-215` from `NewPricingInfo` — emits one row per non-null field (priceType, priceValue). Never both kinds duplicated.

## Server-enforced rules (FE must mirror)

**SetPriceType** (`FalconServiceConfigurationBase.Operations.cs:21-78`):
- `!visibility OR status ∉ {Active,Expired}` → immediate apply, no shadow
- Otherwise: `effectiveDate` required + future (end-of-day comparison) — errors `EffectiveDateRequired`, `EffectiveDateMustBeInFuture`
- `Monthly|Yearly`: `effectiveDate.Day == renewDate.Day-1` clamped, AND `effectiveDate >= renewDate - 1day` — error `InvalidEffectiveDateForPeriodicPricingChange`
- `OneTimePayment`: any future date OK

**SetPriceValue** (`Operations.cs:102-120`):
- If `NewPricingInfo` exists → mutate it
- Else if `!visibility OR status ∉ {Active,Expired}` → reflect immediately
- Else → create new shadow

**AllowedFalconServiceActionsGenerator** (`Generators/AllowedFalconServiceActionsGenerator.cs:8-50`) — per-row FSM:
- Falcon user gets `[EditPriceType, EditPriceValue]` baseline
- Client user gets `[]` baseline
- `!visibility` → baseline only
- `InActive` → + `Disable` + `DoPayment` if pricing set
- `Active` → + `Disable`
- `Expired` → + `Disable` + `DoPayment` if pricing set
- `Disabled` → + `Enable` only if (last by Client) OR (last by Falcon AND current is Falcon)

**CanHide** (`Operations.cs:16-19`) — `canHide = visibility && status==InActive`. FE must disable hide attempt when `canHide=false`.

**PES gates** (`marketplace-applications.compare.md:14-22`):
- Admin: `adminConsole.services.{visibility, editPriceType, editPriceValue, payment}`
- Mgmt: `managementConsole.services.{view, payment, disable}` only — edit + visibility are Falcon-only
- Compose AND with `availableActions[]` (defense-in-depth)

## Frontend canonical mapping

Single FE row type — `ServiceRow` — replaces `ApplicationRow` + `AppServiceItem` + `CommChannelServiceItem`. Both tabs share `<app-applications-table>` (already shadow-row-capable per `applications-table.component.ts:94-668`). Mapper folds backend `details[]` into `scheduledChanges[]` (already shaped correctly for the shadow-row API). Drop `Quarterly` everywhere.

## URLs

- QA (current): `https://system-api.falconhub.space/` + `https://core-api.falconhub.space/`
- Local dev (main): `http://localhost:7256` + `http://localhost:7038`
- Same path contract — `useGateway()` adapts via `SHELL_ENV_CONFIG` per `runtime-api-config.ts:128-137`

## 7-phase build order (8 new files, 4 edits, 0 deletes)

1. **Models** — `_shared/models/service.models.ts` + `details.dto.ts`
2. **HTTP** — `_shared/services/commerce-gateway.service.ts` + `commerce-actions.service.ts` (port main verbatim) + per-tab `comm-channels.service.ts` + `apps.service.ts`
3. **State slices** — `comm-channels-tab/signals/` + `apps-services-tab/signals/` (mirror `SettingsTabStateSlice` pattern from `project_settings_tab_standalone_wave14_2026_05_17.md`)
4. **Drop mocks** — edit both tab components to inject slice + render skeleton/error
5. **Mutation handlers** — visibility / edit-pt / edit-pv / enable / disable / delete-pending; do-payment with `SimplePollService` polling + 3 failure-reason dialogs (`CommChannelPriorityOrderRequired`, `InsufficientFunds`, `WalletNotConfigForTheNode`)
6. **Validations** — `_shared/validations/effective-date.validations.ts` — port `IsValidEffectiveDateForPeriodicChange` from C# domain to TS
7. **PES** — adopt `resolveFlag` pattern + AND with `availableActions[]`

## What we explicitly DO NOT do

- No new backend endpoints (all exist)
- No changes to `<falcon-angular-data-table>` or shadow-row API (already perfect)
- No hardcoded URLs (`useGateway()` everywhere)
- No `Quarterly` pricing type (backend has none)
- No client-side computation of `canHide` or `availableActions` (server-owned)
- No in-memory shadow-row creation on Edit Price-* (let backend create + reload)
- No mock removal from `mock-applications.ts` (keep for tests, just stop importing from prod)

## Trigger phrases

`integrate comm channels backend` / `integrate apps services backend` / `wire commchannels tabs to API` / `phase X commchannels integration`
