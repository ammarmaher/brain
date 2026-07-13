# falcon-tabs — API

## Angular selector
`falcon-angular-tabs`

## Stencil tags
- Shadow DOM: `<falcon-tabs>`
- Light DOM: `<falcon-tabs-tw>`

## Import paths
```ts
import {
  FalconAngularTabsComponent,
  FalconTabActionsDirective,
  type FalconTabOption,
} from '@falcon/ui-core/angular';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `tabs` | `ReadonlyArray<FalconTabOption>` | `[]` | Tab descriptors. |
| `mode` | `'navigation' \| 'radio-cards'` | `'navigation'` | Switches between underline-strip vs radio-card grid. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Drives padding / font-size / gap. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Navigation-mode only — vertical stacks the tablist as a column. |
| `selectedValue` | `string \| number \| null` | `null` | Two-way bindable. Setter writes to internal `value` signal. |
| `ariaLabel` | `string \| undefined` | — | Accessible label for the tablist / radiogroup. |
| `helperText` | `string \| undefined` | — | Optional helper text below tablist. |
| `errorMessage` | `string \| undefined` | — | Optional error text (red, role="alert"). |
| `useTailwind` | `boolean` | `true` | Render-path switch. |
| `rootClass` | `string` | `''` | Caller-supplied extra class on the Stencil tag. |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `valueChange` | `string \| number \| null` | Sugar for `[(selectedValue)]` two-way binding. |

(All Stencil events — `falcon-change`, `falcon-blur`, `falcon-focus` — are bridged internally; only `valueChange` is exposed to Angular consumers.)

## TypeScript types
Defined in `libs/falcon-ui-core/src/components/falcon-tabs/falcon-tabs.types.ts`:

```ts
export type FalconTabsMode = 'navigation' | 'radio-cards';
export type FalconTabsSize = 'sm' | 'md' | 'lg';
export type FalconTabsOrientation = 'horizontal' | 'vertical';

export interface FalconTabOption {
  readonly value: string | number;
  readonly label: string;
  readonly disabled?: boolean;
  readonly icon?: string;        // CSS class string (e.g. "falcon-icon falcon-icon-X")
  readonly helperText?: string;  // Sub-description (radio-cards mode only)
}

export interface FalconTabsChangeDetail {
  readonly value: string | number;
  readonly previousValue: string | number | null;
}

