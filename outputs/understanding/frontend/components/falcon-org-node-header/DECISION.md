# falcon-org-node-header — DECISION

## Brain SK final recommendation

**STATUS: DO-NOT-USE / DELETION CANDIDATE.** `falcon-org-node-header` (shared-ui) is a **superseded orphan** with **0 live consumers** — the org-hierarchy header was migrated to `<falcon-node-details-section>` (`[CODE]` org-hierarchy-page-menu.component.ts:61-62; html:151-270). It also **collides by class name** with two app-level twins (`app-org-node-header`, same `FalconOrgNodeHeaderComponent` class), both also unused. The recommendation is to **delete all three node-header artifacts** and standardize on `<falcon-node-details-section>`. For any org-node header need today, **use `<falcon-node-details-section>` + projected `<falcon-angular-button>`s.**

## Use this component for

- **Nothing in new code.** It is not the maintained org-node header.
- (Historical/intended) an org-node identity + baked-action header — now served by `<falcon-node-details-section>`.

## Avoid this component for

- All current needs. Specifically avoid it for the org-hierarchy header (use `<falcon-node-details-section>`), generic avatar+label+actions strips (node-details-section), and any dark-mode surface (it has no `dark:` styling).

## Preferred variant / render path

`[CODE]` Single render path (pure Angular, no Shadow/`-tw`). Two modes if ever used: default (built-in `can*`-gated buttons) or `useCustomActions=true` (`[slot=actions]` projection). **But the preferred answer is to not use it at all** — `<falcon-node-details-section>`'s `falconNodeDetailsActions` template is the strictly-more-flexible replacement.

## Required upgrades before wider use

If a future decision resurrects it instead of deleting: resolve the G1 name collision (delete the app twins), switch native `<button>` → `<falcon-angular-button>` (G6), use `<falcon-brand-logo>` (G3), tokenize the arbitrary px (G5), add dark-mode styling (G8), fix the false "SCSS handles button skin" comment (G4), and add a spec (G2). At that point it converges with node-details-section — reinforcing that deletion is cleaner.

## Relationship to other components

- **Superseded by:** `<falcon-node-details-section>` (the active org-node header; avatar via `FalconNodeDetailsAvatarDirective`, actions via `FalconNodeDetailsActionsDirective`).
- **Name-collision twin:** app-level `app-org-node-header` (same class name; uses `<falcon-angular-button>` + `<falcon-brand-logo>`; lacks `useCustomActions`/badge slot) — also unused.
- **Would-compose (if used):** the live supersessor composes `<falcon-angular-button>` + `<app-org-node-avatar>`; this component instead bakes native buttons + an inline brand SVG.
- **Sibling Wave-19 promotions:** `<falcon-view-toggle>` (this batch), `<falcon-status-chip>`.

## Exact rule for future implementation tasks

1. **Need an org-node header (avatar + name + actions)?** Use `<falcon-node-details-section>` — NOT `<falcon-org-node-header>`.
2. **Project the avatar** via `<ng-template falconNodeDetailsAvatar>` (reuse `<app-org-node-avatar>`).
3. **Project actions** via `<ng-template falconNodeDetailsActions>` with `<falcon-angular-button>`s, each `@if (pes.can*())`-gated, with `[loading]`/`[disabled]` as needed.
4. **Do NOT adopt `<falcon-org-node-header>`** (superseded/unused) and do NOT import the ambiguous `FalconOrgNodeHeaderComponent` (name collision).
5. **If you own a cleanup task:** delete the shared `falcon-org-node-header` + both app twins + the `shared-ui/index.ts:176-178` re-export (G1) — `safe-local`, human-approve as a deliberate removal.

---

## Dynamic capability assessment

### 1. What is static today?

- `[CODE]` The whole visual contract: `h-[38px]`/`text-[13px]`/`rounded-[10px]`/`text-[15px]` buttons + name (arbitrary px), the inlined brand SVG path (html:12), the fixed white/teal button skins, no `dark:` classes. No size/disabled/variant axes.

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **11 inputs** (`nodeName` required + `nodeType`/`imageUrl`/5×`can*`/`infoOpen`/`useCustomActions`, ts:18-28) and **5 `void` outputs** (`addClient`/`addNode`/`editNode`/`addUser`/`toggleInfo`, ts:30-34). Which avatar treatment, which buttons render, and the info-open label/style flip are all input-driven.

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` **Two `<ng-content>` slots:** `[slot=badge]` (beside the name, html:25) and `[slot=actions]` (gated by `useCustomActions`, html:33). No `ng-template` inputs (the supersessor uses `ng-template` directives instead — strictly more flexible).

### 4. What is dynamic through token/theme overrides?

- `[CODE]` **Nothing** — no `--falcon-org-node-header-*` tokens, no `dark:` variants. Not retheme-able, not dark-mode-ready (G7/G8).

### 5. What is dynamic through Tailwind classes?

- `[CODE]` Only the **host** `class=` for layout; no `wrapperClass`/`buttonClass` hook into the inner buttons.

### 6. What is missing to make this component reusable across pages?

- It is fundamentally **not the chosen reusable component** — `<falcon-node-details-section>` already fills the role with more flexibility. Beyond that: dark mode (G8), tokens (G7), `<falcon-angular-button>` (G6), `disabled` axis (G9), and resolving the name collision (G1).

### 7. What capability should be added to shared component (not page hack)?

- The correct "shared capability" decision is **deletion** (G1) — consolidate onto `<falcon-node-details-section>`. Adding capabilities here would duplicate node-details-section.

### 8. What flags / options / templates / slots would make it better?

- If kept: `disabled` per-action, `size`, a token contract, dark-mode classes, `<falcon-angular-button>` internals, `<falcon-brand-logo>`. But all of these already exist in the supersessor's composition — so the "better" version IS node-details-section.

### 9. What is the safest upgrade path?

1. **Phase A (preferred):** delete the shared `falcon-org-node-header` + the two app twins + the barrel re-export; migrate any (currently zero) intent to `<falcon-node-details-section>`. Safe — no live consumer.
2. **Phase B (only if resurrected):** brand-logo (G3) + falcon-button (G6) + tokens (G5/G7) + dark mode (G8) + comment fix (G4) + spec (G2) + a11y (A1-A4).

### 10. What is risky to change because other pages depend on it?

- `[CODE]` **Nothing depends on it** (0 consumers) — so deletion is low-risk. The only "risk" is the name collision masking which twin a maintainer edits (G1); deletion of all three resolves it. The `shared-ui/index.ts:176-178` re-export removal is safe (no importer).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25). Recommendation: DO-NOT-USE / DELETION CANDIDATE (superseded by `<falcon-node-details-section>`; 0 consumers; name collision with 2 app twins). 11 inputs / 5 outputs / 2 projection slots documented for completeness. NEW dossier created this pass; primary action = G1 deletion (human-approve).
