*** Create Template (WhatsApp) — Validations ***
*** 2026-05-18 ***

# Create Template (WhatsApp) — Validations

## V-rules (per BR-TM-*)

| V-rule | Step | Source | Effect |
|---|---|---|---|
| `V-template-name-format` | 1 | BR-TM-05 | a-z, 0-9, _ only |
| `V-template-name-length` | 1 | (PRD silent on max — INFERRED ≤Nchars) | max length |
| `V-template-name-unique-async` | 1 | BR-TM-04 | per (WA Business Account × language) |
| `V-template-category-required` | 1 | BR-TM-24 | enum |
| `V-template-subcategory-required` | 1 | BR-TM-24 | enum-per-category |
| `V-template-language-required` | 1 | BR-TM-03 | enum |
| `V-template-header-mutex` | 2 | BR-TM-11 | text XOR media XOR location |
| `V-template-header-text-le-60` | 2 | BR-TM-11 | ≤60 chars |
| `V-template-header-text-1-var-max` | 2 | BR-TM-11 | only 1 variable in header |
| `V-template-media-size-jpg-png` | 2 | BR-TM-11 | ≤5 MB |
| `V-template-media-size-mp4` | 2 | BR-TM-11 | ≤16 MB |
| `V-template-media-size-doc` | 2 | BR-TM-11 | ≤10 MB |
| `V-template-body-required` | 2 | BR-TM-13 | non-empty |
| `V-template-body-variables-not-at-edges` | 2 | BR-TM-07 | not at start or end |
| `V-template-body-numeric-vars-sequential` | 2 | BR-TM-08 | {{1}}, {{2}}, ... no gaps |
| `V-template-body-name-vars-format` | 2 | BR-TM-09 | lowercase + underscores + digits |
| `V-template-body-variable-count` | 2 | BR-TM-10 | 20-30 limit |
| `V-template-footer-le-60` | 2 | BR-TM-15 | ≤60 chars |
| `V-template-footer-no-variables` | 2 | BR-TM-15 | no variables |
| `V-template-buttons-max-10` | 2 | BR-TM-16 | up to 10 |
| `V-template-button-quick-reply-label` | 2 | BR-TM-16 | label required |
| `V-template-button-url-format` | 2 | (inferred) | valid URL |
| `V-template-marketing-policy-compliance` | 1 | BR-TM-25 | manual compliance gate |

## Variable validators (complex)

### Numeric variables sequential check

```typescript
function areNumericVariablesSequential(body: string): boolean {
  const matches = [...body.matchAll(/\{\{(\d+)\}\}/g)].map(m => parseInt(m[1]));
  const unique = [...new Set(matches)].sort((a, b) => a - b);
  return unique.every((v, i) => v === i + 1);
}
```

### Variables not at edges

```typescript
function variablesNotAtEdges(body: string): boolean {
  const trimmed = body.trim();
  if (/^\{\{/.test(trimmed)) return false;   // starts with variable
  if (/\}\}$/.test(trimmed)) return false;   // ends with variable
  return true;
}
```

## See also

- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md) · [03-STEP_2_MESSAGE_STRUCTURE](03-STEP_2_MESSAGE_STRUCTURE.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
