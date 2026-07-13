# falcon-confirm-dialog — USAGE

## Real usage examples (active codebase)

**Zero render consumers.** `[CODE]` grep `<falcon-angular-confirm-dialog[^-]` / `<falcon-confirm-dialog[^-]` across `apps/` + `libs/falcon/` + `libs/falcon-ui-core/` (excluding the component's own folders) = **0** as of 2026-06-03. The component is dormant (Angular wrapper commented out; `index.ts` exports `export {}`). The examples below are **as-designed** patterns — they will NOT work today because the wrapper class is not exported.

> ⚠️ **Drift correction:** the prior dossier's Wave-7 sweep listed `client-settings-step.component.html` as a consumer. That is now **stale** — that file no longer references `<falcon-angular-confirm-dialog>` (grep clean 2026-06-03). The Add-Client wizards now confirm via `FalconConfirmService.confirm()` (`[CODE]` add-client-wizard.component.ts:361, add-user-wizard.component.ts:404).

## What to use instead (the LIVE confirm path)

```ts
import { FalconConfirmService } from '@falcon/ui-core/angular';

private readonly confirm = inject(FalconConfirmService);

this.confirm
  .confirm({ title: 'Discard changes?', body: 'Your edits will be lost.', confirmLabel: 'Discard' })
  .subscribe(accepted => { if (accepted) this.discard(); });
```

`[CODE]` This routes through `FalconMessageOrchestratorService.show({ category: 'action-required' })` → `FalconModalAdapterComponent` → `<falcon-angular-popup variant="error">` (`[CODE]` falcon-confirm.service.ts:91-105, falcon-modal-adapter.component.ts:51-61). **The confirm-dialog Stencil component is NOT in this path.** Live callers: `[CODE]` apps/admin-console + apps/management-console org-hierarchy wizards & state services, contact-groups list/detail, do-payment-priority-popup, libs/falcon user-details-page.

## Recommended usage (as-designed — if the wrapper were revived)

```html
<!-- ✗ Does not compile today (wrapper dormant). Shown for design intent only. -->
<falcon-angular-confirm-dialog
  [(open)]="confirmOpen"
  [title]="'Approve request?'"
  [message]="'This will mark the request as approved and notify the requester.'"
  severity="info"
  [acceptLabel]="'Approve'"
  [rejectLabel]="'Cancel'"
  (accept)="onApprove()"
  (reject)="onReject()" />
```

### With icon class (as-designed)

```html
<falcon-angular-confirm-dialog
  [(open)]="confirmOpen"
  [title]="'Delete record?'"
  [message]="'This action cannot be undone.'"
  severity="danger"
  icon="falcon-icon falcon-icon-trash"
  [acceptLabel]="'Delete'"
  (accept)="onDelete()" (reject)="onCancel()" />
```

## Raw Stencil usage (live, but no consumers)

The two Stencil tags ARE registered and could be used directly (without the Angular CVA niceties):

```html
<falcon-confirm-dialog-tw
  open
  heading="Approve request?"
  message="This will notify the requester."
  accept-label="Approve"
  reject-label="Cancel"></falcon-confirm-dialog-tw>
```

Listen for `falcon-confirm-accept` / `falcon-confirm-reject` (both bubble + composed). This is NOT recommended — prefer `FalconConfirmService`.

## Reactive Forms / ngModel

**N/A** — not a form control.

## Tailwind-only usage

The `-tw` twin renders with inlined Tailwind utilities (`[CODE]` tw.tsx:80-103). It does NOT use the `confirm-dialog-tailwind-classes.ts` helper functions (`falconConfirmDialogAcceptClasses()` / `falconConfirmDialogRejectClasses()`) — those helpers exist but are dead (GAP). Consumers cannot pass arbitrary wrapper classes (the dormant wrapper had no `wrapperClass`-style input; only `rootClass` forwarded to the dialog).

## Token override (as-designed)

```css
.high-stakes-confirm {
  --falcon-confirm-dialog-accept-bg: var(--color-falcon-red-700);
  --falcon-confirm-dialog-btn-radius: 8px;
  --falcon-confirm-dialog-icon-size: 40px;
}
```

```html
<falcon-angular-confirm-dialog rootClass="high-stakes-confirm" severity="danger" ... />
```

> The token selector also cascades through the composed `<falcon-dialog>` (`[CODE]` confirm-dialog.tokens.css:7), so dialog-level tokens resolve too.

## Bad usage to avoid

- **Do NOT uncomment / revive this wrapper "to use it"** without an owning decision — the platform already does confirm via `FalconConfirmService`→popup and rich confirm via `<falcon-angular-alert-dialog>`. Reviving it re-introduces a third, overlapping confirm path (GAP G1).
- **Do NOT** expect to project replacement footer buttons — the accept/reject buttons are hardcoded raw `<button>`s.
- **Do NOT** treat backdrop / Esc / X dismissal as distinct from rejection — all four fire the SAME reject signal (`[CODE]` tsx:91-95).
- **Do NOT** pass an `<svg>` to `icon` — it is a CSS class string rendered via `<i>`.
- **Do NOT** bind `[heading]` on the (dormant) Angular wrapper — it exposes `[title]`; `heading` is the Stencil-layer prop.
- **Do NOT** rely on an async-accept spinner — there is no `loading` input.

## Do / Don't

| Do | Don't |
|---|---|
| Use `FalconConfirmService.confirm()` for confirms today. | Revive the dormant wrapper without an owning decision. |
| Use `<falcon-angular-alert-dialog>` for icon-led "are you sure?" modals. | Use confirm-dialog for the 4 canonical flows (use popup). |
| Treat the (reject) signal as the universal cancel path. | Bind the inner dialog's `(falconClose)` separately. |
| Pass `[icon]` as a falcon-icon class string. | Pass `<svg>` content. |

## Consumer Sweep (2026-06-03)

[CODE] grep `<falcon-angular-confirm-dialog[^-]` + `<falcon-confirm-dialog[^-]` across `apps/` + `libs/falcon/` + `libs/falcon-ui-core/` (excluding own folders) → **0 render sites**.

Non-render references (NOT consumers): the component's own source files; `confirm-dialog-tailwind-classes.ts` (dead helper); `confirm-dialog.tokens.css` (token file); `stub-seeder.cjs` + `define-custom-elements.ts` (registration lists); comment references in `eslint.config.mjs:356`, `falcon-unsaved-changes-host.component.ts:5`, and the confirm-dialog-host barrel. **None instantiate the component.**

> The `<falcon-angular-confirm-dialog-host>` (host-shell/app.ts:53) is a SEPARATE component — it renders `<falcon-angular-alert-dialog>`, not this confirm-dialog.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15). Consumer count corrected to **0** (prior dossier claimed 1 at `client-settings-step` — now stale; verified gone). All "recommended" examples flagged non-compiling (wrapper dormant); the live confirm path documented as `FalconConfirmService`→popup.
