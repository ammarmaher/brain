*** Create Contact Group — Validations ***
*** 2026-05-18 ***

# Create Contact Group — Validations

## V-rules per PRD BR-CGM-*

| V-rule | Step | Source | Effect |
|---|---|---|---|
| `V-contact-file-extension` | 1 | BR-CGM-04 | csv/xls/xlsx only |
| `V-contact-file-size` | 1 | BR-CGM-04 | ≤ maxFileSizeMB from config |
| `V-column-name-letters-only` | 2 | BR-CGM-06 | English letters only |
| `V-column-name-no-duplicates` | 2 | BR-CGM-06 | unique within group |
| `V-column-name-no-special` | 2 | BR-CGM-06 | only letters |
| `V-column-name-length` | 2 | BR-CGM-06 | ≤20 chars |
| `V-column-name-spaces-to-underscore` | 2 | BR-CGM-06 | auto-replace at FE |
| `V-group-name-required` | 4 | BR-CGM-02 | non-empty |
| `V-group-name-length` | 4 | BR-CGM-02 | ≤50 chars |
| `V-group-name-unique-per-node` | 4 | (async — BE catches if endpoint missing) | unique per node |
| `V-reference-id-optional` | 4 | BR-CGM-03 | optional |
| `V-share-policy-mutex` | 4 | BR-CGM-09 | one of: specific users, all users, just me |

## Column-name normalizer (BR-CGM-06)

```typescript
function normalizeColumnName(input: string): string {
  // 1. Trim
  let name = input.trim();
  // 2. Spaces → underscore (auto per BR-CGM-06)
  name = name.replace(/\s+/g, '_');
  // 3. Validate: only letters + underscores
  if (!/^[a-zA-Z_]+$/.test(name)) {
    throw new ValidationError('Only English letters allowed');
  }
  // 4. Length
  if (name.length > 20) {
    throw new ValidationError('Max 20 characters');
  }
  return name;
}
```

## Cross-row column uniqueness

```typescript
function areColumnNamesUnique(columns: Column[]): boolean {
  const names = columns.map(c => c.normalizedName);
  return new Set(names).size === names.length;
}
```

## Async validators

- File size check happens at FE before init.
- Group name uniqueness: TBD endpoint OR BE rejects at commit time (Error.ContactGroup.NameDuplicate).

## See also

- [02-STEP_1_UPLOAD](02-STEP_1_UPLOAD.md) · [03-STEP_2_COLUMN_CONFIG](03-STEP_2_COLUMN_CONFIG.md) · [05-STEP_4_NAMING_SHARE](05-STEP_4_NAMING_SHARE.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
