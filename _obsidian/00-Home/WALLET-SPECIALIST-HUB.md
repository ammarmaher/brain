---
type: specialist-hub
hub: wallet-specialist
created: 2026-05-18
authority: "Vol 45 (specialist guide) + Vol 44 §1-§2 (truth tautologies) + WAVE-11 code mining"
status: canonical
tags:
  - specialist/wallet
  - specialist/balance
  - specialist/multi-contract
  - hub
---

# 💰 Wallet & Balance Management — Specialist Hub

> **Your entry point** for anything wallet/balance/multi-contract related — from "can NU transfer?" through to "how is MongoDB optimistic concurrency wired in the deduction policy?".

## 🚀 Quick triage

| If you're asking... | Start here |
|---|---|
| "Can [actor] do [action] in [wallet type]?" | [[VOL-44-TRUTH-TAUTOLOGIES]] §Wallet Truth (W-TT-01..08) |
| "Walk me through the full money-movement pattern" | [Vol 45 §2-§3](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-45-WALLET-SPECIALIST.md) |
| "How does cross-contract pricing work?" | [Vol 45 §4](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-45-WALLET-SPECIALIST.md) (worked example) |
| "What does the code look like?" | [Wave 11 code-mining report](../../../Brain%20Outputs/reports/night-shift/2026-05-17/WAVE-11-CODE-MINING-WALLET.md) |
| "I'm reviewing a wallet PR — checklist?" | [Vol 45 §14](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-45-WALLET-SPECIALIST.md) |
| "I'm debugging a wallet error" | [Vol 45 §11 Error Catalog](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-45-WALLET-SPECIALIST.md) |
| "What edge cases must I handle?" | [Vol 45 §10](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-45-WALLET-SPECIALIST.md) |
| "How is contract expiration handled?" | [Vol 45 §6.4 + Vol 45 Addendum §6](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-45-WALLET-SPECIALIST.md) — Kafka-event-driven |

## 🧠 The mental model (one paragraph)

A Falcon account has ONE **Master Wallet aggregate** (Mongo doc `ACCOUNT:{id}:ALL:SAR`) holding **per-contract embedded buckets** (`OcsWalletBucket[]` with `BucketType=ContractFunded`). Sub-buckets are **Quota buckets** (`QuotaCategory=SUB_SERVICE`) — what BRDs call **Addons**. In Multi-Wallet mode, there are additional CommChannel wallet aggregates. Five universal actions (Charge/Transfer/Deduct/Purchase/Consume) move money between aggregates. The **nearest-expiry FIFO** (BR-CC-31, code at `AllocateOcsMonetaryBucketsPolicy.cs:35-46`) walks buckets ordered by `ExpiresAt`, consuming each at its own contract's per-action rate. Atomicity is **MongoDB ClientSession + optimistic concurrency (`Version++`)**; idempotency is a deterministic `WalletMutationReceipt`. Contract expiration is **Kafka-event-driven** (`ProjectContractLifecycleProcess.ExecuteExpiryAsync`).

## 📚 Sources of truth (priority order)

1. **`[CODE]` falcon-core-charging-svc** — actual implementation (Wave 11 report cites file:line)
2. **`[BRAIN-OUT]` Vol 45** — specialist operating guide
3. **`[BRAIN-OUT]` Vol 44 §1-§2** — BRD-extracted truth tautologies (W-TT-*, MC-TT-*)
4. **`[BRD-EXTRACTED]` Wallets-Balance-Flow.txt** Sheet 3 — canonical wallet action rules
5. **`[BRD-EXTRACTED]` Multiple-Contracts-Deduction.txt** — worked example for cross-contract pricing
6. **`[BRAIN-OUT]` Vol 28 Matrix 5** — historical (now defers to Vol 45)
7. **`[BRAIN-OUT]` Vol 36 (Module 03)** — contract entity + pricing (cross-cluster)

## 🔑 Code citations (Wave 11 mining)

| Concept | Code reference |
|---|---|
| Nearest-expiry FIFO | `AllocateOcsMonetaryBucketsPolicy.cs:35-46` |
| Wallet aggregate root | `OcsWallet` (collection `wallets`) |
| Wallet key | `{OwnerType}:{OwnerId}:{Channel}:{Currency}` |
| Cross-contract pricing | `BuildOcsUsageReservationPlanPolicy.cs:121` |
| Funding decision | `ResolveWalletFundingDecisionPolicy` |
| Atomicity primitive | `MongoUnitOfWork.cs` |
| Optimistic concurrency | `Version++` + `TryReplaceAsync` |
| Idempotency receipt | `WalletMutationReceipt` |
| Contract expiry consumer | `ProjectContractLifecycleProcess.ExecuteExpiryAsync` |
| Reservation TTL worker | `ReservationExpiryWorker` (BackgroundService) |

## 🧩 Truth tautologies (clickable)

### Wallet authority — W-TT-01..08
1. NU cannot transfer — only deduct on send
2. NA's transfer authority bounded by sub-hierarchy
3. AO is only client actor that can touch MW
4. **Falcon-User exclusive:** Master ↔ CommChnl transfer
5. Nearest-expiry FIFO universal
6. Atomicity — total < Needed → abort (no partial debit)
7. Addons-first for SubServices; MW-first for CommChannel/App
8. System (not human) performs contract-expiration deductions

### Multi-contract orchestration — MC-TT-01..06
1. Per-action rates are contract-specific
2. Cross-contract spans priced at each contract's own rate (never blended)
3. Fractional consumption supported
4. **MW stores per-contract balances** (now: as embedded buckets)
5. Transfers preserve contract identity (C#1 stays C#1)
6. Addons have own activation/expired dates per contract

## ⚠️ Edge cases checklist

- [[VOL-44-TRUTH-TAUTOLOGIES]] §Wallet → 8 tautologies
- Vol 45 §10 → 8-class edge case catalog
- Vol 45 §13 → "no leakage" axiom (reconciliation)
- Vol 45 §V45-CODE-VERIFICATION-ADDENDUM → resolves Q-CC-13/15/16 with code

## ❓ Still open questions

| ID | Topic | Why still open |
|---|---|---|
| Q-CC-14 | Contract expiry boundary race | Architecture decision; need product input |
| Q-CC-17 | Ledger append-only enforcement | Need separate code-mining pass |
| Q-CC-12 | WA rates on Contract entity or Plan template? | Cross-bounded-context |

## 🔗 See also

- [[CAMPAIGNS-CHANNELS-SPECIALIST-HUB]] — channels are the wallet's consumers
- [[VOL-44-TRUTH-TAUTOLOGIES]] — atomic tautology list
- [[03 Contract Packaging Charging Billing]] — Module 03 (contracts + pricing)
- [[01 Account Management]] — Module 01 (account is the wallet owner)
- [[ATLAS_MASTER_INDEX]] — full 46-volume Atlas
- [[AMMAR_BRAIN_HOME]] — vault root

#specialist/wallet #specialist/balance #specialist/multi-contract #hub #canonical
