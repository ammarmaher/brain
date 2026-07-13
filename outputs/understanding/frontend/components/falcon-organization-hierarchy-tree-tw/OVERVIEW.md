# falcon-organization-hierarchy-tree-tw — OVERVIEW

> [!warning] Name trap — this is NOT the production org-hierarchy tree
> Despite the name, this component has **ZERO live app render consumers** (verified 2026-06-03 — see Consumers below). The live Organization Hierarchy left rail is the shared-ui Angular **`<falcon-tree-panel>`** (`libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/`, which recursively renders its own `<falcon-tree-node>`), consumed via the host-shell **`<app-organization-hierarchy-tree>`** wrapper (`apps/host-shell/src/app/shared-components/organization-hierarchy-tree/`). This Stencil `-tw` component is a registered/documented but UN-RENDERED parallel implementation. For org-hierarchy work see `falcon-wiki/00-MOCs/Org-Hierarchy-Tree-Component-Knowledge.md`.

## Purpose

Bespoke organization-hierarchy panel. Pinned root header (icon + name + ⋮ menu button) plus recursive list of expandable child nodes. Single floating context menu opens under whichever ⋮ button was clicked. Mirrors the React reference `admin/hierarchy.jsx` `NodeRow + ClientsTree` and `admin/styles.css §"CLIENTS TREE PANEL"`.

## Business / UI use case

The left-hand "clients tree" panel on every org-hierarchy page (admin + management consoles). Allows browsing a tenant's organization with brand logos / initials / icons per node and per-row + per-root action menus.

## When to use it

- Left-side panel on org-hierarchy / accounts pages.
- Trees with bespoke chrome (brand bubble + per-row menu + sticky horizontal-scroll menu button + section label between root and children).

## When NOT to use it

- Generic tree-with-data-columns → `<falcon-angular-tree-table>`.
- Simple expandable tree without per-row actions → `<falcon-angular-tree>` (Agent 4).

## Status

**REGISTERED / DOCUMENTED but UN-RENDERED — Light DOM ONLY (per the FE-standard doc).** `[CODE]` `@Component({ tag: 'falcon-organization-hierarchy-tree-tw', shadow: false })` (falcon-organization-hierarchy-tree-tw.tsx:229-232). **NO Shadow DOM companion shipped** — this is a UNIQUE component in the Falcon library; every other dual-render component has Shadow + Light, this one is Light only (confirmed: `Glob` for `falcon-organization-hierarchy-tree` non-`-tw` source returns NOTHING). The Light DOM render uses `data-fohtree-render="tailwind"` attribute selectors + an in-source companion `<style>` block (`ORG_HIERARCHY_RAIL_STYLES`, tsx:69-227) for the rail SVG geometry (linear-gradient through-line + ::before/::after elbow) that Tailwind utilities can't express.

## Paths

| Layer | Path | State (verified 2026-06-03) |
|---|---|---|
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-organization-hierarchy-tree-tw/falcon-organization-hierarchy-tree-tw.tsx` (1207 ln) | ✅ exists |
| Types | `.../falcon-organization-hierarchy-tree-tw/falcon-organization-hierarchy-tree.types.ts` (59 ln) | ✅ exists |
| Auto-gen readme | `.../falcon-organization-hierarchy-tree-tw/readme.md` | ✅ exists (Stencil docs) |
| Tokens | `libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css` (213 ln; `:where()`-scoped, gate-12) | ✅ exists |
| Shadow DOM tag | `falcon-organization-hierarchy-tree` (non-`-tw`) | ❌ does NOT exist (Light-DOM-only by design) |
| Tailwind helper | `tailwind/*-tailwind-classes.ts` | ❌ none — utilities are inline in the `.tsx` |
| Angular wrapper | `angular-wrapper/components/falcon-organization-hierarchy*` | ❌ none — `[CODE]` angular-wrapper/index.ts:134 re-exports only the TYPES, no wrapper class |
| Spec / e2e | any `*.spec.ts` / `*.e2e.ts` | ❌ none found |

- Selector: `falcon-organization-hierarchy-tree-tw` (raw Stencil tag — would be used directly in an Angular template via `CUSTOM_ELEMENTS_SCHEMA`, but nothing does so today).

## Consumers (grep verified 2026-06-03)

**ZERO live app render consumers.** `[CODE]` `Grep` for `<falcon-organization-hierarchy-tree-tw` across the whole repo (excluding `dist/`) → matches ONLY: the component's own `.tsx`/`.types.ts`, `libs/falcon-ui-core/WAVE-5-GAP-CLOSE.md` (plan doc), and `organization-hierarchy.tokens.css` (its token file). The class `FalconOrganizationHierarchyTree*` is referenced only by type-imports + the Stencil `components.d.ts` registry + `web-types.json`.
- The prior dossier's `playground.page.html` consumer is GONE (playground route removed).
- `showcase-variant-tile.component.ts:44` lists the tag string in a denylist ARRAY (`['falcon-organization-hierarchy-tree', 'falcon-organization-hierarchy-tree-tw']`) — a registry/exclusion entry, NOT a live render.
- The live org-hierarchy left rail is `<falcon-tree-panel>` (shared-ui) via `<app-organization-hierarchy-tree>` (host-shell) — a SEPARATE Angular implementation that does NOT render this Stencil tag (`[CODE]` organization-hierarchy-tree.component.html:24 renders `<falcon-tree-panel>`; falcon-tree-panel.component.html:89 renders `<falcon-tree-node>`).

> The org-hierarchy `tokens.css` selector deliberately also lists `app-organization-hierarchy-tree` (`[CODE]` organization-hierarchy.tokens.css:38) — so the token contract is SHARED across this Stencil tree and the live `falcon-tree-panel`-based wrapper, even though only the latter renders.

## Related components

- **`<falcon-tree-panel>`** (shared-ui Angular, `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/`) — **the component that ACTUALLY renders the live org-hierarchy rail**, via the host-shell `<app-organization-hierarchy-tree>` PES-gated wrapper. This Stencil `-tw` component is its un-rendered Stencil sibling.
- `<falcon-angular-tree-table>` — recursive grid table (different visual).
- `<falcon-angular-tree>` — generic tree.

## Ownership

Stencil core only (no Angular wrapper). Owns the org-hierarchy panel chrome shape. Token contract (`organization-hierarchy.tokens.css`) drives visual fidelity to the React V0.2 reference AND is shared with the live `falcon-tree-panel` wrapper (its selector lists `app-organization-hierarchy-tree`).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B21 sweep). Source read on disk (tsx 1207 ln, types 59 ln, tokens 213 ln). `shadow: false` (Light-only) + no Shadow companion + no Angular wrapper (angular-wrapper/index.ts:134 = types only) all re-confirmed. **Consumer reconcile:** ZERO live render consumers (prior dossier's playground consumer removed; showcase ref is a denylist string, not a render). The live org tree is `<falcon-tree-panel>` via `<app-organization-hierarchy-tree>` — verified in their templates. Status sharpened to "REGISTERED/DOCUMENTED but UN-RENDERED, Light-DOM-only".
