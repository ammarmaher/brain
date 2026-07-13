# falcon-notification — GAPS AND UPGRADES

> B16 AUDIT findings for `falcon-notification` in prose. We fix NOTHING this pass. Row-level record in `FINDINGS/B16.md`.

## Headline — the canonical live surface; stack is superseded

`[CODE]` This card IS the platform's live message renderer (via `<falcon-toast-adapter>` ← orchestrator). Two structural facts to flag (not bugs, but worth a Wave decision):
1. **`<falcon-angular-notification-stack>` is superseded + inert** — `app.ts` mounts `<falcon-toast-adapter>` instead, AND `FalconNotificationService.active()` always returns `[]` (Phase-5 shim). The stack class + its `position`/appearance inputs + the position helper are kept (the helper is reused by the adapter), but the stack COMPONENT renders nothing if mounted. **Wave flag: the stack component is a SUPERSEDED-CANDIDATE** (the helper stays; the component could be deleted once no consumer mounts it). `risk-class = safe-local` (doc/decision).
2. The card is reached via the orchestrator/facades, not direct embed — correct by design.

## Missing capabilities (active source verified)

### G1 — No hover-pause on auto-dismiss (P1)

`[CODE]` Unlike `<falcon-toast>` (which pauses on hover/focus), the card's `effect()`-driven timer (`[CODE]` falcon-notification.component.ts:282-294) does NOT pause on hover. A user hovering to read a long message gets it dismissed mid-read. **Proposed:** pointer-enter/leave handlers that pause/resume the `setTimeout` (mirror the toast's `remainingMs` logic). `risk-class = safe-local`.

### G2 — `warning` intent renders the `info` icon, not `alert` (P2)

`[CODE]` falcon-notification.component.ts:51 — `INTENTS.warning.icon = 'info'`; the `@case ('alert')` triangle exists in the SVG `@switch` (`[CODE]` lines 107-111) but no intent selects it. A consumer expecting ⚠ for `warning` gets an info-circle. **Proposed:** set `warning.icon = 'alert'`. `risk-class = safe-local` (visual change; behind an `iconName` override or a minor version to be safe).

### G3 — No body slot / rich content (P1)

`[CODE]` `title` (required) + `subtitle` (string) only; no `<ng-content>`, no way to project formatted text / links / inline icons. **Proposed:** an optional `<ng-content>` that replaces `subtitle` when projected. `risk-class = safe-local` (additive).

### G4 — `aria-live` always `polite` (P2 — a11y)

`[CODE]` falcon-notification.component.ts:74 — `aria-live="polite"` regardless of intent. The toast escalates to `assertive` for warning/error. For an `error` card a screen-reader user may not be interrupted. **Proposed:** an `aria-live` computed (`assertive` for error/warning, else `polite`). `risk-class = HIGH-RISK-QUEUE` (a11y semantics).

### G5 — No action button (P2)

