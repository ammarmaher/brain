---
type: journey
journey-name: <Journey Name>
crosses-pages: [<page-slug-1>, <page-slug-2>]
prds-involved: [PRD-NN]
created: <YYYY-MM-DD>
---

*** Journey Playbook — <Journey Name> ***
*** Multi-page user flow · <YYYY-MM-DD> ***
*** Crosses: <pages and flow playbooks involved> ***

# <Journey Name>

> One-paragraph summary of the journey: who triggers it, what business outcome, where it ends.

## Actors involved

| Actor | Role |
|---|---|

## Pages traversed (in order)

1. [[Page 1]] — what happens here
2. [[Page 2]] — what happens here

## Flow playbooks used

- [[Some Flow]]
- _Forward-refs to flows not yet seeded should be marked `forward-ref (flow not yet seeded)`_

## Backend services exercised (in order)

- [[<Service Name>]] — what it does in this journey

## Kafka events fired

- `<event.name.v1>` (producer → consumer) — happens between Step X and Step Y

## V-rules touched

- [[V-...]] — fires at journey step X

## End-to-end happy-path narrative

Step 1. Actor X clicks Y on Page Z. Result: ...
Step 2. ...

## Failure modes + recovery paths

- If Step X fails: ...
- If Kafka chain partially fails: ...

## Cross-journey dependencies

- Depends on: <other journey or PRD>
- Triggers: <downstream journey>

## Implementation checklist

- [ ] All page playbooks in the journey are loaded
- [ ] Kafka subscriptions are wired
- [ ] Error states from each step propagate correctly
- [ ] State transitions per actor are tested end-to-end

## Hubs

- [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[16-Journeys/README|16-Journeys]] · [[AMMAR_BRAIN_HOME]]
