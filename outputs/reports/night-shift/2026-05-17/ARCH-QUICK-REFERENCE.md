---
type: architecture-quick-reference
title: "Falcon Platform — Architectural Truths Quick Reference (2026-05-18)"
audience: "Business team, business managers, tech leads in meetings"
source: "Night-shift mining 2026-05-17→18 + authority-dataset"
purpose: "One-page source of truth for system architecture questions in business meetings"
---

# Falcon Platform — Architecture Quick Reference

> Pull this up when someone asks "how does X work?" in a meeting. Each answer cites the authoritative source.

---

## 1. What each service owns

| Service | Port | Owns | Does NOT own |
|---|---|---|---|
| **Identity** | 8080 | User lifecycle · Login/OTP/auth · Session · IP allowlist · Zitadel sync · Webhook | User permissions (PES owns those) |
| **Commerce** | 7045 | Accounts · Nodes (hierarchy) · Contracts · CommChannel/App config · Settings · Wallets (config) · **CommChannel FSM** | Balance transfers · Provisioning state |
| **Charging** | 7224 | Wallet records · Balance transfers · Ledger · Order payment flow · Balance queries | CommChannel status · Contract lifecycle |
| **Provisioning** | 7163 | Read-mirror of CommChannel/App subscription state · `availableActions[]` policy | Status transitions (Commerce drives those) |
| **Core Gateway** | 7038 | Client-user API proxy (Account Owner, Node Admin, Normal User) | Falcon-admin API |
| **System Gateway** | 7256 | Falcon-user API proxy (sys-admin, operation, product) | Client-user API |
| **Access (PES)** | (internal) | Permission enforcement · Role-based allow/deny decisions | User auth (Identity owns that) |
| **Templates** | (internal) | CommChannelConfig per-tenant + Checker level config | Template entity CRUD (NOT YET BUILT) |

[BRAIN-OUT] `understanding/backend/BACKEND_SERVICE_MAP.md` + Wave 5a/5b/5c/5d findings

---

## 2. CommChannel & Application status — who drives what

```
Account Owner / Falcon Admin
        │
        ↓  (HTTP action via Core/System Gateway)
   Commerce Service
   ────────────────
   Owns CommChannelConfig.status FSM:
   InActive → Paid → Active → Expired → InActive (Grace) / Disabled
        │
        ↓  (Kafka event: CommChannelActivated, CommChannelExpired, ...)
   Provisioning Service        Charging Service
   ────────────────────        ────────────────
   Mirrors the state +         Deducts wallet balance
   computes availableActions[] (nearest-expiring contract first)
```

**Key truth:** Provisioning is a READ-MIRROR, not a state owner. When debugging status issues → look in Commerce, not Provisioning.

[CODE] `Wave 5d: falcon-core-provisioning-svc has zero lifecycle-mutation controllers`

---

## 3. Gateway routing — which path for which user type

| User type | Role | Entry gateway | Port |
|---|---|---|---|
| Falcon admin | sys-admin, operation, product | **System Gateway** | 7256 |
| Client Account Owner | account-owner | **Core Gateway** | 7038 |
| Client Node Admin | node-admin | **Core Gateway** | 7038 |
| Client Normal User | normal-user | **Core Gateway** | 7038 |

The frontend detects user type from the JWT and selects the correct gateway base URL via `useGateway()`. No request ever goes through both gateways.

[CODE] `apps/admin-console/app.config.ts` + `apps/management-console/app.config.ts` (System Gateway) · `apps/host-shell` (Core Gateway for Client path)

---

## 4. Wallet & balance — how money moves

```
Contract activates → Master Wallet gains WalletRecords (linked to contract ID)
                     Master Wallet = SUM(Active WalletRecords)

Deduction rule: NEAREST-EXPIRING Active contract is hit first
                (loop forward until amount is satisfied)

Transfer matrix:
  Master ↔ Comm: Falcon only
  Comm ↔ User/Node: Falcon + Account Owner
  User/Node ↔ User/Node: Falcon + Account Owner + Node Admin

Balance Transfer Limit %: caps all non-Master-source transfers.
  Master as source: EXEMPT from the cap.
  0% = no limit.

Contract expires → WalletRecords RETAINED (audit) but EXCLUDED from lump-sums
Extension → Expired → Active: records RE-ENTER lump-sums immediately
```

