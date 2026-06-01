---
type: atomic-note
cluster: 67-business-rules
source: "[BRAIN-OUT] Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-44-SUPPORTING-ARTIFACTS-RESEARCH.md"
created: 2026-05-18
status: canonical
truth-prefix: "[BRD-EXTRACTED]"
tags:
  - business-rules
  - truth-tautologies
  - wallet
  - templates
  - contact-groups
  - destinations
  - night-shift-vol44
---

# Vol 44 — Truth Tautologies (Atomic Index)

> Every `*-TT-*` tautology in [Vol 44](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-44-SUPPORTING-ARTIFACTS-RESEARCH.md) is direct verbatim restatement of BRD spreadsheet cells extracted 2026-05-17.

## Wallet Truth (Vol 44 §1)

- **W-TT-01** — Normal User cannot transfer balance — only deduct on send.
- **W-TT-02** — Node Admin's transfer authority is bounded by **his sub-hierarchy**, not the whole account.
- **W-TT-03** — Account Owner is the only **client** actor allowed to transfer to/from the Master Wallet.
- **W-TT-04** — Falcon User can transfer Master ↔ CommChnl wallet (Multi-Wallet only) — a power AO does NOT have.
- **W-TT-05** — Nearest-expiry FIFO is universal across MW, Addons, and CommChnl wallets.
- **W-TT-06** — Atomicity: total available < Needed Amount → abort (no partial debit).
- **W-TT-07** — Addons take priority over MW for SubServices; reverse for CommChannel/App purchases.
- **W-TT-08** — System (not any human) performs contract-expiration deductions.

## Multi-Contract Cross-Pricing (Vol 44 §2)

- **MC-TT-01** — Per-action rate is **contract-specific** (e.g., C#1 WA-Mark = 1.5 SAR, C#2 WA-Mark = 0.75 SAR).
- **MC-TT-02** — When transaction spans two contracts, each portion priced at **its own contract's rate** — never blended or averaged.
- **MC-TT-03** — Fractional consumption of a message across contracts is supported.
- **MC-TT-04** — Master Wallet stores **per-contract balances** — not a single SAR pot.
- **MC-TT-05** — Transferring MW → CommChnl wallet preserves contract identity (C#1 remains C#1).
- **MC-TT-06** — Addons RC has its own per-contract `Activation` + `Expired` dates.

### BR-CC-31 refined wording
> Walk contracts in nearest-expiry order. For each contract, try to consume the full transaction at THAT contract's per-action rate. If fraction `f` only is fundable, consume `f` worth and continue at the next contract for the remaining `(1-f)`. If exhausted before satisfied → **abort**.

## User Status (Vol 44 §3)

- **US-TT-01** — Pending users can log in but cannot reset password.
- **US-TT-02** — Locked → **Pending** (not Active) on recovery.
- **US-TT-03** — Suspended ↔ Active is the ONLY reversible pair.
- **US-TT-04** — Only **Active** users can use Forget Password.
- **US-TT-05** — Active has 3 terminal transitions (Suspended/Deleted/Locked); others have ≤1.

## Template Tab Matrix (Vol 44 §4)

- **TM-TT-01** — On his own node, a Normal User has more template-edit power than NA/AO (Edit + Delete on rejected-internally templates).
- **TM-TT-02** — NA/AO can only Edit/Delete templates **they personally created**; NU can edit/delete any on his node.
- **TM-TT-03** — Falcon User has **zero** access on the Templates tab "His Node" view — only sub-node visibility.
- **TM-TT-04** — Falcon User is the **only** actor with access to the **Deleted** column (audit retention).
- **TM-TT-05** — "Rejected internally" is the **only** status where Edit is allowed (maker/checker loop-back).
- **TM-TT-06** — Restricted templates (Meta-paused) are READ-ONLY everywhere.
- **TM-TT-07** — Shared Templates tab is **NU-only on His Node**; nothing else has any access.
- **TM-TT-08** — Pending Review tab is **per-hierarchy-level** — never shows sub-node items.

## Contact Group Permissions (Vol 44 §5)

- **CG-TT-01** — Falcon staff **cannot mutate** Contact Groups — View + Download only.
- **CG-TT-02** — Creator-only Edit and Delete (any client role).
- **CG-TT-03** — Create + View + Download are universal across client roles.
- **CG-TT-04** — Share has a hierarchy: NU can only share own-created; AO/NA can share any.
- **CG-TT-05** — Download Original Uploaded File always pairs with Download CG.

## CommChannel/App Stuck-State Actions (Vol 44 §6)

- **CC-TT-01** — Only two terminal actions for stuck states: Do Payment (→ Active) or Disable (→ Disabled).
- **CC-TT-02** — Grace-end is not total loss — `Do Payment` recovers; `Disable` is later recoverable via `Enable`.
- **CC-TT-03** — Cause of stuck-state matters for telemetry, not for UX (same action set across all causes).

## Marketplace Falcon vs Client (Vol 44 §7)

- **MP-TT-01** — Marketplace menus and Org Hierarchy tabs are **bidirectionally synced views** of one store.
- **MP-TT-02** — Visibility flag is Falcon-controlled; clients cannot see non-Visible items.
- **MP-TT-03** — Pricing Type/Value editable **only by Falcon staff**; clients only pay.
- **MP-TT-04** — Scheduled price change = New Type + New Value + Effective Date triplet.
- **MP-TT-05** — Inactive (First Time) ≠ Inactive — only the former applies pricing immediately.

## Destination Identification (Vol 44 §8)

- **DI-TT-01** — Falcon needs CC × NDC × Operator × Provider × Length tables populated for every supported country.
- **DI-TT-02** — NANP (CC=1) **cannot be subdivided** fixed-vs-mobile by NDC alone (shared geographic codes).
- **DI-TT-03** — KSA mobile = **2-digit NDC** (50–59); leading '5' alone is insufficient.
- **DI-TT-04** — MVNO sub-allocation (Virgin/Lebara/Red Bull under NDC 57) requires inspecting **first digit of SN**.
- **DI-TT-05** — Universal phone length: min 7, max 15 digits (E.164).
- **DI-TT-06** — Service phone numbers (premium/toll-free/short codes) are **excluded** from current scope.

## Universal Recovery Tautology (Vol 44 §9)

Every Falcon entity has **exactly one explicit recovery action OR explicit closure action** — no implicit re-activation by passage of time. The system is deterministic and operator-led.

## See also

- [[03 Contract Packaging Charging Billing]] — wallet + multi-contract canonical reference
- [[05 Templates]] — template tab matrix canonical reference
- [[04 Contact Group Management]] — CG permission matrix canonical reference
- [[01 Account Management]] — marketplace + stuck-state action canonical reference
- [[02 User Management]] — user status truth canonical reference
- [[ATLAS_MASTER_INDEX]] — entry point to all 44 volumes
- [[Vol 44 — Supporting Artifacts Research]] (graph node) — TBD
