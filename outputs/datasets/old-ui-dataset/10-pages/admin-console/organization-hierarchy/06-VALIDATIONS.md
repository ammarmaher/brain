# Validations — organization-hierarchy

## Add / Edit Node (drawer)
Source: `organization-hierarchy.component.html:108-121` + `organization-hierarchy.component.ts:445-493`.

| Form | Field | Validator | Trigger | Notes |
|---|---|---|---|---|
| Drawer body (template-driven `[(ngModel)]="nodeName"`) | `nodeName` | `maxlength="32"` (HTML attr) | inline | template-driven, no FormGroup |
| Drawer "Save" enablement | `nodeName` | `!nodeName.trim()` (passed as `[disableSave]` to `<app-drawer>`) | computed (template) | save button stays disabled while empty |
| Submit guard | `selectedNode?.label`, `selectedNodeId`, trimmed `nodeName` | `handleDrawerAction()` aborts when any of the 3 are falsy | on save click | no error UI — silently no-ops |

No async validation here (account-name uniqueness is wizard-only, not on sub-node names).

## Create-Client Wizard — Step 0: Information

Source: `create-client-wizard/steps/information-client-step/information-client-step.component.ts:69-395` + `information-client-step.component.html` (not fully read; field-level rules below are inferred from imported directives + service calls).

| Form | Field | Validator | Trigger | Source |
|---|---|---|---|---|
| `form: NgForm` | `accountName` | `falconStartWithLetterMax30` (directive) — start-with-letter + max 30 chars | sync, inline | imported as `FalconStartWithLetterMax30Directive` |
| `form: NgForm` | `accountName` | **async** uniqueness via `falconCheckExists` directive bound to `checkAccountNameExists(name)` (`information-client-step.component.ts:139-141`) | async, debounced | calls `AccountValidationService.checkAccountNameExists(name)` |
| `form: NgForm` | `financeId`, `entityName`, `sector`, `budgetNo`, `district`, `street`, `buildingNumber`, `postalCode`, `additionalAddress`, `anotherId`, `vatRegistrationNumber` | `falconLettersDigitsMax` (directive, configurable max) | sync, inline | imported as `FalconLettersDigitsMaxDirective` — applied per-field via template (max length varies; not visible without reading the .html) |
| `form: NgForm` | `classificationCategory`, `classificationSubCategory`, `authorityLetterType` | dropdown selection via `<p-select>` (no explicit validator beyond bound state) | sync | `Hook<number>` options from `helper.enumToOptions(enum, i18n, translate)` |
| `form: NgForm` | `countryId` (`AutoComplete`) | none in TS — `onCountryClear` resets dependent `cityId` and city list | n/a | drives city load |
| `form: NgForm` | `cityId` (`AutoComplete`) | min 2 chars before fetching cities (line 286-291) | inline | suggestions blanked + loading skipped if query < 2 chars |
| Image upload (Falcon uploader) | `profilePictureInfo` | file MUST start with `image/` MIME (`information-client-step.component.ts:349-352`) + size ≤ 4 MB (`354-358`) | on file pick | alerts with hard-coded English message ("Please select an image file." / "The file is too large. Please select a file less than 4MB.") |

> Validation messages: alerts use raw English strings — **not localized**. New UI must route through `TranslateService` with translation keys.

## Create-Client Wizard — Step 1: Settings

Source: `create-client-wizard/steps/client-settings-step/client-settings-step.component.ts:57-184`

