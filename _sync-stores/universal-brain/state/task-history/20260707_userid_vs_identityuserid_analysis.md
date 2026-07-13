# UserId (Mongo _id) vs IdentityUserId (Zitadel) — consolidation analysis

**Date:** 2026-07-07 · **Status:** completed (analysis only, no code changes)
**Method:** 6 parallel research agents (identity domain, identity contracts, downstream svcs, FE, PES/seeding, Zitadel lifecycle) + 3 adversarial risk assessors (data-integrity, security/PES, migration-operational). ~907k subagent tokens, 384 tool calls.

## The two IDs
- `userId` = Mongo `User._id`, 24-hex ObjectId, minted by the Mongo driver on insert. [CODE] falcon-core-identity-svc User.cs:10-12
- `identityUserId` = Zitadel numeric user id (18-digit snowflake) = JWT `sub`, minted by Zitadel on account creation, stored as nullable string. [CODE] User.cs:62-63

## Key couplings found
1. Mongo _id is pushed INTO Zitadel metadata key `user-id` at all 3 creation sites and read back on EVERY authenticated request (ZitadelClaimsTransformation.cs:35); commerce SessionProvider reads it with NO fallback into Contract/Order/Node CreatedBy.
2. Charging wallet ledger durably keyed on Mongo id: OcsWallet.OwnerId + persisted WalletId string `USER:{mongoId}:{channel}:{currency}` + Redis projections parse it back out.
3. Kafka lifecycle events carry BOTH ids; partition key + deterministic MessageId = Mongo id; commerce consumer hard-skips events with empty UserId (would silently halt wallet provisioning).
4. PES g-rules are already Zitadel-native (u:<zitadelId>@<ns>) but own-only ABAC attrs (userid/createdby) are Mongo ids; templates ownership gate fails OPEN when creator unknown.
5. FE naming INVERSION: FE `identityUserId` = Mongo _id, FE `subjectId` = Zitadel id — opposite of backend vocabulary. Live bug already exists (templates-details isMaker vs list gate).
6. IdentityUserId is nullable, has NO index (Users collection has no indexes at all), and DatabaseSeeder Cases A/B exist to repair drifted values.
7. Gateways + provisioning + PES g-rules + charging session are ALREADY Zitadel-id-native (~1/3 of platform pre-migrated).

## Verdict delivered
- Literal delete-and-swap of Mongo _id → **do-not-recommend**; risk ≈ 70% (lenses: 65/72/70), ~20-30 engineer-weeks, 7 deployables, effectively irreversible (wallet ledger rekey, JWT claim flip, audit history).
- Recommended: phased consolidation — Phase 0 data hygiene (reconcile + unique index on identityUserId, fix fail-open gate, rename FE field), Phase 1 dual-expose both ids, Phase 2 consumers accept both, Phase 3 make Zitadel id the ONLY externally exposed/accepted id while _id stays private storage key. ≈ 3-5 engineer-weeks, risk ≈ 15-20%. Keep mongoId↔zitadelId mapping forever.

Full assessments: scratchpad assessments.json (session 91d60cf0) / workflow wf_a9a4ea21-91e output.
