# falcon-mobile-number (LEGACY FACADE) — USAGE

## Real usage in active codebase
- _Verify with grep._ No active production templates found in this audit. The Wave 2 façade is compile-only compatibility — likely no production consumers remain, but kept as a safety net.

## Recommended NEW usage
- DO NOT add new consumers.
- For new phone fields, use `<falcon-angular-phone-field>` directly:
  ```html
  <falcon-angular-phone-field
    [label]="'hierarchy.fields.phone.label' | translate"
    [country]="'SA'"
    [(ngModel)]="phone"
    (falcon-verify)="verifyPhone($event)" />
  ```
- The Falcon phone field has built-in country picker, searchable country list, single shared border, and CVA support.

## Reactive Forms / ngModel
- Provides CVA + Validator. Works with `formControlName` and `ngModel`.

## Bad usage to avoid
- DO NOT pass `preferredCountries`, `showDialCode`, `maxLength` expecting behavior — they are silent no-ops.
- DO NOT use this for new code.

## Do / Don't
- DO let the existing consumers (if any) keep compiling.
- DON'T extend the façade.
- DON'T add more country mappings unless absolutely needed.
