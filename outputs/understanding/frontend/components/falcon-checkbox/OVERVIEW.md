# falcon-checkbox — OVERVIEW

## Component purpose

Single boolean checkbox built on the **dual-render Stencil pattern** (Shadow DOM `<falcon-checkbox>` + Light DOM `<falcon-checkbox-tw>` + Angular CVA wrapper `<falcon-angular-checkbox>`). Optional indeterminate (tri-state) display, label, helper, error, and the Falcon `size`/`state` contract. Both render paths wrap a **real native `<input type="checkbox">`** for full keyboard + screen-reader behavior, painting the visible box on top — `[CODE]` falcon-checkbox.tsx:175-196.

## Business / UI use case

- Single "I agree" / "remember me" / boolean opt-in inside forms.
- Per-row include/exclude + header tri-state "Select all" inside tables and the wallet allocation table.
- Channel/feature toggles in the new-wallet-balance allocation table and the Templates wizard.
- Compose primitive for `<falcon-angular-checkbox-group>` (the group renders `<falcon-angular-checkbox>` instances and drives them via `checkedInput`).

## When to use it / when NOT to use it

**Use it for:** any standalone boolean form control, with or without a label; a tri-state header indicator.

**Do NOT use it for:**
- Multiple checkboxes bound to one shared array value → `<falcon-angular-checkbox-group>`.
- A switch / toggle visual metaphor → `<falcon-angular-switch>`.
- Mutually-exclusive choice → `<falcon-angular-radio>` / `<falcon-angular-radio-group>`.
- A control that must record a true third value ("unknown") — a checkbox is strictly boolean (indeterminate is display-only, lost on toggle).

## Status

**ACTIVE / PREFERRED.** Replaces PrimeNG `<p-checkbox>` / `<p-triStateCheckbox>` and native `<input type=checkbox>`.

## Replaces

- PrimeNG `<p-checkbox>` / `<p-triStateCheckbox>`.
- Native `<input type="checkbox">` + `<label>`.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-checkbox/falcon-checkbox.component.ts` |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-checkbox/falcon-checkbox.component.html` (pure tag-switcher — NO `<ng-content>`) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-checkbox/falcon-checkbox.component.css` (inline-block passthrough only) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-checkbox/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-checkbox/falcon-checkbox.tsx` |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-checkbox/falcon-checkbox.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-checkbox-tw/falcon-checkbox-tw.tsx` (no `.css` — Tailwind only) |
| Types | `libs/falcon-ui-core/src/components/falcon-checkbox/falcon-checkbox.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-checkbox/falcon-checkbox.utils.ts` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/checkbox-tailwind-classes.ts` (cross-framework SSOT) |
| Component token file | `libs/falcon-ui-tokens/src/components/checkbox.tokens.css` (~182 lines) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-checkbox` |
| Stencil Shadow tag | `<falcon-checkbox>` |
| Stencil Light tag | `<falcon-checkbox-tw>` |

## Known consumers (grep verified 2026-06-03)

Real app consumers — **5 files:**
- `apps/admin-console/src/app/features/new-wallet-balance/components/wb-allocation-table/wb-allocation-table.component.html:120` — channel-header checkbox (token-overridden, per the component header comment at .ts:19).
- `apps/management-console/src/app/features/new-wallet-balance/components/wb-client-view/wb-client-view.component.html:159` — client-view channel checkbox.
- `apps/admin-console/src/app/features/templates-page/components/templates-wizard/steps/step2-message-structure.component.html:92,104,129` — message-structure toggles.
- `apps/management-console/src/app/features/templates-page/components/templates-wizard/steps/step2-message-structure.component.html:92,104,129` — mgmt mirror.
- `apps/management-console/src/app/features/contact-groups/create-contact-group/steps/preview-configure-step/preview-configure-step.component.html:36` — preview/configure toggle.

Also referenced by `libs/falcon-studio/src/lib/components/preview-grid.component.ts` (Studio preview) + gallery showcase, and asserted in the new-wallet-balance standards specs.

## Related components

- **Composed by:** `<falcon-angular-checkbox-group>` (renders N instances, drives via `checkedInput`).
- **Sibling:** `<falcon-angular-switch>` (different visual metaphor), `<falcon-angular-radio>` (exclusive). The Stencil `<falcon-checkbox-group(-tw)>` is a separate self-contained component (see falcon-checkbox-group dossier) — the Angular group does NOT use it.

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Token contract in `libs/falcon-ui-tokens`. React + Vue twins auto-generated (`libs/falcon-ui-react/src/components.ts:336`, `libs/falcon-ui-vue/src/index.ts:241`).

## Verification
🟢 code-verified against `falcon-checkbox.component.{ts,html}` + `falcon-checkbox.tsx` + `falcon-checkbox-tw.tsx` (read 2026-06-03). Consumer list 🟢 grep-verified 2026-06-03 — corrected from the stale "1 (playground)". **Corrected:** the wrapper does NOT project `<ng-content>` (it is a pure tag-switcher) — see API/GAPS.
