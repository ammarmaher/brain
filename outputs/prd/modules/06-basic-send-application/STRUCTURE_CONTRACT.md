*** Basic App — folder/file structure contract (USER RULING 2026-07-12, 2nd part) ***
*** Source of the shape: Brain SK `legacy/v7-import/chains/frontend/component-layout.md` ("the last word
*** on file/folder structure") AS PRACTICED in the live console precedent
*** `apps/admin-console/src/app/features/comm-channels-services/pages/voice-service/` (reviewed feature). ***

# Structure contract — apps/basic-app

## The rule (user, verbatim intent)
Each component gets ITS OWN folder; each (feature-root) folder carries `models/`, `validations/`,
`services/` — everything it uses — exactly like Brain SK / the voice-service precedent. Best practice,
no app-named artifacts outside `apps/basic-app`.

## Canonical tree (post-F4 target)
```
apps/basic-app/
├── project.json
└── src/
    ├── index.ts                              ← @basic-app public barrel (ONLY entry consoles may import)
    └── app/
        ├── models/                           ← shared domain models, split per domain (voice-service style)
        │   ├── index.ts                      ← barrel
        │   ├── transaction.models.ts         ← FSM, BASIC_APP_STATUS_META, action gating, row/seed shapes
        │   ├── compose.models.ts             ← templates, contact groups, spec/timing/quote
        │   └── details.models.ts             ← detail/recipient-result/rate-bar/cost-segment, palettes
        ├── services/
        │   └── mock-transactions.ts          ← mock-first data + mutations + change signal
        ├── validations/
        │   ├── index.ts                      ← barrel
        │   └── send-message.validations.ts   ← destination normalization, variable/body formatting
        ├── basic-app-home/                   ← component folder (screen)
        │   ├── basic-app-home.component.ts / .html
        │   ├── basic-app-recipients-cell/    ← sub-component in ITS OWN folder
        │   │   └── basic-app-recipients-cell.component.ts
        │   └── basic-app-status-pill/
        │       └── basic-app-status-pill.component.ts
        ├── basic-app-compose-whatsapp/       ← component folder (screen)
        │   ├── basic-app-compose-whatsapp.component.ts / .html
        │   ├── basic-app-compose.store.ts    ← the screen's state store lives with its screen
        │   ├── basic-app-group-picker/
        │   ├── basic-app-phone-preview/
        │   └── basic-app-send-confirm/
        └── basic-app-details/                ← component folder (screen)
            ├── basic-app-details.component.ts / .html
            ├── basic-app-donut-chart/
            ├── basic-app-rate-bars-chart/
            └── basic-app-recipient-status-pill/
```

## Binding notes
- Domain shapes live under `models/` (domain-named `*.models.ts` + `index.ts` barrel) — component `.ts`
  files declare only the component class, signals/computed, lifecycle, handlers (Brain SK rule #2).
- `validations/` = pure functions, per-flow files + barrel (voice-service `validations/` precedent).
- Sub-components nest inside their parent component's folder (voice-account-tab/voice-account-numbers-cell precedent).
- Inline `styles:[…]`/inline templates on small leaf components follow live practice (comm-mkt-view precedent) — allowed.
- Empty folders are NOT created (live practice; git cannot track them) — `models/validations/services`
  tiers exist at the app feature root where they have content.
- Consoles/spec files import ONLY `@basic-app` (the src/index.ts barrel).
- EXECUTION TIMING: applied immediately after Wave F4 lands (the F4 builder edits these files;
  concurrent moves would corrupt its work). All waves F5+ build under this tree.
