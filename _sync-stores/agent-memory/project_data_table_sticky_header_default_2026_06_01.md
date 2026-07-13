---
name: project-data-table-sticky-header-default-2026-06-01
description: "Falcon data-table header is now sticky BY DEFAULT (all 3 consoles) via the shared falcon-angular-data-table wrapper defaulting scrollable=true + a tunable 70vh max-height token. FE-only, no Stencil change, no commits."
metadata: 
  node_type: memory
  type: project
  originSessionId: ecdebd15-b9cd-4438-be83-c728178f65c6
---

Made the data-table header **sticky by default** across the whole platform (user: "click the 15th row, scroll, header must stay sticky" + "make it the default"). 🟢 RUNTIME computed-style VERIFIED on live :4200, 🟡 pixel scroll-screenshot pending auth, NO COMMITS, branch `polishing-v0.4`, 2026-06-01.

**Root cause (NOT a missing feature):** every `<th>` was ALREADY `position:sticky;top:0` (`[CODE] table-tailwind-classes.ts:50` `falconTableHeaderCellClasses`). It never engaged because the table's own container is `overflow-x-auto` → CSS coerces `overflow-y` to `auto` = a scroll container, but with **no max-height** it hugs the content, so the sticky `<th>` has zero scroll range and the whole table scrolls away inside the app-shell `.content` scroller (`[CODE] host-shell layout.component.html:15` `flex-1 min-h-0 overflow-y-auto`). The component already supported the fix via `scrollable` + `scrollHeight` (`[CODE] falcon-table-tw.tsx:1294-1297` sets container `max-height` + `overflow-y:auto`; `theadClass` :1322 adds the sticky-thead shadow). It was just defaulted OFF.

**Fix (2 files, FE-only):**
1. `[CODE] libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts ~L247`: `@Input() scrollable` `false`→`true`; `@Input() scrollHeight?` → `scrollHeight: string = 'var(--falcon-data-table-default-scroll-height, 70vh)'`.
2. `[CODE] libs/falcon-ui-tokens/src/components/data-table.tokens.css` CONTAINER block: added `--falcon-data-table-default-scroll-height: 70vh;`.

**Why this layer / why safe:**
- The wrapper forwards `[attr.scrollable]`/`[attr.scroll-height]` to the existing Stencil `<falcon-table-tw>` (`falcon-data-table.component.html:21-22`) → **only the Angular wrapper TS changed, Stencil dist UNTOUCHED** (no rebuild; `@falcon/ui-core/angular` is source-aliased; the live `nx serve host-shell` picked it up immediately).
- **Footer/paginator is a SIBLING OUTSIDE the scroll container** (`<falcon-angular-custom-table-footer>`; default `showCustomFooter=true` → Stencil `[attr.paginated]=null`) → the max-height clips ONLY the table body; the footer stays pinned below. No footer-clip regression.
- Short tables (content < cap) never overflow → no scrollbar, **zero visual change**. Only long tables (> 70vh) get the inner scroll + pinned header.
- No feature page uses the sibling `<falcon-angular-table>` wrapper — only `falcon-angular-data-table` (16 consumer files / 3 consoles, incl. service-pricing). One wrapper default covers all.
- No spec asserted the old `scrollable=false`. `60vh`/`calc(100vh-80px)` caps already used in `dialog.tokens.css` → `70vh` is convention-consistent.

**How to apply / knobs:**
- Opt OUT per table: `[scrollable]="false"`.
- Tune the cap platform-wide: edit the token; per-table: `style="--falcon-data-table-default-scroll-height: 50vh"` or `[scrollHeight]="'420px'"`.
- `[scrollHeight]="'flex'"` → `max-height:100%` (fill a bounded-height parent instead of the viewport cap).

**HARD RULE:** sticky-header is now a DEFAULT, not per-page wiring — never re-add per-page `[scrollable]="true"`; if a table must NOT scroll internally, set `[scrollable]="false"` explicitly. CSS reality: header-sticky-during-page-scroll + horizontal-scroll are mutually exclusive on the same element (the container needs `overflow-x:auto` for wide tables), so the inner-scroll-region pattern is the only robust mechanism — do NOT try to make the page itself keep the header pinned.

**Verification evidence:** live host-shell :4200, auth-free `/#/falcon-ui-showcase`, real `falcon-angular-data-table`: `data-scrollable='true'`, container `max-height=913.733px` (=70vh), `overflow-y='auto'`, `<th> position='sticky' top='0px'`. App boots clean (login renders, no error overlay). The showcase renders the table inside a SCALED preview card → `getBoundingClientRect` deltas there are garbage (-4242px artifact); a faithful visual scroll needs an AUTHENTICATED full-page table.

**Env note:** admin :4204 / mgmt :4301 are STALE static remotes (http-server) and will NOT reflect FE-source changes until rebuilt; do NOT `nx build` while `nx serve host-shell` is live (corrupts the static remotes — prior incident). Related [[reference_504_admin_console_mf_duplicate_servers_2026_05_31]].

## Follow-up (2026-06-01): Hierarchy page parent-scroll fix
The global `70vh` cap is viewport-relative and does NOT account for per-page chrome. On the **Org Hierarchy page** the Users table sits INSIDE the page's own bounded scroll region (`[CODE] org-hierarchy-page-menu.component.html:274` `flex-1 min-h-0 overflow-auto`; the chart sibling fills it at `h-[calc(100vh-220px)]` :278) ABOVE a ~52px "Users" title bar (:301) and a 52px custom footer (`--falcon-table-row-height`). `70vh + ~106px chrome` exceeded that region by a few px → small **parent** scroll ("landing on padding"). **Fix (template-only, admin + mgmt page-menu, ~L314):** override `[scrollHeight]="'calc(100vh - 340px)'"` on the users-list `<falcon-angular-data-table>` — adopts the page's own `calc(100vh-NNN)` budget (panel = cap + title52 + footer52 + border2 = `100vh-234` < chart budget `100vh-220` → fits with ~14px headroom on all viewport heights; sticky header preserved). Global 70vh default UNCHANGED (safety cap for simple pages). **HTML comments can't go between attributes** in an Angular tag → the explainer sits BEFORE the tag. **Lesson:** a fixed viewport-fraction cap will cause small parent overflow on ANY bounded-layout page with chrome (templates/contact-groups likely affected too) → scope such tables to the page's height budget, or (better, future) make `[scrollHeight]="'flex'"`/fill actually work by teaching the wrapper to be a flex column with `<falcon-table-tw>` `flex:1` (blocked today: wrapper host is `display:block`, so `max-height:100%` can't resolve). **Open:** comm/apps tabs render host-shell `<app-service-pricing>` (shared with standalone /comm-mgmt + /marketplace) → same overflow likely, but needs a context-aware `[scrollHeight]` @Input, NOT a blind override. NOT runtime-verified (admin/mgmt stale remotes + auth).
