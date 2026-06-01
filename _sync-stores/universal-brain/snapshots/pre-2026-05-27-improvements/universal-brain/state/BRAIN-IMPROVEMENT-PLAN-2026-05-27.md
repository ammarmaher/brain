---
type: execution-plan
status: AWAITING-USER-APPROVAL
created: 2026-05-27
owner: claude (to execute)
reviewer: ammar
preservation_guarantee: every change is migration, not deletion
review_points: 3 (Phase 0 sign-off + Phase 3 schema + Phase 8 tags)
companion_docs:
  - C:\Falcon\Brain Outputs\datasets\authority-dataset\BRAIN-ARCHITECTURE-CHART.md
  - C:\Falcon\Brain Outputs\datasets\authority-dataset\0-MASTER-INDEX.md
  - C:\Falcon\Brain Outputs\datasets\authority-dataset\VERIFICATION-STATUS.md
---

# Brain Improvement Plan — 2026-05-27

> [!summary]
> 11 phases · 3 explicit stop points · zero file deletions · every existing file either preserved as-is, appended to, or copied to `.legacy` before being rewritten. Total estimated work: 8-12 hours of my execution time + ~30 minutes of your install/approval time.

## Preservation guarantees (read first — non-negotiable)

These are the rules I will follow in every phase. If a phase violates one, I halt-and-flag.

| # | Guarantee |
|---|---|
| 1 | **Never delete a file.** If a file is being replaced, the old version is renamed with `.legacy-2026-05-27.md` or moved to `_archive/`. |
| 2 | **Never overwrite without prior read.** Every Write call reads first, merges, then writes. |
| 3 | **Never silently change frontmatter.** Existing keys are preserved. New keys are added only. If a value must change, it's surfaced for your approval first. |
| 4 | **Snapshot before destructive batch operations.** Before any batch-edit (e.g., backfilling tags on 25 V-rules), I robocopy the target directory to `C:\Falcon\universal-brain\snapshots\pre-<phase-name>\`. |
| 5 | **No git commits or pushes without explicit instruction.** Sync repo push only happens when you say "push". |
| 6 | **No Obsidian plugin installs from my side** — I can't, and the plan flags them as your steps. |
| 7 | **Stop points are absolute.** Phases 0, 3, and 8 have explicit user-review gates. I halt and wait. |
| 8 | **Source-prefix every Falcon fact** in plan outputs, deliverables, and commit messages. |
| 9 | **Respect existing configurations.** The session-start hook, the brain skill, the 9 slash commands, the scanner — all stay wired the way they are. I extend, never replace. |
| 10 | **Reversibility.** Every phase has a rollback step. If you say "undo Phase X", I can. |

## Stop points where you review and approve before I continue

- **After Phase 0:** confirm snapshot is good, the inventory I produce is accurate.
- **After Phase 3:** approve the proposed unified frontmatter schema BEFORE I backfill 40+ files with it.
- **After Phase 8:** approve the proposed tag taxonomy BEFORE I apply tags across the vault.

You can also abort/pause between any two phases — they're designed to be independent and idempotent.

## Phase order and dependencies

```
Phase 0 (safety net)
  ↓
Phase 1 (brain-skill quick wins — no plugins, low risk)
  ↓
Phase 2 (MEMORY.md compaction — pure refactor, biggest leverage)
  ↓
Phase 3 (frontmatter schema PROPOSAL — STOP for approval)
  ↓ (you approve)
Phase 4 (you install Obsidian plugins — ~10 min)
  ↓
Phase 5 (frontmatter BACKFILL — only after Phase 3 approved + Phase 4 plugins ready)
  ↓
Phase 6 (Dataview adoption — replaces static MATRIX with live queries)
  ↓
Phase 7 (Templater scaffolds + MOCs)
  ↓
Phase 8 (tag taxonomy PROPOSAL — STOP for approval)
  ↓ (you approve)
Phase 9 (tag backfill + Canvas + polish)
  ↓
Phase 10 (source-prefix lint + /brain-help + cleanups)
  ↓
