# falcon-wizard-finalization — GAPS AND UPGRADES

## Missing capabilities (active source verified)

### G1 — No `error` / `submitting` outputs (P2)

`[CODE]` The host learns success via `(finalized)` and cancel via `(cancelled)`, but there is **no `(error)` output** and no `(submittingChange)`. A host that wants to react to the failed send (e.g. keep the wizard open, log analytics, or re-enable a custom control) cannot — the error is consumed entirely by the internal `showSubmitErrorToast` (ts:269-277). The host's `submitFn` Observable IS observable by the host, but the orchestrator gives no event hook for the error/in-flight transitions.

**Recommended fix (P2):** add `@Output()/output() error = new EventEmitter<unknown>()` emitted from the error branch (alongside the toast), and optionally a `(submittingChange)` boolean. Additive, zero break.

### G2 — Toast `source` is hardcoded (P3)

`[CODE]` ts:275 — `source: 'wizard-finalization'` is a fixed string in the orchestrator `show()` call. When two finalization mounts (Add Client + Add User) are on the same page, their error toasts share one source key — fine today, but a future per-flow dedupe/telemetry would want it parameterized. **Fix:** add an optional `@Input() toastSource?: string` (default `'wizard-finalization'`).

### G3 — Component name vs responsibility coupling (P3 — naming/doc)

`[CODE]` The selector is `falcon-angular-wizard-finalization` and the file talks about "wizard finalization", but the component is really a **credential-delivery close-out** (channel pick → send → confirm). It is mounted ALONGSIDE the legacy `<falcon-stepper>`, not inside `<falcon-angular-wizard>`, and works for any flow that supplies a `submitFn`. The name implies a tighter coupling to the wizard shell than exists. **Doc-only:** clarify in OVERVIEW (done) that it is wizard-agnostic; do NOT rename (3 live consumers).

### G4 — `submitFn` must be an Observable (no Promise overload) (P3)

`[CODE]` `submitFn: (method) => Observable<unknown>` — the rxjs gate (`concatMap`/`catchError`) assumes an Observable. A host with a Promise-based API must wrap with `from(...)`. **Doc + optional fix:** accept `Observable | Promise` and normalize via `from()`.

### G5 — `MIN_LOADER_VISIBLE_MS` is a module constant, not configurable (P3)

`[CODE]` ts:82 — `const MIN_LOADER_VISIBLE_MS = 600;` is fixed. A flow wanting a different perceivable threshold cannot tune it per instance. **Fix:** optional `@Input() minLoaderVisibleMs?: number` (default 600). Low value.

### G6 — Hardcoded English copy defaults (P3)

`[CODE]` ts:124-150 — every label/title/body has an English literal default. Consumers MUST pass `… | translate`. This matches the wider library convention (consumer-owns-i18n), but a forgotten input ships English to an Arabic user. **Doc** the i18n requirement loudly (done in USAGE).

## Missing accessibility features

- **A1 (P3):** The orchestrator renders no UI (`display: contents`), so a11y is entirely delegated to the two child dialogs + the loader overlay + the orchestrator toast. **Not a gap in THIS component**, but the picker→loader→success focus-management chain is NOT verified end-to-end this pass — flag for a runtime a11y audit of the composed flow.
- **A2 (P3):** On submit error, focus is not explicitly returned to a known element (the picker is closed, the toast appears top-right). Confirm the focus lands somewhere sensible (likely the page) — verify at runtime.

## Missing tests

- `[CODE]` **No `*.spec.ts` found** for `falcon-wizard-finalization`. GAPs: (a) `onSend` single-shot guard (second call no-ops); (b) success path → loader dismissed → `successOpen` true → `(finalized)` on close; (c) error path → loader dismissed → orchestrator `show({category:'business-error'})` called with the right message (BUG-14: clean message vs fallback vs bracket-sentinel); (d) the minimum-visibility gate (fast vs slow backend); (e) `ngOnDestroy` dismisses an in-flight loader. These are pure-logic + service-mock tests (no Stencil), so they are straightforward in Vitest.

## Missing Tailwind / token parity

- n/a — the component has no own tokens (TOKENS.md). Parity concerns belong to the two child dialogs.

## Performance risks

- The rxjs gate adds at most one `timer(remaining)` per submit — negligible. `takeUntilDestroyed` + the `ngOnDestroy` loader-dismiss prevent leaks. **No real risk.**

## Visual / interaction risks

- `[CODE]` The deliberate **inline success ack** (not the orchestrator) is load-bearing UX (2026-05-24 revert) — a future refactor that "consolidates" it back through `FalconMessageOrchestratorService` would re-introduce the wrong small red alert. Guard with a comment (present) and ideally a test.
- The minimum-visibility gate means the success dialog appears at least ~600 ms after Send even on instant backends — intentional, but a perf-obsessed reviewer might "optimize" it away. Document why it exists (present in the file header).

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | `(error)` (+ optional `(submittingChange)`) output | P2 |
| (test) | Vitest spec (single-shot / success / error / gate / destroy) | P2 |
| G2 | Parameterize toast `source` | P3 |
| G4 | Accept `Promise` in `submitFn` | P3 |
| G5 | Configurable `minLoaderVisibleMs` | P3 |

## Fix-shared-vs-per-page
All gaps belong in this **shared orchestrator** — it is reused by 3 mounts across both consoles. Per-page reimplementation of the picker↔loader↔success state machine is exactly what this component exists to prevent.

## Workarounds (if upgrade blocked)
- For G1 today: observe the error inside the host `submitFn` (`tap`/`catchError`) before returning the Observable.
- For G4 today: `submitFn = (m) => from(this.api.send(m))`.
- For G5 today: accept the 600 ms default (it is well-tuned).

## Deep-Dive Sweep Findings (2026-06-03 — B20)

**Consumer count: 3 element mounts** (admin Add Client + Add User; mgmt Add User) (`[CODE]` grep `<falcon-angular-wizard-finalization`). NEW dossier (created this pass).

- **Best-practice posture is strong** — modern signal `input()`/`output()`, `computed`, `inject()`, `takeUntilDestroyed`, `OnPush`, `ngOnDestroy` cleanup, pure-orchestration (no HTTP), thorough self-documenting comments, the perceivable-loader gate, and BUG-14 message sanitation. This is one of the cleaner components in the library.
- **All findings are `safe-local`** (missing `(error)` output / hardcoded toast-source / Promise overload / configurable gate / English defaults / missing spec / naming-doc). **No HIGH-RISK items.**
- No deletion/promotion flags — ACTIVE / IN PRODUCTION.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20, NEW dossier) against the full component source. Missing `(error)` output (G1), hardcoded `source: 'wizard-finalization'` (G2, ts:275), Observable-only `submitFn` (G4), module-const gate (G5), and zero specs confirmed. All findings `safe-local`. Component stays ACTIVE/IN-PRODUCTION.
