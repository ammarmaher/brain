# falcon-input-number — GAPS AND UPGRADES

## Missing capabilities

### G1 — Clamp only fires on blur (P2)

If the user types `99999` and submits without blurring (e.g. Enter), the form will receive the unclamped value. Consider clamping on Enter too.

**Recommended fix:** add Enter-key clamp handler.

### G2 — No `prefix` / `suffix` text inputs (P1)

For "kg" / "%" / custom symbols not handled by Intl currency, no input. The registry mentioned `prefix?` / `suffix?` on Stencil — verify and surface on wrapper.

**Recommended fix:** add `@Input() prefix?: string` + `@Input() suffix?: string` plus token-driven layout.

### G3 — No method proxies (P2)

No `setFocus()` / `stepUp()` / `stepDown()` exposed publicly.

### G4 — Sign-style negative-number display not configurable (P3)

Some locales prefer `()` for negatives. Intl handles this via `signDisplay` and currency display options — not exposed.

### G5 — `state` input exists on wrapper but is DROPPED in Shadow mode (P2 — re-scoped 2026-06-03)

`[CODE]` **CORRECTION + DEEPER FINDING:** the wrapper DOES declare `@Input() state` (ts:80) and the Tailwind `-tw` twin forwards it to its inner `<falcon-input-tw>` (tw.tsx:46/306). BUT the **Shadow** `<falcon-input-number>` has **no `state` prop at all** (falcon-input-number.tsx — never declared, never passed to its inner `<falcon-input>`). So `useTailwind=false` + `[state]="'error'"` paints NO error ring. Since `useTailwind=true` is the default this rarely bites, but it is a true Shadow↔tw parity break.

**Recommended fix:** add `@Prop({reflect:true}) state` to `<falcon-input-number>` and forward it to the inner `<falcon-input>` (mirror the `-tw` twin).

### G5b — Shadow path lacks the DOM numeric keystroke/paste/beforeinput filter (P1 — NEW 2026-06-03)

`[CODE]` The `-tw` twin attaches host-level `keydown` / `paste` / `beforeinput` listeners (tw.tsx:147-283, Wave 7.10) that block non-numeric input at the keyboard level (resolves the "letters accepted by integer-only input" bug class). The **Shadow** `<falcon-input-number>` has **NO such filter** — it relies solely on blur-time `parse()`, so in Shadow mode a user can type `abc12` and see it until blur. Real behavior divergence.

**Recommended fix:** lift the numeric-filter handlers into a shared util both Stencil components attach in `componentDidLoad`.

### G5c — `inputExtraClass` + spinner tokens are `-tw`-only (P3 — NEW 2026-06-03)

`[CODE]` Shadow path binds `root-class` but not `input-extra-class` (html:74 vs 39); and the `-tw` spinner buttons hardcode palette utilities instead of `--falcon-input-number-spinner-*` (tw.tsx:331/347), so spinner token overrides only affect the Shadow path. The standalone `falconInputNumberSpinnerClasses()` helper is declared but unused (DRY). `safe-local`.

### G5d — wrapper `state` input (legacy note)

Pattern parity with input/dropdown/textarea is now present on the wrapper surface (see G5). Superseded.

### G6 — No keyboard step (Up/Down arrows) (P2 — CONFIRMED 2026-06-03)

`[CODE]` CONFIRMED no arrow-key step. The `-tw` numeric filter's `isControlKey()` lets `ArrowUp`/`ArrowDown` through (tw.tsx:212-214) but there is **no handler that calls `stepUp`/`stepDown` on arrow keys** — and the inner field is `type="text"`, not native `type="number"`, so the browser provides no stepping either. When `showButtons=false` there is no keyboard step at all.

### G7 — Long-press spinner not implemented (P3)

For very long ranges, single-click step is tedious. Long-press auto-step (with acceleration) is a common ask.

### G8 — Currency code list not validated (P3)

