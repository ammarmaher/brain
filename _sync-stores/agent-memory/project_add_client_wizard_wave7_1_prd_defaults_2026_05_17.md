---
name: Add Client wizard Wave 7.1 PRD defaults
description: Partial revert of Wave 7's null-everywhere defaults — restored 5 PRD-mandated slots in Add Client wizard. Step 2 Password Security = 'normal' (BR-AM-09), Step 2 maxNormal/maxSystem/maxNode = 0 (BR-AM-11 zero-means-no-limit), Step 5 ownerRole = 'Account Owner' (BR-AM-19 invariant role).
type: project
originSessionId: 5e50e62a-ea70-4b24-8f40-e472b0122d46
---
# Add Client Wizard — Wave 7.1 PRD Defaults Restored (2026-05-17)

🟢 **LANDED 2026-05-17.** `nx build admin-console` GREEN `c0b3e3e64f18665a` / 21.09s.

## What changed

Wave 7 (Agent K) over-corrected by nulling EVERY scalar slot in the wizard, including 5 slots whose defaults are NOT arbitrary biases but CANONICAL PRD-defined values. Wave 7.1 partial-reverts only those 5 slots; Step 1 text/dropdown fields and Step 5 personal fields keep their Wave 7 null defaults.

### Files touched

1. **`models/models.ts`** — header doctrine + 2 factory updates:
   - `emptyClientSettings()`: `security: 'normal'` (BR-AM-09), `maxNormal/maxSystem/maxNode: 0` (BR-AM-11)
   - `emptyClientAccountOwner()`: `ownerRole: 'Account Owner'` (BR-AM-19)
2. **`client-settings-step/signals/client-settings-step.signals.ts`** — initial `valid: signal<boolean>(true)` (was `false`). With BR-mandated defaults, every Step 2 validator passes on first paint so Next is immediately clickable for common-case onboarding.

### What stays null

- All Step 1 text/dropdown fields (Account Name, Classification, Authority, Country/City, address, FinanceId, VAT, etc.)
- Step 5 personal fields (First/Last/Username/NID/Phone/Email/Photo)
- `Sector` is still computed from Authority Letter Type via `onAuthorityChange` (not stored as a default — it's derived)
- `ownerPwd` populated by eager `generatePassword()` effect on wizard mount (per BR-UM-15)

## Why each restored default

| Slot | Default | PRD/BR citation |
|---|---|---|
| `security` | `'normal'` | BR-AM-09 — mandatory account-level field; PRD silent on tier default; Normal is friction-light common case |
| `maxNormal` | `0` | BR-AM-11 — `0 = no limit` is canonical value, NOT "unset" |
| `maxSystem` | `0` | BR-AM-11 |
| `maxNode` | `0` | BR-AM-11 |
| `ownerRole` | `'Account Owner'` | BR-AM-19 — Step 5 creates AO; role is INVARIANT for this flow; dropdown is disabled in the template |

## UX consequence

- Step 2 Password Security card group shows Normal pre-selected (was: nothing selected, forcing operator pick before Next)
- Step 2 Max user/node limits show `0` (was: empty fields, forcing operator to type `0` three times for the common case)
- Step 5 Role dropdown shows "Account Owner" label (was: blank disabled dropdown — looked broken)
- Step 2 starts `valid: true` → Next button immediately clickable

## Defensive wire-builder fallbacks unchanged

`wire-builders.ts` still coalesces `null → Normal / 0 / AccountOwner` defensively for required slots. With Wave 7.1 these fallbacks rarely fire in normal flow but stay as a safety net for out-of-band programmatic submits.

## Trigger to revisit

- `Add Client default values` → loads this memory
- `Wave 7.1 fix` → loads this memory
- If user reports "Step 2 Next won't click on first open" or "Account Owner role blank" — this fix is the answer
