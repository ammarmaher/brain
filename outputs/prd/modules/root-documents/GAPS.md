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
