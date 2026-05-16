---
type: backend-question
ticket-id: Q-2026-05-16-CC-CATALOG
status: open
raised: 2026-05-16
raised-by: Frontend (Ammar) / Brain SK orchestrator
target-team: Backend — Commerce service / Communication Channels
priority: medium (blocks Step 3 of Add Client wizard with real data; mock fallback available in interim)
impact: 1 frontend step (Add Client Step 3 — CommChannels & Services row configuration)
estimated-backend-effort: ~10 minutes to answer (just endpoint + DTO shape; no implementation work needed if endpoint already exists)
related-plan: 15-IMPLEMENTATION_PLAN.md v2.1 §5 Step 3 + §10 Q6
---

*** Backend Question — CommChannels Catalog Endpoint ***
*** Self-contained. No FE plan reading required. ***

# ❓ Backend Question — Add Client Step 3: CommChannels Catalog

## TL;DR

The Add Client wizard's **Step 3 (Configuring CommChannels & Services)** needs to display a list of all available Communication Channels so the Falcon admin can configure their `Visibility` + `PricingType` + `PriceValue` per channel during account creation. We've already verified Step 4's catalog (`GET /api/Application`) exists. **We can't find the equivalent endpoint for CommChannels.** Asking the Commerce / Comm-Channels team to confirm.

## The exact question

**What is the GET endpoint that returns the list of all Communication Channels available for a new account to configure, and what is its response DTO shape?**

Specifically:

