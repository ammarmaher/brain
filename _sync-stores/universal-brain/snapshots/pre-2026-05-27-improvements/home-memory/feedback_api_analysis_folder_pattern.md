---
name: API analysis folder pattern (app → controller → endpoint)
description: Every Brain API analysis must use the strict app-folder/controller-folder/endpoint-folder hierarchy
type: feedback
originSessionId: f1afca13-882b-4599-8532-38124ed50b1c
---
When generating API/DTO analysis under `Brain/Brain Generated/analysis/L3-technical/api-analysis/`, the folder hierarchy MUST be:

```
api-analysis/
  <service-or-app-name>/                    ← one folder per backend service / app
    INDEX.md                                ← service overview + inventory
    _platform-primitives.md                 ← shared types (ServiceOperationResult, MultiLanguageName, ...)
    <ControllerName>/                       ← one folder per controller class (or endpoint group / pass-through cluster)
      README.md                             ← controller metadata
      <Verb>-<MethodName>/                  ← one folder per HTTP endpoint
        endpoint.md
        request.md
        response.md
        dtos.md
```

**Why:** The user enforced this on 2026-05-01 to keep the analysis browsable for a greenfield frontend rebuild — engineers should be able to drill `service → controller → endpoint` without ambiguity.

**How to apply:**
- Service folder name = lowercase short name of the backend service (e.g. `core-commerce`, `core-charging`, `core-identity`, `core-gateway`, `core-provisioning`, `system-gateway`).
- Controller folder name = exact C# class name with `Controller` suffix retained (`AccountsController`, `WalletController`). For services without controllers (gateway YARP + FastEndpoints, FastEndpoints groups), use the endpoint-group name (`AuthEndpointGroup`, `Commerce-PassThrough`, `AccountHierarchyAggregation`).
- Endpoint folder name = `<HTTP-VERB>-<MethodName>` (e.g. `POST-CreateAccount`, `GET-GetById`, `PUT-UpdateName`).
- Every endpoint folder MUST contain all four files: `endpoint.md`, `request.md`, `response.md`, `dtos.md`. Do not omit any.

**Do not** flatten endpoints under the controller folder. Do not put DTOs at the service root — they belong inside each endpoint's `dtos.md` (recursively resolved). The only service-level DTO file allowed is `_platform-primitives.md` for shared wrappers (`ServiceOperationResult<T>`, `MultiLanguageName`, `MoneyValue`).

If a regression appears (endpoints flattened, DTOs orphaned, controller folders missing), fix the pattern before merging any new analysis.
