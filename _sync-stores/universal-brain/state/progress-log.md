*** Progress log — Org Hierarchy Falcon Eyes ***
*** Created: 2026-05-15 ***

## Step 1 — Source startup
- Source URL probed: `http://localhost:3000/T2%20Falcon%20Admin` → HTTP 200 (4482 bytes, matches T2 Falcon Admin.html)
- Destination URL probed: `http://localhost:4200/` → HTTP 200; full destination route uses hash fragment so probe is on shell.
- Port 3000 PID 23200 already serving the static React SoT directory; port 4200 already serving Angular admin-console (the long-running dev server from the night shift).
- The React SoT directory has no package.json — it is served as static files. The 4482-byte HTML at `/T2 Falcon Admin` is the SoT page.
- No need to start a new dev server. Falcon Eyes will hit the existing endpoints.

## Step 2 — Falcon Eyes capture
- About to run `npx tsx capture-and-compare.ts` from `C:/Falcon/Brain SK/tools/falcon-eyes`.
- Output root: `C:/Falcon/Brain Outputs/reports/falcon-eyes/<stamp>/`.

---

## 2026-05-29 — P5.1 (gap H5/R-6): backend role-edit-matrix PES enforcement on create-user — DONE
- Service: falcon-core-identity-svc. Seam chosen = guard step INSIDE `CreateUserProcess.Handle` (Option E). Endpoint `CreateUserEndpoint` UNTOUCHED (constraint honored). NOTE: the prompt's hint to "reuse AccessRoleLinkClient as the PES authorize client" was wrong — that client is a Kafka publisher (fire-and-forget); Identity had NO synchronous PES path. Added one.
- Verification (live stack, recompiled identity container via `dotnet run` on mounted volume): admin→acc-owner = HTTP 403 "not authorized to assign this role"; owner→acc-admin = 200 created; admin→acc-user = 200 created; user→anything = 403. Decision log lines from new RoleEditAuthorizationClient confirm subject `u:<zid>@<tenant>` + action `change-<target>-to-<target>` against PES `user.role.other` matched live PES exactly.
- Build green (0/0). xUnit: 178 pass incl. 6 CreateUserProcessTests (2 new); 3 PRE-EXISTING unrelated failures (ResendOtp DevOtpCode x2 + UserCreationRequestedConsumer offset test) — none touch any file I changed.
- NO commits (working tree only). Left 2 throwaway test users in test-tenant-001 from the live proof (proofpt6dsz, proofj3u6c8) — harmless dev seed data.

---

