# Implementation Plan: OTO AIED System MVP

## Step 1: Create the React + Vite project

### Goal

Set up the base project so the app can run locally in the browser.

### Specific tasks

- Create a new React project with Vite
- Start the development server
- Remove the default demo content
- Create a basic folder structure for:
  - components
  - state
  - utils
  - styles

### Expected output

The app opens in the browser and shows a very simple blank or placeholder page without Vite demo content.

### Simple validation

- Run the app locally
- Confirm the page loads without errors
- Confirm the screen no longer shows the default Vite starter UI

## Step 2: Add the base app shell

### Goal

Create the top-level app structure that can switch between the start page and the main interface.

### Specific tasks

- Create an `App` structure with two states:
  - start page
  - project workspace
- Add a temporary boolean state for whether a project has started
- Render the start page first
- Add a placeholder main interface view for later

### Expected output

The app first shows a start page, and clicking a button can switch to a simple placeholder workspace view.

### Simple validation

- Open the app
- Confirm the start page appears first
- Click `Start New Project`
- Confirm the view switches to the workspace placeholder

## Step 3: Build the start page

### Goal

Create the minimal project entry screen described in the design document.

### Specific tasks

- Add the system title
- Add a short one-line description
- Add a `Start New Project` button
- Add three disabled `Coming Soon` items:
  - community discussion
  - issue categories
  - collaboration features
- Style the page so it looks clean and uncluttered

### Expected output

The start page looks like a simple entry screen with one clear action and three disabled placeholders.

### Simple validation

- Confirm the title and description are visible
- Confirm the `Start New Project` button works
- Confirm the three future feature items are visible but cannot be clicked

## Step 4: Build the main two-column layout

### Goal

Create the main single-page interface with header, chat area, and workspace sidebar.

### Specific tasks

- Add a top header area
- Add a large main chat panel
- Add a narrower workspace sidebar
- Use plain CSS to make the chat area visually primary
- Make the workspace sidebar visually quieter and secondary

### Expected output

After starting a project, the app shows a two-column layout with a header on top.

### Simple validation

- Confirm the chat panel is larger than the sidebar
- Confirm the workspace does not visually dominate the page
- Resize the browser and confirm the layout still remains readable

## Step 5: Add the header content

### Goal

Show stage and progress information in the header.

### Specific tasks

- Add the system title to the header
- Add a current stage label
- Add a progress indicator such as `Stage 1 / 3`
- Add a visible `Next Stage` button
- Keep the button active for now, even before adding stage rules

### Expected output

The header clearly shows where the learner is and includes a visible next-step control.

### Simple validation

- Confirm the stage label appears
- Confirm the progress indicator appears
- Confirm the `Next Stage` button is always visible

## Step 6: Build the basic chat UI

### Goal

Create the main chat interaction area with message display and input.

### Specific tasks

- Add a scrollable message list area
- Add a text input or textarea for learner messages
- Add a `Send` button
- Add a `Get AI Support` button
- Create a simple message shape with:
  - id
  - role
  - text

### Expected output

The learner can type a message, send it, and see it appear in the chat history.

### Simple validation

- Type a message and press `Send`
- Confirm the message appears in the chat list
- Confirm multiple messages appear in order

## Step 7: Add the first system opening prompt

### Goal

Make the chat start with a guided system message instead of an empty history.

### Specific tasks

- Create opening prompt text for the Engage stage
- Add the prompt automatically when a new project starts
- Display it as a system message with a different visual style from learner messages

### Expected output

A new project opens directly into a guided conversation instead of a blank chat.

### Simple validation

- Start a new project
- Confirm the first message is a system opening prompt
- Confirm it looks different from learner messages

## Step 8: Add the stage system

### Goal

Introduce the three learning stages: Engage, Investigate, and Act.

### Specific tasks

- Define the three stage names in app state
- Track the current stage
- Update the header to reflect the current stage
- Make `Next Stage` move from:
  - Engage to Investigate
  - Investigate to Act
  - Act to final reflection

### Expected output

The app can move through the stages in order, and the header updates correctly.

### Simple validation

- Click `Next Stage`
- Confirm the stage label changes in the correct order
- Confirm the progress indicator updates correctly

## Step 9: Add stage opening prompts for all stages

### Goal

Ensure each stage begins with its own guided opening prompt.

### Specific tasks

- Write one opening prompt for Engage
- Write one opening prompt for Investigate
- Write one opening prompt for Act
- Insert the correct system prompt when the learner enters a new stage

### Expected output

Each stage starts with a clear system message that introduces the stage goal.

### Simple validation

- Move through all stages
- Confirm each new stage adds a new opening prompt to the chat
- Confirm the prompt matches the stage purpose

## Step 10: Add stage closing and transition messages

### Goal

Match the design document by adding a closing prompt and a transition message inside the chat.

### Specific tasks

- Create one short closing prompt template for each stage
- Create one transition question template for each stage
- When the learner presses `Next Stage`, first add:
  - closing prompt
  - transition question
- Then move to the next stage

### Expected output

The chat shows a sense of progress instead of jumping abruptly between stages.

### Simple validation

- Press `Next Stage`
- Confirm the chat receives a short summary and a move-forward question
- Confirm the next stage still loads correctly

## Step 11: Build the workspace sidebar structure

### Goal

Create the secondary sidebar that stores project artifacts.

### Specific tasks

- Add sections for:
  - learner inputs
  - AI outputs
  - notes and evidence
  - final outputs
- Show simple lists under each section
- Keep the sidebar compact and visually quiet

### Expected output