1. **Endpoint name** (full URL path + HTTP method)
2. **Auth requirements** (Falcon admin role / Falcon-only / class-level attribute)
3. **Query parameters** (if any)
4. **Response DTO shape** (each row's fields — at minimum: channel id, channel name (single-lang or multi-lang?), icon/image, default `Show`/`Hide`?)

## What we already know

### From the playbook

The Add Client Step 3 playbook ([04-STEP_3_COMM_CHANNELS.md](04-STEP_3_COMM_CHANNELS.md)) lists per-channel fields the admin configures:
- `Visibility` (boolean: Show / Hide)
- `PricingType` (enum from PRD-AM)
- `PriceValue` (number, currency)

The playbook's placeholder endpoint name `GET /api/Setting/comm-channel-configs` is just a guess — we treat it as TBD until backend confirms.

### From our Commerce ENDPOINT_REGISTRY review

We checked `Brain Outputs/understanding/backend/commerce/ENDPOINT_REGISTRY.md` and found:

| Endpoint | What it does | Useful for Step 3? |
|---|---|---|
| `GET /api/Application` → `List<ApplicationResponse>` | Apps catalog (1 row per app available) | YES — already wired for Step 4 |
| `GET /api/Node/{id}/applications` → `List<AccountApplicationResponse>` | Per-account application list (post-create) | NO — wrong direction (read account's apps, not catalog) |
| `GET /api/Setting?ownerId=` → `GetSettingsResponse` | Per-account settings retrieval | NO — settings, not channels catalog |
| `PUT /api/Node/application/visibility` etc. | Per-account application visibility/price-type/price-value mutations | NO — post-create mutations |

**No GET endpoint returning a "CommChannels catalog" is documented in the registry we have.** Possibilities:

- Endpoint exists on a controller we haven't crawled (e.g. `CommunicationChannelController`)
- Endpoint is on a different service (e.g. served by Identity or a separate Comm-Channels service)
- Endpoint doesn't exist yet — catalog seeding lives elsewhere (Templates? Configuration?)
- Pattern is different — e.g. catalog is implicit in the Account settings response

### What Step 3 actually needs

The list of all channels Falcon supports (SMS, Email, WhatsApp, IVR, Push, etc.) so the admin can scroll through and:
- Toggle `Show`/`Hide` per row
- Pick `PricingType` per `Show` row
- Enter `PriceValue` per `Show` row

A single, channel-level catalog GET should be sufficient. We don't need any per-account context yet (account doesn't exist until Step 5 submit).

## Expected response shape (educated guess — please correct)

Based on the symmetry with `GET /api/Application`'s `ApplicationResponse`, we'd guess:

```
[
  {
    "appId": "guid",                   // or "id" / "communicationChannelId" / "channelKey" — please confirm
    "name": "WhatsApp",                // single string OR { en, ar } MultiLanguageName?
    "icon": "whatsapp",                // glyph name OR full URL?
    "defaultVisibility": "Show"        // optional default suggested by backend
    // ... any other catalog metadata
  },
  { /* SMS row */ },
  { /* Email row */ },
  ...
]
```

Per playbook drift #11, `Service.AppId` is the binding id for BOTH CommChannel rows AND Application rows (intentional code reuse). So the catalog's identifier field name might be `appId` even for CommChannels. **Please confirm** because the FE TS types depend on it.

## What unblocks if you answer

- Add Client Step 3 ships with REAL data instead of `mock-applications.ts` fallback
- FE TypeScript types for the CommChannels catalog row become accurate
- Light Learning event in `PAGE_LEARNING.md` closes
- We can also retire the playbook's placeholder endpoint name and update [04-STEP_3_COMM_CHANNELS.md](04-STEP_3_COMM_CHANNELS.md)

## What we'll do until answered

- Step 3 implementation will use `mock-applications.ts` as the catalog source (existing mock data)
- A Light Learning event will track the gap
- Step 3 ships functionally; data is just mock until you confirm

## Three possible answers — what each implies for FE work

| Backend answers | FE response | Effort |
|---|---|---|
| "Endpoint exists at `GET /api/CommunicationChannel`" (or similar) with confirmed DTO | Wire `loadCommChannelsCatalog()` to the real endpoint. Update TS types. Retire mock fallback for prod. | ~30 min |
| "Endpoint doesn't exist yet; we need to build it. ETA X." | Continue with mock; add it to the post-MVP backlog; revisit when endpoint lands. | 0 min FE / X min BE |
| "Catalog is implicit — channels come from `GetSettingsResponse` on the parent node" | Refactor: load parent node settings on wizard open, derive channel list from that. Higher coupling but no new endpoint needed. | ~1 hour |

## References for backend reviewer

- `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-comm-channels-step/` — the consuming step component
- `apps/admin-console/src/app/features/org-hierarchy-page/services/mock-applications.ts` — current mock source
- Commerce `ENDPOINT_REGISTRY.md` row 51: `GET /api/Application` (the Apps catalog we already use for Step 4)
- Playbook [04-STEP_3_COMM_CHANNELS.md](04-STEP_3_COMM_CHANNELS.md) — the spec for what Step 3 does with the catalog
- Playbook 13-GAPS_AND_DRIFTS drift #11 — `Service.AppId` overloading note
- Plan v2.1 §5 Step 3 — implementation contract that consumes this answer

## How to reply

Either:

- **(Preferred)** Update `Brain Outputs/understanding/backend/commerce/ENDPOINT_REGISTRY.md` with the row (or add `CommunicationChannelController` section if it's its own controller) — the Brain SK auto-sync picks up changes
- Or reply on this ticket directly (append a "Resolution" section below)
- Or comment in Azure DevOps / Slack — Frontend will absorb the answer into the FE plan + retire this ticket

## Resolution

_(awaiting backend reply)_

---

## Related

- [15-IMPLEMENTATION_PLAN.md](15-IMPLEMENTATION_PLAN.md) v2.1 §5 Step 3 + §10 Q6
- [16-OPEN_QUESTIONS_RESOLVED.md](16-OPEN_QUESTIONS_RESOLVED.md) — Q6 PARTIAL resolution (this ticket is the open half)
- Commerce ENDPOINT_REGISTRY — `Brain Outputs/understanding/backend/commerce/ENDPOINT_REGISTRY.md`
- Add Client playbook [04-STEP_3_COMM_CHANNELS.md](04-STEP_3_COMM_CHANNELS.md)

## Tags

#type/backend-question #flow/add-client #step-3 #commchannels-catalog #open
