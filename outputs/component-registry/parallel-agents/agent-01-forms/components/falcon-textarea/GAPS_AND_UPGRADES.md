# falcon-textarea — GAPS AND UPGRADES

## Missing capabilities

### G1 — Angular wrapper does not re-emit events (P2)

Stencil tag emits `falcon-input` / `falcon-change` / `falcon-blur`. Wrapper does NOT expose them as Angular `@Output`s. Consumers wanting an explicit `(falconInput)` listener cannot wire it through the wrapper.

**Recommended fix:** add `@Output() falconInput / falconChange / falconBlur = new EventEmitter<...>();` and bind in the template.

### G2 — No prefix/suffix slot or icon (P3)

For "@" mention triggers or icon-leading textareas, no slot. Acceptable — most textareas don't need this.

### G3 — No method proxies (P2)

No `setFocus()` / `selectAll()` / `clear()` on Angular wrapper.

### G4 — `autoResize` interaction with `rows` undocumented behaviour (P3)

When both are set, `autoResize` wins. Document.

### G5 — No `noResize` / `resize: 'none' | 'vertical' | 'horizontal' | 'both'` flag (P3)

Native textarea has `resize` style. Token can override but no input.

### G6 — Counter visual when `maxlength` not set is silent (P3)

If `showCounter=true` without `maxlength`, what shows? Verify.

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
