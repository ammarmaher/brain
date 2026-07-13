---
name: reference-falcon-local-docker-devstack
description: Falcon local Docker dev stack — how services run + how to deploy code/config changes + service URLs + gotchas
metadata: 
  node_type: memory
  type: reference
  originSessionId: 918e11de-f829-4009-aef9-bceeffe3dbe8
---

Falcon backend services run as Docker containers (NOT prebuilt images): compose `C:\Falcon\Falcon\Falcon\docker-compose.yml` (project `falcon`), image `mcr.microsoft.com/dotnet/sdk:10.0`, **bind-mount `C:\Falcon\Falcon → /workspace`** + `command: dotnet run --project src/<Svc>.Api/... --urls http://0.0.0.0:8080` (NO `dotnet watch`). Host ports: System GW :7256, Core GW :7038, charging :7224, commerce :7045, identity :7777, provisioning :7163 (all → 8080 internal). Other backend repos: `C:\Falcon\Falcon\falcon-core-*` + `falcon-int-{core,system}-gateway-svc`.

**Deploy a CODE change** = checkout the branch in the host repo (the container bind-mounts it) + `docker restart <container>` (dotnet run recompiles on start). **Deploy a NEW ENV var** = edit compose + `docker compose -p falcon -f C:\Falcon\Falcon\Falcon\docker-compose.yml up -d <service>` (a plain `docker restart` does NOT pick up new env). Get a container's compose project/file via `docker inspect <c> --format '{{ index .Config.Labels "com.docker.compose.project" }}'`.

**Inter-service URLs (in-container)** = compose SERVICE NAMES `http://<service>:8080` (e.g. commerce→charging `http://charging:8080`), set via env overrides like `ServicesClients__Charging__BaseUrl` in the compose `environment:` (appsettings.Development.json holds the non-Docker `https://localhost:PORT` default; the compose env wins inside Docker). Verify reachability: `docker exec <c> sh -c "curl -s -o /dev/null -w '%{http_code}' http://charging:8080/swagger/v1/swagger.json"`.

**Gateways:** YARP reverse-proxy with catch-all passthrough per service (`/charging/{**}`, `/commerce/{**}`, …) → any new downstream endpoint is auto-reachable. BUT a gateway can ALSO have FastEndpoints (e.g. Core GW `commerce/contracts/{id}` aggregating endpoint) that COEXIST with YARP: `app.UseFastEndpoints(RoutePrefix="api")` then `MapReverseProxy()`; the FastEndpoint path `/api/commerce/...` is disjoint from the bare `/commerce/{**}` YARP route, so it wins (FE effective paths include `api/`). To add server-side aggregation for admin, mirror Core GW's `GetAccountContractEndpoint` in the System GW (auth = `FalconOnly` group, not Core GW's `ClientOnly`).

**Gotchas:** (1) `az`/`gh` NOT installed → Azure DevOps PRs must be created via browser `…/pullrequestcreate?sourceRef=<branch>&targetRef=main` (push works). (2) Auth-first: every endpoint (and unmatched routes) returns 401 (FallbackPolicy RequireAuthenticatedUser) — HTTP code can't confirm a route exists; use Swagger or the registered-endpoint-count delta. (3) ⚠️ charging `main` has a LATENT missing-translation bug: error code `WalletNotConfigForTheNode` (used in DeductFalconServiceCostHandler) has NO [en]/[ar] resx entry → `ErrorResourceCompletenessValidator` CRASHES at startup (only at runtime, not in build/tests); the fix lives in the night-shift uncommitted WIP — a clean-from-main charging branch won't start without adding it. Related [[project_contract_consumed_offered_C_and_ratetables_2026_06_06]].