export interface FalconTabsFocusDetail {
  readonly value: string | number | null;
}
```

## Reflected props (Stencil)
On the underlying element: `selectedValue`, `mode`, `size`, `orientation` are reflected. Useful for `:where()` token overrides keyed on `[mode="radio-cards"]`.

## Methods on the Angular WRAPPER

| Method | Purpose |
|---|---|
| `syncSelection(next?: string \| number \| null): void` | `[CODE]` falcon-tabs.component.ts:209-224 — **controlled-component escape hatch.** The Stencil tag selects a clicked tab OPTIMISTICALLY (before any Angular round-trip), so a *guarded* tab switch (unsaved-changes confirm) would leave the visual out of sync with the bound `selectedValue`. A consumer that defers/rejects the change calls `syncSelection()` in its `valueChange` handler to snap the visual back to the authoritative tab — it writes BOTH the `selectedValue` property AND the `selected-value` attribute on the live Stencil element. Pass the authoritative value, or omit to re-assert the wrapper's own `value()`. This is the wrapper's only public imperative method. |

## Stencil methods (on the underlying element — NOT proxied by the wrapper)
| Method | Purpose | Available on |
|---|---|---|
| `setFocus(): Promise<void>` | Focus the active tab button. | BOTH `[CODE]` falcon-tabs.tsx:107-113 / -tw.tsx:119-125 |
| `select(value): Promise<void>` | Programmatic selection (no-op when value is disabled or unknown). | BOTH `[CODE]` falcon-tabs.tsx:116-122 / -tw.tsx:127-133 |

> `[CODE]` The wrapper does NOT proxy `setFocus()` / `select()` (use `syncSelection()` for controlled selection, or reach the element via `ViewChild('stencilEl')`).

## Slots

### Navigation mode
- `panel-<value>` — one slot per tab `value`. Project the panel content for that tab.

  Example: tabs with values `'hierarchy'` and `'settings'` → use `<div slot="panel-hierarchy">` and `<div slot="panel-settings">`.

### Radio-cards mode
- No panels (selection emits, consumer renders body separately).

### Trigger / actions (Angular wrapper only)
- `<ng-template falconTabActions="<tab-value>">` — per-tab actions template projected into the Angular wrapper. The wrapper picks the template matching the active tab and physically appends its rendered nodes into the Stencil tablist row via MutationObserver. ALL OTHER components in the workspace use Stencil-native slots — this is the ONE place where Angular content injection escapes into Stencil layout.

## CVA support
**Yes.** The wrapper implements `ControlValueAccessor` and registers `NG_VALUE_ACCESSOR`. Both `ngModel` and Reactive Forms work, binding to a `string | number | null` value.

```html
<falcon-angular-tabs [tabs]="tabs" [(ngModel)]="activeTabId" />
```

## Signal compatibility
- Inputs use classic `@Input()` decorators.
- Wrapper uses internal `signal<value>()` for selected state.
- Per-tab actions are tracked via `contentChildren(FalconTabActionsDirective)` + a `computed<TemplateRef | null>()` selecting the active template.
- The effect that injects the actions DOM has `onCleanup` to disconnect the MutationObserver.

## Supported sizes / states / variants / modes
- **Modes:** `navigation` (default — tablist + underline + panels), `radio-cards` (grid of selectable cards).
- **Orientations:** `horizontal`, `vertical` (vertical only meaningful for `navigation`).
- **Sizes:** `sm` / `md` / `lg`. Token-driven padding / font-size / icon-size.
- **States:** active / hover / focus / disabled. Per-tab `disabled: true` on the option.
- **Per-option:** `icon` (font-icon class), `helperText` (radio-cards sub-description).

## Important constraints
- **`tabs` is a complex prop** — the wrapper passes it directly via property binding (not `[attr.tabs]`) so Stencil hydration receives the array, not a stringified attribute.
- **`selectedValue=null` + non-empty `tabs[]`** — `[CODE]` Stencil auto-selects the first enabled tab on `componentWillLoad` (falcon-tabs.tsx:77-80 / -tw.tsx:91-94) but does NOT emit `falcon-change` for that auto-select. **Footgun under CVA:** the wrapper's `value` signal/FormControl can therefore lag the visually-selected tab on first paint (the Stencil shows tab 0 selected while the Angular value is still `null`). Initialise the bound value to the intended first tab rather than `null`.
- **Keyboard navigation built in:** Arrow Left/Right (horizontal) or Up/Down (vertical), Home, End, Enter, Space.
- **Indicator slide is JS-controlled** — the active tab's `offsetLeft`/`offsetWidth` is measured and set as inline `style.transform`/`style.width` on the dedicated `<span class="falcon-tabs-indicator">`. This is the documented "escape hatch" — no other inline styles in the component.

## Accessibility attributes / events
- Navigation mode: `role="tablist"`, `role="tab"`, `role="tabpanel"`. `aria-selected`, `aria-controls`, `aria-disabled`, `aria-labelledby` (panel ↔ tab id pair).
- Radio-cards mode: `role="radiogroup"`, `role="radio"`. `aria-checked`, `aria-disabled`.
- `aria-orientation` on the tablist for vertical mode.
- `helperText` is `<p class="falcon-tabs-helper">`; `errorMessage` is `<p role="alert" class="falcon-tabs-error">`.
- Disabled tabs have `tabIndex=-1` and skip keyboard focus.
- Active tab is the only `tabIndex=0` button in the tablist — single-tab-stop pattern.

## Parts (Stencil Shadow)

| Part | Element |
|---|---|
| `tablist-wrap` | Outer container around tablist + indicator |
| `tablist` | The `<div role="tablist">` |
| `tab` | Tab button |
| `tab-active` | Active tab button (compound part) |
| `tab-icon` | Icon span inside tab |
| `tab-label` | Label span inside tab |
| `indicator` | Sliding underline strip |
| `panels` | Container for all `<div role="tabpanel">` |
| `panel` | Single `<div role="tabpanel">` |
| `panel-active` | Active panel (compound) |
| `radiogroup` | Radio-cards container |
| `rc-card` | Radio card button |
| `rc-card-selected` | Selected radio card (compound) |
| `rc-icon` | Radio card icon |
| `rc-title` | Radio card title |
| `rc-desc` | Radio card description |
| `helper-text` | Helper text element |
| `error-message` | Error text element |

> `[CODE]` **Shadow↔`-tw` parity (B13):** the Light `<falcon-tabs-tw>` mirrors `<falcon-tabs>` 1:1 in props/events/methods/slots/keyboard/ARIA and shares `falcon-tabs.utils.ts` + the JS `measureActiveTab()` indicator escape hatch. The **one divergence:** the `-tw` twin emits NO `part=` attributes (all the parts above are Shadow-only — Light DOM has no `::part`). Token contract identical.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B13) against falcon-tabs.component.ts (225 ln), .component.html (67 ln), falcon-tab-actions.directive.ts (31 ln), falcon-tabs.tsx (396 ln), falcon-tabs-tw.tsx (385 ln), falcon-tabs.types.ts, falcon-tabs.utils.ts. Added the wrapper's `syncSelection()` method (controlled-tab escape hatch) + the `selectedValue=null` auto-select-vs-CVA footgun + the `-tw` no-`part=` divergence. `setFocus`/`select` confirmed on BOTH Stencil tags (not wrapper-proxied).
