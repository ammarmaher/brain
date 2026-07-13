# otp-dialog — Recognition Layer

> Given a design / requirement for "verify a changed phone/email with a one-time code," identify the right component — and crucially, distinguish `<app-otp-dialog>` (this profile-change modal) from the primitive `<falcon-angular-otp>` and the composer `<falcon-angular-otp-send-dialog>`.

## Visual fingerprint

A large (750px) centered modal over a teal-tinted blurred backdrop, with a thin teal accent stripe at the top, a top-right close X, a big bold title ("OTP Verification" / "Verify Phone Number"), an intro line + the recipient (teal italic bold), then a row of **enlarged OTP boxes** with an optional center dot separator, a **circular countdown ring with the seconds-remaining number inside**, and a **Resend** link that activates only when the code expires. The body morphs by state: a spinner ("Sending verification code…"), a teal check ("Verified successfully"), or the input/error/expired layout.

## Cross-library equivalents

| Library | Their construct | Parity notes |
|---|---|---|
| MUI | `<Dialog>` + a custom OTP `<TextField>` group + `<CircularProgress variant="determinate">` | MUI hand-composes; this bakes the OTP boxes + ring + lifecycle. |
| PrimeNG | `<p-dialog>` + `<p-inputOtp>` + `<p-knob>`/progress | `<p-inputOtp>` ≈ the composed `<falcon-angular-otp>`; the modal + countdown are bespoke here. |
| Ant Design | `<Modal>` + `<Input.OTP>` + `<Progress type="circle">` | Ant's `Input.OTP` + circular Progress map directly to the boxes + ring. |
| Bootstrap | `.modal` + N `<input>` + manual countdown | upgrade target — replace with Falcon. |
| shadcn / Radix | `<Dialog>` + `<InputOTP>` (Radix) + custom timer | shadcn composes 3 primitives + your own send/verify hook. |
| plain HTML | N `<input maxlength=1>` + `setInterval` + `fetch` | always replace — this is exactly the pattern otp-dialog encapsulates. |

## Use THIS vs siblings

| If the requirement is… | Use | Not |
|---|---|---|
| **verify a changed email/phone on the user's OWN profile** (`/user/me`, send→verify→unblock-save) | `<app-otp-dialog>` (this) | the others |
| a **bare N-digit code input** (just the boxes, you own the send/verify) | `<falcon-angular-otp>` (the primitive it composes) | this modal |
| a **pick-a-channel composer** (email / SMS / both → then enter code), e.g. Add-User contact-verify | `<falcon-angular-otp-send-dialog>` (Stencil composer; currently 0 consumers — needs gateway wiring) | this modal |
| a **generic acknowledge/confirm modal** (no OTP) | `<falcon-angular-dialog>` / `<falcon-angular-popup>` | this modal |
| **login / forgot-password OTP** | the auth flow's own OTP screens (`auth.otp.*` copy) | this profile-change modal |

> Key disambiguation: **`<app-otp-dialog>` has NO channel-picker** (the host already knows it's email or phone) and IS fully wired to a backend port (`OTP_GATEWAY`). **`<falcon-angular-otp-send-dialog>` HAS a channel-picker** and emits raw events with NO backend wiring. They are not interchangeable.

## Composition recipe to reach parity

Customization order: inputs → templates → slots → variants → token override → upgrade → wrapper.
1. **Inputs** — `[(open)]`, `[field]` (email|phone), `[fieldValue]` (the draft value), `[length]` (fallback box count). Handle `(verified)` / `(failed)` / `(cancelled)`.
2. **Templates** — none (fixed state-driven body).
3. **Slots** — none.
4. **Variants** — none (state = `OtpScreenState`, not a styling variant).
5. **Token override** — N/A today (geometry is hardcoded — GAP G-TOKENS). Post-consolidation it would expose `--falcon-otp-dialog-*`.
6. **Upgrade** — need it on `<falcon-angular-dialog>` chrome / tokenized / `aria-live`? That's the consolidation (GAP G-TOKENS/G1) — raise it, don't fork.
7. **Wrapper** — provide `OTP_GATEWAY` in the host app; do not wrap the dialog itself.

## Anti-patterns

- **Using it without binding `OTP_GATEWAY`** — crashes at construction. `[CODE]` ts:65.
- **Trying to read the entered code** — only `verified:void` is emitted; the code/verified state is backend-owned. `[CODE]` ts:300-318.
- **Toggling `open` from a recomputing source** — only the false→true EDGE sends; spurious recomputes are guarded but avoid them. `[CODE]` ts:131-146.
- **Passing the OLD/persisted value in `fieldValue`** — send the DRAFT new value; the BE targets the wire value. `[CODE]` ts:228-235.
- **Confusing it with `<falcon-angular-otp-send-dialog>`** — that adds a channel picker + has no gateway wiring.
- **Replicating its inline-`<style>` + literal-px styling** in a new Falcon component — it's a legacy exception (GAP G-TOKENS), not a pattern to copy.
- **Calling `showModal()`/`close()` manually** — `[falconOverlay]` + the `@if (modalVisible())` gate own the lifecycle (the auto-open bug history). `[CODE]` ts:148-151 + html:11-28.
- **Swallowing `(failed)`** — show the i18n-key as a toast or the user sees a silent no-op. `[CODE]` user-details-page.component.ts:409-414.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B27, NEW) from otp-dialog.component.ts/.html + shared-ui/index.ts:332-364 (otp / otp-send-dialog re-exports) + grep (`falcon-angular-otp-send-dialog` = 0 app consumers). Sibling disambiguation cross-checked against the send-dialog's documented "channel radio + emits raw events" surface vs otp-dialog's gateway-wired, channel-less profile flow. Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge.
