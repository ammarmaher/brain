---
type: plan-supplement
parent_plan: BRAIN-IMPROVEMENT-PLAN-2026-05-27.md
status: AWAITING-USER-APPROVAL
created: 2026-05-27
purpose: "Augments the main plan with plugin-aware enhancements based on the ACTUAL plugin inventory of both Obsidian vaults — replacing assumptions with evidence."
---

# Plan Supplement A — Plugin-Aware Enhancements

> [!info]
> The original plan assumed only Dataview + Templater were installed. The actual inventory shows **16 distinct community plugins across both vaults + Smart-env already initialized with embeddings + Obsidian Sync ENABLED on the Brain SK vault.** This supplement updates the plan with that evidence and adds two new phases.

## Section 1 — Actual plugin inventory (verified on disk just now)

### falcon-wiki vault (`C:\Falcon\falcon-wiki\.obsidian\`)

| Plugin | Version | Author | Purpose |
|---|---|---|---|
| dataview | — | Michael Brenan | Live queries over frontmatter |
| templater-obsidian | — | SilentVoid13 | Note templates with variables |
| smart-connections | 4.5.0 | Brian Petro | Chat-with-notes + semantic links |
| breadcrumbs | 4.9.5 | SkepticMystic | Structured hierarchies via frontmatter |
| tag-wrangler | 0.6.4 | PJ Eby | Rename / merge / search tags from tag pane |
| various-complements | 11.3.0 | tadashi-aikawa | IDE-style word autocomplete |

Plus `.smart-env/` initialized with embedding_models + multi + smart_components + smart_contexts + event_logs + 24.4 KB `smart_env.json`. **Embeddings already computed.** Smart Connections is functional, not just installed.

### Brain SK vault (`C:\Falcon\Brain SK\_obsidian\.obsidian\`)

| Plugin | Version | Author | Purpose |
|---|---|---|---|
| dataview | — | Michael Brenan | Live queries |
| templater-obsidian | — | SilentVoid13 | Templates |
| **realclaudian** | **2.0.18** | **Yishen Tu** | **"Embeds Claude Code, Codex, and other coding agents as AI collaborators in your vault. Your vault becomes their working directory, giving them capabilities for file reads and writes, search, bash commands, and multi-step workflows."** |
| smart-connections | — | Brian Petro | Chat-with-notes |
| smart-connections-visualizer | — | Brian Petro | Visual graph of semantic clusters |
| smart-lookup | 0.1.3 | Brian Petro | Query-first semantic search |
| obsidian-tasks-plugin | 8.0.0 | Clare Macrae | Track tasks with due dates, recurrence, filtering |
| obsidian-style-settings | — | mgmeyers | CSS theme customization |
| obsidian-icon-folder | — | florianwoelki | Per-folder icons + colors |
| recent-files-obsidian | — | tgrosinger | Recent files pane |

