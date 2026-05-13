# falcon-phone-field — DECISION

## Brain SK final recommendation

**STATUS: READY for typical phone entry. NEEDS-UPGRADE for `verified` state + pluggable validator + virtualized country list (P2 perf).**

## Use this component for

- All phone number entry across consoles.
- Account-owner phone fields.
- Verify-via-OTP flows (`verifyButton=true`).

## Avoid this component for

- Non-phone numeric → input-number.
- Generic text → input.

## Preferred render path

`useTailwind=true`.

## Required upgrades

P1: G1 (validator), G2 (verified state). P2: virtualize country dropdown.

## Relationship

- Sibling family: `<falcon-angular-email-field>`.
- Pairs with `<falcon-angular-otp-send-dialog>` for verify flows.

## Exact rule

1. Phone? → `<falcon-angular-phone-field>` ALWAYS.
2. Pass `country` for sensible default.
3. Filter `countries` list when business rules permit.
4. Validate via Reactive Forms + libphonenumber externally.
5. Bind via CVA.

---

## Dynamic capability assessment

### 1. Static?
- Built-in country list (~250).
- Flag emoji rendering.
- Hardcoded partition divider count (3).

### 2. Dynamic via inputs/outputs?
- 20 inputs.
- 2 outputs (country-change, verify).
- CVA.

### 3. Slots/templates?
- None on wrapper.

### 4. Tokens?
- All input tokens + phone-specific tokens.

### 5. Tailwind?
- 3 passthrough classes.

### 6. Missing for reuse?
- Pluggable validator (G1).
- verified state (G2).
- Method proxies (G3).
- variant / appearance (G4).
- flag image fallback (G8).
- Country list public export (G6).
- Custom search fn (G7).
- Virtualization (Perf).

### 7. Shared?
- Yes.

### 8. Flags?
- `verified`, `verifying`, `validator`, `flagUrl`, `searchFn`, `displayMode`.

### 9. Safest path?
1. Add `verified` + `verifying`.
2. Add pluggable validator.
3. Virtualize country dropdown.
4. Add variant / appearance.
5. Expose country list module.

### 10. Risky?
- Renaming `falcon-country-change` / `falcon-verify` outputs — only add aliases, don't remove.
- Changing default country list — silent breakage if a country is removed.
- Flag emoji vs image — must support both during transition.
