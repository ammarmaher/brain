# falcon-popup — GAPS AND UPGRADES

## Missing capabilities

### P0 — No focus trap / focus restore
The popup uses `role="dialog"` + `aria-modal="true"` but does NOT implement a focus trap. Tab from inside the popup can escape into the page underneath. Comparison: `falcon-angular-drawer` and `falcon-angular-dialog` BOTH have focus traps.

**Risk:** keyboard users can lose context (escape into elements they can't see), tab order breaks WCAG 2.1 SC 2.4.3 (Focus Order) and SC 2.4.11 (Focus Not Obscured).

**Where to fix:** This component (shared, not page-level).

**Fix path:**
- Composed approach: have the popup compose `<falcon-angular-dialog>` (with the existing focus trap) and project its variant-driven body. Currently it ignores `falcon-dialog` entirely.
- OR replicate the focus-trap pattern from `falcon-dialog.tsx` lines 142-166.

**Priority: P0** — a11y violation.

### P0 — No loading state on confirm action
After clicking "Delete", the popup stays open and the Delete button is clickable again. There's no built-in mechanism to:
- Show a spinner during async work.
- Disable both buttons during in-flight work.
- Display the error state if the action fails.

Consumers must:
- Close the popup, then run the async work outside it (loses context if it fails).
- Or: manage a parallel `[loading]` signal + manually disable buttons (popup has no such inputs).

**Proposed API:**
```ts
@Input() loading = false;          // disable both buttons, show spinner on confirm
@Input() confirmDisabled = false;  // independently disable confirm
```

**Priority: P0**

### P1 — No way to add a 5th variant without source changes
The `VARIANTS` const is `Record<FalconPopupVariant, VariantContent>` — typed against the union. Adding a new flow type (e.g. `archive`, `restore`) requires:
- Extending the `FalconPopupVariant` union.
- Adding a `VariantContent` entry.
- Adding an icon path to the `<svg>` `@switch` block (lines 121-149 of the component).

**Workaround:** use `<falcon-angular-confirm-dialog>` for non-canonical flows.

**Priority: P1** — design system extensibility.

### P1 — Icons are inline SVG hardcoded, not using `<falcon-angular-icon>`
The popup uses inline `<svg>` with hardcoded paths for the 4 icons. This bypasses the vendored Falcon icon font and the `<falcon-angular-icon>` abstraction.

**Risk:** inconsistency with the rest of the platform's icon usage; changing brand icons requires modifying the popup source.

**Fix:** swap inline SVG for `<falcon-angular-icon [name]="content().icon">` calls.

**Priority: P1**

### P1 — No token file
Unlike every other Falcon UI component, popup has no `libs/falcon-ui-tokens/src/components/popup.tokens.css`. Visual customisation requires editing the inline template's Tailwind classes.

**Risk:** Theme drift, brand customisation impossible per instance.

**Proposed:** introduce `popup.tokens.css` with per-variant accent / chip / surface tokens.

**Priority: P1**

### P2 — No `severity` input independent of variant
`variant` carries both UI semantics AND intent. To get a "primary-tone confirm with a generic info icon", you have to override `titleOverride`, `bodyOverride`, `hintOverride`, AND `confirmLabelOverride` while picking the closest matching variant.

**Proposed:** decouple `variant` (visual / icon) from `tone` (intent).

**Priority: P2**

### P2 — `name` interpolation is `delete`-variant only
Other variants ignore the `name` input. Inconsistent.

**Priority: P2**

### P3 — Backdrop blur is always on when `glossy=true`
`glossy=true` is the default. On low-end devices the blur is expensive. Consider an opt-out per page.

**Priority: P3**

## Missing ng-template / template slots
- No body slot — body is pure string + signal-driven override. Rich content (icons inline, formatted text, a small form) not supported.
- No footer slot — buttons are fixed at 2 (cancel + confirm).
- No icon slot — icons hardcoded per variant.

## Missing flags / options / states
- `loading` / `confirmDisabled` — see above.
- `tertiaryButton` — for 3-button decisions (Save / Discard / Cancel).
- `dismissible` — today Esc always dismisses; no way to force the user to pick one of the 2 buttons.
- `position` — always centered.
- `size` — always max-w-md.

## Missing accessibility features
- **No focus trap (P0).**
- **No focus restore (P0).** Closing the popup leaves focus on the document body, not back on the trigger element.
- No `aria-describedby` linking body/hint to the dialog.
- No `aria-labelledby` linking title to the dialog (currently uses `aria-label="<resolvedTitle>"`).

## Missing tests
- No `.spec.ts`.
- No visual regression test for the 4 variants.

## Missing Tailwind / token parity
N/A — popup is Tailwind-direct, no Shadow / Light split.

## Performance risks
- The backdrop-blur is heavy on low-end devices.
- The `effect()` re-runs the auto-dismiss timer logic — fine for popup (no auto-dismiss).
- Re-rendering on each signal change is `OnPush`-friendly.

## Visual / interaction risks
- The "Cancel" button always uses `variant="secondary"` on `<falcon-button-tw>` regardless of intent.
- The "Confirm" button visually matches the confirm tone, but for `variant="unsaved"` the confirm button is RED ("Discard & leave") — this is intentional (destructive confirm) but can read as "wrong" without context.
- The icon chip has no animation — opens with the entire panel scale-in.

## Reusable upgrades needed
1. **Focus trap + restore** (P0).
2. **`loading` / `confirmDisabled` inputs** (P0).
3. **Replace inline SVG with `<falcon-angular-icon>`** (P1).
4. **Introduce `popup.tokens.css`** (P1).
5. **Compose `<falcon-angular-dialog>` internally** — would inherit focus trap, body unmount, ARIA, etc.
6. **Variant extensibility** — accept a `customVariant` object or move to plugin-style variants.

## Priority: page-level vs shared
ALL belong in the shared component. Page-level workarounds break the design system.

## Recommended upgrade API (proposed)

```ts
@Component({ selector: 'falcon-angular-popup', ... })
export class FalconAngularPopupComponent implements OnInit {
  readonly open = input<boolean>(false);
  readonly variant = input<FalconPopupVariant>('error');
  readonly name = input<string>('');

  // NEW
  readonly loading = input<boolean>(false);
  readonly confirmDisabled = input<boolean>(false);
  readonly tertiaryButton = input<{ label: string; tone: 'ghost' | 'primary'; on: () => void } | null>(null);
  readonly dismissible = input<boolean>(true);

  // Visual props (already exist)
  readonly iconBg = input<boolean>(true);
  readonly iconColor = input<boolean>(true);
  readonly glossy = input<boolean>(true);

  // Overrides (already exist)
  readonly titleOverride = input<string | null>(null);
  readonly bodyOverride = input<string | null>(null);
  readonly hintOverride = input<string | null>(null);
  readonly confirmLabelOverride = input<string | null>(null);
  readonly cancelLabelOverride = input<string | null>(null);
  
  // NEW outputs
  readonly tertiary = output<void>();
}
```

## Future-proof recommendation
**Compose `<falcon-angular-dialog>` instead of re-implementing.** Today popup duplicates: backdrop, ARIA, scale-in animation, Esc handling. Composing dialog:
- Inherits focus trap (P0 fix).
- Inherits focus restore (P0 fix).
- Inherits aria-describedby / aria-labelledby idioms.
- Consolidates motion / blur tokens.

The variant-specific content (icon + title + body + buttons) layers on top via dialog's slots. Net result: popup becomes a thin layer of variant config + content composition, not an entire modal re-implementation.

This is the SINGLE highest-leverage change for this component.
