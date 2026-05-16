---
type: cross-cut-matrix
axis-a: business-rules (BR-AM-* + BR-UM-* + BR-CC-* + BR-CG-*)
axis-b: features (7)
purpose: "Answers 'which BR-* cross-field/workflow/domain rules apply to feature F + how do they interact with PES (who) and V-rules (form data)'. Open before implementing workflow logic."
extracted: 2026-05-16
source: Brain Outputs/prd/modules/<module>/BUSINESS_RULES.md
---

# Business Rules × Feature — Cross-Cut Matrix

> [!tldr]
> Business rules (BR-*) are PRD-authored cross-field / workflow / domain rules — the "what the system MUST do" layer that sits between PES (who can do it) and V-rules (is the form data well-formed). This matrix maps the 4 BR-* clusters (174 rules total) onto the 7 features so a porter / implementer can see at a glance which BR rules a feature must implement.

## 1. The 3-axis taxonomy — PES vs V-rule vs BR-*

Three orthogonal authority layers gate every Falcon user action. They MUST all pass for the action to succeed.

| Layer | Question it answers | Example | Source of truth |
|---|---|---|---|
| **PES** (Policy / Permission) | "Is this **role** allowed to do **this action** on **this resource**?" | `sys-admin` is `allow` on `sys.account / add` | `BuiltInRoleCatalog.cs` + `pes-account-role-rules.json` + `falcon-access.registry.ts` |
| **V-rule** (Validation) | "Is **this individual data point** structurally valid?" | `AccountName` must start with a letter, ≤30 chars, unique | `Brain Outputs/understanding/.../validations/V-*.md` + backend `[ThrowIf*]` attrs + FE Reactive Forms `Validators.*` |
| **BR-*** (Business Rule) | "What **cross-field / workflow / domain logic** applies?" | If `Visibility=Show`, then `PriceType` AND `PriceValue` become mandatory | `Brain Outputs/prd/modules/<module>/BUSINESS_RULES.md` |

[INFERRED] Critical mental model: **PES is binary (role × action)**, **V-rule is per-field validity**, and **BR-* is everything else that's true about the system — sequencing, state machines, coupling, side effects, defaults, fallbacks.** A feature that passes PES + every V-rule can still violate a BR rule (e.g. activating a Pending contract before its `StartDate`).

## 2. The 4 BR-* clusters — index by PRD module

[BRAIN-OUT] Counts derived directly from `Brain Outputs/prd/modules/<module>/BUSINESS_RULES.md`:

| Cluster | Module | File | Rule range | Total | CONFIRMED | OPEN | INFERRED |
|---|---|---|---|---|---|---|---|
| **BR-AM-*** | 01-account-management | [BUSINESS_RULES.md](../../../prd/modules/01-account-management/BUSINESS_RULES.md) | BR-AM-01..42 | **42** | 36 | 4 | 2 |
| **BR-UM-*** | 02-user-management | [BUSINESS_RULES.md](../../../prd/modules/02-user-management/BUSINESS_RULES.md) | BR-UM-01..50 | **50** | 44 | 6 | 0 |
| **BR-CC-*** | 03-contract-packaging-charging-billing | [BUSINESS_RULES.md](../../../prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md) | BR-CC-01..50 | **50** | 39 | 10 | 1 |
| **BR-CGM-*** | 04-contact-group-management | [BUSINESS_RULES.md](../../../prd/modules/04-contact-group-management/BUSINESS_RULES.md) | BR-CGM-01..38 | **38** | 29 | 9 | 0 |
| **TOTAL** |  |  |  | **180** | 148 | 29 | 3 |

> Note: BR-CGM-* is the canonical prefix used in `04-contact-group-management/BUSINESS_RULES.md` (the original brief said BR-CG-* but the actual file uses BR-CGM-*). All citations in this matrix use the source prefix.

## 3. Master matrix — BR cluster × feature

Cells show **rules-applicable / rules-in-cluster**. "Applicable" means the rule is enforced or surfaced in that feature's UI / workflow. The full per-rule breakdown is in §4.

