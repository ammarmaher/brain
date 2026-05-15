*** Kafka Event — Identity Settings Sync ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: commerce/SERVICE_OVERVIEW.md + identity/SERVICE_OVERVIEW.md + commerce/controllers/NodeController/FRONTEND_CONTRACT.md ***

# commerce.identity-settings-sync.v1

> Commerce broadcasts that a tenant's identity-related settings changed (password policy, login policy, security level). Identity syncs.

## Topic / channel

- **Topic name (verbatim):** `commerce.identity-settings-sync.v1`
- **Channel type:** Kafka
- **Schema:** Avro

## Producer

- **Service:** [[Commerce Service]]
- **Publisher class:** `TenantIdentitySettingsSyncEventPublisher`
- **Trigger:**
  - Add Client wizard — when the wizard's Settings step (password security level, password policy) submits.
  - Settings page update — when an admin changes the tenant's password / login policy via Commerce.
- **Payload shape:** `inferred` — likely `{ TenantId, PasswordSecurityLevel (enum), PasswordPolicy { MinLength, RequiresUppercase, RequiresDigit, RequiresSpecial, MaxAgeDays }, LoginPolicy { LockoutThreshold, IdleTimeoutMinutes }, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Identity Service]] — `IdentitySettingsSyncConsumer`
  - Updates the tenant settings record in Identity's Mongo.
  - Propagates relevant fields to Zitadel via the Zitadel password-policy / login-policy management SDK calls.

## Idempotency

- **Not documented.** Re-applying the same settings is presumably no-op, but the Zitadel-side propagation may not be idempotent (e.g. policy versioning).

## Error path

- **Not documented.** Zitadel-side failure (e.g. policy validation error from Zitadel) is undocumented — does the consumer fail, retry, or swallow?

## Side effects (chain)

- Identity persists settings.
- Zitadel password / login policies are updated.
- New login attempts immediately use the new policy (Identity's `LoginEligibilityPolicy` reads current state).

## Related PRDs

- [[02 User Management]] — primary (login & password lifecycle)
- [[01 Account Management]] — Commerce owns the settings, which is the trigger

## Related V-rules

- [[V-password-security-level-enum]] — `PasswordSecurityLevel` is enforced at Commerce; Identity consumes the enum value
- [[V-password-complexity-per-security-level]] — Identity's `PasswordPolicy` derives from the security level
- [[V-login-lockout-3-wrong-attempts]] — `LoginEligibilityPolicy` reads from synced settings

## Related entity reconciliation

- E-AccountSettings (Commerce) ↔ E-TenantSettings (Identity) ↔ Zitadel password/login policy

## Gaps / drift

- Zitadel-side error path is the biggest gap — propagation failures could leave Commerce + Identity + Zitadel out of sync.
- The fire-and-forget pattern means a UI confirming "settings saved" may be lying — the actual policy may take seconds to propagate.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
