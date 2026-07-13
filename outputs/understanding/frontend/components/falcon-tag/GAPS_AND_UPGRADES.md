# falcon-tag — GAPS & UPGRADES

## Missing capabilities

### FT-01 — Dead-code `classes` computed in the Angular wrapper (CONFIRMED, P2)

- `[CODE]` falcon-tag.component.ts:61-99 — the wrapper has a `classes` computed signal + `_sizeClasses()` + `_severityClasses()` helpers generating hardcoded Tailwind classes (`bg-falcon-green-50 text-falcon-green-700`, `h-5 px-2.5 text-[11px]`, …). **CONFIRMED unused** — `falcon-tag.component.html` (29 ln) never references `classes()`; it delegates entirely to `<falcon-tag-tw>` / `<falcon-tag>`. Wave 9.E carry-over. **P2 — remove the dead computed + the two helper methods.**

### FT-07 — `-tw`/wrapper path hardcodes palette utilities, NOT tokens (NEW 2026-06-03, P2)

- `[CODE]` tag-tailwind-classes.ts:36-46 returns literal `bg-falcon-{family}-{shade} text-falcon-{family}-{shade}` strings; the Shadow CSS sets `--falcon-tag-bg`/`-fg` per-severity in `:host([severity])`. So `tag.tokens.css` carries **no per-severity color tokens**, and the default (Tailwind) render path **does not consume the tag token file for color at all** — a `--falcon-tag-bg` per-instance override only bites on `useTailwind=false`. **Token-parity gap** (status-badge's `-tw` helper, by contrast, DOES consume its tokens). **P2 — switch `tag-tailwind-classes.ts` to arbitrary-value token utilities (`bg-[color:var(--falcon-tag-bg)]`) and define per-severity tokens in `tag.tokens.css`**, mirroring status-badge. Until then, document that per-instance color overrides require the Shadow path.

### FT-04 — `'warn'` legacy alias (P3)

- `[CODE]` `FalconTagSeverity` includes both `'warning'` and `'warn'` (falcon-tag.types.ts:6). **Both DO render identically** — verified: falcon-tag.css:58-59 (`:host([severity='warning']), :host([severity='warn'])`) and tag-tailwind-classes.ts:41-42 (`case 'warning': case 'warn':`) both map to the amber bucket. **P3 — deprecate `'warn'` with a TS `@deprecated` tag; keep the dual-map so old consumers don't break.**

### FT-03 — Dismiss button has literal styling, no tokens / hover affordance (P2)

- `[CODE]` falcon-tag.css:73-93 hardcodes the ✕ button (`width: 14px`, `opacity: 0.6`, `background: rgb(0 0 0 / 0.08)` on hover); falcon-tag-tw.tsx:55 uses a literal Tailwind string. There are NO `--falcon-tag-dismiss-*` tokens. **P2 — mint dismiss-button tokens (size, color, hover-bg, focus-ring) and consume them in both paths.** No focus-ring exists on the ✕ today.

### FT-02 — Hardcoded English `aria-label="Remove"` (P2)

- `[CODE]` falcon-tag.tsx:76 / falcon-tag-tw.tsx:56 — the dismiss `<button>` `aria-label` is hardcoded `"Remove"`. For an Arabic / RTL UI this is an i18n gap. **P2 — add a `[dismissAriaLabel]` input on the wrapper + a `dismissAriaLabel` Stencil prop.** (The chip text itself must still be translated by the consumer before being passed to `[value]`.)

### FT-06 — No `col.type='tag'` table shorthand (P2)

- A `col.type='tag'` on `FalconTableColumn` could auto-render an array of tags per cell (the contact-groups sharedWith pattern is hand-rolled today). **P2 — same family as status-badge FSB-02.**

### FT-05 — No `<falcon-tag-list>` orchestrator (P3)

- `<falcon-tag>` is `inline-flex` content-shaped; multi-tag wrap + gap + `+N` overflow is the consumer's job (`<div class="flex flex-wrap gap-1">`, as in contact-groups-list). **P3 — could ship a list wrapper handling wrap + gap + overflow.**

### Tests

- `[CODE]` **No `.spec.ts` for any layer** (Shadow / `-tw` / wrapper) — verified by listing the source folders. **P3** — pure presentational, but a dismiss-event + severity-map spec would be cheap insurance.

## Reusable upgrades needed

| ID | Title | Priority |
|---|---|---|
| FT-01 | Remove dead-code `classes` computed in wrapper | **P2** |
| FT-07 | Make `-tw` path consume `--falcon-tag-*` tokens (parity w/ status-badge) | **P2** |
| FT-02 | Add `[dismissAriaLabel]` for i18n | **P2** |
| FT-03 | Dismiss button tokens + focus ring | **P2** |
| FT-06 | Typed `col.type='tag'` integration | **P2** |
| FT-04 | Deprecate `'warn'` severity | **P3** |
| FT-05 | `<falcon-tag-list>` orchestrator | **P3** |

## Workarounds available

- For tag overflow / wrapping: `<div class="flex flex-wrap gap-1">` (contact-groups-list pattern).
- For i18n dismiss label: drop to the Stencil tag and bind `aria-label="…"`.
- For per-instance color override on the default path: switch to `useTailwind=false` (Shadow) so `--falcon-tag-*` tokens apply (FT-07).

## Visual / interaction risks

- `[CODE]` Severity buckets share the `<falcon-badge>` palette (info=blue, success=green, …). Don't mix `<falcon-badge variant="info">` and `<falcon-tag severity="info">` on the same row — visually identical, semantically different.
- The ✕ button has no focus ring (FT-03) — keyboard focus is invisible.

## Future-proof recommendation

Clean up the dead `classes` computed (FT-01) and align the `-tw` path with tokens (FT-07) so the tag matches the status-badge token discipline. Add i18n + dismiss-token affordances. Then promote `<falcon-angular-tag>` as the canonical chip primitive across multi-select and filter UIs.

## Wave 7 Findings (2026-05-17)

**Consumer count: 2** ([CODE] grep `<falcon-angular-tag>` across `apps/` + `libs/falcon/`).

## Deep-Dive Sweep Findings (2026-06-03 — B10)

**Consumer count: 9 app files / 18 occurrences + 0 in `libs/falcon`** ([CODE] grep `falcon-angular-tag`).

Drift corrected vs prior dossier (no deletion/promotion flags; component stays ACTIVE):
- **Adoption corrected** — prior "no consumers found / Wave-7 2" is stale; now 9 app files / 18 (contact-groups sharedWith chips, both consoles).
- **FT-01 CONFIRMED** — the wrapper `classes` computed is genuinely dead (template never binds it).
- **FT-07 NEW** — the `-tw`/wrapper path hardcodes `bg-falcon-*` palette utilities; `tag.tokens.css` has NO per-severity color tokens (prior TOKENS.md "bg+fg per severity" was wrong); only the Shadow path consumes `--falcon-tag-*` for color.
- **FT-04 verified** — `'warn'` IS dual-mapped to amber in both render paths.
- **TOKENS recount** — 51 lines, 3 categories (not 5; no DISMISS/per-severity categories).
- **No new structural gaps.** All findings are `safe-local` (doc) — see FINDINGS/B10.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B10) against all source layers. FT-01 dead code CONFIRMED; FT-07 token-parity gap NEW (verified in tag-tailwind-classes.ts + tag.tokens.css); FT-02/FT-03/FT-04 confirmed; no spec for any layer. No deletion/promotion flags — component stays ACTIVE.