Phase 11 (final verification + sync push)
```

---

# PHASE 0 — Pre-flight (safety net)

**Goal:** capture current state so any phase is reversible. No content changes.
**Effort:** 15 minutes
**Risk:** zero
**My actions:**

1. Run `git -C C:\falcon-brain-sync status` to confirm working tree clean (or capture current state).
2. Run `.\sync-from-canonical.ps1 -Push` to mirror current brain into sync repo.
3. Run `git -C C:\falcon-brain-sync add . && git -C C:\falcon-brain-sync commit -m "snapshot: pre-2026-05-27-improvements"`.
4. **NOT push yet** — sync repo gets pushed at very end of plan, per your "explicit commit instruction" rule.
5. Create `C:\Falcon\universal-brain\snapshots\pre-2026-05-27-improvements\` directory (new dir, no overlap with anything).
6. Robocopy mirror the 4 most-touched stores into that snapshot:
   - `Brain Outputs\datasets\authority-dataset\` → snapshot
   - `home-memory\` (the user's `.claude\projects\C--Falcon\memory\` dir) → snapshot
   - `falcon-wiki\` (the directories I'll touch — NOT the 702 MB whole vault, just `00-MOCs`, `30-Components`, `65-67/`, `100-Authority`) → snapshot
   - `Brain SK\_obsidian\30-Validation`, `40-API`, `12-Permissions`, `67-Business-Rules`, `_templates` → snapshot
7. Produce an `INVENTORY.md` inside the snapshot dir listing exactly which files will be touched by each subsequent phase.
8. Report back to you with the inventory totals — you confirm before I proceed.

**Stop point #1 — you review the inventory. Approve before Phase 1 starts.**

**Rollback:** delete the snapshot dir if you abort — nothing else changed.

---

# PHASE 1 — Brain-skill quick wins (no plugins needed)

**Goal:** add commands and hooks the brain skill should already have. Pure additions.
**Effort:** 1 hour
**Risk:** very low — only NEW files in `.claude/commands/` + minor edits to brain skill references.

## 1a — `/brain-status` slash command

**Create:** `C:\Falcon\.claude\commands\brain-status.md`
**Content:** instruction to read `current-task.json` + last 30 lines of `progress-log.md` + first 20 lines of `latest-restore-packet.md` and emit a 20-line compact summary.
**Preservation:** new file, no overlap with the 9 existing commands.

## 1b — Auto-archive completed tasks on session start

**Modify:** `C:\Falcon\.claude\commands\start-brain.md` (one of the 9 existing commands).
**Change:** add a step "if `current-task.json.status == completed` and no matching `task-history/` file → archive automatically before starting any new task".
**Preservation:** existing command instructions kept verbatim — only new step appended.
**Reads first** — Edit only after Read.

## 1c — Auto-refresh restore packet on milestone

**Modify:** `C:\Falcon\.claude\commands\save-session-state.md`
**Change:** clarify that restore packet refresh should fire (a) before any risky step, (b) after every 5 progress-log entries, (c) on `status` field change in current-task.json.
**Preservation:** existing instructions kept.

## 1d — `/brain-help` command

**Create:** `C:\Falcon\.claude\commands\brain-help.md`
**Content:** one-line description of all 10 commands (the 9 existing + the new brain-status).
**Preservation:** new file.

## 1e — session-coordination orphan cleanup

**File:** `C:\Falcon\universal-brain\state\session-coordination-2026-05-21.md` (orphan from a per-day coordination scheme that wasn't maintained).
**Action:** MOVE (not delete) to `C:\Falcon\universal-brain\_archive\session-coordination-2026-05-21.md`.
**Preservation:** file content preserved at new path. If you ever want it back, it's one move.

## 1f — `_archive/` directory

**Create:** `C:\Falcon\universal-brain\_archive\` for anything we deprecate from active state without deleting.

**Deliverable summary:**

| Type | Files |
|---|---|
| Created | `brain-status.md`, `brain-help.md`, `_archive/session-coordination-2026-05-21.md`, `_archive/` |
| Modified (Edit, not overwrite) | `start-brain.md`, `save-session-state.md` |
| Moved | `session-coordination-2026-05-21.md` → `_archive/` |
| Deleted | none |

**Rollback:** delete new files; restore Edited files from snapshot.

---

# PHASE 2 — MEMORY.md compaction

**Goal:** turn the 261-line / 116 KB paragraph-style MEMORY.md into a true one-line index so the autoload truncation stops eating 90% of your memory.
**Effort:** 2-3 hours
**Risk:** medium — touches your most-frequently-loaded file. But fully reversible.

## What's wrong today

MEMORY.md's own banner says: *"Index only — one line per entry. Full detail lives in each linked topic file."* But the actual entries are 1,000-2,000 chars each. The autoload cap (~25K tokens) truncates around line 24 of 261 — meaning **most entries are invisible at session start.**

## Migration approach (NOT rewrite)

For each existing paragraph entry in MEMORY.md:

1. **Read the entry's linked topic file.** (Every entry links to a file like `project_brain_sync_repo_2026_05_21.md`.)
2. **Compare the paragraph content vs the topic file content.**
3. **If the paragraph contains detail NOT in the topic file** → append a `## Index-entry overflow 2026-05-27` section to the topic file with that detail.
4. **Rewrite the MEMORY.md entry to one canonical line** of the form:
   `- [topic title](file.md) — 🟢/🟡/🔴/✋ STATUS · ≤120-char outcome summary · key files: X, Y · date`
