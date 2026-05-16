# Gaps & Next Actions — Org Hierarchy Night Shift

**Compiled:** 2026-05-14 end-of-night-shift

## Library upgrades queued

| Code | Component(s) | Action | Affects |
|---|---|---|---|
| UC-W01 | `<falcon-angular-tree>` | Add per-row template/action slot | Lets us replace `<falcon-tree-panel>` legacy |
| P0-01 | `<falcon-angular-popup>` | Add focus-trap (WCAG) | Our unsaved-changes popup inherits gap |
| FT-01 | `<falcon-table>` Stencil core | Replace `pi pi-ellipsis-v` with token-driven icon | Users table inherits |
| P0-02 | `<falcon-angular-stepper>` | Migrate to modern stepper | Our wizards already use modern, neutral |
| G1 | `<falcon-angular-otp>` | Add `(falconComplete)` Output | W13 worked around with length check |
| D3 | `<falcon-mobile-number>` (legacy) → `<falcon-angular-phone-field>` | Lib substitution | Add Client wizard step 5 + Add User step 1 + future verify pills |
| D4 | `<falcon-photo-uploader>` (legacy) → `<falcon-angular-single-uploader>` with circular mask token | Lib substitution + token authoring | Add Client step 1 + step 5 + Add User step 1 + future Info-panel |

## Decisions taken vs reference

| # | Decision | Rationale |
|---|---|---|
| D-W12-1 | UserDetailsPage uses in-place panel swap (no child route) | Keeps tree + users state alive across the drilldown |
| D-W12-2 | UserDetailsPage save is in-memory only | Backend `updateUser` requires state service surface — deferred |
| D-W12-3 | `FALCON_NOTIFIER` imported from `@falcon/sdk` (not `@falcon`) | Repo's facade pattern |
| D-W13a | OTP dialog skips 60s resend timer | `<falcon-angular-otp-send-dialog>` bundles timer; for v1 we ship a leaner dialog. Switch later if needed. |
| D-W14a | Info-panel + settings-tab placeholder UI | Time-boxed night shift — full UI is multi-hour port; placeholder unblocks rest of flow |
| D-W15a | Chart subtree deferred | Pan/zoom math sensitive — needs runtime smoke testing |
| D-W17 | Visual parity sweep skipped | Requires user login (security policy) |

## Inheritance gaps documented in test-and-regression-report.md

23 lint errors, all verbatim port artifacts:
- 4 × `@angular-eslint/no-output-native` — wizards emit `cancel`/`submit` (DOM event name collision)
- 8 × `@angular-eslint/template/label-has-associated-control`
- 4 × `@angular-eslint/template/click-events-have-key-events`
- 4 × `@angular-eslint/template/interactive-supports-focus`
- 1 × `@angular-eslint/template/no-autofocus`
- 2 × related a11y rules

These match the reference (management-console) lint baseline. Per `feedback_strict_task_scope.md`, fixing them would deviate from reference. Recommended: dedicated a11y hardening wave across both consoles together.

## Open items requiring user confirmation

1. **OTP validation rule** — Implemented as `'all-zeros-pass'` per task brief. Flip to React rule with `OtpMockService.setMode('except-150999')` at any time.
2. **Info-panel persistence** — In-memory only for v1; backend persistence is a follow-up ticket.
3. **AddUser Verify pills** — Reference React code does NOT wire Verify in AddUser; only UserDetailsPage edit mode does. Our UserDetailsPage v1 doesn't surface verify pills either.
4. **KanbanView surfacing** — Reference renders `<falcon-org-kanban>` when `usersView === 'board'`; we render "not surfaced in v1" placeholder. Easy flip when ready.

## Things that explicitly did NOT happen this night shift

- No commits made
- No pushes made
- No edits in `libs/`
- No edits in `apps/management-console/`
- No edits in `apps/host-shell/` beyond the existing W5 NavItem
- No new PrimeNG imports
- No new SCSS files
- No hardcoded hex colors
- No `git reset` / `git push --force` / branch deletion / any destructive ops

## Trigger phrases for next session

| Phrase | Resumes |
|---|---|
| "continue Wave 14 info-panel port" | Info-panel full UI (17 fields + edit toggle) |
| "continue Wave 14 settings-tab port" | Settings tab view+edit mode |
| "continue Wave 15 chart port" | Org chart subtree (chart-card + toolbar + pan-zoom directive + layout service) |
| "run W17 visual parity sweep" | Requires user-driven login first |
| "run a11y lint hardening" | 23 lint errors + reference's identical ones |
| "commit" | Stage implementation files + brain reports |
| "push" | Push to remote (only after confirmed code review) |
