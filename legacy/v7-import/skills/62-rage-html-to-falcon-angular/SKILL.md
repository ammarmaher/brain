---
name: rage-html-to-falcon-angular
description: Convert a single-file Claude Design HTML export with embedded CSS and JavaScript into a real Falcon Angular/Nx implementation. Use this skill when the user provides "rage HTML", raw HTML/CSS/JS, or a one-file design export and wants it rebuilt as Angular components using Falcon UI, Tailwind, and design tokens.
---

# Rage HTML to Falcon Angular Skill

## Purpose

This skill converts a single HTML file that contains:

```html
<style>
  /* CSS */
</style>

<body>
  <!-- HTML -->
</body>

<script>
  // JavaScript
</script>
```

into a real Angular/Falcon Angular implementation.

The source HTML file may come from:

- Claude Design
- Stitch
- screenshot-to-code tools
- AI design generators
- copied static prototypes
- hand-written HTML/CSS/JS mockups
- one-file landing page prototypes

The source file is called **Rage HTML** because it may contain everything in one file: layout, styles, animations, mock data, and JavaScript behavior.

This skill must cleanly separate that one-file prototype into Angular structure, Falcon components, Tailwind utilities, TypeScript behavior, and design tokens.

---

# Hard Rule

Do **not** keep the HTML file as-is.

Do **not** inject the file into Angular using `innerHTML`.

Do **not** keep `<script>` tags.

Do **not** copy raw JavaScript into Angular.

Do **not** rely on `document.querySelector`, `getElementById`, manual DOM mutation, or global event listeners unless there is a very specific justified exception.

Do **not** create raw controls when Falcon components already exist.

The final output must be real Angular code.

---

# Target Output

Convert the Rage HTML into one or more Angular files, for example:

```text
feature-name/
├── pages/
│   └── feature-name-page/
│       ├── feature-name-page.component.ts
│       ├── feature-name-page.component.html
│       └── feature-name-page.component.scss      optional only when needed
├── components/
│   ├── feature-card/
│   ├── feature-table/
│   ├── feature-toolbar/
│   └── feature-empty-state/
├── models/
│   └── feature-name.models.ts                    optional
├── data/
│   └── feature-name.config.ts                    optional
└── services/
    └── feature-name.service.ts                   optional
```

Use a single Angular component only if the UI is small.

Split into smaller components if the HTML contains clear reusable or complex sections.

---

# Best Use Case

This skill is ideal when the user says:

- I have HTML/CSS/JS in one file; convert it to Angular.
- Claude Design generated HTML; make it Angular.
- Convert this static HTML page to Falcon Angular.
- Take this HTML design and implement it in my Angular project.
- This file has all CSS and JS inside it; make it a clean Angular component.
- Make this Rage HTML work in Falcon.
- Use our Falcon components instead of raw HTML controls.

---

# Required Process Before Coding

Before implementing, always produce a plan.

Use this structure:

```md
# Rage HTML to Falcon Angular Plan

## 1. Source summary
Explain what the HTML file/page appears to do.

## 2. Layout breakdown
Break the page into zones: header, toolbar, hero, filters, cards, table, modal, footer, etc.

## 3. Detected UI components
List every visible or implied component.

## 4. JavaScript behavior map
List click handlers, toggles, filters, tabs, dropdowns, modals, animations, data arrays, timers, API calls, and DOM manipulation.

## 5. Falcon component mapping table
Map every raw UI part to Falcon components.

## 6. Angular component structure
Explain the final Angular components and folders.

## 7. State and event conversion
Explain how JS variables, events, DOM class toggles, and dynamic rendering become Angular state, signals, bindings, outputs, or services.

## 8. Styling and token conversion
Explain what becomes Tailwind and what becomes Falcon tokens/CSS variables.

## 9. Files to create/update
List exact files where possible.

## 10. Risks/manual review
Mention anything that cannot be safely converted automatically.

## 11. Acceptance criteria
Define visual, functional, build, and architecture checks.
```

Do not start coding until this plan is clear.

---

# Source Analysis Rules

When reading the Rage HTML file, extract:

