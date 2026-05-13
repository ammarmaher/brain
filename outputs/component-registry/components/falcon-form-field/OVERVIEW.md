# falcon-form-field — OVERVIEW

## Component purpose

Legacy bespoke Angular labeled-field wrapper. Renders a label row + required asterisk + hint + error message + content slot (the actual input). Used to wrap inputs that did NOT have built-in label/error support.

**Important:** new Falcon UI inputs (`<falcon-angular-input>`, `<falcon-angular-dropdown>`, `<falcon-angular-textarea>`, etc.) have built-in `label` / `helperText` / `errorMessage` inputs — they do NOT need to be wrapped in `<falcon-form-field>`. Keep `<falcon-form-field>` only where legacy wizard rows demand uniform labeled rows OR mixed-control layouts.

## Business / UI use case

- Legacy: wrapping inputs without built-in label/error.
- Current: organization-hierarchy wizards (add-user / add-client) still wrap many Falcon inputs in `<falcon-form-field>` from the pre-Wave-5 era. Migration is ongoing.

## When to use it / when NOT to use it

**Use it for:**
- Legacy code maintenance only.
- Mixed forms where multiple non-Falcon controls share a label row.

**Do NOT use it for:**
- NEW code with Falcon UI inputs — use built-in `label` / `errorMessage` instead.
- Wrapping `<falcon-angular-input>` (will render duplicate label).

## Status

**LEGACY / BESPOKE.** Active in admin + management consoles' organization-hierarchy wizards. **Migration candidate** — new code should use Falcon input built-in labels.

## Source paths

| Layer | Path |
|---|---|
| Angular component TS | `libs/falcon/src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.ts` |
| HTML | `.../falcon-form-field.component.html` |
| SCSS | `.../falcon-form-field.component.scss` — **NOTE:** SCSS file exists, contradicting the no-SCSS rule (legacy carryover). **Flag for cleanup.** |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-form-field` |
| Stencil | None — legacy bespoke Angular component. |

## Known consumers

- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/user-personal-step/...`
- `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-user-wizard/user-personal-step/...`
- Other wizard step templates (search for `<falcon-form-field>` in apps).

## Related components

- New Falcon UI inputs replace the need for this in most cases.

## Ownership

`libs/falcon`.
