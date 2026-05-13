# falcon-otp-send-dialog — DECISION

## Brain SK final recommendation

**STATUS: READY for typical OTP flows. NEEDS-UPGRADE for resend cooldown (G4) — very common ask.**

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
- 17 inputs.
- 7 outputs.
- No CVA (not a form control).

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
