---
type: atlas-volume-graph-node
volume: 45
cluster: 10-pages
source: "[BRAIN-OUT] Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-45-WALLET-SPECIALIST.md"
created: 2026-05-18
status: canonical-code-verified
tags:
  - atlas/vol45
  - specialist/wallet
  - specialist/balance
  - specialist/multi-contract
---

# Vol 45 — Wallet & Balance Management Specialist Guide

> The operating manual for any money-movement code path. Code-verified by Wave 11 mining agent.

## What's in it

14 sections + code-verification addendum:
- §1 Wallet universe topology + ASCII diagrams
- §2 5 universal actions (Charge/Transfer/Deduct/Purchase/Consume Addons)
- §3 Actor authority lattice
- §4 Multi-contract orchestration deep-dive + canonical algorithm + worked example
- §5 Atomicity & consistency (MongoDB session + optimistic concurrency)
- §6 Contract lifecycle interactions
- §7 CommChannel wallet priority
- §8 Audit & provenance (ledger schema, SAMA requirements)
- §9 Reconciliation rules (daily/monthly close)
- §10 Edge cases catalog (8 classes)
- §11 Wallet-domain error catalog (9 codes)
- §12 Specialist mental model (CTC mnemonic + decision tree)
- §13 Cross-references
- §14 PR review checklist (14 items)
- §V45-CODE-VERIFICATION-ADDENDUM — Wave 11 corrections

## Headline truth

> Falcon's Master Wallet is a single MongoDB aggregate (`OcsWallet`, keyed `{OwnerType}:{OwnerId}:{Channel}:{Currency}`) holding per-contract embedded `OcsWalletBucket[]` entries. The nearest-expiry FIFO is implemented in `AllocateOcsMonetaryBucketsPolicy.cs:35-46` and reused by 4 handlers. Atomicity = MongoDB ClientSession + optimistic concurrency. Idempotency = deterministic `WalletMutationReceipt` key. CommChannel priority = **per-request input**, not stored. Contract expiration = Kafka-event-driven, NOT scheduled jobs.

## Code citations (Wave 11 mining)

| Concept | Code |
|---|---|
| Nearest-expiry FIFO | `AllocateOcsMonetaryBucketsPolicy.cs:35-46` |
| Wallet aggregate | `OcsWallet` (collection `wallets`) |
| Cross-contract pricing | `BuildOcsUsageReservationPlanPolicy.cs:121` |
| Funding decision | `ResolveWalletFundingDecisionPolicy` |
| Atomicity | `MongoUnitOfWork.cs` |
| Idempotency receipt | `WalletMutationReceipt` |
| Contract expiry | `ProjectContractLifecycleProcess.ExecuteExpiryAsync` |

## Questions resolved by code

- ✅ Q-CC-13 — One priority list, per-request (not account-stored)
- ✅ Q-CC-15 — Priority is per-request, not per-sub-node
- ✅ Q-CC-16 — Mongo transactions used → replica set required

## Questions still open

- 🟡 Q-CC-14 — Boundary-case rule for contract expiry during in-flight transaction (race)
- 🟡 Q-CC-17 — Ledger append-only enforcement (DB-level or app-level)
- 🟡 Q-CC-12 — WA rates on Contract entity or Plan template

## See also

- [[WALLET-SPECIALIST-HUB]] — entry point hub
- [[VOL-44-TRUTH-TAUTOLOGIES]] — atomic tautologies (W-TT-*, MC-TT-*)
- [[03 Contract Packaging Charging Billing]] — Module 03 dependency
- [[Vol 44 — Supporting Artifacts Research]] — sibling
- [[Vol 46 — Campaigns Channels Specialist Guide]] — sibling (channels consume wallet)
- [[ATLAS_MASTER_INDEX]]
