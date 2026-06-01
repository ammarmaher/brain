---
type: index
dataset: authority-dataset
created: 2026-05-16
extracted-by: Jakco orchestrator (Phase 0)
source-of-truth: Brain Outputs (this directory)
vault-projection: falcon-wiki/100-Authority/ + Brain SK/_obsidian/40-Authority/
purpose: "Answers 'what is the authority dataset + which cluster answers which question + how to navigate the 17 cluster folders'. Open at session start before reading any specific cluster."
---

# Authority Dataset — Falcon vs Client

> [!tldr]
> Code-grounded answer to "who can see what" across the Falcon platform. Six roles (3 Falcon staff · 3 Client tenant), one PES registry of 47 keys, two app namespaces (`adminConsole.*` for Falcon, `managementConsole.*` for Client), one shared namespace (`contactGroup.*`), one cross-app role-edit matrix. Everything below is mined from code, not memory.

## What this dataset answers

| Question class | Where to look |
|---|---|
| Who are the 6 roles? | `01-roles/` (one note per role) |
| What does each role see? | `01-roles/<role>.md` "Permissions" table + (Phase 2) `05-capability-maps/<role>.capability.md` |
| What status can each entity be in? | `02-statuses/` |
| Every PES key in the platform? | `03-pes-keys/REGISTRY-RAW.md` |
| Falcon-only vs Client-only vs Shared per feature? | (Phase 1) `04-feature-parity-matrix/MATRIX.md` |
| How to copy admin → mgmt? | (Phase 3) `06-copy-playbook/` |
| Gateway routing per app? | `07-cross-cutting/gateway-routing-map.md` |
| Test users + credentials? | `07-cross-cutting/test-users.md` |

## Source files (code-grounded — every fact below traces here)

| Concept | File | Notes |
|---|---|---|
| 6 canonical roles · seeded `p`-rules · role-edit matrix | `Falcon/falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs` | The PBAC source of truth — the C# array is the seed |
| 47 PES key factories (frontend) | `Falcon/falcon-web-platform-ui/libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts` | What the FE calls when gating |
| User-type / role / status enums (Identity) | `Falcon/falcon-core-identity-svc/src/Falcon.Identity.Api/Domain/Constants/Enums.cs` | `eUserType`, `eUserRoles`, `eUserStatus`, `ePasswordSecurityLevel`, `eAuthenticationStage` |
| Commerce status enums | `Falcon/falcon-core-commerce-svc/src/Falcon.Commerce.Domain/Constants/Enums .cs` | `eAccountCreationStatus`, `eFalconServiceStatus`, `eContractStatus`, `eOrderStatus`, `eJobStatus`, `eNodeType` |
| Provisioning status | `Falcon/falcon-core-provisioning-svc/src/Falcon.Provisioning.Domain/Constants/Enums .cs` | `eProductSubscriptionStatus` |
| Test-user seed contract | `Falcon/falcon-essentials/zitadel/seed-test-users.sh` | The 6 pre-seeded users + JWT/Mongo/PES contract |
| Tenant `p`-rule template (acc-*) | `Falcon/falcon-essentials/zitadel/pes-account-role-rules.json` | What PES sees for any tenant's acc-* users |
| Subject-format contract | `Falcon/falcon-core-access-svc/src/T2.PES/Authorization/PolicySubjectContract.cs` | `u:<Zitadel-id>@<ns>` ← non-negotiable |
| Old-UI feature inventory | `Brain Outputs/datasets/old-ui-dataset/10-pages/` | The full feature tree as of `origin/main` of falcon-web-platform-ui |

## Phase status

| Phase | Status | Output |
|---|---|---|
| **Phase 0 — Foundation** | 🟢 DONE | `01-roles/` · `02-statuses/` · `03-pes-keys/` · `07-cross-cutting/` |
| **Phase 1 — Feature Parity Matrix** | 🟢 DONE | `04-feature-parity-matrix/` |
| **Phase 2 — Capability + Validation + Drift + BR + Non-PES Maps** | 🟢 DONE | `05-capability-maps/` (6 per-role) · `06-validation-by-feature/` · `08-entity-drift-by-feature/` · `09-business-rules-by-feature/` · `10-non-pes-gates-by-feature/` |
| **Phase 4 — Vault Projection** | 🟢 DONE | `falcon-wiki/100-Authority/` + `Brain SK/_obsidian/40-Authority/` (initial + Phase 2 mirrors) |
| Phase 2.5 — PES↔PRD-sheet drift audit (Q-AM-16) | 🟡 BLOCKED | Awaiting PRD Permission Sheet Tab 2 capture (Q-UM-07). See `07-cross-cutting/permission-sheet-gaps.md` |
| Phase 3 — Copy Playbook | 🟡 DEFERRED | `06-copy-playbook/` (renumbered from 06 to avoid collision; will land as `11-copy-playbook/`) |
| Phase 5 — Auto-sync hook | 🟡 DEFERRED | `falcon-wiki/scripts/scan-authority.ps1` + git hook |

## How to use this dataset

1. **For permission questions** → Start at the relevant `01-roles/<role>.md` note. Each role lists its complete `p`-rule set with allow/deny verdicts.
2. **For "can role X do Y" lookup** → Cross-reference `03-pes-keys/REGISTRY-RAW.md` (key universe) with `01-roles/<role>.md` (per-role grant).
3. **For "full action inventory per role"** → `05-capability-maps/<role>.capability.md` — page × action × verdict (~60 rows per role).
4. **For "what changes when copying admin → mgmt"** → Open `04-feature-parity-matrix/MATRIX.md` then drill into `<feature>.compare.md`.
5. **For "which V-rules apply to feature F"** → `06-validation-by-feature/MATRIX.md`.
6. **For "what entity drift will I hit on feature F"** → `08-entity-drift-by-feature/MATRIX.md`.
7. **For "what business rules govern feature F"** → `09-business-rules-by-feature/MATRIX.md`.
8. **For "what non-PES gates hide UI on feature F"** → `10-non-pes-gates-by-feature/MATRIX.md`.
9. **For "what status can a Service be in"** → `02-statuses/service-status.md`.
10. **For Obsidian navigation** → Both vaults have the projected `100-Authority/` / `40-Authority/` cluster (incl. Phase 2 mirrors).

## Standing rules carried forward

- **Password** for every test/seed user in every env: `Admin@1234`. Source: `seed-test-users.sh` default.
- **PES `g`-rule subject** MUST be `u:<ZitadelUserId>@<ns>`, never Mongo `_id`. Source: comment in `seed-test-users.sh` lines 167–171.
- **Frontend never calls Zitadel directly** — always via Identity (port 7777).
- **Gateways do not call PES** — gating is FE-only.
