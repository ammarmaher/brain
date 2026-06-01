# falcon-dialog — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-dialog>` as the component to use — and the strong caveat that it is deprecated for direct use.

## Visual fingerprint
`[CODE]` `falcon-dialog.tsx:189-251` — a **dimmed full-viewport backdrop** (teal-tinted, `backdrop-filter: blur`) with a **centered panel** floating above it. The panel has a generous corner radius (`[CODE]` `dialog.tokens.css` 18px), a soft drop shadow, and three vertical regions:
- **Header** — a title `<h2>` and optional description `<p>`, or a fully custom slotted header.
- **Body** — the main content region with token-driven padding.
- **Footer** — optional; only renders when a consumer projects `slot="footer"`.
A small **close × button** sits top-trailing. Optional severity tone (`info` / `success` / `warning` / `danger`) tints an accent. 5 sizes (`sm` 420px → `full` viewport), 3 positions (`center`, `top`, `side-right`).

Distinguishing it from siblings: it is **centered and scale-fades in** (not edge-slide like a drawer), it **blocks the whole page** (unlike a tooltip/popover), and it has **no built-in decision buttons** (unlike `popup` / `confirm-dialog`).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Dialog>` (generic, with `<DialogTitle>` / `<DialogContent>` / `<DialogActions>`) | direct conceptual match — MUI's bare `<Dialog>` is the closest analogue |
| PrimeNG | `<p-dialog>` | direct 1:1 — `falcon-dialog` replaced `<p-dialog>` (Wave PR-8) |
| Ant Design | `<Modal>` (with `footer={null}` for custom footer) | Ant `<Modal>` ≈ this; Ant's built-in OK/Cancel ≈ `falcon-confirm-dialog` |
| Bootstrap | `.modal` | upgrade target |
| shadcn / Radix | `<Dialog>` (Radix Dialog primitive) | direct match — Radix Dialog is also an unopinionated modal shell |
| plain HTML | `<dialog>` element | replace with this (Falcon hand-rolls the focus trap; no native `<dialog>` used) |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a centered modal with a **bespoke body shape** that no canonical variant fits | `<falcon-angular-dialog>` (the only justified direct use) | popup |
| an error / delete-confirm / unsaved-changes / save prompt (one of the 4 canonical actions) | `<falcon-angular-popup>` | dialog |
| a simple "Are you sure?" with OK + Cancel + a severity icon | `<falcon-angular-confirm-dialog>` | dialog |
| a panel sliding in from a screen **edge** | `<falcon-angular-drawer>` | dialog `position="side-right"` |
| an insufficient-wallet-balance / channel-priority reorder prompt | `<falcon-angular-insufficient-balance-dialog>` | dialog |
| a "send credentials" confirmation after creating an account | `<falcon-angular-sending-credentials-dialog>` | dialog |
| a transient hint on hover | `<falcon-angular-tooltip>` | dialog |
| a passive success/error message | `<falcon-angular-notification>` / `<falcon-angular-toast>` | dialog |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **First, reconsider** — if the design is any of the 4 canonical actions or an OK/Cancel prompt, STOP and use `popup` / `confirm-dialog`. Direct dialog use is deprecated (`[BRAIN-OUT]` `OVERVIEW.md:24`).
2. **Inputs** — `[(open)]`, `[title]`, `[description]`, `[size]` (`sm`/`md`/`lg`/`xl`/`full`), `[severity]`, `[dismissible]`, `[closable]`. Keep `[position]="'center'"` — avoid `side-right`.
3. **Slots** — project `slot="header"` for a rich header (title + sub-line + icon), the default slot for the body, `slot="footer"` for a custom button row (the dialog renders **no** footer buttons itself — `[CODE]` `falcon-dialog.tsx:246-248`).
4. **Footer buttons** — compose `<falcon-angular-button>` (ghost Cancel + primary action) inside `slot="footer"`. Wire their `(falconClick)` to your own handlers; do NOT rely on the dialog's `falconConfirm`/`falconCancel` events.
5. **Token override** — restyle via `dialog.tokens.css` vars (panel radius, padding, backdrop blur, max-width per size). Never inline-style the panel host.
6. **Upgrade, don't hand-roll** — if you need a header-actions slot, a responsive `fullScreenAt` breakpoint, or a working `errorMessage` anchor, raise it as a shared upgrade (`[BRAIN-OUT]` `GAPS_AND_UPGRADES.md`).

## Anti-patterns
- `[BRAIN-OUT]` Rendering `<falcon-angular-dialog>` directly in net-new code — it is deprecated; reach for `popup` / `confirm-dialog` first.
- `[CODE]` Using `position="side-right"` to fake a drawer — visually inconsistent; use `<falcon-angular-drawer>`.
- Binding `[errorMessage]` and expecting an inline banner — it is a **dead prop**, never rendered (`[CODE]` `falcon-dialog.tsx:52` accepted, no render anchor).
- Subscribing `(falconConfirm)` / `(falconCancel)` without manually emitting them — no built-in button fires them.
- Stacking two dialogs at once — focus-trap and global Esc listeners collide.
- Inline Tailwind on the dialog host to resize the panel — use the `[size]` prop or token override.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-dialog.tsx` render structure + `falcon-dialog.component.ts` + `dialog.tokens.css` references. Cross-library mapping is `[INFERRED]` from each library's documented API. Deprecation caveat ✅ VERIFIED against `[BRAIN-OUT]` registry note in `OVERVIEW.md`.
