---
type: business-scenarios-atlas
volume: 1
title: "Falcon Business Scenarios Atlas — Volume 1 (2026-05-18)"
purpose: "Cross-module cascades traced end-to-end. The 'everything, even small things' deep-dive for business meetings. Pull up the right scenario when a business question comes up — it tells you every system action, every actor, every BR-* rule, every failure mode."
mode: continuous-mining (volumes 2-N will add more scenarios)
volume-1-scenarios: 7
source-prefix-rule: "[PRD] = PRD module:line · [CODE] = source file:line · [BRAIN-OUT] = dossier · [INFERRED] = reasoning"
---

# Falcon Business Scenarios Atlas — Volume 1

> When someone asks "what happens when…?", find the scenario here. Each trace covers actors, system actions, BR-* rules, cross-module cascades, and failure modes.

---

## SCENARIO 1 — New Client Onboarding (sales handshake → first transaction)

**Business question:** "A new enterprise client just signed. Walk me through every step until they send their first message."

### Pre-conditions
- Falcon sales team has the client's name, finance ID, address, contact info
- A draft commercial contract is in scope (or has been pre-approved)
- The client's Account Owner-to-be has a real email + phone for OTP

### Actors involved
- Falcon System Admin or Product (creates the account) — [PRD] BR-AM-02
- Falcon Product or System Admin (creates the contract) — [PRD] BR-CC-01
- The newly-minted Account Owner (first login)
- Eventually a Normal User (sends the transaction)

### End-to-end trace

**Phase 1 — Account creation (Falcon-side, 5-step wizard)**
1. Falcon admin opens admin-console `/organization-hierarchy` → "Add Client" wizard
2. **Step 1 Basic Info** — accountName (≤30, starts with letter, unique), financeId, classification — [PRD] BR-AM-03/04/05/06/07/08
3. **Step 2 Settings** — passwordSecurityLevel (Normal=1/Advanced=2 per [CODE] `ePasswordSecurityLevel`), allowedIps[], maxNormalUserLimit, maxSystemUserLimit, maxNodeLevels, balanceTransferLimitPct (0 = no limit) — [PRD] BR-AM-09/10/11/12/13
4. **Step 3 CommChannels** (OPTIONAL) — visibility (Hide default), pricingType (Monthly/Yearly/OneTime), priceValueSar — [PRD] BR-AM-14/15/16/17/18
5. **Step 4 Applications** (OPTIONAL) — same shape as Step 3 — [PRD] BR-AM-20
6. **Step 5 Account Owner** (MANDATORY) — first name (≤50), last name (≤50), username (≤30, unique, starts with letter, immutable), email, phone, role=account-owner, status=Pending, deliveryMethod (Email/Sms/Both) — [PRD] BR-AM-19, BR-UM-10/11/12/15
7. Finalize → POST sequence (sequential Kafka events):
   - Commerce: create Account + Settings + WalletTypeConfig (default Single + User-based, [INFERRED])
   - Commerce: create CommChannelConfigs (initial status=InActive) — [PRD] BR-AM-20 InActive(First Time)
   - Commerce: create AppConfigs
   - Identity: create Account Owner User (status=Pending) — [PRD] BR-UM-10
   - Identity: send credentials via chosen deliveryMethod (Email + temp password OR SMS link)

⚠ **Partial-failure trap:** If Account creates but Account Owner Identity creation fails → wizard preserves state + shows "Account created but Account Owner creation failed — contact support." Do NOT roll back the account. [BRAIN-OUT] F-015 in DECISION-PROTOCOL

### Phase 2 — Contract activation (Falcon-side, separate session)
1. Falcon admin opens admin-console `/contracts-cost-management` → "Add Contract"
2. **Step 1 Info** — name (≤50), farabiRefId (≤50), startDate ≥ today, expirationDate > startDate AND > now, valueSar > 0 — [PRD] BR-CC-04/05/06/07/08
3. **Step 2 Rate Card** — per CommChannel: priceUnit (predefined list, DB-editable [PRD] BR-CC-21), priceValueSar — [PRD] BR-CC-18/19/20
4. **Step 3 Contract Details** — for every (Application × CommChannel × Priority × Destination) cell, set costSar — [PRD] BR-CC-22/23/24/25/26
5. **Step 4 Addons** — sub-service rate card + free credits per sub-service — [PRD] BR-CC-27/28/29
6. POST `commerce/Contracts` — Contract status = Pending (start date in future) OR Active (start date = today) — [PRD] BR-CC-11/12/13
7. **When startDate reached** (background): system auto-flips Contract to Active → Charging publishes WalletRecords linked to the contract → Master Wallet lump-sum increases by contract's `valueSar` — [PRD] BR-AM-35, BR-CC-37

