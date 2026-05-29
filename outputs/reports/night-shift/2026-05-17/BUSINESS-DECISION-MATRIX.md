---
type: business-decision-matrix
title: "Falcon Business Decision Matrix — Night-Shift Mining 2026-05-17"
purpose: "Quick reference for business meetings. Each row maps a common business question to the ruling PRD rule(s) and the immediate answer. Use to judge business situations without digging through PRDs."
coverage: PRD-01 VB4 · PRD-02 V2 · PRD-03 V2 · PRD-04 V2 · PRD-05 partial
source-prefix-rule: "[PRD] = PRD module:line · [CODE] = source file:line · [INFERRED] = reasoning"
---

# Falcon Business Decision Matrix

> Pull this up in any business meeting. Find your question, cite the ruling, give the answer. If the question has no row here, it is either an [OPEN] gap (see the relevant QUESTIONS.md) or it needs product team input.

---

## I. ACCOUNT CREATION & HIERARCHY

| Business question | Answer | Ruling rule(s) |
|---|---|---|
| Who can create a new client account? | **Falcon System Admin and Product** only. Operation cannot. | [PRD] BR-AM-02 |
| What are the mandatory fields when creating an account? | Account Name (≤30, starts with letter, unique), Finance ID, Password Security Level, Account Limits. CommChannels + Apps are optional at create time. Account Owner user is mandatory. | [PRD] BR-AM-03/05/13/18/19 |
| Can Account Name have numbers or special characters? | **Only letters for the first character; the rest can include any char up to 30 total.** Specifically must START with a letter. | [PRD] BR-AM-03 |
| How deep can the hierarchy go? | Three levels: Root → Main (Account) → Sub-node. The Max Node Levels setting caps sub-node depth; `0 = no limit`. | [PRD] BR-AM-01/11 |
| Can a sub-node have sub-sub-nodes? | Yes, recursively. Limited by `MaxNodeLevels` in account settings. | [PRD] BR-AM-11 |
| Can an Account Owner add nodes? | Yes — Account Owner can add/manage sub-nodes within their hierarchy. | [PRD] BR-AM-02 (per understanding.md) |

---

## II. ACCOUNT SETTINGS & LIMITS

| Business question | Answer | Ruling rule(s) |
|---|---|---|
| What are the two Password Security Levels? | **Normal** and **Advanced**. Complexity rules per the referenced sheet. | [PRD] BR-AM-09 |
| What does `0` mean in an Account Limit field? | **No limit** (unlimited). Empty is not valid; must be explicit 0. | [PRD] BR-AM-11 |
| Does the Allowed IPs list apply to Falcon admins? | Falcon admins are exempt (they access via a different path). IP restriction applies to Client users logging in. | [PRD] BR-AM-10 |
| Can a Normal User and a System User share the same limit counter? | **No — they are independent limits.** | [PRD] BR-AM-12 |
| Who can change the Wallet Type (Single/Multiple) or Balance Type (User/Node)? | **Falcon usertype only.** Account Owner cannot change these. | [PRD] BR-AM-25 |

---

## III. COMMCHANNEL & APPLICATION STATUS LIFECYCLE

| Business question | Answer | Ruling rule(s) |
|---|---|---|
| What are the possible statuses for a CommChannel/App? | **InActive (First Time) → Paid → Active → Expired → InActive (Grace Period Ends) / Disabled** | [PRD] BR-AM-20 |
| What triggers the transition from InActive to Paid? | A "Do Payment" action is initiated by Account Owner or Falcon, funding via the wallet. | [PRD] BR-AM-20/22 |
| What is the grace period after a CommChannel expires? | **7 days** for Monthly pricing; **30 days** for Yearly or One Time Payment. | [PRD] BR-AM-21 |
| Can Account Owner disable a CommChannel? | **Yes** — Account Owner can Disable. But NOT Enable or Edit Price. | [PRD] BR-AM-20; [BRAIN-OUT] capability-acc-owner.md |
| Can a CommChannel be hidden after it's been activated? | **Yes if** `Visibility = Show AND Status = InActive`. When Active/Paid/Expired, it cannot be hidden. | [PRD] BR-AM-14; `canHide` rule |
| When Visibility = Show, are Pricing fields required? | **Yes** — Pricing Type AND Price Value become mandatory the moment Visibility is set to Show. | [PRD] BR-AM-15 |
| Who owns the CommChannel status FSM — Provisioning or Commerce? | **Commerce** owns all status transitions. Provisioning is a read-mirror. | [CODE] Wave 5d architectural finding; see ARCH-FINDING-CommChannel-FSM-ownership.md |

---

## IV. WALLETS & BALANCE

