---
name: falcon-project-abstraction-understanding
description: Understand the Falcon Front-End project from an abstraction and architecture level before implementing changes. Use this skill before analyzing, refactoring, designing, or generating code for the Falcon Angular/Nx/Micro Frontend workspace.
---

# Falcon Project Abstraction Understanding Skill

## Purpose

Use this skill whenever you need to understand the Falcon project before making decisions.

This skill is not for jumping directly into code changes.  
It is for building a correct mental model of the project from the top down:

1. Business/domain purpose
2. Workspace architecture
3. Application boundaries
4. Shared library boundaries
5. Component abstraction layers
6. UI system conventions
7. Theme/token system
8. Routing and feature ownership
9. API integration patterns
10. Risk and regression areas

The goal is to understand **why the project is structured this way** before deciding **where and how to implement** a change.

---

# When to Use This Skill

Use this skill before:

- Reviewing the Falcon project
- Adding a new page
- Adding a new feature
- Moving a component to a shared library
- Creating or modifying Falcon UI components
- Replacing PrimeNG usage with Falcon components
- Refactoring organization hierarchy
- Working on admin-console or management-console
- Working on host-shell routing or authentication
- Working on theme tokens or design system
- Creating a component showcase / component gallery
- Generating implementation plans
- Writing prompts for another AI agent
- Performing architecture reviews
- Fixing bugs that may affect multiple apps

Do **not** start implementation until the abstraction map is clear.

---

# Project Identity

The Falcon front-end project is an enterprise Angular workspace built with Nx.

It contains multiple applications and shared libraries.

The project uses a Micro Frontend architecture with Module Federation.

The main applications are:

- `host-shell`
- `admin-console`
- `management-console`

The system has an evolving internal design system called Falcon UI.

Falcon UI is intended to reduce direct dependency on third-party UI implementations and create a consistent internal component layer.

PrimeNG may still exist in parts of the system, but the strategic direction is to move toward Falcon-owned UI components and theme tokens.

---

# Top-Level Mental Model

Always understand the project using this hierarchy:

```text
Falcon Workspace
├── Host Shell
│   ├── Authentication
│   ├── Shell routing
│   ├── Layout
│   └── Remote loading
│
├── Admin Console
│   ├── Organization hierarchy
│   ├── Users
│   ├── Clients
│   ├── Wallet/balance features
│   └── Admin-side workflows
│
├── Management Console
│   ├── Management-side workflows
│   ├── Wallet/balance features
│   └── Business operations
│
├── Falcon Shared Libraries
│   ├── Shared UI components
│   ├── Falcon UI wrappers
│   ├── Theme tokens
│   ├── Services
│   ├── Models
│   └── Utilities
│
└── Falcon UI System
    ├── Angular wrappers
    ├── Cross-framework UI components
    ├── Skeletons
    ├── Component previews
    ├── Component showcase
    └── Design tokens
```

---

# Primary Architecture Rules

## 1. Do Not Treat Apps as Isolated Islands

Before changing a feature, check whether the same pattern exists in:

- `admin-console`
- `management-console`
- shared libraries
- host shell
- Falcon UI components

Many bugs happen because a fix is applied to one app but not the other.

Always ask:

```text
Is this behavior shared?
Is this component duplicated?
Should this live in a shared library?
Does management-console need the same fix?
Does admin-console need the same fix?
```

---

## 2. Prefer Falcon UI Components Over Direct Vendor Usage

When building new UI, prefer Falcon-owned components.

Use existing Falcon components where available:

- Falcon input
- Falcon dropdown
- Falcon tabs
- Falcon stepper
- Falcon tree
- Falcon modal / right-side drawer pattern
- Falcon table
- Falcon button
- Falcon skeleton
- Falcon icon abstraction

Do not introduce new PrimeNG usage unless the project has no Falcon alternative and the decision is intentional.

If PrimeNG is used internally, keep it behind Falcon abstraction where possible.

---

## 3. Tailwind-First Styling

Prefer Tailwind utility classes for layout, spacing, sizing, alignment, and responsive behavior.

Use SCSS only when:

- Tailwind cannot express the behavior cleanly
- complex component internals require scoped styles
- animation or deeply nested third-party overrides are required
- token mapping needs CSS variable definitions

