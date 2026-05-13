*** WIKI_OVERVIEW - canonical Falcon wiki snapshot ***

**Wiki HEAD:** `0d0cb311b56a991b94b6a0af03a26a12014b2926` (branch `wikiMaster`, Noor Joudeh, Wed May 13 05:54:58 2026 +0000 — "Added Falcon Template Management BRD & Technical Architecture")
**Local clone:** `C:\Falcon\falcon-wiki\`
**Web URL:** `https://t2development.visualstudio.com/Falcon/_wiki/wikis/Falcon.wiki/1129/Home`

## Executive summary

The Falcon wiki is the canonical Communication-as-a-Service (CaaS) architecture description authored by Noor Joudeh (Architect). It declares Falcon a modular, service-oriented, cloud-native platform combining microservices (.NET 10) plus Angular 20 micro-frontends, three persona-scoped API gateways (System / Core / Platform), Kafka+Avro event-driven communication, Zitadel OAuth2/OIDC, and polyglot storage (MongoDB OLTP + ClickHouse OLAP + Redis). The wiki is **Software-Architecture-Design**-heavy: 16 markdown files at `Home/Software-Architecture-Design/` plus a near-empty `Home.md` and a separate `Home/Skeleton-"Chassis"-Layer/` + `Home/Introduction/` tree. The Software-Architecture-Design folder is the only one this rule book targets; the `Home/` siblings are scaffolds.

Audience-specific entry points: **Architect** → `Architecture-Vision.md` → `High-Level-Architecture.md` → `System-Context.md`. **Backend** → `Clean-Architecture-project-structure-&-business-concepts.md` → `Design-Patterns-&-Guidelines.md` → relevant module doc (`Account-Management-Module.md`, `Contact-Group-Module.md`, `Falcon-Pricing,-Tariff-&-OCS-…md`, `Falcon-Template-Management-…md`, `Falcon-AI-Conversational-Orchestration.md`). **Frontend** → `Front%2DEnd-Architecture.md` (URL-encoded `%2D` = `-`). **Security/Identity/Permissions** → `Security-Architecture.md` + `Permissions-&-Authorization-Module-…md`. **Ops/DevOps** → `Development-&-Deployment-Strategy.md` + `Deployment-Document-…md` + `Azure-statuses-…md`.

## Table of contents (canonical 16 docs)

| Doc | Path under `Home\Software-Architecture-Design\` | Lines | `^#` headings | 1-line purpose |
|---|---|---:|---:|---|
| Architecture Vision | `Architecture-Vision.md` | 56 | 0 (uses `===` underline style) | Goals, objectives, constraints — high-level "why" |
| System Context | `System-Context.md` | 15 | 0 (uses `===`) | CaaS context diagram + actors stub (mostly TODO) |
| High-Level Architecture | `High-Level-Architecture.md` | 485 | 28 | Architecture style, three gateways, layers, key flows (THE big map) |
| Clean Architecture & DDD | `Clean-Architecture-project-structure-&-business-concepts.md` | 900 | 39 | Domain/Application/Infra/Api/Contracts boundaries + 5 restrictions |
| Design Patterns & Guidelines | `Design-Patterns-&-Guidelines.md` | 171 | 5 | Naming (repos, .sln, MongoDB DBs, branches), folder layouts |
| Front-End Architecture | `Front%2DEnd-Architecture.md` | 1298 | 56 | NX monorepo, host-shell, SDK, micro-app loader, Module Federation |
| Security Architecture | `Security-Architecture.md` | 592 | 65 | Identity Service as auth orchestrator, dual-credential (JWT + micro-app key), lifecycle states, IP allowlist |
| Permissions & Authorization (PBAC) | `Permissions-&-Authorization-Module-(Policy%2DBased-Access-Control).md` | 1047 | 43 | PBAC = RBAC + ABAC unified; PDP/PEP/PIP; `(subject,object,action,effect,type,expression)` schema |
| Account Management Module | `Account-Management-Module.md` | 46 | 8 | Node/Sub-Node hierarchy + 6 endpoints (`/api/node/*`, `/api/setting`, `/api/AccountHierarchy`) |
| Contact Group Module | `Contact-Group-Module.md` | 457 | 62 | Pre-signed URL direct-to-object-storage upload + preview-first flow + Mongo collections |
| Falcon Pricing, Tariff & OCS | `Falcon-Pricing,-Tariff-&-OCS-—-BRD-+-Technical-Architecture.md` | 1665 | 179 | Contract (embedded tariff) + Wallet/Bucket/Reservation/Ledger DDD; OCS bounded context |
| Falcon Template Management | `Falcon-Template-Management-BRD-&-Technical-Architecture.md` | 4751 | 178 | WhatsApp/Meta templates: wizard, validation engine, two-tier sequential approval, Meta adapter |
| Falcon AI Conversational Orchestration | `Falcon-AI-Conversational-Orchestration.md` | 2499 | 72 | Agent A (Designer) + Agent B (Executor); structured blueprints; semantic eval engine — note doc duplicates from line 2494 |
| Development & Deployment Strategy | `Development-&-Deployment-Strategy.md` | 348 | 60 | Trunk-Based Development, `main`-only long-lived branch, tag-based releases, feature flags |
| Deployment Document (Dev Servers) | `Deployment-Document-(Dev-Servers-specs-&-Env-setup).md` | 104 | 16 | VM sizing, firewall, K8s ports, DB sizing (mostly v0.1 draft with TODOs) |
| Azure Work Item Statuses | `Azure-statuses-(US,-Bugs,-Tasks).md` | 23 | 0 (table-only) | Lifecycle: Draft → Under Analysis → … → On Production → Closed |

## Out-of-scope siblings

The `Home/` folder additionally contains `Skeleton-"Chassis"-Layer/` and `Introduction/` subfolders plus `Home.md` (empty), `Application-Layer.md`, `Skeleton-"Chassis"-Layer.md`, and `Software-Architecture-Design.md`. None of these are touched by this rule book per the brief — `Software-Architecture-Design/` is the authoritative folder.

## Total wiki word/section signal

- 16 canonical docs · 15,457 lines total · 824 headings counted on `^#`.
- Two docs contribute the bulk: Falcon Template Management (4,751 lines / 178 headings) and Falcon AI Conversational Orchestration (2,499 lines / 72 headings — note: content from lines 2494+ appears to be an unintentional duplicate of the first half).
- Five docs are stubs with significant TODOs: Architecture Vision (Constraints, Success Criteria), System Context (Actors, System Boundaries), Deployment Document (Abstract, Scope, Capacity Planning, Integration Architecture, Database growth), Azure statuses (no narrative), Design Patterns & Guidelines (Coding Standards, Design Patterns, Error Handling, Logging & Monitoring sections empty under headings).

## Per-doc deep-dive

For each of the 16 docs, see `Home/Software-Architecture-Design/<doc-name>.md` next to this file. The consolidated rule book is `CONSOLIDATED_ARCHITECTURE_RULES.md`. Drift against observed code lives in `CONSOLIDATED_ARCHITECTURE_CONFLICTS.md`. The wiki-rule → code-location bridge lives in `WIKI_TO_CODE_TRACE.md`.
