import type { GroupId, Section } from "./types";

export const BRIEF_TITLE = "AI Workflow Habits";
export const BRIEF_THESIS =
  "The skill is not prompting. It is deciding what the model sees, when, and who gets to edit it.";

/** Topic metadata. What each topic says lives in deck.ts; the tools live under features/. */
export const SECTIONS: Section[] = [
  { slug: "framing", num: "01", title: "A workflow is not an agent", kicker: "Who owns the control flow? Who owns the memory?", tools: ["assess"], group: "sees" },
  { slug: "evidence", num: "02", title: "Organization beats volume", kicker: "More context hurts — unless it's structured and loaded on demand.", tools: ["audit", "experiments"], group: "sees" },
  { slug: "memory", num: "03", title: "Memory files & the yes-man risk", kicker: "Split memory by how often it's read, and by truth vs history.", tools: ["audit", "experiments"], group: "feeds" },
  { slug: "skills", num: "04", title: "Skills: routing, not smarter prompts", kicker: "They cost almost nothing until triggered.", tools: ["audit"], group: "feeds" },
  { slug: "connectors", num: "05", title: "Connectors: the hidden bill", kicker: "Every server bills you before you type a word.", tools: ["audit", "experiments"], group: "feeds" },
  { slug: "cost", num: "06", title: "Information cost guardrails", kicker: "The bill is the same prefix, resent every turn.", tools: ["experiments", "assess"], group: "costs" },
  { slug: "local", num: "07", title: "Local models & Odysseus", kicker: "Local is a routing decision, not a replacement.", tools: ["assess"], group: "costs" },
  { slug: "human-cost", num: "08", title: "Calibration, not pessimism", kicker: "Your sense of speed is not a reliable gauge.", tools: ["experiments", "assess"], group: "costs" },
  { slug: "mistakes", num: "09", title: "Mistakes catalog", kicker: "Habits adopted for good reasons that backfire.", tools: ["assess", "audit"], group: "wrong" },
  { slug: "tensions", num: "10", title: "Open tensions", kicker: "Where the evidence disagrees with itself.", tools: ["kb"], group: "wrong" },
  { slug: "build", num: "11", title: "How this site was built", kicker: "One person, one AI assistant, and the habits from topics 1–10.", tools: [], group: "behind" },
];

/** Categories on the site map, in reading order. */
export const GROUPS: { id: GroupId; title: string; blurb: string }[] = [
  { id: "sees", title: "What the model sees", blurb: "The idea, and the evidence that less, better-organised context wins." },
  { id: "feeds", title: "What feeds it", blurb: "The three ways text gets into every chat: memory, skills, connectors." },
  { id: "costs", title: "What it costs", blurb: "Money, privacy, and your own speed and learning." },
  { id: "wrong", title: "Where it goes wrong", blurb: "Habits that backfire, and where the evidence disagrees." },
  { id: "behind", title: "Behind this site", blurb: "The same habits, applied to building this website." },
];

export const SECTION_BY_SLUG: Record<string, Section | undefined> = Object.fromEntries(SECTIONS.map((s) => [s.slug, s]));
