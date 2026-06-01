---
type: pending-question
fork-id: F-004 (entity drift — data layer)
wave: 5d
halted-at: 2026-05-17T+03:00
night-shift-batch: forever-wave-2026-05-17
related-controller: LookupController
related-file: "Brain Outputs/understanding/backend/provisioning/controllers/LookupController/OVERVIEW.md"
---

# Fork: LookupSeedData.cs returns empty lists — controller is effectively dead code today

## Why halted

`LookupController GET /api/lookups` and `GET /api/lookup-values` both resolve via `LookupSeedData.GetLookups()` and `GetLookupValues()` which return `new List<Lookup>()` and `new List<LookupValue>()` — empty. Any call to the endpoint returns `200 OK` with an empty array. The Add Client wizard's CommChannel/Application picker therefore receives an empty list and the dropdowns show nothing.

This is either: (a) intentional dead code waiting for a seed data file, or (b) a broken build step where the actual seed file is missing from the deployment.

## Sources reviewed

- `[CODE]` `LookupSeedData.cs` — both static methods return empty `new List<>()`
- `[CODE]` `LookupController.cs` — wired to `LookupSeedData` via handler
- `[BRAIN-OUT]` `understanding/backend/provisioning/controllers/LookupController/OVERVIEW.md`

## Plausible answers

**A** — Seed data was never written; the controller is a placeholder. Action: populate `LookupSeedData` with the CommChannel + Application catalog from Commerce or a static list matching the PRD-01 dropdown definitions.

**B** — The actual data comes from Commerce (not Provisioning), and this controller is truly dead code. Action: remove `LookupController` from Provisioning; the Add Client wizard should call `GET commerce/Node/{id}/comm-channels/visible` and `GET commerce/Node/{id}/applications` instead (these already exist per Wave 5a findings).

**C** — Seed data exists in a separate JSON/CSV file that is supposed to be read at startup but the file-read code is missing. Action: locate the asset file and wire it.

## Recommended question for the human

"Is `LookupController` in Provisioning still needed, or should the Add Client wizard CommChannel/Application picker call the Commerce endpoints directly (which return real per-account data)? If Provisioning is needed, who supplies the seed data?"

## Blast radius

- HIGH for the Add Client wizard Step 3/4 UX — the pickers currently return empty.
- If B (use Commerce directly): FE service layer change in `add-client` wizard step 3+4 services. Backend unaffected.
- If A: backend seed data population required before wizard is functional end-to-end.
