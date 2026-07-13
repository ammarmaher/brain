# falcon-form-field — TOKENS

> **REFRESHED 2026-06-03 (B24) — major correction.** The prior dossier was built around a phantom `falcon-form-field.component.scss` file ("SCSS file is the biggest risk", "VIOLATED today. Migrate."). **NO `.scss`/`.css` file exists** (Glob clean 2026-06-03). The component is already **Tailwind-utility-only** in its `templateUrl` HTML, with a couple of `var(--text-*, fallback)` theme-token reads. The no-SCSS rule is **COMPLIANT**, not violated.

## Component token file

**None — and none is needed.** `[CODE]` No file under `libs/falcon-ui-tokens/src/components/` for this component, and (correctly) no `--falcon-form-field-*` namespace. As a single-render `libs/falcon/src/shared-ui` component, it styles itself with Tailwind utilities + direct theme-token reads. **There is no gate-12 `:where()` scope to audit** (no token CSS exists).

## How it is actually styled (Tailwind utilities + token reads)

`[CODE]` `falcon-form-field.component.html` — every visual value is a Tailwind utility or a `var()` read:

| Element | Classes / tokens | Source |
|---|---|---|
| Container | `flex flex-col gap-1.5 min-w-0` + `[class.opacity-[0.65]]` + `[class.pointer-events-none]` (disabled) + `[class.is-invalid]` (hasError) | `html:2-5` |
| Label | `text-xs font-medium text-[var(--text-2,#3d3d3d)] flex items-center gap-1 leading-[1.3]` | `html:7` |
| Required asterisk | `text-falcon-red-500` | `html:10` |
| Error line | `text-2xs text-falcon-red-500 leading-[1.3] mt-[-1px]` | `html:21` |
| Hint line | `text-2xs text-[var(--text-muted,#6b7280)] leading-[1.3]` | `html:25` |

> `[CODE]` Two `var(--token, fallback)` reads: `--text-2` (label color, fallback `#3d3d3d`) and `--text-muted` (hint color, fallback `#6b7280`). These are **theme text tokens** (the `--text-*` family in `falcon-theme`), read directly via Tailwind arbitrary-value syntax. The error/required colors use the `text-falcon-red-500` palette utility.

## Related Falcon theme tokens

| Token (or utility) | Used by form-field for |
|---|---|
| `--text-2` (fallback `#3d3d3d`) | Label text color |
| `--text-muted` (fallback `#6b7280`) | Hint text color |
| `--color-falcon-red-500` (via `text-falcon-red-500`) | Required asterisk + error text |
| `text-xs` / `text-2xs` (theme type scale) | Label / message font sizes |
| `gap-1.5` / `gap-1` / `mt-[-1px]` (theme spacing) | Row + label-asterisk gaps |

## Tailwind utility guidance

- The wrapper IS Tailwind-only. For layout tweaks, add utilities via the host `class=` (host is `block`):

```html
<falcon-form-field class="mb-4" label="profile.bio"> … </falcon-form-field>
```

- There is **no token-override pattern** (no `--falcon-form-field-*` namespace). To change the label/hint color globally, change the `--text-2` / `--text-muted` theme tokens (a theme-level change, not per-field).

## Dark mode

`[CODE]` No dedicated dark rules. The `var(--text-2)` / `var(--text-muted)` reads follow whatever those theme tokens resolve to under `.app-dark`; `text-falcon-red-500` follows the palette. Token-driven, no per-field override.

## Density

**N/A** — single density (fixed `gap-1.5` row spacing).

## RTL

`[CODE]` RTL-safe — the label row uses `flex items-center gap-1` (direction-agnostic) and there are no physical `ml-`/`mr-` utilities. Label-row direction follows page `dir`.

## Static style risks

- `[CODE]` **The two `var(--token, #hex)` fallbacks** (`#3d3d3d`, `#6b7280`) are hardcoded *fallback* literals inside `var()` — acceptable per the `var(--token, fallback)` convention (the defined theme token overrides the fallback when present). The only mild risk: if `--text-2` / `--text-muted` are NOT defined in a given theme, the chip silently uses the baked hex (verify the tokens exist platform-wide). (G-TOKEN-FALLBACK, minor.)
- `[CODE]` One literal helper class `ff-slot` (`html:16`) — a content-wrapper hook with no stylesheet rule behind it (no CSS file). Harmless; could be dropped.
- **No SCSS, no component CSS file, no hex outside `var()` fallbacks** — compliant with the no-SCSS / tokens-over-literals house rules.

## No CSS / no SCSS guidance

- **COMPLIANT** today (correction vs prior dossier). The component is `templateUrl` HTML + Tailwind utilities; no stylesheet exists.
- Do NOT introduce a `.scss`/`.css` file or a `--falcon-form-field-*` token file. If theming is needed, lean on the existing `--text-*` theme tokens or the Tailwind palette.

## Token usage by state

| State | Tokens / utilities |
|---|---|
| Idle (label) | `text-[var(--text-2,#3d3d3d)]`, `text-xs font-medium` |
| Required | `text-falcon-red-500` (asterisk) |
| Invalid (error line) | `text-falcon-red-500`, `text-2xs` (+ `is-invalid` host class hook) |
| Hint | `text-[var(--text-muted,#6b7280)]`, `text-2xs` |
| Disabled | `opacity-[0.65]` + `pointer-events-none` on the container |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24). **Correction:** confirmed NO `.scss`/`.css` file (Glob clean) and NO token file (`falcon-ui-tokens` clean) — the prior "SCSS is the biggest risk / VIOLATED today" narrative was wrong. All styling is `templateUrl` Tailwind utilities + two `var(--text-*, fallback)` reads, quoted from `falcon-form-field.component.html` (lines cited). The `--text-2`/`--text-muted` → theme-token mapping is 🟡 CODE-DERIVED (theme file not re-read line-by-line).
