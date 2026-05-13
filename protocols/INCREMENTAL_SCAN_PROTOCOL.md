# Incremental Scan & Impact Detection

Before every task:

1. Load last scan metadata.
2. Check Git status/diff and latest branch state.
3. Check timestamps/checksums for PRDs, backend, components, wiki, registries.
4. If unchanged, reuse previous analysis.
5. If changed, rescan only changed files and impacted dependencies.
6. Update registries and scan metadata.
7. Report changed vs unchanged sources.

| Source | If changed | If unchanged |
|---|---|---|
| PRD | Rescan changed PRD and business impact | Reuse business memory |
| Backend controller/DTO | Rescan endpoint/DTO/validation contracts | Reuse API understanding |
| Falcon component | Rescan component API/templates/slots | Reuse component registry |
| Wiki | Rescan impacted architecture rules | Reuse wiki registry |
| Pattern memory | Load latest approved patterns | No rewrite |
