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
