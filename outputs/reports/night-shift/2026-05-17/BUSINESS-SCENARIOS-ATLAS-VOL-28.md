---
type: business-scenarios-atlas
volume: 28
title: "Falcon Business Scenarios Atlas — Volume 28: Complete Matrices (Every User × Status × Action)"
purpose: "Exhaustive state × actor × action matrices. For every possible combination, what's allowed/blocked/conditional. The single reference for permission and lifecycle questions."
volume-28-matrices: 9
---

# Falcon Business Scenarios Atlas — Volume 28: The Complete Matrices

> When someone asks "can [role] do [action] when [state]?" — answer is in one of these 9 matrices. Source-prefixed. Simplified. Memorizable.

---

## LEGEND (for all matrices)

| Symbol | Meaning |
|---|---|
| ✅ | Allowed — full action permitted |
| ❌ | Blocked — action explicitly denied |
| 🟡 | Partial — allowed with conditions (footnote) |
| ⚪ | Not applicable — state doesn't make sense for this actor |
| 🔒 | Falcon-only — Client actors blocked |
| ⏰ | Time-restricted — depends on time/dates |

### Actor abbreviations

| Abbr | Full | Type |
|---|---|---|
| **SA** | Falcon System Administrator | Falcon |
| **OP** | Falcon Operation | Falcon |
| **PR** | Falcon Product | Falcon |
| **AO** | Account Owner | Client |
| **NA** | Node Admin | Client |
| **NU** | Normal User | Client |

### Status abbreviations (User)

| Abbr | Full |
|---|---|
| **PEN** | Pending |
| **ACT** | Active |
| **SUS** | Suspended |
| **LCK** | Locked |
| **DEL** | Deleted |

---

## MATRIX 1 — User Lifecycle: Status Transitions × Who Can Do Them

[PRD] BR-UM-06/07/08/39 · [CODE] BuiltInRoleCatalog.cs:18-75

### Transition matrix

| From → To | SA | OP | PR | AO | NA | NU |
|---|---|---|---|---|---|---|
| (create) → PEN | ✅ | ✅¹ | ✅ | ✅² | ✅³ | ❌ |
| PEN → ACT | self (user completes First Login) | self | self | self | self | self |
| ACT → SUS | ✅ | ✅¹ | ✅ | ✅² | ✅³ | ❌ |
| SUS → ACT | ✅ | ✅¹ | ✅ | ✅² | ✅³ | ❌ |
| ACT → LCK | system (3 wrong logins/OTPs) | system | system | system | system | system |
| LCK → PEN | ✅ Falcon-only | ❌ | ❌ | ❌ | ❌ | ❌ |
| ACT → DEL | ✅ | ✅¹ | ✅ | ✅² | ✅³ | ❌ |
| DEL → ACT | ✅ **Falcon-only** (BR-UM-39) | ❌ | ❌ | ❌ | ❌ | ❌ |
| (self) PEN | n/a | n/a | n/a | n/a | n/a | n/a |
| (self) edit ACT profile | own profile only (BR-UM-41) | own | own | own | own | own |

¹ OP can edit Client users only, not Falcon users
² AO can edit Client users in their account
³ NA can edit Normal Users in their sub-tree only

### Simplified rule (memorize this)
- **Falcon admins (SA/OP/PR)** can do everything on Client users in their scope; cannot edit Falcon users above their tier
- **AO** owns user lifecycle within the account
- **NA** owns user lifecycle within their sub-node only
- **NU** can edit only own profile (excludes Role/Status/PermissionGroup)
- **LCK → PEN** and **DEL → ACT** are Falcon-only by design

---

## MATRIX 2 — Actor × User Status × Allowed Actions

Quick "who can do what to whom" matrix.

### Falcon-side actors (SA / OP / PR)

