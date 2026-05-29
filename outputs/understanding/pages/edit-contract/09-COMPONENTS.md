*** Edit Contract — Components ***
*** 2026-05-18 ***

# Edit Contract — Components

> Re-uses the 3 section components from Add (RateCardSection, ContractDetailsSection, AddonsSection). Tab 1 (Info) is direct — no shared sub-component.

## Component tree (NEW UI target)

```
ContractsEditContractComponent
├── <falcon-tabs> (replaces local tab state)
│   ├── Tab "Contract Information"
│   │   ├── <falcon-input> (name)
│   │   ├── <falcon-input> (farabiReferenceId)
│   │   ├── <falcon-calendar> (startDate, [disabled] when frozen)
│   │   ├── <falcon-calendar> (endDate)
│   │   └── <falcon-input-number> (committedValue, [disabled] when frozen)
│   ├── Tab "Rate Card"
│   │   └── <app-contracts-rate-card-section [editable]="!frozen">
│   ├── Tab "Contract Details"
│   │   └── <app-contracts-contract-details-section [editable]="!frozen">
│   └── Tab "Add-ons"
│       └── <app-contracts-addons-section [editable]="!frozen">
└── (Save button lives in container header — calls @ViewChild .submit())
```

## Save button placement

[CODE] container `<app-contracts-cost-management>` line 95 region — Save button is in the node-header action slot. The container holds the `@ViewChild('editContract')` reference and calls `.submit()`.

## See also

- [../add-contract/09-COMPONENTS.md](../add-contract/09-COMPONENTS.md) (Add wizard component tree)
- [06-SECTION_FIELD_FREEZE](06-SECTION_FIELD_FREEZE.md)
