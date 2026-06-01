---
type: project-topic
status: 🟢 LANDED
date: 2026-05-17
project: falcon-web-platform-ui / admin-console
feature: Organization Hierarchy → Information panel (backend integration)
wave: 15
originSessionId: b1cdf0bc-c22f-4a68-a2ee-e97ceb110c7e
---
# InfoPanel Backend Integration (Wave 15, 2026-05-17)

## TL;DR

🟢 LANDED 2026-05-17. `nx build admin-console` GREEN hash `b98cda490f4dbcbc` / 20.39s.
**Replaced** the mock-only NodeDossier signals (`'SAR-${node.id.toUpperCase()}-2025'` placeholders, `'—'` for 14 of 17 fields, in-memory `saveInfoEdit`) with a **fully backend-integrated** Information panel mirroring the Commerce `InformationController` contract (`GET commerce/information?NodeId=` + `PUT commerce/information`). Per-file architecture mirrors the Wave 14 Settings tab pattern.

## Problem (verified)

[CODE] `tree-state.signals.ts:108-177` (pre-Wave-15) — `infoDossier` was a `computed` mock that fabricated values from the selected node. `saveInfoEdit()` was in-memory only with comment *"Persist would go here — in-memory only for v1 per Wave 12 decision."* No GET, no PUT, no PES gate, no async name-uniqueness, no error UX. Field keys (`bldg`, `addlAddr`, `vat`, `budget`) didn't match backend DTO names (`buildingNumber`, `additionalAddress`, `vatRegistrationNumber`, `budgetNo`). Dropdown options were hand-coded strings that didn't match the canonical Falcon enums (`eClassificationCategory`, `eClassificationSubCategory`, `eAuthorityLetterType`).

## Solution — file map (5 new, 4 modified, 0 deleted)

**NEW** under `apps/admin-console/.../tab-components/hierarchy-tab/falcon-org-info-panel/`:
- `models/models.ts` — wire DTOs (camelCase per Settings tab discovery) + `InfoFormValue` + `InfoViewModel` + `InfoPesFlags` + mappers (`fromGetMainNodeInfoResponse` · `viewModelToFormValue` · `toUpdateMainNodeInfoRequest` · `parsePhotoToWire` · `infoFormEquals`) + canonical Falcon enum dropdown options (`CLASS_CAT_INFO_OPTIONS` · `CLASS_SUB_INFO_OPTIONS` · `AUTHORITY_INFO_OPTIONS`) + `sectorForAuthorityType()` + `budgetLabelKeyForAuthorityType()` helpers.
- `services/information.service.ts` — `getInformation(nodeId)` → `GET commerce/information?NodeId=` · `updateInformation(nodeId, form, includeFalconOnly)` → `PUT commerce/information`. System Gateway, `notShowToaster: true`, single-options-object pattern (Wave 11 anti-trap).
- `validations/validations.ts` — `INFO_PANEL_VALIDATIONS` InjectionToken + `infoPanelRulesProvider()` factory + 3 cross-field validators (`countryRequiredWhenCity` · `cityRequiredWhenDistrict` · `cityRequiredWhenStreet`) + `isInfoFormValid(form, includeFalconOnly)`.
- `signals/info-panel-state.signals.ts` — `InfoPanelStateSlice` (page-scoped): mount-time `forkJoin(resolveFlags, getInformation)`, mode `loading|view|edit|error`, formValue + snapshot dirty-tracker, submitting with `finalize()`, discard-prompt orchestration mirroring Wave 14 SettingsTabStateSlice. Only fires GET when `selectedNode().type === 'client'` (Falcon root + sub-nodes hide panel).

