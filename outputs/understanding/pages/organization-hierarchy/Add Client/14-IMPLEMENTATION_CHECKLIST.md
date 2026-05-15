*** Add Client — Implementation checklist + verification gate ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Add Client — Implementation checklist (FE + BE) + verification gate

> Pre-code checklist that a session must run through before writing a single line of Add Client code. Plus the 8-question verification gate that confirms enough context has been loaded.

## Verification gate (before producing code)

A session has not loaded enough context until it can answer:

1. **Which PRD lines does this flow implement?** (Answer in [00-OVERVIEW](00-OVERVIEW.md) source-of-truth pointers · PRD-01 W1, BR-AM-03→BR-AM-19; PRD-02 W1 for Step 5.)
2. **Which backend endpoint will I call?** (Answer in [08-BACKEND_API](08-BACKEND_API.md) · `POST /api/Node/create-account` via System Gateway.)
3. **What is the exact request DTO shape?** (Answer in [08-BACKEND_API](08-BACKEND_API.md) composite payload + [02→06] per-step field tables.)
4. **What validation will the backend enforce?** (Answer in [07-VALIDATIONS](07-VALIDATIONS.md) `[ThrowIf*]` summary + cross-field rules.)
5. **What V-rule wiki-links apply?** (9 V-rules listed in [07-VALIDATIONS](07-VALIDATIONS.md) Related V-rules table.)
6. **What Falcon components am I composing?** (Answer in [09-COMPONENTS](09-COMPONENTS.md) component table.)
7. **Which permission roles can run this flow?** (Answer in [01-PERMISSIONS](01-PERMISSIONS.md) · Falcon System Admin + Product only.)
8. **What entity drift do I need to handle?** (Answer in [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) · 14 honest SoT surprises.)

Answers must have **citations**. Drill until each question has one.

## Full-stack implementation checklist (FE + BE)

- [ ] Read this playbook end-to-end before writing a single line of code.
- [ ] Confirm `CreateAccountRequest` shape against current `Brain Outputs/understanding/backend/commerce/DTO_DICTIONARY.md` — drill into the `Info` nested type (~20 fields) and the `Service` nested type used by Steps 3/4 to confirm every field name.
- [ ] Confirm Commerce JSON casing at runtime (`PascalCase` per Commerce `FRONTEND_CONTRACT.md`; framework default may be camelCase — test before relying on case).
- [ ] Apply all 9 V-rules listed in "Related V-rules" ([07-VALIDATIONS](07-VALIDATIONS.md)).
- [ ] Honor [[Falcon Roles Permission Matrix]] permission gate at the entry-point button (hide for non-allowed roles via PES); rely on backend `[Authorize]` + PES policy at the gateway as the security boundary.
- [ ] Test every error state in the Error states table ([12-ERROR_STATES](12-ERROR_STATES.md)).
- [ ] Confirm Step 5 Kafka chain (`UserCreationRequested → Identity → AO user created → credentials delivered per DeliveryMethod`). Negative test: introduce a Kafka delivery failure and confirm the partial-failure UX.
- [ ] Confirm initial wallet topology creation (`WalletConfigured → Charging → Master Wallet materialized`).
- [ ] Handle Q-UM-12 (Password Security Level enum vocabulary drift): submit backend codes (`Low/Medium/High/Strict`), display PRD labels (`Normal/Advanced`), until Q-UM-12 resolves.
- [ ] Handle the `Username` cap drift: enforce PRD cap of 30 chars on FE despite backend allowing 100.
- [ ] Use the **System Gateway** (Falcon admin) base URL, NOT the Core Gateway (client-facing). The path transform is `/commerce/*` → `/api/*`.
- [ ] Implement wizard as composite-submit (one POST on Step 5 Submit), not per-step submission.
- [ ] Implement the conditional `Visibility ↔ Pricing` reactive-form wiring on every row of Steps 3 + 4 (the central V-rule of those steps).
- [ ] Pre-load master catalogs at wizard open: `GET /api/CommunicationChannel`, `GET /api/Application`, `GET /api/Lookup/{id}` for country/city/sector.
- [ ] Auto-uniqueness checks: Account Name (Commerce `ValidateAccountName`) and Username (Identity `/user/exist`) with 300 ms debounce + cancel-on-input.
- [ ] App-level wrapper pattern: implement under `apps/admin-console/.../add-client/`; consume pure-presentational library skeletons from `libs/falcon-ui-core/`. Wrapper owns the HttpClient calls; skeleton owns the UI.
- [ ] Tailwind utilities only (no SCSS, no component CSS, no PrimeNG) per project standing rules.
- [ ] Multi-language: respect `MultiLanguage(En, Ar)` for catalog reads (CommChannel.Name, Application.Name); user-entered Account Name is single-language (intentional deviation).
- [ ] Pre-finish grep gate: no inline styles, no hardcoded color/spacing/radius values — tokens only.
- [ ] Build green (`nx build` zero errors) before declaring done; standing rule per project memory.

