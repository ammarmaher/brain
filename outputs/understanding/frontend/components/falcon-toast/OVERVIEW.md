# falcon-toast — OVERVIEW

## Component purpose

Single auto-dismissing toast message with severity (`info` / `success` / `warning` / `error`), title, message, optional icon, optional action (label + href → anchor, or label-only → button). The auto-dismiss timer pauses on hover and on focus-in, resumes on leave/blur. Multiple toasts stack inside a singleton `<falcon-toast-host>` container that anchors at one of 6 viewport positions. The reference implementation for the **dual-render Stencil pattern** in the transient-messaging family: Shadow DOM `<falcon-toast>` + Light DOM `<falcon-toast-tw>` + Angular CVA-less wrapper `<falcon-angular-toast>`; host has the same triple (`<falcon-toast-host>` / `<falcon-toast-host-tw>` / `<falcon-angular-toast-host>`).

## Business / UI use case

- `[CODE]` Transient feedback after async actions ("Saved", "Email sent") — when driven through the legacy `FalconMessageService` queue (`[CODE]` falcon-message-host.component.ts:1-3).
- `[CODE]` Drop-in substrate for PrimeNG `<p-toast>` + `MessageService.add()` semantics, via `<falcon-angular-message-host>` (`[CODE]` falcon-message-host.component.ts:23).
- `[INFERRED]` In CURRENT platform code the live toast surface is NOT this component — it is `<falcon-angular-notification>` rendered by `<falcon-toast-adapter>` off `FalconMessageOrchestratorService` (`[CODE]` falcon-toast-adapter.component.ts:1-32, app.ts:48). `<falcon-toast>` is the older PrimeNG-parity path kept for `FalconMessageService` consumers; see "Known consumers" + RECOGNITION for the relationship.

## When to use it / when NOT to use it

**Use it for:**
- `[CODE]` Code that already drives the `FalconMessageService` BehaviorSubject queue (`messages$`) and renders via `<falcon-angular-message-host>` (PrimeNG `MessageService` parity).
- Raw cross-framework embedding where you need a self-contained, token-styled toast card with built-in hover-pause + action affordance and you are wiring your own queue.

**Do NOT use it for:**
- `[CODE]` New platform messaging — the canonical surface is `FalconMessageOrchestratorService.show({ category, ... })` → `<falcon-toast-adapter>` → `<falcon-angular-notification>` (`[CODE]` falcon-toast-adapter.component.ts:73-93). New code should NOT mount `<falcon-angular-toast>`/`<falcon-angular-toast-host>` directly.
- HTTP error / success feedback — that flows through `FalconHttpUiDispatcherService` → orchestrator → notification card (`[CODE]` falcon-http-ui-dispatcher.service.ts:99-133). See `INTEGRATION_VALIDATION.md`.
- Action-required / decision prompts — use the orchestrator's `modal` presentation (`action-required` / `configuration-required` categories) rendered by `<falcon-modal-adapter>`.
- Persistent / always-on messages — toasts auto-dismiss (`duration` default 5000ms).

## Status

`[INFERRED]` **ACTIVE but SUPERSEDED for app use / PrimeNG-parity-substrate.** The Stencil source carries NO JSDoc `@deprecated` annotation (`[CODE]` falcon-toast.tsx:1-3 is a plain banner). It is fully functional and still wired through `<falcon-angular-message-host>` + `FalconMessageService`. But the platform's live toast rendering is the orchestrator → notification path, so for NEW work `<falcon-toast>` is effectively legacy. The prior dossier called this "@deprecated per registry"; the truth on disk is "no API-level deprecation; superseded by orchestrator+notification for app messaging."

## Replaces

- `[CODE]` PrimeNG `<p-toast>` (Wave PR-8) — when consumed via `FalconMessageService` / `<falcon-angular-message-host>`.

## Source file paths

