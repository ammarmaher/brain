---
type: pending-question
authored-by: Ammar Web-Platform-UI (Wave3 Round 2 — surgical fix)
authored-at: 2026-05-17
status: open
severity: medium
blocks: Step 1 dropdown UX correctness · payload completeness for Classification Category + Sub-Category
related-gaps: GAP-WIZ-01 (REPORT.md)
---

# UI Classification Category / Sub-Category options DRIFT from PRD enum

## Observed state (`[CODE] apps/admin-console/.../add-client-wizard/models/models.ts:130-136`)

```typescript
export const CLASS_CAT_OPTIONS: string[] = [
  'Government', 'Banking', 'Healthcare', 'Energy', 'Retail',
];
export const CLASS_SUB_OPTIONS: string[] = [
  'Public Sector', 'Commercial', 'Non-profit',
];
```

The Add Client wizard Step 1 dropdown shows 5 Classification Category options and 3 Classification Sub-Category options.

## Canonical state (`[CODE] libs/falcon/src/shared-types/lib/enums/globels.ts:12-25`)

```typescript
export enum ClassificationCategory {
  VIP = 1,
  Critical = 2,
  Normal = 3,
}
export enum ClassificationSubCategory {
  Bank = 1,
  Gov = 2,
  SemiGov = 3,
  LargeEnterprise = 4,
  MediumEntity = 5,
  SME = 6,
}
```

Confirmed by `[BRAIN-OUT] Brain Outputs/understanding/pages/organization-hierarchy/Add Client/02-STEP_1_BASIC_INFO.md` rows 25-26 (BR-AM-06: 3-value enum, BR-AM-07: 6-value enum). Backend enforces `[ThrowIfNotEnumValue<eClassificationCategory>]` / `[ThrowIfNotEnumValue<eClassificationSubCategory>]`.

## What I shipped in Wave3 R2

To unblock submit safely without expanding scope, I left the existing UI option arrays in place but added a defensive string → enum mapper:

```typescript
const CLASS_CAT_TO_ENUM = {
  'VIP': ClassificationCategory.VIP,
  'Critical': ClassificationCategory.Critical,
  'Normal': ClassificationCategory.Normal,
};
toClassificationCategory(label) => CLASS_CAT_TO_ENUM[label] ?? null;
```

**Consequence:** every UI option currently shown ('Government', 'Banking', 'Healthcare', 'Energy', 'Retail') maps to **null**. The wire payload sends `classificationCategory: null` regardless of what the user picks. Same for Sub-Category. Same fate for Sector strings that don't exist on the wire (only `sector` PRD column carries a string label, not an enum).

**Why this is safe for now**: PRD marks both fields as OPTIONAL (BR-AM-06, BR-AM-07). Backend will accept null. Submit will proceed.

**Why this still needs fixing**: the user's selection is silently discarded.

## Question for product / domain owner

Which of the following is the canonical option set for Step 1 Classification Category?

**Option A** — keep the UI as-is and ADD 5 new enum values to backend `eClassificationCategory` (Government / Banking / Healthcare / Energy / Retail). Update `globels.ts`, `Account` entity, validators, brain doc.

**Option B** — keep the backend enum as-is and REPLACE the UI options to match (VIP / Critical / Normal for Category; Bank / Gov / SemiGov / LargeEnterprise / MediumEntity / SME for Sub-Category). Update `CLASS_CAT_OPTIONS` + `CLASS_SUB_OPTIONS` arrays + i18n labels + Wave3 R2 mapper key set.

**Option C** — the UI options ARE the sector taxonomy and these belong on a different field (`info.sector` string column, currently auto-populated by AuthorityLetterType). Move 'Government / Banking / Healthcare / Energy / Retail' to be the Sector dropdown options; restore Category to 3-value PRD enum.

## Action required

1. Confirm option A / B / C with PRD owner.
2. Once confirmed, update either: backend enum + DTO + brain doc (option A), OR the UI arrays + this file's mapper (options B/C).
3. Close GAP-WIZ-01 once UI options + enum + brain doc are aligned.

## Files to touch when resolved

- `[CODE] apps/admin-console/.../add-client-wizard/models/models.ts:130-181` (`CLASS_CAT_OPTIONS`, `CLASS_SUB_OPTIONS`, `CLASS_CAT_TO_ENUM`, `CLASS_SUB_TO_ENUM`)
- `[CODE] libs/falcon/src/shared-types/lib/enums/globels.ts:12-25` (if option A)
- `[CODE] apps/.../i18n/en.json` + `ar.json` (option labels)
- `[BRAIN-OUT] Brain Outputs/understanding/pages/organization-hierarchy/Add Client/02-STEP_1_BASIC_INFO.md` rows 25-26
- Backend Commerce `eClassificationCategory` / `eClassificationSubCategory` (option A)
