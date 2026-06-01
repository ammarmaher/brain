---
name: Add Client wizard mastery
description: Brain-loaded comprehensive map of the Add Client 5-step wizard — DI scoping, signal lifecycle, eager forkJoin, WizardStepHost, wire-builder, FIELD_LEVEL_ERROR_MAP, async-uniqueness untracked() pattern, HTTP-context merge fix, 13 PRD↔backend drifts, 25+ bug hotspots, partial-failure trap. Trigger: "Add Client wizard" / "add client bug" / any work touching apps/admin-console/.../add-client-wizard/
type: project
originSessionId: 5e50e62a-ea70-4b24-8f40-e472b0122d46
---
# Add Client Wizard — Mastery Snapshot (2026-05-17)

**Location:** `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/` (29 files in folder).

## Architecture in one sentence

A 5-step composite wizard where Steps 1-4 are client-side buffered and Step 5 fires ONE `POST /commerce/Node/create-account` via System Gateway that creates 5 DB entities + 4 Kafka events (user/wallet/identity-sync/ip-allowlist).

## DI scoping (most important fact)

- **PAGE-scope** — `AddClientWizardSignalsService` (in `HIERARCHY_PAGE_STATE_PROVIDERS`): `addClientOpen`, `eagerCountries/Cities/CommChannels/Apps`, `lastGeneratedPassword`, popup states. Survives wizard open/close.
- **WIZARD-scope** — 5 per-step signal services (in `ADD_CLIENT_WIZARD_PROVIDERS` array on the wizard component): `value/valid/dirty/revealed`. Destroyed on close, fresh on reopen → pristine-state-on-reopen is purely Angular DI lifecycle, NO explicit reset cascade.

## Eager forkJoin (Wave 6.1)

ONE `forkJoin` on `addClientOpen` false→true firing 5 parallel calls (`generatePassword`, `getLookup(Country)`, `getLookup(City)`, `listCommunicationChannels`, `listApplications`). Each has `catchError → of(empty)`. Reset on close. Per-step nav = zero new XHR.

## WizardStepHost contract

Every step implements `revealErrors()`. Wizard calls it via `viewChild(StepComponent)` when forward nav blocked. Step 3+4 delegate to inner `ClientServiceRowTableComponent.revealAllRowsErrors()` which **also requires a shallow-copy of rows array** to force OnPush re-render (Wave 7 Agent J fix).

## FIELD_LEVEL_ERROR_MAP

`models/models.ts` maps ~40 backend codes → `{step:1..5, field}`. Wizard's `effect()` on `backendErrors()` input jumps to LOWEST-numbered offending step and reveals errors.

## Wire builder

`buildCreateAccountWireRequest()` in `models/wire-builders.ts` maps form-state (`T | null` after Wave 7) → `CreateAccountRequest` PascalCase DTO with defensive `?? ''` / `?? 0` / `?? Normal` fallbacks on required slots. Lookup-based fields (country/city) store ID strings (not display labels). `deliveryMethod` mapped from UI `'email'|'sms'|'both'` to enum int (1/2/3) via `toDeliveryMethodEnum`.

## Async uniqueness — untracked() pattern (Wave 4.1)

Account-name (Step 1) + Username (Step 5) both use `toObservable → distinctUntilChanged → debounceTime(300) → switchMap` with **every `.set()` call wrapped in `untracked()`** to break the signal tracking context. Removing `untracked()` causes infinite loops (NG0600). Async-pending blocks Next forward nav.

## HTTP context merge (FE-DRIFT-01, v1.3.0)

`client.service.ts:createClientFull` uses `withMessagesOn(useGateway(SystemGateway).context, {success: msg})` — NOT shallow spread of two `{context}` objects (which clobbers gateway context → request goes to `localhost:4200/commerce/...` → 404).

## Submit flow

Step 5 "Create" → `submit.emit(payload)` → parent menu `openSendingCredentials(payload)` → SendingCredentials dialog → operator picks delivery method → `submitCreateAccount` → wire build → POST → success branches into `lastGeneratedPassword.set + lastCreatedClientId.set + completionSuccessOpen.set(true)` → 10s auto-dismiss → `tree.refetchTree()` + select new node. Failure routes errors into `AddUserStateSlice.wizardBackendErrors` (shared with Add User wizard via mutual-exclusion in template).

## Bug hotspots — top 10 by severity

