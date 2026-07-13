# falcon-status-badge — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-status-badge>` as the component to use, and how to compose it to parity.

## Visual fingerprint
A small **pill** (border-radius 999px, no border, no shadow) with a **fixed minimum width** (74px at `md`) and a short **status word** inside it. Distinguishing features that separate it from a generic chip:
- **Leading severity-tinted dot** — a tiny filled circle before the label, color-matched to the bucket (default `dot=true`). The dot is the strongest fingerprint — a status pill has a dot; a plain tag does not.
- **One of exactly 4 visual color buckets**, derived from the 9-status vocabulary:
  - **Success** (green-200 bg / green-700 fg / green-500 dot) — `active`, `paid`.
  - **Warning** (amber-50 bg / amber-700 fg / amber-500 dot) — `pending`.
  - **Neutral** (neutral-175 bg / neutral-700 fg / neutral-500 dot) — `suspended`, `locked`, `inactive`, `disabled`.
  - **Danger** (red-100 bg / red-700 fg / red-500 dot) — `deleted`, `expired`.
- Sizes `sm` (10px font, 60px min-width, 5px dot) / `md` (12px, 74px, 6px — default) / `lg` (13px, 88px, 8px).
- It almost always appears **inside a table cell** as the status column. Non-interactive — no hover, no focus, no ✕.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Chip size="small" color="success/warning/error/default">` | MUI Chip color-coded by status ≈ this; MUI has no built-in status-dot. |
| PrimeNG | `<p-tag severity="…">` used for status | this **replaces** status-purposed `<p-tag>`; the dot is Falcon-specific. |
| Ant Design | `<Badge status="success/processing/default/error" text="…">` | direct conceptual 1:1 — Ant `<Badge status>` has exactly the dot-plus-text anatomy. |
| Bootstrap | `.badge.bg-success` / `.bg-warning` etc. | upgrade target — replace status-purposed badges with this. |
| shadcn / Radix | `<Badge variant="default/secondary/destructive">` | shadcn Badge color-coded by status ≈ this (no dot). |
| plain HTML | `<span class="status active">` | always replace with this component (`feedback_falcon_ui_library_only_no_native`). |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a status word with a colored dot on a row | `<falcon-angular-status-badge>` | a hand-rolled Tailwind chip |
| user / account / service **lifecycle state** (active/pending/suspended/locked/deleted/inactive/paid/expired/disabled) | `<falcon-angular-status-badge [severity]="…">` | `<falcon-tag>` |
| a generic severity / category label (non-status) | `<falcon-angular-tag severity="…">` | status-badge |
| a removable filter / selected chip | `<falcon-angular-tag dismissible>` | status-badge |
| a count / notification number | `<falcon-badge>` | status-badge |
| a status word but the value is not in the 9-vocabulary | extend the type + add a token bucket (GAP) | force an arbitrary string |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **Inputs** — `[severity]` (one of the 9 status values — drives the color bucket), `[label]` (the **pre-translated** word — `('status.' + value) | translate`), `[size]` (`sm`/`md`/`lg`), `[dot]` (leading dot on/off).
2. **Slot** — for icon+text content, project via `<ng-content>` instead of `[label]` (`GAPS_AND_UPGRADES.md:19-21`).
3. **Variant** — `dot=false` for dense table cells; `dot=true` for headers / hero status.
4. **Token override** — restyle a bucket's bg/fg/dot via `status-badge.tokens.css` vars (`--falcon-status-badge-active-bg`, `--falcon-status-badge-active-dot-bg`, etc.) — but **revalidate WCAG-AA contrast** after any color change (`API.md:75`).
5. **Shared upgrade** — adding a new status (e.g. `archived`) needs a type-union extension + a token bucket assignment; a `col.type='status'` table integration (FSB-02), `[ariaLabel]` on the wrapper (FSB-03), or `[iconName]` shorthand (FSB-05) are GAPs (`GAPS_AND_UPGRADES.md`) — raise them, do not hand-roll.
6. **Wrapper** — for new pages always use `<falcon-angular-status-badge>` (the Angular wrapper); the dot-only A11y workaround drops to `<falcon-status-badge-tw aria-label="…">`.
7. **In a table** — render via `<ng-template falconDataTableCell="status" let-value="value">` (`USAGE.md:3-13`).

## Anti-patterns
- **Hand-rolling status chips** with `bg-falcon-{color}-50 text-falcon-{color}-700` Tailwind combinations — the exact mistake `organization-hierarchy-menu.component.html:162-195` made (`USAGE.md:51`, `GAPS_AND_UPGRADES.md:7`). It drifts from the SSOT bucket map; two pages end up showing the same status in different colors.
- Using `<falcon-tag>` or `<falcon-badge>` for lifecycle status — different semantic + visual contract (`USAGE.md:53`). `<falcon-tag>`'s 7 severities are a generic palette; this component's 9 are domain status enums.
- Passing an arbitrary `severity` string — the TS type forbids it; runtime falls back to neutral (`USAGE.md:52`).
- Bypassing `[severity]` and writing utility classes directly on the Light-DOM tag — the severity contract drives the accessibility-tested color buckets (`USAGE.md:38`).
- Dot-only mode (`label=""`) via the Angular wrapper without an `aria-label` — the wrapper does not expose `ariaLabel`, so the badge is invisible to screen readers; drop to the Stencil tag (`GAPS_AND_UPGRADES.md:29`).
- Overriding a bucket bg without re-checking contrast — breaks the WCAG-AA guarantee (`API.md:75`).
- Reusing `paid` as a generic "payment succeeded" color — it is a service-row lifecycle status, not a receipt indicator.

## Verification
🟢 RE-VERIFIED 2026-06-03 (B10) — anatomy, the 9→4 bucket map, sizes, and dot behavior confirmed against `[CODE]` `falcon-status-badge.types.ts:6-17`, `falcon-status-badge.component.ts:23-70`, `status-badge.css:32-104`, and `status-badge.tokens.css:33-90`. The "hand-rolled chip" anti-pattern is now mostly historic (component broadly adopted). Cross-library mapping is `[INFERRED]` from standard component parity.
