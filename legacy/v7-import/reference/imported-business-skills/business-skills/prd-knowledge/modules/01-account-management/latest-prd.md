# Latest PRD — Account Management

| Field | Value |
|---|---|
| Drive folder | `1- Account Mngmnt Module` |
| Selected PRD file | `Account Management Module VB4` |
| Detected version | `VB4` → numeric 4 |
| Mime type | Google Doc |
| Sync date | 2026-04-24 |
| Selection reason | Explicit `VB4`; higher than VB3, VB2, VB1 numeric. |

## Ignored duplicates

- `Account Management Module VB3` — VB3 → 3.
- `Account Management Module VB2` — VB2 → 2 (stored as .docx Word file).
- `Account Management Module VB1` — VB1 → 1 (stored as .docx Word file).

Related-but-separate supporting PRD series `Acc - Wallet & Balance Mng VB1..VB4` is tracked in `attachments.md`; VB4 is the active supporting document.

## Summary

Owns the concept of Accounts and the Falcon Hierarchy (Root → Main → SubNodes). Defines account creation (5 steps), account settings (password security, allowed IPs, limits), commchannel / application configuration (visibility, pricing, dates, status), and wallet & balance management (balance type × wallet type matrix, master / comm / user / node wallets, transfer rules, status transitions with grace periods).

## Main requirements

### Hierarchy
- **Root node** — Falcon itself; no parent.
- **Main node / Client / Account** — direct child of Root; represents a single client.
- **Sub-node** — any node below Main; represents client-internal structure (multi-level).

### Create Account (5 steps — Falcon usertype only)

**Step 1 — Account Information** (mandatory)
- Account Name (unique, ≤30, starts with letter, mandatory).
- Account ID (auto, mandatory).
- Finance ID (from Finance team, mandatory).
- Classification Category (dropdown: VIP / Critical / Normal, optional).
- Classification Sub-category (Bank / Gov / SemiGov / Large / Medium / SME, optional).
- Profile Picture (optional).
- Account Official Data (optional): Entity Name, Authority Letter Type (Government / Commercial / Charity — each has 2 linked fields Sector + ID), Country, City, District, Street, Building Number, Postal Code, Additional Address, Another ID, VAT registration number.

**Step 2 — Account Settings** (mandatory)
- Password Security Level: Normal / Advanced.
- Network Access (Allowed IPs): header-parameter-based enforcement. Reject requests without the agreed header, without a value, or with an IP not on the list.
- Account Limits: Max Normal User Limit, Max System User Limit, Max Node Levels, Balance Transfer Limit (%). All accept 0 = no limit; empty not allowed; default 0.

**Step 3 — Configuring Commchannels / Services** (optional during creation)
Per commchannel: Name, Visibility (toggle, default Hide), Pricing Type (Monthly / Yearly / One Time Payment — mandatory if Visibility = Show), Price Value in SAR (≥0, mandatory if Show). Status set post-creation.

**Step 4 — Configuring Applications** (optional during creation)
Same shape as Step 3, applied to Applications & Services.

**Step 5 — Creating Account Owner user** (mandatory)
Creates the client-side AO user per the User Management module.

### Commchannel / Application Statuses

- **InActive (First time)** — never activated; no First Activation Date.
- **Paid** — paid, not yet active.
- **Active** — paid, renewal date in future.
- **Expired** — renewal date reached but master wallet insufficient; grace period: 7 days (Monthly), 30 days (Yearly / One Time Payment).
- **InActive (Grace Period Ends)** — grace expired without payment.
- **Disabled** — manually disabled.

### Wallet & Balance Management (see `Acc - Wallet & Balance Mng VB4`)

**Balance Type** (Falcon-configured)
- User-based — balance assigned to individual users.
- Node-based — balance assigned to nodes; Normal User and Node Admin can hold balances; only Normal User can consume in transactions.

**Wallet Type** (Falcon-configured)
- Single Wallet — one wallet per user/node, all commchannels share it.
- Multiple Wallets — one wallet per commchannel per user/node.

**Resulting 2×2 matrix of account configurations:**
1. User-based + Single
2. User-based + Multiple
3. Node-based + Single
4. Node-based + Multiple

**Wallet layers**
- **Master Wallet** — holds SAR balance, sum of active contract values; accessible by Falcon usertype (and AO in some cases).
- **Comm Wallet** — per-commchannel wallet when Multiple-wallet. Populated by Falcon-usertype-only transfers from Master.
- **User / Node Wallet** — single wallet if Single-wallet; per-commchannel sub-wallets if Multiple-wallet.

**Transfer rules (summary)**
- Master ↔ Comm Wallet — Falcon usertype only.
- Comm Wallet ↔ User/Node commchnl wallet — Falcon usertype + Account Owner.
- User/Node wallet ↔ User/Node wallet — Falcon usertype + Account Owner + Node Admin.
- In Single-wallet: Master ↔ User/Node — Falcon + AO.
- Transfer amount capped by `Balance Transfer Limit (%)` from Account Limits (excluding Master Wallet as source).

### Contract interplay (see `03-contract-packaging-charging-billing-management`)

- Contract value flows into Master Wallet on activation.
- Deduction, Purchase, Transfer all tagged with originating contract ID.
- Nearest-expiring-first deduction across Active contracts.
- Contract expiration: wallet records retained but subtracted from all lump-sum values.

## Validations (partial — deeper pass needed)

- Account Name: unique, ≤30 chars, starts with letter, not null.
- Account Limits: non-empty, 0 = no limit.
- Password Security Level: Normal / Advanced only.
- Allowed IPs: header-parameter name is a system config; requests without it → reject.
- Pricing Type mandatory when Visibility = Show.

## Open questions (extensive — full PRD not fully scanned)

- Full commchannel/application status flow (transitions between Paid / Active / Expired / InActive / Disabled) — head captured, full transition rules deferred.
- Wallet type × balance type × action matrix — 4 scenarios × multiple actions; only introduction captured.
- Balance transfer specific flows per scenario — 4 × multiple actions; deferred.
- Addon purchasing workflow from Account perspective — cross-references Contract module.
- Renewal process for commchannels / applications — referenced repeatedly, not fully spelled out yet.
- Edit Account flow (which fields are mutable, who can edit, per-status restrictions).
- Delete / Deactivate Account workflow.
- First-time Account activation flow after creation (when does Status transition from InActive).
- Tax (VAT) handling on price values.
- Currency — PRD uses SAR; multi-currency not discussed.
- "System User" concept mentioned in limits (Max System User Limit) but not defined in captured section.
- Classification list source — hardcoded or configurable via DB?
- Does the Finance ID need to round-trip to the finance system at creation time, or just be stored?
