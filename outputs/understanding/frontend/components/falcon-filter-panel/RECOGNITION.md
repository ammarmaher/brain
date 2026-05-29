# falcon-filter-panel — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-filter-panel>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` falcon-filter-panel-tw.tsx — A single horizontal strip, sitting **above a list/table**, of labelled filter fields laid out left to right. Each field is a small label over a control: a text input, a select dropdown, a date input, or a date-range pair (two date inputs side by side). At the trailing edge (`ms-auto`) sit two buttons: **Clear All** and **Apply**. The whole strip has a container background, padding and gap. Distinguishing trait: **a row of heterogeneous filter inputs with a trailing Apply/Clear pair, positioned above a data list** — it is the "filter bar" pattern. If you see a single search box above a table, that is the table's *built-in* global filter, not this. If you see a vertical column of filters in a sidebar/drawer, that is a faceted-filter panel — Falcon has no dedicated one (this component is horizontal-only).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Toolbar>` composed with `<TextField>` + `<Select>` + `<DatePicker>` | MUI has no single "filter panel" — it is a composed toolbar; `falcon-filter-panel` packages the same idea |
| PrimeNG | `<p-toolbar>` + filter controls, or `<p-table>` filter row | PrimeNG bundles filtering into `p-table`; the standalone strip ≈ a `p-toolbar` |
| Ant Design | `<Form layout="inline">` filter form, or `<ProTable>` search form (Ant Pro) | Ant Pro's `ProTable` search form is the closest 1:1 |
| Bootstrap | `.form-inline` / inline `<form>` of controls | upgrade target |
| shadcn / Radix | a composed `<div>` of `<Input>` + `<Select>` + `<DatePicker>` | shadcn has no packaged filter bar — it is hand-composed |
| plain HTML | inline `<form>` with `<input>` / `<select>` | the panel literally renders these natively today |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a horizontal strip of 2+ filter fields above a list, with Apply/Clear | `<falcon-angular-filter-panel>` (or hand-rolled Falcon atoms — see recipe) | the table's global filter |
| a single search box above a table | the table's `[showGlobalFilter]` + `[globalFilterFields]` | falcon-filter-panel |
| filter inputs scoped to individual table columns | (not supported in Falcon — no per-column filter UI ships) | falcon-filter-panel |
| a faceted filter sidebar / drawer (vertical) | a hand-composed panel of Falcon atoms in a drawer | falcon-filter-panel (horizontal only) |
| one labelled select / text field standing alone (not a filter strip) | `<falcon-angular-dropdown>` / `<falcon-angular-input>` | falcon-filter-panel |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[filters]` (`FalconFilterDefinition[]`: `key`, `label`, `type` ∈ `text`/`select`/`date`/`daterange`, optional `options` / `placeholder`); `[values]` (controlled, signal-bound); `density` (`compact`/`normal`); `showApply` / `showClearAll`; `applyLabel` / `clearAllLabel`.
2. **Per-field config** — `select` fields take an `options: SelectOption[]`; every field takes a `placeholder`.
3. **Templates / slots** — **NONE.** The `renderFilter` switch supports only the four built-in types; there is no custom-field projection (FFP-02 gap).
4. **Variants** — `density` only (`compact` / `normal` — no `spacious`).
5. **Token override** — host marker class + re-declare `--falcon-filter-panel-*`; `[wrapperClass]` / `[slotClass]` / `[inputClass]` for per-region Tailwind.
6. **Upgrade** — Falcon-atom field renderers (FFP-01), a `'custom'` field type with projection (FFP-02), kebab-case events (FFP-03), Apply-on-Enter (FFP-05) are documented gaps. If the design needs a multi-select / toggle / search-input field, raise FFP-02.
7. **Wrapper / fallback (the recommended path TODAY)** — `DECISION.md` is explicit: for a **production** filter strip where brand consistency matters, do NOT use this component yet — its native `<input>`/`<select>`/`<input type="date">` look inconsistent with Falcon atoms. Instead hand-compose the strip from `<falcon-angular-input>` + `<falcon-angular-dropdown>` + `<falcon-angular-date-picker>` + `<falcon-angular-button>`, driving `values` via a signal. Use `<falcon-angular-filter-panel>` only for showcase/prototype work until FFP-01 lands.

## Anti-patterns
- Using `falcon-filter-panel` for a single search field — that is the table's built-in global filter.
- Using it for per-column filtering — Falcon has no per-column filter UI; the panel is a row of independent filters.
- Expecting a custom field type (multi-select, switch, slider) — only `text`/`select`/`date`/`daterange` exist; raise FFP-02.
- Binding `[(values)]` expecting two-way — the value set is output-only; the consumer owns it and feeds `[values]` back.
- Expecting Falcon-styled fields — fields are native HTML controls today; for brand parity, hand-compose Falcon atoms (recipe step 7).
- Listening for kebab-case events on the raw Stencil tag — the events are camelCase (`falconFilterApply`); the Angular wrapper bridges them but a direct consumer must use the camelCase name.
- Expecting Apply-on-Enter — there is no keydown handler; Apply must be clicked.

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-filter-panel-tw.tsx + the 6 UI-layer dossiers. Cross-library map `[INFERRED]` from standard library APIs. The "hand-compose Falcon atoms for production" recommendation ✅ VERIFIED against `DECISION.md`.