[PRD] BR-AM-28..38 · BR-CC-31..38

---

## 5. Templates — current build state

```
PRD describes:
  Template entity (body / header / footer / variables / buttons)
  Maker/Checker governance
  Meta external approval (WhatsApp)
  Voice + AI template flows

What is actually BUILT today:
  Templates microservice = CommChannelConfig editor (3 endpoints ONLY)
    - GET /api/communication-channel-configs
    - PUT /api/communication-channel-configs/{id}
    - GET /api/communication-channel-configs/user-checker-levels

  Template entity has NO public API.
  The microservice is NOT routed by either gateway.
  Voice + AI flows have no PRD body AND no code.
```

**Business implication:** The template creation wizard, Maker/Checker flow, and Meta webhook are PHASE 2. Building any template UI requires backend architecture decisions first.

[BRAIN-OUT] `prd/modules/05-templates/GAPS.md` GAP-TM-01/02

---

## 6. Authentication flow — how login works

```
1. User submits username + password → POST /api/auth/login
2. IpAllowlistPreProcessor runs FIRST (before credentials!)
   → IP not on list → reject immediately, no credentials check
3. Credentials validated
4. If Pending status (first login):
   → Stage = OtpRequired → OTP sent via Email or SMS
   → User submits OTP → Stage = PasswordChangeRequired
   → User sets new password → Stage = Authenticated → tokens issued
   → Status changes Pending → Active
5. If Active status (regular login):
   → If no OTP: Stage = Authenticated → tokens issued
   → If OTP configured: Stage = OtpRequired → verify OTP → Authenticated
6. 3 wrong logins → Locked (Zitadel policy + Identity webhook sync)
7. 3 wrong OTPs → Locked
8. 30-minute idle → Session expired (JWT TTL)
```

[PRD] BR-UM-22..29 · [CODE] `understanding/backend/identity/controllers/AuthController/`

---

## 7. Permission model — how access control works

```
1. User has ONE Role (structural: sys-admin / account-owner / etc.)
2. User has ONE Permission Group (named bundle of allow/deny rules per action)
3. Frontend calls PES: POST /pes/authorize with subject + resource + action
4. PES evaluates: Role rules (BuiltInRoleCatalog.cs) + Permission Group overrides
5. Result: allow / explicit-deny (not just default-deny)
6. UI shows/hides buttons + routes based on PES response
7. Backend also enforces (defense-in-depth) — though some gaps found (see security notes)
```

Key distinction: **Role ≠ Permission Group**. Role is fixed at creation (structural tier). Permission Group is a configurable bundle assigned to the user and can be changed without changing the role.

[CODE] `BuiltInRoleCatalog.cs:79-290` · `falcon-access.registry.ts:1-185` · `understanding/backend/access/`

---

## 8. User lifecycle

```
Create → Pending
         │
         └── First Login completed → Active
                  │
                  ├── Suspended (manual, by admin)
                  │     └── Active (reversed by admin)
                  │
                  ├── Locked (3 wrong logins / OTPs)
                  │     └── Pending (manual unlock by Falcon only)
                  │
                  └── Deleted (soft-delete; not counted in user limits)
                        └── Active (Falcon only can restore)
```

[PRD] BR-UM-06..08 · BR-UM-23..25

---

## 9. Add Client wizard — current broken step

**Step 3 (CommChannels) and Step 4 (Applications) CommChannel/App pickers return empty.**

Root cause: Both `falcon-core-provisioning-svc` and `falcon-core-charging-svc` have a `LookupController` whose `LookupSeedData.cs` returns `new List<>()`. The dropdown gets an empty array.

**Fastest fix:** Redirect the picker to call Commerce endpoints directly:
- `GET commerce/Node/{id}/comm-channels/visible` (real per-account CommChannel list)
- `GET commerce/Node/{id}/applications` (real per-account Application list)

[CODE] `understanding/backend/provisioning/controllers/LookupController/OVERVIEW.md` finding #3

---

*Falcon Brain Forever-Wave · Night Shift 2026-05-17→18 · All facts source-prefixed · Open questions in `_pending-questions/`*
