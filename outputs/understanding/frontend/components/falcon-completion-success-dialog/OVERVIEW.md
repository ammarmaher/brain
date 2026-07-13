# falcon-completion-success-dialog — OVERVIEW

## Component purpose

A **branded, button-less success-acknowledgement modal** — the large "Completed successfully / Credentials sent to the user" dialog shown at the end of the Add Client / Add User wizards. `[CODE]` `falcon-completion-success-dialog.component.ts:1-14` — a **pixel-parity port of the React `SuccessModal`** (`admin/addclient.jsx 751-767`) with an inlined decorative clipboard-with-checkmark + sparkles illustration (`SuccessIllo`, addclient.jsx 809-834). It is a **pure-Angular standalone component** composing the shared `[falconOverlay]` directive over a native `<dialog>` (Top Layer) — there is **no Stencil dual-render twin**. It has **no action buttons** — only an X close icon — and **auto-dismisses after `autoDismissMs` (10s default)**; clicking anywhere (panel, backdrop, ×) or pressing Escape emits `(closed)`.

## Business / UI use case

- The success ack at the end of a **creation-finalization** flow: after credentials are sent to a newly created user, the operator sees this branded confirmation.
- Driven by `<falcon-angular-wizard-finalization>` (`[CODE]` `falcon-wizard-finalization.component.html:47-53`) as the second of its two composed dialogs (the first being the delivery-method picker `<falcon-angular-sending-credentials-dialog>`).
- Composition over the **B14 overlay substrate** — it uses the same native-`<dialog>` Top-Layer + `[falconOverlay]` directive pattern as `falcon-popup` / `falcon-dialog` / `falcon-drawer`.

## When to use it / when NOT to use it

**Use it for:**
- A large, celebratory, **passive** success confirmation at the end of a multi-step creation flow (client/user created, credentials delivered).
- Cases where a generic OK/Cancel alert is the WRONG tone — `[CODE]` the file header (`:30-43`) records that the Phase 3 attempt to route this through the orchestrator's `action-required` modal rendered a small red-icon `<falcon-angular-popup variant="error" hideCancel>` OK/Cancel alert, which was reverted *because that is the wrong visual for "Credentials sent to the user."*

**Do NOT use it for:**
- **Any decision / must-acknowledge** flow — there is no confirm button and it auto-dismisses. Use `<falcon-angular-popup>` / `FalconConfirmService`.
- **Transient toast feedback** — use `FalconMessageOrchestratorService.show({category:'success'})` (a corner toast). The submit-ERROR side of wizard-finalization correctly uses the orchestrator business-error toast; only the SUCCESS ack uses this dialog.
- **Content that the user must read/copy carefully** — clicking anywhere (including the panel) dismisses it (GAP G-CLICK-ANYWHERE).
- **A field-validation or error modal** — wrong intent + wrong art.

## Status

**ACTIVE / preferred for branded creation-success acks.** `[CODE]` Deliberately KEPT as an inline component (NOT routed through the orchestrator) per the 2026-05-24 addendum (`:30-43`) — the orchestrator's generic modal-adapter produced the wrong visual. This is an explicit "do NOT collapse this into the orchestrator" decision.

## Replaces

- React `SuccessModal` (`admin/addclient.jsx`) — Angular port.
- An earlier (Phase 3) orchestrator `action-required` route that was reverted (wrong visual).

## Source file paths

| Layer | Path |
|---|---|
| Angular component TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/falcon-completion-success-dialog.component.ts` (173 ln, INLINE `styles:` block) |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/falcon-completion-success-dialog.component.html` (76 ln, inlined SVG) |
| Barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/index.ts` |
| Top-level barrel | `libs/falcon-ui-core/src/angular-wrapper/index.ts:82` → consumers import from `@falcon/ui-core/angular` |
| Overlay substrate (B14) | `libs/falcon-ui-core/src/angular-wrapper/utilities/falcon-overlay.directive.ts` (`[falconOverlay]` owns `showModal()`/`close()` + `FalconStackingService` registration) |
| Composing orchestrator (consumer) | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard-finalization/falcon-wizard-finalization.component.{ts,html}` |
| Stencil sources | _None_ — pure Angular, no Shadow/`-tw` twin, no React/Vue cross-framework wrapper. |
| Token file | _None_ — no `completion-success.tokens.css` (uses Falcon palette tokens + arbitrary utilities + an inline `styles:` block — see TOKENS.md / GAP G-TOKENS). |
| Spec | `apps/host-shell/tests/falcon-completion-success-dialog.spec.ts` (Vitest + TestBed, 9 tests — render/auto-dismiss/backdrop/panel-click/×/hidden). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-completion-success-dialog` |
| Stencil | _None_ |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-completion-success-dialog>` / `FalconAngularCompletionSuccessDialogComponent`:
- `libs/falcon-ui-core/.../falcon-wizard-finalization/falcon-wizard-finalization.component.{ts,html}` — **the one live composer** (mounts it bound to a `successOpen` signal; `(closed)` → emits `finalized`).
- `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/signals/add-client-wizard.signals.ts` — drives the wizard-finalization → completion ack.
- `apps/{admin,management}-console/.../org-hierarchy-page/services/state/add-user-state.signals.ts` — same, for Add User.
- `apps/host-shell/tests/falcon-completion-success-dialog.spec.ts` — unit test.
- `eslint.config.mjs` — config ref (non-render).

> So the component is consumed **transitively through `<falcon-angular-wizard-finalization>`**, not directly by app templates. The signals files reference the finalization flow that ends in this dialog.

## Related components

- **Composed by:** `<falcon-angular-wizard-finalization>` (alongside `<falcon-angular-sending-credentials-dialog>`).
- **Substrate:** `[falconOverlay]` directive + `FalconStackingService` (shared with `falcon-popup` / `falcon-dialog` / `falcon-drawer`).
- **Sibling success/ack surfaces:** `<falcon-angular-popup variant="save">` (action-required save confirm), `FalconMessageOrchestratorService` `success` toast (transient). This dialog is the *branded, passive, large* option.

## Ownership / responsibility

`libs/falcon-ui-core` (Angular-wrapper layer). Owned by Falcon UI team. No token file — visual is self-contained (inline styles + Tailwind utilities + the inlined SVG).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B18 sweep, NEW dossier). Source-file table + the "kept inline, NOT orchestrator-routed" decision confirmed against `falcon-completion-success-dialog.component.{ts,html}` (173/76 ln), `falcon-wizard-finalization.component.{ts,html}`, the `[falconOverlay]` directive, and the host-shell spec (9 tests). Consumer sweep via Grep.
