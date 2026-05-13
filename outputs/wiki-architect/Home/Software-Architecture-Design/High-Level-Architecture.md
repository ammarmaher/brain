# High-Level Architecture

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\High-Level-Architecture.md`
**Length:** 485 lines · **Headings:** 28
**Last wiki HEAD seen:** `0d0cb311…`

## Purpose

The platform's **big-picture map**: architecture style, gateway model (BFF + Proxy hybrid via YARP), Kubernetes Ingress edge routing, internal east-west rules, the 7 layers (Frontend, Integration, Communication, Utility, AI, Core, Storage, Identity), key data/messaging flows, and the host-based DNS routing for the three gateways.

## Key rules / decisions

### Architecture style (`High-Level-Architecture.md:5-37`)

**Modular, service-oriented, cloud-native** combining:
- **Microservices** — "independently deployable **gRPC/Kafka-enabled** service" per domain.
- **Micro-Frontend Architecture** — Nx workspace + host shell, dynamic loader, Module Federation / Web Components / custom dynamic loader.
- **API Gateway Pattern** — three gateways (System, Core Services, Platform Services).
- **Event-Driven Architecture** — Kafka topics + **Avro schemas**.
- **Multi-Channel Communication Fabric** — VoIP, WhatsApp API, RCS unified behind abstraction.
- **Security-First** — Zitadel OAuth2/OIDC, end-to-end encryption, centralized policy/audit.
- **Polyglot Storage:** MongoDB OLTP, ClickHouse OLAP, Redis cache.

### The three gateways (`…md:108-133`)

| Gateway | Audience | Used by |
|---|---|---|
| **System Gateway** | Admin Console / platform admins | tenant-wide operations |
| **Core Services Gateway** | Management Console / account users | tenant/account-level operations |
| **Platform Services Gateway** | External micro-apps + partner integrations | messaging, AI, utilities |

Gateways handle: Zitadel auth, throttling/rate limiting, request shaping/aggregation, multi-tenant scoping (`…md:127-133`).

### Gateway Responsibility Model — BFF + Proxy Hybrid (`…md:136-225`)

> **Pass-through Proxy (~90%) + Aggregation/Orchestration (~10%)**

- ~90% of downstream APIs are surfaced as **YARP transparent pass-through routes**.
- ~10% are **custom gateway APIs** that aggregate (e.g. billing overview), orchestrate (e.g. send: rate → reserve → dispatch), shape (UI perf), or enforce domain policies.

**Standardized YARP transforms:**
- Inject tenant context headers (`X-Tenant-Id`).
- Forward correlation IDs (`X-Correlation-Id`).
- Consistent downstream shaping (headers, paths, timeouts).

### Edge routing & internal-service rule (`…md:158-194`)

- **In K8s, the Ingress Controller is the only public routing layer.**
- Ingress routes **only to the three gateways**; downstream services are cluster-internal.
- **North–South** (external) traffic: always through gateways.
- **East–West** (service-to-service) traffic:
  - **gRPC/HTTP** for synchronous calls.
  - **Kafka + Avro** for asynchronous workflows/events.
- **Internal services must NOT call each other through gateways** (coupling, latency, bottleneck).

### Host-based DNS routing (`…md:226-281`)

Each gateway exposed via a dedicated hostname:

| Gateway | Hostname | Used by |
|---|---|---|
| System Gateway | `system-api.falconhub.space` | Admin Console |
| Core Services Gateway | `core-api.falconhub.space` | Management Console |
| Platform Services Gateway | `platform-api.falconhub.space` | External micro-apps, partners |

Internal route segmentation inside each gateway: **`/{service-name}/{**catch-all}`**.

Examples (`…md:289-308`):
- Core Gateway: `/commerce/{**catch-all}`, `/provisioning/{**catch-all}`, `/wallet/{**catch-all}`.
- Platform Gateway: `/messaging/{**catch-all}`, `/ocs/{**catch-all}`, `/ai/{**catch-all}`.

### Tenant IP allowlist enforcement scope (`…md:310-363`)

- **Enforced exclusively in the Core Services Gateway** (the gateway serving the Management Console).
- **Not enforced** in System Gateway (admin) or Platform Services Gateway (integrations).
- Configuration: stored in tenant account settings.
- Cache: Redis-backed projection in Core Gateway.
- Update mechanism: `TenantIpAllowlistUpdated` **Kafka event** (Commerce publishes; Core Gateway consumes).
- Reject status: **HTTP 403 Forbidden** when IP not allowed.

### Layers (`…md:365-446`)

- **2.3 Communication Layer** — VoIP, WhatsApp Business API, RCS (Platform Gateway frontage).
- **2.4 Utility Layer** — File Storage & CDN, Logging & Monitoring, OTP Service.
- **2.5 AI Layer** — NLP, Sentiment, Transcription, Conversational Assistants, Speech (TTS/STT).
- **2.6 Core Layer** — OCS, Provisioning, Content Template Builder, **Access Control Service** (RBAC/ABAC/PBAC, auditing), **Commerce Service** (contracts, pricing, account lifecycle, renewals).
- **2.7 Storage Layer** — **MongoDB (OLTP)** for accounts/tenants/channels/configs/pricing/CDRs/UDRs; **ClickHouse (OLAP)**; **Redis (Cache)** for live balances/statuses/templates/rates/throttling.
- **2.8 Identity Layer** — **Zitadel** OAuth2/OIDC, multi-tenant scopes, token-based auth.

### Key flows (`…md:449-565`)

- **3.1 Micro-App Loading Flow** — Shell loads → Zitadel auth → manifest → bundle from storage → SDK provides context.
- **3.2 Messaging Flow** — Micro-app → Platform Gateway `/messaging/send` → OCS rate/charge → WhatsApp Service → Meta API → callbacks → Kafka analytics → OCS finalize → ClickHouse.
- **3.3 Provisioning Flow** — Admin Console → System Gateway → Provisioning Service → provider API → MongoDB → Kafka → Management Console notification.
- **3.4 Charging Flow** — Event → Gateway → OCS rating → reserve → consume → Redis live balance → MongoDB+ClickHouse CDR.
- **3.5 AI Workflow** — Micro-app → Platform Gateway → Object Storage → AI Transcription → NLP + Summary → return + ClickHouse.
- **3.6 Internal Service Communication** — gRPC sync + Kafka async, strict boundaries.

## Diagrams / images referenced

- `hld-v1-f2a43920-…png` — top-level HLD diagram.

## Cross-references

- Refines `Architecture-Vision.md` goals into concrete containers/components.
- Pairs with `Security-Architecture.md` (Zitadel + Identity Service orchestration), `Front%2DEnd-Architecture.md` (host shell + SDK), `Falcon-Pricing,…OCS-…md` (OCS internals from §3.4).
- Sets the contract `Permissions-&-Authorization-Module-…md` plugs into (PEP-at-gateway, PDP-at-Access-Control-Service).

## Implications for code

**Confirmed against code (per fallback):**
- Both gateways use YARP ✓ (Yarp.ReverseProxy in both csproj — fallback §3.1).
- Core Gateway carries Kafka consumer (`TenantIpAllowlistChangedConsumer`) + rate limiting + IP allowlist middleware ✓.
- Frontend never calls Zitadel directly ✓.
- MongoDB is the dominant OLTP store ✓.
- Kafka is universal async bus ✓.

**Conflicts with code:**
- Wiki says "**gRPC/HTTP** for synchronous" east-west calls. Code uses **HTTP exclusively** (zero `*.proto` files, no `Grpc.AspNetCore`). This was UNVERIFIED in fallback §2.3 — **wiki resolves**: gRPC IS canonical for sync, code is non-compliant. (See also §3.6 "For synchronous calls: gRPC".)
- Wiki names **three** gateways (System, Core Services, **Platform Services**). Code only has TWO (`falcon-int-core-gateway-svc` + `falcon-int-system-gateway-svc`). **Platform Services Gateway has no repo yet** — that's a future-state component, code is behind.
- Wiki says Storage Layer uses **ClickHouse** for OLAP. Code has zero ClickHouse references in csproj. **OLAP tier not yet implemented.**
- System Gateway asymmetry (no Kafka, no IP allowlist, no rate-limiter) is **correct per wiki** — only Core Gateway handles tenant IP/rate-limit per §2.2.3. This downgrades fallback Conflicts §3.4 from "asymmetric without justification" to "asymmetric by design".
- Core Gateway `appsettings.json` route prefixes (`/commerce/**`, `/provisioning/**`, etc.) match wiki §2.2.2 ✓.
- DNS hosts: wiki says `*.falconhub.space`. Deployment Document earlier said `*.falconhub.sa`. **`falconhub.space` is canonical.**
