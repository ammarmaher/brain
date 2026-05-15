# Visual Parity Scorecard — Organization Hierarchy

> Per-section visual fidelity score: source-of-truth render vs Angular destination render.

**Aggregate visual parity (corrected after Round 5 user rejection):** **0 %** for the comm-channels edit flow. Prior round scores were inflated and have been reset (see honest reassessment below).

---

## User rejection — what's actually wrong

The user inspected the live destination after Round 5 dev-serve restart. Verdict: the edit flow does NOT match the source of truth in three structural ways the agents missed across 5 rounds.

| ID | Severity | Description | Required behavior |
|---|---|---|---|
| **DEFECT-CCS-R5-P0-A** | **P0** | Edit affordance renders as a fixed drawer at the **top of the table** | Must render as an **inline expand-row directly BELOW the row being edited**, between the edited row and the next data row |
| **DEFECT-CCS-R5-P0-B** | **P0** | No post-save indicator on the row | After Save, a **chevron / expand-toggle** must appear in the Actions column of the edited row so the user can re-open and inspect the staged change |
| **DEFECT-CCS-R5-P0-C** | **P0** | Edit-row fields are not column-aligned with the table header | Edit-row must structurally mirror the header — dropdown sits under Price Type column, calendar under Effective Date, value input under Price Value |

## Honest reassessment of prior scores

| Round | Originally claimed | Honest score | Why the claim was wrong |
|---|---:|---:|---|
| Round 1 | 96.5 % | ~30 % | Pixel diff was against an auth-denied card — destination wasn't even rendering the page |
| Round 2 | 95 % | ~25 % | Edit-row + IB popup declared "already correct" by an agent without ground-truth |
| Round 3 | "Code 100 %" | ~15 % | Replaced bubble+notch with flat stripe but kept it at the top of the table. Wrong pattern. |
| Round 4 | 95–97 % | ~20 % | New alert-dialog component shipped (real) but dev-serve was stale — no live proof |
| Round 5 | 94 % | **0 %** | Live bundle verified but user rejected the actual UX |

## Per-section parity (corrected)

| Section | Score | Notes |
|---|---:|---|
| tabs-header | 70 % | Active state works; minor token deltas remain |
| **comm-channels-tab — read-only chrome** | 60 % | Header bg + footer bg directionally correct; row heights & paddings still off |
| **comm-channels-tab — edit flow** | **0 %** | Three P0 defects above |
| comm-channels-tab — IB popup | 30 % | New component shipped but Wave-15 wrapper renders it at 0×0 |
| apps-services-tab | n/a | Deferred — not under inspection this round |
| org-info-panel | n/a | Deferred |
| settings-tab-view-mode | n/a | Deferred |
| settings-tab-edit-mode | n/a | Deferred |
| settings-ip-management | n/a | Deferred |
| settings-account-limitation | n/a | Deferred |
| otp-popup | n/a | Deferred |

## Why the previous scoring was misleading

- **Pixel diff measured the wrong thing.** A flat stripe at the top of the table can pixel-match a flat stripe in the source if the algorithm doesn't know the stripe should be in a different DOM position.
- **Agent self-reports were trusted.** Sub-agents reported "verified at runtime" based on snapshots that didn't include the post-save state or the second-edit reopen.
- **Behavioral parity was never measured.** Save → row-collapse → chevron-appears → click-chevron → expand-and-see-staged-change was not part of any test case before Round 5, and even Round 5's test cases didn't cover the chevron because the agent harvested only 4 SoT screenshots in Round 3 and never confirmed the post-save UI.
- **The "Falcon library first" rule was misread.** Agents picked the closest existing component (top-bar drawer) instead of the right structural pattern (Falcon Data Table row-expansion API) because the existing dialog "kind of fit" and the user hadn't yet locked the spec.

## Conclusion

**Visual parity for the comm-channels edit flow is 0 % until DEFECT-CCS-R5-P0-A/B/C are all closed with chrome-MCP screenshot evidence taken from the SAME test cases and SAME values the user has supplied (see `ROUND_6_PLAN.md`).**
