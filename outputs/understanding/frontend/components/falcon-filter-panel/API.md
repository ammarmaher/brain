# falcon-filter-panel — API

## Selectors / Tags

| Mode | Tag |
|---|---|
| Stencil Shadow | `<falcon-filter-panel>` |
| Stencil Light | `<falcon-filter-panel-tw>` |
| Angular wrapper | `<falcon-angular-filter-panel>` |

## Inputs (Angular wrapper)

| Input | Type | Default | Notes |
|---|---|---|---|
| `filters` | `FalconFilterDefinition[]` | `[]` | Filter field descriptors |
| `values` | `FalconFilterValues` (`Record<string, unknown>`) | `{}` | Current values |
| `density` | `'compact' \| 'normal'` | `'normal'` | |
| `showApply` | `boolean` | `true` | Render Apply button |
| `showClearAll` | `boolean` | `true` | Render Clear All button |
| `applyLabel` | `string` | `'Apply'` | |
| `clearAllLabel` | `string` | `'Clear All'` | |
| `useTailwind` | `boolean` | `true` | |
| `wrapperClass` | `string` | `''` | |
| `slotClass` | `string` | `''` | |
| `inputClass` | `string` | `''` | |

## Outputs

| Output | Type | When |
|---|---|---|
| `filterChange` | `EventEmitter<{ key: string; value: unknown }>` | Per-field change |
| `filterApply` | `EventEmitter<FalconFilterValues>` | Apply button clicked |
| `filterClearAll` | `EventEmitter<void>` | Clear All button clicked |

## Stencil events

- `falconFilterChange` — per-field change
- `falconFilterApply` — apply
- `falconFilterClearAll` — clear all

> NOTE — these Stencil event names are camelCase (`falconFilterChange`) not kebab-case like the rest of the library. The Angular wrapper bridges them via `(falconFilterChange)` template bindings — see `falcon-filter-panel.component.html` (not read but inferred from handler patterns).

## TypeScript types

```ts
type FilterFieldType = 'text' | 'select' | 'date' | 'daterange';
type FalconFilterPanelDensity = 'compact' | 'normal';

interface SelectOption {
  value: string;
  label: string;
}

interface FilterDefinition {
  key: string;
  label: string;
  type: FilterFieldType;
  options?: SelectOption[];
  placeholder?: string;
}

type FilterValues = Record<string, unknown>;

interface FalconFilterChangeDetail { key: string; value: unknown; }
interface FalconFilterApplyDetail { values: FilterValues; }
```

The Angular wrapper re-exports `FalconFilterDefinition` and `FalconFilterValues` types from `falcon-filter-panel.component.ts` (lines 15-23) — same shape but separate decl.

## Slots

- Stencil: NO declared slots. Fields render via the internal `renderFilter(filter)` switch.
- Angular wrapper: NO `<ng-template>` projection — `[filters]` is the only way to compose fields.

## Variants

- **Field types:** `text` (native `<input type="text">`), `select` (native `<select>`), `date` (native `<input type="date">`), `daterange` (two date inputs side-by-side).
- **Density:** `compact` / `normal` — affects field height + padding.

## CVA

NO — the panel has no single value, it's a panel of fields with a per-field-event surface.

## Accessibility

- Each field has `<label for="ffp-{key}">` and `aria-label={filter.label}`.
- The component does NOT set `role="search"` or `role="form"` on the container — should it? **P3.**
- Apply / Clear All — should be `<falcon-angular-button>` for keyboard + screen-reader parity. Today they're native `<button>` (Stencil reference).
