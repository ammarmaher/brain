# falcon-dropdown — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-dropdown>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A labeled, bordered field showing the current single selection (or placeholder) with a **chevron** on the trailing edge. Click opens a floating panel of options; one is highlighted/selected. Optional: a **search input** at the top of the panel, a **clear (×)** affordance, and a **leading icon per option** (`iconUrl`, used for flags). Same height / border / focus-ring contract as `<falcon-angular-input>`.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Select>` / `<Autocomplete>` (single, `disableClearable=false`) | MUI Autocomplete-single ≈ searchable dropdown |
| PrimeNG | `<p-dropdown>` / `<p-select>` | direct 1:1 — this component replaced `<p-dropdown>` |
| Ant Design | `<Select showSearch>` | single-mode Select |
| Bootstrap | `.dropdown` / native `<select>` | upgrade target |
| shadcn / Radix | `<Select>` (Radix Select) | non-searchable variant |
| plain HTML | `<select>` | always replace with this |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| one value picked from a list | `<falcon-angular-dropdown>` | — |
| multiple chips / checkboxes in the panel | `<falcon-angular-multi-select>` | dropdown |
| free typing that also accepts new text | `<falcon-angular-combobox>` | dropdown |
| indented / expandable option rows | `<falcon-angular-tree>` | dropdown |
| a country flag glued to a phone input | `<falcon-angular-phone-field>` (built-in chooser) | dropdown |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[options]`, `[(ngModel)]`/CVA, `[placeholder]`, `[searchable]`, `[clearable]`, `[disabled]` (property!), `size` / `variant`.
2. **Per-option icon** — `iconUrl` on each option (flags, glyphs). Do not hand-roll an option template for this.
3. **Tokens** — restyle via `dropdown.tokens.css` vars; never hardcode.
4. Custom option rows beyond `iconUrl`+`label` → currently a GAP (see `GAPS_AND_UPGRADES.md`) — raise, don't hand-roll.

## Anti-patterns
- `[attr.disabled]` — silently no-ops; always `[disabled]="…"`.
- Native `<select>` or PrimeNG `<p-dropdown>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).
- Using it for multi-select or free text — wrong component (see table above).
