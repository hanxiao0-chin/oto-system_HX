# Tech Stack Recommendation: OTO AIED System MVP

## Recommended Stack

For this MVP, the most suitable stack is:

- **Frontend framework:** React + Vite
- **Styling:** plain CSS with CSS variables
- **State management:** React built-in state (`useState`, `useReducer`, `useContext`)
- **AI integration:** thin API route or serverless function that calls the AI model
- **File/data handling:** browser memory + `localStorage`, with simple file upload metadata kept in frontend state
- **Deployment:** Vercel or Netlify

This stack is simple, lightweight, and robust enough for a research prototype without introducing backend-heavy infrastructure.

## Frontend Framework Recommendation

### React + Vite

Use **React** with **Vite**.

Why:

- React is well-suited for chat-style interfaces with dynamic message rendering
- component structure will stay simple for this single-page prototype
- Vite gives fast local development and minimal setup
- easy to manage conditional flows like stage changes, AI triggers, and reflection prompts

Why not heavier alternatives:

- Next.js is unnecessary unless server rendering or a larger app shell is needed
- Vue or Svelte would also work, but React has the most straightforward ecosystem for rapid prototyping and AI-integrated UI work

## Styling Approach

### Plain CSS with CSS Variables

Use **plain CSS** organized by component or section, with a small set of CSS variables for spacing, color, and typography.

Why:

- the UI is intentionally minimal
- no complex design system is required
- easy to keep chat visually dominant and the workspace sidebar visually secondary
- avoids the overhead of Tailwind configuration or CSS-in-JS complexity

Suggested approach:

- one global stylesheet for tokens and layout
- a few focused CSS files for header, chat, workspace, and start page
- CSS variables for colors, spacing, border radius, and panel widths

## State Management Approach

### React Built-In State Only

Use:

- `useState` for local UI state
- `useReducer` for chat/workspace/project flow state
- `useContext` only if shared state becomes awkward to pass down

Why:

- the state model is small and well-defined
- no need for Redux, Zustand, MobX, or other external state libraries
- the app only needs to track current project, stage, chat history, workspace content, and simple AI/reflection flags

A reducer-based shape is a good fit for:

- adding messages
- updating current stage
- storing workspace artifacts
- triggering reflection prompt selection

## AI Integration Approach

### Minimal Serverless AI Proxy

Use a **single serverless function** or **single lightweight API route** to call the AI model.

Why:

- keeps API keys out of the frontend
- minimal architecture compared with a full backend
- enough for one chat-based research prototype
- easy to deploy with Vercel or Netlify

Suggested responsibilities of the AI route:

- receive the current stage and recent chat context
- generate AI support when triggered
- return plain structured JSON

Keep the AI contract simple:

- `type`: summary, suggestion, stakeholder simulation, feedback
- `message`: AI response text

Important:

- reflection triggering should stay on the frontend using simple heuristics
- do not build separate AI logic for reflection classification
- do not add analytics or ML pipelines

## File and Data Handling Approach

### Frontend-First Persistence

Use:

- in-memory React state during active use
- `localStorage` for project persistence across refreshes
- simple browser file input for evidence uploads

Why:

- no database is needed for the MVP
- projects are lightweight and local-first behavior is enough for prototype testing
- keeps implementation fast and infrastructure minimal

Recommended behavior:

- store project records as JSON in `localStorage`
- keep uploaded files as lightweight references or metadata where possible
- for simple prototype behavior, store:
  - file name
  - upload timestamp
  - optional extracted note or description

Avoid:

- object storage
- relational databases
- authentication
- collaborative sync

If raw file persistence becomes necessary later, that can be added as a future enhancement rather than part of the MVP stack.

## Reflection Triggering Approach

### Frontend Heuristics

Implement reflection triggering entirely in the frontend using simple rules.

Recommended method:

- normalize learner reply text
- check for keywords or short phrases
- map the reply to one of:
  - full acceptance
  - partial acceptance
  - uncertainty
  - conflict
  - dismissal

Why:

- matches the design document
- easy to test and debug
- keeps the architecture minimal
- avoids unnecessary AI calls or analysis layers

This logic can live in one small utility file such as `reflectionRules.ts`.

## Deployment Suggestion

### Vercel

Use **Vercel** as the first choice.

Why:

- very fast deployment for React + Vite frontends
- easy support for serverless functions
- simple environment variable management for AI API keys
- low friction for research prototype iteration

### Alternative: Netlify

Use **Netlify** if preferred.

Why:

- also lightweight and suitable for SPA deployment
- supports serverless functions and environment variables

## Suggested Project Structure

Keep the structure small:

```text
src/
  components/
    StartPage
    Header
    ChatPanel
    WorkspaceSidebar
    MessageList
    Composer
  state/
    appReducer
    initialState
  utils/
    reflectionRules
    aiMoments
    storage
  styles/
    globals.css
    layout.css
    chat.css
    workspace.css
api/
  ai-support
```

This is enough for the MVP without introducing unnecessary layers.

## Final Recommendation

The best-fit stack for this MVP is **React + Vite, plain CSS, built-in React state, one serverless AI endpoint, and `localStorage`-based persistence**.

This stack fits the product because:

- it keeps chat as the main interaction surface
- it supports a secondary workspace sidebar without complexity
- it allows AI support with minimal architecture
- it keeps reflection logic simple and frontend-based
- it is fast to build, test, and deploy

It is the right level of engineering for a clean single-page research prototype, without overbuilding the system.
