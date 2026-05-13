# send-credentials-popup (LEGACY) — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) SCSS file violates project rule
- `send-credentials-popup.component.scss` exists. Delete during refactor.

### 2. (P1) No slot-friendly variant of `<falcon-angular-popup>` yet
- This bespoke component exists because `<falcon-angular-popup>` has only 4 fixed variants (error / delete / unsaved / save) — none accept a radio-group body slot.
- **Recommendation:** add a `<falcon-angular-popup variant="custom">` mode with `<ng-content>` for the body slot. Then this bespoke component can be deleted in favor of:
  ```html
  <falcon-angular-popup variant="custom" [open]="visible">
    <h3>Send credentials to {{ recipientLabel }}: {{ accountOwnerName }}</h3>
    <falcon-angular-radio-group [(ngModel)]="method" [options]="deliveryMethodOptions" />
    <button slot="footer" (click)="onSend()" [disabled]="loading">Send</button>
  </falcon-angular-popup>
  ```

### 3. (P1) Hard-coded English string `recipientLabel='Account owner'`
- Default is English; consumer must override for Arabic / Spanish.
- **Recommendation:** use a translation key instead.

### 4. (P2) Loading state lacks visual feedback
- `loading=true` only disables Submit. No spinner or text change.
- **Recommendation:** render a spinner icon inside the Submit button when loading.

### 5. (P2) No "Cancel" button
- Currently only Submit + close-X (from the dialog chrome). Some flows want an explicit Cancel button.
- **Recommendation:** add `showCancel?: boolean` Input + `(cancel)` Output.

### 6. (P2) No keyboard activation for Submit
- Consumer can't drive Submit via Ctrl+Enter or Enter on the radio group.

## Missing accessibility features
- No `aria-live` for loading state.
- No focus trap on dialog visible (verify; should be inherited from `<falcon-angular-dialog>`).

## Missing tests
- _None observed._

## Missing Tailwind / token parity
- None — bespoke SCSS.

## Performance risks
- Negligible.

## Visual / interaction risks
- The Submit button stays in disabled state if the consumer forgets to reset `loading`.

## Reusable upgrade priority
- Migrate to `<falcon-angular-popup variant="custom">` once available.

## Workaround availability
- For #2: keep using this bespoke component.
- For #3: pass a translated string via `recipientLabel`.
- For #4: wrap with a `[class.is-loading]` overlay.
