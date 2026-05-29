*** Edit Contract — Tab 3: Contract Details ***
*** 2026-05-18 ***

# Edit Contract — Tab 3: Contract Details

> Re-uses `<app-contracts-contract-details-section>`. Status-aware editability.

## Per-status

| Status | Matrix editable? | App/Channel selectable? |
|---|---|---|
| Pending | YES | YES |
| Active | NO | display-only |
| Expired | NO | display-only |

## Filtered matrix view

[CODE] `view-contract.component.ts:179-208` — `createRateMatrixForSelection`:

> Building from all rates can mix WhatsApp and Voice priorities, which leaves the selected grid cells empty until the user changes channel.

In view mode (and edit-read-only), only the (currently-selected app × channel) cells are shown.

## Component reuse

```html
<app-contracts-contract-details-section
  [matrix]="form.matrix"
  [rates]="form.rates"
  [unitConversions]="form.unitConversions"
  [applicationOptions]="applicationOptions"
  [channelOptions]="channelOptions"
  [editable]="!hasRestrictedCommercialFields()"
/>
```

## See also

- [04-STEP_3_CONTRACT_DETAILS in add-contract](../add-contract/04-STEP_3_CONTRACT_DETAILS.md) (full detail)
- [06-SECTION_FIELD_FREEZE](06-SECTION_FIELD_FREEZE.md)
