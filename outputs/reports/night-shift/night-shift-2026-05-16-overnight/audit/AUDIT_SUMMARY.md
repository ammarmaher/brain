---
runId: night-shift-2026-05-16-overnight
generatedAt: 2026-05-16T00:19:48.0660361Z
targets: C:\Falcon\Falcon\falcon-core-access-svc, C:\Falcon\Falcon\falcon-core-charging-svc, C:\Falcon\Falcon\falcon-core-commerce-svc, C:\Falcon\Falcon\falcon-core-contact-group-svc, C:\Falcon\Falcon\falcon-core-identity-svc, C:\Falcon\Falcon\falcon-core-provisioning-svc, C:\Falcon\Falcon\falcon-core-templates-svc, C:\Falcon\Falcon\falcon-int-core-gateway-svc, C:\Falcon\Falcon\falcon-int-system-gateway-svc, C:\Falcon\Falcon\falcon-portal, C:\Falcon\Falcon\falcon-web-platform-ui
---

# Code Audit Summary — night-shift-2026-05-16-overnight

> Run started 2026-05-16 03:19:48 · scanned 11 repos.

## Totals

| Severity | Count |
|---|---|
| 🔴 must | 255 |
| 🟠 should | 20 |
| 🟢 nice | 0 |
| **Total real violations** | **275** |

## By rule (top 10)

| Rule | Name | Severity | Count |
|---|---|---|---|
| `R-NOOR-003` | Typography scale â€” only documented type tokens allowed | must | 146 |
| `R-FE-002` | No SCSS, no component CSS, no styles array | must | 44 |
| `R-NOOR-005` | Color naming â€” palette over intent (Admin Console) | must | 24 |
| `R-FE-009` | Feature folder structure â€” one file per type-folder | should | 20 |
| `R-FE-012` | Build must be green â€” nx build exit 0 required | must | 11 |
| `R-NOOR-007` | i18n & RTL â€” strings from catalog, logical spacing only | must | 11 |
| `R-BE-006` | FalconException with FalconError codes for every domain failure | must | 7 |
| `R-BE-007` | No hardcoded secrets â€” use appsettings + IOptions + user-secrets / Key Vault | must | 6 |
| `R-NOOR-008` | Global selector hygiene â€” no naked body/*/:root overrides | must | 2 |
| `R-BE-003` | Internal services never call each other through gateways | must | 2 |

## By repo

| Repo | Violations |
|---|---|
| `C:\Falcon\Falcon\falcon-web-platform-ui` | 249 |
| `C:\Falcon\Falcon\falcon-core-identity-svc` | 5 |
| `C:\Falcon\Falcon\falcon-core-commerce-svc` | 5 |
| `C:\Falcon\Falcon\falcon-core-charging-svc` | 4 |
| `C:\Falcon\Falcon\falcon-int-system-gateway-svc` | 3 |
| `C:\Falcon\Falcon\falcon-core-contact-group-svc` | 3 |
| `C:\Falcon\Falcon\falcon-int-core-gateway-svc` | 2 |
| `C:\Falcon\Falcon\falcon-core-templates-svc` | 1 |
| `C:\Falcon\Falcon\falcon-portal` | 1 |
| `C:\Falcon\Falcon\falcon-core-access-svc` | 1 |
| `C:\Falcon\Falcon\falcon-core-provisioning-svc` | 1 |

## High severity (first 20)

| Rule | File | Line | Snippet |
|---|---|---|---|
| `R-BE-005` | `src/Falcon.System.Gateway/Contracts/Responses/Hook.cs` | 6 | `public string Name { get; set; } = default!;` |
| `R-BE-006` | `tests/Falcon.Charging.Tests/Ocs/OcsContainerArchitectureTests.cs` | 213 | `throw new InvalidOperationException("Unable to resolve falcon-core-charging-svc ` |
| `R-BE-006` | `tests/Falcon.Charging.Tests/Ocs/ProvisionOwnerOcsWalletsProcessTests.cs` | 195 | `throw new InvalidOperationException("Duplicate wallet");` |
| `R-BE-006` | `tests/Falcon.Charging.Tests/Ocs/WalletOutboxPublishingTests.cs` | 196 | `throw new InvalidOperationException("Simulated publish failure.");` |
| `R-BE-006` | `tests/Falcon.ContactGroup.Tests/Application/CreateContactGroupHandlerTests.cs` | 177 | `.Returns<Task>(_ => throw new InvalidOperationException("S3 error"));` |
| `R-BE-006` | `tests/Falcon.ContactGroup.Tests/Infrastructure/TempUploadCleanupJobTests.cs` | 118 | `.Returns<Task>(_ => throw new InvalidOperationException("S3 error"));` |
| `R-BE-006` | `tests/Falcon.Identity.Tests/Infrastructure/Access/AccessRoleLinkClientTests.cs` | 177 | `.Do(_ => throw new InvalidOperationException("kafka down"));` |
| `R-BE-006` | `tests/Falcon.Identity.Tests/Infrastructure/Messaging/Kafka/UserCreationRequestedConsumerTests.cs` | 97 | `throw new InvalidOperationException("kafka publish failed"));` |
| `R-BE-007` | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 16 | `private const string ConnectionString = "mongodb://localhost:27017";` |
| `R-BE-007` | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 234 | `ConnectionString = "mongodb://oldhost:27017"` |
| `R-BE-007` | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 363 | `ConnectionString = "mongodb://host1:27017"` |
| `R-BE-007` | `tests/Falcon.Commerce.Tests/Domain/Entities/TenantEntityTests.cs` | 370 | `ConnectionString = "mongodb://host2:27017"` |
| `R-BE-007` | `tests/Falcon.Identity.Tests/Infrastructure/Communications/SmsSenderTests.cs` | 22 | `Password = "testpass"` |
| `R-BE-007` | `tests/Falcon.Identity.Tests/Infrastructure/Messaging/Kafka/UserCreationRequestedConsumerTests.cs` | 64 | `EncryptedPassword = "ciphertext",` |
| `R-NOOR-003` | `apps/admin-console/src/tailwind.css` | 67 | `@source inline("text-xs");` |
| `R-NOOR-003` | `apps/admin-console/src/tailwind.css` | 94 | `@source inline("text-sm");` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 188 | `<h2 class="text-[15px] font-semibold text-falcon-neutral-900 m-0">{{ 'hierarchy.` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 193 | `class="inline-flex items-center gap-1.5 h-9 px-[14px] rounded-lg border border-f` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 196 | `<i class="falcon-icon falcon-icon-filter text-[13px]"></i>` |
| `R-NOOR-003` | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 200 | `<i class="falcon-icon falcon-icon-search absolute start-2.5 text-falcon-neutral-` |

## Outputs
- `violations.jsonl` — every violation as JSONL
- `violations-regex.jsonl` · `violations-structural.jsonl` · `violations-ast.jsonl` · `violations-semantic.jsonl` — per-engine streams
- `engine-runtimes.md` — performance + failure reasons