| BR cluster | organization-hierarchy | comms-hub | marketplace-applications | contact-groups | wallet-balance-management | contracts-cost-management | testing-charging |
|---|---|---|---|---|---|---|---|
| **BR-AM-*** (42) | **28 / 42** | 7 / 42 | 7 / 42 | 2 / 42 | 12 / 42 | 4 / 42 | 1 / 42 |
| **BR-UM-*** (50) | 8 / 50 | 0 / 50 | 0 / 50 | 4 / 50 | 0 / 50 | 0 / 50 | 0 / 50 |
| **BR-CC-*** (50) | 2 / 50 | 7 / 50 | 7 / 50 | 0 / 50 | 9 / 50 | **34 / 50** | 5 / 50 |
| **BR-CGM-*** (38) | 0 / 38 | 0 / 38 | 0 / 38 | **36 / 38** | 0 / 38 | 0 / 38 | 0 / 38 |
| **Feature totals** | **38** | 14 | 14 | **42** | 21 | 38 | 6 |

[INFERRED] **Insights from the matrix**:
- `organization-hierarchy` is the **densest** for BR-AM-* — it owns the Add Client wizard which surfaces 28 of the 42 account rules (creation, settings, comm-channels, applications, account-owner sub-flow).
- `contact-groups` is **near-totally owned** by BR-CGM-* — every group lifecycle rule lives in this one feature.
- `contracts-cost-management` is **near-totally owned** by BR-CC-* — most contract lifecycle rules apply here. The 9 BR-CC-* rules outside this feature (in wallet-balance-management) are the *charging-side* rules (BR-CC-30..39).
- `testing-charging` touches only a handful (BR-CC-32 send-transaction, BR-CC-22..26 cost matrix, BR-AM-23 renewal — verifies them by triggering real OCS).
- `marketplace-applications` and `comms-hub` share the **same** 7 BR-AM-* rules (visibility / pricing lifecycle), plus the same 7 BR-CC-* rules (charging cascade) — they are sibling features of the "Account Services" cluster.

## 4. Per-feature BR inventory

### 4.1 `organization-hierarchy` — 38 BR rules

The largest feature. Owns: Add Client wizard (5 steps) + Add Node + Add User + Edit Node + Settings tab + tree view.

**BR-AM-* (28 rules)** — Account Management:

| BR # | Rule | Wizard step / surface |
|---|---|---|
| BR-AM-01 | 3-level hierarchy (Root / Main / Sub) | Tree structure + node-type gates |
| BR-AM-02 | **Permission gate — Falcon SA + Product only for Add Client** | Add Client button visibility |
| BR-AM-03 | AccountName uniqueness/format/required | Step 1 — async uniqueness check |
| BR-AM-04 | AccountId auto-generated | Step 1 — read-only after save |
| BR-AM-05 | FinanceId sourced from Finance, mandatory | Step 1 |
| BR-AM-06 | ClassificationCategory enum (VIP/Critical/Normal), optional | Step 1 |
| BR-AM-07 | ClassificationSubCategory enum (Bank/Gov/SemiGov/Large/Medium/SME) | Step 1 |
| BR-AM-08 | AuthorityLetterType (Gov/Commercial/Charity) with 2 linked fields | Step 1 |
| BR-AM-09 | **PasswordSecurityLevel is account-level setting** | Step 2 + Settings tab |
| BR-AM-10 | **IP allowlist enforcement** | Step 2 + Settings tab + every login gateway check |
| BR-AM-11 | Account Limits zero-means-no-limit (4 limits) | Step 2 + Settings tab |
| BR-AM-12 | System User / Normal User counts are independent | Step 2 + Settings tab |
| BR-AM-13 | Account Limits set in Step 2 (mandatory step) | Step 2 |
| BR-AM-14 | CommChannel visibility default = Hide | Step 3 |
| BR-AM-15 | **Visibility=Show → Pricing mandatory** | Step 3 + Step 4 (cross-field rule) |
| BR-AM-16 | PricingType enum (Monthly/Yearly/OneTimePayment) | Step 3 + Step 4 |
| BR-AM-17 | PriceValue >= 0 SAR | Step 3 + Step 4 |
| BR-AM-18 | Steps 3 + 4 OPTIONAL | Wizard navigation |
| BR-AM-19 | Step 5 creates Account Owner user (mandatory) | Step 5 |
| BR-AM-25 | BalanceType + WalletType are Falcon-only configs | Settings tab — wallet strategy section |
| BR-AM-26 | Wallet matrix — 4 combinations | Settings tab |
| BR-AM-27 | Node-based — only Normal Users consume | Wallet strategy (cross-ref wallet feature) |
| BR-AM-28 | Master Wallet aggregate | Wallet strategy display |
| BR-AM-29 | Comm Wallet only in Multiple-wallet mode | Settings tab — derived UI |
| BR-AM-39 | Account Limits enforcement when over-limit — **OPEN** | Settings tab — runtime behavior |
| BR-AM-40 | Visibility flip Show→Hide while Active — **OPEN** | Step 3 + Step 4 + Settings |
| BR-AM-41 | BalanceType / WalletType mid-life change — **OPEN** | Settings tab |
| BR-AM-42 | Normal User deletion balance fate — **OPEN** | Hierarchy delete flow |

