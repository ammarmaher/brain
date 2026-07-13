# falcon-email-field — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-email-field>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A labeled, bordered single-line field whose distinguishing mark is an **in-field action button on the trailing edge** — labeled "Verify" by default — separated from the typing area by a thin 1px vertical divider, the whole thing inside **one shared outer border** (it reads as a single control, not an input + adjacent button). `[CODE]` `falcon-email-field.tsx:200-215`. Other cues:
- Placeholder defaults to `name@example.com` `[CODE]` `falcon-email-field.tsx:40` — a strong "this is an email" tell.
- Optional **label** with red required `*`; optional **helper** or **error** line below (`role="alert"`).
- Optional leading/trailing **icon slot** (trailing icon hidden when the Verify button is shown).
- Same height / focus-ring / size contract as `<falcon-angular-input>`.
If there is **no** trailing button, it is visually just an input — the button is the recognition signature.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<TextField type="email">` with an `InputProps.endAdornment` `<Button>` | MUI end-adornment button ≈ the verify button; the shared-border look is built-in here |
| PrimeNG | `<input pInputText type="email">` inside a `p-inputgroup` with a trailing `<p-button>` | `p-inputgroup` is the closest analogue to the single-element treatment |
| Ant Design | `<Input type="email" addonAfter={<Button>Verify</Button>} />` or `<Input.Search>` shape | `addonAfter` ≈ the trailing button slot |
| Bootstrap | `.input-group` with `<input type="email">` + trailing `.btn` | upgrade target |
| shadcn / Radix | `<Input type="email">` + adjacent `<Button>` (composed by hand) | shadcn has no email-with-action primitive — Falcon's is more specialized |
| plain HTML | `<input type="email">` (+ a separate button) | always replace with this when a verify affordance is wanted |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| an email field with an inline "Verify" / action button | `<falcon-angular-email-field [verifyButton]="true">` | input |
| a plain email field, no action button | `<falcon-angular-input type="email">` is sufficient | email-field (only worth it for the button / email styling) |
| a generic text field | `<falcon-angular-input>` | email-field |
| a password field with a reveal toggle | `<falcon-angular-password>` | email-field |
| a phone number with a country chooser | `<falcon-angular-phone-field>` | email-field |
| an OTP / verification-code entry | `<falcon-angular-otp>` / `<falcon-angular-otp-send-dialog>` | email-field (it only *triggers* the send) |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory` — inputs → templates → slots → variants → token override → upgrade → wrapper):
1. **Inputs** — `[label]`, `[placeholder]`, `[(ngModel)]`/CVA, `[required]`, `[helperText]`, `[errorMessage]`, `size`, `state`.
2. **Verify affordance** — `[verifyButton]="true"`, `[verifyLabel]="'Verify'"`, and `[verifyDisabled]` synced to form validity; handle `(falcon-verify)` to launch the challenge.
3. **Slots** — `slot="icon-left"` (set `[iconLeft]`) for a leading mail glyph; `slot="icon-right"` (set `[iconRight]`) for the no-verify case (suppressed when `verifyButton` is on). `[verifyIcon]="true"` adds the circular-arrows glyph inside the Verify button (`-tw` path only).
4. **Validation** — pair the form control with `Validators.email` + `Validators.required`; the component renders the error you pass, it does not compute it. Bind `(blur)` so touched updates (native blur doesn't bubble).
5. **Tokens** — restyle via `email-field.tokens.css` `--falcon-email-field-*` (verify-button colors, 1px divider) — never hardcode.
6. **Upgrade** — a built-in `verified`/`verifying` state (G2), Shadow-path `verifyIcon` parity (G1), a verify-button `aria-label` (G3), or variant/appearance (G6) are GAPs — raise, do not hand-roll a checkmark overlay.

## Anti-patterns
- Placing a separate `<falcon-angular-button>` next to a plain input to fake the verify look — use `verifyButton` so the shared border and divider are correct.
- Expecting the component to verify the email — it only emits `falcon-verify`; the challenge is the consumer's.
- Expecting a "verified ✓" badge to appear automatically — no `verified` state exists yet.
- Binding `[disabled]` as a template input — it does not exist; disable via the form control. `verifyDisabled` is the only button-level gate.
- Using it for OTP entry, passwords, or phone numbers — wrong component (see table).

## Verification
🟢 code-verified (2026-06-03) from `falcon-email-field.tsx` + `falcon-email-field-tw.tsx` render trees. Cross-library map 🔴 INFERRED from each library's public API. Single-element-look + verify-suppress-on-disabled + no-verified-state + icon slots ✅ VERIFIED against source.
