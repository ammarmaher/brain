---
type: investigation-fix-plan
title: "Shared Service-Pricing component — fix plan"
date: 2026-05-21
branch: polishing-v0.4
companion_report: ./GAP-REPORT.md
verification_policy: source-prefix-rule (every fix cited)
---

# Fix Priority Summary

| Priority | Count | What |
|---|---:|---|
| **P0** (must-fix; user-impacting) | **2** | Skeleton flow on initial/node-switch; `loadError` banner is dead-coded |
| **P1** (should-fix; UX regression) | **2** | Visibility-error rollback (parity with OLD); explicit error-mode reload-retry button |
| **P2** (nice-to-have; tech debt) | **2** | Unify `commerce/Node` casing across codebase; add HF-2 endpoint product-decision doc |

No source code is changed by this investigation. Plan only.

# P0-1 — Skeleton fires on initial GET + node-switch

## Why

[MEMORY] `project_data_table_skeleton_initial_loading_fix_2026_05_20`: "a slice/component that auto-loads on mount must default `loading = signal<boolean>(true)`". The shared wrapper violates this: `[loading]="submitting()"` (a computed reading `state.submitting() || doPaymentInFlight()`) is OFF during the very first GET on mount + every node-switch.

[CODE] `apps/host-shell/src/app/shared-components/service-pricing/signals/service-pricing-state.slice.ts:60` sets `mode='loading'` but `submitting` stays `false` — the slice has TWO independent signals for "loading" and the wrapper subscribes to the wrong one.

## File + Change

**File:** `apps/host-shell/src/app/shared-components/service-pricing/service-pricing.component.ts`

**Current** [CODE] lines 109-111:
```ts
protected readonly submitting = computed<boolean>(
  () => this.state.submitting() || this.doPaymentInFlight(),
);
```

**Proposed:**
```ts
protected readonly submitting = computed<boolean>(
  () => this.state.mode() === 'loading' || this.state.submitting() || this.doPaymentInFlight(),
);
```

The `computed` already exists; we OR in the missing `mode==='loading'` source. The name `submitting` is now slightly misleading (it covers BOTH load and submit) — rename to `tableLoading` only if you want clarity, but the public surface is internal-only so a name change is optional.

## Verify

- Build: `npx nx build host-shell` (clean tsc).
- Runtime click-through on `admin-console` → `org-hierarchy-page` → CommChannels tab → confirm skeleton appears for the duration of the GET on FIRST landing.
- Runtime click-through: select a different tree node → confirm skeleton appears between node-click and rows-paint.
- Runtime click-through: toggle visibility → confirm skeleton fires (pre-existing rev-2 behaviour, regression-check).
- Inspect DOM during the GET window: `<tbody>` should host the skeleton rows ([CODE] `falcon-table-tw.tsx:1420-1430` skeleton render path).

## Risk

| Risk | Mitigation |
|---|---|
| `state.mode()` flips through `'loading'` → `'view'` synchronously inside `subscribe.next`, which could trigger an Angular signal-write-in-effect warning | Already proven safe: `mode` is set inside `subscribe.next`, OUTSIDE any effect/computed context. Only this read happens inside a `computed` (which is the legal direction). |
| Renaming `submitting` could cascade — the lib's `<falcon-service-pricing-table>` declares `submitting = input<boolean>()` and the host wrapper template binds `[submitting]="submitting()"`. Renaming the host computed alone is safe; do NOT rename the lib input | Keep the lib input name; only consider renaming the host computed if needed for readability. |

# P0-2 — `loadError` banner (parity with mgmt-console)

## Why

The slice writes `loadError.set('hierarchy.appsServices.loadError'|…)` at [CODE] `service-pricing-state.slice.ts:80-84` but the wrapper template at [CODE] `service-pricing.component.html` renders no banner — `loadError` is dead-coded. The global response-interceptor toast auto-dismisses after ~5s; the user is then left looking at an empty table with no in-pane explanation.

Mgmt-console's per-tab implementations DO render a banner — pattern at [CODE] `apps/management-console/src/app/features/org-hierarchy-page/components/tab-components/apps-services-tab/apps-services-tab.component.html:19-32`. We should mirror that in the shared wrapper.

## File + Change

**File:** `apps/host-shell/src/app/shared-components/service-pricing/service-pricing.component.html`

