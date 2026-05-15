*** Component note — Falcon Message Host ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-message-host/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Message Host

> Renders the `FalconMessageService.add()` stream as `<falcon-angular-toast>` instances inside `<falcon-angular-toast-host>`. Drop-in replacement for PrimeNG `<p-toast>` + `MessageService`. Mount ONCE in any app shell — any component can call `FalconMessageService.add({...})` to fire a message. Angular-only (no Stencil tag). For brand-new business-status feedback in net-new code, prefer [[Falcon Notification]] + `FalconNotificationService.push()`.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-message-host/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-message-host/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-message-host/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-message-host/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-message-host/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-message-host/DECISION.md)

## Pages using this component

- Production-mounted at `apps/host-shell/src/app/app.ts` and consumed by `apps/host-shell/src/app/core/interceptors/response-interceptor.ts` (HTTP interceptor fires toasts). Admin / management consoles inherit via the shared interceptor. _No specific page links — this is an app-shell-mounted substrate._

## PRDs that use this component

- _cross-cutting platform component_ — HTTP-error / success messaging across every PRD.

## Related gaps

- _See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-message-host/GAPS_AND_UPGRADES.md) — filter by component `falcon-message-host`. Tier-1: `maxStack` cap; dedup by `key`._

## Visual difference reports

- _[[FALCON_EYES_INDEX]] — filter by component `falcon-message-host`._

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