```text
HTML structure
CSS classes
CSS variables
colors
spacing
typography
border radius
shadows
animations
media queries
JavaScript state variables
JavaScript event handlers
DOM queries
DOM mutations
mock data
API calls
timers
modal behavior
dropdown behavior
table behavior
form validation
loading/empty/error behavior
responsive behavior
```

Then decide how each piece should become Angular.

---

# HTML to Angular Mapping

Use this mapping:

```text
HTML structure                     -> Angular template
Static repeated blocks             -> @for over data/config
Conditional sections               -> @if
Class changes                      -> [class.*], [ngClass], computed class map
Inline event handlers              -> Angular event bindings
HTML forms                         -> Angular reactive forms or approved signal forms
Input attributes                   -> Falcon input bindings
Select elements                    -> Falcon dropdown
Buttons                            -> Falcon button
Tables                             -> Falcon table
Dialog/modal markup                -> Falcon modal/drawer
Loading placeholders               -> Falcon skeleton
Static mock data                   -> TypeScript config or mock data file
External links/assets              -> Angular asset paths
```

Do not keep static repeated HTML when it should be data-driven.

---

# CSS to Tailwind/Token Mapping

Convert CSS carefully.

## Use Tailwind for:

```text
layout
display
flex
grid
gap
padding
margin
width
height
alignment
positioning
overflow
responsive behavior
text truncation
z-index when simple
```

## Use Falcon design tokens/CSS variables for:

```text
colors
background colors
border colors
focus colors
radius
shadow
typography values
state colors
dark/light mode values
component-specific theme values
```

## Keep component SCSS only for:

```text
complex animations
pseudo-elements
deep component internals
advanced selectors
media queries that are awkward in Tailwind
rare cases where Tailwind is not enough
```

Do not blindly copy CSS.

Convert visual intent to Falcon/Tailwind/token style.

---

# JavaScript to Angular TypeScript Mapping

Convert JavaScript behavior into Angular TypeScript.

Use this mapping:

```text
let state = ...                    -> signal(), component field, or FormControl
array data                         -> readonly config/model data
click handler                      -> component method
input handler                      -> form control/value signal
classList.add/remove/toggle        -> Angular class binding
style mutation                     -> Angular style binding or token/class change
querySelector/getElementById       -> Angular binding, template reference, or ViewChild only if necessary
addEventListener                   -> template event binding or HostListener
setTimeout/setInterval             -> RxJS/timer/effect with cleanup
fetch/ajax                         -> Angular HttpClient service
localStorage                       -> Angular service wrapper if repeated
manual rendering with innerHTML    -> Angular template with @for/@if
modal open/close JS                -> Angular signal + Falcon modal/drawer
tab switching JS                   -> Angular state + Falcon tabs
dropdown JS                        -> Falcon dropdown
table sorting/filtering JS         -> Falcon table APIs or Angular computed data
```

Avoid manual DOM manipulation.

---

# Falcon Component Mapping

Always map raw HTML controls to existing Falcon components first.

Use this default mapping:

```text
input                       -> Falcon input
textarea                    -> Falcon textarea or Falcon input variant
select                      -> Falcon dropdown
custom dropdown             -> Falcon dropdown
button                      -> Falcon button
icon button                 -> Falcon button + Falcon icon
table                       -> Falcon table
tabs                        -> Falcon tabs
stepper                     -> Falcon stepper
tree                        -> Falcon tree
modal/dialog                -> Falcon modal
right side panel            -> Falcon drawer/right-modal pattern
card                        -> Falcon card if available, otherwise Tailwind wrapper
badge/chip/status           -> Falcon badge/chip/status component if available
toast/alert/message         -> Falcon toast/alert/message
loader/loading block        -> Falcon skeleton
empty state                 -> Falcon empty-state pattern
pagination                  -> Falcon table pagination or Falcon pagination
search field                -> Falcon input with icon
filter menu                 -> Falcon dropdown/menu component
```

If a Falcon component does not exist, create the smallest local wrapper needed.

Do not create a new generic Falcon UI component unless the component is clearly reusable across the platform.

---

# Component Composition Rule

If the Rage HTML contains a complex component, compose it from Falcon components.

Example: HTML table with dropdowns inside cells.

Correct:

