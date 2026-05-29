# CommunicationChannelController — DTOs

> Public contract: `Falcon.Commerce.Contracts/Models/ResponseDtos/CommunicationChannelResponse.cs`
> Internal result type: `Falcon.Commerce.Application/Results/ListCommunicationChannelResult.cs`

## Request DTOs

**None** — endpoint takes no parameters.

## Response DTO

### `CommunicationChannelResponse`

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/CommunicationChannelResponse.cs:1-10`

```csharp
public class CommunicationChannelResponse
{
    public required string Id { get; set; }
    public required string Name { get; set; }
}
```

| Field | Type | Notes |
|---|---|---|
| `Id` | string | CommChannel `_id` from Mongo |
| `Name` | string | **Already-translated** name |

Same shape as `ApplicationResponse` — both global catalogs use the same `{id, name}` wire contract.

### Internal Result Type

[CODE] `Falcon.Commerce.Application/Results/ListCommunicationChannelResult.cs` (inferred from handler):

```csharp
public class ListCommunicationChannelResult
{
    public List<CommunicationChannelResult> CommunicationChannels { get; set; }
}

public class CommunicationChannelResult
{
    public string Id { get; set; }
    public string Name { get; set; }  // translated
}
```

## Cross-Reference to Entity

[CODE] `Falcon.Commerce.Domain/Entities/CommunicationChannel.cs` (entity):

```csharp
public class CommunicationChannel
{
    public string? Id { get; set; }
    public MultiLanguageName Name { get; set; }
    // pricing tiers, visibility, configurations
}
```

Per [MEMORY] `project_commchannels_apps_tabs_backend_integration_plan_2026_05_17`, the entity also carries `details[]` shadow rows for the data-table view — those are exposed via `NodeController` per-account endpoints, not this global one.

## Cross-Reference to V-rules

[BRAIN-SK] `Brain SK/_obsidian/30-Validation/` — V-rules apply to **per-account** comm-channel operations (visibility, pricing, status changes). The global catalog read itself has no V-rule gate.

## Cross-Reference to Frontend

Frontend consumers:
- [CODE] `apps/admin-console/.../org-hierarchy-page/services/comm-channels-catalog.service.ts` (inferred — verify in code map)
- Add Client wizard Step 3 — global catalog hydration

[MEMORY] `project_commchannels_apps_tabs_phase1_2026_05_17` confirms FE uses `GET commerce/Node/{nodeId}/comm-channels/visible/details` for the **per-account** view, not this global list.
