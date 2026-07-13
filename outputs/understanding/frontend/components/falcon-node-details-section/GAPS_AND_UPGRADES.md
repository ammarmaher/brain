# falcon-node-details-section — GAPS AND UPGRADES

> NEW dossier (B26, 2026-06-03). Single-render pure-Angular shared-ui component — rubric dims **B (Stencil dual-render)** and **E (React/Vue parity)** are **N/A**. This is the AUDIT-in-prose for the component; the row-per-finding table is in `FINDINGS/B26.md`.

## Best-practice posture (POSITIVE)

`[CODE]` The component is **structurally exemplary modern Angular**: standalone (implicit), `OnPush` (ts:33), 3 signal inputs (`input.required` + 2 `input()`), 2 `contentChild()` slot signals, 2 `computed()`, `@if`/`@else if` (no `*ngIf`), zero subscriptions, zoneless-safe, no NgModule. Styling is **token-backed Tailwind utilities only** — no arbitrary `[...]` values, no raw hex/rgb/px, no inline `style=`. It is **house-rule clean on tokens-over-literals** and is the **highest-adoption** shared-ui component in the batch (26 sites). The gaps below are additive enhancements + two doc/dark-mode issues — not structural debt.

## Missing capabilities (active source verified)

### G1 — No spec coverage (P2)

`[CODE]` No `*.spec.ts` (Glob 2026-06-03). The avatar **3-tier precedence** (`avatarTemplate` → `imageUrl` → initials), `initial()` first-letter-uppercase-with-`'?'`-fallback (ts:60-63), `effectiveAlt()` `imageAlt ?? label` (ts:66), and the actions-slot presence `@if` are all trivially testable pure logic.

**Recommended fix:** add `falcon-node-details-section.component.spec.ts` covering each avatar branch, `initial()` for empty/whitespace/unicode labels, and `effectiveAlt()` fallback.

### G2 — No `size` / `variant` axis (P2)

`[CODE]` Fixed presentation — header padding `px-5 pt-5 pb-5`, label `text-sm font-semibold`, avatar `w-7`/`w-9`. A page that needs a compact or large header cannot adjust it.

**Recommended fix:** add `@Input() size: 'sm' | 'md' | 'lg'` mapping to padding/label/avatar utilities. Lower priority — all current consumers use the one size.

### G3 — Avatar-circle size mismatch between branches (P2)

`[CODE]` html:23 — the `<img>` avatar circle is `w-7 h-7` (28px); html:27 — the initials-chip circle is `w-9 h-9` (36px). The avatar **changes size depending on which fallback renders** (image vs initials), so a node with a logo and a node without one have visually different header heights/alignment.

**Recommended fix:** unify both branches to the same dimension (e.g. both `w-9 h-9` or both `w-7 h-7`, matching the projected `<app-org-node-avatar size="md">`). The component's own header comment says "28×28" for both (ts:7-8) but the initials branch is 36×36 — so the code drifted from its own doc.

### G4 — Stale "border-b divider" comment (P1 — doc accuracy)

`[CODE]` html:7-10 carries a Wave-19 comment: *"added `border-b border-falcon-neutral-150` to match source-of-truth horizontal divider line beneath the node-header strip."* But the live `<header>` class (html:11) is `flex items-center justify-between gap-4 flex-wrap px-5 pt-5 pb-5 bg-falcon-neutral-0` — **no `border-b`**. The divider was either removed later or pushed to the consumer. The comment now misleads a maintainer into thinking the strip draws its own divider.

