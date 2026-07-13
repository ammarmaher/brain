# falcon-otp-send-dialog — DECISION

## Brain SK final recommendation

**STATUS: READY for typical OTP flows (default `useTailwind=true`). NEEDS-UPGRADE for resend cooldown (G4 — very common ask) + the partial double-emit guard (G9). NOTE: zero live consumers today — maintained-but-unused.**

## Use this component for

- Verify-identity send-then-verify flows.
- Account-owner verify in wizards.
- 2FA setup.

## Avoid this component for

- Generic dialogs → `<falcon-angular-dialog>` / `<falcon-angular-popup>`.
- Inline OTP only → `<falcon-angular-otp>`.

## Preferred render path

`useTailwind=true`.

## Required upgrades

P1: G4 (resend cooldown).

## Relationship

- Composes dialog + radio + otp + button.

## Exact rule

1. OTP send-verify flow? → `<falcon-angular-otp-send-dialog>`.
2. Two-way bind `open` and `step`.
3. Handle send / verify / resend / cancel in parent.
4. Parent owns API calls + validation.
5. Pre-translate labels.

---

## Dynamic capability assessment

### 1. Static?
- Two-step flow shape (channel → verify).
- Default copy strings.
- No resend cooldown.

### 2. Dynamic via inputs/outputs?
- `[CODE]` **17 inputs** (falcon-otp-send-dialog.component.ts:42-60).
- `[CODE]` **7 outputs** (5 renamed kebab-alias intents + `openChange` + `stepChange`, ts:62-70). `stepChange` is declared but **never emitted** (G10).
- No CVA (it is an orchestrator, not a value control).
- `[CODE]` 3 Stencil `@Method`s (`advanceToCodeStep`/`markVerificationError`/`resetToChannelStep`) — NOT proxied on the wrapper (G1).

### 3. Slots/templates?
- None.

### 4. Tokens?
- Composition tokens + dialog + radio + otp.

### 5. Tailwind?
- Inherits.

### 6. Missing for reuse?
- Resend cooldown (G4).
- Code-expired state (G5).
- Method proxies (G1).
- Translate-key support (G3).
- Help link (G8).

### 7. Shared?
- Yes.

### 8. Flags?
- `resendCooldownSeconds`, `codeExpired`, `helpLink`, `showChannelRecap`.

### 9. Safest path?
1. Add resend cooldown (additive — default 0 = current behavior).
2. Add code-expired state.
3. Add method proxies.

### 10. Risky?
- Changing default copy — silent display break for consumers relying on defaults.
- Step transition timing — visual regressions easy.
- The `falcon-send`/`falcon-verify`/`falcon-resend` event contract — consumers bind these; renaming or changing the detail shape breaks flows. (And the partial double-emit guard, G9, means fixing it could change how many times a host listener fires — coordinate.)
- The Shadow↔`-tw` channel-change wiring (G11) — aligning the two paths changes which click sources fire `falcon-channel-change`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B07). Recommendation: READY (default `-tw`) / NEEDS-UPGRADE for resend cooldown + double-emit guard. 17 inputs / 7 outputs (`stepChange` dead) / 3 un-proxied Stencil methods confirmed. Render-path + event-contract change-risks noted.
