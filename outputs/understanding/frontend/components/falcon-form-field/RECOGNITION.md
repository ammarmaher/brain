# falcon-form-field — Recognition Layer

> Cross-cutting layer. Purpose: given an external design / screenshot / React or Angular snippet, identify the right Falcon approach — and note that for new code that approach is usually NOT this component.

> **Recognition caveat.** A design that shows a labeled field with a required-asterisk and an error line does NOT automatically mean `<falcon-form-field>`. New Falcon UI inputs (`<falcon-angular-input>`, `<falcon-angular-dropdown>`, `<falcon-angular-textarea>`) carry built-in `label`/`required`/`helperText`/`errorMessage`. `<falcon-form-field>` is recognized when the design wraps a **non-Falcon control** that lacks built-in label/error, or when reading **legacy wizard code** that already uses it. It is on a deprecation path (`DECISION.md`).

## Visual fingerprint
`[CODE]` `falcon-form-field.component.html`:
A vertical stack (`flex flex-col gap-1.5`): an optional **label row** — a 12 px/medium label with an optional trailing red **asterisk** for required — then the **slotted control** (the actual input/dropdown/editor), then a single **message line** below it: either a red `*error` line (2xs, `text-falcon-red-500`) or, if no error, a muted **hint** line. When `disabled`, the whole stack is dimmed to `opacity-0.65` and `pointer-events-none`. It is a thin labeled-row scaffold — no border, no background of its own; the control inside provides the field chrome.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<FormControl>` + `<FormLabel>` + `<FormHelperText>` (wrapping a control) | direct conceptual 1:1 — MUI `FormControl` is the same "label + control + helper/error" scaffold. |
| PrimeNG | no single equivalent — a `<label>` + control + `<small class="p-error">` row, or the PrimeNG v18 `<p-iftalabel>` / float-label patterns | this wrapper packaged that row before Falcon inputs had built-in labels. |
| Ant Design | `<Form.Item label= required= help=>` | very close 1:1 — `Form.Item` is the label+control+error+required scaffold. |
| Bootstrap | `.mb-3` group: `<label class="form-label">` + control + `.invalid-feedback` | upgrade target. |
| shadcn / Radix | `<FormItem>` + `<FormLabel>` + `<FormControl>` + `<FormMessage>` (react-hook-form `<Form>` primitives) | direct 1:1 — shadcn's `FormItem` stack is exactly this scaffold. |
| plain HTML | `<label>` + `<input>` + `<span class="error">` | the legacy thing this replaced — but for NEW code prefer a Falcon input's built-in label. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a labeled field around a **non-Falcon** control (custom editor, third-party widget) | `<falcon-form-field>` | — |
| a labeled **Falcon UI input** (text, dropdown, textarea, etc.) in NEW code | the Falcon input's built-in `label`/`required`/`errorMessage` | `<falcon-form-field>` |
| an existing legacy wizard field already wrapped in `<falcon-form-field>` | keep `<falcon-form-field>` (maintenance) | a rewrite mid-feature |
| a labeled single-choice picker | `<falcon-angular-dropdown>` (built-in label) | `<falcon-form-field>` + bare select |
| a stepper/wizard step header | `<falcon-angular-stepper>` / `<falcon-angular-wizard>` | this — it is field-scoped, not flow-scoped |
| a whole form section with a heading | a section component / `<falcon-node-details-section>` | this |

## Composition recipe to reach parity
Customization order (per `feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.

1. **First — reconsider the component.** If the design wraps a Falcon UI input, do NOT use `<falcon-form-field>`; set `label`/`required`/`helperText`/`errorMessage` on the Falcon input directly. Only continue this recipe for a non-Falcon control or legacy maintenance.
2. **Inputs** — supply `label` (i18n key), `[required]`, `hint` (i18n key), `[errorKey]` (i18n key) + `[errorParams]` (interpolation map), `[disabled]`, optional `[invalid]` override. All text inputs are translation KEYS — add them to both `en.json` and `ar.json`.
3. **Slot** — project the actual control into the single default `<ng-content>` slot.
4. **State sync** — keep the wrapper and the inner control in sync: `[errorKey]` on the wrapper AND `[state]="error ? 'error' : 'default'"` on the inner control; `[required]` here AND `aria-required` on the control.
5. **Variants** — none; the component has no size/orientation/mode variants.
6. **Token override** — **none, by design**: the component is Tailwind-only (corrected 2026-06-03 — it is NOT SCSS-driven) with no `--falcon-form-field-*` token namespace. Label/hint colors come from the `--text-2` / `--text-muted` theme tokens (`TOKENS.md`). There is no per-instance override pattern; do not attempt one.
7. **Shared upgrade / GAP** — programmatic `for=`/`controlId` label association (G2), a `helperText` alias for `hint` (G6), and ultimately full deprecation in favour of built-in Falcon-input labels (G3) → all documented GAPS. (The old "SCSS→Tailwind migration" gap is RESOLVED — no SCSS exists.) Raise the upgrade; do not patch per-page.

## Anti-patterns
- Using `<falcon-form-field>` to wrap a `<falcon-angular-input>` (or any Falcon UI input) in NEW code — renders a double label; use the input's built-in `label`.
- Passing already-translated strings to `label`/`hint`/`errorKey` — they are i18n keys fed to `TranslatePipe`.
- Relying on the `<label>` being announced for the inner control — there is no `for=` association; set a shared id explicitly.
- Setting `required` on the wrapper but forgetting `aria-required` on the slotted control — the two are not synced.
- Setting `[errorKey]` on the wrapper but leaving the inner control's `state` at `default` — `hasError` does not cross-bind; drive both.
- Adding `--falcon-form-field-*` token overrides — there is no such namespace; the component is Tailwind-only (use the `--text-*` theme tokens at the theme level if needed).
- Treating it as a long-term component — it is LEGACY / NEEDS-DEPRECATION; the strategic direction is to retire it for Falcon-input usages.

> **Verification:** 🟡 CODE-DERIVED from `falcon-form-field.component.ts` + `.html` (read in full, 2026-06-03/B24). Recognition routing (use built-in Falcon-input labels instead, for new code) is the load-bearing call. Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge. Drift corrected: the component is Tailwind-only (no SCSS).
