*** Create Contact Group — Components ***
*** 2026-05-18 ***

# Create Contact Group — Components

## Component tree

```
CreateContactGroupWizardContainer
├── <falcon-stepper>  (4 steps)
│   ├── Step 1: Upload
│   │   ├── <falcon-uploader> drag/drop
│   │   ├── <falcon-progress-bar> upload progress
│   │   └── <falcon-alert> errors (size, type, etc.)
│   ├── Step 2: Column Config
│   │   ├── <falcon-toggle> "First row is header"
│   │   └── plain <table> with <falcon-input> per column
│   ├── Step 3: Preview
│   │   └── <falcon-angular-data-table> (read-only, 5 rows)
│   └── Step 4: Naming + Share
│       ├── <falcon-input> name
│       ├── <falcon-input> referenceId
│       ├── <falcon-radio-group> share options
│       └── <falcon-multiselect> shared users
└── <falcon-button> Cancel · Previous · Next · Finish
```

## NEW Falcon component needs

- `<falcon-progress-bar>` (if not exists)
- `<falcon-toggle>` (if not exists)
- `<falcon-radio-group>` (if not exists — likely exists)

## Anti-patterns

(Standard — no SCSS, no PrimeNG, no NgForm, no `*ngIf`.)

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [02-STEP_1_UPLOAD](02-STEP_1_UPLOAD.md)
