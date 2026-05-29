# InformationController — DTOs

> Public contract: `Falcon.Commerce.Contracts/Models/{RequestsDtos,ResponseDtos}/{Get,Update}MainNodeInfo*.cs`

## Request DTOs

### `UpdateMainNodeInfoRequest` (~19 fields)

[CODE] `Falcon.Commerce.Contracts/Models/RequestsDtos/UpdateMainNodeInfoRequest.cs:1-28`

```csharp
public class UpdateMainNodeInfoRequest
{
    public string NodeId { get; set; }
    public string AccountName { get; set; }              // Falcon-only write
    public string AccountId { get; set; }
    public string FinanceId { get; set; }                // Falcon-only write
    public eClassificationCategory? ClassificationCategory { get; set; }
    public eClassificationSubCategory? ClassificationSubCategory { get; set; }
    public string EntityName { get; set; }
    public eAuthorityLetterType? AuthorityLetterType { get; set; }
    public string Sector { get; set; }
    public string BudgetNo { get; set; }                 // -> OfficialData.LicenseNo (renamed in domain)
    public string Country { get; set; }
    public string City { get; set; }
    public string District { get; set; }
    public string Street { get; set; }
    public string BuildingNumber { get; set; }
    public string PostalCode { get; set; }
    public string AdditionalAddress { get; set; }
    public string AnotherId { get; set; }
    public string VatRegistrationNumber { get; set; }
    public ProfilePictureInfo ProfilePicture { get; set; }
}
```

| Field | Type | Validation | Role gating | Notes |
|---|---|---|---|---|
| `NodeId` | string | None at DTO | All | Required at handler — empty NodeId → no update (silent miss) |
| `AccountName` | string | None | **Falcon-only** | Duplicate check fires for Falcon; Client write silently dropped |
| `AccountId` | string | None | All | Free-form identifier (not the node id) |
| `FinanceId` | string | None | **Falcon-only** | Client write silently dropped |
| `ClassificationCategory` | enum? | None | All | |
| `ClassificationSubCategory` | enum? | None | All | |
| `EntityName` | string | None | All | |
| `AuthorityLetterType` | enum? | None | All | |
| `Sector` | string | None | All | |
| `BudgetNo` | string | None | All | **Maps to `OfficialData.LicenseNo` in domain** — name asymmetry |
| Address fields (Country..AdditionalAddress) | string | None | All | Constructed via `Address.Create(...)` value object |
| `AnotherId` | string | None | All | |
| `VatRegistrationNumber` | string | None | All | |
| `ProfilePicture` | `ProfilePictureInfo` | Handler-side: `ExtractValidatedBytes(_options.Image)` | All | Has max-size / mime-type checks from `ConfigurationSettings.Image` |

**No `[Required]`, `[ThrowIfNotPassed]`, or `[MaxLength]` on any field.** Validation is fully handler-side. F-004 candidate vs. PRD V-rules.

## Response DTOs

### `GetMainNodeInfoResponse` (read shape — nullable string fields)

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/GetMainNodeInfoResponse.cs:1-27`

```csharp
public class GetMainNodeInfoResponse
{
    public string? AccountName { get; set; }
    public string? AccountId { get; set; }
    public string? FinanceId { get; set; }
    public eClassificationCategory? ClassificationCategory { get; set; }
    public eClassificationSubCategory? ClassificationSubCategory { get; set; }
    public string? EntityName { get; set; }
    public eAuthorityLetterType? AuthorityLetterType { get; set; }
    public string? Sector { get; set; }
    public string? BudgetNo { get; set; }
    public string? Country { get; set; }
    public string? City { get; set; }
    public string? District { get; set; }
    public string? Street { get; set; }
    public string? BuildingNumber { get; set; }
    public string? PostalCode { get; set; }
    public string? AdditionalAddress { get; set; }
    public string? AnotherId { get; set; }
    public string? VatRegistrationNumber { get; set; }
    public string? ProfilePicture { get; set; }          // string? — base64 or URL? verify mapper
}
```

All strings are `?` — the read shape acknowledges that any field can be null (especially during transitional / partially-filled accounts).

### `UpdateMainNodeInfoResponse` (write echo — non-nullable strings)

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/UpdateMainNodeInfoResponse.cs:1-29`

```csharp
public class UpdateMainNodeInfoResponse
{
    public string NodeId { get; set; }
    public string AccountName { get; set; }
    public string AccountId { get; set; }
    public string FinanceId { get; set; }
    public eClassificationCategory ClassificationCategory { get; set; }     // Non-nullable enum (?)
    public eClassificationSubCategory ClassificationSubCategory { get; set; }
    public string EntityName { get; set; }
    public eAuthorityLetterType AuthorityLetterType { get; set; }            // Non-nullable enum (?)
    public string Sector { get; set; }
    public string BudgetNo { get; set; }
    // ... all string fields non-null
    public string ProfilePicture { get; set; }
}
```

**Asymmetry with read shape** — write echo has all-non-null fields. See OVERVIEW.md Finding #6.

**Enum-nullability deviation:** `ClassificationCategory` is `enum?` on request + read but **non-nullable** on UpdateResponse. The handler echoes whatever was sent; if Client sent `null`, the response gets `default(enum)` which is enum value 0 — typically the `None` value but may be undefined in the enum.

### Nested `ProfilePictureInfo`

(Not deep-read in this pass — likely contains `{ Base64: string, MimeType: string }` or `{ Bytes: byte[], FileName: string }`. Verify against entity / shared models.)

## Cross-Reference to Entity

[CODE] `Falcon.Commerce.Domain/Entities/Node/Node.cs` — `Node.AccountDetails` contains:
- `Id` (= `AccountId` in DTO)
- `FinanceId`
- `ProfilePicture` (bytes)
- `ClassificationCategory` / `ClassificationSubCategory`
- `OfficialData`:
  - `EntityName`, `AnotherId`, `AuthorityLetterType`
  - `LicenseNo` (= `BudgetNo` in DTO) — **field rename through DTO**
  - `Sector`, `VatRegistrationNumber`
  - `Address` value object: Country, City, District, Street, BuildingNumber, PostalCode, AdditionalAddress

## Cross-Reference to V-rules

[BRAIN-SK] `Brain SK/_obsidian/30-Validation/`:
- V-001 — Account name validation (max 30 chars per platform standard) — **NOT enforced on Update**, only on Create. Drift.
- V-002 — Address cross-field validation (Country required when City provided) — NOT enforced. Drift.
- V-003 — VAT registration format — NOT enforced. Drift.
- V-018 — Profile picture max size — enforced via `_options.Image.ExtractValidatedBytes(...)`

## Cross-Reference to PRD

[BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/02-prd/` — verify the editable-by-role field matrix.

## Cross-Reference to Frontend

Consumer is likely the account-info drawer / edit panel in org-hierarchy page:
- [CODE] `apps/admin-console/.../org-hierarchy-page/tab-components/account-info-tab/services/account-info.service.ts` (inferred — verify)
- Add Client wizard Step 1 also POSTs full account info via `create-account` (NodeController), but Edit Account flows through this controller.
