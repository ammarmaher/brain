---
type: pending-question
wave: 5c
controller: LookupController
related-service: falcon-core-charging-svc
status: OPEN
date: 2026-05-18
severity: Medium
module: contract
feature: lookup-seed-data
verification: unverified
last-verified: 2026-05-18
tags: ["#status/open", "#module/contract", "#verification/unverified", "#layer/be"]
up: "[[Q-tickets-MOC]]"
parent: "[[Q-tickets-MOC]]"
tracked-as-task: true
priority: medium
due: 
blocked-on: [seed-data-author]
---

# Pending Question — Charging LookupController has empty seed data

**Raised by:** Ammar-Core-Charging (Wave 5c)
**Date:** 2026-05-18
**Severity:** Medium — endpoint is live but returns no data
**Affected controller:** `falcon-core-charging-svc/src/Falcon.Charging.Api/Controllers/LookupController.cs`

## Observation

`[CODE] falcon-core-charging-svc/src/Falcon.Charging.Infrastructure/Seeding/LookupSeedData.cs:7-16`:

```csharp
public static List<Lookup> GetLookups() => new() { };

public static List<LookupValue> GetLookupValues()
{
    var lookupValues = new List<LookupValue>();
    return lookupValues;
}
```

Both seed methods return empty lists. The `LookupController.Get(id, name, code)` endpoint queries `IRepository<LookupValue>` — with no data in the collection, **every call returns `200 OK` with an empty `result` array**.

The endpoint is otherwise fully wired:
- `LookupController.cs` (35 lines)
- `IListLookupHandler` / `ListLookupHandler.cs` (44 lines)
- `ListLookupQuery.cs` (3 lines)
- `Hook<LookupValueResponse>` mapping in `Mapping.cs:13-18`
- `Lookup` and `LookupValue` domain entities + Mongo schema

So the infrastructure exists, but no constants have been registered.

## Questions for Operator

1. **Is the Charging Lookup table intended to remain empty?** If yes, the controller is dead code — should it be removed from the API surface to reduce attack-surface confusion?
2. **If lookups will be added later, which ones?** Candidates from the domain code:
   - Bucket statuses (`Active`, `Expired`, `Reserved`, `Exhausted`)
   - Bucket types (`ContractFunded`, `Quota`)
   - Reservation statuses (`Active`, `Committed`, `Released`, `Expired`)
   - Currency labels (`SAR`, `USD`, …) — though `eCurrency` is already an enum, may duplicate
   - Ledger types (`Reserve`, `Commit`, `Release`, `Debit`, `Credit`)
   - Policy codes (`WA_DELIVERY_COMMIT`, …)
3. **Should the FE rely on Charging's `/Lookup/{id}` or Commerce's `/Lookup/{id}` for shared constants?** The two services have identical contract shapes, but Commerce ships with seeded data. Duplicating constants in both services creates drift risk.

## Recommendation

Either:
- **Remove** `LookupController` from `falcon-core-charging-svc` if Charging-owned constants are not needed.
- **Seed** the lookups the FE is expected to bind to, and document each `LookupId` in this dossier so the FE doesn't guess.

## Related Files

- `controllers/LookupController/OVERVIEW.md` (this dossier)
- `controllers/LookupController/ENDPOINTS.md`
- `controllers/LookupController/FRONTEND_CONTRACT.md` (notes the empty-seed caveat for FE)

## Tasks-plugin tracking

- [ ] [[wave-5c-lookup-empty-seed]] Pending Question — Charging LookupController has empty seed data 🔼 #blocked-on/seed-data-author
