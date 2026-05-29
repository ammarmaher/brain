---
type: pending-question
ticket-id: Q-WAVE4-STEP6-CC-CATALOG
status: open
raised: 2026-05-17
raised-by: Ammar Web-Platform-UI (Night Shift Wave 4 Step 6)
target-team: Backend — Commerce service / Communication Channels
priority: medium (Step 3 of Add Client wizard now uses fallback empty list on 404)
impact: 1 frontend step (Add Client Step 3 — CommChannels & Services row configuration)
related: 'Brain Outputs/understanding/pages/organization-hierarchy/Add Client/17-BACKEND_QUESTION_Q6_COMM_CHANNELS_CATALOG.md'
---

# CommunicationChannel catalog endpoint — implemented speculatively in Wave 4 Step 6

## What I did

Added `ClientService.listCommunicationChannels()` to:

```
apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/services/client.service.ts
```

Hits `GET /commerce/CommunicationChannel` via System Gateway and maps the response shape `CatalogRowResponse[]` (intersection of Application + CommunicationChannel DTOs — accepts `id` or `appId`, `name`).

## Why it's pending

Per `[BRAIN-OUT] 17-BACKEND_QUESTION_Q6_COMM_CHANNELS_CATALOG.md`:

> No GET endpoint returning a "CommChannels catalog" is documented in the registry we have. Possibilities:
> - Endpoint exists on a controller we haven't crawled (e.g. CommunicationChannelController)
> - Endpoint is on a different service
> - Endpoint doesn't exist yet

Q6 was carrying that gap. Backend has NOT confirmed:
1. Whether `GET /commerce/CommunicationChannel` exists
2. What auth scheme it uses
3. What its response DTO shape is
4. Whether row identity is `id` or `appId`

## What I did to mitigate

The catalog fetch silently falls back to `[]` on any HTTP error (404 / 500 / network). The Step 3 component then keeps its seeded fallback rows (WhatsApp / Voice / AI). So **the wizard still functions** even if the endpoint doesn't yet exist on backend.

## What I need from backend

Either:
1. Confirm `GET /commerce/CommunicationChannel` exists + the DTO shape, or
2. Provide the correct URL + DTO shape, or
3. Confirm the endpoint doesn't exist yet so we keep the seeded fallback as the production path until it's built.

## How to verify post-confirmation

Once backend confirms, update:
- `client.service.ts:listCommunicationChannels()` URL or DTO mapper (only if shape differs from `CatalogRowResponse`)
- This file → move "Status: open" → "Status: resolved" + add Resolution section
- `[BRAIN-OUT] Add Client/17-BACKEND_QUESTION_Q6_COMM_CHANNELS_CATALOG.md` → mark resolved
