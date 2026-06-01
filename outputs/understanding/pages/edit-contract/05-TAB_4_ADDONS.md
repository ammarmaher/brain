*** Edit Contract — Tab 4: Add-ons ***
*** 2026-05-18 ***

# Edit Contract — Tab 4: Add-ons

> Re-uses `<app-contracts-addons-section>`. Status-aware editability.

## Per-status

| Status | Quotas editable? | Overage rates editable? |
|---|---|---|
| Pending | YES | YES |
| Active | NO | NO |
| Expired | NO | NO |

## Component reuse

```html
<app-contracts-addons-section
  [quotas]="form.quotas"
  [overageRates]="form.overageRates"
  [channelOptions]="channelOptions"
  [editable]="!hasRestrictedCommercialFields()"
/>
```

## See also

- [05-STEP_4_ADDONS in add-contract](../add-contract/05-STEP_4_ADDONS.md) (full detail)
- [06-SECTION_FIELD_FREEZE](06-SECTION_FIELD_FREEZE.md)
