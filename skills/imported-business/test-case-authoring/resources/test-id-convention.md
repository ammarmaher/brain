*** Test ID Convention — test-case-authoring ***
*** Stable, append-only test IDs for Falcon test cases ***

# Test ID Convention

## Format

```
TC-<MODULE>-<###>
```

- `TC` literal prefix
- `MODULE` 2–4 letter uppercase abbreviation per module (registered in module-catalog)
- `###` zero-padded sequence per module, starts at `001`

## Examples

| Module | Abbrev | First IDs |
|---|---|---|
| Account Management | `AM` | `TC-AM-001`, `TC-AM-002`, ... |
| Contact Group | `CG` | `TC-CG-001`, ... |
| Charging | `CH` | `TC-CH-001`, ... |
| Provisioning | `PR` | `TC-PR-001`, ... |
| Wallet | `WL` | `TC-WL-001`, ... |

## Module abbreviation registration

When a new module is added:
1. Pick a 2–4 letter abbreviation
2. Register in `module-catalog/INDEX.md` under a `Test Abbrev` column
3. Confirm no collision

## Append-only rule

Test IDs are **never** renumbered, **never** reused.

- Deleted test → ID retired (mark in `coverage-matrix.md` as `RETIRED`), do not reassign
- Renamed test → keep ID, change scenario text only
- Split test → original ID stays on one half, new IDs for the rest

## Sequence allocation

Tests are added by appending to `<module>.feature`. The next ID is `max(existing) + 1`.

## Cross-references

- `feature` file: `@TC-AM-007` tag on each scenario
- `coverage-matrix.md`: row per ID with PRD link + status
- `module-catalog/.../coverage.md`: mirrors the matrix
- Bug reports: reference IDs of failing tests
