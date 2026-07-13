---
name: project_contracts_wizard_deepdive_borderless_2026_06_06
description: "Admin Add-Contract wizard polish — borderless+full-width Rate Card & Contract Details tables, fixed broken SAR i18n key, added per-row expandable deep-dive nested table (placeholder) to the Contract Details matrix. Build+691 tests green, no commits."
metadata: 
  node_type: memory
  type: project
  originSessionId: 6f2ae848-a128-43db-a8df-d3409fc02670
---

Admin **Add-Contract wizard** Rate Card (step 2) + Contract Details (step 3) polish (2026-06-06, claude). Repo `C:/Falcon/Falcon/falcon-web-platform-ui`, branch polishing-v0.4, **NO COMMITS**. Scope = **admin console ONLY** (view/edit panes inherit via the shared `app-contracts-rate-card-section` / `app-contracts-contract-details-section` components; mgmt untouched per user choice).

**User ask (4 parts, voice-transcribed) + decisions (AskUserQuestion):** (1) make the step-2 and step-3 **table widths the same**; (2) step-3 Contract Details has a border around all content → **remove the border**; (3) **"values underlined → under the line a table to deep dive"** = NEW feature, not in any React SoT and NO backend breakdown data exists (matrix cell = single `ratePerUnit`); (4) best-practice + brain structure. User chose: deep-dive = **"Expand row → nested table"** (placeholder until backend), scope = **admin only**, borders = **"Unify: borderless + full-width"** for BOTH step tables.

**Screenshot mapping (CONFIRMED via smoking-gun):** screenshots 2 & 4 = CURRENT Angular (screenshot 2 literally rendered `contractsCostManagement.contractDetails.sar`, which only the current code produces); screenshots 1 & 3 = the React design reference (Falcon-Taha2 `contracts-wizard.jsx` — 5-row rate card + pagination + ﷼ icon; bordered matrix). The React SoT step-3 actually HAS a border + pagination; the user OVERRODE that (no border, no pagination in Angular).

**BROKEN KEY (real bug, fixed):** `rate-card-step.component.html` editable price input bound the trailing "SAR" to `contractsCostManagement.contractDetails.sar` — that path has ONLY a `rows{}` child (en.json:537), no `sar` → rendered the raw key string. (The correct key is `contractsCostManagement.wizard.contractDetails.sar`=“SAR”, en.json:589, used fine by contract-details-step.) FIX = dropped the text suffix entirely, switched `[iconRight]`→`[iconLeft]` + a leading `<falcon-angular-saudi-riyal-icon [size]="13">` (matches the SoT left-﷼ + the rate-card view mode). NOTE: the prior reskin fixed only the MGMT instance of this key; the ADMIN wizard rate-card still had it.

**Changes (6 files, admin + shared i18n):**
1. `rate-card-step.component.html` — removed outer card chrome (`rounded-card border border-falcon-neutral-200 bg-falcon-neutral-0`→none); `min-w-full`→`w-full`; broken-key suffix → left riyal icon.
2. `contract-details-step.component.html` — removed outer card border (line 12 → `w-full`); header control row `px-4.5 py-4.5`→`pb-4.5`; matrix `min-w-contracts-matrix-min`→**`w-full table-fixed`** (all 11 destination cols visible, NO h-scroll), dropped `sticky start-0 z-10` first col, first th/`w-40` (matches rate-card first col → equal widths). Priority/Type cell → **underlined expand TOGGLE** (`<button>` + rotating `<falcon-svg-icon [name]="chevronIcon">` chevron + dotted-underline label). Added **`@if (isExpanded(row.priority))` nested detail row** (`colspan = destinationHeaders().length + 1`) with an inner table (Destination · Rate ﷼) of the row's REAL per-destination cells + a muted "richer breakdown pending backend" note.
3. `contract-details-step.component.ts` — +`signal` import; +`FalconAngularSaudiRiyalIconComponent` (ui-core), +`SvgIconComponent`+`SVG_ICON_NAMES` (@falcon) to imports; `chevronIcon = SVG_ICON_NAMES.CHEVRON_DOWN`; `expandedPriorities = signal<ReadonlySet<string>>` + `isExpanded()` + `toggleExpanded()` (immutable Set rebuild = zoneless-safe; independent of `editable`).
4/5. `libs/falcon/src/language/i18n/{en,ar}.json` — additive `contractsCostManagement.wizard.contractDetails.breakdown` {title,destination,rate,note} (En+Ar). Only consumed by the new admin template; mgmt unaffected.
6. NEW `apps/admin-console/tests/contracts/contract-matrix-deepdive.spec.ts` (5 tests, mirrors the manual-`new`-in-injection-context pattern from `_support.ts`: starts-collapsed, toggle expand/collapse, rows independent, works read-only, chevron name).

**DEEP-DIVE IS A PLACEHOLDER (durable):** the nested table currently re-presents the row's existing per-destination rates (NO invented data) because the model has no breakdown field. The expand/collapse shell + caption are the real deliverable; when the backend exposes tiers/surcharges/effective-dates, populate THIS table. The underline affordance sits on the ROW LABEL (the toggle), not the value inputs (editable cells can't be sensibly underlined). ⚠️ **User must confirm the real deep-dive columns/data.**

**Chevron icon:** `<falcon-svg-icon [name]="SVG_ICON_NAMES.CHEVRON_DOWN" [size]>` — `CHEVRON_DOWN`='chevron-down' has real path data (svg-icon.registry.ts:256). `SvgIconComponent` is a PURE-Angular inline-SVG component (no Stencil registration needed). Collapsed = `[class.-rotate-90]`, expanded = down.

**VERIFIED:** `nx build admin-console --configuration=development --skip-nx-cache` EXIT 0 (strictTemplates clean; only pre-existing warnings — falcon-data-table NG8102 + unused-index tsconfig notes). `nx test admin-console` → **31 files / 691 passed** (was 686 + my 5 deep-dive tests). ⚠️ LIVE pixel verify (expand a row → nested table; ﷼ icon on rate-card; equal widths; no borders) pending sys-admin LOGIN — assistant cannot type passwords (credential policy). ⚠️ Working tree also carries the PRIOR (completed-but-uncommitted) digit-cap task's changes (addons/models/services/mgmt/falcon-input-number-tw); MY footprint = exactly the 6 files above. No `nx serve` was running (built safely); user restarts `npm start`.

Related [[project_contracts_value_digitcap_enforce_2026_06_06]] · [[project_contracts_cost_reskin_2026_06_04]] · [[reference_fe_structure_standard_angular21_2026_06_02]] · [[reference_static_remote_rebuild_after_app_edit_2026_06_04]].
