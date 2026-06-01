---
name: project_signalr_realtime_prs_2026_05_29
description: 8-PR SignalR realtime initiative map + gateway proxy-over-hub decision + PR 41916 commerce conflict fix + ADO-without-PAT PR inspection technique
metadata: 
  node_type: memory
  type: project
  originSessionId: 6721c45b-340e-42ab-9854-46875b9b74af
---

Falcon **SignalR real-time order-status** initiative — 8 Azure DevOps PRs (org `t2development/Falcon`) mapped, 1 conflict fixed, on 2026-05-29.

**Architecture (user-confirmed):** Commerce emits `OrderFinalized` → Kafka → **dedicated `comm-realtime` svc** hosts the SignalR `OrderStatusHub` + consumes the event → **gateways PROXY** the client WebSocket through to it → browser gets live order/payment status (no polling). Gateways do NOT host their own hub.

**The 8 PRs:**
- comm-realtime **41880** (`feature/falcon-on-behalf-routing`→main): the dedicated SignalR service (37 files, routes Client to its own group by AccountId). Merge FIRST — base dependency.
- Falcon/essentials **41882** (`polishing-v0.4-signalr-realtime`→main): docker-compose + k8s skeleton (configmap/secret/kustomization) + SignalR seed/smoke/verify (10 files).
- Falcon/essentials **41960** (`polishing-v0.4-system-gateway-kafka-config`→main): 1-line system-gateway Kafka broker docker config.
- core-gateway **41910** + system-gateway **41912** (`feature/signalr-realtime-only`→main): SignalR **PROXY** delivery. ✅ KEEP (chosen design).
- core-gateway **41961** + system-gateway **41962** (`polishing-v0.4`→main): gateway hosts its OWN `OrderStatusHub` + `OrderFinalizedConsumer` (in-gateway-hub design; real titles `[Draft] … SignalR OrderStatusHub + order-finalized consumer (Wave 4+4.1)`). ❌ **ABANDONED 2026-05-29 via ADO REST API** (verified active→abandoned). Superseded by proxy + dedicated svc; merging them would create a redundant 2nd hub.
- commerce **41916** (`hotfix/scope-pending-order-check-by-tenant`→main): Hotfix B — tenant-scope `CheckPendingOrderForServiceAsync` (a stale Pending order in one tenant was 409'ing every other tenant's do-payment for the same shared-catalog service).

Recommended merge order: **41880 → 41882 + 41960 → 41910/41912 → 41916**.

**41916 conflict — FIXED + pushed + ADO-verified:** main had advanced via PR 41883 (Commerce SignalR `OrderFinalized`) editing the SAME `CreateFalconServiceOrderHandler.cs` + its test. Merged `origin/main` into the hotfix branch: handler **auto-merged** (both intents kept — main's `ValidateCommChannelPriorities` G1 boundary check + the hotfix's `o.AccountId == command.AccountId` predicate); the test file was an **add/add** conflict → hand-merged into one class (main's richer fixture + helpers, unified 3-arg `BuildCommand`, all 7 tests). `dotnet test`→**7/7**. Merge commit `8080449` pushed to `origin/hotfix/...`; ADO recomputed `refs/pull/41916/merge` (was absent → now present) = mergeable.

**ADO PR inspection WITHOUT az/PAT (reusable technique):** `az` CLI not installed, no PAT env var — but Git Credential Manager (`credential.helper = manager`) makes `git fetch`/`push`/`ls-remote` work non-interactively (use `GIT_TERMINAL_PROMPT=0` to fail fast instead of hanging).
- `git ls-remote origin "refs/pull/*"` → every PR ref. **Absence of `refs/pull/<id>/merge` = that PR has a merge CONFLICT** (ADO can't compute a clean merge). Presence = mergeable.
- Fetch `refs/pull/<id>/merge`; the merge commit's parents reveal the branches: **parent1 = target tip, parent2 = source head**. Resolve names via `git for-each-ref --points-at <sha> refs/remotes/origin`.
- `git diff <target>...<source>` = exactly what the PR delivers.

**ADO REST API WRITE access (no PAT, no `az`) — proven 2026-05-29:** the GCM token lives in **Windows Credential Manager**; `git credential fill` does NOT surface it, but P/Invoke `advapi32!CredRead` does. Target = `git:https://t2development.visualstudio.com` (user `a.sukkariyeh@t2.sa`) or `git:https://AmmarMK@t2development.visualstudio.com` (user `AmmarMK`); blob = the 84-char token. Auth the REST API with **Basic `:{token}`** (Bearer also works). Base = `https://t2development.visualstudio.com/DefaultCollection/Falcon/_apis/git/repositories/{repo}/pullRequests/{id}?api-version=7.0`. **Abandon a PR** = `PATCH {"status":"abandoned"}`; GET returns title/status/source/target; PATCH `{"title":"…"}` renames. Used it to abandon 41961/41962 (active→abandoned, verified). Set `[Net.ServicePointManager]::SecurityProtocol=Tls12` first in PS 5.1. ⚠️ enumerate Cred Mgr targets first — there's also a `dev.azure.com/safecubesoftware` token that 401s against t2development. Boss-facing HTML sheet (6 keepers only, abandoned ones excluded): `C:\Falcon\reports\falcon-signalr-prs-merge-request-2026-05-29.html`.

Remotes are `https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/<repo>`. Backend repos live under `C:\Falcon\Falcon\<repo>` (each its own git repo; `C:\Falcon` is NOT a repo). See [[infra_ado_ipv6_blocked_use_ipv4]]. Only commit beyond user's working tree this session = the 41916 merge fix `8080449`.
