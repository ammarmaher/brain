---
type: per-module-conclusion-knowledge
volume: 34
module: 01-account-management
title: "Module 01 — Account Management CONCLUSION KNOWLEDGE"
purpose: "The single answer key for every question about Account Management. Truth-grounded. Source-prefixed. Covers entities + workflows + rules + permissions + implementation state + cross-module dependencies + gaps."
authority: "CANONICAL for Module 01 — supersedes earlier volumes where they conflict"
prd-source: "Account Management Module VB4 + Acc - Wallet & Balance Mng VB4 (Drive sync 2026-04-24)"
---

# Module 01 — Account Management CONCLUSION

> Master answer key for everything related to: accounts, hierarchy, sub-nodes, CommChannels, Applications, settings, wallets, balance transfers, contracts-funding-flow.

---

## §1 — THE ONE-PARAGRAPH MODULE TRUTH

> **Account Management owns the structural backbone of Falcon's commercial relationships. It defines the 3-level hierarchy (Root → Main = Account → Sub-nodes recursive), the per-account configuration (password security · allowed IPs · user/node limits · balance transfer caps), the per-account subscription state of CommChannels and Applications (visibility + pricing + status FSM owned by Commerce), and the wallet topology (Balance Type × Wallet Type — 4 quadrants). Accounts are created via a mandatory 5-step wizard by Falcon admins (SA/PR only, not OP); subsequent operational management is distributed between Falcon (commercial layer: pricing, contracts, topology) and the Account Owner + Node Admin (operational layer: users, payments, transfers, contact groups). Master Wallet is an abstract aggregate computed from Active contract WalletRecords — never a physical row. Every monetary action is contract-ID-tagged for SAMA audit. Wallet records survive contract expiry for audit but exit lump-sums; extension to a future date restores them. The module crosses heavily into 02 (Account Owner creation in Step 5), 03 (contract value flows in on activation), 04 (contact groups scoped to nodes), and 05 (template config per account per commchannel — when built).**

---

## §2 — WHAT THIS MODULE OWNS

### Domain entities (per [BRAIN-OUT] `prd/modules/01-account-management/ENTITIES.md`)

| Entity | Key fields | Owner | Lifecycle |
|---|---|---|---|
| **Node** | id, type (Root/Main/Sub), parentId | Commerce | Active / Soft-deleted (inferred) |
| **Account** | id, nodeId, accountName (≤30, unique, starts with letter), accountId (auto), financeId, classificationCategory, classificationSubCategory, profilePicture, officialData | Commerce | Active (no explicit Disabled in PRD) |
| **AccountOfficialData** | entityName, authorityLetterType, sector, address fields, vatRegistrationNumber | Commerce (embedded) | n/a |
| **AccountSettings** | passwordSecurityLevel (Normal/Advanced), allowedIps[], maxNormalUserLimit, maxSystemUserLimit, maxNodeLevels, balanceTransferLimitPct | Commerce (embedded) | n/a |
| **CommChannelConfig** | accountId, commChannelId, visibility, pricingType, priceValueSar, firstActivationDate, activationDate, renewDate, status, availableActions[] | Commerce | InActive(First) → Paid → Active → Expired → InActive(GraceEnds) / Disabled |
| **AppConfig** | Same shape as CommChannelConfig | Commerce | Same FSM |
| **Wallet** | id, type (master/comm/user/node/user-comm/node-comm), ownerId, commChannelId, valueSar | Charging | n/a (lump sum derived) |
| **WalletRecord** | id, walletId, contractId, valueSar, createdAt | Charging | Live (records survive Expired contracts but excluded from lump-sums) |
| **TransferTx** | id, srcWalletId, dstWalletId, amountSar, actorId, at, contractIds[] | Charging | n/a |
| **WalletTypeConfig** | accountId, balanceType (User/Node), walletType (Single/Multiple) | Commerce | Set at create, rarely changed |

### What this module DOES NOT own
- Users → owned by Module 02 (Identity)
- Contracts → owned by Module 03 (Commerce Contracts)
- Contact Groups → owned by Module 04
- Templates → owned by Module 05 (Templates service)
- CommChannel master catalog → owned by Commerce (shared across all accounts)
- Application master catalog → owned by Commerce (shared)

---

## §3 — WORKFLOWS (truth-grounded from PRD)

Per [BRAIN-OUT] `prd/modules/01-account-management/WORKFLOWS.md` 8 workflows are defined:

### W1 — Create Account (5-step wizard)
**Trigger:** Falcon SA or PR → Organization Hierarchy → Add Client
**Steps:**
1. Account Information (mandatory)
2. Account Settings (mandatory)
3. CommChannels (optional)
4. Applications (optional)
5. Account Owner user creation (mandatory — cross-module to PRD-02)

