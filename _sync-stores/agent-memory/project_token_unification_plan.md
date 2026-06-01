---
name: Token Unification Plan (in progress)
description: Active migration to unify all Falcon CSS tokens to Noor's `falcon-{family}-{shade}` palette naming. SSOT is `libs/falcon/src/theme/falcon.theme.css`. New session picks this up to execute end-to-end.
type: project
originSessionId: 224f63c4-e0be-4d17-afda-ccf23b10a9d6
---
# Falcon CSS Token Unification — Execution Brief

**Why:** The user (Ammar Mk) requested unifying all duplicate/multi-named CSS tokens to Noor Category E naming convention (`falcon-{family}-{shade}`). The SSOT file has many tokens with same value but different names — this collapses them.

**Why:** User explicitly authorized overriding Noor E.3 (forward-only) for this one-off cleanup. Take the time to do it perfectly.

**How to apply:** Run end-to-end. No checkpoints — push through all phases. Build-verify after each phase. Use Noor Cat E naming throughout.

## SSOT
`libs/falcon/src/theme/falcon.theme.css`

## Noor naming convention
Approved palette families: `falcon-{teal,neutral,green,red,amber,blue}-{50…900}`
See [E-color-naming.md](C:/falcon/brain-skills/Front-End-skills/noor-instructions-skill/resources/E-color-naming.md) for details.

## Scope (counted on 2026-05-06)
- **0 usages**: `--color-st-*` (24 tokens), `--color-palette-*` (9) — pure dead code, safe DELETE
- **320 usages**: short aliases (`--color-bg-*`, `--color-text-*`, `--color-border-*`, `--color-teal-*`, `--color-status-*`)
- **94 Tailwind class + 19 var**: `falcon-{primary,text,surface,border}-*`
- **130 usages**: `--color-{success,danger,warning,info,primary}`
- **39 usages**: raw hex literals in arbitrary Tailwind classes (`bg-[#0d3f44]`)
- **85 usages**: `--space-*` legacy (need migration to `--spacing-*`)
- **Total: ~700 edits across ~37 files**

## User's decisions (PRE-APPROVED — don't re-ask)
| Question | Decision |
|---|---|
| `--color-info: #0ea5e9` | Delete (no callers) |
| `--color-falcon-grey-50: #e7eaee` | Add as `--color-falcon-neutral-175` (new shade) |
| `--color-falcon-popover-dark: #3b4752` | Keep as-is (single-purpose) |
| `--color-falcon-cyan: #2dd4d9` | Keep as-is (one-off) |
| `--color-falcon-surface-input: #f7f7f7` + `surface-applications: #f5f5f5` | Fold both to nearest = `--color-falcon-neutral-50` |
| `--color-falcon-orgchart-line: rgba(124,130,169,0.5)` | Keep as-is (single-purpose alpha) |
| Phase 7 raw hex → named class (39 cases) | YES — replace in same pass |

## Migration mapping (canonical → aliases to delete)

### Teal
- `--color-falcon-teal-100` ⇐ `--color-st-teal-light`, `--color-teal-light`, `--color-falcon-primary-soft`
- `--color-falcon-teal-400` ⇐ `--color-palette-primary-500`
- `--color-falcon-teal-500` ⇐ `--color-st-teal-hover`, `--color-teal-hover`, `--color-palette-primary-800` (1-hex-off; fold)
- `--color-falcon-teal-700` ⇐ `--color-st-teal`, `--color-teal`, `--color-falcon-primary`, `--color-primary`, `--color-palette-primary-900`
- `--color-falcon-teal-800` ⇐ `--color-st-teal-dark`, `--color-teal-dark`, `--color-falcon-primary-hover`, `--color-primary-hover`
- `--color-falcon-teal-900` ⇐ `--color-st-teal-deep`, `--color-teal-deep`, `--color-falcon-primary-deep`
- `--color-falcon-teal-tint` ⇐ `--color-falcon-primary-tint`

