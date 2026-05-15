---
section: comm-channels-tab
parity_round: 2
generated: 2026-05-15T20:55+03:00
---

# CommChannels & Services tab — Section Scorecard (Round 2)

## Parity score

| Aspect                         | R1 (pre)  | R2 (post) | Notes                                    |
|--------------------------------|-----------|-----------|------------------------------------------|
| Title copy                     | 70%       | **100%**  | en+ar i18n switched to canonical phrase  |
| Edit affordance pattern        | 90%       | 90%       | Wave 14 row-expansion correct in code; DOM-projection regression discovered (see new defects) |
| Table chrome (hdr + footer bg) | 100%      | **100%**  | Wave 19 patch already enforces parity     |
| Action column header copy      | 50%       | **100%**  | Plural → singular per SoT                 |
| Kebab actions per status       | 100%      | **100%**  | 3-item / 4-item resolver matches SoT      |
| Toggle switch                  | 100%      | **100%**  |                                          |
| Status badges                  | 100%      | **100%**  |                                          |
| Tab-strip label                | 100%      | **100%**  | "CommChannels & Services" was already correct |

**Section composite: 92% → 95% (+3 pp).**

## New defects discovered (logged to backlog — NOT fixed in this round)

| # | Severity | Defect                                                                                                                                  |
|---|----------|-----------------------------------------------------------------------------------------------------------------------------------------|
| 1 | LOW      | Pre-existing `SyntaxError: Cannot use 'import.meta' outside a module` in styles.js — present on every CommChannels & Services tab load. Likely from a Vite-compiled chunk inlined into webpack CSS pipeline. Not in scope. |
| 2 | HIGH     | Row-expansion slot projection regression: `<app-falcon-table-edit-row slot="row-expansion">` stays as direct child of `falcon-table-tw` instead of being moved into `<td class="falcon-table-row-expansion-cell">`. The expansion `<tr>` is created at the correct in-table position with `colspan=9`, but the cell is empty. As a side-effect, the consumer-side hand-rolled fallback (the Angular ng-if branch inside `applications-table.component.html`) renders the edit panel ABOVE the table chrome instead of inside the table row. Reproduces on Email Relay AND SMS Gateway. Stencil `componentDidRender` projection at `falcon-table-tw.tsx:255-275` not idempotently maintaining child position. Needs Stencil-side fix in `libs/falcon-ui-core/src/components/falcon-table-tw/`. |

## Verified GREEN (Round 2)

- Title copy fix (en + ar) — live-rendered ✓
- Action header copy fix — live-rendered ✓
- Table header + footer same tinted bg — live DOM-computed ✓
- Kebab menu items / counts / order — live-clicked ✓
- Visibility toggle (off + on, status badge dashes when off) — live-clicked ✓
- Tab switching (4-way Hierarchy / CommChannels / Apps / Settings) — live-clicked ✓
