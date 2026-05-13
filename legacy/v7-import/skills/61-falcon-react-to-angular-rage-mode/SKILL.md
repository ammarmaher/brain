# Falcon React-to-Angular Screen Composer — RAGE MODE

## Skill Name

Falcon React-to-Angular Screen Composer — RAGE MODE

## Core Purpose

Use this skill whenever Ammar provides a React project, React screen, screenshot, design reference, external UI reference, or says:

- “convert this React screen to Angular”
- “copy this UI”
- “make it exactly like this”
- “make it like the screenshot”
- “copy this style”
- “implement this screen”
- “make the Angular version match the React version”
- “copy this React project into Falcon Angular”
- “convert this page section by section”
- “use our components”
- “make it dynamic but not over-engineered”

The goal is to rebuild the selected React screen or screenshot inside the Falcon Angular/Nx project with the closest possible visual and behavioral match, while using Falcon components, Falcon tokens, Tailwind-first styling, and the existing Falcon project architecture.

This skill runs in **RAGE MODE**, which means the implementation is not accepted until it visually and behaviorally matches the source reference as closely as possible.

The React project/screenshot is the **visual and behavior source of truth**.

The Falcon Angular project is the **implementation and architecture source of truth**.

---

## Falcon Project Context

The Falcon Front-End project is an Nx Angular workspace with:

- `apps/host-shell`
- `apps/admin-console`
- `apps/management-console`
- `libs/falcon`
- `libs/sdk`
- `libs/falcon-theme`
- `libs/falcon-ui-core`
- `libs/falcon-ui-core/angular`
- `libs/falcon-ui-react`
- `libs/falcon-ui-vue`
- `libs/falcon-ui-tokens`
- Falcon custom UI components
- Angular wrappers for Falcon UI components
- Tailwind-first styling
- token-driven theming
- Module Federation
- zoneless Angular setup

PrimeNG is being replaced. Do not use PrimeNG for new UI unless the existing legacy screen already depends on it and there is no Falcon replacement yet.

---

## Main Rule

When converting from React to Angular, do not blindly translate React code line by line.

Instead:

1. Understand the screen.
2. Select the exact screen or section required.
3. Divide the screen into practical sections.
4. Map each section to existing Falcon components.
5. Rebuild it in Angular using the simplest clean implementation.
6. Match the same look, feel, layout, behavior, and responsive behavior.
7. Avoid over-engineering.
8. Run RAGE MODE verification until the visual result matches the source as closely as possible.

---

## RAGE MODE Rule

The first implementation is not considered finished.

After implementing the screen, always compare the Angular result against the React screen, screenshot, or design reference.

If it is not matching, do not stop.

Find the root cause, fix it, and compare again.

Repeat this cycle until the implementation matches the source reference as closely as possible.

The cycle is:

```txt
Implement
→ Compare with source reference
→ Detect differences
→ Find root cause
→ Fix root cause
→ Re-check
→ Repeat until matched
```

Do not say “done” while visible differences still exist.

Working is not enough.

The screen must look right.

---

## RAGE MODE Visual Accuracy Checklist

After every implementation pass, compare:

```txt
Layout
Spacing
Padding
Margins
Alignment
Typography
Font size
Font weight
Line height
Colors
Backgrounds
Borders
Border radius
Shadows
Card shape
Button shape
Input shape
Dropdown shape
Table header style
Table row height
Table cell spacing
Icons
Badges
Tabs
Modals
Drawers
Skeletons
Empty states
Hover states
Focus states
Selected states
Disabled states
Responsive behavior
Scroll behavior
```

If any of these differ from the React screen or screenshot, identify why and fix it.

---

## Root Cause Analysis Rule

When the Angular version does not match the source, do not randomly patch styles.

First find the reason.

Possible root causes:

```txt
Wrong Falcon component used
Missing Falcon component variant
Wrong Tailwind class
Wrong token
Wrong spacing scale
Wrong font size
Wrong layout structure
Wrong flex/grid behavior
Wrong wrapper element
Wrong table density
Wrong card padding
Wrong border radius
Wrong shadow
Wrong icon size
Wrong responsive breakpoint
Wrong component composition
Wrong default style from existing component
CSS specificity conflict
Theme token mismatch
Inherited style from parent layout
```

After identifying the root cause, fix the actual cause instead of adding messy overrides.

Avoid using `!important` unless there is no safe alternative.

---

## 100% Match Mindset

The expected result is:

```txt
Same screen structure
Same layout
Same spacing
Same visual hierarchy
Same components
Same interactions
Same responsive behavior
Same UX feeling
```

