---
type: cluster-index
cluster: 67-business-rules
status: "STUB — created 2026-05-19 to close pre-existing broken wikilinks"
maintained-by: Vol 43 enhancement run
---

# 67 — Business Rules Index

> Stub MOC — closes broken wikilink targets. Bridges to the BR-* rules per module.

## Status

🟡 **STUB**

## Purpose

Cross-module index of BR-* business rules.

## Counts (post BRD refresh 2026-05-19)

| Module | BR prefix | Confirmed | Open | Total |
|---|---|---|---|---|
| 01 Account Management | BR-AM-* | 38 | 4 | 42 |
| 02 User Management | BR-UM-* | 44 | 6 | 50 |
| 03 Contract & Cost | BR-CC-* | 40 | 10 | 50 |
| 04 Contact Group | BR-CGM-* | 29 | 9 | 38 |
| 05 Templates | BR-TM-* | 65 (V4 added 29) | 12 | 77 |
| 06 BSA | BR-BSA-* | 40 | 9 (future) | 49 |
| **Total** | | **256** | **50** | **306** |

## Source

- Per-module `Brain Outputs/prd/modules/<n>/BUSINESS_RULES.md`
- Atlas Vol 34-38, 40-41 (per-module conclusions §4)
- Atlas Vol 42 (BRD Refresh — new BR-TM-42..70 + BR-BSA-01..49)

## See also

- [[BUSINESS_INDEX]]
- [[ATLAS_MASTER_INDEX]]

## Tags

#type/cluster-index #status/stub #business-rules


---

## Vol 44 augmentation (2026-05-18)

[[VOL-44-TRUTH-TAUTOLOGIES]] adds **35+ BRD-extracted truth tautologies** that refine or supersede existing module BRs:

| Tautology family | Refines | New count |
|---|---|---|
| W-TT-01..08 | BR-CC wallet rules | +8 |
| MC-TT-01..06 | BR-CC-31 multi-contract | +6 (+1 refined wording) |
| US-TT-01..05 | BR-UM user status | +5 |
| TM-TT-01..08 | BR-TM template tab matrix | +8 |
| CG-TT-01..05 | BR-CGM contact group permissions | +5 |
| CC-TT-01..03 | BR-AM stuck-state actions | +3 |
| MP-TT-01..05 | BR-AM marketplace + scheduled change | +5 |
| DI-TT-01..06 | BR-DI destination identification | +6 (new family) |

Total: **46 new tautologies** sourced from BRD spreadsheets extracted 2026-05-17.

