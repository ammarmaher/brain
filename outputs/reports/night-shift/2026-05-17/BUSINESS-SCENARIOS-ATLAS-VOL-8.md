---
type: business-scenarios-atlas
volume: 8
title: "Falcon Business Scenarios Atlas — Volume 8: Scaling Reality (10k → 100k → 1M users; 100k → 10M msgs/day)"
purpose: "Where the platform bends at each scale milestone. Hot paths, bottlenecks, growth math, and what to load-test first. The doc to open before any enterprise sales pitch involving large clients."
volume-8-deep-dives: 4
---

# Falcon Business Scenarios Atlas — Volume 8

> The question every enterprise prospect asks: "Can you handle our volume?" This volume answers honestly, milestone by milestone. Source-prefixed where code evidence exists; clearly marked `[INFERRED]` where it's reasoning about architecture not yet load-tested.

---

## DEEP-DIVE 34 — Where Falcon Actually Spends Time: The Hot-Path Map

Before scaling math, understand which code paths actually run frequently:

### Hot paths (in descending volume order)

| Path | Frequency | Service(s) | Latency budget | Sensitivity |
|---|---|---|---|---|
| **Send Transaction** | per-message (highest volume) | App → Charging → Mongo | <100ms | Latency = customer experience |
| **PES authorize** | per backend API call | Access service | <20ms | Adds latency to every action |
| **PES authorize/resources** | per FE page load | Access service | <100ms (parallel calls) | Cold start UX |
| **Wallet balance read** | per session, polling | Charging | <50ms | Dashboard refresh rate |
| **Org Hierarchy tree fetch** | per page load | Commerce | <200ms | First-load UX |
| **User list with pagination** | per Users tab open | Identity | <300ms | List size affects this |
| **Login (full chain)** | per session start | Identity + Zitadel | <2s (multi-step) | Auth flows are slow by nature |
| **Kafka publish** | per state change | Commerce, Identity, Charging | <50ms publish; consumer lag <1s | Affects time-to-mirror |
| **Webhook receive (Zitadel)** | per Zitadel event | Identity | <500ms | Eventual consistency |

### Cold paths (less frequent but worth knowing)

- Add Client wizard: ~minutes (one-off per client)
- Add Contract: ~minutes (rare per account)
- Contract auto-status transition (Pending → Active → Expired): daily background job
- Wallet topology change: rare (Falcon-only)
- Permission Group edit: per-edit, low volume

---

## DEEP-DIVE 35 — Data Growth Math (where storage and indexes matter)

### Per-tenant data growth assumptions

For a "typical" mid-size client:
- 50 users
- 5 contracts over the engagement lifetime
- 10 active CommChannels
- 100 ContactGroups, 10k contacts each
- 50,000 transactions per day

**Annual storage impact per such tenant:**

| Entity | Rows per year | Bytes per row (est) | Annual GB |
|---|---|---|---|
| User | 50 (steady) + 50 audit transitions | 2 KB | 0.0002 GB |
| UserStatusHistory | ~50/year | 200 B | tiny |
| LoginAttempt | ~50 users × 250 days × 5 logins = 62k | 200 B | 0.012 GB |
| Session | ~62k (some persisted, most expire) | 500 B | 0.03 GB |
| Contract | 1-2/year | 50 KB (full grid) | 0.0001 GB |
| ContactGroup | 100 | 1 KB (metadata) | 0.0001 GB |
| ContactGroupRecord | 100 × 10k = 1M records (static) | 200 B | 0.2 GB |
| WalletRecord | 50k/day × 365 = 18M records | 100 B | 1.8 GB |
| TransferTx | 50k/day × 365 = 18M records | 200 B | 3.6 GB |
| **Total per tenant per year** | | | **~5.7 GB** |

### Scale projections

| Scale | Tenants | Total annual storage growth | Cumulative after 3 years |
|---|---|---|---|
| Small (today) | 10 | 57 GB/yr | ~170 GB |
| Medium | 100 | 570 GB/yr | ~1.7 TB |
| Large | 1,000 | 5.7 TB/yr | ~17 TB |
| Enterprise | 10,000 | 57 TB/yr | ~170 TB |

**Where this matters:**
- Mongo storage cost (linear with data)
- Mongo backup time (linear with data — restore is slow at TB scale)
- Mongo index size (must fit in RAM for good performance — at TB scale, indexes need careful pruning)
- Query latency (if indexes evict from RAM, queries get slow)

### The breaking point — [INFERRED]

Mongo on a single replica set comfortably handles up to ~5-10 TB of working data. Beyond that:
- Sharding becomes mandatory (Mongo supports it; needs ops investment)
- Read replicas help reads but not writes
- Some tables (WalletRecord, TransferTx) grow indefinitely — need archival strategy

