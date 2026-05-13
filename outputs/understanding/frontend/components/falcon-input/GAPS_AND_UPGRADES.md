# falcon-input — GAPS AND UPGRADES

## Missing capabilities (active source verified)

### G1 — Tailwind path lacks prefix/suffix slots (P1)

`<falcon-input-tw>` does not declare `slot="prefix"` / `slot="suffix"` rendering. The Angular wrapper template `<ng-content select="[slot=prefix]">` only flows through the Shadow path branch (`useTailwind=false`).

**Impact:** All consumers needing a leading icon (e.g. search glyph) or trailing affordance must currently use Shadow mode, losing Tailwind override + Studio token-runtime parity benefits.

**Recommended fix (P1):** add `<slot name="prefix">` and `<slot name="suffix">` placeholders inside `<falcon-input-tw>` between input and clear-button. Then the Angular wrapper's `<ng-content>` projections must move outside the `@if` branch.

### G2 — Angular wrapper does not expose Stencil methods (P1)

`<falcon-input>` defines `@Method() setFocus()` and `@Method() clear()`, but the wrapper does not expose Angular-side proxies. Consumers must reach into `ViewChild.nativeElement` (which is the wrapper, not the Stencil tag inside it).

**Recommended fix:** add to wrapper:

```ts
@ViewChild('stencilEl', { static: false, read: ElementRef }) stencilEl?: ElementRef<HTMLElement>;
async setFocus(): Promise<void> { await (this.stencilEl?.nativeElement as any)?.setFocus?.(); }
async clear(): Promise<void> { await (this.stencilEl?.nativeElement as any)?.clear?.(); }
```

…and tag the inner element in the template with `#stencilEl`.

### G3 — `clearAriaLabel` and `autoFocusOnMount` + `spellcheckMode` not surfaced (P2)

Stencil exposes `clearAriaLabel: string`, `autoFocusOnMount: boolean`, `spellcheckMode: boolean`. Angular wrapper does not. Adding three `@Input`s on the wrapper + forwarding via `[attr.*]` is mechanical.

### G4 — `falcon-focus` event not bound by Angular wrapper (P2)

Wrapper listens to `falcon-input`, `falcon-change`, `falcon-clear`, `falcon-blur` but NOT `falcon-focus`. Consumers needing a focus signal must attach a native `(focus)` listener — works but inconsistent with the framework-event pattern.

**Recommended fix:** add `@Output() falconFocus = new EventEmitter<string>();` + bind `(falcon-focus)="falconFocus.emit($event.detail.value)"`.

### G5 — `borderless` / `shadowless` / `flat` / `noFocusRing` are Shadow-only (P2)

These four feature toggles are reflected attrs targeted by `:host([borderless])` CSS rules inside `falcon-input.css`. The Tailwind helper `falconInputWrapperClasses()` does NOT branch on any of them. So toggling them in Tailwind mode silently no-ops.

**Recommended fix (P2):** thread the four feature toggles into `falconInputWrapperClasses()` and append/strip Tailwind utilities accordingly (e.g. `border-0`, `shadow-none`, `rounded-none`, `focus:ring-0`).

### G6 — No multi-line / auto-resize (out of scope but cross-link)

For multi-line text, redirect to `<falcon-angular-textarea>`. Document the redirect in OVERVIEW.

### G7 — No built-in input mask / formatter (P2)

Consumers with masked input (phone-without-country, credit card, dates as text, CPR/national-id, etc.) cannot mask through `<falcon-angular-input>`. Currently each consumer writes its own mask handler in `(ngModelChange)`.

**Recommended fix (P2):** add an optional `@Input() mask?: string` + an internal mask service hook, OR provide a separate `FalconInputMaskDirective` consumers can attach.

### G8 — No leading/trailing icon by prop (P1)

To add an icon, consumers must use the Shadow path + slot OR add a sibling element. Adding `@Input() prefixIcon?: string` / `@Input() suffixIcon?: string` (icon names from the vendored Falcon icon font) would simplify common cases.

### G9 — Validation hooks deferred (P3)

