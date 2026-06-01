---
name: falcon-studio-mf-eager-root-cause-2026-05-20
description: Why the FalconAngularCalendarComponent TDZ at host-shell bootstrap is NOT fixed by the @falcon/studio/runtime subpath split alone — MF eager-share is the real culprit; one-line module-federation.config.ts fix proposed but NOT YET APPLIED.
metadata: 
  node_type: memory
  type: project
  originSessionId: decbfc0d-7652-4c6e-a026-973348e0180d
---

# Root cause: Module Federation eager-shares `@falcon/studio` regardless of code-level imports

**Status:** 🟠 DIAGNOSED 2026-05-20. Proposed fix NOT applied — user holding to apply themselves.

## The symptom

`http://localhost:4200/#/login` (host-shell) dies on bootstrap with:

```
TypeError: Cannot read properties of undefined (reading 'FalconAngularCalendarComponent')
    at Module.FalconAngularCalendarComponent (index.ts:1:1)
    at 37703 (container-nav-examples.ts:476:22)
    at 62304 (styles.js:13044:90)
    at 64825 (styles.js:2400:95)
    at 67362 (styles.js:3169:92)
    at 28618 (styles.js:9786:87)
```

## Why the existing fix is INSUFFICIENT

The earlier `@falcon/studio/runtime` subpath split (see `[[falcon-studio-runtime-split-2026-05-20]]`) flipped EIGHT files to import from `@falcon/studio/runtime` instead of `@falcon/studio`:
- `apps/host-shell/src/app/app.config.ts`
- `apps/host-shell/src/app/app.ts`
- `apps/host-shell/src/app/shared-components/do-payment-priority-popup/do-payment-priority-popup.component.ts`
- `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts`
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.ts`
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-table/falcon-table.component.ts`

After all those flips, `nx build host-shell` (hash `1ce0a5f656348156`) PRODUCES A `dist/apps/host-shell/main.js` THAT STILL CONTAINS:
- Module 52876 = `libs/falcon-studio/src/index.ts` (the FULL barrel — line 20+)
- Module 62304 = `component-examples.registry.ts` (line 13046+)
- Module 37703 = `container-nav-examples.ts` (line 28706+ — this is the SAME module ID the user's error stack shows: `at 37703`)
- Module 48081 = `angular-wrapper/index.ts` (line 54657+)
- Module 86491 = `falcon-calendar/index.ts` (line 39052+)

So the TDZ trigger is still in the eager bundle. The browser will still crash.

**Why:** `[CODE] apps/host-shell/module-federation.config.ts:41-50` shares EVERY `@falcon/*` library with `eager: true`. MF turns this into `register("@falcon/studio", "0.0.1", () => __webpack_require__(52876), 1)` at `[CODE] dist/apps/host-shell/main.js:81559` (trailing `1` = eager). The `import('@falcon/studio')` in the lazy showcase route resolves to the SAME pre-loaded module via MF's singleton sharing — the `import()` boundary collapses because `eager: true` forces the share into the host's initial chunk.

Result: even when NO app code statically imports `@falcon/studio`, MF still preloads it because the lazy showcase route uses it.

## Why CALENDAR specifically (and not Accordion/Tabs/Stepper in the same source file)

`container-nav-examples.ts` imports all four from `@falcon/ui-core/angular` and uses them in top-level `render(<Component>, ...)` calls:
- Line 28939: accordion
- Line 29014: tabs
- Line 29094: stepper
- Line 29186: calendar

Inside the angular-wrapper barrel (`[CODE] dist/apps/host-shell/main.js:54759-54818`), components are required in this order via hoisted `var = __webpack_require__(...)` assignments:
- `_14` = falcon-tabs (line 54767)
- `_16` = falcon-stepper (line 54769)
- `_22` = falcon-accordion (line 54775)
- `_44` = falcon-calendar (line 54801) ← FAR DOWN
- `_45` = falcon-date-picker (line 54802)

The barrel registers harmony export getters BEFORE the `var` assignments execute. Each getter is `() => _components_falcon_X.WhateverComponent` — capturing the variable by reference. The hoisted `var` declarations exist but their assignments happen in source order.

When `container-nav-examples.ts` synchronously reads `_falcon_ui_core_angular.FalconAngularCalendarComponent` as part of the MF eager-share init chain:
1. accordion (`_22`) — already assigned (came earlier in import list) ✓
2. tabs (`_14`) — already assigned ✓
3. stepper (`_16`) — already assigned ✓
4. **calendar (`_44`) — STILL UNDEFINED** because its `var = require(86491)` is mid-stack on the current synchronous require chain ✗

Calendar is the first late-position binding the consumer touches. Date-picker (`_45`) would fail too, but execution dies at calendar first.

## The actual fix (NOT YET APPLIED — user holding)

`[CODE] apps/host-shell/module-federation.config.ts:41` — special-case `@falcon/studio` to be non-eager so MF only loads it when the showcase route activates:

```ts
// BEFORE the generic @falcon/ matcher, add:
if (libraryName === '@falcon/studio') {
  return {
    ...sharedConfig,
    singleton: true,
    strictVersion: false,
    requiredVersion: false,
    eager: false,  // ← the showcase route's import() actually becomes lazy now
  };
}

// existing generic @falcon/* matcher continues to handle @falcon, @falcon/ui-core/angular,
// @falcon/studio/runtime, @falcon/sdk — these stay eager (correctly bootstrap-needed)
if (libraryName === '@falcon' || libraryName.startsWith('@falcon/')) { ... eager: true ... }
```

With this applied, `@falcon/studio` (full barrel) gets its own webpack chunk, doesn't run at bootstrap, and only loads when the user navigates to `/falcon-ui-showcase`. container-nav-examples.ts never touches main.js.

## Why: this took two passes to find

1. Pass 1 (runtime subpath split) addressed the SOURCE-CODE eager imports but didn't realize MF's `eager: true` flag pre-loads the share regardless of whether anything statically imports it from source.
2. Pass 2 (ui-core wrapper flip) added two more file updates but still hit the same TDZ because MF was still eager-loading `@falcon/studio`.
3. Pass 3 (this diagnosis) traced the bundle to module 52876 in main.js and the `register(..., 1)` eager flag — confirming the MF policy is what forces the eager bundle.

## How to apply

- Read this BEFORE proposing any further `@falcon/studio/runtime` splits, eager:false flips, or `nx build host-shell` runs.
- The right next step is the one-line `module-federation.config.ts` change. Build hash should change AND `container-nav-examples` should no longer appear in `dist/apps/host-shell/main.js`.
- Verify with `Grep container-nav-examples dist/apps/host-shell/main.js` → should return zero results. Showcase route chunk should now contain it.
- THEN runtime-verify in browser at `localhost:4200/#/login` — should be free of the calendar TypeError.

## Cross-links

- `[[falcon-studio-runtime-split-2026-05-20]]` — the predecessor fix (necessary but insufficient).
- `[[data-table-skeleton-loading-system-2026-05-20]]` — added `provideFalconDataTableSkeleton` to `@falcon/studio`, the change that pushed two more wrappers into the studio-dependency graph and exposed the latent MF eager-share bug.
- `[[host-shell-ng0201-domrendererfactory2-2026-05-20]]` — the previous bootstrap blocker whose fix (animations provider removal) was what allowed the calendar TDZ to surface.
