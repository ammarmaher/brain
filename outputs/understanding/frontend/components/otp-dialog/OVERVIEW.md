# otp-dialog — OVERVIEW

> **Single-render Angular shared-ui component** (`libs/falcon/src/shared-ui`), NOT a dual-render Stencil component. There is **no Shadow/`-tw` twin, no Tailwind-helper, and no component token file** — it is a fully Angular-rendered modal that COMPOSES the dual-render `<falcon-angular-otp>` primitive inside a native `<dialog>` top-layer. Rubric dimensions **B (Stencil dual-render)** and **E (cross-framework parity)** are **N/A** and marked so. ⚠️ Unlike its sibling B27 unit `falcon-error-dialog-host`, this component carries an inline `<style>` block + many literal `px`/`rgba` values — a deliberate exception documented in `TOKENS.md`/`GAPS_AND_UPGRADES.md`.

## Component purpose

Self-contained **phone/email OTP verification modal**. The host passes the field being verified + the contact value; the dialog runs the entire send → input → verify → success lifecycle (with resend + countdown + expiry), reaching the real backend ONLY through the injected `OTP_GATEWAY` port. It opens itself **only after a successful send** with a usable code length, and emits `verified` / `cancelled` / `failed` back to the host. `[CODE]` otp-dialog.component.ts:1-18, 36-52.

It is a **state machine** over `OtpScreenState` (Sending → Input → Verifying → Success, with Error / Expired branches), wrapped in a native `<dialog>` driven by the `[falconOverlay]` directive for true top-layer rendering. `[CODE]` ts:72 + html:29-39.

## Business / UI use case

- **Self-service contact-change verification** on the User Details / "My Profile" page: when a user edits their own email or phone, this dialog verifies the NEW value via `POST /user/me/verify-{email|phone}` before the change can be saved. `[CODE]` user-details-page.component.html:679-684 + profile-otp.service.ts:1-13.
- The verify-* endpoints all route through the **Identity Gateway** (`Gateway.IdentityGateway`). `[CODE]` profile-otp.service.ts:31.
- The host (`user-details-page`) gates "Save" on prior verification of the changed field (the `verificationRequired` / `saveBlockedHint` copy lives in `hierarchy.otp.*`). `[CODE]` en.json:1130-1131 (sibling `hierarchy.otp` block at 1113).

## When to use it / when NOT to use it

**Use it for:**
- Verifying a **changed email or phone on the current user's own profile** (the `/user/me/verify-*` flow). It is wired to that exact 3-endpoint port.

**Do NOT use it for:**
- A **generic N-digit code input** with no send/verify lifecycle → use the primitive `<falcon-angular-otp>` directly (it composes that).
- A **channel-picker → send → verify composer** (choose email/SMS/both, then enter the code) for the Add-User / contact-verify wizard → that is the SEPARATE Stencil dual-render `<falcon-angular-otp-send-dialog>` (composes `<falcon-dialog>` + `<falcon-radio>` + `<falcon-otp>` + `<falcon-button>`; emits `falcon-send`/`falcon-verify`/`falcon-resend`). `[CODE]` shared-ui/index.ts:351-364. **These two are NOT the same component** — see "Related components".
- Login / forgot-password OTP — that flow uses its own `auth.otp.*` copy (en.json:1169) and screens, not this profile-change dialog.

## Status

**ACTIVE / IN-USE, but a deprecation/consolidation candidate.** `[CODE]` Rebuilt Wave 13k (2026-05-15) as a fully Angular-rendered modal; real OTP integration Wave (2026-05-18) via `OTP_GATEWAY`; Phase A / Wave 3.5 (2026-05-21) migrated to `[falconOverlay]`; auto-open fix (2026-05-24). It is the LEGACY hand-built profile OTP modal — it predates the Falcon-component-first doctrine and carries native HTML + inline `<style>` + literal px (it is a Falcon-token-rule VIOLATOR, like `new-wallet-balance`). It has exactly **1 render consumer**. See `GAPS_AND_UPGRADES.md` "Deletion/consolidation candidate" — the migration target is to rebuild its chrome on `<falcon-angular-dialog>` (or `<falcon-angular-otp-send-dialog>` for the composer case) so it stops re-implementing dialog + token styling by hand.

## Replaces

- `[CODE]` An in-memory `OtpMockService` (replaced 2026-05-18 by the `@falcon/sdk OTP_GATEWAY` port). ts:5.
- The flow logic was ported from PR branch `feature/120380-edit-user-v2-verify-new-contact` (LOGIC only — Falcon markup). `[CODE]` ts:7.

## Source file paths