| Layer | Path |
|---|---|
| Angular toast wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-toast/falcon-toast.component.ts` |
| Angular toast wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-toast/falcon-toast.component.html` |
| Angular host wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-toast/falcon-toast-host.component.ts` |
| Angular host wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-toast/falcon-toast-host.component.html` |
| Angular wrapper CSS (shared) | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-toast/falcon-toast.component.css` (`:host { display: block; }` — 3 lines) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-toast/index.ts` |
| Stencil Shadow source (toast) | `libs/falcon-ui-core/src/components/falcon-toast/falcon-toast.tsx` (208 ln) |
| Stencil Shadow CSS (toast) | `libs/falcon-ui-core/src/components/falcon-toast/falcon-toast.css` (166 ln) |
| Stencil Light source (toast) | `libs/falcon-ui-core/src/components/falcon-toast-tw/falcon-toast-tw.tsx` (211 ln) |
| Stencil Shadow source (host) | `libs/falcon-ui-core/src/components/falcon-toast-host/falcon-toast-host.tsx` (46 ln) |
| Stencil Shadow CSS (host) | `libs/falcon-ui-core/src/components/falcon-toast-host/falcon-toast-host.css` (57 ln) |
| Stencil Light source (host) | `libs/falcon-ui-core/src/components/falcon-toast-host-tw/falcon-toast-host-tw.tsx` (41 ln) |
| Types | `libs/falcon-ui-core/src/components/falcon-toast/falcon-toast.types.ts` |
| Tailwind helper (toast) | `libs/falcon-ui-core/src/tailwind/toast-tailwind-classes.ts` |
| Tailwind helper (host) | `libs/falcon-ui-core/src/tailwind/toast-host-tailwind-classes.ts` |
| Token file | `libs/falcon-ui-tokens/src/components/toast.tokens.css` (~145 lines — recount 2026-06-03) |
| Stencil generated readme | `libs/falcon-ui-core/src/components/falcon-toast/readme.md` (auto-gen; not a hand dossier) |
| Spec / e2e | **NONE** in `falcon-ui-core` — `[CODE]` no `*toast*.spec.ts` / e2e exists (verified 2026-06-03). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular toast | `falcon-angular-toast` |
| Angular host | `falcon-angular-toast-host` |
| Stencil Shadow toast | `<falcon-toast>` (`shadow: true`) |
| Stencil Light toast | `<falcon-toast-tw>` (`shadow: false`) |
| Stencil Shadow host | `<falcon-toast-host>` (`shadow: true`) |
| Stencil Light host | `<falcon-toast-host-tw>` (`shadow: false`) |

## Known consumers (grep verified 2026-06-03)

`[CODE]` grep `falcon-angular-toast` / `FalconAngularToast(Host)?Component` across the repo (excl. node_modules) = **NO production app-template consumers** (`apps/**` returned 0 `<falcon-angular-toast>` hits). The only references:

- `[CODE]` `libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/falcon-message-host.component.ts:18-24` — `<falcon-angular-message-host>` imports + renders `<falcon-angular-toast>` inside `<falcon-angular-toast-host>` off the `FalconMessageService.messages$` queue. **This is the one real consumer path** (PrimeNG-parity shim).
- `[CODE]` `libs/falcon/src/shared-ui/index.ts:379-380` — `@falcon` barrel re-exports `FalconAngularToastComponent` + `FalconAngularToastHostComponent`.
- `[CODE]` `libs/falcon-studio/src/lib/registry/gallery-defaults.ts` + `examples/overlay-feedback-examples.ts` — Falcon Studio gallery showcase entries (design-time demo, not app runtime).
- `[CODE]` `libs/falcon-ui-tokens/src/components/toast.tokens.css` + `libs/falcon-ui-core/SPEC-LOCK.md` + `libs/falcon-studio/WAVE-8A-AUDIT-REPORT.md` — token/doc references.

See `USAGE.md` Consumer Sweep for the enumerated list. (The prior dossier's "playground.page.html showcase" path is gone — the showcase now lives in falcon-studio gallery + the `falcon-ui-showcase` feature uses `<falcon-angular-notification>`, not toast.)

## Related components

- **`falcon-angular-message-host`** (`libs/falcon-ui-core/src/angular-wrapper/components/falcon-message-service/`) — the legacy composition: subscribes to `FalconMessageService` and renders one `<falcon-angular-toast>` per active message. PrimeNG `<p-toast>` drop-in.
- **`falcon-angular-notification`** — the CURRENT preferred passive message card; rendered by `<falcon-toast-adapter>` off the orchestrator. The de-facto replacement for app messaging.
- **`falcon-message-orchestrator`** (`FalconMessageOrchestratorService`) — the single message-routing layer (latest-wins, one-per-channel, dedupe). It does NOT render `<falcon-toast>`; it renders `<falcon-angular-notification>` via the toast-adapter.
- **`falcon-modal-adapter`** — orchestrator's blocking-modal renderer (the other channel).

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by Falcon UI team. Token contract in `libs/falcon-ui-tokens`. Kept as the PrimeNG-parity substrate; app messaging has moved to orchestrator + notification.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B16 sweep). All source-file paths + line counts re-confirmed on disk; the dual-render quad (toast + host × Shadow + tw) read in full. Consumer sweep re-run: `<falcon-angular-toast>` has ZERO `apps/**` consumers — sole runtime path is `<falcon-angular-message-host>`; orchestrator+notification is the live app surface. Status corrected from prior "@deprecated per registry" to "no API-level deprecation; superseded by orchestrator+notification."
