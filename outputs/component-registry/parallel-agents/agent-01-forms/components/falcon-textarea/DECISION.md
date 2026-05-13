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
- 22 inputs.
- 0 wrapper outputs (gap).
- CVA.

### 3. Slots/templates?
- None.

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
- `autoResize` measuring strategy — performance regressions risk.
- Variant set excludes `'search'` — adding any 4th would expand surface.
