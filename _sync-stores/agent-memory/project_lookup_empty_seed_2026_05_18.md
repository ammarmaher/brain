---
name: LookupController empty seed in both Provisioning and Charging
description: LookupSeedData.cs returns empty lists in both services. Add Client wizard CommChannel/App picker broken. Discovered Wave 5c+5d 2026-05-18.
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
Both `falcon-core-provisioning-svc` and `falcon-core-charging-svc` have a `LookupController` whose `LookupSeedData.cs` returns `new List<>()` (empty). Every call to these endpoints returns `200 OK []`.

**Impact on Add Client wizard:** Steps 3 (CommChannels) and 4 (Applications) use a search/filter dropdown that calls these endpoints. The dropdown gets an empty list — pickers show nothing. The wizard is broken at this step.

**Why:** Seed data was either never written or the catalog is supposed to come from Commerce (which has real per-account data via `GET commerce/Node/{id}/comm-channels/visible` + `GET commerce/Node/{id}/applications`).

**How to apply:** Fastest fix = redirect the picker to call Commerce endpoints directly (they return real per-account data). Pending-Q files at `_pending-questions/wave-5d-provisioning-lookup-empty-seed.md` and `wave-5c-lookup-empty-seed.md`. Ask user which fix to apply before implementing Add Client wizard picker.
