*** PRD Understanding - Basic Send Application - ARCHITECTURE_BACKEND (deep design) ***

# BSA Backend Architecture — `falcon-core-basic-send-svc` (deep design, 2026-07-06)

> Status: **PROPOSED** design for a service that does not exist (GAP-BSA-01). Every reference to an EXISTING platform contract is quoted from `PLATFORM_GROUNDING.md` (trust-laddered) or runtime evidence; everything BSA-new is explicitly a proposal. Business anchors: `BUSINESS_RULES.md` (BR-BSA-*), `WORKFLOWS.md` (FSMs), `QUESTIONS.md` (Q-BSA-*), `GAPS.md` rulings (C-*). Decision gates D-1..D-10 / prereqs P-1..P-4 from `IMPLEMENTATION_PLAN.md` apply.

---

## 1. Context & principles

```
                        ┌────────────────────────────  FRONTENDS  ─────────────────────────────┐
                        │ admin-console (Falcon view, read/review) · management-console (client)│
                        │   BSA screens = NX lib project `libs/basic-send` mounted as lazy      │
                        │   routes in BOTH consoles (D-1a REVISED — see ARCHITECTURE_FRONTEND §1)│
                        └──────────────┬───────────────────────────────┬───────────────────────┘
                                       │ /bsa/*  (ClientOnly)          │ /bsa/* (FalconOnly twin)
                              ┌────────▼─────────┐            ┌────────▼─────────┐
                              │ Core Gateway 7038│            │ System GW 7256   │
                              └────────┬─────────┘            └────────┬─────────┘
                                       └──────────────┬────────────────┘
                                             ┌────────▼─────────┐        Kafka (Avro + outbox)
   Meta Cloud API  ◄── HTTPS ──┐             │  falcon-core-    │──► bsa.transaction-created.v1
   Meta Webhooks   ── signed ─►│             │  basic-send-svc  │──► bsa.transaction-status-changed.v1
   SIP/Voice provider ◄─ SIP ──┘             │  (.NET 10, Mongo │──► bsa.recipient-status-changed.v1
                                             │  FalconBsaDb,    │◄── commerce.comm-channel-* / contract-lifecycle /
                                             │  Hangfire, Redis)│      wallet-configured (consume)
                                             └───┬──┬──┬──┬──┬──┘
                 east-west (typed HttpClients)   │  │  │  │  │
      Charging(OCS) ◄────────────────────────────┘  │  │  │  └────────► Access/PES (authorize)
      templates-svc (WA tpl + IVR + voice records) ◄─┘  │  └──► Identity (users, user-id metadata)
      contact-group-svc (own/shared + columns + rows) ◄─┘  Commerce/Provisioning (channel+app status, orders)
```

**Principles (each traced):**
- P1 — *Charge at execution, never at creation* (BR-BSA-18): no wallet calls on compose/schedule.
- P2 — *Per-record charging via reserve→commit|release* (BR-BSA-19/20; Q-BSA-08 resolution: the OCS two-phase primitive satisfies BOTH PRD wordings — deduct-first ≈ reserve, refund ≈ release). Idempotent by `(ReferenceType, ReferenceId)` — `AlreadyApplied=true` is success (Charging contract).
- P3 — *Voice is realtime-metered, not reserved* (BR-BSA-21/22): pre-call 1-second gate → per-second debit loop → terminate on exhaustion.
- P4 — *No failovers* (BR-BSA-16/17): one channel per transaction; empty final wallet/bucket aborts that record.
- P5 — *Re-validate at execution time* (BR-BSA-09, EC-1/2): channel Active, template sendable, CG exists — checked when the job fires, not only at compose.
- P6 — *BSA owns send-time sendability* (GAP-TM-15 ruling): template status re-check lives here, not in templates-svc.
- P7 — *Everything user-scoped* (BR-BSA-52): creator-id decoded from `urn:zitadel:iam:user:metadata` (the ZitadelClaimsTransformation user-id gotcha), stored on every aggregate.
- P8 — *Fail-closed authorization*: every endpoint checks a BSA-specific PES resource (never `acc.services` — it denies acc-user).
- P9 — *Statuses are FSMs, not strings*: transitions only via the guards in WORKFLOWS.md §3a-3d.
- P10 — *Backend is SoT*: consumed contracts quoted; anything unverified sits in the §13 risk register.

## 2. Integration matrix (who BSA talks to, and how)

