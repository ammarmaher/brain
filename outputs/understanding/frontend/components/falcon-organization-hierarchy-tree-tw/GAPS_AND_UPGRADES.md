# falcon-organization-hierarchy-tree-tw — GAPS & UPGRADES

## Missing capabilities

### NO Shadow DOM companion

- This is the ONLY component in the Falcon library that ships Light DOM ONLY. Every other dual-render component has both `falcon-X` (Shadow) and `falcon-X-tw` (Light). **P1 — ship a paired `<falcon-organization-hierarchy-tree>` Shadow DOM variant for visual isolation and brand-bubble style encapsulation.**
- Without a Shadow companion, the `client-logo bank-{x}` brand class names depend on consumer CSS leakage — fragile.

### NO Angular wrapper

- Every other Falcon UI component has a `<falcon-angular-X>` wrapper for object-prop reflection + event bridging + CVA where applicable. This one does NOT — Angular consumers reach the Stencil tag directly and must manage object props via `@ViewChild`. **P1 — ship `FalconAngularOrganizationHierarchyTreeComponent`** matching the standard wrapper pattern.

### No tag-name parity

- Existing tag `falcon-organization-hierarchy-tree-tw` violates the convention that the canonical tag (Shadow) is `falcon-X` and the Light variant is `falcon-X-tw`. Here only `-tw` ships. **P2 — when the Shadow variant lands (FOHT-01), the Light tag stays `-tw` and a new canonical `falcon-organization-hierarchy-tree` Shadow tag is added.**

### Brand prop is DECLARED-BUT-UNUSED (latent)

- `[CODE]` `node.brand: string` is documented for `client-logo bank-{x}` classes but the indicator renderer (tsx:718-788) only consumes `iconUrl` → `icon` → `initials` — **`brand` is never applied to any element.** So the prior dossier's "brand class leakage risk" is currently MOOT. **P2 — either wire `node.brand` to a TOKEN-driven brand registry (preferred) or remove the dead prop from the type.**

### No production adoption — RESOLVED as "parallel un-rendered impl" (NOT a regression)

- `[CODE]` Confirmed 2026-06-03: ZERO live render consumers (`Grep <falcon-organization-hierarchy-tree-tw` → only own-source + plan-doc + tokens + a denylist string). This is **NOT a regression** — the live org-hierarchy rail is an intentionally SEPARATE Angular implementation: `<falcon-tree-panel>` (shared-ui) rendered via the host-shell `<app-organization-hierarchy-tree>` PES-gated wrapper (`[CODE]` organization-hierarchy-tree.component.html:24; falcon-tree-panel.component.html:89 renders `<falcon-tree-node>`). The two share the SAME token file (the token selector lists `app-organization-hierarchy-tree`).
- **Decision needed (human):** either (a) ADOPT this Stencil tree (build the Angular wrapper FOHT-02 and migrate the wrapper onto it for cross-framework parity), or (b) DELETE it as superseded-by-`falcon-tree-panel` dead code (like the legacy stepper was). Today it is registered/documented but dead. **This is the single most important triage item for this unit.**

### Single ctx menu instance

- Component renders ONE floating ctx menu and re-anchors it per click. If the consumer expects multiple open menus simultaneously, it doesn't work. (Probably not a requirement — but document.)

### Companion `<style>` block uses `!important`

- Lines 151, 155, 156 (in the inline-style template literal) use `!important` to override Tailwind utility specificity for menu-button bg/color. **P3 — investigate if Tailwind layer order alone is sufficient.**

### Sticky menu button transition

- The `position: sticky; inset-inline-end:` reveal pattern is unique. May not work in all browsers (specifically `position:sticky` inside scrollable parents with `overflow:hidden` parents). **P3 — runtime test across Chrome / Safari / Firefox / Edge.**

### A11y — keyboard nav is a CONFIRMED GAP (P1)

- `[CODE]` ✅ ARIA tree roles fully implemented: `role="tree"` (tsx:979), per-row `role="treeitem"` + `aria-level`/`aria-posinset`/`aria-setsize`/`aria-selected`/`aria-expanded`/`aria-disabled` (tsx:861-868), ctx-menu `role="menu"`/`menuitem` + `aria-haspopup`/`aria-expanded` (tsx:805-806).
- `[CODE]` ❌ **NO roving keyboard navigation.** Rows are `tabIndex={0}` (tsx:862) but there is **ZERO `onKeyDown` handler** in the entire component (grep confirmed). A keyboard user can Tab to a row but cannot Arrow/Enter/Space to expand/select — selection/expansion is mouse-`onClick` only. Only the ctx-menu has Escape (`@Listen('keydown')` tsx:330). **P1 — add roving-tabindex arrow/Home/End/Enter/Space nav (the `falcon-stepper` already does this; mirror that pattern).** This is the most material a11y defect of this unit.

