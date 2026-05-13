# falcon-dropdown — API

## Tag map

| Render path | Tag |
|---|---|
| Angular wrapper | `<falcon-angular-dropdown>` |
| Stencil Shadow | `<falcon-dropdown>` |
| Stencil Light | `<falcon-dropdown-tw>` |

## Types (from `falcon-dropdown.types.ts`)

```ts
type FalconDropdownSize = 'sm' | 'md' | 'lg';
type FalconDropdownState = 'default' | 'error' | 'success' | 'warning';
type FalconDropdownVariant = 'form' | 'search' | 'grid';
type FalconDropdownAppearance = 'default' | 'filled' | 'ghost';

interface FalconDropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
  group?: string;
  data?: unknown;
}

interface FalconDropdownChangeDetail { value: string | number | null; option: FalconDropdownOption | null; }
interface FalconDropdownSearchDetail  { query: string; }
interface FalconDropdownToggleDetail  { open: boolean; }
```

## Props / @Input

| Name | Type | Default | Reflected | Notes |
|---|---|---|---|---|
| `value` | `string \| number \| null` | `null` | no | Mutable on host. Two-way via CVA / `[(ngModel)]`. |
| `options` | `FalconDropdownOption[]` | `[]` | no | Source list. `@Watch('options')` reseeds active index. |
| `label` | `string?` | — | no | Field label above the trigger. |
| `placeholder` | `string?` | — | no | Trigger text when no option selected. |
| `helperText` | `string?` | — | no | Below the field; hidden when `errorMessage` set. |
| `errorMessage` | `string?` | — | no | Below the field in danger style. Implicit error state. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | yes | |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | yes | |
| `variant` | `'form' \| 'search' \| 'grid'` | `'form'` | yes | Same input-family as `<falcon-input>` (Wave 9.C). |
| `appearance` | `'default' \| 'filled' \| 'ghost'` | `'default'` | yes | Wave 9.C. |
| `disabled` | `boolean` | `false` | yes | |
| `readonly` | `boolean` | `false` | yes | |
| `required` | `boolean` | `false` | yes | Renders `*` marker. |
| `clearable` | `boolean` | `false` | yes | Shows X to reset to `null`. |
| `searchable` | `boolean` | `false` | yes | Renders a search input inside the popover. |
| `name` | `string?` | — | no | Mirrors native `name`. |
| `inputId` | `string?` | — | no | Override generated id (default `falcon-dropdown-<seq>`). |
| `searchPlaceholder` | `string` | `'Search…'` | no | i18n hook for the in-panel search input. |
| `emptyMessage` | `string` | `'No results'` | no | Rendered when no options match the search. |

### Angular wrapper additions

- `useTailwind` — `true` by default → `<falcon-dropdown-tw>`; `false` → `<falcon-dropdown>`.
- Standard CVA inputs (`formControl`, `formControlName`, `ngModel`).

## Events (Stencil — all bubble + composed)

| Event | Detail | When |
|---|---|---|
| `falcon-change` | `FalconDropdownChangeDetail` | Option selected (mouse / Enter / type-ahead). |
| `falcon-search` | `FalconDropdownSearchDetail` | User types in the search input. Debouncing is the consumer's responsibility. |
| `falcon-open` | `FalconDropdownToggleDetail` | Panel opens. |
| `falcon-close` | `FalconDropdownToggleDetail` | Panel closes. |
| `falcon-clear` | `FalconDropdownChangeDetail` | Clear button clicked. |
| `falcon-blur` | `FalconDropdownChangeDetail` | Component loses focus. CVA calls `onTouched()`. |

## Slots

| Slot | Render path | Purpose |
|---|---|---|
| `options` | Shadow | Custom option rendering. Default renderer prints `option.label`. |

## Public methods (Stencil)

| Method | Returns | Purpose |
|---|---|---|
| `openPanel()` | `Promise<void>` | Programmatically open the popover. |
| `closePanel()` | `Promise<void>` | Programmatically close the popover. |
| `focusTrigger()` | `Promise<void>` | Focus the trigger button. |

## Internal state

- `@State() open: boolean` — popover visibility.
- `@State() focused: boolean` — trigger button focus.
- `@State() searchQuery: string` — current search input value (when `searchable`).
- `@State() activeIndex: number` — keyboard nav cursor (-1 means nothing focused).
- `@State() resolvedId: string` — generated id used by `aria-labelledby` / label `for`.

## Keyboard interactions

- `ArrowDown` / `ArrowUp` — move active index across enabled options (wraps via `moveActiveIndex`).
- `Home` / `End` — jump to first / last enabled option.
- `Enter` / `Space` (on trigger) — open panel.
- `Enter` (in panel) — select active option, close panel.
- `Esc` — close panel without committing.
- Type-ahead (when NOT `searchable`) — fills a 600ms buffer to jump to first matching option label.

## CSS variables (component-scoped)

Declared in `libs/falcon-ui-tokens/src/components/dropdown.tokens.css` and consumed by both render paths via Tailwind v4 arbitrary-value utilities. Falcon Studio mutates these to restyle every render path at once. Examples (non-exhaustive): trigger height / padding / radius, panel max-height, option hover/active backgrounds, chevron colour.

## CVA contract (Angular)

```ts
writeValue(value: string | number | null): void
registerOnChange(fn: (value: string | number | null) => void): void
registerOnTouched(fn: () => void): void
setDisabledState(isDisabled: boolean): void
```
