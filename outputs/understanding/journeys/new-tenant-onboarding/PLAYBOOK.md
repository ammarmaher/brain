*** Journey Playbook — New Tenant Onboarding ***
*** Multi-page user flow · 2026-05-15 ***
*** Crosses: [[Organization Hierarchy]] · [[Login]] · [[Force Change Password]] · [[OTP Challenge]] · [[Org Settings]] · [[Contracts]] · [[Send Transaction]] ***

# New Tenant Onboarding

> A Falcon System Administrator creates a brand-new client tenant via the Add Client wizard. Commerce persists the Account + Settings + CommChannels + Apps and fans out 4 Kafka events. Identity provisions the Account Owner user (Pending) and delivers credentials per the chosen Delivery Method. The AO logs in for the first time, is forced to change password, passes an OTP challenge, and the user transitions Pending → Active. The AO opens Contracts and creates the first Active Contract — its activation fires the wallet-funding cascade, materializing balances on the Master Wallet topology. Account transitions Pending → Active on first contract activation (PRD-01 W8). The AO then composes the first Send Transaction against the nearest-expiring Active contract. Journey ends with an Account that is fully operational and has executed real business work.

## Actors involved

| Actor | Role |
|---|---|
| Falcon System Administrator | Initiates Add Client; chooses Delivery Method; monitors creation |
| Falcon Product (optional) | Same permission scope as Sys Admin (per PRD-01 OVERVIEW Actors + BR-AM-02) |
| Account Owner (AO) | Recipient of credentials; performs first login + creates first Contract + first Send Transaction |
| Identity Service | Owns user lifecycle; consumes `UserCreationRequested`; creates Zitadel user |
| Commerce Service | Owns Account + Contract + Service Order; produces Kafka cascade |
| Charging Service | Materializes Master Wallet + funds on contract activation; charges Send Transactions |
| Provisioning Service | Activates `Show + paid` Apps / CommChannels per service-order |
| Access (PES) Service | Gates "Add Client" button + Contract creation + AO actions |
| Core Gateway | Refreshes Redis IP allowlist cache; routes Client-side AO requests |
| System Gateway | Routes Falcon-admin Add Client + Contract create POSTs |

## Pages traversed (in order)

1. [[Organization Hierarchy]] — Falcon admin clicks "Add Client" (5-step wizard, see [[Add Client Flow]]).
2. [[Login]] — AO receives credentials (Email/SMS/Both), opens the Client portal, signs in for the first time. `forward-ref (page not yet seeded)`
3. [[Force Change Password]] — Per BR-UM-19 first-login forces password change; complexity follows account `PasswordSecurityLevel`. `forward-ref (page not yet seeded)`
4. [[OTP Challenge]] — 60-sec OTP per BR-UM-26 (length 4 or 6 per `OtpAppSetting`). `forward-ref (page not yet seeded)`
5. [[Org Settings]] — AO lands on default home; can inspect Settings tab but cannot edit limits up (BR-AM-39 open). `forward-ref (page not yet seeded — Settings tab is on Organization Hierarchy)`
6. [[Contracts]] — AO opens Contracts page → "Add Contract" → first Contract created → backend activates it on start-date → Master Wallet refilled. `forward-ref (page not yet seeded)`
7. [[Send Transaction]] — AO picks a Contact Group + a Template + composes a campaign → Charging cascade reserves + debits the nearest-expiring Active contract. `forward-ref (page not yet seeded)`

## Flow playbooks used

- [[Add Client Flow]] — built (folder SoT at `understanding/pages/organization-hierarchy/Add Client/`).
- [[Add User Flow]] — built (single-file SoT). Step 5 of Add Client triggers the user-creation path via Kafka, not direct call.
- [[First Login Flow]] — `forward-ref (flow not yet seeded)` — pending PRD-02 W2 playbook seeding.
- [[Add Contract Flow]] — `forward-ref (flow not yet seeded)` — pending PRD-03 playbook seeding.
- [[Send Transaction Flow]] — `forward-ref (flow not yet seeded)` — pending PRD-04 / PRD-05 cross-link.