| Business question | Answer | Ruling rule(s) |
|---|---|---|
| Is the Master Wallet a real stored balance? | **No — it is abstract.** Master Wallet = `SUM(WalletRecord.valueSar WHERE contract.status = Active)`. There is no physical "Master Wallet" row. | [PRD] BR-AM-28 |
| Who can transfer from Master Wallet to Comm Wallet? | **Falcon usertype only.** Account Owner cannot. | [PRD] BR-AM-30 |
| Who can transfer Comm Wallet ↔ User/Node wallets? | **Falcon usertype + Account Owner.** | [PRD] BR-AM-31 |
| Who can transfer User/Node wallet ↔ User/Node wallet? | **Falcon usertype + Account Owner + Node Admin.** | [PRD] BR-AM-32 |
| What is the Balance Transfer Limit %? | A configurable cap on every non-Master-source transfer. **Transfers FROM Master Wallet are exempt.** 0% = no limit. | [PRD] BR-AM-34 |
| When a contract expires, what happens to its wallet balance? | Wallet records are **retained for audit** but **excluded from all wallet lump-sums**. The money is effectively frozen. | [PRD] BR-AM-38 / BR-CC-38 |
| Can multiple Active contracts exist at the same time for one account? | **Yes.** Deductions always hit the **nearest-expiring** Active contract first. | [PRD] BR-CC-31/39 |
| What happens to wallet records when an Expired contract is re-extended to Active? | **Records re-enter the lump-sum.** Extension date > now → Expired → Active; previously frozen records become live again. | [PRD] BR-CC-17 |
| What is the "nearest-expiring" rule? | When charging any wallet-consuming action, the system iterates Active contracts ordered by `expirationDate ASC` and deducts from the earliest-expiring contract's record first. | [PRD] BR-CC-31 |
| Is there a tie-breaker when two contracts have the same expiration date? | **OPEN** — PRD is silent. This is Q-CC-42 (open gap). | [PRD] BR-CC-42 [OPEN] |

---

## V. CONTRACTS

| Business question | Answer | Ruling rule(s) |
|---|---|---|
| Who can create a contract? | **Falcon usertype only.** Account Owner and Node Admin can only view. | [PRD] BR-CC-01 |
| Can the Start Date be today? | **Yes** — Start Date must be >= today (not strictly > today). | [PRD] BR-CC-06 |
| Can the Expiration Date be the same as the Start Date? | **No** — Expiration must be > Start Date AND > now. | [PRD] BR-CC-07 |
| What can be edited on an Active contract? | **Farabi Ref ID, Expiration Date, Rate Card price values, Contract Details grid, Addon values.** Locked: Name, Contract Value, Start Date. | [PRD] BR-CC-16 |
| What can be edited on a Pending contract? | **Everything**: Name, Farabi Ref ID, Start/Expiration Date, Value, Rate Card, Contract Details, Addons. | [PRD] BR-CC-15 |
| Can an Expired contract be reactivated? | **Yes** — by extending the Expiration Date to a future date. Status flips back to Active. | [PRD] BR-CC-17 |
| Can the Account Owner see Remaining Value when the contract is Expired? | **No** — Remaining Value is hidden from Account Owner when Expired. Falcon can still see it. | [PRD] BR-CC-40 |
| Is Packaging or Billing covered in Contract PRD V2? | **No.** The PRD folder is named "Contract, Packaging, Charging, Billing Mngmnt" but the V2 PRD body covers only Contract + Cost. Packaging and Billing are scope gaps. | [PRD] BR-CC-41 [OPEN] |

---

## VI. USERS & AUTHENTICATION

| Business question | Answer | Ruling rule(s) |
|---|---|---|
| What is a user's default status when created? | **Pending** — must complete First Login to become Active. | [PRD] BR-UM-10 |
| Can a Pending user do Forgot Password? | **No** — they get an alert "please login first". Forgot Password is for Active users only. | [PRD] BR-UM-30; GAP-UM-33 |
| What happens if a user enters the wrong IP address (not on allowlist)? | **Rejected before credentials are checked.** IP check runs first (IpAllowlistPreProcessor). | [PRD] BR-UM-24 |
| How many wrong login attempts before lockout? | **3 wrong logins** → Locked. Also 3 wrong OTPs → Locked. (Zitadel + Identity webhook enforce this.) | [PRD] BR-UM-25/27 |
| Does Forgot Password also lock after 3 wrong OTPs? | **OPEN / Silent** — PRD says login OTP has lockout; Forgot Password OTP behavior is "silent wrong OTP" (BR-UM-32) which implies no lockout. This is Q-UM-01 (open). | [PRD] BR-UM-32 [OPEN] |
| How long is an OTP valid? | **60 seconds.** Resend appears after expiry. | [PRD] BR-UM-26 |
| Is the username immutable after creation? | **Yes — permanently immutable.** | [PRD] BR-UM-19 |
| Can an admin edit a user's Email AND Phone in the same request? | **No** — system must reject any request that modifies both simultaneously. | [PRD] BR-UM-21 |
| Who can restore a Deleted user to Active? | **Falcon usertype only.** Account Owner cannot. | [PRD] BR-UM-08/39 |
| How does the idle logout work? | Sessions expire after **30 minutes of inactivity.** Configured via Session.idleTimeoutAt. | [PRD] BR-UM-29 |
| What is the difference between a Role and a Permission Group? | **Role** = structural user type (sys-admin, account-owner, etc.) — determines which parts of the system the user sees. **Permission Group** = a named bundle of granular allow/deny entries per menu-item/action, assigned per user. One user has one Role and one Permission Group. | [PRD] BR-UM-42; glossary |
| Can a Normal User be created above the account's `maxNormalUserLimit`? | **No** — creation is rejected when the limit is reached. Limit re-checked on role change to Normal User. | [PRD] BR-UM-09/17/38 |

