# falcon-org-node-header — OVERVIEW

## Component purpose

`[CODE]` falcon-org-node-header.component.ts:1 — A **node identity + action bar** strip for the organization-hierarchy surface: a left zone showing the selected node's **avatar (image, Falcon brand SVG for root, or initials fallback) + name**, an optional `[slot=badge]` beside the name, and a right zone with the node-context **action buttons** (Information, Add Client, Add Node, Edit Node/Info, Add User) OR a fully-projected `[slot=actions]` row when `useCustomActions` is set.

This is a **single-render pure-Angular shared-ui component** (no Stencil Shadow tag, no `-tw` twin, no tailwind-classes helper, no token file). All styling is inline Tailwind on the template. The falcon-input dual-render layers do **not** exist here — say so, don't fabricate them.

> **CRITICAL ADOPTION FINDING (2026-06-03):** the shared-ui `falcon-org-node-header` (selector `falcon-org-node-header`) has **ZERO live render consumers.** The org-hierarchy page renders `<falcon-node-details-section>` instead (`[CODE]` org-hierarchy-page-menu.component.html:151-270), and a **separate, near-identical app-level twin** `app-org-node-header` exists under `apps/{admin,management}-console/.../hierarchy-tab/falcon-org-node-header/` — also unused. See GAPS_AND_UPGRADES (G1) and the Known consumers / Related sections below. The component is a **promoted-but-orphaned duplicate**.

## Org-hierarchy feature context (per task §4 instruction)

`[CODE]` The organization-hierarchy feature (`apps/{admin,management}-console/src/app/features/org-hierarchy-page/`) renders, for a selected org node, a tabbed surface (`<falcon-angular-tabs>` — Hierarchy / Settings / etc.) above the node's children/users. The **node header strip** sits at the top of that surface showing *which* node you're looking at (avatar + name) and the actions available on it (add a child client/node, add a user, open the Information panel, edit the node). In the **live** code that strip is rendered by `<falcon-node-details-section>` (a more generic avatar+label+projected-actions header, `[CODE]` org-hierarchy-page-menu.component.html:151), with the action buttons projected as `<falcon-angular-button>`s into its actions slot. `falcon-org-node-header` was an earlier, more opinionated version of that strip (it bakes the action buttons in) that was **superseded** during Wave 19.

`[CODE]` org-hierarchy-page-menu.component.ts:61-62 — the page explicitly documents the supersession: *"FalconOrgNodeHeaderComponent removed — replaced by the new shared `<app-org-node-details-section>` + projected `<falcon-angular-button>` slot."* and ts:49-52 — *"`<app-org-node-header>` superseded by the library's `<falcon-node-details-section>`."*

## Business / UI use case

- **Node identity** — show the operator which org node (root / client / sub-node) is selected, with the right avatar treatment (Falcon brand SVG for the root, image if present, else 2-letter initials on teal).
- **Node actions** — surface the create/edit affordances permitted on that node (Add Client, Add Node, Edit Node, Add User) + the Information toggle.
- `[CODE]` It is **role-gated by inputs** — every action button is behind a `can*` boolean (`canAddClient` / `canAddNode` / `canEditNode` / `canAddUser` / `canShowInfo`, ts:22-26), so the *parent* (which resolves PES) decides what renders.

## When to use it / when NOT to use it

**Use it for (intended):**
- An org-node header strip needing baked-in node actions + avatar + name, where you do NOT want to hand-project each button.

**Do NOT use it (today):**
- For the live org-hierarchy header — that uses `<falcon-node-details-section>` (the supersessor). Adding `<falcon-org-node-header>` to a new page would re-introduce the duplicated component the team migrated away from.
- For a generic "avatar + label + your-own-actions" strip → use `<falcon-node-details-section>` (more flexible: avatar via directive, actions fully projected).
- For non-org-hierarchy headers → it bakes org-specific actions + a Falcon brand SVG; it is not a generic page header.

## Status

`[CODE]` shared-ui/index.ts:176-178 (`export * from './lib/components/falcon-org-node-header'`) — **EXPORTED but UNADOPTED / SUPERSEDED.** It is reachable via `@falcon` but has 0 render consumers; the org-hierarchy feature migrated to `<falcon-node-details-section>` (org-hierarchy-page-menu.component.ts:61-62). Effectively a **shared orphan** + a **name-collision duplicate** of the app-level `app-org-node-header`. NOT formally deprecated in code, but functionally dead. (Deletion candidate — flagged `safe-local` review, see GAPS_AND_UPGRADES.)

