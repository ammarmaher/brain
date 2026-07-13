---
name: basic-app-shared-tailwind-only-rework-2026-07-13
description: "apps/basic-app/src/app/shared reworked 2026-07-13 to strict convention: one .ts + one .html per component, ZERO .scss/styles:[], Falcon components + Falcon Tailwind token utilities only; status pill → falcon-angular-status-badge; falcon web-component token overrides via [&_falcon-*-tw]:[--falcon-*] Tailwind arbitrary-property variants; verified render standalone"
metadata: 
  node_type: memory
  type: project
  originSessionId: 14fc28fa-5c64-42b3-95c0-27f424982061
---

**Rework 2026-07-13 (uncommitted, polishing-v0.4).** User directive: the shared components "should follow
our structuring with zero CSS or rely our Falcon components and our Falcon tokens … one HTML and one TS …
zero native HTML, zero CSS or SCSS … just Falcon Tailwind." Brain SK component-layout.md
(`C:\Falcon\Brain SK\legacy\v7-import\chains\frontend\component-layout.md`) = the structural contract.

**What was done to every component under `apps/basic-app/src/app/shared`:**
- **One `.ts` + one `.html` per component** — extracted ALL inline `template:` into external `.html`.
- **ZERO `.scss`, ZERO `styles:[]`/`styleUrl`** — deleted both component SCSS files (message-panel, compose)
  and every leaf `styles:[]` block. Audit: 0 scss · 0 styleUrl/styles · 0 inline templates · 8 components/8 html.
