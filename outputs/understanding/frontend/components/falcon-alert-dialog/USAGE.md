# falcon-alert-dialog — USAGE

## Real usage examples (active codebase)

### Example 1 — error-message list via `ErrorDialogService` (LIVE)

`[CODE]` `libs/falcon/src/shared-ui/lib/components/falcon-error-dialog-host/falcon-error-dialog-host.component.html:4-25` — the canonical live consumer; `ErrorDialogService` projects a `<ul>` of messages into the body slot:

```html
@if (state(); as s) {
  <falcon-angular-alert-dialog
    [open]="true"
    [title]="titleText()"
    [subtitle]="subtitleText()"
    [severity]="severity()"
    [confirmLabel]="confirmLabel()"
    [hideCancel]="true"           <!-- acknowledgement-only -->
    size="md" position="center"
    [closable]="true" [closeOnBackdrop]="true" [closeOnEsc]="true"
    (falconConfirm)="dismiss()" (falconCancel)="dismiss()">
    <ul class="list-disc ps-5 m-0 space-y-1 text-falcon-neutral-800 text-sm text-start">
      @for (m of errorMessages(); track m + $index) { @if (m) { <li>{{ m }}</li> } }
    </ul>
  </falcon-angular-alert-dialog>
}
```

> `[CODE]` Both `(falconConfirm)` and `(falconCancel)` route to the same `dismiss()` — a single-CTA acknowledgement (`hideCancel`). The body `<ul>` is projected into the default slot; the icon/title/footer are the component's own.

### Example 2 — orchestrator acknowledgement modal (LIVE, indirect)

`[CODE]` `libs/falcon-ui-core/.../message-orchestrator/adapters/falcon-modal-adapter.component.ts:76-85` — when an orchestrator message is `configuration-required` WITHOUT an `actionCallback`, the adapter renders alert-dialog as a forced acknowledgement:

```html
<falcon-angular-alert-dialog
  [open]="true"
  [title]="currentMessage()!.title"
  [subtitle]="currentMessage()!.message"
  severity="warning"
  [confirmLabel]="alertDialogConfirmLabel()"
  [hideCancel]="true"
  (falconConfirm)="onConfirm()" (falconCancel)="onClose()" />
```

> You usually reach alert-dialog INDIRECTLY through `ErrorDialogService` or the orchestrator — not by hand-mounting it. (Imperative yes/no via `FalconConfirmService` renders `<falcon-angular-popup>`, NOT this.)

### Example 3 — warning + custom body + 2 buttons (SoT InsufficientBalance shape)

```html
<falcon-angular-alert-dialog
  [open]="showWarn"
  severity="warning"
  [title]="'Insufficient Balance Detected' | translate"
  [subtitle]="'Please prioritize the Communication Channel wallet…' | translate"
  [confirmLabel]="'Proceed Payment' | translate"
  [cancelLabel]="'Cancel' | translate"
  (falconCancel)="onWarnCancel()" (falconConfirm)="onProceed()">
  <div class="border border-falcon-neutral-200 rounded-[12px] p-[14px]">
    <ul class="flex flex-col gap-2">
      @for (ch of channels; track ch.id; let i = $index) { <li>{{ i + 1 }}. {{ ch.name }}</li> }
    </ul>
  </div>
</falcon-angular-alert-dialog>
```

### Example 4 — destructive confirm (no backdrop dismiss)

```html
<falcon-angular-alert-dialog
  [open]="showDelete"
  severity="danger"
  [title]="'Delete this account?' | translate"
  [subtitle]="'This action cannot be undone.' | translate"
  [confirmLabel]="'Delete' | translate" [cancelLabel]="'Cancel' | translate"
  [closeOnBackdrop]="false"
  (falconConfirm)="confirmDelete()" (falconCancel)="cancelDelete()">
</falcon-angular-alert-dialog>
```

## When NOT to use it — a real, documented exception

`[CODE]` `apps/admin-console/.../new-wallet-balance/.../wb-confirm-save-modal/wb-confirm-save-modal.component.ts:17-23` deliberately chose `<falcon-angular-dialog>` over alert-dialog, documenting alert-dialog's constraint precisely:

> "`<falcon-angular-alert-dialog>` ALWAYS renders its own severity glyph + title ABOVE the body slot and its own footer buttons, so the badge would land BELOW the title with an unwanted triangle/check above it (a VIEW change). The base `<falcon-angular-dialog>` projects a single stable slot child, so the SoT card renders 1:1."

> **Rule:** if your design needs a custom header (a badge ABOVE the title, no severity glyph) or custom footer, drop to `<falcon-angular-dialog>`. Alert-dialog's icon-led header + Cancel/Confirm footer are not overridable.

## Recommended usage for NEW pages

Prefer the host/service indirection where one exists (`ErrorDialogService` for error lists; the orchestrator for config-locked acknowledgements). Mount alert-dialog directly only for a bespoke icon-led decision with a custom body, and bind `[(open)]` + `(falconConfirm)`/`(falconCancel)`.

