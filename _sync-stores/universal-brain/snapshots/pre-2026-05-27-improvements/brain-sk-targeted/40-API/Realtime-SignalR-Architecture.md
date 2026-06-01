---
type: architecture-note
domain: api / realtime
created: 2026-05-19
source: Round-3 Opus 4.7 deep-dive (4 plan agents + infra agent)
---
# Realtime SignalR Architecture — Falcon

Deep-dive reference for adding SignalR realtime order-status push to Falcon. Holds the design summary,
the four evaluated plans, and the recommendation. Full detail + 27 diagrams:
`reports/signalr-realtime-deep-dive-report/REALTIME_SIGNALR_REPORT.html`.

## The problem
The do-payment feature settles a payment order asynchronously; the browser learns the outcome by
polling every 2s. A "Wave-4" change built a SignalR push but duplicated the hub + Kafka consumer
inside **both** gateways, with no Redis backplane and an open `JoinOrder` IDOR.

## Recommendation — Plan 1 + emergent-backbone seams (scored 88%)
Build **one dedicated realtime micro-service `falcon-comm-realtime-svc`** — one SignalR hub + one Kafka
consumer + a Redis backplane — reached through the gateways as a thin `/hubs/*` YARP proxy route.
Build it with **three low-cost seams** (~½ day): an `IRealtimeFeature` plug-in interface, a
topic-routed consumer, and an `IGroupNamingRule` contract — so the platform's realtime backbone
*emerges* from the second realtime feature instead of being speculatively over-built now.

Design correctness 93%; overall 88% (the honest delivery cost of a new service holds it in the high-80s —
there are no backend deployment manifests / CI pipeline / service template in the platform, so a new
service is ~4.5–7 days of plumbing).

## The four evaluated plans
| Plan | Score | Verdict |
|---|---|---|
| Recommended — Plan 1 + emergent seams | 88% | Best — design correctness 93% |
| Plan 1 — dedicated service, gateway-proxied | 86% | Strong |
| Plan 4 — unified backbone (full registry day one) | 84% | Right destination, YAGNI-fragile as a first step |
| Plan 2 — dedicated service, direct ingress | 64% | Breaks the wiki "Ingress→gateways only" rule; IP-allowlist bypass |
| Plan 3 — hardened gateway hubs | 63% | Fast (1.5–2 d) but permanent ×2 duplication — sprint-interim only |

## Key design points
- **Redis backplane** (`SignalR.StackExchangeRedis`, channel-prefixed) — mandatory for multi-replica; needed regardless of plan.
- **WebSockets-only** transport — Falcon's deployment forbids sticky sessions.
- **JoinOrder IDOR fix** — audience-aware claim-derived groups: client → `order:{tenantId}:{orderId}` (tenant from JWT, never input); Falcon staff → `falcon:order:{orderId}`.
- **Two-layer auth** — gateway route policy (`FalconOnly`/`ClientOnly`) + the realtime service re-validates the JWT.
- **Reconciliation GET** — one status check on join + on reconnect (Commerce has no outbox, so a push can be missed). No polling loop.
- **Wiki compliance** — the wiki has no gateway-statelessness rule; it does mandate "Ingress → gateways only" (which Plan 2 breaks). Realtime-placement is a genuine wiki gap to fill.

## Related
- [[Kafka-Avro-Architecture]] — the event backbone that drives the realtime push
- Deep-dive report: `reports/signalr-realtime-deep-dive-report/REALTIME_SIGNALR_REPORT.html`
- Prior plan: `reports/W4.2-signalr-realtime-architecture-plan.md`

#type/architecture #realtime #signalr #kafka