**BR-UM-* (8 rules)** — User Management (Step 5 + Add User + Edit User flows):

| BR # | Rule | Surface |
|---|---|---|
| BR-UM-01 | Falcon usertypes on Root only; Client on Main/Sub | Tree node-type gating |
| BR-UM-02 | Only SA + Product can Add Client | Cross-ref BR-AM-02 |
| BR-UM-03 | Account Owner exists at Main-node only (one per account) | Step 5 + Add User flow |
| BR-UM-11 | FirstName/LastName ≤50 chars letters only mandatory | Step 5 + Add User Step 1 |
| BR-UM-12 | Username ≤30 chars letter-first unique mandatory | Step 5 + Add User Step 1 — async uniqueness |
| BR-UM-13 | Email valid format mandatory | Step 5 |
| BR-UM-14 | PhoneNumber valid format mandatory (OTP) | Step 5 |
| BR-UM-18 | Save → delivery dialog (Email / Phone / Both) | Step 5 confirmation |

**BR-CC-* (2 rules)** — Contract / Charging (cross-feature reads):

| BR # | Rule | Surface |
|---|---|---|
| BR-CC-30 | Every balance action linked to contract ID | Wallet strategy display |
| BR-CC-39 | Multiple Active contracts per account allowed | Settings tab display |

### 4.2 `comms-hub` — 14 BR rules

The comm-channels list. Inherits visibility / pricing / status lifecycle from BR-AM-* + charging cascade from BR-CC-*.

**BR-AM-* (7 rules)**:

| BR # | Rule | Surface |
|---|---|---|
| BR-AM-14 | Visibility default = Hide | Per-row visibility toggle |
| BR-AM-15 | Visibility=Show → Pricing mandatory | Edit price-type / edit price-value flows |
| BR-AM-16 | PricingType enum (Monthly/Yearly/OneTimePayment) | Edit price-type dropdown |
| BR-AM-17 | PriceValue >= 0 SAR | Edit price-value form |
| BR-AM-20 | Comm-channel status lifecycle (Inactive / Paid / Active / Expired / Disabled) | Status column + row actions |
| BR-AM-21 | Grace period (7 days Monthly / 30 days Yearly+OneTime) | Status badge + payment dialog |
| BR-AM-22 | Activation deducts price + tags contract ID | DoPayment action |

**BR-CC-* (7 rules)** — charging cascade:

