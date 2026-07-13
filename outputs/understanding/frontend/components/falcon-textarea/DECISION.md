# falcon-textarea — DECISION

## Brain SK final recommendation

**STATUS: READY. Use for all multi-line free-text fields.**

## Use this component for

- Descriptions, notes, comments, addresses, freeform text.
- Length-bounded fields with counter.
- In-grid edit cells (variant='grid').

## Avoid this component for

- Rich text / formatted text → external editor.
- Code editing → Monaco/CodeMirror.
- Single-line → input.

## Preferred render path

`useTailwind=true`.

## Required upgrades

None blocking.

## Relationship

- Sibling: `<falcon-angular-input>` (same DNA, single-line).

## Exact rule

1. Multi-line text? → `<falcon-angular-textarea>`.
2. Use `autoResize` for variable length.
3. Use `maxlength` + `showCounter`.
4. Bind via CVA.

---

## Dynamic capability assessment

### 1. Static?
- Native textarea structure.
- No prefix/suffix slot.

### 2. Dynamic via inputs/outputs?
- `[CODE]` **25 inputs** (2026-06-03 recount) — incl. `iconLeft`/`iconRight`/`inputMode` (added 2026-05-17). NO `disabled` input (CVA-only). NO `clearable`.
- **0 wrapper outputs** (GAP G1 — diverges from input's `(blur)` Output).
- CVA (`writeValue` has no `componentOnReady` push, unlike input/input-number).

### 3. Slots/templates?
- `[CODE]` `slot="icon-left"` / `slot="icon-right"` (top-anchored, both paths). No `prefix`/`suffix`, no `ng-template`.

### 4. Tokens?
- All visual axes.

### 5. Tailwind?
- 3 passthrough classes.

### 6. Missing for reuse?
- Wrapper event re-emission (G1).
- Method proxies (G3).
- `resize` mode (G5).

### 7. Shared?
- Yes.

### 8. Flags?
- Event re-emit, method proxies, `resize`, paste hook.

### 9. Safest path?
1. Re-emit events on wrapper.
2. Add method proxies.
3. Add `resizeMode`.

### 10. Risky?
- `autoResize` measuring strategy (`scrollHeight` on every input) — performance regression risk on very long content.
- Variant set excludes `'search'` — adding any 4th would expand surface.
- Adding a `(blur)` Output (G1) is safe/additive, but any existing consumer relying on the absence (unlikely) would be unaffected.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B01); RE-VERIFIED 2026-06-03 (W1-a). Recommendation unchanged (READY). Counts re-confirmed against live source: 25 inputs, 0 wrapper outputs (G1 — diverges from input's `(blur)`), icon slots present. W1-a verdict: PASS.
