*** Task: Fix 2 PES grant infra bugs (Commerce bootstrap 401 + Identity->PES Avro) ***
Status: COMPLETED 2026-05-18

## Bug 1 — Commerce bootstrap 401 (root cause)
- pes/roles/bootstrap/account/{tenantId} requires SystemOnly JWT.
- Commerce startup seeder calls it with no HTTP context -> AuthorizationHeaderHandler
  attaches no token -> 401. Production CreateMainNodeProcess works (has admin JWT).
- Interlock: PES RoleDbDataSource.EnsureRoleExistsAsync THREW if acc-* role catalog
  missing for tenant -> Kafka consumer also failed even after Bug 2 fix.
- FIX (PES code): RoleDbDataSource.EnsureRoleExistsAsync now provisions the per-tenant
  built-in account role catalog on-demand via IBuiltInRoleProvisioner.EnsureAccountRoles
  when an Account user is linked to a built-in acc-* role and the catalog is missing.
  Injected IBuiltInRoleProvisioner into RoleDbDataSource ctor.
  File: C:\falcon\Falcon\falcon-core-access-svc\src\T2.PES\PolicyDataSource\RoleDbDataSource.cs
  SystemOnly HTTP endpoint left unchanged (production safe).

## Bug 2 — Identity->PES Avro "Local: Value deserialization error" (root cause)
- NOT a schema mismatch. PES docker-compose service missing Kafka__SchemaRegistryUrl.
- PES fell back to appsettings.Development.json http://localhost:8085 (host-only,
  unreachable inside container) -> RestService.GetSchemaAsync(id) failed.
- FIX (infra): added Kafka__SchemaRegistryUrl: http://schema-registry:8081 to pes service.
  File: C:\falcon\Falcon\Falcon\docker-compose.yml (pes service env)
- Affected PRODUCTION flow too: real Add User wizard publishes to same topic.

## Verification
- Recreated pes + identity containers.
- All 9 seeded users: "Applied UserRoleLinkSyncRequested ... Created=True", 0 deser errors.
- PES: 9 g-rules + 218 p-rules per tenant (c10001/2/3), total rules 504 -> 1167.
- Login mitsubishi-owner OK. pes/authorize:
  - app.management-console/view = True, acc.account/edit = True (allow)
  - app.admin-console/view = False (correct deny)
  - unknown user = False, honda-user(acc-user) acc.account/edit = False (correct deny)
- Regression: test-tenant-001 (BMW) g-rules intact; frontend :4200 = 200.

## Not done (out of safe scope)
- Commerce service-to-service token (Zitadel client-credentials) — too deep/risky.
  Not needed: PES on-demand provisioning + Kafka path cover the gap.
