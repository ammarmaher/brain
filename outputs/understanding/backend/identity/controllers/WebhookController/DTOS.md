# WebhookController — DTOs

> Unlike other controllers, the webhook does **not** declare a `Request` DTO class. The body is
> consumed as raw `string` + parsed via `JsonDocument`. The structure is implicit — defined by
> Zitadel's webhook schema, parsed by `ExtractUserId(...)` and `ProcessEventAsync(...)`.

## Inbound (Zitadel → Identity)

### Raw request body shape

[CODE] `Endpoints/Webhooks/ZitadelWebhookEndpoint.cs:44-91`

```json
{
  "fullMethod": "/zitadel.user.v2.UserService/LockUser",
  "request": {
    "userId": "289234729023849823"
  }
}
```

Fields actually read:

| Field             | Path                    | Type   | Required? | Used for             |
|---|---|---|---|---|
| `fullMethod`      | root                    | string | Required (else 200 + no-op) | Event mapping via `ZitadelEventMapper.MapToEventType` |
| `userId`          | `request.userId`        | string | Required (else 200 + no-op) | MongoDB user lookup by `IdentityUserId` |

Other fields in the Zitadel payload (timestamp, instance id, organization id, etc.) are
**ignored**. Only these two are consumed.

### `fullMethod` strings recognized

`ZitadelEventMapper.MapToEventType` uses `Contains` substring matching:

| Substring         | Resulting event type            | Mongo effect                 |
|---|---|---|
| `VerifyEmail`     | `user.human.email.verified`     | `IsEmailVerified = true`     |
| `VerifyPhone`     | `user.human.phone.verified`     | `IsPhoneVerified = true`     |
| `LockUser`        | `user.locked`                   | `Status = Locked`            |
| `UnlockUser`      | `user.unlocked`                 | `Status = Active`            |
| `DeactivateUser`  | `user.deactivated`              | `Status = Suspended`         |
| `ReactivateUser`  | `user.reactivated`              | `Status = Active`            |
| (anything else)   | `null`                          | log info, no-op              |

The constants live in [CODE] `Domain/Constants/FalconValues.cs:35-43` (`ZitadelGrpcMethods`).

### Signature header

| Header                | Source            | Verification                              |
|---|---|---|
| `x-zitadel-signature` | Zitadel webhook   | HMAC-SHA256(`body`, `ZitadelOptions.WebhookSigningKey`) → hex-lowercase |

[CODE] `Endpoints/Webhooks/ZitadelWebhookEndpoint.cs:35`,
[CODE] `Infrastructure/Identity/ZitadelWebhookSignatureVerifier.cs:18-31`

## Outbound (response to Zitadel)

Always:

```json
{
  "isSuccessful": true,
  "result": null,
  "errorMessages": []
}
```

— or HTTP 401 with no body (via `Send.UnauthorizedAsync`).

Zitadel typically discards the body and acts only on the HTTP status:
- 2xx → success, no retry
- 401 → bad credential, no retry (admin investigation needed)
- 5xx → retry per Zitadel's webhook retry policy

## Internal types referenced

- `FalconValues.ZitadelEventTypes` ([CODE] `FalconValues.cs:22-30`):
  ```csharp
  EmailVerified    = "user.human.email.verified"
  PhoneVerified    = "user.human.phone.verified"
  UserLocked       = "user.locked"
  UserUnlocked     = "user.unlocked"
  UserDeactivated  = "user.deactivated"
  UserReactivated  = "user.reactivated"
  ```

- `FalconValues.ZitadelGrpcMethods` ([CODE] `FalconValues.cs:35-43`):
  ```csharp
  VerifyEmail     = "VerifyEmail"
  VerifyPhone     = "VerifyPhone"
  LockUser        = "LockUser"
  UnlockUser      = "UnlockUser"
  DeactivateUser  = "DeactivateUser"
  ReactivateUser  = "ReactivateUser"
  ```

## Note: no `Request` DTO class

The endpoint inherits `EndpointWithoutRequest<ServiceOperationResult<object>>` — FastEndpoints
does not run a model binder. The raw `Body` stream is buffered + read manually. This is the right
choice because:
- Zitadel's payload includes fields we don't model (we don't want strict JSON binding to fail).
- Signature verification must run over the **raw** body bytes; deserialized + re-serialized JSON
  would not match the signature.

[CODE] `Endpoints/Webhooks/ZitadelWebhookEndpoint.cs:16` — `EndpointWithoutRequest<ServiceOperationResult<object>>`.
