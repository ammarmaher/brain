# falcon-button — API

## Selectors
- Angular: `falcon-angular-button`
- Stencil Shadow: `<falcon-button>` (tag `'falcon-button'`, `shadow: true`)
- Stencil Light: `<falcon-button-tw>` (tag `'falcon-button-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularButtonComponent } from '@falcon/ui-core/angular-wrapper/components/falcon-button';
// or via barrel:
import { FalconAngularButtonComponent } from '@falcon/ui-core';
```

Add `FalconAngularButtonComponent` to the consuming standalone component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is already set internally on the wrapper (`[CODE]` falcon-button.component.ts:28) — the host component does NOT need it.

## Inputs (all on `FalconAngularButtonComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'link' \| 'dashed' \| 'outline' \| 'primary-dark' \| 'outline-primary-dark' \| 'outline-danger'` | `'primary'` | `[CODE]` falcon-button.component.ts:32. **10 variants** (was 5 in the prior dossier — DRIFT corrected). Forwarded as `[attr.variant]` to BOTH render paths. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `[CODE]` :33. Maps to `--falcon-button-height-{sm,md,lg}` (34/38/44 px). |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | `[CODE]` :34. Native `<button type>`. |
| `disabled` | `boolean` | `false` | `[CODE]` :35. Forwarded as presence attr (`disabled ? '' : null`). Stencil ALSO sets the native `disabled` when `disabled \|\| loading`. |
| `loading` | `boolean` | `false` | `[CODE]` :36. Shows the spinner overlay + collapses label opacity (width-stable). Click suppressed while loading. |
| `fullWidth` | `boolean` | `false` | `[CODE]` :37. Flips host + inner element to `block; width:100%` via the `--full-width` HostBinding class. |
| `iconOnly` | `boolean` (`transform: booleanAttribute`) | `false` | `[CODE]` :38. Square aspect, padding+gap zeroed. Caller MUST supply `ariaLabel`. Also auto-inferred by Stencil when no label + an `icon-start` slot exists (`[CODE]` falcon-button.tsx:87-88). |
| `label` | `string \| undefined` | `undefined` | `[CODE]` :39. Plain-text label. `slot="label"` content overrides it. |
| `ariaLabel` | `string \| undefined` | `undefined` | `[CODE]` :40. Forwarded as `[attr.aria-label]`. Required for icon-only. |
| `name` | `string \| undefined` | `undefined` | `[CODE]` :41. Native form-submit name. |
| `valueAttr` | `string \| undefined` | `undefined` | `[CODE]` :42. Native form-submit value (forwarded as `value-attr` to dodge clashing with Angular's `value` binding on the host — never bind `[value]`). |
| `useTailwind` | `boolean` | `true` | `[CODE]` :45. **Render-path switch.** `true` → `<falcon-button-tw>` (Light DOM). `false` → `<falcon-button>` (Shadow DOM). |
| `rootClass` | `string` | `''` | `[CODE]` :46. Caller-supplied extra classes on the root `<button>`, forwarded as `root-extra-class`. **Tailwind path only** — the Shadow tag has no `rootExtraClass` prop (GAP G1). |

> `[CODE]` There are **no** `borderless` / `flat` / `appearance` props — unlike `<falcon-input>`, the button's surface is fully variant-driven. Radius is the single token `--falcon-button-border-radius` (10 px), not a prop.

### Stencil-only props (NOT on the Angular wrapper, but available on the raw tags)

| Prop | Type | Default | Available on |
|---|---|---|---|
| `rootExtraClass` | `string` | `undefined` | `<falcon-button-tw>` ONLY `[CODE]` falcon-button-tw.tsx:52 (surfaced on the wrapper as `rootClass`). Shadow tag lacks it (GAP G1). |

> `[CODE]` Every behaviour prop (`variant`/`size`/`type`/`disabled`/`loading`/`fullWidth`/`iconOnly`/`label`/`ariaLabel`/`name`/`valueAttr`) exists IDENTICALLY on both Stencil tags, `@Prop({ reflect: true })` on the reflected ones — **prop parity is complete** (`[CODE]` falcon-button.tsx:32-46 vs falcon-button-tw.tsx:39-49). The ONLY divergence is `rootExtraClass` (`-tw`-only).

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `(falconClick)` | `MouseEvent` | `[CODE]` falcon-button.component.ts:49 — the **only** Angular `@Output`. Bridged from the Stencil `falcon-click` `CustomEvent<{ nativeEvent: MouseEvent }>` (`[CODE]` :69-74 `handleClick` unwraps `detail.nativeEvent`). Fires only when NOT disabled/loading (the Stencil tags guard + `preventDefault`/`stopPropagation` — `[CODE]` falcon-button.tsx:67-74 / falcon-button-tw.tsx:71-78). |
| `falcon-click` | `CustomEvent<{ nativeEvent: MouseEvent }>` | Raw Stencil event (bubbles + composed) emitted by BOTH tags `[CODE]` falcon-button.tsx:49 / falcon-button-tw.tsx:55. |

> `[CODE]` Event-name parity is clean: BOTH tags declare explicit `eventName: 'falcon-click'` (kebab), so the wrapper's `(falcon-click)` binding matches on BOTH render paths (contrast the `falcon-loader-overlay` camelCase mismatch found in B-CAL — that class of bug does NOT exist here).

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-button/falcon-button.types.ts`:

```ts
type FalconButtonVariant =
  | 'primary' | 'secondary' | 'ghost' | 'danger' | 'link' | 'dashed'
  | 'outline' | 'primary-dark' | 'outline-primary-dark' | 'outline-danger';
type FalconButtonSize = 'sm' | 'md' | 'lg';
type FalconButtonType = 'button' | 'submit' | 'reset';
interface FalconButtonClickDetail { readonly nativeEvent: MouseEvent; }
```

> `[CODE]` The wrapper re-declares the three string-union types INLINE (falcon-button.component.ts:18-20) rather than importing from `falcon-button.types.ts`. They are kept structurally identical — a minor DRY drift (GAP G2): adding an 11th variant requires editing two files.

## Reflected props (Stencil only)

`variant`, `size`, `type`, `disabled`, `loading`, `fullWidth`, `iconOnly` are `@Prop({ reflect: true })` on BOTH tags, so `:host([disabled])`, `:host([full-width])`, `:host([loading])` CSS can target them (`[CODE]` falcon-button.css:13-21).

## Mutable props (Stencil)

None. The button is stateless — there is no `value`, no `@State` that mutates from user input.

## CVA / ngModel / Reactive Forms

**N/A — the button is not a form-value control.** It implements no `ControlValueAccessor`. It participates in native form submission only via `type="submit"` + `name`/`valueAttr` on the inner native `<button>`. For `type="submit"`, handle the flow from the form's `(ngSubmit)`, not `(falconClick)` (both fire).

## Signal compatibility

The wrapper uses **classic `@Input()` decorators** (no `input()`/`model()` signal inputs yet — GAP G5), `OnPush` change detection (`[CODE]` :27). Internal state: none. The full-width host class is a computed `@HostBinding` getter (`[CODE]` :58-61).

## Methods (Stencil only — call via element ref)

| Method | Description | Available on |
|---|---|---|
| `setFocus()` | Programmatically focuses the inner native `<button>`. | BOTH tags `[CODE]` falcon-button.tsx:55-58 / falcon-button-tw.tsx:60-63 |
| `clickProgrammatic()` | Triggers a native click — respects disabled/loading (no-op if either). | BOTH tags `[CODE]` falcon-button.tsx:61-65 / falcon-button-tw.tsx:65-69 |

> `[CODE]` The Angular wrapper does NOT proxy these — there is no `focus()` / `click()` on `FalconAngularButtonComponent` (GAP G3). To call them, obtain the inner Stencil element via `ViewChild` + the native element. (Same shape as the `falcon-input` G2.)

## Slots / template inputs

`[CODE]` falcon-button.component.html — both render branches project THREE named slots via `ng-content` + `ngProjectAs`:
- `slot="icon-start"` (`[CODE]` html:22/41) — leading icon.
- `slot="label"` (`[CODE]` html:23/42) — rich label content (overrides the `label` prop string; `[CODE]` Shadow `hasSlottedLabel()` text-content check at falcon-button.tsx:77-83).
- `slot="icon-end"` (`[CODE]` html:24/43) — trailing icon.

The Stencil tags render these into sized icon `<span>`s (`--falcon-button-icon-size-{sm,md,lg}` = 14/16/18 px). `[CODE]` The `-tw` twin only renders the icon-start / icon-end wrappers when content is actually slotted (`hasSlottedIconStart()`/`hasSlottedIconEnd()` — falcon-button-tw.tsx:81-91) to kill phantom `gap-*` space (Wave 19 fix); the Shadow tag always renders the wrappers (`[CODE]` falcon-button.tsx:142-153) and `::slotted(*)`-sizes them. Structural divergence only, not behavioural (GAP G7).

## Supported sizes / states / variants

- **Sizes:** `sm` (34 px), `md` (38 px), `lg` (44 px) — `[CODE]` button.tokens.css:47-49.
- **Variants (10):** `primary` (teal fill), `secondary` (white + neutral border), `ghost` (transparent), `danger` (red fill), `link` (transparent text-only, no underline — Wave 19), `dashed` (teal dashed "add another" affordance — Wave 13b GAP-LIB-009), `outline` (white + neutral border + muted text, teal-700 hover — "Switch perspective"), `primary-dark` (teal-700 fill — "+ Create Template"), `outline-primary-dark` (white + teal-700 border/text — Approve-unselected), `outline-danger` (white + red-500 border/text — Reject-unselected).
- **States:** idle / hover / active / focus-visible (3-stop teal halo; red halo `--falcon-button-shadow-focus-danger` for danger + outline-danger) / disabled (opacity 0.5 + `not-allowed`) / loading (spinner + label opacity 0).
- **Modes:** `fullWidth` (block 100%), `iconOnly` (square, zero padding/gap).

## Constraints

- `[CODE]` `rootClass` flows ONLY to the Tailwind path (`root-extra-class`) — the Shadow tag has no `rootExtraClass` prop, so it is dropped in Shadow mode (GAP G1).
- `[CODE]` Click is suppressed while `disabled` OR `loading` — both Stencil handlers `preventDefault` + `stopPropagation` and return early (falcon-button.tsx:67-74). Do not rely on `(falconClick)` firing during a load cycle.
- `[CODE]` `iconOnly` requires `ariaLabel` for accessibility — there is no enforcement, only convention (falcon-button.tsx:38 doc).
- `[CODE]` `link` underline divergence: the Shadow path underlines `link` on hover (falcon-button.css:164-167), but the `-tw` (default) path keeps `no-underline` even on hover (button-tailwind-classes.ts:98-99). A subtle visual drift between render paths (GAP G8).
- `[CODE]` Never bind `[value]` on the host — bind `[valueAttr]` (the raw `value` clashes with Angular's value binding).

## Accessibility

- `[CODE]` Native `<button>` is the visible control — keyboard (Enter/Space) + form semantics for free (falcon-button.tsx:3 banner).
- `aria-label={ariaLabel}` forwarded (both tags).
- `aria-disabled={ariaBool(disabled)}` + `aria-busy={ariaBool(loading)}` on the native button (`[CODE]` falcon-button.tsx:109-110 / falcon-button-tw.tsx:133-134) via the shared `ariaBool` util (`../../utils/a11y`).
- Native `disabled` attribute is set when `disabled || loading` (`[CODE]` :107 / :131) — so the button is genuinely non-focusable/non-clickable while busy, not just dimmed.
- `focus-visible` paints the canonical teal halo (`--falcon-button-shadow-focus`; red for danger).
- Spinner `<span>` is `aria-hidden="true"` (`[CODE]` falcon-button.tsx:115 / falcon-button-tw.tsx:138) — decorative; `aria-busy` carries the busy state to AT.

## Shadow parts (Shadow tag only)

`[CODE]` `<falcon-button>` exposes `part="root"` (native button), `part="spinner"`, `part="content"`, `part="icon-start"`, `part="label"`, `part="icon-end"` (falcon-button.tsx:104-153). The `-tw` twin (Light DOM) exposes class names directly instead.

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-button.component.ts (75 ln), .component.html (45 ln), falcon-button.tsx (160 ln), falcon-button-tw.tsx (189 ln), button-tailwind-classes.ts (253 ln), falcon-button.types.ts. Variant count corrected 5 → **10**; event-name parity confirmed clean (explicit kebab `eventName` on both tags); method-proxy gap (G3), `rootExtraClass` Shadow-absence (G1), inline-type DRY drift (G2), and `link` underline divergence (G8) recorded.
