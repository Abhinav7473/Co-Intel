/**
 * The junior seminar (/intro). Brief: docs/seminar/brief.md. Every word the room reads lives here, so
 * `make check-content` sees all of it (no preaching words, no jargon, earned words only after their reveal).
 * Shape: title, tokens shown (not defined), the mechanism and the tools, two failure modes (context rot over six
 * screens, sycophancy over three), a recap, tonight's steps, the close. Screens carry titles, data, artifacts and one
 * line of study setup or finding; no narration or instructions. The speaker's script is in docs/talk-notes.md.
 * One idea per screen, about 50 words at most. A test is three screens: the question, the answer, what we do now.
 * PageDown or a clicker moves one screen. The context strip at the bottom shows what each screen's session carries.
 */
export type ScreenId =
  | "title"
  | "tokens"
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
export type ScreenKind = "title" | "tokens" | "split" | "diagram" | "list" | "ask" | "answer" | "do" | "recap" | "steps";

export interface IntroScreen {
  id: ScreenId;
  kind: ScreenKind;
  /** label shown by the context strip (neutral, so it doesn't give a test's answer away) */
  beat: string;
  title: string;
  /** ask screens: how the study was run, one line, no answer in it */
  setup?: string;
  /** answer and do screens: the result in one line */
  finding?: string;
}

export const TAGLINE = "Same prompt. Different answer.";

/** One prompt, word for word wherever it appears: the crit question students run on their own project tonight. */
export const PROMPT = "Read this project and list the three weakest points a crit panel would raise. Point to the files.";

export const SCREENS: IntroScreen[] = [
  {
    id: "title",
    kind: "title",
    beat: "Welcome",
    title: "AI Workflow Habits",
  },
  {
    id: "tokens",
    kind: "tokens",
    beat: "How it reads",
    title: "It reads in tokens",
  },
  {
    id: "hook",
    kind: "split",
    beat: "Same prompt",
    title: TAGLINE,
  },
  {
    id: "carries",
    kind: "diagram",
    beat: "What it rereads",
    title: "Every message, it rereads everything",
  },
  {
    id: "toolkit",
    kind: "list",
    beat: "Your toolkit",
    title: "Six tools, each with a trigger",
  },
  {
    id: "rot-ask",
    kind: "ask",
    beat: "Failure mode 1",
    title: "Long chat, or just the part that matters: which did better?",
    setup: "Chroma, 2025 · the same questions, given a full chat history (~113k tokens) or only the relevant part (~300)",
  },
  {
    id: "rot",
    kind: "answer",
    beat: "Failure mode 1",
    title: "The short part. Every model tested.",
    finding: "Long inputs lose detail, and the middle of them most.",
  },
  {
    id: "rot-do",
    kind: "do",
    beat: "Failure mode 1",
    title: "New task, new session, with a five-line note",
  },
  {
    id: "rules-ask",
    kind: "ask",
    beat: "Failure mode 1",
    title: "Give it 500 rules at once. What share gets followed?",
    setup: "IFScale, 2025 · 20 models · write a report that uses 10 to 500 given words · score of the best model",
  },
  {
    id: "rules",
    kind: "answer",
    beat: "Failure mode 1",
    title: "68%, and the later ones go first.",
    finding: "The best model, at 500 rules. The rest were dropped without a warning.",
  },
  {
    id: "rules-do",
    kind: "do",
    beat: "Failure mode 1",
    title: "Write CLAUDE.md yourself, and keep it short",
    finding: "ETH Zurich, 2026: notes written by AI were the one kind that made results worse.",
  },
  {
    id: "review-ask",
    kind: "ask",
    beat: "Failure mode 2",
    title: "Once it knows you, how much more does it agree with you?",
    setup: "CHI 2026 · real chats from 38 people · replayed with and without what the model knew about them",
  },
  {
    id: "review",
    kind: "answer",
    beat: "Failure mode 2",
    title: "Up to 45% more often.",
  },
  {
    id: "review-do",
    kind: "do",
    beat: "Failure mode 2",
    title: "Get reviews from a fresh session",
    finding: "Models also rate their own writing above equally good writing by others (2024).",
  },
  {
    id: "recap",
    kind: "recap",
    beat: "Recap",
    title: "What to keep",
  },
  {
    id: "tonight",
    kind: "steps",
    beat: "Tonight",
    title: "Tonight, on your own project",
  },
  {
    id: "close",
    kind: "split",
    beat: "Same prompt",
    title: TAGLINE,
  },
];

/** The title screen. */
export const BYLINE = "Prof. Ramtin’s UX class";
export const AGENDA = ["How it reads", "What it rereads, every message", "Six tools", "Two failure modes", "Tonight, on your own project"] as const;

/**
 * Real splits from OpenAI's public o200k_base tokenizer (tiktoken 0.12.0), run 2026-10-15. Leading spaces belong to
 * the token. Claude's tokenizer is not public; it splits differently, and the screen says so.
 */
export const TOKENS = {
  sentence: ["The", " user", " tapped", " the", " checkout", " button", "."],
  words: [
    ["ske", "u", "om", "orphism"],
    ["micro", "inter", "actions"],
  ],
  unit: "tokens",
  note: "Split by OpenAI’s GPT-4o tokenizer. Claude’s splits differ; the idea is the same.",
} as const;

/** The conclusion: each part of the talk in one line, and the habit it leaves. */
export const RECAP = [
  { part: "What it reads", line: "Everything, every message" },
  { part: "The tools", line: "Add one when its trigger happens" },
  { part: "context rot", line: "New task, new session. A short CLAUDE.md, by you" },
  { part: "sycophancy", line: "Reviews from a fresh session" },
] as const;

export const THANKS = "Thank you. Questions?";

/** The options on a question screen: the room votes by hands, the presenter counts. */
export const ASK: Record<"rot-ask" | "rules-ask" | "review-ask", readonly string[]> = {
  "rot-ask": ["Long chat", "Short part", "No difference"],
  "rules-ask": ["30%", "70%", "95%"],
  "review-ask": ["None", "15%", "45%"],
};

/** The opening and the close: the same prompt in two sessions. The close fills in what each one does. */
export const SESSIONS = {
  lead: "Both get the same prompt",
  known: { name: "The session you’ve worked in all week", answer: "Sides with you more often" },
  fresh: { name: "A fresh session, with your criteria", answer: "Judges only what’s in front of it" },
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
  note: "Not to scale",
  see: "/context",
} as const;

/**
 * The context strip per screen: the talk itself as one growing session. `notes`/`session` are shares of the bar;
 * `dim` greys part of a segment (the middle of a long session; the instructions a long file loses).
 */
export const STRIP: Record<ScreenId, { notes: number; session: number; dim?: "middle" | "notes-tail" }> = {
  title: { notes: 0.06, session: 0.02 },
  tokens: { notes: 0.06, session: 0.04 },
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
  { word: "context rot", revealIn: "rot" },
  { word: "sycophancy", revealIn: "review" },
] as const;
export const NAMED = "This has a name:";


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
