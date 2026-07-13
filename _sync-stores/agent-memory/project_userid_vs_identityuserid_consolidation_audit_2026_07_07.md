---
name: project-userid-vs-identityuserid-consolidation-audit-2026-07-07
description: "Full-platform audit of Mongo User._id vs Zitadel IdentityUserId + verdict on deleting the Mongo id — do-not-recommend (~70% risk); phased external-only consolidation recommended (~15-20%, 3-5 wks)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 91d60cf0-557e-4b34-bac6-62f1854bf742
---

2026-07-07 — 9-agent audit (6 research + 3 adversarial risk lenses) of the two Falcon user ids, for Ammar's proposal to DELETE the Falcon-minted userId and key everything on the Zitadel IdentityUserId.

**UPDATE 2026-07-08:** Ammar confirmed the aim IS the full delete (not the keep-internal compromise). Boss-approval HTML report delivered at `C:\Falcon\reports\userid-consolidation\userid-consolidation-approval-report.html` — 3 full-delete plans: P1 big-bang 65-70% risk, **P2 shadow-collection+dual-write 25-30% RECOMMENDED (users_v2 keyed on Zitadel id, backfill+id_map, flag-switched reads, wallet batch re-key w/ balance reconciliation, drop v1 at Stage 5, 10-14 wks, zero downtime)**, P3 tenant-by-tenant 35-40%. Awaiting boss sign-off; then "start Stage 0". No code touched.

**UPDATE 2026-07-08 (2):** No production data confirmed → recommendation flipped to ONE-SHOT conversion. Wave plan (6 waves, file-level work packages, exit gates) at `C:\Falcon\plans\zitadel-id-consolidation-waves.md`. Branch `feature/zitadel-id-consolidation` created LOCALLY in identity/commerce/contact-group/templates/web-platform-ui (FE base = polishing-v0.4 — FE main is 458 commits stale; backends = latest main 2026-07-08). Charging/provisioning/gateways = zero code change. Essentials repo left on SignalR branch (Ammar's decision). Undo = [[reference-pre-userid-migration-db-backups-2026-07-08]]. Next: boss approval → "start wave 1".

**The IDs:** `userId` = Mongo `User._id` (24-hex ObjectId, driver-minted, [BsonId][BsonRepresentation(ObjectId)], User.cs:10-12). `identityUserId` = Zitadel 18-digit numeric id = JWT `sub` (nullable string, NO unique index — Users collection has no indexes at all; User.cs:62-63).

**Load-bearing couplings (why delete is dangerous):**
- Mongo _id round-trips through Zitadel metadata `user-id` → JWT claim → read on EVERY request (ZitadelClaimsTransformation.cs:35); commerce SessionProvider.cs:45 consumes it with no fallback into CreatedBy on contracts/orders/nodes.
- Charging wallet ledger persists `USER:{mongoId}:{channel}:{currency}` WalletId strings + OwnerId; Redis projections parse the mongoId back out. Gateway account-hierarchy joins identity user Id ↔ wallet OwnerId — a one-sided flip silently blanks wallet rows.
- Kafka lifecycle events partition/dedup on Mongo UserId; commerce consumer hard-skips empty UserId (halts wallet provisioning).
- PES g-rules already Zitadel-native, but own-only ABAC attrs (userid/createdby) are Mongo ids; templates ownership gate FAILS OPEN on unknown creator.
- FE naming INVERSION: FE `identityUserId` = Mongo _id, FE `subjectId` = Zitadel id (opposite of backend). Live bug: templates-details isMaker uses subjectId vs list gate identityUserId.
- ~1/3 of platform already Zitadel-native: both gateways, provisioning, PES g-rules, charging/provisioning ActivityLog.CreatedBy.

**Why:** verdict delivered to Ammar: do NOT literally delete Mongo _id (risk ≈70%: 65 data-integrity / 72 security / 70 operational; 20-30 eng-wks; irreversible). Instead phased consolidation (~15-20% risk, 3-5 wks): P0 reconcile+unique-index identityUserId, fix fail-open gate + FE rename; P1 dual-expose both ids; P2 consumers accept both; P3 Zitadel id becomes the ONLY external id, _id stays private storage key; keep mongoId↔zitadelId map forever.

**How to apply:** if the user asks to implement, start at Phase 0; never rekey charging wallets in place; runtime-verify commerce's `user-id` claim path first (its ZitadelClaimsTransformation never extracts it — unverified). Full file:line change map (creation sites, DTO/mapper lines, endpoint filters, FE gates, Kafka keying) delivered 2026-07-07; key creation-path sites: CreateUserProcess.cs:67/100/136/231, UserCreationRequestedConsumer.cs:179-227, DatabaseSeeder.cs:229, UserMapper.cs:19/54/77/88, IdentityUserLifecycleEventPublisher.cs:51/63-66. Related: [[reference_user_delete_mechanism_status_transition]], [[PES g-link must use Zitadel id (= JWT.sub), NOT Mongo _id]], [[project_user_lifecycle_4_bugs_rootcause_2026_06_30]].
