# Deployment Document (Dev Servers Specs & Env Setup)

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Deployment-Document-(Dev-Servers-specs-&-Env-setup).md`
**Length:** 104 lines · **Headings:** 16
**Last wiki HEAD seen:** `0d0cb311…`
**Status:** Draft v0.1 (3 Dec 2025, Noor Joudeh) — many sections still `[ToDo]`.

## Purpose

Infrastructure/network/security hand-off document for the QC (test) environment: VM sizing, firewall, ports, DB sizing, deployment diagram. Audience is Infrastructure / Network / Security teams.

## Key rules / decisions

### Technology stack (`Deployment-Document-…md:31-41`)

1. **.NET Core 10**
2. **Angular 20**
3. **Kafka**
4. **MongoDB 8.2**
5. **Redis 8.4**

### Protocols supported (`…md:43-54`)

- HTTP / HTTPS
- TCP / UDP
- REST / JSON
- Avro
- SIP

### VM configuration (`…md:65-72`)

| Service | Node Type | CPU | RAM | Data SSD | OS Storage |
|---|---|---|---|---|---|
| K8s Cluster | Master Node | _(TBD)_ | _(TBD)_ | _(TBD)_ | _(TBD)_ |
| K8s Cluster | Worker Node | 4 vCore | 32 GB | 50 GB | 50 GB |
| Database Server | DB Server | 4 vCore | 32 GB | 100 GB | 50 GB |
| Redis & Kafka | Cache/Broker Server | 4 vCore | 32 GB | 50 GB | 50 GB |

OS: latest CentOS version.

### Firewall (`…md:77-79`)

| App | Port | Protocol | Notes |
|---|---|---|---|
| API | 443 | HTTPS | accessed by external users |

### Server communication (`…md:83-87`)

| Source | Destination | Port |
|---|---|---|
| Worker Node | DB Server | 27017 (MongoDB) |
| Worker Node | Cache/Broker Server | 9092 (Kafka plain), 9094 (Kafka TLS), 6379 (Redis) |

### Publishing (`…md:92-105`)

- DNS: `*.falconhub.sa` (external) — note: web app uses `*.falconhub.space`, see High-Level §2.2.2.
- External port: **443 HTTPS**.
- SSL offloading: **yes**.
- Auto-HTTPS redirect: **yes**.
- Session persistence: **none**.
- Load balancing: **Least Connection**.
- `X-Forwarded-For` header: set client address.

### Database sizing (`…md:122-142`)

- **Transactional DB:** 5 databases, 100 MB initial each, OLTP, weekly full + daily incremental backups.
- **Analytical DB:** 1 database, 100 MB initial, OLAP, same backup cadence.

## Diagrams / images referenced

- `falcon-deployment-diagram-183ecee6-…jpg` — Deployment Architecture diagram.

## Cross-references

- Pairs with `Development-&-Deployment-Strategy.md` (release model) and `High-Level-Architecture.md` §2.2 (gateway hostnames).

## Implications for code

- The number of expected MongoDB databases is **5** transactional (matches the count of core services: Commerce, Charging, Provisioning, Templates, Contact Group — Identity makes 6; or 5 if Identity is on its own server). Code currently has **at least 6** Mongo databases (Commerce, Charging, Templates, Provisioning, Identity, Contact Group). The "5" likely predates Identity Service taking ownership of users from Commerce.
- DNS drift: wiki says `*.falconhub.sa` here, but `*.falconhub.space` in High-Level §2.2.2. **Treat `falconhub.space` as canonical** — newer doc, matches existing deployment.
- Stack version commitments are concrete: **.NET 10**, **Angular 20**, **MongoDB 8.2**, **Redis 8.4**. Track upgrades against these — Angular is on 21 in code already (`feedback_falcon_revamp_v3_1_night_shift_results` confirms 21.2.9), so frontend is **ahead of wiki**.
- TODOs (Abstract, Scope, Capacity Planning, Integration Architecture, growth estimates) are wiki-silent.
