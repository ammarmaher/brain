*** Architecture Rule Set — Forbidden Patterns ***
*** SoT: Brain Outputs/understanding/frontend/architecture/FORBIDDEN_PATTERNS_OBSERVED.md ***
*** Indexed 2026-05-15 by Brain SK Phase 3F ***

# Forbidden Patterns

> Live grep audit of every active prohibition across `apps/**`. PrimeNG / PrimeIcons / `*ngIf` / Zitadel-direct — all 0 matches. Active violations: 1 inline `style="..."`, ~19 Tailwind arbitrary `bg-[#hex]`/`text-[#hex]`/`border-[#hex]`, ~24 Tailwind arbitrary `rounded-[Npx]`. The 50+ arbitrary Tailwind classes are the single biggest forward-looking cleanup task.

## Source-of-truth file
- [FORBIDDEN_PATTERNS_OBSERVED](../../outputs/understanding/frontend/architecture/FORBIDDEN_PATTERNS_OBSERVED.md)

## Key rules extracted

| Rule id | Rule (one-line) | Severity | Cited file/line |
|---|---|---|---|
| AR-forbid-01 | `*ngIf` / `*ngFor` / `*ngSwitch` legacy control flow is FORBIDDEN — use `@if / @for / @switch`. 0 matches verified. | high | grep |
| AR-forbid-02 | `from 'primeng/...'` imports are FORBIDDEN — ESLint flat-block in `eslint.config.mjs:26` live-fires. 0 matches in apps + libs source. | high | ESLint |
| AR-forbid-03 | `pi pi-*` PrimeIcons class strings are FORBIDDEN — replaced by vendored Falcon icon font. 0 matches in apps source. | high | grep |
| AR-forbid-04 | Inline `style="..."` attributes in `*.html` are FORBIDDEN — 1 current violation at `applications-table.component.html:43` (P3 priority). | high | grep |
| AR-forbid-05 | Tailwind arbitrary `bg-[#hex]` / `text-[#hex]` / `border-[#hex]` are FORBIDDEN — tokens only. 3+7+9 violations concentrated in `organization-hierarchy-page-menu.component.html`. | **P1** | grep |
| AR-forbid-06 | Tailwind arbitrary `rounded-[Npx]` / `w-[Npx]` / `h-[Npx]` / `gap-[Npx]` are FORBIDDEN — use token classes. 24 matches in 12 files. | **P1** | grep |
| AR-forbid-07 | `var(--foo, #hex)` fallback hex in templates is FORBIDDEN — fallback MUST also be a token (e.g. `var(--falcon-border-2, var(--color-falcon-neutral-150))`). | medium | grep |
| AR-forbid-08 | SCSS files with declared rules in feature folders are FORBIDDEN (P2) — `*.component.scss` should be empty placeholders only. Legacy violations exist in `add-client-wizard.component.scss` + `client-settings-step.component.scss`. | medium | grep |
| AR-forbid-09 | Direct Zitadel calls (`zitadel.com` substring) are FORBIDDEN — 0 matches verified; all auth goes through `Gateway.IdentityGateway`. | high | grep |
| AR-forbid-10 | Component CSS files in `libs/falcon-ui-core/src/angular-wrapper/components/<name>/*.css` MUST be empty placeholders — they exist because Angular requires `styleUrl` but contain zero rules. | medium | sampled |

## Token replacement reference
- `#f5f6f7` → `bg-falcon-neutral-75`
- `#eef0f2` → `border-falcon-neutral-150`
- `#1a1a1a` → `text-falcon-neutral-900`
- `#6b7280` → `text-falcon-neutral-600`
- `#0d3f44` → `border-falcon-teal-700`
- `14px` rounded → `rounded-md` or dedicated token

## Recommended gate extensions
1. `gate-13-arbitrary-tailwind-lint.mjs` — fail on `bg-\[#`, `text-\[#`, `border-\[#`, `rounded-\[\d`, `w-\[\d+px`, `h-\[\d+px`, `gap-\[\d+px` in `apps/**/*.html`.
2. `gate-14-inline-style-lint.mjs` — fail on `style="..."` in `*.html` (except whitelisted SVG).
3. `gate-15-control-flow-lint.mjs` — fail on `*ngIf` / `*ngFor` / `*ngSwitch` regression.
4. `gate-16-zitadel-direct.mjs` — fail on `zitadel.com` substring in `apps/**` + `libs/**`.

## Total active violations summary
| Category | Count | Priority |
|---|---|---|
| Inline `style="..."` | 1 | P3 |
| Tailwind arbitrary `[#hex]` | 19+ | P1 |
| Tailwind arbitrary `[Npx]` | 24+ | P1 |
| `var(--foo, #hex)` fallback hex | 2+ | P2 |
| `*.component.scss` with rules | 2-5 | P2 |

## Related component notes
- [[Falcon Data Table]] · [[Falcon Drawer]] — used inside files containing hex/px arbitrary violations.

## Hubs
- [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