**Implementation status:** ✅ FULLY MINED — see [`understanding/pages/organization-hierarchy/Add Client/`](Brain Outputs/understanding/pages/organization-hierarchy/Add Client/) (22-file gold-standard folder)

### W2 — Wallet & Balance Configuration (Falcon-only)
**Trigger:** Wallet & Balance Mng page → select client
**Steps:** Pick Balance Type (User/Node) + Wallet Type (Single/Multiple) → save
**Status:** 🟡 Page documented at `understanding/pages/wallets-and-balance-management/` (Wave 4) — implementation gap unclear

### W3 — Balance Transfer
**Trigger:** User invokes transfer from wallet UI
**Decision matrix:** Per role × topology (Master/Comm/User/Node combinations) — see Vol 28 Matrix 5
**Status:** ✅ Implemented; Charging service `POST charging/wallet/transfer`

### W4 — CommChannel/App Activation (first time)
**Steps:** Visibility=Show + Pricing → AO requests payment → Master Wallet debited → status Paid → Active
**Status:** ✅ Implemented via Do Payment cascade (Vol 30 Cascade 9)

### W5 — CommChannel/App Renewal
**Trigger:** Renew Date reached
**Cascade:** Auto-deduct → success keeps Active / failure → Expired + grace period (7d Monthly, 30d Yearly/OneTime)
**Status:** ✅ Documented in PRD; background job (Vol 30 Cascade 7)

### W6 — Manual Disable/Enable
**Trigger:** Falcon or AO Disable/Enable
**Status:** ✅ Implemented; `eFalconServiceAction { Disable=2, Enable=3 }`

### W7 — Account Edit (Falcon-only fields)
**Trigger:** Account → Information or Settings tab → Edit
**Open question:** BR-AM-39 — what happens when Account Limits edited while users exceed new limit? PRD silent.
**Status:** 🟡 Implementation likely; gap in BR-AM-39

### W8 — Contract → Master Wallet Funding (cross-module)
**Trigger:** Contract status → Active (Module 03)
**Cascade:** Contract value flows into Master Wallet as WalletRecords tagged with contract ID
**Status:** ✅ Implemented (Vol 30 Cascade 6)

---

## §4 — BUSINESS RULES (38 confirmed + 4 open)

Per [BRAIN-OUT] `prd/modules/01-account-management/BUSINESS_RULES.md`:

### Hierarchy & Creation (BR-AM-01..08)
- 3-level hierarchy: Root → Main → Sub (BR-AM-01)
- Only Falcon SA + PR create accounts. OP cannot. (BR-AM-02)
- Account Name: ≤30, unique, starts with letter, mandatory (BR-AM-03)
- Auto-generated Account ID + mandatory Finance ID (BR-AM-04/05)
- Classification Category: VIP/Critical/Normal (optional, BR-AM-06)
- Classification Sub-category: Bank/Gov/SemiGov/Large/Medium/SME (optional, BR-AM-07)
- Authority Letter Type: Government/Commercial/Charity (BR-AM-08)

### Settings (BR-AM-09..13)
- Password Security Level: Normal/Advanced (BR-AM-09; confirmed 2-tier in code by Wave 5b)
- Network Access via Allowed-IPs list, HTTP header enforced (BR-AM-10)
- Account Limits: maxNormalUser/maxSystemUser/maxNodeLevels/balanceTransferLimitPct — 0 = no limit (BR-AM-11)
- System User count and Normal User count are independent (BR-AM-12)
- Account Limits configured at create-time as part of Step 2 (mandatory) (BR-AM-13)

### CommChannel & App Configuration (BR-AM-14..19)
- Visibility default = Hide (BR-AM-14)
- Visibility=Show → Pricing Type + Price Value mandatory (BR-AM-15)
- Pricing Type: Monthly/Yearly/OneTime (BR-AM-16)
- Price Value ≥ 0 in SAR (BR-AM-17)
- Steps 3 + 4 OPTIONAL (BR-AM-18)
- Step 5 Account Owner creation MANDATORY (BR-AM-19)

### CommChannel Status Lifecycle (BR-AM-20..24)
- 6 states: InActive(First) / Paid / Active / Expired / InActive(GraceEnds) / Disabled (BR-AM-20)
- Grace: 7d Monthly / 30d Yearly/OneTime (BR-AM-21)
- Activation deducts from Master Wallet + tags contractId (BR-AM-22 INFERRED)
- Renewal cascade (BR-AM-23 INFERRED)
- Disabled is manual (BR-AM-24)

