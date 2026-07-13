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

> NOTE — these Stencil event names are camelCase (`falconFilterChange`/`falconFilterApply`/`falconFilterClearAll`), NOT kebab-case (`falcon-change`) like the rest of the library (FFP-03). `[CODE]` The Angular wrapper bridges them via `(falconFilterChange)`/`(falconFilterApply)`/`(falconFilterClearAll)` template bindings on both branches — CONFIRMED at `falcon-filter-panel.component.html:17-19/30-32` (read 2026-06-03). The wrapper's `handleChange`/`handleApply`/`handleClearAll` re-emit them as `(filterChange)`/`(filterApply)`/`(filterClearAll)`.

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

- `[CODE]` Each field has `<label for="ffp-{key}">` (Shadow) / `for="ffptw-{key}"` (Light) and `aria-label={filter.label}` (`[CODE]` falcon-filter-panel.tsx:79/99 + tw.tsx:90/110).
- `[CODE]` **CORRECTION (B12):** the container DOES set `role="search"` + `aria-label="Filters"` on **BOTH** variants — Shadow `falcon-filter-panel.tsx:159` and Light `falcon-filter-panel-tw.tsx:172-173`. The prior dossier's "does NOT set `role`" is **stale** — the role gap is closed on both tags.
- `[CODE]` `daterange` renders two date inputs with `aria-label={label} from` / `{label} to` (`[CODE]` tsx:121/129).
- `[CODE]` Apply / Clear All buttons have `aria-label` + `:focus-visible` outline, but are **native `<button>`** (Stencil-rendered), not `<falcon-angular-button>` — keyboard/screen-reader-OK but visually off-brand (FFP-01). Each select option, the placeholder "All {label}" `<option value="">`, is present.
- `[CODE]` No Apply-on-Enter — there is no `keydown` handler (FFP-05).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12 refresh) against falcon-filter-panel.tsx (192 ln), falcon-filter-panel-tw.tsx (205 ln), .component.ts (73 ln), .component.html (34 ln), .types.ts (28 ln). Corrected: `role="search"`+`aria-label="Filters"` set on BOTH variants (prior "no role" was stale); wrapper event-bridge confirmed at html:17-19/30-32; camelCase event names confirmed (FFP-03). Inputs/outputs/types tables re-confirmed accurate.
