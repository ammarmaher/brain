# WebhookController — Frontend Contract

> **This endpoint has no frontend.** It is a server-to-server webhook receiver. This page exists to
> document the contract Zitadel must conform to, and to help operators configure the Zitadel side.
> Frontend developers can stop reading here.

## Caller: Zitadel only

The only legitimate caller is Zitadel's webhook subsystem (Actions v2). Configuration on the
Zitadel side lives outside Falcon — see Zitadel admin console "Targets" / "Executions" config.

## Endpoint URL

| Environment | URL (Zitadel-configured target)                                          |
|---|---|
| Local dev   | `https://localhost:7777/api/webhook/zitadel`                              |
| QA / Prod   | `https://identity.<env>.falconhub.space/api/webhook/zitadel`              |

The endpoint is **not** typically exposed through the public gateway. Zitadel runs in the same
trust zone as Falcon services (or has a private route to Identity) and reaches the endpoint
directly.

## Authentication contract

Zitadel must send `x-zitadel-signature: <hex_lowercase_hmac_sha256(body, signing_key)>` on every
webhook call.

The signing key is stored in Identity's config:
```yaml
Zitadel:
  WebhookSigningKey: "<long random secret>"
```
([CODE] `Infrastructure/Identity/ZitadelOptions.cs` — field present in the options object.)

If the key rotates, Zitadel's webhook target config must be updated atomically to match. There is
no support for two simultaneous keys (no rolling-key window).

## Payload contract

Zitadel sends:

```json
{
  "fullMethod": "/zitadel.user.v2.UserService/LockUser",
  "request": {
    "userId": "289234729023849823"
  }
}
```

Other fields are accepted but ignored. The minimal required structure is:
- `fullMethod` (string) — Zitadel gRPC method name, must contain one of the recognized substrings
  (see DTOS.md).
- `request.userId` (string) — Zitadel user id.

## Response contract

| HTTP status | Meaning to Zitadel                                       | Zitadel retry behaviour |
|---|---|---|
| 200 OK      | We received and processed (or tolerated) the event.       | No retry.               |
| 401 Unauthorized | Signature wrong or missing. Falcon does not trust this delivery. | No retry (admin attention needed). |
| 500 Internal Server Error | Falcon failed to write to its store.            | Retry per Zitadel webhook retry policy. |

A 200 response body is always:
```json
{ "isSuccessful": true, "result": null, "errorMessages": [] }
```
Zitadel typically discards the body and acts only on the status code.

## Recognized events

| gRPC method substring | Falcon does                                          |
|---|---|
| `VerifyEmail`         | `IsEmailVerified = true` on the user                 |
| `VerifyPhone`         | `IsPhoneVerified = true` on the user                 |
| `LockUser`            | `Status = Locked`                                    |
| `UnlockUser`          | `Status = Active`                                    |
| `DeactivateUser`      | `Status = Suspended`                                 |
| `ReactivateUser`      | `Status = Active`                                    |

Any other method: 200 OK + log info. Falcon does not error.

## Zitadel-side configuration checklist

For each Zitadel environment that has a paired Identity service:

1. Create a Target (Action v2) pointing to the Identity webhook URL.
2. Set the signing key — match `Zitadel:WebhookSigningKey` in Identity's `appsettings.json`.
3. Set the signature header name to `x-zitadel-signature`.
4. Create an Execution mapping that fires the Target on:
   - `user.lock` / `user.unlock` / `user.deactivate` / `user.reactivate` events (status changes)
   - `user.human.email.verify` / `user.human.phone.verify` events (verification)
5. Ensure retry policy is set per ops preference. Falcon's events are idempotent so retry is safe.

## Local dev convenience

Identity logs every webhook event at Info / Warning level. To debug a failing event flow:
1. `docker logs falcon-core-identity-svc` (or run via `dotnet run` directly).
2. Look for "Zitadel webhook signature verification failed" → check signing key parity.
3. Look for "Zitadel webhook received unrecognized method" → confirm Zitadel's gRPC method name.
4. Look for "with identity ID {} not found" → user doesn't exist in Mongo. Did Zitadel send an
   event for a user that was never created via `POST /api/user/`?

## No FE coupling

There is nothing the FE needs to know or do for this endpoint to function. The only observable FE
behaviour comes via `/api/security/user-status/{id}` (SecurityController) — which reads the cache
that this webhook invalidates. So when an admin locks a user in the Zitadel console:
1. Zitadel calls our webhook → Mongo updates → cache invalidates.
2. Next time the user's session hits the gateway → gateway calls `/api/security/user-status/{id}`
   → sees `Locked` → blocks request.
3. FE sees 403 / 401 from the gateway and redirects to login.
