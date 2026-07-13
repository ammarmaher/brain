# falcon-otp-send-dialog — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/otp-send-dialog.tokens.css` (**149 lines** — recount 2026-06-03). **14 documented categories** (`[CODE]` otp-send-dialog.tokens.css:10-25).

`[CODE]` otp-send-dialog.tokens.css:27 — scoped under a single `:where(...)` selector that ALSO covers the composed dialog shell (`falcon-dialog`, `falcon-dialog-tw`, `falcon-angular-dialog`, `.falcon-dialog`, `[data-falcon-dialog]`) so the composer's own tokens cascade through the embedded `<falcon-dialog>`. `:where()` keeps specificity 0 → per-instance overrides win. **gate-12 compliant** (scoped, not `:root`). Most styling delegates to the composed components (dialog / radio / otp / button); this file covers ONLY the composer's specific layout + copy.

## Token categories (14 — verified)

`[CODE]` otp-send-dialog.tokens.css:28-148. All prefixed `--falcon-otp-send-dialog-*`:

1. CONTAINER — `-display`, `-gap` (16px), `-min-height` (280px), `-max-width` (460px).
2. HEADER COPY (subtitle) — `-subtitle-color`, `-subtitle-font-size`, `-subtitle-line-height`, `-subtitle-margin-top/-bottom`, `-subtitle-text-align`.
3. CHANNEL BLOCK — `-channel-block-gap` (10px), `-channel-block-padding`, `-channel-block-margin-bottom`.
4. CHANNEL OPTION (per-row) — `-option-bg`, `-option-bg-hover`, `-option-bg-selected`, `-option-border-width/-style/-color`, `-option-border-color-hover`, `-option-border-color-selected`, `-option-border-radius` (12px), `-option-padding-block/-inline`, `-option-gap`, `-option-cursor`, `-option-sub-text-color/-font-size/-line-height/-margin-top`.
5. TARGET LINES — `-target-color`, `-target-font-size`, `-target-font-weight`, `-target-line-height`, `-target-text-align`, `-target-margin-bottom`.
6. CODE-DESCRIPTION — `-code-description-color/-font-size/-line-height/-text-align/-margin-bottom`, `-code-description-target-color` (teal), `-code-description-target-font-weight`.
7. OTP WRAPPER — `-otp-wrapper-display` (flex), `-otp-wrapper-justify` (center), `-otp-wrapper-margin-block/-bottom`.
8. ACTIONS ROW — `-actions-display` (flex), `-actions-justify`, `-actions-gap`, `-actions-margin-top`, `-actions-flex-direction` (column), `-actions-primary-min-width` (100%), `-actions-cancel-min-width`.
9. RESEND LINK — `-resend-color`, `-resend-color-hover`, `-resend-color-disabled`, `-resend-font-size`, `-resend-font-weight`, `-resend-line-height`, `-resend-gap`, `-resend-margin-top`, `-resend-text-align`.
10. ERROR MESSAGE — `-error-color`, `-error-bg`, `-error-font-size/-weight/-line-height`, `-error-padding-block/-inline`, `-error-border-radius`, `-error-margin-block`, `-error-text-align`.
11. SUCCESS BANNER (optional) — `-success-color/-bg/-font-size/-weight/-line-height/-padding-*/-border-radius/-margin-block/-text-align`. **Declared but not rendered** by either Stencil tag in the inspected source (no success-banner JSX) — provisioned for a future "code sent" affordance.
12. STEP TRANSITION — `-step-transition-duration` (220ms), `-step-transition-easing`, `-step-enter-translate-y` (6px), `-step-enter-opacity` (0).
13. ICON / ILLO — `-icon-size` (18px), `-icon-color`, `-icon-color-selected` (teal).
14. MOTION / DISABLED — `-transition-duration`, `-transition-easing`, `-disabled-opacity` (0.6), `-disabled-cursor`.

> **CORRECTION (2026-06-03):** the prior dossier's token names `--falcon-otp-send-dialog-channel-bg`, `-channel-border-color`, `-channel-bg-hover`, `-channel-bg-selected`, `-channel-border-color-selected` **do not exist**. The per-row tokens are prefixed **`-option-`** (`-option-bg`, `-option-bg-hover`, `-option-bg-selected`, `-option-border-color-selected`). Corrected throughout.

## Related Falcon theme tokens

| Falcon theme token | Used by otp-send-dialog via |
|---|---|
| `--color-falcon-neutral-0 / -50 / -200 / -400` | option bg / hover bg / border / hover border |
| `--color-falcon-teal-25 / -500 / -700` | option selected bg / selected border + resend + icon-selected / resend-hover |
| `--color-falcon-neutral-700 / -900` | subtitle/description/sub-text / target text |
| `--color-falcon-red-500 / -100` | error text / error bg |
| `--color-falcon-green-700 / -100` | success banner (unused) |
| (inherited) `<falcon-dialog>` / `<falcon-radio>` / `<falcon-otp>` / `<falcon-button>` tokens | the composed children own their own surfaces |

