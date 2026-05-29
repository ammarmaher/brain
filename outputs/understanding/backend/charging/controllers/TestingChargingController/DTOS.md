# TestingChargingController — DTOs

> All DTOs declared in `Falcon.Charging.Application.TestingCharging.Models` (in `TestingChargingModels.cs`). Not in the standard `Falcon.Charging.Contracts` project — this is an Application-layer DTO leak. Acceptable because the lab is internal-only.

See [`../../DTO_DICTIONARY.md`](../../DTO_DICTIONARY.md) for the full Charging dictionary.

## Request DTOs

### `TestingChargingCreateWhatsappBatchRequest`

```csharp
// [CODE] TestingChargingModels.cs:12
public class TestingChargingCreateWhatsappBatchRequest
{
    public string AccountId { get; set; } = string.Empty;
    public string OwnerId { get; set; } = string.Empty;
    public string? ChannelId { get; set; }            // null → resolved from active tariff
    public string ApplicationId { get; set; } = string.Empty;
    public string Priority { get; set; } = "UTILITY";
    public string Destination { get; set; } = "ANY";
    public string Unit { get; set; } = "MESSAGE";
    public eCurrency Currency { get; set; } = eCurrency.SAR;
    public int MessageCount { get; set; } = 10;       // clamped to [1, 1000]
    public decimal QuantityPerMessage { get; set; } = 1m;
    public int ReservationTtlSeconds { get; set; } = 3600;  // overridden for Manual mode to ≥3600
    public int Parallelism { get; set; } = 20;        // clamped to [1, 100]
    public string DeliveryMode { get; set; } = "Manual";   // Manual | AutoDelivered | AutoFailed | MixedBySuccessRate
    public decimal? SuccessRate { get; set; }         // 0-100, used only for MixedBySuccessRate
}
```

### `TestingChargingTriggerDeliveryRequest`

```csharp
// [CODE] TestingChargingModels.cs:40
public class TestingChargingTriggerDeliveryRequest
{
    public string DeliveryMode { get; set; } = "AutoDelivered";
    public decimal? SuccessRate { get; set; }
    public List<int>? Sequences { get; set; }         // null → trigger all non-terminal
}
```

### `TestingChargingPagedRequest` (base)

```csharp
// [CODE] TestingChargingModels.cs:47
public class TestingChargingPagedRequest
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 50;
}
```

### `TestingChargingLedgerQuery : TestingChargingPagedRequest`

```csharp
// [CODE] TestingChargingModels.cs:53
public class TestingChargingLedgerQuery : TestingChargingPagedRequest
{
    public string? WalletId { get; set; }
    public string? ContractId { get; set; }
    public string? RefType { get; set; }
    public string? RefId { get; set; }
    public string? LedgerType { get; set; }
    public DateTime? From { get; set; }
    public DateTime? To { get; set; }
}
```

### `TestingChargingReservationQuery : TestingChargingPagedRequest`

```csharp
// [CODE] TestingChargingModels.cs:64
public class TestingChargingReservationQuery : TestingChargingPagedRequest
{
    public string? WalletId { get; set; }
    public string? Status { get; set; }
    public string? RefId { get; set; }
}
```

## Response DTOs

### Paged envelope

```csharp
// [CODE] TestingChargingModels.cs:71
public class TestingChargingPagedResponse<T>
{
    public int Page { get; set; }
    public int PageSize { get; set; }
    public long TotalCount { get; set; }
    public List<T> Items { get; set; } = [];
}
```

### `TestingChargingAccountOverviewResponse`

```csharp
// [CODE] TestingChargingModels.cs:79
public class TestingChargingAccountOverviewResponse
{
    public string AccountId { get; set; }
    public decimal TotalAvailable { get; set; }
    public decimal TotalReserved { get; set; }
    public decimal TotalConsumed { get; set; }
    public int WalletCount { get; set; }
    public int BucketCount { get; set; }
    public int ActiveReservations { get; set; }
    public int CommittedReservations { get; set; }
    public int ReleasedReservations { get; set; }
    public int FailedTestMessages { get; set; }
    public DateTime? LastLedgerTimestamp { get; set; }
    public TestingChargingRunResponse? LastRun { get; set; }   // run summary, messages omitted
}
```

Aggregation rule: `TotalAvailable / TotalReserved / TotalConsumed` come from **`ContractFunded` buckets only** — non-monetary (quota) buckets are excluded. See `[CODE] TestingChargingService.cs:60-62`.

