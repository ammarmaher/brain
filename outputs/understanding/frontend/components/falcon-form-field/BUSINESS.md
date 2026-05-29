# falcon-form-field — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[PRD]` `[INFERRED]`.

> **Legacy bespoke component.** `<falcon-form-field>` is a pre-Wave-5 Angular-only wrapper at `libs/falcon/src/shared-ui/`. It has no Stencil twin. New Falcon UI inputs carry their own `label`/`errorMessage`/`required` — this component is for legacy maintenance and non-Falcon controls only. Status: NEEDS-DEPRECATION (`DECISION.md`).

## Business purpose
`[BRAIN-OUT]` `<falcon-form-field>` exists to give a form field a **consistent labeled-row identity**: a translated label, a required-asterisk, a slot for the actual control, and a single place for the field's helper hint or validation error. In business terms it is how a wizard renders every field with the same "label / control / message" rhythm so an operator scans a form predictably and always knows which field is required and which field is wrong.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Required fields must be visually marked | `[CODE]` `falcon-form-field.component.html:9-11` | `required` input renders a red asterisk (`text-falcon-red-500`) next to the label. |
| A field's validation error must be shown to the operator | `[CODE]` `falcon-form-field.component.html:20-24` | `errorKey` (an i18n key) renders below the control as red text; `errorParams` interpolates limits (e.g. `{ max: 30 }`). |
| User-facing text is translation-keyed (En/Ar) | `[CODE]` `falcon-form-field.component.html:7,23,26` (`| translate` pipe) + `[VAULT]` Glossary En/Ar discipline | `label`, `hint`, `errorKey` are i18n KEYS resolved through `TranslatePipe` — never literal strings; RTL Arabic is supported by the keyed lookup. |
| Add Client / Add User field-level validation rules (V-rules) | `[BRAIN-OUT]` Add Client folder per-step section files + `[MEMORY]` project_add_user_dropdown_payload_fix | The wizard steps surface their V-rule failures through this wrapper's `errorKey` slot — the wrapper is the *display* surface for the step's validation verdict. |

## Business constraints baked in
- `[CODE]` `falcon-form-field.component.html:6` **An empty `label` skips the label row entirely** — a field with no business label renders just its control + message.
- `[CODE]` `falcon-form-field.component.html:4-5` **Disabled = visually dimmed + non-interactive** — `disabled()` applies `opacity-[0.65]` + `pointer-events-none` to the whole field. Disabling a field is a business statement ("not yours to edit right now").
- `[CODE]` `falcon-form-field.component.ts` (per `API.md`) **`hasError` precedence** — when the explicit `invalid` input is set it wins; otherwise error state is inferred from a non-null `errorKey`. The component shows error OR hint, never both (`html:20-27` — error `@if` else hint `@else if`).
- `[CODE]` `falcon-form-field.component.html:7,23,26` **All text is a translation key** — passing an already-translated string is a bug; the keys feed `TranslatePipe`.
- `[INFERRED]` **The wrapper does not own the field's value or validity** — it renders whatever `errorKey` / `required` the consumer computes from the step's `FormGroup`. It is a display contract, not a validator.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard — Information step | admin-console org-hierarchy add-client-wizard | ✅ Wraps the account-info fields (`client-information-step.component.html`) with label + required + error rows. |
| Add Client wizard — Account Owner step | admin-console org-hierarchy add-client-wizard | ✅ Wraps the owner fields (`client-account-owner-step.component.html`). |
| Add User wizard — Personal / Role-Status / Permissions steps | admin-console org-hierarchy add-user-wizard | ✅ Wraps the user fields across all three steps (`user-personal-step`, `user-role-status-step`, `user-permissions-step`). |
| Same wizards (twin) | management-console organization-hierarchy-page | ✅ Mirror wizard step templates. |

## Business gotchas
- **Double-label trap** — wrapping a `<falcon-angular-input>` (which has its own built-in `label`) inside a `<falcon-form-field label="X">` renders the label TWICE (`GAPS_AND_UPGRADES.md` G3). In legacy wizard code the convention is "set the label on ONE of them". New code must not introduce this wrapper around Falcon inputs at all.
- `label` / `hint` / `errorKey` are **translation keys, not text** — a builder who passes `"First Name"` instead of `"hierarchy.addUser.fields.firstName.label"` ships a missing-translation artifact.
- The asterisk is rendered by *this wrapper* from `required`, but `aria-required` lives on the *slotted control* — the two are not synced (`GAPS_AND_UPGRADES.md` G4). A required field needs `required` here AND `aria-required` on the inner input.
- `hasError` is derived from `errorKey` only — it does NOT read the slotted control's own `state="error"` (`GAPS_AND_UPGRADES.md` G5). The consumer must keep the two in sync (the usage examples do: `[state]="firstNameError() ? 'error' : 'default'"` alongside `[errorKey]`).
- This is a **legacy component on a deprecation path** — it is correct to *maintain* it in existing wizard steps, but adding a NEW `<falcon-form-field>` around a Falcon input is a documented anti-pattern.

## Verification
✅ VERIFIED in production usage — `<falcon-form-field>` is consumed by the confirmed-working Add Client and Add User wizard steps in admin-console (`USAGE.md` Wave 7 sweep — 5 consumer files across both wizards). Template behaviour (required asterisk, error/hint mutual exclusion, disabled dimming, translation-keyed text) is ✅ VERIFIED against `[CODE]` `falcon-form-field.component.html` (read in full). The component's LEGACY / deprecation status is ✅ VERIFIED against the existing `DECISION.md` + `OVERVIEW.md`.