| Target user status | View | Edit Profile | Edit Role | Edit Status | Reset Password | Force-Change-Pwd | Delete | Restore |
|---|---|---|---|---|---|---|---|---|
| PEN | ✅ | ✅ | ✅ | ✅ | ✅ | n/a | ✅ | n/a |
| ACT | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | n/a |
| SUS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | n/a |
| LCK | ✅ | 🟡 (unlock first) | ❌ | ✅ (→PEN) | ❌ | ❌ | ✅ | n/a |
| DEL | ✅ | ❌ | ❌ | 🟡 (→ACT only) | ❌ | ❌ | n/a | ✅ **Falcon-only** |

### Client-side actors (AO)

| Target user status | View | Edit Profile | Edit Role | Edit Status | Reset Password | Delete | Restore |
|---|---|---|---|---|---|---|---|
| PEN | ✅ (own scope) | ✅ | ✅ | ✅ | ✅ | ✅ | n/a |
| ACT | ✅ | ✅ | ✅ | ✅ (limited) | ✅ | ✅ | n/a |
| SUS | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | n/a |
| LCK | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | n/a |
| DEL | 🟡 (with includeDeleted) | ❌ | ❌ | ❌ | ❌ | n/a | ❌ |

### Client-side actors (NA)

| Target = Normal User in their sub-tree | View | Edit Profile | Edit Role | Edit Status | Reset Pwd | Delete |
|---|---|---|---|---|---|---|
| PEN | ✅ | ✅ | 🟡 (NU→NU only) | ✅ | ✅ | ✅ |
| ACT | ✅ | ✅ | 🟡 | ✅ | ✅ | ✅ |
| SUS | ✅ | ✅ | 🟡 | ✅ | ✅ | ✅ |
| LCK | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| DEL | 🟡 | ❌ | ❌ | ❌ | ❌ | n/a |

NA cannot edit Account Owner. NA cannot manage users outside their sub-tree.

### Normal User (NU)

NU can only edit OWN profile (per BR-UM-41), excluding:
- Role
- Status
- Permission Group

---

## MATRIX 3 — CommChannel/App Status × Actor × Available Actions

[PRD] BR-AM-20..25 · [CODE] eProductSubscriptionStatus · `ServicesActionsPolicy.cs`

### CommChannel/App states + who can drive them

| Status | Description | Who triggers entry |
|---|---|---|
| **InActive (First time)** | Initial state; never paid | System (on creation) |
| **Paid** | Payment completed; settlement pending | Falcon or AO via Do Payment |
| **Active** | Fully active; can be used | System (post-Paid settlement) |
| **Expired** | renewDate passed without payment | System (background job) |
| **InActive (Grace Period Ends)** | Grace period elapsed | System |
| **Disabled** | Manually disabled | Falcon or AO |

### Action matrix per status × actor

#### For **InActive (First time)** status

| Action | SA | OP | PR | AO | NA | NU |
|---|---|---|---|---|---|---|
| View | ✅ | ✅ | ✅ | ✅ | ✅¹ | ❌ |
| Edit Visibility | ✅ 🔒 | ✅ 🔒 | ✅ 🔒 | ❌ | ❌ | ❌ |
| Edit Price Type | ✅ 🔒 | ✅ 🔒 | ✅ 🔒 | ❌ | ❌ | ❌ |
| Edit Price Value | ✅ 🔒 | ✅ 🔒 | ✅ 🔒 | ❌ | ❌ | ❌ |
| Do Payment | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Disable | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Enable | n/a | n/a | n/a | n/a | n/a | n/a |

¹ NA sees per their sub-node scope

#### For **Paid** status

| Action | SA | OP | PR | AO | NA | NU |
|---|---|---|---|---|---|---|
| View | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit Price Type | ✅⏰ 🔒 | ✅⏰ 🔒 | ✅⏰ 🔒 | ❌ | ❌ | ❌ |
| Edit Price Value | ✅ 🔒 | ✅ 🔒 | ✅ 🔒 | ❌ | ❌ | ❌ |
| Disable | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

⏰ Edit Price Type requires future effective date (Monthly/Yearly: clamped to renewDate-1d; OneTimePayment: any future date)

#### For **Active** status

