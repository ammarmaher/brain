# Violations by rule — session-2-smoke

## `R-BE-007` — No hardcoded secrets â€” use appsettings + IOptions + user-secrets / Key Vault (4 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 16 | `private const string ConnectionString = "mongodb://localhost:27017";` |
| 2 | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 234 | `ConnectionString = "mongodb://oldhost:27017"` |
| 3 | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 363 | `ConnectionString = "mongodb://host1:27017"` |
| 4 | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 370 | `ConnectionString = "mongodb://host2:27017"` |

## `R-BE-003` — Internal services never call each other through gateways (3 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `src/Falcon.Commerce.Infrastructure/Auth/ZitadelExtensions.cs` | 13 | `/// Defense-in-depth: Commerce validates JWTs independently of the API Gateway.` |
| 2 | `src/Falcon.Commerce.Infrastructure/Auth/ZitadelOptions.cs` | 6 | `/// must independently verify tokens in case a request bypasses the gateway.` |
| 3 | `src/Falcon.Commerce.Infrastructure/Configurations/ConfigurationSettings.cs` | 114 | `/// Keep disabled outside local/QA; system-gateway is still the only frontend-fa` |

## `R-FE-012` — Build must be green â€” nx build exit 0 required (1 violations)

| # | File | Line | Snippet |
|---|---|---|---|
| 1 | `(out-of-band)` | 0 | `Build state verified by audit-orchestrator post-hoc, not by this handler` |


