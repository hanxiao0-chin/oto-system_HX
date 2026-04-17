# Design Document: OTO AIED System MVP

## Purpose

This document defines a clean, minimal research prototype for the OTO AIED System. The MVP should be a single-page web app where chat is the main interaction and a lightweight workspace sidebar stores key artifacts without interrupting the learning flow.

## Product Shape

The prototype has two steps:

1. a simple start page
2. a single-page project workspace

Each project starts with no title. The project identity emerges from the learner's inputs. A project stores:

- chat history
- learner inputs
- AI outputs
- notes and evidence
- final outputs

## UI Layout

### Start Page

The start page should be minimal and include:

- system title
- short description
- `Start New Project` button
- disabled `Coming Soon` placeholders for:
  - community discussion
  - issue categories
  - collaboration features

These placeholders are visible only to signal future scope. They must not be functional.

### Main Interface

The main interface is a single-page layout with:

- top header
- main chat panel
- workspace sidebar

### Header

The header should include:

- system title
- current stage label
- progress indicator: `Stage 1 / 3`, `Stage 2 / 3`, `Stage 3 / 3`
- visible `Next Stage` button

Stage progression must always be user-controlled.

### Chat Panel

The chat panel is the primary interaction area. It should contain:

- stage opening prompt
- message history
- learner input box
- `Send` button
- `Get AI Support` button

All core learning interaction happens in this one chat thread.

### Workspace Sidebar

The workspace sidebar is secondary. It must not interrupt or dominate the main chat flow.

It stores:

- learner inputs
- AI outputs
- notes and evidence
- final outputs

It should be visually quieter and narrower than the chat area. It acts as a lightweight reference area, not a dashboard.

## Stage Structure

Each stage must include:

1. a conversational opening prompt
2. a main interaction phase
3. a closing prompt that summarizes progress
4. a system message asking whether the learner wants to move to the next stage

This structure should remain consistent across all stages.

## Message Flow

### 1. Opening Prompt

At the start of each stage, the system posts a short conversational opening prompt that:

- introduces the goal of the stage
- asks for learner thinking
- sets up the next action

### 2. Learner Input

The learner responds in chat. Each response:

- appears in the chat history
- is stored in the workspace

### 3. AI Response Behavior

AI scaffolding changes by stage.

#### Engage

- AI may respond automatically after a key learner moment
- examples of key moments:
  - first meaningful issue framing
  - a clear new idea
  - a transition point within the stage

#### Investigate

- AI may respond automatically after a key learner moment
- examples of key moments:
  - first investigation plan
  - new evidence or a new inquiry direction
  - a transition point within the stage

#### Act

- AI must never respond automatically
- AI is only triggered when the learner presses `Get AI Support`

Automatic AI support should not appear after every learner message. It should appear only at selected key moments so the chat does not become AI-dominated.

### 4. Reflection Mechanism

Reflection is a core feature. Reflection prompts must not be static.

After AI output, the system should wait for the learner's response and then choose a reflection prompt based on a simple interaction pattern.

Use simplified patterns:

- full acceptance: ask for justification
- partial acceptance: ask for comparison
- uncertainty: ask for clarification
- conflict: ask for reasoning and evidence
- dismissal: encourage minimal engagement

This pattern detection should use simple heuristics, not complex analysis. Acceptable methods include:

- keyword matching
- short phrase matching
- basic rules tied to obvious response patterns

Examples:

- full acceptance: words like `agree`, `yes`, `makes sense`
- partial acceptance: words like `partly`, `some parts`, `but`
- uncertainty: words like `not sure`, `unclear`, `maybe`
- conflict: words like `disagree`, `wrong`, `doesn't fit`
- dismissal: very short rejection like `no`, `skip`, `not useful`

The goal is not perfect classification. The goal is a simple, understandable prototype behavior.

### 5. Closing Prompt

After the main interaction in a stage, the system posts a brief closing prompt that summarizes progress and prepares the learner for transition.

### 6. Transition Prompt

After the closing prompt, the system asks whether the learner wants to move to the next stage. The learner then decides whether to press `Next Stage`.

## Stage Details

### Stage 1: Engage

Purpose:

- identify and frame a social issue

Flow:

1. opening prompt
2. learner writes initial issue framing
3. AI may respond automatically at a key moment
4. learner reacts
5. system selects a reflection prompt using simple heuristics
6. closing prompt
7. learner chooses whether to move to Stage 2

### Stage 2: Investigate

Purpose:

- develop inquiry and gather evidence

Flow:

1. opening prompt
2. learner writes an investigation plan or adds evidence
3. AI may respond automatically at a key moment
4. learner reacts
5. system selects a reflection prompt using simple heuristics
6. closing prompt
7. learner chooses whether to move to Stage 3

### Stage 3: Act

Purpose:

- propose action with reduced scaffolding

Flow:

1. opening prompt
2. learner drafts an action plan
3. AI stays silent unless requested
4. learner may press `Get AI Support`
5. if AI is used, learner reacts
6. system selects a reflection prompt using simple heuristics
7. closing prompt
8. learner chooses whether to continue to final reflection

### Final Reflection

After Stage 3, the system presents a short final reflection sequence in the same chat thread:

- reflection on AI use
- a brief principle-writing task for responsible AI use

## Stage Transitions

Stage transitions must be user-controlled.

Rules:

- no automatic transitions
- visible `Next Stage` button in the header
- progress indicator always visible
- system also asks in chat whether to continue

The system may show a soft reminder if the learner has not contributed anything yet, but it should avoid hard blocking rules.

## Key User Actions

Primary actions:

- start a new project
- read the opening prompt
- write a learner response
- request AI support when desired
- respond to reflection prompts
- review stored work in the sidebar
- move to the next stage
- complete final reflection

Secondary actions:

- add evidence as text
- upload simple materials during Investigate

## Simplified Interaction Logic

The MVP should keep logic easy to implement.

Core rules:

- one project at a time
- one chat thread per project
- one active stage at a time
- chat remains primary
- workspace remains secondary
- automatic AI support only at key moments in Engage and Investigate
- no automatic AI support in Act
- reflection prompt selection uses simple heuristics
- stage progression is manual

Minimal state:

- current project
- current stage
- chat history
- workspace content
- whether a key AI moment has been reached
- whether AI has responded in the current sequence
- detected reflection pattern

## Out of Scope

Do not add:

- teacher dashboard
- real community features
- real collaboration tools
- complex issue libraries
- analytics dashboards
- branching chat structures
- advanced AI analysis of learner intent

## Conclusion

The MVP should remain a clean single-page research prototype. Chat is the main interaction. The workspace sidebar quietly stores artifacts in the background. AI support appears selectively in early stages, disappears by default in the Act stage, and reflection is driven by simple heuristic pattern detection rather than complex logic.
