---
name: project_org_hierarchy_tree_rail_utilities_safelist_2026_06_22
description: Org-hierarchy tree vertical guide-rail "ladder" shows broken/empty GAPS between rows. Real root cause = ancestor rail painted only when hasNext (last-child/single-child columns render no line). FIX = always-paint ancestor verticals (drop the hasNext gate) in falcon-tree-node.component.html. Earlier safelist + 3548a056-revert theories were WRONG and reverted.
metadata:
  node_type: memory
  type: project
  originSessionId: b0d28f14-2ae8-4743-8728-4719212b05c3
---

**Symptom (user, 2026-06-22, with reference screenshot):** org-hierarchy tree (host-shell `shared-components/organization-hierarchy-tree` → lib `falcon-tree-panel` → `falcon-tree-node`) — the vertical `|` guide-rail columns render as BROKEN segments with empty GAPS between rows (worst through the hovered white row). USER WANTS: every ancestor column a continuous solid `|` filling all vertical space, no gaps, unbroken through the hovered row (full "ladder"). Bottom-row fade is just the scroll mask, not the bug.

**TRUE ROOT CAUSE [CODE]:** in `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.html`, the ancestor rail `@for (rail of ancestorRailViews())` painted the vertical line ONLY when `rail.hasNext` — `[class.bg-falcon-rail-default]="rail.hasNext && !rail.onPath"` / `[class.bg-falcon-rail-guide]="rail.hasNext && rail.onPath"`. The code comment literally said "A non-through rail (`hasNext === false`) renders no line at all." So any ancestor that is a last child / single child (no sibling below) paints NO line at that column → empty gap in the ladder. (`-my-row-pad-y`, added by 3548a056, only bridges the per-row 6px padding gap; it does NOT fix the hasNext skip.)

**FIX (applied, FE-only, NOT committed):** drop the `hasNext` gate so every ancestor column ALWAYS paints its vertical guide:
`[class.bg-falcon-rail-default]="!rail.onPath"` + `[class.bg-falcon-rail-guide]="rail.onPath"` (kept `[class.through]="rail.hasNext"` hook + the `-my-row-pad-y` continuity + the depth>0 elbow `before/after/through` logic untouched — `└` for last child still correct). Result: full continuous ladder at rest (rest tone) that brightens on the hover path (trail tone) down to the hovered node. **`nx build admin-console` exit-0 (compiles).** Awaiting user VISUAL test (tree needs auth+data; Claude-in-Chrome was unavailable this session). If user wants bars hidden at rest and ONLY on hover, gate on hover instead (design note + reference screenshot both show the ladder at rest, so shipped always-visible).

**WRONG THEORIES (both reverted to clean HEAD):**
1. *Tailwind safelist* — added `@source inline` for the 7 `bg-falcon-rail-*` utils to all 3 app `tailwind.css`. A clean `@tailwindcss/postcss` v4.3.0 compile already generates 7/7 + admin dist styles.css carried them, so missing-utility was NOT the cause. Reverted per user.
2. *Revert commit 3548a056* — that commit was a FIX (teal-alpha-18→rail-rest visibility + `-my-row-pad-y` continuity), not the breakage. Reverting it removed `-my-row-pad-y` and made gaps WORSE. Reverted.

**Tokens (correct, unchanged) [CODE]:** `@theme{}` in `libs/falcon-theme/src/falcon-tailwind-tokens.css` — `--color-falcon-rail-turn`/`-trail` (teal-700 hover), `--color-falcon-rail-rest` rgba(13,63,68,0.30) rest, `--background-image-falcon-rail-guide`/`-default`. Reference SoT (`Source_of_truth_theme/.../Falcon-Taha2/admin/styles.css`) uses rgba(13,63,68,0.18) on `.tree-rail` by default (always-drawn).

**LESSON:** broken tree-ladder gaps = the `hasNext`-gated ancestor-rail render skipping no-sibling columns, NOT a token/scanner/deploy issue. For a full continuous ladder, paint ancestor verticals unconditionally. Related [[project_label_input_spacing_ssot_2026_06_21]].
