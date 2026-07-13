# send-credentials-popup (LEGACY) — OVERVIEW

> [!warning] REMOVED / Superseded by [[falcon-sending-credentials-dialog]] (`<falcon-angular-sending-credentials-dialog>`)
> **This component no longer exists on disk.** The bespoke `<falcon-send-credentials-popup>` was **removed** and the re-export deleted. Source of truth: [CODE] `libs/falcon/src/shared-ui/index.ts:24-26` — *"send-credentials-popup re-export removed — that folder does not exist on disk. Use `<falcon-angular-sending-credentials-dialog>` from @falcon/ui-core/angular."* Verified by Glob 2026-06-03: `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/` does not exist, and Grep finds the legacy tag only in `docs/` plans — **0 live consumers**. The live successor `<falcon-angular-sending-credentials-dialog>` ([[falcon-sending-credentials-dialog]]) lives at [CODE] `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/` and is consumed by `<falcon-angular-wizard-finalization>` ([CODE] `falcon-wizard-finalization.component.{ts,html}`). This dossier is a historical reconciliation stub only.
>
> _Reconciled 2026-06-03 (B23 reconcile cluster) — dossier was a 4-file orphan (no live 1:1 component). Status flipped LEGACY-IN-USE→REMOVED._

## Purpose
Confirmation popup for "send credentials to account owner". Renders inside a `<falcon-angular-dialog>` shell, with a radio group of `DeliveryMethod` options (email / sms / both / etc.) and a Submit button. Used after creating a new client or user to confirm how their initial credentials should be delivered.

## Business / UI use case
- Final step of Add Client wizard (`accountOwnerName`, `phoneNumber`, `email`).
- Final step of Add User wizard.
- Any flow that creates an account requiring out-of-band credential delivery.

## When to use it / when NOT to use it
- USE for credential-delivery confirmation flows. Specific to this domain.
- DO NOT use as a generic confirmation dialog — use `<falcon-angular-popup variant="save">` or `<falcon-angular-confirm-dialog>` instead.

## Status
- **REMOVED.** [CODE] `libs/falcon/src/shared-ui/index.ts:24-26` (re-export removed; folder does not exist on disk). Glob 2026-06-03 confirms no `send-credentials-popup` folder under `shared-ui/lib/components/`; Grep confirms 0 live consumers.
- The old dossier guessed migration would wait for a slot-friendly `<falcon-angular-popup variant="custom">`. Instead, a dedicated Falcon UI core component shipped: **`<falcon-angular-sending-credentials-dialog>`** ([[falcon-sending-credentials-dialog]]).

## Selector / Tags
- `<falcon-send-credentials-popup>` (Angular).
- No Stencil tag.

## Source paths
| Layer | Path |
|---|---|
| Component | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.ts` |
| Template | `…/send-credentials-popup.component.html` |
| SCSS | `…/send-credentials-popup.component.scss` |

## Known consumers
- **LIVE consumer count = 0** (verified by Grep 2026-06-03 — `<falcon-send-credentials-popup>` / `FalconSendCredentialsPopupComponent` appear only in `docs/archive/WAVE-A-OLD-STRUCTURE.md` and two `docs/_plans/` wizard-roadmap files, never in `apps/` or `libs/falcon/` source). The credential-delivery confirmation that the Add Client / Add User wizards used now goes through `<falcon-angular-wizard-finalization>` → `<falcon-angular-sending-credentials-dialog>`.

## Related components
- **`<falcon-angular-sending-credentials-dialog>` ([[falcon-sending-credentials-dialog]]) — the realized successor** (live in `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/`).
- `<falcon-angular-wizard-finalization>` ([[falcon-wizard-finalization]]) — composes the sending-credentials dialog as part of the final wizard step ([CODE] `falcon-wizard-finalization.component.{ts,html}`).
- `<falcon-angular-dialog>` / `<falcon-angular-radio>` / `<falcon-angular-button>` — were composed by the old popup; the successor composes equivalents internally.
- `<falcon-angular-popup>` — the old dossier's anticipated replacement target; NOT the path that shipped.

## Ownership / Responsibility
- Was legacy bespoke under `libs/falcon/src/shared-ui/` (now deleted).
- It owned the `DeliveryMethod` enum mapping (`Helper.enumToOptions` from `@falcon/shared-data-access`) and a bespoke SCSS file (violated the "no SCSS" rule) — both reasons it was retired in favor of the token-driven Falcon UI core dialog.

## Verification
🟢 code-verified (B23 reconcile 2026-06-03) — deletion confirmed via [CODE] `libs/falcon/src/shared-ui/index.ts:24-26`; 0 live consumers confirmed via Grep of `<falcon-send-credentials-popup`; successor `<falcon-angular-sending-credentials-dialog>` confirmed live via Glob of `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/` + consumer `falcon-wizard-finalization`. API/UI prose below the banner describes the deleted component and is unverified against live code.
