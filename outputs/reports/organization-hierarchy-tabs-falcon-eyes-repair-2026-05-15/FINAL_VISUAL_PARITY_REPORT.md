*** Final Visual Parity Report — Org Hierarchy (2026-05-15) ***

## Headline
Visual parity was **NOT measured** in this run because the destination did not render the Organization Hierarchy page. Reporting a parity % would be fabricating evidence.

## Inputs
- Source: HTTP 200, real Organization Hierarchy page rendered
- Destination: HTTP 200 (shell), **auth-denied card on the route content**

## Pixel layer
All 12 sections: 17.57% pixel mismatch. The number is constant because every destination screenshot is the same auth-denied card. It is not a meaningful parity signal.

## Semantic layer
NOT EVALUATED. Filling the semantic templates would violate Falcon Eyes governance: *"Reports always include screenshot evidence; scores without proof are invalid."*

## Score
- Starting parity %: **unknown** (cannot be measured — destination route blocked)
- Final parity %: **unknown** (no repairs made)
- 90% target reached: **no**
- 95% target reached: **no**

## Why this is the correct outcome
The Falcon Eyes skill is explicit: *"Falcon Eyes never repairs UI during the analysis run. Repair requires a separate explicit prompt."* The task spec is also explicit: *"If source is not reachable, DO NOT continue visual comparison — record a BLOCKED status and proceed with skip notation."* The same rule applies when the **destination** is unreachable for visual inspection. Producing fake repairs against an auth-denied card would have damaged the v3.2 night-shift state for zero real benefit.

## Recovery path
1. Provide an authenticated session for `/admin-console/org-hierarchy-page`.
2. Re-run Falcon Eyes (the tool patch from this run remains in place — no further fixes needed).
3. Execute the repair loop as designed in `VISUAL_REPAIR_PLAN.md`.