| Action | SA | OP | PR | AO | NA | NU |
|---|---|---|---|---|---|---|
| View | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (for use) |
| Edit Price Type | ✅⏰ 🔒 | ✅⏰ 🔒 | ✅⏰ 🔒 | ❌ | ❌ | ❌ |
| Edit Price Value | ✅ 🔒 | ✅ 🔒 | ✅ 🔒 | ❌ | ❌ | ❌ |
| Disable | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Send Transaction | n/a | n/a | n/a | n/a | n/a | ✅ |

#### For **Expired** status (within grace window)

| Action | SA | OP | PR | AO | NA | NU |
|---|---|---|---|---|---|---|
| View | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Do Payment | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Disable | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Send Transaction | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

#### For **InActive (Grace Period Ends)** status

| Action | SA | OP | PR | AO | NA | NU |
|---|---|---|---|---|---|---|
| View | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Do Payment | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Hide (Visibility) | 🟡 (canHide rules apply) | 🟡 | 🟡 | ❌ | ❌ | ❌ |

#### For **Disabled** status

| Action | SA | OP | PR | AO | NA | NU |
|---|---|---|---|---|---|---|
| View | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Enable | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Do Payment | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Simplified rule
- **Visibility + Pricing edits = Falcon-only** (BR-AM-25)
- **Do Payment + Disable = Falcon + AO** (AO has direct action capability)
- **Enable = Falcon + AO** (AO can re-enable a Disabled service)
- **NA never acts on CommChannels/Apps** (only views per their scope)
- **NU only consumes** (Send Transaction); never manages

---

## MATRIX 4 — Contract States × Editable Fields × Actor

[PRD] BR-CC-11/15/16/17

### State definitions

| Status | Description |
|---|---|
| **PEN (Pending)** | startDate > now |
| **ACT (Active)** | startDate ≤ now < expirationDate |
| **EXP (Expired)** | expirationDate ≤ now (records retained but frozen from lump-sum) |

### Editable fields per status (Falcon-only — BR-CC-01)

| Field | PEN | ACT | EXP |
|---|---|---|---|
| Contract Name | ✅ | ❌ | ❌ |
| Farabi Ref ID | ✅ | ✅ | ✅ |
| Start Date | ✅ | ❌ | ❌ |
| Expiration Date | ✅ | ✅⏰ | ✅⏰ (extending = revives to ACT) |
| Value (SAR) | ✅ | ❌ | ❌ |
| Rate Card price values | ✅ | ✅ | ✅ |
| Contract Details grid | ✅ | ✅ | ✅ |
| Addon free credits | ✅ | ✅ | ✅ |
| Addon rate card | ✅ | ✅ | ✅ |
| Currency | ✅ | ❌ | ❌ |

⏰ Expiration Date must be > now AND > Start Date

### Visibility matrix per actor

| Field | SA/OP/PR | AO | NA | NU |
|---|---|---|---|---|
| All fields (read-only) | ✅ | ✅ | ✅ | ❌ |
| Remaining Value | ✅ always | ✅ ACT only / `NA` PEN / hidden EXP | same as AO | ❌ |

### Special rules (memorize)
- **Extension of Expired contract** to future date → status flips EXP → ACT; wallet records re-enter lump-sums (BR-CC-17)
- **Auto-status transitions** (PEN→ACT on startDate; ACT→EXP on expirationDate) are system-driven; users cannot set status directly (BR-CC-10)
- **All contract creation/edit = Falcon usertype only** (BR-CC-01)

---

## MATRIX 5 — Wallet Topology × Transfer Permission

[PRD] BR-AM-25..34

### The 4-quadrant topology

| | Single Wallet | Multiple Wallets |
|---|---|---|
| **User-based** | Master + 1 User wallet/user | Master + 1 Comm wallet/channel + per-user-per-channel sub-wallets |
| **Node-based** | Master + 1 Node wallet/node | Master + 1 Comm wallet/channel + per-node-per-channel sub-wallets |

Topology is **Falcon-only setting** (BR-AM-25).

### Transfer permission matrix