| Layer | Path |
|---|---|
| Angular component TS | `libs/falcon/src/shared-ui/lib/components/otp-dialog/otp-dialog.component.ts` (440 ln) |
| Angular component HTML | `libs/falcon/src/shared-ui/lib/components/otp-dialog/otp-dialog.component.html` (239 ln; includes an inline `<style>` block, html:41-90) |
| Component CSS | **NONE** — no `.component.css`; styling is an inline `<style>` block in the template + Tailwind utilities + many literal `px`/`rgba` inline `style=` attributes (see GAPS). |
| Barrel | `libs/falcon/src/shared-ui/lib/components/otp-dialog/index.ts` (3 ln) |
| Library re-export | `libs/falcon/src/shared-ui/index.ts:400-404` (`export * from './lib/components/otp-dialog'`) |
| Gateway port (interface) | `libs/sdk/src/types/otp-gateway.interface.ts` (`OtpGateway`, `OtpField`, `OTP_GATEWAY` token) |
| Wire DTOs | `libs/sdk/src/types/otp.dtos.ts` (`VerificationCodeResponse`, `VerifyEmailRequest`, `VerifyPhoneRequest`, `ConfirmOtpRequest`) |
| Host-app gateway impl | `apps/host-shell/src/app/core/user/profile-otp.service.ts` (`ProfileOtpService implements OtpGateway`) |
| Token-source enums | `libs/falcon/src/shared-types/lib/enums/otp.enums.ts` (`OtpScreenState`, `VerifiableField`, `OTP_DEFAULTS`) |
| Composed primitive | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-otp/...` (`<falcon-angular-otp>`) |
| Overlay directive | `libs/falcon-ui-core/.../angular-wrapper` `FalconOverlayDirective` (`[falconOverlay]`) |
| Render consumer | `libs/falcon/src/shared-features/user-details/components/user-details-page.component.{ts,html}` |
| Token-binding (DI) | `apps/host-shell/src/app/app.config.ts:111-113` (`{ provide: OTP_GATEWAY, useExisting: ProfileOtpService }`) |
| Stencil Shadow / Light twin | **N/A** — single-render Angular component; no `.tsx`. |
| Token file | **N/A** — no `otp-dialog.tokens.css`. |
| Spec/tests | **NONE found** `[CODE]` (no `*.spec.ts` under the slug; GAP). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `app-otp-dialog` `[CODE]` ts:30 |
| Host display | `host: { class: 'contents' }` (display:contents — wizard expectation) `[CODE]` ts:34, 12 |
| Dialog data hook | `data-component="app-otp-dialog"` (backdrop/box CSS target) `[CODE]` html:37/80/85 |
| Stencil tag | **N/A** |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<app-otp-dialog>` / `OtpDialogComponent` renders in exactly **1 file**:

- `libs/falcon/src/shared-features/user-details/components/user-details-page.component.html:679` — `<app-otp-dialog [(open)]="state.otpOpen" [field]="state.otpField()" [fieldValue]="state.otpRecipient()" (verified)="onOtpVerified()" (failed)="onOtpFailed($event)" />` (imported at `.component.ts:44/108`).

The user-details page is shared and embedded by BOTH consoles' user-details routes + the host-shell `/profile` self route (`[MEMORY]` edit-user-by-status), so the single component reaches both Falcon admin and Client user types through that one host. The `state.otpField` type-source also references `<app-otp-dialog>` `[CODE]` user-details/signals/signals.ts:480.

## Related components

- **Composes:** `<falcon-angular-otp>` (the N-box OTP input primitive). `[CODE]` ts:23 + html:165-171.
- **Uses:** `FalconOverlayDirective` (`[falconOverlay]="modal"`) for native-`<dialog>` top-layer lifecycle. `[CODE]` ts:24 + html:31.
- **Sibling, NOT a replacement — `<falcon-angular-otp-send-dialog>`** (Stencil dual-render composer: channel radio → OTP boxes, for the Add-User verify flow). It exists in `@falcon/ui-core/angular` but has **0 app consumers** today `[CODE]` (grep `falcon-angular-otp-send-dialog` across `apps/` = none). `otp-dialog` and `falcon-otp-send-dialog` solve DIFFERENT problems: this is the self-service `/user/me` change-verify modal (no channel picker); the send-dialog is the pick-a-channel composer. Neither supersedes the other yet.
- **Backend port:** `OTP_GATEWAY` (interface in `libs/sdk`) implemented by host-shell `ProfileOtpService`.

## Ownership / responsibility

`libs/falcon` shared-ui (the presentational modal) + `libs/sdk` (the `OtpGateway` port + DTOs) + host-shell (the `ProfileOtpService` concrete impl bound to `OTP_GATEWAY`). The composed OTP-input primitive + overlay directive are owned by `libs/falcon-ui-core`. Enums in `libs/falcon` shared-types.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B27 sweep, NEW dossier). All facts read from live source: component ts (440 ln) + html (239 ln) + index, OTP_GATEWAY interface + otp.dtos, profile-otp.service, otp.enums, app.config.ts:111-113, user-details-page.component.html:679, en.json `hierarchy.otp.*` (1899-1917). Single-render Angular (no `.tsx`/token file). `falcon-angular-otp-send-dialog` = 0 app consumers (sibling, not superseder). Render consumer = 1.