```text
FeaturePermissionTableComponent
├── FalconTableComponent
│   ├── FalconDropdownComponent in cell template
│   ├── FalconInputComponent in editable cell
│   ├── FalconButtonComponent for row actions
│   └── FalconSkeletonComponent while loading
```

Wrong:

```text
Raw <table>
Raw <select>
Manual dropdown JS
Duplicated table filtering logic
Hard-coded one-off CSS
```

Delegation rule:

```text
Table handles row/table layout.
Dropdown handles dropdown behavior.
Input handles input behavior.
Button handles action trigger.
Wrapper handles data mapping and event orchestration.
Service handles API.
```

---

# Dynamic Config Rule

If the HTML contains repeated patterns, convert them to config-driven data.

Use config for:

```text
cards
dashboard metrics
menus
tabs
table columns
filters
form fields
stepper steps
action buttons
status badges
empty states
skeleton rows
```

Example:

```ts
export interface RageHtmlTableColumn<T = unknown> {
  key: keyof T | string;
  label: string;
  type: 'text' | 'number' | 'date' | 'status' | 'input' | 'dropdown' | 'actions' | 'custom';
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  sortable?: boolean;
  filterable?: boolean;
  options?: readonly FalconDropdownOption[];
}
```

Avoid copying 20 repeated card/table rows manually into the template.

---

# Angular Structure Rules

Use Angular standalone components unless the project uses a different established convention.

Use modern Angular template control flow:

```html
@if (loading()) {
  ...
} @else {
  ...
}

@for (item of items(); track item.id) {
  ...
}
```

Use signals/computed where appropriate.

Use reactive forms for real forms.

Use services for API calls.

Use DTO/model files when the page has meaningful data structures.

---

# Falcon/Nx Architecture Rules

Respect project boundaries.

Before placing files, decide the abstraction level:

```text
Page-specific UI:
  app feature folder

Feature-specific reusable component:
  feature/components

Reusable cross-feature UI:
  shared library

Generic design-system UI:
  Falcon UI library

Theme values:
  token/theme library
```

Do not put domain-specific business logic into Falcon UI components.

Do not move code to shared libs unless reuse is clear.

Respect Nx dependency boundaries.

Respect Module Federation boundaries.

---

# Styling Guardrails

Do not introduce:

```text
large copied CSS files
global CSS pollution
!important unless justified
deep selectors unless necessary
hard-coded theme colors
random box-shadow values when token exists
random border-radius values when token exists
unnecessary SCSS for simple layout
```

Prefer:

```text
Tailwind utility classes
Falcon tokens
component variants
small scoped SCSS only when needed
```

---

# Animation Rules

If the HTML has CSS/JS animations:

```text
CSS keyframes        -> scoped component SCSS if complex
simple transitions   -> Tailwind transition utilities
JS animation toggles  -> Angular state/class binding
scroll animations     -> Angular-safe directive/service only if needed
hover animations      -> Tailwind/group classes where possible
```

Do not keep animation scripts that manipulate DOM directly if Angular bindings can do it.

---

# Form Rules

Convert HTML forms into Angular forms.

```text
input state       -> FormControl
form state        -> FormGroup
validation        -> Angular validators
submit            -> Angular method
field errors      -> Angular template validation
disabled fields   -> control disabled state or component input
```

Use Falcon form controls.

Do not keep raw input/select/textarea unless there is no Falcon equivalent and the exception is documented.

---

# Table Rules

If the HTML contains tables:

1. Check for Falcon table.
2. Use Falcon table first.
3. Convert column definitions into config.
4. Use cell templates for dropdowns, inputs, badges, chips, and action buttons.
5. Preserve loading, empty, pagination, sorting, filtering, and responsive behavior.

Do not create a new raw table unless Falcon table cannot support the required structure.

---

# Modal / Drawer Rules

If the HTML contains a modal, dialog, side panel, or right drawer:

1. Use Falcon modal/drawer pattern.
2. Convert open/close JS into Angular signal/state.
3. Move content into Angular template.
4. Use Falcon buttons and form controls.
5. Preserve close behavior, backdrop, escape behavior, and unsaved-change behavior where applicable.

---

# Output Format for Final Implementation Summary

After implementing, summarize:

