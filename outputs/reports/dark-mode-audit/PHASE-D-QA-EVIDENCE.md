# Phase D — Dark Mode QA Evidence
**Date:** 2026-05-17
**Auditor:** Ammar QA-Web
**Stack state (pre-flight 2026-05-17 ~21:55):**

| Service | URL | Result |
|---|---|---|
| host-shell | http://localhost:4200 | UP — 200 |
| admin-console | http://localhost:4204 | UP — 200 |
| management-console | http://localhost:4301 | UP — 200 |
| identity-svc | http://localhost:7777/health | DOWN — timeout |
| core-gateway | http://localhost:7038 | DOWN — timeout |
| system-gateway | http://localhost:7256 | DOWN — timeout |
| zitadel | http://localhost:8080 | DOWN — timeout |
| mongodb-port | http://localhost:27017 | DOWN — refused |
| kafka-port | http://localhost:9092 | DOWN — timeout |

## Executive verdict

**Status: ⚠️ BLOCKED — partial pre-flight only**

Phase D cannot be executed end-to-end. Two independent blockers stop the live-browser matrix:

1. **Backend stack is down.** Identity / both gateways / Zitadel / MongoDB / Kafka are all unreachable from `localhost`. Every authenticated surface in the matrix (Surfaces 2–8, plus ThemeService tests T1 and T8 across-MFE navigation paths that probe auth-gated routes) cannot be exercised. Frontend MFEs are running, but they will redirect to Identity for login and the request will hang/error.
2. **Browser-selection requirement unmet.** The Chrome MCP returned 2 connected browsers (`Ammar PC` deviceId `7ff57e87-cd21-4bae-8189-cb5a7829e571`, plus `Browser 2` deviceId `76d7d7ed-a9a8-4d2c-b024-bf490a99a6d6`). Per Chrome-MCP protocol the auditor must call `AskUserQuestion` with the full browser list and let the user pick — that tool is not available in this session. Auditor will not pick autonomously.

Per Phase D hard rules — **do not fake results, do not start the stack** — neither blocker can be resolved from within this session. Handing back to orchestrator.

| Metric | Value |
|---|---|
| Surfaces tested live | 0 / 9 |
| ThemeService tests passed | 0 / 8 (no runtime execution) |
| Visual bugs found | 0 (no runtime observation) |
| Pre-flight + static inputs read | Phase A report ✓ · `theme.facade.ts` ✓ · test-users seed ✓ |
| Critical blockers | 2 (stack down · browser-selection ungated) |

## ThemeService functional results (NOT EXECUTED)

| Test | Result | Why blocked |
|---|---|---|
| T1 — Default preference | ⏸ NOT RUN | Need a clean Chrome tab to read `localStorage` |
| T2 — `setTheme('dark')` | ⏸ NOT RUN | Same |
| T3 — `setTheme('light')` | ⏸ NOT RUN | Same |
| T4 — `setTheme('system')` | ⏸ NOT RUN | Same |
| T5 — `toggle()` | ⏸ NOT RUN | Same |
| T6 — OS preference change | ⏸ NOT RUN | Same |
| T7 — FOUC | ⏸ NOT RUN | Same |
| T8 — Cross-MFE consistency | ⏸ NOT RUN | Requires login → Identity service is DOWN |

Static contract review (Phase B source, `apps/host-shell/falcon-facades/theme.facade.ts`) — paper-only verification of what runtime tests *would* check:

- [CODE] `theme.facade.ts:44` — `STORAGE_KEY = 'falcon-theme'` matches the value the spec mandates.
- [CODE] `:54-56` — `_preference` reads from `localStorage` on construction, defaults to `'system'`. T1 expectation aligns.
- [CODE] `:61-67` — `_currentTheme` collapses `'system'` to OS-preference live via `_systemPrefersDark`. T6 should pass since `bindSystemMediaQuery()` at `:139-156` registers a real `matchMedia` listener.
- [CODE] `:84-86` — `effect()` re-applies on every signal change → T2/T3/T4/T5 should pass.
- [CODE] `:100-104` — `toggle()` flips dark↔light by computing the *opposite of effective*, collapsing 'system' to the displayed value. T5 expectation aligns.
- [CODE] `:163-177` — `applyTheme` sets BOTH `classList.toggle('app-dark', …)` AND `data-theme` attribute — matches Phase B spec.
- [CODE] `:74-78` — Constructor applies theme synchronously *before first paint of any signal-driven view*. Combined with the index.html inline pre-bootstrap script, T7 (FOUC) should pass. **Runtime verification of T7 specifically requires a real first-paint observation — paper review cannot confirm.**

> No T1–T8 verdicts can be issued without browser runtime.

## Surface-by-surface results (NOT EXECUTED)

### 1. Login screen (P0)
- **Light mode:** ⏸ Not screenshotted.
- **Dark mode:** ⏸ Not screenshotted.
- **Status:** This is the ONLY surface that should be reachable without backend (frontend host-shell at :4200 serves `/login` even when Identity is down — the login submission will fail but the *render* is testable). Was blocked behind browser-selection requirement.

