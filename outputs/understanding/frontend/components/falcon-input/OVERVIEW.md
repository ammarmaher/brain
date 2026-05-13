# falcon-input — OVERVIEW

## What this is

The flagship dual-render input component — the reference implementation for the Shadow + Light DOM parity pattern across the Falcon UI library. Used everywhere a single-line text input is needed (text, email, password, number, search, tel, url types).

## Render paths

Two coexisting Stencil tags backed by the same token chain and the same Tailwind helpers:

- **Shadow DOM** — `<falcon-input>` at `libs/falcon-ui-core/src/components/falcon-input/falcon-input.tsx` (`shadow: true`, 297 LOC).
- **Light DOM** — `<falcon-input-tw>` at `libs/falcon-ui-core/src/components/falcon-input-tw/falcon-input-tw.tsx` (`shadow: false`).

A single Angular CVA wrapper switches between the two render paths via the `useTailwind` input (default `true`).

- **Angular wrapper** — `<falcon-angular-input>` at `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.ts` (`ChangeDetectionStrategy.OnPush`, `CUSTOM_ELEMENTS_SCHEMA`, `NG_VALUE_ACCESSOR`).

The wrapper is also exposed via `@falcon` (`libs/falcon/src/shared-ui/index.ts:34`) as `FalconAngularInputComponent` for backward compatibility with consumers that import from `@falcon`.

## Why it exists

- Replaces every PrimeNG `<p-inputText>` / `<input pInputText>` in the codebase after Wave PR-8.
- Provides one prop surface that drives both render paths so the Studio can mutate `--falcon-input-*` tokens at runtime and update Shadow + Light renders identically.
- Cross-framework — the same Stencil tags + Tailwind helpers are consumed by React (`@falcon/ui-react`) and Vue (`@falcon/ui-vue`) wrappers, keeping the visual output identical across frameworks.

## Where it lives

| Layer | Path |
|---|---|
| Stencil Shadow tag | `libs/falcon-ui-core/src/components/falcon-input/falcon-input.tsx` |
| Stencil Light tag | `libs/falcon-ui-core/src/components/falcon-input-tw/falcon-input-tw.tsx` |
| Stencil styles | `libs/falcon-ui-core/src/components/falcon-input/falcon-input.css` |
| Types | `libs/falcon-ui-core/src/components/falcon-input/falcon-input.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-input/falcon-input.utils.ts` |
| Tailwind helpers (cross-framework) | `libs/falcon-ui-core/src/tailwind/input-tailwind-classes.ts` |
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input/falcon-input.component.{ts,html,css}` |
| Component tokens | `libs/falcon-ui-tokens/src/components/input.tokens.css` |
| Cross-framework barrel | `libs/falcon-ui-core/src/angular-wrapper/index.ts` |
| Angular re-export | `libs/falcon/src/shared-ui/index.ts:34` |

## Standing rules / decisions

- `useTailwind = true` is the default (Light DOM Tailwind path). Consumers opt back into Shadow DOM by `[useTailwind]="false"`.
- Methods (not `computed()`) are used to derive class strings in the Angular wrapper because `computed()` would only track signal deps, not `@Input` props — methods re-run on every CD cycle, which OnPush triggers whenever an `@Input` ref changes. Documented at `falcon-input.component.ts:106-108`.
- `shadowless`, `borderless`, `flat`, `noFocusRing` feature toggles are reflected as host attributes so `:host([flat])` etc. CSS rules can target them. Tokens still win — a host class can re-enable any feature these props turned off.
- Per-instance token overrides are achieved by adding a host class (e.g. `add-client-special-input`) and setting the relevant `--falcon-input-*` token in a CSS rule scoped to that class.
- The clear button has its own `clearAriaLabel` prop so `<falcon-search-input>` can pass `"Clear search"` instead of the default `"Clear input"`.
- `falcon-input` registers on demand inside the Angular wrapper's `ngOnInit` via `defineFalconTwComponent('falcon-input')` (Wave 5 — replaces eager `defineCustomElements()`).
