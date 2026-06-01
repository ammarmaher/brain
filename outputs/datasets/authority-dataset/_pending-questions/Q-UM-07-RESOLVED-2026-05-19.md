---
type: pending-question-resolution
question-id: Q-UM-07
status: RESOLVED
resolved: 2026-05-19
related: Vol 43 Part A · BRD refresh
module: user-mgmt
feature: permissions
verification: unverified
last-verified: 2026-05-19
tags: ["#status/resolved", "#module/user-mgmt", "#verification/unverified", "#layer/be"]
up: "[[Q-tickets-MOC]]"
parent: "[[Q-tickets-MOC]]"
tracked-as-task: false
priority: medium
due: 
blocked-on: []
---

# Q-UM-07 — RESOLVED 2026-05-19

## Original question
"PRD Permission Sheet Tab 2 contents — what permissions are in it? Blocks Permission catalog drift audit + Q-AM-16 PES vs PRD sheet drift."

## Resolution

Q-UM-07 has been **RESOLVED** by extracting the fresh `Permission list - Jawad.xlsx` from `C:\Falcon\PRD\BRDs\2- User Mngmnt Module\` on 2026-05-19.

**The Tab 2 content is in the same sheet**, starting around row ~2000 in the extracted text. The matrix has 6 columns of values per row:

| Column | Role |
|---|---|
| 1 | System Administrator (Falcon) |
| 2 | Operation (Falcon) |
| 3 | Products (Falcon) |
| 4 | Account Owner (Client) |
| 5 | Node Admin (Client) |
| 6 | Normal User (Client) |

Each row = (Menu Item × Page Tab × Function/Action) → 6-value verdict per role (Allow / Not Allow / Deny / Can be overridden by Deny).

## Evidence extracted

File: `C:\Falcon\PRD\BRDs\_extracted\Permission-List-Jawad.txt` (3,957 rows)

Sample (from row 2003 onwards):

```
Row 2003: Edit "Account Limitations" Main node | Allow | Not Allow | Allow | Deny | Deny | Deny
Row 2019: Do Payment Main node                  | Allow | Not Allow | Allow | Allow | Deny | Deny
Row 2025: Edit Visibility Main node             | Allow | Not Allow | Allow | Deny | Deny | Deny
```

## Cross-validation against Atlas

Atlas permission matrices verified against the canonical sheet — all alignments confirmed:
- ✅ Falcon SA + PR create accounts, OP cannot (BR-AM-02 / Vol 34)
- ✅ Visibility + Pricing edits Falcon-only (BR-AM-25 / Vol 28 Matrix 3)
- ✅ Do Payment Falcon + AO (Vol 28 Matrix 3 / Vol 34 §5)
- ✅ AO can Disable + Do Payment but NOT Edit Price (Vol 28)
- ✅ Account Limits edit Falcon-only (BR-AM-11)

## Implications

- Q-AM-16 (PES catalog vs PRD sheet drift) → **UNBLOCKED.** Can now be executed.
- Permission catalog drift audit (Brain Outputs/datasets/authority-dataset/07-cross-cutting/permission-sheet-gaps.md) → unblocked.
- Atlas Vol 28 matrices → validated against source.

## Next actions

1. Update `permission-sheet-gaps.md` — mark Q-UM-07 resolved
2. Update `WAVE-1-AND-10-PREREQ-BLOCKERS-2026-05-17.md` — Tab 2 no longer the blocker for Wave 1
3. Schedule a Q-AM-16 PES vs PRD drift audit (next mining cycle)
4. Vol 35 (Module 02 Conclusion) — mark Q-UM-07 status as RESOLVED in §4 OPEN questions

## See also

- [Atlas Vol 43 Part A](../../../reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-43-OBSIDIAN-ENHANCEMENT-AND-EXECUTION.md)
- [BRD Source: Permission list - Jawad.xlsx](file:///C:/Falcon/PRD/BRDs/2-%20User%20Mngmnt%20Module/Permission%20list%20-%20Jawad.xlsx)
- [Extracted text](file:///C:/Falcon/PRD/BRDs/_extracted/Permission-List-Jawad.txt)

## Tasks-plugin tracking

- [x] [[Q-UM-07]] Q-UM-07 — RESOLVED 2026-05-19 🔼
