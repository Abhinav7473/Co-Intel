/**
 * The junior seminar (/intro). Brief: docs/seminar/brief.md. Every word the room reads lives here, so
 * `make check-content` sees all of it (no preaching words, no jargon, earned words only after their reveal).
 * Premise: demystifying the LLM space. A preface (hands up, the premise and its two terms), the mechanism and the tools,
 * two failure modes (context rot over six screens, sycophancy over three), a recap, tonight's steps, the close.
 * One idea per screen, about 50 words at most. A test is three screens: the question, the answer, what we do now.
 * PageDown or a clicker moves one screen. The context strip at the bottom shows what each screen's session carries.
 */
export type ScreenId =
  | "welcome"
  | "premise"
  | "hook"
  | "carries"
  | "toolkit"
  | "rot-ask"
  | "rot"
  | "rot-do"
  | "rules-ask"
  | "rules"
  | "rules-do"
  | "review-ask"
  | "review"
  | "review-do"
  | "recap"
  | "tonight"
  | "close";

/** How a screen is composed. Each kind has its own layout in Panels/IntroPage. */
export type ScreenKind = "hands" | "premise" | "split" | "diagram" | "list" | "ask" | "answer" | "do" | "recap" | "steps";

export interface IntroScreen {
  id: ScreenId;
  kind: ScreenKind;
  /** label shown by the context strip (neutral, so it doesn't give a test's answer away) */
  beat: string;
  title: string;
  body: string;
}

export const TAGLINE = "Same prompt. Different answer.";

/** One prompt, word for word wherever it appears: the crit question students run on their own project tonight. */
export const PROMPT = "Read this project and list the three weakest points a crit panel would raise. Point to the files.";

export const SCREENS: IntroScreen[] = [
  {
    id: "welcome",
    kind: "hands",
    beat: "Hello",
    title: "Two quick questions",
    body: "Hands up, then keep them up if the second one is you too.",
  },
  {
    id: "premise",
    kind: "premise",
    beat: "Today",
    title: "Demystifying the LLM space",
    body: "A warm-up before you code again: what these tools read, the words around them, and two ways they fail.",
  },
  {
    id: "hook",
    kind: "split",
    beat: "Same prompt",
    title: TAGLINE,
    body: "Two Claude Code sessions get the same prompt, word for word. They won’t agree, because of what each one carries around it.",
  },
  {
    id: "carries",
    kind: "diagram",
    beat: "What it rereads",
    title: "Every message, it rereads everything",
    body: "It keeps nothing between messages. Each time you hit send, all of this goes again, and the session part keeps growing.",
  },
  {
    id: "toolkit",
    kind: "list",
    beat: "Your toolkit",
    title: "Six tools, each with a trigger",
    body: "Add one when its trigger happens, not before. On the web, a session has whatever is committed to your repo.",
  },
  {
    id: "rot-ask",
    kind: "ask",
    beat: "Failure mode 1",
    title: "Of 18 models, how many did better with the whole history?",
    body: "Same question, asked in an hour-old session full of drafts, and in a fresh one that only got a five-line note.",
  },
  {
    id: "rot",
    kind: "answer",
    beat: "Failure mode 1",
    title: "None of them.",
    body: "All 18 answered better from the short version. In a long input, models use the start and the end best, and the middle least.",
  },
  {
    id: "rot-do",
    kind: "do",
    beat: "Failure mode 1",
    title: "New task, new session, with a five-line note",
    body: "Running long mid-task? Compact it, and say what to keep.",
  },
  {
    id: "rules-ask",
    kind: "ask",
    beat: "Failure mode 1",
    title: "At 500 instructions, what share did the best model follow?",
    body: "Researchers gave 20 models between 10 and 500 instructions at once, and counted how many were followed.",
  },
  {
    id: "rules",
    kind: "answer",
    beat: "Failure mode 1",
    title: "68%, and the later ones go first.",
    body: "The rest were skipped without a word. A longer instruction file quietly loses instructions.",
  },
  {
    id: "rules-do",
    kind: "do",
    beat: "Failure mode 1",
    title: "Write CLAUDE.md yourself, and keep it short",
    body: "In a second study, notes written by AI were the one kind that made results worse. Add a line only when it gets something wrong twice.",
  },
  {
    id: "review-ask",
    kind: "ask",
    beat: "Failure mode 2",
    title: "Once a model knows you, how much more does it side with you?",
    body: "The session that helped you write it knows you, your drafts and your effort. Now it reviews your work.",
  },
  {
    id: "review",
    kind: "answer",
    beat: "Failure mode 2",
    title: "Up to 45% more often.",
    body: "Researchers replayed real chats from 38 people, with and without what the model knew about them.",
  },
  {
    id: "review-do",
    kind: "do",
    beat: "Failure mode 2",
    title: "Get reviews from a fresh session",
    body: "Or a subagent, with your criteria pasted in. Models also rate their own writing above equally good writing by others.",
  },
  {
    id: "recap",
    kind: "recap",
    beat: "Recap",
    title: "What we demystified",
    body: "One idea underneath it all: every message, it rereads everything. Each habit decides what that is.",
  },
  {
    id: "tonight",
    kind: "steps",
    beat: "Tonight",
    title: "Tonight, on your own project",
    body: "Three steps, about fifteen minutes.",
  },
  {
    id: "close",
    kind: "split",
    beat: "Same prompt",
    title: TAGLINE,
    body: "Now you know what changes the answer, and it isn’t the prompt.",
  },
];

