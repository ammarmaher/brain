# Visual Parity Scorecard — Organization Hierarchy

> Per-section visual fidelity score: source-of-truth render vs Angular destination render.

**Aggregate visual parity:** **35%**

## Methodology

Each section is rated 0-100% based on:
- Side-by-side screenshot comparison (target — currently blocked on browser MCP selection)
- Live measurement (e.g. heights, colors, radii — performed today on Users table)
- Code-level matching (CSS vars, class names, layout primitives)

When live screenshots not available: score derived from code-level match + spot live checks.

## Per-section scorecard

| # | Section | Source ref | Score | Method | Last checked |
|---|---|---|---|---|---|
| 1 | Sidebar | HTML §2 | n/a (host-shell) | excluded from page | — |
| 2 | Topbar | HTML §1 | n/a (host-shell) | excluded from page | — |
| 3 | Tree panel | HTML §4 | 70% | code-match + screenshot | 2026-05-14 |
| 4 | Tab strip | HTML §5 | 85% | code-match + screenshot | 2026-05-14 |
| 5 | View toggle | HTML §5 | 80% | code-match + screenshot | 2026-05-14 |
| 6 | Node header | HTML §3 | 75% | screenshot | 2026-05-14 |
| 7 | Users table (header + body + footer) | HTML §6 | **90%** | live measurement today (within 0.94px) | 2026-05-14 |
| 8 | Status badges (8 statuses) | HTML §7 | 60% | partial — 6 of 8 verified | 2026-05-14 |
| 9 | Info panel | HTML §11 | 30% | unknown | needs sweep |
| 10 | Settings tab | HTML §9 | 20% | placeholder | needs sweep |
| 11 | Apps & Services tab | HTML §7 | 10% | placeholder | needs sweep |
| 12 | CommChannels tab | HTML §8 | 10% | placeholder | needs sweep |
| 13 | Add Client wizard step 1 | HTML §12 | 30% | partial | needs sweep |
| 14 | Add Client wizard steps 2-5 | HTML §12 | 10% | minimal | needs sweep |
| 15 | Add User wizard | HTML §13 | 25% | skeleton | needs sweep |
| 16 | User Details drill-in | HTML §22 | 50% | component exists | needs sweep |
| 17 | Node drawer (Add/Edit) | HTML §15 | 70% | code-match | needs sweep |
| 18 | OTP modal | HTML §14 | 40% | library used, exact match not verified | needs sweep |
| 19 | Send Credentials modal | HTML §12, §13 | unknown | not implemented? | needs sweep |
| 20 | Success modal | HTML §12, §13 | unknown | not verified | needs sweep |
| 21 | Insufficient Balance modal | HTML §7 | 0% | not implemented | — |
| 22 | Toasts | HTML §17 | 80% | uses notifier | — |
| 23 | Org chart view | HTML §18 | unknown | component exists, behavior not verified | needs sweep |
| 24 | RTL mode | HTML §1 | 0% | not tested | needs sweep |

Average of testable sections: ~35%

## High-confidence wins (live-verified today)

These are sections where measurements were performed today and matched expected source values:

- **Users table heights**: header 65.28px / data row 64.33px / footer 64.67px (within 0.94px) ✓
- **Container radius**: 0px on all corners ✓
- **Dropdown radius**: `rounded-sm` = 8px ✓
- **Header/footer background**: both `rgb(250, 250, 250)` (Falcon neutral-30) ✓
- **Orphan menu artifact**: gone from data-table subtree ✓
- **Row kebab column**: suppressed library-wide ✓

## Sections that have NEVER been visually swept

- All wizard inner steps (visual layout unverified)
- All placeholder tabs (Settings, Apps, CommChannels)
- Info panel field grid
- Org chart pan/zoom behavior
- OTP modal full state machine (input → invalid → expired → success)
- Insufficient Balance modal (not built)
- All modals: Send Credentials, Success
- RTL mode end-to-end
- AR language strings

## Blocked sweep

The 12-section Wave 17 visual parity sweep has been **BLOCKED** on Chrome MCP browser disambiguation (per `visual-parity-report.md`). Once Ammar selects a browser deviceId, the sweep can run and this scorecard updates substantially.

## How this scorecard updates

Each section's score updates only when:
1. A live source-vs-destination screenshot comparison is done, OR
2. A measurement is taken (live JS evaluation in the browser), OR
3. A pixel-perfect code-level match is verified

The aggregate is recomputed after any per-section update.
