---
name: basic-app-sot-parity-token-override-mechanism
description: "Basic-app PROGRAM CODE-COMPLETE 2026-07-12 (all waves M0→F9 + B1 basic-only, 1038 tests; live-verify F3+ pends watch restart) + apps/basic-app placement + structure contract + THE token-override mechanism (why [style.--var] never works; ng-deep or inner setProperty)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5e39828d-d627-4637-ac41-fc3264515775
---

**PROGRAM CODE-COMPLETE (2026-07-12, all uncommitted polishing-v0.4):** all waves done — home grids · WA+voice compose · channel-aware details+conversation (one component per screen, both channels) · lifecycle (delete / edit-in-place / cancel) · mgmt marketplace card. **B1 BASIC-ONLY ruling** (user: "over-engineering — just Falcon components, basic, zero native HTML, calendar must load time"): 7 custom components DELETED (native dialogs→FalconConfirmService · popovers→tooltip/multi-select · SVG charts→small falcon tables · IVR canvas cancelled); scheduling time = date-picker + 48 half-hour-slot dropdown (falcon date components have NO time mode; generic `showTime` flag = flagged follow-up). **Structure contract**: per-component folders + app-root models/validations/services tiers (voice-service precedent; STRUCTURE_CONTRACT.md). ONE sanctioned lib change: comm-mkt-view generic `open` action + `canOpen?` flag (F9, backward-compatible, FLAGGED for user review). Evidence: 1038 admin-console tests · basic-app lint 0 · zero-native greps. OPEN: live verify F3+ needs the user's watch restart (PID 35264 serves stale bundle); W-PES/W-DARK/L-track flagged. Wave log: ORCHESTRATION_STATE.md; vault: 20-Basic-App.

**2026-07-12 — Basic-app M1.5 pixel-parity runtime-verified + F2 compose closed.**

**⚠️ PLACEMENT RULING (later same day, supersedes "internal = libs"):** the basic app lives at **`apps/basic-app`** (same level as the consoles), consumed by BOTH consoles via the **`@basic-app`** alias (tsconfig.base.json + eslint module-boundaries `allow`, @host-shell/shared precedent — NO new MF remote/port). The shared library (`libs/falcon*`) holds ONLY generic app-agnostic components — nothing app-named, ever; customization = generic flags/inputs (e.g. `static: true|false`). Migration executed + gated same day (builds green, 43/43 specs via @basic-app, basic-app:lint 0). Obsidian vault folder created: `Brain SK/_obsidian/20-Basic-App/` (MOC + Architecture Ruling + feature notes). Structure: `apps/basic-app/src/{index.ts, app/features/{home,compose}, app/models, app/services}`.

**THE token-override mechanism (platform-wide fact):** every `libs/falcon-ui-tokens/src/components/*.tokens.css` sheet declares its vars via zero-specificity `:where(falcon-x, falcon-x-tw, falcon-angular-x, .falcon-x, [data-falcon-x])` — i.e. directly ON the consuming inner element. A CSS custom property declared on the element itself beats any inherited value, so **wrapper-level `[style.--falcon-*]` bindings silently do nothing** for vars consumed by inner `-tw` elements. Working levers (both in-repo precedents):
1. **Scoped `:host ::ng-deep <inner-el> { --var: v }` rule** in component styles — any real specificity beats `:where()`; survives Stencil re-renders; precedent `comm-mkt-view.component.ts:99`. Used for basic-app parity.
2. **`el.style.setProperty()` on the inner element** — inline wins outright; precedent `stencil-prop-patches.ts` in marketplace-applications / org-hierarchy / comm-channels features (needs re-run after re-render).

**Landed for parity (all ladder-④, zero library edits), live-verified EXACT vs running SoT:** Send button #0d3f44/h38/13px/px16 · panel white r14 · thead #F5F5F5/fw500/h60 + rows h71 (cells ride `h-[var(--falcon-table-row-height)]` → scope th/td separately) · all 7 status pills exact hex/12px/h22/6px-dot via `BasicAppStatusPillComponent` (`data-status` host attr + per-status ng-deep; the tw badge collapses 9 severities into 4 var buckets: active|paid→active-*, pending→pending-*, suspended|locked|inactive|disabled→inactive-*, deleted|expired→danger-*) · tabs line-height 21px (channel 57-2px, sub 53-2px w/ 16/14 padding). Live SoT corrected one doc hex: Completed bg **#d9f2e4** (doc said #e7f6ee).

**Also hotfixed:** parallel-session sweep left `querySelector<HTMLElement>()` on untyped `ElementRef.nativeElement` in 13 `angular-wrapper` files → TS2347 webpack overlay blocked the whole dev app (incl. login clicks). Repo idiom is `querySelector(...) as HTMLElement | null` casts — applied to all 13.

**Open:** user's watch (PID 35264) STOPPED rebuilding mid-session (serves last good bundle; probe edit never arrived — needs user restart when convenient; last served build has everything except the toolbar `shrink-0`). Search-input is pill-shaped (`rounded-full`, not tokenized) vs SoT 10px rect — conscious platform-identity delta pending user ruling. SoT client header (avatar+name left of Send) = demo-only chrome, intentionally not ported.

Related: [[project_bsa_prd06_module_intake_plan_2026_07_06]].
