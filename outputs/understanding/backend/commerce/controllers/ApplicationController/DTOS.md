# ApplicationController — DTOs

> Public contract: `Falcon.Commerce.Contracts/Models/ResponseDtos/ApplicationResponse.cs`
> Internal result type: `Falcon.Commerce.Application/Results/ListApplicationsResult.cs`

## Request DTOs

**None** — endpoint takes no parameters.

## Response DTO

### `ApplicationResponse`

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/ApplicationResponse.cs:1-8`

```csharp
public class ApplicationResponse
{
    public required string Id { get; set; }
    public required string Name { get; set; }
}
```

| Field | Type | Notes |
|---|---|---|
| `Id` | string | Application `_id` from Mongo (ObjectId as string) |
| `Name` | string | **Already-translated** name (single language, picked by `ITranslateHelper`) |

Both properties use C# `required` modifier — DTOs are construction-strict, but at the wire level both are non-null strings.

### Internal Result Type

[CODE] `Falcon.Commerce.Application/Results/ListApplicationsResult.cs` (not deep-read, inferred from handler):

```csharp
public class ListApplicationsResult
{
    public List<ApplicationResult> Applications { get; set; }
}

public class ApplicationResult
{
    public string Id { get; set; }
    public string Name { get; set; }  // translated
}
```

The handler builds `ApplicationResult` items and the AutoMapper profile flattens to `ApplicationResponse`.

## Cross-Reference to Entity

[CODE] `Falcon.Commerce.Domain/Entities/Application.cs` (entity file — read for entity shape):

```csharp
public class Application
{
    public string? Id { get; set; }
    public MultiLanguageName Name { get; set; }
    // ... pricing, status, audit fields
}
```

The entity carries the full `MultiLanguageName(En, Ar)` tuple. The handler reduces it to a single translated string via `ITranslateHelper.GetTranslation(name)`.

## Cross-Reference to V-rules

This endpoint feeds the global catalog selection in:
- Add Client wizard Step 3/4 — application rows for the new account
- Add User wizard (some flows display application subscription state)

No specific V-rule applies to the global catalog read itself; V-rules apply to **per-account** application operations in NodeController.

## Cross-Reference to PRD

[BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/02-prd/` — search for application-related PRD entries to validate that the wire `{id, name}` shape matches PRD expectations.

## Cross-Reference to Frontend

Frontend consumes via the global application list at:
- [CODE] `apps/admin-console/.../org-hierarchy-page/services/global-applications.service.ts` (inferred — verify in code map)

Or via the Add Client wizard catalog hydration:
- [BRAIN-OUT] `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/08-BACKEND_API.md`

[MEMORY] `project_commchannels_apps_tabs_phase1_2026_05_17` confirms FE uses `GET commerce/Node/{nodeId}/applications` for the **per-account** view, not this global list.