| Dependency | Direction | Contract (EXISTING unless marked) | Used for | BR anchor |
|---|---|---|---|---|
| Charging | BSA → | `POST /api/Wallet/reserve` · `/commit` · `/release` · `/debit` · `/get-account-wallets` · `GET /contract-balance-summaries` | WA per-record two-phase charge; voice per-second debit; balance views | BR-18..22 |
| Charging (realtime) | BSA → | Redis stream `ocs:realtime-events` (substrate exists; per-second consumer loop is **PROPOSED**) | voice metering | BR-21 |
| templates-svc | BSA → | template + IVR + voice-record reads (branch `feat/ivr-templete`; **45 paths / 52 ops enumerated live 2026-07-06** — `BE_CONTRACTS.md` §2 + `evidence-templates-openapi.json`; merge status = P-1) | 3-tier/2-tier pickers, variables, sendability re-check, IVR flow + audio for calls | BR-23..29, 35 |
| contact-group-svc | BSA → | `GET /api/contact-groups` · `/shared` · `/{id}` (columns) · `/{id}/contacts?page=&pageSize=` | own/shared CG lists, column schema, recipient iteration | BR-24, 30-33 |
| Commerce | BSA → | `GET /api/Node/{id}/comm-channels[/visible[/details]]` · `GET /api/Node/{id}/applications...` · `GET /api/Setting/wallets/{ownerId}` | channel-status gating; app activation check; balance strategy | BR-08..15 |
| Provisioning | BSA → | `GET /api/Services/account/{id}/applications` (+ comm-channels twin) | subscription status/actions | BR-03, 08 |
| Identity | BSA → | `GET /api/user/by-tenant` · `GET /api/user/{id}` | shared-with resolution, display names | BR-24 |
| Access (PES) | BSA → | `POST /pes/authorize` (+ `/resources` for FE) — subject `u:<zitadel-user-id>@<tenant-id>` | every authorization decision | BR-01/02/06 |
| Meta Cloud API | BSA → | **PROPOSED adapter**: template message send per recipient; template status/body fetch | dispatch + BR-28 sync | BR-40, 28 |
| Meta Webhooks | → BSA | **PROPOSED receiver** (HMAC-signed; Identity `x-zitadel-signature` pattern precedent) | per-recipient statuses + inbound replies + CS-window resets | BR-60, 82 |
| SIP/Voice provider | BSA ↔ | **PROPOSED adapter**: originate, call-progress events, DTMF, recording; status mapping sheet = P-4 | voice engine | BR-64..70 |
| Kafka | BSA ⇄ | produce `bsa.*.v1` (outbox pattern); consume `commerce.comm-channel-shown/visibility-changed.v1`, `commerce.contract-lifecycle.v1`, `commerce.wallet-configured.v1` | eventing + cache invalidation | — |
| Gateways | → BSA | **PROPOSED** `bsa-cluster` + `/bsa/{**remainder}` on BOTH gateways (ClientOnly on core, FalconOnly on system); container BEFORE routes (YARP crash trap) | front door | — |

## 3. Data model (MongoDB `FalconBsaDb`) — PROPOSED collections

### 3.1 `sendTransactions` (aggregate root; E3)
```jsonc
{
  "_id": "TXN-100483",                    // human id, generated: TXN-{seq}; unique index
  "tenantId": "…", "nodeId": "…",         // from JWT (client callers), never from body
  "createdByUserId": "…",                 // decoded user-id metadata (P7)
  "channel": "whatsapp | voice",
  "senderId": { "id": "snd-…", "value": "+9665…" },          // from sender registry §3.5
  "template": { "id": "wt1", "refId": "REF-1001", "name": "Chat & Discover",
                "category": "Marketing|Utility|Authentication|Dynamic|Static",
                "language": "English|…|null",                 // null for voice
                "variables": ["first_name", "amount"] },      // snapshot at compose
  "recipientsSpec": {
    "contactGroups": [ {                                      // ORDER = added order (BR-39)
        "groupId": "cg1", "name": "Contact Group 1", "countAtCompose": 257,
        "destinationColumn": "mobile",                        // BR-31
        "variableMap": { "first_name": "first_name", "amount": "age" } } ],
    "manual": [ { "destination": "+96657…", "variables": { "first_name": "Ahmed" } } ]  // ≤3 (BR-32)
  },
  "allowDuplicates": false,                                   // BR-36/38 — PERSISTED
  "timing": { "mode": "immediate|scheduled", "scheduledAtUtc": null },   // tz ruling = Q-BSA-05
  "voiceRetry": { "enabled": true, "statuses": ["no_answer","busy"],     // ⊆ 4 triggers (BR-42)
                  "attempts": [ { "waitMinutes": 5 }, { "waitMinutes": 10 } ] } ,  // ≤3
  "status": "scheduled|in_progress|completed|partially_processed|failed|canceled|deleted",
  "statusReason": null,                    // "Communication Channel is not active" | "Asset Missing" | "Insufficient balance …"
  "counters": { "plannedCount": 260, "processedCount": 0, "sentCount": 0,
                "totalCost": 0.0, "estimatedCost": 1028.0, "currency": "SAR" },   // Q-BSA-04
  "cancel": { "requested": false, "requestedAtUtc": null, "requestedBy": null },  // cooperative flag (BR-55)
  "execution": { "startedAtUtc": null, "finishedAtUtc": null, "batchSize": 100,   // D-3
                 "hangfireJobId": "…" },
  "audit": { "createdAtUtc": "…", "updatedAtUtc": "…", "editHistory": [ /* BR-72; Q-BSA-16 */ ] },
  "version": 3                             // optimistic concurrency
}
```
Indexes: `{tenantId, createdByUserId, channel, status, createdAtUtc desc}` (grids); `{status, "timing.scheduledAtUtc"}` (scheduler sweep); unique `_id`.

