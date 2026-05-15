# Page Scorecard — Organization Hierarchy

**Last updated:** 2026-05-15 — **POST-ROUND-5 USER REJECTION (CORRECTED)**
**Score basis:** User-rejected. Behavior does not match source of truth.
**Approval state:** ❌ REJECTED by Ammar. Score reset to 0 % for Round 5. Prior round scores reassessed honestly below.

---

## Aggregate score (corrected after user rejection)

| Dimension | Score | Target | Reached |
|---|---:|---:|---|
| **Round 5 visual parity (user verdict)** | **0 %** | 90 % | ❌ NO |
| **Round 5 behavioral parity (user verdict)** | **0 %** | 90 % | ❌ NO |
| Falcon component reuse rate | 100 % (irrelevant — wrong components used) | 100 % | n/a |
| Tailwind + token compliance | 100 % (irrelevant — wrong styling) | 100 % | n/a |
| SCSS / inline / PrimeNG | 0 | 0 | ✅ YES |
| Save wiring coverage | LOCAL-STATE-ONLY (matches SoT; not the defect) | n/a | n/a |
| Validation coverage | 0 % | n/a | DEFERRED |
| Business coverage | 0 % | n/a | DEFERRED |

## Why Round 5 is 0 %

The user rejected the edit-row implementation. The shipped pattern is **a fixed bar at the top of the table**. The required pattern is **an inline expand-row directly below the row being edited**, mirroring the header structure, with a **post-save chevron on the Actions column** so the user can re-expand to see the staged change.

None of Rounds 1–5 delivered this. Each round claimed a partial win that did not survive user inspection. Round 5 score is therefore **0 %** — not 94 %, not 96 %, not 98 %.

## Honest reassessment of prior rounds

| Round | Claimed at time of run | Honest score after user rejection | Why it was wrong |
|---|---:|---:|---|
| Round 1 | 96.5 % | **~30 %** | Pixel diff against an auth-denied card was meaningless. Score was based on a destination that wasn't even rendering the page. |
| Round 2 | 95 % comm-channels | **~25 %** | Title + footer-bg fixed (real but tiny). The big-ticket items (edit-row pattern, IB popup) were declared "already correct" by an agent without ground-truth verification. |
| Round 3 | "Code-level 100 %" | **~15 %** | Replaced bubble+notch with flat stripe — but still at the top of the table, not below the row. Wrong pattern. Reused dialog slots instead of authoring the new component the user explicitly asked for. |
| Round 4 | 95–97 % | **~20 %** | Authored `<falcon-alert-dialog>` (a real win) but didn't run live verification because dev-serve was stuck. Couldn't prove anything. |
| Round 5 | 94 % | **0 %** | Live verification ran against a mixed bundle (R3+R4 staged + Wave-15 unstaged). The user looked at the actual screen and said the edit-row is in the wrong place and there is no post-save indicator. |

## Severity totals (Round 5 — corrected)

| P0 | P1 | P2 | P3 |
|---:|---:|---:|---:|
| **3** | 2 | 3 | 4 |

New P0s logged from user rejection:

- **DEFECT-CCS-R5-P0-A** — Edit-row renders at the **top of the table** (fixed drawer). Required: **inline expand-row directly below the row being edited**, structured to mirror the header.
- **DEFECT-CCS-R5-P0-B** — No **post-save chevron / expand-toggle** on the Actions column to re-open and inspect the staged change.
- **DEFECT-CCS-R5-P0-C** — Edit-row content is not column-aligned with the header (dropdown / calendar / value input should sit under the corresponding header cells).

## What is actually shipped (honest)

- Title fix (en + ar)
- Action column header rename ("Actions" → "Action")
- A new `<falcon-alert-dialog>` Stencil + Angular wrapper component **with knowledge dossier** — this is the only real win across 5 rounds, and it isn't even verified live yet
- Table chrome bg tokens partially aligned

That's it. The user's actual visible workflow (edit price → see staged change → re-inspect) does not work as expected.

## Conclusion

Page is **not at shippable parity** with the source of truth. Pre-Round-6 baseline reset to **0 % behavioral parity** for the comm-channels edit flow. See `ROUND_5_POSTMORTEM.md` for root cause and `EDIT_ROW_SPEC.md` for the locked spec that Round 6 must satisfy before any further score claim.
