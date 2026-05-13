# falcon-organization-hierarchy-tree-tw — GAPS & UPGRADES

## Missing capabilities

### NO Shadow DOM companion

- This is the ONLY component in the Falcon library that ships Light DOM ONLY. Every other dual-render component has both `falcon-X` (Shadow) and `falcon-X-tw` (Light). **P1 — ship a paired `<falcon-organization-hierarchy-tree>` Shadow DOM variant for visual isolation and brand-bubble style encapsulation.**
- Without a Shadow companion, the `client-logo bank-{x}` brand class names depend on consumer CSS leakage — fragile.

### NO Angular wrapper

- Every other Falcon UI component has a `<falcon-angular-X>` wrapper for object-prop reflection + event bridging + CVA where applicable. This one does NOT — Angular consumers reach the Stencil tag directly and must manage object props via `@ViewChild`. **P1 — ship `FalconAngularOrganizationHierarchyTreeComponent`** matching the standard wrapper pattern.

### No tag-name parity

- Existing tag `falcon-organization-hierarchy-tree-tw` violates the convention that the canonical tag (Shadow) is `falcon-X` and the Light variant is `falcon-X-tw`. Here only `-tw` ships. **P2 — when the Shadow variant lands (FOHT-01), the Light tag stays `-tw` and a new canonical `falcon-organization-hierarchy-tree` Shadow tag is added.**

### Brand registry is class-name-driven

- `node.brand: string` resolves to `client-logo bank-{value}` CSS classes. New brands require consumer-side CSS additions. **P2 — promote brand styling into tokens or a typed brand registry.**

### No production adoption verified

- Grep across `apps/admin-console/.../organization-hierarchy/` and `apps/management-console/.../organization-hierarchy-page/` did NOT find any usage of `falcon-organization-hierarchy-tree-tw`. **The current production org-hierarchy pages must use a different implementation.** This is either a future-rollout component or a regression — needs investigation.

### Single ctx menu instance

- Component renders ONE floating ctx menu and re-anchors it per click. If the consumer expects multiple open menus simultaneously, it doesn't work. (Probably not a requirement — but document.)

### Companion `<style>` block uses `!important`

- Lines 151, 155, 156 (in the inline-style template literal) use `!important` to override Tailwind utility specificity for menu-button bg/color. **P3 — investigate if Tailwind layer order alone is sufficient.**

### Sticky menu button transition

- The `position: sticky; inset-inline-end:` reveal pattern is unique. May not work in all browsers (specifically `position:sticky` inside scrollable parents with `overflow:hidden` parents). **P3 — runtime test across Chrome / Safari / Firefox / Edge.**

### A11y

- Aria tree roles + level/posinset/setsize all implemented in source (not fully read but visible per source patterns).
- Keyboard nav verified in the unread portion of the source.

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
| FOHT-05 | Investigate production adoption (where is the current admin org-hierarchy panel coming from?) | **P1** |
| FOHT-06 | Remove `!important` from companion style block | **P3** |

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
