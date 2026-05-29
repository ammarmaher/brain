# falcon-mobile-number — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify the component to use. **For falcon-mobile-number the answer is almost always: use its successor `<falcon-angular-phone-field>` instead.**

## ⚠ Recognition verdict
`falcon-mobile-number` is a **deprecated old-UI component**, absent from the new codebase. If a design shows an intl-phone field, the component to reach for is **`<falcon-angular-phone-field>`** — see `falcon-phone-field/RECOGNITION.md`. This page exists so an agent encountering legacy old-UI markup recognizes it and knows the migration target.

## Visual fingerprint
`[CODE]` `falcon-mobile-number.component.html:1-32` — A translated label with a `*` required marker, then an `ngx-intl-tel-input` widget: a flag + dial-code dropdown fused to the left of a national-number `<input>`, all inside an error-aware bordered box (`.fpf-phone--error`). An error row with a `pi pi-info-circle` icon below. Visually it is *the same shape* as `<falcon-angular-phone-field>` — flag + dial code + tel input under one border — because the modern component was designed to replace it 1:1.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `mui-tel-input` | flag adornment + intl input — same shape. |
| PrimeNG | `<p-inputgroup>` + dropdown + mask hand-assembly | old UI paired this with PrimeNG `pInputText` styling (`useCustomStyle`). |
| Ant Design | `<Input addonBefore={<Select/>}>` | country addon + input. |
| Bootstrap | `intl-tel-input` plugin | this component **is** `ngx-intl-tel-input` (the Angular binding of that plugin). |
| shadcn / Radix | `react-phone-number-input` | intl phone input. |
| plain HTML | `<input type="tel">` | upgrade target. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| an intl phone field, NEW code | `<falcon-angular-phone-field>` | `<falcon-mobile-number>` (deprecated/absent) |
| an intl phone field in OLD-UI legacy markup | recognize `<falcon-mobile-number>`, plan migration to `<falcon-angular-phone-field>` | leaving it as-is |
| a phone that triggers an OTP | `<falcon-angular-phone-field [verifyButton]>` + `<falcon-angular-otp-send-dialog>` | this component (no verify) |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`) — **all steps target the successor, `<falcon-angular-phone-field>`:**
1. **Inputs** — `[label]` (translated), `[(ngModel)]`/CVA, `country='SA'`, `[required]`.
2. **Country scope** — `[countries]` to restrict the list (the old `preferredCountries` knob has no real equivalent — the modern field shows one searchable list).
3. **Verify** — `[verifyButton]` if the design needs an OTP trigger (the old component had none).
4. **Validation** — Reactive Forms `Validators.required` + a format validator.
5. **Tokens** — `phone-field.tokens.css`.
6. **Migration** — replace the `<falcon-mobile-number>` tag, drop `ngx-intl-tel-input` / `google-libphonenumber`, re-point the CVA binding. The E.164 string contract is compatible, so the form model usually does not change.

## Anti-patterns
- Adding a new `<falcon-mobile-number>` consumer — it is deprecated and not in the new UI.
- Reviving it — that reintroduces banned `ngx-intl-tel-input` + `google-libphonenumber`.
- Copying its `MutationObserver` overflow hack — modern overlays use a body portal; the hack is obsolete.
- Treating it as a "façade over phone-field" — the live source is a standalone `ngx-intl-tel-input` component; it never delegated.

## Verification
🟡 CODE-DERIVED from the `falcon-old-ui-main` worktree. 🔴 Component deprecated/absent in the new UI — recognition resolves to the successor `<falcon-angular-phone-field>`.
