import { useEffect, useRef, useState } from 'react'
import heroImage from './assets/OTO_interface.png'
import './App.css'

const stages = ['Engage', 'Investigate', 'Act']

const featuredProjects = [
  {
    title: 'Public Transport and Gender Equity',
    summary:
      'Why are smoking zones treated as a public norm, while access to sanitary products is still missing in many stations and terminals?',
    tags: ['Gender', 'Policy', 'Urban Life'],
  },
  {
    title: 'When Age Becomes a Legal Loophole',
    summary:
      'What happens when youth survivors wait years for justice, only to find the accused protected by age limits and slow legal systems?',
    tags: ['Youth', 'Law', 'Society'],
  },
  {
    title: 'Beyond Exam Scores',
    summary:
      'Why do students with strong ideas, care work, or practical skills keep falling behind in systems that reward only test performance?',
    tags: ['Education', 'Equity'],
  },
  {
    title: 'When AI Gets It Wrong',
    summary:
      'Who pays the price when an everyday AI tool gives biased advice, invents facts, or treats some users as less credible than others?',
    tags: ['AI', 'Ethics', 'Technology'],
  },
]

const discussionTopics = [
  {
    title: 'AI Bias and Hallucination',
    metadata: '128 posts · 2.3k views',
  },
  {
    title: 'Youth Mental Health',
    metadata: '94 posts · 1.8k views',
  },
  {
    title: 'Climate and Everyday Habits',
    metadata: '76 posts · 1.4k views',
  },
  {
    title: 'Gender in Public Spaces',
    metadata: '112 posts · 2.1k views',
  },
  {
    title: 'Digital Inequality',
    metadata: '89 posts · 1.6k views',
  },
  {
    title: 'Education Pressure in Asia',
    metadata: '137 posts · 2.7k views',
  },
]

const reflectionPromptGroups = {
  acceptanceEvaluation: [
    'What makes you agree with this AI suggestion?',
    'Does this response fully fit your situation? Why or why not?',
    'Which part of this AI response feels most convincing to you?',
  ],
  ideaModificationAndComparison: [
    'Which parts would you keep, and which would you change?',
    'How does your idea differ from the AI suggestion?',
    'What would you add to make this idea more useful for your context?',
  ],
  uncertaintyClarification: [
    'Which part are you unsure about?',
    'What information would help you decide?',
    'What feels unclear or difficult to judge in this suggestion?',
  ],
  evidenceBasedReasoning: [
    'What evidence supports your view?',
    'How does this compare with real-world information or experience?',
    'What facts or examples would you use to test this suggestion?',
  ],
  perspectiveExtension: [
    'Does this suggestion offer a perspective you had not considered?',
    'How might this idea be limited in other contexts?',
    'Who might see this suggestion differently, and why?',
  ],
}

const engageWelcomeMessage = `Welcome.

This space is for you to explore a real-world issue that you care about.

You dont need to have a clear idea yet.

You can start by sharing:
- something you have noticed
- something that frustrates you
- or a situation that stayed with you

What brought you here today?`

const pickRandomItem = (items) => {
  const randomIndex = Math.floor(Math.random() * items.length)
  return items[randomIndex]
}

const getRandomReflectionPrompt = () => {
  const promptGroups = Object.values(reflectionPromptGroups)
  const selectedGroup = pickRandomItem(promptGroups)
  return pickRandomItem(selectedGroup)
}

const getMessageFocus = (message) => {
  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes('problem') || normalizedMessage.includes('issue')) {
    return 'a problem you want to understand better'
  }

  if (normalizedMessage.includes('plan') || normalizedMessage.includes('action')) {
    return 'a possible plan or next step'
  }

  if (
    normalizedMessage.includes('evidence') ||
    normalizedMessage.includes('research') ||
    normalizedMessage.includes('data')
  ) {
    return 'evidence you may want to examine more closely'
  }

  if (
    normalizedMessage.includes('community') ||
    normalizedMessage.includes('people') ||
    normalizedMessage.includes('student')
  ) {
    return 'how different people might experience this issue'
  }

  return 'an idea worth exploring further'
}

const truncateText = (text, maxLength = 120) =>
  text.length > maxLength ? `${text.slice(0, maxLength - 3).trim()}...` : text

const countWords = (message) => message.trim().split(/\s+/).filter(Boolean).length

const normalizeText = (message) => message.toLowerCase().trim()

const createMessage = (role, text, extras = {}) => ({
  id: Date.now() + Math.floor(Math.random() * 1000),
  role,
  text,
  ...extras,
})

const replaceMessageById = (messages, messageId, nextMessage) =>
  messages.map((message) => (message.id === messageId ? nextMessage : message))

const createEngageState = () => ({
  summaryShared: false,
  themeConfirmed: false,
  awaitingAiUsageReflection: false,
  lastDetectedStage: 'opening',
})