Avoid unnecessary SCSS proliferation.

Avoid hard-coded values when a token should exist.

---

## 4. Respect the Token System

The project is moving toward a token-driven design system.

When styling components, prefer CSS variables and design tokens.

Recommended token thinking:

```text
Global/system token:
--psk-{property}-{mode}

Component token:
--sk-{component}-{part}-{property}-{state}-{mode}
```

Examples:

```text
--psk-color-primary-light
--psk-radius-md-light
--sk-input-border-color-focus-light
--sk-modal-header-padding-default-light
```

When adding visual styles, ask:

```text
Should this be a design token?
Is this value repeated?
Is this component-specific or global?
Does it need light and dark mode?
Does this affect theming?
```

---

## 5. Keep Implementation Local Until Reuse Is Proven

Do not move code to shared libraries too early unless:

- it is already reused
- it is clearly part of the design system
- multiple apps need it
- the component is generic and not domain-specific
- it can be documented and tested as a reusable abstraction

A component can be:

```text
Domain component:
Specific to organization hierarchy, wallets, clients, users, etc.

Shared app component:
Reusable across admin-console or management-console.

Falcon UI component:
Reusable across the entire platform and design system.
```

Do not confuse these levels.

---

# Abstraction Layers

Use this model before deciding where code belongs.

## Layer 1: Domain Feature

Belongs inside an app feature folder.

Examples:

```text
apps/admin-console/src/app/features/organization-hierarchy
apps/admin-console/src/app/features/wallet-balance-management
apps/management-console/src/app/features/wallet-balance-management
```

Use this layer for:

- business workflows
- API orchestration
- page state
- feature-specific forms
- feature-specific validation
- domain-specific layout

---

## Layer 2: Shared Feature Utility

Belongs in shared libs if multiple apps need the same behavior.

Use this layer for:

- shared services
- shared DTOs/models
- shared mappers
- shared helpers
- reusable feature-specific UI that is not generic enough for Falcon UI

---

## Layer 3: Falcon UI Component

Belongs in the Falcon UI/component library.

Use this layer for:

- generic input
- generic dropdown
- generic button
- generic tabs
- generic stepper
- generic tree
- generic modal/drawer
- generic skeleton
- generic table/cell behavior
- component preview/showcase examples

A Falcon UI component should not know about:

- organization hierarchy APIs
- wallet APIs
- admin-console routes
- management-console routes
- business-specific DTOs

It should accept inputs/outputs and be reusable.

---

## Layer 4: Design System / Tokens

Belongs in theme/token libraries.

Use this layer for:

- colors
- spacing
- radius
- shadows
- typography
- component tokens
- dark/light mode variants
- PrimeNG mapping tokens if still needed

---

# Folder Naming Guidance

For a visual landing page that shows custom components, skeletons, and page previews, use:

```text
falcon-ui-showcase
```

Recommended names:

```text
Menu label: Falcon UI Showcase
Route: /admin-console/falcon-ui-showcase
Feature folder: falcon-ui-showcase
Main page component: FalconUiShowcasePageComponent
Registry file: falcon-ui-showcase.registry.ts
```

Recommended structure:

```text
features/falcon-ui-showcase/
├── pages/
│   └── falcon-ui-showcase-page/
├── components/
│   ├── showcase-sidebar-menu/
│   ├── component-preview-card/
│   ├── component-state-preview/
│   └── skeleton-preview/
├── data/
│   └── falcon-ui-showcase.registry.ts
└── models/
    └── falcon-ui-showcase.models.ts
```

Use `showcase` when the purpose is visual preview and documentation.

Use `playground` only if developers can interactively edit props, tokens, or states.

Use `design-system` only if it includes full documentation, rules, accessibility, tokens, and usage guidelines.

---

# How to Analyze the Project

When asked to understand or modify the Falcon project, follow this process.

## Step 1: Identify the Request Type

Classify the request as one of:

```text
Architecture understanding
Feature implementation
Bug fix
UI polish
Component abstraction
Design system/token work
Migration/refactor
Performance/bundle review
Prompt creation for another AI
```

Then decide which project areas may be affected.

---

## Step 2: Build the Project Map

Inspect:

```text
package.json
nx.json
project.json files
tsconfig base paths
module federation config
app routes
feature folders
shared library exports
theme/token folders
component library folders
```

