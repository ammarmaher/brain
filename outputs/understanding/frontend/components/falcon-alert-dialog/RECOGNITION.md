# falcon-alert-dialog — Recognition Layer

> Cross-cutting layer. Purpose: given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-alert-dialog>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-alert-dialog.tsx:148-179` + `SPEC.md:16-33` — a **centered modal callout**:
- A large (56px) **severity icon centered at the top** — `[CODE]` `:104-131` a red filled triangle-exclamation for `danger`/`warning`, a green filled circle-check for `success`, a teal filled circle-i for `info`.
- A heavy **centered title** (18px / weight 700) directly below the icon `[CODE]` `TOKENS.md:18-19`.
- A **narrow centered subtitle** (13px, clamped to max 460px wide) `[CODE]` `TOKENS.md:20-22` — deliberately short measure so the user reads it.
- An optional **consumer-projected body** between subtitle and footer (priority list, info pill, summary lines) `[CODE]` `:156-158`.
- A **2-button footer** — outlined Cancel + solid teal Confirm — in a single horizontal row `[CODE]` `:160-179`.
- Optional close-X (`[closable]`, default off), dimmed backdrop, focus-trap (inherited from `falcon-dialog`).

The whole-component fingerprint: *icon-first, centered, two decisions, slow*. If the design is left-aligned with a small icon and a one-line message, that is `falcon-confirm-dialog`, not this.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Dialog>` with a centered `<DialogContent>` + icon, or a custom confirmation dialog | MUI has no opinionated "alert" preset — alert-dialog is the Falcon answer to a hand-built MUI confirm dialog |
| PrimeNG | `<p-confirmDialog>` (centered, icon-led) / `confirmationService.confirm()` | closest 1:1 — alert-dialog replaces the centered PrimeNG confirm dialog |
| Ant Design | `Modal.confirm()` / `Modal.error()` / `Modal.warning()` (the static modal helpers) | Ant's static `Modal.confirm` family is the direct conceptual match — icon + title + content + OK/Cancel |
| Bootstrap | `.modal` with a centered body (`modal-dialog-centered`) + custom icon | upgrade target — Bootstrap has no severity preset |
| shadcn / Radix | `<AlertDialog>` (Radix AlertDialog) | direct conceptual 1:1 — the name even matches; Radix `AlertDialog` is the "interrupt the user, require a decision" primitive |
| plain HTML | `window.confirm()` / `<dialog>` | always replace — `OVERVIEW.md:13` says alert-dialog replaces every legacy `window.confirm()` |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| centered icon + title + subtitle + 2 buttons, a high-stakes "are you sure?" | `<falcon-angular-alert-dialog>` | — |
| a small left-aligned icon + one-line message + Accept/Reject | `<falcon-angular-confirm-dialog>` | alert-dialog |
| one of the 4 canonical flows: error / delete / unsaved / save | `<falcon-angular-popup>` | alert-dialog |
| a form, a date picker, multi-step content needing a custom header | `<falcon-angular-dialog>` (the primitive) | alert-dialog |
| a transient "Saved!" / "Updated" confirmation AFTER the action | `<falcon-angular-toast>` / notification | alert-dialog |
| a side-panel for editing a record | `<falcon-angular-drawer>` | alert-dialog |

## Composition recipe to reach parity
Customization order (per `[VAULT]` `feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **Inputs** — `[open]` (or `[(open)]`), `[title]`, `[subtitle]`, `[severity]` (`danger`/`warning`/`info`/`success`), `[confirmLabel]`, `[cancelLabel]`, `[size]` (`sm`/`md`/`lg`), `[position]`, `[closable]`, `[closeOnBackdrop]`, `[closeOnEsc]` `[CODE]` `API.md:5-23`.
2. **Single-CTA variants** — for an acknowledgement-only callout set `[hideCancel]="true"` (Confirm-only); for a warning the user can only dismiss set `[hideConfirm]="true"` `[CODE]` `SPEC.md:71-76`.
3. **Body slot** — project custom content (priority list, info pill, summary) into the default unnamed slot `[CODE]` `API.md:50-54` — this is the ONLY projectable region.
4. **Icon override** — `[icon]="'css-class'"` replaces the severity-default SVG `[CODE]` `falcon-alert-dialog.tsx:150`; use sparingly — the severity icon carries meaning.
5. **Token override** — per-instance `style="--falcon-alert-dialog-icon-color: …; --falcon-alert-dialog-confirm-bg: …;"` `[CODE]` `USAGE.md:85-91`; theme-wide via Theme Studio. 23 tokens in `TOKENS.md`.
6. **Render path** — `[useTailwind]=true` (default, Light DOM) for Tailwind-v4 apps; `false` for Shadow-DOM token isolation.
7. **GAP** — 3-button "Save / Don't Save / Cancel", `[confirmLoading]` busy state, and per-severity icon sizes are NOT available `[CODE]` `GAPS_AND_UPGRADES.md:4-21` — raise an upgrade, do not hand-roll.

## Anti-patterns
- Using alert-dialog as a **generic modal** for editing/forms — `[CODE]` `OVERVIEW.md:50`. It is for decisions, not data entry.
- Defaulting every action to `severity="danger"` — `[CODE]` `OVERVIEW.md:52` overuse desensitises users to red.
- Expecting a **red Confirm button** from `severity="danger"` — `[CODE]` `TOKENS.md:34-38` Confirm stays teal for danger/warning/info; only `success` changes it.
- Setting both `[hideConfirm]` and `[hideCancel]` true — `[CODE]` `OVERVIEW.md:54` traps the user.
- Passing **HTML strings** into `[title]` / `[subtitle]` — `[CODE]` `OVERVIEW.md:54` they are plain text; use the body slot.
- Binding `onFalconClose` on the Stencil tag — `[CODE]` `falcon-alert-dialog.tsx:146` the correct event is `onFalcon-close`.
- Expecting a built-in spinner on Confirm for async work — there is no `[confirmLoading]` (`GAPS_AND_UPGRADES.md:16-18`); route failures to the global error pipeline.

## Verification
🟡 CODE-DERIVED from `falcon-alert-dialog.tsx` + the 6 UI dossier files. Cross-library map is `[INFERRED]` from each library's documented confirmation primitive. Composition recipe ✅ VERIFIED against `API.md` + `USAGE.md` + `TOKENS.md`.
