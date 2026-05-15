*** Inbound Webhook — Zitadel → Identity ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: identity/SERVICE_OVERVIEW.md + identity/ENDPOINT_REGISTRY.md ***

# Zitadel Webhook → Identity

> Zitadel pushes user lifecycle events to Identity via a signed HTTP webhook. Identity uses these to keep its local user-status projection consistent with Zitadel's canonical state.

## Topic / channel

- **Endpoint (verbatim):** `POST /api/webhook/zitadel`
- **Channel type:** Inbound HTTP webhook (anonymous + `x-zitadel-signature` HMAC verification)
- **Schema:** Zitadel-defined JSON event payload (varies by event type)

## Producer

- **Service:** [[Zitadel]] (external auth provider)
- **Trigger:** Any of: `UserLocked`, `UserUnlocked`, `UserDeactivated`, `UserReactivated`, `EmailVerified`, `PhoneVerified` (per ENDPOINT_REGISTRY.md). Zitadel signs the body with a pre-shared secret and `POST`s to the Identity endpoint.
- **Payload shape:** Zitadel-native JSON event. **`not documented in detail in Brain Outputs · would need source code scan`** — but at minimum `{ eventType, userId, occurredAt, ...details }`.

## Consumer(s)

- **Service:** [[Identity Service]] — `ZitadelWebhookEndpoint.HandleAsync` (FastEndpoints, in `WebhookEndpointGroup`)
  - Verifies the signature via `ZitadelWebhookSignatureVerifier.Verify(signingKey, signature, body)`
  - Updates user status in Mongo (`User.Status` field): `Pending`, `Active`, `Suspended`, `Locked`, `Deleted` mapping rules apply
  - Invalidates the `HybridCache` entry: `CacheKeys.UserStatus(identityUserId)` in Redis

## Idempotency

- **Partially documented.** HMAC signature verification gates the request. Replay protection is **not documented** — Zitadel's webhook protocol may or may not include a nonce; if not, an attacker (or accidental replay) could re-trigger a status change.

## Error path

- **400** on signature verification failure (anonymous + HMAC means an unauthenticated bad-signature returns a generic auth error).
- **`not documented`** for downstream errors — what happens if Mongo write fails after signature verifies?

## Side effects (chain)

- Identity's `User.Status` updates.
- Redis `UserStatus` cache invalidated.
- Subsequent JWT issuance / refresh-token validity reflects the new status (e.g. `Locked` user can no longer get a new access token).
- Downstream Kafka emission: likely [[identity.user-events.v1]] for role-sync on user deletion / lock — verify the webhook handler actually emits.

## Related PRDs

- [[02 User Management]] — primary

## Related V-rules

- [[V-login-lockout-3-wrong-attempts]] — Zitadel can also lock a user; webhook surfaces that to Falcon
- [[V-user-first-last-name-letters-only]] — irrelevant here, status-only

## Related entity reconciliation

- E-User (Falcon User in Identity Mongo) ↔ E-Zitadel-User (Zitadel canonical)

## Gaps / drift

- Replay protection not documented.
- Whether the webhook handler emits `identity.user-events.v1` after handling status changes is undocumented — would close the loop with PES (role revocation on user lock).
- HMAC signing key rotation procedure undocumented.
- The webhook endpoint is `Anonymous` — relying entirely on HMAC for trust. If the signing key leaks, the endpoint is unauthenticated to attackers.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