### `TestingChargingWalletSnapshotResponse`

```csharp
// [CODE] TestingChargingModels.cs:95
public class TestingChargingWalletSnapshotResponse
{
    public string WalletId { get; set; }
    public string AccountId { get; set; }
    public string OwnerType { get; set; }              // eOcsWalletOwnerType.ToString()
    public string OwnerId { get; set; }
    public string Channel { get; set; }                 // activated channel id, not "WHATSAPP"
    public string Currency { get; set; }               // eCurrency.ToString() e.g. "SAR"
    public long Version { get; set; }                  // optimistic-concurrency version
    public decimal Available { get; set; }             // sum of ContractFunded bucket Available
    public decimal Reserved { get; set; }
    public decimal Consumed { get; set; }
    public List<TestingChargingBucketResponse> Buckets { get; set; }
}
```

### `TestingChargingBucketResponse`

```csharp
// [CODE] TestingChargingModels.cs:110
public class TestingChargingBucketResponse
{
    public string WalletId { get; set; }
    public string BucketId { get; set; }
    public string? ContractId { get; set; }            // null for Quota-only buckets
    public string BucketType { get; set; }             // ContractFunded | Quota | ...
    public string ServiceScope { get; set; }
    public string Status { get; set; }                 // Active | Expired | ...
    public decimal? TotalAmount { get; set; }
    public decimal? AvailableAmount { get; set; }
    public decimal? ReservedAmount { get; set; }
    public decimal? ConsumedAmount { get; set; }
    public decimal? TotalUnits { get; set; }
    public decimal? RemainingUnits { get; set; }
    public string? QuotaCode { get; set; }
    public string? QuotaCategory { get; set; }
    public string? SubService { get; set; }
    public string? Unit { get; set; }
    public DateTime EffectiveFrom { get; set; }        // UTC
    public DateTime ExpiresAt { get; set; }            // UTC
    public string? EffectiveFromLocalDateTime { get; set; }   // Falcon local business time string
    public string? ExpiresAtLocalDateTime { get; set; }
    public string? BusinessTimeZone { get; set; }
}
```

The two pairs of timestamps (`EffectiveFrom`/`ExpiresAt` UTC vs `*LocalDateTime` formatted strings) coexist because the lab UI shows Falcon-business-local time but downstream tooling needs UTC. See `[CODE] TestingChargingService.cs:541-554` for related local-time handling.

### `TestingChargingReservationResponse`

```csharp
// [CODE] TestingChargingModels.cs:135
public class TestingChargingReservationResponse
{
    public string ReservationId { get; set; }
    public string WalletId { get; set; }
    public string Status { get; set; }                 // eOcsReservationStatus.ToString()
    public string PolicyCode { get; set; }             // e.g. "WA_DELIVERY_COMMIT"
    public string RefType { get; set; }                // e.g. "USAGE"
    public string RefId { get; set; }
    public decimal RatedAmount { get; set; }
    public decimal QuotaUnits { get; set; }
    public decimal BilledUnits { get; set; }
    public DateTime ExpiresAt { get; set; }
    public string AllocationSummary { get; set; }      // joined string: "BucketType:BucketId:Amount, ..."
}
```

### `TestingChargingLedgerEntryResponse`

```csharp
// [CODE] TestingChargingModels.cs:150
public class TestingChargingLedgerEntryResponse
{
    public string Id { get; set; }
    public string WalletId { get; set; }
    public string? BucketId { get; set; }
    public string? ContractId { get; set; }
    public string Type { get; set; }                   // Reserve | Commit | Release | Debit | Credit
    public string RefType { get; set; }
    public string RefId { get; set; }
    public decimal Amount { get; set; }
    public string Currency { get; set; }
    public DateTime CreatedAt { get; set; }            // UTC
}
```

### `TestingChargingBalancesResponse`

```csharp
// [CODE] TestingChargingModels.cs:164
public class TestingChargingBalancesResponse
{
    public List<TestingChargingBalanceSnapshotResponse> WalletSnapshots { get; set; }
    public List<TestingChargingContractBalanceSummaryResponse> ContractSummaries { get; set; }
}
```

### `TestingChargingBalanceSnapshotResponse`

