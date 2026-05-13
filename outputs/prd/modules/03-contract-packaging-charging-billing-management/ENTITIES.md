*** PRD Understanding - Contract & Cost Management - ENTITIES ***

# 03-contract-packaging-charging-billing-management - Domain Entities

> Inferred from `latest-prd.md` + `understanding.md`. *Italicized* fields are inferred.

| Entity | Description | Key Fields | Lifecycle Status | Relationships |
|---|---|---|---|---|
| Contract | The commercial agreement between Falcon and an account. | id, farabiRefId (<=50), name (<=50), accountId, startDate (>=today), expirationDate (>startDate, >now), valueSar (>0 float, <=hundreds-of-millions), remainingValueSar (auto), createdAt (auto), status | Pending -> Active -> Expired (auto-transitions on dates). Extension can revive Expired -> Active. | N:1 Account; 1:N RateCardEntry; 1:N ContractDetail; 1:N Addon; 1:N WalletRecord |
| RateCardEntry | Per-CommChannel pricing inside a contract for SAR<->Points conversion. | contractId, commChannelId, priceUnit (from predefined list), priceValueSar | n/a | N:1 Contract; N:1 CommChannel |
| ContractDetail | One cell in the Application x CommChannel x Priority/ServiceType x Destination matrix. | contractId, applicationId, commChannelId, priority (per CommChannel taxonomy or `None` for AI), destination (or `Global` for AI), costSar | n/a | N:1 Contract; N:1 Application; N:1 CommChannel |
| Addon | Sub-service addon, has both a free-credit bucket and a rate card. | contractId, subServiceType (`VoiceNumber`, `NabaaTemplate`, ...), freeCreditValue, rateCardValue | n/a (consumed by activations) | N:1 Contract |
| WalletRecord | Credit record linking a wallet balance entry to a specific contract (defined in 01-account-management; load-bearing here). | id, walletId, contractId, valueSar, createdAt | Live (records survive Expired contracts but are excluded from lump-sums) | N:1 Wallet (01); N:1 Contract |
| PriceUnit | A predefined Price Unit entry (e.g. `Per Message`, `Per Minute`, `Per Transaction`). | id, name, code | DB-editable without deployment (BR-CC-21) | 1:N RateCardEntry |
| Destination | A country/region used as the Destination axis of Contract Details. | id, code, name, countryCode, ndc?, length? | n/a | 1:N ContractDetail |
| Priority | A per-CommChannel service-type tag (WhatsApp Authentication/Utility/Advertisement/Service, Voice High/Normal/VeryLow, AI none). | id, commChannelId, name | n/a | 1:N ContractDetail |

## Relationship summary

```
Account (01)
  ├─ Contract × N (Pending/Active/Expired)
  │   ├─ RateCardEntry × N (per CommChannel)
  │   ├─ ContractDetail × N (matrix cells)
  │   ├─ Addon × N (per sub-service)
  │   └─ WalletRecord × N (links to wallets in 01)
  └─ Wallet × N (01-account-management)
       └─ WalletRecord × N ─→ Contract

Predefined / shared:
  PriceUnit (DB-editable list)
  Destination (from International Phone# Destination List)
  Priority (per CommChannel)
```

## Status enumeration

- **Contract.status**: `Pending`, `Active`, `Expired` (BR-CC-11). Auto-derived from `(startDate, expirationDate, now)`.
- **Contract.currency**: `eCurrency` (Commerce DTO uses this). PRD uses SAR exclusively.

## Key invariants

- `Active` contracts contribute to Master Wallet via WalletRecord; sum of records' valueSar = MasterWallet lump-sum (cross-ref BR-AM-28).
- On `Expired`, records remain but are subtracted from every wallet's lump-sum (BR-CC-38).
- Extension to a future date flips `Expired -> Active` and re-adds the records to lump-sums (BR-CC-17).
- `Remaining Value = ValueSar - SUM(WalletRecord.valueSar deducted by transactions)`. Hidden from clients when Expired; `NA` when Pending; visible when Active (BR-CC-40).

## Code-side mapping (from Commerce `Contracts/ContractRequest` DTOs)

The current backend uses a richer DTO shape than the PRD prose:

- `CreateContractRequest`: `AccountId, ContractName, FarabiReferenceId?, StartDate, EndDate, CommittedValue, eCurrency Currency, List<ContractRateRequest> Rates, List<ContractUnitConversionRequest> UnitConversions, List<ContractQuotaRequest> Quotas, List<ContractOverageRateRequest> OverageRates`.
- `ContractRateRequest`: `ApplicationId, ChannelId, Priority, Destination, Unit, RatePerUnit`. **Maps to ContractDetail**.
- `ContractUnitConversionRequest`: `Code, Name, PriceUnit, RatingUnit, PriceValue`. **Maps to RateCardEntry**.
- `ContractQuotaRequest`: `QuotaCode, ChannelId, IncludedAmount, IncludedUnits, Unit, QuotaCategory, QuotaType, Scope, SubService?`. **Maps to Addon free-credit**.
- `ContractOverageRateRequest`: `SubService, ChannelId, Unit, UnitPrice, BillingCycle`. **Maps to Addon rate-card**.

The mapping is consistent. Note: code uses `EndDate`; PRD uses `Expiration Date`. Same semantic.
