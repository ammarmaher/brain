*** falcon-alert-dialog — SPEC ***

# `<falcon-alert-dialog>` / `<falcon-alert-dialog-tw>` / `<falcon-angular-alert-dialog>`

Round 4 (2026-05-15). Derived from the React SoT `InsufficientBalanceModal`
(`Source_of_truth_theme/React/Falcon-Taha (1)/admin/apps.jsx` lines 267-360).

## Purpose

Severity-styled centered-icon dialog with title + subtitle + body slot + Cancel/Confirm
footer. Drop-in for modals that need a centered warning/info/success/danger callout,
where the body is custom content (priority lists, forms, summary lines, etc.).

## Visual contract (SoT)

```
+-----------------------------------------+
|                  [icon]                 |   <- 56px severity icon, centered
|                                         |
|         Insufficient Balance Detected   |   <- 18px bold title
|     Please prioritize the Communication |
|     Channel wallet to deduct…           |   <- 13px subtitle, max 460px wide
|                                         |
|   ┌─────────────────────────────────┐   |   <- body slot (consumer content)
|   │ 1 ⋮⋮ WhatsApp        v ^        │   |
|   │ 2 ⋮⋮ Voice           v ^        │   |
|   │ 3 ⋮⋮ AI-ChatGPT      v ^        │   |
|   └─────────────────────────────────┘   |
|   ⓘ The first channel will be used      |   <- info pill (body slot)
|     automatically.                      |
|                                         |
|                     [Cancel] [Proceed]  |   <- footer (rendered by component)
+-----------------------------------------+
```

## Severity variants

| Severity | Icon | Confirm bg | Default |
|---|---|---|---|
| `warning` | Red triangle exclamation | `var(--falcon-teal-700)` | **yes** |
| `danger` | Red triangle exclamation | `var(--falcon-teal-700)` | |
| `info` | Teal circle-i | `var(--falcon-teal-700)` | |
| `success` | Green circle-check | `var(--falcon-status-success)` | |

Severity drives icon glyph + Confirm button color. Tokens flow through CSS custom
properties: consumers can override per-instance.

## Dismiss behavior

- **Backdrop click** → emits `falcon-alert-cancel` with `reason: 'backdrop'`
- **Escape key** → emits `falcon-alert-cancel` with `reason: 'esc'`
- **Close X** → emits `falcon-alert-cancel` with `reason: 'close'`
- **Cancel button** → emits `falcon-alert-cancel` with `reason: 'cancel'`
- **Confirm button** → emits `falcon-alert-confirm`

All dismiss paths set `open = false` and emit `falcon-alert-open-change(false)`.

`[closable]` defaults to `false` (no X). For acknowledgement-only dialogs that
should not be dismissed via backdrop, set `[closeOnBackdrop]="false"` +
`[closeOnEsc]="false"` + use `[hideCancel]="true"` to leave only Confirm.

## A11y

- `role="alertdialog"` when severity is `warning` or `danger`
- `role="dialog"` for `info` and `success`
- `aria-label` mirrors `title` (falls back to "Alert dialog" if absent)
- Focus trap inherited from `<falcon-dialog>` composition
- Confirm button is the default focus target after open

## Two-button vs single-button modes

| Mode | hideCancel | hideConfirm | Use case |
|---|---|---|---|
| Two-button | false | false | Standard confirm-or-cancel (DEFAULT) |
| Cancel-only | false | true | Acknowledgement of an info/success message |
| Confirm-only | true | false | Force-acknowledge a warning |
