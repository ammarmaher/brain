---
type: backend-service
service: basic-send
primary-prds: [PRD-06]
repo: TBD (proposed falcon-core-basic-send-svc — NOT created)
created: 2026-07-06
---
*** Backend Service — Basic Send (PLANNED — does not exist) ***
*** SoT: Brain Outputs/prd/modules/06-basic-send-application/ (no understanding/backend/ folder until code exists) ***
*** Seeded 2026-07-06 by Brain SK basic-send-prd intake ***

# Basic Send Service (planned)

> **This service does not exist.** No repo, no endpoints, no DTOs, no gateway route — the backend-is-SoT rule forbids documenting any of those as fact. What exists today: the Commerce catalog SKU "Basic Send App" (`695a304f901bb7d4a830d0dc`, purchasable, runtime-verified) and every READ-side dependency the service will consume. This note holds the honest gap register + the planned shape; the full plan lives in [IMPLEMENTATION_PLAN](../../../Brain%20Outputs/prd/modules/06-basic-send-application/IMPLEMENTATION_PLAN.md).

## Honest gaps (GAP-BSA-*)

| Gap | Statement | Evidence |
|---|---|---|
| **GAP-BSA-01** | No BSA service/repo exists anywhere; the entire execution plane (transaction engine, batch processor, scheduler, Meta adapter + webhooks, SIP dialer + per-second charging loop, conversation store + CS window, retry engine, stats/exports, BSA API + skeleton facades) is unbuilt | [PLATFORM_GROUNDING](../../../Brain%20Outputs/prd/modules/06-basic-send-application/PLATFORM_GROUNDING.md) §3 — each item classed CONFIRMED-ABSENT or ABSENT-IN-BRAIN |
| **GAP-BSA-03** | No Sender-ID registry for either channel (WABA numbers / SIP accounts) — blocks Voice compose + the SenderID skeleton API; Voice Accounts FE today is mock-first ("no backend exists") | PLATFORM_GROUNDING §3.3/3.4 |
| **GAP-BSA-04** | No cost-quote/dry-run rating API in Charging — pre-send estimation needs a new endpoint or BSA-side rate reads (Q-BSA-03) | PLATFORM_GROUNDING §3.9 |
| **GAP-BSA-05** | No destination-resolution service (phone → rating Destination axis) | PLATFORM_GROUNDING §3.9 |
| GAP-BSA-02 is tracked at [[BACKEND_INDEX]] §Known gateway gaps (no `bsa-cluster` / `/bsa/*` on either gateway; onboard container BEFORE routes — YARP crash precedent) | | |

## Planned shape (from the implementation plan — NOT reality)

- .NET 10 clean architecture, Mongo `FalconBsaDb`, Hangfire scheduler, Kafka Avro + outbox (`bsa.transaction-created.v1`, `bsa.transaction-status-changed.v1`, `bsa.recipient-status-changed.v1`), Redis idempotency, consumer group `falcon-basic-send-svc`.
- Aggregates: SendTransaction · RecipientResult (+ Attempt) · ConversationRecord — FSMs per [WORKFLOWS](../../../Brain%20Outputs/prd/modules/06-basic-send-application/WORKFLOWS.md).
- Charging loop: per-recipient `reserve → commit | release` with deterministic refs `bsa-wa-{txnId}-{seq}` (Charging-Lab-proven); Voice per-second debit loop on the realtime substrate.
- East-west clients: Templates · ContactGroup · Charging · Commerce · Provisioning · Identity · Access. Decode `user-id` from `urn:zitadel:iam:user:metadata` (ZitadelClaimsTransformation drops it — Commerce CreatedBy-null precedent).
- PES: seed `acc.bsa` mount + `acc.bsa-transaction` actions (view/send/schedule/cancel/delete/edit/export/converse) in `BuiltInRoleCatalog.cs` + FE registry (voice-record PR 43022 recipe); creator-scoped via `"r.obj.createdby"=="r.sub.userid"`; do NOT gate on `acc.services` (denies acc-user).

## What it consumes (all EXIST)

[[Charging Service]] (reserve/commit/release/debit + rating + strategies + `ocs:realtime-events`) · [[Templates Service]] (WA templates + IVR trees + voice records — branch `feat/ivr-templete`, 42 paths, merge unverified) · [[Contact Group Service]] (own/shared + columns + contacts paging) · [[Commerce Service]] + [[Provisioning Service]] (purchase/order/channel+app status) · [[Access PES Service]] · [[Identity Service]] (users, webhook-HMAC precedent for Meta webhooks).

## Tags

#type/backend-service #prd/06 #service/basic-send #gap #blocked

## Hubs

- [[BACKEND_INDEX]] · [[API_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[06 Basic Send Application]]
