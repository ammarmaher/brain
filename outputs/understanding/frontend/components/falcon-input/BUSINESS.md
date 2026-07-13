# falcon-input — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The canonical free-text capture control in Falcon. In business terms it is how the operator *names a thing*: the account name a client is created under, the finance ID it bills against, the first/last name of a person added to the org. Every Falcon "create" or "edit" flow opens with one or more `<falcon-angular-input>` fields — they are the first contract between the operator's intent and a persisted record.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Account Name is required to create a client | `[MEMORY]` project_settings_tab_standalone_wave14 + `[CODE]` client-information-step.component.html:12-25 | Add Client Step "Client Information" renders Account Name with `[required]="true"` + `[errorMessage]` bound to a validation signal — the wizard cannot advance with it empty. |
| Account Name + Finance ID are Falcon-only editable attributes | `[MEMORY]` project_info_panel_backend_integration_wave15 (`canEditFalconOnly` gate) | In the Information panel edit mode, the Account Name input is rendered `[disabled]` for non-Falcon sessions — the value is shown but not yours to change. |
| Person identity (first/last name) required on Add User | `[CODE]` user-personal-step.component.html:47-54 | Add User Step "Personal" renders First Name with `[required]` + `[state]="firstNameError() ? 'error' : 'default'"`. |
| Max-length caps on named fields | `[CODE]` client-information-step.component.html:21 (`[maxlength]="100"`) | Account Name is capped at 100 chars at the input boundary — a soft pre-validation mirror of the backend column constraint. |

## Business constraints baked in
- `[MEMORY]` **Falcon-only fields render disabled for client users** — the Information panel passes a `canEditFalconOnly` flag into the step; when false, Account Name + Finance ID inputs receive `[disabled]="true"`. A builder must NOT make them editable to "fix" a greyed-out field — it is a deliberate role gate (`feedback`-confirmed in Wave 15).
- `[CODE]` **`errorMessage` implicitly sets the error state** — `hasError()` returns true when `errorMessage` is non-empty (falcon-input.component.ts:126-128). Setting `errorMessage` alone is enough to paint the field red; `[state]="'error'"` is a redundant-but-recommended companion.
- `[CODE]` **`maxlength` is a boundary cap, not a validator** — it stops further typing but never raises a business error. Real length validation lives in Reactive Forms validators / backend (see `INTEGRATION_VALIDATION.md`).
- `[INFERRED]` **Empty value normalises to `''`, never `null`** — CVA `writeValue(null)` coerces to `''` (falcon-input.component.ts:177). Downstream payload builders that distinguish "untouched" from "cleared" must not rely on `null` surviving through this control.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Add Client wizard | organization-hierarchy | Account Name, Finance ID, owner first/last name capture |
| Add User wizard | organization-hierarchy | First Name, Last Name, username free-text capture |
| Add / Edit Node drawer | organization-hierarchy (hierarchy tab) | Node name + free-text node attributes |
| Information panel edit | organization-hierarchy | Account Name (Falcon-only), address free-text lines |
| Org-hierarchy menu search | organization-hierarchy | Tree filter free-text box |

## Business gotchas
- A disabled Account Name input in the Information panel is a **role statement** ("Falcon-only attribute"), not a defect — see the Wave 15 `canEditFalconOnly` gate.
- The field's `maxlength` is a UX courtesy; the real business cap is enforced server-side. Never treat "the user couldn't type more" as "the value is valid."
- An input bound to a wizard payload commits its value into the *flow's* owning module (Commerce for client/node, Identity for user) — the input itself owns no business data, it is a capture surface.
- Wrapping in legacy `<falcon-form-field>` duplicates label rendering — a business-visible bug (two labels) if a builder both nests it and sets the built-in `label`.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B01) — `hasError()` (ts:136-138), `writeValue(null)→''` (ts:188), `maxlength` keystroke-cap, and the Falcon-only disable gate all re-confirmed in live source. ✅ Add Client / Add User / Add-Edit Node / Information panel remain user-confirmed working features (`[MEMORY]` Wave 14/15). Rule cross-references 🟡 CODE-DERIVED from the cited step templates.