```csharp
// [CODE] TestingChargingModels.cs:170
public class TestingChargingBalanceSnapshotResponse
{
    public string WalletId { get; set; }
    public string OwnerType { get; set; }
    public string OwnerId { get; set; }
    public string Channel { get; set; }
    public string Currency { get; set; }
    public long WalletVersion { get; set; }
    public decimal AvailableBalance { get; set; }
    public decimal ReservedBalance { get; set; }
    public decimal ConsumedBalance { get; set; }
    public decimal RemainingQuotaUnits { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

This is a **projection** from `IWalletBalanceSnapshotRepository` — may lag the source OCS wallet by the projection latency.

### `TestingChargingContractBalanceSummaryResponse`

```csharp
// [CODE] TestingChargingModels.cs:185
public class TestingChargingContractBalanceSummaryResponse
{
    public string ContractId { get; set; }
    public string Currency { get; set; }
    public decimal TotalFundedAmount { get; set; }
    public decimal AvailableAmount { get; set; }
    public decimal ReservedAmount { get; set; }
    public decimal ConsumedAmount { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

**Equivalent of contract-balance read** — per-contract aggregation of all related buckets. Mirrors the production `GetContractBalanceSummariesResponse` (from `WalletController`) but with an `UpdatedAt` field and projection-lag caveat.

### `TestingChargingRunResponse`

```csharp
// [CODE] TestingChargingModels.cs:196
public class TestingChargingRunResponse
{
    public string RunId { get; set; }
    public string AccountId { get; set; }
    public string OwnerId { get; set; }
    public string Channel { get; set; }
    public string ApplicationId { get; set; }
    public string Priority { get; set; }
    public string Destination { get; set; }
    public string Unit { get; set; }
    public string Currency { get; set; }
    public int MessageCount { get; set; }
    public decimal QuantityPerMessage { get; set; }
    public int ReservedCount { get; set; }
    public int CommittedCount { get; set; }
    public int ReleasedCount { get; set; }
    public int FailedCount { get; set; }
    public string DeliveryMode { get; set; }
    public string Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<TestingChargingMessageRecordResponse> Messages { get; set; }
}
```

### `TestingChargingMessageRecordResponse`

```csharp
// [CODE] TestingChargingModels.cs:220
public class TestingChargingMessageRecordResponse
{
    public int Sequence { get; set; }
    public string ReferenceType { get; set; }
    public string ReferenceId { get; set; }            // testing-wa-{runId}-{sequence}
    public string? ReservationId { get; set; }
    public string ReservationStatus { get; set; }      // ReserveFailed | Reserved | Committed | Released | DeliveryFailed
    public string DeliveryStatus { get; set; }
    public decimal RatedAmount { get; set; }
    public decimal QuotaUnits { get; set; }
    public decimal BilledUnits { get; set; }
    public string? Error { get; set; }                 // formatted message: "ErrorCode: Description, ..."
    public DateTime UpdatedAt { get; set; }
}
```

## DeliveryMode Values

The `DeliveryMode` string is normalized server-side via `NormalizeDeliveryMode` (`[CODE] TestingChargingService.cs:569-585`):

| Input | Resolved |
|---|---|
| `Manual`, `MANUAL`, `manual`, `man_ual`, `man-ual` | `TestingChargingDeliveryModes.Manual` |
| `AutoDelivered`, `auto-delivered`, `auto_delivered`, `AUTODELIVERED` | `AutoDelivered` |
| `AutoFailed`, `auto-failed`, `AUTOFAILED` | `AutoFailed` |
| `MixedBySuccessRate`, `mixed-by-success-rate`, `MIXEDBYSUCCESSRATE` | `MixedBySuccessRate` |
| anything else | falls back to `Manual` |

The normalizer strips `_` and `-`, uppercases, then matches against the canonical enum.

## SuccessRate Semantics

For `MixedBySuccessRate`, the formula is deterministic per message sequence:

```csharp
// [CODE] TestingChargingService.cs:522
((sequence - 1) % 100) < Math.Clamp(successRate ?? 50m, 0m, 100m)
```

- `sequence = 1`: index = 0 → commits if successRate ≥ 0 (almost always)
- `sequence = 50, successRate = 50`: index = 49 < 50 → commits
- `sequence = 60, successRate = 50`: index = 59 ≥ 50 → releases
- `sequence = 101`: index = 0 → commits (cycle repeats every 100)

This is **deterministic**, not random — useful for reproducible QA. If you set `successRate = 75`, messages 1-75 commit and 76-100 release in every batch.
