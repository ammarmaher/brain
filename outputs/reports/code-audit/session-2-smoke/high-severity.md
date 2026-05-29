# High-severity violations — session-2-smoke

All `severity: must` rows below need attention before next ship.

| Rule | File | Line | Snippet | Suggested fix |
|---|---|---|---|---|
| `R-BE-003` | `src/Falcon.Commerce.Infrastructure/Auth/ZitadelExtensions.cs` | 13 | `/// Defense-in-depth: Commerce validates JWTs independently ` | Replace gateway URL with the direct service hostname (e.g. commerce-svc.cluster.local) OR convert the call to Kafka if the use case allows eventual consistency. |
| `R-BE-003` | `src/Falcon.Commerce.Infrastructure/Auth/ZitadelOptions.cs` | 6 | `/// must independently verify tokens in case a request bypas` | Replace gateway URL with the direct service hostname (e.g. commerce-svc.cluster.local) OR convert the call to Kafka if the use case allows eventual consistency. |
| `R-BE-003` | `src/Falcon.Commerce.Infrastructure/Configurations/ConfigurationSettings.cs` | 114 | `/// Keep disabled outside local/QA; system-gateway is still ` | Replace gateway URL with the direct service hostname (e.g. commerce-svc.cluster.local) OR convert the call to Kafka if the use case allows eventual consistency. |
| `R-BE-007` | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 370 | `ConnectionString = "mongodb://host2:27017"` | Move the literal to an IOptions<T>-bound config section in appsettings.json with a placeholder value. Real value goes to user-secrets (dev) or Key Vault (prod). Never commit the real value. |
| `R-BE-007` | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 16 | `private const string ConnectionString = "mongodb://localhost` | Move the literal to an IOptions<T>-bound config section in appsettings.json with a placeholder value. Real value goes to user-secrets (dev) or Key Vault (prod). Never commit the real value. |
| `R-BE-007` | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 234 | `ConnectionString = "mongodb://oldhost:27017"` | Move the literal to an IOptions<T>-bound config section in appsettings.json with a placeholder value. Real value goes to user-secrets (dev) or Key Vault (prod). Never commit the real value. |
| `R-BE-007` | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 363 | `ConnectionString = "mongodb://host1:27017"` | Move the literal to an IOptions<T>-bound config section in appsettings.json with a placeholder value. Real value goes to user-secrets (dev) or Key Vault (prod). Never commit the real value. |
| `R-FE-012` | `(out-of-band)` | 0 | `Build state verified by audit-orchestrator post-hoc, not by ` | Read the build error output. Resolve every error TS####, Cannot find module, duplicate-export, and Errors while compiling. Re-run the build until exit 0. Do not bundle the fix with new feature work. |

