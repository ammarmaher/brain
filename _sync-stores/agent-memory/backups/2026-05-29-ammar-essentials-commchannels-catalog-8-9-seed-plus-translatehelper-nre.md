---
name: session-backup-commchannels-marketplace-8-9-catalog-seed-api-500-root-cause
description: Ran service-scenarios seed to expand catalog to 8 apps + 9 channels; Mongo verified; API boundary 500s traced to a pre-existing TranslateHelper NRE on null SubTitle/Description
metadata: 
  node_type: memory
  type: project
  agent: ammar-essentials
  date: 2026-05-29
  status: completed
  originSessionId: 00a79046-a402-495b-8012-3fa266bbb9ca
---

## What Was Done
- Stack already up (18 containers, mongo/commerce/core-gateway/identity/zitadel healthy). No `docker compose up` needed.
- Ran `seed/seed-service-scenarios.js` via `docker cp` to `/tmp` (NOT `/seed` — that dir does not exist in falcon-mongo-1; the wrapper run-service-scenarios.sh also uses /tmp) then `docker exec mongosh`.
- Seed stdout: "Catalog upserted: 8 Applications + 9 CommunicationChannels"; "Node Test Tenant 001 (_id=000000000000000000a11001): 8 applications + 9 commChannels set"; "Node Mitsubishi (690000000000000000c10001): 8 applications + 9 commChannels set". Honda/Mercedes/Toyota stayed at 3+3 (catalog-only by design).
- Mongo verify (FalconCommerceDB): Applications.count=8, CommunicationChannels.count=9. a11001 apps=8 (status 2,2,3,3,4,4,1,1) channels=9 (status 2,3,4,2,2,3,4,1,1). Mitsubishi c10001 apps=8 channels=9 same spread. App 695a304f901bb7d4a830d0dd name.en="Survey Pro" (rename confirmed).
- Collections are `Nodes` (plural) + `Applications` + `CommunicationChannels`. Node.Id is [BsonId][BsonRepresentation(ObjectId)] string -> _id. Node fields: `applications`, `commChannels`.

## What Remains
- Step 4 API boundary FAILED with 500 on BOTH `commerce/Node/{id}/applications` and `.../comm-channels`. Seed is NOT at fault. Reported to user; awaiting decision on fix owner (Commerce handler vs seed data).

## Key Decisions
- Did NOT edit the seed (instructed). Did NOT fix the handler/seed (review-only, STOP-and-report on 500 per task).

## Root Cause (the load-bearing finding)
- Exact crash: `Falcon.Commerce.Application.Services.Helpers.TranslateHelper.GetTranslation(ITranslate translate)` -> `translate.En` (TranslateHelper.cs:19) throws NullReferenceException because `translate` is null.
- Called unguarded from GetAccountApplicationsHandler.cs:55 `GetTranslation(application.SubTitle)` and :56 Description (and the identical GetAccountCommunicationChannelsHandler.cs:57/58).
- ALL 8 Application catalog rows have subTitle=NULL + description=NULL (entity Application.cs: SubTitle/Description are MultiLanguageName with [BsonIgnoreIfNull]; the C#-seeded + JS-seeded rows only carry name+icon). Channels: first 4 have subTitle but ALL 9 have description=NULL.
- Reproduces DIRECTLY against commerce :7045 (not a gateway or JWT-claims problem). `comm-channels/visible` returns 200 (projects only id+name, never touches SubTitle/Description); `comm-channels/visible/details` + `applications` + `comm-channels` all 500 (they map the full row).
- This is a PRE-EXISTING latent handler bug (no null-guard before GetTranslation), surfaced by catalog rows missing subTitle/description. NOT introduced by the seed (the original 3 apps 0dc/0dd/0e1 also have null subTitle/description).
- NOTE on JWT: token from :7777/api/auth/login is the raw Zitadel access token; it does NOT carry the flattened custom claims (user-type/tenant-id/node-id/project:roles) that SessionProvider reads -> in Commerce _currentUser.UserType==null, isFalconUser=false. SessionProvider is null-safe so this did NOT cause the 500, but it means availableActions logic would treat the caller as a Client. (Gateway substitutes TenantId=test-tenant-001 server-side; that path 500s separately in GetSettingsHandler via the IP-allowlist fallback = pre-existing B-13.)

## Two candidate fixes (for whoever owns it; NOT applied)
1. Commerce (preferred, fixes the real bug): null-guard in the handlers, e.g. `application.SubTitle is null ? null : _translateHelper.GetTranslation(application.SubTitle)` (and Description), in BOTH GetAccountApplicationsHandler and GetAccountCommunicationChannelsHandler (and GetVisibleCommunicationChannelDetailsHandler which shares the same crash). OR make TranslateHelper.GetTranslation null-tolerant (`if (translate is null) return null;`).
2. Seed-only workaround (does NOT fix the latent bug, and the seed is frozen): add subTitle+description MultiLanguageName to every catalog row.

## Files Changed
- None (app source untouched). Wrote this memory backup only.

## Context for Next Agent
- Commerce svc source on disk: C:\Falcon\Falcon\falcon-core-commerce-svc (double-Falcon). Seed: C:\Falcon\Falcon\Falcon\falcon-essentials\seed (triple-Falcon).
- Reproduce: `TOKEN=$(curl -s -X POST localhost:7777/api/auth/login -H 'Content-Type: application/json' -d '{"username":"accowner","password":"Admin@1234"}' | python -c "import sys,json;print(json.load(sys.stdin)['result']['tokens']['accessToken'])")` then `curl localhost:7045/api/Node/000000000000000000a11001/applications -H "Authorization: Bearer $TOKEN"` -> 500.
- Get full stack with line numbers: `docker logs falcon-commerce-1 --since 2m | grep -E "TranslateHelper|GetAccount.*Handler|.cs:line"`.
