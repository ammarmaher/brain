# falcon-input — OVERVIEW

## Component purpose

Flagship single-line text-entry control. The reference implementation for the **dual-render Stencil pattern** (Shadow DOM `<falcon-input>` + Light DOM `<falcon-input-tw>` + Angular CVA wrapper `<falcon-angular-input>`). Every other form-control wrapper in `libs/falcon-ui-core/src/angular-wrapper/components/` mirrors its `useTailwind` toggle + shared `falconInputXxxClasses()` helper pattern.

## Business / UI use case

- Username / first name / last name / account name / generic free-text entry.
- Heavily used by **organization-hierarchy** wizards (add user, add client) and **org info panel** drawers in both admin-console and management-console.
- Acts as the rendering hinge for `<falcon-angular-password>` (composes `<falcon-angular-input type="password">` + reveal toggle + optional strength meter) and `<falcon-angular-search-input>` (composes `<falcon-input variant="search">`).

## When to use it / when NOT to use it

**Use it for:**
- Any non-numeric, non-multiline free-text field (text / email / password / search / tel / url).
- `type="number"` quick-numeric fields where step + min/max + format are NOT needed.
- Any form-field that needs a Falcon label / helper / error contract.

**Do NOT use it for:**
- Numeric inputs that need step + format + decimals + prefix/suffix → use `<falcon-angular-input-number>`.
- Email with a verify-button affordance → use `<falcon-angular-email-field>`.
- Phone with country chooser + dial code → use `<falcon-angular-phone-field>`.
- Password with strength meter or reveal-toggle → use `<falcon-angular-password>`.
- Multi-line text → use `<falcon-angular-textarea>`.
- In-grid numeric editing → use `<falcon-angular-grid-input>`.
- OTP code entry → use `<falcon-angular-otp>`.
- Search with debounce + clear → use `<falcon-angular-search-input>`.

## Status

**ACTIVE / PREFERRED / FLAGSHIP REFERENCE.** Replaced PrimeNG `<p-input-text>` + native `<input>` in Wave PR-8. Not deprecated. Mandatory for all new form inputs in admin-console / management-console.

## Replaces

- Legacy PrimeNG `<p-input-text>`.
- Legacy native `<input class="p-input">` patterns.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.ts` |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.html` |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.css` (block + width only — no rules beyond layout) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-input/falcon-input.tsx` |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-input/falcon-input.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-input-tw/falcon-input-tw.tsx` |
| Types | `libs/falcon-ui-core/src/components/falcon-input/falcon-input.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-input/falcon-input.utils.ts` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/input-tailwind-classes.ts` (cross-framework SSOT) |
| Component token file | `libs/falcon-ui-tokens/src/components/input.tokens.css` |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-input` |
| Stencil Shadow tag | `<falcon-input>` |
| Stencil Light tag | `<falcon-input-tw>` |

## Known consumers (grep verified)

- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html` — flagship usage (per-instance token override class `add-client-special-input` + `useTailwind` demo).
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/client-account-owner-step/...`
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/user-personal-step/...`
- `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-info-panel/...`
- `apps/admin-console/src/app/features/organization-hierarchy/components/tab-components/hierarchy-tab/falcon-org-node-drawer/...`
- `apps/admin-console/src/app/features/organization-hierarchy/components/organization-hierarchy-menu.component.html`
- `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-user-wizard/user-personal-step/...`
- `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-client-wizard/client-information-step/...`
- `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-client-wizard/client-account-owner-step/...`
- `apps/management-console/src/app/features/organization-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/...`
- `apps/management-console/src/app/features/organization-hierarchy-page/components/organization-hierarchy-page-menu.component.html`
- `apps/host-shell/src/app/playground/playground.page.html` — playground demo route.

## Related components

- Composed by: `<falcon-angular-password>`, `<falcon-angular-search-input>`, internally similar surface to `<falcon-angular-dropdown>`, `<falcon-angular-textarea>`, `<falcon-angular-input-number>`.
- Often wrapped by legacy `<falcon-form-field>` to add a labeled-wrapper + error slot (see admin-console wizards). New code should prefer the built-in `label` / `helperText` / `errorMessage` inputs instead of nesting in `<falcon-form-field>`.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI team. Token contract lives in `libs/falcon-ui-tokens`.
