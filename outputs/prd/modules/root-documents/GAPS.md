*** PRD Understanding - Root Documents - GAPS ***

# root-documents - PRD vs Code Gaps

> This module is meta-only — there is no code that implements `Points to be covered later` or `Copilot 4DevOps`. The "gaps" listed below are cross-cutting questions whose code implementation is partial across multiple services.

## Cross-Cutting Coverage (rolled up from backlog)

| # | PRD Requirement (from `Points to be covered later`) | Primary module | Code Location | Status |
|---|---|---|---|---|
| GAP-RD-01 | Voice codec Opus vs G711 U decision | (no module yet) | No Voice CommChannel service surface; Voice provider integration not yet built. | MISSING |
| GAP-RD-02 | Per-account % of allowed transfer amount | 01 (BR-AM-34) | Commerce `CreateAccountRequest.Settings.BalanceTransferLimit`. Already in DTO. | COVERED (mechanism in place; backlog item asks to confirm UI configurability) |
| GAP-RD-03 | Move node from level to level (hierarchy restructuring) | 01 (Q-AM-18) | No `MoveNode` / `ReParentNode` endpoint in Commerce. | MISSING |
| GAP-RD-04 | Refund (failed campaign): which contract gets the balance, what expiration date | 03 + 01 (Q-CC-14) | No `Refund` endpoint observed; no refund logic in Charging. | MISSING |
| GAP-RD-05 | Addons fallback to a different contract's rate card when searched contract has no matching addon | 03 (Q-CC-15) | Handler logic; not visible at REST surface. | UNVERIFIABLE |
| GAP-RD-06 | Confirmation / warning messages from DB (no hardcoding) | Cross-platform i18n | Today all error/warning messages are .resx-bound (`ErrorMessages.{en,ar}.resx`) in each service; runtime DB-editable messages would require a new infrastructure component. | MISSING |
| GAP-RD-07 | Active contract + 3 visible commchannels + 4th activation request | 01 (Q-AM-19) | No "visible commchannel max-per-active-contract" enforcement observed. | MISSING (or N/A if the rule is "no cap") |
| GAP-RD-08 | Falcon usertype skip-validation override for user phone/status edits | 02 (Q-UM-16) | No "skip validation" path in Identity. Today admin-edit goes through the same OTP flow. | MISSING |
| GAP-RD-09 | Phone Number / Destination logic (Country Code, NDC, length per country, Allow/Deny + Price in Contract Details) | 03 (Q-CC-23) | Commerce DTOs carry Destination as string; `International Phone# Destination List` is a lookup; per-country Allow/Deny + Price would be additional contract metadata. Today's `ContractRateRequest.Destination` is opaque. | PARTIAL (destination axis exists; per-country Allow/Deny + Price metadata missing) |
| GAP-RD-10 | Template configuration inheritance Main -> sub-nodes with override | 05 + 01 (Q-TM-21) | Templates service today is per-tenant only (no inheritance). | MISSING (Phase 2) |
| GAP-RD-11 | Convert-to-points in single-wallet-multi-commchannel scenario | 01 + 03 (Q-AM-20) | Rate Card supports Multiple-wallet AND Single-wallet-with-exactly-one-commchannel (BR-CC-20); multi-commchannel-single-wallet is the explicit TBD. | MISSING (requires PRD revision before code) |

## Summary

- **Total rows:** 11.
- **COVERED:** 1 (GAP-RD-02, mechanism in place).
- **PARTIAL:** 1 (GAP-RD-09, destination axis exists, additional metadata missing).
- **MISSING:** 8 (GAP-RD-01, 03, 04, 06, 07, 08, 10, 11).
- **UNVERIFIABLE:** 1 (GAP-RD-05).

## Cross-platform observations

- Multi-module questions (GAP-RD-04, GAP-RD-09, GAP-RD-10, GAP-RD-11) need coordinated PRD revisions across two or more modules before code can be planned.
- GAP-RD-06 (DB-editable user messages) is a platform feature, not a module feature. If approved, it would impact every service's `ErrorMessages.{en,ar}.resx` -> a new lookup table + admin UI.
- GAP-RD-01 (Voice codec) sits outside the 5 modules; it likely belongs to a future "Voice CommChannel" module that hasn't been scaffolded.

---

## Wave 2 refresh — 2026-05-18

