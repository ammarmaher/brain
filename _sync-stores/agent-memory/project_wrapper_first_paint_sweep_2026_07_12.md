---
name: project_wrapper_first_paint_sweep_2026_07_12
description: BUG-LIB-first-paint generalized from falcon-data-table into a shared TwUpgradeGuard helper + fixed across 16 Angular wrappers (dropdown/tabs/multi-select/menu/stepper/date-picker/calendar/table/tree/tree-table/wizard/accordion/combobox/filter-panel/single-uploader/insufficient-balance) + 3 new specs; gates green; UNCOMMITTED
metadata: 
  node_type: memory
  type: project
  originSessionId: 54ff90e4-b1ed-417e-8eaf-9cad2d2f849a
---

On 2026-07-12 the falcon-data-table BUG-LIB-first-paint fix (task_e08e9a6d) was generalized across the Falcon Angular wrapper layer in `C:\Falcon\Falcon\falcon-web-platform-ui`.

**Hazard:** wrappers push OBJECT/ARRAY/FUNCTION props onto a lazily-registered `-tw` Stencil element before it upgrades; the write becomes an own-property that SHADOWS the class accessor the upgrade installs, so synchronously-bound data never reaches Stencil (empty first paint). Async consumers mask it via a warm re-sync.

**Shared helper (NEW):** `libs/falcon-ui-core/src/angular-wrapper/tw-upgrade-guard.ts` — `TwUpgradeGuard` (element-tag-driven `isDefined` / one-shot `scheduleFlush` on `customElements.whenDefined` / `destroy`) + standalone `restorePreUpgradeOwnProps(el)` (delete→reassign own-props whose key is on the upgraded prototype). Exported from the public barrel `@falcon/ui-core/angular` (so it's importable + unit-testable without a deep cross-boundary import). Keys on the LIVE element's own tag → handles the `-tw`/Shadow dual-render paths (which data-table doesn't have).

**16 wrappers fixed (by vector, blast radius = consumer uses):**
- Vector A imperative `el.prop=` → gate `syncProps` + scheduleFlush: **data-table** (migrated onto the helper; its existing spec proves equivalence), **menu**(6, was eager pre-upgrade write on the disproven "Stencil reads expandos" assumption), **date-picker**(8, `el.disabledDates`), **calendar**(0), **table**(0, @deprecated). **stepper**(24) = gate the eager `el.steps` @Input setter + restore in its deferred flush.
- Dual-vector PARTIAL (gated imperative pushOptions + UNGATED template `[prop]` + NO restore) → added `restorePreUpgradeOwnProps(el)` at the head of the existing `whenDefined` flush: **dropdown**(140 — biggest), **multi-select**(32), **tabs**(33).
- Vector B pure template `[prop]` → `ngAfterViewInit` queries the active element and arms a restore-ONLY flush (replay delivers the data; NO template rewrite): **tree**(2), **tree-table**(1), **wizard**(35, `[steps]`+`[validateStep]` fn), **accordion**(0), **combobox**(0), **filter-panel**(0), **single-uploader**(0), **insufficient-balance-dialog**(1).

**SAFE — deliberately not touched:** wizard-finalization + host-shell org-hierarchy (compose Angular children, not Stencil); empty-data (eager module-load define → no pre-upgrade window); loader-inline/overlay (JSON.stringify config → `[attr.config]`); all attr-only display/dialog + CVA-primitive text fields (input/input-number/password/textarea/email/otp/search/grid — the first three have a LOW ungated PRIMITIVE `writeValue` else-branch that self-heals via `[attr.value]`, firstPaintRisk=N, left as-is). `falcon-select` does not exist; the org-hierarchy Stencil element has no Angular wrapper.

**Regression specs (NEW, apps/management-console/tests/):** `tw-upgrade-guard.spec.ts` (8, helper unit — restore/gate/collapse/no-op-warm/no-flush-after-destroy), `falcon-accordion-first-paint.spec.ts` (3, Vector-B), `falcon-dropdown-first-paint.spec.ts` (2, dual-vector). Pattern extends the data-table spec (vi.mock of define-falcon-tw-component + a fake custom-element class defined mid-test; TestBed fixtures attach to document.body so `define` upgrades them).

**Gates:** `npx tsc --noEmit -p libs/falcon-ui-core/src/angular-wrapper/tsconfig.json` = clean; `npx eslint <17 changed files + 3 specs>` = clean; all 16 first-paint tests pass. **UNCOMMITTED** on the FE repo (no branch/commit made).

**Why:** the platform is migrating to synchronous/mock-first pages (BSA home) that hit this 100%; leaving the sibling wrappers unpatched means the next synchronous consumer of any of them silently renders empty.

**How to apply:** the helper is the single source of truth — new wrappers that push object/array/function props onto a `-tw` element should use `TwUpgradeGuard` (imperative) or the restore-only `scheduleFlush` (template `[prop]`); never assume Stencil recovers pre-upgrade own-props (it does NOT in this build). Gotcha found: `@nx/enforce-module-boundaries` autofix CRASHES (ENOENT `components/*/index.ts`) on any app→lib-internals deep import — a real CI-blocking bug — so tests must import lib symbols via the public entry, not relative paths. Relates to [[project_data_table_first_paint_fix_2026_07_12]].
