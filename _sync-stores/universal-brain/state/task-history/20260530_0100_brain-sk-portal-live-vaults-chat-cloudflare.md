# Brain SK Portal — live data · two Obsidian vaults · faster+smarter chat · Cloudflare publish

**Date:** 2026-05-30 · **Mode:** night-shift autopilot, orchestrator · **Result:** 🟢 ALL 4 WAVES DONE, live-verified on this PC, 0 console errors · **NO COMMITS** (uncommitted working tree).

## What the user asked
1. Deep-dive `C:\Falcon\brain-sk-portal`; link **everything live to the brain — no default/mock data**.
2. **Two selectable Obsidian vaults** with Obsidian links visible.
3. Make the **chat faster + smarter** (Anthropic or Google key — investigate & pick best).
4. Make it all work locally + **publish to Cloudflare** to share with anyone (best practice).

## What shipped (all verified live via preview MCP on this PC)
- **Wave 1 — live data:** `brain.py.graph_full()` maps real `nodes.json`/`edges.json` (533 nodes/477 edges, 24 types) into the graph screen's shape (prefix from evidence, trust heuristic, family map incl Role→rules); live inventory (ValidationRule 103 · PES 62 · Component 62 · DesignToken 52 · DTO 21 · Kafka 21 · BR 12 · Gap 10 · Conflict 19), stats, trustDist, skills (108), activity (real mtimes). `brain-live.js` merges ALL into `window.BRAIN/BRAIN2` (zero screen edits except adaptive force-layout for 533 nodes → 140ms). Disk-cached store counts + startup warm → cold start 8s→0.009s.
- **Wave 2 — two Obsidian vaults:** vault engine in `brain.py` (wikilink parse + backlink graph, cached) + `/api/vaults`,`/tree`,`/note`. NEW `screen-vaults.jsx` + `vault.css`: vault selector (Falcon Wiki 308 ↔ Brain SK Obsidian 453), folder tree, compact markdown renderer, clickable `[[wikilinks]]`, backlinks panel (hub note = 275), outline. Verified: vault switching, backlink + in-body-wikilink navigation.
- **Wave 3 — chat:** pluggable provider (`anthropic` w/ prompt-cache | `gemini` | improved `cli` from neutral temp cwd + Haiku) + live graph grounding + `config.json` (gitignored, server-side keys) + rebuilt Settings UI. Verified: CLI answer in 8s with `[BRAIN-SK]` tag; Anthropic plumbing (fake key→clean 401). **Recommendation: Anthropic Haiku** default (fastest+grounded+cached), Gemini for free-tier sharing.
- **Wave 4 — Cloudflare:** public-mode hardening (token gate on /api/*, CLI chat disabled=no RCE, skill-run/config-write 403) + `publish.py`/`Publish (Cloudflare).cmd`/`PUBLISH.md`. **LIVE-PROVEN** through `https://*.trycloudflare.com` (page 200 w/ injected live nodes:533; vaults 200 w/ token / 401 without; skill-run 403; CLI chat disabled). Torn down + restored local-only after proof.

## Architecture decision
Publish via **Cloudflare Tunnel** (not Pages/Workers) because the portal serves 2.3GB+ live local files + runs local tooling — Pages can't reach the disk. Tunnel keeps everything live+local while shareable.

## Files touched (brain-sk-portal, uncommitted)
backend/brain.py, backend/server.py, app/brain/{brain-live.js, screen-graph.jsx, screen-command.jsx, settings.jsx, screen-vaults.jsx(new), vault.css(new)}, app/Falcon Brain Portal.html, config.json(new,gitignored), .gitignore(new), publish.py(new), Publish (Cloudflare).cmd(new), PUBLISH.md(new), NIGHT-SHIFT-PLAN-2026-05-30.md(new).

## Human-only next steps (cannot be automated)
1. Paste an **Anthropic** (recommended) or **Gemini** API key in ⚙ Settings → Live model → 1-3s grounded chat (CLI fallback works now at ~8s).
2. (Optional) `cloudflared tunnel login` for a **permanent** named-tunnel URL — the quick tunnel works now with no login.

## Known limitations
- `Falcon Brain Portal (standalone).html` (single-file email copy) does NOT include the new live features (it has no backend — never could); the live experience is the served/tunnelled app.
- trust distribution is a heuristic (nodes.json doesn't persist trust scores) — labelled honestly, not fabricated.
