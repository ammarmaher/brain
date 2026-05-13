# falcon-form-field (LEGACY) — OVERVIEW

## Purpose
Labeled input wrapper with required asterisk + hint + error slot. Used as a layout helper to wrap a Falcon UI input that does NOT have a built-in label, OR to provide consistent label/hint/error styling around any control.

NOTE: Agent 1 (form/input components) primarily owns this; Agent 4 documents it under workflow/legacy because the active org-hierarchy wizards use it heavily and it is technically a legacy bespoke component.

## Business / UI use case
- Wraps `<falcon-angular-dropdown>`, `<falcon-angular-input>`, `<falcon-angular-multi-select>`, etc. when the consumer wants:
  - A label above the control (with required `*` indicator).
  - A hint line below.
  - An error message (i18n key + params).
- Heavy use across Add Client and Add User wizards.

## When to use it / when NOT to use it
- USE when wrapping a control whose Stencil component already supports `label`/`errorMessage` Inputs (most Falcon UI inputs do) — the wrapper duplicates this slightly but enforces a consistent shell.
- DO NOT use for controls that have rich built-in label/error UX (e.g., `<falcon-angular-input>` with `label` + `errorMessage` Inputs — but in practice the wizard code WRAPS even these for consistency).
- Use cases that demand a custom invalid-visual override pass `[invalid]` directly.

## Status
- **LEGACY-IN-USE (Wave 22).** Bespoke Angular standalone component.
- Could be:
  - Promoted to Falcon UI core as `<falcon-angular-form-field>`, OR
  - Deprecated in favor of using the per-input `label` / `errorMessage` Inputs.

## Selector / Tags
- `<falcon-form-field>` (Angular).

## Source paths
| Layer | Path |
|---|---|
| Component | `libs/falcon/src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.ts` |
| Template | `…/falcon-form-field.component.html` |
| SCSS | `…/falcon-form-field.component.scss` |
| Barrel | `…/index.ts` |

## Known consumers
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html:46-58` (wraps `<falcon-angular-dropdown>`).
- Many other wizard step templates in admin-console + management-console (grep for `<falcon-form-field`).

## Related components
- `<falcon-angular-input>` / `<falcon-angular-dropdown>` / `<falcon-angular-multi-select>` — typical contents.

## Ownership / Responsibility
- Legacy bespoke; SCSS-driven visuals (violates the no-SCSS rule).
- Uses `TranslatePipe` for the label string.