## Tailwind utility guidance for this component

`[CODE]` otp-send-dialog-tailwind-classes.ts (18 class-builders, e.g. `falconOtpSendDialogBaseClasses` / `…StepClasses` / `…OptionClasses`) — used by the `-tw` twin; each reads `--falcon-otp-send-dialog-*` via arbitrary-value utilities. There is no path-specific class prop on the wrapper — override via tokens only.

> `[CODE]` otp-send-dialog-tailwind-classes.ts:25 — `falconOtpSendDialogStepClasses()` applies `animate-[falconOtpSendDialogStepIn_var(--falcon-otp-send-dialog-step-transition-duration)_...]`. The `@keyframes falconOtpSendDialogStepIn` is defined ONLY in `falcon-otp-send-dialog.css` (the **Shadow** component's `shadow:true` stylesheet, `[CODE]` :46-53). A Shadow-encapsulated `@keyframes` is NOT visible to light-DOM elements — so the **default `-tw` (Light DOM) twin's step-transition animation likely does not resolve** (the name has no matching keyframe in the document/global scope). The Shadow path animates correctly; the `-tw` path silently skips the enter animation (functional, just no fade/slide). Flag for FINDINGS (`safe-local` — cosmetic).

## Dark mode support

Token-driven (neutrals/teal/red/green aliases flip via the theme dark overrides; the composed dialog/radio/otp inherit their own dark handling). Not re-verified end-to-end this pass.

## Density support

Inherits the embedded `<falcon-dialog>` density. The composer's own metrics (option padding, gaps) are fixed token values, not density-aliased.

## RTL support

Logical properties throughout (`-option-padding-inline`, `-resend-text-align`, `padding-inline`). The composed dialog/radio handle their own RTL. Not re-verified visually this pass.

## Static style risks

- `[CODE]` The `-tw` twin reads tokens via arbitrary-value utilities (token-only); no raw hex inline. The leading channel icons are inline SVGs with `stroke="currentColor"` (token-driven via the icon-color span).
- `[CODE]` Category 11 (SUCCESS BANNER) tokens are dead (no rendering JSX) — harmless, but a token surface with no consumer.
- `[CODE]` The step-transition `@keyframes` is referenced by name but not co-located (see Tailwind guidance) — animation may silently no-op if the keyframe is absent from the global CSS.

## No CSS / no SCSS guidance

- Tailwind utilities only; per-instance overrides MUST mutate `--falcon-otp-send-dialog-*` via a host class. **Never hardcode hex/px.**
- Do not write component CSS to restyle the channel rows — override tokens.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Channel row idle | `--falcon-otp-send-dialog-option-bg`, `-option-border-color` |
| Channel row hover | `--falcon-otp-send-dialog-option-bg-hover`, `-option-border-color-hover` |
| Channel row selected | `--falcon-otp-send-dialog-option-bg-selected`, `-option-border-color-selected`, `-icon-color-selected` |
| Channel sub-text | `--falcon-otp-send-dialog-option-sub-text-color/-font-size` |
| Target line | `--falcon-otp-send-dialog-target-color/-font-weight` |
| Step-2 description | `--falcon-otp-send-dialog-code-description-color`, `-code-description-target-color` |
| OTP wrapper | `--falcon-otp-send-dialog-otp-wrapper-justify/-margin-block` |
| Actions | `--falcon-otp-send-dialog-actions-gap/-flex-direction/-primary-min-width` |
| Resend link | `--falcon-otp-send-dialog-resend-color`, `-resend-color-hover`, `-resend-color-disabled` |
| Error | `--falcon-otp-send-dialog-error-color`, `-error-bg`, `-error-padding-*`, `-error-border-radius` |
| Subtitle | `--falcon-otp-send-dialog-subtitle-color/-font-size` |
| Step transition | `--falcon-otp-send-dialog-step-transition-duration/-easing/-enter-translate-y/-enter-opacity` |
| Disabled | `--falcon-otp-send-dialog-disabled-opacity` (0.6), `-disabled-cursor` |
| Composed children | dialog / radio / otp / button tokens (their own files) |

## Verification
🟢 CODE-VERIFIED 2026-06-03 — token file recounted at 149 lines, 14 categories, `:where()` gate-12 scope (incl. `falcon-dialog*`) confirmed. Corrected the prior wrong `-channel-*` token names to `-option-*`. Flagged the dead SUCCESS-BANNER category (11) + the un-co-located `@keyframes falconOtpSendDialogStepIn`.
