*** Kafka Event — User Creation Requested ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: commerce/SERVICE_OVERVIEW.md + commerce/controllers/NodeController/FRONTEND_CONTRACT.md + identity/SERVICE_OVERVIEW.md ***

# commerce.user-creation-requested.v1

> Commerce asks Identity to provision a user in Zitadel and seed the Falcon user record. Fires from Add-Client wizard Step 5 (Account-Owner) and from the Add-User wizard.

## Topic / channel

- **Topic name (verbatim):** `commerce.user-creation-requested.v1`
- **Channel type:** Kafka
- **Schema:** Avro (Confluent Schema Registry, BACKWARD compatibility)

## Producer

- **Service:** [[Commerce Service]]
- **Publisher class:** `UserCreationRequestedEventPublisher` (`Falcon.Commerce.Infrastructure/Messaging/`)
- **Trigger:**
  - Add-Client wizard Step 5 (Account-Owner user creation) — `POST /commerce/Node/create-account` → `ICreateMainNodeProcess` orchestrator emits this event after the Account is persisted.
  - Add-User wizard for sub-node / normal-user creation.
- **Payload shape:** `inferred` — likely `{ TenantId, FirstName, LastName, Username, Email, Phone, Role, RequestedByUserId, CorrelationId }`. Avro `.avsc` not surfaced in DTO_DICTIONARY. **`not documented in Brain Outputs · would need source code scan`** for canonical shape.

## Consumer(s)

- **Service:** [[Identity Service]] — `UserCreationRequestedConsumer` (`Endpoints/Webhooks/` or `Infrastructure/Messaging/`, exact location not in scan)
  - Creates the Zitadel user via the Zitadel adapter (`Infrastructure/Identity/`)
  - Seeds the Falcon User record in Mongo in `Pending` status
  - Triggers OTP / welcome-email delivery method (BR-UM)

## Idempotency

- **Not documented.** Identity consumer-side dedup is not surfaced in its SERVICE_OVERVIEW or VALIDATIONS. Replay would re-attempt Zitadel user creation; if Zitadel returns a conflict, behaviour is undefined in the docs.

## Error path

- **Not documented.** No DLQ topic listed in Identity's Kafka section. Zitadel-side failures bubble up as `CreateIdentityUserFailed` (500) on the Identity error code list — whether the Kafka handler swallows or re-throws is not stated.

## Side effects (chain)

- Identity creates the Falcon `User` document in `Pending` state.
- Identity creates the Zitadel user (organization, project membership).
- Identity may emit a delivery-method invocation (email/SMS OTP) — verify.
- Downstream, [[commerce.user-wallet-create.v1]] is published by Commerce (separate orchestrator step) to ask Charging for the sub-wallet.

## Related PRDs

- [[02 User Management]] (primary — owns User lifecycle)
- [[01 Account Management]] (consumer-of-event from the orchestration perspective — Add Client Step 5)

## Related V-rules

- [[V-user-first-last-name-letters-only]] — Identity validates names on consume
- [[V-username-format-uniqueness-immutable]] — Identity-side enforcement
- [[V-password-security-level-enum]] — must be set by Commerce before the user is provisioned (consumed by Identity via `commerce.identity-settings-sync.v1`)

## Related entity reconciliation

- E-User (Falcon User) ↔ E-Zitadel-User (Zitadel identity record)

## Gaps / drift

- **KAFKA-GAP-01 (HIGH)** — Identity SERVICE_OVERVIEW lists the consumed topic as `commerce.user-created.v1`, but Commerce produces `commerce.user-creation-requested.v1`. The consumer **class name** (`UserCreationRequestedConsumer`) matches the producer's intent, so this is documentation drift in one of the two SERVICE_OVERVIEW files, not code drift. **Action:** open the Identity `Program.cs` / Kafka registration file and reconcile the documented topic name.
- Payload schema not in DTO_DICTIONARY for either service. Would need Avro `.avsc` scan.
- Idempotency strategy not documented.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
