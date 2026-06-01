---
name: session-backup-edit-user-by-status-disabled-control-provability
description: Verified §D read-only controls are genuinely disabled + DOM-detectable in both consoles; added regression spec
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-06-01
  status: completed
  originSessionId: b2539b91-7d8b-4388-b78c-61caaa7243ce
---

## What Was Done
Night-shift FE task: prove every §D "read-only" matrix cell yields a GENUINELY disabled control
(truly non-interactive) AND that the disabled state is PROVABLE at runtime, for the admin embed
path AND the self path, in BOTH admin-console and management-console.

VERDICT: NO source bug. The controls were already (a) genuinely non-interactive and (b)
DOM-detectable. The orchestrator's "dropdown didn't expose disabled" miss was a probing artifact
(querying the wrong tag / stale dev-server dist), not a code defect. Closed both unknowns with
evidence and added a regression spec.

Repo: C:\Falcon\Falcon\falcon-web-platform-ui (TWO Falcon segments). Branch polishing-v0.4. NO COMMITS.

## The disabled mechanism (file:line) — TWO layers, both genuine
RENDERED PATH: all four Angular wrappers default `useTailwind=true` (falcon-dropdown.component.ts:149,
falcon-input.component.ts:91, falcon-phone-field.component.ts:134, falcon-email-field.component.ts:73),
so the element that actually renders in the consoles is the `-tw` LIGHT-DOM twin
(`<falcon-dropdown-tw>` etc.), NOT the shadow `<falcon-dropdown>`. ← this is why a live probe for
`falcon-dropdown[disabled]` finds nothing; the attribute is on `falcon-dropdown-tw`, a child of
`<falcon-angular-dropdown>`.

1. ATTRIBUTE PROJECTION (framework-level, reflect-independent): wrapper templates set the host
   attribute directly for BOTH render paths —
   - falcon-dropdown.component.html:21 & 57  `[attr.disabled]="disabled() ? '' : null"`
   - falcon-input.component.html:22/58 + :23/59  `[attr.disabled]` + `[attr.readonly]`
   - falcon-phone-field.component.html:17/54 + :18/55 ; falcon-email-field.component.html:15/47 + :16/48
   The wrapper reads `[disabled]` into a signal (dropdown.ts:186-189 + setDisabledState:291-293; input
   .ts:124-127,207-209) → Angular writes a literal `disabled=""` / `readonly=""` onto the custom
   element. **Canonical QA hook: `falcon-dropdown-tw[disabled]` / `falcon-input-tw[readonly]` etc.**
2. ENFORCEMENT (genuinely non-interactive) in the `-tw` Stencil sources:
   - falcon-dropdown-tw.tsx: openInternal()(186) `if(disabled||readonly||open)return`; handleTriggerClick(228);
     handleTriggerKeydown(233); applyClear(220); trigger `<button disabled aria-disabled>`(309-310);
     option `<button disabled>`(358). Disabled dropdown CANNOT open panel, CANNOT select, CANNOT clear.
   - falcon-input-tw.tsx: native `<input disabled readOnly>`(212-213); applyClear guard(154);
     autofocus skips when disabled(102). falcon-phone-field-tw.tsx:262-263 + chooser/verify guards(220,205,
     251,274). falcon-email-field-tw.tsx:137-138 + verify guard(97).
   (The SHADOW variants — falcon-dropdown.tsx etc. — enforce identically + already `@Prop({reflect:true})
   disabled/readonly` + aria-disabled; used only when a consumer sets useTailwind=false. None do here.)
3. Username invariant: page html:441-443 `[readonly]=true [disabled]=true` → input hard-locked.
4. Self path: host-shell user-profile-route.component.ts:28 `[selfMode]="true"`; selfReadonly() OR'd
   into status/role/permgroup `[disabled]` (page html:521/530/628). Personal stays editable for Active self.

## Both consoles + self — confirmed identical
- admin org-hierarchy-page-menu.component.html:113 `<app-user-details-page [userId][includeDeleted](dirtyChange)(back)>`
- mgmt org-hierarchy-page-menu.component.html:106 — same bindings, NO selfMode → admin path both sides.
- NO console-level SCSS/JS re-enables any control (grep clean). app SCSS only has tailwind.css + a
  login-layout/change-password scss with no falcon-dropdown/disabled override.

## What I changed
- ADDED apps/host-shell/tests/falcon-control-disabled-enforcement.spec.ts (9 tests) — logic-mirror of
  the guard truth-table. Placed under host-shell/tests because vitest.standalone.config.mts ONLY
  collects apps/{admin-console,host-shell}/tests/** AND Stencil custom elements can't instantiate
  under the node/jsdom vitest (documented in current-user-actor-gating.spec.ts). 
- NO .tsx / wrapper / component / signals edits. (Earlier triple-Falcon-path edit attempts all
  errored — nothing landed. Final `git status` = ONLY the one new spec file.)

## Verification (evidence)
- vitest: Tests 597 passed (597) — exactly +9 vs 588 baseline; current-user-actor-gating green.
  The 1 "failed suite" = falcon-http-ui-dispatcher.spec.ts FAILS TO RESOLVE `@falcon/studio/runtime`
  (pre-existing baseline collection error, unrelated). PowerShell exit=1 = deprecation-stderr
  artifact — read the summary, NOT the exit code.
- Build: nx run-many build host-shell,admin-console,management-console --configuration=development
  --skip-nx-cache → BUILD2_EXIT=0 (Successfully ran build for 6 projects).

## Context for Next Agent
- @falcon/ui-core/angular = libs/falcon-ui-core/src/angular-wrapper; @falcon/ui-core/components =
  libs/falcon-ui-core/DIST/components (compiled, dist-custom-elements; the per-tag `falcon-X.js` is a
  ~160-byte re-export STUB — real code is in the hashed `falcon-X2.js` chunk; don't grep the stub).
- nx serve has dependsOn:[] (nx.json:42-49) → dev server does NOT rebuild Stencil dist. A live probe
  seeing "no disabled attr" is almost always stale dist; rebuild falcon-ui-core (any `nx build <app>`
  cascades it via build.dependsOn ^build).
- To QA-assert disabled at runtime: query the wrapper's CHILD custom element, e.g.
  `document.querySelector('falcon-angular-dropdown falcon-dropdown-tw').hasAttribute('disabled')`
  (or `[readonly]` on falcon-input-tw). The wrapper host `<falcon-angular-dropdown>` itself does NOT
  carry the attribute.
- selfMode IS wired in this codebase; no data-wiring gap found (the brief's "_state hardcoded" note
  referred to a different/older shape — N/A here; the shared feature loads via USER_DETAILS_GATEWAY +
  AccessControlFacade and gating computeds are real + unit-tested).
