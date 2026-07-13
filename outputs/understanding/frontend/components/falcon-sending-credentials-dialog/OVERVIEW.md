# falcon-sending-credentials-dialog — OVERVIEW

## Component purpose

Domain confirmation dialog for **"send the new account owner's login credentials"**. A modal with a 3-card delivery-method radio chooser (Email / SMS / Both, each with a decorative SVG illustration), an account-owner summary card (name / phone / email), and a footer with **Cancel** + **Send Credentials** buttons. It is a pixel-parity port of the React `SendCredentialsModal` (`[CODE]` falcon-sending-credentials-dialog.component.ts:2 — "admin/addclient.jsx 680-749").

It is a **pure Angular standalone component — NOT a dual-render Stencil wrapper.** It composes the Stencil `<falcon-button-tw>` tag directly for its footer buttons and uses the `[falconOverlay]` directive to drive a native `<dialog>` + Top Layer. Unlike `<falcon-angular-input>` and the uploaders, there is no `<falcon-...>` Shadow tag, no `-tw` twin, no token file, and no ControlValueAccessor — it is a one-way signal-input / event-output dialog.

## Business / UI use case

- The **final step of the Add Client wizard** and the **Add User wizard**: after the account/user is created, the operator confirms how the initial username + password are delivered out-of-band.
- Always reached through `<falcon-angular-wizard-finalization>` (`[CODE]` falcon-wizard-finalization.component.html:25-45), which owns the two terminal dialogs of every create wizard — this dialog (delivery-method picker) then `<falcon-angular-completion-success-dialog>` (the success acknowledgement).

## When to use it / when NOT to use it

**Use it for:**
- Credential-delivery confirmation after creating an account that needs an out-of-band username/password handoff (Add Client / Add User finalization).

**Do NOT use it for:**
- A generic confirm / OK / cancel dialog → use the orchestrator (`FalconMessageOrchestratorService.show()` → `<falcon-angular-popup>`) or `<falcon-angular-alert-dialog>`.
- A success acknowledgement → use `<falcon-angular-completion-success-dialog>` (its sibling inside wizard-finalization).
- A data-capture form dialog → build a domain dialog over `<falcon-angular-dialog>`.

## Status

**ACTIVE / PREFERRED for this domain.** `[CODE]` Live, used by `<falcon-angular-wizard-finalization>`. It is the **successor of the legacy `send-credentials-popup`** (`libs/falcon/src/shared-ui/lib/components/send-credentials-popup/`), which has been **deleted from source** — `[CODE]` `libs/falcon/src/shared-ui/index.ts:25-26`: "send-credentials-popup re-export removed — that folder does not exist on disk. Use `<falcon-angular-sending-credentials-dialog>` from @falcon/ui-core/angular." See `GAPS_AND_UPGRADES.md` Supersession note — the old `send-credentials-popup` dossier is flagged orphan for B23.

## Replaces

- Legacy `send-credentials-popup` bespoke Angular component (`<falcon-send-credentials-popup>`) — deleted from source; the old dossier at `understanding/frontend/components/send-credentials-popup/` is now stale.
- Legacy React `SendCredentialsModal` (`admin/addclient.jsx`).

## Source file paths

| Layer | Path |
|---|---|
| Angular component TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.ts` (~206 ln; inline `styles:` block, no `.css` file) |
| Angular component HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.html` (~195 ln) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/index.ts` |
| Angular-wrapper umbrella barrel | `libs/falcon-ui-core/src/angular-wrapper/index.ts:81` (`export * from './components/falcon-sending-credentials-dialog'`) |
| Overlay directive (composed) | `libs/falcon-ui-core/src/angular-wrapper/utilities` → `FalconOverlayDirective` |
| Stencil tag registrar (composed) | `libs/falcon-ui-core/src/angular-wrapper/define-falcon-tw-component.ts` (`defineFalconTwComponent('falcon-button')`) |
| Spec | `apps/host-shell/tests/falcon-sending-credentials-dialog.spec.ts` |

> `[CODE]` There is **NO** `*.tsx` Shadow source, **NO** `-tw` twin, **NO** `*.types.ts`, **NO** Tailwind-helper file, and **NO** `*.tokens.css` for this component — it is a pure Angular composition (confirmed by glob: only `.component.ts` + `.component.html` + `index.ts` exist under the slug, and no `sending-credentials*` folder under `components/` or `falcon-ui-tokens/src/components/`).

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-sending-credentials-dialog` |
| Stencil Shadow tag | _none_ |
| Stencil Light tag | _none_ |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-sending-credentials-dialog` renders in exactly **1 file**: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard-finalization/falcon-wizard-finalization.component.html:25`. That composite is in turn the finalization substrate for the Add Client / Add User wizards (referenced by `apps/admin-console/.../add-client-wizard/models/wire-builders.ts` for the delivery-method payload). The component is not consumed directly by any app feature — apps go through `<falcon-angular-wizard-finalization>`.

## Related components

- **Composed BY:** `<falcon-angular-wizard-finalization>` (pairs it with `<falcon-angular-completion-success-dialog>`).
- **Composes:** `<falcon-button-tw>` (Stencil footer buttons), `FalconOverlayDirective` (native `<dialog>` Top Layer + `FalconStackingService` registration).
- **Sibling terminal dialog:** `<falcon-angular-completion-success-dialog>` (same wizard-finalization owner; same `[falconOverlay]` + inline-`styles` Top-Layer pattern).
- **Superseded sibling:** legacy `send-credentials-popup` (deleted).

## Ownership / responsibility

`libs/falcon-ui-core` (angular-wrapper layer — an Angular-only composite, not a cross-framework Stencil primitive). Owned by the Falcon UI team / wizard squad (Agent B). No cross-framework React/Vue twin (it is an Angular composite over the shared `<falcon-button-tw>` primitive).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B19 sweep). Source-file set confirmed by glob (TS + HTML + index only; no Stencil/types/tokens). Supersession of `send-credentials-popup` confirmed by `[CODE]` `libs/falcon/src/shared-ui/index.ts:25-26`. Sole consumer (`falcon-wizard-finalization`) grep-confirmed.
