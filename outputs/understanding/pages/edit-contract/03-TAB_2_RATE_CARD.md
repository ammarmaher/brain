*** Edit Contract — Tab 2: Rate Card ***
*** 2026-05-18 ***

# Edit Contract — Tab 2: Rate Card

> Re-uses `<app-contracts-rate-card-section>` with `[editable]` driven by `hasRestrictedCommercialFields`.

## Per-status

| Status | Rows editable? | priceValue editable? |
|---|---|---|
| Pending | YES (full) | YES |
| Active | NO (`[editable]=false`) | NO |
| Expired | NO | NO |

## Component reuse

```html
<app-contracts-rate-card-section
  [rows]="form.unitConversions"
  [editable]="!hasRestrictedCommercialFields()"
/>
```

## Auto-correction still runs

Even in read-only mode, the catalog auto-correction would re-run if channels change. Since channels can't change on existing contract, this is a non-issue.

## See also

- [03-STEP_2_RATE_CARD in add-contract](../add-contract/03-STEP_2_RATE_CARD.md) (full detail)
- [06-SECTION_FIELD_FREEZE](06-SECTION_FIELD_FREEZE.md)