### Neutral
- `-0` ⇐ `--color-st-bg`, `--color-bg`, `--color-falcon-surface`, `--color-surface`, `--color-falcon-text-inverse`, `--color-text-inverse`, `--color-falcon-primary-contrast`, `--color-primary-contrast`, `--color-palette-neutral-50`
- `-25` ⇐ `--color-falcon-surface-row`
- `-30` ⇐ `--color-st-bg-panel`, `--color-bg-panel`
- `-50` ⇐ `--color-st-bg-hover`, `--color-bg-hover`, `--color-surface-alt`, `--color-falcon-surface-hover`, `--color-falcon-surface-input` (#f7f7f7 fold), `--color-falcon-surface-applications` (#f5f5f5 fold)
- `-75` ⇐ `--color-st-bg-page`, `--color-bg-page`, `--color-falcon-surface-page`
- `-100` ⇐ `--color-falcon-table-divider`, `--color-palette-neutral-100`
- `-150` ⇐ `--color-st-border-2`, `--color-border-2`, `--color-falcon-border-soft`
- `-175` ← NEW (#e7eaee, replaces `--color-falcon-grey-50`)
- `-200` ⇐ `--color-st-border`, `--color-border`, `--color-falcon-border`, `--color-palette-neutral-200`
- `-300` ⇐ `--color-falcon-border-input`
- `-400` ⇐ `--color-falcon-border-checkbox`
- `-450` ⇐ `--color-falcon-border-radio`
- `-500` ⇐ `--color-st-text-faint`, `--color-text-faint`, `--color-falcon-text-faint`, `--color-palette-neutral-500`
- `-600` ⇐ `--color-st-text-muted`, `--color-text-muted`, `--color-falcon-text-muted`
- `-700` ⇐ `--color-falcon-grey-700`
- `-800` ⇐ `--color-st-text-2`, `--color-text-2`, `--color-falcon-text-secondary`
- `-900` ⇐ `--color-st-text`, `--color-text`, `--color-falcon-text`, `--color-palette-neutral-900`

### Status
- `--color-falcon-green-50` ⇐ `--color-st-green-bg`, `--color-status-green-bg`
- `--color-falcon-green-500` ⇐ `--color-st-green`, `--color-status-green`, `--color-success`
- `--color-falcon-green-700` ⇐ `--color-st-green-text`
- `--color-falcon-red-100` ⇐ `--color-st-red-bg`, `--color-status-red-bg`
- `--color-falcon-red-500` ⇐ `--color-st-red`, `--color-status-red`, `--color-danger`
- `--color-falcon-red-700` ⇐ `--color-st-red-text`
- `--color-falcon-amber-50` ⇐ `--color-st-orange-bg`, `--color-status-orange-bg`
- `--color-falcon-amber-500` ⇐ `--color-st-orange`, `--color-status-orange`, `--color-warning`
- `--color-falcon-amber-700` ⇐ `--color-st-orange-text`

### Spacing
- `--spacing-{0…12,px,0.5,1.5,2.5,3.5,14,16,20,24}` ⇐ `--space-{same indices}`

### Other
- `--color-info: #0ea5e9` → DELETE entirely (no callers)
- Brand identity tokens (`--color-falcon-brand-aramco*`, `-bmw`, `-rajhi`, `-snb`, `-bupa*`) → KEEP (identity, not palette)

## Execution phases (run in order, build-verify after each)

1. **Phase 1 — Delete dead legacy** (`--color-st-*`, `--color-palette-*`); fix 1+2 utility class consumers
2. **Phase 2 — Spacing migration**: 85 usages of `var(--space-N)` → `var(--spacing-N)`; delete `--space-*` defs
3. **Phase 3 — Short-alias migration**: 320 var() usages of `--color-{bg,text,border,teal,status}-*` → palette canonical
4. **Phase 4 — Semantic Tailwind classes**: 94 usages of `bg-falcon-primary` etc. → `bg-falcon-teal-700` etc.
5. **Phase 5 — Status semantic migration**: 130 usages of `--color-{success,danger,warning}` → palette
6. **Phase 6 — Theme file cleanup**: Delete all migrated alias definitions from `falcon.theme.css`. Add `--color-falcon-neutral-175: #e7eaee`. Delete `--color-info`. File should shrink ~150 lines.
7. **Phase 7 — Raw-hex → named utilities**: 39 usages of `bg-[#0d3f44]` etc. → `bg-falcon-teal-700` etc.
8. **Phase 8 — Final audit**: grep for any leftover `--color-st-`, `--color-palette-`, `--color-bg`, `--color-text-2`, `--color-teal-`, `--color-status-`, `--color-success`, `--color-danger`, `--color-warning`, `--color-info`, `--color-primary`, `--color-falcon-primary`, `--color-falcon-text`, `--color-falcon-surface`, `--color-falcon-border-soft`, `--color-falcon-grey`, `--space-` → should ALL return 0 hits. Final `nx build admin-console`.

## Standing rules to honor (from MEMORY.md)
- No commit / push without explicit "commit" / "push" in the user's CURRENT message
- No dev-serve / preview during implementation; build verify only
- Tailwind first, SCSS only when Tailwind can't reach
- Token-clean values — palette over intent
- Build with zero errors before reporting done

## Status
- Plan drafted: 2026-05-06
- Awaiting new session to execute Phase 1
- When new session reads this memory: confirm plan still matches current SSOT file state, then start Phase 1 immediately. No re-asking the user.
