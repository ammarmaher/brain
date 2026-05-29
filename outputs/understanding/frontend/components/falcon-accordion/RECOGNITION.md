# falcon-accordion — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-accordion>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-accordion.tsx:138-233` — a **vertical stack of collapsible sections** inside a bordered container:
- Each section is a full-width **header button** with a label, an optional second-line description, an optional leading icon, and a **chevron** on the trailing edge that points down when collapsed (the chevron rotates on expand) — `falcon-accordion.tsx:162-207`.
- Below an expanded header, a **panel region** slides open with the section's body content — `falcon-accordion.tsx:208-219`. Collapsed panels are fully hidden.
- Headers stack with separators; expanded items get a subtly different background.
- Optional **helper text** or **error text** below the whole stack — `falcon-accordion.tsx:225-230`.
- The distinguishing trait: **multiple section headers are visible at once, stacked vertically**, and content expands *in place below its own header* (not in a separate pane). That separates it from tabs (one header row, content in a shared pane) and from a tree (indented hierarchy).

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Accordion>` + `<AccordionSummary>` / `<AccordionDetails>` | direct 1:1 — MUI `expanded`/`onChange` ≈ Falcon `expandedValues`/`valueChange`. |
| PrimeNG | `<p-accordion>` + `<p-accordionTab>` | direct 1:1 — this component **replaced** `<p-accordion>` (Wave PR-8). `multiple` prop maps to `mode="multiple"`. |
| Ant Design | `<Collapse>` + `<Collapse.Panel>` | direct 1:1 — Ant's `accordion` boolean → Falcon `mode="single"`; default Ant `<Collapse>` → `mode="multiple"`. |
| Bootstrap | `.accordion` / `.accordion-item` (collapse plugin) | direct 1:1 — Bootstrap's `data-bs-parent` (single-open) → `mode="single"`. |
| shadcn / Radix | `<Accordion type="single|multiple">` (Radix Accordion) | direct 1:1 — Radix's `type` prop is exactly Falcon's `mode`; `collapsible` ≈ single mode allowing zero open (which Falcon's `single` already does). |
| plain HTML | a group of `<details>`/`<summary>` elements | replace with this when sections need coordinated single-open mode, keyboard nav, or shared styling. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| stacked collapsible sections, content expands in place | `<falcon-angular-accordion>` | tabs / tree |
| one header row, switching content in a shared pane below | `<falcon-angular-tabs>` | accordion |
| indented parent/child hierarchy that collapses | `<falcon-angular-tree>` | accordion |
| a single standalone collapsible disclosure | a native `<details>` or a custom toggle | accordion |
| a section that must ALWAYS stay open (tab-like persistence) | `<falcon-angular-tabs>`, or raise the `single-locked` GAP | accordion `mode="single"` |
| non-collapsible section cards | `<falcon-angular-card>` | accordion |
| a rich header with a status badge / action button | accordion is missing the per-item header slot — raise GAP P1, do not hand-roll | — |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[items]` is an array of `FalconAccordionItem` (`{ value, label, description?, icon?, disabled? }` — each `value` unique and stable); `[mode]` (`single` = one open / collapses to zero; `multiple` = independent); `[size]` (`sm`/`md`/`lg`); `[showChevron]`; `[ariaLabel]`; `[helperText]` / `[errorMessage]`; `[disabled]` to lock the whole accordion.
2. **Expansion state** — `[(expandedValues)]` two-way (array of open values), or `[expandedValues]` + `(valueChange)`. There is no CVA — no `formControlName` (`GAPS_AND_UPGRADES.md` P1).
3. **Panel content (slots)** — project each section body as `<div slot="content-<value>">…</div>`; the `<value>` must match an `item.value` exactly. Panels can hold any content including Falcon form controls (`formControlName` bindings stay live even while collapsed).
4. **Per-item disable** — set `disabled: true` on a `FalconAccordionItem` to lock just that section (host-decided, often PES-driven).
5. **Header customization** — only `label` / `description` / `icon` props; **no header slot** — rich headers (badges, action buttons) are GAP P1. Raise it; do not project into the header.
6. **Icon** — `icon` is a CSS class string (`'falcon-icon falcon-icon-cog'`), not `<falcon-angular-icon>` — GAP P2.
7. **Tokens** — restyle container, item (default/hover/expanded/disabled bg), header padding per size, chevron size/rotation/transition via `accordion.tokens.css`; never hardcode (see `TOKENS.md`).
8. **Variants** — `useTailwind` (default `true`) picks the Light-DOM `-tw` skeleton.
9. **Shared upgrade** — per-item header slot, `single-locked` mode, CVA, per-item `loading`, `canToggle` predicate are all GAPs (`GAPS_AND_UPGRADES.md` P1–P2) — raise as library upgrades.
10. **Imperative always-1-open** — until `single-locked` lands, get the native element ref and call the Stencil `expand(value)` method to re-open after a collapse.

## Anti-patterns
- `[CODE]` Expecting `mode="single"` to keep one section always open — it collapses to zero on a re-click. Use the imperative `expand()` or raise `single-locked`.
- `[CODE]` Duplicate `item.value`s — collide in the `headerRefs` Map and corrupt keyboard focus + slot matching.
- `[CODE]` `slot="content-<value>"` with a mismatched or wrong-typed value — silently renders an empty panel.
- `[CODE]` Binding `[(ngModel)]` / `formControlName` to the accordion — no CVA; the binding no-ops.
- Putting a `<falcon-angular-tabs>` inside an accordion panel — overlapping focus/keyboard management (`USAGE.md`).
- Submitting a form whose invalid control sits in a collapsed (hidden) panel — the operator cannot see the error; auto-expand the offending section first.
- Using an accordion where the design is clearly **tabs** (mutually-exclusive views, shared content pane) — wrong component.
- Native `<details>` group or PrimeNG `<p-accordion>` in new app code — banned (`feedback_falcon_ui_library_only_no_native`).

## Verification
✅ VERIFIED against `[CODE]` `falcon-accordion.tsx` rendered structure + `[CODE]` `falcon-accordion.component.ts` inputs. Cross-library mapping is `[INFERRED]` — though the PrimeNG mapping is `[CODE]`/`[BRAIN-OUT]`-confirmed (this component explicitly replaced `<p-accordion>` per Wave PR-8).
