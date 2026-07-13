# falcon-node-details-section — DECISION

## Brain SK final recommendation

**STATUS: READY / PREFERRED / SHARED. Use for every node-identity header in new Angular code.** It is the LIVE platform node-header (26 sites) and the supersessor of the deprecated `<falcon-org-node-header>`.

## Use this component for

- Any "selected node / current entity" header: `[avatar] name … [actions]`.
- Headers whose action buttons differ by mode (view / edit / default) — project the right buttons via `<ng-template falconNodeDetailsActions>`, gated by the parent's PES/mode signals.
- Headers that need a brand-aware or custom avatar — project `<ng-template falconNodeDetailsAvatar>` (e.g. the shared `<app-org-node-avatar>`).
- Above data tables on node-scoped feature pages (Comm Channels, Marketplace Applications), within Templates and Wallet workspaces, and across all org-hierarchy tabs.

## Avoid this component for

- Read-only label/value details grids → `<falcon-info-card>` (B25).
- Page-level loading placeholders → `<falcon-page-skeleton>` (B26).
- A header with a built-in back-arrow + fixed buttons + inlined brand → that was `<falcon-org-node-header>` (B25), now a deletion candidate; use THIS component + project your own actions instead.
- Anything needing editable identity fields inline — this is presentational.

## Preferred variant / render path

**Single render path** — pure-Angular component, no `useTailwind` toggle, no Shadow/`-tw` choice (those are dual-render-Stencil concepts and are N/A here). Always project actions via the `falconNodeDetailsActions` directive and (when needed) a custom avatar via `falconNodeDetailsAvatar`.

## Required upgrades before wider use

None block adoption. The component is production-quality and already the platform default. The most actionable items are **G4** (fix/delete the stale `border-b` comment + decide divider ownership) and **G5** (dark-mode variants); **G3** (unify avatar-circle size) is a small visual-consistency fix.

## Relationship to other components

- **Supersedes:** `<falcon-org-node-header>` + `<app-org-node-header>` (B25 — same purpose, 0 consumers, deletion candidates).
- **Projects:** the host-shell shared `<app-org-node-avatar>` (brand-aware) into its avatar slot; `<falcon-angular-button>` into its actions slot.
- **Sibling shared-ui:** `<falcon-info-card>` (details grid), `<falcon-page-skeleton>` (loading), `<falcon-view-toggle>` (view switcher) — all single-render pure-Angular.
- **Owns:** two trivial structural directives (`FalconNodeDetailsActionsDirective`, `FalconNodeDetailsAvatarDirective`) — `TemplateRef` markers only.

## Exact rule for future implementation tasks

1. **Node-identity header?** Use `<falcon-node-details-section [label]="…" [imageUrl]="…">`.
2. **Custom/brand avatar?** Project `<ng-template falconNodeDetailsAvatar>` (it overrides `imageUrl`).
3. **Action buttons?** Project `<ng-template falconNodeDetailsActions>` with `<falcon-angular-button>`s; gate them with `@if` on the parent's PES/mode signals — never bake actions into the strip.
4. **Need a divider under the strip?** Add `border-b border-falcon-neutral-150` on the host `class=` (the component does not draw one — GAP G4).
5. **Dark mode?** Currently unsupported on the strip surface (GAP G5) — accept it or raise the gap; do not fork.
6. **Never** use `<falcon-org-node-header>` / `<app-org-node-header>` in new code.

---

## Dynamic capability assessment

### 1. What is static today?

- The header layout (`[avatar] label … [actions]`), padding (`px-5 pt-5 pb-5`), label typography (`text-sm font-semibold text-falcon-neutral-925`).
- The initials-chip colour (`bg-falcon-teal-700`) + size (36px) and the image-circle size (28px) — fixed and **mismatched** (G3).
- Single fixed size — no `size`/`variant` axis (G2).
- No dark-mode variants (G5).

### 2. What is already dynamic through inputs/outputs?

- `[CODE]` **3 signal inputs:** `label` (`input.required`), `imageUrl`, `imageAlt`.
- `[CODE]` **0 outputs** — interactivity is delegated to the projected action buttons (which own their own events).
- `[CODE]` 2 `computed()` (`initial`, `effectiveAlt`) derive automatically from `label`/`imageAlt`.

### 3. What is already dynamic through slots / ng-template?

- `[CODE]` **`<ng-template falconNodeDetailsActions>`** — fully dynamic right-side content (the parent decides which buttons render).
- `[CODE]` **`<ng-template falconNodeDetailsAvatar>`** — fully dynamic left-side avatar (overrides the built-in image/initials), added Wave 22 for brand-SVG support.
- This **slot-driven design is the component's core strength** — it is what makes it reusable where `<falcon-org-node-header>` (with baked-in actions) was not.

### 4. What is dynamic through token/theme overrides?

- **Nothing per-instance** — no token contract (G6). Colours are baked Tailwind utilities. Theme palette changes ripple via the Tailwind→CSS-var mapping, but a single instance cannot be recoloured without editing the shared template.

### 5. What is dynamic through Tailwind classes?

- Host `class=` flows to the component host (`block w-full` base, ts:34) — usable for layout + a `border-b` divider.
- No `wrapperClass`/`headerClass` input to reach internal elements (G6).

### 6. What is missing to make this component reusable across pages?

- It is **already broadly reused** (26 sites) — the slot design covers most needs.
- Missing for edge cases: a `size` axis (G2), dark mode (G5), unified avatar size (G3), an optional `headerClass`/divider (G4/G6).

### 7. What capability should be added to shared component (not page hack)?

- Dark-mode variants (G5) and a consistent avatar size (G3) — both belong in the shared template.
- A decision + fix on the divider (G4) — either the strip draws it or the docs say the consumer must.

### 8. What flags / options / templates / slots would make it better?

- `@Input() size` (G2); `@Input() headerClass` (G6/divider); `dark:` variants (G5).
- A 3rd optional slot for a subtitle/secondary line under the name (nice-to-have).

### 9. What is the safest upgrade path?

1. **Phase A (doc, zero risk):** fix/delete the stale `border-b` comment (G4); add the component spec (G1).
2. **Phase B (additive visual):** unify avatar-circle size (G3); add `dark:` variants (G5). Both are additive and low-risk (no API change).
3. **Phase C (additive API):** add `size` + `headerClass` inputs (G2/G6) — additive, no consumer break.

All phases are additive — no consumer break. The slot API stays stable.

### 10. What is risky to change because other pages depend on it?

- `[CODE]` The **two directive selectors** (`falconNodeDetailsActions` / `falconNodeDetailsAvatar`) — 15 consumer templates project through them; renaming would break every node header on the platform.
- `[CODE]` The **avatar precedence** (template > imageUrl > initials) — org-hierarchy relies on the projected `<app-org-node-avatar>` winning to show the Falcon brand mark; reordering would regress the brand display.
- `[CODE]` `label` being **required** — making it optional could let blank-name headers ship.
- The fixed strip surface — flipping it to a token contract (G6) must keep the same resolved colours or 26 sites change appearance at once.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26, NEW dossier). Recommendation READY/PREFERRED/SHARED (supersessor of `<falcon-org-node-header>`). Counts: 3 signal inputs, 0 outputs, 2 `contentChild` slots, 2 `computed`, no CVA, no Stencil layer. The slot-driven design + avatar precedence + 26-site adoption all re-confirmed in live source.
