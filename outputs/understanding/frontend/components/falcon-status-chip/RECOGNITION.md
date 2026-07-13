# falcon-status-chip — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify whether the right Falcon component is `<falcon-status-chip>` — and crucially, **when it is actually `<falcon-status-badge>` or `<falcon-angular-tag>` instead**.

## Visual fingerprint
`[CODE]` A small **status indicator** in one of two looks:
- **`filled`** — a soft tinted **rounded-full pill** (`bg-falcon-{green-50/amber-50/red-100/neutral-100}`), a colored **leading dot**, and a **colored label** (`text-falcon-{green-700/amber-700/red-700/neutral-500}`, `font-medium`, `text-xs`/`text-2xs`). The classic "● Approved" green pill, "● Pending" amber pill, "● Rejected" red pill, "● N/A" neutral pill.
- **`text`** — bare **italic colored text** (no background, no border), optionally a tiny dot. Used inline under a name in dense maker/checker tables.

Always small (sm/md only), always reads a status WORD (i18n), color comes from the family (green=approved, amber=pending/review, red=rejected/deleted, neutral=N/A).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Chip variant="filled" size="small" color="success/warning/error/default">` | MUI Chip color-by-status ≈ the filled variant; MUI has no built-in "italic text-only" status mode. |
| PrimeNG | `<p-tag severity="success/warning/danger/info">` / `<p-badge>` | direct conceptual 1:1 with the filled pill; this chip is the Falcon templates-domain equivalent (the platform `<falcon-angular-tag>` replaced `p-tag` generically). |
| Ant Design | `<Tag color="green/orange/red">` / `<Badge status="success/processing/error/default">` | Ant `Badge status` (dot + text) ≈ the filled variant; `Tag` ≈ a generic severity tag. |
| Bootstrap | `<span class="badge text-bg-success/warning/danger/secondary">` | upgrade target — replace with the Falcon chip/badge. |
| shadcn / Radix | `<Badge variant="secondary/destructive/outline">` | shadcn Badge ≈ the filled pill; recolor per status. |
| plain HTML | `<span class="status approved">…</span>` | the hand-rolled thing this chip centralized for the Templates domain. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a **message-template** lifecycle status (approved / pending / in-review / rejected / deleted / N-A) as a pill | `<falcon-status-chip variant="filled">` | status-badge |
| a maker/checker verdict as compact italic text under a name | `<falcon-status-chip variant="text" [showDot]="false">` | a filled pill |
| an **account / user** lifecycle status (active / suspended / locked / inactive / paid / expired / disabled) | `<falcon-angular-status-badge>` (`@falcon/ui-core`, 9 severities, sm/md/lg, dual-render) | status-chip (wrong vocabulary — G1) |
| a **generic severity tag**, optionally dismissible (success/info/warning/danger/secondary/contrast + `×`) | `<falcon-angular-tag>` (`@falcon/ui-core`) | status-chip |
| a **numeric count / dot** on an icon/avatar | `<falcon-badge>` / `<falcon-card-status>` | status-chip |
| a status needing a **leading glyph** (✓/✕/⏳) today | `<falcon-angular-tag>` (has `icon`) | status-chip (no icon yet — G6) |
| a status needing an `lg` size | `<falcon-angular-status-badge>` (has `lg`) | status-chip (sm/md only — G3) |

> **The decisive question is the status vocabulary, not the look.** All three (chip / status-badge / tag) render a small tinted pill. Pick by *what set of states* you have: templates lifecycle → chip; account/user lifecycle → status-badge; arbitrary severity → tag. (G1 — the chip's "platform SoT" comment is misleading; ignore it and choose by vocabulary.)

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **First — confirm the component by vocabulary.** Templates status? → chip. Account/user status? → `<falcon-angular-status-badge>`. Generic severity/dismissible? → `<falcon-angular-tag>`. Only continue this recipe for a templates-domain status.
2. **Inputs** — `[status]` (required; map your value into `approved|pending|rejected|deleted|review|none` at the boundary), `variant` (`filled`/`text`), `[showDot]`, `size` (`sm`/`md`), `[labelKey]` (i18n key to override the default word). All label inputs are translation KEYS — add them to `en.json` + `ar.json`.
3. **Templates / slots** — **none.** The label is prop-driven; there is no `<ng-content>` and no `ng-template` input.
4. **Variants** — `filled` (pill) or `text` (italic). Pick before anything else.
5. **Token override** — **not available.** No token file, no color-override input; color is global per status (G2). Do not attempt a per-page recolor.
6. **Shared upgrade** — need a glyph (G6), an `lg` size (G3), a size-aware text dot (G4), or a per-instance color (G2)? Those are documented GAPS — raise them; do not hand-roll a parallel pill in page code.
7. **Wrapper** — no wrapper needed; consume `<falcon-status-chip>` directly inside the data-table cell template.

## Anti-patterns
- Using `<falcon-status-chip>` for **account/user statuses** (`active`/`suspended`/`expired`/…) — wrong vocabulary; use `<falcon-angular-status-badge>` (G1).
- Trusting the "single source of truth across the Falcon platform" comment — it is templates-scoped in reality (G1). Choose by status set.
- Passing an already-translated string to `[status]` (won't type-check) or to `[labelKey]` (ships a missing-translation artifact) — both are wrong; `status` is a strict union, `labelKey` is an i18n key.
- Expecting a per-page color tweak via host `bg-*` utilities or a `--falcon-status-chip-*` token — neither exists (G2).
- Hand-rolling a tinted `<span class="status …">` in page code for a templates status — forbidden by the Falcon library-first rule (`feedback_falcon_ui_library_only_no_native`); use the chip.
- Expecting a click/dismiss — the chip is display-only (no outputs); for dismissible use `<falcon-angular-tag dismissible>`.
- Relying on color alone in the `text` variant — the label must carry the meaning (color-identical pairs `pending`/`review`, `rejected`/`deleted` — G5).

## Verification
🟡 CODE-DERIVED from `falcon-status-chip.component.ts` + the `<falcon-status-badge>` type file (`falcon-status-badge.types.ts`) + the `@falcon` barrel (`FalconAngularTagComponent` / `FalconStatusChipComponent` exports). The use-this-vs-siblings routing is the core B24 finding (G1): chip = 6-value templates set, status-badge = 9-value account set, tag = generic severity. Cross-library mapping 🟡 CODE-DERIVED + `[INFERRED]` standard-library knowledge.
