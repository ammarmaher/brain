# falcon-otp — OVERVIEW

## Component purpose

One-time-passcode (OTP) entry rendered as **N separate single-character boxes** (default 6), one native `<input maxLength=1>` per box. Owns the full segmented-code UX: auto-advance on type, backspace-retreat (clear-current then retreat), Delete, Arrow/Home/End navigation, **paste-fill** (clipboard + multi-char input / IME / autofill), per-box pattern filtering, optional masking (`type="password"`), OS SMS auto-fill (`autocomplete="one-time-code"` on box 0), and edge-triggered completion. It is a **full ControlValueAccessor** Angular control (`[(ngModel)]` / `formControlName`) over the assembled code string. Validation of *correctness* is deferred to the backend (`[CODE]` falcon-otp.component.ts:43, falcon-otp.tsx:1-3).

## Business / UI use case

- Login OTP / 2FA possession-factor entry after password.
- Forgot-password recovery-code verification.
- Email / phone verification inside the OTP-send dialog.
- Account-owner / step-up verification in the Add Client wizard (via the send dialog).

## When to use it / when NOT to use it

**Use it for:** any N-digit (or N-char) code entry where each character sits in its own box and the cursor auto-advances.

**Do NOT use it for:**
- A masked secret with a reveal eye → `<falcon-angular-password>`.
- A long numeric value in one field → `<falcon-angular-input-number>`.
- Free text → `<falcon-angular-input>`.
- A pattern-lock / grid PIN → not a Falcon component.

## Status

**ACTIVE / PREFERRED.** Replaces PrimeNG `<p-inputOtp>` and hand-rolled rows of `maxlength=1` inputs. Live in the auth flows.

## Replaces

- `[INFERRED]` PrimeNG `<p-inputOtp>` and bespoke focus-jumping `<input maxlength="1">` rows.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-otp/falcon-otp.component.ts` (CVA) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-otp/falcon-otp.component.html` (pure tag-switcher) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-otp/falcon-otp.component.css` (layout-only: `:host{display:block;width:100%}` + inner block). |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-otp/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-otp/falcon-otp.tsx` |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-otp/falcon-otp.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-otp-tw/falcon-otp-tw.tsx` (1:1 behavioral mirror) |
| Types | `libs/falcon-ui-core/src/components/falcon-otp/falcon-otp.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-otp/falcon-otp.utils.ts` (valueToBoxes / boxesToValue / isComplete / compilePattern / filterByPattern / buildBoxClasses / isFieldInError) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/otp-tailwind-classes.ts` (8 class-builders consumed by the `-tw` twin) |
| Component token file | `libs/falcon-ui-tokens/src/components/otp.tokens.css` (~156 lines, 14 categories). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-otp` |
| Stencil Shadow tag | `<falcon-otp>` |
| Stencil Light tag | `<falcon-otp-tw>` |

> Note: the wrapper's own source header comment says "(A) Default: renders `<falcon-otp>` (Shadow)" but the code default is `useTailwind = true` (`[CODE]` falcon-otp.component.ts:64) → the DEFAULT path is the Light-DOM `<falcon-otp-tw>`. The header comment is stale (source-comment drift; safe-local).

## Known consumers (grep verified 2026-06-03)

- `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.html:74` — login OTP step (`[ngModel]` + `[length]` + `[state]` + `(ngModelChange)`).
- `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.html` — recovery-code entry.
- `libs/falcon/src/shared-ui/lib/components/otp-dialog/otp-dialog.component.html` — the shared OTP dialog (moved here from the old `apps/host-shell/.../shared-components/otp-dialog/` location).
- `libs/falcon-studio/src/lib/registry/gallery-defaults.ts` — Studio showcase registry entry (not a runtime feature consumer).

## Related components

- **Composed by** the OTP-send dialog (the two-step send-then-enter verify dialog) — `<falcon-angular-otp>` is its step-2 code-entry surface.
- **Siblings:** `<falcon-angular-password>` (masked secret), `<falcon-angular-input-number>` (long numeric), `<falcon-angular-phone-field [verifyButton]>` (phone + SMS trigger).

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI team. Token contract in `libs/falcon-ui-tokens` (a full 14-category `--falcon-otp-*` set, all colours aliased to real `--color-falcon-*` families).

## Verification
🟢 code-verified against `falcon-otp.component.ts/.html/.css`, `falcon-otp.tsx`, `falcon-otp-tw.tsx`, `falcon-otp.utils.ts`, `falcon-otp.types.ts`, `otp.tokens.css` (read 2026-06-03). Consumer list 🟢 grep-verified + cited. Stale source-comment re default render path ✅ noted.
