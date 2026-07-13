---
name: project_signalr_mode_branch_set_and_main_baseline_2026_06_10
description: "SignalR-mode branch return-map (user will say \"return to SignalR mode\") + 2026-06-10 main-baseline switch + commerce wallet-500 hotfix branch (local commits, NOT pushed)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9604be3a-d243-4b56-a62a-77528b8e237a
---

**SignalR-mode return map (2026-06-10).** User instruction: when he asks to "return to SignalR mode" (he may phrase it "signal our mood" via voice typing), check out THESE branches again:

| repo | SignalR-mode branch | WIP snapshot commit on it |
|---|---|---|
| falcon-core-commerce-svc | `feature/contract-quota-consumed-on-detail` | `60e6474` WIP snapshot 2026-06-10 |
| falcon-core-charging-svc | `feature/contract-quota-consumption` | `09b0eb9` WIP snapshot 2026-06-10 |
| falcon-int-core-gateway-svc | `feature/signalr-realtime-only` | `7a75787` WIP snapshot 2026-06-10 |
| falcon-int-system-gateway-svc | `feature/signalr-realtime-only` | `8d0b09c` WIP snapshot 2026-06-10 |
| falcon-comm-realtime-svc | `night-shift/due-payment-signal-fixes` | (was clean) |
| Falcon (stack/compose) | `polishing-v0.4-signalr-realtime` | never switched (left as-is, dirty compose+seed files are the local wiring) |
| falcon-web-platform-ui | `polishing-v0.4` | never switched (dirty user-details WIP left in place) |

Each WIP snapshot commit message says "WIP snapshot 2026-06-10 … safe to git reset --soft HEAD~1" — restore = checkout branch, optionally `git reset --soft HEAD~1` to get uncommitted state back.

**Main baseline (current state after switch).** commerce `main@3c1de18`, charging `main@2ac3bfc`, core-gw `main@45df861`, system-gw `main@479db1b`, identity `main@6f73007`, templates `main@fb67dd1`; **comm-realtime `main@dec2172` — its origin/main is ADO-init-only (README/.gitignore), NEVER pull origin/main into it; local main = base service**. Repos on main left DIRTY on purpose (user's local tweaks, not wallet-related): provisioning (appsettings.Development.json), access-svc (BuiltInRoleProvisioner.cs), contact-group (many), stack repo Falcon (docker-compose.yml + override + seed scripts), FE.

**Wallet-500 hotfix branch (commerce): `hotfix/account-hierarchy-id-validation` @ `22c1a80`, cut from origin/main `3c1de18`. LOCAL ONLY — NOT pushed, no PR yet.** Fix = inject existing-but-unused `IObjectIdValidator` into `GetAccountHierarchyHandler`: (1) reject non-ObjectId accountId → NodeNotFound 404 (was Mongo FormatException 500), (2) same guard on JWT `_currentUser.NodeId`, (3) MultipleWallets comm-channel ids filtered through validator before `$in` query (legacy garbage ids degrade instead of crash), (4) `BuildHierarchyAsync` TryGetValue → NodeNotFound (was KeyNotFoundException when start node soft-deleted/foreign-tenant). 6 regression tests GREEN (Moq `It.IsAnyType` + InvocationFunc compiling the handler's own anonymous projections against real entities — house-first pattern); full suite 425 pass / **8 pre-existing failures (AddressTests ×7 + ChangeNodeNameHandlerTests ×1) CONFIRMED failing on pristine origin/main too** (stash-verified).

**QA 500 context (deployed `system-api.falconhub.space`, account `6a26d45034723df0a08c2940`, after saving wallet UserBased+MultipleWallets):** gateway mirrors downstream status ([CODE] HttpResponseHandler.cs:46-50) and swallows charging errors → the 500 is commerce or identity; post-save activates commerce MultipleWallets channel block + identity east-west `user/by-tenant?WalletOwnerOnly=true`. Discrimination test: save UserBased+Single → still 500 = identity; NodeBased+Multiple → still 500 = commerce. Hotfix above covers the commerce crash class; root cause in QA not yet log-confirmed.

**Main-baseline runtime findings (stack restarted on main 2026-06-10; compose runs `dotnet run` from live-mounted workspace — branch switch + `docker compose restart <svc>` = deploy):**
- **F1 BOTH gateways CRASH on pure main**: PRs 41572/41573 added templates proxy route; YARP fatal "No address found for destination on cluster 'templates-cluster'" (compose has no templates service/env). FIXED LOCALLY in `docker-compose.override.yml` (+`ReverseProxy__Clusters__templates-cluster__Destinations__destination1__Address: http://templates:8080` for both gateways). Real fix belongs in stack repo compose.
- **F2 charging on pure main CANNOT BOOT** — `Unhandled exception System.InvalidOperationException: Missing translations detected` (ErrorResourceCompletenessValidator is FATAL): main declares `WalletNotConfigForTheNode` key without en/ar resx. **The fix already exists = charging branch commit `88abe07`** (feature/contract-quota-consumption) → cherry-pick PR to main. Charging LEFT crash-looping on pure main as evidence (wallet hierarchy test unaffected; balances degrade).
- **F3 Avro event contract drift**: commerce main logs `Avro.AvroException: Unable to find type 'Falcon.Identity.Events.EventContext'` consuming identity events (commerce survives, logs errors); charging's first crash was the SAME poison message where `PublishToDeadLetterAsync` itself NREs (`KafkaAvroConsumerBase.cs:95` — DLQ producer null) → StopHost. Needs consumer schema sync + DLQ fix PRs.
- Gateways verified READY (401) on :7256/:7038 after F1 fix; commerce + comm-realtime listening on main.

**DRAFT PRs CREATED 2026-06-10 (ADO REST via git-credential, az CLI absent):** commerce **PR 42316** `hotfix/account-hierarchy-id-validation`→main (wallet-hierarchy 500 hardening) https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/falcon-core-commerce-svc/pullrequest/42316 · charging **PR 42317** `hotfix/wallet-error-translations`→main (cherry-pick 88abe07 resx en+ar; fixes F2 boot-fatal) https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/falcon-core-charging-svc/pullrequest/42317. Both branches PUSHED. **Local dev stack now runs commerce on the 42316 branch + charging on the 42317 branch** (live-mount dotnet run; charging's first clean boot on main-based code — docker "unhealthy" flag on charging is CHRONIC/healthcheck-config, app listens fine, predates everything). Gateways on pure main + override F1 fix.

Related [[project_wallet_transfer_restore_24client_testbed_2026_06_07]] · [[project_org_hierarchy_pes_button_locks_main_parity_2026_06_08]].
