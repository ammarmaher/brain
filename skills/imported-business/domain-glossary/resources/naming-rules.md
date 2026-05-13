*** Naming Rules — domain-glossary ***
*** When to use which canonical term ***

# Naming Rules

## Principle

One canonical term per concept. Aliases are banned, not "also acceptable".

## Selection rules

When picking a term for a new concept:
1. Check the glossary first — does the concept already exist under a different name?
2. If yes — use the existing term
3. If no — propose the new term to the team, add a glossary file, then use it

## Code identifier rules

Code identifiers must reflect the canonical term:
- C# entity classes: `PascalCase` matching the term (`Tenant`, not `Org`)
- TypeScript types/interfaces: `PascalCase` matching the term
- Database tables: `snake_case` matching the term (`contact_groups`, not `groups`)
- API routes: `kebab-case` matching the term (`/api/contact-groups`)

## UI label rules

- En labels: use canonical English term, sentence case (`Contact group`, not `Group`)
- Ar labels: use the Ar definition from the term file
- Never abbreviate canonical terms in labels (`CG`, `Tnt`, etc. — banned)

## Variable naming for ambiguous concepts

When a method handles two confusable concepts, name both explicitly:
```ts
function transferOwnership(tenant: Tenant, fromAccount: Account, toAccount: Account)  // good
function transfer(t: Tenant, a: Account, b: Account)                                   // bad
```