Create a mental map of:

```text
apps
libs
routing
dependency boundaries
shared components
API services
theme system
```

Do not modify files yet.

---

## Step 3: Identify Ownership

For every file you plan to change, classify it:

```text
App-owned
Feature-owned
Shared-lib-owned
Falcon-UI-owned
Theme/token-owned
Generated/build/config-owned
```

Do not place business logic inside Falcon UI components.

Do not place generic UI logic inside domain feature components if it is already reusable.

---

## Step 4: Check Existing Patterns

Before creating anything new, search for existing patterns:

```text
existing stepper usage
existing modal/drawer usage
existing skeleton usage
existing Falcon input usage
existing Falcon tree usage
existing route conventions
existing registry conventions
existing token usage
existing empty/loading/error states
```

Match the project’s style instead of inventing a new one.

---

## Step 5: Decide the Correct Abstraction

Use this decision matrix:

```text
If it is only for one page:
  keep it inside that page/feature.

If it is used by multiple pages inside the same feature:
  put it under that feature's components folder.

If it is used by multiple features in one app:
  consider an app shared area.

If it is used by admin-console and management-console:
  move it to shared libs.

If it is generic UI:
  move it to Falcon UI.

If it is a visual rule:
  move it to tokens/theme.
```

---

## Step 6: Plan Minimal Safe Changes

Before implementation, produce a plan with:

```text
Files to add
Files to update
Routes to register
Components to reuse
Services to reuse
Styles/tokens to use
Tests or checks to run
Regression areas
```

Prefer small, targeted changes.

Avoid broad rewrites unless explicitly requested.

---

# Component Showcase Rules

When working on the Falcon UI Showcase:

## Required Sections

The page should support these sections:

```text
Overview
Components
Skeletons
States
Usage Examples
Page Previews
Design Tokens
Accessibility Notes
```

## Component Registry

Use a registry instead of hard-coding all menu items directly in templates.

Example concept:

```ts
export interface FalconUiShowcaseItem {
  id: string;
  label: string;
  category: 'input' | 'overlay' | 'navigation' | 'data-display' | 'feedback' | 'layout';
  description: string;
  componentName: string;
  route?: string;
  tags?: string[];
  hasSkeleton?: boolean;
  hasDarkMode?: boolean;
  status: 'ready' | 'in-progress' | 'planned';
}
```

The registry should drive:

- sidebar/menu
- search
- category filters
- preview cards
- skeleton availability
- component status
- usage examples

---

## Naming Rules for Showcase Components

Use these names:

```text
FalconUiShowcasePageComponent
FalconUiShowcaseShellComponent
FalconUiShowcaseSidebarComponent
FalconUiShowcaseMenuComponent
FalconUiShowcasePreviewCardComponent
FalconUiShowcaseStatePreviewComponent
FalconUiShowcaseSkeletonPreviewComponent
FalconUiShowcaseTokenPanelComponent
```

Avoid vague names:

```text
TestPage
DemoPage
UiPage
ComponentPage
NewDesign
TempComponent
```

---

# Skeleton Rules

Each Falcon component should have a matching skeleton state when applicable.

Skeletons should:

- match the real component shape
- use the same spacing and layout footprint
- avoid layout shift
- support light and dark mode if the component does
- use design tokens where possible
- be reusable in page-level loading states

Do not create skeletons that look unrelated to the final component.

---

# UI State Rules

For every component or page preview, consider these states:

```text
Default
Loading
Skeleton
Empty
Error
Disabled
Hover
Focus
Selected
Expanded
Collapsed
Read-only
Dark mode
Responsive/mobile
```

Do not show only the happy path.

---

# Organization Hierarchy Focus Area

The organization hierarchy feature is a high-risk area.

Before changing it, inspect:

```text
organization hierarchy routes
tree component usage
right-click/context menu logic
add user flow
add client flow
add node flow
edit node flow
drawer/modal behavior
selection state
expand/collapse state
API data mapping
shared tree component
```

Important expectations:

- Preserve existing behavior unless explicitly replacing it.
- Do not break add user stepper.
- Do not break add client stepper.
- Do not break add node/edit node behavior.
- Preserve tree expand/collapse behavior.
- Preserve selected node behavior.
- Avoid timers or artificial delays when applying child data.
- Avoid unnecessary horizontal scroll.
- Use truncation + tooltip where labels are long.

