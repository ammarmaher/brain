# falcon-loader-overlay — API

## Selectors

- Angular: `falcon-angular-loader-overlay`
- Stencil Shadow: `<falcon-loader-overlay>` (tag `'falcon-loader-overlay'`, `shadow: true`)
- Stencil Light: `<falcon-loader-overlay-tw>` (tag `'falcon-loader-overlay-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularLoaderOverlayComponent } from '@falcon/ui-core/angular-wrapper/components/falcon-loader-overlay';
// or via barrel:
import { FalconAngularLoaderOverlayComponent } from '@falcon/ui-core';
// the config type re-exports from the wrapper barrel:
import type { FalconLoaderOverlayCfg } from '@falcon/ui-core/angular-wrapper/components/falcon-loader-overlay';
```

Add `FalconAngularLoaderOverlayComponent` to the consuming standalone component's `imports: []`. Schema `CUSTOM_ELEMENTS_SCHEMA` is already set on the wrapper internally — the host component does NOT need it (`[CODE]` falcon-loader-overlay.component.ts:35).

## Inputs (all on `FalconAngularLoaderOverlayComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `config` | `FalconLoaderOverlayCfg \| string \| null` | `null` | Loader Studio JSON config. Accepts a strongly-typed object OR a pre-stringified string. `null`/`undefined` → empty string forwarded → the Stencil tag applies its built-in `DEFAULT_OVERLAY_CFG`. Stringified once per CD cycle by `configJson()` (`[CODE]` :92-100). |
| `visible` | `boolean` | `false` | Forwarded as a **presence-only** `[attr.visible]` (`''` when shown, `null` when hidden) so the token cascade's `:not([visible])` rule matches by attribute presence, NOT by `[visible='']` (`[CODE]` :55 + html:13/22). |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-loader-overlay-tw>` (Light DOM, canonical). `false` → `<falcon-loader-overlay>` (Shadow DOM, encapsulated) (`[CODE]` :63). |

> The wrapper exposes only **3 inputs**. Every visual axis (the 21 config groups, ~130 keys) flows through the single `config` JSON — there is intentionally no per-axis `@Input`. Contrast with `<falcon-angular-input>` (27 inputs).

### Stencil props (Shadow `<falcon-loader-overlay>` and Light `<falcon-loader-overlay-tw>`)

Both Stencil tags declare exactly two props — identical surface:

| Prop | Type | Default | Reflect | Notes |
|---|---|---|---|---|
| `config` | `string` | `''` | no | JSON string of `FalconLoaderOverlayCfg`. Deep-merged over defaults on every change; invalid JSON is swallowed (never throws) (`[CODE]` falcon-loader-overlay.tsx:218,265-277 / falcon-loader-overlay-tw.tsx:305,363-388). |
| `visible` | `boolean` | `false` | **yes** | `@Prop({ reflect: true })` → host `[visible]` attribute the token cascade reads (`[CODE]` falcon-loader-overlay.tsx:222 / falcon-loader-overlay-tw.tsx:311). |

> The `-tw` twin also accepts a full `{ overlay: {...} }` envelope OR a bare `OverlayCfg` and slices the `.overlay` block (`[CODE]` falcon-loader-overlay-tw.tsx:373-379) — the Shadow variant does NOT (it merges the raw object as-is, `[CODE]` falcon-loader-overlay.tsx:269). **Parity divergence — see GAPS G2.**

## Outputs

| Name (Angular `@Output`) | Stencil event name | Payload | Notes |
|---|---|---|---|
| `falconLoaderShown` | `falconLoaderShown` | `void` | Fires after `visible` flips true (emitted from the `@Watch('visible')`). |
| `falconLoaderHidden` | `falconLoaderHidden` | `void` | Fires after `visible` flips false. |
| `falconLoaderOverlayClose` | `falcon-loader-overlay-close` | `void` | Fires when the in-overlay close button is clicked. The component does **NOT** self-close — the caller must flip `visible` back so a consumer can veto (`[CODE]` falcon-loader-overlay.component.ts:78-84). |

> The wrapper template binds all three via kebab-case listeners `(falcon-loader-shown)` / `(falcon-loader-hidden)` / `(falcon-loader-overlay-close)` (`[CODE]` html:13-16,22-24). **NOTE the binding-name mismatch — see the Constraints section + GAPS G1: the Shadow + `-tw` tags emit the camelCase `falconLoaderShown` / `falconLoaderHidden` event names (Stencil auto-derives from the field), but the wrapper listens for kebab `falcon-loader-shown` / `falcon-loader-hidden`. Only `falcon-loader-overlay-close` has an explicit kebab `eventName` on both tags.**

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-loader-overlay/falcon-loader-overlay.types.ts` (inlined verbatim from `libs/falcon-studio-runtime/.../config.types.ts`):

```ts
type FalconLoaderSchemaVersion = 'falcon.loader.v1';
type FalconLoaderBgMode = 'solid' | 'gradient' | 'radial' | 'conic' | 'image';
type FalconLoaderAnim =
  | 'heartbeat' | 'pulse' | 'bounce' | 'float' | 'rotate' | 'wobble'
  | 'breathe' | 'swing' | 'orbit' | 'drift' | 'tilt' | 'none';
type FalconLoaderRingStyle = 'spin' | 'dual' | 'dashed' | 'pulse' | 'orbit';
type FalconLoaderBubbleDirection = 'up' | 'down' | 'drift' | 'orbit';
type FalconLoaderProgressStyle = 'indeterminate' | 'determinate';
type FalconLoaderDotsStyle = 'bounce' | 'grow' | 'wave';
type FalconLoaderBgAnimType = 'shift' | 'breathe' | 'sweep' | 'rotate' | 'mesh' | 'aurora';
type FalconLoaderPatternKind = 'none' | 'dots' | 'lines' | 'waves' | 'crosshatch' | 'hexagons';
type FalconLoaderLogoSource = 't2' | 'custom';
type FalconLoaderCaptionWeight = 300 | 400 | 500 | 600 | 700;

interface FalconLoaderOverlayCfg { /* 21 numbered groups, ~130 keys — see TOKENS.md */ }
type FalconLoaderOverlayCfgKey = keyof FalconLoaderOverlayCfg;

// Memoised particle shapes (internal @State, exported for test stubs):
interface FalconLoaderOverlayBubble { id; leftPct; size; delaySec; durationSec; }
interface FalconLoaderOverlaySparkle { id; topPct; leftPct; delaySec; durationSec; }
interface FalconLoaderOverlayStar { id; topPct; leftPct; delaySec; }
```

## Reflected props (Stencil only)

`visible` only (`@Prop({ reflect: true })` on both tags). `config` is NOT reflected (it would dump a multi-KB JSON string into the DOM). No `size`/`state`/`variant`/`appearance` reflection — this component has no discrete visual-state axes; everything is config-driven inline.

## Mutable props (Stencil)

None. `config` is a plain `@Prop` re-parsed by a `@Watch('config')`; `visible` is a plain reflected `@Prop` watched by `@Watch('visible')`. There is no `@Prop({ mutable: true })`. Internal `@State` (`parsed`, `bubbles`, `sparkles`, `stars`) holds the derived render model.

## CVA / ngModel / Reactive Forms

**NO.** This is not a form control — there is no `NG_VALUE_ACCESSOR`, no `ControlValueAccessor`, no `writeValue`. Do not bind `[(ngModel)]` / `formControlName`. Drive it with `[config]` + `[visible]` property bindings.

## Signal compatibility

The wrapper uses **classic `@Input()` decorators** (no signal inputs). `OnPush` change detection is enforced (`[CODE]` :34). The upstream `FalconLoaderService` is signals-based (`config()`, `overlayVisible()` are `Signal`s) — consumers typically bind `[config]="loader.config().overlay"` + `[visible]="loader.overlayVisible()"`, letting OnPush + the signal read drive updates. There is no signal-input variant of the wrapper yet.

## Methods (Stencil only — call via element ref)

**None.** Neither Stencil tag declares an `@Method()`. There is no imperative `show()`/`hide()`/`setFocus()` surface — visibility is driven purely by the reflected `visible` prop. (Programmatic control belongs to `FalconLoaderService.showOverlay()/hideOverlay()`, not to the element.)

## Slots / template inputs

**NONE.** Neither the Shadow tag, the `-tw` tag, nor the Angular wrapper projects `<slot>` / `<ng-content>`. All content (logo, caption text, sub-caption text, custom SVG) is supplied through the `config` JSON, not projected. The wrapper template is a bare `@if (useTailwind) { <…-tw/> } @else { <…/> }` switch with no `<ng-content>`.

## Supported sizes / states / variants / appearances

This component has **no discrete size/state/variant/appearance enums** — it is fully config-driven. The equivalent "axes" are the 21 numbered config groups, each independently enabled/disabled and parameterised:

- **Stage:** `bgMode` (5: solid/gradient/radial/conic/image), vignette, noise, blur.
- **Logo:** source (`t2`/`custom`), size, colour, gradient, opacity + 12 `logoAnim` motions.
- **Effects:** halo, orbit `ring` (5 styles), bubbles (4 directions), sparkles, stars, waves, ripples, spotlight, drop-tint, animated background (6 types), pattern overlay (6 kinds), scanlines, grid.
- **Content:** caption, sub-caption, dots (3 styles), progress bar (indeterminate/determinate), skeleton banner.
- **Global:** `globalOpacity`, `showBehind` (pointer-events pass-through + close-button gate).

## Constraints

- **Event-name mismatch (functional bug candidate):** the wrapper template binds `(falcon-loader-shown)` / `(falcon-loader-hidden)` but both Stencil tags emit `falconLoaderShown` / `falconLoaderHidden` (camelCase, Stencil-auto-derived). DOM `addEventListener` is case-sensitive on the exact string, so `falconLoaderShown.emit()`/`falconLoaderHidden.emit()` `@Output`s on the wrapper **may never fire** from a real DOM event. `falconLoaderOverlayClose` works because both sides agree on the explicit kebab `falcon-loader-overlay-close`. **See GAPS G1 — HIGH-RISK-QUEUE (behavior).**
- **No content projection** — logo/caption/custom-SVG come from `config`, never `<ng-content>`.
- **`visible` is presence-only** — never forward `visible="false"`; the cascade keys off attribute presence.
- **Shadow vs `-tw` envelope divergence** — `-tw` unwraps a `{ overlay }` envelope; Shadow does not (G2).
- **No `.component.css`** on the wrapper and **no Tailwind helper** for the `-tw` twin (inline styles instead) — divergence from the input/badge dual-render pattern (G6).
- **`customSvg` is injected via `innerHTML`** in both render paths (`[CODE]` falcon-loader-overlay.tsx:794-796 / falcon-loader-overlay-tw.tsx:933-938) — a raw-HTML sink; see Accessibility + GAPS G3 (sanitisation).

## Accessibility

- Both render paths set `role="status"` + `aria-live="polite"` on the stage/host so assistive tech announces the loading state (`[CODE]` falcon-loader-overlay.tsx:347 / falcon-loader-overlay-tw.tsx:1101-1102).
- The `-tw` host additionally sets `aria-busy={visible ? 'true' : 'false'}` (`[CODE]` falcon-loader-overlay-tw.tsx:1103). **The Shadow variant does NOT set `aria-busy` — parity gap (G4, a11y).**
- The progress bar carries `role="progressbar"` + `aria-valuemin/max` and, when determinate, `aria-valuenow` (`[CODE]` falcon-loader-overlay.tsx:705-708). **The `-tw` twin's progress bar has NO `role="progressbar"` / aria-value* — parity gap (G4, a11y).**
- The close button has `type="button"` + `aria-label="Close loader"` on both paths.
- All decorative layers (grid, scanlines, noise, vignette, tint, bg-anim, pattern, stars, waves, ripples, spotlight, halo, ring, bubbles, sparkles, dots, skeleton) are `aria-hidden="true"` on the Shadow path. **The `-tw` twin uses `data-fl-part` markers but does NOT set `aria-hidden` on these decorative layers — parity gap (G4, a11y).**
- The animated caption / sub-caption text is real text content, readable by SR.
- No focus trap / Esc handling inside the element — the Loader Studio editor wraps it with its own Esc + close affordance (`[CODE]` loader-studio.component.ts:15-16). A consumer using `showBehind=false` as a blocking modal must add its own focus management — **GAP (A11y, G4).**

## Verification
🟢 code-verified against falcon-loader-overlay.component.ts/html + falcon-loader-overlay.tsx + falcon-loader-overlay-tw.tsx + the types file. Event-name mismatch (G1) 🟡 code-derived (read from template binding strings vs Stencil emit names; NOT runtime-reproduced this pass — flagged for runtime confirmation). a11y parity gaps 🟢 code-verified by direct attribute diff between the two `.tsx` files.