The workspace sidebar shows empty sections ready to receive content.

### Simple validation

- Confirm all four sections are visible
- Confirm the sidebar remains narrower and less visually strong than the chat panel

## Step 12: Store learner messages in the workspace

### Goal

Connect chat activity to the workspace.

### Specific tasks

- When the learner sends a message, also save it into the `learner inputs` section
- Group or label the saved item by current stage
- Keep the display simple, such as one short preview per item

### Expected output

Learner chat inputs appear both in the chat and in the workspace sidebar.

### Simple validation

- Send a learner message
- Confirm it appears in the chat
- Confirm a matching item appears in the workspace

## Step 13: Add local storage for project persistence

### Goal

Preserve project data after a page refresh.

### Specific tasks

- Save the current project state to `localStorage`
- Load project state from `localStorage` when the app opens
- Include:
  - current stage
  - chat history
  - workspace content

### Expected output

Refreshing the page does not erase the current project.

### Simple validation

- Start a project
- Send a few messages
- Refresh the browser
- Confirm the chat and workspace content return

## Step 14: Add simple note and evidence entry

### Goal

Allow the learner to add basic evidence or notes during Investigate.

### Specific tasks

- Add a small note input in the workspace or near the chat
- Add a simple file input for optional uploads
- Save note text into the `notes and evidence` section
- Save uploaded file metadata only:
  - file name
  - upload time

### Expected output

The learner can record evidence without any complex file system behavior.

### Simple validation

- Enter a note and save it
- Confirm it appears in the workspace
- Upload a file
- Confirm the file name appears in the workspace

## Step 15: Add simulated AI responses

### Goal

Create a fake AI function so the interaction flow can be tested before using a real API.

### Specific tasks

- Write a simple frontend function that returns hardcoded AI responses
- Return different fake responses for:
  - Engage
  - Investigate
  - Act
- Make the AI response appear as a chat message
- Also save it into the `AI outputs` section of the workspace

### Expected output

The app can show believable AI responses without connecting to a real model yet.

### Simple validation

- Trigger AI support
- Confirm an AI message appears in the chat
- Confirm the same output appears in the workspace

## Step 16: Add key-moment AI triggering rules

### Goal

Make AI appear only at selected moments instead of after every learner message.

### Specific tasks

- Define simple key moments for Engage and Investigate, such as:
  - first meaningful learner input
  - a message longer than a small threshold
  - a message containing words like `idea`, `plan`, or `evidence`
- Keep automatic AI off for Act
- If no key moment is reached, do not auto-trigger AI

### Expected output

Early-stage AI appears sometimes, but not after every learner message.

### Simple validation

- Send a very short learner message and confirm AI does not always appear
- Send a fuller message and confirm AI can appear
- Move to Act and confirm no automatic AI response happens

## Step 17: Add the manual AI support button behavior

### Goal

Allow the learner to request AI support on demand.

### Specific tasks

- Make `Get AI Support` trigger the fake AI function
- Allow this in all stages
- Keep it especially important in Act, where AI never appears automatically

### Expected output

The learner can always request AI help manually, even when auto-triggering does not happen.

### Simple validation

- Go to Act
- Send a learner message
- Confirm no automatic AI appears
- Press `Get AI Support`
- Confirm the AI response appears

## Step 18: Add reflection pattern detection

### Goal

Trigger reflection prompts using simple frontend heuristics.

### Specific tasks

- Create a small rule set for:
  - full acceptance
  - partial acceptance
  - uncertainty
  - conflict
  - dismissal
- Use simple keyword or phrase matching
- After an AI message, inspect the learner's next reply
- Choose one reflection prompt based on the detected pattern

### Expected output

Reflection prompts change based on the learner's response to AI.

### Simple validation

- Reply with `I agree`
- Confirm a justification-style reflection prompt appears
- Reply with `I partly agree but...`
- Confirm a comparison-style prompt appears
- Reply with `not sure`
- Confirm a clarification-style prompt appears

## Step 19: Add final reflection flow

### Goal

Complete the learning sequence after the Act stage.

### Specific tasks

- Add a final reflection prompt after Act
- Add a short AI-use reflection question
- Add a principle-writing prompt for responsible AI use
- Save the learner's final responses into `final outputs`

### Expected output

The project has a clear ending and stores the final outputs in the workspace.

### Simple validation

- Move through all stages
- Complete the final reflection prompts
- Confirm final outputs appear in the workspace

## Step 20: Replace fake AI with a real API call

### Goal

Swap the fake AI function for a real but lightweight AI connection.

### Specific tasks

- Create one simple API route or serverless function
- Send only the minimum needed data:
  - current stage
  - recent chat context
  - request type
- Return a plain AI message
- Update the frontend to call the real endpoint instead of the fake function
- Keep reflection logic on the frontend

### Expected output

The app now receives real AI responses while keeping the architecture minimal.

### Simple validation

- Trigger AI support
- Confirm a real AI response appears in the chat
- Confirm errors are handled simply if the API fails
- Confirm reflection prompts still work the same way as before

## Step 21: Do a final MVP cleanup

### Goal

Make the prototype stable and easy to demo.

### Specific tasks

- Remove unused placeholder code
- Check text labels for consistency
- Confirm the workspace remains secondary
- Confirm the app still works after refresh
- Check the full flow from start page to final reflection

### Expected output

A clean working MVP that can be demonstrated end-to-end.

### Simple validation

- Start a new project
- Move through Engage, Investigate, and Act
- Trigger AI manually and automatically where expected
- Confirm reflection prompts appear
- Refresh the page and confirm the project is still there
