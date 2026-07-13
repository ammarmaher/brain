# falcon-dropdown — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-dropdown>` as the component to use, and how to compose it to parity. Sweep-refreshed 2026-06-03 (B04).

## Visual fingerprint
A labeled, bordered field showing the current single selection (or placeholder) with a **chevron** on the trailing edge that rotates 180° on open. Click opens a floating panel of options; one is highlighted (keyboard-active) and one is selected (teal-tinted bg). Optional: a **search input** at the top of the panel (when `searchable`), a **clear (×)** affordance (when `clearable` + a value), and a **leading icon per option** (`iconUrl`, used for flags). Same height / border / brand-teal focus halo as `<falcon-angular-input>`.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Select>` / `<Autocomplete>` (single) | MUI Autocomplete-single ≈ `searchable` dropdown |
| PrimeNG | `<p-dropdown>` / `<p-select>` | direct 1:1 — this component replaced `<p-dropdown>` |
| Ant Design | `<Select showSearch>` | single-mode Select |
| Bootstrap | `.dropdown` / native `<select>` | upgrade target — replace wholesale |
| shadcn / Radix | `<Select>` (Radix Select) | non-searchable variant |
| Headless UI | `<Listbox>` | closest headless analogue (single) |
| plain HTML | `<select>` | always replace with this |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| one value picked from a list | `<falcon-angular-dropdown>` | — |
| multiple chips / checkboxes in the panel | `<falcon-angular-multi-select>` | dropdown |
| free typing that also accepts new text | `<falcon-angular-combobox>` | dropdown |
| indented / expandable option rows | `<falcon-angular-tree>` / `<falcon-angular-tree-table>` | dropdown |
| a country flag glued to a phone input | `<falcon-angular-phone-field>` (built-in chooser) | dropdown |
| a date value | `<falcon-angular-date-picker>` | dropdown |

> The spec name for this control is "Select" — the alias `<falcon-angular-select>` exists but is a DEAD CANDIDATE re-export of this same class. Prefer `<falcon-angular-dropdown>` in new code.

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper.
1. **Inputs** — `[options]`, `[(ngModel)]`/`formControlName`, `[placeholder]`, `[searchable]`, `[clearable]`, `[disabled]` (**property binding!**), `[required]`, `[errorText]`+`[state]`, `size`, `variant`, `appearance`.
2. **Templates** — none on the wrapper (no per-option `ng-template`) — GAP G1.
3. **Slots** — `iconLeft` + `slot="icon-left"` (both paths); `slot="options"` for a fully custom listbox — **Shadow path only** (`useTailwind=false`). Tailwind path has no options slot.
4. **Per-option icon** — `iconUrl` on each option (flags, glyphs). Do not hand-roll an option template for the icon case.
5. **Variants** — `variant` (`form`/`search`/`grid`) + `appearance` (`default`/`filled`/`ghost`) before reaching for tokens.
6. **Token override** — per-instance host class mutating `--falcon-dropdown-*` (border, radius, panel-max-height). Never hardcode hex/px. (Note: the host-class override does NOT reach the body-portaled panel — use `panelClass` for that.)
7. **Upgrade** — structured per-option rows / async loading / multi-mode → GAPS (G1/G4/G3), raise; do not hand-roll.
8. **Wrapper** — only build a thin local wrapper for a repeated option-template pattern across many pages.

## Anti-patterns
- `[attr.disabled]` — bypasses the `disabledFromInput` setter; always `[disabled]="…"`.
- Native `<select>` or PrimeNG `<p-dropdown>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).
- Passing `errorMessage` on the wrapper — the wrapper input is `errorText`.
- Binding `[value]` directly — races CVA.
- Relying on `slot="options"` / `panelClass` for custom panel content in the default Tailwind mode — silently absent / Tailwind-only.
- Pushing options via `nativeElement.options =` — bypasses the race-guarded setter.
- Hand-rolling a search input around the dropdown — use `searchable=true`.
- Using it for multi-select / free text / dates — wrong component (see table).

## Verification
🟡 code-derived from `falcon-dropdown.component.{ts,html}` + `falcon-dropdown.tsx` + `falcon-dropdown-tw.tsx`. Sibling routing cross-checked against OVERVIEW "When NOT to use". Cross-library mapping 🟡 code-derived + `[INFERRED]` standard-library knowledge.
