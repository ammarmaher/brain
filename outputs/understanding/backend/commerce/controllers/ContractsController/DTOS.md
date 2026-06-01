# ContractsController — DTOs

> Public contract files: `Falcon.Commerce.Contracts/Models/{RequestsDtos,ResponseDtos}/{Create,Update}Contract*.cs` + `ContractResponse.cs`

## Request DTOs

### `CreateContractRequest`

[CODE] `Falcon.Commerce.Contracts/Models/RequestsDtos/CreateContractRequest.cs:6-36`

```csharp
public class CreateContractRequest
{
    [Required] public string AccountId { get; set; }
    [Required] public string ContractName { get; set; }
    public string? FarabiReferenceId { get; set; }
    [Required] public DateTime StartDate { get; set; }
    [Required] public DateTime EndDate { get; set; }
    [Range(typeof(decimal), "0.0000001", "79228162514264337593543950335")]
    public decimal CommittedValue { get; set; }
    [EnumDataType(typeof(eCurrency))] public eCurrency Currency { get; set; }
    [Required] public List<ContractRateRequest> Rates { get; set; } = [];
    public List<ContractUnitConversionRequest> UnitConversions { get; set; } = [];
    public List<ContractQuotaRequest> Quotas { get; set; } = [];
    public List<ContractOverageRateRequest> OverageRates { get; set; } = [];
}
```

| Field | Validation | Notes |
|---|---|---|
| `AccountId` | `[Required]` | Account (Main) node id |
| `ContractName` | `[Required]` | Free-form label |
| `FarabiReferenceId` | None | Optional external ref |
| `StartDate` / `EndDate` | `[Required]` | DateTime — verify time-zone handling |
| `CommittedValue` | `[Range(0.0000001, decimal.MaxValue)]` | Min `0.0000001` — zero is rejected |
| `Currency` | `[EnumDataType]` only — **no `[Required]`** | Defaults to `eCurrency.None` (= 0) if missing |
| `Rates` | `[Required]` | Empty list passes `[Required]` (instance-not-null check) — content not gated at DTO |
| `UnitConversions` / `Quotas` / `OverageRates` | None | All optional |

### `UpdateContractRequest`

[CODE] `Falcon.Commerce.Contracts/Models/RequestsDtos/CreateContractRequest.cs:38-65`

Same shape as Create **minus `AccountId`** (the contract's account is immutable post-create; `contractId` comes from route).

### Nested Request DTOs

#### `ContractRateRequest`

```csharp
[Required] public string ApplicationId { get; set; }
[Required] public string ChannelId { get; set; }
[Required] public string Priority { get; set; }
[Required] public string Destination { get; set; }
[Required] public string Unit { get; set; }
[Range(0, decimal.MaxValue)] public decimal RatePerUnit { get; set; }
```

#### `ContractUnitConversionRequest`

```csharp
[Required] public string Code { get; set; }
[Required] public string Name { get; set; }
[Required] public string PriceUnit { get; set; }
[Required] public string RatingUnit { get; set; }
[Range(0, decimal.MaxValue)] public decimal PriceValue { get; set; }
```

#### `ContractQuotaRequest`

```csharp
[Required] public string QuotaCode { get; set; }
[Required] public string ChannelId { get; set; }
[Range(0, decimal.MaxValue)] public decimal IncludedAmount { get; set; }
[Range(0, decimal.MaxValue)] public decimal IncludedUnits { get; set; }
[Required] public string Unit { get; set; }
[Required] public string QuotaCategory { get; set; }
[Required] public string QuotaType { get; set; }
[Required] public string Scope { get; set; }
public string? SubService { get; set; }
```

#### `ContractOverageRateRequest`

```csharp
[Required] public string SubService { get; set; }
[Required] public string ChannelId { get; set; }
[Required] public string Unit { get; set; }
[Range(0, decimal.MaxValue)] public decimal UnitPrice { get; set; }
[Required] public string BillingCycle { get; set; }
```

## Response DTOs

### `ContractSummaryResponse` (used in `ContractListResponse.Contracts[]`)

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/ContractResponse.cs:10-24`

```csharp
public class ContractSummaryResponse
{
    public string ContractId { get; set; }
    public string ContractName { get; set; }
    public string FarabiReferenceId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string StartLocalDateTime { get; set; }
    public string EndLocalDateTime { get; set; }
    public string BusinessTimeZone { get; set; }
    public decimal? CommittedValue { get; set; }
    public decimal? RemainingBalance { get; set; }    // <-- hard-coded null in list, see Finding
    public string Status { get; set; }                 // lowercased — see ListContractsHandler:47
}
```

### `ContractResponse` (full, extends `ContractSummaryResponse`)

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/ContractResponse.cs:26-32`

```csharp
public class ContractResponse : ContractSummaryResponse
{
    public string AccountId { get; set; }
    public eCurrency Currency { get; set; }
    public bool CanEdit { get; set; }
    public ContractTariffPlanResponse TariffPlan { get; set; }
}
```

### `ContractListResponse`

```csharp
public class ContractListResponse
{
    public List<ContractSummaryResponse> Contracts { get; set; } = [];
}
```

### `ContractTariffPlanResponse`

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/ContractResponse.cs:34-43`

```csharp
public class ContractTariffPlanResponse
{
    public string TariffPlanId { get; set; }
    public string Name { get; set; }
    public eCurrency Currency { get; set; }
    public List<ContractRateResponse> Rates { get; set; }
    public List<ContractUnitConversionResponse> UnitConversions { get; set; }
    public List<ContractQuotaResponse> Quotas { get; set; }
    public List<ContractOverageRateResponse> OverageRates { get; set; }
}
```

### Nested Response items

Each item gets a server-generated id prefix (RATE-/UC-/Q-/OR-) and a `Status` string ("ACTIVE" on creation). Channel and Application names are **resolved** server-side and returned as translated strings (e.g. `ContractRateResponse.ApplicationName`, `ContractRateResponse.ChannelName`).

## Internal Command/Query Types

| Internal | Used By |
|---|---|
| `ListContractsQuery { AccountId }` | `List` |
| `GetContractQuery { ContractId }` | `Get` |
| `CreateContractCommand` (mapped) | `Create` |
| `UpdateContractCommand` (mapped) | `Update` |

## Cross-Reference

- [VAULT] `falcon-wiki/50-Services/commerce-contracts.md` (if present) — contract domain rules
- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/02-prd/PRD-Contracts.md` (if present)
- [CODE] `Falcon.Commerce.Domain/Entities/Contracts/Contract.cs` — entity + invariants
- [CODE] `Falcon.Commerce.Domain/Interfaces/Services/Policies/IValidateContractWalletStrategyPolicy.cs` — policy contract