### 3.2 `recipientResults` (E4; one doc per recipient — write-heavy, separate collection)
```jsonc
{
  "_id": "TXN-100483:0007",               // {txnId}:{sequence} — also the charging ReferenceId suffix
  "txnId": "TXN-100483", "tenantId": "…",
  "sequence": 7,                           // global order: manual first, then CGs in added order (BR-39)
  "source": { "kind": "manual|contactGroup", "groupId": "cg1", "rowRef": "…" },
  "destination": "+96655…", "destinationNormalized": "96655…",   // E.164 (D-2) — dedup key (BR-38)
  "destinationCode": "SAU",               // rating axis via destination map §3.6
  "resolvedVariables": { "first_name": "Sara" },   // written at dispatch time (BR-40)
  "wa": { "status": "pending|sent|delivered|read|played|seen|failed",   // C1 ruling: failed included
          "sendDateUtc": null, "deliveryDateUtc": null, "statusDateUtc": null,
          "metaMessageId": null, "hasReply": false },
  "voice": { "status": "pending|sent|ringing|live|answered|busy|no_answer|unreachable|initiator_dropped|canceled|failed",
             "attempts": [ { "n": 1, "status": "no_answer", "atUtc": "…", "waitMinutes": 0,
                             "durationSec": 0, "cost": 1.0, "providerCallId": "…" } ],   // BR-66
             "sendDateUtc": null,          // first attempt (BR-67)
             "statusDateUtc": null,        // final
             "durationSec": 18, "ivrPath": ["n1","n3"], "completedTree": true, "recordingRef": null },
  "charge": { "reservationId": null, "state": "none|reserved|committed|released|debited",
              "messageCost": 2.5 },        // WA: base msg only (BR-60); voice: sum of attempts
  "skipped": { "isDuplicate": false, "unprocessedOnCancel": false }     // D-4: rows retained, flagged
}
```
Indexes: `{txnId, sequence}`; `{txnId, "wa.status"}`; `{"wa.metaMessageId"}` (webhook lookup); `{tenantId, destinationNormalized}` (conversation join).

### 3.3 `conversations` (E11) + `conversationMessages`
```jsonc
// conversations
{ "_id": "cnv-…", "tenantId": "…", "recipient": "+96657…", "senderId": "+96657 283 8628",
  "originTxnId": "TXN-100483", "originRecipientId": "TXN-100483:0001",
  "previousRecordId": null,               // CHAIN (BR-83/84; C8 ruling)
  "windowExpiresAtUtc": "…",              // server-computed; reset on recipient inbound (BR-82)
  "state": "active|expired|superseded", "createdAtUtc": "…", "lifecycle": [ … ] }
// conversationMessages
{ "_id": "…", "conversationId": "cnv-…", "direction": "out|in",
  "kind": "text|image|document|audio|video|location|contacts|interactive|template|reaction",  // BR-78
  "body": { … }, "metaMessageId": "…", "sentByUserId": "…|null",
  "status": "pending|sent|delivered|read", "timestamps": { … }, "reactions": [ … ], "replyToMessageId": null }
```
Window rule engine: inbound webhook → `windowExpiresAtUtc = now+24h` (reset, BR-82); composer send allowed iff `now < windowExpiresAtUtc`; template-after-expiry creates NEW conversation doc with `previousRecordId` set.