### Phase 3 — Account Owner first login
1. AO receives credentials (Email/Sms per BR-UM-18)
2. AO opens host-shell login screen
3. Submits username + temp password → `POST /api/auth/login`
4. **IpAllowlistPreProcessor runs FIRST** — IP not in `allowedIps[]` → reject before credentials check — [PRD] BR-UM-24
5. Credentials valid → `LoginStepResponse.Stage = OtpRequired` — [PRD] BR-UM-22
6. AO submits OTP within 60s → `POST /api/auth/verify-otp` — [PRD] BR-UM-26
7. Status was Pending → `Stage = PasswordChangeRequired`
8. AO submits new password → `POST /api/auth/first-login` — [PRD] BR-UM-22/34
9. Server: status flips Pending → Active. JWT tokens issued. `Stage = Authenticated`. Force-logout-all-sessions [PRD] BR-UM-35

### Phase 4 — Account Owner activates a CommChannel
1. AO navigates Settings tab → CommChannels tab
2. Picks WhatsApp (currently `Visibility=Hide AND status=InActive`) → AO has no `editPriceType`/`editPriceValue` (Falcon-only) — [PRD] BR-AM-25, capability-acc-owner
3. AO clicks "Do Payment" → Commerce initiates an order via Charging
4. Charging deducts price from Master Wallet (nearest-expiring contract first) — [PRD] BR-CC-31
5. Order status polled by FE every 2s (SimplePollService) — [BRAIN-OUT] understanding/backend/charging/
6. On success: CommChannel status flips InActive → Paid → Active (Commerce drives this via Kafka, Provisioning mirrors) — [PRD] BR-AM-20, [BRAIN-OUT] ARCH-FINDING-CommChannel-FSM-ownership
7. **Failure modes** for Do Payment (each surfaces a different dialog):
   - `InsufficientFunds` → insufficient-balance-warning-dialog
   - `WalletNotConfigForTheNode` → same warning dialog
   - `CommChannelPriorityOrderRequired` → drag-drop priority dialog (deduction order conflict)

### Phase 5 — Account Owner creates a Normal User
1. AO opens Organization Hierarchy → Users tab → "Add User"
2. **Tab 1 Personal Info** — first/last name (≤50, letters only), username (≤30, unique, starts with letter), email, phone — [PRD] BR-UM-11/12
3. **Tab 2 Role & Status** — role=normal-user (status defaults Pending), permission group selection — [PRD] BR-UM-10/42
4. **Pre-create check**: maxNormalUserLimit not exceeded — [PRD] BR-UM-09/17 (or BE rejects)
5. **Tab 3 Permissions** — permission group binds at create — [PRD] BR-UM-42
6. POST `identity/api/user/` → status=Pending, credentials sent via deliveryMethod

### Phase 6 — Normal User first login + first transaction
1. Same flow as Phase 3 — IP check, OTP, force-change-password, Status flips Pending → Active
2. Normal User opens management-console → Contact Groups → "Create Contact Group" (note: create wizard is management-console only; admin-console has list/edit only) — [PRD] BR-CGM-09/13
3. NU uploads CSV/XLS/XLSX (size capped by App Settings) — [PRD] BR-CGM-04/30
4. NU configures column names (EN letters only, ≤20, spaces→`_`, unique) — [PRD] BR-CGM-06
5. ContactGroup committed → status=Completed — [PRD] BR-CGM-29
6. NU opens Templates → ⚠ **Today this returns empty** because Template CRUD endpoints don't exist (GAP-T-001). Only Meta-created templates are usable, and those don't have a Falcon UI to author. — [BRAIN-OUT] Wave 4 Finding W4-3
7. **Hypothetical (when Templates UI exists):** NU sends a transaction via App → backend checks wallet sufficiency → nearest-expiring Active contract is debited → WalletRecord decrements → Contact Group recipients receive message — [PRD] BR-CC-32

### Business implications

