---
type: audit-report
generated: 2026-05-16
status: GREEN
total-findings: 0
critical: 0
warnings: 0
---

# Brain Audit Report - 2026-05-16

## Summary

- **Health**: GREEN
- **Total findings**: 0
- **Critical**: 0
- **Warnings**: 0
- **Stale-days threshold**: 90

## Findings

No issues found. Brain is healthy.

## Remediation guidance

| Category | Fix |
|---|---|
| `stale-verified-at` | Re-verify the cluster + bump `verified-at:` frontmatter. If still accurate, just bump date. |
| `missing-purpose` | Add `purpose: "Answers '...'. Open when..."` to frontmatter. |
| `broken-wikilink` | Either fix the link target or remove the link. |
| `orphan-memory` | Reconcile - either restore the cluster or update memory to point at new location. |
| `missing-index` | Create _INDEX.md (preferred) or README.md for the cluster. |
| `scanner-dirty` | Run `.\falcon-wiki\scripts\scan-authority.ps1 -MarkChecked` after addressing drift. |
| `scanner-missing` | Run `.\falcon-wiki\scripts\scan-authority.ps1` for the first time. |

## Next steps

1. Address all **CRIT** findings before next push (they break the brain)
2. Triage **WARN** findings - fix or document as known-deferred
3. Re-run this audit weekly: `.\Brain Outputs\datasets\authority-dataset\20-brain-maintenance\brain-audit.ps1`
