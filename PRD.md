# OTO AIED System (MVP 2.0)

## 1. Overview

This system is a minimal MVP of an Online-to-Offline (OTO) AIED system designed to support learners’ AI literacy and epistemic agency through Challenge-Based Learning (CBL).

The system guides learners through three phases (Engage, Investigate, Act) using a **chat-based interaction interface** and a **workspace for storing learning artifacts**.

Key design ideas:
- Learners think first, AI comes later
- AI is a support tool, not an authority
- Learners compare, reflect, and decide

---

## 2. Target Users

- University students (primary users)
- Teachers (not implemented in MVP)

---

## 3. Interaction Model (Core Logic)

The system uses a **single chat interface**, but messages have different roles:

### 3.1 Types of Messages

1. **Instructional Prompts (System)**
   - Pre-defined guidance
   - Appear at the beginning of each stage
   - Not AI-generated

2. **Learner Input**
   - User responses in chat
   - Stored in workspace

3. **AI Support (Simulated or API-based)**
   - Triggered by button after learner input
   - Provides summaries, suggestions, or simulations

4. **Reflection Prompts**
   - Triggered after AI responses
   - Encourage evaluation and critical thinking

---

## 4. System Flow

### Stage 1: Engage (Problem Framing)

**User Actions:**
- Browse issue-entry resources:
  - SDG topics
  - Singapore-relevant local issue links
- Select or describe a social issue
- Write initial thoughts

**System Behavior:**
- Provide instructional prompts to guide issue identification
- After input, generate AI summary and alternative framing
- Display learner input and AI output in chat

**Reflection Prompts:**
- Do you agree with the AI summary?
- What would you change?
- What might be missing?

---

### Stage 2: Investigate (Inquiry & Evidence)

**User Actions:**
- Write investigation plan
- Collect and input evidence (text or upload)
- Interact with stakeholders (real or simulated)

**System Behavior:**
- Suggest investigation directions
- Simulate stakeholder responses (AI)
- Store both:
  - AI-generated rehearsal
  - real-world evidence

**Reflection Prompts:**
- Where does AI align with your findings?
- Where does it differ?
- What new questions emerge?

---

### Stage 3: Act (Action & Reflection)

**User Actions:**
- Propose an action plan
- Reflect on outcomes
- Complete reflection tasks

**System Behavior:**
- Provide AI feedback only when requested
- Reduce scaffolding (no forced prompts)

**Final Outputs:**
- Action plan
- Reflection on AI use (questionnaire)
- One or more guiding principles for responsible AI use

---

## 5. Core Features (MVP)

### 5.1 Chat Interface
- Single chat-based interaction
- All prompts, inputs, and AI responses appear in chat

### 5.2 AI Support Button
- "Get AI Support"
- Activated only after learner input

### 5.3 Workspace System
- Stores:
  - chat history
  - uploaded materials
  - generated outputs
- Allows learners to revisit previous work

### 5.4 Issue Entry Panel
- Displays curated issue resources (e.g., Singapore context)
- Helps learners start thinking

### 5.5 Final Reflection Trigger
- After Stage 3:
  - questionnaire appears
  - principle-writing task appears

---

## 6. Design Constraints

- Single-page web app
- HTML, CSS, JavaScript only
- No backend required
- AI can be simulated OR connected to API
- Keep UI minimal and clean

---

## 7. Out of Scope (for MVP)

- Teacher dashboard
- Automatic detection of AI interaction patterns
- Discussion forum / community features
- Advanced data analysis

---

## 8. Future Extensions

- Real AI API integration
- Adaptive scaffolding
- Teacher orchestration tools
- Community discussion space (issue-based)