/** The opening hands up: said aloud, counted by the presenter. */
export const HANDS_UP = [
  "Who uses Claude, Gemini or ChatGPT for projects?",
  "Who has used Claude Code or Codex?",
] as const;

/** The premise: the two words everything else leans on, defined before they are used. */
export const TERMS = [
  { word: "LLM", means: "Large language model: the engine inside Claude, Gemini and ChatGPT. It predicts the next word." },
  { word: "Token", means: "The unit it reads: a short word, or part of a longer one. Longer chats use more, and more of your limit." },
] as const;
export const AGENDA = ["What it reads, every message", "Six tools, decoded", "Two failure modes, and the studies behind them", "Tonight, on your own project"] as const;

/** The conclusion: each part of the talk in one line, and the habit it leaves. */
export const RECAP = [
  { part: "What it reads", line: "All of it, every message. A long session costs more tokens and answers worse." },
  { part: "The tools", line: "Six of them. Add one when its trigger happens, not before." },
  { part: "context rot", line: "New task, new session. A short CLAUDE.md you wrote yourself." },
  { part: "sycophancy", line: "Reviews come from a fresh session, with your criteria pasted in." },
] as const;

export const THANKS = "Thank you. Questions?";

/** Hands-up options on a question screen: said aloud, counted by the presenter, never clicked. */
export const ASK: Record<"rot-ask" | "rules-ask" | "review-ask", readonly string[]> = {
  "rot-ask": ["0", "6", "12", "18"],
  "rules-ask": ["30%", "70%", "95%"],
  "review-ask": ["None", "15%", "45%"],
};
export const HANDS = "Hands up.";

/** The opening and the close: the same prompt in two sessions. The close fills in what each one does. */
export const SESSIONS = {
  lead: "Both get the same prompt",
  known: { name: "The session you’ve worked in all week", answer: "Sides with you more often" },
  fresh: { name: "A fresh session, with your criteria", answer: "Judges only what’s in front of it" },
  hidden: "Which one goes easier on you? You’ll see.",
} as const;

/** The parts of what every message carries, in strip order. Shares are illustrative; the diagram says so. */
export const PARTS = [
  { key: "own", name: "Its own instructions", loads: "Every message" },
  { key: "notes", name: "CLAUDE.md, your notes", loads: "Every message, in full" },
  { key: "tools", name: "Skills and connectors", loads: "One line each, until used" },
  { key: "session", name: "The session so far", loads: "Grows with every message" },
  { key: "message", name: "Your message", loads: "The part you see" },
] as const;
export type PartKey = (typeof PARTS)[number]["key"];

export const CARRY = {
  rows: [
    { label: "Message 1", session: 0.04 },
    { label: "Message 10", session: 0.42 },
    { label: "Message 40", session: 0.74 },
  ],
  note: "Illustration: the parts are real, the sizes are not to scale.",
  see: "See your own: type /context in a session.",
} as const;

/**
 * The context strip per screen: the talk itself as one growing session. `notes`/`session` are shares of the bar;
 * `dim` greys part of a segment (the middle of a long session; the instructions a long file loses).
 */
export const STRIP: Record<ScreenId, { notes: number; session: number; dim?: "middle" | "notes-tail" }> = {
  welcome: { notes: 0.06, session: 0.02 },
  premise: { notes: 0.06, session: 0.04 },
  hook: { notes: 0.06, session: 0.06 },
  carries: { notes: 0.06, session: 0.14 },
  toolkit: { notes: 0.06, session: 0.22 },
  "rot-ask": { notes: 0.06, session: 0.5 },
  rot: { notes: 0.06, session: 0.62, dim: "middle" },
  "rot-do": { notes: 0.06, session: 0.03 },
  "rules-ask": { notes: 0.3, session: 0.08 },
  rules: { notes: 0.46, session: 0.1, dim: "notes-tail" },
  "rules-do": { notes: 0.07, session: 0.12 },
  "review-ask": { notes: 0.07, session: 0.6 },
  review: { notes: 0.07, session: 0.66 },
  "review-do": { notes: 0.07, session: 0.03 },
  recap: { notes: 0.07, session: 0.02 },
  tonight: { notes: 0.07, session: 0.02 },
  close: { notes: 0.07, session: 0.02 },
};
export const STRIP_LABEL = "What this message carries";