## Backend services exercised (in order)

- [[System Gateway Service]] — receives Add Client + Add Contract POSTs from Admin Console.
- [[Commerce Service]] — persists Account, AccountSettings, CommChannelConfig×N, AppConfig×N; later persists Contract; produces Kafka cascade.
- [[Identity Service]] — consumes `commerce.user-creation-requested.v1` → creates Zitadel user with `PasswordPolicy` from account level → delivers credentials per `DeliveryMethod`.
- [[Charging Service]] — consumes `commerce.wallet-configured.v1` → materializes Master Wallet aggregate (lump = 0 until contract activates); consumes `commerce.contract-activated.v1` → funds the wallet topology.
- [[Provisioning Service]] — consumes `commerce.service-order-created.v1` → activates `Show + paid` Apps / CommChannels.
- [[Access PES Service]] — gates each step (Add Client button, Contract creation, Send Transaction).
- [[Core Gateway Service]] — refreshes Redis IP-allowlist cache on `commerce.tenant-ip-allowlist-changed.v1`; routes the Client portal AO traffic; enforces IP allowlist on first login.

## Kafka events fired

| Event | Producer → Consumer | Fires between... |
|---|---|---|
| `commerce.user-creation-requested.v1` | Commerce → Identity | Add Client Step 5 Submit → AO user provisioned (Pending) |
| `commerce.wallet-configured.v1` | Commerce → Charging | Add Client Step 5 Submit → Master Wallet topology materialized (lump = 0) |
| `commerce.identity-settings-sync.v1` | Commerce → Identity (and others) | Add Client Step 5 Submit → tenant identity settings synced |
| `commerce.tenant-ip-allowlist-changed.v1` | Commerce → Core Gateway | Add Client Step 5 Submit → Redis IP allowlist refreshed |
| `identity.user-events.v1` | Identity → Access (PES) + Templates | Post-AO-creation → role/permission taxonomy updated |
| `commerce.contract-activated.v1` | Commerce → Charging + Provisioning | First Contract reaches start-date / is paid → wallet funded |
| `commerce.service-order-created.v1` | Commerce → Provisioning | First Contract creation → `Show + paid` Apps/CommChannels go Active |

## V-rules touched

| V-rule | Where it fires |
|---|---|
| [[V-account-name-format-uniqueness]] | Step 1 of Add Client (async + submit) |
| [[V-password-security-level-enum]] | Step 2 of Add Client; later enforced at first-login force-change-password |
| [[V-account-ip-allowlist-enforcement]] | Step 2 of Add Client (input shape) + every login (gateway enforce) — fires on AO first login |
| [[V-account-limits-zero-means-no-limit]] | Step 2 of Add Client |
| [[V-service-visibility-pricing-required]] | Steps 3 + 4 of Add Client |
| [[V-user-first-last-name-letters-only]] | Step 5 of Add Client (AO PII) |
| [[V-username-format-uniqueness-immutable]] | Step 5 of Add Client (AO username) |
| [[V-password-complexity-per-security-level]] | Step 5 AO password auto-gen + AO first-login force-change |
| [[V-login-lockout-3-wrong-attempts]] | AO first-login (3 wrong passwords / 3 wrong OTPs → Locked) |
| [[V-contract-committed-value-positive]] | First Contract creation (PRD-03) |
| [[V-contract-rate-per-unit-non-negative]] | First Contract creation (rate-card row) |
| [[V-contract-currency-enum]] | First Contract creation |
| [[V-contract-expiration-after-start]] | First Contract creation |
| [[V-charging-insufficient-balance]] | First Send Transaction (reservation may fail if wallet empty) |

## End-to-end happy-path narrative

**Step 1.** Falcon System Administrator opens Organization Hierarchy → clicks "Add Client". The 5-step wizard opens (see [[Add Client Flow]]). Admin fills Steps 1 → 5 and clicks Submit.

**Step 2.** Wizard composes `CreateAccountRequest` → System Gateway → `POST /api/Node/create-account` on Commerce. Commerce persists Main Node + Account (`Pending`) + AccountSettings + CommChannelConfig×N + AppConfig×N. Result returned via `ServiceOperationResult<CreateAccountResponse>`.

