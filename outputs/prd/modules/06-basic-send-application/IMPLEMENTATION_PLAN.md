*** PRD Understanding - Basic Send Application - IMPLEMENTATION_PLAN ***

# BSA Implementation Plan — FE project + BE project (separate), grounded 2026-07-06

> Locked constraints (user + standing rules):
> 1. **Frontend = its own project**; **Backend = its own project**. FE is a **micro-front app that opens inside the existing consoles**.
> 2. React `basic-app.jsx` is the **visual/UX source of truth** for screens; PRD V5 is the **behavior source of truth**. Conflicts already ruled in `GAPS.md` (C1-C14).
> 3. Backend is the platform SoT — nothing below invents existing endpoints; every "exists" claim traces to `PLATFORM_GROUNDING.md`.
> 4. Falcon UI library only (no native HTML controls); API-calling services live in host apps/app project, not shared libs; data tables default page size 10; en+ar i18n lockstep; PES fail-closed.
> 5. No commits/pushes/branches without explicit instruction. This plan does not execute anything.

---

## 0. Shape of the solution

```
┌─ falcon-web-platform-ui (existing NX monorepo) ─────────────────────────────┐
│  host-shell ── admin-console (Falcon)  ── management-console (Client)       │
│                     │ mounts remote          │ mounts remote                │
│                     ▼                        ▼                              │
│  ★ apps/basic-send-app  ← NEW NX PROJECT (Module Federation remote)         │
│    the whole BSA UI: tabs, compose, details, conversation                   │
└──────────────────────────────────────────────────────────────────────────────┘
                       │ HTTPS via gateways (/bsa/*)
                       ▼
┌─ ★ falcon-core-basic-send-svc  ← NEW BACKEND PROJECT (.NET 10, Mongo) ──────┐
│  Transaction store + compose validation      Skeleton facades (tpl/CG/snd) │
│  Scheduler (Hangfire) + batch engine         Conversation store + CS window│
│  Meta WhatsApp adapter + signed webhooks     Voice dialer adapter + retry  │
│  Per-recipient results + stats + exports     BSA public API                │
└───────────────┬─────────────┬────────────┬───────────────┬─────────────────┘
     east-west  ▼             ▼            ▼               ▼
        Charging (reserve/    templates-   contact-group   Commerce/Provisioning
        commit/release/debit, svc (42-path svc (own/shared (channel+app status,
        rating, strategies)   WA+IVR)      +columns+rows)  orders)   + Access PES
```

**FE project decision — D-1 FINAL RULING BY USER (2026-07-07, later same day): INTERNAL in-console feature — NO new MF application.** The basic app lives as a feature folder inside BOTH consoles under `Marketplace & Applications .Mng` (shared implementation at `@falcon/basic-send` + thin per-console wiring), matching BR-BSA-04/05 exactly. The `apps/basic-app` remote built earlier that day is scheduled for removal in Wave M0. Authoritative plan: `REPLAN_INTERNAL_SOT_PARITY.md`. The interim Recipe-B ruling below is history.

~~**FE project decision — D-1 RULED BY USER 2026-07-07: standalone Module-Federation remote (Recipe B).** Ammar instructed: new Angular app at apps/ root level named basic app, federation public on its own port, port registered in the host-shell assets manifest, loads inside the main app on click. EXECUTED same day: `apps/basic-app` (port 4303; 4302 was occupied), manifest entries in all 4 files (staging/prod inactive), manifest-driven sidebar item via `menu[]` (MenuBuilderService — first use), Wave F0+F1 shipped and runtime-verified under host-shell. This supersedes the D-1a lib recommendation below (kept for the record).~~

