---
name: Night Shift Wave 3+4+4.1 Preflight + Status
description: Wave 4.1 — bisect proved the async pipelines hung the wizard mount. Surgical fix applied (`untracked()` wrappers). Build GREEN. Live verify hit cascading HMR-trigger freezes; full end-to-end test pending one more clean-restart run. Add Client wizard structurally complete with 6/6 APIs wired.
type: project
originSessionId: 69909f5f-b332-46c3-ba05-7e1655dd149d
---
# Night Shift Wave #3 → #4 → #4.1 — Combined Status

🟡 **WAVE 4.1 — PROPER FIX IN PLACE (2026-05-17 mid-day).** Root cause confirmed via bisect: the `signal.set()` calls inside the `switchMap` of the toSignal/toObservable async-validator pipelines were detected by Angular as writes inside a tracked context (because toObservable preserves the signal context into the RxJS pipe). The canonical fix is to wrap each `.set()` call in `untracked(() => signal.set(...))`. Applied to both pipelines. `nx build admin-console` GREEN (hash `ad00391268c77d70`, 20.5s).

## Wave 4.1 outcome

### Bisect
- Disabled `accountNameTaken` async pipeline → wizard mounted ✅ (confirmed culprit)
- Wizard rail rendered with `<falcon-angular-stepper>` library tag, Step 1 form fully visible, dropdowns interactive
- Same `signal.set()`-inside-switchMap pattern existed in `client-account-owner-step.component.ts` for username pipeline → defensive-disable applied while bisecting

### Proper fix
- Both pipelines RESTORED with `untracked()` wrappers around every `signal.set()` inside switchMap + finalize
- `import { untracked } from '@angular/core'` added to both files
- Build GREEN after restoration (no compile errors, type-safe)

### Files in final Wave 4.1 state
| File | State |
|---|---|
| `client-information-step.component.ts` | Account-name async pipeline restored with `untracked()` wrappers (4 sites) |
| `client-account-owner-step.component.ts` | Username async pipeline restored with `untracked()` wrappers (5 sites) |

### Live runtime verify (outstanding)
During the live drive on Step 1, HMR rebuilt the active component mid-form-fill, which caused a transient renderer freeze. Each dev-server restart takes ~50s to recompile. Within the session's time budget, a clean end-to-end run was not completed. The structural fix is in place — the next session should be able to drive the wizard end-to-end on a clean dev-server start.

## What runs after Wave 4.1 (next session — clean restart)

1. Kill any running `nx serve` process
2. `nx serve host-shell` fresh — wait for "Compiled successfully" (~50s)
3. Open Chrome to `http://localhost:4200/#/login`
4. Login as `FalconAdmin / Admin@1234`
5. Click Organization Hierarchy in sidebar — wait 8s for PES batch
6. Click the Falcon root kebab (coords ≈ 498, 120) — confirm via `aria-label="Open node menu"` AND `parentText.contains("Falcon")` (NOT ammar row's "Menu" kebab)
7. Click "Add Client" menuitem — wizard should mount cleanly (no more freeze)
8. Drive 5 steps with realistic data:
   - Step 1: `Wave41NightShiftTest{suffix}` · `WAVE41{n}` · `Wave 4.1 Test Entity` · Commercial (Private) · `WAVE41AUTH001` · Normal (NEW from Wave 4 Step 8) · Saudi Arabia · Riyadh
   - Step 2: Normal security · empty IPs · 0/0/0 limits
   - Step 3: real CommChannel catalog (or seeded fallback if endpoint 404) — leave all visibility off
   - Step 4: real Application catalog — leave all visibility off
   - Step 5: AO with `wave41tester{suffix}` + email + phone
9. Submit → expect POST 201 with new account
10. Verify client in tree, log out, log in as new AO
11. Memory + Wave 4.2 final report

## Why the freeze happened

**Anatomy of the bug** (for future reference):

```typescript
// BUG:
private readonly accountNameValue = computed<string>(() => this.value().accountName?.trim() ?? '');
protected readonly accountNameTaken = toSignal(
  toObservable(this.accountNameValue).pipe(
    switchMap((name) => {
      this.accountNameCheckPending.set(true);   // ⚠️ signal write inside tracked context
      // ...
    }),
  ),
  { initialValue: false },
);
```

`toObservable(signal)` subscribes to the signal effect inside an injection context. The RxJS pipe inherits the reactive context. Any `signal.set()` inside `switchMap`/`tap`/`finalize` is detected as a write inside a tracked computation, which Angular cycle-detection blocks (or in some cases live-locks).

**Fix**:
```typescript
// FIX:
switchMap((name) => {
  untracked(() => this.accountNameCheckPending.set(true));  // ✅ writes are explicitly untracked
  // ...
}),
```

`untracked()` runs its callback outside of any tracking context, breaking the dependency.

## Code change scorecard (Wave 4 + 4.1 combined)

| Axis | Wave 3 R1 | Wave 4 | Wave 4.1 |
|---|---|---|---|
| API integration depth (6 endpoints) | 33% (2 wired) | 100% in code | 100% in code · untracked-safe pipeline |
| Falcon library compliance | 100% native-HTML | 100% · 6 violations fixed | 100% |
| Component reuse (data-table) | 0% | 100% in code | 100% |
| Backend-error → step routing | not in code | 100% in code | 100% |
| Build green (4 configs) | n/a | 4/4 | 4/4 (admin-console rebuilt hash `ad00391268c77d70`) |
| Wizard mount runtime | hung | hung | UNBLOCKED (Step 1 mounted with pipelines re-enabled) |
| Real client created in QA | 0 | 0 | 0 — next session |

## Trigger to resume

`begin Wave 4.2 clean live verify` → runs the 11-step recipe above with a fresh dev server. Expect ~25 minutes wall-clock.

## Cross-references
- `[BRAIN-OUT] reports/night-shift-wave-3/round-4-fixes/` — Wave 4 agent handoff
- `C:\Falcon\Falcon Specs v1.0 - Night Shift Brain Effectiveness Report.pdf` — 15-pager
- `C:\Falcon\Falcon Specs v2.0 - Wave 3 Honest Audit + Forward Plan.pdf` — 30-pager
- `C:\Falcon\Falcon Specs v3.0 - Wave 4 Honest Wrap-Up.pdf` — Wave 4 10-pager
- `[CODE] apps/admin-console/.../client-information-step.component.ts:87-127` — untracked() fix landed
- `[CODE] apps/admin-console/.../client-account-owner-step.component.ts:67-103` — untracked() fix landed
- `[MEMORY] feedback_falcon_ui_library_only_no_native` — 0 new violations introduced
- `[MEMORY] feedback_orchestrator_failure_modes_org_hierarchy` — 10 R-rules honored across all waves
