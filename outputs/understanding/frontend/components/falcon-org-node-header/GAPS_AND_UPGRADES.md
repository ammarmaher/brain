# falcon-org-node-header — GAPS AND UPGRADES

## Missing capabilities (active source verified)

### G1 — UNUSED / SUPERSEDED + name-collision duplicate (P1 — deletion candidate)

`[CODE]` The shared-ui `falcon-org-node-header` has **0 live render consumers** (grep `<falcon-org-node-header[\s>]` → only docs + own source). The org-hierarchy header was migrated to `<falcon-node-details-section>` (`[CODE]` org-hierarchy-page-menu.component.ts:61-62 "FalconOrgNodeHeaderComponent removed — replaced by the new shared `<app-org-node-details-section>` + projected `<falcon-angular-button>` slot"; html:151-270). Worse, an **app-level twin** with the **same class name** `FalconOrgNodeHeaderComponent` (selector `app-org-node-header`) exists under `apps/{admin,management}-console/.../hierarchy-tab/falcon-org-node-header/` — also 0 consumers. So there are **three** node-header artifacts: 1 shared orphan + 2 app-level orphan twins + the live `<falcon-node-details-section>`.

**Impact:** dead code on the `@falcon` public surface, a confusing name collision (two `FalconOrgNodeHeaderComponent` classes), and a maintenance trap (which one do I edit?).

**Recommended fix (P1, `safe-local`):** **DELETE** the shared-ui `falcon-org-node-header` AND the two app-level twins after confirming the supersession (the comments already confirm it). Remove the `shared-ui/index.ts:176-178` re-export. This is a deletion of confirmed-dead code; it is `safe-local` (no consumer to break) but should be human-approved as a deliberate removal.

### G2 — No tests (P2, moot if deleted)

`[CODE]` No `falcon-org-node-header.component.spec.ts` (folder has only `.ts`/`.html`/`index.ts`). If the component is kept (not deleted per G1), it needs a spec covering: avatar branch selection (image vs root-brand vs initials), `initials()` derivation, each `can*` gate hiding/showing its button, the `infoOpen` label/style flip, `useCustomActions` suppressing the built-in row, and all 5 output emissions. If deleted, this is moot.

### G3 — Inlined brand SVG instead of `<falcon-brand-logo>` (P2)

`[CODE]` html:11-13 inlines the full Falcon brand-mark `<path d="...">` verbatim. The **app-level twin** does the right thing — it imports `FalconBrandLogoComponent` (`[CODE]` apps/.../falcon-org-node-header.component.ts:8) and renders `<falcon-brand-logo>`. The shared one duplicates the brand markup, which drifts if the brand mark changes.

**Recommended fix (P2):** if kept, replace the inline SVG with `<falcon-brand-logo>` (matching the app twin). Folds away if G1 deletes the component.

### G4 — Stale/false "SCSS handles button skin" comment (P2 — house-rule/doc)

`[CODE]` html:1 — *"Layout is pure Tailwind; SCSS handles button skin."* There is **no SCSS/CSS file**; the button skin is inline Tailwind. The comment is factually wrong and misleads a maintainer into looking for a stylesheet that doesn't exist. Comment-governance defect.

**Recommended fix (P2, `safe-local`):** correct the comment to "all styling is inline Tailwind; no SCSS" (or delete it). Trivial, safe.

### G5 — Arbitrary px values instead of tokens (P2 — house-rule)

`[CODE]` `h-[38px]` (every button), `text-[13px]` (every label), `rounded-[10px]` (button radius), `text-[15px]` (node name, html:21), `duration-[120ms]` (transitions) — all arbitrary literals, deviating from the Falcon token utilities (`text-sm`/`text-xs`, `rounded-md`, etc.) used across the library. Violates tokens-over-literals.

**Recommended fix (P2):** map to the nearest Falcon tokens / a `--falcon-org-node-header-*` token contract. Folds away if G1 deletes the component.

### G6 — Native `<button>` instead of `<falcon-angular-button>` (P2 — house-rule)

`[CODE]` The action buttons are raw `<button>` elements (html:37/45/53/61/70/86). The **app-level twin** uses `<falcon-angular-button>` (`[CODE]` apps/.../falcon-org-node-header.component.ts:5/14), and the live supersessor projects `<falcon-angular-button>`s. The shared one violates the Falcon-components-over-native house rule and re-implements button skinning by hand.

**Recommended fix (P2):** if kept, swap to `<falcon-angular-button>` (variant primary/secondary, `[loading]`/`[disabled]` available). Folds away if G1 deletes.

### G7 — No token contract / no style hook (P3, moot if deleted)

`[CODE]` No `--falcon-org-node-header-*` tokens, no `wrapperClass`/`buttonClass` inputs. No customization path. Same shape as falcon-view-toggle G6.

### G8 — No dark-mode styling (P2)

`[CODE]` The template has **zero `dark:` classes** (TOKENS). On a dark canvas the white/neutral buttons + node name would be illegible (light-on-light). The app-level twin should be checked for the same gap. (Severity reduced only because the component is unused.)

