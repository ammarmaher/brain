# falcon-tag — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-tag>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A small **inline-flex chip** — a short text label inside a tinted, low-height container. Distinguishing features:
- **Shape** — pill by default (`rounded=true`, border-radius 999px) or square corners (`rounded=false`, 4px).
- **Severity tint** — one of 7 generic color buckets: `success` (green), `info` (blue), `warning`/`warn` (amber), `danger` (red), `secondary` (neutral grey — the default), `contrast` (dark inverse, dark bg + light fg).
- **Optional leading icon** — a small `<i>` glyph before the label (`aria-hidden`).
- **Optional dismiss `✕`** — a trailing button when `dismissible=true`; in RTL the icon and ✕ swap edges.
- Compact typography (~10–13px by size), font-weight 500, no shadow. Content-shaped width.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Chip>` (`onDelete` for dismiss, `variant="filled"`) | direct 1:1 — MUI `<Chip onDelete>` ≈ `dismissible` tag. |
| PrimeNG | `<p-tag>` / `<p-chip>` | this component **replaces** `<p-tag>`; PrimeNG `<p-chip removable>` ≈ dismissible variant. |
| Ant Design | `<Tag>` / `<Tag closable>` | direct 1:1 — Ant `<Tag closable onClose>` ≈ `dismissible` + `(falconDismiss)`. |
| Bootstrap | `.badge` (static) / no native removable chip | upgrade target — replace badges-used-as-chips with this. |
| shadcn / Radix | `<Badge>` (shadcn) — no Radix primitive | shadcn `<Badge variant="…">` ≈ a non-dismissible tag; dismissible has no Radix equivalent. |
| plain HTML | `<span class="chip">` + a removal `<button>` | always replace with this component (`feedback_falcon_ui_library_only_no_native`). |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a removable chip (filter, selected value) | `<falcon-angular-tag [dismissible]="true">` | a hand-rolled chip |
| a severity / category label (non-status) | `<falcon-angular-tag severity="…">` | `<falcon-status-badge>` |
| a user / account / service **lifecycle status** (active/pending/suspended/locked/deleted/inactive/paid/expired/disabled) | `<falcon-angular-status-badge>` | `<falcon-tag>` |
| a generic count / notification number | `<falcon-badge>` | `<falcon-tag>` |
| a neutral plain label with no status meaning | `<falcon-angular-tag severity="secondary">` | `info`/`success` for "looks" |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **Inputs** — `[value]` (label), `[severity]` (7-value, `secondary` for neutral), `[size]` (`sm`/`md`/`lg`), `[icon]` (leading glyph name), `[rounded]` (pill vs square), `[dismissible]`.
2. **Output** — bind `(falconDismiss)` to a parent method that removes the keyed member from the collection signal (immutable `.update()`).
3. **Slot** — for richer label content (an icon glued to text), project via `<ng-content>` instead of `[value]` (`API.md:48`).
4. **Variant** — shape via `[rounded]`; tint via `[severity]`.
5. **Token override** — restyle radius via `tag.tokens.css` vars (`--falcon-tag-radius`); for **color** (`--falcon-tag-bg`/`-fg`) the override only bites on the Shadow path (`useTailwind=false`) — the default `-tw` path hardcodes palette utilities (FT-07). Never hardcode hex/px.
6. **Shared upgrade** — i18n dismiss label (FT-02 `[dismissAriaLabel]`), dismiss hover/focus tokens (FT-03), a `<falcon-tag-list>` overflow orchestrator (FT-05), or `col.type='tag'` table integration (FT-06) are GAPs (`GAPS_AND_UPGRADES.md`) — raise them, do not hand-roll.
7. **Wrapper** — for new pages always use `<falcon-angular-tag>` (the Angular wrapper), never the raw Stencil tag (except the documented i18n `aria-label` workaround).
8. **Multi-tag layout** — wrap a tag set in `<div class="flex flex-wrap gap-1">` (no orchestrator exists yet — FT-05).

## Anti-patterns
- Using a tag for **workflow / lifecycle status** — that is `<falcon-status-badge>` (`USAGE.md:78,96`). The 7 `severity` values are a generic palette, not the 9 status enums.
- Using a tag as a **count / notification badge** — that is `<falcon-badge>` (`USAGE.md:79`).
- Passing `severity="warn"` in new code — deprecated legacy alias; use `warning` (`USAGE.md:97`).
- Shipping `[dismissible]="true"` without a `(falconDismiss)` handler — a ✕ that does nothing.
- Reaching for `info`/`success` to make a neutral label "look nicer" — use `secondary`; severity colors carry meaning.
- Placing a `<falcon-badge variant="info">` and a `<falcon-tag severity="info">` on the same row — they look identical, mean different things (`GAPS_AND_UPGRADES.md:51`).
- Extending the wrapper's dead `classes` computed (`GAPS_AND_UPGRADES.md:5-7`) — it is unused; the Stencil tag is the live path.
- PrimeNG `<p-tag>` / native `<span>` chips in app code — banned.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B10) — anatomy + 7-value severity enum confirmed against `[CODE]` `falcon-tag.types.ts:2-15`, `falcon-tag.tsx`, `falcon-tag-tw.tsx`. Cross-library mapping is `[INFERRED]` from standard component parity. Severity-vs-status separation ✅ VERIFIED against the two distinct type files. Token-override note corrected (color override is Shadow-path-only — FT-07).
