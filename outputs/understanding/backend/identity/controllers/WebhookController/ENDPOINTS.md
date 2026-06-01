# WebhookController — Endpoints

> One endpoint. Route prefix `/api/webhook/`. Anonymous + HMAC-signature-gated.

## Endpoint table

| # | Method | Route                  | Endpoint class            | Body shape                                     | Response (T)            | Auth                                  |
|---|--------|------------------------|---------------------------|------------------------------------------------|-------------------------|---------------------------------------|
| 1 | POST   | `/api/webhook/zitadel` | `ZitadelWebhookEndpoint`  | raw Zitadel webhook JSON (see DTOS.md)         | `object` (always null)  | Anonymous + `x-zitadel-signature` HMAC verification |

## Endpoint method-level docs

### 1. POST /api/webhook/zitadel
[CODE] `Endpoints/Webhooks/ZitadelWebhookEndpoint.cs:12-145`

**Steps**:

1. **Enable buffering + read raw body**:
   ```csharp
   httpRequest.EnableBuffering();
   using var reader = new StreamReader(httpRequest.Body);
   var body = await reader.ReadToEndAsync(ct);
   ```
   `EnableBuffering` lets the stream be re-read; necessary because the model binder doesn't run
   (we use `EndpointWithoutRequest`) so the body is what we want raw.

2. **Verify signature**:
   ```csharp
   var signature = httpRequest.Headers["x-zitadel-signature"].FirstOrDefault() ?? "";
   if (!ZitadelWebhookSignatureVerifier.Verify(signingKey, signature, body))
       { await Send.UnauthorizedAsync(ct); return; }
   ```
   Returns HTTP 401 on signature failure — Zitadel typically does not retry 401s.

3. **Parse JSON, extract `fullMethod`**:
   ```csharp
   var payload = JsonDocument.Parse(body);
   if (!payload.RootElement.TryGetProperty("fullMethod", out var methodElement)) {
       // log + 200 OK + return  (Zitadel won't retry)
   }
   var grpcMethod = methodElement.GetString();
   ```

4. **Map gRPC method to event type**:
   ```csharp
   var eventType = ZitadelEventMapper.MapToEventType(grpcMethod);
   if (eventType is null) { /* unrecognized — log info, 200 OK */ }
   ```

5. **Extract `request.userId`**:
   ```csharp
   if (root.TryGetProperty("request", out var request) &&
       request.TryGetProperty("userId", out var userId))
       return userId.GetString();
   return null;
   ```
   Missing → log warn, 200 OK.

6. **Apply event** (`ProcessEventAsync`):
   ```csharp
   var user = await userRepository.GetAsync(u => u.IdentityUserId == identityUserId && !u.IsDeleted);
   if (user is null) { /* log warn, skip */ }

   switch (eventType) {
     case "user.locked":          status = Locked     break;
     case "user.unlocked":        status = Active     break;
     case "user.deactivated":     status = Suspended  break;
     case "user.reactivated":     status = Active     break;
     case "user.human.email.verified": IsEmailVerified = true  break;
     case "user.human.phone.verified": IsPhoneVerified = true  break;
     default: log info, no-op
   }
   ```
   Each case calls `userRepository.UpdateOneAsync(predicate, builder)` with the relevant `Set(...)`
   and always also sets `UpdatedAt = now`.

7. **Invalidate cache**:
   ```csharp
   await cache.RemoveAsync(CacheKeys.UserStatus(identityUserId), ct);
   ```

8. **Return 200**:
   ```csharp
   await Send.OkAsync(ServiceOperationResult<object>.Success(null!), ct);
   ```

## Stage / state transitions (Mongo `eUserStatus`)

| Event                       | Before (Mongo)                       | After (Mongo)                       |
|---|---|---|
| `user.locked`               | any (typically Active)               | `Locked`                            |
| `user.unlocked`             | `Locked`                             | `Active`                            |
| `user.deactivated`          | Active / Pending                     | `Suspended`                         |
| `user.reactivated`          | `Suspended` / `Locked`               | `Active`                            |
| `user.human.email.verified` | (any) IsEmailVerified=false          | (status unchanged) IsEmailVerified=true |
| `user.human.phone.verified` | (any) IsPhoneVerified=false          | (status unchanged) IsPhoneVerified=true |

⚠ **No `UserStatusTransitionPolicy` check.** Webhook accepts illegal transitions silently. This is
intentional — Zitadel is the source of truth, so if Zitadel says Suspended → Locked happened, Mongo
mirrors it without question.

## Status code mapping

| Endpoint               | 200                                              | 401                              |
|---|---|---|
| POST /webhook/zitadel | always (incl. malformed/unrecognized payloads)   | bad signature only                |

500 may be returned if the Mongo write or cache `RemoveAsync` throws.

## Endpoint count by verb

| Verb | Count |
|---|---:|
| POST | 1 |
| **Total** | **1** |
