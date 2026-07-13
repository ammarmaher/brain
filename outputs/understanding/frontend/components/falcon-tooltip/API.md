# falcon-tooltip — API

## Selectors

- Angular: `falcon-angular-tooltip`
- Stencil Shadow: `<falcon-tooltip>` (tag `'falcon-tooltip'`, `shadow: true`)
- Stencil Light: `<falcon-tooltip-tw>` (tag `'falcon-tooltip-tw'`, `shadow: false`)

## Import

```ts
import {
  FalconAngularTooltipComponent,
  type FalconTooltipPlacement,
} from '@falcon/ui-core/angular';
```

`[CODE]` The wrapper declares `CUSTOM_ELEMENTS_SCHEMA` internally (`[CODE]` falcon-tooltip.component.ts:40) and calls `defineFalconTwComponent('falcon-tooltip')` in `ngOnInit` (`[CODE]` ts:45).

## Inputs (`FalconAngularTooltipComponent` — `[CODE]` falcon-tooltip.component.ts:74-83)

| Name | Type | Default | Notes |
|---|---|---|---|
| `content` | `string \| undefined` | `undefined` | Plain-text tooltip body. Overridden by `slot="content"` (`<slot name="content">{this.content}</slot>` — `[CODE]` falcon-tooltip.tsx:194). |
| `placement` | `FalconTooltipPlacement` (12 values) | `'top'` | Side + alignment. Reflected on the Stencil tag. |
| `delay` | `number` | `100` | Show delay (ms). Hide delay is hardcoded 80ms (`[CODE]` falcon-tooltip.tsx:110). |
| `disabled` | `boolean` | `false` | Suppresses show. Reflected. **No `@Watch`** — an already-open tooltip is NOT auto-closed on disable (GAP G2). |
| `interactive` | `boolean` | `false` | Keeps the panel open while the pointer is over it (for a link inside). Reflected. |
| `maxWidth` | `string \| undefined` | `undefined` | Inline `max-width` on the panel — the ONLY consumer-controllable inline style beyond the position transform (`[CODE]` falcon-tooltip.tsx:159-162). |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-tooltip-tw>` (Light DOM). `false` → `<falcon-tooltip>` (Shadow DOM). |
| `rootClass` | `string` | `''` | Extra class forwarded via `[class]` (BOTH paths) (`[CODE]` html:13/27). |

## Outputs (`[CODE]` falcon-tooltip.component.ts:84-85)

| Name | Payload | Notes |
|---|---|---|
| `(falconShow)` | `FalconTooltipShowDetail` (`{ placement }`) | Re-emitted from Stencil `falcon-show`. The wrapper ALSO schedules the Top-Layer acquire on this event (`[CODE]` falcon-tooltip.component.ts:89-95). |
| `(falconHide)` | `FalconTooltipHideDetail` (`{ reason: 'pointer-leave' \| 'blur' \| 'disabled' \| 'programmatic' }`) | Re-emitted from Stencil `falcon-hide`. The wrapper ALSO releases the Top Layer here (idempotent) (`[CODE]` ts:97-103). |

## Stencil events (raw tag)

`[CODE]` Both `<falcon-tooltip>` + `<falcon-tooltip-tw>` emit `falcon-show` + `falcon-hide` (`bubbles:true, composed:true`) (`[CODE]` falcon-tooltip.tsx:45-48 / falcon-tooltip-tw.tsx:46-49). Wrapper binds both on BOTH branches (`[CODE]` html:14-15/28-29). **Full event parity.**

## TypeScript types

```ts
type FalconTooltipPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'right' | 'right-start' | 'right-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end';
interface FalconTooltipShowDetail { readonly placement: FalconTooltipPlacement; }
interface FalconTooltipHideDetail { readonly reason: 'pointer-leave' | 'blur' | 'disabled' | 'programmatic'; }
```

All re-exported from the barrel (`[CODE]` index.ts:3-7) + `@falcon`.

## Reflected props (Stencil)

`[CODE]` `placement`, `disabled`, `interactive` reflect on `<falcon-tooltip>`/`-tw` (`[CODE]` falcon-tooltip.tsx:35/37/38) so `:host([disabled])` + `data-placement` CSS resolve. `content`, `delay`, `maxWidth` do NOT reflect.

## CVA / ngModel / Reactive Forms

**NONE.** Not a form control.

## Signal compatibility

`[CODE]` The wrapper uses classic `@Input()`/`@Output()` decorators + `inject()` for `FalconStackingService` + `ElementRef` (`[CODE]` falcon-tooltip.component.ts:66-87). NOT signal-input. `OnPush` enforced. Proper teardown: `ngOnDestroy` → `releaseTopLayer()` (`[CODE]` ts:70-72).

## Methods (Stencil only — via element ref)

| Method | Description | Available on |
|---|---|---|
| `open()` | Programmatic show — no-op if `disabled`; respects `delay` | BOTH tags (`[CODE]` falcon-tooltip.tsx:64-68 / falcon-tooltip-tw.tsx:64-68) |
| `close()` | Programmatic hide → `falcon-hide` `{ reason: 'programmatic' }` | BOTH tags (`[CODE]` falcon-tooltip.tsx:71-74 / falcon-tooltip-tw.tsx:70-73) |

> `[CODE]` The Angular wrapper does NOT proxy `open()`/`close()` (GAP G3). Reach into the inner Stencil element via `ViewChild` if needed.

## Slots / ng-content

`[CODE]` Both paths project: default `<slot />` (the TRIGGER element — wrapped in `<span class="falcon-tooltip-trigger" tabIndex={0}>`) + `<slot name="content">` (rich panel content, overriding `content`) (`[CODE]` falcon-tooltip.tsx:178/194 / falcon-tooltip-tw.tsx:214/233). Wrapper forwards via `<ng-content>` + `<ng-content select="[slot=content]">` (`[CODE]` html:16-17/30-31). **Full slot parity.**

## Parts (Stencil Shadow only)

`[CODE]` `part="trigger"` + `part="panel"` (`[CODE]` falcon-tooltip.tsx:167/182). The `-tw` twin uses Tailwind helper classes instead (`falconTooltipTriggerClasses` / `falconTooltipPanelClasses` / `falconTooltipArrowClasses`) — no `part=` attrs (expected divergence).

## Supported placements

12 (`top`/`right`/`bottom`/`left` × default/`-start`/`-end`). `[CODE]` `splitPlacement()` resolves `[side, alignment]`; `computeOffset()` maps to a `translate(x,y)` (`[CODE]` falcon-tooltip.utils.ts:6-48). `-start` aligns to the trigger's start edge, `-end` to the end edge, default centers.

## Constraints

- `[CODE]` **No collision/flip** — `computeOffset` honors ONLY the requested `placement`; a `right`/`left` tooltip near a viewport edge overflows off-screen (GAP G1).
- `[CODE]` **Hide delay hardcoded 80ms** (`[CODE]` falcon-tooltip.tsx:110) — not configurable.
- `[CODE]` **`disabled` has no `@Watch`** — already-open tooltip stays until pointer-leave on disable (GAP G2).
- `[CODE]` **The trigger span gets `tabIndex={0}` unconditionally** (`[CODE]` falcon-tooltip.tsx:171) — ANY wrapped element becomes a focus stop; wrapping an element that already has a `tabIndex` doubles the stop (GAP G5).
- `[CODE]` **Positioning is JS-set** — `panel.style.transform = translate(Xpx, Ypx)`; the `--falcon-tooltip-offset` var (default 8px) is the trigger-to-panel gap (`[CODE]` falcon-tooltip.tsx:127-134).
- `[CODE]` **Top-Layer acquire is wrapper-only** — the raw Stencil tags render the panel inline (`position: fixed` + transform); only `<falcon-angular-tooltip>` promotes it via `showPopover()` (`[CODE]` falcon-tooltip.component.ts:118-163).

## Accessibility

- `[CODE]` Trigger gets `aria-describedby="<tooltipId>"` ONLY while the tooltip is showing (`[CODE]` falcon-tooltip.tsx:171, showLabel-gated) — WAI-ARIA APG suggests a persistent link (GAP). **Parity** (same in `-tw`, `[CODE]` falcon-tooltip-tw.tsx:207).
- `[CODE]` Panel `role="tooltip"` on both paths (`[CODE]` falcon-tooltip.tsx:184 / falcon-tooltip-tw.tsx:221).
- `[CODE]` Trigger focusable (`tabIndex={0}`) → keyboard users Tab to it; `onFocusin` shows, `onFocusout` hides (`[CODE]` falcon-tooltip.tsx:138-139).
- `[CODE]` Arrow `<span>` `aria-hidden="true"` (`[CODE]` falcon-tooltip.tsx:193 / falcon-tooltip-tw.tsx:230).
- `[CODE]` No Esc-to-dismiss — only blur / pointer-leave / programmatic `close()` (GAP).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16) against falcon-tooltip.component.ts (178 ln), falcon-tooltip.component.html (34 ln), falcon-tooltip.tsx (200 ln), falcon-tooltip-tw.tsx (239 ln), falcon-tooltip.types.ts, falcon-tooltip.utils.ts. Confirmed 8 inputs / 2 outputs / `open()`+`close()` `@Method`s (unproxied) / full event+slot+role parity / no-flip + no-disabled-Watch + unconditional tabIndex constraints. ADDED the Top-Layer acquire/release (prior dossier omitted).
