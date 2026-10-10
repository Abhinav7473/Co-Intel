/**
 * The junior seminar (/intro): "Same prompt. Different answer.", 15 minutes for UX juniors learning Claude Code on the web.
 * Six beats, one screen each (a test is two screens: the question, then the answer), so PageDown or a clicker advances
 * one screen at a time. Every word the room reads lives here, so `make check-content` sees all of it.
 * Rules (make check-content): no preaching words; no jargon; an earned word never appears before the screen that
 * reveals it; every number names its study. Outline and reasons: docs/seminar-audit.md §8, docs/decisions.md 2026-10-09.
 */
export type ScreenId = "hook" | "reads" | "rot-ask" | "rot" | "yes-ask" | "yes" | "learn-ask" | "learn" | "close";

export interface IntroScreen {
  id: ScreenId;
  /** the beat this screen belongs to; the rail shows beats, not screens */
  beat: number;
  title: string;
  body: string;
}

export const TAGLINE = "Same prompt. Different answer.";

/** One prompt, used word for word everywhere it appears. */
export const PROMPT = "Rate this design rationale from 1 to 10, then list its three biggest weaknesses.";

/** Rail labels per beat. Neutral, so they don't give a test's answer away. */
export const BEATS = ["Same prompt", "What it reads", "Test 1", "Test 2", "Test 3", "Your turn"] as const;

export const SCREENS: IntroScreen[] = [
  {
    id: "hook",
    beat: 0,
    title: TAGLINE,
    body: "Everyone is learning to write better prompts. We kept the prompt identical, word for word, and changed what Claude Code had around it.",
  },
  {
    id: "reads",
    beat: 1,
    title: "Every time you hit send, it rereads everything",
    body: "It keeps nothing between messages. Claude Code sends the whole session again, your project's notes, and its own instructions. Change those, and the answer changes.",
  },
  {
    id: "rot-ask",
    beat: 2,
    title: "An hour-old session vs a fresh one",
    body: "Same question in both. One holds every old draft. The other gets a five-line note. Out of 18 AI models, how many did better with the whole history?",
  },
  {
    id: "rot",
    beat: 2,
    title: "None of them",
    body: "Every one of the 18 answered better from the short, focused version. More history made every model worse, even with the right answer in there.",
  },
  {
    id: "yes-ask",
    beat: 3,
    title: "Does a session that knows you go easy on you?",
    body: "A weak design rationale, scored by a model that knows you and by one that doesn't. Once it knows you, how much more often does it side with you?",
  },
  {
    id: "yes",
    beat: 3,
    title: "Up to 45% more often",
    body: "Researchers replayed two weeks of real chats from 38 people, with and without what the model knew about them. Three of four models sided with the person more.",
  },
  {
    id: "learn-ask",
    beat: 4,
    title: "Does it help you learn, or just finish?",
    body: "52 people learned a new coding library, half with AI help, then took the same quiz without it. Who scored higher, and by how much?",
  },
  {
    id: "learn",
    beat: 4,
    title: "By hand 67%. With AI 50%.",
    body: "How they used it decided it. The ones who asked it to explain kept up. The ones who let it do the work fell behind.",
  },
  {
    id: "close",
    beat: 5,
    title: "Design the screen that shows what it's reading",
    body: "You will design these apps. One minute, on paper: sketch one signal that tells a person their session is stale, or flattering them.",
  },
];

/** Hands-up options on a question screen: said aloud, counted by the presenter, never clicked. */
export const ASK: Record<"rot-ask" | "yes-ask" | "learn-ask", readonly string[]> = {
  "rot-ask": ["0", "6", "12", "18"],
  "yes-ask": ["Not at all", "About 15% more", "About 45% more"],
  "learn-ask": ["With AI", "By hand", "No difference"],
};
export const HANDS = "Hands up";

/** The two sessions on the opening screen, back at the close with their answers. */
export const SESSIONS = {
  known: { name: "The session you've worked in all week", answer: "Sides with you more often" },
  fresh: { name: "A fresh session", answer: "Judges only the text in front of it" },
  lead: "Both sessions get the same prompt:",
  hidden: "Which one goes easier on you? Test 2.",
} as const;