| Transfer Direction | Falcon | AO | NA |
|---|---|---|---|
| Master ↔ Comm (Multiple only) | ✅ | ❌ (BR-AM-30) | ❌ |
| Comm ↔ User wallet (Multiple, User-based) | ✅ | ✅ | ❌ |
| Comm ↔ Node wallet (Multiple, Node-based) | ✅ | ✅ | ❌ |
| User ↔ User (User-based) | ✅ | ✅ (BR-AM-32) | ❌ (cannot cross-user) |
| Node ↔ Node (Node-based) | ✅ | ✅ (BR-AM-32) | ✅ (within own sub-tree) |
| Master ↔ User/Node (Single mode) | ✅ | ✅ (BR-AM-33) | ❌ |

### Balance Transfer Limit % rule (BR-AM-34)

- Caps every transfer EXCEPT those FROM Master Wallet
- 0% = no limit
- Applied per-transfer (not aggregate)

### Memorize this transfer cheat sheet

| Source → Destination | Master | Comm | User | Node |
|---|---|---|---|---|
| **Master** | ⚪ | 🔒 Falcon | ✅ Falcon + AO (Single) | ✅ Falcon + AO (Single) |
| **Comm** | 🔒 Falcon | ⚪ | ✅ Falcon + AO | ✅ Falcon + AO |
| **User** | ❌ | ✅ Falcon + AO | ✅ Falcon + AO | n/a |
| **Node** | ❌ | ✅ Falcon + AO | n/a | ✅ Falcon + AO + NA (within scope) |

### Simplified rules
- **Master is Falcon's domain** (anyone touching Master = Falcon-only EXCEPT Master → User/Node which AO can do in Single mode)
- **AO controls Comm and User/Node distribution** (operational level)
- **NA controls within sub-tree only** (peer-to-peer node transfers)

---

## MATRIX 6 — ContactGroup × Actor × Action

[PRD] BR-CGM-13..23 · Contact Group Permissions sheet

### Per actor × role-relation × action

#### Falcon usertype (SA/OP/PR) — same for all Falcon roles per BR-CGM-13

| Action | Falcon |
|---|---|
| View | ✅ (with Main node selection; sees softDeleted too) |
| Create | ❌ |
| Edit | ❌ |
| Share | ❌ |
| Delete | ❌ |
| Download (original file) | ✅ |
| Download (validated file) | ✅ |
| View softDeleted | ✅ |

#### Client Account Owner (AO)

| Action | Creator | Non-creator |
|---|---|---|
| View | ✅ | ✅ |
| Create | ✅ | ✅ (always allowed) |
| Edit | ✅ | ❌ (creator-only edit) |
| Share | ✅ | ✅ (BR-CGM-11) |
| Delete | ✅ (soft-delete) | ❌ |
| Download | ✅ | ✅ |

#### Client Node Admin (NA)

| Action | Creator | Non-creator |
|---|---|---|
| View | ✅ | ✅ (within sub-tree) |
| Create | ✅ | ✅ |
| Edit | ✅ | ❌ |
| Share | ✅ | ✅ |
| Delete | ✅ | ❌ |
| Download | ✅ | ✅ |

#### Client Normal User (NU)

| Action | Creator | Non-creator |
|---|---|---|
| View | ✅ (own) | ✅ (Shared Groups tab only) |
| Create | ✅ | ✅ |
| Edit | ✅ | ❌ |
| Share | ❌ (NU cannot share even own — BR-CGM-12) | ❌ |
| Delete | ✅ | ❌ |
| Download | ✅ | ✅ |

### Tabs visibility per actor on their own node

| Actor | Tabs visible |
|---|---|
| AO / NA (own node) | 1 tab: "Contact Groups" |
| NU (own node) | 2 tabs: "Contact Groups" + "Shared Groups" |
| AO / NA (sub-node within hierarchy) | 1 tab: "Contact Groups" |
| Falcon (must select Main node first) | 1 tab; view-only; sees soft-deleted |