5. **Save the old MEMORY.md** as `MEMORY.legacy-2026-05-27.md` in the same dir before writing the new one.
6. **Validate** the new MEMORY.md is under 25 KB so it fully fits in autoload.

## What entries we expect to find

From the partial autoload I've already seen:
- ~5 Infrastructure / Sync entries
- ~10 Backend / Infra entries  
- ~5 Business / Validation entries
- ~30+ Frontend Work entries (waves D, F, G + service-pricing waves 7-12 + info-panel + do-payment + skeleton-loading + …)

**Per-entry effort:** ~3-5 minutes (read paragraph → diff vs topic file → append missing detail to topic → write one-liner). For ~50 entries: ~3 hours.

## Quality checks I'll run before completing this phase

1. Every entry's linked topic file exists on disk.
2. No detail was lost — diff the original paragraph against (new one-liner + appended topic-file overflow section).
3. New MEMORY.md is under 25 KB (so autoload sees ALL of it).
4. Markdown lint clean (consistent dashes, links, etc.).
5. Section headings match the originals.

**Deliverable summary:**

| Type | Files |
|---|---|
| Created | `MEMORY.legacy-2026-05-27.md`, possibly 0-5 new topic files if any entries lacked a backing file |
| Modified | `MEMORY.md` (rewritten, with `MEMORY.legacy-2026-05-27.md` next to it as safety) |
| Appended | each topic file gets `## Index-entry overflow 2026-05-27` section if needed |
| Deleted | none |

**Rollback:** `mv MEMORY.legacy-2026-05-27.md MEMORY.md`. One command, 100% restore.

---

# PHASE 3 — Frontmatter schema PROPOSAL (STOP POINT)

**Goal:** propose a unified frontmatter schema for V-rules, E-* entities, Q-* tickets, BR-* rules, and topic memory files. **Do not apply yet.** Wait for your approval.
**Effort:** 1 hour (my work) + 15 min (your review)
**Risk:** zero — proposal only.

## What I'll do

1. Read ~10 existing V-rule files in `Brain SK\_obsidian\30-Validation\` to discover the schema already in use.
2. Read ~10 existing E-* files in `40-API\`.
3. Read ~10 existing Q-* files in `falcon-wiki\80-Questions\`.
4. Read ~10 existing BR-* files in `67-Business-Rules\` and `prd\modules\*\BUSINESS_RULES.md`.
5. Read ~10 existing topic memory files.
6. Produce a single document `FRONTMATTER-SCHEMA-PROPOSAL-2026-05-27.md` showing:
   - **For each note type:** the union of all frontmatter keys I found in existing files (so I prove I respect what exists).
   - **Proposed additions:** keys to add (e.g., `verification: build|runtime`, `status: live|superseded|draft`, `module: account-mgmt|user-mgmt|...`, `last-verified: date`).
   - **Proposed value standardization:** if I find `verification: ✋` in one file and `verification: runtime-verified` in another — propose canonical value.
   - **No removals proposed.** Existing keys stay even if I don't see why they're there.

## Stop point #2

**You read the proposal. You can:**
- Approve as-is → I proceed to backfill in Phase 5.
- Edit values → I apply your edits to the schema, then proceed.
- Reject specific keys → I drop them.

**No backfill happens until you approve.**

**Deliverable:**

| Type | Files |
|---|---|
| Created | `FRONTMATTER-SCHEMA-PROPOSAL-2026-05-27.md` (in `universal-brain/state/`) |
| Modified | none |
| Deleted | none |

**Rollback:** delete the proposal file.

---

# PHASE 4 — You install Obsidian plugins (your step)

**Goal:** get the plugins ready before I do anything that depends on them.
**Effort:** ~10 minutes (yours)
**Risk:** zero — community plugins are safe.

**You do:**

In **both** vaults — `falcon-wiki\` AND `Brain SK\_obsidian\`:

1. Open Obsidian → Settings → Community plugins → Browse.
2. Install **Dataview** (mandatory — Phase 6 depends on it).
3. Install **Templater** (mandatory — Phase 7 depends on it).
4. Install **Smart Connections** (optional but high-value — semantic search across the vault).
5. Enable Core plugin **Daily Notes** (optional — replaces the orphaned session-coordination file pattern).

**Verification (you):**
- Settings → Community plugins → confirm Dataview + Templater are enabled.
- Open any note → try typing ```` ```dataview ```` in a code block. If autocomplete works, plugin is live.

