# falcon-otp — DECISION

## Brain SK final recommendation

**STATUS: READY. Use for all N-digit code entry. Add G1 (`falconComplete` event) for auto-submit UX.**

## Use this component for

- 6-digit OTP / 2FA codes.
- 4-digit PINs (mask=true).
- Alpha-numeric short codes (custom `pattern`).

## Avoid this component for

- Password → `<falcon-angular-password>`.
- Long numeric entry → input-number.
- Free-text → input.

## Preferred render path

`useTailwind=true`.

## Required upgrades

P1: G1 (`falconComplete` output).

## Relationship

- Composed by `<falcon-angular-otp-send-dialog>` step 2.

## Exact rule

1. N-digit code? → `<falcon-angular-otp>`.
2. Default `length=6`; tune as needed.
3. Set `mask=true` for PINs.
4. Set `pattern` for non-numeric codes.
5. Bind via CVA; detect completion via length check (until G1 lands).

---

## Dynamic capability assessment

### 1. Static?
- Per-box layout (flex).
- Mask character.
- Box-only rendering (no inline / banner-style alternatives).

### 2. Dynamic via inputs/outputs?
- 16 inputs.
- 0 wrapper outputs (gap — G1).
- CVA.

### 3. Slots/templates?
- None.

### 4. Tokens?
- All visual axes.

### 5. Tailwind?
- 4 passthrough classes.

### 6. Missing for reuse?
- `falconComplete` event (G1).
- Method proxies (G3).
- SMS auto-fill (G4 — Stencil-side).
- Mask character (G6).

### 7. Shared?
- Yes.

### 8. Flags?
- `falconComplete`, `maskCharacter`.
- Method proxies.

### 9. Safest path?
1. Add `falconComplete` (additive).
2. Add `clear()` / `setFocus()` proxies.
3. Verify SMS auto-fill attribute on Stencil.

### 10. Risky?
- Changing default `length` from 6 — silent breakage.
- Adding new pattern semantics — careful with backward compat.
