*** Add Client — Kafka side effects ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Add Client — Kafka side effects on submit

> When `POST /api/Node/create-account` succeeds (200, `IsSuccessful: true`), Commerce's `CreateMainNodeProcess` handler triggers a multi-service Kafka chain. Understanding this chain is essential for partial-failure UX and for testing the cross-service contract.

## Server-side effects on success

When `POST /api/Node/create-account` returns 200 with `IsSuccessful: true`, the Commerce handler `CreateMainNodeProcess` has:

1. Created the **Root → Main Node** binding (Main Node persisted with the AccountName).
2. Created the **Account** entity bound to the Main Node (`Account` entity with `Id`, `TenantId`, `CreatedAt`).
3. Created the **AccountSettings** record (password level, IPs, limits).
4. Created **CommChannelConfig × N** for each `CommChannels.Services` entry (default status `InActive (First Time)`).
5. Created **AppConfig × N** for each `Applications.Services` entry.
6. **Produced Kafka events** (per Commerce SERVICE_OVERVIEW):
   - `commerce.user-creation-requested.v1` (`UserCreationRequestedEventPublisher`) → consumed by [[Identity Service]] (`UserCreationRequestedConsumer`) to create the AO user (`POST /api/user` semantics) → Identity creates the Zitadel user, applies the password policy from Step 2's level, sends credentials per `DeliveryMethod`.
   - `commerce.wallet-configured.v1` (`WalletConfiguredEventPublisher`) → consumed by [[Charging Service]] (`WalletConfiguredEventConsumer`) to materialize the wallet topology (Master Wallet abstract + per-comm-channel sub-wallets if Multiple-wallet mode).
   - `commerce.identity-settings-sync.v1` (`TenantIdentitySettingsSyncEventPublisher`) → tells Identity (and others) tenant identity settings changed.
   - `commerce.tenant-ip-allowlist-changed.v1` (`TenantIpAllowlistChangedEventPublisher`) → tells [[Core Gateway Service]] to refresh its Redis IP-allowlist cache.
7. Returned `CreateAccountResponse` carrying the new Account `Id` (built via `request.ToResponse(result.Id)` custom mapper).

## Kafka event table

| Topic | Producer | Consumer | Side effect |
|---|---|---|---|
| `commerce.user-creation-requested.v1` | Commerce `UserCreationRequestedEventPublisher` | [[Identity Service]] `UserCreationRequestedConsumer` | Creates Zitadel user · applies `PasswordPolicy(level)` from Step 2 · sends credentials per `DeliveryMethod` |
| `commerce.wallet-configured.v1` | Commerce `WalletConfiguredEventPublisher` | [[Charging Service]] `WalletConfiguredEventConsumer` | Materializes Master Wallet (abstract aggregate) + per-comm-channel sub-wallets if Multiple-wallet mode |
| `commerce.identity-settings-sync.v1` | Commerce `TenantIdentitySettingsSyncEventPublisher` | [[Identity Service]] (and others) | Syncs tenant identity settings |
| `commerce.tenant-ip-allowlist-changed.v1` | Commerce `TenantIpAllowlistChangedEventPublisher` | [[Core Gateway Service]] | Refreshes Redis IP allowlist cache |

## Sequence diagram (textual)

```
Admin (Falcon System Admin / Product)
    │
    ▼
[Admin Console — Add Client button] ────► [System Gateway: 7256]
                                              │
                                              ▼
                         [Commerce: POST /api/Node/create-account] ───┐
                                              │                       │ persists:
                                              │                       │  - Main Node
                                              │                       │  - Account
                                              │                       │  - AccountSettings
                                              │                       │  - CommChannelConfig × N
                                              │                       │  - AppConfig × N
                                              │                       │
                                              │                       ▼
                                              │    ┌──── Kafka: commerce.user-creation-requested.v1 ────► [Identity Service]
                                              │    │                                                          │
                                              │    │                                                          ▼
                                              │    │                                            creates Zitadel user · applies PasswordPolicy(level)
                                              │    │                                            · sends credentials per DeliveryMethod
                                              │    │
                                              │    ├──── Kafka: commerce.wallet-configured.v1 ────► [Charging Service]
                                              │    │                                                   │
                                              │    │                                                   ▼
                                              │    │                                       materializes Master Wallet (abstract)
                                              │    │                                       + sub-wallets per topology
                                              │    │
                                              │    ├──── Kafka: commerce.identity-settings-sync.v1 ────► [Identity Service]
                                              │    │
                                              │    └──── Kafka: commerce.tenant-ip-allowlist-changed.v1 ────► [Core Gateway]
                                              │                                                                  │
                                              │                                                                  ▼
                                              │                                                       refreshes Redis IP allowlist cache
                                              ▼
                              returns ServiceOperationResult<CreateAccountResponse>
                                              │
                                              ▼
[Admin Console: success toast · navigate to Org Hierarchy with new client highlighted]
```

## Partial-failure UX

The Account may have been **created server-side** before a downstream Kafka consumer (Identity AO user creation) failed. Surface a clear partial-failure UX when codes like `CreateIdentityUserFailed`, `GetIdentityUserFailed`, `ExternalServiceError`, `ExternalServiceConnectionError`, `ExternalServiceTimeout`, or `ZitadelCreateMachineUserFailed` appear (500 class).

**Recommended toast copy:** "Account created but Account Owner creation failed — contact support". **Preserve wizard state** so the operator can retry Step 5 user creation. See [12-ERROR_STATES](12-ERROR_STATES.md) for the full mapping.

## Cross-flow dependencies

- **[[Add User Flow]] (specialist Flow-B):** Step 5 produces `UserCreationRequested` which lands in PRD-02's W1 Add User flow server-side. Same validation surface applies: `V-user-first-last-name-letters-only`, `V-username-format-uniqueness-immutable`, `V-password-complexity-per-security-level`.
- **Wallet topology:** `WalletConfigured` triggers Charging to set up the Master Wallet (abstract aggregate with lump sum = 0 until first contract activates per BR-AM-28). See [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md).

## Related services

- [[Commerce Service]] — owns `CreateAccountRequest`, produces all 4 Kafka events listed above.
- [[Identity Service]] — consumes `UserCreationRequested` → creates AO user via Zitadel → sends credentials per `DeliveryMethod`.
- [[Charging Service]] — consumes `WalletConfigured` → materializes Master Wallet + sub-wallet topology.
- [[Provisioning Service]] — Application provisioning consumer (post-Add Client; activates per-app provisioning when `Show` + paid).
- [[Access PES Service]] — `falcon-core-access-svc` — gates the Add Client action button via PES policy mirroring the Permission sheet.
- [[Core Gateway Service]] — refreshes Redis IP-allowlist cache via `commerce.tenant-ip-allowlist-changed.v1`. Not on the Add Client request path (System Gateway is).
- [[System Gateway Service]] — routes the Add Client POST from the Admin Console to Commerce.

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
- [08-BACKEND_API](08-BACKEND_API.md)
- [09-COMPONENTS](09-COMPONENTS.md)
- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[Commerce Service]] · [[Identity Service]] · [[Charging Service]] · [[Provisioning Service]] · [[Core Gateway Service]] · [[System Gateway Service]] · [[Access PES Service]] · [[Add User Flow]] · [[BACKEND_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
