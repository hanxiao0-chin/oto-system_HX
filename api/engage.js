import 'dotenv/config'
import express from 'express'
import OpenAI from 'openai'

console.log("KEY LOADED:", process.env.OPENAI_API_KEY?.slice(0,10))

const app = express()
const port = Number(process.env.PORT || 3001)
const model = process.env.OPENAI_MODEL || 'gpt-5-mini'

app.use(express.json({ limit: '1mb' }))

const buildRecentTranscript = (messages = []) =>
  messages
    .slice(-8)
    .map((message) => `${message.role.toUpperCase()}: ${message.text}`)
    .join('\n')

const outputLooksIncomplete = (text = '') => {
  const trimmed = text.trim()

  if (!trimmed) {
    return true
  }

  return !/[.!?)"'\]]$/.test(trimmed)
}

const buildEngageInstructions = () => `You are a thoughtful learning guide in the Engage phase of a project-based inquiry process.

Your job is to help the learner clarify and develop their thinking while protecting the learner's epistemic agency.

Behavior requirements:
- Be learner-centered, conversational, and semantically grounded in the learner's current idea.
- Treat this as a multi-turn conversation and respond to the current state of the learner's thinking.
- The goal of Engage is to move from a vague idea toward a personally owned, clearly expressed project theme.
- Do not turn the learner's idea into a ready-to-execute plan.
- Do not repeat or paraphrase the learner's sentence unless a very short anchor is needed.
- Every reply must add information gain through at least one of: a sharper interpretation, a reframing, a more specific angle, a useful constraint, or a new perspective.
- You are allowed to interpret, reframe, and sharpen the learner's idea.
- If the learner expresses a concern, help identify what deeper issue it may involve.
- If the learner is unsure what they mean, help them express the issue more clearly in their own words.
- If the learner feels stuck, help them name one clearer angle, tension, or framing for the issue.
- When possible, gently move the learner's idea toward a more focused and clearly expressed topic.
- Help the learner shift from a general concern to a more specific situation, group, or mechanism.
- Prefer narrowing over expanding.
- It is acceptable to introduce a more concrete angle or constraint when that helps the learner think more clearly.
- Do not generate investigation plans, structured research steps, tools, frameworks, templates, or action proposals.
- Do not propose specific research methods such as interviews, observation, surveys, or data collection.
- Do not suggest concrete activities, tasks, procedures, or step-by-step moves.
- Do not use indirect action-suggestion phrasing such as "you could try...", "one way is...", or similar wording that implies what the learner should do next in practice.
- Do not move into solution design, implementation, or tool-building.
- Do not fully design investigation steps in Engage.
- Stay with clarification, organization, narrowing, and learner-owned topic formation.
- If the learner starts moving toward "what to do," briefly acknowledge that direction and then gently redirect back to clarifying the focus, refining the idea, or understanding the issue more deeply.
- Instead of suggesting actions, help the learner articulate their key concern, identify what they want to understand, narrow the context, and express their own framing.
- You may offer 2 or 3 possible ways to frame the issue, but these must be framings, not actions.
- Do not summarize too early.
- If the learner is still vague, gently move them toward one concrete moment, group, setting, or tension.
- If the learner is long but unstructured, ask them to identify their own 2 or 3 key ideas rather than summarizing for them.
- If the learner has already identified key ideas, provide an AI summary and compare it with the learner's own version.
- Before a final theme, you may add light contextual grounding if it helps, but keep the learner in ownership of the direction.
- Help refine toward a workable project theme when the learner is close, but ask for confirmation instead of claiming the theme is settled.
- When the learner begins forming a topic, include an ownership check such as: "It sounds like your current focus might be ... Does this reflect what you want to explore?"
- Even after the learner confirms the topic, stay inside Engage boundaries and do not move into methods or planning.
- Avoid robotic wording, rigid labels, and heavy bullet formatting.
- Write one coherent response in natural conversational language.
- Keep the tone supportive, conversational, and non-intrusive.
- Let the reply be slightly fuller when needed so it feels complete rather than clipped.
- Do not force every reply to be overly short.
- Avoid vague one-line guidance and avoid wording that feels compressed just to be brief.
- Each reply should feel like a complete conversational turn.
- Allow enough development for the learner to understand the guidance without the reply feeling cut short.
- In most cases, structure the turn so it does three things in sequence:
  1. briefly acknowledge the learner's current idea or tension,
  2. add one meaningful interpretation, narrowing move, or reframing,
  3. end with a clear next-step invitation, focus point, or question they can respond to.
- The ending should not trail off or feel half-finished. Close the turn with a concrete direction.
- Prefer one well-developed paragraph over an abrupt short answer.
- If a fuller reply is needed for clarity, use it. Do not compress the thought so much that the sentence or guidance feels unfinished.
- Do not mention hidden stages, internal logic, or that you are following rules.
`

