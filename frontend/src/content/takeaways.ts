import type { Takeaway } from "./types";

/**
 * The bar at the end of every topic: what the topic found, in one plain line, and what to do about it.
 * Not a summary: no new facts, no numbers to remember. Actions must work in tools the lab already uses.
 * Limits (make check-content): found ≤ 110 chars, 1–2 actions ≤ 90, effort ≤ 24, skip ≤ 90.
 */
export const TAKEAWAYS: Record<string, Takeaway> = {
  framing: {
    found: "AI tools differ by who steers and who keeps the notes. You want to do both.",
    do: ["Before trusting a tool, check: can I see and edit what it remembers about me?"],
    effort: "Once per tool",
  },
  evidence: {
    found: "More text in a chat made models worse, even when the answer was in there.",
    do: ["New subtask? New chat. Paste a 5-line note on where you are.", "Let the AI draft that note, then fix what it got wrong."],
    effort: "A minute per chat",
    skip: "Skip it while you're still polishing the same paragraph.",
  },
  memory: {
    found: "A memory file that keeps growing goes stale, and a chat that knows you goes easy on you.",
    do: ["Keep a 5–15 line project card. Put old decisions in a separate file.", "Ask for critique in a temporary chat, with memory off."],
    effort: "15 minutes, once",
  },
  skills: {
    found: "Saved instructions help when they say when to use them and what good work looks like.",
    do: ["Write down one standard you'd hand a new lab member. Save that, not a persona.", "If a step must come out the same every time, make it a script."],
    effort: "An afternoon, once",
    skip: "Skip it if you don't repeat any task weekly.",
  },
  connectors: {
    found: "Every connected tool costs you on every message, and one that can act can be tricked.",
    do: ["Turn off connectors you didn't use this week.", "Don't let an assistant that can send things read strangers' content in the same chat."],
    effort: "5 minutes",
  },
  cost: {
    found: "You pay again for the same opening text with every message. Caching only makes repeats cheap.",
    do: ["Settle your memory file and tools before a session, not halfway through."],
    effort: "No extra time",
    skip: "Skip it if you're on a flat plan and never hit limits.",
  },
  local: {
    found: "Running a model on your own machine is about data that can't leave, not about saving money.",
    do: ["Sensitive or bulk text: local. Hard reasoning: cloud.", "Check the model fits your machine's memory before planning around it."],
    effort: "An hour to try",
    skip: "Skip it if your data has no sharing limits.",
  },
  "human-cost": {
    found: "Feeling faster isn't being faster, and letting the AI do the work can cost you the learning.",
    do: ["Time a few real tasks with and without AI before deciding it helps.", "While learning something new, ask for explanations, not answers."],
    effort: "A week of noting times",
  },
  mistakes: {
    found: "Most bad habits started as sensible ones: a bigger memory, more tools, one long chat.",
    do: ["Pick the one you recognise and fix only that this week."],
    effort: "One habit, one week",
  },
  tensions: {
    found: "The studies disagree in places, and most of them tested coding, not research work.",
    do: ["Treat these habits as things to try on your own work, not rules."],
    effort: "Ongoing",
  },
  build: {
    found: "This site was built with the same habits: a short rules file, docs looked up, decisions logged.",
    do: ["Start a decisions file for one project: date, decision, why. One line each."],
    effort: "A minute per decision",
  },
};
