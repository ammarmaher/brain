---
name: Vol 44 — Supporting Artifacts Research (BRD truth tautologies)
description: 35+ BRD-extracted truth tautologies across wallet, multi-contract, user-status, template-tab matrix, CG permissions, marketplace, destination ID — canonical refinement of Vols 28/31/38 and BR-CC-31
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
# Vol 44 — Supporting Artifacts Research — 2026-05-18

**Status:** 🟢 LANDED 2026-05-18 (continuous mining wave).

## What landed

- `Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-44-SUPPORTING-ARTIFACTS-RESEARCH.md` — long-form Atlas volume (13 §sections, 35+ tautologies)
- `Brain SK/_obsidian/67-Business-Rules/VOL-44-TRUTH-TAUTOLOGIES.md` — atomic indexed tautology list
- `Brain SK/_obsidian/10-Pages/Vol 44 — Supporting Artifacts Research.md` — graph node
- `Brain SK/_obsidian/00-Home/ATLAS_MASTER_INDEX.md` — Vol 44 row added + use-case router expanded
- `Brain SK/_obsidian/BUSINESS_INDEX.md` — Vol 44 entry
- `Brain SK/_obsidian/67-Business-Rules/README.md` — 46-tautology count added
- 6 × `Brain SK/_obsidian/15-PRD/*.md` (all module notes) — Vol 44 cross-ref appended
- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-28.md` — §V28-M5-SUPPLEMENT appended (defers to Vol 44 §1)
- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-36-MODULE-03-CONCLUSION.md` — §VOL44-CROSS-REF appended (BR-CC-31 refined wording)
- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-INDEX.md` — Vol 44 entry added

## Source files mined (13 BRD spreadsheets/docs)

All under `C:\Falcon\PRD\BRDs\_extracted\` — PowerShell System.IO.Compression ZIP-extracted from operator's BRD bundle dated 2026-05-17:
- Wallets-Balance-Flow.txt (Sheet 3 lines 2037-2092 = CANONICAL wallet SoT)
- Multiple-Contracts-Deduction.txt (worked example for cross-contract pricing)
- Users-Statuses-Others.txt (5 statuses + transition graph + Can-Login matrix)
- WA-Templates-Existing-Actions.txt (Templates / Pending Review / Shared Templates × 4 user types × 6 statuses × 2 hierarchy axes)
- Contact-Group-Permissions.txt (Falcon staff CANNOT mutate CGs)
- Account-Setting-Others.txt (CommChannel/App stuck-state actions)
- Acc-CommChannels-Marketplace-MenuItems.txt (Falcon view vs Client view dual-page sync)
- Destination-Identification.txt (Falcon's 7-step identification flow)
- Research-Phone-Number-V3.txt (ITU E.164 / E.129 + KSA fixed/mobile NDC reference)
- International-Phone-Destinations.txt (NANP + Zone 9 + Kazakhstan)
- Dina-International-Destinations.txt (Russia + Kazakhstan mobile NDCs)
- Account-User-Stories.txt + Multi-Contract-Balance-Actions.txt + Contract-User-Stories.txt (cross-validation)

## Key new truth tautologies

| Family | Count | Lead finding |
|---|---|---|
| W-TT (Wallet) | 8 | Falcon User exclusively can transfer MW ↔ CommChnl wallet (Multi-Wallet mode) |
| MC-TT (Multi-Contract) | 6 | Cross-contract pricing: each portion priced at own contract's rate — NOT blended |
| US-TT (User Status) | 5 | Locked → Pending (not Active); only Active can use Forget-Password |
| TM-TT (Template Tab) | 8 | NU has MORE template-edit power on his own node than NA/AO (unconstrained); NA/AO restricted to own-created |
| CG-TT (Contact Group) | 5 | Falcon staff CANNOT Create/Edit/Share/Delete a CG — View+Download only |
| CC-TT (CommChnl/App) | 3 | Only 2 stuck-state recovery actions: Do Payment (→Active) or Disable (→Disabled) |
| MP-TT (Marketplace) | 5 | Visibility flag = Falcon-controlled commercial gate; pricing edits Falcon-only |
| DI-TT (Destination ID) | 6 | KSA mobile = 2-digit NDC (50-59); MVNO sub-allocation needs first-SN-digit lookup |

## BR-CC-31 canonical wording (refined)

Walk active contracts in nearest-expiry order. For each contract, attempt full transaction at THAT contract's per-action rate. If only fraction `f` is fundable, consume `f` worth and continue at next contract for the `(1-f)` remainder. If exhausted before satisfied → abort. **No blending, no averaging.**

## 7 New open questions

Q-UM-19 (counted in user limit per-status) · Q-CC-12 (WA rates on Contract vs Plan) · Q-AM-17 (Visibility scope) · Q-AM-18 (price-change back-out) · Q-DI-01 (NANP LERG) · Q-DI-02 (MVNO sub-allocation storage) · Q-TM-V4-15 (Rejected-final state ownership)

## Trigger phrases

- `vol 44 truth tautologies` / `BRD truth tautologies` / `truth tautology lookup`
- `wallet canonical rules` / `wallet SoT` / `who can do what wallet`
- `multi-contract cross-pricing` / `cross-contract deduction math`
- `template tab matrix` / `template who can edit`
- `contact group permissions canonical` / `CG creator-only`
- `destination identification truth` / `KSA NDC table` / `NANP fixed vs mobile`
- `marketplace Falcon view vs Client view`
- `BR-CC-31 refined`

## Why this matters

Closes the "supporting artifacts" gap left after Vol 43. Every BRD spreadsheet that the operator put into the bundle has now been mined for canonical content. Tautologies are sourced verbatim — they are operator-confirmed, not Claude-inferred. Future sessions answering "can X do Y when Z?" should defer to Vol 44 over older Atlas volumes on any conflict.