Do not accept “close enough” if the difference is visible.

Do not leave visual mismatch for later.

Do not say the implementation is complete if the screen still looks different.

If exact 100% matching is blocked by an existing Falcon component limitation:

```txt
1. Explain the limitation.
2. Use the closest Falcon-supported implementation.
3. Add the smallest safe variant/token/component adjustment needed.
4. Avoid breaking other screens.
5. Re-check the visual result again.
```

---

## Mandatory Workflow

### Step 1: Understand the Source

Before coding, analyze the React source, screenshot, or design reference.

Identify:

- page purpose
- main layout
- selected screen/section
- reusable parts
- user actions
- states
- data displayed
- inputs
- dropdowns
- tables
- cards
- modals
- drawers
- tabs
- steppers
- menus
- filters
- empty states
- loading states
- error states
- responsive behavior

Do not start coding until the page is understood.

---

### Step 2: Screen Selection Rule

When Ammar wants only part of a React screen copied, implement only that selected part.

If the React project has many screens, identify the exact screen or route being converted.

If the target is unclear, infer the most likely screen from Ammar’s request and continue with a best-effort implementation.

Do not convert the full React project unless explicitly requested.

For each selected screen, document:

```txt
Selected source screen:
Target Angular app:
Target route:
Target feature folder:
Sections to implement:
Sections intentionally skipped:
```

---

### Step 3: Divide and Conquer the Screen

Never attack the full screen as one giant block.

Break the source screen into practical sections.

Example:

```txt
Screen
├── Page shell
├── Header / Toolbar
├── Search and Filters
├── Summary Cards
├── Tabs
├── Main Table
├── Row Actions
├── Details Drawer
├── Create/Edit Modal
├── Empty State
├── Loading Skeleton
└── Footer / Action Area
```

Implement and verify section by section.

Each section must match before moving to the next one.

Example:

```txt
1. Match page shell
2. Match header
3. Match filters
4. Match cards
5. Match table
6. Match row actions
7. Match drawer/modal
8. Match responsive behavior
```

Only split into components when:

- the section is reusable
- the section has meaningful logic
- the section is visually independent
- the file is becoming too large
- the section needs its own inputs/outputs
- the same pattern appears more than once

Do not split just for the sake of splitting.

---

## Falcon Component Mapping Rule

Before creating new UI, scan the Falcon project for existing components.

Always prefer existing Falcon components.

Map React UI parts to Falcon components.

Example mapping:

```txt
React button              → Falcon button
React input               → Falcon input
React select/dropdown     → Falcon dropdown
React table/grid          → Falcon table
React modal/dialog        → Falcon modal
React side panel          → Falcon drawer / right-side modal pattern
React tabs                → Falcon tabs
React stepper             → Falcon stepper
React tree                → Falcon tree
React badge/status pill   → Falcon badge/chip
React tooltip             → Falcon tooltip
React skeleton/loading    → Falcon skeleton
React menu/dropdown menu  → Falcon menu/context menu
React card                → Falcon card or Tailwind card wrapper
React icons               → Falcon icon mapping / existing icon system
React uploader            → Falcon upload component
React pagination          → Falcon pagination
React empty state         → Falcon empty state pattern
```

Do not create generic Angular components if an existing Falcon component already solves the same problem.

Do not duplicate table, dropdown, input, modal, stepper, card, icon, or button components.

Do not write random HTML if a Falcon component already exists.

Do not use PrimeNG for new UI unless the legacy feature requires it and no Falcon equivalent exists.

---

## Composition Rule

Use component composition when the screen contains multiple UI patterns together.

Example:

If the React screen has a table with dropdown filters, search, row actions, badges, and pagination, build it as a composed Angular screen:

```txt
feature-page.component
├── filter-bar component, only if needed
├── table configuration
├── custom cell templates
├── row action configuration
├── drawer/modal component, only if needed
└── skeleton/empty/error states
```

The table should delegate UI parts to Falcon components.

For example:

- filters use Falcon dropdown/input
- cells use Falcon badge/chip/icon
- actions use Falcon menu/button
- loading uses Falcon skeleton
- empty state uses Falcon empty-state pattern
- pagination uses existing Falcon pagination if available

Do not hardcode everything inside a giant table template.

Do not create a complex abstraction if the screen is simple.

---

## No Over-Engineering Rule

RAGE MODE means high accuracy, not messy architecture.

Always choose the simplest implementation that is clean and maintainable.

Avoid:

