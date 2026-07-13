---
name: project_library_deep_dive_sweep_2026_06_03
description: "Full read-only deep-dive of ALL libs/* — 9-file canonical dossiers + Obsidian projections + best-practice audit for 84 components + 12 lib-areas; 570 findings / 118 HIGH-RISK-QUEUE; nothing fixed, no commits."
metadata: 
  node_type: memory
  type: project
  originSessionId: 4a9fb3f6-c976-4e22-9b77-4845de0eac72
---

**Library deep-dive sweep (2026-06-03, claude + ~36 ammar-web-platform-ui subagents across 8 waves).** User asked to deep-dive `libs/*`, verify best-practice, document "all things each component can/should do + related", keep Obsidian updated. Mode chosen: **all libs / both Obsidian stores / audit+document ONLY (no fixes, queue high-risk) / full parallel sweep.**

**What exists now (all VERIFIED on disk, NO source edits, NO commits):**
- **Canonical 9-file dossiers** (`OVERVIEW·API·USAGE·TOKENS·BUSINESS·INTEGRATION_VALIDATION·GAPS_AND_UPGRADES·RECOGNITION·DECISION`) at `Brain Outputs/understanding/frontend/components/<slug>/` — **85 folders** (was 63; +22 NEW). Gold reference = `falcon-input`.
- **12 non-component lib-area dossiers** (lighter 5-file `OVERVIEW·SURFACE·USAGE·AUDIT·DECISION`) at `understanding/frontend/{sdk,core,language,shared-utils,shared-data-access,shared-types,shared-features,form-validation,ui-tokens,theme-lib,cross-framework,studio}/`.
- **Obsidian projections** (mount `falcon-wiki/_mounts/brain-outputs` is a LIVE junction → dossier edits auto-surface): `30-Components/*` = 84 component notes; `35-Libraries/*` = 8 (incl. refreshed `Falcon-UI-Core` hub); `50-Services/*` = 13.
- **Master `plans/library-deep-dive/AUDIT-REPORT.md`** (57.9KB, 8 sections) + spec `01-SWEEP-SPEC.md` + `00-INVENTORY-AND-BATCHES.md` + resumable `PROGRESS.md` ledger + **37 `FINDINGS/<batch>.md`** files.
- **Totals:** ~570 findings (~14🔴 / ~135🟠 / ~360🟡), **118 HIGH-RISK-QUEUE** (human-approval list — read AUDIT-REPORT §2). 0🔴 in the L-series.

**Headline truths the sweep established (cite AUDIT-REPORT):**
- SECURITY: `customSvg` raw-`innerHTML` XSS sink in BOTH `falcon-loader-overlay` + `falcon-loader-inline`; `@falcon/core` `RouteAccessService.canAccessPath` **default-OPEN**, session from **unvalidated localStorage**, **no specs on fail-closed PES logic**; FE↔PES `{action,resource}` string contract hand-enforced → **silent default-deny on PES-seed rename** (`falcon-access.registry.ts`); two **divergent IPv6 validators** on the IP allowlist; **en/ar i18n key-parity drift, no CI gate**.
- Systemic: the **default `-tw` Light-DOM render path has weaker a11y than the Shadow path** (region/aria-live/labels) across many components; **dead-but-mounted host cluster** (message-host/unsaved-changes-host/confirm-dialog-host/toast/notification-stack = Phase-5 shims STILL in `app.ts`); `falcon-drawer` projected body **wiped under zoneless CD** (wallet hand-rolls native); `input-number` Shadow path has **no numeric keystroke filter**.
- Token discipline: **gate-12 PASS 55/55** component token files (0 `:root`); residue = ~64 bare-hex (loader/wallet/stepper/toast) + `alert-dialog` inline tokens can't dark-invert.
- **Cross-framework parity = 100%** (React 106 + Vue 106 + Stencil 106) — this RETRACTS earlier per-component "no React/Vue wrapper" findings (false positives).
- Dead/superseded: `falcon-select` = dead re-export(0); `confirm-dialog` commented out (→`FalconConfirmService`); legacy DELETED (stepper-legacy/calendar-legacy/multiselect-legacy/mobile-number/photo-uploader/uploader/send-credentials-popup, 0 blocking consumers); `org-node-header` orphan+twin, `page-skeleton` verbatim dup, 11 dormant directives, `FalconEffectiveDate` stub = deletion candidates.

**Drift the existing dossiers had (now corrected — these were the false beliefs):** gold `falcon-input` documented a **FABRICATED `falconFocus` @Output** + missing icon inputs; **phantom-SCSS** "violations" on `form-field`/`tree-panel` (no .scss exists — already Tailwind-only); **fictional token names** in search/grid/otp (+ off-brand `--color-falcon-primary-*` refs); password/email/phone wrongly called "pure Angular composition" (all dual-render Stencil); pervasive **"0 consumers" undercount** (button 0→192, dropdown 13→57, status-badge 0→26, stepper 0→21, notification ~45); `icon` glyphs 122→**314**; **PrimeNGThemeService does NOT exist** (FE-standard doc §11 stale); PrimeIcon `pi pi-*` survivors only in **stale compiled `.js`**, not source.

**Live library shape:** `libs/falcon-ui-core` = 63 Angular CVA wrappers (`falcon-angular-*`) over 55 Stencil Shadow + 53 `-tw` Light-DOM twins (dual-render, `useTailwind=true` default render path); `libs/falcon/src/shared-ui` = 11 single-render Angular comps; tokens SoT `libs/falcon-ui-tokens` (layered: primitives→semantic→density→rtl→themes→components, `:where()`-scoped); theme `libs/falcon-theme` (`@theme` SSOT + 314-glyph icon font); generated React/Vue wrappers + studio.

**NEXT STEP for any follow-up:** the AUDIT-REPORT §8 triage splits findings into safe-local vs HIGH-RISK-QUEUE — fixes need explicit user go-ahead (audit-only mandate). Sweep is resumable from `PROGRESS.md`. Related [[reference_fe_structure_standard_angular21_2026_06_02]] · [[reference_falcon_fe_build_standard_angular21_2026_06_02]] · [[reference_gate12_component_token_scope_portal_2026_06_02]].
