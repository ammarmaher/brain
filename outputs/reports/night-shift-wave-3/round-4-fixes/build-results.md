# Wave 4 Steps 2-10 — Build Results

## Development builds (initial verify)

| App | Configuration | Hash | Time | Exit code |
|---|---|---|---|---|
| admin-console | development | `8b5e58764b6acd18` | 12064 ms | 0 |
| host-shell    | development | `b43c914664308122` | 10596 ms | 0 |

## Production builds (final verify)

| App | Configuration | Hash | Time | Exit code |
|---|---|---|---|---|
| admin-console | production | `64c5ce83d06d3013` | 19892 ms | 0 |
| host-shell    | production | `c493d966efa2c0e6` | 28666 ms | 0 |

## Warnings (pre-existing, unrelated to Wave 4)

- `FalconAngularInputComponent is not used within the template of OrgHierarchyPageMenuComponent` — pre-existing, in `org-hierarchy-page-menu.component.ts:79`. Not introduced by this wave.
- Several `is part of the TypeScript compilation but it's unused` warnings — unrelated to Add Client wizard files. Pre-existing tsconfig artifacts.

## Grep-gate (Step 9 acceptance)

```
grep -rEn '<input\b|<button\b|<select\b|<table\b|<tr\b|<td\b|<th\b|<textarea\b' \
  apps/admin-console/.../add-client-wizard/
```

**Result: ZERO matches** in actual markup. All 9 hits are HTML/TS comments documenting the Wave 4 Step 9 violations + their replacements. Falcon library compliance: COMPLETE.