```txt
Unnecessary global state
Unnecessary services
Unnecessary generic render engines
Unnecessary dynamic config systems
Unnecessary abstractions
Unnecessary shared libraries
Unnecessary wrappers
Unnecessary inheritance
Unnecessary RxJS complexity
Unnecessary signals if plain component state is enough
Too many tiny components
Massive reusable systems for one screen
New table engines
New dropdown engines
New modal systems
```

Create reusable abstractions only when there is a real repeated pattern.

If a screen is used once, keep it screen-local.

If a component is clearly reusable across screens, then move it to the appropriate shared Falcon library.

Start local. Promote to shared later only when reusable.

---

## Angular Conversion Rules

Do not translate React line by line.

Convert React concepts into Angular correctly.

```txt
React useState       → Angular signal/component state
React useEffect      → ngOnInit/effect only when needed
React props          → Angular @Input
React callbacks      → Angular @Output
React map            → Angular @for
React conditional UI → Angular @if
React children       → ng-content/templates where needed
React className      → Angular class/class bindings/Tailwind
React controlled form → Angular typed forms or local state
```

Use Angular 21 best practices.

Prefer:

- standalone components
- typed inputs/outputs
- signals when useful
- clean template structure
- Tailwind utility classes
- existing Falcon components
- simple services only when needed

Avoid:

- direct React-style translation
- large untyped objects
- excessive `any`
- fake mock logic unless Ammar asked for mock data
- unnecessary global stores
- unnecessary RxJS complexity

---

## Table + Dropdown Composition Rule

If the source screen has a table with dropdowns, filters, row actions, badges, or custom cells:

Use Falcon table and compose it with Falcon components.

Do:

```txt
Falcon table
Falcon dropdown filters
Falcon input search
Falcon badge cells
Falcon menu row actions
Falcon skeleton loading
Falcon empty state
Typed column config
Simple state management
```

Do not:

```txt
Create a new table engine
Hardcode dropdown HTML inside the table
Create duplicate dropdown logic
Overbuild advanced features not visible in the source
```

Only implement the table features that the source screen actually shows.

The table should support only what the screen needs:

- search
- filters
- dropdown filters
- sort
- pagination
- row actions
- status badges
- selectable rows
- custom cells
- empty state
- loading skeleton
- responsive scroll

Do not add advanced table features that are not requested or visible.

Keep table configuration simple and typed.

---

## Dropdown and Filter Rule

If the React screen has dropdowns or filters:

- use Falcon dropdown
- keep options typed
- support selected state
- support clear/reset only if visible or needed
- support disabled/loading state only if needed
- connect dropdowns to the table/list only through simple state or signals

Do not create a new dropdown implementation.

Do not embed custom dropdown HTML inside the table.

---

## Modal / Drawer Rule

If the React screen has a modal, drawer, side panel, edit form, add form, details view, or confirmation popup:

Use the existing Falcon modal/drawer/right-side panel pattern.

Do not create a new modal system.

Split modal/drawer into its own component only when:

- it has a form
- it has multiple actions
- it is reused
- it makes the page too large
- it has independent logic

Otherwise keep it local.

---

## Styling Rule

The converted Angular screen must visually match the React screen or screenshot.

Match:

- spacing
- layout
- typography
- colors
- border radius
- shadows
- density
- table style
- card style
- dropdown style
- hover/focus states
- active states
- selected states
- loading state
- empty state
- responsive behavior

Use:

```txt
Tailwind-first classes
Falcon tokens
Existing CSS variables
Existing theme utilities
Existing component variants
```

Avoid:

```txt
Random hardcoded colors
Large custom SCSS files
Inline styles
Copied React CSS without cleanup
PrimeNG classes for new UI
Messy !important overrides
Duplicated design values
```

If the source has a color, radius, shadow, or spacing that does not exist in Falcon tokens, first map it to the nearest existing token.

Only create a new token or variant if needed to match the source accurately.

---

## Architecture Placement Rule

Before creating files, decide where they belong:

```txt
App-specific screen:
apps/{app-name}/src/app/features/{feature-name}

Reusable business UI:
libs/falcon/src/shared-ui or existing shared UI location

Design-system component:
libs/falcon-ui-core and Angular wrapper, only if truly reusable

Theme/tokens:
libs/falcon-theme or libs/falcon-ui-tokens

SDK/data contracts:
libs/sdk or existing facade/service location
```

Do not move code into shared libraries too early.

Do not create a design-system component just because one screen needs it.

Start local. Promote to shared only when the pattern is repeated or clearly reusable.

Do not modify unrelated features.

Do not break Module Federation.

---

## Data and Logic Rule

