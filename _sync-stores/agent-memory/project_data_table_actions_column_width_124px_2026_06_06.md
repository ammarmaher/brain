---
name: project_data_table_actions_column_width_124px_2026_06_06
description: "falcon-data-table Actions column now a FIXED 124px default (was content-sized in -tw non-sticky), overridable via new [actionsColumnWidth] input."
metadata: 
  node_type: memory
  type: project
  originSessionId: 5d08698f-f38d-4866-b0a8-eded022a7c2f
---

Made the **`<falcon-angular-data-table>` Actions column a FIXED width with a 124px platform default**, per-instance overridable via a NEW `@Input() actionsColumnWidth` (2026-06-06, claude). Branch polishing-v0.4, **NO COMMITS**.

**Root cause** `[CODE]`: the width var `--falcon-data-table-actions-column-width` already existed but the **`-tw` variant (the one actually rendered)** consumed it ONLY in the STICKY branch. The **non-sticky** (default, since `stickyActions=false`) Actions `<th data-action-header>`/`<td data-action-cell>` used `falconTableHeaderCellClasses(...)`/`falconTableCellClasses(...)` with **NO width** → column sized to content. The Shadow variant (`falcon-table.css:342-344`) already applied the var unconditionally (so only `-tw` was wrong). Token default was `4rem`/64px.

**Fix (4 coordinated, best-practice token-driven + reactive input):**
1. `libs/falcon-ui-tokens/src/components/data-table.tokens.css`: `--falcon-data-table-actions-column-width` `4rem` → **`124px`** (single source of truth; raw + wrapper usage both consistent).
2. `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts`: NEW shared `falconTableActionsColumnWidthClasses()` (`w-/min-w/max-w-[var(--falcon-data-table-actions-column-width)]`); the 2 sticky helpers refactored to use it (identical output).
3. `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx`: appended that helper to BOTH non-sticky branches (header ~L1445, cell ~L1568) → parity with sticky + Shadow.
4. Wrapper `falcon-data-table.component.ts`: `@Input() actionsColumnWidth?: string | number` + `protected get actionsColumnWidthStyle` (number→px, null when unset → token default wins); `.html` binds `[style.--falcon-data-table-actions-column-width]="actionsColumnWidthStyle"` on `<falcon-table-tw>` (mirrors existing skeleton `[style.--…]` host bindings / `tableBorderRadius` override pattern). Generated registry `falcon-studio/.../component-tokens.generated.ts` is **gitignored + auto-regenerated** from the token CSS on every build (→124px; the `build-token-registry` dep task ran during the admin build).

**⚠️ Build model** `[CODE]`: runtime loads `defineFalconTwComponent('falcon-table')` → `import('../dist/components/falcon-table-tw')` — the **compiled Stencil dist, NOT the .tsx**. Any `-tw` .tsx/.css edit REQUIRES `nx run falcon-ui-core:build` (`node build.cjs`, Stencil v4, ~30-38s, cache:false) to regen `dist/`. Token CSS + Angular wrapper hot-reload as `@falcon` lib. (`npx nx` broken → `node node_modules/nx/dist/bin/nx.js`; workspace = `C:/Falcon/Falcon/falcon-web-platform-ui`.)

**⚠️ Blast radius: GLOBAL** — every data-table's Actions column (both apps, sticky + non-sticky) is now a fixed 124px by default. Intended ("the default width = 124px"); narrow per-table with `[actionsColumnWidth]`. `falcon-tree-table-tw` NOT touched (out of scope).

**Verified (runtime evidence):** falcon-ui-core Stencil build EXIT 0 (dist regenerated); Stencil spec **red-green** — NEW non-sticky test in `falcon-table-tw.shadow.spec.ts` FAILS on original source, PASSES with fix (proven via `git stash` of the 2 source files); the 2 `sticky-actions split` failures are **PRE-EXISTING** (present with my changes stashed, untouched by my diff); admin-console dev build EXIT 0 + `remoteEntry.mjs`; built `dist/apps/admin-console/styles.css` contains all 3 `w-/min-w/max-w-[var(--falcon-data-table-actions-column-width)]` utility rules + `--falcon-data-table-actions-column-width:124px`. Only warning on the .html = PRE-EXISTING NG8102 on L22 (`scrollHeight ?? null`), not my L33 binding. ⚠️ live pixel-verify pending (no browser login).

Related [[reference_static_remote_rebuild_after_app_edit_2026_06_04]] · [[reference_fe_structure_standard_angular21_2026_06_02]] · [[reference_gate12_component_token_scope_portal_2026_06_02]] · [[project_contracts_list_column_width_ellipsis_2026_06_06]].
