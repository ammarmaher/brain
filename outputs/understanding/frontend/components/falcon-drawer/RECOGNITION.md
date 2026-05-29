# falcon-drawer — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-drawer>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-drawer.tsx:168-228` — a **panel anchored flush to a screen edge** that slides in from that edge (`transform: translateX/translateY ±100%`), over a dimmed backdrop. Unlike a dialog it is not centered — it hugs the right, left, top, or bottom edge and takes the full extent of the perpendicular axis (full height for right/left, full width for top/bottom). It has three regions:
- **Header** — a title `<h2>` (or custom slotted header) with a close × button on the trailing side.
- **Body** — the main scrollable content region with token-driven padding.
- **Footer** — optional; only renders when a consumer projects `slot="footer"` (canonically a Cancel + Save button row).
4 positions (`right` default, `left`, `top`, `bottom`); 4 sizes (`sm`/`md`/`lg`/`xl` → 320/480/640/800px for side anchors).

Distinguishing it from siblings: it **slides from an edge** (a dialog scale-fades in the center), it **keeps the page edge-visible** (a dialog covers the whole viewport's attention), and it is sized for **tall form/list content** (a popup is sized for a short message).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Drawer>` (`anchor="right"` / `"left"` / `"top"` / `"bottom"`) | direct 1:1 — MUI `<Drawer anchor>` ≈ `falcon-drawer position` |
| PrimeNG | `<p-sidebar>` / `<p-drawer>` | direct — `falcon-drawer` replaced `<p-sidebar>` (Wave PR-8) |
| Ant Design | `<Drawer>` (`placement` prop) | direct 1:1 |
| Bootstrap | `.offcanvas` | direct conceptual match — Bootstrap "offcanvas" is the same idea |
| shadcn / Radix | `<Sheet>` (Radix Dialog styled as a side sheet) | direct — shadcn's `<Sheet>` is exactly this pattern |
| plain HTML | hand-rolled `.drawer` / `.off-canvas` div | replace with this |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a panel sliding in from a screen **edge** with a form or list | `<falcon-angular-drawer>` | dialog |
| a **centered** modal scale-fading in | `<falcon-angular-dialog>` (or `popup`/`confirm-dialog`) | drawer |
| an off-canvas mobile navigation menu | `<falcon-angular-drawer position="left">` | dialog |
| a filter panel docked to the side of a table | `<falcon-angular-drawer position="right">` | dialog |
| an error / delete / unsaved / save decision prompt | `<falcon-angular-popup>` | drawer |
| an "Are you sure?" OK/Cancel prompt | `<falcon-angular-confirm-dialog>` | drawer |
| a persistent always-visible navigation rail | a layout sidebar (not a drawer) | drawer |
| a transient hover hint | `<falcon-angular-tooltip>` | drawer |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[open]` + `(openChange)` (or `[(open)]`), `[position]` (`right` default), `[size]` (`sm`/`md`/`lg`/`xl`), `[closable]`, `[dismissable]` (note the a-spelling), `[modal]`. Default to `position="right"` + `size="md"` (480px).
2. **Slots** — project `slot="header"` for a rich header (title + sub-line), the default slot for the body content, `slot="footer"` for the action button row. The drawer renders **no** footer buttons itself (`[CODE]` `falcon-drawer.tsx:222-224`).
3. **Footer buttons** — compose `<falcon-angular-button>` (ghost Cancel + primary Save) inside `slot="footer"`; give the footer its own top border + padding (`[BRAIN-OUT]` `USAGE.md:44`).
4. **Body padding** — put padding on an inner `<div class="p-6">`, not on the drawer host (`[BRAIN-OUT]` `USAGE.md:117`).
5. **Token override** — restyle via `drawer.tokens.css` vars (per-position width/height, per-side border-radius, overlay blur, panel shadow). For RTL, override the per-position border-radius.
6. **Upgrade, don't hand-roll** — header-actions slot, `canClose` predicate, exit transition, `closeAriaLabel` passthrough are all known gaps (`[BRAIN-OUT]` `GAPS_AND_UPGRADES.md`) — raise them as shared upgrades.
7. **Wrapper** — for a real feature, build a feature component (e.g. `falcon-org-node-drawer`) that composes `<falcon-angular-drawer>` as its shell and owns the form + API service.

## Anti-patterns
- `[BRAIN-OUT]` `USAGE.md:133` Passing `[closable]="true"` **and** a footer Cancel button that also closes — duplicate close paths confuse keyboard users.
- `[BRAIN-OUT]` `USAGE.md:134` Wrapping the drawer in `@if (open)` while ALSO binding `[open]` — redundant; let the drawer manage its own DOM (Stencil returns `null` when closed).
- `[BRAIN-OUT]` `USAGE.md:136` Nesting drawers inside drawers — focus-trap layering breaks.
- `[CODE]` Copying `dismissible` from a dialog template — the drawer prop is `dismissable` (a-spelling); the wrong spelling silently uses the default.
- Using `position="bottom"` for a confirm prompt — wrong concept; use `popup`.
- Inline Tailwind on the drawer host to set width — use `[size]` or a `drawer.tokens.css` override.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-drawer.tsx` render structure + `drawer.tokens.css` references + `[BRAIN-OUT]` existing dossiers. Cross-library mapping is `[INFERRED]` from each library's documented API. `dismissable` spelling trap ✅ VERIFIED against `[CODE]` `falcon-drawer.tsx:40`.