~~**FE project decision — D-1 REVISED 2026-07-06 (see `ARCHITECTURE_FRONTEND.md` §1 + `FE_WORKSPACE_WIRING.md`):** repo evidence disproved the MF-remote assumption — the only remotes are the consoles themselves; in-console features are lazy route folders + host-shell sidebar children. **Recommended D-1a:** new dedicated **NX library project `libs/basic-send`** (own project.json/build/test = the "separate project") holding all screens behind injected ports; BOTH consoles mount it as lazy routes under `Marketplace & Applications .Mng → Basic Send` with thin per-console adapters (API services over HttpService+useGateway, permissions, routes) — Recipe A wiring. D-1b fallback: `libs/falcon/src/shared-features/basic-send/` (existing lighter convention, not a separate project). A true MF remote (Recipe B, fully documented) is REJECTED for v1 — it mounts outside the consoles, contradicting BR-BSA-04/05.~~
**BE project decision (recommended):** new repo `falcon-core-basic-send-svc` next to the other 9 services, same clean-architecture skeleton, own Mongo DB (`FalconBsaDb`), routed through BOTH gateways as `bsa-cluster` (`/bsa/{**remainder}`, ClientOnly on core-gw; FalconOnly twin on system-gw). Deploy into the local compose stack the same way templates-svc was onboarded (add container BEFORE gateway routes — YARP crashes otherwise; see PLATFORM_GROUNDING §4.1).

---

## 1. Backend plan — `falcon-core-basic-send-svc`

