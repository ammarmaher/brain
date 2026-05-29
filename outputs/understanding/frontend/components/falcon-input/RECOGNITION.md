# falcon-input — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-input>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A single-line bordered field with an optional **label above** (with a red `*` when required), an optional **helper paragraph** or **error paragraph** below. The field has a consistent height (28 / 34 / 38 px for sm/md/lg), a 1px border, a rounded corner, and a brand-teal focus halo. Optional affordances: a trailing **clear (×)** button when `clearable` and the value is non-empty; a **leading/trailing icon slot** (Shadow path only). States paint the border + background: default / error (red) / success (green) / warning (amber). Same height / border / focus-ring contract as `<falcon-angular-dropdown>` and `<falcon-angular-textarea>`.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<TextField variant="outlined">` | MUI's label-shrink + helperText ≈ Falcon's label + helperText/errorMessage |
| PrimeNG | `<p-inputText>` / `<input pInputText>` | direct 1:1 — this component replaced `<p-input-text>` in Wave PR-8 |
| Ant Design | `<Input>` (with `<Form.Item>` for label/error) | Ant splits label/error into Form.Item; Falcon bakes them in |
| Bootstrap | `<input class="form-control">` + `.form-label` + `.invalid-feedback` | upgrade target — replace wholesale |
| shadcn / Radix | `<Input>` + `<Label>` + `<FormMessage>` | shadcn composes 3 primitives; Falcon is one component |
| plain HTML | `<input type="text">` | always replace with this |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a single line of free text (name, search, generic) | `<falcon-angular-input>` | — |
| a number with steppers / currency / decimals | `<falcon-angular-input-number>` | input |
| a password with a reveal eye / strength meter | `<falcon-angular-password>` | input `type="password"` |
| an email field with a "Verify" button | `<falcon-angular-email-field>` | input `type="email"` |
| a phone field with a country/dial-code chooser | `<falcon-angular-phone-field>` | input `type="tel"` |
| multi-line text / a comment box | `<falcon-angular-textarea>` | input |
| a one-time-code box (split digit cells) | `<falcon-angular-otp>` | input |
| a search box with debounce + clear | `<falcon-angular-search-input>` | input `variant="search"` |
| an editable cell inside a data grid | `<falcon-angular-grid-input>` | input |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper.
1. **Inputs** — `[label]`, `[placeholder]`, `[(ngModel)]`/`formControlName`, `[required]`, `[clearable]`, `[helperText]`, `[errorMessage]`, `[state]`, `type`, `size`, `[maxlength]`.
2. **Templates** — none (no `ng-template` inputs). Label/helper/error are prop-driven.
3. **Slots** — `slot="prefix"` / `slot="suffix"` for leading/trailing content — **Shadow path only** (`useTailwind=false`). Tailwind path has no slots (GAP G1).
4. **Variants** — `variant` (`form` / `search` / `grid`) + `appearance` (`default` / `filled` / `ghost`). Pick the variant before reaching for tokens.
5. **Token override** — per-instance host class mutating `--falcon-input-*` (height, radius, focus color, bg). Example: `.add-client-special-input`. Never hardcode hex/px.
6. **Upgrade** — needs a prop-driven leading icon? That is GAP G8 — raise it, do not hand-roll a sibling element.
7. **Wrapper** — only build a thin local wrapper if you need a repeated icon+mask combination across many pages; otherwise reuse directly.

## Anti-patterns
- `[attr.disabled]` — bypasses the `disabledFromInput` setter; always `[disabled]="…"`.
- Native `<input>` or PrimeNG `<p-inputText>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).
- Binding both `[value]` and `[(ngModel)]` — `[value]` races CVA.
- Nesting in `<falcon-form-field>` for new code while also setting `[label]` — renders two labels.
- Relying on `prefix`/`suffix` slots in Tailwind mode — silently absent.
- Treating `[maxlength]` as validation — it is a keystroke cap only.
- Adding SCSS rules in the consumer's `.component.css` to restyle the field — use the token-override host-class pattern.
- Using it for numbers/passwords/phones/multiline — wrong component (see table above).

## Verification
🟡 CODE-DERIVED from `falcon-input.component.ts` + `falcon-input.tsx`. Sibling routing table cross-checked against `OVERVIEW.md` "When NOT to use it". Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge.
