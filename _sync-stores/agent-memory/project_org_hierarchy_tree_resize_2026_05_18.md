---
name: Org-hierarchy tree resize (Wave 18, 2026-05-18)
description: 🟢 LANDED 2026-05-18. Widened tree column 272→320px, grew row min-h 36→44px + pad-y 6→8px (token bump propagates to data-table paginator footers too, intentional shared row rhythm), killed page p-3/md:p-5 vertical eat (→ py-1/md:py-2 only), removed pb-1 inside scroll viewport. Build GREEN 92f52569a705cf45/16.93s.
type: project
originSessionId: e1c46531-c7bb-48fc-8235-4fd2aef37824
---
🟢 LANDED 2026-05-18. **6-edit pass** to reclaim ~36-40px vertical + +48px horizontal in the org-hierarchy tree panel. `nx build admin-console` GREEN `92f52569a705cf45`/16.93s.

**Why:** User reported tree felt cramped, with a visible red empty strip at the bottom of the green-teal `<aside>` panel below the last visible item.

**How to apply:** For any future "tree feels small / row-rhythm too tight / wasted bottom space" requests on org-hierarchy or any other page using these tokens, the 6 levers are:

1. **Panel width** → `apps/host-shell/.../organization-hierarchy-tree.component.ts:86` host class `w-[320px]` (was `w-[272px]`)
2. **Row min-height** → `libs/falcon-theme/src/falcon-tailwind-tokens.css:258` `--spacing-row-h: 2.75rem` (was 2.25rem)
3. **Row vertical pad** → `libs/falcon-theme/src/falcon-tailwind-tokens.css:260` `--spacing-row-pad-y: 0.5rem` (was 0.375rem)
4. **Studio registry mirror** → `libs/falcon-theme/src/tokens.ts:419,421` (must move in lock-step with CSS SSOT)
5. **Page outer padding** → `apps/admin-console/.../org-hierarchy-page-menu.component.html:24` `<section class="... px-3 md:px-5 py-1 md:py-2 ..."` (was `p-3 md:p-5`) — horizontal margins preserved, vertical eat killed
6. **Inner scroll bottom pad** → `libs/falcon/.../falcon-tree-panel.component.html:91` `pb-0` (was `pb-1`)

**Critical cross-reference call-out:** `libs/falcon-ui-tokens/src/components/data-table.tokens.css:74` reads `--falcon-data-table-paginator-min-height: var(--spacing-row-h, 2.25rem)`. Bumping `--spacing-row-h` is a **deliberate platform-wide row-rhythm change** — it ALSO grows every data-table paginator footer in lock-step (tree row + paginator footer share one rhythm token). User accepted this side-effect as "recommended" / consistent 44px row rhythm across tree + paginators is the unified design choice. To decouple in the future: revert the token + use `min-h-11` directly on the `.client-row` div in `falcon-tree-node.component.html:8` instead of `min-h-row-h`.

**Doctrine confirmed:** (1) tokens at theme layer are SSOT — never hardcode per-component when a named theme var exists; (2) `<aside>` already had `overflow-hidden + h-full + rounded-[14px]` — bottom "red strip" was page-level `<section>` padding, NOT the aside's own padding; (3) cross-token references (`--falcon-data-table-paginator-min-height` reading `--spacing-row-h`) are intentional platform-rhythm signals — must flag side-effects when bumping such tokens; (4) Studio registry (`tokens.ts`) must stay in lock-step with CSS SSOT (`falcon-tailwind-tokens.css`) — drift breaks the in-app Studio designer.

Trigger: `org hierarchy tree bigger` / `tree panel width 320` / `--spacing-row-h 2.75rem` / `wave 18 tree resize` / `kill red strip bottom hierarchy page`.
