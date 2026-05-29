*** Create Template (WhatsApp) — Step 1: Basic Info ***
*** 2026-05-18 ***

# Create Template (WhatsApp) — Step 1: Basic Info

## Fields

| Field | Required | Validator | PRD |
|---|---|---|---|
| `name` | YES | a-z, 0-9, _ only · ≤Nchars · unique per WA Business Account per language | BR-TM-04, BR-TM-05 |
| `category` | YES | enum: `AUTHENTICATION`, `UTILITY`, `MARKETING` | BR-TM-24 |
| `subCategory` | YES | enum: per-category list (see below) | BR-TM-24 |
| `language` | YES | enum: `en`, `ar`, ... | BR-TM-03 |
| `referenceId` | OPTIONAL | string, max ~50 | (not in PRD, inferred) |

## Category × subCategory matrix

[PRD] latest-prd.md:61-63 (BR-TM-24):

| Category | Sub-categories |
|---|---|
| Authentication | One-time Passcode |
| Utility | Default · Flows · Calling permissions request |
| Marketing | Default · Catalog · Flows · Calling permissions request |

## Async uniqueness check

Async validator on `name`:
- Trigger: on blur or on debounced 300ms
- Calls: `GET /api/templates/name-available?name={name}&language={lang}&channel=WHATSAPP&accountId={accId}`
- Returns: `{ available: boolean }`

[GAP-T-001] Endpoint doesn't exist today.

## UI shape

```
+--------------------------------------+
| Step 1 of 2 — Basic Info             |
+--------------------------------------+
|  Name *      [_____________________] |
|              (a-z, 0-9, _; unique)   |
|                                      |
|  Category *  [ Marketing ▼ ]         |
|  Sub-category * [ Default ▼ ]        |
|                                      |
|  Language *  [ English ▼ ]           |
|                                      |
|  Reference   [_____________________] |
|              (optional)              |
|                                      |
|                       [Next →]       |
+--------------------------------------+
```

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [03-STEP_2_MESSAGE_STRUCTURE](03-STEP_2_MESSAGE_STRUCTURE.md) · [07-VALIDATIONS](07-VALIDATIONS.md)
