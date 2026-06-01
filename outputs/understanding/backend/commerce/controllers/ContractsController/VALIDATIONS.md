# ContractsController — Validations

## DTO-Level Validation (attribute-based)

Heavier than most Commerce controllers — uses **DataAnnotations** consistently.

### Top-level (`CreateContractRequest` / `UpdateContractRequest`)

| Field | Attribute |
|---|---|
| `AccountId` (Create only) | `[Required]` |
| `ContractName` | `[Required]` |
| `StartDate` / `EndDate` | `[Required]` |
| `CommittedValue` | `[Range(0.0000001m, decimal.MaxValue)]` |
| `Currency` | `[EnumDataType]` (no `[Required]`) |
| `Rates` | `[Required]` (non-null collection — empty list still passes) |

### Sub-item types (`ContractRateRequest`, `ContractUnitConversionRequest`, `ContractQuotaRequest`, `ContractOverageRateRequest`)

All string fields decorated `[Required]`. Decimal fields `[Range(0, decimal.MaxValue)]`.

[CODE] `CreateContractRequest.cs:67-152`

## Authorization Validation

`[Authorize]` at class level only. No `FalconOnly` override.

### Handler-side tenant isolation

[CODE] `CreateContractHandler.cs:98-102`, `UpdateContractHandler.cs:164-168`, `GetContractHandler.cs:44-48`:
```csharp
if (_currentUser.UserType == eUserType.Client && _currentUser.TenantId != accountId)
    throw new FalconException(FalconKeys.Error.OwnerIdNotMatchWithTenantId);
```

[CODE] `ListContractsHandler.cs:29-30`:
```csharp
if (_currentUser.UserType == eUserType.Client && _currentUser.TenantId != query.AccountId)
    throw new FalconException(FalconKeys.Error.OwnerIdNotMatchWithTenantId);
```

## Handler-Level Validation

### `CreateContractHandler`

| Step | Source line | Throws |
|---|---|---|
| `AccountId` non-empty | `79-80` | `AccountIdRequired` → 400 |
| Tenant isolation | `100-101` | `OwnerIdNotMatchWithTenantId` → 403 |
| Account node exists | `88-89` | `NodeNotFound` → 404 |
| Wallet policy check | `52` | Domain policy throws (see Cross-Field) |
| Applications all resolve | `114-116` | `ApplicationNotFound` → 404 |
| Channels all resolve | `134-136` | `CommunicationChannelNotFound` → 404 |
| Domain `Contract.Create(...)` | `61-70` | Domain `FalconException` (invariants on dates, values) |

### `UpdateContractHandler`

| Step | Source line | Throws |
|---|---|---|
| `ContractId` non-empty | `56-57` | `ContractNotFound` → 404 (re-used for missing id) |
| Contract exists | `61-62` | `ContractNotFound` → 404 |
| Tenant isolation | `64, 166-167` | `OwnerIdNotMatchWithTenantId` → 403 |
| Wallet policy | `67` | Domain policy throws |
| Apps + channels resolve | (same as Create) | `ApplicationNotFound` / `CommunicationChannelNotFound` → 404 |
| `Contract.Update(...)` | `130-138` | Domain throws on invalid transitions |

### `GetContractHandler`

| Step | Source line | Throws |
|---|---|---|
| `ContractId` non-empty | `31-32` | `ContractNotFound` → 404 |
| Contract exists | `36-37` | `ContractNotFound` → 404 |
| Tenant isolation | `39, 44-47` | `OwnerIdNotMatchWithTenantId` → 403 |

### `ListContractsHandler`

| Step | Source line | Throws |
|---|---|---|
| `AccountId` non-empty | `26-27` | `AccountIdRequired` → 400 |
| Tenant isolation | `29-30` | `OwnerIdNotMatchWithTenantId` → 403 |

## Cross-Field Validation

### `IValidateContractWalletStrategyPolicy.Execute(walletSettings, contractCurrency [, nodeType])`

Domain policy that enforces wallet-vs-contract currency compatibility. The exact rule set lives in:
- [CODE] `Falcon.Commerce.Domain/Interfaces/Services/Policies/IValidateContractWalletStrategyPolicy.cs`
- (implementation) `Falcon.Commerce.Application/...` or `Falcon.Commerce.Domain/...`

Typical invariants:
- Wallet must exist before creating a contract (else `WalletSettingsNotConfigured` or similar)
- Contract currency must match wallet currency
- Sub-node contracts may be disallowed per policy

Throws `FalconException` with domain-specific code.

### Tariff plan ID regeneration

[CODE] `CreateContractHandler.cs:152-201`, `UpdateContractHandler.cs:79-128`:

All sub-collection IDs (Rate, UnitConversion, Quota, OverageRate) are regenerated server-side using `ObjectId.GenerateNewId().ToString()[..8].ToUpperInvariant()`. Client-supplied IDs in these fields would be ignored (the wire DTOs don't carry an `Id` for sub-items).

### Date constraints

`StartDate`, `EndDate` are `[Required]` but not range-validated at DTO level. Domain `Contract.Create(...)` is the authoritative validator — likely checks:
- `EndDate > StartDate`
- `StartDate not too far in past`

Verify against domain code.

## Order of Validations

1. JSON deserialization → ModelState
2. `[ApiController]` 400 short-circuit on `[Required]` violations
3. `[Range]` checks on decimal fields
4. Controller → AutoMapper → handler
5. Handler-side validation (per table above)
6. Domain policy (`IValidateContractWalletStrategyPolicy`)
7. Domain entity invariants (`Contract.Create` / `Contract.Update`)

## Cross-Reference to V-rules

[BRAIN-SK] `Brain SK/_obsidian/30-Validation/`:
- (Verify contract-specific V-rules exist) — V-rules for contract creation aren't in the Wave 5a memory snapshot, so this is a candidate area for V-rule authorship

## Findings

1. **`[Required]` on collections is null-check only.** Empty `Rates = []` would pass — handler doesn't verify non-empty. PRD may require at least 1 rate per contract. F-004 candidate.

2. **Currency without `[Required]` defaults to 0.** [CODE] `CreateContractRequest.cs:25-26` — `[EnumDataType]` only. If `eCurrency` enum has no `None=0` member, then 0 would already fail `[EnumDataType]`; if it has `None=0`, then 0 passes silently. Verify enum shape.

3. **No DTO-level cross-field validation (start < end).** Relies on domain layer.

4. **Wallet currency / contract currency mismatch is policy-driven**, not attribute-driven. The error code surfaced depends on `IValidateContractWalletStrategyPolicy` implementation.
