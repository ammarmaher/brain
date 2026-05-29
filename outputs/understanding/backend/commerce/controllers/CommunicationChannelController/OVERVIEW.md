# CommunicationChannelController — Drill-down

> File: `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Controllers/CommunicationChannelController.cs` (33 lines)
> 1 endpoint — global CommChannel catalog read. Mirrors `ApplicationController` structurally.

## Purpose

Returns the **global communication channel catalog** (all `CommunicationChannel` documents in Mongo). Used by:
- Falcon admin CommChannel-management page (list)
- Add Client wizard Step 3 — to populate the per-account comm-channel rows
- Wallet configuration (when `MultipleWallets` is chosen, each visible channel becomes a wallet target)

Note: **Per-account** comm-channel data (visibility, pricing, status, scheduled changes) is owned by `NodeController` — see [`../NodeController/`](../NodeController/). Account-hierarchy aggregation returns **visible-only** comm-channels per account via `GetAccountHierarchyController` and `NodeController` `comm-channels/visible/details`.

## Architecture

- Constructor injection (3 dependencies)
- AutoMapper maps `List<CommunicationChannelResult>` → `List<CommunicationChannelResponse>`

```csharp
public CommunicationChannelController(
    IListCommunicationChannelHandler listCommunicationChannelHandler,
    IMapper mapper)
{
    _listCommunicationChannelHandler = listCommunicationChannelHandler;
    _mapper = mapper;
}
```

[CODE] `CommunicationChannelController.cs:14-22`

## Route Prefix

`/api/CommunicationChannel` (via `[Route("api/[controller]")]`).

## Authorization

- Class-level: `[Authorize]` and `[ApiController]`
- No action-level overrides → any authenticated JWT (Falcon or Client)

## Collaborators

| Type | Used For |
|---|---|
| `IListCommunicationChannelHandler` | Returns all comm channels |
| `IRepository<CommunicationChannel>` (inside handler) | `_communicationChannelRepo.GetListAsync(_ => true, ...)` |
| `ITranslateHelper` | Translates `MultiLanguageName` to caller's language |

## Kafka Events

**None.** Pure read endpoint.

## Findings

1. **Returns full catalog with no pagination, filter, or search** — same as ApplicationController. Verify CommChannel document count fits "small catalog" pattern.

2. **Translation happens server-side** ([CODE] `ListCommunicationChannelHandler.cs:34-35`) — `_translateHelper.GetTranslation(ch.Name)`. Frontend receives single translated string per channel, not the multi-language tuple.

3. **No tenant-scoped filtering** — the catalog is global. Per-account visibility lives in `Node.CommChannels[]` (handled by `NodeController.GetAccountCommunicationChannels` + `/visible` + `/visible/details` variants).

4. **No `[Authorize(Policy=FalconOnly)]` override** — both Falcon and Client users can list channels. Same rationale as ApplicationController.

5. **No default sort** — Mongo natural order. Verify PRD requirement.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
