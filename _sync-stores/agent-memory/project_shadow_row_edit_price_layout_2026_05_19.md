---
name: shadow-row-edit-price-layout-colours-triangle-ordering-spacing
description: "service-pricing shadow-row revamp — per-kind green bg, triangle at column start + nudge tokens, price-type-on-top single triangle, 56px min-height."
metadata: 
  node_type: memory
  type: project
  originSessionId: 6f989bae-9e0e-41db-98a8-1fca39262312
---

🟢 BUILD-GREEN (NOT runtime-tested) 2026-05-19. Waves A–F on the shared `service-pricing-table` shadow rows — drives BOTH admin-console tabs (Apps & Services + CommChannels & Services) via the one consolidated `ServicePricingTableComponent`.

**Why:** User reported the inline edit-price-type / edit-price-value shadow rows mis-rendered (cramped overlap, triangle mis-placed, no per-kind colour). CommChannels ✓ screenshots = the target look. See [[project_edit_price_phase_a_2026_05_19]], [[project_falcon_shadow_row_popover_5_root_causes_2026_05_17]].

**6 files, all `libs/`:**
- `falcon-theme/.../falcon-tailwind-tokens.css` — added `--color-falcon-success-10` (#F3F8F5 light / rgba(22,163,74,.08) dark); fixed `green-50` `;;` typo.
- `falcon-ui-tokens/.../data-table.tokens.css` — 6 new tokens: `--falcon-data-table-shadow-row-bg-{priceType,priceValue}` + `--falcon-data-table-shadow-col-{priceType,priceValue}-pad-{left,right}` (pads default 0px).
- `falcon-ui-core/.../falcon-table-tw.tsx` — (1) shadow `<tr>` bg resolved per `targetColumn`; (2) arrow `left` = column START + pad calc() (was header-centre); (3) `renderShadowRow` gained `shadowIndex`, arrow `<span>` renders only when `shadowIndex===0` → single triangle for stacked shadows.
- `falcon-ui-core/.../falcon-data-table-cell.directive.ts` — `*falconDataTableShadowCol` content `left` = column-left + same pad tokens (input aligns with triangle).
- `falcon/.../service-pricing-table.component.html` — scoped `--falcon-data-table-shadow-row-min-height: 56px` on `<falcon-angular-data-table>`; price-value edit input widened (`min-w-max` wrapper + `w-[280px]` input).
- `falcon/.../service-pricing-table.component.ts` — `shadowRowMap()` sorts price-type-change before price-value-change via new `shadowKindRank()`.

**Design:** everything per-kind keyed off `targetColumn` (priceType/priceValue) — bg colour + arrow/input nudge. Generic Stencil mechanism, specific tokens.

**Wave E (SAR icon) intentionally SKIPPED** — slotted `[iconLeft]` renders fine in the ✓ reference (same component); not touching working code on a guess.

**Builds:** `nx build falcon-ui-core` (35.8s) + `admin-console` (21.3s, hash c7cea456afa3ea3a) + `host-shell` — all GREEN. Only pre-existing warnings (scrollHeight/title reserved-prop; tsconfig unused-file). NOT runtime-tested.

**Committed:** `6d77bbf2` on `polishing-v0.4` — 6 files (+104/-46), NOT pushed. The 8 other working-tree mods (host-shell app files, do-payment popup, loader-inline tokens, regenerated web-types.json) were deliberately left unstaged — not this task's work.

**Follow-up polish (2026-05-19, runtime-feedback round — committed `1c110fa4` on branch `polishing-v0.4-signalr-realtime`, NOT pushed):** `service-pricing-table.component.html` only — (1) Effective Date / date-picker re-anchored to the **priceValue** column via its own `*falconDataTableShadowCol` (split out of the old single priceType `flex gap-8` wrapper) so it aligns under Price Value; (2) view-mode value text `text-base font-bold` (16px/700) → `text-[length:var(--falcon-data-table-cell-font-size)] font-medium` (12.5px/500) to match the parent row cells; (3) shadow rows reduced from ~126px to a consistent ~72px (scoped `--falcon-data-table-shadow-row-min-height:48px` + `--falcon-data-table-shadow-row-padding-y:12px` on `<falcon-angular-data-table>`). admin-console + host-shell builds GREEN.

**Further polish rounds (2026-05-19, bundled into commit `01ff3b14` on `polishing-v0.4-signalr-realtime`, NOT pushed):** (a) edit-mode price-type dropdown + date picker moved into equal-height `h-16 items-center` wrappers; (b) the dropdown's label-to-control gap (`--falcon-dropdown-label-margin-bottom`) is ~5px tighter than the date picker's → added `wrapperClass="gap-[5px] pe-[5px]"` on `<falcon-angular-dropdown>` (Angular wrapper forwards it to the Stencil `<falcon-dropdown-tw>` `wrapperExtraClass` → its `flex flex-col` wrapper), dropping both control boxes onto one row — scoped, no library edit. admin-console + host-shell GREEN.

**Round 5/6 (2026-05-20, bundled into commit `01ff3b14`, NOT pushed):** (a) edit price-value SAR icon — switched from the slotted `[iconLeft]` to the canonical sibling-overlay pattern; the glyph is an absolute `<span>` pinned to `start-[var(--falcon-data-table-cell-padding-x)]`, the SAME token the parent Price Value cell uses for its content inset → the Riyal icon lines up in one column parent-row↔edit-input; the input label is now rendered in-template (so the overlay wraps just the input box). (b) Effective Date date-picker — scoped inline `style` override of `--falcon-date-picker-input-padding-block` + `-padding-block-sm` to `6.5px` (calendar.tokens.css sm default is 4px). admin-console + host-shell GREEN.

**Tunables if runtime needs adjustment:** the 4 pad tokens (0px default) nudge triangle+input L/R; `min-height` 56px and input `w-[280px]` are picks — adjust the values if the live render says otherwise.
