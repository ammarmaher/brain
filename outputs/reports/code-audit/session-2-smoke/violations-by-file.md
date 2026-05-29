# Violations by file — session-2-smoke

## `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` (4 violations)

| Rule | Line | Severity | Snippet |
|---|---|---|---|
| `R-BE-007` | 16 | must | `private const string ConnectionString = "mongodb://localhost:27017";` |
| `R-BE-007` | 234 | must | `ConnectionString = "mongodb://oldhost:27017"` |
| `R-BE-007` | 363 | must | `ConnectionString = "mongodb://host1:27017"` |
| `R-BE-007` | 370 | must | `ConnectionString = "mongodb://host2:27017"` |

## `src/Falcon.Commerce.Infrastructure/Configurations/ConfigurationSettings.cs` (1 violations)

| Rule | Line | Severity | Snippet |
|---|---|---|---|
| `R-BE-003` | 114 | must | `/// Keep disabled outside local/QA; system-gateway is still the only frontend-fa` |

## `(out-of-band)` (1 violations)

| Rule | Line | Severity | Snippet |
|---|---|---|---|
| `R-FE-012` | 0 | must | `Build state verified by audit-orchestrator post-hoc, not by this handler` |

## `src/Falcon.Commerce.Infrastructure/Auth/ZitadelExtensions.cs` (1 violations)

| Rule | Line | Severity | Snippet |
|---|---|---|---|
| `R-BE-003` | 13 | must | `/// Defense-in-depth: Commerce validates JWTs independently of the API Gateway.` |

## `src/Falcon.Commerce.Infrastructure/Auth/ZitadelOptions.cs` (1 violations)

| Rule | Line | Severity | Snippet |
|---|---|---|---|
| `R-BE-003` | 6 | must | `/// must independently verify tokens in case a request bypasses the gateway.` |