### 3.4 `transactionStats` (materialized per txn; recomputed on webhook/attempt events)
Delivered/read/played/seen/failed/reply counts + rates, avgDeliveryTimeMs (C13 — displayed), cost by destinationCode, cost by templateType (C10), voice: answered/busy/noAnswer/failed, ivrCompletionRate, avgDurationSec, cost by attempt-n.

### 3.5 `senderIds` (P-2 registry — PROPOSED, Falcon-managed CRUD)
`{ _id, tenantId, channel: "whatsapp|voice", value: "+966…", displayName, status: "active|disabled", meta: { wabaId?, sipAccountRef? }, createdAtUtc }` — feeds compose dropdowns + the SenderID skeleton API (BR-93). Ownership decision (BSA-svc vs templates/meta-svc) = **P-2**; modeled here until overruled.

### 3.6 `destinationMap` (P-3 helper) — `{ prefix: "+9665", code: "SAU" }` seeded from the PRD-03 destination sheet; longest-prefix match resolves the rating axis (GAP-BSA-05).

### 3.7 Infrastructure collections
`bsaOutbox` (Kafka outbox, Charging `WalletOutboxPublisherWorker` pattern) · `idempotencyKeys` (Redis-backed, API `Idempotency-Key` support on sends) · `exportJobs` (S3 pre-signed results, CG-download pattern).

## 4. Engine designs (the core)

### 4.1 Compose pipeline (`POST /bsa/transactions`) — sync validation chain
1. PES `acc.bsa-transaction send` (P8) → 2. app subscription Active (Provisioning) → 3. channel Active (Commerce; else `ChannelNotActive`, BR-08/12) → 4. sender ∈ registry + not PG-restricted (BR-06/07) → 5. template exists + **Approved** + (mine ∪ shared) [templates-svc; BR-23/24/29] → 6. per CG: exists + active + destinationColumn ∈ columns + variableMap covers EVERY template variable (BR-31/33 → `MappingIncomplete`) → 7. manual ≤3, every variable non-empty (BR-32, C3 ruling → `ManualVariablesMissing`), destination E.164-valid (D-2) → 8. scheduled ⇒ `scheduledAtUtc > now` (API rule L466) → 9. persist txn (`status = scheduled|in_progress`), counters.plannedCount = Σ CG counts + valid manual, NO wallet call (P1) → 10. immediate ⇒ enqueue execution; scheduled ⇒ Hangfire delayed job → 11. outbox `bsa.transaction-created.v1`.

### 4.2 Scheduler
- Hangfire delayed job per scheduled txn (`execution.hangfireJobId`) + a safety sweep (every 60s: `status==scheduled && scheduledAtUtc<=now` — catches missed jobs; catch-up policy = Q-BSA-23 default: execute late, never skip silently).
- Delete (BR-74): pre-due only → status `deleted`, Hangfire job cancelled, row retained.
- Edit (BR-72, C5 ruling): pre-due only → full-replace validation re-run (§4.1 steps 1-8), same TXN id, `audit.editHistory` appended, job rescheduled (Q-BSA-16 defaults recorded there).

### 4.3 Execution — common preamble (both channels)
At fire time: re-check channel Active (else txn `failed`, reason "Communication Channel is not active" — BR-09, no retry ever, BR-13) → template still sendable (else `failed`, "Asset Missing" — EC-2/P6) → CGs still exist (else "Asset Missing") → **materialize recipients**: page CG contacts (pageSize = `execution.batchSize`), manual first then CGs in added order (BR-39), normalize destinations, dedup keep-FIRST when `!allowDuplicates` (BR-38; duplicates recorded `skipped.isDuplicate=true`) → write `recipientResults` rows → txn `in_progress`.