| Form | Field | Validator | Trigger | Source |
|---|---|---|---|---|
| `form: NgForm` (main) | `passwordSecurityLevel` | radio choice — Normal | Advanced (`PasswordSecurityLevel` enum) | sync | `passwordSecurityLevelOptions` array (83-94) — selecting one updates `state.model.settings.passwordSecurityLevel`. Default `Advanced` (line 112). |
| `form: NgForm` | `maxNormalUserLimit`, `maxSystemUserLimit`, `maxNodeLevel` | `<p-inputNumber>` numeric only (PrimeNG built-in) | sync | defaults: 20 / 5 / 0 (line 115-117) |
| `ipForm: FormGroup` | `currentIP` (`FormControl<string>` non-nullable) | `addCurrentIP()` runs `isValidIpv4(ip) || isValidIpv6(ip)` (line 135-138) | on Enter or "Add" click | error key `invalidIp: true` set on the control; translated message via `TranslateService.translate('settingsStep.invalidIpError')` |
| `ipForm: FormGroup` | `currentIP` | duplicate check — case-insensitive `list.some(x => x.toLowerCase() === normalized)` (line 143-146) | on add | error key `duplicateIp: true`; message via `'settingsStep.duplicateIpError'` |
| IP-list state | `allowedIPs[]` | array (no explicit "min items" — empty arrays accepted) | n/a | seeded default `['192.168.0.1', '95.158.55.17']` |
| `ipInputError` field | clears on any subsequent `currentIPInput.valueChanges` | reactive | `takeUntilDestroyed(this.destroyRef)` subscription |

Deletion confirmation: `removeIP(ip)` (line 167-182) opens `<p-confirmDialog>` with message `confirm.deleteIp`.

## Create-Client Wizard — Step 2: Comm Channels

Source: `create-client-wizard/steps/comm-channels-step/comm-channels-step.component.ts:35-171`

| Form | Field | Validator | Notes |
|---|---|---|---|
| `form: NgForm` | per-service `visibility` toggle | none — boolean | turning OFF clears `priceType` + `priceValue` (line 131-137) — guarantees you can't ship a "hidden but priced" config |
| `form: NgForm` | per-service `priceType` (`<p-select>`) | required if `visibility === true` (enforced by `FalconFormValidateDirective` in template — inferred; not directly visible in TS) | options from `PricingType` enum |
| `form: NgForm` | per-service `priceValue` (`<p-inputNumber>`) | required if `visibility === true` | numeric; clears on visibility off |
| `form: NgForm` | per-service `status` | display-only — value comes from backend (`ChannelStatusToString[ChannelStatus.Inactive]` for newly-mapped services) | not editable on this step |

## Create-Client Wizard — Step 3: Applications

Same as Step 2 — `client-application-step.component.ts:36-174` is structurally identical (just uses `ApplicationApiService` instead of `CommunicationChannelApiService`).

## Create-Client Wizard — Step 4: Account Owner

Source: `account-owner-step.component.ts:68-213`

| Form | Field | Validator | Trigger | Source |
|---|---|---|---|---|
| `form: NgForm` | `firstName`, `lastName` | `falconLettersDigitsMax` directive | sync | from `FalconLettersDigitsMaxDirective` |
| `form: NgForm` | `userName` | `falconUsernameFormat` directive — username syntax | sync | from `FalconUsernameFormatDirective` |
| `form: NgForm` | `userName` | **async** uniqueness via `falconCheckExists` bound to `checkUsernameExists(username)` (`account-owner-step.component.ts:91-96`) | async, debounced | calls `AccountValidationService.isUserExist(username, email, phoneNumber)` |
| `form: NgForm` | `password` | auto-generated (read-only on UI) via `userApiService.generatePassword(passwordSecurityLevel)` (line 191-211) | regenerated on `ngOnChanges(state)` | uses Step 1's `passwordSecurityLevel` |
| `form: NgForm` | `nationalId` | `falconLettersDigitsMax` directive | sync | |
| `form: NgForm` | `phoneNumber` | `<falcon-mobile-number>` component (E.164 / country-code aware) | sync | from `FalconMobileNumberComponent` |
| `form: NgForm` | `emailAddress` | regex match `FALCON_PATTERNS.EMAIL_STRING` (line 89) | sync | from `@falcon` constants |
| `form: NgForm` | `role` | `<p-select>` from filtered `roleOptions` — only `AccountOwner | NodeAdmin | NormalUser` (line 121-129) | sync | default `AccountOwner` (line 101-103) |
| Image upload | `accountOwnerProfilePictureInfo` | image-only + ≤ 4 MB (line 146-156) | on file pick | same alert-based UX as Step 0 |

