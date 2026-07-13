# falcon-resizable-split-pane — API

> Single-render pure-Angular shared-ui component. **No Stencil tags, no `@Prop`/reflected/mutable props** — N/A. State is Angular signals (`input()` / `model()` / `output()` / `signal()` / `computed()` / `viewChild.required()`). Two-way value via `model()`. `ViewEncapsulation.None` + an inline `styles:` block.

## Selectors

- Angular component: `falcon-resizable-split-pane` (`[CODE]` ts:65)
- Content slots: `[slot=left-header]` · `[slot=left]` · `[slot=right]` (`[CODE]` html:28/37/75)

## Import

```ts
import {
  FalconResizableSplitPaneComponent,
  // pure math helpers (also exported, for consumers/tests that want the same formulas):
  clampLeftWidth, computeMaxLeftWidth, widthFromPointer, stepLeftWidth,
  resolveLeftBasis, mirrorTranslateY, forwardWheelScrollTop, gripCenterLeft,
  type SplitPaneClampConfig,
} from '@falcon'; // re-exported via libs/falcon/src/shared-ui/index.ts:174
```

`[CODE]` The barrel (index.ts:6-17) exports the component, **all 8 pure math functions**, and the `SplitPaneClampConfig` type. Add `FalconResizableSplitPaneComponent` to the consuming standalone component's `imports: []`. No `CUSTOM_ELEMENTS_SCHEMA` needed.

## Inputs (signal inputs on `FalconResizableSplitPaneComponent`)

`[CODE]` falcon-resizable-split-pane.component.ts:131-146 — geometry + label inputs (sensible wallet-parity defaults; consumers override):

| Name | Type | Default | Notes |
|---|---|---|---|
| `leftDefaultWidth` | `input<number>` | `272` | `[CODE]` ts:133 — LEFT pane width (px) when no explicit width is set (matches wallet org pane). |
| `leftMinWidth` | `input<number>` | `160` | `[CODE]` ts:135 — minimum LEFT pane width (px). Floor of the clamp + `aria-valuemin`. |
| `rightReserveWidth` | `input<number>` | `260` | `[CODE]` ts:137 — reserved minimum RIGHT pane width; `max-left = container − this`. |
| `arrowStep` | `input<number>` | `24` | `[CODE]` ts:139 — ArrowLeft/ArrowRight step (px). |
| `resizerAriaLabel` | `input<string>` | `'Resize columns'` | `[CODE]` ts:141 — accessible label for the separator handle (pass an already-translated string). |
| `resizerTitle` | `input<string>` | `''` | `[CODE]` ts:143 — tooltip/title for the handle (already-translated; rendered only when non-empty, html:55). |

## Two-way model

`[CODE]` ts:146:

| Name | Type | Default | Notes |
|---|---|---|---|
| `leftWidth` | `model<number \| null>` | `null` | `[CODE]` ts:146 — the explicit left width (px), or `null` = "use the CSS default basis token". **Two-way bindable: `[(leftWidth)]="…"`.** The component sets it on drag/arrow (ts:234/265) and clears it to `null` on reset (ts:270) + on out-of-bounds reclamp (ts:284). |

## Outputs

`[CODE]` ts:149-152:

| Name | Payload | Notes |
|---|---|---|
| `(resize)` | `number` | `[CODE]` ts:150 — emits the clamped left width (px) on every drag/keyboard change (ts:235/266/285). |
| `(resetWidth)` | `void` | `[CODE]` ts:152 — emits when the width is reset to default via double-click (ts:271). |

## Internal signals / computed (`protected`)

`[CODE]` ts:154-169:

| Member | Type | Logic |
|---|---|---|
| `dragging` | `signal(false)` | `[CODE]` ts:154 — true during an active drag; drives `[class.is-dragging]` (html:47) + the `pointer-events-none` on both panes (html:34/72). |
| `leftBasis` | `computed<string \| null>` | `[CODE]` ts:157-160 — `null` when `leftWidth()` is null (CSS default token wins); else `'0 0 {w}px'` flex-basis. |
| `ariaNow` | `computed<number>` | `[CODE]` ts:163 — `leftWidth() ?? leftDefaultWidth()` → `aria-valuenow` (html:53). |
| `computeMaxLeftWidth` | (re-exported pure fn) | `[CODE]` ts:305 — exposed `protected` so the template can compute `aria-valuemax` inline (html:54). |

