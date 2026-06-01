*** Create Contact Group — Step 2: Column Config ***
*** 2026-05-18 ***

# Create Contact Group — Step 2: Column Config

## Header detection

[PRD] BR-CGM-05: "First row is the header" toggle controls column-name source.

The `complete` endpoint returns `hasHeader: boolean` (auto-detected). User can override the toggle.

- If `hasHeader = true`: column names come from row 1 of the file.
- If `hasHeader = false`: column names auto-generated (`Column1`, `Column2`, ...).

## Column name editing

[PRD] BR-CGM-06: Column names must obey:

| Rule | Detail |
|---|---|
| Characters | English letters only (a-z, A-Z) |
| No duplicates | within group |
| No special characters | (only letters allowed) |
| Length | ≤ 20 chars |
| Spaces | auto-converted to `_` |

So `First Name` → `First_Name`, `email-address` → invalid (`-` not allowed), `📧` → invalid.

## Column data type display

[BRAIN-OUT] `detectedColumns: Array<{ name, dataType }>` — backend infers (number/string/date). User can rename but not change type (per BR-CGM-08: content not validated).

## UI shape

```
+--------------------------------------+
| Step 2 of 4 — Configure Columns      |
+--------------------------------------+
|  ☑ First row is the header           |
|                                      |
|  Column        Type    Renamed       |
|  first_name    string  [_____________]|
|  last_name     string  [_____________]|
|  phone         string  [_____________]|
|  amount        number  [_____________]|
|                                      |
|       [← Previous]  [Next →]         |
+--------------------------------------+
```

## See also

- [02-STEP_1_UPLOAD](02-STEP_1_UPLOAD.md) · [04-STEP_3_PREVIEW](04-STEP_3_PREVIEW.md) · [07-VALIDATIONS](07-VALIDATIONS.md)
