# otp-dialog — DECISION

## Brain SK final recommendation

**STATUS: IN-USE / KEEP-FOR-NOW, but FLAGGED for consolidation.** It is the only profile-change OTP modal and is actively used (1 host → both consoles + self route), with sound logic (gateway-port decoupling, signal-first zoneless state machine, proper teardown, regression-hardened open-guard + watchdog). **But** its chrome is a hand-built native `<dialog>` with an inline `<style>` block + literal px/rgba — a Falcon token-rule / component-first violation (like `new-wallet-balance`). **Use it as-is for the existing profile flow; do NOT copy its styling; queue the consolidation onto `<falcon-angular-dialog>` for human approval.**

## Use this component for

- Verifying a **changed email or phone on the current user's own profile** (`/user/me/verify-*`), with send → input → auto-verify → success and resend-on-expiry, fully wired to the `OTP_GATEWAY` port.

## Avoid this component for

- A bare N-digit code input → `<falcon-angular-otp>` (the primitive it composes).
- A pick-a-channel composer (email/SMS/both → code) → `<falcon-angular-otp-send-dialog>` (Stencil composer; needs gateway wiring; 0 consumers today).
- A generic confirm/acknowledge modal → `<falcon-angular-dialog>` / `<falcon-angular-popup>`.
- Login / forgot-password OTP → the auth flow's own screens (`auth.otp.*`).

## Preferred variant / render path

**N/A** — single-render Angular component (no Shadow/`-tw`/`useTailwind`). It composes `<falcon-angular-otp size="lg">` and runs the `<dialog>` via `[falconOverlay]="modal"`.

## Required upgrades before wider use