Plus `.smart-env/` initialized (same as falcon-wiki). Plus **Obsidian Sync is enabled** (paid feature — your notes already sync to Obsidian's cloud independent of the brain-sync git repo).

### Core plugins enabled (both vaults)

`file-explorer · global-search · switcher · graph · backlink · canvas · outgoing-link · tag-pane · page-preview · templates · note-composer · command-palette · editor-status · bookmarks · outline · word-count · file-recovery · properties · daily-notes · bases`

**`bases` is enabled in both** — that's Obsidian's new (v1.7+) native database feature, similar to Notion databases. Underused in our current setup.

---

## Section 2 — "Cloudian" = Claudian (realclaudian)

You called it Cloudian. Its plugin ID is `realclaudian`, display name `Claudian`, by Yishen Tu, v2.0.18.

### What it does (per manifest)

> *"Embeds Claude Code, Codex, and other coding agents as AI collaborators in your vault. Your vault becomes their working directory, giving them capabilities for file reads and writes, search, bash commands, and multi-step workflows."*

### Why this is a game-changer for our workflow

**Today** I run from `C:\Falcon` as my CWD. I can read your vault files but Obsidian doesn't know I'm there.

**With Claudian active**, the vault becomes my working directory. The user can:
- Invoke me FROM INSIDE Obsidian (sidebar / command palette)
- Watch me edit notes in real-time
- See progress visually in the file explorer as I work
- Interrupt / steer mid-task in the same UI

**Implications for the plan:**

| Plan phase | Without Claudian | With Claudian |
|---|---|---|
| Phase 2 (MEMORY compaction) | I rewrite 50 entries via Edit tool; you re-open Obsidian after | You watch entries change live in the Brain SK vault |
| Phase 5 (frontmatter backfill) | Same — Edit calls from CLI | Visible in Properties pane as each file updates |
| Phase 6 (Dataview MATRIX) | I rewrite MATRIX.md files | You see the dataview block start returning live data in the same window |
| Phase 7 (MOC creation) | I write 5 MOC files | You can navigate into each MOC the moment it's saved |
| Phase 9 (Canvas + tags) | Same | Canvas opens directly in Obsidian for you to interact with |

**Constraint:** Claudian is currently only in the **Brain SK vault**, not falcon-wiki. So vault-resident Claude operations are limited to Brain SK. For falcon-wiki operations I still run from CLI (which is fine — I have file system access).

### Verification I can't do from my side

- I can read Claudian's `manifest.json` ✓ (verified)
- I can see it's loaded ✓ (verified — in `community-plugins.json`)
- I **cannot** verify the plugin actually launches Claude Code correctly inside the vault without you confirming. **Action for you:** open Brain SK vault → command palette → search "Claudian" → confirm a chat / launch command appears.

If Claudian works as advertised, I propose moving brain-meta phases into the vault-resident mode (you stay in Obsidian; we both work in one window).

---

## Section 3 — Per-plugin utilization assessment

### Already in main plan, no change

| Plugin | Plan usage | Status |
|---|---|---|
| dataview | Phase 6 (live MATRIX) | unchanged |
| templater-obsidian | Phase 7 (scaffolds) | unchanged |

### Already installed but BUMPED to deeper usage

| Plugin | New usage in plan |
|---|---|
| **smart-connections** | Phase 11 verification: refresh embeddings AFTER MEMORY compaction so the semantic index stays current. Add to maintenance contract: re-embed on schema change. |
| **smart-connections-visualizer** | Phase 7 (MOCs): every MOC includes a `## Semantic cluster` section that screenshots / refers to the visualizer view for the cluster. Helps you spot orphan nodes. |
| **smart-lookup** | Recommend hotkey-binding to query the vault by meaning before any new V-rule is authored. Avoids duplicate V-rules. |
| **breadcrumbs** | Phase 3 (frontmatter schema): add `parent:`, `up:`, `next:`, `prev:`, `siblings:` keys. Breadcrumbs uses these to render hierarchy strips at top/bottom of every note. Massive navigation upgrade. |
| **tag-wrangler** | Phase 8/9 (tag taxonomy): use Tag Wrangler in falcon-wiki for bulk rename/merge instead of grep-and-replace. Safer. Brain SK doesn't have it — propose install. |
| **various-complements** | Phase 5/7: configure to draw from existing V-rule IDs, role names, feature names. Prevents typos in cross-references like `V-account-name-format`. |
| **obsidian-tasks-plugin** | **NEW PHASE 9.5** — see Section 4 below. |
| **bases** (core) | **NEW PHASE 6.5** — see Section 4 below. |
| **canvas** (core) | Phase 9b unchanged (Brain architecture canvas) |
| **daily-notes** (core) | Phase 7 — daily-note template replaces orphan session-coordination pattern |
| **properties** (core) | Phase 5 — frontmatter renders in Properties pane; verify by spot-check |
| **graph** (core) | Phase 11 verification — graph view should show clean clusters per MOC |

### Style/UX plugins (P2 — visual polish only)

| Plugin | What I'd do |
|---|---|
| **obsidian-icon-folder** | Phase 9 polish: assign icons to top-level folders by store type. `30-Validation/` = shield, `40-API/` = plug, `60-Components/` = puzzle, `_archive/` = archive icon. Visual chunking. |
| **obsidian-style-settings** | No plan action — your taste. |
| **recent-files-obsidian** | No plan action — UI pane only. |

---

## Section 4 — Two new phases added

### NEW PHASE 6.5 — Bases proposal (optional, runs after Phase 6)

**Effort:** 1 hour
**Risk:** zero — additive only, doesn't touch existing MATRIX.md files (Phase 6 already covers those with Dataview).

**Goal:** evaluate Obsidian Bases (v1.7+ core feature) as a richer alternative to flat MATRIX.md for the V-rule / E-* / BR-* / Q-* registries.

**Bases vs Dataview:**

| Aspect | Dataview (Phase 6) | Bases (this phase) |
|---|---|---|
| File format | Markdown code block in any `.md` | Dedicated `.base` files |
| Portability | Renders as plain text outside Obsidian | Obsidian-only |
| Editing | Read-only views | Editable cells in card / table / gallery views |
| Filtering | Query string | UI-driven |
| Best for | MATRIX.md (read-only, portable) | Registry browsing (V-rule library, etc.) |

**Proposal:**
- Phase 6 (Dataview) handles MATRIX.md as before — portable, version-friendly.
- Phase 6.5 (Bases) adds **complementary** `.base` files at the registry level:
  - `V-rules.base` — all 25 V-rules as a sortable/filterable card view
  - `E-entities.base` — all 15 E-* entities
  - `Q-tickets.base` — all open Q-* tickets with status / blocker columns
  - `BR-registry.base` — 180 BR-* rules with module/feature/status

**Stop point:** I'll **propose this**, not implement, until you confirm you want Bases adopted. Adoption is reversible (delete the `.base` files) but slightly more invasive than Dataview.

**Deliverable:** `BASES-PROPOSAL-2026-05-27.md` with example `.base` schema. You approve before any `.base` files are written.

### NEW PHASE 9.5 — Tasks-plugin integration (runs after Phase 9)

**Effort:** 1.5 hours
**Risk:** low — additive Markdown task notation, doesn't move files.

**Goal:** turn open questions and blockers into trackable, queryable Tasks.

**Current state:** ~40 open Q-* tickets scattered across:
- `falcon-wiki\80-Questions\` (~20)
- `Brain Outputs\datasets\authority-dataset\_pending-questions\` (~20)
- Inline mentions in MEMORY entries

None of them are queryable. Q-UM-07 (PRD Sheet Tab 2, blocked on Drive re-export) has been open since pre-2026-05-21 and nothing surfaces it daily.

**Tasks-plugin syntax** (built on Markdown checkboxes):
```markdown
- [ ] [[Q-UM-07]] PRD Sheet Tab 2 capture 📅 2026-06-01 ⏫ #blocked-on/drive-reexport
```

**Migration approach:**

1. **Read each Q-* file's frontmatter** — capture `status:`, `blocked-on:`, `owner:`, `due:` if present.
2. **Append to the file body** a Tasks-plugin-compatible task line:
   - `- [ ]` if open
   - `- [/]` if in-progress
   - `- [-]` if cancelled
   - `- [x]` with completion date if resolved
3. **Add metadata emojis** per Tasks-plugin convention: 📅 due · ⏳ scheduled · ⏫ high · 🔼 medium · 🔽 low.
4. **Create a `Tasks-MOC.md`** with three queries:
   - All open blocked tasks (grouped by blocker)
   - All P0/high-priority open tasks
   - Recently completed (last 14 days)

**Preservation:** Existing Q-* file contents kept verbatim — task line is APPENDED, not replacing anything.

**Deliverable:**
- ~40 Q-* files gain one task line in their body
- New `Tasks-MOC.md` in `falcon-wiki/00-MOCs/`
- New `TASKS-MIGRATION-LOG-2026-05-27.md`

**Rollback:** revert each Q-* file via the Phase 0 snapshot; delete the MOC.

---

## Section 5 — Modified phase deltas (changes to original plan)

### Phase 3 delta — frontmatter schema expansion

**Add to schema proposal:** Breadcrumbs hierarchy keys.

```yaml
# Original proposed keys (unchanged):
id: V-account-name-format-xlsx
module: account-mgmt
feature: add-client
status: live          # live | superseded | draft | blocked
verification: runtime # runtime | build | spot-checked | unverified
supersedes: [V-account-name-format-uniqueness]
superseded-by: []
last-verified: 2026-05-24
evidence-link: project_validation_xlsx_sot_flip_wave_f_2026_05_24.md

# NEW additions for Breadcrumbs:
parent: V-rules-MOC
up: 30-Validation
next: V-person-name-format-xlsx
prev:
siblings: [V-username-format-xlsx]

# NEW additions for Tasks plugin (only on Q-* files):
tracked-as-task: true
due: 2026-06-01
priority: high
```

You still get to approve all of this in Phase 3.

### Phase 4 delta — plugins you've already installed

| Plugin | falcon-wiki | Brain SK | Action |
|---|---|---|---|
| dataview | ✅ installed | ✅ installed | none |
| templater-obsidian | ✅ installed | ✅ installed | none |
| smart-connections | ✅ installed | ✅ installed | refresh embeddings after Phase 2 |
| breadcrumbs | ✅ installed | ❌ missing | **install in Brain SK to use hierarchy keys there too** |
| tag-wrangler | ✅ installed | ❌ missing | **install in Brain SK for bulk tag ops** |
| various-complements | ✅ installed | ❌ missing | optional install in Brain SK |
| smart-connections-visualizer | ❌ missing | ✅ installed | optional install in falcon-wiki |
| smart-lookup | ❌ missing | ✅ installed | optional install in falcon-wiki |
| obsidian-tasks-plugin | ❌ missing | ✅ installed | **install in falcon-wiki for cross-vault Q-* tracking** |
| realclaudian (Claudian) | ❌ missing | ✅ installed | **install in falcon-wiki for symmetry** |
| obsidian-icon-folder | ❌ missing | ✅ installed | optional in falcon-wiki |
| obsidian-style-settings | ❌ missing | ✅ installed | your taste |
| recent-files-obsidian | ❌ missing | ✅ installed | optional |

**3 mandatory installs (your step, ~5 min):**
1. Breadcrumbs in Brain SK
2. Tag Wrangler in Brain SK
3. Tasks plugin in falcon-wiki

**1 strongly recommended (your step):**
4. Claudian in falcon-wiki — vault-resident Claude operations in both vaults

**Optional polish:**
- Smart-connections-visualizer in falcon-wiki (you have falcon-wiki's embeddings already; visualizer would work)
- Smart-lookup in falcon-wiki (same reason)
- Icon folder in falcon-wiki (visual)

### Phase 7 delta — Templater scaffolds expanded

Add to template frontmatter:
- Breadcrumb keys (`parent`, `up`, `next`, `prev`)
- Standard tag namespace from Phase 8

Add a new template: `_templates/Q-ticket-as-task.md` that creates a Q-* file with both metadata frontmatter AND a Tasks-plugin task line in the body.

### Phase 8 delta — Tag taxonomy uses Tag Wrangler

When proposing the taxonomy:
- Note which existing tags (discovered via Tag Wrangler in Phase 0 inventory) are non-canonical and propose merges.
- Use Tag Wrangler for actual renames in Phase 9 — UI-driven, safer than grep.

### Phase 9 delta — folder icons assigned

In addition to BRAIN-ARCHITECTURE.canvas:
- Brain SK vault: assign icons via obsidian-icon-folder to top-level dirs (30-Validation, 40-API, 60-Components, _templates, etc.). Visual chunking.
- Don't add icons to falcon-wiki unless you install obsidian-icon-folder there too.

### Phase 11 delta — verification widened

Add to final checks:
- Smart Connections embedding count (should match note count after MEMORY compaction)
- Breadcrumbs hierarchy renders at top of opened notes
- Tasks-plugin MOC shows all open Q-* tickets
- (Optionally) Bases registry views open and filter correctly

---

## Section 6 — Cross-vault plugin parity recommendation

Your two vaults have **different plugin sets**. This creates friction — a workflow that works in Brain SK doesn't work in falcon-wiki and vice versa.

**Recommended action (5 min for you):**

| Vault | Install these |
|---|---|
| Brain SK | Breadcrumbs · Tag Wrangler · (optional: various-complements) |
| falcon-wiki | Obsidian Tasks · realclaudian (Claudian) · (optional: smart-connections-visualizer · smart-lookup · obsidian-icon-folder) |

Result: both vaults run the same core toolkit (dataview · templater · smart-connections · breadcrumbs · tag-wrangler · tasks · Claudian) plus their unique extras.

---

## Section 7 — Updated plan dependency graph

```
Phase 0 (pre-flight + inventory)
  ↓
Phase 1 (brain-skill quick wins)
  ↓
Phase 2 (MEMORY compaction)
  ↓
Phase 3 (frontmatter schema PROPOSAL — now includes breadcrumb + task keys) — STOP
  ↓ (you approve)
Phase 4 (you install the 3 mandatory missing plugins + verify Claudian works)
  ↓
Phase 5 (frontmatter backfill)
  ↓
Phase 6 (Dataview MATRIX adoption)
  ↓
Phase 6.5 NEW (Bases proposal — STOP for your decision whether to adopt)
  ↓
Phase 7 (Templater scaffolds + MOCs)
  ↓
Phase 8 (tag taxonomy PROPOSAL — STOP)
  ↓ (you approve)
Phase 9 (tag backfill via Tag Wrangler + Canvas + folder icons)
  ↓
Phase 9.5 NEW (Tasks-plugin migration of Q-* tickets)
  ↓
Phase 10 (lint + polish + Smart Connections re-embed)
  ↓
Phase 11 (verify + push)
```

## Section 8 — Updated time + checkpoint summary

| Phase | My time | Your time | Stop? |
|---|---:|---:|---|
| 0 — Pre-flight | 15m | 5m | ✅ |
| 1 — Brain-skill quick wins | 60m | 0 | — |
| 2 — MEMORY compaction | 2-3h | 0 | — |
| 3 — Frontmatter schema (now with breadcrumb + task keys) | 75m | 20m | ✅ |
| 4 — You install 3 missing plugins + verify Claudian | 0 | 10m | — |
| 5 — Frontmatter backfill | 2h | 0 | — |
| 6 — Dataview MATRIX | 2h | 0 | — |
| **6.5 NEW — Bases proposal** | **45m** | **15m** | **✅** |
| 7 — Templater + MOCs (now uses breadcrumbs) | 2h | 0 | — |
| 8 — Tag taxonomy (uses Tag Wrangler) | 30m | 15m | ✅ |
| 9 — Tag backfill + Canvas + folder icons | 2.5h | 0 | — |
| **9.5 NEW — Tasks integration** | **1.5h** | **0** | **—** |
| 10 — Lint + polish + re-embed Smart Connections | 75m | 0 | — |
| 11 — Verify + push | 30m | 5m | — |
| **TOTAL** | **~15-16 hr** | **~1 hr 10m** | **5 stops** |

(Was 12-13 hr / 50m / 3 stops. Added ~3 hours and 2 stops for the new phases.)

---

## Section 9 — Open questions for you

Before you approve this supplement, please respond on:

1. **Claudian — confirm it works?** Open Brain SK vault in Obsidian. Open command palette (Ctrl+P). Type "Claudian". If you see a launch / chat command → confirm. If not → tell me what you see and I'll adjust.
2. **Plugin parity** — are you OK installing the 3 mandatory missing plugins (Breadcrumbs in Brain SK, Tag Wrangler in Brain SK, Tasks in falcon-wiki)?
3. **Claudian in falcon-wiki** — install it there too for symmetry? (Strongly recommended.)
4. **Bases (Phase 6.5)** — do you want me to even propose Bases? Or skip and stay Dataview-only?
5. **Obsidian Sync** — is enabled in Brain SK. Should we treat that as redundant with our git sync, or keep both (belt and suspenders)?

If you answer those 5 questions, I'll consolidate everything and you can give the final "approve, start Phase 0".

## Section 10 — What I'm still NOT doing in this supplement

Per the original preservation guarantees:

- No file deletions.
- No `.smart-env/` modifications (Smart Connections owns that).
- No plugin installs from my side.
- No `data.json` edits in any plugin folder (plugin settings are yours).
- No `manifest.json` edits.
- No vault path rewrites.
- No git commits/pushes without explicit instruction.

---

## See also

- `BRAIN-IMPROVEMENT-PLAN-2026-05-27.md` — the original 11-phase plan this supplements
- `BRAIN-ARCHITECTURE-CHART.md` — the brain map this plan improves
- Per-plugin manifests verified at:
  - `C:\Falcon\falcon-wiki\.obsidian\plugins\<plugin>\manifest.json`
  - `C:\Falcon\Brain SK\_obsidian\.obsidian\plugins\<plugin>\manifest.json`
