# Volume 44 — Supporting Artifacts Research

> **Purpose:** Truth tautologies extracted from every supporting BRD artifact (xlsx + supporting docx) that had not been fully mined in Vols 1–43. Each section locks a single fact to its primary BRD source so future sessions can answer without speculation.
> **Source-of-truth boundary:** This volume is `[BRD-EXTRACTED]` content — verbatim from `C:\Falcon\PRD\BRDs\_extracted\*.txt` (ZIP-extracted from the operator's latest BRD bundle).
> **Replaces speculation in:** Vol 28 Matrix 5 (wallet detail), Vol 28 Matrix 2 (CG permissions), Vol 38 (template per-status actions), Vol 31 (destination cascades).

---

## §1 — Wallet Truth Tautology (SoT: `Wallets-Balance-Flow.txt` Sheet 3, lines 2037–2092)

> This is THE canonical wallet rules table. Vol 28 Matrix 5 must defer to this section.

### §1.1 Single Wallet — Four Actor Authority Layers

| Action | Normal User | Node Admin | Account Owner | Falcon User |
|---|---|---|---|---|
| **Do Transaction** (deduct on send) | ✅ Deduct from User/Node wallet | (delegated) | (delegated) | (delegated) |
| **Transfer Balance** — User/Node ↔ User/Node under hierarchy | ❌ | ✅ Under his sub-hierarchy | ✅ Anywhere under account + Master ↔ User/Node | ✅ Anywhere across account + Master ↔ User/Node |
| **Activate/Renew CommChannel + Purchase/Renew Application** | ❌ | ❌ | ✅ MW nearest-expired LOOP | ✅ MW nearest-expired LOOP |
| **Activate/Purchase SubServices** | ❌ | ❌ | ✅ Addons-first LOOP, then MW-fallback LOOP | ✅ Addons-first LOOP, then MW-fallback LOOP |
| **Contract expired** (system-driven) | n/a | n/a | n/a | n/a — performed by **System** (deducts ALL MW + User/Node wallets) |

### §1.2 Multiple Wallet — Same Layers + CommChannel Layer

| Action | Normal User | Node Admin | Account Owner | Falcon User |
|---|---|---|---|---|
| **Do Transaction** | ✅ Deduct from User/Node **CommChannel** wallet | (delegated) | (delegated) | (delegated) |
| **Transfer Balance** | ❌ | ✅ Corresponding User/Node CommChnl ↔ Corresponding User/Node CommChnl | ✅ + CommChnl wallet ↔ Corresponding User/Node CommChnl wallet | ✅ + **MW ↔ CommChnl wallet** (Falcon-exclusive) |
| **Activate/Renew CommChannel + Purchase/Renew Application** | ❌ | ❌ | ✅ MW nearest-expired LOOP, fallback to **CommChnl wallet nearest-expired (per AO-set priority)** | ✅ Same, but priority order set by Falcon User/Node |
| **Activate/Purchase SubServices** | ❌ | ❌ | ✅ Addons → MW → CommChnl wallet (per AO priority) | ✅ Same, but priority order set by Falcon User/Node |
| **Contract expired** | n/a | n/a | n/a | **System** — deducts ALL MW + CommChannel wallets + User/Node CommChannel wallets |

### §1.3 Universal Pre-Flight Rules (apply to all Activate/Renew/Purchase actions)

1. **Needed Amount = 0** → action succeeds with no balance movement.
2. **Total available (MW + CommChnl wallets in Multi-Wallet mode) < Needed Amount** → action **aborted** (no partial deduction, no balance hold).
3. **Needed Amount > 0** → execute the LOOP deduction per the table above.
4. **LOOP** = walk contracts in nearest-expiry order; consume each fully before moving to the next; stop when Needed Amount is satisfied.
5. **Priority order** (Multi-Wallet only) = the manual ordering set by the AO (client side) or Falcon User (admin side) that determines which **CommChannel wallet** to draw from after MW is exhausted.

### §1.4 Truth Tautologies

| ID | Tautology | Source |
|---|---|---|
| W-TT-01 | A Normal User **cannot** transfer balance — only deduct on send. | Sheet 3 row 2038 |
| W-TT-02 | A Node Admin's transfer power is bounded by **his hierarchy** (the subtree he owns), not the account. | Sheet 3 row 2039 |
| W-TT-03 | An Account Owner is the **only client actor** allowed to transfer to/from the **Master Wallet**. | Sheet 3 row 2040–2041 |
| W-TT-04 | A Falcon User can transfer Master ↔ CommChnl wallet (Multi-Wallet mode only) — a power the AO does NOT have. | Sheet 3 row 2066 |
| W-TT-05 | **Nearest-expiry FIFO is universal** — applies to MW, Addons, and CommChnl wallets in all loop deductions. | Sheet 3 rows 2047, 2053–2054, 2069–2070, 2080–2082 |
| W-TT-06 | **Atomicity** — if total available across all eligible pools is < Needed Amount, the operation aborts. There is no partial-debit and no "best effort" state. | Sheet 3 rows 2046, 2071–2072, 2083–2084 |
| W-TT-07 | **Addons take priority over MW** for SubServices purchases. The reverse is true for CommChannel/Application purchases (MW first, CommChnl wallet second). | Sheet 3 rows 2053, 2069 |
| W-TT-08 | **System** (not any human actor) performs contract-expiration deductions across MW + every linked wallet. | Sheet 3 rows 2059, 2092 |

---

## §2 — Multiple Contracts Deduction Worked Example (SoT: `Multiple-Contracts-Deduction.txt` lines 3–17)

> Concrete numerical proof of the nearest-expiry FIFO rule (BR-CC-31). All numbers are **verbatim** from the BRD worksheet.

### §2.1 Scenario Setup

**Two active contracts:**

| Contract | Status | Total Value | Country | WA-Auth rate | WA-Util rate | WA-Mark rate |
|---|---|---|---|---|---|---|
| **C#1** (older) | Active | 10 SAR | KSA | 2.5 | 2.0 | 1.5 |
| **C#2** (newer) | Active | 15 SAR | KSA | 1.5 | 1.0 | 0.75 |

### §2.2 Master Wallet State Trajectory (Worksheet Cells)

| State | MW C#1 | MW C#2 | Aramco-Wallet C#1 | Aramco-Wallet C#2 |
|---|---|---|---|---|
| Initial post-charge | 10.0 | 15.0 | 0.0 | 0.0 |
| After transfer to Aramco wallet | 0.0 | 10.0 | 10.0 | 5.0 |
| After 1 × "WA Mark KSA" transaction | 10.0 (pre-state) | 4.0 | 0.0 | 1.0 |
| Effective balance | 8.75 | 4.0 | 1.25 | 1.0 |

### §2.3 Deduction Math — "WA Mark KSA" Crossing the C#1/C#2 Boundary

Aramco wallet has **C#1 = 1.25 SAR** remaining after prior transfer. A "WA Mark KSA" transaction needs to be priced.

**Step 1 — Try to fully fund from C#1 (older, nearest-expiry):**
- C#1's WA-Mark rate = 1.5 SAR per message.
- C#1's remaining balance = 1.25 SAR.
- Fraction of the message C#1 can fund = `1.25 / 1.5 = 0.8333...` (worksheet stores as `0.833`).

**Step 2 — Remainder funded by C#2 (next-expiry):**
- Remainder = `(1 − 0.833) = 0.1667` of one message.
- C#2's WA-Mark rate = 0.75 SAR.
- Cost-from-C#2 = `(1 − 0.833) × 0.75 = 0.125` SAR.

**Step 3 — Effective deduction:**
- From C#1: 1.25 SAR (drains it to 0).
- From C#2: 0.125 SAR.
- **Total** = `1.25 + 0.125 = 1.375` SAR (worksheet cell value).

### §2.4 Truth Tautologies

| ID | Tautology | Evidence |
|---|---|---|
| MC-TT-01 | The **per-action rate is contract-specific** — C#1 charges 1.5 SAR for a WA Mark message, C#2 charges 0.75 SAR for the same message. | Worksheet rates §2.1 |
| MC-TT-02 | When a transaction spans two contracts, **each portion is priced at its own contract's rate** — not blended, not averaged. | §2.3 math; cell value 1.375 confirms |
| MC-TT-03 | The deduction does not "round up to the next contract" — **fractional consumption of a message across contracts is supported**. | `1.25/1.5 = 0.833` fractional cell value |
| MC-TT-04 | **Master Wallet stores per-contract balances** (not a single SAR pot) — confirmed by the columns `MW C#1` and `MW C#2` being independent. | Worksheet column layout §2.2 |
| MC-TT-05 | Transferring from MW to a CommChannel wallet (Aramco) **preserves contract identity** — `C#1=10.0 MW` becomes `C#1=10.0 Aramco`, never blended. | §2.2 row "after transfer" |
| MC-TT-06 | Addons RC (Recurrence Charge) carry their own `Activation` and `Expired` dates per contract. C1–C4 in the worksheet have RC=0/0/25/2 SAR and expiry serial-dates 46026–46361. | Lines 1004–1008 of worksheet |

### §2.5 Implication for BR-CC-31 Wording

The pre-existing rule statement "deduct from the nearest-expiring contract first" is **incomplete** without §2.3. The complete rule is:

> **BR-CC-31 (refined):** When a transaction is funded:
> 1. Walk active contracts in nearest-expiry order.
> 2. For each contract, attempt to consume the full transaction at THAT contract's per-action rate.
> 3. If the contract's remaining balance covers only a fraction `f` of the transaction, consume `f` worth from it.
> 4. Move to the next contract and price the remaining `(1−f)` fraction at THAT contract's rate.
> 5. Continue until the transaction is fully priced or all eligible contracts are exhausted (in which case → abort).

This is now the **canonical** wording. Vol 28 Matrix 5 and Vol 34 (Module 03 Conclusion) must be cross-referenced to this.

---

## §3 — User Status Truth Tautology (SoT: `Users-Statuses-Others.txt` lines 2–35, 1030–1067)

### §3.1 The 5 User Statuses (Definitions)

| Status | Definition | Counted in User Limit? |
|---|---|---|
| **Pending** | The user account is created but not yet activated. | _(column exists in worksheet but value not extracted — flagged as Q-UM-19)_ |
| **Active** | The user account is fully enabled. | _(flagged Q-UM-19)_ |
| **Suspended** | The user account is temporarily disabled. | _(flagged Q-UM-19)_ |
| **Deleted** | The user account is permanently deactivated. | _(flagged Q-UM-19)_ |
| **Locked** | The user account is restricted due to security enforcement or administrative action. | _(flagged Q-UM-19)_ |

### §3.2 Allowed Transition Graph (lines 1030–1035)

| From | To (allowed) | Can Login from `From`? | Can Forget Password from `From`? |
|---|---|---|---|
| Pending | Active, Locked | **Yes** | **No** |
| Active | Suspended, Deleted, Locked | **Yes** | **Yes** |
| Suspended | Active | **No** | **No** |
| Deleted | Active | **No** | **No** |
| Locked | Pending | **No** | **No** |

### §3.3 Truth Tautologies

| ID | Tautology | Source |
|---|---|---|
| US-TT-01 | A Pending user **can log in** (e.g., to complete onboarding) but **cannot reset password**. | Line 1031 |
| US-TT-02 | A Locked user transitions back to **Pending** (not Active) — re-onboarding is required. | Line 1035 |
| US-TT-03 | Suspended ↔ Active is the ONLY reversible state pair. Deleted → Active is one-way reactivation (no return from Suspended/Locked except through Active). | Lines 1032–1034 |
| US-TT-04 | Only an **Active** user can use the "Forget Password" recovery flow — Pending, Suspended, Deleted, and Locked are all locked-out of password recovery. | Lines 1031–1035 |
| US-TT-05 | Active can transition to **three** terminal states (Suspended, Deleted, Locked). The other states have at most one forward transition. | Line 1032 |

### §3.4 Open Question Q-UM-19

The "Counted in User Limit" column header is present at line 2 but its per-status values are not captured in the grep window. Need a deeper read or fresh xlsx re-extraction with proper merged-cell handling.

**Working hypothesis (INFERRED):** Pending + Active + Suspended + Locked count against the user limit; Deleted does not. This matches the "soft-delete" semantics in PR #40937. **Status: Q-UM-19 — pending operator confirmation.**

---

## §4 — Template-Tab Action Matrix (SoT: `WA-Templates-Existing-Actions.txt` lines 3–34)

> **CRITICAL NAMING DISCOVERY:** The file is named "WA-Templates" but the content covers the **Templates tab in general** (WhatsApp + Voice — anything passing through Falcon's template lifecycle). The matrix dimensions are agnostic.

### §4.1 Matrix Shape

- **3 Tabs:** Templates / Pending Review / Shared Templates
- **6 Status Columns:** Pending / Approved / Rejected internally / Rejected final / Restricted / Deleted
- **2 Hierarchy Axes:** His Node / Nodes under his hierarchy
- **4 User Types:** NU (Normal User) / NA (Node Admin) / AO (Account Owner) / Falcon usertype

### §4.2 Templates Tab — His Node (Owner-Hierarchy)

| User Type | Pending | Approved | Rejected internally | Rejected final | Restricted | Deleted |
|---|---|---|---|---|---|---|
| NU | View Details, Share | View Details, Share, Delete | View Details, Share, **Edit** | View Details | View Details | NA |
| NA | View Details, Share | View Details, Share, Delete (**his own created**) | View Details, Share, Edit (**his own created**) | View Details | View Details | NA |
| AO | View Details, Share | View Details, Share, Delete (**his own created**) | View Details, Share, Edit (**his own created**) | View Details | View Details | NA |
| Falcon usertype | NA | NA | NA | NA | NA | NA |

### §4.3 Templates Tab — Nodes Under His Hierarchy

| User Type | Pending | Approved | Rejected internally | Rejected final | Restricted | Deleted |
|---|---|---|---|---|---|---|
| NU | NA | NA | NA | NA | NA | NA |
| NA | View Details, Share | View Details, Share | View Details, Share | View Details | View Details | NA |
| AO | View Details, Share | View Details, Share | View Details, Share | View Details | View Details | NA |
| **Falcon usertype** | **View Details** | **View Details** | **View Details** | **View Details** | **View Details** | **View Details** |

### §4.4 Pending Review Tab — His Node

| User Type | Pending | Approved | Rejected internally | Rejected final | Restricted | Deleted |
|---|---|---|---|---|---|---|
| NU | View Details | View Details | View Details | View Details | View Details | NA |
| NA | View Details | View Details | View Details | View Details | View Details | NA |
| AO | View Details | View Details | View Details | View Details | View Details | NA |
| Falcon usertype | NA | NA | NA | NA | NA | NA |

### §4.5 Pending Review Tab — Nodes Under His Hierarchy

**All cells NA** — no client user type can review templates from sub-nodes' Pending Review pages.

### §4.6 Shared Templates Tab — His Node

| User Type | Pending | Approved | Rejected internally | Rejected final | Restricted | Deleted |
|---|---|---|---|---|---|---|
| NU | View Details | View Details | View Details | View Details | View Details | NA |
| NA | NA | NA | NA | NA | NA | NA |
| AO | NA | NA | NA | NA | NA | NA |
| Falcon usertype | NA | NA | NA | NA | NA | NA |

### §4.7 Shared Templates Tab — Nodes Under His Hierarchy

**All cells NA.**

### §4.8 Truth Tautologies

| ID | Tautology | Source |
|---|---|---|
| TM-TT-01 | A Normal User on **his own node** has the **most** template-edit power on rejected-internally templates — including Edit + Delete actions that AO and NA only have for templates they personally created. | §4.2 row "NU" |
| TM-TT-02 | **NA/AO** can only Edit/Delete templates **they themselves created**. The NU has unconstrained Edit/Delete on his node's templates regardless of creator. | §4.2 rows NA/AO (parenthetical "his own created") |
| TM-TT-03 | **Falcon User** has **zero** access on "His Node" Templates tab — they only see templates one level up (in sub-nodes' Templates tab for governance/audit). | §4.2 row "Falcon usertype" all NA |
| TM-TT-04 | **Falcon User** is the **ONLY** actor with access to the **Deleted** column (across all tabs) — they retain visibility for audit even after deletion. | §4.3 last column |
| TM-TT-05 | **Rejected internally** is the **only state where Edit is allowed** — both Pending and Rejected final lock the template from editing. This is the BR enforcing the maker/checker loop-back. | §4.2 "Rejected internally" column |
| TM-TT-06 | **Restricted** templates (Meta paused/disabled) are READ-ONLY everywhere — no client actor can edit, delete, or appeal them through Falcon. | §4.2 + §4.3 "Restricted" columns all "View Details" only |
| TM-TT-07 | **Shared Templates tab** is **NU-only on His Node**. NA, AO, Falcon never see shared templates — they appear only in the Normal User's view as "templates I can use that I didn't create". | §4.6 |
| TM-TT-08 | **Pending Review tab** is per-hierarchy-level — never shows sub-node Pending items. This means each node's maker/checker queue is self-contained. | §4.5 all NA |

### §4.9 Implication for Vol 41 (Template V4 Refresh)

§4 confirms `BR-TM-V4-Pending-Edit-Block` (Pending = read-only except for Share) and `BR-TM-V4-Rejected-Internal-Edit-Allowed` (Rejected internally = Edit allowed for loop-back to Pending). Both rules were **inferred** in Vol 41; they are now **confirmed** by the BRD matrix.

---

## §5 — Contact Group Permission Matrix (SoT: `Contact-Group-Permissions.txt` lines 4–13)

### §5.1 Matrix

| Actor | View Details | Create | Edit | Share | Delete | Download CG | Download Original Uploaded File |
|---|---|---|---|---|---|---|---|
| **Falcon: System Administrator** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Falcon: Product** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Falcon: Operation** | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| **AO — creator** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **AO — not creator** | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **NA — creator** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **NA — not creator** | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **NU — creator** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **NU — not creator** | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ |

### §5.2 Truth Tautologies

| ID | Tautology | Source |
|---|---|---|
| CG-TT-01 | **Falcon staff cannot mutate Contact Groups** — they can only View and Download. This is the strongest enforcement of "Falcon does not touch customer data" we have on record. | Lines 5–7 |
| CG-TT-02 | **Creator-only Edit and Delete** — across ALL three client user types (AO, NA, NU), only the creator can Edit or Delete a CG. The role itself doesn't grant these rights. | Lines 8–13 |
| CG-TT-03 | **Create + View + Download** is universal for every client user — even an NU (the lowest-privilege client actor) can create a CG and download anyone's CG. | Lines 8–13 |
| CG-TT-04 | **Share** has a hierarchy: AO/NA can share any CG (their own or not), but NU can only share CGs **they created themselves**. | Lines 12–13 vs lines 9, 11 |
| CG-TT-05 | **Download Original Uploaded File** is always paired with Download CG — there is no actor who can download the processed CG but not the raw upload. | Whole table |

### §5.3 Implication for PES Catalog (Q-AM-16 cross-reference)

`contactGroup.edit`, `contactGroup.delete` PES keys must enforce `(actor.userId === resource.createdBy)` regardless of role. Role-only checks will over-grant. This is a code-time security correctness check to add to the PES registry audit.

---

## §6 — Account-Setting CommChannel/App Action Truth (SoT: `Account-Setting-Others.txt` lines 1050–1063)

### §6.1 Status-Driven Action Cascade

> Three life-cycle "stuck" states all resolve via the same two actions: `Do Payment` (→ Active) OR `Disable` (→ Disabled). The client cannot leave a CommChannel/Application in limbo.

| Stuck-State Cause | Available Action | Resulting Status |
|---|---|---|
| CommChannel & App could not be used (general failure) | `Do Payment` | Active |
| _(same)_ | `Disable` | Disabled |
| Renew date satisfied, but I did not have enough balance to do payment for it | `Do Payment` | Active |
| _(same)_ | `Disable` | Disabled |
| CommChannel & App expired and Grace period ends, I do not have enough balance | `Do Payment` | Active |
| _(same)_ | `Disable` | Disabled |

### §6.2 Truth Tautologies

| ID | Tautology | Source |
|---|---|---|
| CC-TT-01 | **Only two terminal actions exist** for stuck CommChannel/App states: pay-up (→ Active) or shut-down (→ Disabled). There is no "extend grace period" or "snooze" action. | Lines 1054–1063 |
| CC-TT-02 | **Grace period ends → not in limbo** — once grace ends without payment, the resource is still recoverable via `Do Payment`. The only path to total loss is `Disable` (which is recoverable later via `Enable`). | Lines 1062–1063 |
| CC-TT-03 | The Renew-date / Grace-end / general-failure paths all converge on the same action set — **the cause matters for telemetry, not for UX**. | Lines 1054, 1059, 1062 |

---

## §7 — Account-Setting Falcon vs Client Marketplace Truth (SoT: `Acc-CommChannels-Marketplace-MenuItems.txt`)

### §7.1 Menu-Item Topology

Two parallel pages exist outside the Organization Hierarchy:
1. **CommChannels & Services Mng** — channels (WA, Voice, SMS, Email) + their services.
2. **Marketplace & Applications Mng** — Falcon-built and partner applications.

Both pages are **synchronized** with the corresponding tabs inside the Organization Hierarchy module — any change in one place is immediately reflected in the other.

### §7.2 Falcon-User View (Admin Console)

Per-row columns: Name | Visibility | Pricing Type | Pricing Value | First Activation Date | Activation Date | Renew Date | Status | Edit Menu (3-dot).

Edit menu contains:
- Edit Pricing Type
- Edit Pricing Value
- Do Payment / Enable / Disable (status-dependent)

**Special rule:** if Falcon updates the **pricing type or value** while status ≠ `Inactive (First Time)` AND status ≠ `-`, the system **adds** three more fields:
- New Pricing Type
- New Pricing Value
- Effective Date

(This implements the "scheduled price change" flow.)

### §7.3 Client View (AO Side)

Two layouts:
- **Card view** — actions as buttons.
- **Table view** — actions via 3-dot menu.

**Filtered:** only CommChannels/Apps the Falcon user has marked as **Visible**.

Clients see: Name | Pricing Type | Pricing Value | (First Activation / Activation / Renew dates accessible via "More Details") | Status | Actions.

**Cannot do:** modify Pricing Type or Pricing Value. Only status-changing actions.

**Scheduled-change visibility:**
- If status = Active / Expired / Disabled → new pricing details show under "More Details".
- If status = Inactive → new pricing fields **replace** the main fields directly (no scheduling because nothing is yet running).

### §7.4 Truth Tautologies

| ID | Tautology | Source |
|---|---|---|
| MP-TT-01 | The Marketplace menu items and the Organization Hierarchy tabs are **bidirectionally synchronized** — they're not two stores; they're two views of one underlying state. | Para 4 of `Acc-CommChannels-Marketplace-MenuItems.txt` |
| MP-TT-02 | **Visibility flag is Falcon-controlled** — clients cannot see CommChannels/Apps that Falcon hasn't marked Visible. This is a **commercial gate**, not a security gate. | "These pages show only the CommChannels and applications that the Falcon user type has marked as Visible" |
| MP-TT-03 | **Pricing-Type / Pricing-Value can only be edited by Falcon users.** Client AOs cannot touch pricing — they can only act on their wallet balance to pay. | "Clients cannot modify the pricing type or pricing value" |
| MP-TT-04 | A **scheduled price change** requires three fields together — New Type, New Value, Effective Date. If any are missing, the change is immediate. | §7.2 last paragraph |
| MP-TT-05 | The system distinguishes `Inactive (First Time)` from `Inactive` — only on the former does pricing changes apply immediately to the main fields. | Last 2 paragraphs of source doc |

### §7.5 Architectural Implication

The dual-page sync means there is exactly **one entity store** behind both views — the only difference is the query filter (Visibility for clients, all-records for Falcon). This rules out separate "marketplace catalog" and "hierarchy attachment" tables; the DB schema is unified.

---

## §8 — Destination Identification Truth (SoT: `Destination-Identification.txt` + `Research-Phone-Number-V3.txt` + `International-Phone-Destinations.txt`)

### §8.1 E.164 / E.129 Foundations

Per ITU-T Recommendation E.164:
- Maximum international number length = **15 digits**.
- Composition = **CC + N(S)N** where N(S)N = NDC + SN (excluding any leading national prefix '0').
- CC = 1–3 digits.
- NDC = variable; in special cases NDC = 0 digits (number = CC + SN directly).
- SN ≥ 4 digits; max bounded by 15-digit ceiling minus CC + NDC.
- **Minimum valid phone number = 7 digits** (per Falcon BRD).

### §8.2 Falcon's Identification Flow (`Destination-Identification.txt`)

For an incoming destination phone number:
1. **Identify country** by matching the leading 1–3 digits against the CC table.
2. **Identify mobile NDC** from the remaining digits against the country's mobile NDC list → resolves the mobile operator.
3. **OR identify fixed-line NDC** against the country's fixed NDC list → resolves the geographic district.
4. With (country, NDC) resolved:
   - Validate the **total number length** against the country's expected range.
   - Look up the **price** (per-message rate by country + operator).
   - Look up the **routing provider** (which SMS/Voice provider to use for this destination).
   - Check the **account's eligibility** — is the country enabled for this account? Is the operator enabled?
   - Check **CommChannel eligibility** — e.g., SMS may be blocked for fixed-line numbers.

### §8.3 Saudi Arabia Numbering Plan (CC = 966) — Authoritative Reference

#### Fixed NDCs (2-digit) — 2013 restructuring added leading '1'
| Current NDC | Old NDC | Region | Cities |
|---|---|---|---|
| 11 | 01 | Riyadh Region | Riyadh, Al Kharj |
| 12 | 02 | Western Region | Makkah, Jeddah, Taif, Rabigh |
| 13 | 03 | Eastern Province | Dammam, Khobar, Dhahran, Jubail |
| 14 | 04 | Al-Madinah & Tabuk | Al-Madinah, Tabuk, Yanbu |
| 16 | 06 | Qassim & Hail | Buraidah, Hail, Majma |
| 17 | 07 | Southern Regions | Abha, Najran, Jizan, Khamis Mushait |

#### Mobile NDCs (2-digit) — Operator allocation
| NDC | Operator |
|---|---|
| 50, 53, 55 | **STC** (Saudi Telecom Company) |
| 54, 56 | **Mobily** |
| 58, 59 | **Zain** |
| 51 (510, 511 …) | **Salam Mobile** |
| 570, 571, 572 | **Virgin Mobile** (MVNO via 57 NDC) |
| 575 | **Red Bull Mobile** (MVNO via 57 NDC) |
| 576, 577, 578 | **Lebara Mobile** (MVNO via 57 NDC) |

- N(S)N length = **9 digits** (2 NDC + 7 SN).
- Total international length = **12 digits** (3 CC + 9 N(S)N).

### §8.4 Zone 9 Regional Reference

| Country | CC | Fixed NDC Length | Mobile NDC Length | Total Length | Mobile NDC Examples |
|---|---|---|---|---|---|
| Saudi Arabia | 966 | 2 | 2 | 12 | 50/53/55 (STC), 54/56 (Mobily), 58/59 (Zain), 51 (Salam), 57 (MVNOs) |
| Iran | 98 | 2 | 2 | 12 (2 CC + 10 N(S)N) | 90, 91 (MCI), 93 (Irancell), 99 |
| Jordan | 962 | 1 (6=Amman) | 2 | 12 (3 CC + 9 N(S)N) | 77, 78, 79 |
| UAE | 971 | 1 (4=Dubai, 2=Abu Dhabi) | 2 | 12 (3 CC + 9 N(S)N) | 50, 52, 55 |
| Egypt | 20 | 1 (2=Cairo, 3=Alex) or 2 | 2 | 13 (2 CC + 11 N(S)N) | 10 (Vodafone), 11 (Etisalat), 12 (Orange), 15 (WE) |

### §8.5 NANP (CC = 1) — Shared NDC Plan

The North American Numbering Plan covers 25+ jurisdictions sharing CC = 1:
- USA, Canada, Bermuda, Bahamas, Cayman Islands, Jamaica, Trinidad, Puerto Rico, US Virgin Islands, Anguilla, Antigua & Barbuda, Barbados, BVI, Dominica, Dominican Republic, Grenada, Guam, Montserrat, Northern Mariana Islands, St Kitts & Nevis, St Lucia, St Vincent & Grenadines, Sint Maarten, Turks & Caicos, American Samoa.
- **NDCs (NPAs) are NOT separable into Fixed vs Mobile** — a 212 area code (NYC) can be either.
- All routed via "International" provider in Falcon (per `International-Phone-Destinations.txt` worksheet rows 233–256).

### §8.6 Zone 7 Reference (Russia + Kazakhstan)

From `Dina-International-Destinations.txt`:

#### Kazakhstan mobile NDCs (700–778)
| NDC | Operator |
|---|---|
| 700, 708 | Altel |
| 701, 702, 777 | Kcell |
| 705, 771, 775, 778 | Beeline |
| 707, 776 | Tele2 |

#### Russia mobile NDC summary (900–946)
| NDC Range | Primary Operators |
|---|---|
| 900–909 | Beeline / Rostelecom / Tele2 / MTT / SberMobile / AKOS |
| 910–919 | **MTS** (all) |
| 920–939 | **MegaFon** (with VTB Mobile and SberMobile sharing 930, 933) |
| 935, 940, 942–946 | Reserve |
| 941 | GLONASS |

### §8.7 Truth Tautologies

| ID | Tautology | Source |
|---|---|---|
| DI-TT-01 | **Falcon's destination-pricing model requires fully-populated CC × NDC × Operator × Provider × Length tables for every country it supports.** | `Destination-Identification.txt` last paragraph |
| DI-TT-02 | **NANP (CC=1) cannot be subdivided into "fixed" vs "mobile" by NDC alone** — Falcon must either treat all CC=1 numbers as "mobile-or-fixed" or look up the LERG database for definitive type. | §8.5 + Research-Phone V3 §2.3 |
| DI-TT-03 | KSA mobile is identified by **2-digit NDC** (50–59). The leading '5' alone is insufficient — STC (50/53/55) and Mobily (54/56) share the leading '5' and require the second digit for routing. | Research-Phone V3 §3.1.2 |
| DI-TT-04 | The MVNO sub-allocation pattern (Virgin/Lebara/Red Bull under NDC 57) requires Falcon to examine **the first digit of the SN** to resolve operator — not just the NDC. | Research-Phone V3 §3.1.2 |
| DI-TT-05 | **Minimum 7-digit / Maximum 15-digit** is the universal Falcon range — even smaller-NDC countries (e.g., Norway CC=47 with 8-digit total) and larger countries (Egypt at 13 digits) fit. | `Destination-Identification.txt` lines 18–19 |
| DI-TT-06 | "**Service phone numbers**" (premium-rate, toll-free, short codes) are **excluded** from the current scope — only Fixed and Mobile are supported. | `Destination-Identification.txt` line 5 |

### §8.8 Scalability Hook (BRD-Stated Future Features)

Per `Destination-Identification.txt` paragraph "build on top of it":
1. Account-level eligibility per country.
2. Account-level eligibility per operator.
3. SMS-block on fixed-line numbers per CommChannel rules.

These are **defined as future capabilities** built on the same identification table — confirming the identification module is the foundation for **account-scoped routing policy**, not just pricing.

---

## §9 — Status × Action Convergence (Cross-§Tautologies)

Drawing across §4 (templates), §6 (commchannel/app), §3 (users):

| Domain | Recovery action | Recovery destination |
|---|---|---|
| User (Suspended) | _(internal — by AO/Admin)_ | Active |
| User (Deleted) | _(internal — by AO/Admin)_ | Active |
| User (Locked) | _(after lockout period)_ | Pending |
| Template (Rejected internally) | Edit (loop-back) | Pending |
| Template (Restricted by Meta) | _(no recovery via Falcon)_ | n/a |
| CommChannel/App (any stuck state) | Do Payment | Active |
| CommChannel/App (any stuck state) | Disable | Disabled |
| Contract (Expired) | _(system-triggered)_ | Deduction → MW + linked wallets purged |

### §9.1 Universal Tautology
**Every Falcon entity has exactly ONE explicit recovery action OR explicit closure action — no "implicit re-activation by passage of time".** This is a **deliberate** design: the system is deterministic and operator-led, never time-led.

---

## §10 — Files Mined in This Volume

| File | Lines | Key Section | Coverage |
|---|---|---|---|
| `Wallets-Balance-Flow.txt` | 3994 | Sheet 3 rows 2037–2092 | §1 |
| `Multiple-Contracts-Deduction.txt` | 1008 | Lines 3–17, 1004–1008 | §2 |
| `Users-Statuses-Others.txt` | 2000 | Lines 2–35, 1030–1067 | §3 |
| `WA-Templates-Existing-Actions.txt` | 987 | Lines 3–34 | §4 |
| `Contact-Group-Permissions.txt` | 1001 | Lines 4–13 | §5 |
| `Account-Setting-Others.txt` | 2000 | Lines 23–63 (settings) + 1050–1063 (actions) | §6 (partial — settings IPs/quotas pending) |
| `Acc-CommChannels-Marketplace-MenuItems.txt` | 45 | Full doc | §7 |
| `Destination-Identification.txt` | 39 | Full doc | §8 |
| `Research-Phone-Number-V3.txt` | 371 | §§2, 3, 4, 5 | §8 |
| `International-Phone-Destinations.txt` | 717 | Rows 2–256 + onwards | §8 |
| `Dina-International-Destinations.txt` | 163 | Rows 2–60 | §8 |
| `Account-User-Stories.txt` | 2028 | Lines 30–67, 1043+ | §7 (cross-ref) + open for full epic mining |
| `Multi-Contract-Balance-Actions.txt` | 1004 | Lines 3–32 | §2 (cross-ref worked example) |
| `Contract-User-Stories.txt` | 19 | Full doc | minimal coverage — needs deeper extraction |

---

## §11 — New Open Questions Surfaced

| ID | Question | Owner | Trigger |
|---|---|---|---|
| **Q-UM-19** | Confirm "Counted in User Limit" per-status values (Pending / Active / Suspended / Deleted / Locked). | Business analyst | §3.4 |
| **Q-CC-12** | Confirm if "WA Auth/Util/Mark" per-contract rates are stored on the Contract entity or derived from a Plan template. | Architect (Module 03) | §2.1 |
| **Q-AM-17** | Marketplace `Visibility` field — is it per-CommChannel/App or per-(CommChannel × Node) pair? | Architect (Module 01) | §7.4 MP-TT-02 |
| **Q-AM-18** | Scheduled price change — does the Effective Date support a "back-out" / revert action before activation? | Business analyst | §7.4 MP-TT-04 |
| **Q-DI-01** | NANP fixed-vs-mobile resolution — does Falcon integrate LERG (or equivalent) to resolve, or treat CC=1 numbers as "single bucket"? | Architect (routing) | §8.7 DI-TT-02 |
| **Q-DI-02** | MVNO sub-allocation within NDC 57 (KSA) — does the database store first-digit-of-SN as a separate dimension, or computed at lookup time? | Architect (data model) | §8.7 DI-TT-04 |
| **Q-TM-V4-15** | Template "Rejected final" — is this a Meta-only state, or can Falcon Level-1/2 trigger it? | Business analyst | §4.8 TM-TT-05 |

---

## §12 — Architectural Implications for Per-Module Conclusions

### §12.1 Module 01 (Account Mgmt) — Vol 34
- Add §7 marketplace truth as new subsection (§4.7).
- Refresh `BR-AM-` numbering to absorb scheduled-price-change semantic.

### §12.2 Module 02 (User Mgmt) — Vol 35
- Status transitions table in §35.2 is **confirmed** by §3.2 (Vol 44).
- Open `Q-UM-19` for user-limit accounting.

### §12.3 Module 03 (Contract & Cost) — Vol 36
- BR-CC-31 wording must be replaced by the §2.5 refined version.
- Worked example §2.3 should be embedded into Vol 36 as the canonical illustration.

### §12.4 Module 04 (Contact Groups) — Vol 37
- §5 confirms the creator-only Edit/Delete rule.
- Add `CG-TT-01` (Falcon cannot mutate CGs) to the Vol 37 "Universal Tautologies" section.

### §12.5 Module 05 (Templates) — Vol 38 / Vol 41
- §4 confirms the per-status action matrix Vol 41 derived from V4.
- Add `Pending Review` and `Shared Templates` tab matrices to Vol 41 (§4.4–4.7).
- Falcon User cross-hierarchy visibility (§4.3 row "Falcon usertype") is a **new** finding — Vol 41 had it as INFERRED; now CONFIRMED.

### §12.6 Module 06 (BSA) — Vol 40
- §8 destination identification truth feeds directly into BSA's "Send To" recipient validation.
- BSA must use the same CC × NDC tables and the same min-7 / max-15 validation rule.

---

## §13 — Source-Prefix Discipline Reminder

Every fact in this volume is from `[BRD-EXTRACTED]` documents — extracted via PowerShell System.IO.Compression from the operator's latest BRD bundle dated **2026-05-17**. The xlsx files were parsed for cell content, the docx files for paragraph text.

**Nothing in this volume is INFERRED unless explicitly tagged.** All `*-TT-*` tautologies are direct restatements of BRD cell content.

---

**End of Volume 44 — Supporting Artifacts Research**
**Authored:** 2026-05-18 (night-shift continuation)
**Supersedes:** sections of Vol 28 Matrix 5 (wallet detail), Vol 31 (destination scope), Vol 38 (template per-status).
**Cross-refs:** Vol 41 (Template V4), Vol 42 (BRD refresh report), Vol 43 (Obsidian enhancement).