**Add (above the existing `<falcon-service-pricing-table>`) :**
```html
<!-- Inline GET-failure banner — global toast auto-dismisses; this gives in-pane context. -->
@if (state.mode() === 'error' && state.loadError(); as errKey) {
  <div
    class="mx-5 mb-3 flex items-start gap-3 p-3 rounded-md border border-falcon-red-200 bg-falcon-red-50 text-falcon-red-700"
    role="alert"
  >
    <i class="falcon-icon falcon-icon-exclamation-circle text-md-half mt-0.5" aria-hidden="true"></i>
    <div class="flex-1 min-w-0">
      <p class="m-0 text-sm font-semibold">
        {{ (kind() === 'application' ? 'hierarchy.appsServices.title' : 'hierarchy.commChannels.title') | translate }}
      </p>
      <p class="m-0 text-xs text-falcon-red-600 mt-0.5 truncate">{{ errKey | translate }}</p>
    </div>
    <button
      type="button"
      class="ms-auto text-xs font-medium underline text-falcon-red-700 hover:text-falcon-red-800"
      (click)="state.reload()"
    >
      {{ 'common.retry' | translate }}
    </button>
  </div>
}
```

The wrapper component .ts must also expose:
- The `kind` input is already exposed (line 89) — no change.
- `state` is already `protected` (line 80) — no change.
- Add `TranslatePipe` to imports if not already there (the wrapper imports `TranslateService` but not `TranslatePipe`).

## Verify

- Build: `npx nx build host-shell` (clean tsc).
- Runtime: temporarily proxy-block `commerce/Node/{id}/applications` (e.g. browser DevTools network blocker) → reload → confirm banner appears with retry button.
- Click "Retry" → confirm `state.reload()` re-fires the GET (visible in network panel).
- Confirm i18n keys exist (`common.retry` already in `libs/falcon/src/language/i18n/en.json`/`ar.json` — if absent, add).

## Risk

| Risk | Mitigation |
|---|---|
| Banner pushes table down → layout shift | Use `mb-3` only (current mgmt-console banner uses the same spacing). |
| `common.retry` key may not exist | Audit `en.json`/`ar.json` first; add if missing. |
| Retry-clicked DURING in-flight reload would queue a second GET | `slice.reload()` cancels in-flight via `this.inFlight?.unsubscribe()` at [CODE] `service-pricing-state.slice.ts:63` — safe. |

# P1-1 — (Reserved – see P0-1)

(Intentionally skipped — the missing skeleton problem is severe enough to be P0.)

# P1-2 — Visibility-toggle error rollback (parity with OLD)

## Why

OLD behaviour at [CODE] `git show origin/main:apps/admin-console/.../apps-services-tab/apps-services-tab.component.ts:316`:
```ts
error: () => {
  row.visibility = !nextVisibility;  // revert optimistic UI
  this.messageService.add({...});
}
```

NEW behaviour at [CODE] `service-pricing.component.ts:212`:
```ts
private onMutationError(): void {
  this.state.submitting.set(false);  // only releases gate; no rollback
}
```

The `<falcon-angular-switch>` is an uncontrolled-with-controlled-input pattern: `[checkedInput]="row.visible"` is one-way. After the user flips it and the PUT fails, the local switch component KEEPS the new value on screen until the next reload (which never fires on error). On the next mutation OR navigation the GET runs and reconciles — but the operator sees a "Visible" switch for a row the server thinks is hidden, for an unbounded window.

## File + Change

**File:** `apps/host-shell/src/app/shared-components/service-pricing/service-pricing.component.ts`

**Add a new error-handler variant:**
```ts
private onVisibilityError(): void {
  this.state.submitting.set(false);
  /*** Reconcile the optimistic switch with server state — the next GET is the SoT. ***/
  this.state.reload();
}
```

**Change** [CODE] line 230:
```ts
// CURRENT
error: () => this.onMutationError(),

// NEW (for visibility only):
error: () => this.onVisibilityError(),
```

Apply to visibility ONLY. Enable/disable/price-edit handlers can keep the silent `onMutationError` because they don't have an optimistic UI artifact to roll back — those are kebab-menu-triggered, not local form state.

## Verify

