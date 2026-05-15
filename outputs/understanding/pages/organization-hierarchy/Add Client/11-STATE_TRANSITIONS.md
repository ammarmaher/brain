*** Add Client — State transitions ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Add Client — State / status transitions

> Per-entity state machines for the artifacts Add Client creates. Initial state on submit, then forward transitions (which happen via other flows — not Add Client).

## Entity state table

| Entity | Initial state on Submit success | Next transitions (not in this flow) |
|---|---|---|
| Account | `Pending` (no explicit Active status in PRD; treat as pre-activation) | → `Active` when first Contract activates (W8 cross-module) |
| Main Node | Created (no explicit status) | Renames via `ChangeNodeNameRequest`; sub-nodes added via `CreateSubNodeRequest` |
| AccountSettings | Persisted | Edits via `PUT /api/Setting` (W7) |
| CommChannelConfig × N (Step 3) | `InActive (First time)` | → `Paid` → `Active` via `DoPaymentCommunicationChannelRequest` (W4) |
| AppConfig × N (Step 4) | `InActive (First time)` | → `Paid` → `Active` via `DoPaymentApplicationRequest` (W4) |
| AO User | `Pending` | → `Active` on first successful login + force-change-password (PRD-02 W2); → `Locked` on 3 wrong attempts (PRD-02 W9) |
| Master Wallet | abstract aggregate (lump sum = 0 until contracts activate) | Funded via `ContractActivated` Kafka event (W8) |

## Account lifecycle (PRD-01)

```
[Submit] → Pending ─(first Contract activates · W8 Kafka)→ Active ─→ Expired ─→ ...
```

PRD silent on explicit "Active on create" semantics. Account is treated as **pre-activation** until the first Contract activates (W8 cross-module). The Pending → Active transition is **outside** the Add Client flow.

## Main Node lifecycle

- Created on Add Client Submit (no explicit status field exposed).
- Renamed via `ChangeNodeNameRequest` post-create.
- Sub-nodes added via `CreateSubNodeRequest` (subject to `Settings.MaxNodeLevel` cap from Step 2).

## AccountSettings lifecycle

- Persisted on Add Client Submit.
- Edits post-create via `PUT /api/Setting` (W7 Settings tab edit flow).
- BR-AM-39 (open): enforcement mode for limit edits when current usage exceeds new cap (reject vs grandfather) — flagged for the Settings tab edit flow, not Add Client.

## CommChannelConfig / AppConfig lifecycle (W4 Activation)

```
[Add Client Submit · Show + price configured]
      │
      ▼
InActive (First time) ──(DoPayment · W4)──► Paid ──(provision)──► Active
                                                                    │
                                                                    └──► (later) renewal cycles · status 6-value enum not exposed as single field
```

- Initial state per BR-AM-20: `InActive (First time)`.
- Transitions via `POST /api/Node/comm-channel/do-payment` (W4 Activation flow — not in Add Client wizard).
- The Step 3/4 price is what gets debited from the Master Wallet when `DoPayment` runs.
- Full 6-value status enum is **not exposed as a single response field** — see [[E-comm-channel-config]] documentation gap.

## AO User lifecycle (PRD-02)

```
[Add Client Submit · Kafka UserCreationRequested]
      │
      ▼
   Pending ──(first successful login + force-change-password · W2)──► Active
      │
      └──(3 wrong attempts · W9)──► Locked
```

- Initial state per PRD-02 BR-UM-09: `Pending`.
- → `Active` on first successful login + force-change-password (PRD-02 W2).
- → `Locked` on 3 wrong login attempts (PRD-02 W9).
- Credentials are delivered per `DeliveryMethod` (Email / SMS / Both) immediately after Kafka consumer creates the Zitadel user.

## Master Wallet lifecycle (Charging)

```
[Add Client Submit · Kafka WalletConfigured]
      │
      ▼
Abstract aggregate (lump sum = 0) ──(first ContractActivated · W8 Kafka)──► Funded · runtime updates
```

- Materialized on `WalletConfigured` Kafka event (Charging consumer).
- Behaves as an **abstract aggregate** with lump sum = 0 until first Contract activates (per BR-AM-28).
- Sub-wallets (per-comm-channel) materialized if Multiple-wallet mode applies.
- Funded via `ContractActivated` Kafka event chain (W8, cross-module — not in Add Client).

## CommChannel/App activation flow (W4 — downstream)

`DoPaymentCommunicationChannelRequest` advances a `Show`-state config from `InActive (First time) → Paid → Active`. The price set in Step 3/4 of this wizard is what gets debited from the Master Wallet during W4.

## See also (Add Client folder)

- [README](README.md) — folder index
- [00-OVERVIEW](00-OVERVIEW.md)
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md)
- [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md)
- [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md)
- [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md)
- [06-STEP_5_ACCOUNT_OWNER](06-STEP_5_ACCOUNT_OWNER.md)
- [07-VALIDATIONS](07-VALIDATIONS.md)
- [08-BACKEND_API](08-BACKEND_API.md)
- [09-COMPONENTS](09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
- [12-ERROR_STATES](12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[Commerce Service]] · [[Identity Service]] · [[Charging Service]] · [[E-account]] · [[E-account-settings]] · [[E-comm-channel-config]] · [[E-app-config]] · [[E-user]] · [[01 Account Management]] · [[02 User Management]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