`currency='XYZ'` would silently fail Intl. Could provide a typed union of known codes.

## Missing accessibility

- Verify `inputmode="decimal" | "numeric"` is set.
- Verify spinner buttons have correct `aria-label` and `aria-controls`.
- Verify value changes announced via `aria-live`.

## Missing tests

- No Angular wrapper spec.

## Missing Tailwind / token parity

- Spinner button placement on both render paths needs verification.

## Performance risks

- `Intl.NumberFormat` instantiation per format/parse call — consumers running heavy lists should memoize.

## Visual / interaction risks

- Switching focused/blurred display can cause cursor position jumps.
- Spinner buttons in `showButtons=true` mode add ~64px of horizontal real-estate — narrow columns may compress.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G2 | `prefix` / `suffix` text | P1 |
| G5 | `state` input | P2 |
| G6 | Keyboard step (Arrow keys) | P2 |
| G1 | Clamp on Enter | P2 |
| G3 | Method proxies | P2 |
| G7 | Long-press auto-step | P3 |
| G4 | `signDisplay` option | P3 |

## Concrete upgrade API

```ts
@Input() prefix?: string;
@Input() suffix?: string;
@Input() state: 'default' | 'error' | 'success' | 'warning' = 'default';
@Input() signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
@Input() longPressStep = false;
async setFocus(): Promise<void>;
async stepUp(): Promise<void>;
async stepDown(): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G2: pass `mode='currency'` if needing a symbol; otherwise render prefix/suffix externally outside the component.
- For G6: use `showButtons=true`.
- For G1: trigger `blur()` programmatically on form submit.

## Wave 7 Findings (2026-05-17)

**Consumer count: 2** ([CODE] grep `<falcon-angular-input-number>` across `apps/` + `libs/falcon/`). See `USAGE.md` for the file list.

No new structural gaps detected by Wave 7 sweep beyond items already listed above.

## Deep-Dive Sweep Findings (2026-06-03 — B01)

**Consumer count: ≈16 app files** (0 in `libs/falcon`) ([CODE] grep `<falcon-angular-input-number[\s>]`). Component stays ACTIVE/PREFERRED — no deletion/promotion flag. The 2026-05-17 tag-switcher refactor is solid; gaps are Shadow-path parity + missing tests.

NEW / re-scoped gaps this pass (all evidence-backed):
- **G5 re-scoped** — `state` exists on wrapper but Shadow `<falcon-input-number>` has no `state` prop → error ring lost in Shadow mode. (P2, `HIGH-RISK-QUEUE`? No — behavior/render-path change but additive; classified `safe-local` for the doc, fix itself is a Stencil prop add — flag to humans as a render-path-behavior change.)
- **G5b (NEW, P1)** — Shadow path lacks the numeric keystroke/paste/beforeinput filter the `-tw` twin has → letters typeable in Shadow mode. **`HIGH-RISK-QUEUE`** (behavior change touching input filtering).
- **G5c (NEW, P3)** — `inputExtraClass` + spinner tokens are `-tw`-only; `falconInputNumberSpinnerClasses()` unused (DRY). `safe-local`.
- **G6 confirmed** — no arrow-key step; field is `type="text"`.
- **Stale barrel comment** — `index.ts` still says "composed wrapper around `<falcon-angular-input>` + spinner buttons" (false since the tag-switcher refactor). `safe-local`.
- **No `.spec`/`.e2e`.**
- See FINDINGS/B01.md for the row-level list + risk-class.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B01) against wrapper (160 ln) + both Stencil `.tsx` (216/359 ln) + types + token file. Tag-switcher refactor confirmed; NEW Shadow-parity gaps G5b (numeric filter — 🔴 P1/HIGH-RISK-QUEUE) + G5 (`state` drop) + G5c (spinner hardcode/unused helper) all evidence-backed. No deletion/promotion flags — component stays ACTIVE/PREFERRED.
