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
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-textarea/falcon-textarea.component.ts` (123 ln) |
| Angular wrapper HTML | `.../falcon-textarea/falcon-textarea.component.html` (75 ln — pure tag-switcher) |
| Angular wrapper CSS | `.../falcon-textarea/falcon-textarea.component.css` (`:host` width only — no rules) |
| Angular barrel | `.../falcon-textarea/index.ts` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-textarea/falcon-textarea.tsx` (324 ln, `shadow:true`) |
| Stencil Shadow CSS | `.../falcon-textarea/falcon-textarea.css` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-textarea-tw/falcon-textarea-tw.tsx` (315 ln, `shadow:false`) |
| Types | `.../falcon-textarea/falcon-textarea.types.ts` |
| Utils | `.../falcon-textarea/falcon-textarea.utils.ts` (`buildWrapperClasses`, `classifyCounter`, `isFieldInError`) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/textarea-tailwind-classes.ts` (re-exported via `tailwind-classes.ts` barrel) |
| Tokens | `libs/falcon-ui-tokens/src/components/textarea.tokens.css` (~202 ln) |

> `[CODE]` No `.spec.ts` / `.e2e.ts` exists for textarea (Stencil or Angular) — testing gap (`GAPS_AND_UPGRADES.md`).

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-textarea` |
| Stencil Shadow | `<falcon-textarea>` |
| Stencil Light | `<falcon-textarea-tw>` |

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-angular-textarea[\s>]` across `apps/` ≈ **12 files**; **0 in `libs/falcon/`**. Heaviest: templates-page wizard (body field with `autoResize`), contracts add-ons, wallet-balance transfer drawers. Representative:

- `apps/{admin,management}-console/.../templates-page/components/templates-wizard/steps/step2-message-structure.component.html` (multi-line message body, `[autoResize]` + `[maxlength]`)
- `apps/{admin,management}-console/.../templates-page/components/templates-details/templates-details.component.html`
- `apps/management-console/.../contracts-cost-management/components/contracts-addons-section/contracts-addons-section.component.html`
- `apps/{admin,management}-console/.../new-wallet-balance/components/wb-balance-transfer-drawer/wb-balance-transfer-drawer.component.html`

> (NOTE: the prior dossier's sole consumer `host-shell playground.page.html` is gone — playground route removed.)

## Related components

- Sibling family: `<falcon-angular-input>` (same DNA, single-line). Textarea inherits the input's `--falcon-input-icon-*` tokens for its icon slots.
- Distinct from input — `prefix`/`suffix` slots are absent; only `icon-left`/`icon-right` slots exist (top-anchored).

## Ownership

`libs/falcon-ui-core`. Token contract in `libs/falcon-ui-tokens`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B01). Source paths + line counts re-confirmed; consumers refreshed (≈12 app files, playground gone). No `.spec`/`.e2e` exists.
