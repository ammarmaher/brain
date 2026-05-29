---
type: checklist
cluster: page-implementation
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon New Page Implementation Checklist ***
*** Pre-merge gate for every new Angular page or large page change ***
*** Angular-first; React/Vue future placeholders only ***

# Falcon New Page Implementation Checklist

> The final gate before a new page (or large page modification) ships. Every checkbox MUST be a YES. If any is NO, the page is not ready to merge. Read this BEFORE coding (as a design brief) and AFTER coding (as a self-audit).

## 1. Purpose

Make page-shipping deterministic:
- Force the reuse-first contract at the page level
- Force the visual-baseline guardrail at the page level
- Force the gap-logging contract before bespoke work ships
- Give the reviewer (Ammar / Brain SK / Falcon Eyes) a citable artifact

## 2. The checklist — every YES required

### Section A — Recognition & mapping

| # | Question | YES means | Evidence |
|---|---|---|---|
| **A-1** | Did we map every UI pattern to a Falcon component? | All visible patterns are listed with their `<falcon-angular-*>` wrapper choice | Step 3 mapping output from [[Falcon Screenshot To Component Mapping Guide]] |
| **A-2** | Did we run the [[Falcon Component Recognition Playbook]] §2 lookup top-to-bottom? | Mapping derived from the canonical table, not from memory | Recognition output |
| **A-3** | Did we cross-check the chosen components against [[Falcon Component Capability Matrix]] for "Known Gaps" + "Do Not Use When"? | We're not relying on a deprecated component or a known-broken capability | Capability check column in mapping |
| **A-4** | Did we run [[Falcon Component Selection Decision Tree]] for any pattern flagged "⚠ partial" or "❌ missing"? | Either reuse / extend path confirmed, OR gap logged | Decision tree path noted |

### Section B — Visual baseline conformance

| # | Question | YES means | Evidence |
|---|---|---|---|
| **B-1** | Are we using Falcon Tailwind Theme? | Every color is `bg-falcon-*` / `text-falcon-*`; every spacing is Tailwind utility; every radius is `rounded-md` / `rounded-[14px]` / `rounded-full` | Grep page HTML for `#`, `bg-[`, `text-[`, `rounded-[1{3,5,6}` |
| **B-2** | Are we preserving [[Falcon Light Mode Visual Baseline]]? | No new color / spacing / radius / shadow / hover / focus value introduced | Diff against the 7-note baseline cluster |
| **B-3** | Is the page consistent with [[Falcon Organization Hierarchy Visual Standard]]? | Page shell follows §2 recipe; main pane uses canonical card recipe; tab bar / section header / data-table follow recipes | Side-by-side compare with org-hierarchy live screen |
| **B-4** | Did we honor [[Falcon Do Not Change Visual Rules]]? | All 20 lockdowns pass; no rule broken without Ammar approval | 20-rule self-audit |
| **B-5** | Did we honor [[Falcon Page Visual Consistency Rules]]? | All 12 rules pass; no inline styles, no `!important` overrides, no per-page CSS hacks | 12-rule self-audit |

### Section C — Component usage

| # | Question | YES means | Evidence |
|---|---|---|---|
| **C-1** | Are we using Angular wrappers correctly? | Every interactive element is `<falcon-angular-*>` from `libs/falcon-ui-core/src/angular-wrapper/components/` | Grep for raw `<button>` / `<input>` / `<select>` / `<table>` / `<dialog>` |
| **C-2** | Are we avoiding raw HTML duplicates? | No raw HTML reimplements a Falcon component's role (table, button, input, select, modal, etc.) | Grep + visual review |
| **C-3** | Are we avoiding inline styles? | No `style="background: ..."` / `style="color: ..."` / `style="padding: ..."` for properties that have tokens | Grep page HTML for `style="` |
| **C-4** | Are we avoiding page-specific component hacks? | No `<falcon-angular-X class="!bg-... !rounded-...">`; no per-page CSS file overriding component classes | Grep for `!` overrides + check for `.scss` files |
| **C-5** | Are we using Reactive Forms + CVA where applicable? | Form controls use `[formGroup]` + `formControlName` (not banana-box `[(ngModel)]` for forms with > 3 fields) | Form structure review |
| **C-6** | Are we using component variants/sizes/severities instead of class overrides? | Visual differences come from `variant="..."`, `size="..."`, `severity="..."` props | Diff |
| **C-7** | Is every status display via `<falcon-angular-status-badge>` (not inline chips)? | No `<div class="bg-falcon-X-100 text-falcon-X-700 rounded-full">` for entity state | Grep |

### Section D — Gap handling

