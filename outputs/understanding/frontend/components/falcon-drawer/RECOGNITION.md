# falcon-drawer — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-drawer>` as the component to use, and how to compose it to parity. **Caveat 2026-06-03:** the primitive is currently orphaned by a zoneless-CD slot-wipe defect (G-ZONELESS-SLOT) — projected-body forms are hand-rolled in app code. Recognise the SHAPE as drawer; verify the bug is fixed before adopting the tag.

## Visual fingerprint
`[CODE]` `falcon-drawer.tsx:168-228` / `falcon-drawer-tw.tsx:166-228` — a **panel anchored flush to a screen edge** that slides in from that edge (`transform: translateX/translateY ±100%`), over a dimmed backdrop (the native `::backdrop`). Unlike a dialog it is not centered — it hugs the right/left/top/bottom edge and takes the full extent of the perpendicular axis (full height for right/left, full width for top/bottom). Three regions:
- **Header** — a title `<h2>` (18px, 600 weight) or custom slotted header, with a close × on the trailing side, 1px bottom border.
- **Body** — scrollable content, token-driven padding (20/24px).
- **Footer** — optional `slot="footer"` (canonically a Cancel + Save button row); **no built-in chrome on either path** — the consumer adds the border/padding.
4 positions (`right` default, `left`, `top`, `bottom`); 4 sizes (`sm`/`md`/`lg`/`xl` → 320/480/640/800px sides).

Distinguishing it from siblings: it **slides from an edge** (a dialog scale-fades in the center), **keeps the page edge-visible** (a dialog covers the whole viewport's attention), and is sized for **tall form/list content** (a popup is sized for a short message).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Drawer>` (`anchor="right"/"left"/"top"/"bottom"`) | direct 1:1 — MUI `anchor` ≈ `falcon-drawer position` |
| PrimeNG | `<p-sidebar>` / `<p-drawer>` | direct — replaced `<p-sidebar>` (Wave PR-8) |
| Ant Design | `<Drawer>` (`placement`) | direct 1:1 |
| Bootstrap | `.offcanvas` | direct conceptual match |
| shadcn / Radix | `<Sheet>` (Radix Dialog styled as a side sheet) | direct — shadcn `<Sheet>` is exactly this |
| plain HTML | hand-rolled `.drawer` / `.off-canvas` | replace with this — though note Falcon's wrapper now uses a native `<dialog>`+`showModal()` for the Top Layer |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a panel sliding in from a screen **edge** with a form/list | `<falcon-angular-drawer>` (mind G-ZONELESS-SLOT) | dialog |
| a **centered** modal scale-fading in | `<falcon-angular-dialog>` (or popup/confirm-dialog) | drawer |
| an off-canvas mobile navigation menu | `<falcon-angular-drawer position="left">` | dialog |
| a filter panel docked to the side of a table | `<falcon-angular-drawer position="right">` | dialog |
| a balance-transfer side panel | conceptually drawer — but the live shell is hand-rolled (WAIVER) | the Stencil drawer (empty-body bug) |
| an error / delete / unsaved / save decision prompt | `<falcon-angular-popup>` | drawer |
| an "Are you sure?" OK/Cancel prompt | `<falcon-angular-confirm-dialog>` | drawer |
| a persistent always-visible navigation rail | a layout sidebar (not a drawer) | drawer |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **First verify** — if the body is a projected form and the app is zoneless, confirm G-ZONELESS-SLOT is resolved; otherwise follow the WAIVER (hand-rolled `<aside role="dialog">` + scrim with token-bound utilities, every field a Falcon primitive).
2. **Inputs** — `[open]` + `(openChange)` (or `[(open)]`), `[position]` (`right` default), `[size]`, `[closable]`, `[dismissable]` (a-spelling!), `[modal]`. Default `position="right"` + `size="md"` (480px).
3. **Slots** — `slot="header"` (rich header), default slot (body), `slot="footer"` (action row). The drawer renders **no** footer buttons AND no footer chrome — supply both.
4. **Footer buttons** — `<falcon-angular-button>` (ghost Cancel + primary Save) inside `slot="footer"`; give the footer its own top border + padding.
5. **Body padding** — on an inner `<div class="p-6">`, not the drawer host.
6. **Token override** — `drawer.tokens.css` (per-position width/height, per-side radius, overlay blur, shadow). For RTL, override the per-position radius.
7. **Upgrade, don't hand-roll** — header-actions slot, `closeAriaLabel` passthrough, exit transition, `dismissible` alias are known gaps — raise them. The zoneless-CD fix is the true blocker.

## Anti-patterns
- `[CODE]` Adopting `<falcon-angular-drawer>` for a projected-body form under zoneless CD without testing — empty-body bug (G-ZONELESS-SLOT).
- `[BRAIN-OUT]` Passing `[closable]="true"` AND a footer Cancel button that also closes — duplicate close paths.
- `[BRAIN-OUT]` Wrapping the drawer in `@if (open)` while ALSO binding `[open]` — redundant.
- `[BRAIN-OUT]` Nesting drawers — focus-trap layering breaks (each runs its own global keydown listener).
- `[CODE]` Copying `dismissible` (i-spelling) from a dialog — the drawer prop is `dismissable` (a-spelling); silent default.
- Using `position="bottom"` for a confirm prompt — use `popup`.
- Inline Tailwind on the drawer host to set width — use `[size]` or a token override.
- Adding `z-[…]` for stacking — forbidden; the Top Layer handles it.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B14) from `falcon-drawer.tsx` + `falcon-drawer-tw.tsx` render structure + the WAIVER comments in the wallet consumers + `drawer.tokens.css`. Cross-library mapping `[INFERRED]`. `dismissable` spelling trap + zero-chrome footer + the G-ZONELESS-SLOT recognition caveat ✅ CODE-VERIFIED.