### Wallet & Balance (BR-AM-25..34)
- Balance Type + Wallet Type = Falcon-usertype-only (BR-AM-25)
- 4 wallet matrix configs: User+Single / User+Multiple / Node+Single / Node+Multiple (BR-AM-26)
- Node-based: only Normal Users consume; Node Admins hold but don't consume (BR-AM-27)
- Master Wallet = abstract aggregate of Active contract WalletRecords (BR-AM-28)
- Comm Wallet = per-commchannel wallet in Multiple-wallet mode (BR-AM-29)
- Transfer Master ↔ Comm = Falcon-only (BR-AM-30)
- Transfer Comm ↔ User/Node = Falcon + AO (BR-AM-31)
- Transfer User/Node ↔ User/Node = Falcon + AO + NA (BR-AM-32)
- Single-wallet Master ↔ User/Node = Falcon + AO (BR-AM-33)
- Balance Transfer Limit % caps non-Master-source transfers; 0% = no limit (BR-AM-34)

### Contract Interplay (BR-AM-35..38)
- Contract value flows into Master Wallet on activation (BR-AM-35)
- Every balance-affecting action tagged with contractId (BR-AM-36)
- Deductions traverse Active contracts nearest-expiring first (BR-AM-37)
- On contract expiration: WalletRecords retained but excluded from lump-sums (BR-AM-38)

### OPEN questions
- BR-AM-39 [OPEN] — Account Limits edit while users already exceed
- BR-AM-40 [OPEN] — TBD
- BR-AM-41 [OPEN] — Changing Balance/Wallet Type with non-zero balances
- BR-AM-42 [OPEN] — TBD

---

## §5 — PERMISSIONS MATRIX (Module 01 specific)

| Action | SA | OP | PR | AO | NA | NU |
|---|---|---|---|---|---|---|
| Create Account | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Edit Account Info | ✅ | ✅ (limited) | ✅ | 🟡 (own info) | ❌ | ❌ |
| Edit Account Settings | ✅ | 🟡 | ✅ | 🟡 (password level + IPs) | ❌ | ❌ |
| Edit Account Limits | ✅ | ❌ | ✅ | ❌ (Falcon-only) | ❌ | ❌ |
| Add Node/Sub-node | ✅ | ✅ | ✅ | ✅ | ✅ (sub-tree) | ❌ |
| Edit CommChannel visibility | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit CommChannel price | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Do Payment | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Disable CommChannel | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Enable CommChannel | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Set Wallet Topology | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Master ↔ Comm transfer | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Comm ↔ User/Node transfer | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| User/Node ↔ User/Node transfer | ✅ | ✅ | ✅ | ✅ | ✅ (within sub-tree) | ❌ |

---

## §6 — WHAT'S IMPLEMENTED (verified)

✅ **Add Client wizard (5 steps)** — `understanding/pages/organization-hierarchy/Add Client/` (22 files)
✅ **Commerce service** — 9 controllers deep-mined (Wave 5a): NodeController, AccountHierarchyController, SettingController, ApplicationController, CommunicationChannelController, InformationController, ContractsController, LookupController, SecurityController, TestingAccountsController
✅ **Charging service** — 4 controllers deep-mined (Wave 5c): WalletController, LookupController, TestKafkaController, TestingChargingController
✅ **Provisioning service** — 2 controllers (Wave 5d): ServicesController, LookupController
✅ **Wallet topology engine** — `WalletTypeConfig` + per-quadrant logic
✅ **Master Wallet abstraction** — computed from Active contract WalletRecords
✅ **Transfer matrix enforcement** — Charging `POST charging/wallet/transfer`
✅ **Status FSM (CommChannel/App)** — Commerce-owned (corrected by Wave 5d — was thought to be Provisioning)
✅ **Audit trail tagging** — WalletRecord.contractId + TransferTx.contractIds[]
✅ **Backend service-level dossiers** — `understanding/backend/{commerce,charging,provisioning}/` all 6 files each

---

## §7 — WHAT'S NOT IMPLEMENTED / OPEN GAPS

🔴 **AccountHierarchyController missing tenant-isolation check** (Wave 5a security finding) — `OwnerIdNotMatchWithTenantId` guard absent

🔴 **SettingController + InformationController missing class-level `[Authorize]`** (Wave 5a)

🔴 **InformationController has commented-out NodeAdmin role gate** (Wave 5a)

🟡 **LookupController returns empty** in both Commerce AND Provisioning AND Charging — Add Client wizard CommChannel/App picker broken (Wave 5d)

🟡 **Settings tab visibility rules** — node-aware tab visibility (Falcon root → 2 tabs, client root → 4 tabs, sub-node → 3 tabs) is documented but `SettingsOnlyAllowedForMainNode` 422 enforcement needs verification

🟡 **W7 BR-AM-39 OPEN** — Account Limits edit while users exceed new limit (PRD silent)

🟡 **W2 BR-AM-41 OPEN** — Wallet topology change with non-zero balances (PRD silent)

