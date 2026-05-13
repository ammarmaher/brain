# falcon-icon — GAPS AND UPGRADES

## Missing capabilities

### P0 — Widespread adoption gap
Most consumers still use raw `<i class="falcon-icon falcon-icon-X">`. The `<falcon-angular-icon>` wrapper exists but is under-leveraged. The bare-class pattern bypasses size + a11y standardisation.

**Risk:**
- Inconsistent sizes across the platform (each consumer picks pixel sizes).
- Missing `aria-hidden` / `role="img"` posture.
- Harder to audit / lint.

**Fix:** Codemod / ESLint rule + gradual migration. Already a candidate for the next pass.

**Priority: P0** — design system enforcement.

### P1 — No `spin` / `pulse` animation
For loading indicators inline, no built-in spin animation. Consumers add `class="animate-spin"` (Tailwind) on the host.

**Proposed:**
```ts
@Input() spin = false;       // applies infinite rotation
@Input() pulse = false;      // applies opacity pulse
```

**Priority: P1**

### P1 — No `<iconify-icon>` fallback / unified interface
The platform has TWO icon sources: Falcon icon font (preferred) and Iconify (`iconify-icon` package — verified imported in `package.json` + a few showcase components). A unified `<falcon-angular-icon>` API could route by name prefix:
- `name="pencil"` → Falcon icon.
- `name="solar:pencil-bold"` → Iconify (auto-detected by colon).

**Priority: P1** — unifies the icon strategy.

### P2 — No color shorthand prop
Color is via `--falcon-icon-color` token. A shorthand `[color]="'falcon-teal-500'"` or similar would be ergonomic.

**Proposed:** `@Input() color?: string` — sets `--falcon-icon-color: var(--color-<value>)`.

**Priority: P2**

### P2 — No `flip` / `rotate` props
For arrow icons that should flip per direction or context.

**Proposed:** `[flip]="'horizontal' | 'vertical' | 'both'"`, `[rotate]="90 | 180 | 270"`.

**Priority: P2**

### P3 — No badge / count overlay
For icon-with-badge ("notifications icon + count"), consumers wrap manually.

**Priority: P3**

## Missing flags / options / states
- `spin`, `pulse`, `flip`, `rotate`.
- `color` shorthand.
- Badge overlay.

## Missing accessibility features
- The wrapper has no `title` attribute on the `<i>` for browser-native tooltip (not the same as `<falcon-angular-tooltip>` — useful for mouse hover even without focus). Could add `[title]="label"` when `decorative=false`.

## Missing tests
- No `.spec.ts`.
- No registry of valid icon names (would help typescript narrowing).

## Missing Tailwind / token parity
- The Stencil Light source emits `<i class="falcon-icon falcon-icon-<name>">` directly. Shadow source same. No divergence.

## Performance risks
- Per-icon render is ~constant — just an `<i>` element with a class.
- Many icons on a page = many tiny components. For >200 icons (table rows × icons), consider direct `<i>` for hot paths.

## Visual / interaction risks
- `currentColor` inheritance is fine for most cases but breaks when the parent has gradient text — gradient doesn't apply to text glyphs. Acceptable.

## Reusable upgrades needed
1. **`spin` / `pulse` animation props** (P1).
2. **`iconify-icon` fallback via name prefix** (P1).
3. **`color` shorthand** (P2).
4. **`flip` / `rotate` props** (P2).
5. **TypeScript icon-name union** (lint-time validation).

## Priority: page-level vs shared
All shared. Plus enforcement (ESLint rule) to migrate raw `<i class="falcon-icon ...">` to the wrapper.

## Recommended upgrade API (proposed)

```ts
@Component({ selector: 'falcon-angular-icon', ... })
export class FalconAngularIconComponent {
  @Input() name!: string;                       // 'pencil' OR 'iconify:solar:pencil-bold'
  @Input() size: FalconIconSize = 'md';
  @Input() decorative = true;
  @Input() label?: string;
  @Input() color?: string;                       // new — e.g. 'falcon-teal-500'
  @Input() spin = false;                         // new
  @Input() pulse = false;                        // new
  @Input() flip?: 'horizontal' | 'vertical' | 'both';  // new
  @Input() rotate?: 90 | 180 | 270;              // new
  @Input() useTailwind = true;
}

// TypeScript icon-name union (auto-generated from font)
export type FalconIconName =
  | 'pencil' | 'trash' | 'cog' | 'check' | 'times' | 'user'
  | 'chevron-down' | 'chevron-up' | 'chevron-left' | 'chevron-right'
  | 'arrow-right' | 'arrow-left' | 'plus' | 'minus' | 'search'
  // ... all 122
```

## Future-proof recommendation
The `iconify-icon` fallback is the single most valuable upgrade — it unifies icon usage across the platform. Today the inconsistency between Falcon font (122 icons) and Iconify (millions of icons) leads to teams reaching for whichever is convenient. A single `<falcon-angular-icon>` that handles both would consolidate the pattern.