| BR # | Rule | Surface |
|---|---|---|
| BR-CC-30 | Every balance action linked to contract ID | Payment dialog + audit |
| BR-CC-31 | Nearest-expiring contract first | Payment dialog (implicit) |
| BR-CC-33 | Activate from Addons — Single wallet | DoPayment (Single mode) |
| BR-CC-34 | Activate from Addons — Multiple wallet | DoPayment (Multiple mode) |
| BR-CC-36 | Activate/Renew CommChannel — Master → CommChannel cascade | DoPayment renew flow |
| BR-CC-37 | Contract value flows into Master on Active | Indirect — wallet balance display |
| BR-CC-38 | On contract Expiration, wallet records excluded from lump-sum | Wallet balance display side-effect |

### 4.3 `marketplace-applications` — 14 BR rules

Identical BR set to `comms-hub` — they are sibling features.

**BR-AM-* (7 rules)**: BR-AM-14, BR-AM-15, BR-AM-16, BR-AM-17, BR-AM-20, BR-AM-21, BR-AM-22 (same as comms-hub but for application records).

**BR-CC-* (7 rules)**: BR-CC-30, BR-CC-31, BR-CC-33, BR-CC-34, BR-CC-36, BR-CC-37, BR-CC-38 (same charging cascade).

### 4.4 `contact-groups` — 42 BR rules

The contact-group lifecycle feature. Owns nearly all of BR-CGM-* plus a handful of BR-AM-* (account scope) + BR-UM-* (creator-vs-other share rules).

**BR-CGM-* (36 of 38)** — entire cluster minus 2 OPEN questions about silent semantics:

| BR # | Rule | Surface |
|---|---|---|
| BR-CGM-01 | Immutable Contact ID | List column + detail header |
| BR-CGM-02 | Group Name ≤50 chars mandatory | Step 1 of 5-step wizard |
| BR-CGM-03 | Reference ID optional | Step 1 |
| BR-CGM-04 | File CSV/XLS/XLSX + App-Settings size cap | Step 2 (file upload) |
| BR-CGM-05 | "First row is header" toggle | Step 3 (column mapping) |
| BR-CGM-06 | Column names — English-letters-only, no dupes, no specials, ≤20 chars, space→_ | Step 3 validation |
| BR-CGM-07 | Data preview — first 5 rows | Step 3 preview panel |
| BR-CGM-08 | Content NOT validated beyond parsing | Step 3 upload behavior |
| BR-CGM-09 | Share step (optional) — pick users OR "All Users" | Step 5 of wizard |
| BR-CGM-10 | Sharing scope — Normal Users in same account | Step 5 user picker |
| BR-CGM-11 | AO + Node Admin can share groups created by others in their hierarchy | Per-row Share gate (cross-hierarchy) |
| BR-CGM-12 | Normal User (non-creator) CANNOT share | Per-row Share gate |
| BR-CGM-13 | Falcon usertypes — View Y, all-other-actions N (Download Y) | Admin-console contact-groups page (view-only) |
| BR-CGM-14 | Client AO (creator) — all Y | Per-row action set |
| BR-CGM-15 | Client AO (not creator) — View Y, Create Y, Share Y, Edit/Delete N | Per-row action set |
| BR-CGM-16 | Client Node Admin (creator) — all Y | Per-row action set |
| BR-CGM-17 | Client Node Admin (not creator) — View Y, Create Y, Share Y, Edit/Delete N | Per-row action set |
| BR-CGM-18 | Client Normal User (creator) — all Y | Per-row action set |
| BR-CGM-19 | Client Normal User (not creator) — View Y, Create Y, Edit/Share/Delete N | Per-row action set |
| BR-CGM-20 | AO / Node Admin on own node — 1 tab `Contact Groups` | Tab visibility |
| BR-CGM-21 | Normal User on own node — 2 tabs (`Contact Groups` + `Shared Groups`) | Tab visibility (mgmt-only) |
| BR-CGM-22 | AO / Node Admin on sub-nodes — 1 tab no `Shared Groups` | Tab visibility |
| BR-CGM-23 | Falcon usertype — must select Main node, 1 tab view-only, sees soft-deleted | Admin-console state precondition |
| BR-CGM-24 | List columns canonical set | Table column definition |
| BR-CGM-25 | Uploaded Contact count frozen at upload | List column behavior |
| BR-CGM-26 | Edit (creator only) — Name/Shared With/Reference ID editable | Edit drawer |
| BR-CGM-27 | Edits propagate to shared versions (SSoT) | Backend invariant |
| BR-CGM-28 | Soft delete — Falcon usertype still sees | List filter behavior |
| BR-CGM-29 | Status enum (`In Progress` / `Completed`) | Status column |
| BR-CGM-30 | App Settings max-upload-file-size — **OPEN** | Step 2 |
| BR-CGM-31 | Re-parsing vs snapshot — **OPEN** | Edit drawer |
| BR-CGM-32 | Shared-with user deleted — share-entry fate — **OPEN** | Detail page |
| BR-CGM-33 | "Shared With (+N)" collapsing threshold — **OPEN** | List column |
| BR-CGM-34 | `Failed` status on parse error — **OPEN** | Status enum |
| BR-CGM-35 | Hierarchy depth visibility — **OPEN** | List filter |
| BR-CGM-37 | "First row is header" off post-edit-of-names — **OPEN** | Step 3 |
| BR-CGM-38 | Share-with-self UI prevention — **OPEN** | Step 5 |

