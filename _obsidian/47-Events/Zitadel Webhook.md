*** Webhook — Zitadel → Identity ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/zitadel-webhook.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Zitadel Webhook

> Zitadel pushes user lifecycle events to Identity over HMAC-signed HTTP webhook.

## At a glance

- **Endpoint:** `POST /api/webhook/zitadel`
- **Type:** Inbound HTTP webhook (Anonymous + `x-zitadel-signature` HMAC)
- **Producer:** [[Zitadel]] (external)
- **Consumer:** [[Identity Service]] · `ZitadelWebhookEndpoint.HandleAsync`
- **Event types:** `UserLocked` · `UserUnlocked` · `UserDeactivated` · `UserReactivated` · `EmailVerified` · `PhoneVerified`
- **Verifier:** `ZitadelWebhookSignatureVerifier.Verify(signingKey, signature, body)`
- **Cache invalidated:** Redis `CacheKeys.UserStatus(identityUserId)`

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/zitadel-webhook.md)

## Related PRDs

- [[02 User Management]]

## Related V-rules

- [[V-login-lockout-3-wrong-attempts]]

## Gaps

- Replay protection not documented
- Whether handler re-emits [[Identity User Events]] for PES sync on lock/delete is undocumented
- HMAC key rotation procedure undocumented
- Anonymous endpoint — full trust hinges on HMAC secret hygiene

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
