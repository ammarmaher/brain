# falcon-dialog — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-dialog>` as the component to use — and the strong caveat that it is deprecated for direct use.

## Visual fingerprint
`[CODE]` `falcon-dialog.tsx:189-251` / `falcon-dialog-tw.tsx:187-251` — a **dimmed full-viewport backdrop** (teal-tinted, `backdrop-filter: blur`, supplied by the native `::backdrop`) with a **centered panel** floating above it. The panel has a generous corner radius (18px), a soft drop shadow (`0 24px 60px rgba(0,0,0,0.18)`), and three vertical regions:
- **Header** — a centered title `<h2>` (700 weight, 20px) + optional description `<p>`, or a fully custom slotted header.
- **Body** — scrollable content region, token-driven padding.
- **Footer** — optional; the default Tailwind (`-tw`) path wraps it in token-driven chrome (gap / top-border / `justify-end`), the Shadow path renders it bare.
A small **close × button** sits top-trailing (32px, logical `end`/`top` offset). Optional severity tone (`info`/`success`/`warning`/`danger`) paints a 4px top accent strip (`-tw` only) + remaps title-color + focus-ring. 5 sizes (`sm` 420 → `full` `calc(100vw-32px)`), 3 positions (`center`, `top`, `side-right`).

Distinguishing it from siblings: it is **centered and scale-fades in** (not edge-slide like a drawer), it **blocks the whole page** (enters the browser Top Layer), and it has **no built-in decision buttons** (unlike `popup` / `confirm-dialog`).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Dialog>` (generic, with `<DialogTitle>` / `<DialogContent>` / `<DialogActions>`) | direct conceptual match — MUI's bare `<Dialog>` is the closest analogue |
| PrimeNG | `<p-dialog>` | direct 1:1 — `falcon-dialog` replaced `<p-dialog>` (Wave PR-8) |
| Ant Design | `<Modal>` (`footer={null}` for custom footer) | Ant `<Modal>` ≈ this; Ant's built-in OK/Cancel ≈ `falcon-confirm-dialog` |
| Bootstrap | `.modal` | upgrade target |
| shadcn / Radix | `<Dialog>` (Radix Dialog primitive) | direct match — both are unopinionated modal shells |
| plain HTML | `<dialog>` element | Falcon's wrapper now ACTUALLY uses a native `<dialog>` + `showModal()` (Top Layer) around the Stencil core — so this is the closest of all |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a centered modal with a **bespoke body shape** no canonical variant fits (e.g. a share form) | `<falcon-angular-dialog>` (the justified direct use) | popup |
| an error / delete / unsaved / save prompt (one of the 4 canonical actions) | `<falcon-angular-popup>` | dialog |
| a simple "Are you sure?" with OK + Cancel + a severity icon | `<falcon-angular-confirm-dialog>` | dialog |
| a panel sliding in from a screen **edge** | `<falcon-angular-drawer>` | dialog `position="side-right"` |
| an insufficient-wallet-balance / channel-priority reorder prompt | `<falcon-angular-insufficient-balance-dialog>` | dialog |
| a transient hint on hover | `<falcon-angular-tooltip>` | dialog |
| a passive success/error message | `<falcon-angular-notification>` / `<falcon-angular-toast>` | dialog |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → upgrade → wrapper → GAP.
1. **First, reconsider** — if the design is any of the 4 canonical actions or an OK/Cancel prompt, STOP and use `popup` / `confirm-dialog`. Direct dialog use is deprecated (`[BRAIN-OUT]` OVERVIEW.md). Only proceed for a genuinely bespoke body (the contact-groups Share dialog is the canonical example).
2. **Inputs** — `[(open)]`, `[title]`, `[description]`, `[size]` (`sm`/`md`/`lg`/`xl`/`full`), `[severity]`, `[dismissible]` (or granular `[closable]`/`[closeOnBackdrop]`/`[closeOnEsc]` bound to an in-flight signal), `[closable]`. Keep `[position]="'center'"` — avoid `side-right`.
3. **Slots** — `slot="header"` for a rich header, the default slot for the body, `slot="footer"` for a custom button row (the dialog renders **no** footer buttons; on the `-tw` path the footer chrome is auto-added).
4. **Footer buttons** — compose `<falcon-angular-button>` (ghost Cancel + primary action) inside `slot="footer"`. Wire `(falconClick)` to your handlers; do NOT rely on the dialog's `falconConfirm`/`falconCancel` events.
5. **Token override** — restyle via `dialog.tokens.css` vars (panel radius, padding, max-width per size). Never inline-style the panel host.
6. **Upgrade, don't hand-roll** — header-actions slot, a working `errorMessage` anchor, `closeAriaLabel` passthrough are known gaps (`[BRAIN-OUT]` GAPS_AND_UPGRADES.md) — raise them as shared upgrades.

## Anti-patterns
- `[BRAIN-OUT]` Rendering `<falcon-angular-dialog>` directly in net-new code for a flow `popup`/`confirm-dialog` handles.
- `[CODE]` Using `position="side-right"` to fake a drawer — visually inconsistent; use `<falcon-angular-drawer>`.
- `[CODE]` Binding `[errorMessage]` expecting an inline banner — **dead prop** (falcon-dialog.tsx:52). Render your own banner in the body slot.
- Subscribing `(falconConfirm)` / `(falconCancel)` without manually emitting them — no built-in button fires them.
- Stacking two dialogs at once — the hand-rolled global Esc listeners collide (even though the Top Layer stacks them).
- Inline Tailwind on the dialog host to resize the panel — use `[size]` or a token override.
- Adding `z-[…]` for stacking — forbidden (`[CODE]` overlay.tokens.css ESLint guard); the Top Layer handles it.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B14) from `falcon-dialog.tsx` + `falcon-dialog-tw.tsx` render structure + `falcon-dialog.component.{ts,html,css}` + `dialog.tokens.css`. Cross-library mapping `[INFERRED]` from each library's documented API; the plain-HTML row is now CODE-grounded (the wrapper genuinely uses native `<dialog>`+`showModal()`). Deprecation caveat ✅ `[BRAIN-OUT]` registry note.
