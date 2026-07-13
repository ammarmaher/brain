# falcon-checkbox — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-checkbox>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A small **square box** (typically 14 / 16 / 18px for sm / md / lg) on the leading edge, with an optional **label** to its trailing side. Three box states are visually distinct:
- **Unchecked** — empty box, neutral border.
- **Checked** — filled teal box with a white **check glyph** (inline SVG, built-in).
- **Indeterminate** — filled box with a horizontal **bar** instead of a check (tri-state "some selected").

Plus: an optional `*` **required asterisk** on the label, a teal **focus halo** ring, an **error** state (red border + red `role="alert"` message below), and optional **helper text** below the label. Same height-rhythm / focus-ring contract as `<falcon-angular-input>` and `<falcon-angular-dropdown>`. The box corners are slightly rounded (`--falcon-radius-xs`, 3–4px).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Checkbox>` / `<FormControlLabel control={<Checkbox/>}>` | MUI's `indeterminate` prop maps 1:1; `<FormControlLabel>` ≈ the built-in `label`. |
| PrimeNG | `<p-checkbox>` / `<p-triStateCheckbox>` | direct 1:1 — this component **replaces** `<p-checkbox>`. PrimeNG tri-state is covered by the `indeterminate` input. |
| Ant Design | `<Checkbox>` | `indeterminate` prop maps 1:1; Ant `Checkbox.Group` → `<falcon-angular-checkbox-group>`. |
| Bootstrap | `.form-check` + `<input type="checkbox" class="form-check-input">` | upgrade target — replace with this component. |
| shadcn / Radix | `<Checkbox>` (Radix Checkbox) | Radix `checked="indeterminate"` maps to the `indeterminate` input. |
| plain HTML | `<input type="checkbox">` + `<label>` | always replace with this component (`feedback_falcon_ui_library_only_no_native`). |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| one square box recording a yes/no fact | `<falcon-angular-checkbox>` | — |
| a sliding on/off knob or pill | `<falcon-angular-switch>` | checkbox |
| several boxes sharing one combined value | `<falcon-angular-checkbox-group>` | a `*ngFor` of raw checkboxes |
| mutually exclusive circular options | `<falcon-angular-radio>` / `<falcon-angular-radio-group>` | checkbox |
| a header box with a "some selected" bar | `<falcon-angular-checkbox>` with `[indeterminate]` | a custom tri-state widget |
| a chip the user can dismiss | `<falcon-angular-tag dismissible>` | checkbox |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **Inputs** — `[label]`, `[(ngModel)]` / `formControlName` (CVA), `[required]`, `[size]` (`sm`/`md`/`lg`), `[state]` (`default`/`error`/`success`/`warning`), `[helperText]`, `[errorText]`, `[readonly]`.
2. **Tri-state** — `[indeterminate]="someSelected() && !allSelected()"`; re-derive it in `(valueChange)` since it resets on toggle.
3. **Slot** — **there is NO content slot** (the wrapper is a pure tag-switcher; neither Stencil tag declares a default `<slot/>`). A rich label (link inside an agreement label) is NOT supported — that is GAP G2; raise it, do not hand-roll a sibling.
4. **Variant** — `[checkedInput]` is the parent-driven variant; use it **only** inside `<falcon-angular-checkbox-group>`.
5. **Token override** — restyle box color / radius / check glyph via `checkbox.tokens.css` vars (`--falcon-checkbox-bg-checked`, `--falcon-checkbox-radius`, etc.); never hardcode hex/px.
6. **Shared upgrade** — a `description` sub-label or `errorMessage` alias is a GAP (`GAPS_AND_UPGRADES.md` G1/G2) — raise it, do not hand-roll.
7. **Wrapper** — for new pages always use `<falcon-angular-checkbox>` (the Angular wrapper), never the raw Stencil tag.

## Anti-patterns
- Native `<input type="checkbox">` or PrimeNG `<p-checkbox>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).
- Both `[(ngModel)]` and `[checkedInput]` on one instance — they fight (`USAGE.md:70`).
- Trying to persist `indeterminate` across toggles — it resets by design (`USAGE.md:79`); recompute it.
- A `*ngFor` of raw checkboxes to model a multi-value field — use `<falcon-angular-checkbox-group>` so the shared value contract holds.
- Injecting `pi pi-check` / PrimeIcons for the check glyph — it is built-in (`USAGE.md:72`).
- Using a checkbox where the design needs a true third value ("unknown") — a checkbox is strictly boolean; use a dropdown.

## Verification
🟢 code-verified from `falcon-checkbox.component.{ts,html}` + `falcon-checkbox.tsx` + `checkbox.tokens.css` (read 2026-06-03). Cross-library mapping 🟡 `[INFERRED]` from standard component parity. **Corrected:** the "rich label via `<ng-content>`" recipe step (there is no slot).