## 2026-05-20 — Data-table skeleton-loading system
- Step 1 — defaults `6 → 5` in 3 files (`falcon-table.tsx:115`, `falcon-table-tw.tsx:161`, `falcon-data-table.component.ts:165`) plus added `[skeletonRows]` to `falcon-table.component.ts` (Angular wrapper had no such input).
- Step 2 — 3 new files in `libs/falcon-studio/src/lib/services/`: `data-table-skeleton-defaults.token.ts`, `data-table-skeleton-defaults.provider.ts`, `provide-falcon-data-table-skeleton.ts`. Mirrors the `provideFalconLoader()` pattern 1-for-1.
- Step 3 — Both Angular wrappers (`falcon-angular-data-table`, `falcon-angular-table`) inject `FALCON_DATA_TABLE_SKELETON_DEFAULTS` and emit 8 host-bound CSS vars via `[style.--falcon-data-table-skeleton-*]`. Sentinel-tracked `[skeletonRows]` setter — consumer always wins.
- Step 4 — Added `--falcon-data-table-skeleton-bg-highlight` + 4 animation tokens (`animation-name|duration|easing|iteration`) to `data-table.tokens.css`. New keyframes `falcon-skeleton-pulse` + `falcon-skeleton-shimmer` in both `falcon-table.css` + `falcon-table-tw.css`. Dropped `animate-pulse` from TW class fn (was overriding the var-driven `animation` shorthand).
- Step 5 — `provideFalconDataTableSkeleton()` installed in all 3 `app.config.ts` (host-shell + admin-console + management-console). No overrides — library defaults drive every consumer. 3 consumer tables left with `TODO(skeleton)` comments (org-hierarchy users sub-table, Add-Client Step 3 + Step 4 wizards) — no existing loading signal to bind.
- Step 6 — 6 `nx build` PASS. Hashes: admin `f6e0fbf79b6e3253` (20.7s), mgmt `d38565a6c3605560` (19.8s), host-shell prod `c5eea28a19a5d5f0` (24.3s). falcon-ui-core Stencil rebuild 49.47s.
- Step 7 — Wrote memory `project_data_table_skeleton_loading_system_2026_05_20.md` + prepended MEMORY.md index entry + Brain SK Obsidian note at `_obsidian/37-Loading/Data-Table-Skeleton.md` (35/36 prefixes already in use; doc'd the decision in the note frontmatter).
- DEFERRED: `<falcon-tree-table>` — Stencil tree-table has no `loading`/`skeletonRows` props at all. Halt-and-flag trigger from task contract honoured: flat table shipped first.
- RUNTIME VERIFICATION: pending — code is build-green and all wiring is in place, but no browser-side observation yet.

---

## 2026-05-27 — brain-setup-trust-assessment

### Phase 1 — Read instructions
- Read project CLAUDE.md (87 lines) and global CLAUDE.md (3 lines).
- Confirmed brain lifecycle is mandatory per `.claude/CLAUDE.md` § Brain Lifecycle.
- Confirmed source-prefix protocol applies (session-start hook auto-loaded it).

### Phase 2 — Walk all 10 brain stores on disk
- Inventoried sizes + file counts for 10 stores (table emitted to user).
- Confirmed sync repo alive at `C:\falcon-brain-sync\` last commit `1f57664 2026-05-24`.
- Confirmed previous `current-task.json` was status=completed (service-pricing shadow-row 2026-05-21) — no conflict, safe to start new task.

### Phase 3 — Read authority routing + verification status
- Master Index: 12 routing tables + 7 stores + ~45 trigger phrases.
- VERIFICATION-STATUS.md: PES backend gate 21/21 ✋ runtime-verified; FE UI 🔴 blocked on 40+ Stencil errors.

### Phase 4 — Emit deliverables to user
- 10-store inventory table.
- 10 advantages (all source-prefixed).
- 12 disadvantages (all source-prefixed).
- Per-store trust matrix.
- Overall trust ~7/10.

### Phase 5 — Persist this task to the brain
- Overwrote `current-task.json` with new task (status in_progress).
- Appended this section to progress-log.md.
- Created `backups/latest-restore-packet.md` (was MISSING before — empty dir).

### Gaps surfaced
- `backups/latest-restore-packet.md` did not exist before this task; brain skill's required outputs list it. Fixed.
- MEMORY.md autoload truncates at ~24 / 261 lines — most index invisible at session start.

### Next
- Wait for user reaction. On approval → archive task to `task-history/`.

### Phase 6 — Full brain architecture chart (added 2026-05-27)
- User asked for a single comprehensive chart of all brain folders + MD files + usage.
- Walked all 10 stores' top 2-3 directory levels via PowerShell.
- Synthesized into `C:\Falcon\Brain Outputs\datasets\authority-dataset\BRAIN-ARCHITECTURE-CHART.md` — 12 sections, 4 Mermaid diagrams, comprehensive folder trees, lifecycle flow, read/write matrix, routing tree, source-prefix protocol, verification ladder, 22 hygiene invariants, quick-reference card.
- Added cross-reference from `0-MASTER-INDEX.md` § See also.
- Total deliverable: ~700-line single-file canonical brain map. Maintainable, source-prefixed, evidence-grounded.

### Files emitted this phase
- NEW: `Brain Outputs\datasets\authority-dataset\BRAIN-ARCHITECTURE-CHART.md`
- EDIT: `Brain Outputs\datasets\authority-dataset\0-MASTER-INDEX.md` (See also section)
- EDIT: this progress log

### Maintenance contract emitted
Any future brain change (new store · folder rename · sync scheme change) MUST:
1. Update BRAIN-ARCHITECTURE-CHART.md
2. Update 0-MASTER-INDEX.md routing
3. Add a home-memory topic file
4. Update VERIFICATION-STATUS.md if verification semantics change
5. Push the sync repo

---

## 2026-05-27 — Brain Improvement Plan AUTOPILOT execution (14 waves)

User issued: "autopilot activation is on, you are the orchestrator, multiple agents/waves OK".

### Waves executed
1. **Wave 1 — Phase 0 pre-flight:** snapshot dir created at `universal-brain/snapshots/pre-2026-05-27-improvements/` (8.96 MB / 553 files); 4 critical store dirs + 4 obsidian config files captured for rollback safety; INVENTORY.md written.
2. **Wave 2 — Plugin parity:** Claudian + Tasks copied → falcon-wiki; Breadcrumbs + Tag Wrangler copied → Brain SK; both community-plugins.json updated (additive only); PLUGIN-INSTALL-LOG-2026-05-27.md.
3. **Wave 3 — Brain skill quick wins:** /brain-status, /brain-help created; start-brain.md gained auto-archive step; save-session-state.md gained backups rotation (Wave 13); session-coordination orphan moved to _archive/; backups/archive/ created.
4. **Wave 4 — MEMORY compaction (subagent):** 121 KB → 45.9 KB (62% reduction), 229/229 entries preserved, MEMORY.legacy-2026-05-27.md saved. Now fully fits in autoload cap.
5. **Wave 5 — Frontmatter schema:** FRONTMATTER-SCHEMA-2026-05-27.md designed and adopted (autopilot — no proposal stop).
6. **Wave 6 — Frontmatter backfill (subagent):** 49 files / ~707 new keys added across V-rules + E-* + Q-*; FRONTMATTER-BACKFILL-LOG written; zero failures.
7. **Wave 7 — Dataview MATRIX (subagent):** 6 MATRIX files rewritten with live query + static fallback; 6 MATRIX.legacy-2026-05-27.md byte-identical backups.
8. **Wave 8 — Bases registries (subagent):** V-rules.base, E-entities.base, Q-tickets.base, BR-registry.base + 4 .base.README.md sibling docs.
9. **Wave 9 — Templater + MOCs (subagent):** 4 new templates (Q-ticket, BR-rule, topic-memory, daily-note); 2 existing templates skipped (V-rule, E-entity); 5 new MOCs in falcon-wiki/00-MOCs/.
10. **Wave 10 — Tag taxonomy:** TAG-TAXONOMY-2026-05-27.md with 7 canonical namespaces (autopilot — schema applied via Wave 6 backfill).
11. **Wave 11 — Canvas + icons:** BRAIN-ARCHITECTURE.canvas (Obsidian Canvas twin of the chart); OBSIDIAN-ICON-MAPPING-2026-05-27.md (user-applies-manually per governance rule).
12. **Wave 12 — Tasks integration (subagent):** 21 Q-* files gained `## Tasks-plugin tracking` sections (append-only, frontmatter untouched); Tasks-MOC.md created.
13. **Wave 13 — Polish:** check-source-prefix.ps1 lint script; save-session-state.md edited for backups rotation; universal-brain/MAINTENANCE.md as single index of standing contracts.
14. **Wave 14 — Verify + archive:** all deliverables verified on disk; PLAN-COMPLETION-REPORT-2026-05-27.md written; task archived to task-history/20260527_180000_brain-improvement-plan-autopilot.md; current-task.json reset to status=idle.

### Files impact summary
- Created: ~30 new files
- Modified additively: ~90 files (frontmatter + body appends)
- Renamed to .legacy-2026-05-27: 7 files (MEMORY + 6 MATRIX)
- Moved: 1 file (session-coordination orphan)
- Deleted: 0

### Subagents spawned: 6 (MEMORY, frontmatter, MATRIX, Templater+MOCs, Bases, Tasks)

### Sync state: NOT pushed. Per standing "never push without explicit instruction" rule. Sync repo last commit unchanged: 1f57664 2026-05-24.

### Status: COMPLETED. Awaiting user to open Obsidian and verify Dataview/Bases/Tasks rendering.

---

## 2026-05-27 (later) — Obsidian graph-playback Wave 2 (supplementary run)

User session resumed with new in-progress task `obsidian-graph-playback-wave-loop-2026-05-27` (Wave 1 already landed by prior session at 15:26 UTC; Wave 2 metadata stub landed at 16:19 UTC).

Per "do the best for the brain" directive, I executed a supplementary Wave 2 pass:

### What I did
- Read Wave 1 foundation files (GRAPH_SCHEMA, COMPONENT_REGISTRY, GRAPH_GAPS_AND_NEXT_STEPS, nodes.json head, edges.json head)
- Disk-walked `Brain Outputs/understanding/frontend/components/` → 61 actual components (vs 63 inferred in Wave 1 registry)
- Spawned 5 parallel Explore agents:
  - Agent A: 15 components (accordion → dialog)
  - Agent B: 15 components (drawer → multi-select)
  - Agent C: 15 components (multiselect-legacy → single-uploader)
  - Agent D: 16 components (status-badge → send-credentials-popup)
  - Agent E: theming layer (4 modes, 30 design tokens, 19 var namespaces, 7 Tailwind overrides, 25 distinctive classes, 11 visual states)
- Aggregated into `graph/nodes-wave-002.json` (~136 typed nodes) + `graph/edges-wave-002.json` (~140 typed edges)
- Added addendum to existing `WAVE-002-GRAPH-PLAYBACK.md` preserving prior work verbatim

### Disk reconciliation findings
- 7 renames (`falcon-number-field` → `falcon-input-number`, `falcon-popover` → `falcon-popup`, etc.)
- 16 removed (inferred slugs with no on-disk dossier)
- 20 added (on-disk dossiers missed in Wave 1 registry)
- 10 deprecated components flagged with MIGRATION_TARGET_IS edges
- 4 architectural drift findings: focus-ring color drift, spacing-7/8 Tailwind overrides, tree vs tree-panel divergence, 27-stop neutral over-granulation

### Files emitted (this session contribution)
- `200-Graph/graph/nodes-wave-002.json` (NEW)
- `200-Graph/graph/edges-wave-002.json` (NEW)
- `200-Graph/waves/WAVE-002-GRAPH-PLAYBACK.md` (addendum appended)
- `universal-brain/state/current-task.json` (Wave 2 marked complete, Wave 3 queued)
- `universal-brain/state/progress-log.md` (this entry)

### Safety checks honored
- No app code edits ✓
- No git commits or pushes ✓
- No npm/docker/test/server started ✓
- No edits to plugin data.json or workspace.json ✓
- All writes confined to `falcon-wiki/200-Graph/` + `universal-brain/state/` ✓
- Prior Wave 2 work preserved verbatim (addendum, not overwrite) ✓

### Status: Wave 2 COMPLETE. Awaiting trigger for Wave 3 (or user nod to halt the loop).

---

## 2026-05-27 (close-out) — Graph playback wave loop HALTED

User issued: `halt the loop`.

Final state at halt (per current-task.json prior to archive):
- Waves completed: **10 / 10**
- Graph coverage: **94%** (target was 90%)
- Brain understanding: **57% → 94%** (+37 pts)
- Stop conditions: **7 / 7 met since Wave 7**
- Total graph: **1,462 nodes · 5,209 edges**
- Final deliverable: PDF report ~366 KB / 12 pages at `falcon-wiki/200-Graph/.exports/FALCON-KNOWLEDGE-GRAPH-FINAL-REPORT.pdf`

### Close-out actions
1. Wrote task archive to `task-history/20260527_172000_obsidian-graph-playback-wave-loop.md` (full manifest of 10 waves + deliverables + safety checks).
2. Reset `current-task.json` to `status: idle` (clean state for next task).
3. Refreshed `latest-restore-packet.md` with summary of both today's archived tasks and entry points for future sessions.

### Safety honored across all 10 waves
- No app code edits · no commits · no npm/docker/test/server · no secrets · writes confined to knowledge areas · evidence-only edges throughout · Chrome headless print one-shot only.

### Sync state
- `C:\falcon-brain-sync\` last commit unchanged at `1f57664 2026-05-24`.
- ALL of today's work (brain-improvement-plan-autopilot + graph-playback) is unpushed.
- Awaiting user "push" instruction to mirror to GitHub.

### Brain is idle and clean. Awaiting next task.

---
## 2026-05-29 — Mgmt-console authority + PES parity (ultracode)
**Phase: Recon + workflow launch (COMPLETE)**
- Read brain Master Index + Verification Status. Prior task completed; created new task `mgmt-console-authority-pes-parity-2026-05-29`.
- User decisions: (1) multi-agent ultracode workflow; (2) reports + plan + RUN seeding now; (3) full-stack reach (FE + access-svc PES rules + essentials seeding). PIS interpreted as PES.
- Baseline confirmed: falcon-web-platform-ui origin/main + worktree `Brain Outputs/worktrees/falcon-old-ui-main` = SoT (old UI); current branch `polishing-v0.4` = target (new UI). access-svc + identity on `main`.
- Docker stack UP (18 containers, falcon-pes-1 healthy) — seeding can run live.
- Path correction: real essentials = `C:\Falcon\Falcon\Falcon\falcon-essentials\zitadel\` (3x Falcon). Seed set: seed.sh, seed-test-users.sh, seed-toyota-users.sh, bootstrap-cluster.sh, apply-zitadel-config.py, pes-account-role-rules.json.
- pes-account-role-rules.json read: ~90 tenant-scoped p-rules across acc-owner/acc-admin/acc-user keyed `r:<role>@{TENANT_ID}` — matches authority dataset exactly.
- Launched workflow wf_c8e59e7b-8b5: 8 research agents + 6 HTML reports + master plan → `C:\Falcon\reports\mgmt-console-authority-pes-2026-05-29\`.

**Next:** await workflow → build index.html + finalize plan → execute P0 PES seeding vs live Docker → verify per client type.

---

## 2026-05-29 — Mgmt-Console Authority+PES parity: 3 surgical FE fixes (Part E, FE-only, no commits)
- Branch polishing-v0.4. Re-resolved all line numbers against live files (R-7 staleness confirmed: real lines differ from report's ~20-stale numbers).
- FIX #2 (P2.2/SC-4/H4) — add-user-wizard.component.ts: removed the fail-open. canAddUser + grantableRoles now derive STRICTLY from PES can(); deleted addUserUnreachable/unreachable branch + the now-unused `AccessQuery` import. resolveFlags() returns all-false (not throw) on PES outage → empty dropdown + closed wizard for every actor. Honors OtherRoleEditMatrix; acc-owner normal PES still {owner,admin,user}.
- FIX #5 (P2.1/SC-6/H3) — contact-groups/models/models.ts computeRowFlags: canEditRow/canDeleteRow back to `&& isOwner` (dropped `|| canShareOther`); canShareRow KEEPS canShareOther. Matches backend own-only ABAC + old-UI models.ts:55-58.
- FIX #7 (P2.3/M1) — users-state.signals.ts visibleTabs: AND CommChannels+Apps with new `_canViewServices` signal resolved from FalconAccess.managementConsole.services.view() (acc.services.view). Default false=fail-closed; resolved in constructor effect keyed off selectedNode() (mirrors hierarchy-page-state.service.ts:221-225 canAddUser pattern). Settings/Hierarchy untouched. acc-admin (DENY) loses CommChannels/Apps; acc-owner (allow) keeps them.
- Build: nx build management-console --skip-nx-cache running (background). NO shared-lib touched → host-shell build not required.

- BUILD RESULT: GREEN. `nx build management-console --skip-nx-cache` exit 0. mgmt prod hash `6b9e711c4c9498be`; host-shell dep hash `2d4ea0e7899e84aa`. "Successfully ran target build for project management-console and 6 tasks." Zero errors; all warnings pre-existing/unrelated (NG8113 dead tree-table import, unused-file warnings, signalr vendor). NO COMMITS. Files in working tree on polishing-v0.4.

## 2026-05-30 — Brain SK Portal night-shift
### Wave 1 — Live-data backbone (DONE, live-verified on this PC)
- brain.py: added graph_full() (real nodes.json/edges.json → screen shape; derive prefix from evidence, trust heuristic, purpose; family map covers all 24 types incl Role→rules), inventory_live, stats_live, attention_live, trust_dist_live, skills_live, activity_live (real mtimes). Disk-backed + bg-refreshed store-count cache + startup warm() → cold start 8s→0.009s.
- brain-live.js: merge ALL into window.BRAIN/BRAIN2 (G_NODES/G_EDGES/NODE_FAMILIES/EDGE_TYPES/STATS/INVENTORY/ATTENTION/TRUST_DIST/ACTIVITY/SKILLS_LIVE) — zero screen edits except adaptive force-layout iters in screen-graph.jsx (533 nodes layout 140ms).
- server.py: startup bg-warm + /api/graph/full,/api/skills,/api/activity.
- VERIFIED: graph renders 533 nodes/477 edges, inventory ValidationRule103/PES62/Comp62/DTO21/Kafka21/BR12/Gap10/Conflict19, stats ~70k files/8 waves/330 mem topics, 0 console errors.
- NEXT: Wave 2 two-vault Obsidian browser (falcon-wiki 325 md + Brain SK/_obsidian 453 md, wikilinks+backlinks).

### Wave 2 — Two Obsidian vaults + linking (DONE, live-verified)
- brain.py VAULTS engine: wiki(falcon-wiki 308 md) + brain-sk(Brain SK/_obsidian 453 md); vault_index (wikilink parse + backlink graph, cached), vaults_list, vault_tree, vault_note (frontmatter strip, outLinks resolved/unresolved, backlinks, headings). server.py: /api/vaults,/api/vault/{id}/tree,/api/vault/{id}/note.
- NEW screen-vaults.jsx + vault.css: vault selector tabs, folder tree, compact markdown renderer (headings/tables/code/lists/links), clickable [[wikilinks]], backlinks panel, outline. Wired nav (shell.jsx), routing (app.jsx fullBleed), HTML script+css.
- FIX: browser served stale JSX (FastAPI StaticFiles sent no Cache-Control) -> added no-cache/no-store middleware + per-start ASSET_VER cache-bust on every brain/* URL (also busts on Cloudflare redeploy).
- VERIFIED live: 2 vaults switchable; landed on hub note (brain-sk AMMAR_BRAIN_HOME 275 backlinks / wiki Tokens 65); backlink click -> MOC_CONNECTIONS_INDEX; in-body wikilink click -> 00-MOCs/Pages; 0 console errors.
- NEXT: Wave 3 pluggable chat provider (anthropic/gemini/cli) + brain-context grounding + Settings UI + config.json.

### Wave 3 — Faster + smarter chat (DONE, live-verified)
- brain.py: pluggable provider (anthropic | gemini | cli | auto) + config.json (gitignored, keys server-side only, env override) + public_config (no raw keys) + resolve_provider. Anthropic Messages API w/ prompt-cache on system block; Gemini generateContent; IMPROVED cli runs from neutral temp cwd (skips Falcon CLAUDE.md/hooks/skills) + --model haiku. brain_context_for() = live in-memory graph retrieval injected into system prompt (smarter). _norm_messages drops FE preamble pair.
- server.py: GET/POST /api/config (POST locked in public mode). settings.jsx rebuilt: provider tabs + key inputs + model selects + grounding toggle + active-provider banner.
- VERIFIED: /api/config activeProvider=cli; CLI chat returned [BRAIN-SK]-tagged grounded answer in 8s (vs old slow Opus-from-Falcon); Anthropic plumbing validated (fake key -> clean 401 invalid x-api-key = well-formed request); grounding pulled real pes:sys.wallet.transfer nodes; Settings modal renders all controls; 0 errors. Recommendation: Anthropic Haiku (fast+grounded) default, Gemini for free-tier sharing.
- NEXT: Wave 4 Cloudflare publish (tunnel) + public hardening (token gate, no-CLI, no-skill-mutation).

### Wave 4 — Cloudflare publish (live-local) + hardening (DONE, live-verified through the public internet)
- brain.py: public-mode chat guard (CLI disabled when public -> no RCE; only API providers). server.py: _gate_and_nocache middleware = token gate (?token / cookie) on all /api/* when public, hard-403 on /api/skill/run + POST /api/config, cookie set on valid page hit so assets/api pass.
- publish.py + "Publish (Cloudflare).cmd" + PUBLISH.md: one-command quick tunnel (no login) -> public *.trycloudflare.com/?token=… ; named-tunnel + Cloudflare API-token path documented (login is the only human step).
- LIVE PROOF (https://depot-packs-tuner-finite.trycloudflare.com): page 200 w/ token + injected live "nodes:533"; /api/vaults no-token=401, with-token=200 (Wiki 308/BrainSK 453 — LIVE local data over public net); skill-run=403; CLI chat=disabled. Tunnel + public mode then TORN DOWN; config restored public=false; local re-open verified (/=200,/api/vaults=200).
- Also fixed last stale hero copy in screen-command.jsx -> now live ("~70,363 files · 533-node/477-edge · 24/25 types · 108 skills · 11 agents").

## DONE — all 4 waves live-verified on this PC, 0 console errors. NO COMMITS (uncommitted working tree). Human-only next steps: paste Anthropic/Gemini key in Settings for 1-3s chat; `cloudflared tunnel login` for a permanent URL.

## 2026-05-30 — Brain SK Portal follow-up (DONE, live-verified, NO COMMITS)
### A) Universal Connections/keys panel in the live app
- brain.py: added GitHub Copilot/Models + OpenAI-compatible providers via `_openai_complete` (chat/completions); config fields copilotKey/copilotModel/copilotBase + openaiKey/openaiModel/openaiBase; env overrides (GITHUB_TOKEN/COPILOT_TOKEN/OPENAI_API_KEY); resolve_provider auto-order anthropic→gemini→copilot→openai→cli; public_config reflects hasCopilotKey/hasOpenaiKey.
- settings.jsx: 6 provider tabs (Auto·Anthropic·Gemini·Copilot·OpenAI·Local CLI) + 4 key inputs + models; keys server-side only (config.json gitignored). VERIFIED: copilot fake token → clean 401 Unauthorized (well-formed); banner shows active provider; 4 key fields render.
### B) Both Live-State tabs show EVERY real Claude session
- brain.py: sessions_live() enumerates ~/.claude/projects/**/*.jsonl (353 sessions), head-parse cwd+title+ts for ALL + tail-recent + msg-count for top 80, status by mtime recency (active<3m/idle<30m/recent<24h/ended), grouped + byProject; cached 15s. session_state_live() = real current-task.json + progress-log tail + task-history + restore-packet. server.py: /api/sessions, /api/session-state.
- screen-live.jsx REWRITTEN data-driven (polls /api/sessions every 10s; rail grouped by status, detail meta + recent-activity tail, ask-the-brain per session). screen-session.jsx REWRITTEN (real task card + currentStep/nextStep + restore packet + live progress log + real task history + 24-row sessions table + project chips). vault.css: ses-status dots/badges/meta.
- FIXED: duplicate "title" key in current-task.json (JSON last-wins showed stale wave1-4 title) → removed.
- VERIFIED live: Live tab "3 active · 353 total" (Active 3/Idle 4/Recent 48/Ended 145), detail = THIS session (0f24950e, 619 msgs, 2577.9KB, just now); Session tab real follow-up task in_progress + 8 history + 24-row table + 8 project chips; 0 console errors.
- DONE. NO COMMITS. Human-only: paste any provider key in Settings.

---
## fe-build-errors-fix-2026-05-30 (in_progress)

### Phase 1 — Triage & root cause (DONE)
Repo: C:/Falcon/Falcon/falcon-web-platform-ui  | branch night-shift-audit/2026-05-30-0128

**ROOT CAUSE #1 — falcon-ui-core wiped from working tree.** `git status` showed 1565 deletions; 1559 were the ENTIRE `libs/falcon-ui-core/` Stencil design-system lib (committed in HEAD, physically empty on disk — confirmed real dir, not a broken junction). tsconfig.base maps `@falcon/ui-core/*` → `./libs/falcon-ui-core/src/*` so every app failed module resolution. No stash; unrelated to committed audit waves. FIX: `git restore libs/falcon-ui-core/` (recovers HEAD state, scoped, reversible) → 1559 files back, 0 deletions remain.

**ROOT CAUSE #2 — node_modules wiped + native binary locked.** Root node_modules had only a stray `@tailwindcss/oxide` leftover whose native `.node` was LOCKED → first `npm ci` died EPERM unlink. Holder = PID 116120 WebStorm Tailwind CSS Language Server (confirmed via loaded-module scan: it had the project-local oxide `.node` mapped; no other proc did). FIX: stopped only that PID (stateless IDE helper, auto-restarts), deleted freed binary, re-ran `npm ci` → exit 0, 1018 pkgs, oxide restored, nx 22.7.1 OK.

**Intentional in-progress work (DO NOT REVERT):** (a) admin contracts-cost-management wizard refactor — 6 old section components → new folder-per-step layout (contract-information/rate-card/contract-details/addons -step + signals + models + validations); barrels all verified consistent. (b) tools/contracts-e2e harness. Both legit; left untouched.

### Phase 2 — Build libs + apps, capture REAL compile errors (IN PROGRESS)
build:libs running (tokens, ui-core Stencil, studio). Then build 3 apps individually (memory: batch --skip-nx-cache races on Stencil components.d.ts).

### Phase 2 — RESULTS (build errors fixed)
- host-shell build:development → GREEN (exit 0)
- management-console build:development → GREEN (exit 0; only benign NG8113 unused-RouterLink warning)
- admin-console build:development → was RED, now GREEN (exit 0, 16.57 MB bundle)

**ROOT CAUSE #3 — invalid SCSS token (the only code-level build error).** `apps/admin-console/.../wallet-balance-management/wallet-balance-management.component.scss:17` had `gap: var(--spacing-2.5)` introduced by committed audit wave 24a69870 ("token swap 10px -> var(--spacing-2.5)"). Two defects: (1) `.5` inside var() in a .scss file = Dart-Sass "Expected identifier" parse error; (2) Tailwind v4 has NO `--spacing-2.5` named token (only `--spacing: 0.25rem` base under :root,:host @layer theme) so it would resolve to nothing even in .css. Repo-wide grep: this was the ONLY dot-decimal token ref (no siblings). FIX: `gap: calc(var(--spacing) * 2.5)` = 0.625rem = exact original 10px, token-driven, SCSS-safe, global-scope-verified. Added inline note to prevent regression.

### Phase 3 — runtime verification (IN PROGRESS)
Serving host-shell :4200 (MF host; loads admin :4204 + mgmt :4301 remotes from dist). NOTE: full backend stack not running, so live API/login calls will fail — FE-level success = bundle loads + Angular bootstraps + shell renders + no module/compile console errors.

### Phase 3 — runtime verification (DONE) + Phase 4 finalize
**App RUNS in intended/deployed config:** user's Docker stack already serves the real Falcon FE — `:4200` = host-shell (`<title>T2_Demo</title>`, `<app-root>`), `:4301` = management-console. So the app runs as expected in host-integrated form.
**Working-tree code runs:** all 3 apps build green (deployable bundles) + admin-console DEV SERVER (`nx serve admin-console` :4204) "√ Compiled successfully" and serves.

**SEPARATE pre-existing finding (NOT a build error, NOT my change, OUT OF SCOPE): NG0201 on STANDALONE dev serve.** Serving admin-console standalone (:4204) → Angular `NG0201: No provider for DomRendererFactory2 (RendererFactory2 -> DomRendererFactory2)` from `provideAnimationsAsync()`'s AsyncAnimationRendererFactory; app shell stays blank. Evidence it is NOT mine: `bootstrap.ts`/`app.config.ts` are unmodified committed code (git status); reproducible from committed code + committed lockfile; NO Angular dep skew (single @angular/platform-browser@21.2.9 + @angular/animations@21.2.9). `bootstrap.ts` is the STANDALONE-ONLY entry (host path loads remote-entry/entry.routes.ts into the host injector — Docker :4200 proves host path renders). Tried a best-practice cleanup (drop `importProvidersFrom(BrowserModule)` + duplicate `provideAnimationsAsync()`, bootstrap from appConfig) — verified LIVE in served chunk but NG0201 persisted → deeper standalone cause → REVERTED (kept changeset to the verified SCSS fix only). Recommend separate task to fix dev standalone-serve.

**FINAL CHANGESET (working tree, NO COMMITS):** exactly ONE net code edit = wallet SCSS build fix. Plus environment restoration (git restore libs/falcon-ui-core = recover 1559 committed files; npm ci) + infra: C:/Falcon/.claude/launch.json admin cwd corrected. Intentional pre-existing work (contracts wizard refactor, contracts-e2e) left untouched. bootstrap.ts reverted clean; MF manifest no drift.

**STATUS: build errors FIXED + verified green. Task complete.**

---

## Task — Fix FE build issue (comm-mkt-card backtick-in-template) — 2026-05-30

### Symptom
`nx build management-console --configuration=development` → EXIT 1.
Errors: `comm-mkt-card.component.ts` NG1002 "Incorrect number of arguments to @Component decorator" + TS2362/TS1005/TS2304 "Cannot find name start/items/center/md"; cascade `comm-mkt-view.component.ts:77` NG2012 (CommMktCardComponent not a valid standalone component).

### Root cause [CODE]
`apps/management-console/src/app/features/comm-mkt-view/components/card/comm-mkt-card.component.ts`
Inline template literal opens L59 (`template: ` + backtick). HTML comments at L62/L64/L78 contained backtick-quoted code tokens — `self-start`, `items-center`, `md` — wrapped in literal backticks. Each pair prematurely CLOSED then REOPENED the JS template string, so the Tailwind fragments were parsed as TypeScript (self - start = arithmetic; bare identifiers start/items/center/md undefined). Introduced by the concurrent comm-mkt-view DoPayment/SoT refactor (see memory project_commchannels_marketplace_dopayment_signalr_2026_05_30). The other comm-mkt files were clean (build proved it — only this file + its consumer cascade were reported).

### Fix
Replaced the 3 decorative backtick pairs inside those in-template HTML comments with single quotes: 'self-start' / 'items-center' / 'md'. Minimal, intent-preserving (still reads as code tokens), and cannot terminate the JS literal. No logic/markup change.

### Sweep (best-practice / broad-zone)
Wrote a precise detector (scratch-detector2.mjs) that toggles through every inline `template:` literal in all 3 apps and flags any backtick that is not the legit closing delimiter → **CLEAN across mgmt + admin + host**. So this was the only occurrence.

### Verification (runtime evidence)
`nx run-many --target=build --projects=management-console,admin-console --configuration=development --skip-nx-cache` → **EXIT 0**. Both `management-console:build:development` and `admin-console:build:development` "Browser application bundle generation complete." Only benign pre-existing NG8113 (unused RouterLink in create-contact-group) warning. host-shell app source unchanged (git status) + detector-clean → not rebuilt.

### Changeset
ONE file edited: comm-mkt-card.component.ts (3 comment-only char swaps). NO COMMITS (branch night-shift-audit/2026-05-30-0128).

**STATUS: build issue FIXED + verified green (mgmt + admin).**

---

## Task — Settings edit error popup: real backend message + correct HTTP status — 2026-05-30

### Symptom (user)
Editing anything in the Org-Hierarchy **Settings** tab and saving raised a popup titled **"Validation error (HTTP 400) · 1 error"**. DevTools showed the real call: `PUT http://localhost:7038/commerce/Setting` → **403 Forbidden**, body `{ isSuccessful:false, errorCodes:["UnauthorizedUserToPerformThisAction"], errorMessages:["User Unauthorized To Perform This Action"] }`. User wants the popup readable + showing the backend message.

### Brain grounding (used FIRST)
- [BRAIN-OUT] `13-error-catalog/FE-CONTRACT.md` Rule 1 — HTTP status is the routing signal; Rule 2 — display `errorMessages[0]` verbatim (already localized).
- [BRAIN-OUT] `13-error-catalog/CATALOG.md` §1.3 — `UnauthorizedUserToPerformThisAction` = 403.
- [CODE] i18n `en.json:1492-1493` — `title.400`="Validation error (HTTP 400)", `title.403`="Permission denied (HTTP 403)".

### Root cause [CODE]
Flow: Settings PUT sets `notShowToaster:'true'` (tab owns its error UX; global ResponseInterceptor stays silent) → the 403 throws → `SettingsService.updateSettings` `catchError((err)=>of(httpFailure(err)))` → back in `settings-tab.signals.ts save()` `next` branch (`!res.isSuccessful`) → `openError({ httpStatus: inferStatus(errs), errorMessages: collectErrorMessages(...) })`.
`httpFailure()` (org-hierarchy/models/models.ts, **duplicated admin+mgmt**) **discarded `err.status`** and labelled the envelope `code:'network'`. `inferStatus()` then found no `httpStatusCode`, `'network'` isn't in `CODE_TO_STATUS` → **defaulted to 400** → dialog title `hierarchy.error.title.400` = "Validation error (HTTP 400)". The backend `errorMessages[0]` WAS already extracted by `extractServerError()` (`body.errorMessages[0]`) and projected into the dialog body `<ul>` (Stencil `falcon-alert-dialog-tw` renders `<slot>` in a body `<div class="py-2">`). So only the **status/title** was wrong.

### Fix
`httpFailure()` now reads the real status off the thrown `HttpErrorResponse` and carries it as `envelope.httpStatusCode` — **exactly the shape `inferStatus()` already reads** (`first.httpStatusCode`). Status `0`/absent (genuine network failure) is omitted so `inferStatus`'s code-based fallback is unchanged. Applied byte-identically to admin + mgmt `org-hierarchy-page/models/models.ts`. Result: 403 → "Permission denied (HTTP 403)" + "User Unauthorized To Perform This Action"; 422 → "Business rule rejected (HTTP 422)"; 409 → "Conflict (HTTP 409)"; etc. Fixes the same defect across all 4 `inferStatus()` call sites (settings-tab + info-panel save, both consoles).

### Verification
`nx run-many --target=build --projects=management-console,admin-console --configuration=development --skip-nx-cache` → **EXIT 0** (hash `26f697d6454bc3c9`). Warnings are pre-existing unused-file TS warnings only. **NOT runtime-verified** (live 403 needs Docker backend + acc-admin/acc-user login). 2 files, NO COMMITS.

**STATUS: FIXED + build-green. Runtime/browser pending.**

---

## Task — Settings-tab Edit gate made FAIL-CLOSED (both consoles) + LIVE PES verification — 2026-05-30

### User ask
"Who can edit Settings? If a user can't edit, the Edit button shouldn't show. Implement for mgmt + admin, make sure it works, use brain skills."

### Authority answer (brain-grounded)
[CODE] PES seed `pes-account-role-rules.json` + [BRAIN-OUT] `03-pes-keys/REGISTRY-RAW.md:41-44,79-84` + [BRAIN-OUT] PRD `01-account-management/WORKFLOWS.md:84-87`:
- **Mgmt (Client own account):** acc-owner = edit all 3 (Password-Security/Allowed-IPs/Quota); acc-admin + acc-user = DENY all 3.
- **Admin (Falcon):** Password-Security = sys-admin only; Allowed-IPs = sys-admin+sys-ops; Quota = sys-admin+sys-products; Root = sys-admin only.

### Bug + fix
[CODE] `settings-tab.signals.ts` fail-open guard (`failOpen = !editSecurity && !editAllowedIps && !editQuota; canEditX = failOpen ? true : …`) flipped all-denied → all-allowed, so acc-admin/acc-user (and sys-ops/sys-products on the Falcon root) SAW the Edit button (`@if canEditSecurity||canEditAllowedIps||canEditQuota`, org-hierarchy-page-menu.component.html:180) and hit the doomed 403 on Save. **Fix = FAIL-CLOSED**: `canEditX = !!f['editX']` (strict PES). Mirrors the approved add-user-wizard fail-closed gate ([CODE] add-user-wizard.component.ts:329 "never fails open"). Applied to BOTH consoles. acc-owner/sys-admin hold real allow flags → no-op for them.

### Verification — LIVE PES (real stack, non-fabricated)
Logged in via `POST :7777/api/auth/login` (OTP off). Batch `POST :5296/pes/authorize/resources` (shape from [CODE] access-control.client.ts + .types.ts; subject `u:<jwt.sub>@test-tenant-001`):
- **accadmin**: password-security/allowed-ips/quota edit → **false / false / false** ⇒ fail-closed ⇒ all pesFlags false ⇒ Edit button HIDDEN.
- **accowner**: → **true / true / true** ⇒ Edit button shown (no regression).
Build: `nx run-many ...management-console,admin-console --configuration=development --skip-nx-cache` → **EXIT 0**. 2 files. NO COMMITS. Running Docker :4301 still serves the PRE-fix bundle (would need rebuild/redeploy to click through); fix is in working tree + build-green + PES-proven.

**STATUS: FIXED (both consoles) + build-green + live-PES-verified. Optional: redeploy :4301 for a visual click-through.**

---

## Task — Per-section view+edit authority in Settings tab (both consoles) — 2026-05-30

### User ask (planned + approved via ExitPlanMode)
Apply per-section authority **only** in the Settings tabs of both consoles — HIDE a section the user cannot view, RO when viewable-not-editable, EDITABLE when permitted. Leave **Add Client** wizard untouched. PRD-grounded, best-practice, verify after implementing.

### Plan
`C:/Users/User/.claude/plans/gentle-booping-sonnet.md` (approved).

### Rule (fail-closed)
`canEditX = (resolved pesEditX === true)` · `canViewX = (resolved pesViewX === true) || canEditX` (edit ⇒ view). Section rendered only `@if (canViewX)`; quota also `hasQuota()` (BIZ-014). Controls editable inside only `!readonly() && canEditX`. **View query emitted ONLY where the FalconAccess registry has `.view()`** (mgmt: all 3 acc.*; admin: rootPasswordSecurityLevel when isFalconRoot). For resources with no seeded view rule, view query omitted → canView falls back to canEdit (editable section never wrongly hidden).

### Changeset (8 files)
- `settings-tab/models/models.ts` ×2 (mgmt+admin byte-identical): `SettingsPesFlags` + `canViewSecurity/canViewAllowedIps/canViewQuota`; `DEFAULT_PES_FLAGS` 6×false.
- `settings-tab/signals/settings-tab.signals.ts` ×2 (differ): **mgmt** added 3 `acc.*.view()` queries; **admin** added conditional `viewSecurity = rootPasswordSecurityLevel.view()` only when `isFalconRoot` (`as Record<…>` because the optional spread breaks the strict `as const` shape). Both: handler maps `canViewX = !!f['viewX'] || canEditX` (admin's account-side IPs/Quota fall back via `canEditX`).
- `settings-tab.component.ts` ×2 (byte-identical): added `canViewAny` computed.
- `settings-tab.component.html` ×2 (byte-identical): wrapped Password-Security block `@if (canViewSecurity)`; wrapped Allowed-IPs block `@if (canViewAllowedIps)`; quota aside `@if (hasQuota() && canViewQuota)`; new top-level `@else if (!canViewAny())` empty-state branch (icon `falcon-icon-lock` + neutral card).
- `libs/falcon/src/language/i18n/{en,ar}.json`: added `hierarchy.settings.noViewableSections.{title,detail}`.
- **NOT touched**: `org-hierarchy-page-menu.component.html` (Edit-button gate already fail-closed), `add-client-wizard/**`, `settings.service.ts`/`toUpdateSettingsRequest`, `users-state.signals.ts visibleTabs`.

### Verification (end-to-end)
**Build:** `nx run-many --target=build --projects=management-console,admin-console --configuration=development --skip-nx-cache` → **EXIT 0**. Only pre-existing unused-file warnings.

**Live PES (real stack):** `POST :5296/pes/authorize/resources` (login `:7777` Admin@1234, batch `view`+`edit`/resource) confirms the FULL matrix:
- mgmt **accadmin** all view+edit deny → **empty-state**; **accowner** all view+edit allow → **E·E·E**.
- admin **root sysadmin** rootPwdSec view✓+edit✓ → **E**, rootIPs edit✓ → **E**, Quota H (BIZ-014).
- admin **root sysops** rootPwdSec view✓+edit✗ → **RO** (the single RO cell in the whole matrix — exactly what `view || edit` is for), rootIPs+Quota deny → **H+H**.
- admin **root sysprod** all deny → **empty-state**.
- admin **client sysadmin** all edit allow → **E·E·E**; **sysops** only IPs E (rest H); **sysprod** only Quota E (rest H).

**Runtime/browser:** not click-through verified (Docker :4301/:4204 still serve pre-change bundles); needs a rebuild/`nx serve` or redeploy to observe.

### Flags
- **Backend gap (separate ticket, NOT this task):** `commerce SettingController.Update` has no `[Authorize]`; handler gates only quota by `eUserType.Falcon`. Raw PUT bypasses any FE narrowing. Per-resource PES belongs on backend. FE narrowing would be security theater — flagged not bundled.
- **Tab-level hide** (vs in-tab empty-state): handled with the empty-state per plan. Hiding the whole Settings tab when no section viewable belongs in `users-state.signals.ts visibleTabs` (separate per-node async resolve) — cleaner follow-up.

NO COMMITS.

**STATUS: IMPLEMENTED + build-green + live-PES-verified.**

=== 2026-05-30 -- Wallet-Balance-Management Tailwind/Falcon revamp (admin + mgmt) ===
Task: wallet-balance-mgmt-tailwind-falcon-revamp-2026-05-30 | Phase: Execution + build-fix | NO commits.
- Ran multi-agent Workflow wwyjlsrj1 (7 agents): U0 theme keyframes + U1-U4 component edits.
- DELETED both admin SCSS (wallet-balance-management.component.scss 23L + balance-transfer.component.scss 469L); removed styleUrls. mgmt had none.
- Radio vertical: ::ng-deep -> scoped Tailwind arbitrary-variant [&_.falcon-radio-group-options.is-vertical]:flex-col + gap-2.5 (admin main, x2). Radio cards PRESERVED (not swapped to dropdown).
- Drawer animation: additive 3 keyframes + 3 --animate-* tokens in libs/falcon-theme/src/falcon-tailwind-tokens.css (drawerIn/drawerInRtl/scrimIn, :385-387 / :636-638). Both drawers use animate-scrim-in + ltr:animate-drawer-in rtl:animate-drawer-in-rtl. mgmt now animates too (was dropped) -> parity.
- Icons: 5 glyphs Falcon-ized in BOTH consoles (chevron->CHEVRON_RIGHT, person->USER, transfer->WALLET_TRANSFER, close->CLOSE via <falcon-svg-icon>; search-><falcon-angular-icon name=search>). Lock + Riyal left raw (intentional, not in scope).
- Token hygiene: ALL arbitrary text-[Npx] -> exact Falcon --text-* tokens (verified byte-exact px: 11/12/12.5/13/13.5/15/22/24). Zero pixel drift.
- BUILD gate: mgmt GREEN (exit 0). admin RED (exit 1) on 2x NG8001 at balance-transfer.html:77/:113 (search glyph). ROOT CAUSE: workflow instruction wrongly mapped <falcon-angular-icon> -> FalconIconComponent/@falcon; correct = FalconAngularIconComponent/@falcon/ui-core/angular. U4(mgmt) caught it -> green; U2(admin) followed instruction -> red.
- FIX: admin balance-transfer.component.ts import + imports[] swapped to FalconAngularIconComponent (mirrors mgmt). Rebuilding admin in background.
- Verify check 4 (mgmt transfer literal) = FALSE ALARM / by-design (mgmt uses useGateway(Gateway.ChargingGateway)+'wallet/transfer'; services/ untouched).
- Frozen preserved: getWalletData/saveChanges/transfer endpoints + all DTOs + child @Input/@Output contracts. No services/ or models/ edits.
Next: confirm admin GREEN; Docker runtime re-check of radio-vertical + drawer animation; report.
