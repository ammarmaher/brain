---
name: project-info-panel-validation-parity-2026-05-21
description: Info Panel (admin-console org-hierarchy edit) now mirrors Add Client Step 1 validation architecture — fieldErrorMessage + rules-map + touched-set + async account-name uniqueness with self-edit exception. 2026-05-21 build hash 7c111fd241972a8e (26.6s).
metadata: 
  node_type: memory
  type: project
  originSessionId: 49ed9f2b-3541-498c-9d9f-c3c6e7f971aa
---

# Info Panel validation parity with Add Client Step 1 — 2026-05-21

🟢 BUILD-GREEN 2026-05-21 admin-console `7c111fd241972a8e` (26.6s).

User asked to apply Add Client Step 1's validation architecture to the Information page (BMW screenshot, edit mode). Account Name had a red asterisk but no client-side feedback; 9 other free-text fields had **zero** inline validation rendering.

## What changed (3 files, admin-console only)

[CODE] `apps/admin-console/.../falcon-org-info-panel/falcon-org-info-panel.component.ts`:
- Imports: dropped `hasLiveError`, `messageFor`, `anyStringValidator`; added `effect`, `signal`, `untracked`, `toObservable`, `toSignal`, `of`, `catchError`, `debounceTime`, `distinctUntilChanged`, `finalize`, `switchMap`, `AccountValidationService`, `fieldErrorMessage`
- Added `touched = signal<Set<string>>(new Set())` + `onBlur(field)` handler
- Added async account-name uniqueness pipeline (mirror of [CODE] `client-information-step.component.ts:117-140`) with **self-edit exception** — `switchMap` short-circuits when `name === viewModel().accountName.trim()` (returns `of(false)` without backend hit). Without this, the field would flag "already in use" on its own current value.
- Replaced `accountNameError` + `financeIdError` (used `hasLiveError + messageFor` directly — silently bypassed the rule map's 2-50 caps) with canonical `fieldErrorMessage(this.formValue(), 'fieldKey', this.rules, this.touched())` computeds
- Added 9 new field error computeds: `entityNameError`, `districtError`, `streetError`, `buildingError`, `postalError`, `addressExtraError`, `anotherIdError`, `vatError`, `budgetNoError`
- Two `effect()` blocks in constructor: (1) push `accountNameCheckPending` + `accountNameTaken` into slice for `formValid` gating, (2) reset touched-set on edit-mode exit
- Public `revealErrors()` method (11 keys) for parent action-slot to call on invalid Save

[CODE] `apps/admin-console/.../falcon-org-info-panel/signals/info-panel-state.signals.ts`:
- Added two writable signals: `accountNameCheckPending` + `accountNameTaken`
- `formValid` computed now ANDs them in **only when `pesFlags().canEditFalconOnly` is true** (client AO never edits Account Name → async check is a no-op for them)
- Save Changes button gate `[disabled]="!state.infoFormValid()"` at page-menu line 207 picks up the async gate automatically (zero template churn)

[CODE] `apps/admin-console/.../falcon-org-info-panel/falcon-org-info-panel.component.html`:
- Account Name field: wrapped in `<div class="relative w-full">` to host the async pending spinner (3×3 px, animate-spin, teal-600, `aria-label="hierarchy.addClient.checking"`); spinner only renders when `pesFlags().canEditFalconOnly && accountNameCheckPending()`
- Finance ID, Entity Name, District, Street, Building, Postal, Additional Address, Another ID, VAT, Budget No: added `[state]="xError() ? 'error' : 'default'"` + inline `<span class="text-[11px] text-falcon-red-500 mt-0.5">{{ xError()!.key | translate: (xError()!.params ?? undefined) }}</span>` + `(blur)="onBlur('x')"`
- Account ID (system identifier) kept disabled — never editable
- Dropdowns (Class Cat/Sub, Authority, Country, City) kept unchanged — Step 1 doesn't validate dropdown selection either (option list constrains)

## Files NOT touched (constraint respected)

- `validations/validations.ts` — rules map already correctly set up (mirror of Step 1: `accountName: [accountNameValidator]`, `financeId: [requiredString]`, all 9 optionals as `[optionalString]` or `[optionalLongString]`). Field keys MUST match `InfoFormValue` shape (e.g. `buildingNumber` not `bldg`, `postalCode` not `postal`, `additionalAddress` not `addressExtra`, `vatRegistrationNumber` not `vat`) — that's the only naming delta vs Step 1 and it's owned by the slice's `InfoFormValue` interface.
- All Add Client Step 1 files (canonical SoT — read-only)
- Management-console `falcon-org-info-panel` files (mgmt-console intentionally forces `canEditFalconOnly=false` → Account Name + Finance ID always read-only there; the existing computeds gate on `pesFlags.canEditFalconOnly` so applying the same component-level changes to mgmt would be wasted code paths)
- i18n JSON — reused existing Step 1 keys: `hierarchy.validation.minLength`, `.maxLength`, `.required`, `.duplicateAccountName`, plus `hierarchy.addClient.checking` for the spinner aria-label

## Rules emitted (system-wide)

1. **Slice owns async-aware `formValid`; component drives it via effect.** When sync rule-map validation is insufficient (async uniqueness, async backend checks), expose writable bool signals on the page-scoped slice and push from the component via `effect()` + `untracked()`. The slice's `formValid` computed ANDs them in, and any existing `state.*FormValid()` consumer (parent action-slot Save button) automatically benefits with zero template changes.

2. **Self-edit exception for async uniqueness on Edit screens.** When applying Add Client Step 1's `accountNameTaken` pattern to an Edit surface, the `switchMap` MUST short-circuit when the typed value equals the persisted original (`viewModel().accountName.trim()`) — read via `untracked(() => ...)` to avoid creating a dependency on the view model. Without this, the user gets "Account name already in use" on the value the account already has.

3. **`fieldErrorMessage()` over hand-rolled `hasLiveError + messageFor`.** The canonical helper consumes the DI rule map and respects the `LIVE_ERROR_KEYS` gate at [CODE] `libs/falcon/.../messages.ts:49-65`. Component-local validators bypass the rule map's Excel-aligned caps (Validation.xlsx 2026-05-21 ref-#21/#29/#34/#38-44 → 2-50 chars on every free-text input) and emit different keys than the i18n catalog expects. Use `fieldErrorMessage(value, fieldKey, this.rules, this.touched())` for every sync field error.

4. **Touched-set reset on edit-mode exit.** When a slice owns mode transitions (loading / view / edit) and the form is reusable across multiple selections, the component's `touched` set MUST reset when leaving edit mode (`effect(() => { if (!this.isEditMode()) untracked(() => this.touched.set(new Set())); })`). Otherwise a prior submission's blurred-state leaks into the next edit pass and immediately reveals "required" errors before the user has interacted.

5. **Async gates gate on capability, not just on form state.** The slice's `formValid` AND-s in the async pending+taken signals **only when `pesFlags().canEditFalconOnly` is true** — client AO operators never edit Account Name, so for them the async pipeline is dead weight and the gate is a no-op.

## Verification posture

Per [VAULT] `Brain Outputs\datasets\authority-dataset\VERIFICATION-STATUS.md` (FE blocker: 40+ pre-existing Stencil errors prevent `nx serve`), **build-green is the acceptable evidence**. Runtime browser verification is NOT claimed. Build: `npx nx build admin-console` → GREEN, hash `7c111fd241972a8e`, 26639 ms, 0 new errors.

## See also

- [[project_add_node_validation_message_realign_2026_05_21]] — sister fix (Add Node drawer) that surfaced the same canonical `ValidationMessage{key,params}` + `| translate: params` pattern
- [[feedback_falcon_ui_core_layout_traps]] — Falcon UI Core layout / token override rules