Preserve the business behavior from the React source when relevant, but adapt it to Falcon Angular patterns.

For UI-only conversion:

- keep data local as typed mock data only if no API exists
- mark mock data clearly
- do not invent backend contracts

For real app integration:

- use existing services/facades
- use existing DTOs
- follow existing API patterns
- do not break current data flow
- do not rename backend fields unless required

Keep logic simple and close to the screen unless it is reused.

---

## Required Output Before Implementation

Before coding, provide a short implementation plan:

```txt
Selected source screen:
Target Angular app:
Target route:
Target feature folder:
Screen sections:
Falcon component mapping:
Files to create:
Files to modify:
What will not be changed:
```

Keep it short and practical.

Do not write a huge architecture essay.

---

## Required Output After Each RAGE MODE Pass

After each pass, provide:

```txt
Pass number:
What was implemented:
What still does not match:
Root cause:
Fix applied:
Next verification target:
```

Do not hide mismatches.

Do not pretend the result is complete if it is not.

---

## Final Completion Criteria

Only mark the task complete when:

```txt
The selected Angular screen matches the React/screenshot reference as closely as possible.
All visible layout differences are fixed.
All spacing and alignment issues are fixed.
Falcon components are used wherever available.
No duplicate components were created.
Tailwind and Falcon tokens are used.
No over-engineering was introduced.
No unrelated files were changed.
The target app builds successfully.
```

Final response must include:

```txt
Implemented:
Files changed:
Falcon components used:
New components created, if any:
RAGE MODE fixes applied:
Remaining limitations, if any:
How to test:
```

Also include relevant build/test commands, for example:

```bash
nx build admin-console
nx serve host-shell
nx lint admin-console
```

Use the correct app name depending on the target.

---

## Strict Rules

### Do

- Use existing Falcon components.
- Match the React screen visually.
- Convert section by section.
- Keep implementation simple.
- Use Tailwind-first styling.
- Respect Falcon tokens.
- Respect Nx boundaries.
- Keep app-specific code inside the app.
- Promote to shared only when needed.
- Preserve existing behavior.
- Keep the code typed.
- Add loading/empty/error states only when needed.
- Reuse existing services when integrating real data.
- Re-check the result after implementation.
- Fix visible mismatches.

### Do Not

- Do not convert the whole React project unless requested.
- Do not blindly translate React line by line.
- Do not create duplicate Falcon components.
- Do not create a new table/dropdown/modal/button if one already exists.
- Do not over-engineer.
- Do not add global state unnecessarily.
- Do not create massive abstractions.
- Do not move code to shared libraries too early.
- Do not use PrimeNG for new UI unless required by legacy code.
- Do not hardcode colors everywhere.
- Do not delete old implementation unless Ammar explicitly asks.
- Do not break existing routes.
- Do not change unrelated features.
- Do not stop after the first working version if it does not visually match.
- Do not mark complete while visible differences remain.

---

## Acceptance Criteria

The conversion is successful only when:

- The Angular screen visually matches the React screen or screenshot as closely as possible.
- The screen is divided into logical sections.
- Existing Falcon components are reused.
- No duplicate UI components are created.
- The implementation is not over-engineered.
- The code is clean and maintainable.
- The layout is responsive.
- Tailwind and Falcon tokens are used.
- Existing app behavior is not broken.
- Nx boundaries are respected.
- The target app builds successfully.
- RAGE MODE verification was performed.
- Remaining limitations are clearly documented, if any.

---

## Short Brain Trigger

Whenever Ammar provides a React screen, React project, screenshot, or design reference and asks to copy/convert it into Falcon Angular, activate:

**Falcon React-to-Angular Screen Composer — RAGE MODE**

Always:

1. Select only the requested screen or section.
2. Analyze the visual layout and behavior.
3. Divide the screen into practical sections.
4. Map each section to existing Falcon components.
5. Use Falcon table, dropdown, modal, drawer, input, button, card, tabs, stepper, skeleton, badge, tooltip, and icon components wherever available.
6. Implement in Angular using Tailwind-first styling and Falcon tokens.
7. Keep app-specific code inside the app feature folder.
8. Promote to shared libs only when truly reusable.
9. Avoid over-engineering, unnecessary abstractions, duplicate components, and global state.
10. Match the React UI visually while respecting Falcon architecture.
11. Compare the result against the source.
12. If it does not match, find the root cause, fix it, and repeat.

The React screen or screenshot is the visual truth.

Falcon Angular architecture is the implementation truth.

Do not stop at the first working version.

Working is not enough.

The screen must look right.
