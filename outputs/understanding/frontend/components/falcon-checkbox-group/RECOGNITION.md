# falcon-checkbox-group — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-checkbox-group>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE] falcon-checkbox-group.component.ts` + `[BRAIN-OUT]` `OVERVIEW.md` — An **optional group label** followed by a list of **standalone checkbox rows**, each a square box + a `label`. The whole list is **always visible** — there is no trigger, no panel, no chips. Rows stack **vertically** (default) or run **horizontally** (`orientation`). Optional **helper text** sits under the group; an **error text** in alert styling can replace it. Some rows may be greyed (per-option `disabled`). The decisive tell: every option is on screen at once, and each is an independent checkbox — not a chip, not a panel item, not a radio.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<FormGroup>` of `<FormControlLabel control={<Checkbox/>}>` | direct match — MUI's checkbox group composition |
| PrimeNG | multiple `<p-checkbox>` sharing a model array | PrimeNG has no single "checkbox group" tag — this is the Falcon equivalent of that pattern |
| Ant Design | `<Checkbox.Group>` | direct 1:1 |
| Bootstrap | a `<fieldset>` of `.form-check` checkboxes | direct match — Bootstrap's checkbox fieldset |
| shadcn / Radix | a set of Radix `<Checkbox>` with shared state (no group primitive) | composition pattern — Falcon group is the wrapper they lack |
| plain HTML | `<fieldset>` + multiple `<input type="checkbox">` | always replace with this |

## Use THIS vs siblings
The pickers overlap — pick by **"one or many?"**, then **"visible list or hidden behind a trigger?"**, then **"checkbox or radio semantics?"**
| If the design shows… | Use | Not |
|---|---|---|
| an **always-visible** list of checkboxes, multiple may be checked | `<falcon-angular-checkbox-group>` | multi-select / dropdown |
| a `<fieldset>` / labelled group of checkboxes with no panel | `<falcon-angular-checkbox-group>` | — |
| multiple values shown as **chips** in a field, opened by a chevron | `<falcon-angular-multi-select>` | checkbox-group |
| a long multi-value list needing **search / filter** | `<falcon-angular-multi-select>` | checkbox-group |
| **mutually exclusive** options (exactly one) as visible radio rows | `<falcon-angular-radio-group>` | checkbox-group |
| a **single** standalone on/off toggle | `<falcon-angular-checkbox>` (or a switch) | checkbox-group |
| one value picked from a closed list, opened by a chevron | `<falcon-angular-dropdown>` / `<falcon-angular-select>` | checkbox-group |
| a typed input that suggests / creates a value | `<falcon-angular-combobox>` | checkbox-group |

**Decision shortcut:**
- checkbox-group = *many values* + *always-visible* + *checkbox semantics*.
- multi-select = *many values* + *hidden behind trigger* + *chips* — choose it when the list is long or the form is compact.
- radio-group = *exactly one value* + *always-visible* — same shape as checkbox-group but exclusive.
- The two confusions to watch:
  1. **checkbox-group vs multi-select** — both commit a set. Use the group when the operator must *see every option* (a permission list a reviewer signs off, ≤ ~12 rows). Use multi-select when the list is long enough that a panel + chips is worth it.
  2. **checkbox-group vs radio-group** — identical visual rhythm; the difference is *can more than one be chosen*. Checkbox = yes; radio = no.

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[options]`, `[(ngModel)]`/CVA **or** `[(selectedValues)]`, `[groupLabel]`, `[orientation]` (`vertical`/`horizontal`), `[helperText]`, `[errorText]`, `[disabled]`, `size`.
2. **Per-option lock** — set `disabled` on individual `FalconCheckboxGroupOption` entries to grey out unavailable choices.
3. **Templates / slots** — per-option description / icon / custom row is a **GAP** (`GAPS_AND_UPGRADES.md` G1) — raise, do not hand-roll.
4. **Variants** — `orientation` (vertical/horizontal) + `size` only; no `'grid'` orientation yet (`G7`).
5. **Token override** — restyle via `checkbox-group.tokens.css` vars; never hardcode.
6. **Shared upgrade** — `required` / `minSelected` / `maxSelected` / "Select all" are **GAPS** (`G2/G5/G6`) — enforce min/max via parent `Validators` today; raise the gaps.
7. **Wrapper** — for arrow-key roving focus across the group (`G8`), raise the gap; native per-checkbox focus works today.

## Anti-patterns
- Using a checkbox-group for a single value — that is `<falcon-angular-checkbox>`; an array CVA for one boolean is the wrong shape.
- Using it for mutually exclusive options — that is `<falcon-angular-radio-group>`; checkboxes let the user pick several.
- Using it for a long list — it has no search and renders every row; past ~12 options use `<falcon-angular-multi-select>`.
- Expecting a "Select all" — no such control (`G2`); add it externally or raise the gap.
- Expecting `required` / min / max enforcement — not built in (`G5/G6`); use parent validators.
- Mutating the array passed to `[selectedValues]` — the component clones it; bind a fresh array.
- Native `<fieldset>` + `<input type=checkbox>` or PrimeNG `<p-checkbox>` ad-hoc groups in app code — banned (`feedback_falcon_ui_library_only_no_native`).

## Verification
🟡 CODE-DERIVED from `[CODE] src/angular-wrapper/components/falcon-checkbox-group/falcon-checkbox-group.component.ts` + `[BRAIN-OUT]` `OVERVIEW.md` + `[CODE] GAPS_AND_UPGRADES.md`. Cross-library map [INFERRED] from rendered structure. Used in 1 production consumer (user-role wizard) — fingerprint code-derived + feature-grounded.