**Decision point:** at ~1k tenants (or sooner if individual tenants are huge), invest in:
- Sharding strategy (shard by tenantId? by date?)
- Cold-data archival (move TransferTx older than X years to slow storage)
- Index analysis (drop unused indexes; ensure hot queries are indexed)

---

## DEEP-DIVE 36 — Specific Scaling Milestones (10k → 100k → 1M users)

### Milestone 1: 10k users across all tenants

**Today's state likely:** Comfortable. Mongo handles this easily on a single primary. Kafka likely under-utilized. Identity service handles 10k logins/day without breaking sweat.

**Pain points to watch:**
- Org Hierarchy tree fetch for large accounts (if one account has 10k users, the tree gets expensive)
- User list pagination (already in place per `ListNodeUsersRequest.PageSize`)

### Milestone 2: 100k users

**Likely bottlenecks:**
- Org Hierarchy tree fetch: deep trees (e.g., 5 levels of sub-nodes) generate large response payloads. **Recommend: server-side tree pagination + lazy loading.**
- PES authorize/resources: one call per page load × peak users = high QPS. **Recommend: result caching with short TTL (30-60s) per (userId, page). Invalidate on Permission Group change.**
- Login flow latency: Zitadel auth + Identity processing + JWT issuance. **Recommend: connection pooling to Zitadel.**

**What works at this scale:**
- WalletRecord append-only writes scale linearly
- Most read endpoints have proper pagination

### Milestone 3: 1M users

**Architecture changes likely needed:**
- Mongo sharding (probably shard by tenantId)
- Identity service horizontal scaling (multiple instances behind load balancer)
- PES caching becomes mandatory (uncached PES calls @ 1M users = many tens of thousands QPS)
- Kafka cluster (multi-broker) for throughput
- CDN for static assets (already likely in place via host-shell)