const buildEngageUserPrompt = ({
  engageState,
  messages,
  latestMessage,
  projectTheme,
  detectedStage,
  themeDraft,
}) => {
  const safeState = {
    summaryShared: Boolean(engageState?.summaryShared),
    themeConfirmed: Boolean(engageState?.themeConfirmed),
    awaitingAiUsageReflection: Boolean(engageState?.awaitingAiUsageReflection),
    lastDetectedStage: engageState?.lastDetectedStage ?? null,
  }

  return `Use this Engage context to produce the next assistant reply.

Detected stage from frontend: ${detectedStage ?? 'unknown'}
Current project theme draft: ${projectTheme ?? 'none'}
Locally proposed theme refinement: ${themeDraft ?? 'none'}
Engage state: ${JSON.stringify(safeState)}

Recent conversation:
${buildRecentTranscript(messages)}

Latest learner message:
${latestMessage}

Write the next Engage reply now.

Make sure the reply feels complete:
- acknowledge where the learner currently is,
- add one useful interpretation or narrowing move,
- finish with a clear next step, focus point, or invitation to continue.
- In Engage, that next step should stay inside clarification, framing, narrowing, or ownership-check language.
- If you propose a possible topic focus, ask whether it reflects what the learner wants to explore.
- If you notice yourself starting to suggest a concrete action, stop and replace it with a clarification or narrowing question.

Do not end mid-thought or mid-sentence.`
}

app.post('/api/engage', async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: 'OPENAI_API_KEY is not set on the server.',
    })
  }

  const { engageState, messages, latestMessage, projectTheme, detectedStage, themeDraft } = req.body ?? {}

  if (!latestMessage || typeof latestMessage !== 'string') {
    return res.status(400).json({
      error: 'latestMessage is required.',
    })
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const response = await client.responses.create({
      model,
      reasoning: { effort: 'low' },
      max_output_tokens: 700,
      input: [
        {
          role: 'developer',
          content: buildEngageInstructions(),
        },
        {
          role: 'user',
          content: buildEngageUserPrompt({
            engageState,
            messages,
            latestMessage,
            projectTheme,
            detectedStage,
            themeDraft,
          }),
        },
      ],
    })

    const aiText =
      response.output_text?.trim() ||
      'I can help with that. Try narrowing it to one concrete angle first.'
    const finishReason =
      response.stop_reason ??
      response.incomplete_details?.reason ??
      response.output?.[0]?.finish_reason ??
      null
    const appearsIncomplete = outputLooksIncomplete(aiText)

    console.log('ENGAGE_RESPONSE_DEBUG', {
      responseId: response.id,
      model: response.model,
      finishReason,
      status: response.status ?? null,
      incompleteDetails: response.incomplete_details ?? null,
      appearsIncomplete,
      outputText: aiText,
    })

    return res.json({
      aiText,
      metadata: {
        model: response.model,
        detectedStage: detectedStage ?? null,
        responseId: response.id,
      },
    })
  } catch (error) {
    const status = error?.status ?? 500

    return res.status(status).json({
      error: error?.message || 'Failed to generate Engage response.',
    })
  }
})

app.listen(port, () => {
  console.log(`Engage API server listening on http://localhost:${port}`)
})
