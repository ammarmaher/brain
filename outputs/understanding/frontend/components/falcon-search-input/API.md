# falcon-search-input — API

## Selectors

- Angular: `falcon-angular-search-input`
- Stencil Shadow: `<falcon-search-input>` (tag `'falcon-search-input'`, `shadow: true`)
- Stencil Light: `<falcon-search-input-tw>` (tag `'falcon-search-input-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularSearchInputComponent } from '@falcon/ui-core';
// barrel re-exports the component + its 3 types (FalconSearchInputSize, FalconSearchEventDetail, FalconSearchClearDetail).
```

Add `FalconAngularSearchInputComponent` to the consuming standalone component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is already declared on the wrapper internally (`[CODE]` falcon-search-input.component.ts:36) — the host does NOT need it.

## Inputs (all on `FalconAngularSearchInputComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `value` (getter/setter) | `string` | `''` | Backed by an internal `signal<string>('')`; `null`/`undefined` coerce to `''` (`[CODE]` :40-46). Bind for controlled reset/clear. **NOT** two-way via CVA — see below. |
| `placeholder` | `string` | `'Search…'` | Forwarded as `[attr.placeholder]` (`[CODE]` :49). |
| `debounceMs` | `number` | `300` | Debounce window before `falconSearch` fires (`[CODE]` :52). |
| `loading` | `boolean` | `false` | Consumer-controlled spinner — the component shows it, it does NOT run the search (`[CODE]` :55). |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Forwarded to the inner `<falcon-input>` sizing (`[CODE]` :58). |
| `disabled` | `boolean` | `false` | Forwarded to the inner input (`[CODE]` :61). |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-search-input-tw>` (Light DOM). `false` → `<falcon-search-input>` (Shadow DOM) (`[CODE]` :64). |

> No `label` / `helperText` / `errorMessage` / `required` / `clearable` / `inputId` inputs exist — by design (search-only). `clearable` is computed internally from whether the value is non-empty.

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `falconSearch` | `{ value: string }` | Debounced value change. Also fires with `''` when cleared (`[CODE]` falcon-search-input.tsx:91-93,105). |
| `falconSearchClear` | `{ previousValue: string }` | Fires when the clear-X is pressed; carries the term that was cleared (`[CODE]` falcon-search-input.tsx:96-106). |

> Wrapper binds the camelCase Stencil events `(falconSearch)` / `(falconSearchClear)` (`[CODE]` falcon-search-input.component.html:14-15,26-27) — names match the Stencil `@Event({ eventName: 'falconSearch' / 'falconSearchClear' })` exactly on BOTH render paths, so re-emission works (contrast loader-overlay's dead-event bug). The wrapper re-emits `event.detail` verbatim (`[CODE]` :78-84).

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-search-input/falcon-search-input.types.ts` (mirrored verbatim in the wrapper `[CODE]` falcon-search-input.component.ts:21-29):

```ts
type FalconSearchInputSize = 'sm' | 'md' | 'lg';
interface FalconSearchEventDetail { value: string; }
interface FalconSearchClearDetail { previousValue: string; }
```

## Reflected props (Stencil only)

`size` and `disabled` are `@Prop({ reflect: true })` on both `<falcon-search-input>` and `<falcon-search-input-tw>` (`[CODE]` falcon-search-input.tsx:43,46 / falcon-search-input-tw.tsx:34,35). `value`, `placeholder`, `debounceMs`, `loading` are NOT reflected.

## Mutable props (Stencil)

`value` is `@Prop({ mutable: true })` on both tags and `@Watch`ed (`onExternalValueChange`) to sync an externally-set value into the private `internalValue` state (`[CODE]` falcon-search-input.tsx:31,65-68 / falcon-search-input-tw.tsx:30,52-55).

## CVA / ngModel / Reactive Forms

**NO — the wrapper does NOT implement `ControlValueAccessor`** (no `NG_VALUE_ACCESSOR` provider; `[CODE]` falcon-search-input.component.ts:31-37 — `providers` absent). `[(ngModel)]` / `formControlName` will **not** drive the value. Bind via `[value]` (for controlled reset) + `(falconSearch)` for the live term. This is intentional: a search term is a view concern, never a saved form value (see BUSINESS.md). **GAP G1** tracks an optional CVA addition.

## Signal compatibility

The wrapper holds value in an Angular `signal<string>` exposed through a getter/setter `@Input value` (`[CODE]` :40-46). External binding is still `@Input` + `(falconSearch)` — no `input()`/`output()`/`model()` signal-API variant yet (legacy `@Input`/`@Output` decorators, `[CODE]` :40,67,70). `OnPush` change detection enforced (`[CODE]` :35).

## Methods (Stencil only — call via element ref)

| Method | Description |
|---|---|
| `setFocus()` | `@Method async setFocus()` on **both** Stencil tags — forwards to the inner `<falcon-input(-tw)>.setFocus?.()` (`[CODE]` falcon-search-input.tsx:77-80 / falcon-search-input-tw.tsx:63-66). |

> The Angular wrapper does **NOT** proxy `setFocus()` — there is no Angular-side `setFocus()` / `clear()`. To focus programmatically, reach the inner Stencil element via `ViewChild` + `nativeElement` and call `setFocus()`. **GAP G3.**

## Slots / template inputs

- **None** on any layer. Neither Stencil tag declares `<slot>`; the wrapper template has no `<ng-content>`. The magnifier and clear-X come entirely from the composed `<falcon-input variant="search">`, not from search-input markup.

## Supported sizes / states / variants

- Sizes: `sm` / `md` / `lg` (delegated to the inner input).
- **No `state` input** — search-input has no error/success/warning surface (it forwards no `state` to the inner input; the inner input stays `default`).
- **No `variant` / `appearance` inputs** — the inner input is hard-pinned to `variant="search" type="search"` (`[CODE]` falcon-search-input.tsx:116-117).

## Constraints

- Debounce is built-in (`setTimeout` in the Stencil layer, applies in BOTH render paths) — **never** add a second `debounceTime` in the consumer (`[CODE]` falcon-search-input.tsx:88-94).
- Clear fires **two** events: `falconSearchClear` AND `falconSearch({value:''})` (`[CODE]` falcon-search-input.tsx:104-105) — a consumer listening only to `falconSearch` already gets the reset.
- The inner `falcon-input` events are `stopPropagation()`-ed (`[CODE]` falcon-search-input.tsx:83,97) — the consumer never sees raw `falcon-input`/`falcon-clear`, only `falconSearch`/`falconSearchClear`.
- The Tailwind path (`useTailwind=true`, default) does NOT pass `clearAriaLabel` to the inner input (`[CODE]` falcon-search-input-tw.tsx:99-108) whereas the Shadow path sets `clearAriaLabel="Clear search"` (`[CODE]` falcon-search-input.tsx:123) — an a11y divergence on the DEFAULT path (**GAP / finding**).

## Accessibility

- The field is the composed `<falcon-input type="search">` — it inherits that primitive's label/aria wiring, focus ring, disabled guard. search-input adds none of its own field a11y.
- **Clear button label:** Shadow path → `clearAriaLabel="Clear search"` (`[CODE]` falcon-search-input.tsx:123). Tailwind path (default) → omitted, so the inner input's default `"Clear input"` is used → **inconsistent label on the default render path (finding A11y/B parity)**.
- **Loading spinner:** wrapped in `<span role="status" aria-label="Loading">` on both paths (`[CODE]` falcon-search-input.tsx:128-135 / falcon-search-input-tw.tsx:110-116).
- **No `aria-busy`** is set on the host when `loading` is true on either path (only the spinner span carries `role="status"`) — a screen-reader cannot tell the field itself is busy (**finding A1**).
- No `role="search"` / `role="searchbox"` landmark on the host (the inner input is `type="search"`, which conveys the searchbox role natively).

## Verification
🟢 code-verified against `falcon-search-input.component.ts/.html`, `falcon-search-input.tsx`, `falcon-search-input-tw.tsx`, `falcon-search-input.types.ts` (read 2026-06-03). No-CVA, double-event-on-clear, built-in-debounce, `clearAriaLabel` Tailwind-omission, no-`aria-busy` all ✅ source-verified. Corrects prior API.md "(verify Stencil)" stubs.
