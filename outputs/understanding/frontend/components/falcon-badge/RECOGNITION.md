# falcon-badge — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-badge>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` falcon-badge.tsx:39-64 — a **small inline pill**:
- A short rounded rectangle hugging 1–2 words or a number, three sizes (`sm/md/lg`).
- One of **three surface treatments**: `solid` (filled colour, white text), `subtle` (tinted-light fill, dark text — the default), `outline` (border only, no fill).
- One of **six colour families**: `neutral` (grey, default), `primary` (teal), `success` (green), `warning` (amber), `danger` (red), `info` (blue).
- Optional **leading dot** (`dot`) — a tiny variant-tinted circle before the text — or a **leading icon** (`iconName`).
- `[CODE]` falcon-badge.tsx — `6 variants × 3 appearances × 3 sizes = 54` visual combinations.

Distinguishing tell vs siblings: a badge is *static and non-removable* and usually carries a **count or a one-word flag**. If it has an `×` it is a `falcon-tag`; if its text is a lifecycle word (Active/Pending) it should be a `falcon-status-badge`.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Chip>` (non-deletable, `variant="filled"/"outlined"`) / `<Badge>` (overlay count) | MUI `<Chip>` ≈ Falcon badge for inline labels. MUI `<Badge>` is an *overlay* count — Falcon badge has no overlay mode (host must position it). |
| PrimeNG | `<p-badge>` / `<p-tag>` | PrimeNG `<p-badge>` (count) and `<p-tag>` (label) both map here; Falcon splits count+label into one `falcon-badge` and removable into `falcon-tag`. |
| Ant Design | `<Tag>` / `<Badge count>` | Ant `<Tag>` ≈ inline label; Ant `<Badge count>` is an overlay — Falcon has no overlay mode. |
| Bootstrap | `.badge` | direct 1:1 — `.badge` + `.text-bg-*` ≈ `variant` + `appearance`. |
| shadcn / Radix | `<Badge variant="default/secondary/destructive/outline">` | direct 1:1 — shadcn `variant` maps to Falcon `variant`+`appearance` combined. |
| plain HTML | `<span class="badge">` | always replace with `<falcon-angular-badge>`. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a count or a one-word flag ("Beta", "New", "12") | `<falcon-angular-badge>` | — |
| a lifecycle / workflow status (Active / Pending / Disabled / Expired) | `<falcon-angular-status-badge>` | badge |
| a chip with an `×` to remove it | `<falcon-angular-tag dismissible>` | badge |
| a presence dot on an avatar | `<falcon-angular-avatar [status]>` | badge |
| a tiny coloured dot alone, no text | `<falcon-angular-badge dot ariaLabel="…">` (Stencil tag — wrapper lacks `ariaLabel`) | badge wrapper |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `variant` (the six colour families), `appearance` (`solid|subtle|outline`), `size` (`sm|md|lg`), `[dot]` (leading tinted dot), `[iconName]` (leading Falcon-icon glyph).
2. **Content** — project the label as default content: `<falcon-angular-badge variant="info">Beta</falcon-angular-badge>` (`[BRAIN-OUT]` API.md:50-51 — `<ng-content>` works on the wrapper).
3. **No templates / no per-row slots** — only the single default content slot.
4. **Variants** — the 54-combination matrix (`variant × appearance × size`) is fully token-driven; pick the combination, do not restyle.
5. **Token override** — restyle via `badge.tokens.css`; never hardcode colours.
6. **Upgrade** — `[ariaLabel]` on the Angular wrapper (FB-01), an overlay/positioned mode for notification counts — both are `GAPS_AND_UPGRADES.md` proposals; raise them.
7. **Wrapper** — for a count overlapping an icon, the host adds `relative`/`absolute` positioning; the badge has no overlay mode of its own.

## Anti-patterns
- Using `falcon-badge` for an account/service/order **lifecycle status** — that is `<falcon-status-badge>`; the wrong choice decouples colour from the domain bucket map.
- Hand-rolling a count badge with raw Tailwind (`bg-teal-500 rounded-full px-2`) — `[BRAIN-OUT]` GAPS_AND_UPGRADES.md:7 — production currently does this; adopt the component instead.
- Rendering a `0` count without `*ngIf` — most count patterns hide at zero.
- Building a dot-only badge via `<falcon-angular-badge dot>` and expecting an accessible label — the wrapper lacks `ariaLabel` (FB-01); use the Stencil `<falcon-badge>` tag.
- Passing an `iconName` not in the Falcon icon font — renders an empty `<i>` silently.