**Step 3.** Commerce fans out 4 Kafka events on success: `commerce.user-creation-requested.v1` · `commerce.wallet-configured.v1` · `commerce.identity-settings-sync.v1` · `commerce.tenant-ip-allowlist-changed.v1`.

**Step 4.** Identity consumes `user-creation-requested` → creates Zitadel user → applies `PasswordPolicy` resolved from `Settings.PasswordSecurityLevel` (Step 2 choice). Identity delivers credentials per top-level `DeliveryMethod` (Email / SMS / Both). User status: `Pending` (per BR-UM-10).

**Step 5.** Charging consumes `wallet-configured` → materializes Master Wallet abstract aggregate. Lump-sum balance = 0 because no Contract has activated yet (PRD-01 W8 contract).

**Step 6.** Core Gateway consumes `tenant-ip-allowlist-changed` → refreshes the Redis IP-allowlist cache. The tenant's `AllowedIPs[]` from Step 2 are now enforced for any future login on the tenant route.

**Step 7.** The Account Owner receives credentials. They navigate to the Client portal Login page ([[Login]] — `forward-ref`). The gateway runs the IP allowlist check ([[V-account-ip-allowlist-enforcement]]) — if the AO is on-net, request proceeds; if off-net, the request returns a generic "Request not permitted from your network" toast (BR-UM-24).

**Step 8.** AO submits username + temporary password. Identity validates credentials. Because the user is `Pending` (BR-UM-19), the response forces a password-change challenge. AO sees [[Force Change Password]] (`forward-ref`). AO enters a new password — frontend enforces complexity via [[V-password-complexity-per-security-level]] mapped to the tenant's `PasswordSecurityLevel`. Password is sent to Identity → Zitadel → persisted.

**Step 9.** Identity issues an OTP challenge (per BR-UM-26): an `AuthenticationSession` is created with a 60-second OTP. Length 4 or 6 per `OtpAppSetting`. AO sees [[OTP Challenge]] (`forward-ref`). AO enters the OTP correctly — on success, Identity transitions user `Pending → Active`, creates [[E-session]], emits `identity.user-events.v1` (Access PES + Templates consume).

**Step 10.** AO lands on the default Client portal home. AO opens [[Contracts]] page (`forward-ref`) → "Add Contract" → completes Contract creation form ([[Add Contract Flow]] — `forward-ref`). Frontend enforces [[V-contract-committed-value-positive]], [[V-contract-currency-enum]], [[V-contract-expiration-after-start]]. Submit → System Gateway → Commerce → Contract persisted (Status: `InActive (First time)` until start-date / payment).

**Step 11.** When the contract reaches its activation condition (start-date passed + payment received, per PRD-03), Commerce emits `commerce.contract-activated.v1` (and `commerce.service-order-created.v1` if Apps / CommChannels need turning on). Charging consumes → funds the wallet topology with the committed value. The Master Wallet's lump-sum balance is now > 0. Provisioning activates the relevant Apps / CommChannels. Account status: `Pending → Active` (PRD-01 W8).

**Step 12.** AO opens [[Send Transaction]] (`forward-ref`) → picks a [[Contact Group]] → picks a [[Template]] → composes the send. On Submit, frontend POSTs to Commerce (System Order / Send Transaction endpoint) → Commerce calls Charging to reserve against the **nearest-expiring Active contract** (PRD-03 charging-cascade rule). [[V-charging-insufficient-balance]] is the guard: if wallet has funds, reservation succeeds; debit on confirmation.

**Step 13.** Journey ends. Final state:
- **Account:** `Active`
- **AO User:** `Active` (Session valid)
- **AO Wallet (sub-wallet of Master):** funded per contract balance topology
- **First Contract:** `Active` (nearest-expiring)
- **CommChannelConfig / AppConfig (Show + paid):** `Active`
- **First Send Transaction:** posted; balance debited from the right contract bucket

## Failure modes + recovery paths

