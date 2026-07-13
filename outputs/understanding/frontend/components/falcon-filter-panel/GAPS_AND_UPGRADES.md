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

- `[CODE]` **CORRECTION (B12):** the container **DOES** set `role="search"` + `aria-label="Filters"` on BOTH variants (`falcon-filter-panel.tsx:159`, `falcon-filter-panel-tw.tsx:172-173`). The prior "no role" gap is **CLOSED** — no action needed.
- Apply / Clear All are native `<button>` — should be `<falcon-angular-button>` for visual + a11y parity (folded into FFP-01).

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

### FFP-06 (NEW B12) — Light/Shadow token drift in the Tailwind helper (P2, safe-local)

`[CODE]` filter-panel-tailwind-classes.ts hardcodes layout values that the Shadow CSS reads from tokens: `h-9`/`h-8` (vs `--falcon-filter-panel-input-height{,-compact}`), `text-[13px]`/`text-xs` (vs `-input-font-size{,-compact}`), `p-2`/`p-3`/`gap-2`/`gap-3` (vs `-padding{,-compact}`/`-gap{,-compact}`), `gap-1.5` on the daterange, `text-white` on apply, and the focus box-shadow `rgba(13,63,68,0.08)…`. **Impact:** overriding e.g. `--falcon-filter-panel-input-height` moves the Shadow path but NOT the (default) Light path. **Recommended fix (P2, safe-local):** thread the tokens through the helper's arbitrary-value utilities for full parity.

## Wave 7 Findings (2026-05-17)

**Consumer count: 0** ([CODE] grep `<falcon-angular-filter-panel>` across `apps/` + `libs/falcon/`).

**Gap: Zero adoption** — component is showcase/playground-only. Either promote in an upcoming feature (recommended for primitives like `accordion`/`avatar`/`badge`) or formally retire if redundant. Priority: P2 — usability watch, not blocker.

## Deep-Dive Sweep Findings (2026-06-03 — B12)

**Consumer count: 0** ([CODE] grep `<falcon-angular-filter-panel>` / `<falcon-filter-panel>` / `<falcon-filter-panel-tw>` across `apps/` + `libs/falcon` — ZERO renders, unchanged since Wave 7). Only the TYPES are barrel-exported (`falcon-ui-core/src/index.ts:105/109`).

- **`role="search"` gap CLOSED** — set on BOTH variants (correction above); API.md + this file's A11y bullet were stale.
- **FFP-06 added** — Light/Shadow token drift in the Tailwind helper (hardcoded `h-9`/`text-[13px]`/`p-3` etc.). `safe-local`.
- **Token-name drift fixed** in TOKENS.md (no `--falcon-size-control-*`/chevron token; focus ring is a hardcoded literal).
- **Zero-adoption persists** — the component remains NEEDS-UPGRADE (native atoms) AND unadopted. **Recommendation reaffirmed:** for production filter strips hand-compose Falcon atoms (`<falcon-angular-input>`/`<falcon-angular-dropdown>`/`<falcon-angular-date-picker>`/`<falcon-angular-button>`) until FFP-01 + FFP-02 land; consider formally parking this component. The FFP-01 (Falcon atoms) migration touches the public render + event surface → **HIGH-RISK-QUEUE** (not done this pass).
- No deletion flag (it is structurally sound + cross-framework), but it is the lowest-priority-for-production component in its roster.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B12 refresh). 0 consumers re-verified; `role="search"` gap corrected to CLOSED; FFP-06 (token drift) added; token-name drift fixed. FFP-01 (native→Falcon atoms) flagged HIGH-RISK-QUEUE. No deletion/promotion flag.