### 2. Admin console org-hierarchy (P0)
- **Status:** ⛔ BLOCKED — requires login through Identity (DOWN). Even with browser, cannot reach `/organization-hierarchy` without an authenticated session. Note: this is the surface predicted to carry the worst leak load (Phase A: org-hierarchy-skeleton.component.ts alone = 40 hits, plus 18+ `bg-white` hits across hierarchy-tab, applications-table, org-node-drawer, org-chart and friends).

### 3. Add Client wizard (P0)
- **Status:** ⛔ BLOCKED — child route of Surface 2. Same blocker. Phase A flagged `add-client-wizard.component.html:2,37` (chrome + step host) + `client-service-row-table.component.html:30` + `falcon-native-input.component.ts:110` as 4 high-confidence leaks here.

### 4. Add User wizard (P0)
- **Status:** ⛔ BLOCKED — same as Surface 3. Phase A leaks at `add-user-wizard.component.html:2,48` and `user-permissions-step.component.html:34`.

### 5. Add Node + Edit Node wizards (P1)
- **Status:** ⛔ BLOCKED — same.

### 6. Data tables (applications + users) (P1)
- **Status:** ⛔ BLOCKED — needs auth + gateway. Phase A flagged `applications-table.component.html:7` (`bg-white` table shell) here.

### 7. Notification stack — toast + confirm + error-dialog + loader (P1)
- **Status:** Partially reachable — these are global hosts mounted in host-shell. Without backend, can only trigger them via console invocation (`inject(FalconToastService).success(...)` from devtools), not via a real action failure. Was blocked behind browser-selection requirement.

### 8. Management console (P2)
- **Status:** ⛔ BLOCKED — login required, Identity is DOWN.

### 9. Falcon Studio (P2)
- **Status:** ⛔ Likely DOWN — Studio doesn't appear on a known frontend port in this stack and was not in pre-flight URL set; cannot confirm without browser.

## Cross-reference: Phase A leaks confirmed visually

> 0 of 96 Phase A leaks visually confirmed (no live execution).

The Phase A hot-spots remain *predicted* until they get screenshots:

| Phase A leak | Surface | Predicted visual symptom |
|---|---|---|
| `org-hierarchy-skeleton.component.ts:23-153` (40 hits) | Org hierarchy loading state | Skeleton boxes stay light gray on dark canvas |
| `org-hierarchy-page-menu.component.html:64,203,213,225,283,226` | Org hierarchy page panel + inner cards | White panels visible against dark surround |
| `falcon-org-node-drawer.component.html:19` | Node drawer | White drawer on dark page |
| `applications-table.component.html:7` | Applications table | White table shell — text contrast probable PASS, surround contrast FAIL |
| `add-client-wizard.component.html:2,37` | Add Client wizard chrome | White wizard frame on dark backdrop |
| `add-user-wizard.component.html:2,48` | Add User wizard chrome | Same |
| `topbar.component.html:2,78` | Host-shell topbar + user menu | White topbar on dark canvas |
| `falcon-card.component.ts:101-103` + `card-tailwind-classes.ts:28,31,34` | Every `<falcon-card>` consumer site-wide | White cards globally |

## NEW bugs not in Phase A report

> None observable — no live runtime executed.

## Recommendations

1. **Restart the backend stack** — execute `docker compose up -d` per memory `project_local_backend_test_users_2026_05_16.md`. Specifically need: identity-svc (7777), core-gateway (7038), system-gateway (7256), zitadel (8080), mongodb (27017), kafka (9092). Memory indicates `Pass123!` is the test-user password in that build (not `Admin@1234` — the test-users.md doc lists `Admin@1234`; pick whichever the local seed scripts actually used and align via Zitadel admin).
2. **Resolve browser choice** — operator picks `Ammar PC` (deviceId `7ff57e87-cd21-4bae-8189-cb5a7829e571`) or `Browser 2` (deviceId `76d7d7ed-a9a8-4d2c-b024-bf490a99a6d6`) or asks the auditor to call `switch_browser` for a per-prompt fresh pairing.
3. **Re-run Phase D** — once 1 and 2 are resolved, the full matrix runs unmodified.
4. **Defer:** dev-only surfaces (Surface 9 — Falcon Studio) — not customer-facing; only worth covering if backend is up and it's reachable.

## Final memory update line

> Phase D BLOCKED 2026-05-17: backend stack down (identity/gateways/zitadel/mongo/kafka unreachable) + 2-browser ambiguity (AskUserQuestion tool unavailable). 0/9 surfaces tested, 0/8 ThemeService tests run. Pre-flight + paper review of `theme.facade.ts` complete; Phase A leak inventory cross-referenced as predictions. Unblock = (1) `docker compose up -d` on falcon-essentials + (2) operator picks browser deviceId. Static review confirms ThemeService contract matches Phase B spec (STORAGE_KEY='falcon-theme', dual `app-dark`+`data-theme` write, signal-driven effect re-apply, OS-preference matchMedia binding).
