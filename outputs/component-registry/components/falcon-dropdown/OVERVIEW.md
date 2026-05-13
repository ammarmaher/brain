# falcon-dropdown — OVERVIEW

## Component purpose

Single-select dropdown with searchable filter, type-ahead buffer, keyboard navigation, and clearable selection. Designed as the form-field cousin of `<falcon-angular-input>` (shares size / state / variant / appearance contract).

## Business / UI use case

- Account-owner picker, country picker (non-phone), category picker, status picker.
- Language picker (uses `iconUrl` per-option flag images — Wave 4 addition replaced the per-item ng-template pattern).
- Form-shell dropdowns inside organization-hierarchy wizards (admin + management consoles).

## When to use it / when NOT to use it

**Use it for:**
- Single-value selection from a known list of options.
- Searchable list when option count > ~10.
- Type-ahead navigation against a labeled list.

**Do NOT use it for:**
- Multi-value selection → `<falcon-angular-multi-select>`.
- Free-text input + suggestions → `<falcon-angular-combobox>`.
- Tree-shaped options → `<falcon-angular-tree>` or `<falcon-angular-tree-table>`.
- Country picker INSIDE a phone field → `<falcon-angular-phone-field>` has its own internal country chooser.
- Custom-rendered option rows beyond `iconUrl` + `label` (today's contract is limited — see GAPS).

## Status

**ACTIVE / PREFERRED.** Replaces PrimeNG `<p-dropdown>` and native `<select>` in Wave PR-8.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.ts` |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.html` |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.css` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-dropdown-tw/falcon-dropdown-tw.tsx` |
| Types | `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.utils.ts` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/dropdown-tailwind-classes.ts` |
| Tokens | `libs/falcon-ui-tokens/src/components/dropdown.tokens.css` |

## Selectors

| Layer | Tag / selector |
|---|---|
| Angular | `falcon-angular-dropdown` |
| Stencil Shadow | `<falcon-dropdown>` |
| Stencil Light | `<falcon-dropdown-tw>` |

## Known consumers

- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/user-role-status-step/...` (status dropdown).
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/...` (country, category).
- `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/...` (parallel set).
- Language picker (top-bar): uses `iconUrl` per-option for flag images.
- Playground: `apps/host-shell/src/app/playground/playground.page.html`.

## Related components

- `<falcon-angular-multi-select>` — multi-select variant.
- `<falcon-angular-combobox>` — free-text combo.
- `<falcon-angular-select>` — alias wrapper (Angular-only convenience — see falcon-select component folder).
- Same family pattern as `<falcon-angular-input>` for size / state / variant / appearance + CVA + dual-render.

## Ownership

`libs/falcon-ui-core` (cross-framework).