### Simplified rules (memorize)
- **Falcon = view+download only** (never creates client business content)
- **Creator = full control** of own group
- **Non-creator AO/NA = share + view + download** but NOT edit/delete
- **NU = no share** (even of own groups)
- **softDeleted hidden from clients; visible to Falcon for compliance**

---

## MATRIX 7 — Template × State × Actor × Action

[PRD] BR-TM-01..29

### State definitions

| Falcon Status | Meta State (WhatsApp) | Usable? |
|---|---|---|
| Pending | In-Review | ❌ |
| Approved | Active - Quality Pending | ✅ |
| Approved | Active - High Quality | ✅ |
| Approved | Active - Medium Quality | ✅ (at risk) |
| Approved | Active - Low Quality | ✅ (in danger) |
| Approved | Paused | ❌ (Meta blocks send) |
| Approved | Disabled | ❌ (Meta blocks send) |
| Rejected | Rejected | ❌ |

### Actor × Action matrix

| Action | Falcon (SA/OP/PR) | AO Maker | AO Checker | NA Maker | NA Checker | NU |
|---|---|---|---|---|---|---|
| Create | ❌ (BR-TM-01) | ✅ | n/a | ✅ | n/a | ❌ |
| Edit (Draft) | ❌ | ✅ (own) | n/a | ✅ (own) | n/a | ❌ |
| Submit | ❌ | ✅ | n/a | ✅ | n/a | ❌ |
| Approve (Checker) | 🟡¹ | n/a | ✅ | n/a | ✅ | ❌ |
| Reject (Checker) | 🟡¹ | n/a | ✅ | n/a | ✅ | ❌ |
| Use in Send | n/a | n/a | n/a | n/a | n/a | ✅ (if Approved+Usable) |
| Delete | ❌² | ✅ (own, BR-TM-38 OPEN) | ❌ | ✅ | ❌ | ❌ |
| Submit to Meta | system | n/a | n/a | n/a | n/a | n/a |

¹ Falcon may approve in some configurations (BR-TM-31 OPEN — role assignment unclear)
² Deletion semantics unclear (BR-TM-38 OPEN)

### Status transitions × Triggering actor

| Transition | Trigger | Notes |
|---|---|---|
| (none) → Draft | Maker creates | Maker-only |
| Draft → Pending | Maker submits | Maker-only |
| Pending → Approved | Checker approves AND/OR Meta approves | Two-step gate (BR-TM-23) |
| Pending → Rejected | Checker rejects OR Meta rejects | Either-step kill (BR-TM-23) |
| Approved (Active) → Approved (Paused) | Meta auto-action | System-driven, requires webhook (GAP-TM-14 OPEN) |
| Approved (Paused) → Approved (Active) | Meta auto-action | Same |
| Approved → Approved (Disabled) | Meta auto-action | Effectively dead |

### Memorize
- **Falcon never creates templates** (BR-TM-01) — client business content
- **2-step approval**: Checker (internal) + Meta (external for WhatsApp)
- **Approved ≠ Usable** — must also check Meta state (BR-TM-27)
- **Today: Templates entity API doesn't exist** (GAP-T-001) → the entire matrix is theoretical until backend ships

---

## MATRIX 8 — Auth Flow Stages × User Status × Action

[PRD] BR-UM-22..29 · [CODE] eAuthenticationStage

### eAuthenticationStage values

| Stage | Description | Tokens issued? |
|---|---|---|
| InProgress | Credentials being validated | No |
| OtpRequired | Awaiting OTP entry | No (sessionId only) |
| PasswordChangeRequired | Pending user must change password | No |
| Authenticated | Full auth complete | Yes (JWT pair) |
| Failed | Auth failed | No |

### Flow per user status