**If you can't install** (corporate restriction, etc.) → tell me and I'll redesign Phases 5-7 to work without plugins (less elegant but possible — pure markdown tables auto-generated by my scripts instead of live dataview queries).

**I do nothing in this phase except wait.**

---

# PHASE 5 — Frontmatter BACKFILL (after Phase 3 approved + Phase 4 plugins live)

**Goal:** apply the approved schema across all V-rule, E-*, Q-*, BR-*, and topic-memory files. Additive only.
**Effort:** 2 hours
**Risk:** low — additive, snapshot taken in Phase 0.

## Per-file procedure

For each target file:

1. **Read the file's existing frontmatter** (between the first two `---` lines).
2. **Compute the merge** — existing keys win on conflict; new keys are added; no key is removed.
3. **For unknown values** (e.g., I don't know what `module:` should be for a given V-rule) → leave the field with a placeholder `TBD-needs-classification` rather than guess.
4. **Edit the file** with the merged frontmatter. Content body untouched.
5. **Log every change** to `FRONTMATTER-BACKFILL-LOG-2026-05-27.md` with `file → keys added`.

## What gets touched

Approximate counts (will confirm in Phase 0 inventory):

| Pattern | Approx count | Location |
|---|---|---|
| V-rules | 25 | `Brain SK\_obsidian\30-Validation\` |
| E-* entities | 15 | `Brain SK\_obsidian\40-API\` |
| Q-* tickets | ~20 | `falcon-wiki\80-Questions\` + `authority-dataset\_pending-questions\` |
| BR-* in PRD modules | ~180 (5 BUSINESS_RULES.md files) | `prd\modules\*\BUSINESS_RULES.md` (note: these are single files with multiple rules — frontmatter goes once per file, not per rule) |
| Topic memory files | 262 | `home-memory\` |

For topic memory files: I'd NOT backfill all 262 in this phase — only the ones referenced by MEMORY.md (the active set). The rest get backfilled on-demand as they're touched.

## Quality checks

1. No file's body content changed — only frontmatter block.
2. Every existing frontmatter key from before-this-phase is still present after.
3. All values pass yaml-lint (no broken yaml).
4. Spot-check: open 5 random files in Obsidian → frontmatter renders in the Properties pane correctly.

**Deliverable:**

| Type | Files |
|---|---|
| Created | `FRONTMATTER-BACKFILL-LOG-2026-05-27.md` |
| Modified | ~80 files (V-rules + E-* + Q-* + BR-* parents + active topic files) — frontmatter additions only |
| Deleted | none |

**Rollback:** restore from Phase 0 snapshot.

---

# PHASE 6 — Dataview adoption (live queries replace static MATRIX.md)

**Goal:** make the MATRIX.md files self-updating. Hand-maintained matrices guarantee drift; queries don't.
**Effort:** 2 hours
**Risk:** medium — touches load-bearing routing files. Mitigated by `.legacy.md` preservation.

## What changes

For each existing MATRIX.md:

1. **Read the current MATRIX.md.**
2. **Preserve the original** as `MATRIX.legacy-2026-05-27.md` in the same directory.
3. **Rewrite MATRIX.md with:**
   - Frontmatter (preserved).
   - Original H1 + summary paragraph (preserved).
   - A new section `## Live matrix (Dataview)` containing a dataview query block that reads the frontmatter of all V-rule/E-*/BR-* files and renders the same matrix dynamically.
   - The original static table kept BELOW the live query under heading `## Static fallback (last hand-built 2026-05-XX)` — so if Dataview isn't loaded, the file is still readable as plain markdown.

## MATRIX files affected

| File | Current style | New style |
|---|---|---|
| `authority-dataset\06-validation-by-feature\MATRIX.md` | hand-edited | dataview + static fallback |
| `authority-dataset\08-entity-drift-by-feature\MATRIX.md` | hand-edited | dataview + static fallback |
| `authority-dataset\09-business-rules-by-feature\MATRIX.md` | hand-edited | dataview + static fallback |
| `authority-dataset\10-non-pes-gates-by-feature\MATRIX.md` | hand-edited | dataview + static fallback |
| `authority-dataset\04-feature-parity-matrix\MATRIX.md` | hand-edited | dataview + static fallback |
| `authority-dataset\14-flow-playbook-integration\MATRIX.md` | hand-edited | dataview + static fallback |

## Verification (you)

After I'm done, open each MATRIX.md in Obsidian → the dataview block should render a table identical to the static fallback. If not, we debug together (likely a frontmatter mismatch).

**Deliverable:**

| Type | Files |
|---|---|
| Created | 6 `MATRIX.legacy-2026-05-27.md` files |
| Modified | 6 `MATRIX.md` files (live query + static fallback) |
| Deleted | none |

**Rollback:** `mv MATRIX.legacy-2026-05-27.md MATRIX.md` for each.

---

# PHASE 7 — Templater scaffolds + MOCs (Maps of Content)

**Goal:** make new-note creation consistent + provide curated landing pages per knowledge domain.
**Effort:** 2 hours
**Risk:** zero — only new files.

## 7a — Templater scaffolds

**Create in `Brain SK\_obsidian\_templates\`** (the dir already exists):

| Template | For creating |
|---|---|
| `V-rule.md` | New validation rule (full frontmatter scaffold per Phase 3 schema) |
| `E-entity.md` | New entity reconciliation |
| `Q-ticket.md` | New open question / pending Q-* |
| `BR-rule.md` | New business rule (within BUSINESS_RULES.md) |
| `topic-memory.md` | New home-memory topic file |
| `daily-note.md` | Daily session log (replaces orphan session-coordination pattern) |

Templates preserve any existing templates in the directory.

**You do:** Settings → Templater → bind a hotkey per template (your preference).

## 7b — Maps of Content (MOCs)

**Create in `falcon-wiki\00-MOCs\`** (the dir already exists with 3 maps):

| MOC | Curates |
|---|---|
| `Validations-MOC.md` | All 25 V-rules grouped by module + status. Dataview query for live updates. |
| `PES-MOC.md` | All 47 PES keys + 6 roles + capability maps |
| `Components-MOC.md` | All 62 component dossiers — linked by category |
| `Flows-MOC.md` | A→Z traces + flow integration matrices |
| `Architecture-MOC.md` | Software architecture vision + Clean Architecture + Front-End Architecture + Security Architecture |

Each MOC is one screen — links into the cluster, not duplication.

**Preservation:** existing MOCs (`Local-Backend-Bring-Up.md`, `Local-Auth-Recipe.md`, `Authorization-Security-MOC.md`) untouched. New ones complement.

**Deliverable:**

| Type | Files |
|---|---|
| Created | 6 templates + 5 MOCs = 11 new files |
| Modified | none |
| Deleted | none |

**Rollback:** delete the 11 new files.

---

# PHASE 8 — Tag taxonomy PROPOSAL (STOP POINT)

**Goal:** propose a canonical tag set for cross-folder querying. **Do not apply yet.**
**Effort:** 30 min (mine) + 15 min (yours)
**Risk:** zero — proposal only.

## What I'll propose

A small, opinionated tag set:

| Namespace | Examples |
|---|---|
| `#status/*` | `#status/live`, `#status/superseded`, `#status/draft`, `#status/blocked` |
| `#verification/*` | `#verification/runtime`, `#verification/build`, `#verification/spot-checked`, `#verification/unverified` |
| `#module/*` | `#module/account-mgmt`, `#module/user-mgmt`, `#module/contract`, `#module/contact-group`, `#module/templates` |
| `#layer/*` | `#layer/fe`, `#layer/be`, `#layer/gateway`, `#layer/infra` |
| `#priority/*` | `#priority/p0`, `#priority/p1`, `#priority/p2` |
| `#blocked-on/*` | `#blocked-on/drive-reexport`, `#blocked-on/stencil-compile`, `#blocked-on/business-decision` |

Proposal document: `TAG-TAXONOMY-PROPOSAL-2026-05-27.md`.

## Stop point #3

**You review. You can:**
- Approve.
- Edit (add/remove namespaces or values).
- Reject namespaces you find noisy.

No tag backfill until you approve.

**Deliverable:** 1 proposal file.

**Rollback:** delete the proposal file.

---

# PHASE 9 — Tag backfill + Brain-architecture Canvas

**Goal:** apply approved tags + give the BRAIN-ARCHITECTURE-CHART a clickable visual twin.
**Effort:** 2 hours
**Risk:** low (additive).

## 9a — Tag backfill

For each V-rule, E-*, Q-*, MOC, and topic memory file:

1. Read existing tags (in frontmatter `tags:` array or inline `#tag` mentions).
2. Compute new tags to add based on the file's content (status, verification, module).
3. Edit frontmatter `tags:` array — additive only.
4. Log to `TAG-BACKFILL-LOG-2026-05-27.md`.

## 9b — Brain-architecture Canvas

**Create:** `Brain Outputs\datasets\authority-dataset\BRAIN-ARCHITECTURE.canvas` (Obsidian Canvas file).
**Content:** drag-zoom-able twin of the Mermaid diagram in `BRAIN-ARCHITECTURE-CHART.md`. Each node embeds a link to the corresponding store path. The .md chart stays — they complement.

## Quality checks

1. Open Canvas in Obsidian → all nodes click into actual paths.
2. Tag pane shows the new namespaces populating.
3. Search by `#status/live AND #module/account-mgmt` returns expected V-rules.

**Deliverable:**

| Type | Files |
|---|---|
| Created | `BRAIN-ARCHITECTURE.canvas`, `TAG-BACKFILL-LOG-2026-05-27.md` |
| Modified | ~80 files (tags appended in frontmatter) |
| Deleted | none |

**Rollback:** restore from Phase 0 snapshot.

---

# PHASE 10 — Source-prefix lint + polish

**Goal:** catch convention violations in my own outputs mechanically.
**Effort:** 1 hour
**Risk:** very low — only adds new tooling, doesn't change existing.

## 10a — Source-prefix lint

**Create:** `C:\Falcon\universal-brain\hooks\check-source-prefix.ps1`.
**Logic:** scans the most recent Claude response (or arbitrary markdown) for Falcon-domain keywords (PES, acc-owner, acc-admin, V-AM-*, BR-*, etc.) without nearby `[CODE]/[BRAIN-OUT]/[VAULT]/[BRAIN-SK]/[MEMORY]/[INFERRED]` prefix. Reports violations.
**Wiring:** documented in brain skill but NOT auto-triggered (you decide when to run).

## 10b — Drift alarm on memory references

**Modify:** brain skill's `references/restore-rules.md`.
**Change:** if a memory topic file is cited and its frontmatter `last-verified` is >14 days old → re-grep the cited code before treating it as fact.

## 10c — Backups rotation

**Modify:** `save-session-state.md` behavior.
**Change:** when refreshing `latest-restore-packet.md`, copy the existing one to `backups/archive/YYYYMMDD_HHMMSS.md` before overwriting. Cap archive at last 20.

## 10d — Snapshot promotion check

**Create:** `universal-brain/MAINTENANCE.md` listing the maintenance contracts emitted across all phases. So future Claudes can find them.

**Deliverable:**

| Type | Files |
|---|---|
| Created | `check-source-prefix.ps1`, `MAINTENANCE.md`, `backups/archive/` dir |
| Modified | `restore-rules.md`, `save-session-state.md` |
| Deleted | none |

---

# PHASE 11 — Final verification + sync push

**Goal:** verify everything works end-to-end, push to sync repo.
**Effort:** 30 min
**Risk:** zero (read-only verification + git push).

## My actions

1. Run the scanner (`falcon-wiki\scripts\scan-authority.ps1 -CheckOnly`) — expect zero drift on the 67 canonical source files (I haven't touched any of them).
2. Read the new MEMORY.md from scratch — confirm size < 25 KB and structure intact.
3. Open all MATRIX.md files — confirm dataview blocks render (you do this part in Obsidian).
4. Cite-check: open `BRAIN-ARCHITECTURE-CHART.md` — confirm all referenced paths exist.
5. Run `git -C C:\falcon-brain-sync status` — confirm only expected changes.
6. Wait for **your explicit "push" instruction** before:
   - `.\sync-from-canonical.ps1 -Push`
   - `git -C C:\falcon-brain-sync add . && commit && push`

## Final deliverables

A `PLAN-COMPLETION-REPORT-2026-05-27.md` at the root of `universal-brain/` containing:
- One row per phase with "what was delivered + rollback path".
- Open follow-ups (e.g., the 11 dead-weight stores I want you to confirm before archival).
- Memory entries that should now be promoted to V-rules (from get-shit-done Approved Learning Mode).

---

# What's deliberately NOT in this plan

I'm flagging these because they were in my recommendations but I don't want to do them silently:

| Item | Why excluded | What I need from you to include |
|---|---|---|
| **Rename `C:\Falcon\Brain\` → `C:\Falcon\trimindset\`** | Renaming a top-level concept directory affects MANY scripts, MEMORY entries, and possibly external integrations (the Falcon tri-mindset Brain has its own ChatGPT/Gemini hookups). Too risky without your explicit say-so. | A simple "yes, rename it" — then I'll do it as a dedicated mini-plan with grep-and-replace across the brain + sync repo. |
| **Delete the 11 dead-weight files** I might find in usage analytics | I haven't run usage analytics yet (Phase 11 surfaces candidates). Even then, I propose archival, not deletion. | Phase 11 will produce a list — you approve or decline each. |
| **Auto-push the sync repo at end of session** | Standing rule: never push without explicit instruction. | Say "push" in Phase 11. |
| **Backfill frontmatter on all 262 home-memory topic files in Phase 5** | Too many to batch safely in one pass. Only active set (referenced by MEMORY.md) in Phase 5; rest get backfilled on-demand as they're touched. | If you want the full backfill, say so — I'll add Phase 5b. |
| **Modify any product code** (`falcon-web-platform-ui`, `falcon-essentials`, `falcon-core-*-svc`) | This plan is brain-only. | Anything product-related is a separate task. |

---

# Time + checkpoint summary

| Phase | My time | Your time | Stop point? | Risk |
|---|---:|---:|---|---|
| 0 — Pre-flight | 15 min | 5 min review | ✅ | zero |
| 1 — Brain skill quick wins | 60 min | 0 | — | very low |
| 2 — MEMORY.md compaction | 2-3 hr | 0 | — | medium |
| 3 — Frontmatter schema proposal | 60 min | 15 min review | ✅ | zero |
| 4 — You install plugins | 0 | 10 min | — | zero |
| 5 — Frontmatter backfill | 2 hr | 0 | — | low |
| 6 — Dataview adoption | 2 hr | 0 | — | medium |
| 7 — Templater + MOCs | 2 hr | 0 | — | zero |
| 8 — Tag taxonomy proposal | 30 min | 15 min review | ✅ | zero |
| 9 — Tag backfill + Canvas | 2 hr | 0 | — | low |
| 10 — Lint + polish | 60 min | 0 | — | very low |
| 11 — Verify + push | 30 min | 5 min approve push | — | zero |
| **TOTAL** | **~12-13 hr** | **~50 min** | **3 stops** | **low overall** |

# Cumulative file impact (estimate)

- Created: ~30 files (commands, templates, MOCs, logs, proposals, canvas, .ps1 hooks)
- Modified (Edit only, no overwrite): ~90 files (frontmatter additions + MATRIX rewrites + brain skill instructions)
- Renamed to .legacy-2026-05-27.md: ~7 files (one per MATRIX + MEMORY.md)
- Moved to _archive/: 1 file (session-coordination orphan)
- **Deleted: 0 files.**

# How to start

Reply with one of:
- **"approve plan, start phase 0"** → I begin pre-flight.
- **"approve plan but skip phase X"** → I adjust order and execute.
- **"hold, change phase X to Y"** → I revise this document.
- **"reject, replan with constraint X"** → I rewrite from scratch with your constraint.

I will not begin execution until I see an explicit start instruction.
