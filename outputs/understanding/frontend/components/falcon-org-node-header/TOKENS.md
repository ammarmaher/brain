# falcon-org-node-header — TOKENS

## Component token file

`[CODE]` **NONE.** There is no `libs/falcon-ui-tokens/src/components/org-node-header.tokens.css` and no per-component CSS file. This is a single-render pure-Angular shared-ui component styled entirely with **inline Tailwind utility classes** in `falcon-org-node-header.component.html`. The gate-12 `:where()` token-scope machinery does not apply (no token file to scope). Contrast falcon-input's ~237-line tokenized `input.tokens.css`.

> `[CODE]` html:1 comment claims *"SCSS handles button skin"* — this is **false**; there is no SCSS/CSS file. The button skin is inline Tailwind. Documentation defect (GAP G4 / FINDINGS).

## How styling actually works

`[CODE]` falcon-org-node-header.component.html — color/spacing/radius via Tailwind utilities (theme-token-backed) PLUS several arbitrary literal values:

| Surface | Utilities | Notes |
|---|---|---|
| Header row | `flex items-center justify-between gap-4 flex-wrap` (html:2) | layout only |
| Image avatar | `w-7 h-7 rounded-full bg-white border border-falcon-neutral-150 overflow-hidden` (html:6) | token border color |
| Root brand SVG | inline `<svg width="40" height="40" ... fill="currentColor">` in `text-falcon-teal-700` (html:10-13) | brand-mark path inlined (not `<falcon-brand-logo>`) |
| Initials avatar | `w-7 h-7 rounded-full text-white text-xs font-bold bg-falcon-teal-700` (html:16) | token colors |
| Node name | `text-[15px] font-semibold text-falcon-neutral-925 truncate` (html:21) | **`text-[15px]` arbitrary px** |
| Info button (idle) | `h-[38px] px-1.5 bg-transparent ... text-falcon-neutral-600 text-[13px] ... hover:text-falcon-teal-700` (html:38) | **`h-[38px]`/`text-[13px]` arbitrary** |
| Back-to-Users / Add Client / Add Node | `h-[38px] px-4 text-[13px] ... rounded-[10px] border bg-white text-falcon-neutral-900 border-falcon-neutral-150 hover:bg-falcon-teal-100 hover:border-falcon-teal-700` (html:46/54/62) | **`h-[38px]`/`text-[13px]`/`rounded-[10px]` arbitrary**; token colors |
| Edit button (active when infoOpen) | `bg-falcon-teal-700 text-white border-falcon-teal-700 hover:bg-falcon-teal-800` (html:72-75) | token colors |
| Add User (primary) | `h-[38px] px-4 text-[13px] ... bg-falcon-teal-700 text-white border-falcon-teal-700 hover:bg-falcon-teal-800` (html:87) | token colors + arbitrary px |
| Transitions | `transition-colors duration-[120ms]` (html:38/46/54/62/71/87) | **`duration-[120ms]` arbitrary** |

## Token categories

`[CODE]` N/A — no `--falcon-org-node-header-*` token namespace. Colors come from `--color-falcon-{neutral,teal}-*` via utilities; geometry is hardcoded arbitrary px.

## Related Falcon theme tokens (consumed via utilities)

| Falcon theme token | Used via |
|---|---|
| `--color-falcon-neutral-{0/white,150,600,900,925}` | avatar bg/border, button bg/text/border, node name |
| `--color-falcon-teal-{100,700,800}` | primary button, hover states, root avatar, active edit |
| `--font-size-xs` (`text-xs`) | initials chip |
| `--font-weight-{semibold,bold,medium}` | name / initials / labels |

## Tailwind utility guidance for this component

`[CODE]` There is no class hook into the inner buttons; consumers can only add layout utilities on the host (`class=`). Deeper visual change requires upstreaming a token contract (GAP G5/G7). Do NOT add a consumer `.component.css` rule targeting `.falcon-org-node-header button`.

## Dark mode support

`[CODE]` **NONE found.** Unlike falcon-view-toggle (which has inline `dark:` variants), this template has **no `dark:` classes at all** — `bg-white`, `text-falcon-neutral-900`, `border-falcon-neutral-150` etc. are light-mode-only. In dark mode the header would render light-on-light (white buttons on a dark canvas). This is a real **dark-mode gap** (GAP G8 / FINDINGS). (It is mitigated only by the component being unused.)

## Density support

`[CODE]` None — fixed `h-[38px]` buttons, `w-7 h-7` avatar. No density alias, no `size` input.

## RTL support

`[INFERRED]` The header is `flex items-center justify-between` with `gap` (html:2) and buttons are `inline-flex items-center gap-2` — flex/gap layout mirrors under `[dir='rtl']` via the global theme, so the avatar-left / actions-right arrangement flips correctly. The "Back" arrow icon (`falcon-icon-arrow-left`, html:48) would NOT auto-flip its glyph direction in RTL — a potential RTL icon-direction issue (minor). NOT verified end-to-end; flag for theme review.

## Static style risks

- `[CODE]` **No dark-mode classes** (GAP G8) — the most significant token risk; the component is not dark-mode-ready.
- `[CODE]` **Arbitrary px everywhere**: `h-[38px]`, `text-[13px]`, `rounded-[10px]`, `text-[15px]`, `duration-[120ms]` (html:21/38/46/54/62/71/87). House-rule (tokens-over-literals) deviations (GAP G5).
- `[CODE]` **Inlined brand-SVG path** (html:12) instead of the shared `<falcon-brand-logo>` — duplicated brand markup (GAP G3).
- `[CODE]` **Native `<button>` elements** instead of `<falcon-angular-button>` — Falcon-components-over-native deviation (GAP G6).
- No inline `style=` attributes — clean on that axis.

## No CSS / no SCSS guidance

- The component has zero `.css`/`.scss` — correct per the no-SCSS rule, but the html:1 "SCSS handles button skin" comment falsely implies one exists; fix the comment.
- No token-override path exists; deeper customization must be upstreamed (or, better, use `<falcon-node-details-section>`).

## Token usage by state

| State | "Token"(s) consumed (via utilities) |
|---|---|
| Avatar (image) | `bg-white`, `border-falcon-neutral-150` |
| Avatar (root) | `text-falcon-teal-700` (brand SVG) |
| Avatar (initials) | `bg-falcon-teal-700`, `text-white` |
| Secondary button (idle) | `bg-white`, `text-falcon-neutral-900`, `border-falcon-neutral-150` |
| Secondary button (hover) | `hover:bg-falcon-teal-100`, `hover:border-falcon-teal-700` |
| Primary button (Add User) | `bg-falcon-teal-700`, `text-white`, `hover:bg-falcon-teal-800` |
| Edit button (active / infoOpen) | `bg-falcon-teal-700`, `text-white`, `hover:bg-falcon-teal-800` |
| Disabled | _None — no disabled state._ |
| Dark mode | _None — no `dark:` classes (GAP G8)._ |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25). Confirmed NO token file + NO component CSS (styling 100% inline Tailwind). **No dark-mode classes** (GAP G8). Multiple arbitrary-px deviations + inlined brand SVG + native `<button>` flagged. Stale "SCSS handles button skin" comment (html:1) is false.
