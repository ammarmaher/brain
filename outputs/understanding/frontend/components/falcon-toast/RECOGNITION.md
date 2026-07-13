# falcon-toast — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify the right Falcon surface. For `<falcon-toast>` the honest answer is usually "you don't want the toast component — you want the orchestrator + notification card."

## Visual fingerprint

`[CODE]` falcon-toast.tsx:131-207 — a compact, floating, rounded card (`--falcon-toast-border-radius: 10px`) that appears *transiently* at a viewport corner, then slides away on its own:
- **Leading severity icon** in a tinted square chip — a 16×16 stroke SVG (checkmark / triangle / X / info dot), colored per severity.
- **Body** — optional bold `title` line + `message` line, left-aligned.
- **Optional trailing action** — a text link (`actionHref`) or button (`actionLabel`).
- **Trailing × dismiss** in the corner.
- **Stacks** vertically with a fixed gap (`--falcon-toast-stack-gap`) at one of 6 corners; bottom positions stack newest-nearest-edge.
- **NO countdown bar** — the timer is invisible (unlike `<falcon-angular-notification>`).

Distinguishing signature: *appears unbidden, auto-vanishes, stacks at a corner, has a × but no progress bar.*

## Cross-library equivalents

| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Snackbar>` + `<Alert>` | Snackbar = positioned auto-dismiss container; Alert = severity card. Falcon historically split this into message-host + toast; now it is orchestrator + notification card. |
| PrimeNG | `<p-toast>` + `MessageService` | **direct 1:1** lineage — `<falcon-toast>` + `FalconMessageService` was the drop-in replacement (Wave PR-8). `severity:'warn'` alias preserved. |
| Ant Design | `notification.*()` / `message.*()` static API | Ant's imperative `notification.success(...)` ≈ `FalconMessageOrchestratorService.show({category:'success', …})` today (was `FalconMessageService.add(...)`). |
| Bootstrap | `.toast` + Toast JS | structural twin; upgrade target. |
| shadcn / Radix | `<Toast>` (Radix) / `sonner` | shadcn `useToast()` / `sonner.toast()` ≈ the orchestrator's imperative `show(...)`. |
| plain HTML | hand-rolled fixed div + `setTimeout` | always replace with the orchestrator. |

## Use THIS vs siblings

| If the design shows… | Use | Not |
|---|---|---|
| a transient corner card that auto-vanishes (any new code) | `FalconMessageOrchestratorService.show({category, …})` → renders the notification card | `<falcon-angular-toast>` (runtime-orphaned) |
| a transient card **with a visible countdown depletion bar** | `<falcon-angular-notification>` (this IS the rendered card) | `<falcon-toast>` (no countdown bar) |
| PrimeNG-`MessageService`-style firing in genuinely legacy code | `FalconMessageService.add()` + revive `<falcon-angular-message-host>` | direct `<falcon-angular-toast>` |
| a message the user **must acknowledge** to proceed | orchestrator `category:'action-required'`/`'configuration-required'` → `<falcon-modal-adapter>` blocking modal | toast (auto-dismisses — user can miss it) |
| a persistent inline status banner inside a form/page | `<falcon-angular-notification>` used inline (not via the stack) | toast |
| a hover-triggered hint on an element | `<falcon-angular-tooltip>` | toast |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Do NOT instantiate `<falcon-angular-toast>`.** For new code, inject `FalconMessageOrchestratorService` and call `show({ category, title, message, source })`; for HTTP feedback attach `withSuccess()`/`withMessages()` to the request. The card renders via `<falcon-toast-adapter>` (already mounted once in `app.ts`).
2. **If you genuinely need the raw toast (non-orchestrator embedding)** — inputs: `severity`, `title`, `message`, `[duration]`, `[dismissible]`, `actionLabel`/`actionHref`; wrap in `<falcon-angular-toast-host position="…">`.
3. **Slots** — `slot="action"` for a custom Tailwind action button; default slot for extra body content.
4. **Position** — one of 6 host positions (the orchestrator's card defaults to `top-right`).
5. **Tokens** — restyle via `toast.tokens.css` vars (`--falcon-toast-bg`, per-severity `--falcon-toast-icon-*`). Never hardcode. Info-severity colors are hardcoded hex — a known gap (G4).
6. **Upgrade** — `<falcon-toast>` is superseded; do not grow its API. Need a countdown bar / progress / grouping / one-at-a-time routing? That is the orchestrator + notification card's job — switch surfaces.

## Anti-patterns

- Instantiating `<falcon-angular-toast>` in feature code — it is runtime-orphaned; nothing fires it. Use the orchestrator.
- `[BRAIN-OUT]` Reaching for the toast in net-new code — prefer the orchestrator + `<falcon-angular-notification>`.
- Putting a must-acknowledge error in a toast — auto-dismisses; route via the orchestrator's modal channel.
- Mounting `<falcon-angular-message-host>` AND `<falcon-toast-adapter>` — double rendering.
- `duration=0` **and** `dismissible=false` — immortal, un-closable toast.
- Passing HTML in `message` — rendered as text; use the `action` slot.
- PrimeNG `<p-toast>` or a native fixed-div toast in app code — banned (`feedback_falcon_ui_library_only_no_native`).

## Verification
🟡 CODE-DERIVED 2026-06-03 (B16) from falcon-toast.tsx + the orchestrator/adapter source + the UI dossier files. PrimeNG 1:1 lineage ✅ via OVERVIEW "Replaces" + Wave PR-8. Cross-library map is `[INFERRED]`. Sibling routing updated to point at the orchestrator (the runtime renderer), not the toast.
