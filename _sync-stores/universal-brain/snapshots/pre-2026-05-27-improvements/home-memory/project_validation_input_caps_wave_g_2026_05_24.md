---
name: validation-input-caps-wave-g-2026-05-24
description: "Wave G — input-layer digit caps. Price Value 15 digits (CommChannels + Apps), User Limits 3 digits (Settings step + tab). type=text + inputMode=numeric + maxlength hard-blocks the next keystroke."
metadata: 
  node_type: memory
  type: project
  originSessionId: 469a24eb-c3e5-4ebf-baa6-0a8b28d2117b
---

# Wave G — input-layer digit caps (Price Value + User Limits)

🟢 **BROWSER-VERIFIED 2026-05-24** host-shell. FE commit `12d3cb07`, builds green on admin-console + management-console + host-shell. Validation suite 471/471.

## Two related problems, one fix pattern

Ammar 2026-05-24 reported two separate UX issues that share the same root cause:

1. **Price Value (CommChannels + Apps)** — "I can't add more than 10 characters … make sure that I can add more than 15 characters [meaning 15 digits]. After 15 digits, I need to make sure that I cannot add more. Make the input disabled."
2. **Max Allowed in Account Limitations** — "the user just add 3 digit like 558 or 999, 159, 0, 55, 10 but it block him from add the 4 digit it alowas make the max value set when he do that"

Both surfaced the SAME root cause: native `<input type="number">` ignores the HTML `maxlength` attribute, and `<falcon-angular-input-number>` (used on the user-limit fields) silently auto-clamps the value to `max=999` when the user types a 4th digit. Net result: confusing "value jumps to max" UX instead of a hard browser block.

## Fix pattern (applied uniformly)

Switch the field from a numeric input to a text input with numeric keyboard hint:

```html
<!-- Before -->
<falcon-angular-input-number [max]="999" [integer]="true" [ngModel]="..." (valueChange)="..." />

<!-- After -->
<falcon-angular-input
  type="text"
  inputMode="numeric"
  [maxlength]="3"
  [ngModel]="value !== null ? String(value) : ''"
  (ngModelChange)="onChange($event)" />
```

Browser **natively enforces** maxlength on `type=text`. `inputMode="numeric"` keeps the on-screen numeric keyboard on mobile.

Setter strips non-digit chars + truncates to N chars as paste-defence (some browsers ignore maxlength on paste):

```ts
protected onChange(raw: string | number | null): void {
  const digits = String(raw ?? '').replace(/\D/g, '').slice(0, MAX_DIGITS);
  const n = digits === '' ? null : Math.max(0, Math.min(HARD_CAP, Number(digits)));
  this.updateField(n);
}
```

## Validator + constant changes

[CODE] `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts`:
- `PRICE_VALUE_MAX` bumped `999_999_999` → `999_999_999_999_999` (15 nines = 10^15 - 1). Below `Number.MAX_SAFE_INTEGER` (9.007e15) so JS arithmetic stays exact.
- `PRICE_VALUE_MAX_DIGITS = 15` constant.

[CODE] `libs/falcon/src/shared-utils/lib/validations/named-validators.ts`:
- Exported `PRICE_VALUE_MAX_DIGITS = 15`.
- Exported `USER_LIMIT_MAX_DIGITS = 3`.

## Wired sites (5 components)

| Component | Path | Fields capped |
|---|---|---|
| CommChannels step (wizard) | `apps/admin-console/.../client-comm-channels-step` | Price Value (15) |
| Applications step (wizard) | `apps/admin-console/.../client-applications-step` | Price Value (15) |
| Settings step (wizard) | `apps/admin-console/.../client-settings-step` | Max Normal / Max System / Max Node (3 each) |
| Settings tab (admin) | `apps/admin-console/.../tab-components/settings-tab` | Same 3 limits |
| Settings tab (mgmt) | `apps/management-console/.../tab-components/settings-tab` | Same 3 limits |

## Tests

[CODE] `tools/validation-tests/add-client-validations.test.ts` priceValue suite — 100% pass (471/471 Add Client total, +6 cases for the cap bump):

| Input | Was (Wave F cap 999_999_999) | Wave G (cap 999_999_999_999_999) |
|---|---|---|
| `1_000_000_000` | outOfRange | **valid** |
| `99_999_999_999` | outOfRange | **valid** |
| `999_999_999_999_999` | outOfRange | **valid** (exactly new max) |
| `1_000_000_000_000_000` | outOfRange | outOfRange (16-digit overflow) |
| `9_999_999_999_999_999` | outOfRange | outOfRange (far above max) |

## Browser-verified

At host-shell on Add Client → Step 2:
- Max Normal User Limit input renders with `type="text"` + `inputMode="numeric"` + `maxLength="3"`.
- Typing "1234" caps at "123" (browser blocks the 4th keystroke).
- Pasting "99999" truncates to "999" (setter strip + clamp).

## Rules emitted (reusable)

- **`<input type="number">` ignores HTML `maxlength`** — always use `type="text"` + `inputMode="numeric"` when you need a character cap on a numeric field. The `inputMode` attribute keeps the mobile numeric keyboard.
- **`<falcon-angular-input-number>` auto-clamps on overflow** — that's silent UX. Switch to `<falcon-angular-input>` with `maxlength` for hard-block behavior.
- **Two-layer enforcement** is the pattern — browser maxlength for the keystroke block + setter strip+truncate for paste defence + clamp for the numeric upper bound.
- **`PRICE_VALUE_MAX = 999_999_999_999_999`** is below `Number.MAX_SAFE_INTEGER` (9.007e15) — safe for JS Number arithmetic. Going higher would require BigInt.
- **`Math.max(0, Math.min(HARD_CAP, Number(digits)))`** is the canonical setter clamp for these fields. `null` if digits === '' so the "required" rule can still fire.

## Out of scope (deliberate)

- `priceValueValidator` numeric upper bound is now 15 digits, but the **xlsx still says** 999_999_999 (9 digits). The brain's V-rule for `service-visibility-pricing-required` was already silent on the upper cap, so no V-rule contradiction. If the xlsx caps need re-alignment in the next BA pass, a `Wave H` follow-up would be appropriate.
- The xlsx hasn't grown an "input-layer digit cap" column. The 3-digit / 15-digit caps are derived from the existing numeric upper bounds (999 / 999_999_999_999_999 respectively). Self-consistent.

## Brain sync state

- FE branch `polishing-v0.4` — commit `12d3cb07` pushed.
- Brain repos — this topic file + an MEMORY.md index entry + V-rule notes for the two affected rules pending push.

## Related

- Predecessor: [[project_validation_xlsx_sot_flip_wave_f_2026_05_24]] — Wave F set `priceValue` integer-only at 999_999_999 cap; Wave G bumped to 999_999_999_999_999 + added the input-layer hard-cap.
- Sister: [[project_validation_whitespace_wave_d_2026_05_24]] (historical), [[project_info_panel_validation_parity_2026_05_21]].