### 4.4 WhatsApp batch processor (BR-19/20/43-51/55-57)
```
for each batch B (size = execution.batchSize, D-3):
  if txn.cancel.requested: stop at BATCH EDGE (BR-55) → finalizeCancel()
  for each recipient r in B:
    res = Charging.reserve(ReferenceType="bsa-wa", ReferenceId=r._id,
          ApplicationId=BSA_SKU, Channel="WHATSAPP", Priority="NONE",
          Destination=r.destinationCode, Unit="MESSAGE", Quantity=1,
          ReservationTtlSeconds=cfg.ttl)                      // AlreadyApplied=true ⇒ treat committed-safe
    if res.error == InsufficientBalance:
        if txn.sentCount == 0 → txn=failed("Insufficient balance") (BR-43, EC-1)
        else → txn=partially_processed(reason) (BR-44); stop     // no failover (P4)
    if res.error == NoApplicableRate → txn=failed("No applicable rate — contract configuration")   // §13 risk
    r.resolvedVariables = resolve(r)                           // AT DISPATCH (BR-40)
    send = MetaAdapter.sendTemplate(r)                         // r.wa.sendDateUtc = now (= PRD Send date)
    if send.ok: Charging.commit(res.reservationId); r.wa.status=sent; r.charge=committed; counters+= (BR-46 live)
    else (internal/provider-reject pre-charge): Charging.release(...); r.wa.status=failed (C1)      // refund (BR-19)
    on ReservationNotFound at commit (TTL expiry): re-run reserve→send-verify→commit cycle (Charging contract)
  persist batch counters (processedCount, totalCost) — grids poll these (BR-46)
finalize: all processed → completed | mixed → partially_processed | canceled → finalizeCancel:
  counters := successfully-sent only; unprocessed rows flagged skipped.unprocessedOnCancel (BR-57, D-4);
  response/details reports race outcome (mid-flight vs finished — BR-56, the React dialog contract)
```
Post-commit Meta rejection (webhook `failed` AFTER commit): status→failed, **no BSA refund** — core Wallet Engine per contract rules (EC-3).

### 4.5 Meta adapter + webhook processor
- Adapter: Cloud API template-message send (per-recipient components payload), per-WABA credential resolution (registry §3.5), retry w/ circuit-breaker + idempotency key = `r._id`, DLQ on poison. Template sync (`POST /bsa/templates/{id}/sync`, BR-28/D-5): fetch status+body from Meta → propagate to templates-svc.
- Webhook receiver `POST /bsa/webhooks/meta`: HMAC signature validation (Identity webhook precedent) → normalize statuses `sent|delivered|read|played|seen|failed` → update `recipientResults` by `metaMessageId` (statusDate = latest, BR-60; deliveryDate on delivered) → recompute `transactionStats` → inbound messages: upsert conversation + message, **reset CS window** (BR-82), set `hasReply=true` (BR-61) → emit `bsa.recipient-status-changed.v1`.