Profile-picture deletion uses `<p-confirmDialog key="deleteAccountOwnerPicture">` with `accountOwnerStep.deleteConfirmMessage` key (line 175-189).

## Hierarchy Tab — Information edit mode

Source: `hierarchy-tab.component.ts:239-298` + `information.component.ts:59-428`

| Form | Field | Validator | Trigger | Source |
|---|---|---|---|---|
| `infoForm: NgForm` | `accountName` | `falconStartWithLetterMax30` directive | sync | template binds `falconStartWithLetterMax30` |
| `infoForm: NgForm` | other text fields | `<p-inputText>` defaults (no extra validators in TS) | sync | |
| `infoForm: NgForm` | `country` / `city` autocompletes | min 2 chars before fetch (city); selection-on-pick (`onCountrySelected` / `onCitySelected`) | inline | `LookupService.getLookup(LOOKUP_IDS.City, { name, code: countryCode })` |
| Save guard | `form.valid === true` | on save click (`onSave(form)` at line 254-266 marks all controls as touched if invalid then returns) | sync | |
| Save guard | `selectedNodeId !== null` | (line 268-270) | sync | |
| Save guard | `canEditAccountProfile` PES flag | (line 255-257) | sync | |
| Profile picture | same image-only + 4 MB rule via `FalconUploaderComponent`'s onFilesSelected | inline | mirrored from wizard steps |

## Settings tab (node)

Source: `node-settings-tab.component.ts:54-347`

| Form | Field | Validator | Trigger | Source |
|---|---|---|---|---|
| `settingsForm: NgForm` | `passwordSecurityLevel` | radio — Normal | Advanced | sync | gated by `canEditPasswordSecurityLevel` |
| `currentIPInput: FormControl<string>` | IP | `isValidIpv4 || isValidIpv6` (line 271-277) | on Enter / Add click | error key `invalidIp` |
| `currentIPInput: FormControl<string>` | IP | duplicate check, case-insensitive (line 282-288) | on Enter / Add click | error key `duplicateIp` |
| `settingsForm: NgForm` | quota fields (`maxNormalUserLimit`, `maxSystemUserLimit`, `maxNodeLevels`, `balanceTransferLimitPercentage`) | `<p-inputNumber>` numeric only — no min/max in TS | sync | quotas saved as part of `QuotaSettingsDto` |
| Save guard | `canEditSelectedSettings` (composite PES) | on save click (`onSaveSettings` at line 216-253) | sync | aborts before HTTP call |
| Save guard | `selectedNodeId !== null` | (line 221-223) | sync | |

IP removal: `removeIP(ip)` opens `<p-confirmDialog>` with `confirm.deleteIp` (line 312-330).

## Apps & Services tab (inline edit)

Source: `apps-services-tab.component.ts:430-540`

| Form | Field | Validator | Trigger |
|---|---|---|---|
| inline edit (`editPriceType` mode) | `editingPriceType` (`PricingType | null`) | required (null aborts save with translated `'appsServices.messages.requiredFields'` warning toast) | on save click |
| inline edit (`editPriceType` mode) | `editingEffectiveDate` (`Date | null`) | required | on save click |
| inline edit (`editPriceValue` mode) | `editingPriceValue` (`number | null`) | required (null/undefined aborts) | on save click |

Same logic mirrored in `comm-channels-services-tab.component.ts:433-543`.

## Business rules captured in code (cross-field / dynamic)

1. **Service visibility & pricing are coupled** (wizard step 2 & 3 + apps/comm-channel tabs): toggling visibility OFF clears `priceType` and `priceValue` (`comm-channels-step.component.ts:131-137`, `client-application-step.component.ts:134-140`). Filtering on submit: `buildWizardModel()` (`create-client-wizard.component.ts:335-355`) sends ONLY services with `visibility === true`.

2. **Password regenerates on settings change** (wizard step 4): `AccountOwnerStepComponent.ngOnChanges(state)` (line 108-112) calls `checkAndGeneratePassword()` whenever state changes — so flipping password-security in Step 1 immediately regenerates the Step 4 password.

