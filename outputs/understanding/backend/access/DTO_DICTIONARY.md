# Access (PES) Service — DTO Dictionary

> Source: types in `T2.PES.Authorization`, `T2.PES.PolicyDataSource`, `T2.PES.API.Auth`, `T2.PES.API.Messaging.AvroEvent`. PES does **not** use a shared Contracts project — DTOs live in the application library itself.

## Authorization Decision Types

| Type | Direction | Notes |
|---|---|---|
| `AuthRequest` | request | Likely `{ Subject (sub), Object (obj), Action, Context }`. The decision-point evaluates the request against all matching policy rules. |
| `AuthResponse` | response | `{ Allowed (bool), Reason, MatchedRule? }` (inferred shape). |
| `AuthorizationsRequest` | request | Batch — likely `{ Requests: List<AuthRequest> }`. |
| `AuthorizationsResponse` | response | Batch result. |

## Policy Rule Types

| Type | Direction | Fields (inferred from handler usage) |
|---|---|---|
| `PolicyRule` | request + response | `{ Id, Subject (sub), Object (obj), Action, Effect (Allow/Deny), Condition?, Metadata? }` |
| `PolicyFilter` | request | `{ Subject?, Object?, Action?, … }` — partial filter |
| `DeletePermission` | request | `{ List<Permission> Permissions, string DeletedBy }` |

## Role Types

| Type | Direction | Fields |
|---|---|---|
| `Role` | response | `{ Id, RoleKey, Name (likely MultiLanguage?), UserType, TenantId?, Scope, Policies[] }` (inferred) |
| `RoleCatalogRequest` | internal | Built by `IAccessCurrentUser.TryResolveRoleCatalogRequest(targetUserType, tenantId, out RoleCatalogRequest, out error, out forbidden)` |
| `PrimaryRoleLinkSyncRequest` | request | `{ User, Scope, RoleKey, … }` — the link to sync |
| `PrimaryRoleLinkInstruction` | internal | Resolved from `PrimaryRoleLinkSyncRequest` by `IAccessCurrentUser.TryResolvePrimaryRoleLinkInstruction` |
| `PrimaryRoleLinkSyncResult` | response | `{ Linked (bool), PreviousRole?, NewRole, ... }` |
| `SystemRoleSeedResult` | internal | `{ CreatedCount, CreatedPolicyRuleCount, Roles[] }` (from `EnsureSystemRoles`) |

## Avro Event Types

| Type | Topic | Direction |
|---|---|---|
| `UserRoleLinkSyncRequestedAvroEvent` | `identity.user-events.v1` | consume — Identity-triggered sync |

## Configuration Types

| Type | Source | Fields |
|---|---|---|
| `KafkaOptions` | `Kafka:*` config | `BootstrapServers`, `SchemaRegistryUrl`, `GroupId`, `SecurityProtocol` |
| `DataStoreOptions` | `DataStore:*` config | `Provider` (string: `"MongoDb"` or `"SqlServer"`) |
| `MongoDbSettings` | `MongoDb:*` config | `ConnectionString`, `DatabaseName`, `PolicyRulesCollectionName`, `DeletedPolicyRulesCollectionName`, `RolesCollectionName` |

## Domain Vocabulary

PES uses a subject-object-action model (similar to Casbin):

- **Subject (sub)** — who is requesting (user id, role, machine actor identifier)
- **Object (obj)** — what is being accessed (resource id, resource type, scope)
- **Action** — what operation is requested (read, write, delete, custom verbs)
- **Effect** — `Allow` or `Deny`
- **Scope** — hierarchical addressing of resources (e.g. `tenant:abc/node:xyz/contract:123`)

All subject and object strings are **lowercased** before lookup (`sub.ToLower()`, `obj.ToLower()`).