const fillerWords = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'from',
  'have',
  'i',
  'if',
  'in',
  'is',
  'it',
  'just',
  'kind',
  'maybe',
  'of',
  'on',
  'or',
  'really',
  'so',
  'something',
  'that',
  'the',
  'this',
  'to',
  'um',
  'uh',
  'was',
  'with',
])

const splitIntoThoughtUnits = (message) =>
  message
    .split(/\n+|(?<=[.!?])\s+|;\s+/)
    .map((unit) => unit.trim().replace(/^[-*•\d.)\s]+/, ''))
    .filter(Boolean)

const getContentWords = (message) =>
  normalizeText(message)
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word && !fillerWords.has(word))

const analyzeMessageShape = (message) => {
  const thoughtUnits = splitIntoThoughtUnits(message)
  const wordCount = countWords(message)
  const contentWords = [...new Set(getContentWords(message))]
  const lines = message.split('\n').map((line) => line.trim()).filter(Boolean)
  const listLikeLines = lines.filter((line) => /^[-*•]|\d+[.)]/.test(line)).length
  const averageUnitLength =
    thoughtUnits.length > 0 ? wordCount / thoughtUnits.length : wordCount
  const hasStructuredLayout =
    listLikeLines >= 2 ||
    lines.length >= 3 ||
    (thoughtUnits.length >= 2 && averageUnitLength <= 18)
  const hasConcreteAnchor =
    /\b(for|in|at|between|during|among|within|around)\b/i.test(message) ||
    /"/.test(message)
  const hasContrast = /\b(but|however|while|although|yet)\b/i.test(message)

  return {
    thoughtUnits,
    wordCount,
    contentWordCount: contentWords.length,
    averageUnitLength,
    hasStructuredLayout,
    hasConcreteAnchor,
    hasContrast,
  }
}

const summarizeThoughtUnits = (messages) => {
  const units = messages
    .flatMap((entry) => splitIntoThoughtUnits(entry.text))
    .map((unit) => unit.replace(/\s+/g, ' ').trim())
    .filter((unit) => countWords(unit) >= 4)

  return [...new Set(units)].slice(0, 3)
}

const buildIdeaSummaryPoints = (userMessages) => {
  const summaryUnits = summarizeThoughtUnits(userMessages)

  if (summaryUnits.length > 0) {
    return summaryUnits.map((unit) => unit.replace(/^./, (character) => character.toUpperCase()))
  }

  return ['A real situation that feels important to you']
}

const extractFocusAnchor = (message, fallback = 'this issue') => {
  const candidate = splitIntoThoughtUnits(message).find((unit) => countWords(unit) >= 4) ?? message.trim()
  const cleaned = candidate
    .replace(/^(i think|i feel|i keep noticing|maybe|it seems like|it feels like)\s+/i, '')
    .replace(/[.?!]+$/, '')
    .trim()

  return cleaned ? truncateText(cleaned, 60) : fallback
}

const buildThemeDirections = (message) => {
  const focusAnchor = extractFocusAnchor(message)

  return [
    `Focus on one group or perspective inside "${focusAnchor}".`,
    `Anchor "${focusAnchor}" in one setting, moment, or routine you could actually examine.`,
    `Turn "${focusAnchor}" into a question about the barrier, pattern, or inequality underneath it.`,
  ]
}

const refineThemeWording = (message) => {
  const focusAnchor = extractFocusAnchor(message, 'a concrete issue in one local context')

  if (/^(how|why|what)\b/i.test(focusAnchor)) {
    return focusAnchor.replace(/^./, (character) => character.toUpperCase())
  }

  return `Exploring ${focusAnchor}`
}

