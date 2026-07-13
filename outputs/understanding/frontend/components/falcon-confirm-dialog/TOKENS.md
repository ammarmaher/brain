# falcon-confirm-dialog — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/confirm-dialog.tokens.css` (**29 lines** — recount 2026-06-03). Short because the component primarily inherits `<falcon-dialog>`'s chrome tokens; it declares only its own body / icon / message / actions / button tokens.

`[CODE]` confirm-dialog.tokens.css:7 — token selector (gate-12 compliant, `:where()` keeps specificity 0):

```css
:where(
  falcon-confirm-dialog, falcon-confirm-dialog-tw, falcon-angular-confirm-dialog,
  .falcon-confirm-dialog, [data-falcon-confirm-dialog],
  falcon-dialog, falcon-dialog-tw, falcon-angular-dialog, .falcon-dialog, [data-falcon-dialog]
)
```

> `[CODE]` The selector intentionally includes **both** the confirm-dialog tags **and** the underlying `falcon-dialog` tags. Because the confirm-dialog composes `<falcon-dialog>` (and the `-tw` twin composes `<falcon-dialog-tw>`), the confirm tokens must resolve when the value is read from inside the composed dialog's subtree.

## Token categories (4 groups, 15 vars)

`[CODE]` confirm-dialog.tokens.css:8-28:

1. **BODY** — `--falcon-confirm-dialog-body-gap` (12px), `--falcon-confirm-dialog-body-padding` (8px 0), `--falcon-confirm-dialog-icon-size` (32px).
2. **MESSAGE** — `--falcon-confirm-dialog-message-font-size` (14px), `--falcon-confirm-dialog-message-fg` (`var(--color-falcon-neutral-700, #374151)`).
3. **ACTIONS** — `--falcon-confirm-dialog-actions-gap` (8px), `--falcon-confirm-dialog-actions-padding-top` (4px).
4. **BUTTON** — `--falcon-confirm-dialog-btn-padding` (8px 16px), `-btn-radius` (6px), `-btn-font-size` (13px), `-btn-font-weight` (500); accept: `-accept-bg` (`var(--color-falcon-teal-700, #124c52)`), `-accept-fg` (`var(--color-falcon-neutral-0, #ffffff)`); reject: `-reject-bg` (`var(--color-falcon-neutral-100, #f3f4f6)`), `-reject-fg` (`var(--color-falcon-neutral-700, #374151)`), `-reject-border` (`var(--color-falcon-neutral-200, #d1d5db)`).

## Related Falcon theme tokens

| Confirm-dialog token | References |
|---|---|
| `--falcon-confirm-dialog-accept-bg` | `var(--color-falcon-teal-700, #124c52)` |
| `--falcon-confirm-dialog-accept-fg` | `var(--color-falcon-neutral-0, #ffffff)` |
| `--falcon-confirm-dialog-reject-bg` | `var(--color-falcon-neutral-100, #f3f4f6)` |
| `--falcon-confirm-dialog-reject-fg` | `var(--color-falcon-neutral-700, #374151)` |
| `--falcon-confirm-dialog-reject-border` | `var(--color-falcon-neutral-200, #d1d5db)` |
| `--falcon-confirm-dialog-message-fg` | `var(--color-falcon-neutral-700, #374151)` |

All dialog **chrome** tokens (panel bg, border, radius, shadow, backdrop, header/footer padding, focus-trap) come from `[CODE]` `dialog.tokens.css` via the composed `<falcon-dialog>` — see `[BRAIN-OUT]` `components/falcon-dialog/TOKENS.md`.

## Tailwind utility guidance for this component

- The `-tw` twin (`falcon-confirm-dialog-tw.tsx`) **inlines** its Tailwind utilities directly (`flex flex-col items-center gap-3 …`, `bg-falcon-neutral-100`, `bg-[var(--falcon-teal-700,#124c52)]`) — `[CODE]` tw.tsx:80-103. It does NOT call the `confirm-dialog-tailwind-classes.ts` helpers (those two functions are dead — GAP).
- Consumers should override the `--falcon-confirm-dialog-*` tokens rather than hand-rolling utilities. There is no `wrapperClass`/`inputClass`-style input.

## Dark mode support

