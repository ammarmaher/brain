# falcon-confirm-dialog — GAPS AND UPGRADES

## Missing capabilities

### P1 — Footer buttons are not `<falcon-angular-button>`
The Stencil source renders raw `<button class="falcon-confirm-btn falcon-confirm-btn--accept">` (lines 124-138). The Angular wrapper template ALSO renders raw `<button>` tags. Neither uses the design-system button primitive.

**Consequences:**
- Loading state (busy spinner during async accept) not available.
- Disabled state requires manual class binding.
- Token contract diverges from `<falcon-angular-button>`.
- Severity-styled buttons can drift from button token semantics.

**Fix:**
- Wrapper template should render `<falcon-angular-button variant="primary" [label]="acceptLabel" (falconClick)="onAccept()">` and `<falcon-angular-button variant="ghost" [label]="rejectLabel" (falconClick)="onReject()">`.
- Stencil source similarly should compose `<falcon-button-tw>`.

**Priority: P1** — design system consistency.

### P1 — No `loading` / async accept state
Common pattern: "Approve" button kicks off API call; needs spinner. Today the consumer has to close the dialog optimistically or manage external loading state.

**Proposed:**
```ts
@Input() loading = false;
@Input() acceptDisabled = false;
```

**Priority: P1**

### P1 — Icon is CSS class string, not `<falcon-angular-icon>`
Same as the popup gap — using `<i class="falcon-icon falcon-icon-X">` bypasses the icon abstraction.

**Priority: P1**

### P2 — No focus trap (inherited from substrate dialog)
Wait — the substrate `<falcon-dialog>` DOES have focus trap. Verified in source (lines 142-166). So confirm-dialog inherits it. Good.

### P2 — No `[asTertiaryButton]` / 3-button mode
For "Save / Discard / Cancel" patterns. Today only 2 buttons supported.

**Priority: P2**

### P2 — `aria-describedby` not linked
The message text has no `id` exposed for the dialog's `aria-describedby` to link to.

**Priority: P2** — a11y improvement.

### P3 — Wrapper's `title` vs Stencil's `heading`
The wrapper renames `heading` to `title`. Possibly intentional for parity with `<falcon-angular-dialog>` which also uses `title`. Document this clearly.

**Priority: P3** — clarity.

## Missing ng-template / template slots
- No `<ng-template falconConfirmDialogActions>` directive for custom button content.
- No `<ng-content select="[slot=footer]">` — accept/reject are locked-in.

## Missing flags / options / states
- No `[loading]`, `[acceptDisabled]`, `[rejectDisabled]`.
- No tertiary button.
- No "danger confirm" tone separation (severity drives accept button tone via token, but not finely).

## Missing accessibility features
- See P2 above (aria-describedby).
- The reject button is rendered FIRST in DOM order, accept SECOND — keyboard tab focuses reject first. Conventional pattern? Generally accept is the primary so primary should be focused. **Recheck** the source — confirm-dialog renders reject FIRST (line 124), accept SECOND. Verify this matches WAI-ARIA APG dialog patterns.

## Missing tests
- No `.spec.ts`.
- No integration test for the (reject) firing on all dismissal paths.

## Missing Tailwind / token parity
- Light + Shadow renderers should be reviewed for parity (not deeply audited in this pass).
- The token file `confirm-dialog.tokens.css` is small (29 lines) — mostly button + body padding tokens. No issue.

## Performance risks
None — passive component.

## Visual / interaction risks
- Reject and accept buttons share the same hardcoded `<button>` markup with different modifier classes. No focus halo unless tokens declare it.
- Severity color flow: `severity="danger"` should make the accept button red — verify the token wiring on the actual implementation.

## Reusable upgrades needed
1. **Replace inline `<button>` with `<falcon-angular-button>` / `<falcon-button-tw>`** — P1.
2. **Add `loading` / `acceptDisabled` / `rejectDisabled`** — P1.
3. **Replace `icon` CSS class with `<falcon-angular-icon>`** — P1.
4. **Tertiary button slot or input** — P2.
5. **Link `aria-describedby` to message** — P2.

## Priority: page-level vs shared
All belong in the shared component.

## Recommended upgrade API (proposed)

```ts
@Component({ selector: 'falcon-angular-confirm-dialog', ... })
export class FalconAngularConfirmDialogComponent {
  @Input() open = false;
  @Input() title?: string;
  @Input() message?: string;
  @Input() iconName?: string;             // new — use falcon-angular-icon
  @Input() acceptLabel = 'OK';
  @Input() rejectLabel = 'Cancel';
  @Input() severity: FalconDialogSeverity = 'info';
  @Input() size: FalconDialogSize = 'sm';
  @Input() position: FalconDialogPosition = 'center';
  @Input() closable = true;
  @Input() closeOnBackdrop = true;
  @Input() closeOnEsc = true;
  @Input() loading = false;                // new
  @Input() acceptDisabled = false;         // new
  @Input() rejectDisabled = false;         // new
  @Input() tertiaryButton?: { label: string; tone: 'ghost' | 'primary'; on: () => void };

  @Output() accept = new EventEmitter<void>();
  @Output() reject = new EventEmitter<void>();
  @Output() tertiary = new EventEmitter<void>();
  @Output() openChange = new EventEmitter<boolean>();
}
```

Template would render `<falcon-angular-button>` instances composed in the footer.

## Future-proof recommendation
This component is currently unused in production. **Now is the time to land the structural fixes** (button composition, icon component, async state) before consumers start adopting it.