**Specific PRD-relevant concerns:**
- IP allowlist enforcement: per-login check might benefit from in-memory cache of (tenantId → allowedIps[]) — refreshed every X seconds
- OTP delivery: 60s validity × peak concurrent OTPs = pressure on email/SMS providers. Provider QPS limits become real.
- Session.idleTimeoutAt cleanup: bg job must scale (or sessions don't expire cleanly)

### Milestone 4: 10M users (theoretical)

Beyond current likely needs of any single Falcon client base. Architecture would require:
- Multi-region deployment
- Stronger eventual consistency tolerance
- Specialized read paths (e.g., CQRS)
- Operational complexity dramatically increases

For Saudi market with B2B CPaaS, **10M total users across all clients** is the realistic upper bound for the foreseeable future. Don't over-engineer.

---

## DEEP-DIVE 37 — Specific Messaging Volume Milestones (100k → 10M messages/day)

### 100k msgs/day across all clients

**Per-message cost (Falcon's compute, not message price):**
- 1 wallet check (~5ms)
- 1 contract lookup (~5ms)
- 1 WalletRecord update (~10ms write)
- 1 Charging-to-Application dispatch (~varies)
- 1 audit log write (~5ms)

100k/day = ~1.2 msgs/sec average, but peak is ~10 msgs/sec.
At 10 msgs/sec with ~30ms per message: easily handled by current architecture.

### 1M msgs/day

10x → average 11.5/sec, peak ~100/sec.
At 100 msgs/sec: 100 concurrent wallet operations on Mongo. Mongo handles this but starts to feel it.

**Optimizations to consider:**
- Batch WalletRecord writes (deduct multiple recipients in one transaction)
- In-memory wallet balance cache with write-through to Mongo (riskier but faster)

### 10M msgs/day

100x today → average 115/sec, peak ~1000/sec.

**This is where major architecture changes are needed:**
- WalletRecord write throughput: at 1k writes/sec sustained, single-primary Mongo struggles. Sharding mandatory.
- Contract iteration (nearest-expiring): cache the ordered list per account in Redis with TTL
- Send Transaction API endpoint: needs to be horizontally scaled with stateless workers
- Kafka: partitioned topics by accountId for parallel consumer scaling
- Application dispatch: rate limits at WhatsApp/Voice provider become the bottleneck (not Falcon)

### 100M msgs/day (theoretical hyperscale)

Multi-region, queue-based architecture. Probably not realistic for Falcon's market in the next 5 years. Skip.

---

## DEEP-DIVE 38 — Specific Bottleneck Scenarios to Plan For

### Bottleneck 1: Contract iteration on Send Transaction

**The problem:** For each Send Transaction, the system iterates nearest-expiring Active contracts (BR-CC-31). If an account has 20 Active contracts simultaneously, that's 20 lookups per message.

**The math:** 10 active contracts × 1M msgs/day = 10M lookups/day = ~120 lookups/sec sustained. Each lookup is a Mongo read.

**Mitigation:**
- Cache the ordered Active contracts list per accountId in Redis (TTL: 1 hour or until contract status change event)
- Invalidate on Contract status change (Active → Expired → Active extension)
- Cost: Redis (cheap), code complexity (medium)

### Bottleneck 2: PES authorize on every action

**The problem:** Every backend action calls PES to check permissions. At 1M users with 100 actions/user/day = 100M PES calls/day = ~1200 QPS.

**Mitigation:**
- Per-(userId, resource, action) cache with TTL of 30-60s
- Invalidate on PermissionGroup change OR User.status change
- Cost: Redis (cheap), correctness risk (slight — stale permissions for up to 60s)

### Bottleneck 3: Login flow latency

**The problem:** Each login = Zitadel call + Identity processing + JWT issuance. At 1M users with 1 login/user/day = 1M logins/day = ~12 logins/sec average, ~100/sec peak.

**Mitigation:**
- Async Zitadel calls (overlap with other work)
- Connection pool to Zitadel
- JWT issuance is local (no external call)
- Cost: low

### Bottleneck 4: Webhook backlog from Zitadel

**The problem:** If Zitadel emits many events (lockouts, profile updates) and Falcon Identity processes them sequentially, backlog grows.

**Mitigation:**
- Async processing: webhook receives → enqueue → process → respond 200
- Queue: Kafka topic or in-memory queue with persistence
- Cost: medium (need durable queue)

### Bottleneck 5: Mongo index growth

**The problem:** As tables grow, indexes grow. If indexes exceed RAM, queries get slow.

**Mitigation:**
- Periodic index analysis: identify unused indexes (Mongo can report this)
- Drop unused indexes
- For tables with skewed access (recent data > old), consider partial indexes
- Archive old data (TransferTx > 7 years → cold storage)

---

## What to LOAD TEST FIRST

Priority order based on business impact + risk:

1. **Send Transaction at peak** — 1000 msgs/sec for 1 hour sustained, observe Mongo CPU + Wallet write latency + Kafka lag. **Most business-critical.**
2. **PES authorize at peak** — 5000 QPS for 30 min, observe Access service CPU + Mongo read latency.
3. **Login flow at peak** — 100 concurrent logins, observe Zitadel rate limits + Identity processing time.
4. **Org Hierarchy tree fetch** — deep tree (5 levels, 1000 nodes), observe Commerce response time + payload size.
5. **Webhook backlog** — simulate 1000 Zitadel events in 10 seconds, observe Identity processing + Mongo state convergence time.

### Open question: have we done ANY load testing?

[INFERRED] — Likely not in a formal/sustained way. Recommend:
- Stand up a perf-test environment matching prod
- Use realistic data volumes (seed with synthetic data)
- Run each load scenario weekly during business hours
- Track metrics: P50/P95/P99 latency per endpoint
- Establish SLOs (Service Level Objectives) per endpoint

---

## Business implications

| Question | Answer |
|---|---|
| "Can Falcon support a client with 100k users?" | Yes, with monitoring. May surface bottlenecks first time. Load test before committing. |
| "Can Falcon support 1M users?" | Yes architecturally, but requires investments: sharding, caching, horizontal scaling. ~6-12 months of platform work + ops investment. |
| "What breaks first as we scale?" | Likely WalletRecord write throughput (Mongo primary write bottleneck). Then PES caching becomes mandatory. Then Mongo sharding. |
| "What's the cheapest scale-up?" | Add Redis caching layer in front of: (1) Active contracts list per account, (2) PES authorize results. Modest infra cost, big latency wins. |
| "When should we plan for sharding?" | When total Mongo data approaches 5 TB OR when sustained write QPS exceeds ~500/sec. Whichever comes first. |
| "Can we sell to a client with 10M msgs/day expectation?" | Conditionally. Tell them honestly: "This is at the edge of our current architecture. We need 6-12 months prep work + their commitment to phased rollout." |

---

## Continuous mining queue update

Volumes 1-8 = 37 scenarios + 4 compliance maps + 4 scaling deep-dives = 45 deep analyses.

Remaining queue:
- **Vol 9:** Operational runbooks (incident response, data recovery, key rotation)
- **Vol 10:** Bulk operations design space (Q-UM-11 OPEN)
- **Vol 11:** Multi-language Template behavior
- **Vol 12:** Knowledge graph navigation patterns
- **Vol 13:** CPaaS competitor positioning (Twilio, Vonage, MessageBird, regional)

---

*Falcon Brain Forever-Wave · Continuous business deep-diving · Vol 8 (scaling) written 2026-05-18 · 45 deep-dives total.*
