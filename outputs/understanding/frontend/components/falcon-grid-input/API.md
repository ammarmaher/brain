# falcon-grid-input — API

## Selectors

- Angular: `falcon-angular-grid-input`
- Stencil Shadow: `<falcon-grid-input>` (tag `'falcon-grid-input'`, `shadow: true`)
- Stencil Light: `<falcon-grid-input-tw>` (tag `'falcon-grid-input-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularGridInputComponent } from '@falcon/ui-core';
```

Add to the host's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is declared on the wrapper internally (`[CODE]` falcon-grid-input.component.ts:34) — the host does NOT need it.

## Inputs (all on `FalconAngularGridInputComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `value` (getter/setter) | `string` | `''` | Backed by `signal<string>('')`; `null`/`undefined` coerce to `''` (`[CODE]` :38-43). |
| `originalValue` | `string` | `''` | The persisted value restored on **Escape**. If omitted, Escape reverts the cell to `''` (`[CODE]` :47). |
| `autoFocus` | `boolean` | `true` | Auto-focuses the inner input on mount when `!disabled` (`[CODE]` :50, falcon-grid-input.tsx:65-69). Live consumers set `[autoFocus]="false"`. |
| `disabled` | `boolean` | `false` | Forwarded to the inner input; a disabled cell never auto-focuses (`[CODE]` :53). |
| `useTailwind` | `boolean` | `true` | Render-path switch: `true` → `<falcon-grid-input-tw>` (Light DOM); `false` → `<falcon-grid-input>` (Shadow) (`[CODE]` :56). |

> No `label` / `helperText` / `errorMessage` / `state` / `size` / `mode` inputs — by design (pure cell editor; size is hard-pinned `sm`, variant hard-pinned `grid`).

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `falconGridCommit` | `{ value: string }` | Fired on **Enter**, **Tab**, or **blur** (`[CODE]` falcon-grid-input.tsx:91,102,118). De-duped: Enter/Tab set `committed=true` so the following blur does NOT re-fire. |
| `falconGridCancel` | `void` | Fired on **Escape**; value already reverted to `originalValue` locally (`[CODE]` falcon-grid-input.tsx:105-112). |
| `falconGridNavigate` | `{ direction: 'next' \| 'previous' }` | Fired on **Tab** (`next`) / **Shift+Tab** (`previous`) AFTER the commit (`[CODE]` falcon-grid-input.tsx:114-122). |

> Wrapper binds the camelCase Stencil events `(falconGridCommit)` / `(falconGridCancel)` / `(falconGridNavigate)` (`[CODE]` falcon-grid-input.component.html:12-14,23-25) — names match the Stencil `@Event({ eventName: 'falconGrid…' })` exactly on BOTH render paths → re-emission works. Wrapper re-emits `event.detail` verbatim (`[CODE]` :73-83).

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-grid-input/falcon-grid-input.types.ts` (mirrored in the wrapper `[CODE]` :21-27):

```ts
interface FalconGridCommitDetail { value: string; }
interface FalconGridNavigateDetail { direction: 'next' | 'previous'; }
```

## Reflected props (Stencil only)

`disabled` is `@Prop({ reflect: true })` on both tags (`[CODE]` falcon-grid-input.tsx:39 / falcon-grid-input-tw.tsx:31). `value`, `originalValue`, `autoFocus` are NOT reflected.

## Mutable props (Stencil)

`value` is `@Prop({ mutable: true })` on both tags, `@Watch`ed (`onExternalValueChange`) → syncs into `internalValue` (`[CODE]` falcon-grid-input.tsx:30,71-74 / falcon-grid-input-tw.tsx:28,60-63).

## CVA / ngModel / Reactive Forms

**NO CVA** (no `NG_VALUE_ACCESSOR` provider; `[CODE]` falcon-grid-input.component.ts:29-35). `[(ngModel)]` / `formControlName` will not bind. Bind via `[value]` + `(falconGridCommit)`. Grid edits are imperative cell mutations, not reactive-forms controls — deliberate.

## Signal compatibility

Wrapper holds value in an Angular `signal<string>` via a getter/setter `@Input` (`[CODE]` :44). External binding is `@Input` + events; no `input()`/`output()`/`model()` signal-API variant (legacy decorators). `OnPush` enforced (`[CODE]` :33).

## Methods (Stencil only — call via element ref)

| Method | Description |
|---|---|
| `setFocus()` | `@Method async setFocus()` on both tags → forwards to the inner `<falcon-input(-tw)>.setFocus?.()` (`[CODE]` falcon-grid-input.tsx:77-80 / falcon-grid-input-tw.tsx:65-68). |

> The Angular wrapper does NOT proxy `setFocus()` (nor `commit()`/`cancel()`/`selectAll()`). **GAP G3.** `autoFocus=true` covers the common cell-edit case without a manual call.

## Slots / template inputs

- **None** on any layer. No `<slot>`, no `<ng-content>`. The field is entirely the composed `<falcon-input variant="grid">`.

## Supported sizes / states / variants

- **Size is hard-pinned `sm`** (`[CODE]` falcon-grid-input.tsx:136) — no `size` input.
- **Variant is hard-pinned `grid`** (`[CODE]` falcon-grid-input.tsx:135) — no `variant`/`appearance` input.
- **No `state`** — no error / success / warning surface; the inner input stays `default` (no validation visuals).

## Constraints

- **Enter / Tab / blur all commit** → `falconGridCommit` (`[CODE]` falcon-grid-input.tsx:91,102,118). Trust the `committed` flag: Enter-then-blur yields exactly one commit — do NOT also commit in a host blur handler (would double-write).
- **Escape reverts** to `originalValue` and emits `falconGridCancel` (no backend call) (`[CODE]` falcon-grid-input.tsx:105-112).
- **Tab is hijacked** — `preventDefault()` + turned into `falconGridNavigate`. Native tab order does NOT apply; the host must implement cell-to-cell focus from the navigate event or focus is lost (`[CODE]` falcon-grid-input.tsx:114-122).
- **String value only** — a price/quota cell commits a raw string the consumer must parse/validate (no numeric mode — GAP G1).
- Inner `falcon-input` events are `stopPropagation()`-ed (`[CODE]` falcon-grid-input.tsx:83,89) — the consumer sees only the three `falconGrid*` events.

## Accessibility

- The field is the composed `<falcon-input variant="grid">` — it inherits that primitive's focus ring + disabled guard. grid-input adds none of its own field a11y.
- **No `aria-label` input on the wrapper** (`[CODE]` falcon-grid-input.component.ts has no `ariaLabel`) — a cell editor in a matrix is unlabelled for screen readers unless the host wraps it. The inner input also gets no per-column label. **GAP / finding** — add an `ariaLabel` passthrough so the host can announce "edit {column} for {row}".
- Keyboard contract (Enter/Escape/Tab) is fully operable; Tab navigation is event-driven so the host implements focus order.
- **Focus-on-cancel:** the component does not return focus to a triggering element after Escape — the host owns post-cancel focus.

## Verification
🟢 code-verified against `falcon-grid-input.component.ts/.html`, `falcon-grid-input.tsx`, `falcon-grid-input-tw.tsx`, `falcon-grid-input.types.ts` (read 2026-06-03). Committed-flag de-dup, Tab-hijack, blur-commits, hard-pinned size/variant, no-CVA, no-aria-label ✅ source-verified. Resolves prior "(verify)" a11y stub.