`[CODE]` The toast has `actionLabel`/`actionHref`; the card has only the × dismiss. (The ORCHESTRATOR's `modal` channel carries `actionLabel`/`actionCallback`, but the toast card does not.) **Proposed:** `actionLabel` + `actionHref`/`actionCallback` + `(actionClick)` output on the card, threaded through the orchestrator + adapter. `risk-class = safe-local` (additive).

### G6 — No icon-component composition (P2)

`[CODE]` 4 intent icons are hardcoded inline `<svg>` (`[CODE]` falcon-notification.component.ts:98-116). Not composed with `<falcon-angular-icon>`. `risk-class = safe-local`.

### G7 — No `notification.tokens.css` (P2)

`[CODE]` No dedicated token file (unlike toast/tooltip) — appearance is palette-Tailwind + inline `[style.*]` + config defaults. Per-instance non-input customization is impossible. **Proposed:** introduce `notification.tokens.css` (gate-12 scoped) and refactor the inline `[style.*]` to consume it. `risk-class = safe-local`.

### G8 — Dismiss `aria-label` not i18n-bridged; grouping; swipe-to-dismiss (P3)

`[CODE]` `aria-label="Dismiss"` hardcoded English (`[CODE]` line 130). No grouping/collapsing of multiple (moot for the live single-active-toast path, relevant only if the stack is revived). No swipe-to-dismiss on mobile. `risk-class = safe-local`.

## Corrected stale gaps (prior dossier)

- ❌ ~~"Stack position is fixed/hardcoded (P1)"~~ — **STALE.** The stack HAS a `position` input (`top-right`/`top-left`/`bottom-right`/`bottom-left`, Wave 4.2) and the helper `falconNotificationStackContainerClasses` maps it (`[CODE]` falcon-notification-stack.component.ts:41-58/167). Removed.
- ❌ ~~"Not wired into the HTTP error pipeline (the toast path is)"~~ — **STALE.** The card IS the HTTP-pipeline renderer (via `FalconHttpUiDispatcherService` → orchestrator → toast-adapter → card). Removed.
- ❌ ~~"dismissDuration default 12"~~ — **STALE.** The default is config-owned (`FalconConfigurationService.notification.dismissDurationSec`); the input defaults to `undefined`. Removed.

## Missing tests

`[CODE]` **No `.spec.ts` for the card OR the stack OR the service in `falcon-ui-core`** (verified 2026-06-03). The auto-dismiss `effect()`, the resolved-getter fallback chain, the manual-vs-auto dismiss, and the intent→icon/color map are untested at the card level. (The orchestrator + dispatcher + the stack-position helper ARE tested in `apps/host-shell/tests/{falcon-message-orchestrator,falcon-http-ui-dispatcher,falcon-notification-stack-position}.spec.ts` — but those don't render the card.) GAP. `risk-class = safe-local`.

## Missing cross-framework parity

`[CODE]` **Angular-only** — there is intentionally no React/Vue notification (it is an Angular-wrapper-layer component, not a Stencil core component). Not a parity gap in the cross-framework sense; just note it cannot be reused outside Angular.

## Missing Tailwind / token parity

N/A — Tailwind-direct, single render path (no Shadow/`-tw` twin to diverge). The only "parity" concern is the missing token file (G7).

## Performance risks

- `[CODE]` `glossy=true` (default) uses `backdrop-blur-xl` + `backdrop-saturate-150` — GPU-heavy; low-end devices show without blur.
- The countdown keyframe + the slide-in keyframe are cheap.
- The live path renders ONE card at a time (orchestrator single-active) — no multi-card cost.

## Visual / interaction risks

- `[CODE]` The countdown bar is 1px by default (`countdownHeight`) — easy to miss as a time cue.
- No hover-pause (G1) — long messages dismiss mid-read.
- The accent bar is physically LEFT — may not mirror under RTL (TOKENS.md).

## Recommended upgrade priority

| ID | Title | Priority | risk-class |
|---|---|---|---|
| (headline) | Decide fate of the superseded stack component | — | safe-local |
| G1 | Hover-pause auto-dismiss | P1 | safe-local |
| G3 | Body slot for rich content | P1 | safe-local |
| G4 | `aria-live` per severity | P2 | HIGH-RISK-QUEUE (a11y) |
| G5 | Action button on the card | P2 | safe-local |
| G2 | `alert` icon for warning | P2 | safe-local |
| G6 | `<falcon-angular-icon>` composition | P2 | safe-local |
| G7 | `notification.tokens.css` | P2 | safe-local |
| G8 | i18n dismiss label / grouping / swipe | P3 | safe-local |

## Fix-shared-vs-per-page

All gaps belong in the shared component / orchestrator. No per-page work.

## Future-proof recommendation

The card is the canonical surface — invest the Tier-1 items (hover-pause, body slot) and the a11y `aria-live` switch to round it out. Decide the superseded `<falcon-angular-notification-stack>` component's fate: keep the position helper (the adapter uses it), delete or `@deprecated`-annotate the stack COMPONENT (it renders nothing). Introduce a token file (G7) for parity with toast/tooltip.

## Deep-Dive Sweep Findings (2026-06-03 — B16)

**Consumer count: ~45 files** (`[CODE]` grep — the messaging family via orchestrator + facades + dispatcher + showcase + barrel).

Corrected/added vs prior dossier:
- Consumer count 4 → **~45** (the prior sweep matched only `<falcon-angular-notification-stack>`; the real adoption is via the service facades + orchestrator).
- REMOVED three stale gaps (stack-position-fixed, not-HTTP-wired, 12s-default) — all corrected against live source.
- ADDED the headline (canonical live surface; stack superseded + inert).
- a11y `aria-live` (G4) tagged HIGH-RISK-QUEUE; everything else safe-local.
- Documented the orchestrator as the routing brain + the 400→toast pipeline (INTEGRATION_VALIDATION).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B16) against all source layers + the orchestrator/adapter/dispatcher. Three stale gaps removed; eight live gaps re-derived. One HIGH-RISK-QUEUE item (G4); rest safe-local. No deletion executed — the stack component is a SUPERSEDED-CANDIDATE flagged for human triage.
