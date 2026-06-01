---
name: V0.2 theme adopted as Falcon source of truth
description: Falcon theme migrated to V0.2-aligned palette via Tailwind v4 @theme single source. Single source file at libs/falcon/src/theme/falcon-tailwind-tokens.css owns every token. Per-app tailwind.css files alias to canonical (forward-only).
type: project
originSessionId: 25512807-daa0-486f-99fd-0aacbe9baea5
---
**Decision:** The V0.2 sketch project at `C:\Taha\Falcone-V0.2` is the official source of truth for Falcon's theme — color palette, spacing scale, border radii, shadows, typography sizes, breakpoints, easings/durations, and z-index. Confirmed and executed across Waves 0-6 on 2026-05-05.

**Why:** The user (boss) handed over V0.2 as the visual / design source of truth and asked for full migration to a single-config-file architecture. V0.2 was extracted to a structured spec at `C:\falcon\Brain\Brain Generated\v02-theme-spec\v02-theme-spec.md` and Falcon's theme was rebuilt around its values.

**How to apply:**

- **Single source of truth:** `C:\falcon\falcon-web-platform-ui\libs\falcon\src\theme\falcon-tailwind-tokens.css` (Tailwind v4 `@theme` block) — every reusable theme token lives here, palette-named (`--color-falcon-{teal|neutral|green|red|amber}-{shade}`), 313 lines, ~135 canonical tokens.
- **Per-app `tailwind.css` files** (host-shell, admin-console, management-console) `@import` the canonical file. Their own `@theme` blocks ONLY contain aliases (`--color-teal: var(--color-falcon-teal-500)`) or bespoke tokens flagged for review. NEVER re-declare a canonical name with a different value.
- **PrimeNG Aura preset** at `libs/falcon/src/theme/primeng-theme.ts` overrides primitive palettes (`teal`, `green`, `red`, `amber`, `slate`, `zinc`) AND semantic `primary` palette to point at `var(--color-falcon-*)` for every shade. PrimeNG components paint with V0.2 canonical colors automatically.
- **Tailwind preset.cjs** at `libs/falcon/src/theme/tailwind/preset.cjs` is a no-op stub (its prior `--st-*` references were broken; Wave 4 reduced it to `theme: { extend: {} }`). Cannot be deleted because root `tailwind.config.js` requires it. Tailwind v4's `@theme` directive does the actual work.
- **Fonts** are NOT in the canonical theme file. They live in:
  - Loaded from Google Fonts CDN via `<link>` in `apps/host-shell/src/index.html` — Poppins (LTR primary), Inter (LTR fallback), IBM Plex Sans Arabic (RTL primary).
  - Direction switching in `apps/host-shell/src/styles.scss` via `:root { --font-sans: 'Poppins'... }` and `[dir="rtl"] { --font-sans: 'IBM Plex Sans Arabic'... }`.
  - The OLD self-hosted approach (Neue Haas + Cairo + `@font-face` declarations in `libs/falcon/src/theme/styles/tokens/00-fonts.css`) was REMOVED in earlier `theme-polishment-v1` branch refactor. Earlier in this conversation I edited those paths to wire IBM Plex `@font-face` — those edits went into a now-deleted directory. No functional impact because Google Fonts CDN already serves all three families.
- **Forward-only migration:** existing var names (`--color-teal`, `--color-bg-page`, `--color-status-green`, etc.) STAY at their current names. Templates consuming `bg-teal`, `bg-bg-page`, `text-status-green` keep working. Internal values flow from canonical.

**Visible color shifts adopted in this migration (V0.2-aligned):**
- `--color-status-green`: `#16a34a` (moss-green) → `#10b981` (emerald)
- `--color-status-green-bg`: `#d9f2e4` (medium tint) → `#ecfdf5` (near-white)
- `--color-status-orange-bg`: `#ffeccb` → `#fffbeb` (much lighter)
- `--color-text*` and `--color-border*`: warm-gray → cool-slate (small hue shift)
- Border radii grew: `--radius-sm` 2px → 4px, `--radius-md` 6px → 8px, `--radius-lg` 8px → 12px, `--radius-xl` 12px → 16px, `--radius-3xl` 24px → 44px

**Unmigrated bespoke tokens still living in per-app `tailwind.css`** (flagged for promotion review):
- `--text-xs` … `--text-2xl` (Tailwind v4 default scale 12-24px) — different from canonical Falcon scale (10-22px). Aliasing would shift type globally; left as-is for orchestrator scale-alignment decision.
- `--space-0` … `--space-24` (Falcon preset names) — different namespace from canonical `--spacing-*`. Numeric values match but namespace alias would need a renamer.
- admin-console: bespoke shades (lilac family, fractional shades like `--color-falcon-neutral-150`, `--color-falcon-green-25/75/100/150/200`, `--color-falcon-red-200`).
- admin-console: broken refs (`--tracking-brand-copy` → undeclared `--letter-spacing-3`; `--radius-form` → undeclared `--form-radius`).

**Constraint for future work:**
- ANY new theme value MUST be declared in `falcon-tailwind-tokens.css` with a palette-named token (Noor Cat E).
- ANY per-app `tailwind.css` change MUST alias via `var(--color-falcon-*)` — never shadow canonical names with different values.
- Noor Instructions skill now has a Cat I (Single-Source-of-Truth Theme Config) at `C:\falcon\brain-skills\Front-End-skills\noor-instructions-skill\resources\I-single-source-config.md` documenting the pattern as a permanent rule.
