# falcon-message-service — TOKENS

> **Minimal by design.** This unit is a service + a no-op host — it has **no token contract of its own**, and (in Phase 5) renders nothing. There is genuinely little to document here; this file says so explicitly per SWEEP-SPEC §7.

## Component token file

**None.** `[CODE]` listing 2026-06-03 — there is no `libs/falcon-ui-tokens/src/components/message-service.tokens.css` or `message-host.tokens.css`. The unit ships zero CSS and zero `styles:`.

## What paints the visible output

Nothing paints from this unit in Phase 5. When the orchestrator fires a toast, the visible chrome comes from:
- `FalconToastAdapterComponent` (orchestrator-bound) → its notification card.
- The notification card reads `falcon-defaults.json.notification` via `FalconConfigurationService` (`[CODE]` `falcon-message-orchestrator.service.ts:24-32`): `dismissMode`, `dismissDurationSec`, `countdownBar*`, `borderWidth`, `leftAccent`, `rightAccent`, `radius`.
- The card's own component token file (see `falcon-notification/TOKENS.md`) supplies surface / intent colors.

The historical render path (when the host actually rendered) was `toast.tokens.css` via `<falcon-angular-toast>` — see `falcon-toast/TOKENS.md`. That path is dead now.

## Related Falcon theme tokens

Indirect only — whatever the orchestrator's notification card consumes. This unit references none directly.

## Tailwind utility guidance

- The host element (`falcon-angular-message-host`) is typically off-flow and renders nothing — layout utilities on it are pointless.
- Do NOT add Tailwind classes to "style the message-host" — there is no surface.

## Dark mode support

Inherited entirely from the orchestrator's notification card / theme tokens. This unit has no dark-mode rules.

## Density support

None directly.

## RTL support

`position` (`'top-right'` etc.) is a **physical** corner, forwarded to the (never-mounted) toast-host. The live orchestrator toast-adapter handles RTL via the notification card's logical-property layout. This unit contributes nothing.

## Static style risks

- `[CODE]` **NONE in this unit** — `falcon-message-host.component.ts` has no `styles:`; the template (`.html`) has no inline `style=`; the shim service is pure TS. There are zero literal colors/px here. (Contrast with B18 sibling `falcon-completion-success-dialog`, which DOES carry an inline `styles:` block with literals.)

## No CSS / no SCSS guidance

- No token file, no `.css`, no SCSS — nothing to govern.
- To change toast appearance, configure `falcon-defaults.json.notification` (the orchestrator's single source of truth for timing + visual styling) — never patch this unit.

## Token usage by state

N/A — no states, no tokens. The unit is a routing shim + an inert host.

## Verification
🟡 STRUCTURALLY-CHECKED 2026-06-03 (B18). Confirmed by Glob that no token file or `.css` exists for this slug and by reading the host TS/HTML that no inline styles exist. "Minimal TOKENS — say so" per SWEEP-SPEC §7 honored.
