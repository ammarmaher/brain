# falcon-dialog — USAGE

## Real usage examples (active codebase)

### Example 1 — Bespoke-body modal (the justified direct use)

`apps/management-console/src/app/features/contact-groups/share-dialog/share-dialog.component.html:7-15` — the canonical legitimate direct use: a custom share form (multiselect + AllUsers toggle + inline error banner) that no `popup` variant fits, with all dismissal paths gated on an in-flight `submitting()` signal:

```html
<falcon-angular-dialog
  [open]="open"
  size="lg"
  [title]="('contactGroups.detail.sharePageTitle' | translate) + (groupName ? ' — ' + groupName : '')"
  [closable]="!submitting()"
  [closeOnBackdrop]="!submitting()"
  [closeOnEsc]="!submitting()"
  (falconClose)="onClose()">
  <div class="flex flex-col gap-4 p-4">
    <!-- error banner, AllUsers switch, multiselect, footer buttons … -->
  </div>
</falcon-angular-dialog>
```

> Note the pattern: `[closable]`/`[closeOnBackdrop]`/`[closeOnEsc]` are all bound to `!submitting()` so the operator cannot dismiss mid-save (`dismissible` would be the single-flag equivalent).

### Example 2 — Confirm-save composition (wallet)

`apps/admin-console/src/app/features/new-wallet-balance/components/wb-confirm-save-modal/wb-confirm-save-modal.component.ts` composes `<falcon-angular-dialog>` directly as a feature shell (7 occurrences); covered by `__tests__/confirm-save-modal.spec.ts`.

### Example 3 — Recommended NEW usage (rare — only when popup variants don't fit)

```html
<falcon-angular-dialog
  [(open)]="modalOpen"
  [title]="'Generate Report'"
  [description]="'Choose report parameters'"
  size="md"
  position="center"
  severity="info">

  <div class="grid gap-4 py-2">
    <falcon-angular-dropdown [options]="reportTypeOptions" formControlName="type" label="Report type" />
    <falcon-angular-date-picker formControlName="from" label="From" />
  </div>

  <div slot="footer">
    <falcon-angular-button variant="ghost" [label]="'Cancel' | translate" (falconClick)="onCancel()" />
    <falcon-angular-button [label]="'Generate' | translate" [loading]="generating()" (falconClick)="onGenerate()" />
  </div>
</falcon-angular-dialog>
```

> On the default Tailwind path the `slot="footer"` content is automatically wrapped in the token-driven footer chrome (gap / top-border / `justify-end`) — you do NOT need to re-add those utilities. On the Shadow path you would.

## Reactive forms inside dialog
The dialog is just a container — the form lives inside and uses its own `FormGroup`/signals. Hoist state to the parent: `[CODE]` falcon-dialog.tsx:186 `render()` returns `null` when `!open`, so the body DOM (and any signal state in it) is destroyed on close and rebuilt on next open.

## ngModel example
N/A — dialog is not a form control.

## Tailwind-only usage
Apply layout utilities INSIDE the body slot (the contact-groups example uses `flex flex-col gap-4 p-4`). Do NOT add layout utilities to the dialog host — panel geometry is `[size]`/token-driven.

## Token override (per-instance)
Add a host class on the consumer, then mutate `--falcon-dialog-*` tokens in a CSS file scoped to it:

```css
.report-dialog {
  --falcon-dialog-panel-border-radius: 24px;
  --falcon-dialog-panel-padding-block: 32px;
  --falcon-dialog-panel-padding-inline: 40px;
}
```

> `[CODE]` The `:where(falcon-dialog, falcon-dialog-tw, falcon-angular-dialog, .falcon-dialog, [data-falcon-dialog])` selector keeps specificity 0 so a host-class override wins. Both render paths read the same tokens.

## Bad usage to avoid
- **Don't use this for "Are you sure?" prompts** — use `<falcon-angular-confirm-dialog>`.
- **Don't use this for the 4 canonical actions** (error / delete / unsaved / save) — use `<falcon-angular-popup>`.
- **Don't bind `[errorMessage]`** expecting an inline banner — it is a **dead prop**, never rendered (GAP G-ERR).
- **Don't wire `(falconConfirm)` / `(falconCancel)`** without explicitly emitting them — no built-in button fires them.
- **Don't render multiple dialogs simultaneously** — each Stencil core runs its own `document` keydown listener; Esc resolves ambiguously. (At the Top-Layer level the browser stacks them, but the hand-rolled Esc handlers still collide.)
- **Don't use `position="side-right"`** — that's the drawer's concept; use `<falcon-angular-drawer position="right">`.
- **Don't add SCSS rules** in the consumer's `.component.css` to style the panel — use the per-instance token override.

## Import requirements (standalone component)
```ts
import { FalconAngularDialogComponent } from '@falcon/ui-core';

@Component({
  standalone: true,
  imports: [FalconAngularDialogComponent],
  // CUSTOM_ELEMENTS_SCHEMA is already declared on the wrapper internally — host does NOT need it.
})
```

## Do / Don't

| Do | Don't |
|---|---|
| Use `<falcon-angular-popup>` for canonical decision flows | Render `<falcon-angular-dialog>` directly for new code (unless bespoke body) |
| Compose this via `<falcon-angular-confirm-dialog>` for accept/reject | Wire `falconConfirm`/`falconCancel` without explicit emit |
| Gate `[closable]`/`[closeOnBackdrop]`/`[closeOnEsc]` on in-flight state | Stack multiple dialogs at once |
| Use tokens for visual overrides | Inline Tailwind on the panel host |
| Project `slot="footer"` (Tailwind path auto-adds chrome) | Bind `[errorMessage]` (dead prop) |

## Consumer Sweep (2026-06-03)

[CODE] grep `falcon-angular-dialog` across `apps/` → **9 files / 19 occurrences**; across `libs/falcon/` → **2 files / 3 occurrences**. Full list:

- `apps/management-console/.../contact-groups/share-dialog/share-dialog.component.html` (2) — **flagship bespoke modal**.
- `apps/{admin,management}-console/.../templates-page/components/templates-wizard/steps/flow/flow-type-modal.component.ts` (1 each) + `flow-editor.component.ts` (1 each) + `flow-modal-bus.ts` (1 each, TS string ref).
- `apps/admin-console/.../new-wallet-balance/components/wb-confirm-save-modal/wb-confirm-save-modal.component.ts` (7) + `new-wallet-balance/__tests__/confirm-save-modal.spec.ts` (4, test).
- `libs/falcon/src/shared-ui/index.ts` (1, re-export) · `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.ts` (2).

> `[INFERRED]` The prior dossier's "1 file (playground only)" + `otp-dialog.component.ts` were stale: `playground` is removed; `otp-dialog` now consumes `falcon-angular-popup` (verified in popup's sweep). Adoption rose mainly via templates-page flow modals + the new-wallet-balance confirm-save modal + the contact-groups share dialog.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B14). Example 1 confirmed against live `share-dialog.component.html:7-15`. Consumer Sweep re-run (`falcon-angular-dialog` → 9 app files / 19 + 2 lib / 3). Footer-chrome behaviour cross-checked against falcon-dialog-tw.tsx:246-248 + dialog-tailwind-classes.ts:176.
