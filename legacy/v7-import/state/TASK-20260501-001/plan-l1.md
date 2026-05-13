<!-- *** plan-l1-abstraction.md *** -->
<!-- *** L1 — Abstraction layer. Short, high-level shape of the change. <=30 lines. *** -->
<!-- *** Gate: user must approve this file before L2 is generated. *** -->

# L1 — Abstraction

- **Task ID:** TASK-20260501-001
- **Title:** Define wallet/charging service boundary (GAP-CC-002)
- **Date:** 2026-05-01
- **Author agent:** adnan

## Goal
Pick exactly one owner of wallet-record deduction across the Commerce/Charging/Wallet split and document the boundary as a Falcon-wiki ADR. Candidates:
(a) Commerce owns deduction (status quo of PRD prose) — Charging and Wallet become passive stores.
(b) Charging Service (OCS) owns deduction — nearest-expiring traversal, fall-back chain, and rate look-up live in `falcon-core-charging-svc`; Commerce only writes contract metadata; Wallet only persists balances.
(c) Wallet Service owns deduction — Wallet exposes deduction RPC; Charging just rates; Commerce just writes contracts.

## Why now
Four critical gaps in module 03 (GAP-CC-002, GAP-CC-003, GAP-CC-008, GAP-CC-009) all collapse onto this single undeclared boundary. Until the owner is named, "nearest-expiring-first" will be re-implemented inconsistently in two or three services and every downstream gap (insufficient-funds error shape, OCS-down behaviour, concurrency lock) is impossible to specify.

## Scope — In
- One ADR file under `falcon-wiki/Home/Software-Architecture-Design/` naming the chosen owner.
- A boundary spec doc listing: deduction RPC contract (gRPC or Kafka), rate-lookup contract, fall-back chain ownership, error envelope, and concurrency strategy.
- Update of HLA §2.6 cross-reference table to point at the chosen owner.

## Scope — Out
- No code changes in any service.
- No PRD edits (PRD lives in Drive; this task only writes wiki artifacts).
- No changes to packaging/billing modules (separate phase-2 PRDs).
- No Farabi integration design.

## Affected modules
- `03-contract-packaging-charging-billing-management` (PRD module)
- `falcon-core-commerce-svc` (loses or keeps deduction logic)
- `falcon-core-charging-svc` (gains or keeps OCS responsibility)
- `wallet-service` (referenced by HLA route table)
- `falcon-wiki/Home/Software-Architecture-Design/High-Level-Architecture.md` (cross-ref update)

## Open questions
1. Does an OCS service already exist as a deployable, or is `falcon-core-charging-svc` only a name in the wiki?
2. Is `wallet-service` a planned standalone or still folded into Commerce repo?
3. Where should the ADR file live — `Home/Software-Architecture-Design/ADRs/` or inline in HLA?
4. Which transport for the deduction call — gRPC (synchronous) or Kafka (async with outbox)?
5. Who owns the "nearest-expiring contract record" cursor — caller or owner?
6. Does the chosen boundary force a breaking change to existing Commerce APIs, and if so what is the migration plan?

## Acceptance check (one line)
L2 must produce: business-rule table for the chosen owner, permission matrix for deduction RPC, status transitions for the boundary RPC, edge cases for OCS-down / wallet-down / insufficient-funds / concurrent deductions, and a rollback plan if the chosen owner proves wrong.

<!-- *** Approval: run `plan-gate.ps1 -TaskId TASK-20260501-001 -Layer L1 -Action approve` *** -->
<!-- *** Rejection: run `plan-gate.ps1 -TaskId TASK-20260501-001 -Layer L1 -Action reject -Reason "..."` *** -->