> Refreshed by Wave 2 PRD Deep Read. Source: `Brain SK\skills\imported-business\prd-knowledge\modules\root-documents\latest-prd.md` (55 lines synced 2026-04-24; cataloguing `Points to be covered later` and `Copilot 4DevOps`). All 11 backlog items propagated to the relevant module's QUESTIONS.md.

### Counts

- **Rules verified:** N/A (this is meta-only — no business rules to verify).
- **Drift discovered:** 0 (this is meta-only — no drift category applies).
- **New resolutions added to QUESTIONS.md:** 3 cross-cutting items closed/converged with downstream modules.
- **New pending-questions raised:** 0 (all halts surfaced at the downstream module level, e.g., Q-UM-07 in module 02 and Q-CC-01 in module 03).

### Propagation re-audit (per module)

Wave 2 verified that every backlog item is now correctly cross-linked in the downstream module's QUESTIONS.md + GAPS.md:

| Backlog (Q-RD-*) | Topic | Propagated to | Wave 2 status |
|---|---|---|---|
| Q-RD-01 | Voice codec Opus vs G711 U | (no module yet — Voice CommChannel future) | UNCHANGED — still no owning module |
| Q-RD-02 | Balance Transfer Limit % per account | 01 → Q-AM-17 (BR-AM-34) | VERIFIED — mechanism in place |
| Q-RD-03 | Move node from level to level | 01 → Q-AM-18 (GAP-AM-07) | UNCHANGED — MISSING |
| Q-RD-04 | Refund (failed campaign) | 03 → Q-CC-14 (cross-link 01) | UNCHANGED — MISSING |
| Q-RD-05 | Addons rate card fallback | 03 → Q-CC-15 | UNCHANGED — UNVERIFIABLE |
| Q-RD-06 | DB-editable warning messages | Cross-cutting platform (closest module touchpoint: 05 → Q-TM-22) | UNCHANGED — Wave 2 confirmed scope owner is platform-architect, not module owner |
| Q-RD-07 | Active contract + 4th commchannel | 01 → Q-AM-19 | **PARTIALLY RESOLVED** — Wave 2 inferred "no cap" per F-022 conservative default (see module 01 Resolutions Q-AM-19) |
| Q-RD-08 | Falcon admin skip-validation for phone/status | 02 → Q-UM-16 | UNCHANGED — pending product input |
| Q-RD-09 | Phone Number / Destination logic | 03 → Q-CC-23 | UNCHANGED — needs `Phone Number Analysis V6` deep read |
| Q-RD-10 | Template config inheritance Main → sub-nodes | 05 → Q-TM-21 (cross-link 01) | UNCHANGED — Phase 2 |
| Q-RD-11 | Single-wallet-multi-commchannel rate card | 01 → Q-AM-20 (cross-link 03) | **DEFERRED** — Wave 2 confirmed product-team scope decision needed (see module 01 Resolutions Q-AM-20) |

### Observations from Wave 2 re-read

1. **The backlog hasn't grown.** No new cross-cutting items surfaced from any Wave 2 module refresh that aren't already in the 11 items above. This indicates the 2026-04-13 backlog snapshot is still complete relative to current PRD state.

2. **Two items closed by inference** (Q-RD-07 and Q-RD-11) — both are conservative-default resolutions, not product confirmations. Both stay flagged as "Wave-2-resolved-by-inference" so a future product review can override.

3. **One item structurally orphaned** (Q-RD-01 Voice codec) — no module owns Voice CommChannel today. Wave 2 leaves it where it is until a Voice module materializes.

4. **`Copilot 4DevOps` review** — Wave 2 confirmed this file is **tooling-only** (no runtime impact). No business rules, no entities, no workflows. Status: catalogued, not refreshed.

### Halt-and-flag tonight

None. All halts surfaced at downstream module level (module 02 Q-UM-07 + module 03 Q-CC-01).

### Action items raised

1. **Voice CommChannel module scaffolding** — when Voice integration starts, create a `06-voice-commchannel` module folder + propagate Q-RD-01 there.
2. **DB-editable system messages** (Q-RD-06) — this needs a platform RFC, not a module PRD. Track separately.
3. **Coordinate Q-RD-09 + Q-RD-11** product reviews — both touch Destination + Rate Card logic in module 03 + 01. Recommend a single product session that covers both rather than two separate ones.
