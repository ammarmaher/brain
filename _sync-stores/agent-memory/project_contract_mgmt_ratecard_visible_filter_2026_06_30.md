---
name: project_contract_mgmt_ratecard_visible_filter_2026_06_30
description: Mgmt-console contract Rate Card tab showed active AND non-active services; fixed FE-only to filter to visible channels like admin.
metadata: 
  node_type: memory
  type: project
  originSessionId: d0b5a6d7-cd4f-45bf-9be8-4ee57f6a59bf
---

Contract detail **Rate Card** tab in the MANAGEMENT console listed ACTIVE **and** non-active services, while the ADMIN console correctly showed active/visible only. User confirmed desired behavior = active services only.

**Root cause (3 layers):**
1. Commerce detail mapper builds `tariffPlan.unitConversions` via `createDefaultUnitConversions(...)` which ALWAYS injects the full WhatsApp/Voice/AI-ChatGPT catalog regardless of visibility/active status (raw list inherently contains non-active rows). Same in both consoles' mappers.
2. **Admin** view-contract loads the account's VISIBLE channels (`getChannelOptions` → `commerce/Node/{id}/comm-channels/visible`) and filters via `createUnitConversionsForChannels(channels, conversions)` → `rateCardRows()`; binds `[rows]="rateCardRows()"`.
3. **Mgmt** view-contract bound raw `[rows]="unitConversions()"` and its `ContractsService` had EXPLICITLY DROPPED the comm-channels lookup endpoint → nothing to filter against → showed active+non-active. (The `createUnitConversionsForChannels` helper already existed in mgmt models, just never called.)

**FIX (FE-only, mgmt-console, mirrors admin):**
- `services/contracts.service.ts`: added `getChannelOptions()` → `commerce/Node/{nodeId}/comm-channels/visible` (CoreGateway, `useGateway()`), maps to `{label:channelName, value:channelId}` priority-sorted; node id resolved internally via new `resolveNodeId()` preferring `session.nodeId` (node-keyed endpoint — tenantId 500s for string tenants, same gotcha as `CommsHubService.resolveAccountId`); no-node → empty SUCCESS SOR (falls back to unfiltered). +`ApiVisibleChannelWire` inline type, `toFailedChannelsSor`.
- `components/contracts-view-contract.component.ts`: import `createUnitConversionsForChannels` + `ContractUnitConversionRow`; added `commChannels`/`loadingLookups` signals; `rateCardRows` computed (filters; falls back to raw when channels empty/pending); `loadChannelOptions()` called after detail loads.
- `.component.html`: Rate Card binding `[rows]="rateCardRows()"` + `[loading]="loadingContract() || loadingLookups()"`.
- spec: added `getChannelOptions` to the `ContractsService` mock stub.

nx build management-console GREEN; all `tests/contracts/*` pass incl. `contracts-view-contract.component.spec.ts` 22/22. Pre-existing UNRELATED fails: 11 in `tests/contact-groups/create-contact-group.component.spec.ts` (file-upload timing, untouched). UNCOMMITTED on branch `night-shift/due-payment-signal-fixes` (NOT polishing-v0.4); live-UI user-gated (needs auth+backend). Related: [[project_contract_view_dropdowns_enabled_catalog_apis_2026_06_22]], [[project_contract_wizard_dropdown_visibility_2026_06_21]].
