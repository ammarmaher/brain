# falcon-toast — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-toast>` (or, more correctly, the `FalconMessageService` substrate behind it) as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-toast.tsx:131-207` — a compact, floating, rounded card (`--falcon-toast-border-radius: 10px`) that appears *transiently* at a corner of the viewport, then slides away on its own:
- **Leading severity icon** in a tinted square chip — a 16×16 stroke SVG (checkmark / triangle-ish / X / info dot), colored per severity.
- **Body** — optional bold `title` line + `message` line, both left-aligned.
- **Optional trailing action** — a text link or button (`actionLabel`).
- **Trailing × dismiss button** in the top-right corner.
- **Stacks** — multiple toasts queue vertically with a fixed gap (`--falcon-toast-stack-gap`) at one of 6 viewport corners.
- **No countdown bar** — unlike `<falcon-angular-notification>`, the toast's timer is invisible.

Distinguishing signature: *appears unbidden, auto-vanishes, stacks at a corner, has a × but no progress bar.*

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Snackbar>` + `<Alert>` | MUI Snackbar = the positioned auto-dismiss container; Alert = the severity card. Falcon splits this into message-host + toast. |
| PrimeNG | `<p-toast>` + `MessageService` | **direct 1:1** — `<falcon-toast>` + `FalconMessageService` was built as the drop-in replacement (Wave PR-8). `severity:'warn'` alias preserved. |
| Ant Design | `notification.*()` / `message.*()` static API | Ant's imperative `notification.success(...)` ≈ `FalconMessageService.add({severity:'success',...})`. |
| Bootstrap | `.toast` component + Toast JS | Bootstrap toast is the closest structural twin; upgrade target. |
| shadcn / Radix | `<Toast>` (Radix Toast primitive) / `sonner` | shadcn `useToast()` / `sonner.toast()` ≈ the `FalconMessageService` imperative API. |
| plain HTML | a hand-rolled fixed-position div + `setTimeout` | always replace with the `FalconMessageService` substrate. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a transient corner card that auto-vanishes, PrimeNG-`MessageService`-style firing | `FalconMessageService.add()` + `<falcon-angular-message-host>` | direct `<falcon-angular-toast>` |
| a transient card **with a visible countdown depletion bar**, modern slide-in | `<falcon-angular-notification>` + `FalconNotificationService` (preferred for new code) | toast |
| a message the user **must acknowledge / click** to proceed | `<falcon-angular-popup>` / `<falcon-angular-confirm-dialog>` | toast (it auto-dismisses — the user can miss it) |
| a persistent inline status banner inside a form/page (not floating) | `<falcon-angular-notification>` used inline (not via the stack) | toast |
| a hover-triggered hint on an element | `<falcon-angular-tooltip>` | toast |

## Composition recipe to reach parity
Customization order (per `feedback_falcon_custom_library_mandatory`):
1. **Do not instantiate `<falcon-angular-toast>` directly.** Inject `FalconMessageService` (root singleton) and call `add({ severity, summary, detail, life, closable })`. Mount `<falcon-angular-message-host position="top-right" />` **once** in the app shell.
2. **Inputs (when a standalone toast is genuinely needed — rare)** — `severity`, `title`, `message`, `[duration]`, `[dismissible]`, `actionLabel`/`actionHref`. Wrap in `<falcon-angular-toast-host position="…">`.
3. **Slots** — `slot="action"` for a custom Tailwind action button; the default slot for extra body content below `message`.
4. **Position** — choose one of the 6 host positions to match the design's corner.
5. **Tokens** — restyle via `toast.tokens.css` vars (`--falcon-toast-bg`, per-severity `--falcon-toast-icon-*`). Never hardcode. Note: info-severity colors are hardcoded hex (`TOKENS.md`) — a known gap.
6. **Upgrade** — `<falcon-toast>` is documented-deprecated; do not grow its API. If the design needs a countdown bar / progress / grouping, that is the **notification** component's job — switch components rather than extend the toast.

## Anti-patterns
- Instantiating `<falcon-angular-toast>` in feature code — use the `FalconMessageService` substrate (the toast is plumbing).
- `[BRAIN-OUT]` Reaching for toast in **net-new** code — prefer `<falcon-angular-notification>` per the registry deprecation.
- Putting a must-acknowledge error in a toast — it auto-dismisses; the user misses it. Use a dialog.
- Mounting more than one `<falcon-angular-message-host>` per app — singleton service → duplicate toasts.
- `duration=0` **and** `dismissible=false` together — an immortal, un-closable toast.
- Passing HTML in `message` — rendered as text; use the `action` slot for affordances.
- PrimeNG `<p-toast>` or a native fixed-div toast in app code — banned (`feedback_falcon_ui_library_only_no_native`).

## Verification
🟡 CODE-DERIVED from `falcon-toast.tsx` + `falcon-message-service.ts` + the 6 UI dossier files. Cross-library map is `[INFERRED]` mapping. PrimeNG 1:1 lineage ✅ VERIFIED via `OVERVIEW.md` "Replaces" + Wave PR-8.