- **Step 2 fails (Commerce create-account returns 4xx/5xx):** Wizard preserves all 5 steps' buffered state (per [[Add Client Flow]] error map). Operator retries Submit. If 409 on Account Name → fix Step 1 and resubmit. If 422 on limits → fix Step 2 and resubmit.
- **Step 4 fails (Kafka delivered but Identity/Zitadel rejects):** Commerce returned success (Account created) but `CreateIdentityUserFailed` / `Zitadel*Failed` surface as 500. **Partial-failure UX:** Add Client wizard shows "Account created but AO creation failed — contact support" and preserves wizard state so operator can re-trigger or escalate. Out-of-band: ops re-emits `commerce.user-creation-requested.v1` or operator runs Add User manually for that AO.
- **Step 5 fails (Charging consumer down):** Master Wallet aggregate not materialized. AO can still log in, but contract activation will not fund anything until Charging consumer comes back and replays the Kafka offset. Recovery: Kafka consumer-group rewind; idempotent wallet materialization.
- **Step 6 fails (Core Gateway IP cache stale):** AO login at on-net IP fails because Redis cache hasn't been refreshed. Recovery: Core Gateway invalidates cache on next read or admin pokes the cache.
- **Step 7 fails (credentials never delivered — email bounce / SMS quota):** AO has no way to log in. **UX gap** (per [[Add User Flow]] critical drift): no "Resend credentials" button exists today. Workaround: ops uses the admin "regenerate password" path on the Identity user.
- **Step 8 fails (AO enters wrong password 3×):** [[V-login-lockout-3-wrong-attempts]] fires → `User.status: Locked` (BR-UM-25). Recovery: admin unlock or password reset.
- **Step 9 fails (OTP expired or 3 wrong OTPs):** Same lockout path (BR-UM-27).
- **Step 10 fails (Contract validation rejects):** Standard 4xx — inline form errors via [[V-contract-*]] rules. AO retries with valid inputs.
- **Step 11 partial (contract created but activation Kafka consumer fails):** Contract is `InActive`. Wallet never funded. Recovery: replay activation event; Charging idempotent on `commerce.contract-activated.v1` for same contract id.
- **Step 12 fails (insufficient balance / no Active contract):** Reservation 422 via [[V-charging-insufficient-balance]]. AO sees inline error; must wait for contract activation or top up.

## Cross-journey dependencies

- **Depends on:** Falcon admin has the System Administrator or Product role (Permission list - Jawad / BR-AM-02). Falcon infra (Zitadel + Kafka + Commerce + Identity + Charging + Provisioning + Access) running.
- **Triggers downstream:** Every subsequent [[Send Campaign]] uses the wallet topology built here. [[Suspend Client]] targets this tenant. [[Renew Contract]] extends the first contract before expiry.
- **Sister journey:** [[First Login]] is the same Steps 7-9 in isolation (when a Normal User created via Add User logs in for the first time). Reuse the playbook.

## Implementation checklist

- [ ] All page playbooks in the journey are loaded — see "Pages traversed" + "Flow playbooks used"
- [ ] Kafka subscriptions are wired: Identity, Charging, Provisioning, Access PES, Core Gateway all listening to the 5 Commerce topics
- [ ] Error states from each step propagate correctly — backend `ServiceOperationResult<T>` with localized messages, frontend toasts/inline errors
- [ ] State transitions per actor are tested end-to-end — Account: Pending→Active · User: Pending→Active·Locked · Wallet: empty→funded · Contract: InActive→Active
- [ ] Partial-failure UX on Step 4 (Identity provisioning fail after Account persisted) is tested
- [ ] Resend-credentials UX gap is acknowledged (no button exists today)
- [ ] IP allowlist cache refresh latency is acceptable for first-login (Step 6 → Step 7)
- [ ] First Send Transaction validates the nearest-expiring-contract charging cascade
- [ ] Verify the 8 grounding questions from [[IMPLEMENTATION_KNOWLEDGE_MAP]] for each sub-flow

## Hubs

- [[Organization Hierarchy]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
