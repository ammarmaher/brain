# Falcon AI Conversational Orchestration

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Falcon-AI-Conversational-Orchestration.md`
**Length:** 2499 lines · **Headings:** 72
**Last wiki HEAD seen:** `0d0cb311…`

> **Important note on this file:** the wiki source repeats from line 2494 (Sections 1-25 duplicated). Treat the first occurrence as authoritative; the duplicate appears to be a copy-paste artifact.

## Purpose

Architecture for Falcon's **AI-powered autonomous conversation system**. Users design structured, goal-oriented conversations (surveys, interviews, assessments, reviews) that are automatically executed with recipients via messaging channels (e.g. WhatsApp) without the user's direct involvement. Defines the **two-agent model** (Agent A = Conversation Designer; Agent B = Execution Agent), the JSON conversation blueprint structure, three branching modes (numeric, text-match, semantic LLM), a server-side execution engine, a semantic evaluation engine, history management, Redis-based state storage, security, performance, and extensibility considerations.

## Key rules / decisions

### §3 Two-Agent Architecture (`…md:102-201`)

**Agent A — Conversation Designer:**
- Interacts only with **Falcon users** (not recipients).
- Acts as a Conversation Design Assistant in a **Design Workshop interaction model**.
- Interviews user to clarify recipients, context, goals, constraints.
- Suggests improvements to increase response quality / insight.
- Designs structured questions optimized for short messaging.
- Produces a structured **machine-readable JSON conversation blueprint**.
- **Domain-agnostic** — no business logic embedded in execution.
- Provides human-readable design summaries before JSON blueprints.
- **Agent A does NOT execute conversations.**

**Agent B — Execution Agent:**
- Interacts only with **recipients** (not Falcon users).
- Executes the approved blueprint.
- Uses messaging tools (e.g. WhatsApp).
- **Does NOT decide logic.**
- Follows **server-controlled branching** (logic decisions made on server, not by LLM).

### §4 Core Design Principles (`…md:205-247`)

- Server controls all branching logic; LLM never makes the routing decision.
- Conversation blueprint is the contract — versioned, validated, persisted.
- Domain-agnostic execution — same engine handles surveys, interviews, assessments.
- Recipient experience is single-thread WhatsApp-style.

### §5 Conversation Blueprint Structure (`…md:248-354`)

Structured JSON. Contains stages, questions, branching rules, observations, recipient metadata.

### §6 Question Model (`…md:355-393`)

Each question has: ID, prompt, type, validation, branching policy.

### §7 Branching Rules System — three modes (`…md:394-518`)

1. **Numeric Mode** (`…md:423-450`) — branch on numeric answer.
2. **Text Match Mode** (`…md:451-474`) — exact / pattern match on text.
3. **Semantic Mode (LLM-Based)** (`…md:475-518`) — LLM evaluates response against a configured intent/dimension.

### §8 Server-Side Execution Engine (`…md:519-599`)

Server orchestrates: load blueprint → fetch next question → wait for response → evaluate branching → log → repeat.

### §10 Execution Flow (`…md:600-641`)

Detailed step sequence from blueprint loading through to conversation completion.

### §11 Semantic Evaluation Engine (`…md:642-774`)

LLM-as-evaluator pattern: structured prompt to LLM asking it to score/classify a recipient response against a rubric. Always **deterministic + sandboxed + side-effect free** (the evaluator returns a label/score; routing decision happens on the server).

### §12 Messaging Tool Enforcement (`…md:775-819`)

Whitelist of allowed messaging actions. LLM cannot perform arbitrary tool calls. Tool surface area is restricted to "send next question" + "log observation".

### §13 History Management (`…md:820-853`)

Conversation history is persisted (per recipient) and summarized as needed to fit context windows.

### §14 Redis-Based State Storage (`…md:854-903`)

Per-recipient session state in Redis: current question index, branch path, accumulated answers, evaluation results.

### §16 Why This Architecture Is Correct (`…md:974-1008`)

Key argument: separation of concerns between design (human + LLM in workshop), execution (deterministic server), and evaluation (LLM-as-judge but server controls routing).

### §17 Security Considerations (`…md:1009-1042`)

- LLM outputs validated; no direct messaging tool access for the LLM.
- Recipient PII handled per Falcon retention rules.
- Conversation blueprints versioned + signed (implied — exact mechanism TBD).

### §18 Performance Considerations (`…md:1043-1073`)

- Redis for hot-path session state.
- LLM evaluation calls asynchronous.
- Branching decision must be sub-second to keep conversation snappy.

### §19 Extensibility (`…md:1074-1121`)

New channels (e.g. RCS) added by adding a messaging tool adapter; new branching modes by adding evaluator handlers.

### §22 Expressive Conversation Anatomy v2 (`…md:1305-2213`)

Substantial section defining the v2 blueprint vocabulary: stages, styles, rules, observations. Domain-specific terms for conversation design.

### §23 Conversation Design Methodology (Agent A) (`…md:2214-2376`)

How Agent A conducts the design workshop: value-first interview, conversation strategy, insight dimension discovery, question design principles, question grouping, iterative refinement, capability discovery.

### §24 Human-Readable Design Cards (`…md:2386-2446`)

Format for presenting conversation design back to the user in plain language before generating JSON blueprint.

### §25 Conversation Design vs Execution Responsibilities (`…md:2447-2493`)

Boundary table: what belongs to Agent A vs Agent B vs server execution engine.

## Diagrams / images referenced

The doc is overwhelmingly text-and-code; specific images not enumerated in the read sample. The architecture is described primarily through ASCII flows and JSON examples.

## Cross-references

- Could plug into the Platform Services Gateway (`High-Level-Architecture.md` §2.2.2) — `/ai/{**catch-all}` route prefix.
- Recipients reached via Channel Services (WhatsApp, RCS).
- Charging integration implied — Agent B's messaging tool calls would route through OCS rating (`Falcon-Pricing,…OCS-…md` §3.2 messaging flow).

## Implications for code

**No identifiable AI service repository in code yet.** No `falcon-ai-*-svc` repo, no AI-related csproj.

**Implementation gap analysis:**
- This entire architecture is **forward-looking** — no Falcon code currently implements Agent A, Agent B, the execution engine, or semantic evaluator.
- LLM integration package (OpenAI / Anthropic / local) not present.
- Redis session-state schema for conversation orchestration not defined in code.
- Conversation blueprint JSON schema validator not present.

**When implemented:**
- Service should follow `Clean-Architecture-…md` rules: 5 csproj (`Falcon.AI.Api`, `Falcon.AI.Application`, `Falcon.AI.Domain`, `Falcon.AI.Infrastructure`, `Falcon.AI.Contracts`).
- Conversation execution Engine = Application Service.
- Blueprint validation rules = Domain Services.
- LLM client adapter = Infrastructure (do NOT leak vendor SDK into Application).
- Redis state store = Infrastructure adapter.
- Should publish conversation events to Kafka for analytics.

**Open items:**
- Wiki silent on which LLM provider(s) Falcon will use.
- Wiki silent on cost/throughput SLOs.
- The duplicate content (lines 2494+) should be cleaned up in a future wiki edit.
