# Design Patterns & Guidelines

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Design-Patterns-&-Guidelines.md`
**Length:** 171 lines · **Headings:** 5 (Naming Conventions + Coding Standards / Design Patterns / Error Handling / Logging & Monitoring all empty)
**Last wiki HEAD seen:** `0d0cb311…`

## Purpose

The **canonical naming-conventions doc**. Defines repository names, namespace patterns, .NET solution/project naming, MongoDB DB naming, environment / branch naming, and standard folder structures for both backend microservices and Nx frontend. Coding Standards, Design Patterns, Error Handling, and Logging & Monitoring sections are present as headings only — **wiki-silent on substance**.

## Key rules / decisions

### Repository naming (`Design-Patterns-&-Guidelines.md:5-23`)

Pattern: `<system>-<layer>-<service>-svc` for backend services, or `<system>-<component-type>` for shared/frontend.

Layer prefixes:
- **`int`** for Integration Layer (gateways) — `falcon-int-system-gateway-svc`, `falcon-int-core-gateway-svc`, `falcon-int-platform-gateway-svc`.
- **`comm`** for Communication Layer — `falcon-comm-voip-svc`, `falcon-comm-whatsapp-svc`, `falcon-comm-push-svc`.
- **`util`** for Utility Layer — `falcon-util-logging-svc`, `falcon-util-storage-svc`.
- **`core`** for Core (business-critical) — `falcon-core-provisioning-svc`, `falcon-core-charging-svc`, `falcon-core-commerce-svc`, `falcon-core-access-svc`.

Shared / supporting repos: `falcon-shared-lib`, `falcon-shared-contracts`, `falcon-console-ui`, `falcon-infra`.

### Nx workspace layout (`…md:74-100`)

Workspace name: **`falcon-console-ui`** (one workspace for all frontends).

```
falcon-console-ui/
├── apps/
│   ├── management-console/
│   ├── admin-console/
│   ├── micro-apps/
│       ├── survey-microapp/
│       └── campaigns-microapp/
├── libs/
│   ├── shared-ui/
│   ├── shared-utils/
│   ├── shared-services/
│   ├── shared-theme/
│   └── shared-auth/
└── README.md
```

Rules:
- **kebab-case** for Angular app and library names.
- Prefix all shared libraries with **`shared-`**.

### .NET solution & project naming (`…md:102-130`)

Pattern: **`Falcon.<Service>.<Layer>`** with `<Service>` PascalCase.

```
src/
  Falcon.Commerce.Api/
  Falcon.Commerce.Application/
  Falcon.Commerce.Domain/
  Falcon.Commerce.Infrastructure/
  Falcon.Commerce.Contracts/
tests/
  Falcon.Commerce.Tests/
```

Namespace: `Falcon.Commerce.[Layer]`.
Solution file: **`<ServiceName>.sln`** (NOT `.slnx`).

Rules:
- **PascalCase** for solution and project names.
- Avoid "Core" unless it truly represents a shared domain/core library.

### Standard microservice folder layout (`…md:132-182`)

Each microservice repo has:
- `.azure-pipelines/` — build.yml, deploy.yml, templates/
- `.docker/` — Dockerfile, docker-compose.yml, nginx.conf
- `src/` — the 5 csproj layers
- `tests/` — `<Service>.Application.Tests/`, `<Service>.Domain.Tests/`
- `docs/` — architecture.md, api-endpoints.md, sequence-diagrams/
- Root files: `.editorconfig`, `.gitignore`, `<ServiceName>.sln`, `Directory.Build.props`, `README.md`

### MongoDB database naming (`…md:187-198`)

Pattern: **`falcon_<layer>_<service>_db`**.

Examples: `falcon_core_provisioning_db`, `falcon_comm_whatsapp_db`.

### Environment and branch naming (`…md:200-206`)

| Type | Convention | Example |
|---|---|---|
| Environment | `dev`, `test`, `prod` | — |
| Branch | `feature/<name>`, `bugfix/<name>`, `hotfix/<name>`, `release/<version>` | `feature/add-notification-endpoint` |

*(Note: `Development-&-Deployment-Strategy.md` overrides — that newer doc uses `feat/`, `fix/`, `chore/` short-lived prefixes and disallows `release/` long-lived branches. The latter is authoritative for trunk-based development; this doc represents the older convention.)*

### Empty sections (`…md:209-218`)

- `Coding Standards` — empty.
- `Design Patterns` — empty.
- `Error Handling` — empty.
- `Logging & Monitoring` — empty.

**These are wiki-silent — do not invent the rules.**

## Diagrams / images referenced

- None.

## Cross-references

- `Development-&-Deployment-Strategy.md` overrides branch naming.
- `Clean-Architecture-project-structure-&-business-concepts.md` is the canonical doc for what each `.Api / .Application / .Domain / .Infrastructure / .Contracts` project contains.

## Implications for code

**Numerous violations of these rules already exist:**
- Solution files in newer services use `.slnx` not `.sln`. Wiki here says `.sln`. (Fallback §1.1.)
- MongoDB DBs are named `FalconCommerceDB`, `FalconChargingDB`, `FalconTemplateDb` (PascalCase, no underscore-snake_case), violating `falcon_<layer>_<service>_db`. (Fallback §5.1.)
- Wiki names `falcon-core-access-svc` for AuthZ (PES), but code uses `T2.PES.*` project names instead of `Falcon.Access.*`. (Fallback §1.4.)
- Wiki workspace name is `falcon-console-ui`; code uses `falcon-web-platform-ui` — different scoping (`web-platform` vs `console`).
- Nx libs: wiki prescribes `shared-ui / shared-utils / shared-services / shared-theme / shared-auth`. Code uses `libs/falcon, libs/falcon-theme, libs/falcon-ui-core, libs/falcon-ui-tokens, libs/sdk` — completely different naming. Frontend memory `feedback_wiki_naming_conventions` already partially captures this.
- T2.PES.* on `net6.0` violates the implied platform standard (.NET 10).

All four "empty" sections (Coding Standards, Design Patterns, Error Handling, Logging & Monitoring) need to come from `Clean-Architecture-…md` substitution or be explicitly TODO'd.
