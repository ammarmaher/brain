# falcon-wizard-finalization — OVERVIEW

> **Component class kind:** Angular **standalone composite orchestrator** (NOT a dual-render Stencil component). It lives under `libs/falcon-ui-core/src/angular-wrapper/components/` alongside the CVA wrappers but has **no Shadow tag, no `-tw` twin, no token file, and is not a ControlValueAccessor.** This dossier adapts the 9-file shape accordingly (no Stencil/Tailwind-twin/TOKENS-by-tag sections).

## Component purpose
The reusable **end-of-wizard finalization orchestrator**. It runs the shared "credentials sending" sequence that closes ANY entity-creation wizard (Add Client, Add User, future flows):

```
channel-selection popup → Send →
  picker closes immediately + central loader-overlay shows + host submitFn() fires →
    success → loader hides → inline branded completion-success dialog → (closed) emits `finalized`
    HTTP error → loader hides → orchestrator business-error toast (5s); success ack NOT shown
```

`[CODE]` falcon-wizard-finalization.component.ts:1-60 (file header). It is the single component that replaced the previous per-wizard "separate sending-credentials + completion-success dialog mounts" — Add Client + Add User now share the IDENTICAL finalization flow; only the `submitFn` and the `open` signal differ.

## Business / UI use case
- **Add Client finalization** — after the wizard's Finish, the operator picks a delivery channel (email / SMS / both) and the account-owner credentials are sent; on success a branded "Credentials sent to the user" ack shows.
- **Add User finalization** — identical flow for a newly added user (the OTP code-entry step is dropped; the wizard's Finish parks the payload and this mount drives the channel popup).
- Any future "create entity → send credentials → confirm" close-out.

## When to use it / when NOT to use it
**Use it for:**
- The terminal step of an entity-creation wizard where the operator chooses a credential delivery channel and a host API call must run behind a perceivable loader, ending in a success ack or an error toast.

**Do NOT use it for:**
- The wizard chrome itself (stepper + steps + Next/Back/Finish) → that is `<falcon-angular-wizard>` (a different component; this orchestrator is mounted **alongside** the wizard/stepper, not inside it).
- A plain confirmation dialog → use `<falcon-angular-popup>` / the message orchestrator directly.
- The channel picker alone (without the loader+success+error state machine) → use `<falcon-angular-sending-credentials-dialog>` directly.
- Any flow where the API call must NOT be host-injected (this component requires the host to supply `submitFn`).

## Status
**ACTIVE / IN PRODUCTION.** `[CODE]` org-hierarchy-page-menu.component.html:399/413 (admin: Add Client + Add User) + mgmt :399 (Add User). The most recent state (per the file header) is the **2026-05-24 addendum partial-revert**: the success ack is an INLINE `<falcon-angular-completion-success-dialog>` (the Phase 3 attempt to route it through the orchestrator's modal-adapter rendered the wrong small red OK/Cancel alert); the submit-error toast STILL routes through `FalconMessageOrchestratorService` (business-error, 5s). BUG-14 (2026-05-29) added backend-message passthrough for the error toast.

## Replaces
- The previous **two separate dialog mounts** per wizard (a sending-credentials dialog + a completion-success dialog wired by hand in each wizard) — `[CODE]` org-hierarchy-page-menu.component.html:395-396 (comment: "ONE component replaces the previous separate … mounts").
- Supersedes nothing in the brain dossier set (NEW component, NEW dossier).

## Source file paths
| Layer | Path |
|---|---|
| Component TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard-finalization/falcon-wizard-finalization.component.ts` (311 ln) |
| Component HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard-finalization/falcon-wizard-finalization.component.html` (54 ln) |
| Inline styles | `styles: [':host { display: contents; }']` (`[CODE]` ts:104 — no `.css`/`.scss` file) |
| Barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard-finalization/index.ts` |
| Composed: channel picker | `../falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.ts` (`<falcon-angular-sending-credentials-dialog>`) |
| Composed: success ack | `../falcon-completion-success-dialog/falcon-completion-success-dialog.component.ts` (`<falcon-angular-completion-success-dialog>`) |
| Service: error toast | `../../../services/message-orchestrator/falcon-message-orchestrator.service.ts` (`FalconMessageOrchestratorService`) |
| Service: loader overlay | `@falcon/studio/runtime` → `FalconLoaderService` (+ `FalconLoaderDismiss`) |
| Stencil tag | **NONE** — pure Angular composite. |
| Token file | **NONE** — all visuals come from the two composed dialogs' own token files. |
| Spec/tests | _None found_ for this component. |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-wizard-finalization` `[CODE]` falcon-wizard-finalization.component.ts:97 |
| Stencil Shadow tag | n/a |
| Stencil Light tag | n/a |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-wizard-finalization>` across `apps/` = **3 element mounts** in the org-hierarchy page-menu of both consoles:
- `apps/admin-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.html:399` (Add Client finalization, `[submitFn]="state.addClientSubmitFn"`).
- `apps/admin-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.html:413` (Add User finalization, `[submitFn]="state.addUserSubmitFn"`).
- `apps/management-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.html:399` (Add User finalization).

Plus TS references (the page-menu components + the state slices that build `submitFn` / track the `*SendingCredentialsOpen()` signal): `org-hierarchy-page-menu.component.ts`, `add-user-state.signals.ts`, `add-client-wizard.signals.ts`, `client.service.ts`, `hierarchy-page-state.service.ts`, `add-user-wizard.component.{ts,html}` (both consoles). See USAGE Consumer Sweep.

## Related components
- `<falcon-angular-sending-credentials-dialog>` — the interactive channel picker it embeds (email/SMS/both + Send). Driven by `pickerOpen` (a computed gate), NOT the raw `open` input.
- `<falcon-angular-completion-success-dialog>` — the branded success ack it embeds (clipboard illustration + auto-dismiss; `(closed)` → `finalized`).
- `<falcon-angular-wizard>` — the wizard SHELL (separate; this orchestrator handles the FINISH close-out, mounted beside the wizard).
- `FalconMessageOrchestratorService` — the platform toast/modal orchestrator (used for the submit-error toast only).
- `FalconLoaderService` (`@falcon/studio/runtime`) — the counter-based central loader-overlay (shown while `submitFn` is in flight).

## Ownership / responsibility
`libs/falcon-ui-core` angular-wrapper layer. **Pure presentational orchestrator — NO HTTP, NO entity services, NO router** (`[CODE]` ts:58-60). The host injects the actual API call via the `submitFn` input; API code stays in the host app's page-state slices per the platform rule. The component owns the state machine (picker ↔ loader ↔ success ↔ error) and the minimum-loader-visibility gate.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20 sweep, NEW dossier). Source read in full (ts 311 ln + html 54 ln); consumer mounts grep-verified (3 element mounts, admin 2 + mgmt 1). Confirmed Angular-only composite (no Stencil tag / no `-tw` / no token file / not a CVA). READ-ONLY pass.
