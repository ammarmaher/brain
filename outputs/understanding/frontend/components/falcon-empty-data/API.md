# falcon-empty-data — API

## Selectors

- Angular: `falcon-angular-empty-data`
- Stencil Shadow: `<falcon-empty-data>` (tag `'falcon-empty-data'`, `shadow: true`)
- Stencil Light: `<falcon-empty-data-tw>` (tag `'falcon-empty-data-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularEmptyDataComponent } from '@falcon/ui-core/angular';
// re-exported also from libs/falcon shared-ui:
import { FalconAngularEmptyDataComponent, FalconEmptyDataConfig } from '@falcon';
```

Add `FalconAngularEmptyDataComponent` to the consuming standalone component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is set on the wrapper internally — the host does NOT need it. Most consumers never import the wrapper directly: they pass `[emptyData]="config"` to `<falcon-angular-data-table>`, which auto-mounts the wrapper.

## Inputs (all on `FalconAngularEmptyDataComponent`)

> `[CODE]` falcon-empty-data.component.ts — almost every input defaults to `undefined` (NOT the Stencil default). `applyConfigDefaults()` in `ngOnInit` hydrates each unset input from `FalconConfigurationService.resolveEmptyData()`. **Per-instance bindings always win**; the config service only fills holes. Priority chain (`[CODE]` ts:88-91): per-instance `[input]` > app `registerEmptyDataOverride()` > `falcon-defaults.json`.

| Name | Type | Default (wrapper) | Notes |
|---|---|---|---|
| `titleText` | `string \| null \| undefined` | `''` sentinel → config | Heading. Renamed from `title` to dodge `HTMLElement.title` clash. Signal-backed setter (`[CODE]` ts:98-102). |
| `body` | `string \| null \| undefined` | `''` sentinel → config | Sub-text below the title. Signal-backed (`[CODE]` ts:105-109). |
| `iconKey` | `FalconEmptyDataIconKey \| undefined` | `undefined` → config | Which inline-SVG glyph: `users`/`inbox`/`search`/`folder`/`doc`/`bell`/`box`/`star` (`[CODE]` ts:112). |
| `iconSize` | `number \| undefined` | `undefined` → config | Glyph SVG width/height in px (`[CODE]` ts:154). Stencil default 36. |
| `cardBackground` | `boolean \| undefined` | `undefined` → config | Render the dashed-border card chrome. Stencil default `true`. |
| `glossyGradient` | `boolean \| undefined` | `undefined` → config | Apply the glossy linear-gradient over the card. Stencil default `true`. |
| `iconBackground` | `boolean \| undefined` | `undefined` → config | Render the tinted disc behind the glyph. Stencil default `true`. |
| `coloredIcon` | `boolean \| undefined` | `undefined` → config | Tint the glyph brand-teal (off = neutral). Stencil default `true`. |
| `iconOpacityOn` | `boolean \| undefined` | `undefined` → config | Apply `opacity` to the glyph. Stencil default `true`. |
| `opacity` | `number \| undefined` | `undefined` → config | Glyph opacity 0..100 (only when `iconOpacityOn`). Stencil default 100. Clamped + ÷100 inline. |
| `showAction` | `boolean \| undefined` | `undefined` → config | Render the CTA button. Stencil default `false`. |
| `actionLabel` | `string \| null \| undefined` | `''` sentinel → config | CTA label. Signal-backed (`[CODE]` ts:124-128). Stencil default `'Add'`. |
| `actionSize` | `'sm' \| 'md' \| 'lg' \| undefined` | `undefined` → config | CTA height/padding/text. Stencil default `'md'`. Reflected. |
| `actionBorder` | `'solid' \| 'dashed' \| 'none' \| undefined` | `undefined` → config | CTA style. Stencil default `'solid'`. Reflected. |
| `showInfo` | `boolean \| undefined` | `undefined` → config | Render the info chip beneath the CTA. Stencil default `false`. |
| `infoText` | `string \| null \| undefined` | `''` sentinel → config | Info chip text. Signal-backed (`[CODE]` ts:135-139). Renders only when `showInfo && infoText`. |
| `mode` | `'table' \| 'page' \| undefined` | `undefined` → config | `table` reserves a min-height; `page` adds hero padding. Stencil default `'table'`. Reflected. |
| `containerFit` | `'fill' \| 'mini' \| 'fit' \| undefined` | `undefined` → config | Width strategy in `page` mode. Stencil default `'fill'`. Reflected. |
| `padX` / `padY` | `number \| null \| undefined` | `undefined` → config | Outer wrapper padding override (px); `null` = token default. |
| `marginX` / `marginY` | `number \| null \| undefined` | `undefined` → config | Outer wrapper margin override (px); `null` = token default. |
| `context` | `FalconEmptyDataContext \| undefined` | `undefined` | Semantic context → `role` + `aria-live` + style data-hooks. **Per-instance only — NOT in config defaults** (`[CODE]` ts:156-158). |
| `useTailwind` | `boolean \| null \| undefined` | `true` | **Render-path switch.** `true` → `<falcon-empty-data-tw>` (Light DOM). `false` → `<falcon-empty-data>` (Shadow). Signal-backed so the data-table auto-mount can patch it reactively (`[CODE]` ts:167-171). NOT in config defaults. |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `(actionClick)` | `FalconEmptyDataActionClickDetail` = `{ readonly actionLabel: string }` | `[CODE]` ts:173 — the ONLY Angular `@Output`. Re-emitted from the Stencil `falcon-action-click` event via `onFalconActionClick()` (`[CODE]` ts:244-247). Fires on CTA press. |
| `falcon-action-click` | `CustomEvent<{ actionLabel: string }>` | `[CODE]` falcon-empty-data.tsx:90 — Stencil event (`bubbles: true, composed: true`). Both variants emit it; the wrapper bridges it. The data-table forwards it again as its own `(emptyDataAction)`. |

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-empty-data/falcon-empty-data.types.ts`:

```ts
type FalconEmptyDataIconKey = 'users' | 'inbox' | 'search' | 'folder' | 'doc' | 'bell' | 'box' | 'star';
type FalconEmptyDataActionSize = 'sm' | 'md' | 'lg';
type FalconEmptyDataActionBorder = 'solid' | 'dashed' | 'none';
type FalconEmptyDataFeedbackLevel = 'informational' | 'action-required' | 'destructive' | 'positive' | 'negative';
type FalconEmptyDataAriaLive = 'off' | 'polite' | 'assertive';
type FalconEmptyDataMode = 'table' | 'page';
type FalconEmptyDataContainerFit = 'fill' | 'mini' | 'fit';
interface FalconEmptyDataContext { category?: string; feedbackLevel?: FalconEmptyDataFeedbackLevel; ariaLive?: FalconEmptyDataAriaLive; dismissable?: boolean; }
interface FalconEmptyDataConfig { /* every visual input above, optional, + nested context + useTailwind */ }
interface FalconEmptyDataActionClickDetail { readonly actionLabel: string; }
```

> `FalconEmptyDataConfig` is the shorthand object accepted by `<falcon-angular-data-table [emptyData]>` (`[CODE]` types.ts:38-74). The data-table copies each defined key onto the auto-mounted wrapper instance via `setIfDefined` (`[CODE]` falcon-data-table.component.ts:589).

## Reflected props (Stencil — both variants)

`[CODE]` `iconKey`, `actionSize`, `actionBorder`, `mode`, `containerFit` are `@Prop({ reflect: true })` → reflected to host attributes so CSS / Studio can target them. Booleans (`cardBackground`/`glossyGradient`/`iconBackground`/`coloredIcon`/`iconOpacityOn`/`showAction`/`showInfo`) are NOT reflected — the templates instead set explicit `data-*` attrs (`data-bg`/`data-glossy`/`data-icon-bg`/`data-icon-color`/`data-size`/`data-border`) that the CSS targets.

## Mutable props (Stencil)

None declared `mutable`. The component is presentational; values are pushed in via props, never mutated back out.

## CVA / ngModel / Reactive Forms

**NO — not a form control.** `[CODE]` the wrapper has no `NG_VALUE_ACCESSOR`, no `writeValue`. It captures no value. Bind inputs directly or pass a `[emptyData]` config to the data-table.

## Signal compatibility

`[CODE]` Internal wrapper state uses Angular signals for `titleText`/`body`/`actionLabel`/`infoText`/`useTailwind` (signal-backed `@Input set`). Other inputs are plain fields mutated by `applyConfigDefaults()`. `OnPush` change detection enforced (`[CODE]` ts:84). No signal-input variant (`input()`); still legacy `@Input`.

## Methods (Stencil)

`[CODE]` **None.** Neither variant declares an `@Method`. (Contrast with `falcon-input`, which exposes `setFocus`/`clear`.)

## Slots / template inputs

`[CODE]` **None.** Unlike `<falcon-empty-state>` (which has a `slot="action"`), `<falcon-empty-data>` renders the CTA + info chip from props internally and projects nothing. There are no `<ng-content>` / `<slot>` elements in either variant or the wrapper. To customise the action you bind `actionLabel`/`actionSize`/`actionBorder` + listen to `(actionClick)` — you cannot project a custom button (GAP G2).

## Supported sizes / states / variants / appearances

- **CTA sizes:** `sm` (28px) / `md` (34px) / `lg` (42px). `[CODE]` tokens `--falcon-empty-data-btn-h-{sm,md,lg}`.
- **CTA borders:** `solid` (filled teal) / `dashed` (white bg, teal dashed border + teal text) / `none` (transparent ghost).
- **Modes:** `table` (default — min-height ≈ 6 rows) / `page` (hero padding).
- **Container fit (page mode):** `fill` / `mini` (max 50vw) / `fit` (fit-content).
- **Toggles:** `cardBackground`, `glossyGradient`, `iconBackground`, `coloredIcon`, `iconOpacityOn` (each on/off).
- **Icon keys:** 8 inline-SVG glyphs.

## Constraints

- `[CODE]` Wrapper template (`falcon-empty-data.component.html:7-13`): **boolean + numeric + object props use PROPERTY binding** (`[cardBackground]="…"`) NOT `[attr.*]`, because a Stencil boolean Prop reads attribute-absence as "use default `true`" — `[attr.x]=null` (for `false`) would wrongly fall back to the default. String props keep `[attr.*]`. **Do not "fix" the mixed binding style — it is deliberate** (Wave 19 18th iter).
- `[CODE]` falcon-empty-data.component.ts:50-55 — the wrapper does an **eager `defineCustomElement()` at module load** for both variants. Reason (ts:28-49): when the data-table programmatically mounts the wrapper into a detached host via `createComponent`, Angular writes property bindings before the lazy Stencil chunk upgrades the element → booleans whose Stencil default is `false` (`showAction`/`showInfo`) get permanently shadowed by the proto getter. Eager define fixes it. **Do not remove the eager `defineCustomElement` imports.**
- `[CODE]` `useTailwind` is signal-backed specifically so the data-table's `inst.useTailwind = false` patch re-evaluates `@if (_useTailwind())` under OnPush (plain `@Input` wasn't reliably re-rendering the branch — ts:163-166).
- `[CODE]` The `-tw` (Light DOM) variant applies card gradient / border / colors as **inline `style`** (`var(--token)` references) because Tailwind arbitrary syntax cannot express `linear-gradient(180deg, …)` or compound `border: <w> dashed <c>` shorthands (`[CODE]` empty-data-tailwind-classes.ts:7-17, falcon-empty-data-tw.tsx:264-330). The Tailwind helper emits only layout/box-model/typography utilities.
- `[CODE]` Info chip renders only when **both** `showInfo` AND `infoText` are truthy (`[CODE]` tsx:317 / tw.tsx:397).

## Accessibility

- `[CODE]` Wrapper `<div>` `role` derives from `context.feedbackLevel`: `action-required` → `role="status"`, `destructive` → `role="alert"`, else `role="group"` (`[CODE]` tsx:250-251 / tw.tsx:260-261).
- `[CODE]` `aria-live` = `context.ariaLive ?? 'polite'`.
- `[CODE]` Glyph disc is `aria-hidden="true"` (decorative); the inline SVG carries no label (`[CODE]` tsx:279 / tw.tsx:362). The `-tw` glyph SVGs ALSO each carry `aria-hidden="true"` per-SVG (`[CODE]` tw.tsx — every glyph case), the Shadow variant relies on the container `aria-hidden`.
- `[CODE]` CTA `<button type="button">` has no `aria-label` beyond its visible text label; the `+` SVG inside is `aria-hidden="true"`.
- `[CODE]` Info chip's leading info SVG is `aria-hidden="true"`.
- `[CODE]` `data-feedback-level` / `data-category` / `data-dismissable` are reflected for styling but there is **no visible dismiss control** — `dismissable` is a data-hook only (no close button rendered — GAP G4).
- `[CODE]` The **title is a `<div>`, not an `<h*>` heading** (`[CODE]` tsx:283 / tw.tsx:366) — contrast `<falcon-empty-state>` which uses `<h3>`. No heading semantics for screen-reader outline (GAP G3 / a11y note).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12, NEW) against falcon-empty-data.component.ts (248 ln), .component.html (68 ln), falcon-empty-data.tsx (343 ln), falcon-empty-data-tw.tsx (424 ln), .types.ts (80 ln), empty-data-tailwind-classes.ts (199 ln). Inputs default to `undefined` + config-hydrate confirmed; single `(actionClick)` @Output confirmed; no slots / no methods / no CVA confirmed; title is `<div>` (not heading) confirmed.
