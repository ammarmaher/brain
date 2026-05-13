# falcon-email-field — DECISION

## Brain SK final recommendation

**STATUS: READY for verify-button flows. NEEDS-UPGRADE for `verified` state visual.**

## Use this component for

- Email entry requiring a verify-button affordance.
- Account-owner / profile email fields.

## Avoid this component for

- Plain email without verify → `<falcon-angular-input type='email'>` is sufficient.
- Generic text → input.

## Preferred render path

`useTailwind=true`.

## Required upgrades

P1: G2 (`verified` state).

## Relationship

- Sibling: `<falcon-angular-input>`.
- Pairs with `<falcon-angular-otp-send-dialog>` for verify-via-OTP flows.

## Exact rule

1. Email + verify button? → `<falcon-angular-email-field>`.
2. Pair with Reactive Forms `Validators.email`.
3. Sync `verifyDisabled` with form validity.
4. Handle `(falcon-verify)` to trigger send.

---

## Dynamic capability assessment

### 1. Static?
- Single-element border treatment.
- Verify-button label text (consumer sets).
- No verified state visual.

### 2. Dynamic via inputs/outputs?
- 17 inputs.
- 1 output (`falcon-verify`).
- CVA.

### 3. Slots/templates?
- None.

### 4. Tokens?
- All input tokens + verify-button tokens + partition.

### 5. Tailwind?
- 3 passthrough classes.

### 6. Missing for reuse?
- `verified` state (G2).
- Leading icon (G6).
- variant / appearance (G8).
- Method proxies (G7).

### 7. Shared?
- Yes.

### 8. Flags?
- `verified`, `verifying`, `leadingIcon`, `variant`, `appearance`.

### 9. Safest path?
1. Add `verified` + `verifying` inputs.
2. Add leading icon.
3. Add variant / appearance.
4. Add method proxies.

### 10. Risky?
- Verify button position is RTL-sensitive — visual regression risk.
- Single-element border is token-tuned — token changes can desynchronize input + button heights.
