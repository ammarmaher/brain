# falcon-input-number — OVERVIEW

## Component purpose

Numeric input with decimal/currency mode, locale-aware `Intl.NumberFormat` formatting, min/max clamp, step, integer-only truncation, optional `+ / −` spinner buttons. `[CODE]` **As of the 2026-05-17 refactor the Angular wrapper is a pure TAG-SWITCHER** — it forwards to the Stencil `<falcon-input-number-tw>` / `<falcon-input-number>`, which own ALL behavior. The **Stencil** layer composes `<falcon-input(-tw)>` (the web component, NOT the Angular `<falcon-angular-input>`) + native spinner `<button>`s. Wave 9.F backfill.

## Business / UI use case

- Currency / amount entry (mode='currency' + currency code).
- Quantity pickers with spinner buttons.
- Numeric form fields with decimals or integer enforcement.

## When to use it / when NOT to use it

**Use it for:**
- Numeric inputs that need step / format / decimals / locale.
- Currency entry (mode='currency' + Intl).
- Quantity pickers (`showButtons=true`).

**Do NOT use it for:**
- In-grid micro-numeric edit → `<falcon-angular-grid-input>` (lighter).
- Phone → `<falcon-angular-phone-field>`.
- Free-text "could be number" → `<falcon-angular-input type='number'>` (simpler).

## Status

**ACTIVE / PREFERRED.** Wave 9.F backfill.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input-number/falcon-input-number.component.ts` (160 ln) |
| Angular wrapper HTML | `.../falcon-input-number/falcon-input-number.component.html` (81 ln — pure tag-switcher) |
| Angular wrapper CSS | **NONE** — `[CODE]` the `@Component` has no `styleUrl` (the inner `<falcon-input(-tw)>` owns its CSS). |
| Angular barrel | `.../falcon-input-number/index.ts` (header comment STALE — says "composed wrapper around `<falcon-angular-input>` + spinner buttons") |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-input-number/falcon-input-number.tsx` (216 ln, `shadow:true`) |
| Stencil Shadow CSS | `.../falcon-input-number/falcon-input-number.css` (spinner-only; `var(--falcon-input-number-spinner-*)`) |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-input-number-tw/falcon-input-number-tw.tsx` (359 ln, `shadow:false`) |
| Stencil Light CSS | `.../falcon-input-number-tw/falcon-input-number-tw.css` (`:host { display:block }` only) |
| Types | `.../falcon-input-number/falcon-input-number.types.ts` (`FalconInputNumberMode`, `-Size`, `FalconInputNumberChangeDetail`) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/input-number-tailwind-classes.ts` (`falconInputNumberSpinnerClasses()` — **declared but NOT used by the `-tw` component**, which inlines a near-identical string) |
| Tokens | `libs/falcon-ui-tokens/src/components/input-number.tokens.css` (~18 ln — spinner + icon-defer only) |

> `[CODE]` No `.spec.ts` / `.e2e.ts`. The Stencil layer composes the `<falcon-input>` / `<falcon-input-tw>` web component (NOT the Angular wrapper) + 2 native spinner `<button>`s.

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-input-number` |
| Stencil Shadow | `<falcon-input-number>` |
| Stencil Light | `<falcon-input-number-tw>` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-input-number[\s>]` across `apps/` ≈ **16 files**; **0 in `libs/falcon/`**. Heaviest: **contracts-cost-management** (rate-card price-value, add-ons), org-hierarchy settings, wallet transfer drawers. Representative:

- `apps/admin-console/.../contracts-cost-management/components/contracts-add-wizard/rate-card-step/rate-card-step.component.html` (decimal, `[maxFractionDigits]=6`, `[iconRight]` SAR slot)
- `apps/admin-console/.../contracts-cost-management/components/contracts-add-wizard/addons-step/addons-step.component.html`
- `apps/{admin,management}-console/.../contracts-cost-management/components/contracts-{addons,rate-card}-section/...`
- `apps/admin-console/.../org-hierarchy-page/components/{tab-components/settings-tab, wizard-components/add-client-wizard/client-settings-step}.component.html`
- `apps/{admin,management}-console/.../new-wallet-balance/components/wb-balance-transfer-drawer/...`

## Related components

- `[CODE]` The **Stencil** layer composes `<falcon-input(-tw)>` (web component) + native spinner buttons — it does NOT compose the Angular `<falcon-angular-input>`/`<falcon-angular-button>` (that was the pre-2026-05-17 model).
- Sibling: `<falcon-angular-grid-input>` (lighter in-grid numeric).

## Ownership

`libs/falcon-ui-core`. Spinner token contract in `libs/falcon-ui-tokens/src/components/input-number.tokens.css`; the numeric field inherits `--falcon-input-*`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B01). Major correction: wrapper is a TAG-SWITCHER (not an Angular-component composition); Stencil composes the web-component `<falcon-input>`. Source paths/line-counts re-confirmed; consumers refreshed (≈16 app files).