`[CODE]` viewChild refs: `splitEl` (`#split`), `rightScrollEl` (`#rightScroll`), `leftStackEl` (`#leftStack`) — all `viewChild.required` (ts:167-169).

## TypeScript types

`[CODE]` falcon-resizable-split-pane.math.ts:19-26 (exported via barrel):

```ts
interface SplitPaneClampConfig {
  readonly containerWidth: number;   // total inner width of the split container (px)
  readonly minLeftWidth: number;     // minimum LEFT pane width (px)
  readonly rightReserveWidth: number;// reserved RIGHT-pane width; max-left = containerWidth − this
}
```

## Pure math API (exported for consumers/tests)

`[CODE]` falcon-resizable-split-pane.math.ts — all DOM-less + unit-testable:

| Function | Signature | Purpose |
|---|---|---|
| `computeMaxLeftWidth` | `(cfg) => number` | `[CODE]` :31-33 — `max(minLeftWidth, containerWidth − rightReserveWidth)`. |
| `clampLeftWidth` | `(desired, cfg) => number` | `[CODE]` :37-40 — clamp into `[min, max]`, rounded to whole px. |
| `widthFromPointer` | `(pointerClientX, containerLeft, cfg) => number` | `[CODE]` :45-51 — `clamp(pointerX − containerLeft)`; the drag formula. |
| `stepLeftWidth` | `(current, dir, step, defaultWidth, cfg) => number` | `[CODE]` :56-65 — keyboard nudge `(current ?? default) ± step`, clamped. |
| `resolveLeftBasis` | `(width) => number \| null` | `[CODE]` :71-73 — identity passthrough modelling the reset-to-default (`null`) contract. |
| `mirrorTranslateY` | `(rightScrollTop) => string` | `[CODE]` :78-80 — `translateY(−rightScrollTop px)` for the left-stack scroll mirror. |
| `forwardWheelScrollTop` | `(currentScrollTop, deltaX, deltaY) => number \| null` | `[CODE]` :86-95 — new right scrollTop after a forwarded wheel; `null` when the wheel is predominantly horizontal (ignore). |
| `gripCenterLeft` | `(resizerLeft, resizerWidth) => number` | `[CODE]` :102-104 — centre-x of the resizer. **RETAINED but the component no longer calls it** — the grip now centres via CSS (see Methods/Constraints). |

## Reflected props / mutable props

**N/A** — no Stencil layer. (`leftWidth` is the only mutable state, exposed as a two-way `model()`.)

## CVA / ngModel / Reactive Forms

**N/A — not a form control.** It implements no `ControlValueAccessor`. (`leftWidth` is a `model()`, not a form value — bind `[(leftWidth)]`, not `[(ngModel)]`.)

## Signal compatibility

