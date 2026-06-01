# falcon-input-number — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-input-number>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A bordered single-line field that looks like `<falcon-angular-input>` but holds a *number*. Two distinguishing tells: (1) when `showButtons=true` it carries a `+` / `−` **spinner pair** on the trailing edge (~64px of extra width); (2) in `mode='currency'` the field shows a **currency symbol** glued to the formatted number (e.g. `SAR 1,250.00`), and on blur the value snaps to locale-grouped formatting while focus reveals the raw digits. Same height / border / focus-ring / label / helper / error contract as `<falcon-angular-input>`. Right-aligned numerals are common but layout-driven.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<TextField type="number">` + `NumericFormat` (react-number-format) | MUI has no first-class numeric component — usually a masked TextField |
| PrimeNG | `<p-inputNumber>` | direct 1:1 — `mode`, `currency`, `locale`, `showButtons`, `min`/`max`/`step` all map straight across |
| Ant Design | `<InputNumber>` | direct 1:1 — Ant's `formatter`/`parser` ≈ Falcon's `Intl` modes |
| Bootstrap | `<input type="number">` | upgrade target — no formatting, replace wholesale |
| shadcn / Radix | `<Input type="number">` (no dedicated numeric primitive) | shadcn ships none — Falcon's is richer |
| plain HTML | `<input type="number">` | always replace — native steppers are inconsistent across browsers |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a price / amount with a currency symbol | `<falcon-angular-input-number mode="currency">` | input |
| a quantity with +/− steppers | `<falcon-angular-input-number showButtons="true">` | input |
| a decimal field with fixed precision | `<falcon-angular-input-number mode="decimal">` | input |
| a whole-number count / quota | `<falcon-angular-input-number integer="true">` | input `type="number"` |
| a lightweight number cell inside a data grid | `<falcon-angular-grid-input>` | input-number (heavier) |
| a free-text field that *might* contain digits (codes, IDs) | `<falcon-angular-input type="text">` | input-number |
| a phone number | `<falcon-angular-phone-field>` | input-number |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper.
1. **Inputs** — `[label]`, `[(ngModel)]`/`formControlName`, `mode`, `currency`, `locale`, `[min]`, `[max]`, `[step]`, `[showButtons]`, `[integer]`, `[minFractionDigits]`/`[maxFractionDigits]`, `[required]`, `[state]`, `[errorMessage]`, `size`.
2. **Templates** — none (no `ng-template` inputs).
3. **Slots** — `iconLeft` / `iconRight` flag inputs project `slot="icon-left"` / `slot="icon-right"` content (Stencil-owned). No text prefix/suffix slot — that is GAP G2 ("kg" / "%" symbols not covered by Intl).
4. **Variants** — `mode` (`decimal` / `currency`) is the primary visual axis; `size` (sm/md/lg). Pick `mode` before tokens.
5. **Token override** — per-instance host class mutating `--falcon-input-number-spinner-*` (spinner width/gap) + inherited `--falcon-input-*` tokens. Never hardcode hex/px.
6. **Upgrade** — need a "%" suffix, keyboard arrow-step without buttons, or `signDisplay='accounting'` parens for negatives? GAPs G2 / G6 / G4 — raise them, do not hand-roll a sibling element outside the component.
7. **Wrapper** — only build a thin local wrapper if a repeated prefix+mode combination recurs across many pages.

## Anti-patterns
- Using `<falcon-angular-input type="number">` for money — loses Intl formatting, currency symbol, locale grouping.
- Binding to a `FormControl<string>` — value is `number | null`; a string control breaks numeric validators.
- Setting `minFractionDigits` / `maxFractionDigits` in `mode='currency'` — silently ignored (Intl owns currency decimals).
- Relying on the clamp alone — it fires on blur; an Enter-submit can bypass it. Add `Validators.min`/`max`.
- Skipping `locale` for an Arabic tenant — defaults to browser locale, which may show the wrong numerals/separators.
- Rendering a "%" or "kg" by hand-typing it into the value — there is no text suffix slot (GAP G2); render it as a sibling label or raise the gap.
- `[attr.disabled]` instead of `[disabled]` — bypasses the `disabledFromInput` setter.
- Treating `integer` truncation as a bug — it is the documented "whole numbers only" rule.

## Verification
🟡 CODE-DERIVED from `falcon-input-number.component.ts` + `[VAULT]` API/USAGE/GAPS dossiers. Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge. Spinner visual / currency-symbol behaviour 🟡 CODE-DERIVED from props + dossier (Stencil `.tsx` render not re-read in this pass).
