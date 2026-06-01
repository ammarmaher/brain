# falcon-filter-panel — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `falcon-filter-panel` is how a Falcon operator *narrows a large record population to the subset they need to work on* — the filter strip above a list/table. In business terms it is the inverse of the table: the table shows everyone, the filter panel says "show me only the ones that match these criteria." It handles **multi-field filtering** — a status select, a date range, a free-text search, all applied together — which the table's single built-in global-filter input cannot do.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Operators triage record lists by category + recency + identity | `[INFERRED]` from admin list-page UX | The four field types — `text` / `select` / `date` / `daterange` — cover the three triage axes: who/what (text), category (select), when (date / daterange). |
| Filtering is a forgiving, non-committing action | `[BRAIN-OUT]` `GAPS_AND_UPGRADES.md` — "filter UI is forgiving by design; validation belongs in the form below" | The panel runs **no per-field validation**. A bad date or empty select is allowed — filtering never blocks the operator, it just returns fewer/more rows. |

## Business constraints baked in
- `[CODE]` falcon-filter-panel-tw.tsx:69-71 — **Apply is an explicit commit.** `handleApply` emits the full value set only when the Apply button is clicked; per-field changes emit `falconFilterChange` but do not run the query. This encodes "compose your filter, then commit" — the business cost of a query (a backend round-trip) is paid on the operator's deliberate action, not every keystroke.
- `[CODE]` falcon-filter-panel-tw.tsx:73-78 — **Clear All resets every field to empty string** and emits `falconFilterClearAll`. "Clear" is a defined business action: return to the unfiltered population.
- `[CODE]` falcon-filter-panel-tw.tsx:51-53 — `componentWillUpdate` rebuilds `localValues` from the external `values` prop on every update — the panel is a **controlled** component; the business state (what is filtered) lives in the consuming feature, not the panel.
- `[CODE]` falcon-filter-panel-tw.tsx — fields are **native HTML controls** (`<input>`, `<select>`, `<input type="date">`), NOT Falcon atoms. Business impact: visual inconsistency with the rest of a Falcon page (FFP-01). For production pages where brand consistency matters, `DECISION.md` recommends hand-rolling the strip from Falcon atoms instead.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Admin list filter strip | (no production page yet) | Multi-field filter above a user / record list |
| Showcase / playground | host-shell showcase | Demonstration only |

`[CODE]`/`[USAGE]` Wave 7 sweep — **0 production consumers, 0 showcase consumers found.** The component is built but unadopted. A builder asked for a filter strip today should read `DECISION.md` first — the current recommendation is to compose Falcon atoms directly until FFP-01 lands.

## Business gotchas
- **It is not the table's global filter.** A single search field above a list is already covered by the table's `[showGlobalFilter]` + `[globalFilterFields]`. Use `falcon-filter-panel` only when the business needs *two or more* filter fields applied together.
- **It is not per-column filtering.** The panel is a row of independent filters; it does not filter individual table columns. Per-column filtering does not exist in Falcon (the table reserved `internalFilters` state but ships no UI).
- **Filtering never validates.** A `daterange` with `from` after `to` is allowed — the panel emits it as-is; the business consequence (an empty result) is the operator's signal, not a panel error.
- The panel emits values but is **output-only** for the value set — there is no two-way `[(values)]`. The consumer owns the filter state and feeds it back via `[values]`.

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-filter-panel-tw.tsx + the 6 UI-layer dossiers. 🔴 No production consumer (Wave 7 sweep: 0 consumers) — business flows are inferred from the documented intended use. Native-atoms constraint ✅ VERIFIED in live source.
