# falcon-unsaved-changes-host — DECISION

## Brain SK final recommendation

**STATUS: SERVICE ACTIVE + canonical leave-gate (use it). HOST is a no-op shell flagged for removal. The live modal render is `FalconMessageOrchestratorService` + `FalconModalAdapterComponent`.**

`FalconUnsavedChangesService` is the single, platform-wide "discard & leave?" guard — inject it and gate every navigation/leave path through `confirm()`. Do NOT mount a fresh `<falcon-unsaved-changes-host>` (it renders nothing in Phase 5).

## Use this unit for

- A **route-guard-driven** unsaved-changes leave gate (router `CanDeactivate`, tab switch, tree-node select, in-page menu, wizard close).
- A platform-consistent discard/stay decision (identical copy + behavior everywhere).
- Aggregate page gates (e.g. `confirmDiscardIfDirty()`) that funnel all leave paths through one prompt.

## Avoid this unit for

- **Generic confirmations** (delete / publish / archive) → `FalconConfirmService` / `<falcon-angular-popup>`.
- **Branded creation-success acks** → `<falcon-angular-completion-success-dialog>`.
- **Transient feedback** → `FalconMessageOrchestratorService.show()` toast.
- **Mounting a new host** → it renders nothing; the orchestrator modal-adapter is the renderer.
- **Relying on `hintOverride` / `cancelLabelOverride`** → dropped/unmapped in Phase 5.

## Preferred render path

No render path in this unit. The live modal is `FalconModalAdapterComponent` (orchestrator-bound) → `<falcon-angular-popup>`. Do NOT mount `<falcon-unsaved-changes-host>` for new shells.

## Required upgrades before wider use

None block the SERVICE (it works + is heavily used). G-HINT-DROP (dropped hint line) is a real public-API gap worth fixing; G-DEAD-HOST is cleanup.

## Relationship to other components

| Unit | Relationship |
|---|---|
| `FalconMessageOrchestratorService` | **The authority `confirm()` forwards to** (`action-required` category). Canonical. |
| `FalconModalAdapterComponent` | The live modal renderer (orchestrator-bound). |
| `<falcon-angular-popup variant="unsaved">` | What the dead host WOULD render; also what the modal-adapter composes. |
| `FalconConfirmService` / `<falcon-angular-confirm-dialog-host>` | Sibling for GENERIC confirms (also orchestrator-routed). |
| `FalconMessageService` + `<falcon-angular-message-host>` | Sibling B18 shim+no-op-host pair (toasts). |
| `confirmDiscardIfDirty()` (org-hierarchy) | The canonical CONSUMER aggregate gate. |

## Exact rule for future implementation tasks

1. **Unsaved-changes leave guard?** Inject `FalconUnsavedChangesService`; gate the leave path with `confirm()`. Return `of(true)` when not dirty.
2. **Wire into a `CanDeactivateFn`** (and tab/tree/menu/wizard-close paths). For multi-surface pages, build ONE aggregate gate that all paths call.
3. **Pass pre-translated** `titleOverride` / `bodyOverride` / `confirmLabelOverride` / `cancelLabelOverride`. **Fold any hint into `bodyOverride`** (`hintOverride` is dropped).
4. **On `confirm()=true`, reset the dirty surface BEFORE proceeding.**
5. **Treat `confirm()` as one-shot**; never overlap two `confirm()` calls.
6. **Never** mount a new `<falcon-unsaved-changes-host>`, use it for non-leave confirms, or treat `true` as "save".

---

## Dynamic capability assessment

### 1. What is static today?
- The orchestrator routing is fixed `category:'action-required'` + `source:'falcon-unsaved-changes'`.
- English default copy (`'You have unsaved changes'` / `"You've edited fields…"` / `'Discard & leave'`).
- The host's `@if (active())` → `<falcon-angular-popup variant="unsaved">` — but `active()` is always null (dead).
- `hintOverride` / `cancelLabelOverride` are accepted but have no Phase-5 destination.

### 2. What is already dynamic through inputs/outputs?
- Service: `confirm(options)` → `Observable<boolean>`, `accept()`, `reject()`, `active` (dead signal).
- Options: `titleOverride` / `bodyOverride` / `confirmLabelOverride` (mapped) + `hintOverride` / `cancelLabelOverride` (dropped/unmapped).
- Host: no inputs/outputs.

### 3. What is already dynamic through slots / ng-template?
- None.

### 4. What is dynamic through token/theme overrides?
- Nothing in this unit. The live modal's visuals are `falcon-popup`'s (theme-token-driven).

### 5. What is dynamic through Tailwind classes?
- N/A — no surface.

### 6. What is missing to make this unit reusable across pages?
- Nothing for the SERVICE — it is already the cross-page gate (used by org-hierarchy + both wizards + info-panel, admin + mgmt).
- A working `hint` (G-HINT-DROP) to restore the pre-Phase-5 hint line.

### 7. What capability should be added to the shared component (not a page hack)?
- Restore `hint`/`cancelLabel` end-to-end via the orchestrator message shape (G-HINT-DROP) — every caller benefits.
- Otherwise, nothing — new confirm capability belongs in the orchestrator / `FalconConfirmService`.

### 8. What flags / options / templates / slots would make it better?
- `hint` carried through to the modal (G-HINT-DROP).
- Optionally a `tone?: 'danger' | 'warning'` to vary the discard button intent (currently fixed by the orchestrator modal-adapter).

### 9. What is the safest upgrade path?
1. **Phase A (doc-only):** fix the stale host banner (G-STALE-BANNER). Mark the host `@deprecated`.
2. **Phase B (HIGH-RISK-QUEUE):** EITHER wire `hint`/`cancelLabel` into `FalconMessageRequest` + the modal-adapter, OR remove `hintOverride`/`cancelLabelOverride` from the options (breaking) (G-HINT-DROP).
3. **Phase C (HIGH-RISK-QUEUE):** delete `<falcon-unsaved-changes-host>` + the `app.ts` mount + barrel export; drop the dead `_active` slot. Triage with the B18 message-service G-DEAD-HOST.
4. **Phase D:** add a service contract spec (G-TEST).

### 10. What is risky to change because other pages depend on it?
- **`confirm(): Observable<boolean>` one-shot contract** — `confirmDiscardIfDirty()` + both wizards rely on the single-emit + `true`=discard / `false`=stay semantics. Do not change the polarity or the completion behavior.
- **`providedIn:'root'` singleton via MF** — flipping scope breaks the "one gate across host-shell + remotes" guarantee.
- **The barrel export `FalconUnsavedChangesHostComponent`** — removing it is a public-API break (G-DEAD-HOST is queued for that reason).
- **The `FalconUnsavedChangesOptions` shape** — removing `hintOverride`/`cancelLabelOverride` (G-HINT-DROP option b) is a breaking change for the 8 live callers that pass them; sequence carefully.
- **The sequential-cancel behavior** — any consumer relying on overlapping confirms resolving the first `false` would shift if changed.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18). Recommendation: service ACTIVE/canonical leave-gate / host DEAD-flagged / orchestrator canonical. `confirm()` one-shot + sequential semantics + the dropped `hintOverride` confirmed in source. Two HIGH-RISK-QUEUE items (G-HINT-DROP, G-DEAD-HOST) raised, not actioned.
