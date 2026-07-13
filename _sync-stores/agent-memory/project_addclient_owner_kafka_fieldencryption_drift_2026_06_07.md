---
name: project_addclient_owner_kafka_fieldencryption_drift_2026_06_07
description: Root cause + fix for UI Add-Client account-owner users never being created (empty FieldEncryption key in Identity breaks the Kafka UserCreationRequestedConsumer); plus the single-owner-on-existing-tenant seed recipe. Includes test5 credentials.
metadata: 
  node_type: memory
  type: project
  originSessionId: 8d94dfe5-bba3-437e-afc4-fa5f9c7dadef
---

On 2026-06-07 (claude) a user reported creating client **`test5`** via the Add-Client wizard and asked for its password. Investigation found the **client shell existed but the account-owner user did NOT** — and root-caused a real config bug, then fixed it (user approved "Both": fix config + seed).

## Symptom
Creating a client via the **UI Add-Client wizard** creates the Commerce tenant/node but the **account-owner user is never provisioned** (absent from `FalconIdentityDb.Users` AND Zitadel `projections.users14`) → no login, no password. **Seeded clients work** because seed scripts insert the Identity+Zitadel user directly; the **UI flow is the only path that exercises the broken Kafka consumer**.

## Root cause — FieldEncryption key config DRIFT
The Add-Client owner is provisioned asynchronously: Commerce publishes Kafka `commerce.user-creation-requested.v1` with the owner password **AES-256-GCM field-encrypted**; Identity's `UserCreationRequestedConsumer` decrypts it and creates the user. The encryptor needs a shared **32-byte Base64 key**.
- [CODE] `falcon-core-identity-svc/.../Infrastructure/Security/AesGcmFieldEncryptor.cs:25` throws `ArgumentException: FieldEncryption key must be exactly 32 bytes (256 bits). Got 0 bytes` when the key is empty. Consumer resolves it EAGERLY at `UserCreationRequestedConsumer.cs:140` (BEFORE the idempotency check at :163), so an empty key fails every owner-provision.
- [CODE] both services bind top-level section `"FieldEncryption"` → env var **`FieldEncryption__Key`** (Identity `ServiceCollectionExtensions.cs:93`; Commerce `DependencyInjection.cs:63`).
- **DRIFT:** Commerce HAS the key in `appsettings.Development.json` → `caLufAJEpYBleUdRlGJhXP9GjcVGwUCoEiC1l/FqeAE=`; **Identity had NO `FieldEncryption` section** in its `appsettings.Development.json` and `appsettings.json` defaults `Key:""` → 0 bytes → throw. Runtime-proven: `docker logs falcon-identity-1` showed `[09:24:26 ERR] ... Got 0 bytes` right after the test5 node was created.
- Consumer error path (`UserCreationRequestedConsumer.cs:117-121`) logs + delays but does NOT commit the offset (despite the misleading class comment), so the failed event stays uncommitted and **reprocesses on restart**.

## Fix applied (NO app source edited — user explicitly forbade touching appsettings.Development.json)
Created **`C:\Falcon\Falcon\Falcon\docker-compose.override.yml`** giving the `identity` service `FieldEncryption__Key: "caLufAJEpYBleUdRlGJhXP9GjcVGwUCoEiC1l/FqeAE="` (MUST equal Commerce's key so producer/consumer share it). Env var overrides appsettings. Recreated only identity: `docker compose -f docker-compose.yml -f docker-compose.override.yml up -d --no-deps identity` (project `falcon`). Delete the override to revert.
**Proof:** post-restart logs show consumer constructed the encryptor OK (no "Got 0 bytes"), reprocessed test5 → `User test5 already exists — skipping (idempotent reprocessing)`, AND a different previously-stuck client (`asdasdasdaasdas`) was **auto-provisioned end-to-end** (`User ... created from Commerce event` + role-link). The fix retroactively heals all stuck owner events on the topic.

## Seed used for test5 (single owner on an EXISTING tenant)
**Credentials handed over: `test5` / `Admin@1234`** (acc-owner). Tenant/node `6a2538c9e0119e8bd142c79a` (created 2026-06-07 09:24 by the UI), Zitadel id `376363866096926729`, Identity `_id` `6a2540eb2c5bbc53ec9df8a3`. Login verified via `POST :7777/api/auth/login {userName,password}` → `isSuccessful:true, stage:4, requiresOtp:false` + tokens (OTP off in dev). Logs into Management/Client console.
Used a run-once script `falcon-essentials/zitadel/seed-test5-owner.sh` (**deleted after seeding** at user request — recreate by copying `seed-toyota-users.sh`) — reduced to ONE acc-owner (role 4, userType 2, status 2) and SKIPPING node/tenant creation (already exist). Steps: Zitadel `human/_import` (pwd) → `FalconIdentityDb.Users` upsert (incl. `nodeId`+`path`) → Zitadel `metadata/_bulk` (user-id/user-type/tenant-id/node-id) → `otp_sms` → PES g-link `r:acc-owner@TID → u:{zuid}@TID`. The tenant's 245 acc-* p-rules were ALREADY present (UI creation provisions tenant roles; only the user step fails). **Order matters:** seed BEFORE the identity restart so the reprocessed poison event hits idempotency-skip and does NOT overwrite the known password with the unknown wizard password.

Pure data seed + 1 infra override file; NO repo source changed; NO commits. Related [[project_clean_client_one_owner_created_2026_06_06]] · [[project_old_test_charging_accounts_500_settings_createdAt_2026_06_07]].
