---
type: cross-cutting
topic: session-shape
purpose: "Answers 'what JWT claims does the FE rely on + how is the PES policy-subject built from them'. Open when wiring CurrentSubjectBuilder, debugging PES denials, or seeding new test users."
sources:
  - Falcon/falcon-web-platform-ui/libs/falcon/src/core/lib/access-control/current-subject.builder.ts
  - Falcon/falcon-essentials/zitadel/seed-test-users.sh:93-111
  - Falcon/falcon-core-identity-svc/src/Falcon.Identity.Api/Application/Auth/UseCases/LoginProcess.cs
---

# Session Shape — JWT claims + FE session

> [!tldr]
> What the FE knows about a logged-in user. JWT `sub` = Zitadel id (the only thing PES cares about). User metadata (user-id / user-type / tenant-id) is on Zitadel user metadata + mirrored on the Mongo User doc. The FE `CurrentSubjectBuilder` composes the policy-subject `u:<JWT.sub>@<ns>` from JWT + tenant claim.

## JWT claims (Zitadel-issued)

| Claim | Source | Example | Used for |
|---|---|---|---|
| `sub` | Zitadel | `342167530844749827` | PES policy subject (`u:<sub>@<ns>`) |
| `iss` | Zitadel | `http://localhost:8080` | JWT validation |
| `aud` | Falcon project | `<project-client-id>` | JWT validation |
| `urn:zitadel:iam:user:metadata:user-id` | Seed | Mongo `_id` hex string | Cross-reference to Identity Users doc |
| `urn:zitadel:iam:user:metadata:user-type` | Seed | `1` (Falcon) / `2` (Client) | Decide console (admin vs mgmt) |
| `urn:zitadel:iam:user:metadata:tenant-id` | Seed | `test-tenant-001` | Policy subject namespace (acc-* users only — sys-* have empty tenant) |

## How the FE builds the policy subject

```typescript
// libs/falcon/src/core/lib/access-control/current-subject.builder.ts:27
const subject = `u:${jwt.sub}@${namespace}`;
// where namespace = tenant-id for acc-*, or 'system' for sys-*
```

## Session object on the FE (TypeScript)

Typical Falcon session object:
```typescript
interface FalconSession {
  identityUserId: string;     // = Mongo _id of Identity Users doc (NOT for PES)
  zitadelUserId: string;      // = JWT.sub (THIS is for PES)
  userType: 'Falcon' | 'Client' | 1 | 2;
  tenantId: string | null;    // null for sys-*, tenant-id for acc-*
  client_id: string | null;   // alias for tenantId on Client side
  role: number;               // eUserRoles enum
  username: string;
  email: string;
}
```

## userType-based UI gating (non-PES)

Some UI elements gate on `session.userType` directly without calling PES. Example from [[../04-feature-parity-matrix/organization-hierarchy.compare]]:

```typescript
// hierarchy-tab.component.ts:321-328
canShow(): boolean {
  const userTypeStr = String(session.userType || '').trim();
  return (userTypeStr === USER_TYPE_STRINGS.FALCON_USER ||
          userTypeStr === USER_TYPE_STRINGS.CLIENT_USER) &&
         (this.isMainMenu) && (!this.isFalconMenu);
}
```

This is a session-level gate, NOT a PES gate. Use it for "is this user even relevant" filtering; never use it as a security boundary.

## Tenant resolution strategies

`eTenantResolutionStrategy` (Identity):
- `ByUsername` — look up user by username in MongoDB
- `BySessionId` — look up auth session by sessionId in cache
- `ByUserId` — look up user by userId in MongoDB

Used by Identity's `LoginProcess` during multi-step auth.

## Two ID universes — do not confuse

| ID | Where it lives | What it identifies | Used by |
|---|---|---|---|
| `JWT.sub` | JWT claim | Zitadel user record | PES policy subject — **the only thing that matters for authorization** |
| `Mongo _id` | Identity Users doc | Identity User document | Identity service internals (cross-references, profile lookups) |
| `identityUserId` field | Identity Users doc | = `JWT.sub` (Zitadel id) | Synthesises the link |

**Trap**: in older code / seed scripts, the policy subject was incorrectly set to `u:<MongoId>@<ns>`. This produces silent deny on every PES check. Fixed in `seed-test-users.sh:167-171`. See [[../00-INDEX]] standing rule.

## See also

- [[test-users]] — the 6 seeded users + their JWT contents
- [[gateway-routing-map]] — what gateway forwards the JWT downstream
- [[../03-pes-keys/REGISTRY-RAW]] — the keys the policy subject is checked against
