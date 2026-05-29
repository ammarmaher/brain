*** Add Contract — Components ***
*** Falcon component inventory · 2026-05-18 ***

# Add Contract — Components

## Component tree (NEW UI target)

```
ContractsAddWizardComponent
├── <falcon-stepper> (Stencil-backed — replaces legacy <dynamic-stepper>)
│   ├── Step 0: Contract Information
│   │   ├── <falcon-input> (contractName)
│   │   ├── <falcon-input> (farabiReferenceId)
│   │   ├── <falcon-calendar> (startDate)
│   │   ├── <falcon-calendar> (endDate)
│   │   └── <falcon-input-number> (committedValue)
│   ├── Step 1: Rate Card (<app-contracts-rate-card-section>)
│   │   └── plain <table> + @for (rows)
│   │       ├── <falcon-input> (display name)
│   │       ├── <falcon-select> (priceUnit — locked per channel)
│   │       └── <app-contracts-number-input> (priceValue)
│   ├── Step 2: Contract Details (<app-contracts-contract-details-section>)
│   │   ├── <falcon-select> (application)
│   │   ├── <falcon-select> (channel)
│   │   └── matrix table (plain <table> + @for)
│   │       └── <app-contracts-number-input> per cell
│   └── Step 3: Add-ons (<app-contracts-addons-section>)
│       ├── quotas table
│       └── overageRates table
└── <falcon-button> Cancel · Previous · Next/Finish (footer)
```

## Per-component mapping

| Old-UI | New UI | Notes |
|---|---|---|
| `<dynamic-stepper>` (legacy) | `<falcon-stepper>` Stencil-backed | per [MEMORY] Wave 7.x: dynamic-stepper deleted |
| `<falcon-calendar>` | `<falcon-calendar>` | already canonical |
| `<app-contracts-number-input>` (local) | `<falcon-input-number>` OR keep local | local is well-tuned for thousands-sep + decimals=6 |
| `<app-primary-button>`/secondary | `<falcon-button>` primary/secondary | |
| `<app-contracts-rate-card-section>` | same (re-used in Edit too) | template inside uses Falcon UI |
| `<app-contracts-contract-details-section>` | same | |
| `<app-contracts-addons-section>` | same | |

## Anti-patterns to AVOID

| Old-UI thing | Replace with | Reference |
|---|---|---|
| `[(ngModel)]` form binding | Reactive Forms (`FormBuilder`) | [F-022] |
| `*ngIf` / `*ngFor` | `@if` / `@for` | [F-018] |
| Component SCSS | Tailwind utility | [F-017] |
| PrimeNG components | Falcon UI Core | [F-016] |
| Class fields for state | Signals (`signal()`, `computed()`) | Falcon doctrine |
| `Helper.markAllAsTouched()` | reveal errors via `<falcon-validation-host>` | [F-022] |

## Existing Falcon components reused

- `<falcon-calendar>` (Step 1 dates)
- `<falcon-stepper>` (wizard shell)
- (Implicit) `<falcon-svg-icon>` for any icons

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [02-STEP_1_INFO](02-STEP_1_INFO.md) · [03-STEP_2_RATE_CARD](03-STEP_2_RATE_CARD.md) · [04-STEP_3_CONTRACT_DETAILS](04-STEP_3_CONTRACT_DETAILS.md) · [05-STEP_4_ADDONS](05-STEP_4_ADDONS.md)