/** The exploded view on the "reads" screen. The parts are real; the text on them is ours. */
export const LAYERS = [
  { key: "message", name: "Your message", lines: [] as string[] },
  { key: "session", name: "The session so far", lines: ["Drafts 1, 2 and 3", "“I spent all week on this!”"] },
  { key: "notes", name: "CLAUDE.md: project notes", lines: ["Checkout case study", "Crit on Friday"] },
  { key: "instructions", name: "Its own instructions", lines: ["Written by Anthropic", "Hidden from you"] },
] as const;
export const LAYERS_NOTE = "Illustration. The four parts are real; the text on them is ours.";

/** The two words. Context rot is named in test 1, sycophancy is the one earned in test 2. */
export const WORDS = [
  { word: "context rot", revealIn: "rot", means: "The longer and messier the session, the worse the answers." },
  { word: "sycophancy", revealIn: "yes", means: "Agreeing with you to keep you happy." },
] as const;
export const NAMED = "This has a name.";
export const NOW = "What we do now: ";

/** Test 1. Chroma, Context Rot (2025). */
export const ROT = {
  big: "0 of 18",
  bigLabel: "models did better with the whole history",
  practice: "New task, new session, with a five-line note on where we are.",
  noteTitle: "A new session, first message",
  note: [
    "Project: checkout redesign case study",
    "Done: drafts 1 to 3. Draft 3 is current",
    "Now: tighten the evidence section",
    "Criteria: Nielsen's 10 heuristics",
    "Ignore: anything from drafts 1 and 2",
  ],
  caveat: "In the study, the focused version was picked by hand. A five-line note is our way of doing that.",
  source: "Chroma, Context Rot (2025): 18 models, 306 questions about long chat histories",
  href: "https://www.trychroma.com/research/context-rot",
} as const;

/** Test 2. Jain et al., CHI 2026. */
export const YESMAN = {
  rationale: "We moved checkout onto a single page because users hate multi-step forms. In our test, all 5 participants finished faster, so the redesign will raise conversion.",
  promptLead: "The prompt, identical in both:",
  rows: [
    { model: "Gemini 2.5 Pro", more: 45 },
    { model: "Claude Sonnet 4", more: 33 },
    { model: "GPT-4.1 Mini", more: 16 },
    { model: "GPT 5.1", more: 0 },
  ],
  rowsLead: "How much more often each model sided with the person, once it knew them",
  bridge: "In Claude Code, what knows you is the session itself: every draft, every “I spent all week on this one.”",
  practice: "Reviews happen in a fresh session, with our criteria pasted in:",
  criteria: "Check this against Nielsen's 10 usability heuristics. Name the weakest point first.",
  source: "Jain et al., CHI 2026: two weeks of real chats from 38 people, replayed with and without a saved profile",
  href: "https://dl.acm.org/doi/10.1145/3772318.3791915",
} as const;

/** Test 3. Anthropic (2026), programming only. */
export const LEARNING = {
  withAi: 50,
  byHand: 67,
  scoreLabel: "average quiz score",
  withAiLabel: "learned with AI",
  byHandLabel: "learned by hand",
  explain: "65–86%",
  explainLabel: "asked it to explain",
  delegate: "under 40%",
  delegateLabel: "let it do the work",
  caveat: "Programming only. Applying it to design work is a reasonable guess, not a finding.",
  practice: "When we're learning, we ask why before we ask for the fix:",
  ask: "Explain why this layout breaks before you change anything.",
  source: "Anthropic, 2026: 52 people learned an unfamiliar coding library, randomly with or without AI, then took the same quiz without it",
  href: "https://www.anthropic.com/research/AI-assistance-coding-skills",
} as const;

/** The close: three habits, one per test. */
export const HABITS = [
  { test: "Test 1", habit: "New task, new session, with a five-line note." },
  { test: "Test 2", habit: "Reviews in a fresh session, with your criteria pasted in." },
  { test: "Test 3", habit: "Learning? Ask why before you ask for the fix." },
] as const;
