# falcon-radio-group — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-radio-group>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A set of **circular radio dots, each with a label**, laid out as a vertical column (default) or a horizontal row, optionally under a **group label**. Exactly one dot is filled (the selection). A **helper paragraph** or **error paragraph** can sit below the group. Each dot is a `<falcon-angular-radio>` child — circular outline when unselected, filled brand-coloured ring when selected, greyed when disabled. All options are visible at once — there is no chevron, no popup, no panel. Distinguished from a checkbox group by the circular (not square) markers and the mutually-exclusive fill.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<RadioGroup>` + `<FormControlLabel control={<Radio/>}>` | direct 1:1 — MUI `row` prop ≈ `orientation="horizontal"` |
| PrimeNG | `<p-radioButton>` instances sharing a `name` | PrimeNG has no group wrapper — Falcon's group ≈ a managed set of `p-radioButton`s |
| Ant Design | `<Radio.Group>` with `<Radio>` children or `options` prop | direct 1:1 — Ant's `options` array ≈ Falcon's `[options]` |
| Bootstrap | `.form-check` with `<input type="radio">` × N | upgrade target — replace the hand-rolled set |
| shadcn / Radix | `<RadioGroup>` + `<RadioGroupItem>` (Radix RadioGroup) | direct 1:1 |
| plain HTML | `<input type="radio" name="…">` × N | always replace with this |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| 2–8 mutually-exclusive options, all visible | `<falcon-angular-radio-group>` | dropdown |
| a long single-choice list (countries, > 8 items) | `<falcon-angular-dropdown>` | radio-group |
| multiple checkable items (pick any number) | `<falcon-angular-checkbox-group>` / `<falcon-angular-multi-select>` | radio-group |
| a single on/off toggle | `<falcon-angular-checkbox>` / `<falcon-angular-switch>` | radio-group of 2 |
| pricing/tier cards with icon + title + description | `<falcon-angular-tabs mode='radio-cards'>` | radio-group (no card variant — GAP G3) |
| one-of-many that also acts as page navigation | `<falcon-angular-tabs>` | radio-group |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper.
1. **Inputs** — `[options]` (array of `{ value, label, disabled? }`), `[(ngModel)]`/`formControlName`, `orientation` (`vertical` / `horizontal`), `[groupLabel]`, `[helperText]`, `[errorText]`, `size`, `[required]`, `[disabled]`.
2. **Templates** — none (no `ng-template` / `ContentChild` item template — per-option is label-only; `[VAULT]` GAP G1 proposes one).
3. **Slots** — none. Each option is `{ value, label }`; there is no per-option icon or description slot today (GAPs G1 / G7).
4. **Variants** — `orientation` is the only layout axis. There is no `appearance='card'` variant (GAP G3).
5. **Token override** — per-instance host class mutating `--falcon-radio-group-*` (gap, label color) + the child radio's own tokens. Never hardcode hex/px.
6. **Upgrade** — need per-option descriptions, an `iconUrl`, a card layout, a required-marker on the group label, or an `errorMessage` alias? GAPs G1 / G7 / G3 / G4 / G2 — raise them, do not hand-roll a parallel control.
7. **Wrapper** — only build a thin local wrapper if a fixed option set + handler recurs across many pages.

## Anti-patterns
- Hand-looping `<falcon-angular-radio>` instead of using the group — loses shared-`name` exclusivity and the CVA contract.
- Native `<input type="radio">` or PrimeNG `<p-radioButton>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).
- Binding `[errorMessage]` — the input is `errorText`; `errorMessage` is a silent no-op here.
- Mismatched types between option `value` and the bound model — `===` comparison renders nothing checked.
- Mixing CVA writes with the `[selectedValue]` setter — pick one write path.
- Using it for > 8 options — switch to `<falcon-angular-dropdown>`.
- Using it for a boolean — use `<falcon-angular-checkbox>` / `<falcon-angular-switch>`.
- Using it for an icon+title+description card picker — use `<falcon-angular-tabs mode='radio-cards'>`.
- Pre-formatting a description into the `label` string to fake a two-line option — raise GAP G1 instead.

## Verification
🟡 CODE-DERIVED from `falcon-radio-group.component.ts` + `[VAULT]` API/USAGE/GAPS dossiers. `errorText` input name ✅ VERIFIED in source. Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge. Child-radio visual detail 🟡 CODE-DERIVED (the `<falcon-angular-radio>` `.tsx` not re-read in this pass).
