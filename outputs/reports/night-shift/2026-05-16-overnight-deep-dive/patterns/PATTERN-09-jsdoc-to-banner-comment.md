---
patternId: PATTERN-09
name: Verbose JSDoc → terse banner comment ***...***
violatesRules: [R-FE-010]
estimatedReach: ~40 occurrences across 8 service/utility files (counted via `*\s+@param/@returns` matches)
estimatedEffortPerOccurrence: 2 minutes
totalEffortHours: ~1.5
ammarAgent: ammar-web-platform-ui
priority: low
runId: 2026-05-16-overnight-deep-dive
---

## What this pattern is
R-FE-010 / feedback_comment_style.md require terse banner-format comments (`*** ... ***`, max 2 lines) and forbid verbose JSDoc with `@param`/`@returns` chains. The libs `falcon/shared-utils` + `falcon/language` + `falcon/core` + `falcon/shared-data-access` still have several JSDoc-heavy files left over from earlier scaffolding.

## Where it appears (top 10 file paths)
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\language\lib\services\translate.service.ts (6 JSDoc blocks)
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\language\lib\pipes\translate.pipe.ts (1)
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\core\lib\services\route-access.service.ts (14)
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-ui\lib\ui\svg-icon\svg-icon.registry.ts (4)
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-data-access\lib\services\lookup.service.ts (4)
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-data-access\lib\services\helper.ts (6)
- C:\Falcon\Falcon\falcon-web-platform-ui\libs\falcon\src\shared-data-access\lib\runtime-config\runtime-api-config.ts (2)
- C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\layout\layout.component.ts (3)

## What replaces it (the canonical pattern)
```ts
// Before
/**
 * Translates a key using the active language.
 *
 * @param key - The translation key in the form `module.section.label`.
 * @param params - Optional interpolation parameters.
 * @returns The translated string, or the key if no translation is found.
 * @example
 *   translate.instant('common.cancel');
 */
public instant(key: string, params?: Record<string, unknown>): string {
  ...
}

// After
*** translate a key using the active language; returns key when missing ***
public instant(key: string, params?: Record<string, unknown>): string {
  ...
}
```

For class/file headers:
```ts
*** Falcon translation service — bridges Angular DI to the global i18n provider ***
```

## Migration steps
1. Pick one file, replace every `/** … */` JSDoc with a banner comment that captures the same intent in 1–2 lines.
2. Run `nx test` and `nx lint` for the affected lib to make sure tooling doesn't depend on TSDoc.
3. Commit one file at a time so the diff stays reviewable.

## Detection regex
```
/\*\*[\s\S]*?\*\s+@(param|returns|throws|example|see)
```
(multiline)

## Falcon components / libs involved
- N/A — comment-only refactor.

## Risk + verification
- Lowest-risk pattern; no runtime effect.
- Verification: build + lint.
