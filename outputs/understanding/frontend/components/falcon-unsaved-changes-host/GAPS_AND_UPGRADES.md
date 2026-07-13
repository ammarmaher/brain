# falcon-unsaved-changes-host — GAPS AND UPGRADES

> **This file holds the B18 AUDIT findings for this unit in prose.** Findings rows also in `plans/library-deep-dive/FINDINGS/B18.md`. **We fix NOTHING this pass.**

## Dossier-vs-code drift (the headline finding)

### DRIFT-SUPERSESSION — the host no longer renders the popup (🟠)

`[CODE]` `falcon-unsaved-changes.service.ts:1-14` — the host's own banner (`falcon-unsaved-changes-host.component.ts:1-10`) says it "renders `<falcon-angular-popup variant=unsaved>` when a request is active." **Phase 5 (2026-05-24) changed that:** the SERVICE routes `confirm()` through `FalconMessageOrchestratorService.show({category:'action-required', actionCallback, cancelCallback})`; the host's `active()` is always null; the orchestrator's `FalconModalAdapterComponent` renders the modal. This NEW dossier documents the supersession (the host banner is stale — G-STALE-BANNER).

## Missing / risky capabilities (active source verified)

### G-DEAD-HOST — `<falcon-unsaved-changes-host>` is a no-op still mounted (🟠, HIGH-RISK-QUEUE)

`[CODE]` `falcon-unsaved-changes-host.component.ts:28-41` — `active = this.service.active` is always null in Phase 5 → the `@if (active())` popup NEVER mounts. Still mounted in `apps/host-shell/src/app/app.ts:9,32,57`. The live modal render is `FalconModalAdapterComponent`. Service JSDoc: "the `<falcon-unsaved-changes-host>` mount (still in app.ts pending its own removal in a later sweep) compiles. It is always null in Phase 5." (`falcon-unsaved-changes.service.ts:13-14`).

**Why HIGH-RISK-QUEUE:** removing a mounted shell component + barrel export is a public-API/contract change; do it only once the orchestrator route is confirmed final. The SERVICE stays.

**Recommended (deferred):** delete `FalconUnsavedChangesHostComponent` + its template + the `app.ts` mount + barrel export; drop the dead `_active`/`active` slot from the service. Triage TOGETHER with the B18 `falcon-message-service` G-DEAD-HOST (both legacy hosts + their orchestrator successors are mounted side-by-side in `app.ts`).

### G-HINT-DROP — `hintOverride` silently dropped; `cancelLabelOverride` unmapped (🟠, HIGH-RISK-QUEUE)

`[CODE]` `falcon-unsaved-changes.service.ts:21-27` exposes `hintOverride` + `cancelLabelOverride` on the public `FalconUnsavedChangesOptions`, and EVERY live caller passes both (`hierarchy-page-state.service.ts:240-242`, `add-user-wizard.component.ts:407-409`). But Phase 5's `orchestrator.show()` mapping (`:71-81`) has **no `hint` and no `cancelLabel`** — the orchestrator `action-required` message type (`falcon-message-orchestrator.types.ts:38-82`) carries `actionLabel`/`actionCallback`/`cancelCallback`/`hideCancel` only. So `hintOverride` is dropped (the pre-Phase-5 `<falcon-angular-popup variant="unsaved">` rendered a hint line) and `cancelLabelOverride` does nothing (the modal-adapter uses its default cancel label).

**Why HIGH-RISK-QUEUE:** it is a public-API contract gap with a user-visible regression (missing hint line; possibly wrong cancel-button label). Fixing it means either extending the orchestrator message shape (cross-cutting) or removing the options (breaking).

**Recommended (queued):** EITHER (a) add `hint`/`cancelLabel` to `FalconMessageRequest` + thread them into the modal-adapter, OR (b) remove `hintOverride`/`cancelLabelOverride` from `FalconUnsavedChangesOptions` and tell callers to fold hint into `bodyOverride`. Until then, callers should fold hint into `bodyOverride`.

### G-I18N — hardcoded English default copy (🟡, safe-local)

`[CODE]` `:69-77` — defaults `'You have unsaved changes'` / `"You've edited fields on this page that haven't been saved yet…"` / `'Discard & leave'` are hardcoded English (the file notes `@falcon/ui-core` has no `TranslateService` dep). Live callers pass translated overrides; a bare `confirm()` shows English.

**Recommended:** document the "caller MUST pass translated overrides" contract (done in API/USAGE/BUSINESS). No code change — the no-i18n-in-ui-core rule is intentional.

