# falcon-loader-inline — API

## Selectors
- Angular: `falcon-angular-loader-inline`
- Stencil Shadow: `<falcon-loader-inline>` (tag `'falcon-loader-inline'`, `shadow: true`)
- Stencil Light: `<falcon-loader-inline-tw>` (tag `'falcon-loader-inline-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularLoaderInlineComponent } from '@falcon/ui-core/angular/falcon-loader-inline';
// app.ts uses exactly this subpath (2026-05-20) to avoid eager-loading the Studio gallery registry.
import type { FalconLoaderInlineCfg } from '@falcon/studio/runtime';
```

`[CODE]` app.ts:16 imports from the `@falcon/ui-core/angular/falcon-loader-inline` subpath specifically — the runtime-only path avoids the eager Studio-gallery load that crashed host-shell bootstrap. `CUSTOM_ELEMENTS_SCHEMA` is set internally on the wrapper (`[CODE]` falcon-loader-inline.component.ts:47).

## Inputs (all on `FalconAngularLoaderInlineComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `config` | `FalconLoaderInlineCfg \| string \| null` | `null` | `[CODE]` falcon-loader-inline.component.ts:59 — the 30-group JSON config. Object → stringified once per CD cycle via `configJson()`; string → passed through; `null`/`undefined` → empty string → Stencil applies `DEFAULT_INLINE_CFG`. Forwarded as `[attr.config]`. |
| `visible` | `boolean` | `false` | `[CODE]` :68 — when `true`, the inner tag gets a reflected `visible` presence attr (`visible ? '' : null`); when `false` the attr is OMITTED (not `"false"`) because the token cascade keys off attribute PRESENCE (`:not([visible])` → `display:none` + paused animations). A kept-alive hidden instance costs zero paint/CPU. |
| `target` | `string` | `''` | `[CODE]` :77 — per-region id mirrored on the `falcon-loader-shown`/`-hidden` event payloads so `FalconLoaderService.isInlineVisible(target)` routes show/hide pairs. Empty → attr omitted → Stencil's empty-string default. |
| `useTailwind` | `boolean` | `true` | `[CODE]` :85 — render-path switch. `true` → `<falcon-loader-inline-tw>` (Light DOM, canonical). `false` → `<falcon-loader-inline>` (Shadow DOM). |

> `[CODE]` There is no `appendTo`/portal input (unlike the IB-dialog) and no CVA — this is a pure presentational toggle. The 30 visual axes are NOT individual `@Input`s; they ride inside the single `config` JSON object.

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `(falconLoaderShown)` | `FalconLoaderInlineVisibilityEvent` `{ target: string }` | `[CODE]` falcon-loader-inline.component.ts:94 — re-emitted from the Stencil `falcon-loader-shown` event when `visible` flips true. Routed via `onLoaderShown(event: Event)` which narrows to `CustomEvent` and null-guards `detail` (Wave 7 typed-handler pattern — :137-140). |
| `(falconLoaderHidden)` | `FalconLoaderInlineVisibilityEvent` `{ target: string }` | `[CODE]` :100 — re-emitted from `falcon-loader-hidden` when `visible` flips false. |

> `[CODE]` **Event-name parity is CLEAN on BOTH render paths** — both Stencil tags declare explicit `@Event({ eventName: 'falcon-loader-shown' / 'falcon-loader-hidden' })` (kebab) (falcon-loader-inline.tsx:259-265 / falcon-loader-inline-tw.tsx:279-284), so the wrapper's `(falcon-loader-shown)`/`(falcon-loader-hidden)` bindings match on BOTH the Shadow AND Light tag. **This is the explicit fix for the class of bug found in the sibling `falcon-loader-overlay` (B-CAL G1, where the `-tw` twin auto-derived camelCase `falconLoaderShown` and the wrapper's kebab binding never fired).** Loader-inline does NOT have that bug.

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-loader-inline/falcon-loader-inline.types.ts` (inlined VERBATIM from the Studio SoT `config.types.ts` — the Stencil `rootDir` pin forbids cross-lib value imports):

```ts
interface FalconLoaderInlineCfg {            // 30 numbered groups + customSvg
  size: number; iconScale: number; shape: FalconLoaderShape; rotation: number; /* …Geometry */
  iconColor: string; useGradient: boolean; gradientFrom/To: string; /* …Icon colour */
  bgKind: FalconLoaderBgKind; bgColor/GradFrom/GradTo: string; glossy/border: boolean; /* …Background */
  ringEnabled: boolean; ringStyle: FalconLoaderRingStyle; ringSpeed: number; /* …Orbit ring */
  animation: FalconLoaderAnim; animSpeed: number; animEasing: FalconLoaderEasing; /* …Animation */
  glow/halo/stars/ripples/pattern/tint/noise/skeleton/trail/tilt/autoCycle… /* groups 6-30 */
  customSvg: string | null;
}
type FalconLoaderInlineVisibilityDetail = { target: string };
```

`[CODE]` The wrapper re-exports `FalconLoaderInlineCfg` from `@falcon/studio/runtime` (component.ts:30) AND declares a structurally-identical `FalconLoaderInlineVisibilityEvent` interface (:37-39) so it interops with both render paths without runtime coercion.

## Reflected props (Stencil only)

`visible` + `target` are `@Prop({ reflect: true })` on BOTH tags (`[CODE]` falcon-loader-inline.tsx:242,246 / falcon-loader-inline-tw.tsx:245,250) so the `loader-inline.tokens.css` `:not([visible])` cascade can target them. `config` is a plain non-reflected `@Prop`.

## Mutable props (Stencil)

None. `config` is parsed into `@State() parsed` (re-derived on `@Watch('config')`); `stars`/`ripples` (Shadow) / `starSeeds`/`rippleSeeds` (`-tw`) are memoised `@State` arrays re-seeded only when the count axis changes (`[CODE]` falcon-loader-inline.tsx:275-296 / falcon-loader-inline-tw.tsx:297-358).

## CVA / ngModel / Reactive Forms

**N/A — not a form control.** No `ControlValueAccessor`. Pure presentational toggle.

## Signal compatibility

The wrapper uses **classic `@Input()` decorators** (no `input()`/`model()` — GAP G2), `OnPush` (`[CODE]` :46). The UPSTREAM signal layer is `FalconLoaderService` (the live config is a `signal<FalconLoaderConfig>`; visibility is a computed `Signal<boolean>`). Consumers bind `[config]="loader.config().inline"` + `[visible]="loader.overlayVisible()"` (global) or `[visible]="loader.isInlineVisible(target)()"` (per-region).

## Methods (Stencil only)

None — neither tag exposes `@Method()`s (no `setVisible`/`refresh` etc.). Visibility is driven purely by the reflected `visible` prop.

## Slots / template inputs

**None.** Unlike the button/input, the inline loader projects NO slots — its entire visual is config-driven. The `customSvg` config key replaces the default Falcon brand-mark with caller-supplied SVG markup (injected via `innerHTML` — see GAPS for the sanitisation concern).

## Supported config axes (30 groups)

`[CODE]` falcon-loader-inline.types.ts:74-253 — Geometry · Icon colour (solid/gradient) · Background (none/soft/solid/gradient/radial + glossy/border) · Orbit ring (5 styles × 2 directions × N count) · Animation (12 anims + speed/direction/easing/drift) · Glow · Skeleton · Drop-tint · Animated-bg (6 types) · Pattern (5 kinds) · Spotlight · Global opacity · Noise · Stars · Ripples · Inner/drop/icon shadows · 3D tilt · Auto-color-cycle · Trail · Halo · Caption + sub-label + dots · custom SVG. Invalid/partial JSON shallow-merges over `DEFAULT_INLINE_CFG` and NEVER throws (`parseConfig`/`applyConfig`).

## Constraints

- `[CODE]` `visible=false` OMITS the attr — never set `[attr.visible]="'false'"` manually; the token cascade matches `:not([visible])`, so a literal `"false"` would keep the loader VISIBLE.
- `[CODE]` `config` must be valid JSON when passed as a string; malformed → silently falls back to defaults (no throw, no surfaced error on the element — the SERVICE's `setConfig` is what validates + `console.error`s).
- `[CODE]` The inline loader defaults to `position: absolute; inset: 0` (token `--falcon-loader-inline-position: absolute`) so dropping it into a `position:relative` parent fills the parent. To inline-flow it, override `--falcon-loader-inline-position: static`.
- `[CODE]` Per-instance gradient id: the `-tw` twin generates a random `gradId` per instance (falcon-loader-inline-tw.tsx:270) so multiple Light-DOM loaders don't collide on `<linearGradient id>`. The Shadow tag uses a fixed `id="fli-grad"` (safe — Shadow-scoped).

## Accessibility

- `[CODE]` **Shadow tag:** `<Host role="status" aria-live="polite" aria-busy={visible ? 'true':'false'}>` (falcon-loader-inline.tsx:875) — a proper live-region announcement.
- `[CODE]` **`-tw` twin:** `<Host>` carries **NO** `role`/`aria-live`/`aria-busy` (falcon-loader-inline-tw.tsx:891) — the DEFAULT render path has no built-in live-region. The global app mount compensates with `role="status"` on its own wrapper `<div>` (`[CODE]` app.ts:71), but a bare `<falcon-angular-loader-inline useTailwind>` elsewhere announces nothing (GAP G1 — a11y parity break).
- All decorative layers (bg-anim/halo/stars/ripples/pattern/tint/glossy/noise/skeleton/dots) are `aria-hidden="true"` on the Shadow tag (`[CODE]` falcon-loader-inline.tsx:571-643,855); the `-tw` twin marks them `pointer-events-none` but does not consistently `aria-hidden` every layer.
- No `prefers-reduced-motion` freeze on either path (GAP G3) — the full particle field + ring animate regardless of OS reduced-motion.

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-loader-inline.component.ts (152 ln), .component.html (31 ln), falcon-loader-inline.tsx (901 ln), falcon-loader-inline-tw.tsx (909 ln), .types.ts (281 ln). Event-name parity confirmed CLEAN (explicit kebab `eventName` on both tags). a11y parity break recorded: Shadow host has `role=status`+`aria-live`+`aria-busy`, `-tw` host has none (G1).
