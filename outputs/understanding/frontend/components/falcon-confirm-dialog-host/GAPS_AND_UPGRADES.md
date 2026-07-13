# falcon-confirm-dialog-host — GAPS AND UPGRADES

## Headline finding (2026-06-03, B15)

The **SERVICE is healthy and live**; the **HOST element is dead-but-mounted**. `[CODE]` Since Phase 5 (2026-05-24) `FalconConfirmService` is a shim over `FalconMessageOrchestratorService` (`[CODE]` falcon-confirm.service.ts:1-16); `.confirm()` renders `<falcon-angular-popup variant="error">` via the modal-adapter, and the host's `@if (active())` body never instantiates because `active()` is always null (`[CODE]` :59-60). The host's source even flags itself for removal (`[CODE]` :14-15). This is the central observation; the gaps below follow from it.

## Missing capabilities / cleanup items

### G1 — Dead host element still mounted (P2 — safe-local, scoped)

`[CODE]` `<falcon-angular-confirm-dialog-host>` is imported + mounted in `app.ts` (:4, :31, :53) but renders nothing in Phase 5. It still pulls in `FalconAngularAlertDialogComponent` as an import (`[CODE]` host.component.ts:35) and ships a 22-line dead template (`[CODE]` .html). The service comment explicitly says the host is "still in app.ts pending its own removal in a later sweep" (`[CODE]` service.ts:14-15).

**Recommended fix:** remove the host mount from `app.ts` + delete the host component + .html (keep `FalconConfirmService` + `index.ts`'s service export). **Risk-class: safe-local but app-scoped** — touches `host-shell/app.ts` (a shell file) + the barrel; verify no other mount + that `index.ts` still exports the service. Queue if the reviewer prefers a deliberate removal commit.

### G2 — `FalconConfirmRequest` carries inert fields (P3 — doc/API hygiene)

`[CODE]` `severity` / `icon` / `cancelLabel` / `closeOnBackdrop` / `closeOnEsc` / `hideConfirm` are accepted on the request shape (`[CODE]` service.ts:30-41) but **ignored** by the Phase-5 popup path (only `title` / `body` / `confirmLabel` / `hideCancel` are forwarded — `[CODE]` :91-105). Callers pass `severity: 'danger'` (`[CODE]` contact-groups-list.component.ts:390) expecting a red-tinted prompt; they get the generic error popup regardless.

**Recommended fix (P3):** either (a) forward `severity`/`icon`/`cancelLabel` into the orchestrator request + teach the modal-adapter to honor them, or (b) trim the inert fields from `FalconConfirmRequest` and document that confirm is always error-styled. Today it is a silent no-op; at minimum the JSDoc should warn callers (it partially does — `[CODE]` :23-28).

### G3 — Two near-identical confirm services (P3 — design clarity)

`FalconConfirmService` (generic yes/no) and `FalconUnsavedChangesService` (route-leave gate) are separate services + separate hosts with different request shapes (`title/body` vs `titleOverride/bodyOverride/hintOverride`). Both return `Observable<boolean>`, both shim the orchestrator. The split is intentional (different copy/affordance) but invites the wrong-service trap (`[CODE]` hierarchy-page-state.service.ts:236-243 uses BOTH in one method).

**Recommended fix (P3):** document the decision boundary crisply (done in this dossier's USAGE) or unify behind one service with a `kind: 'confirm' | 'unsaved'` discriminator. Low priority — both work today.

### G4 — Legacy `active()` signal + `accept()`/`reject()` shims are vestigial (P3)

`[CODE]` `active` (always null), `accept()`, `reject()`, `severityFor()`, `defaultConfirmLabel/defaultCancelLabel` (`[CODE]` service.ts:59-60, 122-128; host.ts:54-62) exist only to keep the dead host compiling. Once G1 lands (host removed), these can be deleted from the service.

**Recommended fix:** bundle with G1 — remove the vestigial surface when the host is removed.

## Missing accessibility features

- a11y belongs to the rendered substrate. In Phase 5 that is `<falcon-angular-popup>` (native `<dialog>` Top-Layer, focus-trapped). No a11y gap on the host itself (it renders nothing). The legacy alert-dialog path (dead) carried `role="alertdialog"` for danger/warning — that semantic is now the popup's responsibility (verify the popup sets an appropriate role for a destructive confirm).

## Missing tests

- `[CODE]` No dedicated `.spec.ts` for the host or the service in the component folder. The behavior IS exercised by `apps/host-shell/tests/falcon-message-orchestrator.spec.ts` (the orchestrator path, incl. `hideCancel` funds popups — `[CODE]` :499). **Gap:** a focused spec for `FalconConfirmService` (sequential supersession resolves prior as `false`; teardown resolves `false` + dismisses by correlationId; `settled` idempotency) would lock the contract independent of the orchestrator.

## Missing Tailwind / token parity

- N/A — the host has no chrome. Token parity is the substrate's concern (popup ↔ alert-dialog) — see `[BRAIN-OUT]` `components/falcon-popup/` + `components/falcon-alert-dialog/`.

## Performance risks

- None meaningful. The dead host adds one always-false `@if` + an unused alert-dialog import to the shell bundle — negligible, but cleanable via G1.

## Visual / interaction risks

- `severity`-inert (G2): a destructive confirm and an informational confirm look identical in Phase 5. Could under-signal danger. Worth fixing if product wants a softer "info" confirm.

## Recommended upgrade priority

| ID | Title | Priority | Risk-class |
|---|---|---|---|
| G1 | Remove the dead host mount + component | P2 | safe-local (app-scoped) |
| G2 | Honor or trim the inert `FalconConfirmRequest` fields | P3 | safe-local |
| G4 | Delete vestigial `active()`/`accept()`/`reject()` (with G1) | P3 | safe-local |
| G3 | Clarify/unify the two confirm services | P3 | design (queue) |
| — | Add a focused `FalconConfirmService` spec | P3 | safe-local |

## Fix-shared-vs-per-page

All gaps belong in the shared lib (`falcon-ui-core`) — the host/service ARE the shared chokepoint. No per-page hacks exist.

## Wave findings

- **Deletion flag:** YES for the HOST ELEMENT (G1) — dead-but-mounted, source self-flagged for removal. NOT for the service (`FalconConfirmService` is live + preferred).
- **Promotion flag:** none.

## Deep-Dive Sweep Findings (2026-06-03 — B15, NEW dossier)

**Consumer count:** host mount = 1 (`app.ts:53`); `FalconConfirmService` callers = 8 files / 9+ call sites.

- The service is the **live, canonical confirm primitive**; the host is a **Phase-5 orphan**.
- New gaps: G1 (dead host), G2 (inert request fields), G4 (vestigial service surface). All `safe-local` except G3 (design, queue).
- See FINDINGS/B15.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15 — NEW). Dead-host + always-null `active()` + self-flagged-for-removal re-confirmed in source; inert-field set verified against the modal-adapter forwarding. Deletion flag raised for the host element (G1) only. No on-disk component spec verified.