| User Status | Expected Flow | Result |
|---|---|---|
| **PEN (First Login)** | IpCheck → Credentials → OtpRequired → OtpVerify → PasswordChangeRequired → SetPassword → Authenticated | Status auto-flips PEN → ACT; tokens issued |
| **ACT (Regular Login, no OTP config)** | IpCheck → Credentials → Authenticated | Tokens issued |
| **ACT (Regular Login, OTP config)** | IpCheck → Credentials → OtpRequired → OtpVerify → Authenticated | Tokens issued |
| **SUS** | IpCheck → Credentials → Failed | "Account suspended" message |
| **LCK** | IpCheck → Credentials → Failed | "Account locked" message |
| **DEL** | IpCheck → Credentials → Failed | Generic "invalid credentials" (don't reveal deletion) |

### IP check matrix

| IP in allowedIps[]? | Action |
|---|---|
| ✅ in list (or list empty) | Proceed to credentials |
| ❌ not in list | Reject IMMEDIATELY (before credentials check — BR-UM-24) |

### OTP behavior matrix

| Context | Wrong OTP behavior | Lockout? |
|---|---|---|
| Login OTP | Counter increments | YES after 3 (BR-UM-27) |
| First-Login OTP | Counter increments | YES after 3 |
| Forgot-Password OTP | **Silently ignored** (BR-UM-32) | NO (anti-DoS design) |
| Edit-Email/Phone OTP (self) | Counter increments | YES (assumed) |

### Memorize
- **IP check FIRST**, before credentials (BR-UM-24)
- **3 wrong attempts = Locked** (BR-UM-25/27) — applies to Login + First Login
- **Forgot-Password is silent on wrong OTP** — anti-DoS design (BR-UM-32) — auditors will flag; document the rationale
- **30-min idle timeout** on Session (BR-UM-29)
- **Force-logout-all-sessions on password change** (BR-UM-35)

---

## MATRIX 9 — Send Transaction Decision Matrix (the money flow per message)

[PRD] BR-CC-30..38 · BR-AM-26..38

### Pre-flight checks (in order)

| Check | Pass condition | If fail |
|---|---|---|
| 1. User Status = ACT | NU is Active | Reject — "user not active" |
| 2. CommChannel Status = Active | CommChannel Active (not Paid/Expired/Disabled) | Reject — "channel not active" |
| 3. Template Status = Approved + Meta Usable | Approved AND Meta state ∈ {Quality pending, High, Medium, Low} | Reject — "template not usable" |
| 4. ContactGroup Status = Completed | CG fully uploaded + validated | Reject — "contact group in progress" |
| 5. Wallet has balance | accessible wallet ≥ required cost | Reject — "insufficient balance" |
| 6. Account WalletTypeConfig set | Topology configured (not null) | Reject — "WalletNotConfigForTheNode" |

### Wallet selection per topology

| Topology | NU consumes from |
|---|---|
| User-based + Single | NU's User Wallet |
| User-based + Multiple | NU's User-CommChannel sub-wallet (matching CommChannel of send) |
| Node-based + Single | Node Wallet of NU's node |
| Node-based + Multiple | Node-CommChannel sub-wallet of NU's node |

In **Node-based**: only NU consumes; NA holds balance but can't consume (BR-AM-27).

### Deduction algorithm (nearest-expiring contract rule, BR-CC-31)

```
1. Get all Active contracts for the account
2. Sort by expirationDate ASC (nearest first)
3. For each contract:
   a. Look up Contract Detail cell: (Application × CommChannel × Priority × Destination)
   b. Cost per message = cell value (SAR)
   c. WalletRecord for this contract has balance B
   d. If B ≥ cost: deduct cost from this contract's record
   e. If B < cost: deduct what's available, move to next contract
4. Repeat until total cost satisfied
5. Tag the deduction with contractId(s) (BR-AM-36)
6. Dispatch message via CommChannel provider
```

### Cost calculation per cell

Cost depends on:
- **Application** (which app initiated the send)
- **CommChannel** (WhatsApp / Voice / AI / etc.)
- **Priority** (Authentication / Utility / Marketing for WhatsApp; High/Normal/VeryLow for Voice; None for AI)
- **Destination** (country code; "Global" for AI)

### Memorize
- **6 pre-flight checks** — any fail = reject
- **Nearest-expiring contract first** — older money drains first
- **Multi-contract drain** is automatic — single message can hit multiple contracts
- **Every charge tagged with contractId** — SAMA audit-trail requirement (BR-AM-36)

---

## SIMPLIFIED MEMORY CARD — The 12 Most Common Questions

### Q1 — Who can create a client account?
**Answer:** Falcon SA + PR only. Not Operation. (BR-AM-02)

### Q2 — When can a CommChannel be hidden?
**Answer:** Only when `visibility = Show AND status = InActive`. Otherwise no. (BR-AM-14 + canHide)

### Q3 — Can an Account Owner edit CommChannel price?
**Answer:** No. AO can Do Payment and Disable, but NOT edit price. (BR-AM-25)

### Q4 — Can a Locked user reset their own password?
**Answer:** No. Only Falcon can unlock (LCK → PEN), then user must complete First Login again. (BR-UM-08)

### Q5 — What happens when a contract expires?
**Answer:** Wallet records retained for audit but excluded from spendable lump-sum. Recoverable via Extension (BR-CC-17 + BR-AM-38).

### Q6 — Which contract gets charged first when multiple are Active?
**Answer:** Nearest-expiring contract drains first. (BR-CC-31)

### Q7 — Can a Normal User share a contact group?
**Answer:** No, never. Even own groups. NU cannot share (BR-CGM-12).

### Q8 — Can Falcon admin create templates?
**Answer:** No. Falcon = view only. Templates are client business content (BR-TM-01).

### Q9 — Why does Forgot-Password ignore wrong OTPs silently?
**Answer:** Anti-DoS — if it locked accounts on wrong OTPs, attackers could lock arbitrary users out (BR-UM-32). Document for SAMA audits.

### Q10 — When does Master Wallet exist as a physical row?
**Answer:** Never. Master Wallet = abstract aggregate = SUM(Active WalletRecords). (BR-AM-28)

### Q11 — Can NA transfer between User wallets?
**Answer:** Not in User-based topology (User ↔ User is AO-only for crossing users). NA can do Node ↔ Node within own sub-tree (Node-based topology) (BR-AM-32).

### Q12 — What's the grace period for Expired CommChannels?
**Answer:** 7 days for Monthly pricing; 30 days for Yearly or OneTimePayment. (BR-AM-21)

---

## Continuous mining queue update

Volumes 1-28 = 138 entries (129 deep-dives + 9 matrices in Vol 28).

Remaining:
- Vol 29: Simplified Memory Card (mnemonic rules card for fast recall)
- Vol 30: Cross-module state cascades (when X happens, what fires)
- Vol 31: Error catalog × cause × recovery

---

*Falcon Brain Forever-Wave · Vol 28 (Complete Matrices) written 2026-05-18 · 9 matrices · Every actor × status × action combination covered with source-prefixed citations.*


---

## §V28-M5-SUPPLEMENT (Added 2026-05-18 — Vol 44 Reconciliation)

> The wallet detail in Matrix 5 has been superseded by **Vol 44 §1** (canonical wallet truth tautology, sourced from `Wallets-Balance-Flow.txt` Sheet 3 lines 2037-2092). The §V28-M5 table below remains for navigational continuity but defers to Vol 44 §1 on conflict.

### Reconciliation summary
1. **Action-actor matrix** — Vol 44 §1.1-1.2 is more precise. Use it.
2. **LOOP semantics** — confirmed as "walk contracts in nearest-expiry order, consume each fully before the next" (Vol 44 §1.3).
3. **Atomicity rule** — confirmed: total available < Needed → abort. No partial debits. (W-TT-06)
4. **Falcon-only powers** — Master ↔ CommChnl wallet transfer is **Falcon-exclusive** (W-TT-04), not AO-accessible.
5. **System actor** — contract-expiration deductions are System-driven; no human authority involved (W-TT-08).

### Worked example
The 1.375-SAR cross-contract WA-Mark deduction calculation lives in **Vol 44 §2.3**. Reference it for the canonical math.

### Open Q-CC-12
"WA Auth/Util/Mark rates per-contract" — is this stored on Contract or derived from a Plan template? Tracked in Vol 44 §11.

