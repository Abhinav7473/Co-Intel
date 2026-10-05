import type { CSSProperties } from "react";
import { Brain, Cable, Hammer, HardDrive, Layers, Receipt, Route, Scale, Timer, TriangleAlert, Workflow } from "lucide-react";
import type { GroupId, Section } from "./types";

export const BRIEF_TITLE = "AI Workflow Habits";
export const BRIEF_THESIS =
  "The skill is not prompting. It is deciding what the model sees, when, and who gets to edit it.";

/** Topic metadata. What each topic says lives in deck.ts; the tools live under features/. */
export const SECTIONS: Section[] = [
  { slug: "framing", num: "01", title: "A workflow is not an agent", kicker: "Who owns the control flow? Who owns the memory?", tools: ["assess"], group: "sees", icon: Workflow, links: [{ to: "evidence", why: "Why less context wins" }, { to: "memory", why: "Who owns the memory, in practice" }] },
  { slug: "evidence", num: "02", title: "Organization beats volume", kicker: "More context hurts — unless it's structured and loaded on demand.", tools: ["audit", "experiments"], group: "sees", icon: Layers, links: [{ to: "memory", why: "Apply it to the file read every chat" }, { to: "cost", why: "The same finding, as a bill" }] },
  { slug: "memory", num: "03", title: "Memory files & the yes-man risk", kicker: "Split memory by how often it's read, and by truth vs history.", tools: ["audit", "experiments"], group: "feeds", icon: Brain, links: [{ to: "evidence", why: "The studies behind splitting memory" }, { to: "mistakes", why: "Memory habits that backfire" }] },
  { slug: "skills", num: "04", title: "Skills: routing, not smarter prompts", kicker: "They cost almost nothing until triggered.", tools: ["audit"], group: "feeds", icon: Route, links: [{ to: "connectors", why: "The other way text gets in" }, { to: "memory", why: "What belongs in memory instead" }] },
  { slug: "connectors", num: "05", title: "Connectors: the hidden bill", kicker: "Every server bills you before you type a word.", tools: ["audit", "experiments"], group: "feeds", icon: Cable, links: [{ to: "cost", why: "What tool definitions cost per turn" }, { to: "skills", why: "Load on demand instead" }] },
  { slug: "cost", num: "06", title: "Information cost guardrails", kicker: "The bill is the same prefix, resent every turn.", tools: ["experiments", "assess"], group: "costs", icon: Receipt, links: [{ to: "connectors", why: "Where most of the prefix comes from" }, { to: "local", why: "Route cheap work elsewhere" }] },
  { slug: "local", num: "07", title: "Local models & Odysseus", kicker: "Local is a routing decision, not a replacement.", tools: ["assess"], group: "costs", icon: HardDrive, links: [{ to: "cost", why: "What you'd be saving" }, { to: "framing", why: "Who owns the control flow" }] },
  { slug: "human-cost", num: "08", title: "Calibration, not pessimism", kicker: "Your sense of speed is not a reliable gauge.", tools: ["experiments", "assess"], group: "costs", icon: Timer, links: [{ to: "mistakes", why: "Habits that feel fast and aren't" }, { to: "tensions", why: "Where these studies disagree" }] },
  { slug: "mistakes", num: "09", title: "Mistakes catalog", kicker: "Habits adopted for good reasons that backfire.", tools: ["assess", "audit"], group: "wrong", icon: TriangleAlert, links: [{ to: "memory", why: "The fix for most of these" }, { to: "human-cost", why: "Why they feel right" }] },
  { slug: "tensions", num: "10", title: "Open tensions", kicker: "Where the evidence disagrees with itself.", tools: ["kb"], group: "wrong", icon: Scale, links: [{ to: "evidence", why: "The evidence being argued over" }, { to: "human-cost", why: "The speed studies, in full" }] },
  { slug: "build", num: "11", title: "How this site was built", kicker: "One person, one AI assistant, and the habits from topics 1–10.", tools: [], group: "behind", icon: Hammer, links: [{ to: "memory", why: "The tiers this repo uses" }, { to: "skills", why: "The skills it was built with" }] },
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

/** CSS custom property that themes a subtree in a group's hue: chrome reads `topic` (bg-topic, text-topic…). */
export const hue = (group: GroupId) => ({ "--color-topic": `var(--color-t-${group})` }) as CSSProperties;
