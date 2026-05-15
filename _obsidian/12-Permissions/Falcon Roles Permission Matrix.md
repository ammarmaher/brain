*** Permission Matrix — Falcon Roles (System Administrator · Operation · Products) ***
*** SoT: Brain Outputs/prd/modules/02-user-management/understanding.md (Permission rules) + attachments.md ***
*** Created 2026-05-15 by Brain SK Phase 2B permission-matrix install ***

# Falcon Roles Permission Matrix

> The Google Sheet **`Permission list - Jawad`** is the **authoritative source** for which Falcon role (System Administrator, Operation, Products) can perform which action on which page/tab/menu-item across **Organization Hierarchy**, **CommChannels & Services**, **Apps & Services**, and **Settings**. PRD-02 prose is **secondary** — when prose and sheet disagree, the sheet wins. The sheet uses 4 cell values: `Allow`, `Not Allow`, `Deny`, and `Can be overridden by Deny`.

## Source-of-truth pointer

- **Captured matrix prose:** [`understanding.md` — Permission rules section](../../../Brain%20Outputs/prd/modules/02-user-management/understanding.md)
- **Sheet manifest:** [`attachments.md` — Permission list - Jawad](../../../Brain%20Outputs/prd/modules/02-user-management/attachments.md)
- **PRD body context:** [`latest-prd.md`](../../../Brain%20Outputs/prd/modules/02-user-management/latest-prd.md)
- **Original Drive sheet name:** `Permission list - Jawad` (Google Sheet) — 15 KB, 180 rows captured, modified 2026-04-20
- **Drive folder:** `https://drive.google.com/drive/folders/1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH`

## Sheet shape

| Column | Meaning |
|---|---|
| `Menu Item` | Top-level admin nav item (e.g. Organization Hierarchy, Settings) |
| `Page Tab` | Tab within the menu item (e.g. Hierarchy, CommChannels & Services, Apps & Services, Settings) |
| `Function/Action` | A single UI affordance (e.g. `View <X>`, `Edit <X>`, `Add Client`, `Do Payment`) |
| `System Administrator` | Cell value for SA role |
| `Operation` | Cell value for Operation role |
| `Products` | Cell value for Products role |
| ... (additional columns may exist in Tab 2 — not captured) |

**Cell vocabulary:** `Allow` · `Not Allow` · `Deny` · `Can be overridden by Deny`.

## Captured matrix (prose summary — Tab 1 only)

The CSV export of the sheet returned the first tab as 180 rows. The PRD prose distills it into role-shape summaries; the raw 180-row CSV was not preserved as a separate file. The captured shape:

| Role | Captured behaviour |
|---|---|
| **System Administrator** | Virtually all cells → `Allow`. Effectively the super-user role across all 4 page tabs (Hierarchy, CommChannels & Services, Apps & Services, Settings). |
| **Operation** | `Not Allow` for: `Add Client` · `Edit Price Type/Value` · `Do Payment` · `Edit Password Security Level on Root/Main` · `Edit Account Limitations` · `Edit Account basic/official information`. Other actions inherit `Allow`. Operation is the "view-and-light-edit" role. |
| **Products** | Similar breadth to System Administrator **except**: cannot edit Root-node security level · cannot edit Allowed IPs on Root · cannot edit Sub-node password security. Otherwise broadly `Allow`. |

Source: [`understanding.md` § Permission rules](../../../Brain%20Outputs/prd/modules/02-user-management/understanding.md) lines 52–63 + [`attachments.md` § Permission list - Jawad](../../../Brain%20Outputs/prd/modules/02-user-management/attachments.md).

## Known gap — Tab 2 not captured

The original `Permission list - Jawad` sheet has **two tabs**. The CSV export tool used during the 2026-04-24 PRD sync only returned the first tab. The PRD body explicitly references "sheet 1" and "sheet 2" — meaning Tab 2 carries additional rules (likely covering deeper Settings sub-tabs, advanced operations, or per-product gates) that are **not yet captured in Brain SK**.

- **Gap pointer:** `Q-UM-07` (see [`QUESTIONS.md`](../../../Brain%20Outputs/prd/modules/02-user-management/QUESTIONS.md))
- **Capture status:** Tab 1 ✅ (prose), Tab 1 raw rows ⚠️ (not preserved as separate CSV), Tab 2 ❌
- **Remediation:** Re-export the sheet with a multi-tab strategy on the next `take latest from PRD` run; preserve raw rows as `permission-list-jawad-tab1.csv` and `…-tab2.csv` under the module folder.
- **Until then:** Treat the captured prose summary above as a **partial** view of role gating. For ambiguous cases, **read the live Drive sheet directly** rather than trusting this note.

## Backend enforcement

| Service | Role |
|---|---|
| [[Access PES Service]] | **The decision point.** Every gated action calls PES (`Evaluate(AuthRequest) → AuthResponse` or `Advise(AuthRequest)`); PES owns the policy rules built from this sheet. |
| [[Identity Service]] | Owns the user → role binding (`User.role` and `User.permissionGroupId`). PES asks Identity which role a user holds, then evaluates the rule. |

The sheet is **read by PES at startup / on policy-refresh**; live enforcement is then in-memory. UI surfaces consume PES decisions to toggle button visibility, view-only modes, etc.

## PRDs that cite this matrix

- [[02 User Management]] — Owns the sheet (it's a companion attachment of PRD-02). Permission rules section.
- [[01 Account Management]] — Many actions in the sheet (Edit Account Limitations, Edit Price Type, Do Payment, Edit Password Security Level) are Account Management surfaces — that PRD's business rules **depend on** this matrix.

## Pages gated by this matrix

- [[Organization Hierarchy]] — **Hierarchy tab**, **CommChannels & Services tab**, **Apps & Services tab**, **Settings tab** — every action on every tab is sheet-driven.
- Add Client wizard (gated by `Add Client` → `Allow` only for System Administrator + Products).
- Edit Account flows (Limitations, Password Security Level, Basic/Official Info).
- Do Payment flow (Wallets & Balance Management surface).

## Validation tie-in

Permission decisions intersect with validation: if a role lacks `Allow` for an action, the corresponding form/dialog must not render, and the API endpoint must reject the call. The PES decision is the gate; validation rules govern what's accepted once gated.

## Hubs

- [[AMMAR_BRAIN_HOME]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[BUSINESS_INDEX]] · [[VALIDATION_INDEX]]