/** The toolkit, from the Claude Code docs: what each tool is, its trigger, and whether a web session has it. */
export const TOOLS = [
  { name: "CLAUDE.md", is: "Notes read every message", when: "It gets your project wrong twice", web: true },
  { name: "Skill", is: "Steps loaded only when needed", when: "You paste the same steps a third time", web: true },
  { name: "Connector (MCP)", is: "Live access to Figma, Drive, GitHub", when: "You copy from a tab it can’t see", web: true },
  { name: "Subagent", is: "A fresh helper that reports back", when: "A side task would flood the session", web: true },
  { name: "Hook", is: "A script on every matching event", when: "It has to happen every time", web: true },
  { name: "Plugin", is: "A bundle of the above", when: "A second project needs the same setup", web: false },
] as const;
export const TOOLS_HEAD = { name: "Tool", is: "What it is", when: "Reach for it when", web: "On the web" } as const;
export const WEB = { yes: "Yes", no: "No" } as const;

/** The two words. Context rot is named in test 1; sycophancy is the one earned, in test 3. */
export const WORDS = [
  { word: "context rot", revealIn: "rot", means: "The longer and messier the session, the worse the answers." },
  { word: "sycophancy", revealIn: "review", means: "Agreeing with you to keep you happy." },
] as const;
export const NAMED = "This has a name:";
/** Under a hidden word until the presenter clicks it. */
export const CLICK = "Click to reveal";

/** Test 1 artifacts. */
export const ROT = {
  noteTitle: "A new session, first message",
  note: ["Project: checkout redesign case study", "Done: drafts 1 to 3. Draft 3 is current", "Now: tighten the evidence section", "Criteria: Nielsen’s 10 heuristics", "Ignore: anything from drafts 1 and 2"],
  compactTitle: "Running long, mid-task",
  compact: "/compact keep the criteria and draft 3",
} as const;

/** Test 2 artifact. */
export const RULES = {
  fileTitle: "CLAUDE.md, written by hand",
  file: [
    "# Checkout redesign case study",
    "For Prof. Ramtin’s UX class. Crit on Friday.",
    "Criteria: Nielsen’s 10 heuristics.",
    "Current draft: case-study/draft-3.md",
    "Evidence: research/, 5 interviews so far.",
    "Ask before rewriting my words.",
  ],
} as const;

/** Test 3: the per-model result and the criteria pasted into a fresh session. */
export const REVIEW = {
  rowsLead: "How much more often each model sided with the person, once it knew them",
  rows: [
    { model: "Gemini 2.5 Pro", more: 45 },
    { model: "Claude Sonnet 4", more: 33 },
    { model: "GPT-4.1 Mini", more: 16 },
    { model: "GPT 5.1", more: 0 },
  ],
  zero: "no change",
  criteriaTitle: "Pasted into a fresh session",
  criteria: "Check this against Nielsen’s 10 usability heuristics. Name the weakest point first.",
} as const;

/** Tonight: three steps on their own project. */
export const STEPS = [
  { step: "Open it", text: "Put your class project in a GitHub repo and open it at claude.ai/code." },
  { step: "Write the notes", text: "A ten-line CLAUDE.md, by you: what it is, who it’s for, your criteria, where the draft lives." },
  { step: "Ask twice", text: "The crit question in the session you’ve worked in, then in a fresh one. Compare." },
] as const;

/** One source line per screen, shown in the footer. */
export const SOURCES: Partial<Record<ScreenId, readonly { text: string; href: string }[]>> = {
  carries: [{ text: "Claude Code docs: Extend Claude Code, context costs by feature", href: "https://code.claude.com/docs/en/features-overview" }],
  toolkit: [{ text: "Claude Code docs: Extend Claude Code; Cloud environments, what carries over", href: "https://code.claude.com/docs/en/cloud-environments" }],
  rot: [
    { text: "Chroma, Context Rot (2025): 18 models, 306 questions", href: "https://www.trychroma.com/research/context-rot" },
    { text: "Liu et al., Lost in the Middle (TACL 2024)", href: "https://arxiv.org/abs/2307.03172" },
  ],
  rules: [{ text: "Jaroslawicz et al., How Many Instructions Can LLMs Follow at Once? (IFScale, 2025)", href: "https://arxiv.org/pdf/2507.11538" }],
  "rules-do": [{ text: "ETH Zurich, Evaluating AGENTS.md (2026)", href: "https://arxiv.org/abs/2602.11988" }],
  review: [{ text: "Jain et al., CHI 2026: real chats from 38 people, replayed with and without a saved profile", href: "https://dl.acm.org/doi/10.1145/3772318.3791915" }],
  "review-do": [{ text: "Panickssery, Bowman & Feng, LLM Evaluators Recognize and Favor Their Own Generations (2024)", href: "https://arxiv.org/abs/2404.13076" }],
};
