# falcon-accordion — API

## Selectors
- Angular: `falcon-angular-accordion`
- Stencil Shadow: `<falcon-accordion>` (tag `'falcon-accordion'`, `shadow: true`)
- Stencil Light: `<falcon-accordion-tw>` (tag `'falcon-accordion-tw'`, `shadow: false`)

## Import
```ts
import {
  FalconAngularAccordionComponent,
  type FalconAccordionItem,
} from '@falcon/ui-core';
// barrel: libs/falcon-ui-core/src/angular-wrapper/components/falcon-accordion/index.ts
```
Add `FalconAngularAccordionComponent` to the consuming standalone component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is already set on the wrapper internally — the host does NOT need it.

## Inputs (all on `FalconAngularAccordionComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `items` | `ReadonlyArray<FalconAccordionItem>` | `[]` | `[CODE]` falcon-accordion.component.ts:40 — item descriptors. Passed via **property binding** (`[items]`), NOT `[attr.items]` (Stencil array prop). |
| `mode` | `'single' \| 'multiple'` | `'single'` | `[CODE]` ts:41 — `single` collapses all others on expand; `multiple` toggles independently. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | `[CODE]` ts:42 — padding / font-size / min-height. |
| `disabled` | `boolean` | `false` | `[CODE]` ts:43 — disables the whole accordion (per-item `disabled` still works independently). |
| `helperText` | `string \| undefined` | `undefined` | `[CODE]` ts:44 — renders `<p>` below items (hidden when `errorMessage` set). |
| `errorMessage` | `string \| undefined` | `undefined` | `[CODE]` ts:45 — renders `<p role="alert">` below items. Drives `hasError`. |
| `showChevron` | `boolean` | `true` | `[CODE]` ts:46 — toggle chevron visibility per header. |
| `ariaLabel` | `string \| undefined` | `undefined` | `[CODE]` ts:47 — `aria-label` on the accordion root container. |
| `expandedValues` | `ReadonlyArray<string \| number>` | `[]` | `[CODE]` ts:60-66 — **getter/setter** backed by an internal `signal`. Two-way via `(valueChange)`. |
| `useTailwind` | `boolean` | `true` | `[CODE]` ts:49 — render-path switch. `true` → `<falcon-accordion-tw>` (Light); `false` → `<falcon-accordion>` (Shadow). |
| `rootClass` | `string` | `''` | `[CODE]` ts:50 — caller-supplied class on the Stencil tag (forwarded `[class]="rootClass || null"`). |

> `[CODE]` There is **no two-way `[(expandedValues)]` `@Output() expandedValuesChange`** — the two-way sugar is `(valueChange)`. Use `[expandedValues]` + `(valueChange)` (GAP A1).

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `(valueChange)` | `ReadonlyArray<string \| number>` | `[CODE]` ts:52 + handleChange (ts:68-73) — emitted on every toggle; new full expanded-values array. Re-emitted from Stencil `falcon-change`. |
| `(expand)` | `FalconAccordionExpandDetail { value }` | `[CODE]` ts:53 + handleExpand (ts:75-78) — single item expanded. Re-emitted from Stencil `falcon-expand`. |
| `(collapse)` | `FalconAccordionCollapseDetail { value }` | `[CODE]` ts:54 + handleCollapse (ts:80-83) — single item collapsed. Re-emitted from Stencil `falcon-collapse`. |

All three Stencil events (`falcon-change` / `falcon-expand` / `falcon-collapse`) ARE bound in the wrapper template (`[CODE]` html:16-18 + 33-35) on BOTH render branches.

## TypeScript types
`libs/falcon-ui-core/src/components/falcon-accordion/falcon-accordion.types.ts`:

```ts
export type FalconAccordionMode = 'single' | 'multiple';
export type FalconAccordionSize = 'sm' | 'md' | 'lg';

export interface FalconAccordionItem {
  readonly value: string | number;
  readonly label: string;
  readonly description?: string;
  readonly icon?: string;          // CSS class string for an icon-font glyph
  readonly disabled?: boolean;
}

export interface FalconAccordionChangeDetail   { readonly expandedValues: ReadonlyArray<string | number>; }
export interface FalconAccordionExpandDetail   { readonly value: string | number; }
export interface FalconAccordionCollapseDetail { readonly value: string | number; }
```

