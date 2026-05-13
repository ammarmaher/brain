# falcon-accordion — API

## Angular selector
`falcon-angular-accordion`

## Stencil tags
- Shadow: `<falcon-accordion>`
- Light: `<falcon-accordion-tw>`

## Import path
```ts
import {
  FalconAngularAccordionComponent,
  type FalconAccordionItem,
} from '@falcon/ui-core/angular';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `items` | `ReadonlyArray<FalconAccordionItem>` | `[]` | Item descriptors. |
| `mode` | `'single' \| 'multiple'` | `'single'` | Single mode collapses other items on expand. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Padding / font-size. |
| `disabled` | `boolean` | `false` | Disable entire accordion (per-item disable still works). |
| `helperText` | `string \| undefined` | — | Text below items. |
| `errorMessage` | `string \| undefined` | — | Error text below items (role=alert). |
| `showChevron` | `boolean` | `true` | Toggle chevron visibility. |
| `ariaLabel` | `string \| undefined` | — | Accessible label for the accordion. |
| `expandedValues` | `ReadonlyArray<string \| number>` | `[]` | Two-way bindable via `valueChange`. |
| `useTailwind` | `boolean` | `true` | Render-path switch. |
| `rootClass` | `string` | `''` | Caller-supplied class. |

## Outputs

| Name | Payload |
|---|---|
| `valueChange` | `ReadonlyArray<string \| number>` — new expanded values. |
| `expand` | `FalconAccordionExpandDetail { value }` — single item expanded. |
| `collapse` | `FalconAccordionCollapseDetail { value }` — single item collapsed. |

## TypeScript types

```ts
export type FalconAccordionMode = 'single' | 'multiple';
export type FalconAccordionSize = 'sm' | 'md' | 'lg';

export interface FalconAccordionItem {
  readonly value: string | number;
  readonly label: string;
  readonly description?: string;
  readonly icon?: string;        // CSS class string for icon
  readonly disabled?: boolean;
}

export interface FalconAccordionChangeDetail {
  readonly expandedValues: ReadonlyArray<string | number>;
}
export interface FalconAccordionExpandDetail { readonly value: string | number; }
export interface FalconAccordionCollapseDetail { readonly value: string | number; }
```

## Reflected props (Stencil)
`mode`, `size`, `disabled`.

## Stencil methods
| Method | Purpose |
|---|---|
| `expand(value): Promise<void>` | Programmatically expand. |
| `collapse(value): Promise<void>` | Programmatically collapse. |

## Slots

| Slot name | Purpose |
|---|---|
| `content-<value>` | Per-item body content. Renders inside the panel for the matching item value. |

The Angular wrapper template uses `<ng-content>` which projects the slotted content through to the underlying Stencil tag.

## CVA support
Not applicable (multi-value selection — could compose CVA in future).

## Signal compatibility
Wrapper uses internal `signal<ReadonlyArray<string|number>>([])` for expanded values, with `@Input() set expandedValues` writer.

## Supported sizes / modes
- Modes: `single` / `multiple`.
- Sizes: `sm` / `md` / `lg`.
- States: per-item `disabled`, accordion-wide `disabled`.

## Important constraints
- **`mode="single"` ≠ "always 1 expanded"** — clicking the expanded item collapses it (zero open). Use the `expand()` method imperatively if you need always-1-open semantics.
- **Keyboard nav:** ArrowDown/Up move focus between headers; Home/End jump to first/last. Enter/Space activate the header click (toggle expand).
- **Disabled items are skipped in keyboard nav.**
- **The `expandedValues` input is mutable** at the Stencil level (`@Prop({ mutable: true })`). The wrapper signal-mirrors this.
- **Item icons are CSS classes** — `icon: 'falcon-icon falcon-icon-folder'`.

## Accessibility attributes
- Each item's header: `<button>` with `aria-expanded`, `aria-controls`, `aria-disabled`.
- Each panel: `<div role="region">` with `aria-labelledby` pointing to its header id.
- `hidden` attribute on the collapsed panel — natural focus skipping.
- Chevron has `aria-hidden="true"`.

## Parts (Stencil Shadow)
| Part | Element |
|---|---|
| `header` | Item header button. |
| `header-expanded` | Expanded header (compound). |
| `panel` | Panel container. |
| `panel-expanded` | Expanded panel (compound). |
| `helper-text` | Helper text. |
| `error-message` | Error text. |