`[CODE]` **Fully signal-based + zoneless-aware.** Inputs `input()`, two-way `model()`, `output()`, internal `signal()`/`computed()`, `viewChild.required()`. `OnPush` (ts:67). `@if`/`@for` are not needed (no list/conditional in the template — it's a fixed 3-slot structure). Teardown is explicit (`DestroyRef.onDestroy` for the resize listener ts:296; `ngOnDestroy` cancels rAF + timer ts:299-302) — proper zoneless teardown.

## Methods

`[CODE]` All `protected` (template event handlers) — no PUBLIC API methods:

| Method | Trigger | Purpose |
|---|---|---|
| `onRightScroll()` | `(scroll)` on right pane (html:73) | `[CODE]` ts:186-202 — mirror the left stack via rAF loop + a 120ms scroll-end settle. |
| `onLeftWheel(e)` | `(wheel)` on left body (html:34) | `[CODE]` ts:206-213 — forward a predominantly-vertical wheel to the right pane's scrollTop. |
| `startResize(ev)` | `(mousedown)`/`(touchstart)` on resizer (html:57-58) | `[CODE]` ts:222-250 — begin drag; attach document move/up listeners; set body `user-select:none` + `cursor:col-resize`. |
| `onResizeKey(e)` | `(keydown)` on resizer (html:59) | `[CODE]` ts:252-267 — ArrowLeft/ArrowRight step. |
| `reset()` | `(dblclick)` on resizer (html:58) | `[CODE]` ts:269-272 — set `leftWidth=null` + emit `resetWidth`. |

> `[CODE]` The grip pill is **centred on the resizer purely via CSS** (position:absolute + 50%/translate, html:61-64) — there is **no JS grip placement** at runtime. `gripCenterLeft()` is retained as a pure helper for tests/consumers but is uncalled by the component (math.ts:99-104; ts comment 28-29). This replaced an old `position:fixed` grip-at-viewport-middle bug (html:8-9).

## Slots / template inputs

`[CODE]` Three `<ng-content select>` slots (html:28/37/75):

| Slot | Where it renders | Notes |
|---|---|---|
| `[slot=left-header]` | LEFT pane, **outside** the mirrored scroll (`flex-none`, html:27-29) | A static header that does NOT scroll (e.g. the wallet org card's `position:static` head). |
| `[slot=left]` | LEFT pane body, inside the transform-mirrored stack (`#leftStack`, html:36-38) | Mirrored vertically to follow the right scroll; its own scrollbar is hidden. |
| `[slot=right]` | RIGHT pane, the single scroll region (`#rightScroll`, html:69-76) | Owns the scrollbar; sticky header + body live here. |

## Supported sizes / states / variants / appearances

- **No size/variant/appearance axis** — geometry is driven by the numeric inputs (`leftDefaultWidth`/`leftMinWidth`/`rightReserveWidth`/`arrowStep`), not discrete sizes.
- **States:** `dragging` (drives `is-dragging` + active grip size + `pointer-events-none` on panes) and grip hover/focus-visible (CSS, ts:102-109). `@media (prefers-reduced-motion: reduce)` disables the idle grip-nudge (ts:122-126).

## Constraints

- `[CODE]` Strictly **two panes + an optional left header** — three slots, no more.
- `[CODE]` **Vertical divider only** (left/right split); no horizontal mode.
- `[CODE]` The **RIGHT pane owns the only scrollbar**; the LEFT pane's scrollbar is hidden (`scrollbar-width:none` + `::-webkit-scrollbar{display:none}`, ts:82-89) and it mirrors via transform. Consumers must put their scroll content in `[slot=right]`.
- `[CODE]` `leftWidth` is clamped to `[leftMinWidth, container − rightReserveWidth]` on drag/arrow/window-resize (ts:233/258-264/277-287). Setting it out of range gets clamped.
- `[CODE]` `ViewEncapsulation.None` — the inline `styles:` (grip pulse `@keyframes`, hidden scrollbar, parent-state grip rules) are **global**; they are scoped by the `.falcon-split-*` class names + the token `:where(...)` (ts:68-73). A consumer must not redefine those class names.
- `[CODE]` During drag, both panes get `pointer-events-none` (html:34/72) so a drag doesn't select/click pane content.

## Accessibility

`[CODE]` **Strong** — the resizer is a proper separator (html:44-60):
- `role="separator"` + `aria-orientation="vertical"` (html:48-49).
- `tabindex="0"` (focusable) (html:50).
- `[attr.aria-label]="resizerAriaLabel()"` (html:51) — a translated label.
- `[attr.aria-valuemin]="leftMinWidth()"` / `[attr.aria-valuenow]="ariaNow()"` / `[attr.aria-valuemax]="computeMaxLeftWidth({…})"` (html:52-54) — live width reflected.
- `[attr.title]="resizerTitle() || null"` (html:55) — optional tooltip.
- ArrowLeft/ArrowRight keyboard operability (ts:252-267).
- `:focus { outline: none }` on the resizer (ts:110-112) but `:focus-visible` grows the grip (ts:103) — so keyboard focus IS visually indicated via the grip (acceptable focus affordance, though see GAPS A2 re: the removed default outline).
- The grip pill is `aria-hidden="true"` + `pointer-events-none` (html:62-63) — decorative.
- `@media (prefers-reduced-motion: reduce)` disables the idle grip-nudge animation (ts:122-126) — respects motion preferences.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26) against falcon-resizable-split-pane.component.ts (307 ln) + .html (79 ln) + .math.ts (105 ln) + index.ts. 6 inputs + 1 two-way `model` (`leftWidth`) + 2 outputs (`resize`/`resetWidth`); 8 exported pure math fns + `SplitPaneClampConfig`; full `role="separator"` a11y + Arrow keys + reduced-motion; CSS-centred grip (gripCenterLeft retained-but-uncalled). All confirmed in live source.
