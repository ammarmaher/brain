---
type: moc
cluster: 40-Authority
title: Error Catalog — ~130 FalconKeys.Error.* codes
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\13-error-catalog\
verified-at: 2026-05-16
purpose: "Answers 'which ~130 FalconKeys.Error.* codes exist + their HTTP statuses + 3 standing FE rules + status → UX mapping'. Open when implementing FE error handling for any feature."
---

> [!tldr]
> ~130 error codes across 7 services × 10 HTTP statuses. FE contract: status as primary signal; display `errorMessages[0]`; never parse codes.

# Error Catalog

## The 3 standing rules

1. HTTP status as primary routing signal
2. Display localized `errorMessages[0]`
3. Never parse error codes for UI branching

## Status → UX map

| Status | UX response |
|---|---|
| 400 | Inline field error |
| 401 | Redirect to login |
| 403 | Toast |
| 409 | Inline field error (duplicate) |
| 422 | Inline message or toast |
| 423 | Full-screen lockout |
| 429 | Disable resend + countdown |

## Canonical defensive patterns

- Charging cascade differentiation (4 codes, 4 UX)
- Lockout cascade (IP → eligibility → credentials → OTP)
- Idempotency-as-success (`AlreadyApplied = true` on 200 — NOT error)
- Add Client Step 5 partial-failure (Account persisted before Identity hop)

## Drill into Brain Outputs

- `C:\Falcon\Brain Outputs\datasets\authority-dataset\13-error-catalog\CATALOG.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\13-error-catalog\FE-CONTRACT.md`

## See also
- [[Validation-by-Feature]] · [[Falcon-vs-Client]] · all Capability-* notes