```html
<falcon-angular-alert-dialog
  [(open)]="state.showWarn"
  severity="warning"
  [title]="'…' | translate"
  [subtitle]="'…' | translate"
  (falconConfirm)="onProceed()" (falconCancel)="onCancel()">
  <!-- custom body -->
</falcon-angular-alert-dialog>
```

## Two-way binding

```html
<falcon-angular-alert-dialog [(open)]="showWarn" severity="warning" [title]="…" (falconConfirm)="onProceed()" />
```

## Token override (per-instance)

```html
<falcon-angular-alert-dialog
  severity="warning"
  style="--falcon-alert-dialog-icon-color: var(--color-falcon-amber-500); --falcon-alert-dialog-confirm-bg: var(--color-falcon-amber-600);"
  [title]="…">
</falcon-angular-alert-dialog>
```

> Per-instance `style="--falcon-alert-dialog-*: …"` works because the tokens are declared on the Stencil `:host` and inherit. Prefer Falcon palette tokens over hex (the prior dossier's `#FF6B35` example is a literal — avoid).

## Reactive Forms / ngModel

**N/A** — modal, not a form control. Use `[(open)]`.

## Single-button modes

| Mode | `hideCancel` | `hideConfirm` | Use case |
|---|---|---|---|
| Two-button (default) | false | false | Confirm-or-cancel decision |
| Cancel-only | false | true | Acknowledge an info/success message |
| Confirm-only | true | false | Force-acknowledge a warning/error (`ErrorDialogService` uses this) |

> Never set BOTH `hideCancel` AND `hideConfirm` — the user is left with no button.

## Bad usage to avoid

- **Do NOT** pass HTML strings into `title`/`subtitle` (plain-text only; use the body slot for rich content).
- **Do NOT** try to project a custom header/footer — they are composed internally (use `<falcon-angular-dialog>` if you need them — see the wb-confirm-save-modal exception).
- **Do NOT** set both `hideCancel` and `hideConfirm`.
- **Do NOT** use `severity="danger"` for routine actions — reserve red for genuinely destructive ops.
- **Do NOT** use it for post-action "saved!" feedback — that is a toast.
- **Do NOT** hand-mount it for a simple imperative yes/no — inject `FalconConfirmService` (renders `<falcon-angular-popup>`).
- **Do NOT** bind `[heading]`/`[title]` on the raw Stencil tag — the wrapper maps `title` → `heading-text` attr.

## Do / Don't

| Do | Don't |
|---|---|
| Reach it via `ErrorDialogService` / the orchestrator where possible. | Hand-mount for every confirm (use `FalconConfirmService`). |
| Use `hideCancel`/`hideConfirm` for single-CTA. | Set both (user stuck). |
| Override tokens via `style="--falcon-alert-dialog-*"` (palette tokens). | Add SCSS/component CSS in the consumer; use hex literals. |
| Drop to `<falcon-angular-dialog>` for custom header/footer. | Fight alert-dialog's fixed icon-led header. |

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-alert-dialog>` across `apps/` + `libs/falcon/` + `libs/falcon-ui-core/` → **12 files**. True render/import consumers (excluding the component's own wrapper + barrels + the doctrine comment):

- `libs/falcon-ui-core/src/services/message-orchestrator/adapters/falcon-modal-adapter.component.ts` (renders alert-dialog for `configuration-required`-no-`actionCallback`).
- `libs/falcon/src/shared-ui/lib/components/falcon-error-dialog-host/falcon-error-dialog-host.component.{ts,html}` + `libs/falcon/src/shared-ui/index.ts` (re-export) — `ErrorDialogService` error-list renderer.
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-confirm-dialog-host/falcon-confirm-dialog-host.component.{ts,html}` — legacy confirm-host template (dead in Phase 5).
- `apps/admin-console/.../new-wallet-balance/.../wb-confirm-save-modal/wb-confirm-save-modal.component.ts` — references alert-dialog in its "why NOT" doctrine comment (it actually uses `<falcon-angular-dialog>`).
- `apps/{admin,management}-console/.../org-hierarchy-page/.../settings-tab/settings-tab.component.ts` — comments noting it replaced an inline alert-dialog with an orchestrator confirm flow.
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-popup/falcon-http-error-dialog.service.ts:6` — doctrine comment ("parallel to ErrorDialogService which drives alert-dialog").

> Heaviest TRUE render usage is indirect (orchestrator adapter + error-dialog-host). Direct `[(open)]` page mounts are rare today — the host/service indirection is preferred.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15). Example 1 (error-dialog-host) + Example 2 (modal-adapter) cited line-accurate; the wb-confirm-save-modal "why NOT alert-dialog" exception quoted from source. Consumer sweep re-run → **12 files** (prior dossier: 2 — both of those, `settings-tab` + `client-settings-step`, are now superseded/commented references, not live mounts).
