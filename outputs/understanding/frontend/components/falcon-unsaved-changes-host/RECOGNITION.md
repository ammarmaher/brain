# falcon-unsaved-changes-host — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify when the answer is the unsaved-changes leave-gate, and how to compose it.

## Visual fingerprint

`[CODE]` **The service + host have NO visual fingerprint of their own** — and in Phase 5 the host renders nothing. What a viewer sees is an **action-required modal** (the `unsaved` variant of `<falcon-angular-popup>` — a centered card with a warning icon chip, a title "You have unsaved changes", a body, and two buttons: a primary/danger **Discard & leave** + a secondary **Stay on page**) rendered by the orchestrator's modal-adapter. You never recognize an "unsaved-changes-host" from a screenshot; you recognize a **discard/stay leave-confirmation modal**, then choose THIS service as the mechanism that fires it (because it is a *leave guard*, not a generic confirm).

## When the design points HERE

A design / snippet implies the unsaved-changes leave-gate (not a generic confirm) when **all** of these hold:
- The prompt appears **when leaving a page / closing a wizard with unsaved edits** (router navigation, tab switch, tree-node select, in-page menu, wizard close) — i.e. it is tied to **navigation**, not a button.
- The decision is specifically **"discard your changes & leave"** vs **"stay"** — a data-loss guard.
- The same prompt should be **uniform across the whole app** (one gate, one copy).

If it is a one-off "Delete this record?" / "Publish?" confirm tied to a button → use `FalconConfirmService` / `<falcon-angular-popup>` directly, NOT this service.

## Cross-library equivalents

| Library | Their equivalent | Parity notes |
|---|---|---|
| Angular Router | a `CanDeactivate` guard returning `Observable<boolean>` + a confirm dialog | **direct structural match** — `FalconUnsavedChangesService.confirm()` IS the Observable a `CanDeactivateFn` returns. |
| React Router | `useBlocker` / `usePrompt` + a modal | the blocker-prompt pattern maps to this service. |
| MUI / Ant / shadcn | a custom `<Dialog>`/`<Modal>` opened from a navigation blocker | the dialog is `falcon-popup`; the *blocker* is this service. |
| Browser native | `window.onbeforeunload` (for tab close) | this service is the in-app SPA equivalent (richer, themed, blocking modal). |
| plain JS | `if (!confirm('Discard?')) return;` | always replace with `FalconUnsavedChangesService.confirm()`. |

## Use THIS vs siblings

| If the scenario shows… | Use | Not |
|---|---|---|
| a leave/navigation guard for unsaved edits (discard vs stay) | `FalconUnsavedChangesService.confirm()` | a hand-rolled popup per page |
| a generic decision tied to a button (delete/publish/archive) | `FalconConfirmService` / `<falcon-angular-popup>` | this service |
| a branded creation-success ack (no buttons) | `<falcon-angular-completion-success-dialog>` | this service |
| transient success/error feedback | `FalconMessageOrchestratorService.show()` toast | this service |
| the whole org-hierarchy leave gate | the existing `confirmDiscardIfDirty()` central gate (which calls this service) | re-implementing per-surface |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inject the service** — `private readonly unsaved = inject(FalconUnsavedChangesService)`. The HOST is already mounted once in the shell (no-op in Phase 5); do NOT mount a new one.
2. **Gate the leave path** — return `of(true)` when not dirty; else `return this.unsaved.confirm({ titleOverride, bodyOverride, confirmLabelOverride, cancelLabelOverride })`. Wire into a `CanDeactivateFn` (and any tab/tree/menu leave path).
3. **Pre-translate overrides** — pass translated strings (no i18n hook). Fold any hint into `bodyOverride` (`hintOverride` is dropped).
4. **On `true`, discard then proceed** — reset the dirty surface BEFORE the navigation completes (the org-hierarchy gate does this in a `tap`).
5. **No slots / no templates / no tokens** — the modal is `falcon-popup` (styled via its own tokens/utilities). Nothing to customize on this unit.
6. **Upgrade** — need a hint line back? That's G-HINT-DROP — raise it; do not hand-roll a separate hint.
7. **Wrapper** — for a multi-surface page, build ONE aggregate gate (like `confirmDiscardIfDirty()`) that all leave paths call, rather than calling `confirm()` from each.

## Anti-patterns

- Re-implementing a per-page `<falcon-angular-popup variant="unsaved">` — use the central service.
- Mounting a second `<falcon-unsaved-changes-host>` — renders nothing; the singleton service is the contract.
- Relying on `hintOverride` (dropped) or `cancelLabelOverride` (unmapped) in Phase 5.
- Subscribing to `confirm()` twice / firing overlapping `confirm()` calls (the first resolves `false`).
- Using it for non-leave confirmations (delete/publish) — wrong semantics.
- Passing untranslated keys to the overrides.
- Treating `confirm()=true` as "save" — it means "discard".

## Verification
🟡 CODE-DERIVED from `falcon-unsaved-changes.service.ts` + `hierarchy-page-state.service.ts` + the orchestrator/popup. The "no visual fingerprint — recognize the discard/stay modal" framing is `[INFERRED]`. The `CanDeactivate`/`useBlocker` lineage ✅ matches the Observable-returning `confirm()`. Cross-library map `[INFERRED]`.
