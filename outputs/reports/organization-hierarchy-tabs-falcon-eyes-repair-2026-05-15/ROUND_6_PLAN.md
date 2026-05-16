*** Round 6 Plan — Comm Channels Edit Flow (post user rejection of Round 5) ***

**Status:** DRAFT — does NOT start until Ammar:
1. Signs off on `EDIT_ROW_SPEC.md`
2. Confirms or supplies canonical test values (TC1–TC7 in the spec)
3. Decides what to do with the Wave-15 unstaged work in the tree

# Pre-flight gates (must all be ✅ before any agent runs)

| Gate | Description | Owner |
|---|---|---|
| G1 | `EDIT_ROW_SPEC.md` signed off | Ammar |
| G2 | Test values TC1–TC7 confirmed (or alternates supplied) | Ammar |
| G3 | Working tree clean OR Wave-15 status decided (stash / commit-from-your-side / continue) | Ammar |
| G4 | Dev-serve running and serving fresh bundle (not a stale process) | Ammar |
| G5 | claude-in-chrome MCP connected to Ammar PC | Adnan + chrome ext |

# Work plan (only after G1–G5 all green)

## Phase 1 — Component contract audit (no code changes)

Sub-agent: `ammar-web-platform-ui` (read-only)

1. Inspect `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx`:
   - Does it expose `<slot name="row-expansion">`?
   - Does it auto-wrap the projected content in `<tr><td colspan="N">`?
   - Does it support a two-way-bound `expandedRowId` prop?
2. Inspect `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/`:
   - Does it expose `[(expandedRowId)]` and a `<ng-template falconRowExpansion>` projection?
3. Report findings vs the spec contract. If ANY gap exists, document it in `FALCON_DATA_TABLE_R6_GAPS.md` and propose the Stencil-side + wrapper-side upgrade (backward-compatible).

## Phase 2 — Falcon Data Table upgrade (if Phase 1 surfaces gaps)

Sub-agent: `ammar-web-platform-ui` (write)

- Author the upgrade in `libs/falcon-ui-core`. Stencil source + Angular wrapper + barrel export. Tokens only, no SCSS.
- Update component knowledge dossier at `C:\Falcon\Brain Outputs\understanding\frontend\components\falcon-data-table\`:
  - `API.md` — new prop + slot signatures
  - `USAGE.md` — example consuming the row-expansion
  - `GAPS_AND_UPGRADES.md` — change log
- `nx build falcon-ui-core` GREEN.
- Backward-compat verification: org-hierarchy main table (the OTHER table on the page) still renders unchanged.
- DO NOT commit. Stage only.

## Phase 3 — Consumer rewrite (the actual edit-row)

Sub-agent: `ammar-web-platform-ui` (write)

1. Remove the existing top-bar edit drawer (Round 3 staged code).
2. Add the row-expansion template to the comm-channels table inside `org-hierarchy-page-menu.component.html` / `.ts`.
3. Wire trigger: kebab → Edit Price Type / Edit Price Value sets `expandedRowId` to the row, with edit-mode flag (`type` or `value`).
4. Edit template:
   - 2-field mode (Edit Price Type): dropdown + date picker, column-aligned, no value input.
   - 1-field mode (Edit Price Value): number input only, column-aligned, no dropdown / no date picker.
   - Cancel + Save right-aligned.
5. Save handler:
   - Set `row.stagedChange = { type, value, effectiveDate }` (whichever fields were edited).
   - Collapse expand-row by clearing `expandedRowId`.
   - The data row's Actions cell now renders a chevron (because `row.hasStagedChange` is truthy).
6. Chevron handler:
   - Click chevron → expand the row with a read-only staged-summary template.
   - Click again or hit a Close action → collapse.
7. Cancel handler:
   - Clear `expandedRowId`, do not set staged state.
8. `nx build admin-console` GREEN.
9. DO NOT commit. Stage only.

## Phase 4 — Live verification (chrome MCP, Ammar PC)

Sub-agent: `ammar-qa-web` (read-only browser, capture-only)

For each TC1–TC7 in the spec:
1. Open destination tab in MCP. Hard refresh.
2. Execute the action sequence.
3. Capture before/after screenshots + DOM snapshot.
4. Capture network requests (must be zero for save/cancel — matches SoT in-memory pattern).
5. Capture console messages (must be zero errors).
6. Compare dest screenshot to user's SoT screenshot for the equivalent state.
7. Mark verdict: PASS (visually matches) / FAIL (delta + screenshot).

Output: `Brain Outputs/reports/falcon-eyes/R6-<timestamp>/matrix/` with per-case folders.

## Phase 5 — Report + score restoration (only on full PASS)

Sub-agent: orchestrator (Adnan)

1. Update `PAGE_SCORECARD.md` + `VISUAL_PARITY_SCORECARD.md` with new score — **only if all 7 TCs pass and Ammar confirms**.
2. Update `NEXT_ACTIONS.md` to close DEFECT-CCS-R5-P0-A / -B / -C.
3. Append `ROUND_6_REPORT.md` to repair bundle.
4. Regenerate PDF v1.5.
5. Stage all changes. **DO NOT commit. DO NOT push.**

# Standing rules (unchanged but re-emphasized)

- ❌ No commit. No push. User does git from their side.
- ❌ No agent self-PASS without screenshot vs user-provided SoT screenshot match.
- ❌ No score claim without user sign-off — reports say USER-VERIFIED or AGENT-VERIFIED, never just a %.
- ✅ Falcon library FIRST — but only after confirming the structural pattern from the source. Reuse < customize < upgrade < new component < wrapper < raw HTML.
- ✅ Tailwind + Falcon tokens only.
- ✅ chrome-MCP only for live verification.
- ✅ Strict scope: comm-channels edit flow inside org-hierarchy-page.

# Estimated effort (planning only — not authorized to execute)

| Phase | Effort | Risk |
|---|---|---|
| Phase 1 — audit | 10–20 min | Low |
| Phase 2 — Stencil upgrade (if needed) | 1–2 hr | Medium (Stencil slot + Angular wrapper + tests) |
| Phase 3 — consumer rewrite | 1–2 hr | Low (template + handler) |
| Phase 4 — 7 TCs live verification | 30–45 min | Low |
| Phase 5 — report + stage | 15 min | None |

Total: **~3–5 hours of sub-agent runtime** to deliver the full fix with user-grade evidence.

# Open questions for Ammar

1. **Test values:** are TC1–TC7 the right scenarios + values? Or do you want a specific value matrix (e.g., "always test 2500" or "use the same values from your screenshots")?
2. **Wave-15:** do you want me to stash it before Round 6, or do you intend to land Wave-15 separately and Round 6 builds on top of it? The Wave-15 commit will introduce backend wiring for IB payment (good) but its current state regresses two defects (DEFECT-CCS-R5-001/002).
3. **Chevron visual:** the spec says `chevron-down` from the Falcon icon font. Do you have a specific icon name + behavior preference (rotate vs flip vs separate up/down icons)?
4. **Staged-summary template:** when chevron is clicked, the spec proposes a read-only summary of the staged change. Do you want it as a small inline panel, a popover, or the same expand-row design but read-only?
5. **Future-process:** going forward, do you want each new feature spec'd in the same `<feature>_SPEC.md` format before code lands, or do you have a preferred shape (one-pager / checklist / annotated screenshot)?
