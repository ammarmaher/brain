# ContractsController — Endpoints

> Class route prefix: `/api/Contracts` ([CODE] `ContractsController.cs:13`). Inherits `[Authorize]` from class.

## Read Endpoints

| Method | Route | Action | Request | Response (T in SOR) | Handler |
|---|---|---|---|---|---|
| GET | `/api/Contracts?accountId=` | `List` | (query `accountId`) | `ContractListResponse` | `IListContractsHandler` |
| GET | `/api/Contracts/{contractId}` | `Get` | (route `contractId`) | `ContractResponse` | `IGetContractHandler` |

### `GET /api/Contracts?accountId=<id>`

[CODE] `ContractsController.cs:38-44`

```csharp
[HttpGet]
public async Task<ActionResult<ServiceOperationResult<ContractListResponse>>> List([FromQuery] string accountId)
{
    var result = await _listContractsHandler.ExecuteAsync(new ListContractsQuery { AccountId = accountId });
    return Ok(ServiceOperationResult<ContractListResponse>.Success(_mapper.Map<ContractListResponse>(result)));
}
```

- `accountId` is **required** (handler raises `AccountIdRequired` if empty)
- Returns summaries only (no tariff plan); ordered by `CreatedAt desc`
- Tenant isolation enforced in handler

### `GET /api/Contracts/{contractId}`

[CODE] `ContractsController.cs:46-52`

```csharp
[HttpGet("{contractId}")]
public async Task<ActionResult<ServiceOperationResult<ContractResponse>>> Get(string contractId)
{
    var result = await _getContractHandler.ExecuteAsync(new GetContractQuery { ContractId = contractId });
    return Ok(ServiceOperationResult<ContractResponse>.Success(_mapper.Map<ContractResponse>(result)));
}
```

- `contractId` is **required**
- Returns full `ContractResponse` with full TariffPlan
- Tenant isolation: client user can only fetch contracts belonging to their tenant ([CODE] `GetContractHandler.cs:44-48`)

## Mutation Endpoints

| Method | Route | Action | Request | Response (T) | Handler |
|---|---|---|---|---|---|
| POST | `/api/Contracts` | `Create` | `CreateContractRequest` | `ContractResponse` | `ICreateContractHandler` |
| PUT | `/api/Contracts/{contractId}` | `Update` | `UpdateContractRequest` (+ contractId route param) | `ContractResponse` | `IUpdateContractHandler` |

### `POST /api/Contracts`

[CODE] `ContractsController.cs:54-60`

```csharp
[HttpPost]
public async Task<ActionResult<ServiceOperationResult<ContractResponse>>> Create(CreateContractRequest request)
{
    var result = await _createContractHandler.ExecuteAsync(_mapper.Map<CreateContractCommand>(request));
    return Ok(ServiceOperationResult<ContractResponse>.Success(_mapper.Map<ContractResponse>(result)));
}
```

- Domain policy `IValidateContractWalletStrategyPolicy.Execute(...)` enforces wallet/currency compatibility
- All app/channel ids must resolve in `Application` + `CommunicationChannel` collections
- Server-generates IDs for Rate/Quota/UnitConversion/OverageRate items

### `PUT /api/Contracts/{contractId}`

[CODE] `ContractsController.cs:62-71`

```csharp
[HttpPut("{contractId}")]
public async Task<ActionResult<ServiceOperationResult<ContractResponse>>> Update(string contractId, UpdateContractRequest request)
{
    var command = _mapper.Map<UpdateContractCommand>(request);
    command.ContractId = contractId;
    var result = await _updateContractHandler.ExecuteAsync(command);
    return Ok(ServiceOperationResult<ContractResponse>.Success(_mapper.Map<ContractResponse>(result)));
}
```

- `contractId` from route is **assigned after mapping** (mapper doesn't see route param)
- Domain `Contract.Update(...)` recomputes status; publishes `ContractActivatedEvent` or `ContractExpiredEvent` accordingly

## PES Keys

| Endpoint | Frontend PES | Backend Gate |
|---|---|---|
| `GET /api/Contracts?accountId=` | `falconAccess.adminConsole.contracts.view` (inferred) | Handler tenant isolation |
| `GET /api/Contracts/{id}` | `falconAccess.adminConsole.contracts.view` | Handler tenant isolation |
| `POST /api/Contracts` | `falconAccess.adminConsole.contracts.create` (inferred) | Handler policy + tenant isolation |
| `PUT /api/Contracts/{id}` | `falconAccess.adminConsole.contracts.edit` (inferred) | Handler tenant isolation + `CanEdit` field |

The `ContractResponse.CanEdit` flag ([CODE] `ContractResponse.cs:30`) is server-side computed — frontend uses this to enable/disable the edit button. Source of `CanEdit`: verify in `Contract.ToResult(...)`.

## Status Codes

| Endpoint | Possible Codes |
|---|---|
| `GET /api/Contracts?accountId=` | 200, 400 (`AccountIdRequired`), 401, 403 (`OwnerIdNotMatchWithTenantId`) |
| `GET /api/Contracts/{id}` | 200, 400 (`ContractNotFound` if id empty), 401, 403, 404 (`ContractNotFound`) |
| `POST /api/Contracts` | 200, 400 (`[Required]` violations, `AccountIdRequired`), 401, 403, 404 (`NodeNotFound`, `ApplicationNotFound`, `CommunicationChannelNotFound`), 422 (wallet policy failures) |
| `PUT /api/Contracts/{id}` | 200, 400, 401, 403, 404 (`ContractNotFound`, `ApplicationNotFound`, `CommunicationChannelNotFound`), 422 (wallet policy) |

## Endpoint Count by HTTP Verb

| Verb | Count |
|---|---:|
| GET | 2 |
| POST | 1 |
| PUT | 1 |
| **Total** | **4** |
