# falcon-confirm-dialog-host — TOKENS

> **This unit has NO token file of its own.** The host element renders no chrome — it is a pure projection of `FalconConfirmService` into a rendered substrate. There is no `confirm-dialog-host.tokens.css`, no `:where()` block, no component-level CSS. All visual tokens belong to the **rendered substrate**, which differs by era.

## Where the visual tokens actually live

| Era | Rendered substrate | Token source |
|---|---|---|
| Pre-Phase-5 (legacy template) | `<falcon-angular-alert-dialog>` | The alert-dialog self-declares its tokens in its Shadow `:host` (`[CODE]` falcon-alert-dialog.css:5-30) + inherits `<falcon-dialog>` chrome from `dialog.tokens.css`. See `[BRAIN-OUT]` `components/falcon-alert-dialog/TOKENS.md`. **(dead path in Phase 5)** |
| **Phase 5 (live)** | `<falcon-angular-popup variant="error">` (via the orchestrator modal-adapter) | The popup's own token contract + `dialog.tokens.css` chrome (popup composes the dialog substrate). See `[BRAIN-OUT]` `components/falcon-popup/` + `components/falcon-dialog/TOKENS.md`. |

So to retheme the confirm modal in Phase 5, you tune **popup** tokens, not anything on this host.

## The host component's CSS

`[CODE]` There is **no `.component.css`** in `falcon-confirm-dialog-host/` (only `.component.ts`, `.component.html`, `.service.ts`, `index.ts`). The host carries a single host class via `@HostBinding('class.falcon-angular-confirm-dialog-host')` (`[CODE]` :41) — used as a hook, with no declared rules. The host element has no layout footprint (its template body is an `@if (active())` that never resolves in Phase 5).

## Tailwind utility guidance

- **None on the host.** Do not put utilities on `<falcon-angular-confirm-dialog-host>` — it renders nothing.
- The Phase-5 popup's chrome is token-driven; override popup tokens (per its dossier) rather than utilities.

## Dark mode support

`[INFERRED]` Handled entirely by the rendered substrate. The Phase-5 popup inherits dark-mode from `dialog.tokens.css` + the `--color-falcon-*` theme tokens under `.app-dark`. The host contributes nothing. Not runtime-verified here.

## Density / RTL support

`[INFERRED]` Both belong to the rendered substrate (popup/dialog). The host is direction- and density-neutral (no chrome). The orchestrator's single-modal-at-a-time semantics (`[CODE]` falcon-confirm.service.ts:67-72) avoid stacked-dialog layout issues in any direction.

## Static style risks

- **None on the host** (no CSS, no inline styles).
- `[CODE]` The legacy host template DOES set literal-ish attrs on the (dead) `<falcon-angular-alert-dialog>`: `size="md"`, `position="center"`, `[closable]="true"` (`[CODE]` falcon-confirm-dialog-host.component.html:15-17). These are passthrough attributes, not styles, and never render in Phase 5.

## No CSS / no SCSS guidance

- The host is correctly CSS-free — it is an orchestration shell. Do not add component CSS here; theme the substrate instead.

## Token usage by state

| Concern | Owner |
|---|---|
| Modal panel / backdrop / chrome | rendered substrate (`<falcon-angular-popup>` in Phase 5) + `dialog.tokens.css` |
| Confirm/cancel button color | the popup variant (`error`) |
| Icon / severity color | the popup variant |
| Host element | _none — no chrome_ |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15 — NEW). Confirmed the host has no token file and no `.component.css` on disk; the visual tokens belong to the rendered substrate (popup in Phase 5, alert-dialog in the dead legacy template). Dark/RTL/density `[INFERRED]` to the substrate (not runtime-verified — host renders nothing in Phase 5).