## Replaces / superseded-by

- `[CODE]` It was intended to replace the consumer-side `app-org-node-header` (org-hierarchy-page-menu.component.ts:49-52) — but the team instead replaced BOTH with `<falcon-node-details-section>` (ts:61-62). So in practice it is **superseded by `<falcon-node-details-section>`**, not the active node header.

## Source file paths

> Single-render Angular shared-ui component — three source files. No `.css`, no Stencil `.tsx`/`-tw`, no tailwind helper, no token file.

| Layer | Path |
|---|---|
| Angular component TS | `libs/falcon/src/shared-ui/lib/components/falcon-org-node-header/falcon-org-node-header.component.ts` (41 ln) |
| Angular component HTML | `libs/falcon/src/shared-ui/lib/components/falcon-org-node-header/falcon-org-node-header.component.html` (95 ln) |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-org-node-header/index.ts` (exports class + `FalconOrgNodeHeaderType`) |
| Library re-export | `libs/falcon/src/shared-ui/index.ts:176-178` |
| Component CSS | **(none — inline Tailwind in .html)** |
| Stencil / `-tw` / tailwind helper / token file | **(none — not a dual-render component)** |
| Spec / tests | **(none found)** — GAP G2. |
| App-level TWIN (NOT this component) | `apps/{admin,management}-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-header/falcon-org-node-header.component.{ts,html}` (selector `app-org-node-header`, same class name, also unused) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector (shared-ui) | `falcon-org-node-header` `[CODE]` falcon-org-node-header.component.ts:11 |
| Angular selector (app-level twin) | `app-org-node-header` `[CODE]` apps/.../falcon-org-node-header.component.ts:13 — **different selector, same class name** |
| Stencil tags | none |

> `[CODE]` Host class is `falcon-org-node-header block` (component.ts:15) — a block-level element. The visible header is the inner `<header class="flex items-center justify-between ...">`.

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-org-node-header[\s>]` across `apps/` + `libs/falcon/` = **0 live render sites.** The only matches are documentation (`docs/_plans/W12-final-verification.md:32`, `docs/_plans/baseline/react-parity-checklist.md:31`, `docs/archive/WAVE-A-OLD-STRUCTURE.md:264`) describing an OLD page structure, plus the component's own source. No `.ts` `imports: []` references the shared `FalconOrgNodeHeaderComponent` from a feature.

`[CODE]` The app-level twin selector `<app-org-node-header[\s>]` = **0 render sites** too; the only matches are the supersession comments (org-hierarchy-page-menu.component.ts:49 in both apps). Both node-header components are dead; the live header is `<falcon-node-details-section>` (org-hierarchy-page-menu.component.html:151-270).

See `USAGE.md` Consumer Sweep for details.

## Related components

- **Superseded by:** `<falcon-node-details-section>` (`[CODE]` org-hierarchy-page-menu.component.ts:61-62 + shared-ui/index.ts:180-186) — the active org-node header strip (avatar via `FalconNodeDetailsAvatarDirective`, actions via `FalconNodeDetailsActionsDirective`, label + projected action row). New code MUST use this, not `falcon-org-node-header`.
- **Name-collision twin:** app-level `app-org-node-header` (same class `FalconOrgNodeHeaderComponent`, app selector) — a near-duplicate; uses `FalconAngularButtonComponent` + `FalconBrandLogoComponent` and lacks the shared one's `useCustomActions` + `[slot=badge]`/`[slot=actions]` projection.
- **Composes (when used):** the action buttons are inline `<button>`s here (the app twin uses `<falcon-angular-button>`). The `[slot=badge]` is intended to host a Falcon/Client mode pill; `[slot=actions]` replaces the built-in row.
- **Sibling Wave-19 promotions:** `<falcon-view-toggle>` (this batch), `<falcon-status-chip>`, `<falcon-angular-empty-data>`.

## Ownership / responsibility

`libs/falcon/src/shared-ui` (Falcon shared-ui Angular library). Owned by the Falcon FE team. No token contract.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25). Source-file table confirmed (3 files, no `.css`/Stencil/token layers). Consumer sweep `<falcon-org-node-header[\s>]` → **0 live render sites** (only docs + own source); `<app-org-node-header[\s>]` → 0; live header = `<falcon-node-details-section>` (org-hierarchy-page-menu.component.html:151). Name collision with app-level `app-org-node-header` confirmed (identical class name). NEW dossier — created from scratch.
