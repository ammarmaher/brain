# falcon-dropdown — OVERVIEW

> Sweep-refreshed 2026-06-03 (batch B04). Verified against live source; corrected the `slot="options"` and consumer-count facts vs the prior dossier.

## Component purpose

Single-select dropdown with searchable filter, type-ahead buffer, full keyboard navigation, and clearable selection. Designed as the form-field cousin of `<falcon-angular-input>` — it shares the same size / state / variant / appearance contract and the same dual-render Stencil pattern (Shadow `<falcon-dropdown>` + Light-DOM `<falcon-dropdown-tw>` + Angular CVA wrapper `<falcon-angular-dropdown>`).

`[CODE]` Wrapper class: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.ts:84` (`FalconAngularDropdownComponent`).

## Business / UI use case

- `[CODE]` Status picker in the org-hierarchy user wizards (`apps/admin-console/.../add-user-wizard/user-role-status-step/...`).
- `[CODE]` Country / category / currency pickers in the Add-Client wizard, contracts-cost-management wizards, templates wizards, and the org Info panel.
- `[CODE]` Language picker — uses `iconUrl` per-option flag images (Wave 4 addition; replaced the per-item `<ng-template>` slot pattern). See `falcon-dropdown.tsx:431-438` (selected-value icon) + `:556-563` (option icon).
- `[CODE]` Login-layout language/locale chooser in host-shell (`apps/host-shell/.../auth/login-layout/login-layout.component.html`).

## When to use it / when NOT to use it

**Use it for:**
- Single-value selection from a known list of options.
- Searchable list when option count > ~10 (`searchable=true`).
- Type-ahead navigation against a labeled list (closed-mode jump-to-match, matching native `<select>`).

**Do NOT use it for:**
- Multi-value selection → `<falcon-angular-multi-select>`.
- Free-text input + suggestions → `<falcon-angular-combobox>`.
- Tree-shaped options → `<falcon-angular-tree>` / `<falcon-angular-tree-table>`.
- Country picker INSIDE a phone field → `<falcon-angular-phone-field>` has its own internal country chooser.
- Structured per-option rows beyond `iconUrl` + `label` (the typed option contract is limited — see GAPS G1).

## Status

**ACTIVE / PREFERRED.** `[CODE]` Stencil Shadow tag header comment `falcon-dropdown.tsx:1-4` mirrors REFERENCE-V02-INVENTORY.md §2/§3/§4. Replaced PrimeNG `<p-dropdown>` and native `<select>` in Wave PR-8. Heavily consumed (57 app files reference `falcon-angular-dropdown` as of 2026-06-03 — see USAGE Consumer Sweep).

## Replaces

- Legacy PrimeNG `<p-dropdown>`.
- Legacy native `<select>`.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.ts` (404 lines) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.html` (77 lines — pure tag-switcher) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-dropdown/falcon-dropdown.component.css` (12 lines — `display:block; width:100%` only) |
| Angular barrel (alias) | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-select/index.ts` re-exports as `FalconAngularSelectComponent` (DEAD CANDIDATE — see falcon-select dossier) |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.tsx` (602 lines) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-dropdown-tw/falcon-dropdown-tw.tsx` (674 lines) |
| Stencil Light CSS | `libs/falcon-ui-core/src/components/falcon-dropdown-tw/falcon-dropdown-tw.css` |
| Types | `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-dropdown/falcon-dropdown.utils.ts` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/dropdown-tailwind-classes.ts` (cross-framework SSOT) |
| Component token file | `libs/falcon-ui-tokens/src/components/dropdown.tokens.css` (297 lines) |

> `[CODE]` No `*.spec.ts` for the dropdown was located under `components/falcon-dropdown/` or the wrapper folder (Glob 2026-06-03) — see GAPS "Missing tests".

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-dropdown` |
| Stencil Shadow tag | `<falcon-dropdown>` (`tag:'falcon-dropdown'`, `shadow:true`) |
| Stencil Light tag | `<falcon-dropdown-tw>` (`tag:'falcon-dropdown-tw'`, `shadow:false`) |

## Known consumers (grep-verified 2026-06-03)

`[CODE]` 57 app files reference `falcon-angular-dropdown`. Highlights:
- `apps/admin-console/.../org-hierarchy-page/.../add-user-wizard/user-role-status-step/...` + `user-permissions-step/...`
- `apps/admin-console/.../add-client-wizard/{client-information-step,client-account-owner-step,client-comm-channels-step,client-applications-step}/...`
- `apps/admin-console/.../contracts-cost-management/.../{contract-details-step,rate-card-step,contract-information-step}/...`
- `apps/{admin,management}-console/.../templates-page/.../templates-wizard/steps/...`
- `apps/{admin,management}-console/.../new-wallet-balance/...` + `wallet-balance-management/.../balance-transfer/...`
- `apps/{admin,management}-console/.../org-hierarchy-page/.../falcon-org-info-panel/...`
- `apps/host-shell/.../auth/login-layout/...`

`[CODE]` Bare `<falcon-dropdown>` Stencil tag (Shadow path, `useTailwind=false`) used directly in: `apps/admin-console/.../add-client-wizard/client-account-owner-step/client-account-owner-step.component.html`.

See USAGE.md Consumer Sweep for the full picture.

## Related components

- `<falcon-angular-multi-select>` — multi-select sibling (separate component, chip mode + overflow pill).
- `<falcon-angular-combobox>` — free-text combo sibling.
- `<falcon-angular-select>` — **alias re-export of THIS class** (`FalconAngularDropdownComponent as FalconAngularSelectComponent`), flagged DEAD CANDIDATE. See the falcon-select dossier.
- Same family pattern as `<falcon-angular-input>` (size / state / variant / appearance + CVA + dual-render).

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Token contract in `libs/falcon-ui-tokens`.

## Verification
🟢 code-verified against `falcon-dropdown.component.ts` + `.html` + `.css` + `falcon-dropdown.tsx` + `falcon-dropdown-tw.tsx` + `dropdown.tokens.css` (read 2026-06-03). Consumer list 🟢 grep-verified 2026-06-03.