🟡 **Account deletion flow not formally in PRD** (implicit; Falcon-only assumed)

🟡 **Wallet topology change frequency** — practically a one-way door; needs operational discipline

---

## §8 — CROSS-MODULE DEPENDENCIES

| Cross-module | What flows | Direction |
|---|---|---|
| **→ 02 User Management** | Step 5 of Add Client creates Account Owner user | 01 → 02 |
| **→ 03 Contract & Cost** | Master Wallet funded by Contract activation (BR-AM-35) | 03 → 01 |
| **→ 03 Contract & Cost** | Nearest-expiring contract deduction order (BR-AM-37 + BR-CC-31) | 01 ↔ 03 |
| **→ 04 Contact Group Mgmt** | Contact Groups scoped to Nodes (hierarchy) | 01 → 04 |
| **→ 05 Templates** | Template config per account per commchannel | 01 → 05 (when built) |
| **→ Permission System** | Account role matrix in PES catalog | 01 → PES |
| **→ Finance Integration** | Finance ID links account to Finance team records | 01 → Finance |
| **→ Identity Service** | tenantId = Account scoping for users | 01 ↔ Identity |

---

## §9 — TOP 10 BUSINESS QUESTIONS (with answers)

| # | Question | Answer | Citation |
|---|---|---|---|
| 1 | Who can create an account? | Falcon SA + PR only (NOT OP) | BR-AM-02 |
| 2 | What's the account creation flow? | 5-step wizard: Info + Settings + CommChannels(opt) + Apps(opt) + AO User | W1 |
| 3 | Can Account Owner change pricing? | NO — Falcon-only (BR-AM-25) | BR-AM-25 |
| 4 | What's the wallet topology? | 4 quadrants: User×{Single,Multiple} × Node×{Single,Multiple}, Falcon-set | BR-AM-26 |
| 5 | Is Master Wallet a real table? | NO — abstract aggregate of Active contract records | BR-AM-28 |
| 6 | When does contract value enter the wallet? | On contract Active status — flows into Master Wallet | BR-AM-35 / W8 |
| 7 | What's the CommChannel grace period? | 7 days Monthly / 30 days Yearly+OneTime | BR-AM-21 |
| 8 | Can AO disable a CommChannel? | YES — AO has Disable + Do Payment but NOT Edit Price | BR-AM-24/25 |
| 9 | Who can transfer Master → Comm? | Falcon only | BR-AM-30 |
| 10 | What happens when contract expires? | Records retained for audit but excluded from lump-sums; restored on extension | BR-AM-38 + BR-CC-17 |

---

## §10 — MODULE 01 NEW INSTRUCTIONS

For any future session working on Account Management:

1. **CommChannel FSM debugging starts in Commerce, NOT Provisioning** — Wave 5d arch finding
2. **Master Wallet has NO physical row** — never write code assuming a "master_wallet" table exists
3. **Tenant isolation must be checked at each handler** — Wave 5a found AccountHierarchyController missing
4. **Wallet topology changes are operationally heavy** — never do without backup + plan
5. **Account Name is immutable post-creation** — set in stone like Username
6. **Nearest-expiring rule is non-negotiable** — every deduction goes through it
7. **0 limit = no limit, NOT empty** — Account Limits fields require explicit values
8. **Step 5 partial-failure preserves wizard state** — DO NOT auto-rollback (F-015 per DECISION-PROTOCOL)
9. **All contract-tagged audit entries** must survive contract expiration — they're audit records
10. **CommChannel pricing changes have effective-date rules** — Monthly/Yearly clamp to renewDate-1d

---

## §11 — CROSS-LINKS

- [BRAIN-OUT] `prd/modules/01-account-management/{OVERVIEW,BUSINESS_RULES,ENTITIES,WORKFLOWS,QUESTIONS,GAPS}.md`
- [BRAIN-OUT] `understanding/pages/organization-hierarchy/Add Client/` (22 files)
- [BRAIN-OUT] `understanding/backend/commerce/controllers/{Node,AccountHierarchy,Setting,Application,CommunicationChannel,Information,Contracts,Lookup,Security,TestingAccounts}Controller/`
- [BRAIN-OUT] `understanding/backend/charging/controllers/WalletController/`
- [BRAIN-OUT] `understanding/integration/ARCH-FINDING-CommChannel-FSM-ownership.md`
- [VAULT] `Brain SK/_obsidian/10-Pages/Add Client Flow.md`
- [Atlas] Vol 1 Scenarios 1, 5, 6 · Vol 2 Scenarios 9-12 · Vol 28 Matrices 3, 5 · Vol 30 Cascades 5-13

---

*Vol 34 · Module 01 Account Management CONCLUSION · 2026-05-18 · Truth-grounded · Source-prefixed · Master answer key for the module.*
