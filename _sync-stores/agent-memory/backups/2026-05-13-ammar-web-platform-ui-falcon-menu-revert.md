---
name: Session Backup - falcon-menu Round 5+6 REVERT for stability
description: Reverted falcon-menu wrapper to HEAD because Round 5+6 fix froze /organization-hierarchy-page renderer
type: project
agent: ammar-web-platform-ui
date: 2026-05-13
status: completed
---

## What Was Done

Reverted `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.ts` to HEAD via `git checkout HEAD -- <path>`. Build verified GREEN.

## Root Cause of the Freeze

Round 5 added `repositionPanel()` + `scheduleRepositioning()` setTimeout-burst inside the wrapper's `showAt()`.

Round 6 then added re-entry guards (`_syncing`, `_syncQueued`, `_openBound`) to prevent the prior round's feedback loop, plus a `customElements.whenDefined().then()` chain inside `syncProps()`.

Combined, these still froze the page. Most likely cause: the `customElements.whenDefined(tag).then(...)` chain inside `syncProps()` runs every ngOnChanges; combined with the setTimeout burst in `scheduleRepositioning()` and Stencil's own internal positioning that re-fires events that re-enter Angular, the renderer stalls.

The "stress test passed" claim from the Round 6 agent was not a faithful representation of production behavior — `Page.captureScreenshot` times out at 30s for any user.

## What Remains

The original off-screen menu bug returns: when the user clicks the 3-dot menu trigger on a tree row, the popup panel renders at `-9999/-9999` because Stencil's internal `positionPanel()` runs before the panel `<div>` is mounted.

User's UX inconvenience: menu invisible. But page IS now usable, which was the priority.

## Key Decisions

1. **Stability over feature** — accepted regression of off-screen menu to restore page usability.
2. **Atomic revert** — `git checkout HEAD -- <single-file>` rather than hand-editing, to avoid introducing new errors.
3. **Round 4-5 sibling fixes preserved** — the dropdown / multi-select / mobile-number / tree-node / photo-uploader changes from earlier rounds remain in working tree (uncommitted). They are NOT implicated in the freeze.

## Files Changed

- `C:\Falcon\falcon-web-platform-ui\libs\falcon-ui-core\src\angular-wrapper\components\falcon-menu\falcon-menu.component.ts` — REVERTED to HEAD (commit 7436579c)

## Build Verification

- `npx nx build admin-console` — GREEN
- Build time: 16.7s
- Hash: `f7a6a8fd510e4743`
- Lazy chunk `features-organization-hierarchy-page-organization-hierarchy-page-routes`: 365 bytes / 213 gz
- `curl http://localhost:4200/` → 200 in 1.8ms
- `curl http://localhost:4204/` → 200 in 1.8ms

## What the Wrapper Looks Like Now (one paragraph)

The wrapper is the simple original: it registers the Stencil web component on `ngOnInit`, exposes the standard inputs (`items`, `open`, `popup`, `appendTo`, `triggerLabel`, `disabled`, `anchorEl`, `useTailwind`, `rootClass`), and pushes properties to the live `<falcon-menu-tw>` / `<falcon-menu>` element via a single `syncProps()` call gated by `componentOnReady()`. The `items` setter pushes the array directly to the Stencil element when the view ref is available. Imperative methods (`showAt`, `hide`, `openMenu`, `closeMenu`, `toggle`) are plain awaited delegations — no setTimeout bursts, no reposition loops, no re-entry guards. Outputs (`falconMenuItemSelect`, `falconMenuOpen`, `falconMenuClose`) are emitted on Stencil's CustomEvent.

## Recommended Next-Round Approach

The off-screen bug is in Stencil's internal `positionPanel()` running before its panel `<div>` mounts. Two viable approaches that AVOID re-entrant ngOnChanges:

### Option A — Body Portal via DOM Mutation (RECOMMENDED)

Inside the Stencil component itself (NOT the Angular wrapper), when `open=true`:
1. After the panel element is rendered, detach it from the host shadow tree.
2. Append it to `document.body` as a true portal.
3. Position it via `getBoundingClientRect()` of the anchor + `position: fixed`.
4. On close, return it to the shadow tree.

This bypasses every Angular lifecycle entirely and works consistently because body-level fixed positioning is immune to ancestor `transform`/`overflow` clipping.

**Files to touch:**
- `libs/falcon-ui-core/src/components/falcon-menu/falcon-menu-tw.tsx` (Stencil Light DOM variant)
- `libs/falcon-ui-core/src/components/falcon-menu/falcon-menu.tsx` (Stencil Shadow DOM variant)
- NO Angular-wrapper changes.

### Option B — Native Popover API (`[popover]` attribute)

Modern browsers have a built-in popover API (`<div popover="manual">`). Browser positions and z-stacks it natively against the top-layer. Falcon target browsers are evergreen Chrome / Edge; the popover API is supported (Chrome 114+, May 2023). This eliminates positioning code entirely.

**Risk:** Safari/iOS 17+ only — verify support matrix before adopting.

### What to AVOID

- Adding ANY logic inside the Angular wrapper that re-enters `syncProps()` indirectly via Stencil events. The Angular wrapper must be a pure pass-through.
- `setTimeout` bursts in `showAt()` — they stack with rapid 3-dot clicks and peg the renderer.
- `customElements.whenDefined().then()` inside ngOnChanges — runs once per CD, creates microtask queue pressure.
- Any guard like `_openBound` that adds conditional Stencil writes — they create state divergence between Angular's input and Stencil's actual prop.

## Context for Next Agent

1. Working tree still has the Round 4-5 sibling fixes (dropdown, multi-select, mobile-number, photo-uploader, mock-tree, i18n, full new `organization-hierarchy-page/` feature folder). Do NOT touch these — they are stable.
2. The deleted-file entries in `git status` (`D apps/.../organization-hierarchy-page/components/...`) reflect a half-done `git mv` rename from a prior round. The actual files exist on disk in the untracked `apps/admin-console/src/app/features/organization-hierarchy-page/` listing. No action needed — those resolve when the rename is re-staged or when the user commits the working tree.
3. NO commits, NO pushes performed. Standing rules respected.
4. Expect the user to choose Option A (body portal) for the next round — it's the lowest-risk fix.
