# falcon-filter-panel — GAPS & UPGRADES

## Missing capabilities

### Native form atoms instead of Falcon atoms

- Fields are native HTML controls (`<input type="text|date">`, `<select>`). Visual inconsistency with Falcon's `<falcon-angular-input>` / `<falcon-angular-dropdown>` / `<falcon-angular-date-picker>` (which themselves are token-styled). **P1 — migrate field renderers to Falcon atoms.**

### No custom field renderer

- The `renderFilter` switch supports only `text`, `select`, `date`, `daterange`. No way to inject a custom field type (e.g. multi-select, slider, boolean toggle, search-input). **P1 — add `'custom'` type with named-slot or projected template.**

### Stencil event names are camelCase

- `falconFilterChange` / `falconFilterApply` / `falconFilterClearAll` are NOT kebab-case like the rest of the library (which uses `falcon-change` / `falcon-apply` etc.). Inconsistent with sibling components. **P2 — rename to kebab-case at next breaking version.**

### No Apply on Enter

- Pressing Enter in any field does NOT apply the filter. **P3 — wire `keydown.enter` to `handleApply`.**

### No per-field validation

- Date input doesn't validate min/max. Select doesn't validate required. **P3** — filter UI is forgiving by design; validation belongs in the form below.

### Density

- `density: 'compact' | 'normal'` only — no `'spacious'` parity with table density. **P3.**

### A11y

- Container has no `role="search"` or `role="form"` despite being a form-like region.
- Apply / Clear All are native `<button>` — should be `<falcon-angular-button>` for visual + a11y parity.

### Tests

- No `.spec.ts`. **P2.**

### Internationalization

- `applyLabel` / `clearAllLabel` accept pre-translated strings. The `placeholder` field per filter accepts strings too. No translate key inputs. **No gap — consumer translates.**

### Values input is replaced wholesale on every change

- `componentWillUpdate` does `this.localValues = { ...this.values }` — re-creates localValues from external prop. Consumer must merge incoming changes carefully (signal update pattern works). **No gap; document.**

## Reusable upgrades needed

| ID | Title | Priority |
|---|---|---|
| FFP-01 | Migrate to Falcon atoms (input/dropdown/date-picker) | **P1** |
| FFP-02 | Custom field type with slot/template | **P1** |
| FFP-03 | Standardise event names to kebab-case | **P2** |
| FFP-04 | Specs | **P2** |
| FFP-05 | Apply-on-Enter | **P3** |

## Workarounds available

- For Falcon-styled fields: build a custom toolbar above the table using `<falcon-angular-input>` / `<falcon-angular-dropdown>` directly. Drop the `<falcon-angular-filter-panel>` for now.
- For custom field types: wrap the panel in a `<div>` that adds extra Falcon components around it. Not ideal.

## Visual / interaction risks

- Native `<select>` chevron is OS-styled. **Visual inconsistency** against Falcon dropdowns elsewhere on the page.
- Date input UI varies per browser. Chrome/Safari/Edge all differ. Replace with Falcon date-picker for consistency.

## Fix in shared component vs per-page

All gaps in shared component. The whole point of this panel is consistency above the table.

## Future-proof recommendation

This component is the most "behind" of Agent 2's roster — native atoms + no projection + camelCase events all need updating. Recommend a Wave to migrate it to Falcon atoms + Strategy E projection in one pass.
