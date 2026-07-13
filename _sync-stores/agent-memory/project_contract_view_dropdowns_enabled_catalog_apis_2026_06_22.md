---
name: project_contract_view_dropdowns_enabled_catalog_apis_2026_06_22
description: "View-mode Contract Details Application/CommChannel dropdowns are intentionally ENABLED (read-only navigators) and filled from the same catalog APIs as Edit — not a bug, do not revert."
metadata: 
  node_type: memory
  type: project
  originSessionId: 93baf895-f855-4e21-a57d-a7bccbcc6ddf
---

Contract Details (Contracts & Cost .Mng → view a contract → "Contract Details" tab): the **Application** and **CommChannel** header dropdowns are now **interactive even in read-only VIEW mode**, and the admin view fills them from the **same account-catalog APIs that Edit uses** (not from the contract's own rates).

**What was done (FE-only, 2026-06-22, claude, NO commits; branch as-is):**
- Section component (the shared `app-contracts-contract-details-section` = admin `contract-details-step.component`, and the mgmt `contracts-contract-details-section.component`): the two header `<falcon-angular-dropdown>`s changed from `[disabled]="!editable()"` → `[disabled]="false"`. They are NAVIGATORS, not editors — switching them re-projects the matrix for the chosen (Application, CommChannel) combo read-only; the rate CELLS stay `editable`-gated (`onCellChange`/`onCellBlur`/`upsertCurrentEntry`/`persistCurrentMatrix`/`rebuildComboDictionary` keep their `if(!editable()) return`). Done in BOTH consoles for parity.
- Admin VIEW pane `contracts-view-contract.component.ts`: added `loadLookups(accountId)` = `forkJoin(api.getApplicationOptions, api.getChannelOptions)` (same calls as `contracts-edit-contract`), fired after `getContract` resolves (`accountId` = bound input ?? `detail.accountId`). The dropdown-facing `applicationOptions()`/`channelOptions()` are now `mergeOptions(catalog, contractOwnDistinct)` — full catalog first, contract's own app/channel UNIONed as a safety net so the current selection never disappears if hidden-since. The rates-distinct lists were renamed `contractApplicationOptions`/`contractChannelOptions` and kept ONLY as the STABLE source for `viewRateMatrix` (so the initial grid doesn't reset when the async catalog resolves). Section `[loading]` now `loadingContract() || loadingLookups()`.
- `getApplicationOptions` → `GET commerce/Node/{accountId}/applications` (FE filters `visibility===true`, see [[project_contract_wizard_dropdown_visibility_2026_06_21]]); `getChannelOptions` → `GET commerce/Node/{accountId}/comm-channels/visible` (priority-sorted).

**Why:** user request — "the Application and CommChannel dropdowns should be enabled, just the dropdowns" in view mode, and "make sure we are calling the same APIs to fill the dropdowns, like what we did in edit." Previously view derived options from `distinctOptions(this.rates(), …)`, so the dropdowns listed only the single app/channel the contract already used.

**How to apply:** Do NOT "fix" the enabled read-only dropdowns back to `[disabled]="!editable()"` — it's intentional. The mgmt console still lists CONTRACT-derived options only (its `contracts.service` has NO `getApplicationOptions`/`getChannelOptions`; it's read-only + client-gateway), so full-catalog parity there needs new mgmt service methods first. nx build admin-console + management-console GREEN (host-shell asset-copy EBUSY is a known flaky retry, not these changes). Live-UI check user-gated. Related [[project_contract_wizard_dropdown_visibility_2026_06_21]].
