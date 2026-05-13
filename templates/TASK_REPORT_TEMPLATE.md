# Task Intelligence Report Template

Folder name:

```text
reports/<task-name>-YYYY-MM-DD/
```

## Summary

| Field | Value |
|---|---|
| Task |  |
| Date |  |
| Role detected |  |
| Mode |  |
| Branches used |  |
| Source of truth |  |
| Commit hash |  |

## Progress scores

| Metric | Score |
|---|---:|
| Source understanding | % |
| Applied implementation | % |
| Falcon component reuse | % |
| Shared component upgrade | % |
| Backend/API contract confidence | % |
| Validation coverage | % |
| PES/permission confidence | % |
| Visual parity | % |
| Build/lint/test | % |
| Open gaps | % |

## Visual loop

| Metric | Value |
|---|---:|
| Max repair rounds |  |
| Rounds used |  |
| Initial visual parity | % |
| Final visual parity | % |
| Initial mismatches |  |
| Fixed mismatches |  |
| Remaining gaps |  |
| Stop reason |  |

## Sources

| Source | Role |
|---|---|
| HTML | visual truth / none |
| React | behavior reference / none |
| Screenshot | validation truth / none |
| Backend | API truth |
| Wiki | architecture truth |
| PRD | business truth |

## Git sync

| Repo | Branch | Commit | Status |
|---|---|---|---|
| Brain |  |  |  |
| Implementation |  |  |  |

## Excluded files

List secrets/local/temp files excluded from commit.
