# Org Hierarchy tree connector rails invisible/fragmented — ROOT-CAUSED + FIXED + LIVE-VERIFIED

- **Task**: org-hierarchy-tree-rail-lines-invisible-2026-06-10
- **Status**: COMPLETED 2026-06-10 (claude). FE-only, NO commits. (current-task.json was taken over mid-task by the concurrent `frontend-zero-warnings-2026-06-10` session, which recorded this task as its pausedPreviousTask — this history file is the completion record.)
- **User report**: hovering a node in the org-hierarchy tree should show the line indicating where the node comes from (reference screenshot left = correct, always-visible connector ladder + dark hover path); implemented app showed "nothing".

## Root cause (two independent defects, both in the shared `falcon-tree-panel`)
Everything SUSPECTED first was verified CORRECT: rail-highlight math (`utils/rail-highlight.ts`, unit-tested), `TreeHoverPathDirective` (mousemove → data-index-path → signal), zoneless signal chain, Tailwind v4 generation (all `bg-falcon-rail-*` rules + theme vars present in served + dist `styles.css`).

1. **Fragmentation** — `[CODE] falcon-tree-node.component.html` rail spans (`.tree-rail`, ancestor + elbow) are flex items inside `.client-row` which has `py-row-pad-y` (6px). `self-stretch` sizes to the row's CONTENT box only → every row's rail segment stopped 6px short top+bottom → 12px white gap between consecutive rows → the "ladder" rendered as disconnected fragments; the hover trail lit but looked broken.
2. **Invisibility at rest** — dim tone was `--color-falcon-teal-alpha-18` = rgba(13,63,68,.18); a 1px line at 18% alpha over white/teal-50 is effectively invisible at normal zoom. Without a live hover (screenshots don't capture it), the tree showed NO lines at all.

## Fix (2 files)
- `[CODE] libs/falcon-theme/src/falcon-tailwind-tokens.css` — added semantic `--color-falcon-rail-rest: rgba(13,63,68,0.30)` (NEW token; `teal-alpha-18` untouched — shared by calendar/drawer/tree-indicator); `--background-image-falcon-rail-default` gradient repointed to it.
- `[CODE] libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.html` — added `-my-row-pad-y` to BOTH rail spans (negative vertical margin bleeds the paint across the row padding → continuous columns; symmetric 6px padding keeps the 50% midline = row visual center, so elbow arms stay centered); swapped dim pseudos `before/after:bg-falcon-teal-alpha-18` → `bg-falcon-rail-rest`.

## Verification (runtime evidence)
- Live Chrome on http://localhost:4200 (host-shell dev + admin-console NF remote 4204), sysadmin, `/#/admin-console/h/{token}`, chain BMW222→E30→E33→E3335r→{za,asdasd,asxxxxxxx}.
- DOM: rails computed height 36px (was 24), margin-top −6px, new classes live.
- Visual: REST = continuous visible ladder (no hover needed); HOVER = continuous dark teal path root→hovered node, rest-tone below it. Matches reference structure.
- Console: zero errors. Tests: host-shell vitest 233/233 tests green incl. `tree-rail-highlight.spec.ts`; 1 test FILE fails = PRE-EXISTING unrelated vite resolve error (`@falcon/studio/runtime` import in falcon-image-uploader) — not an assertion, untouched by this fix.
- Prod builds intentionally NOT run by this session: concurrent `frontend-zero-warnings` session was running nx builds over the same working tree simultaneously; both watching dev servers (webpack host CSS + esbuild remote) compiled the change green.
- Management-console gets the fix automatically (same shared component + tokens) — not live-verified there.

## Open flags
- **Sidebar "Organization Hierarchy" nav item does NOT navigate** (admin scope): item path is `/admin-console/h` (layout.component.ts:66,218 — correct), but 4 clicks from Dashboard/Templates did nothing (no route change, no console error). Reached the page only by direct URL. Separate bug — flagged as background task.
- Pre-existing `falcon-http-ui-dispatcher.spec.ts` transform failure (`@falcon/studio/runtime`).
