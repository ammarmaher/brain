# falcon-status-chip — DECISION

## Brain SK final recommendation

**STATUS: READY — for the message-Templates domain only.** Use `<falcon-status-chip>` for template lifecycle + maker/checker status indicators. It is production-quality for that scope. **Do NOT treat it as the platform-wide status component** (its header comment over-claims — G1); for account/user lifecycle statuses use `<falcon-angular-status-badge>`, for generic severity tags use `<falcon-angular-tag>`.

## Use this component for

- Message-template lifecycle status pills (`approved` / `pending` / `review` / `rejected` / `deleted` / `none`) — `variant="filled"`.
- Compact maker/checker verdict text under a name in dense tables — `variant="text"` + `[showDot]="false"`.
- A status read-out inside a `<falcon-angular-data-table>` cell where the value is one of the six templates statuses.

## Avoid this component for

- Account / user lifecycle status (`active` / `suspended` / `locked` / `inactive` / `paid` / `expired` / `disabled`) → `<falcon-angular-status-badge>` (`@falcon/ui-core`).
- Generic severity tag / dismissible chip → `<falcon-angular-tag>`.
- Numeric count / icon dot badge → `<falcon-badge>` / `<falcon-card-status>`.
- Anything needing an `lg` size or a leading glyph today → status-badge (`lg`) / tag (`icon`).

## Preferred variant / render path

**Single render path** — there is no `useTailwind` switch (no Stencil twin). Pick the **visual variant**:
- `variant="filled"` (default) — the tinted pill, for primary status columns + info cards.
- `variant="text"` — bare italic, for dense secondary sub-lines (use `[showDot]="false"`).

## Required upgrades before wider use

None for its current templates scope. Before any **platform-wide** adoption, resolve **G1** (the overlap with `<falcon-status-badge>`) — either re-scope the comment, document the split, or converge the two components. The other gaps (sizes/icon/token/a11y/tests) are improvements, not blockers.

## Relationship to other components

- **Sibling (overlapping intent):** `<falcon-angular-status-badge>` (`@falcon/ui-core`, Stencil dual-render, 9-severity account/user set + sm/md/lg + token file + React/Vue wrappers). The chip and the badge are NOT a true duplicate but DO overlap (G1).
- **Sibling (different axis):** `<falcon-angular-tag>` (`@falcon/ui-core`, generic severity + optional icon + dismissible).
- **Usual host:** `<falcon-angular-data-table>` — the chip is projected into a `falconDataTableCell` `<ng-template>`.
- **No composition** — the chip composes nothing and is composed by nothing; it is a leaf.

## Exact rule for future implementation tasks

1. **Status indicator needed?** First identify the **status vocabulary**.
2. **Message-template status** (approved/pending/in-review/rejected/deleted/N-A)? → `<falcon-status-chip>`, `variant="filled"` (or `variant="text"` for a sub-line).
3. **Account/user lifecycle status**? → `<falcon-angular-status-badge>` — NOT this chip.
4. **Generic severity / dismissible**? → `<falcon-angular-tag>`.
5. **Map your backend value into the strict `FalconStatusChipStatus` union at the boundary** (unknown → `'none'`). Never pass a free string.
6. **Override the word with `[labelKey]`** (an i18n key) when the default label is wrong; keep the right color bucket.
7. **All labels are i18n keys** — add to `en.json` + `ar.json`.
8. **Do not recolor per-page** (no token override) and **do not hand-roll a parallel pill** — extend `STATUS_TOKENS` (shared) if a new status is genuinely needed.

---

## Dynamic capability assessment

### 1. What is static today?
- The color↔status mapping (`STATUS_TOKENS` — green/amber/red/neutral per status).
- The two-variant template (filled pill / italic text) — no third visual mode.
- Sizes limited to `sm`/`md` (no `lg`).
- The `text`-variant dot size (fixed `w-1.5 h-1.5`, ignores `size`).
- No icon, no token file, no per-instance color override.
- Required-status (no safe default).

### 2. What is already dynamic through inputs/outputs?
- `[CODE]` **5 signal `input()`s:** `status` (required), `variant`, `showDot`, `size`, `labelKey`.
- **0 `output()`s** — display-only, no click/dismiss/change.
- Everything visual derives from `status()` + `size()` via 4 `computed()`s.

### 3. What is already dynamic through slots / ng-template?
- **Nothing** — no `<ng-content>`, no `ng-template` input. The label is prop-driven.

### 4. What is dynamic through token/theme overrides?
- Only indirectly: the `bg-falcon-*` / `text-falcon-*` utilities follow the global `--color-falcon-*` palette (so a theme palette change ripples through). There is **no per-component token namespace** and **no per-instance override** (G2). Dark mode is inherited from the palette, with no dark-surface flip (G-DARK-1).

### 5. What is dynamic through Tailwind classes?
- Host `class=` flows to the host `inline-flex` element (layout/alignment only). It does NOT reach the inner pill `<span>` — you cannot recolor via host utilities.

### 6. What is missing to make this component reusable across pages?
- A clear scope decision vs `<falcon-status-badge>` (G1) — today it is templates-only despite the "platform" comment.
- `lg` size (G3); leading `icon` (G6); size-aware text dot (G4); optional per-instance color/token (G2); status semantics for a11y (A1); a component spec (G-TEST).

### 7. What capability should be added to shared component (not page hack)?
- The G1 scope resolution (re-scope comment, document split, or converge into status-badge) — a library-architecture decision.
- `lg` + `icon` + a11y role — all belong in the shared chip, never re-implemented per page.

### 8. What flags / options / templates / slots would make it better?
- `@Input() icon?: string` (Falcon icon-font glyph) — G6.
- `size` extended to include `'lg'` — G3.
- `role="status"` / `aria-label` on the host + `aria-hidden` on the dot — A1/A2.
- (Optional) a `--falcon-status-chip-*` token contract IF per-page theming is ever required — G2.

### 9. What is the safest upgrade path?
1. **Phase A (safe-local, zero risk):** re-scope the header comment to "templates-domain status" (kills the G1 over-claim); add `role`/`aria-label` + `aria-hidden` dot (A1/A2); add a component spec (G-TEST); make the `text` dot size-aware (G4). All non-breaking.
2. **Phase B (additive):** add `'lg'` size (G3) + optional `icon` input (G6) + (if needed) a token contract (G2). Non-breaking.
3. **Phase C (architecture, HIGH-RISK-QUEUE):** decide G1 convergence — fold the six templates statuses into `<falcon-status-badge>` and retire the chip, migrating both consoles' Templates pages. Public-surface + multi-page change — human-approved only.

### 10. What is risky to change because other pages depend on it?
- The `FalconStatusChipStatus` union — both consoles' Templates pages + `template.model.ts` type-reference it; removing/renaming a value breaks compilation.
- The color↔status mapping — a recolor changes every Templates list/details across both consoles.
- The default `variant='filled'` + default `showDot=true` — flipping a default silently changes existing cells.
- The i18n keys (`templates.status.*`) — anything keyed off the default labels depends on them.
- Any G1 convergence — retiring the chip is a breaking, multi-page refactor (HIGH-RISK-QUEUE).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24). Recommendation = READY (templates-scoped). The 5-input / 0-output / single-render / no-token / templates-vocabulary facts are all source-confirmed (`falcon-status-chip.component.ts` + `<falcon-status-badge>` type file + `@falcon` barrel). G1 (overlap, NOT a true duplicate) is the load-bearing decision and is queued for human triage (convergence = HIGH-RISK; comment re-scope = safe-local).
