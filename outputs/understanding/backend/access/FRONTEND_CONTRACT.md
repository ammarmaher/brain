# Access (PES) Service — Frontend Contract

## Audience

PES is an **internal service** — it is not exposed through either gateway in the route maps. Frontend code should **not** call PES directly.

The gateways (`Falcon.Core.Gateway`, `Falcon.System.Gateway`) do not list a `pes-cluster` in `appsettings.json`. Consequently:
- No public URL like `/pes/*` exists at the gateway layer.
- PES is consumed only by other backend services (Commerce, Identity) via direct HTTP calls (not gateway-fronted).
- The frontend never sees PES API directly.

## What the Frontend Should Know

- **Authorization is enforced upstream** — Commerce's `[Authorize(Policy=FalconOnly)]` and Identity's user-status checks already filter out forbidden requests. The frontend doesn't need to call PES to check "can I do X" before attempting it.
- **Errors surface via the upstream service** — when PES says "no", the frontend will see Commerce's `UnauthorizedAction` (403) or `UnauthorizedUserToPerformThisAction` (403) error.

## If You Must Call PES (Rare)

If a Falcon admin tooling page genuinely needs PES data (e.g. an admin policy-management screen), the call must:
- Go to PES directly at `http://localhost:5296/pes/*` in dev (no https, no gateway)
- Authenticate with a Zitadel JWT
- Handle raw response shapes (no `ServiceOperationResult<T>` wrapper)
- Replace `:` with `+` in scope route parameters
- Avoid GET with body — prefer to wrap GETs that need a body as POSTs in any new code

## Direct Service Communication Conventions

Commerce → PES (likely) calls:
- `POST /pes/authorize` — check if a subject can perform an action on an object
- `POST /pes/policyrule` / `DELETE /pes/policyrule` — manage policy rules

Identity → PES (via Kafka, not HTTP):
- Identity publishes `identity.user-events.v1` (`UserRoleLinkSyncRequestedAvroEvent`)
- PES consumes and syncs role linkages

## Health Check

`GET /pes/health` (anonymous) — available for liveness probes. Returns 200 with a simple `Healthy` status.

## OpenAPI / Swagger

PES doesn't expose OpenAPI in `Program.cs` (no `AddEndpointsApiExplorer` / `AddSwaggerGen` calls). Internal-only.

## CORS

`AllowAnyOrigin/Header/Method` — wide open. Verify this is intentional given PES is meant to be internal.

## Deviations

PES is a non-conformant service by Falcon-platform standards:
- No `ServiceOperationResult<T>` wrapper
- No `FalconException` / `FalconKeys.Error`
- No `Serilog` (uses `log4net`)
- No `/api/` route prefix (uses `/pes/`)
- No Clean Architecture (flat `T2.PES` library)
- GET-with-body anti-pattern in 2 endpoints

It exists in the Falcon repo as a legacy authorization engine and is consumed only by Commerce/Identity over private HTTP + Kafka.
