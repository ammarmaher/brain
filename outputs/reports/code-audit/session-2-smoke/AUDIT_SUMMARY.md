---
runId: session-2-smoke
generatedAt: 2026-05-15T22:41:48.2447609Z
targets: C:\Falcon\Falcon\falcon-core-commerce-svc
---

# Code Audit Summary — session-2-smoke

> Run started 2026-05-16 01:41:48 · scanned 1 repos.

## Totals

| Severity | Count |
|---|---|
| ?? must | 8 |
| ?? should | 0 |
| ?? nice | 0 |
| **Total real violations** | **8** |

## By rule (top 10)

| Rule | Name | Severity | Count |
|---|---|---|---|
| `R-BE-007` | No hardcoded secrets â€” use appsettings + IOptions + user-secrets / Key Vault | must | 4 |
| `R-BE-003` | Internal services never call each other through gateways | must | 3 |
| `R-FE-012` | Build must be green â€” nx build exit 0 required | must | 1 |

## By repo

| Repo | Violations |
|---|---|
| `C:\Falcon\Falcon\falcon-core-commerce-svc` | 8 |

## High severity (first 20)

| Rule | File | Line | Snippet |
|---|---|---|---|
| `R-BE-007` | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 16 | `private const string ConnectionString = "mongodb://localhost:27017";` |
| `R-BE-007` | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 234 | `ConnectionString = "mongodb://oldhost:27017"` |
| `R-BE-007` | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 363 | `ConnectionString = "mongodb://host1:27017"` |
| `R-BE-007` | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 370 | `ConnectionString = "mongodb://host2:27017"` |
| `R-BE-003` | `src/Falcon.Commerce.Infrastructure/Auth/ZitadelExtensions.cs` | 13 | `/// Defense-in-depth: Commerce validates JWTs independently of the API Gateway.` |
| `R-BE-003` | `src/Falcon.Commerce.Infrastructure/Auth/ZitadelOptions.cs` | 6 | `/// must independently verify tokens in case a request bypasses the gateway.` |
| `R-BE-003` | `src/Falcon.Commerce.Infrastructure/Configurations/ConfigurationSettings.cs` | 114 | `/// Keep disabled outside local/QA; system-gateway is still the only frontend-fa` |
| `R-FE-012` | `(out-of-band)` | 0 | `Build state verified by audit-orchestrator post-hoc, not by this handler` |

## Outputs
- `violations.jsonl` — every violation as JSONL
- `violations-regex.jsonl` · `violations-structural.jsonl` · `violations-ast.jsonl` · `violations-semantic.jsonl` — per-engine streams
- `engine-runtimes.md` — performance + failure reasons