## Frontend-only checklist

- [ ] Read [00-OVERVIEW](00-OVERVIEW.md), the step file matching the work, [07-VALIDATIONS](07-VALIDATIONS.md), [09-COMPONENTS](09-COMPONENTS.md), [12-ERROR_STATES](12-ERROR_STATES.md).
- [ ] Pick Falcon components from [09-COMPONENTS](09-COMPONENTS.md) — follow customization order (inputs → templates → slots → variants → upgrade → new lib component → wrapper → raw HTML as GAP).
- [ ] Implement step forms with Angular Reactive Forms; one FormGroup per step, composed into a wizard-state container.
- [ ] Wire cross-field validators per step (Step 1 country/city/district/street; Steps 3+4 Visibility↔Pricing).
- [ ] Wire async uniqueness checks (300 ms debounce + cancel-on-input).
- [ ] Render error toasts via [[Falcon Notification]] for cross-cutting failures; inline errors for per-field failures.
- [ ] Hide the entry button via PES guard (and rely on backend `[Authorize]` + PES at gateway as the actual gate).
- [ ] Honor Tailwind-only token rule (no SCSS, no inline styles, no hardcoded values).
- [ ] Verify PascalCase serialization at runtime against the live Commerce response.

## Backend-only checklist

- [ ] Read [00-OVERVIEW](00-OVERVIEW.md), [08-BACKEND_API](08-BACKEND_API.md), [07-VALIDATIONS](07-VALIDATIONS.md), [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md), [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md), [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md).
- [ ] Confirm `CreateAccountRequest` shape in Commerce `DTO_DICTIONARY` matches the composite payload in [08-BACKEND_API](08-BACKEND_API.md).
- [ ] Confirm class-level `[Authorize]` on `NodeController` + PES policy mirrors the Permission sheet.
- [ ] Confirm Commerce `JsonOptions` serializes PascalCase on the wire (the FE relies on this).
- [ ] Validate cross-field handler logic (Country↔City, City↔District, City↔Street, Visibility↔Pricing).
- [ ] Validate the 4 Kafka event publishers fire on submit (`UserCreationRequested`, `WalletConfigured`, `IdentitySettingsSync`, `TenantIpAllowlistChanged`).
- [ ] Validate the partial-failure path: Account is created, Identity hop fails — confirm the error code surfaces back to the wrapper response or via a follow-up endpoint.
- [ ] Add missing `[ThrowIfNotPassed]` attributes on `PhoneNumber` / `EmailAddress` if you own that PR (cosmetic — handler validates).
- [ ] Document the per-field `Info` enumeration in `DTO_DICTIONARY.md` (gap noted in [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)).
- [ ] Document the `Service` nested type's full field list in `DTO_DICTIONARY.md` (only `AppId, PriceType` enumerated today).

## Pre-finish grep gate

Before declaring done, grep for:

- [ ] No inline `style="..."` attributes in any touched template.
- [ ] No hardcoded color hex / spacing px / radius values — tokens only.
- [ ] No `import { PrimeNG... }` in any touched file (Falcon UI Core only).
- [ ] No SCSS file additions (Tailwind utilities only).
- [ ] No `Validators.maxLength(100)` on Username — must be 30 per PRD cap.

## Build verification

- [ ] `nx build admin-console` zero errors.
- [ ] `nx build host-shell` zero errors (if touched).
- [ ] `nx build management-console` zero errors (if touched).
- [ ] All linting clean.

## Done definition

Add Client implementation is **done** when:

1. All 8 verification-gate questions can be answered with citations.
2. Full-stack checklist + per-track checklist boxes are ticked.
3. Pre-finish grep gate passes.
4. All 3 builds green.
5. All error states from [12-ERROR_STATES](12-ERROR_STATES.md) tested.
6. Kafka chain (Step 5) tested end-to-end with at least one negative path (downstream failure).

## See also (Add Client folder)

- [README](README.md) — folder index
- [00-OVERVIEW](00-OVERVIEW.md)
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md)
- [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md)
- [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md)
- [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md)
- [06-STEP_5_ACCOUNT_OWNER](06-STEP_5_ACCOUNT_OWNER.md)
- [07-VALIDATIONS](07-VALIDATIONS.md)
- [08-BACKEND_API](08-BACKEND_API.md)
- [09-COMPONENTS](09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[Falcon Roles Permission Matrix]] · [[Commerce Service]] · [[Identity Service]] · [[Charging Service]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[COMPONENT_INDEX]] · [[API_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