- **Styling = Falcon Tailwind token utilities only** in the `.html`: `bg-falcon-neutral-0` (real white token;
  `--color-falcon-white` does NOT exist — was silently falling back to #fff, now `neutral-0` = theme-aware),
  `text-falcon-neutral-500/900`, `border-falcon-neutral-200`, `bg/text/border-falcon-teal-700/50/200`,
  amber/red scales; arbitrary geometry `px-[15px] rounded-[14px] text-[13px]`; alpha via
  `bg-[var(--color-falcon-teal-alpha-08)]`.
- **Falcon components for controls:** status pill → `<falcon-angular-status-badge [severity]>` (status→severity
  map in BASIC_APP_STATUS_META: completed=active · in_progress/partial/scheduled=pending · failed=expired ·
  canceled=inactive · deleted=disabled — the SoT's 7 palettes collapse onto the platform's 4 severity buckets).
  Dropdowns/buttons/tabs/data-table/date-picker/switch/input-number/search-input/saudi-riyal already Falcon.
- **Falcon web-component token overrides WITHOUT a stylesheet** = Tailwind arbitrary-property descendant
  variants on the element (management-console precedent): e.g. on `<falcon-angular-data-table>`
  `[&_falcon-table-tw]:[--falcon-table-header-bg:var(--color-falcon-neutral-75)]
  [&_falcon-table-tw]:[--falcon-table-row-height:71px]` (+ container border 0); on `<falcon-angular-tabs>`
  `[&_falcon-tabs-tw]:[--falcon-tabs-panel-padding-x:0px]`. Verified: Tailwind GENERATES these rules.
- **Toggle/parent-state styling** without JS classes: class interpolation `{{ cond ? 'onA onB' : 'offA offB' }}`
  and `group` + `group-[.on]:` / `group-[.done]:` / `group-[.is-mapping]:` variants (literal state class added
  conditionally on the parent).
- **Structure:** moved the last 2 inline domain interfaces out of `.component.ts` → `transaction.models.ts`
  (BasicAppComposeRequest, BasicAppRecipientItem); pages import them from `../../shared/models`.
- **WhatsApp phone preview** = external-UI mockup: WhatsApp brand colors stay literal Tailwind arbitrary
  values (`bg-[#f2ede4]` etc.); added `basic-app-phone-preview.component` to gate-13 ALLOWLIST (same category
  as the platform's own whatsapp-preview.component).
- **Kept as Tailwind-classed native elements** (documented exceptions — no clean 1:1 Falcon component, and the
  SoT builds them bespoke): the two compact in-cell form tables (manual recipients + column mapping `<input>`s),
  the bespoke popovers (group-picker/date-range/recipients "+N"), the seg/retry toggle chips, and the
  hand-rolled send-confirm overlay (falcon-dialog wipes projected children under zoneless CD —
  GAP-FALCON-UI-CORE-DRAWER-DEFAULT-SLOT-001).

**Gates:** nx build basic-app + admin-console + management-console GREEN · lint GREEN (added
falcon-angular-switch/checkbox to eslint controlComponents) · vitest 7/7.

**Live render verified** (standalone: served fresh `dist/apps/basic-app` on a clean port + `:4303`): light mode →
white tab bar, light header, 10 `<falcon-angular-status-badge>` pills (Completed/In Progress…), full grid,
Tailwind classes applied, override rules generated, `bg-falcon-neutral-0` on host. Screenshot captured.

**ENVIRONMENTAL BLOCKER (not the rework):** the host-shell (:4200) currently returns "Access Check Failed" for
ALL admin routes — including `comm-channels/voice-service` which this work never touched — with PES
`/pes/authorize/resources` returning 200 and the login session repeatedly dropping. So the in-shell view of
basic-app can't render right now due to a local auth/PES/session fault, independent of the code. Recovery:
restart the local identity/PES stack + fresh login (the standalone :4303 render proves the code is correct).

**FOLLOW-UP 2026-07-13 (uncommitted) — realistic iPhone frame + pinned footer + taller cards.** User: the
WhatsApp preview was "just a rectangle" — must look like the SoT phone; also "footer at the [bottom]" and
"increase the height for each border". Fixes (Tailwind-only, no CSS added):
- **Phone = SoT `iphone-frame.svg` inlined** in `basic-app-phone-preview.component.html` (Dynamic Island +
  4 side buttons + edge-gradient frame with a masked screen cut-out). Screen sits BEHIND the frame at
  `inset-x-[4.2%] inset-y-[2.1%]` (matches the SVG hole), `bg-[#efe7df]` + dot-pattern body + `#d9e7e4` Today
  chip. Height-driven like the SoT preview card: `h-[calc(100vh-424px)] min-h-[360px] max-h-[680px]
  aspect-[430/880] w-auto`. The old hand-drawn `border-[10px] + ::before` rectangle is gone.
- **Footer pinned to bottom + cards fill height** in `basic-app-compose.component.html`: the inner area went
  from `flex-1 overflow-y-auto` (which left a big empty scroll gap under the summary) to
  `flex min-h-0 flex-1 flex-col`; the 3-col grid is now `min-h-0 flex-1 items-stretch` (grows, cards stretch),
  the 3 step cards dropped their `max-h-[calc(100vh-296px)]` cap (→ `h-full min-h-0`, taller borders), and the
  dark summary bar got `shrink-0` (pinned to the bottom). Each card scrolls internally.
- **Verified live** (standalone :4312, light mode, normal-user → Send Whatsapp opens compose): SVG frame
  present with Dynamic Island + 4 side buttons, phone ratio 0.489 (=430/880), summary has `shrink-0` with no
  empty scroll gap (41px = container padding), grid `flex-1`, `styleTagsWithBsa: 0`. Build + lint + gate-13
  (0 basic-app violations) all green. Matches the user's SoT screenshot. To drive the role dropdown from JS:
  set `falcon-dropdown-tw.value` then dispatch `new CustomEvent('falcon-change',{detail:{value},bubbles,composed})`;
  the falcon button fires on a dispatched `falcon-click` / inner `<button>.click()`.

**FOLLOW-UP 2026-07-13 #2 (uncommitted) — empty-mapping red state + custom-spacing-scale size fixes.**
User: unmapped column dropdowns should have a RED background; the step-number circle must match the SoT
(inspected `.bsa-step-num` = 28×28). Both with Falcon/Tailwind tokens, best practice.
- **Empty mapping dropdown → Falcon native error state.** Added `mapColumnState(gid,col): 'default'|'error'`
  to compose.ts (SoT `bsa-mapx-assign.is-invalid` = `!fieldOfColumn(gid,col) && mappedCount(gid) < neededCount()`)
  and bound `[state]="mapColumnState(gid,c)"` on the column-mapping `<falcon-angular-dropdown>`. The Falcon
  dropdown's built-in `state="error"` paints bg `--falcon-dropdown-bg-error` (= `--color-falcon-red-50` = **#fef5f5**,
  ≈ SoT #fff6f5) + red border (**#dc2626**) + red placeholder — no manual override, all design-system tokens.
  Verified live: 5 dropdowns `state=error`, computed bg `rgb(254,245,245)`, border `rgb(220,38,38)`.
- **⚠ ROOT-CAUSE DISCOVERY — this app's Tailwind theme uses a CUSTOM (inflated) spacing scale.** Numbered
  spacing utilities are NOT standard px: `--spacing-7 = 2.5rem (40px)` (std 28), `--spacing-10 = 3.75rem (60px)`
  (std 40), `--spacing-6 = 2rem (32px)` (std 24), `--spacing-12 = 5rem (80px)` (std 48). So `h-7 w-7` rendered
  the step circle at **40px** not 28. FIX = explicit arbitrary px (immune to the scale), matched to the SoT:
  step circles `h-7 w-7`→`h-[28px] w-[28px]` (SoT .bsa-step-num 28, ×4); summary-bar icons `h-10 w-10`→
  `h-[40px] w-[40px]` (SoT .bsa-sum-ic 40, ×3); send-confirm icon `h-12 w-12`→`h-[48px] w-[48px]` (was 80);
  recipients "+N" pill `h-6 w-6 min-w-6`→`h-[24px] w-[24px] min-w-[24px]` (SoT .bsa-more-tag 24). Verified live:
  circles 28×28, summary icons 40×40. **LESSON: in basic-app, use arbitrary px for any fixed-size box — numbered
  `h-N/w-N` are ~1.4–1.6× larger than standard Tailwind; SoT `.bsa-*` sizes are fixed px.** Other numbered
  gap/padding utilities in the compose are likewise inflated (not yet swept — offered as a follow-up).
- Gates: build + lint + gate-13 (0 basic-app violations) GREEN; still 0 scss / 0 styles. Live-verified standalone
  :4313 light mode (normal-user Send → template wt1 + Contact Group 1 → mapping card).

Related: [[basic-app-rebuild-mf-remote-sot-13072026]].
