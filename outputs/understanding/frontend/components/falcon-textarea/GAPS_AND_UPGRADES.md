# falcon-textarea — GAPS AND UPGRADES

## Missing capabilities

### G1 — Angular wrapper does not re-emit events (P2)

Stencil tag emits `falcon-input` / `falcon-change` / `falcon-blur`. Wrapper does NOT expose them as Angular `@Output`s. Consumers wanting an explicit `(falconInput)` listener cannot wire it through the wrapper.

**Recommended fix:** add `@Output() falconInput / falconChange / falconBlur = new EventEmitter<...>();` and bind in the template.

### G2 — No `prefix`/`suffix` slot (icon-left/right DO exist) (P3 — corrected 2026-06-03)

`[CODE]` **CORRECTION:** `slot="icon-left"` / `slot="icon-right"` (top-anchored) DO exist on both render paths (falcon-textarea-tw.tsx:239-284, toggled by `iconLeft`/`iconRight`). What is absent is the `prefix`/`suffix` pair — rarely needed for a multi-line field. No action recommended.

### G3 — No method proxies (P2)

No `setFocus()` / `selectAll()` / `clear()` on Angular wrapper.

### G4 — `autoResize` interaction with `rows` undocumented behaviour (P3)

When both are set, `autoResize` wins. Document.

### G5 — No `noResize` / `resize: 'none' | 'vertical' | 'horizontal' | 'both'` flag (P3)

Native textarea has `resize` style. Token can override but no input.

### G6 — Counter silent without `maxlength` (RESOLVED-by-design 2026-06-03)

`[CODE]` **ANSWERED:** `shouldShowCounter = showCounter && typeof maxlength === 'number' && maxlength > 0` (falcon-textarea.tsx:198-200 / -tw.tsx:184-186). With no `maxlength`, the counter never renders — deliberate (no budget to show). Not a defect; documented in BUSINESS.md. No fix needed.

### G7 — No paste sanitization hook (P3)

For consumers wanting to strip line breaks on paste, no hook.

## Missing accessibility

- Verify counter `aria-live`.
- Verify keyboard nav at minRows/maxRows boundaries.

## Missing tests

- No Angular wrapper spec located.

## Missing Tailwind / token parity

- Likely fine. Verify autoResize CSS path equivalence.

## Performance risks

- autoResize re-measures on every input → debounced internally (verify).

## Visual / interaction risks

- minRows/maxRows boundaries can cause sudden jumps — token-tunable.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | Re-emit events on wrapper | P2 |
| G3 | Method proxies | P2 |
| G5 | `resize` mode input | P3 |
| G7 | Paste sanitizer hook | P3 |

## Concrete upgrade API

```ts
@Output() falconInput = new EventEmitter<string>();
@Output() falconChange = new EventEmitter<string>();
@Output() falconBlur = new EventEmitter<string>();
@Input() resizeMode: 'none' | 'vertical' | 'horizontal' | 'both' = 'vertical';
async setFocus(): Promise<void>;
async selectAll(): Promise<void>;
async clear(): Promise<void>;
```

## Shared vs per-page

All shared.

## Workarounds today

- For G1: query nativeElement and add a DOM listener.
- For G3: query nativeElement.querySelector('textarea').

## Wave 7 Findings (2026-05-17)

**Consumer count: 1** ([CODE] grep `<falcon-angular-textarea>` across `apps/` + `libs/falcon/`). See `USAGE.md` for the file list.

No new structural gaps detected by Wave 7 sweep beyond items already listed above.

## Deep-Dive Sweep Findings (2026-06-03 — B01)

**Consumer count: ≈12 app files** (0 in `libs/falcon`) ([CODE] grep `<falcon-angular-textarea[\s>]`). Component stays ACTIVE/PREFERRED — no deletion/promotion flag.

- **G1 CONFIRMED** (P2) — wrapper still has ZERO `@Output`s, so unlike `<falcon-angular-input>` (which gained a `(blur)` Output 2026-05-21) textarea consumers writing `(blur)="…"` get **nothing**. This is a real cross-component inconsistency: any textarea field whose error is gated on a local `touched` set (mirroring the input pattern) silently never surfaces. Recommend porting input's `(blur)` re-emit. `risk-class: safe-local` (additive).
- **G2 corrected** — icon slots exist (only prefix/suffix missing).
- **G6 resolved-by-design** — counter is gated on `maxlength > 0`.
- **G3 CONFIRMED** — `setFocus` exists on both Stencil tags, not proxied on the wrapper.
- **No `.spec`/`.e2e` at all** (Stencil or Angular) — testing gap larger than input's.
- All findings `safe-local` (doc) — see FINDINGS/B01.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B01) against falcon-textarea.component.ts + both Stencil `.tsx` + types/utils. G1 (no `@Output`s) confirmed as the headline gap (diverges from input); G2 corrected (icon slots exist); G6 resolved-by-design (counter gated). No deletion/promotion flags — component stays ACTIVE/PREFERRED.
