# InformationController — Validations

## DTO-Level Validation

**None.** No `[Required]`, `[ThrowIfNotPassed]`, `[MaxLength]`, `[EnumDataType]`, or other attributes on any field of `UpdateMainNodeInfoRequest`.

This is **inconsistent with `CreateAccountRequest`** which has heavy `[ThrowIf*]` decoration. F-004 candidate vs PRD V-rules.

## Authorization Validation

- No class-level `[Authorize]`
- No action-level overrides
- Falcon vs Client branching inside the handler ([CODE] `UpdateMainNodeInfoHandler.cs:35-46, 72-75`):
  - Falcon: AccountName + FinanceId writes allowed; duplicate-name check fires
  - Client: those writes are silently **dropped** (the `u.Set(x => x.Name, ...)` is wrapped in `if (Falcon) { ... }`)

**Commented-out role gate** ([CODE] `UpdateMainNodeInfoHandler.cs:32-33`):
```csharp
//if (_currentUser.Roles?.Contains(eUserRoles.NodeAdmin) == true || _currentUser.Roles?.Contains(eUserRoles.NormalUser) == true)
//    throw new FalconException(FalconKeys.Error.UnauthorizedUserToPerformThisAction);
```

Currently dead — any role can hit `Update`. PRD may require this gate to be re-enabled.

## Handler-Level Validation

### `GetMainNodeInfoHandler`

[CODE] `GetMainNodeInfoHandler.cs:16-92` — **no validation**. Filter clauses:
- `n.Id == query.NodeId`
- `n.NodeType == eNodeType.Main`

If no match: returns `null` → AutoMapper produces empty/default response. **No 404.**

### `UpdateMainNodeInfoHandler`

[CODE] `UpdateMainNodeInfoHandler.cs:28-118`

| Step | Source line | Throws |
|---|---|---|
| Command null check | `30-31` | `UpdateRequestCantBeNull` → 400 |
| Falcon duplicate-name check | `37-44` | `DuplicateTenantName` → 409 |
| Image validation (profile picture) | `80` | Domain `FalconException` from `ExtractValidatedBytes` (size/MIME) |
| Address value object validation | `48-55` | Domain `FalconException` from `Address.Create(...)` if invariants violated |
| NodeName value object validation | `74` (Falcon-only) | Domain `FalconException` from `NodeName.Create(...)` |
| Update returns null | `114-115` | `NodeNotFound` → 404 |

## Cross-Field Validation

### Address Value Object

[CODE] `UpdateMainNodeInfoHandler.cs:48-55`:
```csharp
var newAddress = Address.Create(
    command.Country, command.City, command.Street, command.District,
    command.BuildingNumber, command.PostalCode, command.AdditionalAddress);
```

Domain `Address.Create(...)` likely enforces:
- Country required when City provided
- City required when District provided
- City required when Street provided

(Mirroring `CreateAccountRequest` invariants — but the Update endpoint doesn't have explicit DTO checks for these; the domain layer is the only gate.)

### NodeName Value Object

[CODE] `UpdateMainNodeInfoHandler.cs:74`: `NodeName.Create(command.AccountName).Value` (Falcon-only branch). Likely enforces:
- Non-empty
- Max length 30

### ProfilePicture Bytes Validation

[CODE] `UpdateMainNodeInfoHandler.cs:80`:
```csharp
u.Set(x => x.AccountDetails!.ProfilePicture,
      command.ProfilePicture?.ExtractValidatedBytes(_options.Image));
```

`_options.Image` carries:
- Max byte size
- Allowed MIME types
- (Possibly) min/max dimensions

Throws `FalconException` on violation. Image rules live in `appsettings.json:Image:*`.

## Order of Validations

1. JSON deserialization → ModelState (irrelevant — no `[Required]`)
2. `[ApiController]` 400 short-circuit (irrelevant)
3. Controller → AutoMapper → handler
4. Handler null-check
5. (Falcon-only) Regex duplicate-name check
6. Value object construction (Address, NodeName)
7. Image validation
8. Mongo update → null check

## Cross-Reference to V-rules

[BRAIN-SK] `Brain SK/_obsidian/30-Validation/`:
- **V-001** — account name 30-char limit — only enforced via NodeName value object (Falcon path)
- **V-002** — Address cross-field (Country/City/District/Street) — enforced via Address.Create value object
- **V-003** — VAT format — **NOT enforced** anywhere. Drift candidate.
- **V-018** — profile picture size + MIME — enforced via `_options.Image.ExtractValidatedBytes`

## Findings

1. **Silent field drop for Client users.** Client can submit `AccountName` and `FinanceId` and the handler ignores them — no error. UI must hide / disable those inputs for Client; backend won't tell them their input was rejected. **F-021 PES gap.**

2. **No DTO-level field requireds** — the Update endpoint is "best-effort merge" rather than strict update.

3. **`GetMainNodeInfoHandler` returns null silently** when NodeId doesn't match — frontend must handle the empty shape as "not found" without an HTTP error.
