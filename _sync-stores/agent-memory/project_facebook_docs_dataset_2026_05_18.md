---
name: Facebook / Meta developer docs dataset
description: Facebook/Meta dev-docs brain dataset — full briefing. RECALL THIS whenever the user says "Facebook", "start with Facebook", or asks about Meta/Facebook documentation. Covers location, current state, what is still needed, and how to resume.
type: project
originSessionId: c36e40fa-8233-4b1c-9cf0-39809f1e1c2e
---
# Facebook / Meta Developer Documentation — Full Briefing

> If the user says **"let's start with Facebook"** (or anything about Meta/Facebook docs),
> this file is the answer. Read it, then read the dataset's own `0-INDEX.md`.

## WHERE IT IS
`C:\Falcon\Brain Outputs\datasets\Facebook documents\`
- `0-INDEX.md` — master map: every page, grouped into 14 product groups, linked. **Entry point.**
- `raw\` — 996 markdown files (~20 MB) mirroring the `developers.facebook.com/docs/` URL tree (40 folders).
- `summaries\01-app-development … 13-data-privacy` — 14 per-group catalog READMEs (title + description + size per page). **Catalog-level only — NOT deep content summaries.**
- `manifest.json` — machine-readable page list (url, title, file, bytes).
- `map-raw.json` — original Firecrawl URL map (204 URLs).

## CURRENT STATE (as of 2026-05-18)
- Crawled 1000 pages of https://developers.facebook.com/docs/ via Firecrawl REST API. DONE.
- Folder structure + master index + 14 catalog READMEs. DONE.
- User said: do NOT modify anything inside the `Facebook documents\` folders. Leave it parked.

## WHAT IT STILL NEEDS (the open work)
1. **Deep per-page content summaries** — PENDING. `summaries\` is only catalog-level (titles/descriptions).
   The real "deep dive" = read the 19.7 MB of raw markdown and write condensed brain-ready
   summaries per group. Plan: parallel sub-agents, one per product group. User has NOT
   authorized this yet — was parked on 2026-05-18.
2. **Remaining pages** — only 1000 of ~several-thousand total Meta-docs pages were captured
   (the most-linked/important ones). Deep API-reference leaf pages are partially missed.
   To get more: run another Firecrawl crawl after the credit budget resets.
3. **Optional:** register the dataset in the brain Master Index
   `C:\Falcon\Brain Outputs\datasets\authority-dataset\0-MASTER-INDEX.md` so the brain
   auto-routes Meta-docs questions to it. User had not decided on this.

## HOW IT WAS DONE / HOW TO RESUME
- Tool: **Firecrawl** cloud crawl API — base `https://api.firecrawl.dev/v2`, `Authorization: Bearer <key>`.
  Endpoints used: `POST /map`, `POST /crawl`, `GET /crawl/{id}` (paginated via `next`), `GET /team/credit-usage`.
- Crawl job id (expired ~2026-05-19): `019e3bd1-b311-77b4-a9ad-98c7ef630cb9`.
- API key used: `fc-0a16da6629b64c598e8cabbdbcdb0c3f` — Firecrawl free tier, ~1024 credits/mo,
  billing period resets **2026-06-18**. ~24 credits left after this crawl.
  If the key fails, generate a fresh free one at https://firecrawl.dev (1 credit ≈ 1 page).
- Crawl params that worked: `{"limit":1000,"maxDiscoveryDepth":6,"scrapeOptions":{"formats":["markdown"],"onlyMainContent":true}}`.

## RELATED FACTS
- Biggest groups: Graph API (350 pp), Marketing/Ads/Commerce (~110 pp, 6.5 MB),
  Instagram & Threads (130 pp), Business Messaging WhatsApp/Messenger/IG (72 pp) —
  Business Messaging is the slice most relevant to Falcon's Comm Channels domain.
- `developers.facebook.com` has NO `sitemap.xml` (404) — tree was link-discovered.
- No crawler MCP is installed; the REST API was called directly via `curl`/Node.