Per the registry's "validation deferred" pattern, `<falcon-angular-input>` does NOT validate type='email' / type='url' / `minlength` / `maxlength` beyond what native HTML5 enforces. The Falcon Forms validation story lives in Reactive Forms validators externally — fine, but worth documenting.

## Missing accessibility features

- **A1 (P2):** no announcement when the value is cleared. Adding an `aria-live="polite"` region near the field could help screen readers.
- **A2 (P3):** `clear-button` is `tabindex={-1}` which hides it from keyboard. Some users may want to clear via keyboard. Consider `tabindex={0}` + an opt-in `clearKeyboardAccessible` flag.
- **A3 (P3):** required asterisk is `aria-hidden="true"` — relies on `aria-required` only. Acceptable but worth a doc note.

## Missing tests

- `.spec.ts` exists for the Stencil tag (`libs/falcon-ui-core/src/components/falcon-input/falcon-input.spec.ts`) and an `.e2e.ts`. No corresponding Angular-wrapper component test was located via grep within this scope. **GAP — add `falcon-input.component.spec.ts` covering CVA writeValue / disabled / ngModel / error binding / clear-X.**

## Missing Tailwind / token parity

- Shadow path exposes 4 feature toggles that have NO Tailwind equivalent (see G5). Parity break.
- Both paths share `--falcon-input-*` tokens via `:where(falcon-input, falcon-input-tw, falcon-angular-input, .falcon-input, [data-falcon-input])`. Studio runtime mutation hits both identically. **Parity OK at the token level.**

## Performance risks

- Wrapper uses `signal()` for value + `OnPush` — efficient. Method-based class strings (`defaultWrapperClasses()`) re-evaluate every CD cycle but the cost is tiny string concatenation. **No real risk.**
- The auto-ID seq `__idSeq` is a module-level `let` — fine for SPA, but if MF remotes ship with independent bundles, they may each have their own counter. Collisions are still extremely unlikely because the prefix differs per render path. **GAP — note in OVERVIEW.**

## Visual / interaction risks

- Two render paths can drift if a Shadow-only feature ships without a Tailwind equivalent. **Process risk — guard via Studio parity tests.**
- The `clearable=true` + `ngModel=null` initial state could briefly flash the clear-X before CVA's `writeValue('')` lands. Not observed in active runs but flag in docs.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Tailwind prefix/suffix slots | P1 |
| G2 | Expose `setFocus()` / `clear()` on Angular wrapper | P1 |
| G3 | Surface `clearAriaLabel` + `autoFocusOnMount` + `spellcheckMode` inputs | P2 |
| G4 | Bind `falcon-focus` event on Angular wrapper | P2 |
| G5 | Honour `borderless` / `shadowless` / `flat` / `noFocusRing` in Tailwind path | P2 |
| G7 | Optional input mask | P2 |
| G8 | `prefixIcon` / `suffixIcon` inputs | P1 |
| A1 | `aria-live` on clear | P2 |

## Recommended upgrade API (concrete)

```ts
// Angular wrapper additions
@Input() prefixIcon?: string;            // Falcon icon name
@Input() suffixIcon?: string;            // Falcon icon name
@Input() clearAriaLabel = 'Clear input'; // proxy to Stencil
@Input() autoFocusOnMount = false;       // proxy
@Input() spellcheckMode = true;          // proxy
@Output() falconFocus = new EventEmitter<string>();

async setFocus(): Promise<void>;
async clear(): Promise<void>;
```

```tsx
// Stencil <falcon-input-tw> additions
<slot name="prefix" />
<slot name="suffix" />
```

## Fix-shared-vs-per-page

All gaps above belong in the **shared Falcon component**, not per-page. The wrapper is the single chokepoint that proves the dual-render pattern; per-page hacks would break the cross-framework SSOT promise.

## Workarounds (if upgrade blocked)

- For G1/G8 today: use Shadow path (`useTailwind=false`) + slot `<i slot="prefix">` icons.
- For G2 today: `(blur)`-trigger refocus via native `(focus)` listener and `event.currentTarget.querySelector('input')?.focus()`.
- For G3 today: drop down to raw `<falcon-input>` + CVA via `formControlName` is harder; use a thin local wrapper.
- For G5 today: Shadow path only.