---

## VII. CONTACT GROUPS

| Business question | Answer | Ruling rule(s) |
|---|---|---|
| Can Falcon admins create contact groups? | **No — view and download only.** Create/Edit/Delete/Share are Client-only actions. | [PRD] BR-CGM-13 |
| Who can share a group? | **Creator** (any role), **Account Owner (non-creator)**, **Node Admin (non-creator)**. Normal User cannot share even if shared-with-me. | [PRD] BR-CGM-09/11/12 |
| Can an Account Owner edit a group created by someone else? | **No — edit is creator-only.** Account Owner (non-creator) can only Share and View. | [PRD] BR-CGM-15/26 |
| What file types are accepted for upload? | **CSV, XLS, XLSX.** Size limit is configurable in App Settings (default not specified in PRD — OPEN). | [PRD] BR-CGM-04; BR-CGM-30 [OPEN] |
| Are contact records validated on upload? | **No** — file content is NOT validated beyond parsing. Whatever is uploaded is accepted. | [PRD] BR-CGM-08 |
| What happens when a creator deletes their group? | **Soft delete** — hidden from all client-side views but still visible to Falcon usertype who can download both original and validated files. | [PRD] BR-CGM-28 |
| If I edit a shared group's name, does it update for all who see it? | **Yes** — single source of truth. All viewers see the updated name. | [PRD] BR-CGM-27 |
| What column name characters are allowed? | **English letters only** (a-z, A-Z). No numbers, no special characters. Spaces auto-convert to `_`. Max 20 chars. No duplicates within a group. | [PRD] BR-CGM-06 |

---

## VIII. TEMPLATES

| Business question | Answer | Ruling rule(s) |
|---|---|---|
| Can a Falcon admin create templates? | **No** — Falcon usertype cannot create templates. Client users (Maker role) create them. | [PRD] BR-TM-01 |
| What is a Maker vs a Checker? | **Maker** = creates and submits the template. **Checker** = internal approver (can approve or reject). WhatsApp also requires Meta external approval after Checker approval. | [PRD] BR-TM-21/22/23 |
| What happens if Meta pauses or disables a template? | General status stays **Approved** but the template is **NOT usable** for sending. The Paused/Disabled Meta states override at runtime. | [PRD] BR-TM-26/27 |
| How long does Meta WhatsApp approval take? | Typically **≤24 hours.** | [PRD] BR-TM-28 |
| Can a template work in both English and Arabic? | **No** — one template = one language. To cover both, create two separate templates. | [PRD] BR-TM-03 |
| Is the Template service fully built? | **No** — the Templates microservice today is only a CommChannelConfig editor (3 endpoints). Template CRUD, submission, approval flow, and Meta integration are NOT built. Also: the service is not routed through either gateway. | [BRAIN-OUT] prd/modules/05-templates/GAPS.md GAP-TM-01/02 |
| What does "Quality pending / High / Medium / Low" mean? | Meta's quality feedback tier on an Active WhatsApp template. Low Quality = at risk of Pause. Still usable until Paused. | [PRD] BR-TM-29 |

---

## IX. OPEN QUESTIONS (bring these to the product team)

These cannot be answered from the current PRD — they need product decisions before building:

| Question | Module | Gap ID | Why it matters |
|---|---|---|---|
| PRD Permission Sheet Tab 2 — what permissions are in it? | All | Q-UM-07 | Blocks full PES audit; authority dataset is incomplete until Tab 2 is captured |
| Tie-breaker when two contracts share expiration date | Contract | BR-CC-42 | Charging deduction order ambiguous; could lead to inconsistent behavior |
| Concurrent wallet transaction locking | Contract | BR-CC-43 | Risk of double-spend in high-traffic send-transaction scenarios |
| Forgot Password OTP — does 3 wrong OTPs lock the account? | User | Q-UM-01 | Security design decision; affects user experience and lockout recovery |
| Admin-driven email/phone change — OTP path | User | Q-UM-13 | Edit User wizard cannot be built until this API endpoint design exists |
| Template edit semantics — new version or in-place? | Templates | BR-TM-33 | Affects live campaign behavior during approval cycle |
| Is LookupController in Provisioning live or dead code? | Commerce/Provisioning | Wave 5d | Add Client wizard CommChannel picker currently returns empty |
| Packaging and Billing scope | Contract | BR-CC-41 | Folder is named "Packaging + Billing" but PRD covers neither |
| Templates service — who builds the template-entity API? | Templates | GAP-TM-01 | The entire template creation wizard cannot be built until this is designed |

---

*Generated by Falcon Brain Forever-Wave — Night Shift 2026-05-17. Source rules verified against PRD-01 VB4, PRD-02 V2, PRD-03 V2, PRD-04 V2, PRD-05 (partial). All [OPEN] items require product team input before implementation.*
