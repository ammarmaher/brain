*** Edit Contract — Error states ***
*** 2026-05-18 ***

# Edit Contract — Error States

## Same as Add Contract plus status-specific

[See [../add-contract/12-ERROR_STATES.md](../add-contract/12-ERROR_STATES.md) for the full Add error mapping. Below are Edit-specific additions.]

## Edit-specific FalconKeys

| FalconKey | When | UX |
|---|---|---|
| `Error.Contracts.CommercialFieldLockedOnActive` | Active contract tried to change rates/quotas/etc | Toast: "Commercial fields are locked while contract is active." |
| `Error.Contracts.ExpiredFieldLocked` | Expired contract tried to change anything except endDate | Toast: "Only end date can be changed on expired contracts." |
| `Error.Contracts.ContractNotFound` | 404 | Toast + close → return to list |
| `Error.Contracts.CannotEditContract` | `canEdit === false` | Should never happen (FE pre-gate); fallback toast |
| `Error.Contracts.ExtensionBackwards` | New endDate <= today | Inline error on endDate |

## Optimistic concurrency

[INFERRED] Backend likely uses ETag / version for concurrent edit detection. NEW UI should handle 409 with: "Contract was modified by another user. Refresh and try again."

## See also

- [../add-contract/12-ERROR_STATES.md](../add-contract/12-ERROR_STATES.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