```md
# Rage HTML Conversion Complete

## Converted source
...

## Angular files created/updated
...

## Falcon components reused
...

## Behavior converted
...

## Styling converted
...

## Manual review items
...

## Verification
- Angular build:
- No script tags:
- No raw JS DOM manipulation:
- Falcon components reused:
- Tailwind/tokens used:
- Visual match:
```

---

# Claude Prompt Mode

When the user asks for a prompt, output this:

```md
# Prompt for Claude

You are working inside the Falcon Angular/Nx workspace.

## Goal

Convert the provided Rage HTML file into a real Angular/Falcon Angular implementation.

The Rage HTML file may contain HTML, CSS, and JavaScript all inside one file.

## Hard Rules

Do not keep the HTML file as-is.
Do not inject it with innerHTML.
Do not keep script tags.
Do not copy raw JS into Angular.
Do not use document.querySelector/getElementById/manual DOM manipulation unless there is a justified exception.
Do not create raw controls when Falcon components already exist.

The source file is only a reference for visual design, layout, behavior, styles, and interactions.

## Required Plan Before Coding

First produce:

1. Source summary
2. Layout breakdown
3. Detected UI components
4. JavaScript behavior map
5. Falcon component mapping table
6. Angular component structure
7. State and event conversion
8. Styling and token conversion
9. Files to create/update
10. Risks/manual review
11. Acceptance criteria

## Conversion Rules

Map:
- HTML structure -> Angular template
- Repeated blocks -> @for over config/data
- Conditional sections -> @if
- CSS layout -> Tailwind utilities
- CSS colors/borders/radius/shadows -> Falcon tokens/CSS variables
- JS variables -> Angular signals/component state/FormControls
- JS events -> Angular event bindings
- JS class toggles -> Angular class bindings/ngClass
- JS DOM queries -> Angular bindings/ViewChild only if needed
- JS data arrays -> TypeScript models/config
- fetch/ajax -> Angular HttpClient service
- form validation -> Angular reactive forms or approved signal forms

## Falcon Component Mapping

Use existing Falcon components first:
- input -> Falcon input
- textarea -> Falcon textarea or Falcon input variant
- select/dropdown -> Falcon dropdown
- button -> Falcon button
- icon -> Falcon icon
- table -> Falcon table
- tabs -> Falcon tabs
- stepper -> Falcon stepper
- tree -> Falcon tree
- modal/dialog/right panel -> Falcon modal/drawer
- card -> Falcon card or Tailwind wrapper
- loading placeholder -> Falcon skeleton
- alert/toast/message -> Falcon alert/toast/message pattern

If the HTML has a complex component, compose it from Falcon components.

Example:
A table with dropdowns inside cells must become FalconTableComponent with FalconDropdownComponent inside cell templates. Do not rebuild table/dropdown behavior manually.

## Styling Rules

Use Tailwind first for layout, spacing, sizing, alignment, overflow, truncation, and responsive behavior.

Use Falcon tokens/CSS variables for colors, borders, radius, shadows, typography, focus states, and dark/light mode.

Keep SCSS only for complex animations, pseudo-elements, advanced selectors, or cases Tailwind cannot express cleanly.

## Architecture Rules

- Use Angular standalone components.
- Respect Falcon Nx workspace boundaries.
- Respect Module Federation boundaries.
- Put page-specific code in the feature folder.
- Put reusable generic UI in Falcon UI only when truly reusable.
- Keep domain logic out of generic Falcon UI components.
- Use shared libs only when reuse is clear.
- Do not introduce direct PrimeNG usage unless wrapped by Falcon.
- Do not change unrelated behavior.
- Do not delete old implementation unless explicitly requested.

## Final Verification

Before finishing, confirm:
- Angular build passes.
- No script tags remain.
- No innerHTML injection.
- No raw JS DOM manipulation unless justified.
- No duplicate raw controls when Falcon components exist.
- Falcon components are reused.
- Tailwind and tokens are used.
- UI visually matches the original Rage HTML.
- JS interactions work as Angular behavior.
```

---

# Final Rule

Rage HTML is not the final product.

Rage HTML is the reference.

The final product must be:

```text
Angular templates
Angular TypeScript
Falcon components
Tailwind layout
Falcon tokens
clean architecture
no script tags
no raw DOM manipulation
```