`[INFERRED]` Inherits dark-mode from the composed `<falcon-dialog>` chrome + the `--color-falcon-neutral-*` / `--color-falcon-teal-*` theme tokens, which flip under `.app-dark`. The teal accept-bg stays brand-stable; neutral reject-bg/fg/border flip. **No per-confirm-dialog dark override exists** in `confirm-dialog.tokens.css` — purely inherited. Not runtime-verified (component is dormant).

## Density support

Via the inherited `size` prop (`sm`/`md`/`lg`) on the composed dialog. The confirm-dialog's own body/button tokens are fixed px — no per-density scaling of the body/button geometry (GAP — `static style risks`).

## RTL support

`[INFERRED]` Inherited from the `<falcon-dialog>` substrate's RTL layer (`libs/falcon-ui-tokens/src/rtl/`). The actions row uses `justify-content: flex-end` (`[CODE]` css:33) + `padding-block-start` (logical), so it should mirror; the icon/message are centered (`align-items: center`, `text-align: center`) so they are direction-neutral. Not runtime-verified.

## Static style risks

- `[CODE]` **Hardcoded `var(--token, fallback)` px literals** in both the Shadow CSS and the `-tw` twin: `gap` 12px, `padding` 8px 0, icon 32px, message 14px, btn 8px 16px / 6px radius / 13px (`[CODE]` css:14-44; tw.tsx px-4/py-2/text-[13px]). These sit inside `var(--token, fallback)` so the token wins when defined — acceptable, but the twin's literals (`px-4 py-2 rounded-md text-[13px]`) are NOT token-driven (they are raw Tailwind) → the `-tw` path can drift from the Shadow path's token values (GAP G5, parity).
- `[CODE]` **`-tw` accept button** uses `bg-[var(--falcon-teal-700,#124c52)]` (`[CODE]` tw.tsx:98) — references `--falcon-teal-700`, but the token file defines `--falcon-confirm-dialog-accept-bg` (which itself reads `--color-falcon-teal-700`). So overriding `--falcon-confirm-dialog-accept-bg` does **not** retint the `-tw` accept button (it reads a different var). Shadow path DOES honor `--falcon-confirm-dialog-accept-bg` (`[CODE]` css:58). **Token/parity break** (GAP G5).
- Buttons are raw `<button>` (not `<falcon-angular-button>`) → no shared button-token contract (GAP G3).

## No CSS / no SCSS guidance

- Token file is the SSOT for the confirm-dialog's own surface; dialog chrome lives in `dialog.tokens.css`.
- Never hardcode hex/px in a consumer — but note the `-tw` twin's accept button does not respond to `--falcon-confirm-dialog-accept-bg` (see static-style risks).

## Token usage by state

| Concern | Token(s) consumed |
|---|---|
| Body layout | `--falcon-confirm-dialog-body-gap`, `--falcon-confirm-dialog-body-padding` |
| Icon | `--falcon-confirm-dialog-icon-size` |
| Message | `--falcon-confirm-dialog-message-font-size`, `--falcon-confirm-dialog-message-fg` |
| Actions row | `--falcon-confirm-dialog-actions-gap`, `--falcon-confirm-dialog-actions-padding-top` |
| Button base | `--falcon-confirm-dialog-btn-padding`, `-btn-radius`, `-btn-font-size`, `-btn-font-weight` |
| Accept | `--falcon-confirm-dialog-accept-bg`, `--falcon-confirm-dialog-accept-fg` (Shadow path only; `-tw` reads `--falcon-teal-700`) |
| Reject | `--falcon-confirm-dialog-reject-bg`, `--falcon-confirm-dialog-reject-fg`, `--falcon-confirm-dialog-reject-border` |
| Hover | `opacity: 0.85` (literal, both paths — `[CODE]` css:62, tw.tsx:91/98) |
| Focus | accept `:focus-visible` 2px outline (Shadow: token-colored; `-tw`: `outline-2 outline-offset-2`) |
| Chrome (bg/border/shadow/backdrop) | inherited from `dialog.tokens.css` via composed `<falcon-dialog>` |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B15) — token file recounted at 29 lines, `:where()` scope (gate-12) confirmed, the `-tw` accept-button token mismatch (`--falcon-teal-700` vs `--falcon-confirm-dialog-accept-bg`) verified in source. Dark/RTL inheritance `[INFERRED]` (dormant component, not runtime-verified).
