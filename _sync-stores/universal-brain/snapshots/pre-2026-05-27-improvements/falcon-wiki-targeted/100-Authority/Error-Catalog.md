---
type: moc
cluster: 100-Authority
title: Error Catalog — ~130 FalconKeys.Error.* codes
projection-source: _mounts/brain-outputs/datasets/authority-dataset/13-error-catalog/
verified-at: 2026-05-16
purpose: "Answers 'which ~130 FalconKeys.Error.* codes exist + their HTTP statuses + 3 standing FE rules + status → UX mapping'. Open when implementing FE error handling for any feature."
---

> [!tldr]
> ~130 error codes catalogued across 7 services (Commerce · Identity · Charging · Provisioning · Contact-Group · Templates · Access/PES) and 10 HTTP statuses. Frontend error contract: HTTP status is the primary routing signal; display `errorMessages[0]`; never parse error codes for UI branching.

# Error Catalog

## The 3 standing FE rules

1. **HTTP status as primary routing signal** (400/401/409/422/423/429)
2. **Display localized `errorMessages[0]`** from `ServiceOperationResult<T>`
3. **Never parse error codes** for branching UI copy — codes are for logging only

## Status → UX response mapping

| Status | What it means | Typical UX |
|---|---|---|
| 400 | Missing/malformed field | Inline field error |
| 401 | Unauthorized | Redirect to login |
| 403 | Forbidden (rare; mostly PES) | Toast |
| 409 | Conflict (duplicate) | Inline field error |
| 422 | Business rule violation | Inline message or toast |
| 423 | User locked | Full-screen lockout page |
| 429 | Rate limit (OTP cooldown / resend) | Disable resend + countdown |

## Defensive coding patterns (canonical)

- **Charging cascade differentiation**: `InsufficientBalance` vs `NoApplicableRate` vs `ReservationNotFound` vs `WalletVersionConflict` — different UX per code
- **Lockout cascade**: IP gate → eligibility → credentials → OTP (each error has its own surface)
- **Idempotency-as-success**: `AlreadyApplied = true` on Charging 200 responses must NOT be treated as error
- **Add Client Step 5 partial-failure**: Account is created **before** Identity hop fires; surface "Account created but Account Owner creation failed — contact support"

## Drill into Brain Outputs

- [Full catalog](../_mounts/brain-outputs/datasets/authority-dataset/13-error-catalog/CATALOG.md) — ~130 codes by status, service, feature, V-rule
- [FE contract](../_mounts/brain-outputs/datasets/authority-dataset/13-error-catalog/FE-CONTRACT.md) — 3 rules expanded + per-feature UX overrides
- [_INDEX](../_mounts/brain-outputs/datasets/authority-dataset/13-error-catalog/_INDEX.md)

## See also

- [[Validation-by-Feature]] — every V-rule lists 2-8 error codes in its backend section
- [[Falcon-vs-Client]] — feature classification
- [[Capability-acc-admin]] · others — what each role would see if an action denies