**BR-AM-* (2 rules)** — account scope:
- BR-AM-01 — 3-level hierarchy (governs user-picker depth)
- BR-AM-27 — node-based balance only Normal Users consume (cross-ref for who can be in "Shared With")

**BR-UM-* (4 rules)** — user identity (creator-vs-other comparisons):
- BR-UM-01 — Falcon usertypes on Root; Client on Main/Sub (determines tab set)
- BR-UM-03 — AO at Main-node only (determines share-with-others rights)
- BR-UM-04 — Node Admin manages sub-nodes (cross-ref share rights)
- BR-UM-05 — Normal User views/edits own only (cross-ref BR-CGM-12)

### 4.5 `wallet-balance-management` — 21 BR rules

The wallet view + transfer feature.

**BR-AM-* (12 rules)** — wallet matrix + transfers:

| BR # | Rule | Surface |
|---|---|---|
| BR-AM-25 | BalanceType + WalletType Falcon-only | Settings card (edit gated) |
| BR-AM-26 | 4 wallet configurations | Settings card display |
| BR-AM-27 | Node-based — only Normal Users consume | Tree node display |
| BR-AM-28 | Master Wallet aggregate | Master Wallet card (Falcon-only) |
| BR-AM-29 | Comm Wallet — Multiple mode only | Per-row column visibility |
| BR-AM-30 | Master ↔ Comm transfer — Falcon-only | Transfer dialog source/destination filter |
| BR-AM-31 | Comm ↔ User/Node — Falcon + AO | Transfer dialog rules |
| BR-AM-32 | User/Node ↔ User/Node — Falcon + AO + Node Admin | Transfer dialog rules |
| BR-AM-33 | Single-mode Master ↔ User/Node — Falcon + AO | Transfer dialog rules |
| BR-AM-34 | Balance Transfer Limit (%) — Master source exempt | Transfer amount validator |
| BR-AM-35 | Contract value flows into Master on Active | Master Wallet display |
| BR-AM-38 | On expiration, records retained but subtracted from lump-sum | Wallet display invariant |

**BR-CC-* (9 rules)** — charging cascade affecting wallets:

| BR # | Rule | Surface |
|---|---|---|
| BR-CC-30 | Every balance action linked to contract ID | Transfer audit |
| BR-CC-31 | Nearest-expiring first | Display order + transfer source pull |
| BR-CC-32 | Send Transaction cascade | Indirect (read-only display) |
| BR-CC-33 | Activate from Addons — Single wallet | Cross-ref |
| BR-CC-34 | Activate from Addons — Multiple wallet | Cross-ref |
| BR-CC-35 | Transfer Balance — nearest-expiring source | Transfer dialog rule |
| BR-CC-36 | Activate/Renew CommChannel cascade | Indirect |
| BR-CC-37 | Contract value flows into Master on Active | Display dependency |
| BR-CC-38 | On Expiration, records excluded from lump-sum | Display dependency |