const joinNaturally = (items) => {
  if (items.length <= 1) {
    return items[0] ?? ''
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`
  }

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

const buildEngageReference = (message) => {
  const focusAnchor = extractFocusAnchor(message, 'this issue')
  return `This seems related to ${focusAnchor}.`
}

const buildEngageInterpretation = (message) => {
  const shape = analyzeMessageShape(message)

  if (shape.hasContrast) {
    return 'There may be a tension here between what feels normal on the surface and what feels unfair underneath.'
  }

  if (shape.hasConcreteAnchor) {
    return 'The useful thing here is that it already points toward a real situation rather than an abstract topic.'
  }

  if (shape.thoughtUnits.length >= 2) {
    return 'It seems like there are a few layers here, including the situation itself, who it affects, and what keeps it in place.'
  }

  return 'What seems most useful here is finding the specific angle that makes the issue matter in practice.'
}

const inferEngageStage = (message, state, userMessages) => {
  const shape = analyzeMessageShape(message)
  const recentMessages = userMessages.slice(-3)
  const recentUnitCount = summarizeThoughtUnits(recentMessages).length
  const isShortOrVague = shape.wordCount <= 8 || shape.contentWordCount <= 2
  const isStructuredIdeas =
    shape.hasStructuredLayout &&
    shape.thoughtUnits.length >= 2 &&
    shape.averageUnitLength <= 20
  const isLongButUnstructured =
    shape.wordCount >= 30 &&
    !shape.hasStructuredLayout &&
    (shape.averageUnitLength >= 18 || shape.thoughtUnits.length <= 2)
  const isCloseToTopic =
    shape.wordCount >= 8 &&
    shape.wordCount <= 30 &&
    shape.thoughtUnits.length <= 3 &&
    (shape.hasConcreteAnchor || state.summaryShared || recentUnitCount >= 3 || shape.hasContrast)

  if (isShortOrVague) {
    return 'elaborate'
  }

  if (isStructuredIdeas && !state.summaryShared) {
    return 'summarize'
  }

  if (isCloseToTopic) {
    return 'topic'
  }

  if (isLongButUnstructured) {
    return 'organize'
  }

  if (isStructuredIdeas) {
    return 'topic'
  }

  return state.summaryShared ? 'topic' : 'organize'
}

const buildEngageResponse = (message, state, currentMessages) => {
  const nextState = { ...state }
  const userMessages = currentMessages.filter((entry) => entry.role === 'user')

  if (state.awaitingAiUsageReflection) {
    nextState.awaitingAiUsageReflection = false

    return {
      message: createMessage(
        'ai',
        `${buildEngageReference(
          message
        )} ${buildEngageInterpretation(
          message
        )} What matters now is that you are choosing what is genuinely useful, so the next step is simply to keep the parts that sharpen your thinking and leave aside the ones that do not.`
      ),
      nextState,
    }
  }

  const detectedStage = inferEngageStage(message, state, userMessages)
  nextState.lastDetectedStage = detectedStage

  if (detectedStage === 'elaborate') {
    return {
      message: createMessage(
        'ai',
        `${buildEngageReference(
          message
        )} ${buildEngageInterpretation(
          message
        )} To move it forward, you might stay with the one part that makes it feel most real, whether that is the setting, the people involved, or the moment where the issue becomes visible.`
      ),
      nextState,
    }
  }

  if (detectedStage === 'organize') {
    return {
      message: createMessage(
        'ai',
        `${buildEngageReference(
          message
        )} ${buildEngageInterpretation(
          message
        )} Rather than adding more detail, it would help to hear the two or three ideas you think matter most, because that will show whether the center of the issue is the experience itself, the people affected, or the pattern behind it.`
      ),
      nextState,
    }
  }

  if (detectedStage === 'summarize') {
    nextState.summaryShared = true
    const summaryPoints = buildIdeaSummaryPoints(userMessages)
    const summaryText = joinNaturally(summaryPoints.slice(0, 3).map((point) => point.toLowerCase()))

    return {
      message: createMessage(
        'ai',
        `${buildEngageReference(
          message
        )} ${buildEngageInterpretation(
          message
        )} My summary would frame it as ${summaryText}. Your version stays closer to how you first understood the issue, while mine tries to make the underlying pattern more visible, so the useful comparison is which one helps you see the issue more clearly.`
      ),
      nextState,
    }
  }

  const refinedTheme = refineThemeWording(message)
  const directionText = joinNaturally(
    buildThemeDirections(message).map((direction) => direction.charAt(0).toLowerCase() + direction.slice(1))
  )
  nextState.themeConfirmed = true
  nextState.awaitingAiUsageReflection = true

  return {
    message: createMessage(
      'ai',
      `${buildEngageReference(
        message
      )} ${buildEngageInterpretation(
        message
      )} The next useful move is to decide whether you want to center the affected group, the setting where it shows up, or the barrier underneath it, so I can see it moving toward ${directionText}. If you keep that choice narrow, a theme like ${refinedTheme} starts to feel workable.`,
      { themeDraft: refinedTheme }
    ),
    nextState,
  }
}

const buildSimulatedAiResponse = (message) => {
  const focus = getMessageFocus(message)
  const shortenedMessage =
    message.length > 90 ? `${message.slice(0, 87).trim()}...` : message

  const followUpOptions = [
    'It sounds like you are thinking about what matters most here.',
    'You might be noticing that different people could see this differently.',
    'This could relate to how the idea connects to real experiences.',
    'It sounds like you are weighing both the idea and its effects.',
    'You might be thinking about what evidence fits this view best.',
  ]

  return `It sounds like you are noticing ${focus}: "${shortenedMessage}". ${pickRandomItem(followUpOptions)}`
}

const buildAiMessage = (message, stage, options = {}) => {
  if (stage === 'Engage') {
    return buildEngageResponse(message, options.engageState, options.messages)
  }

  return {
    message: createMessage('ai', buildSimulatedAiResponse(message)),
    nextState: options.engageState ?? createEngageState(),
  }
}

const requestEngageReply = async ({
  engageState,
  messages,
  latestMessage,
  projectTheme,
  detectedStage,
  themeDraft,
}) => {
  const response = await fetch('/api/engage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      engageState,
      messages,
      latestMessage,
      projectTheme,
      detectedStage,
      themeDraft,
    }),
  })

  if (!response.ok) {
    const errorPayload = await response.json().catch(() => null)
    throw new Error(errorPayload?.error || 'Failed to generate Engage response.')
  }

  return response.json()
}

function App() {
  const [hasStartedProject, setHasStartedProject] = useState(false)
  const [currentStageIndex, setCurrentStageIndex] = useState(0)
  const [draftMessage, setDraftMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [engageState, setEngageState] = useState(createEngageState)
  const [isAwaitingEngageReply, setIsAwaitingEngageReply] = useState(false)
  const [projectTheme, setProjectTheme] = useState(
    'Choose a social issue, collect meaningful examples, and shape it into a project focus.'
  )
  const [savedMessageIds, setSavedMessageIds] = useState([])
  const [isSelectingMessages, setIsSelectingMessages] = useState(false)
  const [selectedMessageIds, setSelectedMessageIds] = useState([])
  const [isConversationDialogOpen, setIsConversationDialogOpen] = useState(false)
  const [conversationTitle, setConversationTitle] = useState('')
  const [expandedConversationIds, setExpandedConversationIds] = useState([])
  const [workspaceMaterials, setWorkspaceMaterials] = useState({
    Engage: [],
    Investigate: [],
    Act: [],
  })
  const messageListRef = useRef(null)
  const fileInputRef = useRef(null)
  const sectionFileInputRefs = useRef({
    Engage: null,
    Investigate: null,
    Act: null,
  })

  const currentStage = stages[currentStageIndex]
  const currentStageMaterials = workspaceMaterials[currentStage]
  const canAdvanceStage =
    currentStage !== 'Act' && currentStageMaterials.length > 0

  const handleSendMessage = async () => {
    const trimmedMessage = draftMessage.trim()

    if (!trimmedMessage) {
      return
    }

    if (currentStage === 'Engage' && isAwaitingEngageReply) {
      return
    }

    const userMessage = createMessage('user', trimmedMessage)
    const placeholderMessage =
      currentStage === 'Engage'
        ? createMessage('ai', 'Thinking...', { isPending: true })
        : null

    const conversationWithUser = [...messages, userMessage]
    const { message: plannedAiMessage, nextState } = buildAiMessage(trimmedMessage, currentStage, {
      engageState,
      messages: conversationWithUser,
    })

    setDraftMessage('')
    setMessages((currentMessages) => [
      ...currentMessages,
      userMessage,
      ...(placeholderMessage ? [placeholderMessage] : []),
    ])

    if (currentStage === 'Engage') {
      setIsAwaitingEngageReply(true)

      try {
        const { aiText } = await requestEngageReply({
          engageState,
          messages: conversationWithUser,
          latestMessage: trimmedMessage,
          projectTheme,
          detectedStage: nextState.lastDetectedStage,
          themeDraft: plannedAiMessage.themeDraft,
        })

        const aiMessage = {
          ...plannedAiMessage,
          id: placeholderMessage.id,
          text: aiText,
          isPending: false,
        }

        setMessages((currentMessages) =>
          replaceMessageById(currentMessages, placeholderMessage.id, aiMessage)
        )
        setEngageState(nextState)

        if (aiMessage.themeDraft) {
          setProjectTheme(aiMessage.themeDraft)
        }
      } catch (error) {
        const fallbackMessage = {
          ...plannedAiMessage,
          id: placeholderMessage.id,
          text: `I could not get the Engage reply just now. Please try again.\n\n[Engage API unavailable: ${error.message}]`,
          isPending: false,
          isError: true,
        }

        setMessages((currentMessages) =>
          replaceMessageById(currentMessages, placeholderMessage.id, fallbackMessage)
        )
      } finally {
        setIsAwaitingEngageReply(false)
      }
      return
    }

    const aiMessage = plannedAiMessage
    const reflectionMessage = {
      id: Date.now() + 2,
      role: 'system',
      text: getRandomReflectionPrompt(),
    }

    setMessages((currentMessages) => [...currentMessages, aiMessage, reflectionMessage])
  }

  const addWorkspaceItem = (stage, item) => {
    setWorkspaceMaterials((currentMaterials) => ({
      ...currentMaterials,
      [stage]: [...currentMaterials[stage], item],
    }))
  }

  const handleSaveMessage = (message) => {
    if (savedMessageIds.includes(message.id)) {
      return
    }

    addWorkspaceItem(currentStage, {
      id: `${message.id}-${currentStage}`,
      type: 'note',
      text: message.text,
    })
    setSavedMessageIds((currentIds) => [...currentIds, message.id])
  }

  const handleToggleSelectionMode = () => {
    setIsSelectingMessages((currentValue) => !currentValue)
    setSelectedMessageIds([])
    setIsConversationDialogOpen(false)
    setConversationTitle('')
  }

  const handleToggleMessageSelection = (messageId) => {
    setSelectedMessageIds((currentIds) =>
      currentIds.includes(messageId)
        ? currentIds.filter((id) => id !== messageId)
        : [...currentIds, messageId]
    )
  }

  const handleCancelSelectionMode = () => {
    setIsSelectingMessages(false)
    setSelectedMessageIds([])
    setIsConversationDialogOpen(false)
    setConversationTitle('')
  }

  const handleOpenConversationDialog = () => {
    if (selectedMessageIds.length === 0) {
      return
    }

    setConversationTitle('')
    setIsConversationDialogOpen(true)
  }

  const handleSaveSelectedConversation = () => {
    const trimmedTitle = conversationTitle.trim()

    if (!trimmedTitle) {
      return
    }

    const selectedMessages = messages.filter((message) =>
      selectedMessageIds.includes(message.id)
    )

    addWorkspaceItem(currentStage, {
      id: `${Date.now()}-conversation-${currentStage}`,
      type: 'conversation',
      title: trimmedTitle,
      messages: selectedMessages.map((message) => ({
        id: message.id,
        role: message.role,
        text: message.text,
      })),
    })

    setIsConversationDialogOpen(false)
    setConversationTitle('')
    setSelectedMessageIds([])
    setIsSelectingMessages(false)
  }

  const handleToggleConversationExpanded = (conversationId) => {
    setExpandedConversationIds((currentIds) =>
      currentIds.includes(conversationId)
        ? currentIds.filter((id) => id !== conversationId)
        : [...currentIds, conversationId]
    )
  }

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleSectionUploadButtonClick = (stage) => {
    sectionFileInputRefs.current[stage]?.click()
  }

  const handleFileSelection = (event) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    addWorkspaceItem(currentStage, {
      id: `${Date.now()}-${selectedFile.name}`,
      type: 'file',
      text: selectedFile.name,
    })
    event.target.value = ''
  }

  const handleSectionFileSelection = (stage, event) => {
    const selectedFile = event.target.files?.[0]

    if (!selectedFile) {
      return
    }

    addWorkspaceItem(stage, {
      id: `${Date.now()}-${stage}-${selectedFile.name}`,
      type: 'file',
      text: selectedFile.name,
    })
    event.target.value = ''
  }

  const handleComposerKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSendMessage()
    }
  }

  const handleNextStage = () => {
    if (!canAdvanceStage) {
      return
    }

    setCurrentStageIndex((currentIndex) =>
      currentIndex < stages.length - 1 ? currentIndex + 1 : currentIndex
    )
  }

  const handleStartProject = () => {
    setHasStartedProject(true)
    setMessages([createMessage('ai', engageWelcomeMessage)])
    setEngageState(createEngageState())
  }

  useEffect(() => {
    if (!messageListRef.current) {
      return
    }

    messageListRef.current.scrollTop = messageListRef.current.scrollHeight
  }, [messages])

  if (!hasStartedProject) {
    return (
      <main className="home-shell">
        <section className="entry-strip" aria-label="Entry options">
          <button type="button" className="entry-link">
            Continue as Guest
          </button>
          <span className="entry-divider" aria-hidden="true">
            /
          </span>
          <button type="button" className="entry-link entry-link--muted">
            Sign in (Coming Soon)
          </button>
        </section>

        <section className="home-surface">
          <header className="top-nav" aria-label="Homepage navigation">
            <div className="brand-mark">OTO System</div>
            <nav className="top-nav-links">
              <button type="button" className="nav-link">
                Hot Topics
              </button>
              <button type="button" className="nav-link">
                Global Watch
              </button>
              <button type="button" className="nav-link">
                Groups
              </button>
              <button type="button" className="nav-link">
                Teacher Support
              </button>
              <button
                type="button"
                className="nav-link nav-link--primary"
                onClick={handleStartProject}
              >
                Start Project
              </button>
            </nav>
          </header>

          <div className="home-stack">
            <section className="hero-panel" aria-label="Homepage hero">
              <div className="hero-section">
                <div className="hero-copy">
                  <p className="app-eyebrow">Discussion, inquiry, action</p>
                  <h1>Shape the future with AI do not let AI shape you.</h1>
                  <p className="app-copy">
                    Explore real issues, question assumptions, and turn ideas
                    into meaningful action.
                  </p>
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="app-button"
                      onClick={handleStartProject}
                    >
                      Start a Project
                    </button>
                    <button
                      type="button"
                      className="app-button app-button--secondary"
                    >
                      Explore Issues
                    </button>
                  </div>
                </div>
                <div className="hero-visual">
                  <div className="hero-visual-card">
                    <img
                      className="hero-image"
                      src={heroImage}
                      alt="OTO System interface preview"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="content-layout" aria-label="Homepage content">
              <div className="content-main">
                <section className="section-block projects-panel">
                  <header className="section-header">
                    <h2>Featured Projects</h2>
                    <p>
                      Lets view students work and see how ideas turn into
                      action.
                    </p>
                  </header>
                  <div className="project-grid">
                    {featuredProjects.map((project) => (
                      <article key={project.title} className="project-card">
                        <div className="project-card-top">
                          <span className="project-avatar" aria-hidden="true" />
                          <div
                            className="project-image-placeholder"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="project-card-body">
                          <h3>{project.title}</h3>
                          <p>{project.summary}</p>
                        </div>
                        <div className="tag-row" aria-label="Project tags">
                          {project.tags.map((tag) => (
                            <span key={tag} className="tag-pill">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="project-actions" aria-label="Project actions">
                          <span>Like</span>
                          <span>Comment</span>
                          <span>Save</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <aside className="content-sidebar">
                <section className="section-block sidebar-card discussion-panel">
                  <header className="section-header">
                    <h2>Discussion Zone</h2>
                    <p>Topics people are actively exploring this month</p>
                  </header>
                  <div className="topic-list">
                    {discussionTopics.map((topic) => (
                      <article key={topic.title} className="topic-item">
                        <h3>{topic.title}</h3>
                        <p>{topic.metadata}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <section className="section-block sidebar-card expert-card">
                  <header className="section-header">
                    <h2>Expert Connect</h2>
                  </header>
                  <p>
                    Need guidance? Connect with mentors and educators to refine
                    your ideas.
                  </p>
                  <span className="status-chip">Coming Soon</span>
                </section>

                <section className="section-block sidebar-card collaboration-card">
                  <h2>Build a Group</h2>
                  <p>Create a discussion circle around a shared issue.</p>
                  <span className="status-chip">Coming Soon</span>
                </section>
              </aside>
            </section>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="workspace-shell">
      <header className="workspace-header" aria-label="Workspace header">
        <div className="workspace-stage">
          <p className="workspace-stage-label">Current Stage</p>
          <h1>{currentStage}</h1>
        </div>
        <div className="workspace-progress" aria-label="Stage progress">
          Stage {currentStageIndex + 1} / {stages.length}
        </div>
        <div className="workspace-stage-controls">
          <button
            type="button"
            className="app-button"
            onClick={handleNextStage}
            disabled={!canAdvanceStage}
          >
            {currentStage === 'Act' ? 'Final Stage' : 'Next Stage'}
          </button>
          {!canAdvanceStage ? (
            <p className="workspace-stage-helper">
              Save at least one material in this stage before continuing.
            </p>
          ) : (
            <p className="workspace-stage-helper workspace-stage-helper--ready">
              You have enough material to move forward.
            </p>
          )}
        </div>
      </header>

      <section className="workspace-layout" aria-label="Main interface layout">
        <div className="chat-panel" aria-label="Chat area">
          <div className="chat-panel-header">
            <p className="panel-label">Chat Area</p>
            <button
              type="button"
              className={`chat-select-button${
                isSelectingMessages ? ' chat-select-button--active' : ''
              }`}
              onClick={handleToggleSelectionMode}
            >
              {isSelectingMessages ? 'Exit Selection' : 'Select Messages'}
            </button>
          </div>
          <div
            ref={messageListRef}
            className={`message-list${
              isSelectingMessages ? ' message-list--selection-mode' : ''
            }`}
            aria-label="Message list"
          >
            {messages.length === 0 ? (
              <p className="chat-empty">No messages yet.</p>
            ) : (
              messages.map((message) => (
                <article
                  key={message.id}
                  className={`message-bubble message-bubble--${message.role}${
                    message.isPending ? ' message-bubble--pending' : ''
                  }${message.isError ? ' message-bubble--error' : ''}`}
                >
                  {isSelectingMessages ? (
                    <label className="message-select-control">
                      <input
                        type="checkbox"
                        checked={selectedMessageIds.includes(message.id)}
                        onChange={() => handleToggleMessageSelection(message.id)}
                      />
                      <span className="message-select-indicator" aria-hidden="true" />
                    </label>
                  ) : null}
                  <p className="message-role">
                    {message.role === 'ai'
                      ? 'AI'
                      : message.role === 'system'
                        ? 'Reflection'
                        : 'You'}
                  </p>
                  {message.role === 'ai' && currentStage === 'Engage' ? (
                    <div className="ai-engage-reply">
                      <p className={message.isPending ? 'ai-thinking-text' : ''}>
                        {message.text}
                      </p>
                      {message.suggestionIntro || message.suggestions?.length ? (
                        <div className="ai-inline-suggestions">
                          {message.suggestionIntro ? (
                            <p className="ai-inline-suggestions-intro">
                              {message.suggestionIntro}
                            </p>
                          ) : null}
                          {message.suggestions?.length ? (
                            <ul className="ai-inline-suggestions-list">
                              {message.suggestions.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <p>{message.text}</p>
                  )}
                  {message.role === 'user' && !isSelectingMessages ? (
                    <button
                      type="button"
                      className="message-save-button"
                      onClick={() => handleSaveMessage(message)}
                      disabled={savedMessageIds.includes(message.id)}
                    >
                      {savedMessageIds.includes(message.id)
                        ? 'Saved to Workspace'
                        : 'Save to Workspace'}
                    </button>
                  ) : null}
                </article>
              ))
            )}
          </div>
          {isSelectingMessages ? (
            <div className="selection-action-bar">
              <p className="selection-count">
                {selectedMessageIds.length} selected
              </p>
              <div className="selection-action-buttons">
                <button
                  type="button"
                  className="app-button app-button--secondary"
                  onClick={handleCancelSelectionMode}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="app-button"
                  onClick={handleOpenConversationDialog}
                  disabled={selectedMessageIds.length === 0}
                >
                  Save Selected
                </button>
              </div>
            </div>
          ) : null}
          {isConversationDialogOpen ? (
            <div className="conversation-dialog" aria-label="Save conversation dialog">
              <p className="conversation-dialog-label">Save selected messages</p>
              <input
                type="text"
                className="conversation-title-input"
                value={conversationTitle}
                onChange={(event) => setConversationTitle(event.target.value)}
                placeholder="Enter a conversation title"
              />
              <div className="selection-action-buttons">
                <button
                  type="button"
                  className="app-button app-button--secondary"
                  onClick={() => {
                    setIsConversationDialogOpen(false)
                    setConversationTitle('')
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="app-button"
                  onClick={handleSaveSelectedConversation}
                  disabled={!conversationTitle.trim()}
                >
                  Save Conversation
                </button>
              </div>
            </div>
          ) : null}
          <div className="chat-composer">
            <input
              ref={fileInputRef}
              type="file"
              className="chat-file-input"
              onChange={handleFileSelection}
            />
            <textarea
              className="chat-input"
              value={draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              onKeyDown={handleComposerKeyDown}
              placeholder="Type a message..."
              rows="3"
            />
            <div className="chat-actions">
              <button
                type="button"
                className="app-button app-button--secondary"
                onClick={handleUploadButtonClick}
              >
                Upload File
              </button>
              <button
                type="button"
                className="app-button"
                onClick={handleSendMessage}
                disabled={currentStage === 'Engage' && isAwaitingEngageReply}
              >
                {currentStage === 'Engage' && isAwaitingEngageReply ? 'Waiting...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
        <aside className="sidebar-panel" aria-label="Workspace sidebar">
          <section className="workspace-section workspace-section--theme">
            <div className="workspace-section-header">
              <p className="panel-label">Project Theme</p>
            </div>
            <textarea
              className="workspace-theme-input"
              value={projectTheme}
              onChange={(event) => setProjectTheme(event.target.value)}
              rows="4"
            />
          </section>

          <section className="workspace-section workspace-section--engage">
            <div className="workspace-section-header">
              <p className="panel-label">Engage Materials</p>
              <button
                type="button"
                className="workspace-add-file-button"
                onClick={() => handleSectionUploadButtonClick('Engage')}
              >
                Add File
              </button>
            </div>
            <input
              ref={(element) => {
                sectionFileInputRefs.current.Engage = element
              }}
              type="file"
              className="chat-file-input"
              onChange={(event) => handleSectionFileSelection('Engage', event)}
            />
            <div className="workspace-item-list">
              {workspaceMaterials.Engage.length === 0 ? (
                <p className="workspace-empty">
                  Save ideas or upload inspiration files during Engage.
                </p>
              ) : (
                workspaceMaterials.Engage.map((item) => (
                  <article
                    key={item.id}
                    className={`workspace-item-card${
                      item.type === 'conversation'
                        ? ' workspace-item-card--conversation'
                        : ''
                    }`}
                  >
                    {item.type === 'conversation' ? (
                      <>
                        <p className="workspace-item-type">Saved Conversation</p>
                        <h3 className="workspace-conversation-title">{item.title}</h3>
                        <p className="workspace-conversation-meta">
                          {item.messages.length} messages
                        </p>
                        <p className="workspace-item-text">
                          {item.messages
                            .slice(0, 2)
                            .map((message) => `${message.role}: ${message.text}`)
                            .join(' ')}
                        </p>
                        <button
                          type="button"
                          className="workspace-view-button"
                          onClick={() => handleToggleConversationExpanded(item.id)}
                        >
                          {expandedConversationIds.includes(item.id)
                            ? 'Hide Conversation'
                            : 'View Conversation'}
                        </button>
                        {expandedConversationIds.includes(item.id) ? (
                          <div className="workspace-conversation-thread">
                            {item.messages.map((message) => (
                              <article
                                key={`${item.id}-${message.id}`}
                                className="workspace-conversation-message"
                              >
                                <p className="workspace-item-type">
                                  {message.role === 'ai' ? 'AI' : message.role}
                                </p>
                                <p className="workspace-item-text">{message.text}</p>
                              </article>
                            ))}
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <p className="workspace-item-type">
                          {item.type === 'file' ? 'Uploaded File' : 'Saved Note'}
                        </p>
                        <p className="workspace-item-text">{item.text}</p>
                      </>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="workspace-section workspace-section--investigate">
            <div className="workspace-section-header">
              <p className="panel-label">Investigate Materials</p>
              <button
                type="button"
                className="workspace-add-file-button"
                onClick={() => handleSectionUploadButtonClick('Investigate')}
              >
                Add File
              </button>
            </div>
            <input
              ref={(element) => {
                sectionFileInputRefs.current.Investigate = element
              }}
              type="file"
              className="chat-file-input"
              onChange={(event) =>
                handleSectionFileSelection('Investigate', event)
              }
            />
            <div className="workspace-item-list">
              {workspaceMaterials.Investigate.length === 0 ? (
                <p className="workspace-empty">
                  Save investigation plans, evidence notes, or uploaded files here.
                </p>
              ) : (
                workspaceMaterials.Investigate.map((item) => (
                  <article
                    key={item.id}
                    className={`workspace-item-card${
                      item.type === 'conversation'
                        ? ' workspace-item-card--conversation'
                        : ''
                    }`}
                  >
                    {item.type === 'conversation' ? (
                      <>
                        <p className="workspace-item-type">Saved Conversation</p>
                        <h3 className="workspace-conversation-title">{item.title}</h3>
                        <p className="workspace-conversation-meta">
                          {item.messages.length} messages
                        </p>
                        <p className="workspace-item-text">
                          {item.messages
                            .slice(0, 2)
                            .map((message) => `${message.role}: ${message.text}`)
                            .join(' ')}
                        </p>
                        <button
                          type="button"
                          className="workspace-view-button"
                          onClick={() => handleToggleConversationExpanded(item.id)}
                        >
                          {expandedConversationIds.includes(item.id)
                            ? 'Hide Conversation'
                            : 'View Conversation'}
                        </button>
                        {expandedConversationIds.includes(item.id) ? (
                          <div className="workspace-conversation-thread">
                            {item.messages.map((message) => (
                              <article
                                key={`${item.id}-${message.id}`}
                                className="workspace-conversation-message"
                              >
                                <p className="workspace-item-type">
                                  {message.role === 'ai' ? 'AI' : message.role}
                                </p>
                                <p className="workspace-item-text">{message.text}</p>
                              </article>
                            ))}
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <p className="workspace-item-type">
                          {item.type === 'file' ? 'Uploaded File' : 'Saved Note'}
                        </p>
                        <p className="workspace-item-text">{item.text}</p>
                      </>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>

          <section className="workspace-section workspace-section--act">
            <div className="workspace-section-header">
              <p className="panel-label">Act Materials</p>
              <button
                type="button"
                className="workspace-add-file-button"
                onClick={() => handleSectionUploadButtonClick('Act')}
              >
                Add File
              </button>
            </div>
            <input
              ref={(element) => {
                sectionFileInputRefs.current.Act = element
              }}
              type="file"
              className="chat-file-input"
              onChange={(event) => handleSectionFileSelection('Act', event)}
            />
            <div className="workspace-item-list">
              {workspaceMaterials.Act.length === 0 ? (
                <p className="workspace-empty">
                  Save action drafts, reflection notes, or uploaded files here.
                </p>
              ) : (
                workspaceMaterials.Act.map((item) => (
                  <article
                    key={item.id}
                    className={`workspace-item-card${
                      item.type === 'conversation'
                        ? ' workspace-item-card--conversation'
                        : ''
                    }`}
                  >
                    {item.type === 'conversation' ? (
                      <>
                        <p className="workspace-item-type">Saved Conversation</p>
                        <h3 className="workspace-conversation-title">{item.title}</h3>
                        <p className="workspace-conversation-meta">
                          {item.messages.length} messages
                        </p>
                        <p className="workspace-item-text">
                          {item.messages
                            .slice(0, 2)
                            .map((message) => `${message.role}: ${message.text}`)
                            .join(' ')}
                        </p>
                        <button
                          type="button"
                          className="workspace-view-button"
                          onClick={() => handleToggleConversationExpanded(item.id)}
                        >
                          {expandedConversationIds.includes(item.id)
                            ? 'Hide Conversation'
                            : 'View Conversation'}
                        </button>
                        {expandedConversationIds.includes(item.id) ? (
                          <div className="workspace-conversation-thread">
                            {item.messages.map((message) => (
                              <article
                                key={`${item.id}-${message.id}`}
                                className="workspace-conversation-message"
                              >
                                <p className="workspace-item-type">
                                  {message.role === 'ai' ? 'AI' : message.role}
                                </p>
                                <p className="workspace-item-text">{message.text}</p>
                              </article>
                            ))}
                          </div>
                        ) : null}
                      </>
                    ) : (
                      <>
                        <p className="workspace-item-type">
                          {item.type === 'file' ? 'Uploaded File' : 'Saved Note'}
                        </p>
                        <p className="workspace-item-text">{item.text}</p>
                      </>
                    )}
                  </article>
                ))
              )}
            </div>
          </section>
        </aside>
      </section>
    </main>
  )
}

export default App