| Question | Answer |
|---|---|
| "How fast can we onboard a new client?" | Account creation = minutes. Contract activation = sales/finance turnaround. AO first login = 1 round-trip per session. **End-to-end MVP: ~1 hour if everything is ready.** |
| "What's the failure mode if Step 5 partial-fails?" | Account exists, Account Owner doesn't. State is preserved; support must manually create the AO user OR delete the account and restart. Do not auto-rollback. |
| "Can we onboard without sending an OTP?" | No — first login REQUIRES OTP for status flip Pending → Active. The only bypass is Falcon-only skip-validation (Q-UM-16 OPEN — product hasn't decided). |
| "Can we send a transaction today?" | **No, the Templates UI is unbuilt** — see GAP-T-001. Backend Template entity API doesn't exist. Only Meta-direct templates are usable. |

---

## SCENARIO 2 — Contract Expiration Cascade

**Business question:** "A contract just expired. What changes in the system?"

### Trigger
- Background scheduler detects `Contract.expirationDate < now` → flips status from Active to Expired — [PRD] BR-CC-11/14

### Cascade (in order)

**1. Contract itself** — [PRD] BR-CC-14
- `status = Expired`
- `Remaining Value` becomes hidden from Account Owner (still visible to Falcon)

**2. Wallet records** — [PRD] BR-CC-38, BR-AM-38
- All `WalletRecord` rows linked to this contract are **retained** for audit
- But **excluded from every wallet's lump-sum value** going forward
- The Master Wallet displayed balance drops by `SUM(contract's WalletRecord.valueSar)`
- Comm/Node/User wallets that had records from this contract also drop

**3. CommChannels and Applications** — [PRD] BR-AM-21/23
- The CommChannels/Apps funded by this contract were Active → on their renewDate, the system attempts deduction from Master Wallet
- Master Wallet lump-sum just dropped → if insufficient funds → status flips Active → Expired → enters grace period
- Grace period: **7 days for Monthly pricing, 30 days for Yearly/OneTime** — [PRD] BR-AM-21
- Grace ends without payment → status flips Expired → InActive (Grace Period Ends)

**4. Send Transactions** — [PRD] BR-CC-32
- Any new Send Transaction iterates Active contracts ordered by nearest-expiring
- Newly-Expired contract is removed from the loop
- If no other Active contract has sufficient balance → Send Transaction fails

**5. Notifications** — [INFERRED from BR-UM-49]
- Likely: account-level alert to Account Owner ("Contract X has expired")
- Likely: Falcon ops notification
- Not explicitly defined in PRD

### Recovery: extension
- Falcon admin edits the contract's `expirationDate` to a future date — [PRD] BR-CC-16/17
- Status flips Expired → Active
- WalletRecords **re-enter all wallet lump-sums** (re-added, not re-created)
- CommChannels in Expired or Grace state might resume Active on their next renew if Master Wallet now has funds

### Business implications

| Question | Answer |
|---|---|
| "Did the client lose their money when the contract expired?" | **No — the WalletRecords are retained** in the database for audit. They're just excluded from spendable balance. Extension recovers them instantly. |
| "What's the difference between Grace and Expired?" | Grace = CommChannel is Expired but still in the 7/30 day window where payment can restore Active. Past Grace = InActive (Grace Period Ends) = fully turned off. |
| "If a contract expires mid-conversation, do existing messages bounce?" | Likely yes — Send Transaction iterates Active contracts. If wallet check fails, message fails. **Open question for product:** is there a "complete this transaction even if contract just expired" grace window? Not in current PRD. |
| "Who can extend an Expired contract?" | Falcon usertype only — [PRD] BR-CC-01. Account Owner cannot self-extend. |

---

## SCENARIO 3 — Do Payment End-to-End (the money-flow trace)

**Business question:** "I'm an Account Owner clicking 'Do Payment' on a CommChannel. What exactly happens?"

### Trigger
- AO opens management-console / admin-console Settings → CommChannels tab
- Picks a row in InActive or Expired status with `availableActions[]` containing `DoPayment` — [PRD] BR-AM-20

### Trace

1. **Frontend** — FE calls `POST commerce/Node/{nodeId}/comm-channel/{commChannelId}/payment` (System Gateway or Core Gateway based on usertype)
2. **Commerce service** — Receives the request, creates an Order record, generates an `orderId`
3. **Commerce → Charging via Kafka** — Publishes `CommChannelPaymentRequested` event with orderId
4. **Charging service** — Consumes event, runs the deduction algorithm:
   - Identifies the wallet that will be debited (per account's WalletType × BalanceType matrix — [PRD] BR-AM-26)
   - For Single + User-based: deduct from Master (lump-sum). For Multiple + Node-based: deduct from Comm Wallet per the priority order.
   - Iterates **nearest-expiring** Active contracts — [PRD] BR-CC-31
   - For each contract: subtracts cost from Contract's WalletRecord, until total amount is satisfied
   - Updates the wallet's tagged WalletRecord(s)
5. **Charging → Commerce via Kafka** — Publishes `CommChannelPaymentCompleted` or `CommChannelPaymentFailed` event
6. **Commerce on success** — Updates CommChannelConfig:
   - `status` flips InActive → Paid (immediately) → Active (after settlement period, [INFERRED])
   - `firstActivationDate` set (if was InActive(First time))
   - `activationDate` set
   - `renewDate` calculated based on pricingType (today + 30d for Monthly, +365d for Yearly, none for OneTime)
   - Publishes Kafka event downstream to Provisioning (which mirrors the new state)
7. **Frontend polling** — `SimplePollService` calls `GET order/{orderId}/status` every 2s for up to 30 min
8. **Frontend on success** — Closes the spinner, shows toast, refreshes the CommChannel row
9. **Frontend on failure** — Shows one of 3 dialogs based on the failure reason:
   - `InsufficientFunds` → `<insufficient-balance-warning-dialog>` ("Account doesn't have enough balance")
   - `WalletNotConfigForTheNode` → same warning dialog ("Wallet topology not set; ask Falcon admin")
   - `CommChannelPriorityOrderRequired` → `<insufficient-balance-priority-dialog>` (drag-drop dialog to reorder which CommChannels get paid in what priority when there are simultaneous activations)

### Permission gating

| Actor | Can Do Payment? |
|---|---|
| Falcon System Admin / Product | Yes — [PRD] BR-AM-02 |
| Falcon Operation | Yes (per understanding) |
| Account Owner | **Yes** — `availableActions[]` includes DoPayment for AO — [PRD] BR-AM-25 (AO can `Disable` / `Do Payment` but not `Edit Price`) |
| Node Admin | **No** — no Do Payment for sub-node admins |
| Normal User | No |

### Business implications

| Question | Answer |
|---|---|
| "Why did Do Payment take 30 seconds last time?" | Charging deduction iterates contracts; backend round-trips Kafka events; FE polls every 2s. Normal latency ~5-15s; up to 30 min on the polling cap. |
| "Can Falcon force-activate a CommChannel without payment?" | Not in the standard flow. Would need an admin override endpoint — not in current PRD. |
| "What if the client has Active CommChannels but a Disabled one?" | Disabled is manual (BR-AM-24). Do Payment on Disabled would first need an Enable action (AO can enable, but **not** edit price). |

---

## SCENARIO 4 — User Lifecycle End-to-End

**Business question:** "Walk me through every state a user can be in and how they transition."

### State machine — [PRD] BR-UM-06/07/08, [CODE] `eUserStatus`

```
                    ┌─────────────┐
                    │  Create     │
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │  Pending    │ ← default on creation
                    └──────┬──────┘
                           ↓ First Login completed (OTP + force-change-password)
                    ┌─────────────┐
        ┌───────────┤   Active    ├───────────┐
        ↓           └──────┬──────┘           ↓
   ┌─────────┐             │              ┌─────────┐
   │Suspended│             │              │ Locked  │ ← 3 wrong logins / 3 wrong OTPs
   └────┬────┘             │              └────┬────┘
        │                  ↓                   │
        │           ┌─────────────┐            │ (manual unlock by Falcon → goes to Pending)
        └──→  ┌────┤   Deleted   ├───┐ ←──────┘
              │    └─────────────┘   │
              │                      │
   only Falcon can restore Deleted → Active
```

### Each transition with rules

| From | To | Trigger | Who | Rule |
|---|---|---|---|---|
| Create | Pending | New user | Falcon or AO/NA | [PRD] BR-UM-10 |
| Pending | Active | First Login complete | User (self-driven) | [PRD] BR-UM-22 |
| Active | Suspended | Manual | Admin (with appropriate role) | [PRD] BR-UM-08 |
| Suspended | Active | Manual | Admin | [INFERRED] |
| Active | Locked | 3 wrong logins / OTPs | System (Zitadel policy + Identity webhook) | [PRD] BR-UM-25/27 |
| Locked | Pending | Manual unlock | Falcon only | [PRD] BR-UM-08/39 |
| Active | Deleted | Manual | Admin | [PRD] BR-UM-08 (soft-delete via flag) |
| Deleted | Active | Manual restore | **Falcon only** | [PRD] BR-UM-39 |

### Edge cases the business needs to know

- **Deleted users don't count toward `maxNormalUserLimit`** — [PRD] BR-UM-32. Useful when an account is at capacity but has Deleted users to repurpose.
- **Soft-delete preserves audit trail** — UserStatusHistory + LoginAttempt rows persist. PII compliance: deletion is logical, not GDPR-erasure. [INFERRED]
- **Locked → Pending forces a fresh first-login** — When Falcon unlocks a Locked user, the user goes to Pending (not Active). This forces a new password+OTP cycle. [PRD] BR-UM-08 (re-reading)
- **Suspended is distinct from Locked** — Suspended = administrative block (intentional). Locked = security trigger (auto). Suspended → Active is a simple admin click. Locked → Pending requires Falcon AND forces re-onboarding.

### Permissions

| Role | Can change status? | Restrictions |
|---|---|---|
| Falcon (sys-admin / product / operation) | YES on all users in scope | Operation has narrower scope per BR-AM-02 |
| Account Owner | YES on Client users (NodeAdmin / NormalUser) in their account | Cannot affect Falcon users; cannot Lock (system-only); cannot Restore Deleted (Falcon-only) |
| Node Admin | YES on Normal Users in their sub-node only | Same restrictions as AO, narrower scope |
| Normal User | Only own profile (BR-UM-41) | Cannot change role/status/permission group on self |

### Business implications

| Question | Answer |
|---|---|
| "Can Account Owner restore a Deleted user?" | **No — Falcon only.** This is a deliberate security control to ensure deleted users (potentially terminated employees) aren't silently restored without Falcon oversight. |
| "Can we have 100 Pending users at once?" | Yes — Pending users count against `maxNormalUserLimit` (BR-UM-09). Bulk creation goes through but each user must self-activate via First Login. |
| "What's the difference between Suspended and Locked?" | Suspended = admin chose to block; Active again is one click. Locked = system enforced (3-strike); requires Falcon unlock + re-onboarding. Use Suspended for HR/leave; Locked happens to attackers. |

---

## SCENARIO 5 — Send Transaction (the money-flow per message)

**Business question:** "A Normal User clicks Send. What happens to the money?"

### Trigger
- Normal User opens an Application UI → composes a message → picks a template → picks a Contact Group → clicks Send

### Trace

1. **App-side** — Application calls Falcon Send Transaction API (specific endpoint per Application; [INFERRED] this is a per-app integration point not in the public PRD body)
2. **Wallet sufficiency check** — [PRD] BR-CC-32
   - Iterates Normal User's accessible wallets per account WalletType × BalanceType:
     - User-based + Single: Normal User has access to their User wallet (lump-sum from contracts)
     - User-based + Multiple: NU has a Comm Wallet per CommChannel
     - Node-based + Single: NU consumes from a single Node Wallet (NU is the only one who can consume — [PRD] BR-AM-27)
     - Node-based + Multiple: NU consumes from per-CommChannel Node Wallet
3. **Cost calculation** — for the chosen CommChannel × Application × Priority × Destination, look up `Contract Detail.costSar` for each recipient — [PRD] BR-CC-22
4. **Deduction** — iterate nearest-expiring Active contracts:
   - For each recipient, deduct costSar from the contract's WalletRecord
   - If a contract's WalletRecord doesn't have enough, move to the next contract — [PRD] BR-CC-32
   - Tag the deduction with the contract ID — [PRD] BR-AM-36
5. **Wallet update** — decrement the consumed Wallet's WalletRecord(s)
6. **Contract Remaining Value** — decrements automatically
7. **Dispatch** — message sent via the CommChannel provider (Meta for WhatsApp, voice provider for Voice, etc.)
8. **Audit** — every deduction has a contract ID tag (SAMA audit trail compliance — [BRAIN-OUT] Wave 8 SAMA context)

### Failure modes

| Failure | Behavior |
|---|---|
| Insufficient balance | Send rejected at FE (or BE) before dispatch. UI shows "Insufficient Balance" dialog. |
| CommChannel not Active | Send rejected — only Active CommChannels can transact. |
| Template not Approved | Send rejected — only Approved templates can be used. WhatsApp templates also need Meta Active (not Paused/Disabled — BR-TM-27). |
| Contact Group not Completed | Send rejected — `In Progress` ContactGroups can't be used. |
| Wallet topology not configured | Returns `WalletNotConfigForTheNode` error. |
| Multiple contracts tie on expirationDate | **Open question BR-CC-42** — no defined tie-breaker. Risk of non-deterministic order. |

### Business implications

| Question | Answer |
|---|---|
| "Can a Normal User see how much each message costs before sending?" | The Contract Details matrix is Falcon-set; client roles are view-only on contracts but Active contracts let AO see costs ([PRD] BR-CC-40). NU might or might not — depends on UI design (not in PRD body). |
| "Do messages get sent if balance runs out mid-send?" | Behavior depends on implementation. Likely fails the entire send at the wallet check; can't partially dispatch. Risk of UX confusion if "send 1000 messages" is treated as a single all-or-nothing. **Open product question.** |
| "How does Falcon comply with SAMA audit on per-message charges?" | Every charge is tagged with a contract ID (BR-AM-36). The WalletRecord history per contract is reconstructible. This is Falcon's audit trail. |

---

## SCENARIO 6 — Wallet Transfer (permission cascade)

**Business question:** "I'm an Account Owner. What can I transfer where? When does it get blocked?"

### The 4-quadrant wallet topology — [PRD] BR-AM-26

| | Single Wallet | Multiple Wallets |
|---|---|---|
| **User-based** | Master + 1 User wallet per user | Master + 1 Comm wallet per CommChannel + per-user-per-CommChannel sub-wallets |
| **Node-based** | Master + 1 Node wallet per node | Master + 1 Comm wallet per CommChannel + per-node-per-CommChannel sub-wallets |

(Only Falcon can choose this topology — [PRD] BR-AM-25)

### Transfer matrix — who can move what

| From → To | Falcon | Account Owner | Node Admin |
|---|---|---|---|
| Master ↔ Comm (Multiple only) | ✅ | ❌ ([PRD] BR-AM-30) | ❌ |
| Comm ↔ User/Node Comm wallet | ✅ | ✅ ([PRD] BR-AM-31) | ❌ |
| User/Node ↔ User/Node | ✅ | ✅ ([PRD] BR-AM-32) | ✅ |
| Master ↔ User/Node (Single only) | ✅ | ✅ ([PRD] BR-AM-33) | ❌ |

### The Balance Transfer Limit % cap — [PRD] BR-AM-34

- Applied to all transfers **except those FROM Master Wallet**
- 0% = no limit (default)
- e.g., 25% means: in any single transfer, you cannot move more than 25% of the source wallet's balance
- This is per-transfer, not aggregated

### Edge cases

- **Currency mismatch** — Transfers reject if source/destination wallets have different currencies (F-014 fork; currently SAR is universal so this is theoretical) — [BRAIN-OUT] DECISION-PROTOCOL
- **Same source = destination** — Rejected (no-op + sanity guard)
- **Description required** — Some flows require a description on every transfer ([INFERRED] from old-UI wallet-balance-management transfer drawer)
- **Contract ID inheritance** — When a record moves between wallets, the destination wallet inherits the source's contractId tags — [PRD] BR-CC-35
- **Nearest-expiring rule applies to transfers too** — When pulling from source, the system iterates nearest-expiring records — [PRD] BR-CC-35

### Business implications

| Question | Answer |
|---|---|
| "Why is Master ↔ Comm Falcon-only?" | The Master Wallet is Falcon's commercial layer (where contract value materializes). Letting AO move funds from Master to a specific CommChannel could bypass pricing rules. **Falcon owns the strategic allocation; AO owns the operational distribution.** |
| "Can a Node Admin transfer between two child sub-nodes?" | Yes — Node-to-Node is allowed for Node Admin ([PRD] BR-AM-32), scoped to their sub-tree. |
| "What's the practical use of Balance Transfer Limit?" | Anti-abuse for client admins. e.g., 10% limit means an AO cannot empty a Comm Wallet in a single transfer. Forces gradual distribution. 0% = trust the admin fully. |
| "Can we audit who transferred what to whom?" | Yes — every `TransferTx` row has actorId, srcWalletId, dstWalletId, amountSar, contractIds[], timestamp. The contractIds[] linkage means we can trace per-contract-funded transfers. |

---

## SCENARIO 7 — Forgot Password vs Login (anti-DoS asymmetry)

**Business question:** "Why does our security policy differ between Forgot Password and Login? Won't auditors flag this as inconsistency?"

### The two flows, side by side

| Step | Login (BR-UM-22..27) | Forgot Password (BR-UM-30..33) |
|---|---|---|
| Trigger | User submits username + password | User clicks "Forgot Password" |
| Pre-check | IP allowlist (BR-UM-24) | Active status only (Pending → "please login first") |
| Credentials | Required | Not required (must know username + phone) |
| OTP | After credentials, 60s validity | After mismatch generic alert, 60s |
| Wrong credentials | Counts toward 3-strike lock | N/A |
| **Wrong OTP** | **Counts toward 3-strike lock → Locked status** ([PRD] BR-UM-27) | **Silently ignored — NO lockout** ([PRD] BR-UM-32) |
| Mismatch (Username + Phone don't match) | N/A | **Generic alert** — never reveal which field was wrong ([PRD] BR-UM-33) |
| Success | New JWT issued | New password accepted; force-logout all sessions |

### The deliberate asymmetry — why

**If Forgot Password locked accounts on wrong OTPs:**
- Attacker knows User X's username (trivial — usernames are typed in chats/emails/badges)
- Attacker triggers Forgot Password for User X 3 times with wrong OTP guesses
- User X is now **locked out** of their own account
- Real DoS attack against legitimate users
- Cost to attacker: trivial. Cost to victim: support call + Falcon unlock + re-onboarding

**By making wrong OTP in Forgot Password silent:**
- Attacker gains nothing by spamming OTP guesses (no lockout)
- The brute-force protection is the OTP entropy itself (60s window, finite attempt count throttled by Identity rate limiter)
- Legitimate user is never DoS'd via this vector

### How to explain this to auditors

> "The asymmetric OTP behavior is intentional anti-abuse design. Locking accounts on wrong Forgot Password OTPs would create a denial-of-service vector against legitimate users — any attacker who knows a username could lock that user out by deliberately failing the OTP step. Our protection in the Forgot Password flow is the OTP entropy + rate-limit, not the lockout counter."

This wording belongs in:
- The SOC 2 audit response
- SAMA security review
- Internal security policy doc
- Any compliance disclosure where lockout policy is questioned

### Business implications

| Question | Answer |
|---|---|
| "What if a real user fails Forgot Password OTP 10 times?" | Nothing locks. The OTP simply expires after 60s. The user can request a new OTP and try again. There's no penalty for failed Forgot Password attempts. |
| "What's the protection against brute-forcing the OTP?" | OTP entropy (4-6 digits = 10,000-1,000,000 combinations) + 60s expiry + Identity rate limiter on /resend-otp + Zitadel-side throttling on /verify-otp. |
| "If our auditor flags this, what's the canonical reference?" | [PRD] BR-UM-32 explicitly defines this behavior. The asymmetry is a deliberate design choice, documented at PRD-level. |
| "Could a misconfigured backend accidentally lock accounts via Forgot Password?" | Yes — Q-UM-01 (open question) flags this for verification. If `VerifyOtpEndpoint` doesn't distinguish login vs forgot-password contexts, a backend bug could enable this lockout vector inadvertently. Test for it. |

---

## Volumes 2-N preview (next mining batches)

Volume 1 has 7 scenarios. Continuous mining will add:

- Vol 2: Template approval flow (Maker → Checker → Meta → Approved/Rejected) + edge cases
- Vol 3: Contract editing under different statuses (Pending free-edit vs Active partial-edit vs Expired extension-only)
- Vol 4: Permission Group changes mid-session (does the active session see the new permissions immediately?)
- Vol 5: Account deletion + re-creation (does soft-delete prevent username reuse?)
- Vol 6: Sub-node creation depth limits + maxNodeLevels enforcement
- Vol 7: SAMA audit trail reconstruction (how to answer "show me every charge tagged to contract X")
- Vol 8: Multi-language Template behavior (English template Approved + Arabic version submitted; do both work?)
- Vol 9: User moved between nodes (cross-hierarchy reassign) — currently MISSING (GAP-UM-36)
- Vol 10: Bulk operations (Q-UM-11) — what business cases drive this?

Each volume adds 5-7 scenarios. All source-prefixed. All cross-module.

---

*Falcon Brain Forever-Wave · Continuous business deep-diving · Vol 1 written 2026-05-18 · Volumes 2-N will follow as mining continues.*
