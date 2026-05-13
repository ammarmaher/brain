# Install and Use Rage HTML Skill

Please install and always use the `rage-html-to-falcon-angular` skill whenever I give you a single HTML file from Claude Design, Stitch, screenshot-to-code, or any AI design tool that contains HTML, CSS, and JavaScript together.

## Main instruction

Convert the Rage HTML into real Falcon Angular code.

Do not keep the HTML file as-is.
Do not inject it with innerHTML.
Do not keep script tags.
Do not copy raw JS into Angular.
Do not use document.querySelector/getElementById/manual DOM manipulation unless there is a justified exception.
Do not create raw controls when Falcon components already exist.

## Required process

Before coding, produce:

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

## Conversion rules

- HTML structure -> Angular template
- repeated blocks -> @for
- conditional sections -> @if
- CSS layout -> Tailwind
- CSS theme values -> Falcon tokens/CSS variables
- JS variables -> signals/component state/FormControls
- JS events -> Angular event bindings
- JS class toggles -> Angular class bindings/ngClass
- JS DOM queries -> Angular bindings/ViewChild only if needed
- JS arrays/data -> TypeScript models/config
- fetch/ajax -> Angular HttpClient service
- form validation -> Angular reactive forms

## Falcon mapping

Use Falcon components first:
- input -> Falcon input
- select/dropdown -> Falcon dropdown
- button -> Falcon button
- icon -> Falcon icon
- table -> Falcon table
- tabs -> Falcon tabs
- stepper -> Falcon stepper
- tree -> Falcon tree
- modal/dialog/right panel -> Falcon modal/drawer
- loading -> Falcon skeleton
- alert/toast/message -> Falcon alert/toast/message pattern

## Styling

Use Tailwind first for layout and spacing.
Use Falcon tokens for colors, borders, radius, shadows, typography, focus states, and dark/light mode.

## Final verification

Confirm:
- Angular build passes
- no script tags remain
- no innerHTML injection
- no raw JS DOM manipulation unless justified
- Falcon components are reused
- Tailwind and tokens are used
- UI visually matches the Rage HTML
- interactions work as Angular behavior
