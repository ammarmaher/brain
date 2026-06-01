---
name: Vol 51 + Vol 52 (Saga Map + Brain Self-Knowledge)
description: Cross-BC saga patterns + outbox/inbox + Kafka topology, and the meta-organization of the brain itself (3-hop principle, specialist hubs, source-prefix discipline)
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
# Vol 51 + Vol 52 — Saga Map + Brain Self-Knowledge — 2026-05-18

**Status:** 🟢 LANDED 2026-05-18 (Waves 18-19 autopilot continuation).

## What landed

- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-51-CROSS-BC-SAGA-MAP.md` — 11 sections
- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-52-BRAIN-SELF-KNOWLEDGE-MAP.md` — 15 sections
- Obsidian graph nodes for both
- Atlas Master Index updated
- Memory entry (this file)

## Vol 51 — Saga Map highlights

### Service ownership map (corrected)
- **Commerce** owns: Account, Node, Hierarchy, Contract, Plan, ContactGroup, Template (catalog)
- **Identity** owns: User entity, Session, Zitadel sync, Password, OTP
- **Provisioning** owns: CommChannel state, Application state, Service catalog visibility, FSM
- **Charging** owns: Wallet aggregate, Ledger, FundingDecisions, Reservation TTLs

### 6 saga patterns documented
1. User Creation — Commerce orchestrates → Identity creates → callback
2. CommChannel Purchase — Commerce → Charging FundingDecision → Provisioning activate → BSA enable
3. Contract Expiry — Time-trigger → Kafka fan-out → all-wallet drain
4. Account Soft-Delete — 4-service cascade with un-delete reverse
5. Template Submission to Meta — Internal review → outbox → Meta HTTP boundary
6. Send Transaction — Most frequent: 10-step saga with refund-on-failure

### Open questions surfaced
Q-SAGA-01..10 covering outbox/inbox verification, idempotency replication, audit aggregator, DLQ runbook, schema registry, cascade ordering.

## Vol 52 — Brain Self-Knowledge highlights

### The 3-hop principle
Every answer reachable in ≤3 hops from a known entry. If >3 hops, brain needs a fix.

### Routing map
By topic: Wallet/Campaigns/User → Specialist Hubs. By role: dev/PM/QA → start points. By question phrasing: "Can X do Y?" → hub triage table.

### Source-prefix discipline
8 prefixes documented: `[CODE]`, `[BRAIN-OUT]`, `[VAULT]`, `[BRAIN-SK]`, `[MEMORY]`, `[INFERRED]`, `[BRD-EXTRACTED]`, `[REFERENCE-ONLY]`.

### Knowledge lifecycle
Birth → Growth → Confirmation → Death pattern. Atomic notes never deleted; superseded.

### Tier 2 Obsidian queued
Templater · Dataview · tag taxonomy · daily-notes · orphan-backlinks audit. 6 Q-BRAIN-* opportunities.

## Total Atlas state after these waves

- **Volumes:** 52 (Vols 1-52)
- **Specialist Hubs:** 3 active (Wallet, Campaigns, User-Lifecycle); 5+ planned (CG, Template, PES, Saga, Order-Status)
- **Truth tautology families:** 8 (W-TT, MC-TT, US-TT, TM-TT, CG-TT, CC-TT, MP-TT, DI-TT)
- **Code-verified volumes:** Vol 45 (Wave 11), Vol 47 (Wave 14)
- **Code-mining queued for:** Vol 50 (Wave 17), Vol 51 (Wave 18a/b), Vol 49 (Wave 19)
- **Open questions:** 40+ across all Q-* prefixes
- **Live bugs flagged:** 3 (from Wave 14)
- **Memory entries:** ~20+

## Background agents running

| Agent | Wave | Producing |
|---|---|---|
| PES Catalog | 17 | `WAVE-17-CODE-MINING-PES-CATALOG.md` |
| Commerce service | 18a | `WAVE-18A-CODE-MINING-COMMERCE.md` |
| Provisioning service | 18b | `WAVE-18B-CODE-MINING-PROVISIONING.md` |

When they complete, Vol 50 PES Audit + addenda to Vol 51 will be written.

## Trigger phrases

- `vol 51 saga map` / `cross BC saga`
- `vol 52 brain self knowledge` / `3-hop principle`
- `specialist hub anatomy`
- `outbox in same txn`
- `source-prefix discipline`
- `knowledge lifecycle`
- `tier 2 obsidian improvements`
