*** Add Client — Backend API surface ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Add Client — Backend API

> Endpoint surface for the Add Client wizard: pre-fetch reads, async uniqueness checks, and the final composite submit.

## Backend endpoint summary

| Method | Path | Service | Auth | Request | Response (T inside `ServiceOperationResult<T>`) | Phase |
|---|---|---|---|---|---|---|
| GET | `/api/Node/ValidateAccountName?AccountName=` | [[Commerce Service]] | class-level `[Authorize]` | (query) | `bool` | Step 1 async uniqueness |
| GET | `/api/Lookup/{id}?name=&code=` | [[Commerce Service]] | class-level `[Authorize]` | (route+query) | `List<Hook<LookupValueResponse>>` | Step 1 country/city/sector dropdowns |
| GET | `/api/CommunicationChannel` | [[Commerce Service]] | class-level `[Authorize]` | — | `List<CommunicationChannelResponse>` | Step 3 master list |
| GET | `/api/Application` | [[Commerce Service]] | class-level `[Authorize]` | — | `List<ApplicationResponse>` | Step 4 master list |
| POST | `/api/user/exist` | [[Identity Service]] | class-level auth (verify) | `UserExistRequest { string Username }` | `ExistResponse { bool Exists }` | Step 5 async uniqueness |
| **POST** | **`/api/Node/create-account`** | **[[Commerce Service]]** | class-level `[Authorize]` (Falcon System Admin + Product enforced via PES at gateway) | **`CreateAccountRequest`** | **`CreateAccountResponse`** (carries new Account Id) | **Step 5 final submit** |

## Gateway routing

- All calls go through the **System Gateway** (`https://localhost:7256` dev / `<system-gateway>` prod) — admin-facing routing. Path transform: gateway strips the `/commerce` prefix and prepends `/api/`. So `POST <system-gateway>/commerce/Node/create-account` → Commerce `POST /api/Node/create-account`.
- Auth header: `Authorization: Bearer <zitadel-jwt>` (Falcon admin user's token).
- Response wrapper: `ServiceOperationResult<T> { bool IsSuccessful, T? Result, List<string> ErrorMessages }`. `ErrorMessages` is **localized strings**, not codes — use HTTP status code for routing logic ([FRONTEND_CONTRACT.md](../../../backend/commerce/FRONTEND_CONTRACT.md)).

## Composite request shape — `CreateAccountRequest`

```jsonc
{
  "Info": { /* Step 1 — ~20 fields, see 02-STEP_1_BASIC_INFO */ },
  "Settings": {
    "PasswordSecurityLevel": <int>,       // ePasswordSecurityLevel enum value
    "AllowedIPs": ["..."],                // optional list
    "MaxNormalUserLimit": 0,
    "MaxSystemUserLimit": 0,
    "MaxNodeLevel": 0,                    // singular per backend
    "BalanceTransferLimit": 0
  },
  "CommChannels": {                        // optional — omit if Step 3 untouched
    "Services": [
      { "AppId": "<channelId>", "PriceType": <int> /* + PriceValue per DTO drill-down */ }
    ]
  },
  "Applications": {                        // optional — omit if Step 4 untouched
    "Services": [
      { "AppId": "<appId>", "PriceType": <int> /* + PriceValue */ }
    ]
  },
  "AccountOwner": {
    "AccountOwnerProfilePictureInfo": null,
    "FirstName": "...",
    "LastName": "...",
    "UserName": "...",
    "Password": null,                      // auto-generated if not supplied
    "NationalId": null,
    "PhoneNumber": "...",
    "EmailAddress": "...",
    "Role": <int>                          // eUserRoles enum value (account-owner)
  },
  "DeliveryMethod": <int>                  // eDeliveryMethod enum value
}
```

## Casing note

Commerce uses **PascalCase** on the wire per `FRONTEND_CONTRACT.md` (deviation from Identity / Contact Group / Templates which use camelCase). The frontend's HttpClient interceptor or DTO module must serialize with PascalCase property names for Commerce calls. **Verify at runtime** — `Microsoft.AspNetCore.Mvc.JsonOptions` may default to camelCase in .NET 6+ without explicit config; check the live response shape and adjust.

## Response shape — `CreateAccountResponse`

- Wrapped in `ServiceOperationResult<CreateAccountResponse>`.
- Carries the new Account `Id` (built via `request.ToResponse(result.Id)` custom mapper).
- Per Commerce convention, response is PascalCase on the wire.

## Pre-load master catalogs at wizard open

Bulk-fetch on wizard open (parallel where safe):

- `GET /api/CommunicationChannel` — Step 3 row data
- `GET /api/Application` — Step 4 row data
- `GET /api/Lookup/{id}` × N — country / city / sector dropdown options (lookup ids TBD per the per-field drill-down)

## Async uniqueness — debounced 300 ms + cancel-on-input

- Account Name (Step 1) → Commerce `GET /api/Node/ValidateAccountName?AccountName=`
- Username (Step 5) → Identity `POST /api/user/exist`

Both checks must cancel any in-flight request on next keystroke to avoid stale results racing.

## Error wrapper

```
ServiceOperationResult<T> {
  bool IsSuccessful,
  T? Result,
  List<string> ErrorMessages   // localized strings — DO NOT parse
}
```

Use HTTP status code as the primary routing signal. Display `errorMessages[0]` directly. See [12-ERROR_STATES](12-ERROR_STATES.md) for the full code → UX mapping.

## See also (Add Client folder)

- [README](README.md) — folder index
- [00-OVERVIEW](00-OVERVIEW.md)
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md)
- [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md)
- [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md)
- [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md)
- [06-STEP_5_ACCOUNT_OWNER](06-STEP_5_ACCOUNT_OWNER.md)
- [07-VALIDATIONS](07-VALIDATIONS.md)
- [09-COMPONENTS](09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[Commerce Service]] · [[Identity Service]] · [[System Gateway Service]] · [[Core Gateway Service]] · [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]]
