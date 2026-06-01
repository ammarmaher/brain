# Pending Question — `TestingChargingService.GetRequiredRunAsync` throws wrong `FalconKeys.Error` code

**Raised by:** Ammar-Core-Charging (Wave 5c)
**Date:** 2026-05-18
**Severity:** Low — misleading error code, but does not affect functional behavior
**Affected file:** `falcon-core-charging-svc/src/Falcon.Charging.Application/TestingCharging/Services/TestingChargingService.cs`

## Observation

`[CODE] TestingChargingService.cs:507-514`:

```csharp
private async Task<TestingChargeRun> GetRequiredRunAsync(string runId, CancellationToken cancellationToken)
{
    var run = await runRepository.GetByRunIdAsync(runId, cancellationToken);
    if (run is null)
        throw new FalconException(FalconKeys.Error.InvalidChargeRequest);

    return run;
}
```

When a caller requests a `runId` that does not exist (typo, deleted run, expired retention, etc.), the service throws `FalconException(InvalidChargeRequest)`.

`InvalidChargeRequest` is documented in `controllers/WalletController/ERRORS.md` as the error for **shape/schema validation failures on a reserve/debit/transfer request body** (missing fields, invalid currency, etc.). It is semantically the wrong code for "the requested run id does not exist".

Affected callers:
- `GET /api/testing/charging/runs/{runId}` (via `GetRunAsync`)
- `POST /api/testing/charging/whatsapp/batches/{runId}/deliveries` (via `TriggerWhatsappDeliveriesAsync`)

## Why It Matters

1. **FE error classification** — a generic frontend handler that maps `InvalidChargeRequest` → "your request body is malformed" will show the wrong user-facing message ("check your inputs") when the actual problem is "run not found".
2. **Localization** — the En/Ar resource bundle for `InvalidChargeRequest` is about request validation, not lookup failures. The localized string will be inaccurate.
3. **Telemetry** — error-code histograms will show inflated `InvalidChargeRequest` counts in dev/QA, masking real request-validation issues.

## Recommended Fix

Either:

**Option A — Reuse the existing `ReservationNotFound` code** (closest semantic match — both errors mean "a record with the supplied id does not exist"):

```csharp
if (run is null)
    throw new FalconException(FalconKeys.Error.ReservationNotFound);
```

Light reuse — but slightly misleading because the missing record is a run, not a reservation.

**Option B — Add a new `RunNotFound` code** to `FalconKeys.Error` with proper En/Ar resources:

```csharp
if (run is null)
    throw new FalconException(FalconKeys.Error.RunNotFound);
```

Cleaner, but requires:
- Add `RunNotFound` constant to `Falcon.Charging.Domain/Constants/FalconKeys.cs`
- Add En + Ar resource strings (otherwise `ValidateErrrosResourceCompleteness()` fails on startup)
- Update `controllers/TestingChargingController/ERRORS.md` to reference the new code

## Questions for Operator

1. **Which option do you prefer — reuse `ReservationNotFound` (Option A, cheap) or add `RunNotFound` (Option B, correct)?**
2. **Should we audit the rest of `TestingChargingService` for similar code misuse?** Quick grep shows two more throws of `InvalidChargeRequest` (lines 228 and 511) — line 228 is correct (validating request fields), line 511 is the bug above.

## Recommendation

Option B (new `RunNotFound` code). The lab is the only consumer that creates runs; the code will not pollute the broader API. Three-file change:

1. Add constant + resources to `FalconKeys`
2. Replace the throw at line 511
3. Update the dossier `controllers/TestingChargingController/ERRORS.md` table

## Related Files

- `controllers/TestingChargingController/OVERVIEW.md` finding #6
- `controllers/TestingChargingController/VALIDATIONS.md` Service-Level Validation (`TriggerWhatsappDeliveries`)
- `controllers/TestingChargingController/ERRORS.md` `GetRun` table