### 4.6 Voice engine (BR-21/22/42/64-70)
- Sequential dispatch (bulk = one-by-one, BR-21). Per recipient/attempt:
  1. Pre-call gate: wallet balance > cost(1 second) (BR-22) else txn abort rules as WA (failed/partial).
  2. `SipAdapter.originate(senderId, destination, ivrFlow(resolvedVariables))` → status stream `ringing → live/answered | busy | no_answer | unreachable | failed` (mapping sheet = **P-4**; Live-vs-Answered = Q-BSA-11).
  3. During live call: per-second metering loop — accumulate seconds; debit via Charging (`debit` per N-second tick or single debit at hangup with per-second cap enforcement — implementation detail flagged; exhaustion mid-call ⇒ `SipAdapter.terminate` (BR-21), status per **D-6**.
  4. Attempt row appended (n, status, at, waitMinutes, durationSec, cost) — BR-66; recipient cost = Σ attempts (BR-67).
  5. Retry scheduling: if `voiceRetry.enabled` ∧ attempt.status ∈ voiceRetry.statuses ∧ n < attempts.length+1 → Hangfire delayed job at `waitMinutes` (BR-42; "cancel" trigger semantics = **D-7**).
- IVR runtime: flow from templates-svc (`flow.nodes[].content[].voiceRecordId`), audio via S3 pre-signed, variable audio segments for Dynamic trees, DTMF navigation captured to `ivrPath`, optional recording → `recordingRef` (BR-70).

### 4.7 Stats & exports
- `transactionStats` recomputed incrementally on every webhook/attempt event (WA rates per BR-59 incl. avgDeliveryTime C13; cost by destination + templateType C10; voice per BR-64 + by-attempt).
- Exports (BR-63/69; format **D-9**): async `exportJobs` → build file (details grid + creation date + post-replacement content + all statuses/dates; voice adds full attempt audit trail) → S3 → pre-signed GET (15-min, CG precedent). Available in read-only mode too (BR-14).

## 5. API surface (FULL — all PROPOSED unless noted)

**Conventions:** all under `/api/…` internally, exposed as `/bsa/…` via gateways. Auth = Zitadel Bearer; policy column = gateway policy + PES resource/action. Envelope = `ServiceOperationResult<T>`. Errors = `FalconKeys.Error.*` (§8) with `[ErrorHttpStatus]`.

### 5.1 UI/BFF APIs (consumed by the basic-send-app remote)
| # | Method + path | Purpose (BR) | PES (`acc.` / `sys.` twins) | Request → Response (essentials) |
|---|---|---|---|---|
| 1 | `GET /transactions?channel=&mode=outbox|scheduled&search=&type=&dateFrom=&dateTo=&page=&pageSize=10` | grids (BR-52/53/54; real date filter) | `bsa-transaction view` (creator-scoped; oversight scope = Q-BSA-02) | → `PagedResult<TransactionListItem>` (id, senderId, templateName, language?, type, createdAt, scheduledAt?, recipientCount, totalCost, recipientsSummary[], status) |
| 2 | `POST /transactions` | compose (§4.1) | `bsa-transaction send` | `ComposeTransactionRequest` (channel, senderId, templateId, recipientsSpec, allowDuplicates, timing, voiceRetry?) → `{ id, status, estimatedCost }` |
| 3 | `POST /transactions/quote` | confirm-overlay estimate (BR-36/37; P-3/Q-BSA-03) | `bsa-transaction send` | same spec → `{ recipients, estimatedCost, currency, byDestination[] }` |
| 4 | `GET /transactions/{id}` | details header + counters (live poll, BR-46) | `bsa-transaction view` | → full txn + stats snapshot + statusReason |
| 5 | `GET /transactions/{id}/recipients?status=&page=&pageSize=10` | recipients grids (BR-60/65-67) | `bsa-transaction view` | → `PagedResult<RecipientResult>` (channel-shaped) |
| 6 | `GET /transactions/{id}/stats` | charts (BR-59/64) | `bsa-transaction view` | → transactionStats doc |
| 7 | `POST /transactions/{id}/cancel` | cancel (BR-55-57) | `bsa-transaction cancel` (creator; Q-BSA-24) | → `{ outcome: "canceled|already_completed", processed, charged }` (race-aware, BR-56) |
| 8 | `PUT /transactions/{id}` | edit scheduled (BR-72, C5) | `bsa-transaction edit` | full ComposeTransactionRequest → 200 same id |
| 9 | `POST /transactions/{id}/delete` | delete scheduled (BR-74) | `bsa-transaction delete` | → `{ status: "deleted" }` |
| 10 | `POST /transactions/{id}/exports?kind=details|statistics` | exports (BR-63/69, D-9) | `bsa-transaction export` | → `{ jobId }`; `GET /exports/{jobId}` → `{ status, downloadUrl(presigned) }` |
| 11 | `GET /senders?channel=` | sender dropdowns (BR-06/07; P-2) | `bsa-sender view` | → `[ { id, value, displayName, status } ]` |
| 12 | `GET /templates?channel=&category=&language=` | 3-tier/2-tier cascade (BR-25/26) | `bsa-transaction view` | → façade over templates-svc, filter Approved+own/shared (BR-23/24, C7: filter list AND re-guard at send) |
| 13 | `GET /templates/{idOrRefId}` | variables + body/preview (BR-27) | same | → template detail incl. variables[], body, ivrFlow? |
| 14 | `POST /templates/{id}/sync` | Meta re-sync (BR-28, D-5) | `bsa-transaction send` | → `{ status, bodyChanged }` |
| 15 | `GET /contact-groups` (+`/shared` merged w/ `scope=` param) | CG picker (BR-24/30) | `bsa-transaction view` | → façade over CG-svc: id, name, refId, count, columns[], shared |
| 16 | `GET /channel-state` | Send-button gating + read-only banner (BR-08-14) | `bsa view` | → `{ whatsapp: {status, canSend}, voice: {…}, appActive }` |
| 17 | `GET /conversations/{recipientResultId}` · `GET /conversations/{id}/messages?page=` | conversation open (BR-77) | `bsa-conversation view` | → conversation + chained history refs (BR-84) + `windowExpiresAtUtc` |
| 18 | `POST /conversations/{id}/messages` | composer send (BR-85; window-gated server-side) | `bsa-conversation send` | kind+body → message; `409 WindowExpired` when closed (BR-82) |
| 19 | `POST /conversations/{id}/template` | template-after-expiry (BR-83) | `bsa-conversation send` | templateId+vars → **new chained conversation** id |

### 5.2 Public BSA API (system-to-system; BR-86..94 — deliberately different from UI)
| Method + path | Notes |
|---|---|
| `POST /public/v1/send` | ONE contact group max per request (BR-88) + manual list; template by id **or refId** (BR-89); `Destination/Recipient` column key + `Key=variable name / Value=column-or-value` contracts (BR-90/91); `allowDuplicates`; `sendDate` absent ⇒ now, else must be future datetime (BR-92); detailed field-level errors (BR-94); `Idempotency-Key` header honored |
| `GET /public/v1/templates?channel=` · `GET /public/v1/contact-groups` · `GET /public/v1/senders` | the 3 Skeleton APIs (BR-86/87/93) — same façades as UI 12/15/11 with API-shaped payloads |
| Near-future (PRD L492-496, deferred): status-inquiry APIs, balance-inquiry (Skeleton), partial-processing config, callback config | recorded, not designed |

### 5.3 Webhooks & internal
`POST /webhooks/meta` (signed, anonymous+HMAC) · `POST /webhooks/voice` (provider events) · `GET /health` (anonymous) · Hangfire dashboard (dev-only).

## 6. PES seeding matrix (BuiltInRoleCatalog additions; voice PR 43022 recipe)

| Resource · action | acc-owner | acc-admin | acc-user | sys-admin | sys-support |
|---|---|---|---|---|---|
| `acc.bsa mount` (submenu/app open) | ✔ | ✔ | ✔ | — | — |
| `acc.bsa-transaction view` | ✔ (scope Q-BSA-02) | ✔ (Q-BSA-02) | ✔ own | — | — |
| `acc.bsa-transaction send/schedule` | ✖ default (Q-BSA-01; React demo says Normal-User-only — confirm) | ✖ | ✔ | — | — |
| `acc.bsa-transaction cancel/edit/delete` | ✖ | ✖ | ✔ own (`r.obj.createdby==r.sub.userid`) | — | — |
| `acc.bsa-transaction export` | ✔ | ✔ | ✔ own | — | — |
| `acc.bsa-conversation view/send` | ✖ | ✖ | ✔ own | — | — |
| `sys.bsa view` (Falcon read/review console) | — | — | — | ✔ | ✔ |
Permission-Group overrides = per-user PES policy rules narrowing the defaults (BR-02/06); FE registry gains matching `falcon-access.registry.ts` factories; fail-closed.

## 7. Kafka topics
| Topic | Dir | Payload sketch | Notes |
|---|---|---|---|
| `bsa.transaction-created.v1` | out | txnId, tenant, channel, timing | outbox |
| `bsa.transaction-status-changed.v1` | out | txnId, old→new, reason, counters | drives any downstream analytics |
| `bsa.recipient-status-changed.v1` | out | recipientId, channel status, dates | high-volume; consider batching |
| `commerce.comm-channel-shown/visibility-changed.v1` | in | — | invalidate channel-state cache |
| `commerce.contract-lifecycle.v1` | in | — | quote/rating cache invalidation |
| `commerce.wallet-configured.v1` | in | — | strategy awareness |
Group `falcon-basic-send-svc`; Avro + Schema Registry BACKWARD; consume idempotently.

## 8. Error catalog (FalconKeys.Error.* — en+ar resx, fail-fast completeness)
`BsaChannelNotActive` (403/409) · `BsaAppNotActive` · `BsaTemplateNotApproved` · `BsaTemplateNotFound` · `BsaSenderNotAllowed` · `BsaMappingIncomplete` (field-detailed) · `BsaManualVariablesMissing` · `BsaManualRecipientLimit` (3) · `BsaScheduleInPast` · `BsaTransactionNotFound` · `BsaCancelNotAllowed` (not in_progress) · `BsaEditNotAllowed` (due passed) · `BsaDeleteNotAllowed` · `BsaWindowExpired` (409) · `BsaInsufficientBalance` (mirror of Charging) · `BsaNoApplicableRate` · `BsaDuplicateApiRequest` (idempotency) · `BsaSingleContactGroupOnly` (public API, BR-88) · `BsaExportNotReady`.

## 9. Configuration keys
`Bsa:Execution:BatchSize` (D-3, default 100) · `Bsa:Execution:ReservationTtlSeconds` (≥ batch wall-time) · `Bsa:Voice:MeterIntervalSeconds=1` · `Bsa:Voice:MaxRetryAttempts=3` · `Bsa:Conversation:WindowHours=24` · `Bsa:Meta:{BaseUrl,WebhookSecret,PerWabaCredsRef}` · `Bsa:Sip:{Provider,TrunkRef,WebhookSecret}` · `Bsa:Exports:{Bucket,UrlTtlMinutes=15}` · `ServicesClients:{Templates,ContactGroup,Charging,Commerce,Provisioning,Identity,Access}:BaseUrl` · Kafka/outbox/Redis/Hangfire standard blocks (watch the Charging config-nesting parse trap).

## 10. Deployment & onboarding
1. Repo `falcon-core-basic-send-svc` (5-project clean architecture), Dockerfile, compose service `basic-send` :8080 (host e.g. :7310) + Mongo/Redis/Kafka/MinIO deps — **container up FIRST**.
2. Then gateways: `bsa-cluster` destination `http://basic-send:8080` + route `/bsa/{**remainder}` (Core GW: ClientOnly + PerTenant limiter; System GW: FalconOnly twin) — templates PR 41572/41573 recipe; env override `ReverseProxy__Clusters__bsa-cluster__Destinations__destination1__Address`.
3. PES seeds (§6) + `POST /pes/roles/bootstrap/account/{tenantId}` for existing accounts; FE registry keys.
4. Kafka topics auto-create off ⇒ provision `bsa.*.v1` + schema registration.
5. Meta/SIP secrets via env; webhook public URLs registered with providers (dev: tunnel).

## 11. NFRs & observability
- Throughput: WA batches sized so `batch processing time << ReservationTtlSeconds`; recipients materialization streams pages (never loads full CG in memory; CG-svc pages at 1000).
- Idempotency: every charge keyed `bsa-wa-{txn}:{seq}`; API sends accept `Idempotency-Key`; webhook handlers upsert-by-`metaMessageId` (at-least-once safe).
- Concurrency: optimistic `version` on txn; cancel is a cooperative flag read at batch edges (no thread kill).
- Serilog structured logs per txn/recipient; counters as metrics (processed/s, commit/release ratio, webhook lag); DLQ for Meta/SIP poison messages.
- Live grid updates v1 = FE polling (5s details, 15s grids); v2 = SignalR hub (`bsa.recipient-status-changed` fan-in) — decision deferred.

## 12. Sequence walkthroughs (normative)
1. **Immediate WA send (happy)**: compose(§4.1) → materialize+dedup → per-record reserve→Meta send→commit → counters tick → webhooks flip sent→delivered→read → stats update → completed.
2. **Scheduled voice + retry**: compose(scheduled) → Hangfire fires → preamble re-checks → call attempt 1 `no_answer` (charged 0, attempt row) → retry job +5min → attempt 2 `answered` 18s (per-second debits; cost 3×rate) → completed; details show attempts sub-table (BR-66).
3. **Cancel race**: cancel flag set mid-batch → engine hits batch edge → remaining rows `unprocessedOnCancel` → counters recalc (BR-57) → response says "intercepted mid-flight; X sent & charged, Y not processed & not charged" (BR-56). If engine already finished: outcome `already_completed` — "too late to cancel".
4. **Zero balance at start**: first reserve → `InsufficientBalance` → txn `failed`, reason "Failed - Insufficient Balance", zero messages (EC-1).
5. **Window lifecycle**: recipient replies (webhook) → window=now+24h, hasReply=true → agent free-form OK → 24h pass → composer blocked (`409 WindowExpired`) → template send → NEW chained conversation record (BR-83/84).

## 13. Contract risk register (verify against source before build)

> **The full 20-item register with exact shapes lives in `BE_CONTRACTS.md` §5** (2026-07-06 deep extraction + live probes). Highlights beyond the list below: `PagedResult` naming is `{items,totalCount,pageNumber,pageSize}` (FE-proven, brain's `Page` was wrong); `eWalletBalanceType` order contradiction (FE source: NodeBased=1/UserBased=2 — bind from source, not brain); Provisioning `…Respose` typo is real; Charging Wallet endpoints carry class-level `[Authorize]` only (ownership checks unverified); templates-svc path count drifts per branch commit (42→45).
1. Charging reserve/commit/release **shapes are code-verified but never runtime-exercised** in brain records — run Charging Lab first (its counters validate the loop end-to-end).
2. templates-svc endpoint list = branch `feat/ivr-templete`; merge-to-main unverified (P-1) — the live swagger probe result (see `agents/be-contracts.md`) enumerates paths but auth/DTO detail needs source read.
3. BR-CC-31/32 nearest-expiring-contract cascade marked UNVERIFIABLE server-side (GAP-CC-18) — quote endpoint must confirm which contract rates.
4. Post-commit refunds (late Meta rejects) have NO Charging API (release is pre-commit only) — EC-3 says core Wallet Engine handles it; confirm that engine exists or log as platform gap.
5. Provisioning DTO name `GetAccountApplicationServiceRespose` (typo) — bind exactly.
6. Voice per-second debit granularity vs Charging write-throughput — needs load test; may require windowed debits (e.g. per-5s) with 1s accounting (BR-21 says "almost realtime").
7. `X-Tenant-Id` injection + Falcon-tenantless duality on the System-GW twin — follow gateway conventions doc.
8. SIP provider unchosen (P-4) — the adapter interface isolates this; status mapping sheet required before FSM finalization (Q-BSA-11/13).