**Recommended fix (P2):** add `dark:` variants (or fold colors into a token contract that dark mode flips). Folds away if G1 deletes.

### G9 — Actions can only be hidden, not disabled (P3)

`[CODE]` No `disabled` axis on any button. A parent can `can*=false` (hide) but cannot render a visible-but-disabled action — so "you could do this but not right now" PES semantics aren't supportable. The supersessor's projected `<falcon-angular-button [disabled]>` supports this.

## Missing accessibility features

- **A1 (P3):** node-name `<span>` is `truncate` + `[title]` (html:21) — `title` is a hover tooltip, not a robust programmatic label when the name is clipped; AT may read a truncated name.
- **A2 (P3):** the `<header>` has no `aria-label`/`aria-labelledby` to name the region.
- **A3 (P3):** the Information toggle changes its label text on open (Information ⇄ Back to Users) but exposes no `aria-expanded`/`aria-pressed` — the open/closed state is implicit in the label only.
- **A4 (P3):** initials avatar `<span>` has no `role="img"`/`aria-label`; AT reads the raw initials.

## Missing tests

- `[CODE]` No spec (G2). Moot if the component is deleted (G1).

## Missing Tailwind / token parity

- `[CODE]` No token file (G7); no dark mode (G8); arbitrary px (G5). No Stencil twin to keep in parity — the "parity" issue is vs the tokenized rest of the library AND vs the app-level twin (which diverges: uses `<falcon-angular-button>` + `<falcon-brand-logo>` and lacks `useCustomActions`).

## Performance risks

- `[CODE]` `initials()` is a cheap `computed()`; the template is static markup with `@if` gates. **No real risk.**

## Visual / interaction risks

- `[CODE]` **Dark mode** (G8) — the dominant visual risk if adopted.
- `[CODE]` `useCustomActions` is all-or-nothing (html:32-34) — no partial custom/built-in mix.
- `[CODE]` Name-collision (G1) — a maintainer may edit the wrong twin and see no effect.

## Recommended upgrade priority

| ID | Title | Priority |
|---|---|---|
| G1 | DELETE shared orphan + 2 app twins (superseded by node-details-section) | P1 |
| G4 | Fix stale "SCSS handles button skin" comment | P2 (do regardless) |
| G8 | Dark-mode styling (only if kept) | P2 |
| G6 | Use `<falcon-angular-button>` (only if kept) | P2 |
| G3 | Use `<falcon-brand-logo>` (only if kept) | P2 |
| G5 | Tokenize arbitrary px (only if kept) | P2 |
| A1-A4 | a11y refinements (only if kept) | P3 |

## Recommended path (concrete)

**Preferred:** execute G1 — delete the shared `falcon-org-node-header`, delete both app-level twins, drop the `shared-ui/index.ts:176-178` re-export, and standardize on `<falcon-node-details-section>` (the supersessor) for all org-node headers. This collapses three dead artifacts and the name collision in one move.

**If a future requirement resurrects it instead:** apply G3 (brand-logo), G6 (falcon-button), G5 (tokens), G8 (dark), G4 (comment) and a spec (G2) — at which point it would essentially converge with either the app twin or node-details-section, reinforcing that deletion is the cleaner answer.

## Fix-shared-vs-per-page

The deletion (G1) is a **shared-library** decision — it affects the `@falcon` public surface and the two app twins. Do not "fix" by re-adopting it in a feature; the team already chose `<falcon-node-details-section>`.

## Workarounds (if upgrade blocked)

- Nothing to work around — the component is unused. Use `<falcon-node-details-section>` for any org-node header need today.

## Deep-Dive Sweep Findings (2026-06-03 — B25)

**Consumer count: 0 live render sites** for both `<falcon-org-node-header>` and the app-level twin `<app-org-node-header>` (`[CODE]` grep; matches are docs + supersession comments only). Live header = `<falcon-node-details-section>`.

- **NEW dossier** — created from scratch.
- **DELETION FLAG (G1):** the shared component is a **superseded orphan** + **name-collision duplicate** of two app-level twins. Strong deletion candidate. Flagged `safe-local` (no live consumer) but listed for human approval as a deliberate removal of public-surface code.
- **House-rule deviations:** stale "SCSS handles button skin" comment (G4), arbitrary px (G5), native `<button>` vs `<falcon-angular-button>` (G6), inlined brand SVG vs `<falcon-brand-logo>` (G3), no dark mode (G8). All `safe-local`.
- **No HIGH-RISK items** — see FINDINGS/B25.md.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25) against falcon-org-node-header.component.ts (41 ln) + .html (95 ln) + the app-level twin + the live `<falcon-node-details-section>` usage. Primary finding: UNUSED/superseded + name collision (G1, deletion candidate). Secondary: stale SCSS comment (G4), no dark mode (G8), native buttons (G6), inlined brand SVG (G3), arbitrary px (G5). All `safe-local`.