| # | Question | YES means | Evidence |
|---|---|---|---|
| **D-1** | Are missing capabilities documented as reusable component gaps? | Every "⚠ partial" or "❌ missing" path from §A-3 has an entry in [[Falcon Component Gap Registry]] (existing ID cited, or new row added) | Gap ID list in PR description |
| **D-2** | If any P0 / P1 gap blocks the page, did we escalate to Ammar before proceeding? | Approval is documented (in PR comment, memory entry, or chat record) | Escalation reference |
| **D-3** | If we applied a local workaround (P2 / P3 gap), is the workaround scoped to this page only? | The workaround does NOT modify shared components; it composes locally | Code review |

### Section E — State coverage

| # | Question | YES means | Evidence |
|---|---|---|---|
| **E-1** | Are loading states using Falcon components? | Inline loader via `provideFalconLoader` global default; per-button `[loading]`; per-table `[loading]`; per-form `[loading]` on submit | No hand-rolled spinners |
| **E-2** | Are empty states using `<falcon-angular-empty-state>`? | "No data" panels use the component, not a custom `<div>` | Grep for "No results" string |
| **E-3** | Are error states surfaced via `FalconToastService` / `FalconMessageService` or inline error props? | No `console.error` for user-facing; no custom error banners | Code review |
| **E-4** | Are skeletons (if used) consuming the Loader Studio registry config? | Skeletons sourced from `provideFalconLoader` config — not author one-off | Per [Memory: `project_signalr_realtime_loader_skeleton_handoff_2026_05_19`] |
| **E-5** | Are disabled states using `opacity-50 + cursor-not-allowed` (via component contract)? | No hand-rolled disabled styling | Verify component variants honor disabled |
| **E-6** | Are focus-visible rings preserved on all interactive elements? | `--shadow-falcon-focus` ring shows on Tab navigation | Manual keyboard test |

### Section F — Responsive / direction / density

| # | Question | YES means | Evidence |
|---|---|---|---|
| **F-1** | Does the page work in `dir="ltr"` AND `dir="rtl"`? | Uses logical CSS (`ps-*` / `pe-*`); no hardcoded `left:` / `right:` | RTL toggle test |
| **F-2** | Does the page work in `[data-density="comfortable"]` AND `[data-density="compact"]`? | Pixel sizes come from tokens (not hardcoded numbers) | Density toggle test |
| **F-3** | Does the page collapse properly at mobile / tablet / desktop? | Tailwind `md:` / `lg:` prefixes are used; grids collapse to single column on mobile | Resize test |

### Section G — Code quality

| # | Question | YES means | Evidence |
|---|---|---|---|
| **G-1** | Is the feature folder under `apps/<app>/src/app/features/<feature>/`? | Consistent with Falcon folder doctrine | Folder structure |
| **G-2** | Is state managed via standalone `*StateSlice` / `*Facade` (signal-based)? | No NgRx; no observables for simple page state | State files |
| **G-3** | Are templates using `@switch` / `@if` (not `*ngIf` / `*ngFor`)? | Falcon enforces new control flow in zoneless Angular 21 | Grep for `*ngIf` / `*ngFor` |
| **G-4** | Are components standalone (no NgModule)? | `standalone: true` in `@Component` (default in Angular 21) | Component decorators |
| **G-5** | No SCSS file? | Per Falcon no-SCSS rule (P0-10) | Folder check |
| **G-6** | No `console.log` / `console.warn` left in shipped code? | Grep | Grep page files |

### Section H — Documentation

| # | Question | YES means | Evidence |
|---|---|---|---|
| **H-1** | Did we update the page note in `_obsidian/10-Pages/`? | Page note exists with the standard links (UI/UX rules, V-rules, components, etc.) | Vault check |
| **H-2** | Did we register learning events? | Any new pattern or correction was logged per [Brain SK page-learning protocol] | Page learning folder |
| **H-3** | Did we link this implementation back to its flow playbook (if applicable)? | Playbook updated with implementation status | Playbook check |

## 3. Quick self-audit (the 10 essential questions)

> If you're short on time, answer these 10 — they cover ~80% of common failure modes:

1. ✅ Did we map every UI pattern to a Falcon component? *(A-1)*
2. ✅ Are we using Falcon Tailwind Theme (no arbitrary colors/spacing/radius)? *(B-1)*
3. ✅ Are we preserving Light Mode Visual Baseline? *(B-2)*
4. ✅ Are we using Angular wrappers correctly (no raw HTML duplicates)? *(C-1, C-2)*
5. ✅ Are we avoiding inline styles? *(C-3)*
6. ✅ Are we avoiding page-specific component hacks? *(C-4)*
7. ✅ Are missing capabilities documented as reusable component gaps? *(D-1)*
8. ✅ Are loading / empty / error states using Falcon components? *(E-1 to E-3)*
9. ✅ Is the page consistent with Organization Hierarchy visual standard? *(B-3)*
10. ✅ Did we honor [[Falcon Do Not Change Visual Rules]]? *(B-4)*