1. **Eager seed-once flag race (B5)** — if `eagerCommChannels` arrives after user toggles a Step 3 row, the seed effect overwrites the toggle.
2. **Step 1 missing cross-field Country↔City↔District↔Street** — wizard does NOT block Next when `street` typed without `city`; backend rejects with 400 on submit.
3. **Partial Kafka failure (G3)** — Account created server-side but AO user Kafka chain fails. Backend may return success. No clean rollback. Wizard cannot retry AO creation.
4. **Submit when other step invalid (H3)** — `onNext()` only checks `isCurrentStepValid()`. Wire builder defensively coalesces null. POST goes out with `?? ''` / `?? 0` fallbacks.
5. **`viewChild` race on backend-error step jump (H1)** — `currentStep.set(targetStep)` + `markStepRevealedAndReveal(targetStep)` in same microtask; viewChild may not yet be populated.
6. **Row-table langTick (J2)** — column headers re-translate only on FIRST `i18n.get(...)` resolve; lang change post-mount won't re-translate.
7. **Sending Credentials → close-mid-confirm** — Two parked states (`pendingSubmitPayload` + `ipPendingDelete`) can survive wizard close in edge cases.
8. **CommChannel catalog endpoint speculative** — `commerce/CommunicationChannel` not backend-confirmed (Q-BACKEND-Q6). Silent empty fallback.
9. **PasswordSecurityLevel vocabulary drift (Q-UM-12 HIGH)** — PRD `Normal/Advanced` vs backend `Low/Medium/High/Strict`. Wire sends `Normal/Advanced` enum int; verify at runtime.
10. **Username 30↔100 cap drift (HIGH)** — FE enforces PRD's 30; backend's FluentValidation cap 100 won't reject.

## Recent waves (don't unwind without reading the comment)

- Wave 3 R2 (HTTP context fix, Lookup-driven country/city, empty default IP list)
- Wave 4 (new falcon-angular-stepper + WizardStepHost + FIELD_LEVEL_ERROR_MAP)
- Wave 4.1 (untracked() async fix)
- Wave 4.2 (server-generated password + readonly Step 5 password field)
- Wave 5.1 (validations/ per-step files via DI token + provider)
- Wave 5.2 (Sending Credentials + Completion Success popups + lastCreatedClientId)
- Wave 6.1 Agent H (eager 5-stream forkJoin)
- Wave 6.2 Agent I (per-step services moved to wizard-scope DI)
- Wave 7 Agent K (T | null widening, no preselected radios/numbers/labels)
- Wave 7 Agent J (row-table OnPush re-render fix via rows shallow-copy)
- Wave 8 (IP delete confirm + Falcon radio cards)

## Permission gate (✋ runtime-verified 2026-05-16)

PES key `sys.account/add` allow for `sys-admin` + `sys-products` only. Three-layer enforcement: FE visibility (button hide) + PES at System Gateway + backend `[Authorize]` on `NodeController`.

## Falcon components composed

falcon-angular-stepper, falcon-angular-popup, falcon-angular-button, falcon-angular-input, falcon-angular-input-number, falcon-angular-dropdown, falcon-angular-radio, falcon-angular-tag, falcon-angular-switch, falcon-angular-data-table, falcon-angular-status-badge, falcon-angular-password, falcon-angular-phone-field, falcon-angular-alert-dialog, falcon-angular-sending-credentials-dialog, falcon-form-field, falcon-photo-uploader, falcon-angular-saudi-riyal-icon.

## When invoked — diagnostic playbook

1. Identify symptom layer (validation / DI / async / submit / partial-failure / layout / i18n).
2. Read this snapshot's hotspot table → file:line.
3. Read [BRAIN-OUT] `Add Client/13-GAPS_AND_DRIFTS.md` for drift context.
4. Read [BRAIN-OUT] `Add Client/12-ERROR_STATES.md` for error→UX mapping.
5. HALT-AND-FLAG before changes touching: DI scoping / untracked() pattern / HTTP context merge / Wave 7 null widening / any known drift.
6. FE-runtime verification blocked on workspace Stencil/Angular compile errors (per VERIFICATION-STATUS.md) — can read code, cannot serve UI.

## Source-prefix legend used

- [CODE] file:line in `apps/admin-console/.../add-client-wizard/`
- [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/<file>.md`
- [VAULT] `falcon-wiki/...`
- [MEMORY] memory file in `~/.claude/projects/C--Falcon/memory/`
- [INFERRED] flagged for sanity-check
