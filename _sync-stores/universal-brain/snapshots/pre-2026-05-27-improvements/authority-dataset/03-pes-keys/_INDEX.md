---
type: index
cluster: 03-pes-keys
purpose: "Answers 'which PES-keys files exist + how the 47 factory methods are organized by namespace'. Open to navigate to the right PES-keys file or recall namespace boundaries."
---

# PES Keys — Index

> [!tldr]
> 47 factory methods over 7 namespaces. The registry file `falcon-access.registry.ts` is the SoT for what the FE can query. The seeded `p`-rules in `BuiltInRoleCatalog.cs` decide who passes.

## Files in this cluster

| File | Content |
|---|---|
| [[REGISTRY-RAW]] | Every key, action, resource, who can pass — comprehensive |
| [[adminConsole]] | Per-feature breakdown of admin-console PES keys (Falcon) |
| [[managementConsole]] | Per-feature breakdown of management-console PES keys (Client) |
| [[contactGroup]] | Scope-aware shared namespace |
| [[userRole-matrix]] | Role-edit matrix expanded |

## Quick reference

- **Falcon-only resources**: `sys.*` prefix.
- **Client-only resources**: `acc.*` prefix.
- **App-entry gates**: `app.admin-console`, `app.management-console`.
- **Shared scope-aware**: `contactGroup.*(scope)`.
- **Role-edit matrix**: `user.role.{self,other}`.

## Standing facts (do not violate)

1. PES `g`-rule subject MUST be `u:<ZitadelUserId>@<ns>` — never Mongo `_id`. See `seed-test-users.sh:167-171`.
2. Frontend builds the policy-subject as `u:<JWT.sub>@<ns>` where `JWT.sub` is the Zitadel user-id. See `falcon-web-platform-ui/libs/falcon/src/core/lib/access-control/current-subject.builder.ts:27`.
3. Gateways do NOT call PES — gating is FE-only.
4. Adding a new PES key requires: (a) factory method in `falcon-access.registry.ts`, (b) p-rule in `BuiltInRoleCatalog.cs` for every role that should pass, (c) reseed PES via `seed-test-users.sh`.
