# Bounded Visual Parity Repair Loop

For every UI conversion task, do not stop after first implementation if visible mismatches remain.

## Loop

1. Capture/reference source-of-truth screenshot.
2. Capture implemented Angular screenshot.
3. Compare by areas: header, tabs, tree, table, buttons, forms, spacing, colors, typography, modals.
4. Create mismatch list.
5. Fix highest-impact mismatches.
6. Rebuild/retest/recapture.
7. Repeat until target reached or stop condition hit.

## Default bounds

| Metric | Default |
|---|---:|
| Max repair rounds | 5 |
| Target visual parity | 90%+ |
| Stop conditions | target reached, blocking issue, max rounds, impossible asset/data limitation |

## Report metrics

The PDF/report must include:
- max allowed rounds
- rounds used
- visual parity score per round
- before/after screenshots
- mismatch count per round
- fixed issues
- remaining gaps
- stop reason
