# falcon-node-details-section — OVERVIEW

> **Single-render pure-Angular shared-ui component** (`libs/falcon/src/shared-ui`). It is NOT a dual-render Stencil component — there is **no Shadow tag, no `-tw` Light twin, and no `falcon-ui-tokens` component file**. Styling is inline Falcon-Tailwind utilities in the template. Rubric dims **B (Stencil dual-render parity)** and **E (React/Vue cross-framework parity)** are **N/A** — stated again in API.md / TOKENS.md.

## Component purpose

`[CODE]` falcon-node-details-section.component.ts:1-21 — A reusable **"node identity" header strip** used across the platform:

```
[avatar] [label] ........................... [projected actions]
```

It is the canonical header that sits above a node's content (a tab body, a data table, a wallet card). The left edge shows an avatar (image, projected custom template, or first-letter initials chip) plus the node's name; the right edge renders caller-supplied action buttons via a projected `<ng-template>`. The component owns no mode/state — the parent decides which actions to project.

## Business / UI use case

- The **org-hierarchy page** node header in BOTH consoles — every tab (Hierarchy / Settings / Information / etc.) shares this one header strip (`[CODE]` org-hierarchy-page-menu.component.html:143-159).
- The **Settings tab** Edit / Cancel / Save Changes button row (`[CODE]` org-hierarchy-page-menu.component.html:160-178) and the **Information** edit-mode buttons (`[CODE]` :192-197) project into its actions slot.
- The **Communication Channels** and **Marketplace Applications** feature pages render it as the selected-node header above their data tables (`[CODE]` comm-channels-services.component.ts:4-6; marketplace-applications.component.ts:4-6).
- The **Templates** feature (list / wizard / details) and the **new-wallet-balance** feature also render it (`[CODE]` grep 2026-06-03).

## When to use it / when NOT to use it

**Use it for:**
- Any "selected node" / "current entity" identity header that needs `[avatar] name … [actions]` with the platform-standard look.
- A header whose action buttons differ by mode (view / edit / default) — the parent projects the correct buttons via `<ng-template falconNodeDetailsActions>`.
- A header that needs a custom avatar (brand SVG, status chip) — project `<ng-template falconNodeDetailsAvatar>`.

**Do NOT use it for:**
- A read-only label/value details grid → use `<falcon-info-card>` (B25).
- A full node header with **built-in** back-arrow + hardcoded action buttons + brand mark → that was `<falcon-org-node-header>` (B25), now a **deletion candidate** (0 consumers; superseded by THIS component).
- A page-level loading placeholder → use `<falcon-page-skeleton>` (B26).
- Anything that needs the avatar/label to be editable inline — this is a presentational header.

## Status

**ACTIVE / PREFERRED / SHARED.** `[CODE]` This is the LIVE supersessor of `<falcon-org-node-header>` (B25 deletion candidate): the org-hierarchy header was migrated to `<falcon-node-details-section>` (`[CODE]` org-hierarchy-page-menu.component.ts:61-62; html:151-270 per B25 FINDINGS). Promoted from `apps/admin-console` into shared-ui in Wave 19 (2026-05-14) so it could be reused platform-wide (`[CODE]` index.ts:1-6).

## Replaces

- `[CODE]` The app-local org-hierarchy header it was promoted from (Wave 19 — index.ts:2-3).
- `[BRAIN-OUT]` Functionally **supersedes** `<falcon-org-node-header>` + its app twin `<app-org-node-header>` (B25 FINDINGS G1 — both now 0-consumer deletion candidates).

## Source file paths

| Layer | Path |
|---|---|
| Angular component TS | `libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/falcon-node-details-section.component.ts` (67 ln) |
| Angular component HTML | `libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/falcon-node-details-section.component.html` (39 ln) |
| Actions directive | `libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/falcon-node-details-actions.directive.ts` (14 ln) |
| Avatar directive | `libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/falcon-node-details-avatar.directive.ts` (19 ln) |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/index.ts` (9 ln) |
| Shared-ui re-export | `libs/falcon/src/shared-ui/index.ts:186` (`export * from './lib/components/falcon-node-details-section'`) |
| Component CSS / SCSS | **NONE** — no `.css`/`.scss` file (Glob 2026-06-03). Styling is inline Tailwind in the HTML. |
| Stencil Shadow / `-tw` twin | **NONE** — single-render pure-Angular component. |
| `falcon-ui-tokens` component file | **NONE** — no `node-details-section.tokens.css`; the template reads platform Falcon-Tailwind utilities directly. |
| Spec / tests | **NONE** (`*.spec.ts` Glob empty 2026-06-03) — GAP G1. |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-node-details-section` |
| Actions slot directive | `ng-template[falconNodeDetailsActions]` |
| Avatar slot directive | `ng-template[falconNodeDetailsAvatar]` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-node-details-section` across `apps/` `*.html` = **26 occurrences / 16 files**; **0 render sites in `libs/falcon`** (the 5 libs matches are this component's own source files + one descriptive comment in `falcon-info-card.component.ts`). Render sites:

- `apps/{admin,management}-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.html` (2 each) — the flagship; projects `<app-org-node-avatar>` + per-mode action buttons (`[CODE]` :151-159).
- `apps/{admin,management}-console/.../org-hierarchy-page/components/tab-components/settings-tab/settings-tab.component.html` (1 each).
- `apps/{admin,management}-console/.../org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` (1 each).
- `apps/{admin,management}-console/.../templates-page/components/{templates-list (1-2), templates-wizard (2), templates-details (2)}.component.html`.
- `apps/management-console/.../new-wallet-balance/components/wb-client-view/wb-client-view.component.html` (2).
- `apps/admin-console/.../comm-channels-services/comm-channels-services.component.html` (1).
- `apps/admin-console/.../marketplace-applications/marketplace-applications.component.html` (1).

See `USAGE.md` Consumer Sweep for the enumerated list.

## Related components

- **Supersedes:** `<falcon-org-node-header>` + `<app-org-node-header>` (B25 deletion candidates — same `[avatar] name [actions]` purpose, but THIS one is slot-driven and actually used).
- **Frequently projects:** the host-shell shared `<app-org-node-avatar>` (Falcon-brand-SVG-aware) into its avatar slot (`[CODE]` org-hierarchy-page-menu.component.html:155-156).
- **Frequently projects:** `<falcon-angular-button>` action buttons into its actions slot (`[CODE]` :164-190).
- **Sibling shared-ui:** `<falcon-info-card>` (read-only details grid), `<falcon-page-skeleton>` (loading placeholder), `<falcon-view-toggle>` (B25).

## Ownership / responsibility

`libs/falcon/src/shared-ui` (Falcon shared Angular UI). `[CODE]` Authored "Ammar-led" Wave 19 (2026-05-14), avatar slot added Wave 22 (2026-05-16) — header comments ts:1, avatar.directive.ts:10. No token contract of its own — relies on the platform Falcon-Tailwind token utilities in the `@falcon/theme` layer.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26 sweep, NEW dossier). Source-file table confirmed on disk (component + 2 directives + barrel; no `.css`/`.scss`, no Stencil twin, no token file). Consumer sweep: 26 occurrences / 16 app HTML files, 0 in `libs/falcon`. Supersession of `<falcon-org-node-header>` cross-referenced from B25 FINDINGS.
