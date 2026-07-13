# falcon-radio — OVERVIEW

## Component purpose

A single radio button — the atom of a mutually-exclusive choice. Follows the **dual-render Stencil pattern** (Shadow DOM `<falcon-radio>` + Light DOM `<falcon-radio-tw>` + Angular CVA wrapper `<falcon-angular-radio>`). Its visual signature is the **border-width-5 trick**: the visible "dot" is not a separate element — on `:checked` the mark's border grows from 1.5px to 5px and turns teal, so the thick ring reads as a filled dot (`[CODE]` falcon-radio.css:93-98). A real native `<input type="radio">` sits underneath for keyboard + AT + browser-level exclusivity.

## Business / UI use case

- Single radio bound to a value, almost always composed inside a group.
- `[CODE]` Wallet-balance "balance type" / "wallet type" pickers (via `<falcon-angular-radio-group>` — wallet-balance-management.component.html:202/219).
- `[CODE]` Templates wizard step-1 message-type chooser + flow-type modal (one radio per card — step1-basic-info.component.html:125, flow-type-modal.component.html:56/97).
- `[CODE]` Org-hierarchy settings-tab + add-client settings-step + add-user permissions-step single-row choices.
- `[CODE]` The new-wallet-balance **wb-radio-pill** app-component wraps `<falcon-angular-radio useTailwind>` to make a pill-styled option card (wb-radio-pill.component.ts:123).

## When to use it / when NOT to use it

**Use it for:** an individual circular option bound to a `value`. Standalone use is reserved for non-uniform layouts (e.g. one radio per card / pill).

**Do NOT use it for:**
- Several options where exactly one is picked → use `<falcon-angular-radio-group>` (do NOT hand-roll a `@for` of radios — but note the group itself has divergences, see GAPS).
- A true on/off boolean → `<falcon-angular-switch>` or `<falcon-angular-checkbox>`.
- One value from a long hidden list → `<falcon-angular-dropdown>`.

## Status

**ACTIVE / PREFERRED.** Replaces PrimeNG `<p-radioButton>` and native `<input type="radio">`. Not deprecated.

## Replaces

- Legacy PrimeNG `<p-radioButton>`.
- Native `.form-check` `<input type="radio">` patterns.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-radio/falcon-radio.component.ts` (133 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-radio/falcon-radio.component.html` (45 ln — pure tag-switcher) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-radio/falcon-radio.component.css` (10 ln — `:host{display:inline-block}` only) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-radio/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-radio/falcon-radio.tsx` (222 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-radio/falcon-radio.css` (170 ln) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-radio-tw/falcon-radio-tw.tsx` (212 ln) |
| Types | `libs/falcon-ui-core/src/components/falcon-radio/falcon-radio.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-radio/falcon-radio.utils.ts` (`buildMarkClasses`, `isFieldInError`) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/radio-tailwind-classes.ts` (cross-framework SSOT for the `-tw` path) |
| Component token file | `libs/falcon-ui-tokens/src/components/radio.tokens.css` (186 ln) |
| Stencil readme | `libs/falcon-ui-core/src/components/falcon-radio/readme.md` (auto-generated) |
| Spec/tests | **None for the Angular wrapper or `-tw` twin** (see GAPS). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-radio` |
| Stencil Shadow tag | `<falcon-radio>` |
| Stencil Light tag | `<falcon-radio-tw>` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-radio[\s>]` render sites across `apps/` = **5 occurrences in `.html`** + **1** TS template-string component (wb-radio-pill) + **2** in `libs/falcon` (user-details). The radio-group does NOT count as a render consumer of `<falcon-angular-radio>` directly here — see USAGE Consumer Sweep. Representative consumers:

- `apps/admin-console/src/app/features/new-wallet-balance/components/wb-radio-pill/wb-radio-pill.component.ts` (thin pill wrapper; uses `useTailwind`/`checkedInput`/`disabledInput`/`markClass`/`rowClass`).
- `apps/{admin,management}-console/src/app/features/templates-page/components/templates-wizard/steps/step1-basic-info.component.html` + `.../flow/flow-type-modal.component.html` (one radio per card, often `disabled` + pre-checked for visual-only state).
- `apps/{admin,management}-console/src/app/features/org-hierarchy-page/components/tab-components/settings-tab/settings-tab.component.html`.
- `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html`.
- `apps/{admin,management}-console/.../add-user-wizard/user-permissions-step/user-permissions-step.component.html`.
- `libs/falcon/src/shared-features/user-details/components/user-details-page.component.html` (2).

> `[CODE]` CORRECTION (2026-06-03): the prior dossier's "consumed by `<falcon-angular-otp-send-dialog>` step 1" claim is UNVERIFIED — a grep of `falcon-otp-send-dialog` shows zero radio references. Removed. Prior consumer list also cited `host-shell/.../user-details` + `playground.page.html`; user-details moved to `libs/falcon`, the playground route is gone.

## Related components

- Intended to be composed by: `<falcon-angular-radio-group>` — BUT the Angular group composes `<falcon-angular-radio>` children itself (not the Stencil group element). See `falcon-radio-group` dossier + GAPS for that divergence.
- Wrapped by app-level `wb-radio-pill` (new-wallet-balance) to add pill styling.
- Siblings (same surface family): `<falcon-angular-checkbox>`, `<falcon-angular-switch>`.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI team. Token contract in `libs/falcon-ui-tokens`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B06 sweep). Source-file table + line counts re-confirmed on disk; consumer list re-grepped (5 `.html` + wb-radio-pill TS + 2 in `libs/falcon`); fabricated OTP-send-dialog consumer removed.