---

# Wallet and Balance Focus Area

Wallet/balance behavior may exist in both admin-console and management-console.

Before changing it, check both apps.

Important domain rules:

```text
Wallet Types:
- SingleWallet = 1
- MultipleWallets = 2

Balance Types:
- Node Based
- User Based
```

Common regression risk:

- Fixing admin-console but missing management-console
- Wrong source wallet selection behavior
- Currency value reset in modal
- Skeleton/loading behavior mismatch
- Duplicate success toasts during polling

---

# Authentication Focus Area

Host-shell owns authentication flows.

Important concepts:

```text
Login
OTP verification
Password change required
Authenticated state
Refresh/session resume
```

Authentication stage mapping may need to align with backend values.

Do not break refresh behavior or session resume logic.

---

# Prompt Creation Mode

When the user asks for a prompt for Claude, produce:

1. Clear objective
2. Exact target files/folders when known
3. Constraints
4. Existing patterns to inspect first
5. Implementation requirements
6. Acceptance criteria
7. Regression checks
8. Explicit “do not change unrelated behavior”

The prompt should be copy-paste ready.

Avoid vague prompts.

---

# Implementation Guardrails

Always follow these guardrails:

- Do not delete existing implementation unless explicitly requested.
- Do not rewrite large areas without need.
- Do not introduce new styling systems.
- Do not mix domain logic into Falcon UI components.
- Do not duplicate components if a Falcon component already exists.
- Do not hard-code theme values when tokens should be used.
- Do not fix only one app if another app has the same behavior.
- Do not ignore Module Federation boundaries.
- Do not ignore Nx dependency boundaries.
- Do not create circular dependencies.
- Do not create barrel exports that break lazy loading or bundle splitting.
- Do not add console logs unless needed for debugging and removed afterward.

---

# Output Format for Architecture Analysis

When analyzing the project, produce this structure:

```md
# Falcon Project Understanding

## 1. What this area does
Explain the business and technical purpose.

## 2. Where it lives
List apps, libs, routes, and folders.

## 3. Current abstraction level
Explain whether it is app-level, shared-level, Falcon UI-level, or token-level.

## 4. Existing patterns
Mention reusable components, services, routes, and conventions.

## 5. Recommended abstraction
Explain where the new/changed code should live and why.

## 6. Risks
List likely regressions.

## 7. Safe implementation plan
Give small steps.

## 8. Acceptance criteria
Give concrete checks.
```

---

# Output Format for Code Change Plan

When planning implementation, produce:

```md
# Implementation Plan

## Objective
...

## Files to inspect first
...

## Files to add
...

## Files to update
...

## Component reuse map
...

## Styling/token approach
...

## Routing changes
...

## State handling
...

## Regression checks
...

## Acceptance criteria
...
```

---

# Output Format for Claude Prompt

When writing a prompt for Claude, produce:

```md
# Prompt for Claude

You are working inside the Falcon Angular/Nx front-end workspace.

## Goal
...

## Context
...

## Required implementation
...

## Existing patterns to inspect first
...

## Component mapping
...

## Styling rules
...

## Architecture rules
...

## Do not change
...

## Acceptance criteria
...

## Regression checklist
...
```

---

# Best Default Recommendation

For the custom component library landing page, use:

```text
Falcon UI Showcase
```

Use this naming:

```text
Menu: Falcon UI Showcase
Route: /admin-console/falcon-ui-showcase
Folder: falcon-ui-showcase
Main component: FalconUiShowcasePageComponent
Registry: falcon-ui-showcase.registry.ts
```

Use this concept:

```text
A developer-facing visual catalog for Falcon UI components, skeletons, states, page previews, and token-driven examples.
```

---

# Final Rule

Before changing code, always understand the abstraction first.

Do not ask only:

```text
Where should I put this file?
```

Ask:

```text
What abstraction level does this belong to?
Who owns this behavior?
Is this domain logic, reusable feature logic, Falcon UI logic, or theme/token logic?
What apps can this affect?
What existing pattern should I follow?
```

This is the correct way to work inside the Falcon project.