3. **Username normalization on submit**: `CreateClientWizardComponent.buildWizardModel()` (`create-client-wizard.component.ts:350-354`) lowercases + trims `userName` before sending.

4. **Settings save only valid for root or main-node**: `NodeSettingsTabComponent.canEditSelectedSettings` (`node-settings-tab.component.ts:129-134`) forces settings-edit OFF when the selected node is neither root NOR first-level. Effectively prevents an admin from editing settings on a 2nd-level-or-deeper sub-node from this UI.

5. **City autocomplete depends on country code** (`information-client-step.component.ts:270-315`): if no country is selected → cities list is cleared. If country exists but query has 1 char → suggestions are blanked (must type ≥ 2 chars). This is a UX rule, not a validator.

6. **City reset on country change** (`information-client-step.component.ts:235-252` + `information.component.ts:228-245`): selecting a new country wipes `cityId`, `selectedCity`, `citiesAll`, `citySuggestions` and triggers a fresh `loadCities('')`.

7. **Tree-action visibility per PES + node-type** (handled by `<falcon-organization-hierarchy-tree>` internally — see memory entry `project_org_hierarchy_tree_shared_component.md`): the tree library applies `FalconAccess.managementConsole.accountHierarchy.view()` checks per-mode; this admin-console feature relies on the library's PES gating for tree-internal actions.

8. **Order polling has a hard upper bound**: `simplePoll.watch({ intervalSeconds: 2, maxDurationMinutes: 30, shouldStop: ... })` — payment polling auto-aborts after 30 minutes (`apps-services-tab.component.ts:883-887`, `comm-channels-services-tab.component.ts:895-899`).

9. **Allowed-actions are authoritative server-side** (`apps-services-tab.component.ts:724-737`): `visible: (row) => row.allowedActions?.includes(actionEnum)`. The frontend NEVER hides an action client-side based on `canDo*` flags — it trusts the backend to populate the array per-row, per-user.

## Validation directives summary (from `@falcon`)

| Directive | Use sites | Behavior (inferred from name + imports) |
|---|---|---|
| `FalconFormValidateDirective` | All wizard step forms + settings tab + information view | Wires `NgForm`/`FormGroup` to a Falcon-style validation system (likely emits validity events to the wizard host) |
| `FalconStartWithLetterMax30Directive` | `accountName` in wizard step 0 + info view | First char must be a letter; max 30 chars |
| `FalconLettersDigitsMaxDirective` | Most text fields in wizard | Letters + digits allowed, configurable max length |
| `FalconCheckExistsDirective` | `accountName` (wizard 0), `userName` (wizard 4) | Async uniqueness validator with a function input |
| `FalconUsernameFormatDirective` | `userName` (wizard 4) | Username-format validator (likely lowercase + no special chars) |
| `FalconIpAddressDirective` | wizard step 1 + settings tab IP input | IPv4/IPv6 format check (the wrapper that ties `isValidIpv4` / `isValidIpv6` to a control) |
| `FalconMobileNumberComponent` | wizard step 4 phone, account-owner phone | International phone-number input with country-code handling |
| `WizardStepFormDirective` | each wizard step's `form: NgForm` | Bridges the step's form into the wizard host's tracking |

## Toast / message system
- Most success/error messages use PrimeNG `MessageService` with translated `severity: 'success' | 'error' | 'warn'`. Each tab provides its own `MessageService` instance (`providers: [MessageService]` on the component decorator) to avoid cross-tab message leakage.
- Notable hard-coded English fallbacks (NOT localized — flag for cleanup):
  - `'Action completed successfully'`
  - `'Failed to complete action'`
  - `'Visibility updated successfully'`
  - `'Pending price type deleted successfully'`
  - `'Failed to delete pending price type'`
  - `'Order ID not found in response'` (thrown error)
  - `'Payment failed'`, `'Payment or order status check failed'` (assignment to `errorMsg`)
