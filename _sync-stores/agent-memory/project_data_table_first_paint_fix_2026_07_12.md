---
name: data-table-first-paint-fix-2026-07-12
description: BUG-LIB-first-paint (task_e08e9a6d) FIXED in the falcon-data-table Angular wrapper — pre-upgrade own-property shadowing on lazy <falcon-table-tw>; whenDefined-gated full sync + own-prop restore; regression spec in management-console tests
metadata: 
  node_type: memory
  type: project
  originSessionId: e2a7054e-5c6b-45c8-bc2d-4bc163ec4392
---

# Data-table first-paint syncProps hole — FIXED 2026-07-12 (uncommitted)

**Bug (task_e08e9a6d):** [CODE] libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts — first `syncProps` (ngAfterViewInit) ran before the lazy `defineFalconTwComponent('falcon-table')` registration landed, so `el.rows`/`el.columns` writes became own data-properties that shadow the class accessors installed by the custom-element upgrade → "No records to display" for any consumer binding data synchronously at first CD (async consumers re-sync post-upgrade → masked). Runtime-verified on BSA home 2026-07-07.

**Fix (wrapper-side, tag BUG-LIB-first-paint in code comments):**
1. `syncProps` early-returns while `customElements.get('falcon-table-tw')` is falsy (no pre-upgrade writes at all).
2. One-shot `whenDefined('falcon-table-tw')` flush → `restorePreUpgradeOwnProps` (capture→delete→reassign every own prop whose key exists on the upgraded prototype chain — recovers non-wrapper pre-upgrade writes) → full `syncProps` of latest inputs; `_destroyed` guard cancels on teardown.
3. Warm-registry path byte-identical (guard is a no-op once defined).
4. Notable: the compiled Stencil runtime DOES contain connectedCallback own-prop capture, yet the repro proved props still get lost — fix grounded in observed behavior, not Stencil internals.

**Regression spec:** [CODE] apps/management-console/tests/falcon-data-table-first-paint.spec.ts (3/3 green) — placed there because falcon-ui-core's test target is Stencil Jest (no Angular TestBed) and management-console's vitest+analogjs harness is the workspace's working Angular runner. First component-fixture (TestBed.createComponent) spec in the workspace — pattern proven. vi.mock neutralises the lazy loader; a fake `falcon-table-tw` class controls definition timing; host state is signal-backed (plain-field mutation + fixture.detectChanges trips NG0100 under Angular's targeted-CD tick).

**Verification:** spec 3/3; full mgmt-console suite 738 passed / same 15 pre-existing failures (5 files: contact-group wizard + wallet source-regex specs, none touch the wrapper); eslint clean; `nx build basic-app` green with the ready gate removed — before Wave M0 (concurrent session, same day) deleted apps/basic-app. Live browser verify deferred to post-M0.

**Open follow-ups:** (1) migrated [[project_bsa_prd06_module_intake_plan_2026_07_06]] copy `libs/falcon/src/shared-features/basic-app/basic-app-home/basic-app-home.component.ts:91` still carries the now-redundant `ready` whenDefined gate — remove post-M0 + live-verify first paint (that IS the end-to-end proof of this fix). (2) Sibling wrappers (falcon-tree, falcon-tree-table, falcon-menu, falcon-wizard, …) likely share the pre-upgrade hole — sweep. (3) Stale compiled `.js` siblings next to `.ts` in libs/falcon-ui-core/src (define-falcon-tw-component.js et al.) — vite resolves `.js` before `.ts`, webpack the reverse; latent divergence hazard.

**How to apply:** any Falcon wrapper that pushes OBJECT props onto a lazily-defined Stencil element must gate the first push on `customElements.get(tag)` / `whenDefined` and do a full post-upgrade sync; never rely on Stencil's own pre-upgrade capture.
