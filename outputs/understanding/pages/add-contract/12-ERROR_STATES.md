*** Add Contract — Error states ***
*** Error UX mapping · 2026-05-18 ***

# Add Contract — Error States

## HTTP status routing

| HTTP | UX |
|---|---|
| 200 + isSuccessful=true | emit (saved) → close wizard |
| 200 + isSuccessful=false | inline `errorMessage` at Step 4 footer |
| 400 (validation) | inline error per field |
| 403 | toast: "You don't have permission to create contracts." |
| 422 (business rule) | inline `errorMessage` (e.g. FarabiId duplicate) |
| 5xx | toast: "Server error. Try again." · keep form state |

## Per-error mapping

| FalconKey | Origin | UX |
|---|---|---|
| `Error.Contracts.WalletStrategyNotConfigured` | Account has no wallet strategy | Should never happen (FE pre-gate); fallback: redirect to wallets page |
| `Error.Contracts.FarabiReferenceIdDuplicate` | farabiReferenceId already used for account | Inline error on field: "This reference ID is already in use." |
| `Error.Contracts.StartDatePastDate` | startDate < today | Inline error: "Start date must be today or later." |
| `Error.Contracts.EndDateBeforeStart` | endDate < startDate | Inline error |
| `Error.Contracts.CommittedValueInvalid` | <= 0 | Inline error |
| `Error.Contracts.RateMatrixIncomplete` | Some cells null | Inline error in matrix |
| `Error.Contracts.QuotaCategoryMismatch` | USAGE without amount OR SUB_SERVICE without units | Inline error per row |
| `Error.Contracts.OverageRateInvalid` | Missing field on overage row | Inline error per row |
| `Error.Contracts.AccountNotFound` | accountId invalid | Toast + close |
| `Error.Contracts.PermissionDenied` | PES denied | Toast + close |

## Submit-time recovery

On error, the wizard:
1. Stays open (does NOT close).
2. Surfaces `errorMessage` at Step 4 footer (or navigates back to the failing step if known).
3. Re-enables Finish button after 500ms (preventing double-submit).
4. User can fix and retry.

## Cancel UX

[CODE] template "Cancel" button — if user clicks Cancel and form has any data, prompt confirm dialog: "Discard contract draft?" (Yes/No).

[INFERRED] Old-UI doesn't have this guard — flagged as `GAP-CC-ADD-DISCARD-GUARD` in [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md).

## See also

- [07-VALIDATIONS](07-VALIDATIONS.md) · [08-BACKEND_API](08-BACKEND_API.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
