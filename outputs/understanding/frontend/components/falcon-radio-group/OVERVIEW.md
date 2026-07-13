# falcon-radio-group — OVERVIEW

## Component purpose

Single-select container for a set of radios: takes an `options[]` array, renders the choice, owns the selected value, and bridges it to Reactive Forms / `ngModel` via CVA.

**Critical architecture note (the known divergence pattern):** unlike most Falcon controls, the Angular `<falcon-angular-radio-group>` does **NOT** render the Stencil `<falcon-radio-group>` / `<falcon-radio-group-tw>` web components. `[CODE]` It **composes** `@for` over `<falcon-angular-radio>` children inside a plain Angular `<div role="radiogroup">` (falcon-radio-group.component.html:6-46). The Stencil group elements + their Shadow CSS + `radio-group.tokens.css` exist in the lib but are **orphaned by the Angular layer** — the wrapper even calls `defineFalconTwComponent('falcon-radio-group')` in `ngOnInit` (ts:82-84), registering an element it never instantiates. This is a deliberate "Angular convenience wrapper" pattern (ts:1-3 comment) but it has consequences — see GAPS.

## Business / UI use case

- "Pick one" choices in wizards, settings, and config panels.
- `[CODE]` Wallet-balance "balance type" + "wallet type" pickers — the ONLY live render consumers (wallet-balance-management.component.html:202-209 / 219-226).

## When to use it / when NOT to use it

**Use it for:** a mutually-exclusive multi-option choice rendered as a row/column of radios with a shared value.

**Do NOT use it for:**
- A true on/off boolean → `<falcon-angular-checkbox>` / `<falcon-angular-switch>`.
- One value from a long hidden list → `<falcon-angular-dropdown>`.
- Multiple values → `<falcon-angular-checkbox-group>` / `<falcon-angular-multi-select>`.
- A scenario needing the component to provide its own layout styling out-of-the-box (it does not on the Light path — see GAPS G2).

## Status

**ACTIVE (Wave 9.F backfill) — but with structural caveats.** The Angular wrapper works; the orphaned Stencil group + the missing Light-DOM CSS for the wrapper's own classes are open issues (GAPS). Not deprecated.

## Replaces

- Legacy PrimeNG `<p-radioButton>` groups / `<p-selectButton>` single-select usage.
- Hand-rolled `@for` of native radios.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-radio-group/falcon-radio-group.component.ts` (117 ln) — **the active code** |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-radio-group/falcon-radio-group.component.html` (46 ln — `@for` over `<falcon-angular-radio>`) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-radio-group/index.ts` (exports component + `FalconRadioGroupOption`) |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-radio-group/falcon-radio-group.tsx` (161 ln) — **ORPHANED by the Angular layer** |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-radio-group/falcon-radio-group.css` (52 ln — Shadow-only) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-radio-group-tw/falcon-radio-group-tw.tsx` (128 ln) — **ORPHANED** |
| Types | `libs/falcon-ui-core/src/components/falcon-radio-group/falcon-radio-group.types.ts` (`FalconRadioGroupOption` with `value: string`) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/radio-group-tailwind-classes.ts` (12 ln — `falconRadioGroupOptionsClasses`, effectively unused) |
| Component token file | `libs/falcon-ui-tokens/src/components/radio-group.tokens.css` (22 ln) |
| Spec/tests | **None.** |

> No Angular wrapper CSS file exists for this component (no `.component.css`) — the `@for` template has no Light-DOM stylesheet behind its class names. See GAPS G2.

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-radio-group` (renders a `<div>` + child `<falcon-angular-radio>`s — NOT a Stencil element) |
| Stencil Shadow tag | `<falcon-radio-group>` (exists, not used by Angular) |
| Stencil Light tag | `<falcon-radio-group-tw>` (exists, not used by Angular) |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-radio-group[\s>]` render sites across `apps/` = **2 occurrences, both in one file**: `apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.html:202` and `:219`. Zero in `libs/falcon`. (A third `<falcon-angular-radio-group>` string appears only inside a code comment in `wallet-balance-management.component.ts:496`.)

> Both consumers apply an arbitrary-variant Tailwind class `class="[&_.falcon-radio-group-options.is-vertical]:flex [&_...]:flex-col [&_...]:items-start [&_...]:gap-2.5"` — they are hand-supplying the layout the component does not provide on the Light path (see GAPS G2 + FINDINGS/B06).

## Related components

- Composes `<falcon-angular-radio>` (drives each child via `[name]` + `[checkedInput]` + `(valueChange)`).
- Alternatives: `<falcon-angular-dropdown>` (long lists), `<falcon-angular-checkbox-group>` (multi-value).

## Ownership / responsibility

`libs/falcon-ui-core`. Owned by Falcon UI team. Token contract in `libs/falcon-ui-tokens`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B06 sweep). Confirmed the Angular wrapper composes `<falcon-angular-radio>` children (NOT the Stencil group) and that the Stencil group + CSS + tokens are orphaned. Consumers re-grepped: 2 render sites, both in wallet-balance-management.
