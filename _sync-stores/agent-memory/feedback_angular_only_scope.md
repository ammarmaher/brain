---
name: Angular-only scope (locked 2026-05-08) — skip React + Vue work
description: User directive 2026-05-08. Falcon UI Wave 3+ work focuses exclusively on Angular wrapper. Stencil components stay framework-agnostic at the Shadow layer (they were built that way), but no NEW React/Vue output targets, wrappers, or demo apps. Cover later.
type: feedback
originSessionId: 98cf4816-3d55-4d97-8437-0aa3f7c9cbe3
---
**Locked 2026-05-08 by user (Ammar Mk).** All current and upcoming Falcon UI work focuses exclusively on the Angular wrapper. The Stencil web components remain framework-agnostic at the Shadow DOM layer (already built that way) but no NEW work targets React or Vue.

## Why

The user wants to focus the team on shipping a complete, polished Angular experience first. React + Vue can come later. Avoid splitting attention across three frameworks while the Angular surface is still being polished.

## How to apply

When dispatching agents for Studio Waves 4 / 5 / 6 (or any Falcon UI work):

**DO target:**
- `libs/falcon-ui-core/src/angular-wrapper/` — Angular CVA wrappers
- `libs/falcon/src/shared-ui/` — Angular re-exports
- `libs/falcon-studio/` — Angular Studio
- `apps/host-shell/`, `apps/admin-console/`, `apps/management-console/` — Angular hosts
- `libs/falcon-ui-core/src/components/<name>/` + `<name>-tw/` — Stencil Shadow + Tailwind components (framework-agnostic, stay)
- `libs/falcon-ui-tokens/` — token contracts (framework-agnostic, stay)

**DO NOT target:**
- React Stencil output targets (`@stencil/react-output-target`)
- Vue Stencil output targets (`@stencil/vue-output-target`)
- React or Vue demo playgrounds
- React 19 / Vue 3 wrapper libraries
- The `project_falcon_ui_react_vue_playgrounds.md` planned milestone — stays parked until user authorizes

## Connection to other rules

- The dual render-path pattern (Stencil Shadow `<falcon-x>` + Stencil Tailwind `<falcon-x-tw>`) is preserved — it's the foundation. Both render paths consumed by Angular today, by React/Vue later.
- Token-mutation invariant works regardless of framework — proven Wave 2 Phase D. Adding React/Vue later doesn't require revisiting the contracts.
- The user's earlier `feedback_shadow_is_token_ssot.md` rule still applies (Stencil Shadow + tokens.css = SSOT, all wrappers mirror).

## Cross-session resume

Live plan in-repo: `libs/falcon-studio/STUDIO-WAVES-PLAN.md` "FRAMEWORK SCOPE" section near the top. Read that for the full directive.
