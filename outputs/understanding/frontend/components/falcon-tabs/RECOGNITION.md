# falcon-tabs — Recognition Layer

> Cross-cutting layer. Purpose: given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-tabs>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-tabs.tsx` + `tabs.tokens.css`:
**Navigation mode** — a horizontal (or vertical) row of text **tab buttons**, each optionally with a leading **font-icon**, sitting on a thin **border-bottom**; the active tab is darker/bolder and carries a **sliding teal underline indicator** (2 px) that animates 220 ms between tabs. Below sits one **panel** per tab (only the active one shown). Optional helper text or red error text under the tablist. **Radio-cards mode** — a grid of selectable **cards**, each with an **icon + title + sub-description**, the selected one carrying a teal border + tinted background + a filled radio "dot" (no underline, no panels). Distinguishing feature vs the stepper: tabs have **no numbered dots and no progress fill** — they are parallel, not sequential.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Tabs>` + `<Tab>` (navigation) · `<ToggleButtonGroup>` or `<RadioGroup>` of `<Card>`s (radio-cards) | MUI `<Tabs>` `value` ≈ `selectedValue`; MUI has no built-in radio-card grid. |
| PrimeNG | `<p-tabView>` + `<p-tabPanel>` (navigation) · `<p-selectButton>` / card radios (radio-cards) | direct 1:1 — this component replaces `<p-tabView>` (PrimeNG uninstalled, Wave PR-8). |
| Ant Design | `<Tabs>` + `<Tabs.TabPane>` (navigation) · `<Radio.Group>` of cards (radio-cards) | Ant `<Tabs>` `activeKey` ≈ `selectedValue`. |
| Bootstrap | `.nav-tabs` + `.tab-content` / `.tab-pane` | upgrade target — replace with this. |
| shadcn / Radix | `<Tabs>` + `<TabsList>` + `<TabsTrigger>` + `<TabsContent>` (Radix Tabs) · `<RadioGroup>` of cards | navigation mode is a near 1:1 with Radix Tabs. |
| plain HTML | `<div role="tablist">` + buttons + `<div role="tabpanel">` / `<input type="radio">` | always replace with this. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| parallel section switches of one entity, with a sliding underline | `<falcon-angular-tabs>` `mode="navigation"` | stepper |
| a guided "pick one" choice as icon+title+description cards | `<falcon-angular-tabs>` `mode="radio-cards"` | navigation tabs |
| an ordered, gated, complete-in-sequence flow | `<falcon-angular-stepper>` / `<falcon-angular-wizard>` | tabs |
| compact stacked single-choice radios (no rich cards) | `<falcon-angular-radio-group>` | radio-cards |
| URL-routed nested views | an `<a routerLink>` strip | tabs |
| per-tab header action buttons (filter/view toggle) | `<falcon-angular-tabs>` + `<ng-template falconTabActions="value">` | absolutely-positioned overlay buttons |
| a page-level toggle affecting all tabs (Tree/Chart view) | an outer-flex sibling next to `<falcon-angular-tabs>` | `falconTabActions` |
| very many tabs needing horizontal scroll | (no scrollable mode yet — GAP) clamp `tabs[]` or raise the gap | overflowing the tablist |

## Composition recipe to reach parity
Customization order (per `feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.

1. **Inputs** — supply `[tabs]` as a `ReadonlyArray<FalconTabOption>` from a `computed()` (each: `value` + `label`, optional `disabled`/`icon`/`helperText`). Bind `[(selectedValue)]` (or `[(ngModel)]`/`formControlName`). Set `mode`, `size`, `orientation`, `ariaLabel`, `helperText`/`errorMessage`.
2. **Templates** — for per-tab header actions, project `<ng-template falconTabActions="<tab-value>">` (one per tab that needs actions); the wrapper lifts the active one into the tablist row.
3. **Slots** — in navigation mode, project panel bodies as `<div slot="panel-{value}">` (Stencil-native). Note the dominant codebase pattern is instead `@switch` on the active-tab signal *after* the element — both work; `@switch` is more common because the page owns the panel layout.
4. **Variants** — `mode` (`navigation` underline-strip vs `radio-cards` grid), `orientation` (`horizontal`/`vertical` — vertical meaningful only for navigation), `size` (`sm`/`md`/`lg`), `useTailwind` (Light vs Shadow).
5. **Token override** — restyle tablist / tab / indicator / radio-card via the 14-category `--falcon-tabs-*` tokens (`tabs.tokens.css`); per-instance via `<falcon-angular-tabs class="compact-tabs">` + `:where(.compact-tabs){ --falcon-tabs-…: … }`. Layout utilities (`block border-b px-4 w-full`) on the host are fine; inner color/padding utilities are not.
6. **Shared upgrade / GAP** — `header-start`/`header-end` real Stencil slots (replacing the MutationObserver), a `panel-{value}` slot for radio-cards mode, per-tab badge/count slots, `iconUrl` for SVG icons, a `lazy` panel mode, a `scrollable` overflow mode → all documented GAPS (`GAPS_AND_UPGRADES.md`). Raise an upgrade, do not hand-roll.
7. **Wrapper** — the Angular wrapper auto-registers the Stencil tags (`defineFalconTwComponent('falcon-tabs')`); import `FalconAngularTabsComponent` (+ `FalconTabActionsDirective` if using per-tab actions) and add `CUSTOM_ELEMENTS_SCHEMA`.

## Anti-patterns
- Using `radio-cards` for view switching (expecting panels) — radio-cards emits a selection but renders no panel; use `navigation` mode.
- Absolutely positioning action buttons over the tablist — use `falconTabActions`; manual injection breaks on re-render.
- `[attr.tabs]` — stringifies the array; always `[tabs]`.
- Re-creating the `tabs[]` array every CD cycle — triggers Stencil re-render + indicator re-measure; use an immutable `computed()`.
- Binding `selectedValue` to a value not present in `tabs[]` — `select()` no-ops but the underline resets to origin.
- Duplicate `value`s — break the focus map.
- Wrapping the tabs in a `flex-wrap` container when using `falconTabActions` — the action-lift assumes a single-row tablist.
- `<p-tabView>` / `<p-tabPanel>` anywhere — PrimeNG uninstalled (`feedback_falcon_ui_library_only_no_native`).
- Embedding a "(3)" count in the `label` string — works today but a per-tab badge slot is the intended (GAP) path; do not over-invest in label-string counts.