## 4. Pre-coding (design brief) checklist

Use this BEFORE writing any template HTML:

- [ ] Open the design / screenshot / HTML / React reference
- [ ] Run [[Falcon Screenshot To Component Mapping Guide]] 6-step process
- [ ] Output: component mapping artifact (Step 3) + gap-decision list (Step 4) + implementation plan (Step 5)
- [ ] Cross-check the plan against [[Falcon Page Assembly Playbook]] §3 recipes
- [ ] Confirm no P0/P1 gap blocks the page (escalate if any)
- [ ] Ammar-approve the plan if any visual baseline change is required (default = NO change)
- [ ] Open [[Falcon Light Mode Visual Baseline]] + [[Falcon Organization Hierarchy Visual Standard]] in another tab — keep them open while coding

## 5. Post-coding (self-audit) checklist

Use this AFTER writing the template + state + integration:

- [ ] Walk Sections A–H above; every box is YES
- [ ] Quick self-audit (the 10 essential questions in §3); every YES
- [ ] Manual keyboard navigation test (Tab + Shift+Tab + Enter + Esc)
- [ ] Manual `dir="rtl"` test
- [ ] Manual `[data-density="compact"]` test
- [ ] Manual responsive resize test (mobile 375 / tablet 768 / desktop 1280)
- [ ] Diff against [[Falcon Organization Hierarchy Visual Standard]] — does anything visually diverge?
- [ ] PR description cites: gap IDs (if any), recipe used (page-shell), components composed, baseline preserved (✅)

## 6. Failure modes — what each NO means

| If NO on... | Then... |
|---|---|
| Any A-row | You haven't done the recognition work. Go back to [[Falcon Component Recognition Playbook]] before coding. |
| Any B-row | You're breaking the visual baseline. Either fix to match, or escalate to Ammar with a documented reason. |
| Any C-row | You're bypassing the component library. Refactor to use the wrappers + variants + tokens. |
| Any D-row | A gap is invisible to the next agent. Log it in [[Falcon Component Gap Registry]] before merging. |
| Any E-row | A state is incomplete (a11y / UX failure). Add the missing Falcon component for that state. |
| Any F-row | The page breaks RTL / density / responsive. Fix the offending property. |
| Any G-row | Code quality breach (no-SCSS / Reactive Forms / standalone / control flow). Refactor. |
| Any H-row | The Brain doesn't know about your work. Update the page note / learning events / playbook. |

## 7. Wrong patterns to avoid

- ❌ Treating this checklist as optional ("we'll do it next sprint")
- ❌ Marking a question YES when you actually mean "probably" or "I didn't check"
- ❌ Skipping the pre-coding brief and only running the post-coding audit (the brief catches issues early)
- ❌ Hiding gaps to avoid the escalation conversation — the gap will resurface at the next page anyway
- ❌ Citing the wrong gap ID just to close the checklist row

## 8. Angular-first notes

- This checklist applies to Angular consumer apps (admin-console, host-shell, management-console)
- For shared library work (`libs/falcon-ui-core/...`), the checklist is supplemented by [[Falcon Component Theme Contract]] (9 sections) + [[Tailwind Implementation Review Checklist]]
- React/Vue future placeholders: when wrappers ship, the same checklist applies with framework-specific bindings

## 9. Future-agent instructions

- **Run this checklist on every new page or large page modification.**
- **Save the checklist output** alongside the PR description (paste the table with ✅ / ❌ marks).
- **Don't merge with any NO.** A NO means the page isn't ready — log the blocker, escalate, OR fix before merging.
- **Update this checklist** if you discover a recurring failure mode not yet captured here — submit a vault PR.

## See also

- [[Falcon Component Recognition Playbook]] — Section A inputs
- [[Falcon Component Capability Matrix]] — Section A-3 reference
- [[Falcon Component Selection Decision Tree]] — Section A-4 routing
- [[Falcon Screenshot To Component Mapping Guide]] — Section A pre-coding process
- [[Falcon Component Gap Registry]] — Section D logging target
- [[Falcon Page Assembly Playbook]] — Sections B + C recipes
- [[Falcon Light Mode Visual Baseline]] · [[Falcon Page Visual Consistency Rules]] · [[Falcon Do Not Change Visual Rules]] · [[Falcon Organization Hierarchy Visual Standard]]
- [[Falcon Component Theme Contract]] · [[Tailwind Implementation Review Checklist]] (library-side complement)

## Tags

#type/checklist #layer/frontend #cluster/page-implementation #priority/critical

## Hubs

- [[60-Components/Falcon Component Recognition Playbook|Component Recognition Playbook]] · [[36-Theming/README|36-Theming]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