### 1.1 Service skeleton (Wave B0)
- .NET 10, 5-project clean architecture (`Api/Application/Contracts/Domain/Infrastructure`), FastEndpoints+Mediator style (Identity/CG/Templates precedent), `ServiceOperationResult<T>` envelope, `FalconException` + `ErrorMessages.{en,ar}.resx` + `ValidateResourceCompleteness()`, `[ErrorHttpStatus]` mapping (adopt Commerce's attribute — Charging's absence left statuses inferred), Serilog, `/health`, Swagger dev-only, Mongo `FalconBsaDb` + index initializer, Redis idempotency/locks, Hangfire (CG-svc precedent), Kafka Avro + Schema Registry + **outbox pattern** (Charging `WalletOutboxPublisherWorker` precedent), consumer group `falcon-basic-send-svc` (do NOT copy Charging's `commerce-service` group misconfig).
- Typed east-west HttpClients: Templates, ContactGroup, Charging, Commerce, Provisioning, Identity, Access(PES).
- **Claims gotcha:** decode `user-id` from `urn:zitadel:iam:user:metadata` yourself (ZitadelClaimsTransformation drops it — Commerce's CreatedBy-null bug). "Logged-in user" scoping (BR-BSA-52) depends on it.
- Gateway onboarding: compose service first, then `bsa-cluster` + routes in both gateways (+ compose env overrides) — templates-svc PR 41572/41573 recipe.

### 1.2 Domain model (Wave B0, from ENTITIES.md)
- `SendTransaction` aggregate: id (TXN-…), tenant/node, creatorUserId, channel (WA|Voice), senderId, templateRef {id, refId, name, category, language|null}, recipientsSpec (CG list in added order w/ per-CG destinationColumn + varMap; manual list ≤3 w/ per-recipient var values), allowDuplicates, timing {immediate | scheduledAtUtc}, voiceRetryConfig {statuses⊆(no_answer,busy,cancel,failed), attempts≤3 w/ waitMinutes}|null, status FSM (Scheduled→InProgress→{Completed,PartiallyProcessed,Failed,Canceled} + Deleted from Scheduled), counters {plannedCount, processedCount, totalCost, estimatedCost}, failReason, audit stamps.
- `RecipientResult` per recipient: destination, source (manual#n | cg:id:rowRef), resolvedVars, WA status (Pending/Sent/Delivered/Read/Played/Seen/**Failed** — conflict C1 ruling adopts Failed), voice status (11 statuses), sendDate/deliveryDate/statusDate, messageCost, hasReply, attempts[] {n, status, at, waitMin, cost} (voice).
- `ConversationRecord` (WA): id, recipient, senderId, originTxn/message, windowExpiresAt, messages[], **chain: previousRecordId** (BR-BSA-83/84), lifecycle.
- FSM invariants exactly per WORKFLOWS.md §3a-3d (triggers quoted there).

### 1.3 Read facades — the 3 Skeleton APIs + gating reads (Wave B1)
- `GET /api/bsa/templates?channel=` → templates-svc; filter **Approved + (createdBy me ∪ shared with me)**; shape per API.md (type, name, language?, templateId, referenceId, variables[]). ⚠ templates-svc endpoint inventory is on branch `feat/ivr-templete` (42 paths, brain registry stale) — **[PREREQ P-1: confirm merge-to-main + enumerate the exact template/IVR read endpoints]**.
- `GET /api/bsa/contact-groups` → CG-svc own + shared + details (columns/aliases) + `GET …/{id}/contacts` paging for the engine.
- `GET /api/bsa/senders?channel=` → **BLOCKED: no WABA or SIP sender registry exists anywhere** (CONFIRMED-ABSENT). **[PREREQ P-2: sender-ID registry — own it in BSA svc (simple tenant-scoped CRUD, Falcon-managed) or in templates/meta service; decision needed]**.
- Channel-status read for gating: Commerce `GET /api/Node/{id}/comm-channels` (+ Provisioning subscription status) — consume statuses {None,InActive,Active,Expired,Disabled} + grace semantics (BR-AM-21/23).
- App-activation read: Commerce visible/details or Provisioning `GET /api/Services/account/{id}/applications` — drives "is BSA purchased+Active for this account".

### 1.4 Compose + schedule + quote (Wave B2)
- `POST /api/bsa/transactions` — full compose validation: template Approved + owned/shared (re-verify server-side), CG mapping completeness (destination + every variable per CG — BR-BSA-31/33), manual ≤3 with ALL vars (BR-BSA-32; conflict C3 ruling: enforce at send), sendDate > now (API rule), channel Active, PES allow. Persists transaction; NO balance touch (BR-BSA-18). Scheduled → Hangfire job at due time; also emit `bsa.transaction-created.v1`.
- `POST /api/bsa/transactions/quote` — cost estimation (destination × category × count × active contract, + expected call time voice). **No dry-run rating API exists in Charging** — either (a) new Charging quote endpoint or (b) BSA-side rate-card read. **[PREREQ P-3 / Q-BSA-03: estimation source + formula sign-off]**. Also needs **destination resolution** (phone → Destination axis) which has no runtime service — part of this wave (config table from the PRD-03 destination list sheet).
- Edit scheduled (BR-BSA-72, ruling C5): `PUT /api/bsa/transactions/{id}` pre-due only, full replace, same TXN id (Q-BSA-16 default: keep id, re-run confirmation client-side; log audit).
- Delete scheduled: `POST …/{id}/delete` pre-due only → status Deleted, row retained (BR-BSA-74).
- Cancel: `POST …/{id}/cancel` on InProgress → cooperative flag; engine stops at next batch edge; response reports race outcome (mid-flight vs already-finished — BR-BSA-56; the React race-aware copy is the UX contract).

### 1.5 WhatsApp execution engine (Wave B3 — the core)
- Trigger: immediate dispatch or Hangfire due-time fire → re-checks at execution: channel Active (else Fail w/ "Communication Channel is not active" — BR-BSA-09), template still Approved/sendable (else Fail "Asset Missing" — EC-2 + GAP-TM-15 ruling: BSA owns send-time sendability), CG still exists/active.
- Ordering: manual recipients FIRST, then CGs in added order (BR-BSA-39); dedup keep-first when !allowDuplicates (BR-BSA-38; normalization rule = Q-BSA-17 **[DECISION D-2: E.164-normalize before comparing]**).
- Batching: page CG contacts (CG-svc precedent 1000); per record/batch: Charging `POST /api/Wallet/reserve` (`ReferenceType='bsa-wa'`, `ReferenceId='bsa-wa-{txnId}-{seq}'` — idempotent, `AlreadyApplied`=success; Charging-Lab-proven loop) → variable replacement (per-recipient, at dispatch = Send date, BR-BSA-40) → Meta send → `commit`; internal failure pre-send → `release` (refund). Insufficient balance: before ANY record → txn Failed; mid-way → finish as PartiallyProcessed with reason (BR-BSA-43/44). Batch size + TTL sizing: processing window < ReservationTtlSeconds (default 300) — **[DECISION D-3: batch size; drives cancel granularity Q-BSA-06]**.
- Q-BSA-08 resolution (recommended): the reserve→commit|release primitive IS both PRD paragraphs (deduct-first ≈ reserve; refund ≈ release) — ratify with product.
- Live counters: processedCount/totalCost updated per batch (BR-BSA-46) → FE polls (v1) or SignalR (later).
- Post-cancel recalc: counters = successfully sent only; unprocessed excluded from count+cost (BR-BSA-57); unprocessed recipient rows retained marked not-processed (Q-BSA-12 **[DECISION D-4]**).

### 1.6 Meta integration (Wave B3/B4)
- **Meta Cloud API adapter**: template message send (per-recipient var payloads), credential resolution per WABA; retry/circuit-break/idempotency — the wiki's Template-Management BRD designs this adapter family (design-only today).
- **Signed webhook receiver** (Identity's `x-zitadel-signature` HMAC pattern): message statuses Sent/Delivered/Read/Played/Seen/**Failed** → RecipientResult updates (statusDate = latest — BR-BSA-60) + reply capture (hasReply + conversation inbound + CS-window reset — BR-BSA-82).
- Template sync-on-select (BR-BSA-28 "we suggest"): `POST /api/bsa/templates/{id}/sync` → Meta status+body refresh propagated to templates-svc. **[DECISION D-5: commit or defer; PRD marks it suggestion]**.

### 1.7 Voice execution engine (Wave B5)
- SIP/dialer adapter (NO platform precedent — greenfield): originate call, map SIP statuses → the 11 PRD statuses (mapping sheet unresolved — Q-BSA-11 **[PREREQ P-4: obtain the SIP mapping sheet]**), stream call-progress.
- Sequential dispatch (bulk = one-by-one), pre-call gate balance > 1s cost, per-second debit loop on Charging realtime substrate (`ocs:realtime-events` names VOICE a hot channel; engine itself is new), terminate on exhaustion (BR-BSA-21/22; status per Q-BSA-13 **[DECISION D-6]**).
- Retry engine: per-recipient scheduled re-attempts (≤3) on configured trigger statuses with waits; attempt audit rows; "cancel" trigger semantics = Q-BSA-10 **[DECISION D-7]**.
- IVR rendering: per-recipient variable-resolved audio path from templates-svc IVR flow (`flow.nodes[].content[].voiceRecordId` + S3 presigned audio) + DTMF navigation + optional call recording (BR-BSA-70).

### 1.8 Conversation + CS window (Wave B6)
- Conversation store per (recipient × sender); 24h window: starts/resets on RECIPIENT inbound (webhook), countdown server-computed (`windowExpiresAt`), free-form send blocked when expired (template-only), template-after-expiry creates NEW chained record (BR-BSA-83/84).
- Free-form message send (text/emoji/attachment/voice-note via Meta within window); message actions; search is FE-side over fetched thread.
- Charging of conversation messages: Q-BSA-22 **[DECISION D-8]**.

### 1.9 Stats, exports, API productization (Wave B7)
- Aggregations per transaction (rates, cost by destination/template-type/attempt, avg delivery time / call duration / IVR completion).
- Exports: details + statistics (format Q via GAPS "PRD-only #7" — CSV/XLSX **[DECISION D-9]**), S3 presigned like CG downloads.
- BSA public send API hardening: single-CG-per-request rule (BR-BSA-88 differs from UI multi-CG — keep), Key=variable-name/Value=column-or-value contracts, refId lookup, "detailed and meaningful errors"; future system-user auth (API keys — ABSENT platform-wide, defer).
- PES: seed `acc.bsa-transaction` (view/send/schedule/cancel/delete/edit/export/converse) + `acc.bsa` mount in `BuiltInRoleCatalog.cs` + FE registry keys — voice-record PR 43022 recipe; creator-scoped rules via `"r.obj.createdby"=="r.sub.userid"`; do NOT reuse `acc.services` (denies acc-user). Permission-Group overrides ride PES policy rules (BR-BSA-02/06).
- Kafka: `bsa.transaction-created.v1`, `bsa.transaction-status-changed.v1`, `bsa.recipient-status-changed.v1` (+ consume commerce channel-visibility + contract-lifecycle + wallet-configured events).

## 2. Frontend plan — `apps/basic-send-app` (NX Module-Federation remote)

### 2.1 Project setup (Wave F0) — REVISED per D-1a
- New NX **library** project `libs/basic-send` (Angular 21.2.9 zoneless, standalone, signals; Tailwind v4 tokens; PrimeNG is fully removed from the platform — falcon-ui-core wrappers only); mounted as lazy routes by admin-console (Falcon read/review) + management-console (client) under `Marketplace & Applications .Mng` via Recipe A (FE_WORKSPACE_WIRING: PES registry block, parent+children route restructure, host-shell sidebar children with slug parity, shared en/ar.json `basicSend` namespace, per-console API services); submenu gated by PES `acc.basic-send view` + app-subscription Active — the CommChannels/Voice-submenu precedent.
- API services **inside this app project** (standing rule: API code stays in host app — the remote IS the host-app layer for BSA), pointed at `<gateway>/bsa/*`.
- i18n en+ar from day one (React reference is `t.bsaKey ||` fallbacks — key inventory in REACT_HOST_INTEGRATION); RTL via logical properties (reference CSS already logical-property-heavy).
- Visual parity target: `basic-app.css` (bsa-* namespace) translated to Tailwind tokens + falcon-ui-core components ([[Falcon Data Table]], [[Falcon Tabs]], [[Falcon Dropdown]], [[Falcon Dialog]], [[Falcon Status Badge]], [[Falcon Date Picker]], [[Falcon Paginator]], [[Falcon Empty State]], [[Falcon Toggle]], [[Falcon Search Input]]…); status-pill palette table in REACT_REFERENCE §2.3 is the color SoT.

### 2.2 Waves (each = build vs React reference + PRD rulings; every grid page-size 10)
- **F1 — Shell + landing**: WhatsApp|IVR Voice tabs, Outbox|Scheduled sub-tabs, grids (exact WA columns BR-BSA-53 / voice BR-BSA-54 + C2 ruling: ADD voice Send Date + Message Cost), search + type filter + **real date-range filter** (reference chip is decorative — PRD-only gap #19), recipients `+N` popover, status pills, row menus (Details/Edit/Cancel/Delete gating per status), pagination. Channel-status gating: Send button disabled per channel status; both-down → read-only banner + exports still on (BR-BSA-08..14). Role reality: Send visible per PES (not the demo role-dropdown; Q-BSA-01 pending → default: Normal User sends, AO/NA see read-only).
- **F2 — Send Whatsapp Message**: 3-section takeover; 3-tier cascade w/ resets; VARIABLES chips; Meta-status warning + reselect; locked-until-template Recipients; CG picker (Created by me|Shared with me + search); per-CG mapping card (map-to dropdowns w/ move-on-reassign, red invalid, progress pill, sample rows, NO auto-map); manual ≤3 grid (destination + all vars enforced at send — C3 ruling; E.164 validation **added** vs reference free-text); phone preview w/ first-recipient substitution; Immediate|Schedule with **persisted** datetime; confirm overlay w/ **server quote** + duplicates toggle **persisted**; summary strip.
- **F3 — WA details + cancel**: header + banners (failReason/deleted/scheduled/in-progress w/ live progress), KPI row, 6-bar stats + **Average Delivery Time displayed** (C13), cost breakdown incl. **by template type** (C10), recipients grid (7 statuses incl. Failed) w/ real pagination, per-recipient phone preview, race-aware cancel dialog, **working exports**. In-progress refresh: poll 5s (v1).
- **F4 — Scheduled + edit/delete**: frozen scheduled details (zeros, Pending, 0-attempts voice — C9), delete confirm (exact PRD copy), **true edit** (full prefill incl. cat/lang/schedule; PUT same TXN; re-confirm overlay).
- **F5 — Send Voice IVR Message**: 2-tier cascade, retry logic UI (chips + ≤3 attempts w/ waits) **persisted**, IVR canvas preview (readonly; node-tap playback), CG/manual identical to F2, voice quote.
- **F6 — Voice details**: call stats + IVR completion/avg duration, cost by destination + **by IVR type** (C10) + by attempt, expandable attempts sub-table, IVR canvas + transcript + call description, recorded-call playback (design fresh — reference modal is orphaned), conversation entry.
- **F7 — WhatsApp Conversation**: msg-info panel, thread (template-card first + **history chaining UI** — C8), 11 message types (**add Video/Location/Contacts/Interactive** — PRD-only #14 + Download Attachment), actions gated by window, in-thread search, **live CS-window countdown from server `windowExpiresAt`** (reset on inbound; expiry flips composer), composer (text/emoji/attach/voice-record/template), template-after-expiry → compose fromConversation mode → staged card → new chained record.
- **F8 — Voice conversation**: IVR walk playback + DTMF + ended notes + cross-channel follow-up buttons. (AI-handoff demo: **cut from v1** unless product says otherwise — code-only #14.)
- **F9 — Marketplace integration**: purchase path (AO/Falcon gate via PES), card→app navigation + submenu dual-path (C12), post-purchase submenu appearance.
- **DO NOT PORT**: the 10 dead/orphaned reference paths (REACT_REFERENCE §6 items 28-36), perspective-picker/role-dropdown demo chrome, Ask-AI drawer (**[DECISION D-10: ship or cut]**), live-ticker fakery, Simulate-expiry link.

### 2.3 FE↔BE contract per wave
F1←B1 (lists+gating reads), F2/F5←B2 (compose/quote) — F2-F5 can start against B1 mocks-in-service layer but MUST NOT ship before B2/B3; F3/F6←B3/B5+B7; F7/F8←B6; F9←existing Commerce/Provisioning only.

## 3. Sequencing, gates, decisions

**Critical path:** B0→B1→B2→B3(WA engine+Meta)→B7 ‖ F0→F1→F2→F3→F4 → **WA MVP** (purchase→compose→send→track→cancel→export). Voice (B5,F5,F6) and Conversation (B6,F7,F8) stack after; Voice depends hard on P-2 (SIP senders) + P-4 (mapping sheet).

**Wave gate (every wave):** build green + unit tests + PES fail-closed check + i18n lockstep + visual parity vs reference screenshots + no native-HTML-control violations. QA per wave via ammar-qa-web E2E against local stack; charging loop verified against Charging Lab counters before Meta go-live.

**Open decisions/prereqs blocking full spec:** D-1 FE project placement · D-2 dedup normalization · D-3 batch size · D-4 canceled-recipient rows · D-5 Meta sync commit · D-6 exhaustion status · D-7 retry-cancel semantics · D-8 conversation-message charging · D-9 export format · D-10 Ask-AI · P-1 templates-svc merge/endpoints · P-2 sender registries · P-3 quote source · P-4 SIP mapping sheet · plus purchase-model reconcile (V2 auto-avail vs V5 purchase) and Q-BSA-01/02 role scope — full list QUESTIONS.md + GAPS.md.

**Estimate shape** (relative, not committed): B0/B1 small · B2 medium · B3+Meta large (the wiki BRD already sized Meta webhook+state machine alone at 3-4 weeks) · B5 large+external-dependency · B6 medium · B7 medium ‖ F1-F2 large (the compose screen is the densest UI) · F3-F6 medium each · F7 large. WA MVP ≈ B0-B3+B7(part)+F0-F4.