### G-STALE-BANNER — host banner describes live popup rendering (🟡, safe-local)

`[CODE]` `falcon-unsaved-changes-host.component.ts:1-10` describes the host as actively rendering `<falcon-angular-popup variant="unsaved">` with no note that it is now inert. Misleads a reader into thinking the host is the renderer.

**Recommended:** update the banner to flag the no-op/pending-removal status (the SERVICE banner at `falcon-unsaved-changes.service.ts:1-14` is already accurate).

## Sequential-resolve subtlety (not a gap, but a documented behavior)

`[CODE]` `:46-50` — a new `confirm()` while one is in-flight resolves the previous `false`. `:92-99` — `accept()`/`reject()` are "courtesy shims" for pre-Phase-5 callers. Correct + intentional; surfaced in API/INTEGRATION so an integrator isn't surprised when two overlapping leave-gates collapse to "stay on the first".

## Missing accessibility features

- N/A for the dead host. The live a11y is `falcon-popup`'s (rendered by the modal-adapter): `role="dialog"` + `aria-modal`, native-`<dialog>` Top-Layer focus containment, ESC/backdrop → `cancelCallback`.

## Missing tests

- `[CODE]` listing 2026-06-03 → **no `.spec.ts` for the service or host.** The orchestrator routing is tested separately (`apps/host-shell/tests/falcon-message-orchestrator.spec.ts`), but the unsaved service's own contract is untested in isolation.
- **G-TEST (P3):** add a service spec — `confirm()` resolves `true` on `actionCallback`, `false` on `cancelCallback`/unsubscribe, emits once + completes, a second `confirm()` resolves the first `false`, and `dismissByCorrelationId` fires on teardown.

## Missing Tailwind / token parity

N/A — no token contract (TOKENS.md). Visual delegates to `falcon-popup`.

## Performance risks

- The dead `signal(null)` + the host's `@if (active())` (always false) are near-zero cost but pure dead-weight. Removing the host (G-DEAD-HOST) reclaims a trivial amount. The `confirm()` Observable + correlationId map are lightweight.

## Visual / interaction risks

- None from this unit (renders nothing). The live modal's interaction is `falcon-popup`'s. The one user-visible regression is the dropped hint line (G-HINT-DROP).

## Old per-page pattern now resolved

The unit's centralization SOLVED the prior "every page mounts its own `<falcon-angular-popup variant=unsaved>`" duplication — one service + one gate (`confirmDiscardIfDirty()`) now covers the whole org-hierarchy page + both wizards + info-panel, mirrored across admin + mgmt. RESOLVED (this is the unit's reason to exist).

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G-HINT-DROP | Wire `hint`/`cancelLabel` into the orchestrator OR remove the options | P2 | HIGH-RISK-QUEUE |
| G-DEAD-HOST | Delete the no-op `<falcon-unsaved-changes-host>` + app.ts mount | P2 | HIGH-RISK-QUEUE |
| G-TEST | Service contract spec | P3 | safe-local |
| G-I18N | Document caller-supplies-translation contract | P3 (done) | safe-local |
| G-STALE-BANNER | Fix the stale host banner | P3 | safe-local |

## Fix-shared-vs-per-page

All findings belong in the **shared library** (`falcon-ui-core`). The unit is itself the centralization of a former per-page pattern — there is no per-page work.

## Deep-Dive Sweep Findings (2026-06-03 — B18)

**Consumer count: 8 app files call `confirm()` (org-hierarchy gate + both wizards + info-panel + menus, mirrored admin/mgmt) + 1 no-op host mount.** ([CODE] grep.)

- **SUPERSESSION confirmed** — service routes to the orchestrator; host is a no-op.
- **Deletion/promotion flag:** `<falcon-unsaved-changes-host>` → **promote G-DEAD-HOST to the removal queue** (HIGH-RISK-QUEUE; do not auto-delete). The `FalconUnsavedChangesService` stays ACTIVE + heavily used.
- **Two HIGH-RISK-QUEUE findings:** G-HINT-DROP (public-API gap + user-visible regression) and G-DEAD-HOST. Others `safe-local`. See FINDINGS/B18.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18) against `falcon-unsaved-changes.service.ts` + `falcon-unsaved-changes-host.component.ts` + the orchestrator types + the live callers. G-HINT-DROP confirmed by cross-referencing the options type vs the orchestrator message shape. Deletion flag (G-DEAD-HOST) raised, not actioned.
