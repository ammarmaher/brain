# falcon-textarea — OVERVIEW

## Component purpose

Multi-line text input with optional auto-resize, character counter, and the same form-control contract (label / helper / error / size / state / variant / appearance) as `<falcon-angular-input>`.

## Business / UI use case

- Descriptions / notes / addresses (multi-line free-text).
- Comments / feedback fields.
- Wizards: "Additional info" textarea.

## When to use it / when NOT to use it

**Use it for:** any free-text field that requires more than one line.

**Do NOT use it for:**
- Single-line → `<falcon-angular-input>`.
- Rich text (formatting toolbar, bold/italic, lists) → NOT supported. Use a separate rich-text editor.
- Code editing → use Monaco / CodeMirror externally.

## Status

**ACTIVE / PREFERRED.** Replaces PrimeNG `<p-inputTextarea>` and native `<textarea>`.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-textarea/falcon-textarea.component.ts` |
| HTML | `.../falcon-textarea.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-textarea/falcon-textarea.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-textarea-tw/falcon-textarea-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/textarea.tokens.css` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-textarea` |
| Stencil Shadow | `<falcon-textarea>` |
| Stencil Light | `<falcon-textarea-tw>` |

## Known consumers

- Add Client / Add User wizards (admin + management).
- Comment / notes fields in detail panels.

## Related components

- Sibling family: `<falcon-angular-input>` (same DNA but single-line).
- Distinct from input — no `prefix` / `suffix` slot semantics typical.

## Ownership

`libs/falcon-ui-core`.