- **Before reusing in a NEW flow:** none functionally — bind `OTP_GATEWAY` and go. But DO NOT treat its styling as the template (it's a token-rule exception).
- **Before it can be called "Falcon-standard":** the chrome consolidation onto `<falcon-angular-dialog>` + tokenization (GAP G-TOKENS/G1) — HIGH-RISK-QUEUE.

## Relationship to other components

- **Composes:** `<falcon-angular-otp>` (the N-box input primitive).
- **Uses:** `FalconOverlayDirective` (`[falconOverlay]`) for native-`<dialog>` top-layer lifecycle.
- **Backend port:** `OTP_GATEWAY` (interface in `libs/sdk`) ← `ProfileOtpService` (host-shell).
- **Sibling (NOT a replacement):** `<falcon-angular-otp-send-dialog>` — channel-picker composer, unused, no gateway wiring. **Decision pending:** consolidate the profile flow onto it (wiring it to `OTP_GATEWAY`) OR delete the unused sibling and keep otp-dialog as canonical after a chrome migration.
- **Consolidation target:** `<falcon-angular-dialog>` (for the shell chrome).

## Exact rule for future implementation tasks

1. **Verifying a changed own-profile email/phone?** Use `<app-otp-dialog>` with `[(open)]` + `[field]` + `[fieldValue]`, handle `(verified)`/`(failed)`.
2. **Provide `OTP_GATEWAY`** in the host app (implement the 3-method `OtpGateway` against your Identity verify-* endpoints).
3. **Set `open` false→true to start** (positive-edge); send the DRAFT value in `fieldValue`.
4. **Do NOT read the code** — only the `verified` event; the BE owns the verified state.
5. **Do NOT replicate** the inline-`<style>` / literal-px chrome in new components — use `<falcon-angular-dialog>` + tokens.
6. **Need a channel picker?** That's `<falcon-angular-otp-send-dialog>`, not this.
7. **Any chrome change** must preserve the `@if (modalVisible())` gate + `[open]`-scoped `display:flex` + `[falconOverlay]` (they fix the documented auto-open / RTL-top-right / stuck-spinner regressions).

---

## Dynamic capability assessment

### 1. What is static today?

- The entire chrome geometry (750px card, paddings, font sizes, accent stripe, close-X position) — literal inline `style=`. `[CODE]` html:96-215.
- The backdrop color `rgba(13,63,68,0.55)` + box-shadow — literal. `[CODE]` html:80/96.
- The OTP-box `scale(1.5)` transform. `[CODE]` html:88.
- The composed OTP size (`lg`) + the 200ms auto-verify / 900ms success / 12s watchdog timings + `OTP_DEFAULTS` (6 / 120s).
- The state-driven body layout (Sending/Success/Input/Error/Expired) — fixed, no template input.

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **Inputs (signal):** `model.required(open)`, `input(field)`, `input(fieldValue)`, `input(length)`. **Outputs (signal):** `output(verified)`, `output(cancelled)`, `output(failed:string)`. ts:37-52.
- BE-driven dynamics: `otpCodeLength` → box count, `otpExpiresInSeconds` → countdown — both override the client fallbacks at runtime. ts:242-247.
- Channel-aware intro copy (`introPhone`/`introEmail`) + title via signals. ts:94-97.

### 3. What is already dynamic through slots / ng-template?

- **None.** No `ng-content` / `ng-template`. Fully self-contained body.

### 4. What is dynamic through token/theme overrides?

- **Very little** (the core gap). Only the Falcon-utility colors (`text-falcon-*`, `bg-falcon-*`) + the two ring `<circle>` stroke `var(--color-falcon-*, fallback)` respond to theme. The geometry + backdrop are literal and NOT overridable. The composed `<falcon-angular-otp>` carries its own `--falcon-otp-*`.

### 5. What is dynamic through Tailwind classes?

- The component uses Falcon utilities internally, but exposes NO `class`/`wrapperClass` passthrough to consumers (it's a modal, not a placed control). Consumers cannot restyle it.

### 6. What is missing to make this component reusable across pages?

- Tokenized chrome (`--falcon-otp-dialog-*`) instead of literals (G-TOKENS).
- Reuse of `<falcon-angular-dialog>` for the shell (G1).
- `aria-live` on status/error (A1).
- Spec coverage (G5).
- Falcon buttons for close/resend (G2).

### 7. What capability should be added to shared component (not page hack)?

- The whole component IS shared (`libs/falcon`). The needed work is internal: tokenize + consolidate onto `<falcon-angular-dialog>`, add specs, add `aria-live`.

### 8. What flags / options / templates / slots would make it better?

- A `[size]` / `[cardWidth]` token (post-tokenization) so the modal can shrink for narrow contexts.
- An optional `bodyTemplate` slot for callers that need extra copy (probably unnecessary).
- A documented resend-cap (or confirm the BE owns it).

### 9. What is the safest upgrade path?

1. **Phase A (test, zero render risk):** add `otp-dialog.component.spec.ts` + `profile-otp.service.spec.ts` to LOCK current behavior (send-on-edge, modal-on-success-only, zeroLength/watchdog branches, auto-verify) — a safety net BEFORE any chrome change.
2. **Phase B (a11y, low risk):** wrap status/error messages in `aria-live`.
3. **Phase C (HIGH-RISK-QUEUE):** rebuild chrome on `<falcon-angular-dialog>`, move geometry to `--falcon-otp-dialog-*` tokens, tokenize the backdrop. PRESERVE the open-gate + overlay guards. Browser-re-verify both consoles + `/profile`, light + dark + RTL.
4. **Phase D (decision):** reconcile vs `<falcon-angular-otp-send-dialog>` — either wire it to `OTP_GATEWAY` + migrate, or delete it as unused.

### 10. What is risky to change because other pages depend on it?

- The `@if (modalVisible())` gate + `[open]`-scoped `display:flex` + `[falconOverlay]` lifecycle — these fix documented regressions (auto-open, RTL-top-right, stuck-spinner). Any chrome rewrite MUST preserve them. `[CODE]` html:11-79.
- The positive-edge `wasOpen` guard — removing it reintroduces auto-open-on-load + input-wipe. `[CODE]` ts:131-146.
- The `OTP_GATEWAY` contract (3 methods, `ServiceOperationResult<VerificationCodeResponse>`/`<boolean>`) — `ProfileOtpService` + the dialog both depend on the exact shape. `[CODE]` otp-gateway.interface.ts:15-32.
- The `verified`/`failed`/`cancelled` event contract — the user-details host binds `(verified)`/`(failed)`; changing them breaks the save-gate. `[CODE]` user-details-page.component.html:683-684.
- The `notShowToaster:'true'` header — removing it makes the global toaster double-fire with the dialog's own error UX. `[CODE]` profile-otp.service.ts:46/62/78.
- The 200ms auto-verify + 900ms success timing — e2e flows may key off them.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27, NEW). Recommendation KEEP-FOR-NOW + consolidation-flagged. Signal-input API, gateway port, OtpScreenState machine, open-guards, watchdog, and the literal-chrome gap all read from live source (ts 440 ln + html 239 ln + profile-otp.service.ts + otp-gateway.interface.ts). 2 HIGH-RISK-QUEUE items (chrome consolidation + send-dialog reconciliation). B/E rubric N/A.