### 4.6 `contracts-cost-management` — 38 BR rules

Owns nearly the entire BR-CC-* cluster.

**BR-CC-* (34 of 50)** — every contract-lifecycle rule:

| BR # | Rule | Surface |
|---|---|---|
| BR-CC-01 | Contracts created by Falcon usertype only | View-only for AO; create for Falcon |
| BR-CC-02 | 4-step wizard | Add Contract flow |
| BR-CC-03 | Contract ID auto-generated unique | Step 1 read-only |
| BR-CC-04 | Farabi Reference ID ≤50 chars | Step 1 |
| BR-CC-05 | Contract Name ≤50 chars mandatory | Step 1 |
| BR-CC-06 | StartDate >= today | Step 1 date validator |
| BR-CC-07 | ExpirationDate > StartDate AND > now | Step 1 date validator |
| BR-CC-08 | Contract Value positive float <= hundreds of millions | Step 1 |
| BR-CC-09 | Remaining Value auto-calculated | View display |
| BR-CC-10 | Status auto-derived from dates | View display |
| BR-CC-11 | Status enum (Pending / Active / Expired) | Status badge |
| BR-CC-12 | Pending — value not yet in Master Wallet | Master Wallet display dependency |
| BR-CC-13 | Active — value charged | Master Wallet display |
| BR-CC-14 | Expired — Remaining hidden from client, visible to Falcon | View role-based display |
| **BR-CC-15** | **Pending contract — full edit** | Edit drawer fields |
| **BR-CC-16** | **Active/Expired contract — restricted edit (Name/Value/Start locked)** | Edit drawer field gates |
| BR-CC-17 | Extending Expired ExpirationDate → returns to Active | Edit drawer side-effect |
| BR-CC-18 | Rate Card per visible commchannel — Price Unit + Price Value | Step 2 |
| BR-CC-19 | SAR → Points conversion formula | Step 2 + Points display |
| BR-CC-20 | Rate Card price applies — Multiple-wallet OR Single with one active commchannel | Step 2 conditional UI |
| BR-CC-21 | Price-unit list editable in DB | Step 2 dropdown source |
| BR-CC-22 | Cost = f(App, CommChannel, Priority, Destination) | Step 3 matrix |
| BR-CC-23 | WhatsApp priorities — Authentication/Utility/Advertisement/Service (Service tentative) | Step 3 |
| BR-CC-24 | Voice priorities — High/Normal/VeryLow | Step 3 |
| BR-CC-25 | AI no Priority, Destination=Global | Step 3 |
| BR-CC-26 | Destinations from sheet | Step 3 destination dropdown |
| BR-CC-27 | Addons — Sub-services rate card + Free credit | Step 4 |
| BR-CC-28 | Addon free-credit exhausts → fallback to rate-card | Step 4 logic display |
| BR-CC-29 | Zero-value addon rate card short-circuits | Step 4 [INFERRED] |
| BR-CC-39 | Multiple Active contracts simultaneously allowed | View list |
| BR-CC-40 | AO can view; Remaining Value visible only Active, NA Pending, hidden Expired | View role-based display |
| BR-CC-41..50 | Various OPEN questions (Packaging/Billing scope, tie-breakers, refunds, etc.) | Future drift |

**BR-AM-* (4 rules)** — wallet impact cross-refs:
- BR-AM-22 — Activation deducts + tags contract ID
- BR-AM-35 — Contract value flows into Master on Active
- BR-AM-36 — Every action tagged with contract ID
- BR-AM-37 — Deductions nearest-expiring first

### 4.7 `testing-charging` — 6 BR rules

Verifies real charging behavior. Surfaces a subset of BR-CC-* for testing.

