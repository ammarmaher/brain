<!-- *** Frontend chain: index *** -->
<!-- *** Phase G of full-pipeline-redesign — single entry point Adnan opens when "let's go on frontend" fires *** -->

# Frontend Chain — Index

The frontend chain is the rule stack Adnan loads when a frontend task starts. It is composition-only: it does not generate code by itself. Once active, every downstream FE task runs under the loaded ruleset.

This folder holds three files. Read order matches the chain's activation flow.

## Files

| # | File | Role |
|---|---|---|
| 1 | [`architecture-prereads.md`](./architecture-prereads.md) | Six wiki documents Adnan loads into context **before** any sub-skill. Defines topology, permissions, security, naming. |
| 2 | [`chain.md`](./chain.md) | The composition itself — trigger phrases, sub-skill load order, hard layout rules, activation flow, de-activation, done definition. |
| 3 | [`component-layout.md`](./component-layout.md) | Strict structural contract: `services\` + `models\` folders per component, no interfaces/classes in component `.ts`, each service owns its own `models\`. The last word on FE file/folder shape. |

## How Adnan invokes this chain

Adnan activates the chain when the user says any of the following (verbatim from `chain.md`):

- `let's go on frontend`
- `let's go on <feature>` — when `<feature>` is a frontend feature (Angular app, component, page, library, layout, theme, i18n)
- `frontend chain`
- `run frontend chain`

If `<feature>` could be either FE or BE, Adnan asks once which side; on FE, this chain runs.

## Activation flow (reference)

The full sequence lives in `chain.md`. The short version:

1. Trigger phrase matches.
2. Read `architecture-prereads.md`, then load every wiki doc it lists.
3. Read the five sub-skill `Skill.md` files in the order specified in `chain.md` (official-angular → angular-tailwind-primeng → nx-workspace → nx-module-federation → falcon-project-standards).
4. Read `component-layout.md`.
5. Apply hard layout rules + standing rules from `chain.md` over whatever the sub-skills said.
6. Hand the now-loaded ruleset to the actual task agent (Ammar Web-Platform-UI).
7. Refuse any sub-step that violates a hard rule and report the violation.

## Hard rules summary (full list in `chain.md`)

- Tailwind CSS Grid is the default layout primitive — flex only for inline alignment.
- Frontend NEVER calls Zitadel directly — all auth through Identity Service at `auth.falconhub.space/api/`.
- Nx apps/libs follow Wiki kebab-case + `@falcon/*` import scope.
- `falcon-web-platform-ui-old` and `deprecated-falcon-web-platform-ui` are excluded from every operation.
- No `nx serve` / browser preview / screenshot during implementation.
- Every component conforms to `component-layout.md` — `services\` + `models\` folders, no shapes inside the component `.ts`.

## De-activation

The chain stays in effect for the duration of the current frontend task. A new unrelated trigger (e.g. backend chain) replaces it.

## Phase ownership

This chain is the deliverable for **Phase G** of `C:\falcon\Brain\jobs\full-pipeline-redesign.md`. The complementary backend chain is Phase H and lives elsewhere.
