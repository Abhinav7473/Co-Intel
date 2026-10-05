import type { Section } from "./types";

export const BRIEF_TITLE = "AI Workflow Habits";
export const BRIEF_THESIS =
  "The skill is not prompting. It is deciding what the model sees, when, and who gets to edit it.";

/** Topic metadata. What each topic says lives in deck.ts; the tools live under features/. */
export const SECTIONS: Section[] = [
  { slug: "framing", num: "01", title: "A workflow is not an agent", kicker: "Who owns the control flow? Who owns the memory?", tools: ["assess"] },
  { slug: "evidence", num: "02", title: "Organization beats volume", kicker: "More context hurts — unless it's structured and loaded on demand.", tools: ["audit", "experiments"] },
  { slug: "memory", num: "03", title: "Memory files & the yes-man risk", kicker: "Split memory by how often it's read, and by truth vs history.", tools: ["audit", "experiments"] },
  { slug: "skills", num: "04", title: "Skills: routing, not smarter prompts", kicker: "They cost almost nothing until triggered.", tools: ["audit"] },
  { slug: "connectors", num: "05", title: "Connectors: the hidden bill", kicker: "Every server bills you before you type a word.", tools: ["audit", "experiments"] },
  { slug: "cost", num: "06", title: "Information cost guardrails", kicker: "The bill is the same prefix, resent every turn.", tools: ["experiments", "assess"] },
  { slug: "local", num: "07", title: "Local models & Odysseus", kicker: "Local is a routing decision, not a replacement.", tools: ["assess"] },
  { slug: "human-cost", num: "08", title: "Calibration, not pessimism", kicker: "Your sense of speed is not a reliable gauge.", tools: ["experiments", "assess"] },
  { slug: "mistakes", num: "09", title: "Mistakes catalog", kicker: "Habits adopted for good reasons that backfire.", tools: ["assess", "audit"] },
  { slug: "tensions", num: "10", title: "Open tensions", kicker: "Where the evidence disagrees with itself.", tools: ["kb"] },
];

export const SECTION_BY_SLUG: Record<string, Section | undefined> = Object.fromEntries(SECTIONS.map((s) => [s.slug, s]));