- Build: `npx nx build host-shell`.
- Runtime: in DevTools, override the response of `PUT commerce/Node/application/visibility` to 500 → flip a switch → confirm: (1) the global error toast fires, (2) the switch returns to its server-authoritative position within one round-trip (the reload GET).
- Runtime: confirm no double-toast (the reload GET succeeds silently, doesn't push a second toast).

## Risk

| Risk | Mitigation |
|---|---|
| Reload after error could mask the error to the operator (the table refreshes immediately) | The global error toast still fires — operator gets feedback. |
| Reload race with a concurrent mutation | `slice.reload()` cancels in-flight via `unsubscribe` before issuing a new GET. |

# P1-3 — Banner-retry retry-button accessibility

Trivial follow-on to P0-2 — add `aria-label` to the retry button: `aria-label="Retry loading"`. Sub-15-second change. Not blocking.

# P2-1 — Unify `commerce/Node` casing

## Why

HF-1 in the gap report. Both branches mix `'commerce/Node'` (list URL OLD + every URL NEW) and `'commerce/node'` (mutation URLs OLD). The branch-under-review unifies on capital N. Verify backend tolerance.

## Action

- Run `curl -i $GATEWAY_URL/commerce/node/application/visibility -X PUT -H 'Authorization: Bearer …' -d '{...}'` against a dev gateway → confirm 200/204 (not 404).
- Run the same with `/commerce/Node/...` → confirm 200/204.
- If EITHER fails, raise with backend ops; otherwise no FE change needed.

## Risk

| Risk | Mitigation |
|---|---|
| Some gateway later turns on case-sensitive routing | Lock the URL choice in code-review checklist; consider a unit test that asserts the casing. |

# P2-2 — Document the comm-channel list path change (HF-2)

Add a one-line note to `GAP-REPORT.md` once user confirms whether `…/comm-channels/visible/details` is the intended product behaviour. The 2026-05-19 Wave 2 consolidation commit was a presentation-merge, so the URL change should be tracked deliberately in the changelog.

# Sequence

```
P0-1 ──┐
       ├── apply together (one branch, one PR) — both are template/component edits in the same file pair
P0-2 ──┘
       └── after merge → smoke-test in admin-console org-hierarchy CommChannels + Apps tabs

P1-2 — apply AFTER P0-1 lands (P1-2 depends on the wrapper structure P0-1 doesn't change)

P2-1 — independent backend verification; no FE change required unless ops reports a 404

P2-2 — documentation only; do whenever HF-2 is answered
```

# Risk Register

| # | Risk | Likelihood | Severity | Mitigation |
|---|---|---|---|---|
| R-1 | P0-1 OR'd `mode==='loading'` keeps the table in skeleton FOREVER if the slice forgets to flip `mode` back to `'view'`/`'error'` after a GET | Low | High | Slice already flips `mode` in both `next:` and `error:` branches at lines 73-86. Add a unit test that asserts `mode` lands on `view` or `error` after the finalize. |
| R-2 | P0-2 banner template uses `kind()` inside template — ensure host wrapper exposes `kind` as `protected readonly` (currently `readonly` only) | Low | Low | The `input.required<>()` declaration already exposes `kind` to template via field name. Verify. |
| R-3 | P1-2 reload-after-error could clash with rapid double-clicks | Low | Low | The wrapper's `runMutation` already gates concurrent submissions ([CODE] `service-pricing.component.ts:159` — `if (this.submitting()) return;`). |
| R-4 | The OLD `comm-channels` list endpoint silently 404s in production — would mean the new path is mandatory; reverting is impossible | Low | Critical | Decision-only; needs HF-2 answer before any rollback. |

# Open Questions for the User (≤5; ambiguity ≥ 7)

These are the questions the GAP-REPORT halt-and-flag items resolve into actionable user choices:

1. **HF-1**: Is `commerce/Node` (capital N) acceptable everywhere, or do we need to revert to `commerce/node` (lowercase) for parity with the OLD branch?
2. **HF-2**: Did Wave 2 deliberately switch the comm-channel list to `…/comm-channels/visible/details`? If yes — confirm this is the intended product behaviour (only visible comm-channels with details, never the full list). If no — revert to `…/comm-channels`.
3. **HF-3**: On a failed visibility toggle, should the switch visibly revert (OLD behaviour — `row.visibility = !nextVisibility`), or stay in its optimistic position until the next reload (NEW de-facto behaviour)? P1-2 above assumes the user wants the visible revert + reload.
4. **HF-4**: For the new `loadError` banner — TOP-of-pane (mgmt-style) or REPLACE the table body? P0-2 above assumes TOP. Either is shippable.
5. **(Optional)**: Should the do-payment flow re-introduce a confirmation popup BEFORE the first POST (OLD behaviour at `apps-services-tab.component.ts:480` `confirmationService.confirm`), or is the popup-flow's insufficient-balance prompts a sufficient confirmation surface? P0/P1 do not depend on this — flag if you want it scoped.

Answers to 1-4 unblock the P0/P1 fixes. Answer to 5 is orthogonal.
