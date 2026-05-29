# falcon-confirm-dialog — Recognition Layer

> Cross-cutting layer. Purpose: given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-confirm-dialog>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-confirm-dialog.tsx:97-144` — a **small, compact modal** (`size` default `sm` ≈ 420px wide, `[CODE]` `API.md:67`):
- A standard dialog header with a **heading** (`title`) — left-aligned, not centered.
- A body region (`falcon-confirm-body`) holding an **optional small left-aligned icon** (`falcon-confirm-icon`, ~32px `[CODE]` `TOKENS.md:57`) followed by a **one-line message** `[CODE]` `:113-118`.
- An optional consumer-projected `<slot>` below the message for extra context (a date picker, an inline note) `[CODE]` `:119`.
- A **2-button footer** — Reject button rendered FIRST, Accept SECOND `[CODE]` `:124-139` — raw `<button>`s, not the design-system button.
- Backdrop + close-X (`closable` default `true` `[CODE]` `falcon-confirm-dialog.tsx:54`), focus-trap inherited from `falcon-dialog`.

The fingerprint vs siblings: *small, left-aligned icon, one-line message, custom verbs*. If the design is icon-first / centered / heavy-title, that is `falcon-alert-dialog`. If it matches error/delete/unsaved/save exactly, that is `falcon-popup`.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Dialog>` + `<DialogActions>` with two `<Button>`s | MUI's basic confirm dialog with custom action labels — confirm-dialog is the Falcon preset for it |
| PrimeNG | `<p-confirmDialog>` / `confirmationService.confirm()` | direct 1:1 — `OVERVIEW.md:22` confirm-dialog replaces `<p-confirmDialog>` |
| Ant Design | `Modal.confirm({ okText, cancelText })` | the static `Modal.confirm` with custom `okText`/`cancelText` — conceptual match |
| Bootstrap | `.modal` with `.modal-footer` two buttons | upgrade target — no severity preset |
| shadcn / Radix | `<AlertDialog>` with `<AlertDialogAction>` + `<AlertDialogCancel>` | Radix AlertDialog with custom action text — the non-icon-led confirm variant |
| plain HTML | `window.confirm()` | replace — confirm-dialog is the styled, label-customisable answer |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| small modal, one-line message, custom verbs (Approve/Reject, Continue/Go-back) | `<falcon-angular-confirm-dialog>` | — |
| centered big icon + title + subtitle + body, a high-stakes "are you sure?" | `<falcon-angular-alert-dialog>` | confirm-dialog |
| one of the 4 canonical flows: error / delete / unsaved / save | `<falcon-angular-popup>` | confirm-dialog |
| a form, multi-field editing, custom header/footer layout | `<falcon-angular-dialog>` (primitive) | confirm-dialog |
| a transient "Done" message after the action | `<falcon-angular-notification>` / toast | confirm-dialog |
| replace the footer with three or more buttons | `<falcon-angular-dialog>` | confirm-dialog (footer is fixed at 2) |

## Composition recipe to reach parity
Customization order (per `[VAULT]` `feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **Inputs** — `[(open)]`, `[title]`, `[message]`, `[severity]` (`info`/`success`/`warning`/`danger`), `[acceptLabel]`, `[rejectLabel]`, `[size]`, `[position]`, `[closable]`, `[closeOnBackdrop]`, `[closeOnEsc]` `[CODE]` `API.md:15-32`. Pass `acceptLabel`/`rejectLabel` explicitly — the `OK`/`Cancel` defaults are deliberately generic.
2. **Icon** — `[icon]="'falcon-icon falcon-icon-trash'"` — a CSS class string, NOT an `<svg>` `[CODE]` `USAGE.md:82`.
3. **Body slot** — project extra context (date picker, inline notes) into the default unnamed slot below the message `[CODE]` `API.md:54-58`. The footer is NOT projectable.
4. **Variant / severity** — `severity` is the only "variant" knob; it drives the accent. `[INFERRED]` verify the danger accent reaches the Accept button (`GAPS_AND_UPGRADES.md:79-81` flags it unverified).
5. **Token override** — `rootClass="my-confirm"` + a CSS class declaring `--falcon-confirm-dialog-*` tokens `[CODE]` `USAGE.md:61-76`; the token selector also cascades through the composed dialog `[CODE]` `TOKENS.md:11-17`.
6. **Render path** — `[useTailwind]=true` (default, Light DOM) for Tailwind-v4 apps; `false` for Shadow-DOM isolation.
7. **GAP** — `loading` / `acceptDisabled` busy state, a tertiary button, `<falcon-angular-button>`-composed footer, and `<falcon-angular-icon>` are NOT available `[CODE]` `GAPS_AND_UPGRADES.md:3-52`. The component is under-leveraged — `DECISION.md:123-124` recommends landing the structural fixes before wider adoption. Raise an upgrade; do not hand-roll.

## Anti-patterns
- Using confirm-dialog for the 4 canonical flows — `[CODE]` `USAGE.md:79`; a delete confirm belongs in `falcon-popup` (`variant="delete"`).
- Expecting to **project replacement footer buttons** — `[CODE]` `USAGE.md:80` the accept/reject buttons are hardcoded raw `<button>`s.
- Treating backdrop / Esc dismissal as distinct from rejection — `[CODE]` `USAGE.md:81` all dismissal paths fire the SAME `(reject)` event.
- Passing an `<svg>` to `[icon]` — `[CODE]` `USAGE.md:82` it is a CSS class string.
- Binding `[heading]` on the Angular wrapper — `[CODE]` `API.md:74` the wrapper exposes `[title]`; `heading` is the Stencil-layer prop.
- Binding `onFalconClose` on the Stencil tag — `[CODE]` `API.md:73` the correct event is `onFalcon-close`.
- Relying on an async-accept spinner — `[CODE]` `GAPS_AND_UPGRADES.md:20-29` there is no `loading` input; manage progress externally.

## Verification
🟡 CODE-DERIVED from `falcon-confirm-dialog.tsx` + the 6 UI dossier files. Cross-library map is `[INFERRED]` from each library's documented confirmation primitive. Composition recipe ✅ VERIFIED against `API.md` + `USAGE.md` + `TOKENS.md`.
