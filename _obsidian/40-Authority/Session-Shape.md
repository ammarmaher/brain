---
type: reference
cluster: 40-Authority
title: Session Shape — JWT claims + FE session
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\07-cross-cutting\session-shape.md
verified-at: 2026-05-16
purpose: "Answers 'what JWT claims does the FE rely on + how is the PES policy subject u:<sub>@<ns> built + Mongo vs Zitadel ID universes'. Open when wiring auth/session/PES."
---

> [!tldr]
> What the FE knows about a logged-in user. `JWT.sub` = Zitadel id (the only thing PES cares about). Tenant-id claim picks the namespace. Two ID universes (Mongo `_id` vs Zitadel id) — never confuse them.

# Session Shape

## JWT claims (Zitadel-issued)

| Claim | Source | Example | Used for |
|---|---|---|---|
| `sub` | Zitadel | `342167530844749827` | **PES policy subject** (`u:<sub>@<ns>`) |
| `iss` | Zitadel | `http://localhost:8080` | JWT validation |
| `urn:zitadel:iam:user:metadata:user-id` | Seed | Mongo `_id` hex | Cross-ref to Identity Users doc |
| `urn:zitadel:iam:user:metadata:user-type` | Seed | `1` (Falcon) / `2` (Client) | Decide console mount |
| `urn:zitadel:iam:user:metadata:tenant-id` | Seed | `test-tenant-001` | PES namespace (acc-* only) |

## Policy subject build (FE)

```typescript
// libs/falcon/src/core/lib/access-control/current-subject.builder.ts:27
const subject = `u:${jwt.sub}@${namespace}`;
// namespace = tenant-id for acc-*, or "system" for sys-*
```

## Two ID universes — do not confuse

| ID | Where it lives | Used by |
|---|---|---|
| `JWT.sub` | JWT claim | PES policy subject (**only this matters for authorization**) |
| `Mongo _id` | Identity Users doc | Identity internals |
| `identityUserId` field | Identity Users doc | = Zitadel id (synthesises the link) |

> 🔴 Standing rule: PES `g`-rule subject MUST be `u:<ZitadelUserId>@<ns>` — NEVER `u:<MongoId>@<ns>`. Wrong subject = silent deny everywhere.

## See also

- [[Roles]] — what the session unlocks per role
- [[Test-Users]] — sample JWT decodings
- Brain Outputs: `C:\Falcon\Brain Outputs\datasets\authority-dataset\07-cross-cutting\session-shape.md`