### Tests

- No `.spec.ts`. **P1 — given the complexity (lazy load, ctx menu positioning, hover-path repaint, keyboard nav).**

### Internationalization

- `'Organization hierarchy'` aria-label is set by consumer; no hardcoded English in this component beyond `'Pagination'`-style strings (verify in unread portion). Consumer-driven.

### Tokens / dark mode

- `organization-hierarchy.tokens.css` has 200+ lines of token declarations. Verify there's a `:where(.app-dark, .app-dark *)` block.

## Reusable upgrades needed

| ID | Title | Priority |
|---|---|---|
| FOHT-01 | Ship `<falcon-organization-hierarchy-tree>` Shadow DOM companion | **P1** |
| FOHT-02 | Ship Angular wrapper `<falcon-angular-organization-hierarchy-tree>` | **P1** |
| FOHT-03 | Brand registry tokens (replace `client-logo bank-X` CSS dependency) | **P2** |
| FOHT-04 | Stencil unit tests (lazy, ctx menu, hover-path, keyboard) | **P1** |
| FOHT-05 | DECIDE adopt-vs-delete (live rail = `<falcon-tree-panel>`; this Stencil tree is un-rendered) | **P1** |
| FOHT-06 | Remove `!important` from companion style block | **P3** |
| FOHT-07 | Add roving-tabindex keyboard nav (arrow/Home/End/Enter/Space) — currently absent | **P1** |
| FOHT-08 | Wire or remove the latent `node.brand` prop | **P2** |

## Workarounds available

- Object prop binding: use `@ViewChild` + `el.tree = …` in `ngAfterViewInit`.
- No Angular wrapper: write a thin wrapper per project (admin-console + management-console likely both need one). Better to ship a shared one.

## Visual / interaction risks

- The injected `<style>` block is inserted as a string template — every render. Stencil should de-duplicate, but verify.
- The brand `client-logo bank-X` classes leak from outside the component. Visual regression risk on bg-color / size changes in upstream CSS.

## Fix in shared component vs per-page

- All gaps in shared component.

## Future-proof recommendation

This component needs the most work of any in Agent 2's roster. Recommended Wave to (a) ship the Shadow companion, (b) ship the Angular wrapper, (c) audit production org-hierarchy consumers to plan a migration, (d) move brand styling into tokens.

## Wave 7 Findings (2026-05-17)
**Consumer count: 2 (playground).** Superseded by B21 below (playground removed).

## Deep-Dive Sweep Findings (2026-06-03 — B21)
**Consumer count: 0 live render consumers** (`[CODE]` grep `<falcon-organization-hierarchy-tree-tw`).
- **RECONCILE result:** this is a REGISTERED/DOCUMENTED but UN-RENDERED, Light-DOM-only Stencil tree. The live org-hierarchy rail is `<falcon-tree-panel>` (shared-ui) via `<app-organization-hierarchy-tree>` (host-shell) — a SEPARATE implementation sharing the same token file. NOT a regression; the "production adoption" gap is reclassified as an adopt-vs-delete decision (FOHT-05).
- **A11y drift fixed:** the prior "keyboard nav verified" claim is FALSE — there is NO `onKeyDown` (FOHT-07, P1).
- **Brand drift fixed:** `node.brand` is declared-but-unused, not class-driven (FOHT-08).
- **Dark-mode:** no `.app-dark` bucket in the token file (P2 stands).
- **`node.icon` / `node.type` doc note:** types comment references PrimeIcons but the component just applies `<i class={node.icon}>` — any icon-font class works (Falcon icon font is the house standard).
- No deletion executed this pass (READ-ONLY). The unit is FLAGGED for adopt-or-delete triage. See FINDINGS/B21.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B21) against the full 1207-ln source. Light-DOM-only + no Shadow + no Angular wrapper confirmed; zero live render consumers confirmed; keyboard-nav GAP + latent-`brand` GAP newly documented. Status = un-rendered parallel impl; adopt-vs-delete is the headline triage.