## Reflected props (Stencil, both tags)
`[CODE]` falcon-accordion.tsx:47-49 / falcon-accordion-tw.tsx:55-57 — `mode`, `size`, `disabled` are `@Prop({ reflect: true })`. `expandedValues` is `@Prop({ mutable: true })` (NOT reflected — it's an array).

## Mutable props (Stencil)
`expandedValues` is `@Prop({ mutable: true })` — the component re-assigns it internally on toggle (`[CODE]` tsx:95 / tw.tsx:101). The Angular wrapper signal-mirrors it; do not bind both `[expandedValues]` and rely on the element mutating it independently.

## Stencil methods (both tags — call via element ref)

| Method | Description | Available on |
|---|---|---|
| `expand(value): Promise<void>` | Programmatically expand a value (no-op if already expanded). | BOTH `[CODE]` tsx:79-83 / tw.tsx:86-90 |
| `collapse(value): Promise<void>` | Programmatically collapse a value (no-op if not expanded). | BOTH `[CODE]` tsx:86-90 / tw.tsx:92-96 |

> `[CODE]` The Angular wrapper does **NOT** proxy `expand()` / `collapse()` to the wrapper class (GAP A2). To call them, obtain the inner Stencil element via `ViewChild` (the wrapper template does not even tag it with a `#ref`).

## CVA / ngModel / Reactive Forms
**NOT applicable.** The Angular wrapper does NOT implement `ControlValueAccessor`. Two-way is `[expandedValues]` + `(valueChange)` only (GAP A1). For form-driven section visibility, compose CVA externally.

## Signal compatibility
`[CODE]` ts:58 — wrapper uses an internal `signal<ReadonlyArray<string|number>>([])` (`value`), written by the `expandedValues` setter and by `handleChange`. Inputs are classic `@Input` decorators. `OnPush` enforced (`[CODE]` ts:31).

## Slots / template inputs

| Slot name | Purpose |
|---|---|
| `content-<value>` | `[CODE]` tsx:217 / tw.tsx:221 — per-item body content. Renders inside the panel for the matching item `value` (e.g. `<div slot="content-faq1">…</div>`). |

The Angular wrapper template projects a single `<ng-content></ng-content>` (`[CODE]` html:19 / 36) which forwards ALL slotted children through to the underlying Stencil tag — the consumer assigns each child the right `slot="content-<value>"`. There are **no header slots** and **no `ng-template` inputs** (GAP P1 — the header is built entirely from `FalconAccordionItem` props: `label` / `description` / `icon`).

## Supported sizes / modes / states
- Sizes: `sm` / `md` / `lg` — drive header padding (`8/12/16`px y), font-size (`12.5/13.5/15`px) and min-header-height (`36/44/52`px) via tokens.
- Modes: `single` / `multiple`.
- States: per-item `disabled`, accordion-wide `disabled`; per-item `expanded` (data-state + class).

## Important constraints
- `[CODE]` **`mode="single"` ≠ "always 1 expanded"** — clicking the open item collapses it to zero (`toggleExpanded` returns `[]`, `[CODE]` utils.ts:12-15). Use `expand()` imperatively for always-1-open semantics (GAP P1).
- `[CODE]` **Keyboard nav:** ArrowDown/Up move focus between headers (wrap, skip disabled); Home/End jump to first/last enabled. Enter/Space fall through to the native `<button>` click (toggle) — there is NO explicit Enter/Space branch in `handleHeaderKey` (`[CODE]` tsx:125 comment).
- `[CODE]` **Disabled items are skipped in keyboard nav** and rendered with the `disabled` HTML attr + `aria-disabled` (`[CODE]` tsx:176-177).
- `[CODE]` **Item icons are CSS-class strings** — `<i class={item.icon}>` (`[CODE]` tsx:185). Bypasses `<falcon-angular-icon>` (GAP P2).
- `[CODE]` **Empty `value` is allowed in the type but unsafe** — header has no accessible name if `label` is empty (GAP — see Accessibility).

## Parts (Stencil Shadow only — `<falcon-accordion>`)
`[CODE]` falcon-accordion.tsx — `header`, `header-expanded` (compound), `panel`, `panel-expanded` (compound), `helper-text`, `error-message`. The `-tw` Light twin emits **NO `part=`** (Light DOM has no `::part`) — this is the one Shadow↔`-tw` divergence (B-dim).

## Accessibility
- `[CODE]` Each header: `<button type="button">` with `aria-expanded`, `aria-controls={panelId}`, `aria-disabled`, native `disabled`.
- `[CODE]` Each panel: `<div role="region" aria-labelledby={triggerId}>` + `hidden={!expanded}` (collapsed panels are removed from the a11y tree + focus order).
- `[CODE]` Chevron `<span>` is `aria-hidden="true"`.
- `[CODE]` Icon `<span>` is `aria-hidden="true"`.
- `[CODE]` `aria-label` on the root container (from the `ariaLabel` input).
- `[CODE]` `prefers-reduced-motion` disables header/chevron transitions (`falcon-accordion.css:214-221`).
- **Gaps:** no `aria-level` on header buttons (WAI-ARIA APG recommends wrapping in `h2`–`h6`); no fallback accessible name when `label` is empty (see GAPS A1/A2).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B13) against falcon-accordion.component.ts (84 ln), .component.html (38 ln), falcon-accordion.tsx (235 ln), falcon-accordion-tw.tsx (238 ln), falcon-accordion.types.ts, falcon-accordion.utils.ts. Drift corrected vs prior dossier: clarified the two-way binding is `(valueChange)` (no `[(expandedValues)]` Output); methods `expand`/`collapse` exist on BOTH tags but are NOT proxied on the wrapper; `-tw` emits no `part=`.