**BR-CC-* (5 rules)**:
- BR-CC-22 — Cost matrix (verifies Application × CommChannel × Priority × Destination → SAR cost)
- BR-CC-23 — WhatsApp priorities
- BR-CC-24 — Voice priorities
- BR-CC-25 — AI no Priority Destination=Global
- BR-CC-32 — Send Transaction cascade (the core thing the testing lab triggers)

**BR-AM-* (1 rule)**:
- BR-AM-23 — Renewal flow [INFERRED — tests renewal indirectly via batch creation]

## 5. Cross-field business rules — the "Service Visibility ↔ Pricing" pattern

The canonical example of a cross-field BR rule is BR-AM-15 (Visibility=Show → Pricing mandatory), surfaced in [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/07-VALIDATIONS.md`:

```typescript
// Canonical Reactive Forms wiring per V-service-visibility-pricing-required
visibility.valueChanges.subscribe(v => {
  if (v === true) { // 'Show'
    priceType.setValidators([Validators.required]);
    priceValue.setValidators([Validators.required, Validators.min(0)]);
  } else {
    priceType.clearValidators();
    priceValue.clearValidators();
    priceType.reset();
    priceValue.reset();
  }
  priceType.updateValueAndValidity();
  priceValue.updateValueAndValidity();
});
```

### Backend mirror — handler-level codes

| Error code | Trigger | HTTP |
|---|---|---|
| `HiddenProductMustNotHavePricing` | Pricing supplied while Visibility=Hide | 422 |
| `PriceValueNotConfigured` | Visibility=Show without `PriceValue` | 422 |
| `PricingTypeNotConfigured` | Visibility=Show without `PriceType` | 422 |

### Why this is BR-* and not V-rule

[INFERRED] **A V-rule is a per-field invariant**: "Username must start with a letter." That's testable in isolation by `Validators.pattern(/^[a-zA-Z]/)`.

**A BR-* cross-field rule binds two or more fields**: "if `visibility === Show`, then `priceType` AND `priceValue` are required." This requires reactive wiring — when one field changes, others' validators must change. The Reactive Forms idiom above shows the wiring explicitly.

The 7-feature matrix shows this same pattern recurs:
- `comms-hub` — same Visibility ↔ Pricing (BR-AM-15) on per-row edit
- `marketplace-applications` — same Visibility ↔ Pricing on per-row edit
- `organization-hierarchy` — same in Step 3 + Step 4 of Add Client
- `wallet-balance-management` — `BalanceType` ↔ `WalletType` coupling (BR-AM-25/26 — 4 valid combinations)
- `contracts-cost-management` — `Status` ↔ editable-field-set (BR-CC-15/16 — Pending unlocks all; Active/Expired locks Name/Value/Start)

## 6. Status-aware business rules — how enums drive BR branching

Several BR rules are **status-aware** — the rule's behavior changes based on a status enum value. This is the second major BR pattern after cross-field coupling.

### 6.1 `eContractStatus` drives BR-CC-15/16

[BRAIN-OUT] From PRD-03 BUSINESS_RULES.md:

```
status = Pending  → BR-CC-15 applies → editable = Name, Farabi, Start, Expiration, Value, Rate Card, Details, Addons
status = Active   → BR-CC-16 applies → editable = Farabi, Expiration, Rate Card price, Details, Addons (LOCKED: Name, Value, Start)
status = Expired  → BR-CC-16 applies → SAME locks as Active
```

[INFERRED] Frontend implementation: each `contract` row carries a `canEdit` boolean + a per-field "is this locked" flag computed by `canEditContractStatus(status)` and `hasRestrictedContractCommercialFields(status)` ([CODE] `contracts-cost-management/models.ts:579-585`). The backend also computes `currentContract.canEdit` as the master gate. Both layers must pass.

### 6.2 Other status-aware BR rules

| Status enum | BR rules it branches | Feature |
|---|---|---|
| `eCommChannelStatus` (Inactive/Paid/Active/Expired/Disabled) | BR-AM-20..24 — different transition rules per state | comms-hub, marketplace-applications |
| `eUserStatus` (Pending/Active/Suspended/Locked/Deleted) | BR-UM-06..10 — transition allow-list; BR-UM-09 enforces Normal-User-limit on Pending→Active | organization-hierarchy (Add User + Edit User) |
| `eContactGroupStatus` (`In Progress` / `Completed`) | BR-CGM-29 + OPEN BR-CGM-34 (`Failed`) | contact-groups |
| `walletStrategy === null` | Soft-eligibility gate — disables Add Contract button + warns | contracts-cost-management |

### 6.3 Generic pattern — status-aware UI rendering

[INFERRED] The recurring frontend idiom for status-aware BR enforcement:

```typescript
// Pseudo-pattern
get canEditField(): boolean {
  return this.canEditContract                              // backend canEdit (master)
      && !this.hasRestrictedContractCommercialFields(status) // BR-CC-16 (locks)
      && this.canEditPriceValue;                           // PES flag
}
```

The 3 layers (backend master + BR status logic + PES) all AND together. Removing any one breaks defense-in-depth.

## 7. Open BR rules — drift watch

[BRAIN-OUT] 29 of the 180 BR rules are tagged `[OPEN]` in the PRD — silent or ambiguous areas. Porter / implementer should flag these as known-unknowns rather than guess:

| Cluster | OPEN count | Key examples |
|---|---|---|
| BR-AM | 4 | BR-AM-39 (over-limit enforcement), BR-AM-40 (visibility Show→Hide mid-life), BR-AM-41 (BalanceType / WalletType change mid-life), BR-AM-42 (deleted user's balance fate) |
| BR-UM | 6 | BR-UM-45 (manual Lock notification), BR-UM-46 (Delete→Active restore password), BR-UM-47 (idle logout enforcement layer), BR-UM-50 (change-password invalidate other sessions) |
| BR-CC | 10 | BR-CC-41 (Packaging/Billing scope), BR-CC-42 (tie-breaker on equal expiration), BR-CC-44 (Tax/VAT), BR-CC-47 (retroactive Expired→Active charges) |
| BR-CGM | 9 | BR-CGM-30 (max upload size default), BR-CGM-34 (Failed status), BR-CGM-36 (creator account Deleted → group fate) |

### Where to capture answers

When the team resolves an OPEN BR rule, the answer goes in:
1. PRD update — `Brain Outputs/prd/modules/<module>/BUSINESS_RULES.md` (flip [OPEN] → [CONFIRMED])
2. Vault question note — `falcon-wiki/80-Questions/Q-<module>-<id>.md`
3. (If the rule has a frontend surface) — Add/update V-rule under `Brain Outputs/understanding/<page>/<flow>/`

## 8. See also

- [[../04-feature-parity-matrix/MATRIX]] — the 7 features by Falcon vs Client split
- [[../05-capability-maps/_INDEX]] — per-role action enumeration
- [[../10-non-pes-gates-by-feature/MATRIX]] — the OTHER gating axis (session-type, node-type, mode, tab-visibility, server-driven rows)
- [[../00-VERIFICATION-GATE]] — 10 questions the dataset must answer
- [[../00-INDEX]] — dataset entry point

## 9. Source citations

- [BRAIN-OUT] `Brain Outputs/prd/modules/01-account-management/BUSINESS_RULES.md` (BR-AM-01..42)
- [BRAIN-OUT] `Brain Outputs/prd/modules/02-user-management/BUSINESS_RULES.md` (BR-UM-01..50)
- [BRAIN-OUT] `Brain Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md` (BR-CC-01..50)
- [BRAIN-OUT] `Brain Outputs/prd/modules/04-contact-group-management/BUSINESS_RULES.md` (BR-CGM-01..38)
- [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/07-VALIDATIONS.md` (cross-field rule reference)
- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/04-feature-parity-matrix/MATRIX.md` (the 7-feature columns)