**REWRITTEN** (existing files at the same paths):
- `falcon-org-info-panel.component.ts` — drops the hand-rolled `sections` config; becomes a thin renderer over `state.info*` surface. Per-field setters route via `state.updateInfoField(key, value)`. Added 5 view-mode label resolvers (`classCatLabel`/`classSubLabel`/`authorityLabel`/`countryLabel`/`cityLabel`) that map persisted enum/lookup-id back to display strings.
- `falcon-org-info-panel.component.html` — 4-col grid with section headers (Identity · Account Official · Address · Identifiers). All inputs are Falcon-only (`<falcon-angular-input>`/`<falcon-angular-dropdown>`/`<falcon-photo-uploader>`). View + edit modes share the same Uploader (using Wave 14b's `[viewMode]`). Falcon-only fields (`AccountName`/`FinanceId`) gated with `[disabled]="!pesFlags().canEditFalconOnly"`. Cross-field error banner for address coherency.
- `index.ts` — exports the new slice, service, and types alongside the component.

**MODIFIED**:
- `services/state/tree-state.signals.ts` — dropped the mock `infoDossier`/`infoDraft`/`infoEditMode` signals + `updateInfoDraft`/`openInfoEdit`/`cancelInfoEdit`/`saveInfoEdit` methods + unused `NodeDossier` import. Kept `infoOpen`/`infoClientPhoto`/`openInfo`/`closeInfo`/`toggleInfo` (tree-side panel toggle stays here).
- `services/hierarchy-page-state.service.ts` — added `InformationService` + `InfoPanelStateSlice` to `HIERARCHY_PAGE_STATE_PROVIDERS`. Re-exports 11 new signals/methods via `state.info*` (`infoMode`/`infoViewModel`/`infoFormValue`/`infoPesFlags`/`infoLoadError`/`infoSubmitting`/`infoFormDirty`/`infoFormValid`/`infoCrossFieldErrors`/`infoShowDiscardPrompt`/`infoEditMode` + `enterInfoEdit()`/`updateInfoField()`/`onConfirmInfoDiscard()`/`onDismissInfoDiscard()`). Legacy `openInfoEdit`/`cancelInfoEdit`/`saveInfoEdit` re-aliased to the new slice. Inserted tree-click guard mirroring Settings/Add-Client `pendingTreeSelection` pattern. Back-compat aliases `infoDossier=infoSlice.viewModel` + `infoDraft=computed(()=>({}))` so legacy template refs compile during transition.
- `components/org-hierarchy-page-menu.component.html` — Info-edit-mode buttons now bind `[loading]="state.infoSubmitting()"` + `[disabled]="!state.infoFormValid() || !state.infoFormDirty() || state.infoSubmitting()"`. Save label changed to `hierarchy.info.actions.saveChanges`. Added `<falcon-angular-popup variant="unsaved">` for info discard prompt. Dropped legacy `[dossier]`/`(fieldChange)`/`(photoChange)`/`(back)` bindings on `<app-org-info-panel>` (panel now pulls state from the facade directly).
- `libs/falcon/src/shared-ui/index.ts` — removed dead re-export `./lib/components/send-credentials-popup/send-credentials-popup.component` (folder doesn't exist; pre-existing barrel breakage unrelated to InfoPanel but blocking the build).
- `libs/falcon/src/language/i18n/{en,ar}.json` — added `hierarchy.info.actions.{editInfo,saveChanges,backToUsers}`, `success.{title,detail}`, `error.{title,loadFailed,saveFailed,duplicateName,nodeNotFound,onlyMainNode}`, `validation.{countryRequiredWhenCity,cityRequiredWhenDistrict,cityRequiredWhenStreet}`, `exitConfirm.{title,body,stay,discard}`, `tooltip.falconOnly`.

## Backend contract (locked, [CODE]-verified)

| Op | Method · Path | Gateway | Body | Response wrapper |
|---|---|---|---|---|
| Load | `GET commerce/information?NodeId={nodeId}` | System Gateway | (query) | `ServiceOperationResult<GetMainNodeInfoResponse>` |
| Save | `PUT commerce/information` | System Gateway | `UpdateMainNodeInfoRequest{NodeId, 17 fields + ProfilePicture}` | `ServiceOperationResult<UpdateMainNodeInfoResponse>` |

References:
- [CODE] `falcon-core-commerce-svc/.../Api/Controllers/InformationController.cs:12-46`
- [CODE] `.../Application/Services/Handlers/UpdateMainNodeInfoHandler.cs:28-118` (Falcon-only `AccountName`+`FinanceId` writes; duplicate-name regex check; address+OfficialData replacement)
- [CODE] `.../Application/Services/Handlers/GetMainNodeInfoHandler.cs:16-93`

**Backend write semantics** (handler-level):
- Falcon-only writes: `AccountName` + `FinanceId` (lines 72-76). Client users sending these are silently ignored.
- Falcon-only duplicate-name check via `NodeQueryHelpers.BuildExactIgnoreCasePattern` against other Main nodes; throws `DuplicateTenantName` (409).
- All users: `AccountId` (writable!), Classification*, ProfilePicture, OfficialData, Address.
- Errors: `UpdateRequestCantBeNull` (400) · `DuplicateTenantName` (409) · `NodeNotFound` (404) · NodeName validation bubbles from `NodeName.Create()`.

## Wire shape

camelCase on both read AND write paths (matches Settings tab Wave 14 discovery — `Microsoft.AspNetCore.Mvc.JsonOptions` global serializer normalises to camelCase even though C# property names are PascalCase). Header note in `models.ts` documents the runtime evidence pattern so the next reviewer doesn't reintroduce PascalCase.

## PES wiring

[CODE] `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts`:
- `FalconAccess.adminConsole.accountProfile.edit()` → `{action:'edit', resource:'sys.account-profile'}` (Falcon admin editing client info)
- `FalconAccess.managementConsole.accountProfile.{view,edit}()` (Client AO editing own account)

Resolved at mount-time via `AccessControlFacade.resolveFlags()` forkJoined with `getInformation()`. Fail-open mitigation if PES returns false (catalog-gap defensive). Falcon-only fields share the SAME PES key today (no separate `.falconAccount.*` key exists yet); FE mirrors the handler check via `canEditFalconOnly` flag on `InfoPesFlags`.

## Visibility rules (defensive UX)

| Selected node | Information panel visible? | Editable? |
|---|---|---|
| Falcon synthetic root | No (`!state.isRootSelected()` guard on info-open) | n/a |
| Client Main node (Aramco) | Yes (slice fires GET on `selectedNode().type === 'client'`) | Yes (PES + Falcon-only fields disabled for Client AO) |
| Sub-node | No (panel hidden via tree-state effect — sub-nodes get `MainNodeOnlyOperation` from backend if reached) | n/a |

## Field map (17 fields × validators × DTO)

| FE field | DTO field | Validator | Edit gate |
|---|---|---|---|
| `accountName` | `AccountName` | `accountNameValidator` | Falcon only |
| `accountId` | `AccountId` | (editable) | All |
| `financeId` | `FinanceId` | `anyStringValidator(2,50,true)` | Falcon only |
| `classificationCategory` | `ClassificationCategory` (enum) | enum dropdown | All |
| `classificationSubCategory` | `ClassificationSubCategory` (enum) | enum dropdown | All |
| `profilePicture` | `ProfilePicture` | image ext/size | All |
| `entityName` | `EntityName` | `anyStringValidator(2,50,false)` | All |
| `authorityLetterType` | `AuthorityLetterType` (enum) | enum dropdown | All |
| `sector` | `Sector` | derived from authority | All (read-only mirror) |
| `budgetNo` | `BudgetNo` | optional string | All |
| `country` | `Country` | lookup id (eagerCountries) | All |
| `city` | `City` | lookup id (eagerCities) | All |
| `district` | `District` | optional string | All |
| `street` | `Street` | optional string | All |
| `buildingNumber` | `BuildingNumber` | optional string | All |
| `postalCode` | `PostalCode` | optional string | All |
| `additionalAddress` | `AdditionalAddress` | `anyStringValidator(2,250,false)` | All |
| `anotherId` | `AnotherId` | optional string | All |
| `vatRegistrationNumber` | `VatRegistrationNumber` | optional string | All |

Cross-field rules (FE-side mirror of handler-level codes): `CountryRequiredWhenCityProvided` · `CityRequiredWhenDistrictProvided` · `CityRequiredWhenStreetProvided` — surfaced as inline error banner when violated.

## Save pipeline

```
save() → validate (formValid + dirty + !submitting + selectedNode.type='client')
       → updateInformation(node.id, formValue, includeFalconOnly)
       → finalize(() => submitting.set(false))
       → next(res): viewModel.set(res.result); snapshot.set(form); mode='view'; toast.success()
                    if AccountName changed → tree.refetchTree()  // updates label everywhere
       → error: errorDialog.openError({httpStatus, errorMessages})
```

## Architecture choices

1. **Body-only component** — header avatar + Edit/Cancel/Save Changes buttons live in the parent `<falcon-node-details-section>` action slot. Mirrors Wave 14 Settings + the existing `infoEditMode` action-slot branch.
2. **Page-scoped slice** with `effect(() => selectedNode())` — auto-reloads on node change, cancels prior in-flight subscription.
3. **`finalize()`-driven submitting** — Save spinner + Cancel lockout reset on every terminal branch.
4. **Single-options-object** for `HttpService.put` — avoids the Wave 11 "shallow-spread context overwrite" trap.
5. **Discard-prompt parking** — tree-click while editing parks the target nodeId, shows `<falcon-angular-popup variant="unsaved">`, completes navigation only on confirm.
6. **camelCase wire** — consistent with Wave 14 Settings tab discovery; documented in models.ts header with reference sample response from DevTools.
7. **Same Uploader in view+edit** — leverages Wave 14b's `[viewMode]` input on `<falcon-photo-uploader>` for theme parity (no native HTML, same chrome).
8. **Back-compat aliases** — `state.infoDossier` aliased to `infoSlice.viewModel` so any legacy template references compile during transition; clean removal in a follow-up.

## Side note — pre-existing build blocker auto-cleared

Build initially failed on a pre-existing dead re-export at `libs/falcon/src/shared-ui/index.ts:22` (referenced `./lib/components/send-credentials-popup/send-credentials-popup.component` which doesn't exist on disk). The file was clean per git (no local mods), so this was an upstream-introduced bug. Removed the dead line to unblock build verification. Also: the falcon-photo-uploader was Tailwind-only refactored by the linter (SCSS deleted, `containerClasses` computed signal), preserving all my Wave 14b view-mode API.

## Trigger phrases

- `Information panel implementation`
- `Wave 15 Info panel`
- `commerce/information endpoint`
- `InfoPanelStateSlice`
- `Edit Info backend integration`

## See also

- [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/02-STEP_1_BASIC_INFO.md` — Wave 8 reference for the 17 fields + cross-field rules
- [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md` — Operation 5 awareness for Settings tab + Operation 1/2 for rename flow (separate concern)
- [VAULT] `Brain SK/_obsidian/30-Validation/V-account-name-format-uniqueness.md`
- [MEMORY] `project_settings_tab_standalone_wave14_2026_05_17.md` — the canonical pattern this slice mirrors
- [MEMORY] `project_settings_tab_camelcase_wire_fix_2026_05_17.md` — wire-shape discovery applied here