**Recommended fix:** correct or delete the comment (and decide: either re-add `border-b` to the strip, or document that the divider is the consumer's responsibility). **Same class of finding as B25 `<falcon-org-node-header>` G4 (phantom-SCSS comment)** — a recurring "stale style-intent comment" pattern in this shared-ui folder.

### G5 — No dark-mode styling (P2)

`[CODE]` Zero `dark:` variants in the template. `bg-falcon-neutral-0` strip + `text-falcon-neutral-925` label + `bg-falcon-teal-700` initials are light-only → on a dark canvas the strip surface + label render light-on-light. (The projected `<app-org-node-avatar>` + `<falcon-angular-button>`s DO handle dark mode; the gap is the strip background + label.) **Same finding as B25 `<falcon-org-node-header>` G8.**

**Recommended fix:** add `dark:` variants (or fold the strip surface/label into a token contract — G6).

### G6 — No token contract / no style hook (P3)

`[CODE]` No `node-details-section.tokens.css` and no `wrapperClass`/`headerClass` input. A non-teal feature theme cannot recolour the initials chip or strip surface without editing the shared template. Low priority — the inline values ARE token-backed utilities; this only matters for per-instance theming.

**Recommended fix:** OPTIONAL — extract a `node-details-section.tokens.css` under `:where(falcon-node-details-section, …)` (gate-12) for surface/label/initials, OR add a `headerClass` input. Sibling `<falcon-resizable-split-pane>` already does the token-file approach if a precedent is wanted.

### G7 — `imageAlt` typed `string | null` but initials chip uses it as a required label (P3)

`[CODE]` `effectiveAlt()` (ts:66) collapses null to `label()`, so the chip always has a label — fine. But there is no way to supply a *different* accessible name for the initials chip vs the image; both use `effectiveAlt()`. Minor.

## Missing accessibility features

- **A1 (P2):** truncated label relies on `[title]` only (html:32) — `title` is not a robust AT label. Consider an `aria-label` mirror or a tooltip primitive. (Same as B25 `<falcon-org-node-header>` A1.)
- **A2 (P3):** the `<header>` element is unnamed (html:11) — no `aria-label`/`aria-labelledby`. A landmark `<header>` should be named. (Same as B25 A2.)
- **A3 (P3):** the `<img>` avatar circle wraps the `<img>` in a `<span>` with no `role` — the `<img alt>` carries the name, which is acceptable; no change strictly needed.

## Missing tests

- `[CODE]` No spec (G1). No coverage of avatar precedence / `initial()` / `effectiveAlt()` / slot presence.
- The two directives are trivial `TemplateRef` markers — testable only via the host's projection (covered by a host spec, if added).

## Missing Tailwind / token parity

- **N/A (dual-render parity)** — no Stencil twin, so no Shadow/`-tw` divergence to track.
- **N/A (React/Vue parity)** — no `libs/falcon-ui-react`/`vue` equivalent; this is an Angular-only shared-ui component.

## Performance risks

- `[CODE]` `OnPush` + signals + pure `computed()` — efficient. No subscriptions, no rAF, no timers. **No real risk.**

## Visual / interaction risks

- `[CODE]` The avatar size mismatch (G3) is the only visible-inconsistency risk — header height shifts between image-backed and initials-backed nodes.
- `[CODE]` Dark-mode washout (G5) on dark canvases.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G4 | Fix/delete stale `border-b` divider comment (decide divider ownership) | P1 (doc) |
| G1 | Add component spec | P2 |
| G3 | Unify avatar-circle size across image/initials branches | P2 |
| G5 | Add dark-mode variants | P2 |
| G2 | Add `size` axis | P2 |
| G6 | Token contract / `headerClass` hook | P3 |
| A1 | Robust label for truncated name | P2 |

## Recommended upgrade API (concrete)

```ts
// additive signal inputs
readonly size = input<'sm' | 'md' | 'lg'>('md');
readonly headerClass = input<string>('');     // extra host utilities (e.g. 'border-b border-falcon-neutral-150')
```

```html
<!-- unify avatar circle dims; add dark variants -->
<span class="grid place-items-center w-9 h-9 rounded-full ... bg-falcon-teal-700 dark:bg-falcon-teal-600 ...">
<header class="... bg-falcon-neutral-0 dark:bg-falcon-neutral-925 ...">
```

## Fix-shared-vs-per-page

All gaps belong in the **shared component**, not per-page. This strip is the single platform node-header (26 sites); per-page forks would re-fragment exactly what `<falcon-org-node-header>` → this migration consolidated.

## Workarounds (if upgrade blocked)

- For G4/divider today: add `border-b border-falcon-neutral-150` on the host `class=`.
- For G5/dark today: wrap in a page-level dark surface, or accept the light strip.
- For G2/size today: the strip is one fixed size — there is no workaround beyond host-class padding tweaks (which won't touch the label/avatar).

## Deep-Dive Sweep Findings (2026-06-03 — B26)

**Consumer count: 26 occurrences / 16 app HTML files + 0 in `libs/falcon`** (`[CODE]` grep `<falcon-node-details-section`). **Highest-adoption shared-ui component in the B25/B26 batches.**

- **Status confirmed ACTIVE/SHARED + supersessor.** This is the LIVE replacement for `<falcon-org-node-header>` + `<app-org-node-header>` (B25 deletion candidates, 0 consumers). The migration consolidated to THIS slot-driven strip.
- **No structural gaps** — best-practice posture is a PASS (signals, OnPush, `@if`, token-backed utilities, no raw values).
- **Recurring shared-ui pattern:** like B25 `<falcon-org-node-header>`, it has (a) a **stale style-intent comment** (G4 — phantom `border-b`) and (b) **no dark mode** (G5). These two are the most actionable.
- **All findings are `safe-local`** (doc / additive / dark-mode / spec). **0 HIGH-RISK-QUEUE.** No deletion/promotion flag — the component stays ACTIVE/SHARED.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B26) against all source layers (component + 2 directives + HTML). Posture PASS; G1-G7 + A1-A3 derived from live source. Supersession of `<falcon-org-node-header>` cross-referenced from B25 FINDINGS. No deletion/promotion flag — ACTIVE/SHARED.
