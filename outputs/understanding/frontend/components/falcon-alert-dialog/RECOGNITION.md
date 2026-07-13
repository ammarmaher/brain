# falcon-alert-dialog — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-alert-dialog>` (or its host-driven renderers) as the component, and how to compose it to parity.

## Visual fingerprint

`[CODE]` falcon-alert-dialog.tsx:133-181 — a **centered modal callout**:
- A large (56px) **severity icon centered at the top** — a red filled triangle-exclamation for `danger`/`warning`, a green filled circle-check for `success`, a teal filled circle-i for `info` (`[CODE]` tsx:104-131).
- A heavy **centered title** (18px / weight 700) below the icon.
- A **narrow centered subtitle** (13px, clamped to max 460px) — deliberately short measure so the user reads it.
- An optional **consumer-projected body** between subtitle and footer (priority list, info pill, error `<ul>`, summary) — the ONLY projectable region.
- A **2-button footer** — outlined Cancel + solid (teal/severity) Confirm — right-aligned in one row.
- Optional close-X (`closable`, default OFF), dimmed+blurred backdrop, focus-trap (inherited), wrapped in a native `<dialog>` (Top Layer).

The whole fingerprint: *icon-first, centered, two decisions, slow*. Left-aligned small-icon one-line → that's `<falcon-confirm-dialog>` (dormant); exact error/delete/unsaved/save → `<falcon-popup>`.

## Cross-library equivalents

| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Dialog>` + centered `<DialogContent>` + icon (no preset) | alert-dialog is the Falcon answer to a hand-built MUI confirm dialog. |
| PrimeNG | `<p-confirmDialog>` (centered, icon-led) / `confirmationService.confirm()` | closest 1:1 for the centered confirm. |
| Ant Design | `Modal.confirm()` / `Modal.error()` / `Modal.warning()` | the static modal family — icon + title + content + OK/Cancel. |
| Bootstrap | `.modal.modal-dialog-centered` + custom icon | upgrade target — no severity preset. |
| shadcn / Radix | `<AlertDialog>` | direct 1:1 — the name matches; Radix `AlertDialog` is the "interrupt + require a decision" primitive. |
| plain HTML | `window.confirm()` / `<dialog>` | always replace. |

## Use THIS vs siblings

| If the design shows… | Use | NOT |
|---|---|---|
| centered icon + title + subtitle + 2 buttons, a high-stakes "are you sure?" or an advisory | `<falcon-angular-alert-dialog>` (or reach it via `ErrorDialogService` / orchestrator) | — |
| a backend error-message list to acknowledge | `ErrorDialogService` (renders alert-dialog) | a hand-built modal |
| an imperative yes/no from code that returns a boolean | `FalconConfirmService.confirm()` (renders `<falcon-popup>`) | hand-mounting alert-dialog |
| one of the 4 canonical flows: error / delete / unsaved / save | `<falcon-angular-popup>` (right variant) | alert-dialog |
| a form / date picker / **custom header (badge above title)** | `<falcon-angular-dialog>` (primitive) | alert-dialog (header is fixed icon-led) |
| a transient "Saved!" after the action | toast / `<falcon-angular-notification>` | alert-dialog |
| a side-panel for editing | `<falcon-angular-drawer>` | alert-dialog |

## Composition recipe to reach parity

`[VAULT]` Customization order (inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP):

1. **Inputs** — `[(open)]`, `[title]` (→ `heading-text`), `[subtitle]`, `[severity]` (`danger`/`warning`/`info`/`success`), `[confirmLabel]`, `[cancelLabel]`, `[size]`, `[position]`, `[closable]`, `[closeOnBackdrop]`, `[closeOnEsc]` (`[CODE]` API.md).
2. **Single-CTA variants** — `[hideCancel]="true"` (Confirm-only acknowledgement, e.g. `ErrorDialogService`); `[hideConfirm]="true"` (Cancel-only). Never both.
3. **Body slot** — project custom content into the default unnamed slot (the ONLY projectable region — `[CODE]` tsx:156-158). Header + footer are fixed.
4. **Icon override** — `[icon]="'css-class'"` replaces the severity-default SVG (`[CODE]` tsx:150); use sparingly — the severity icon carries meaning.
5. **Token override** — per-instance `style="--falcon-alert-dialog-*: …"` (palette tokens, not hex). ⚠️ **Shadow path only** — the `-tw` (default) render path ignores these (GAP G1); for the live render you'd override the underlying theme vars (broad) instead.
6. **Render path** — `[useTailwind]=true` (default, Light DOM); `false` for Shadow isolation.
7. **GAP** — 3-button mode, `[confirmLoading]` busy state, per-severity icon sizes, `<falcon-angular-icon>` override are NOT available (`[BRAIN-OUT]` GAPS_AND_UPGRADES.md) — raise an upgrade, do not hand-roll. For a custom header/footer, drop to `<falcon-angular-dialog>` (the documented `wb-confirm-save-modal` choice).

## Anti-patterns

- Using alert-dialog as a **generic editing modal** — it is for decisions/advisories, not data entry → `<falcon-angular-dialog>`.
- Forcing a **custom header** (badge above title) onto alert-dialog — its icon-led header is fixed; drop to `<falcon-angular-dialog>` (`[CODE]` wb-confirm-save-modal.component.ts:17-23 documents this exact reason).
- Defaulting every action to `severity="danger"` — overuse desensitises users to red.
- Expecting a **red Confirm button** from `severity="danger"` — Confirm stays teal for danger/warning/info; only `success` changes it (`[CODE]` css:32-46).
- Setting both `[hideConfirm]` and `[hideCancel]` true — traps the user.
- Passing **HTML strings** into `[title]`/`[subtitle]` — plain text only; use the body slot.
- Expecting per-instance `--falcon-alert-dialog-*` overrides to retint the live `-tw` render — they don't (GAP G1).
- Binding `[heading]`/`onFalconClose` on the raw Stencil tag — the wrapper maps `title`→`heading-text` and the dialog event is `onFalcon-close`.
- Hand-mounting alert-dialog for a simple imperative yes/no — inject `FalconConfirmService` (renders `<falcon-popup>`).

## Verification
🟡 CODE-DERIVED 2026-06-03 (B15) from `falcon-alert-dialog.tsx` + `-tw` + the UI dossier files. Routing table refreshed to distinguish the LIVE renderers (`ErrorDialogService`/orchestrator = alert-dialog acknowledgement; `FalconConfirmService` = popup decision). The `-tw` per-instance-override caveat (G1) added to the token step. Cross-library map `[INFERRED]`.
