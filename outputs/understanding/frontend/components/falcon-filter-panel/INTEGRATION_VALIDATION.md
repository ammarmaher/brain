# falcon-filter-panel — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.

## Owning backend module(s)
`falcon-filter-panel` is **presentational — it owns no data and binds to no endpoint.** It produces a filter-criteria object; the *backend module that owns the list being filtered* consumes it:
- Whatever module owns the records below the strip (Commerce for service/account lists, Identity for user lists, etc.). The panel itself is module-agnostic.
- `select` field `options` are business reference data — typically a lookup (Provisioning) or an enum the consuming feature supplies.

No production page consumes the panel yet, so no live endpoint is wired — the pattern below is the intended one.

## Backend wiring
| Source | Mechanism | Backend module | Notes |
|---|---|---|---|
| `filters` definitions | element property via the Angular wrapper | n/a — view config | `FilterDefinition[]`: `key`, `label`, `type`, optional `options` / `placeholder` |
| `values` (current criteria) | one-way input from a consumer signal | n/a — controlled state | the panel is controlled; the feature owns the value set |
| `falconFilterApply` payload → list query | the consumer calls the list endpoint with the emitted `FilterValues` | the module owning the list | `[CODE]` falcon-filter-panel-tw.tsx:70 — `{ values }` carries the full criteria object |
| `select` `options` | supplied on each `FilterDefinition` | Provisioning lookups / Commerce enums (consumer-resolved) | the panel does not fetch options — the feature populates them |

The panel NEVER calls an endpoint. It emits `falconFilterChange` (per-field), `falconFilterApply` (commit), `falconFilterClearAll` (reset) and trusts the consumer to run the query.

## Validation rules (V-*)
`falcon-filter-panel` runs **no validation rules** — by design (`[BRAIN-OUT]` `GAPS_AND_UPGRADES.md`: "filter UI is forgiving"). A `date` field does not enforce min/max; a `select` does not enforce required; a `daterange` does not check `from ≤ to`. Validation belongs in the form *below* the filtered list, not in the filter strip. No CVA, no `FormControl` integration — the panel has no single value to validate.

The one structural contract: `[CODE]` falcon-filter-panel-tw.tsx — each `FilterDefinition.key` must be unique; `localValues` is keyed by it, and `daterange` derives `{key}_from` / `{key}_to` sub-keys (`[CODE]` :123-124) — a `key` ending in `_from` / `_to` would collide.

## PES keys gating this component
The panel has **no PES key of its own.** It is a query-narrowing surface, not a permission-gated action. If a whole list view is PES-denied the consumer simply does not render the page; the filter strip carries no per-field gate. A field that should appear only for some roles is included/excluded from the `filters` array by the consumer.

## State / signal pattern
`[CODE]` falcon-filter-panel-tw.tsx:45-53 — the Stencil component holds `localValues` as `@State`, rebuilt from the `values` prop in both `componentWillLoad` and `componentWillUpdate` (fully controlled — external `values` always wins on update). The recommended consumer pattern (`[USAGE]`): `values` is a signal; `(filterChange)` does `values.update(v => ({ ...v, [key]: value }))`; `(filterApply)` calls the list API; `(filterClearAll)` resets the signal and re-queries.

Error pipeline — the panel itself emits no HTTP calls, so it has no error behavior; the list query the consumer fires runs the standard Falcon error pipeline.

## Skeleton ↔ app-wrapper layering
- **Stencil skeleton** — `<falcon-filter-panel>` (Shadow) / `<falcon-filter-panel-tw>` (Light, default render path). Pure presentational; the `renderFilter` switch produces native fields.
- **Angular wrapper** — `<falcon-angular-filter-panel>`: bridges the camelCase Stencil events to `(filterChange)` / `(filterApply)` / `(filterClearAll)` outputs. **No CVA** (no single value). **No `<ng-template>` projection** — `[CODE]`-verified, the wrapper directory has no `TemplateRef` / `ContentChild`; `[filters]` is the only way to compose fields.
- Per `feedback_library_skeleton_app_api` — the list query is fired by the app/state layer; the panel is purely the criteria-input surface.

## Integration gotchas
- `[CODE]` falcon-filter-panel-tw.tsx:55-62 — **Stencil event names are camelCase** (`falconFilterChange` / `falconFilterApply` / `falconFilterClearAll`), unlike the kebab-case (`falcon-change`) used by the rest of the library. The Angular wrapper bridges them; a direct Stencil consumer must `addEventListener('falconFilterApply', …)` with the camelCase name. FFP-03 proposes standardising to kebab-case.
- **CORRECTION vs the existing UI-layer dossiers** — `API.md` (line 86) and `GAPS_AND_UPGRADES.md` (line 31) state the container has *no* `role`. The **live source contradicts this**: `[CODE]` falcon-filter-panel-tw.tsx:173 sets `role="search"` + `aria-label="Filters"` on the container. The accessibility-role gap is **already closed in the Light (`-tw`) variant**. (The old dossier may reflect the Shadow variant or a pre-fix state — not corrected in the old files per the task's "do not edit the old 6" rule.)
- Fields are **native HTML controls** — the `<select>` chevron and `<input type="date">` widget are OS/browser-rendered and NOT controllable through Falcon tokens (visual inconsistency, FFP-01).
- `values` is replaced wholesale on every update — the consumer must merge incrementally (the signal `update` pattern does this correctly).
- No Apply-on-Enter (`[CODE]` — no `keydown` handler); the operator must click Apply (FFP-05 gap).

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-filter-panel-tw.tsx + the 6 UI-layer dossiers. The `role="search"` correction ✅ VERIFIED directly against `falcon-filter-panel-tw.tsx:173` (live source). "No projection in the Angular wrapper" ✅ VERIFIED ([CODE] grep returned no `TemplateRef`). 🔴 No production consumer — endpoint wiring is inferred from the intended pattern.
