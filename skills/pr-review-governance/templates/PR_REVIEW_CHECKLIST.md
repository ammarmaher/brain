# PR Review Checklist

> Template — copy into the dated review folder. Mark each item ✅ / ❌ / N/A with a note.

## 1. Scope identified

- [ ] Source + target branch identified
- [ ] Changed files listed
- [ ] Affected apps/libs/services/modules listed
- [ ] Frontend / backend / full-stack classified
- [ ] Affected pages/components/APIs/DTOs listed

## 2. Knowledge loaded

- [ ] `KNOWLEDGE_ROOT_INDEX.md` read
- [ ] Frontend / backend / page knowledge loaded as applicable
- [ ] PRD / wiki loaded if available
- [ ] Approved patterns + known gaps checked

## 3. Architecture & structure

- [ ] Correct feature folder structure
- [ ] models/services/signals/validation/helpers placement
- [ ] No random folders
- [ ] Consolidated model files
- [ ] Shared vs feature-local justified
- [ ] Nx / module boundaries respected
- [ ] Route / menu conventions
- [ ] No duplicated logic

## 4. Falcon frontend rules

- [ ] Falcon custom components used first
- [ ] No raw table/button/input/dropdown/tabs where a Falcon component exists
- [ ] Dynamic APIs (ng-template / slots / projection / inputs / action templates) used correctly
- [ ] Tailwind + Falcon tokens only
- [ ] No new CSS/SCSS unless documented
- [ ] No hardcoded colors/spacing/radius/shadow
- [ ] No PrimeNG/PrimeIcons for new work

## 5. Validation

- [ ] FE validation matches confirmed requirement / backend rule
- [ ] required / nullable / disabled rules correct
- [ ] OTP / IP / email / phone rules correct (if relevant)
- [ ] Error states present
- [ ] Validation messages correct
- [ ] Backend still authoritative
- [ ] No backend logic blindly duplicated

## 6. API / DTO integration

- [ ] DTOs match backend contracts
- [ ] Request/response models correct
- [ ] API services use correct endpoints / gateway
- [ ] Error/loading/empty/success states handled
- [ ] No mock data left unless documented
- [ ] No breaking API assumptions

## 7. Business logic

- [ ] PRD flow followed
- [ ] Statuses / lifecycle correct
- [ ] Permissions / PES rules respected
- [ ] Allowed actions by status/role correct
- [ ] Edge cases handled
- [ ] Gaps / assumptions documented

## 8. Security / PES

- [ ] No secrets committed
- [ ] No credentials in code/reports
- [ ] Permissions enforced
- [ ] Maker/checker/PES rules respected (if applicable)
- [ ] Sensitive data not logged
- [ ] Route access not weakened unless intentional + documented

## 9. Quality gates

- [ ] Build / typecheck status known
- [ ] Lint status known
- [ ] Tests added/updated where needed
- [ ] Visual parity evidence if UI changed
- [ ] No console errors
- [ ] No regression risk
- [ ] Performance / bundle risk assessed

## 10. Output

- [ ] All 6 review docs produced
- [ ] Risk matrix filled
- [ ] Obsidian `PR_REVIEW_INDEX.md` updated
- [ ] Additive output sync done
