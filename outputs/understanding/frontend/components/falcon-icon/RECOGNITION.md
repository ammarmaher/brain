# falcon-icon — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-icon>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` falcon-icon.tsx:32-43 — **a single glyph, nothing else**:
- One icon-font character — a pencil, trash, chevron, cog, check, warning triangle, etc.
- No surface, no fill, no border, no padding — it is a bare `<i>` whose colour is inherited from the surrounding text.
- Five sizes: `xs`=12 / `sm`=14 / `md`=16 (default) / `lg`=20 / `xl`=24 px.
- Always inline — it sits in the text/control flow.

Distinguishing tell vs siblings: an icon is a *bare glyph with no container*. The moment it sits on a coloured disc it is a `falcon-avatar` (icon fallback) or part of a `falcon-badge`. If it stands alone with no surface, it is `falcon-icon`.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Icon>` / any `@mui/icons-material` SVG component (`<DeleteIcon />`) | MUI ships SVG icon components per glyph; Falcon uses a *font* + one component with a `name` prop. `fontSize` prop ≈ Falcon `size`. |
| PrimeNG | `<i class="pi pi-X">` (PrimeIcons) | `[BRAIN-OUT]` OVERVIEW.md:26 — the Falcon font replaced `pi pi-*` (Wave PR-8). Their `pi pi-trash` → Falcon `name="trash"`. |
| Ant Design | `@ant-design/icons` (`<DeleteOutlined />`) | per-glyph SVG components → Falcon `name` prop. |
| Bootstrap | Bootstrap Icons `<i class="bi bi-X">` | font-class pattern → Falcon `name` prop. |
| shadcn / Radix | `lucide-react` (`<Trash2 />`) | lucide SVG components → Falcon `name`. shadcn passes `className` for size/colour; Falcon uses `size` + parent `currentColor`. |
| plain HTML | `<i class="fa fa-X">` (Font Awesome) / inline `<svg>` | replace font-class icons with `<falcon-angular-icon>`; if the glyph is **not in the Falcon font**, use `<iconify-icon>` instead. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a bare glyph in the Falcon icon set | `<falcon-angular-icon name="…">` | raw `<i class="falcon-icon …">` |
| a **platform-owned, exact** SVG glyph (e.g. SAR currency `currency-sar`) | `<falcon-svg-icon name="…">` (shared registry, `@falcon` → `SvgIconComponent`/`SVG_ICON_NAMES`) | falcon-icon · raw `<svg>` dup |
| a one-off third-party / brand SVG not in the font | `<iconify-icon>` (until the unified router GAP lands) | falcon-icon |
| a glyph on a coloured disc representing identity | `<falcon-angular-avatar [iconName]>` | falcon-icon |
| a count / label pill (with an optional leading glyph) | `<falcon-angular-badge [iconName]>` | falcon-icon |
| a large illustration glyph for a "no data" page | `<falcon-angular-empty-state [iconName]>` | falcon-icon alone |
| a spinning loading indicator | `<falcon-angular-loader-inline>` (or icon + Tailwind `animate-spin` — `spin` prop is a GAP) | — |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `name` (REQUIRED — the glyph name, *without* the `falcon-icon-` prefix; must exist in `falcon-icons.css`), `size` (`xs|sm|md|lg|xl`), `decorative` (default `true` → `aria-hidden`), `label` (REQUIRED when `decorative=false`).
2. **No templates / no slots** — `[CODE]` falcon-icon.tsx has no `<slot>`; the icon has no projectable content.
3. **Variants** — `size` is the only variant axis.
4. **Colour** — set `text-falcon-*` on the **parent**; the icon inherits via `currentColor`. There is no `color` input.
5. **Token override** — per-size pixels via `icon.tokens.css` (`--falcon-icon-{size}`), colour via `--falcon-icon-color`.
6. **Registry** — if the glyph you need is not in `falcon-icons.css`, the icon is a **registry addition** (font asset + CSS regeneration) — raise it; do not substitute a wrong glyph. For a multi-path / platform-owned **SVG** glyph (currency, brand mark the platform owns) that the font cannot carry, the blessed home is the shared **SVG registry** `SVG_ICON_REGISTRY` (`[CODE]` libs/falcon/src/shared-ui/lib/ui/svg-icon/svg-icon.registry.ts) rendered via `<falcon-svg-icon name="…">` — add the glyph there once and every consumer (`SVG_ICON_NAMES.CURRENCY_SAR` already powers wallet / applications-table / Add-Client / comm-mkt-view) shares it. Do NOT re-draw it inline per feature.
7. **Upgrade** — `spin`/`pulse`/`flip`/`rotate`/`color` shorthand and the Iconify-prefix router are all `GAPS_AND_UPGRADES.md` proposals — raise them.
8. **Wrapper / fallback** — for a non-Falcon glyph use `<iconify-icon>`; the unified `<falcon-angular-icon>` Iconify router is a GAP.

## Anti-patterns
- Writing the raw `<i class="falcon-icon falcon-icon-X">` in new code — `[BRAIN-OUT]` GAPS_AND_UPGRADES.md P0 — use the `<falcon-angular-icon>` wrapper for standardised size + a11y.
- Passing `name` with the `falcon-icon-` prefix — pass just the glyph name (`"trash"`, not `"falcon-icon-trash"`).
- Setting `decorative=false` without a `label` — the icon's meaning is then silently un-announced.
- Trying to colour the icon directly — there is no `color` input; colour the parent.
- Substituting a near-miss Falcon glyph because the exact one is missing — raise a registry addition; a wrong icon is a semantic defect.
- Using `<falcon-angular-icon>` for a non-Falcon / custom SVG — it can only render glyphs in `falcon-icons.css`; use `<falcon-svg-icon>` (platform-owned exact glyph) or `<iconify-icon>` (third-party).
- Re-drawing a platform-owned SVG (e.g. the SAR symbol) inline in a feature when it already exists in the shared SVG registry — call `<falcon-svg-icon name="currency-sar">` instead of duplicating the path.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B11) from `falcon-icon.tsx` + `falcon-icon.component.ts` + `falcon-icons.css` (314 glyphs). Visual fingerprint + sibling routing (icon vs svg-icon vs avatar vs badge) re-confirmed. Cross-library mapping 🟡 `[INFERRED]`. comm-mkt-card confirmed as the live `icon-start` slot consumer.
