# falcon-textarea — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-textarea>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A labeled, bordered **multi-line** field — visibly taller than a single-line input (default 4 rows). Optional pieces, all derived from source:
- A **label** above with an optional red required `*` `[CODE]` `falcon-textarea-tw.tsx:217-231`.
- A **bottom-right character counter** (`123 / 500`) that recolors as it nears the cap `[CODE]` `falcon-textarea-tw.tsx:282-290`.
- A native resize grip in the bottom-right corner (browser-default `resize`).
- Optional **leading / trailing icon** anchored to the top of the field `[CODE]` `falcon-textarea-tw.tsx:235-280` (`iconLeft` / `iconRight`).
- A **helper line** below, or an **error line** (`role="alert"`) that replaces it.
- Same border / focus-ring / size contract as `<falcon-angular-input>` — it reads as the input's taller twin.
If the field grows as you type (bounded), `autoResize` is on.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<TextField multiline>` (or `<TextareaAutosize>`) | MUI `multiline` + `minRows`/`maxRows` ≈ `autoResize` + `minRows`/`maxRows` |
| PrimeNG | `<textarea pInputTextarea autoResize>` / `<p-inputTextarea>` | direct 1:1 — this component replaced `<p-inputTextarea>` |
| Ant Design | `<Input.TextArea>` (`autoSize`, `showCount`, `maxLength`) | `showCount` ≈ `showCounter`; `autoSize` ≈ `autoResize` |
| Bootstrap | `<textarea class="form-control">` | upgrade target — no counter/autoresize |
| shadcn / Radix | `<Textarea>` | shadcn Textarea is plain; counter/autoresize are app add-ons there |
| plain HTML | `<textarea>` | always replace with this |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a tall multi-line free-text box | `<falcon-angular-textarea>` | input |
| a single-line text field | `<falcon-angular-input>` | textarea |
| a multi-line cell edited inside a grid row | `<falcon-angular-textarea variant="grid">` | grid-input (that is single-line) |
| a formatting toolbar / bold / lists | external rich-text editor | textarea (no rich text) |
| a code editor with syntax color | Monaco / CodeMirror | textarea |
| a numeric field with steppers/format | `<falcon-angular-input-number>` | textarea |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory` — inputs → templates → slots → variants → token override → upgrade → wrapper):
1. **Inputs** — `[label]`, `[placeholder]`, `[(ngModel)]`/CVA, `[rows]`, `[helperText]`, `[errorMessage]`, `[required]`, `[readonly]`, `size`.
2. **Growth** — `[autoResize]="true"` + `[minRows]` / `[maxRows]` for a field that fits its content (bounded). `autoResize` overrides `rows`.
3. **Length budget** — `[maxlength]` + `[showCounter]="true"` together (counter is inert without `maxlength`).
4. **Slots** — `slot="icon-left"` / `slot="icon-right"` projected children for an in-field glyph; toggle with `[iconLeft]` / `[iconRight]`.
5. **Variants** — `variant="form"` (default) or `variant="grid"` for in-grid editing; `appearance="default|filled|ghost"`.
6. **Tokens** — restyle via `textarea.tokens.css` `--falcon-textarea-*` vars; never hardcode CSS.
7. **Upgrade** — a real `resize` mode, wrapper event re-emission, or method proxies are GAPs (`GAPS_AND_UPGRADES.md` / `INTEGRATION_VALIDATION.md`) — raise, do not hand-roll.

## Anti-patterns
- Native `<textarea>` or PrimeNG `<p-inputTextarea>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).
- Setting `showCounter` without `maxlength` — counter silently never renders.
- Expecting `[disabled]` as a template input — it does not exist; disable via the Angular form control.
- Binding `(falcon-change)` / `(falcon-input)` on the wrapper for value — there are no wrapper outputs; use CVA / `valueChanges`.
- Using it for a search box, single-line field, or rich text — wrong component (see table above).

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-textarea-tw.tsx` + `falcon-textarea.component.ts` + `falcon-textarea.component.html`. Cross-library map 🔴 INFERRED from each library's public API. Anti-patterns ✅ VERIFIED against source (no `disabled` input, no wrapper outputs, counter gate).
