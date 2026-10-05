/**
 * Guided self-assessment. Each question belongs to a topic; each option is
 * worth 0–3 points. A topic's score is its points as a % of the maximum.
 * `fix` is shown when the answer scores ≤ 1, linked to the topic that explains why.
 */
export interface Question {
  key: string;
  topic: string;
  prompt: string;
  options: { label: string; points: 0 | 1 | 2 | 3 }[];
  fix: string;
}

export const QUESTIONS: Question[] = [
  {
    key: "control-owner",
    topic: "framing",
    prompt: "In your typical AI task, who decides the steps?",
    options: [
      { label: "I set the steps; the model fills them in", points: 3 },
      { label: "Mixed — I steer, it sometimes plans", points: 2 },
      { label: "The agent plans and runs on its own", points: 1 },
      { label: "I haven't thought about it", points: 0 },
    ],
    fix: "Decide per task whether you need an agent. Default to a workflow you control.",
  },
  {
    key: "memory-readable",
    topic: "framing",
    prompt: "Can you read and edit everything your assistant remembers about your work?",
    options: [
      { label: "Yes — it's plain files I own", points: 3 },
      { label: "Mostly", points: 2 },
      { label: "Some of it is hidden inside the product", points: 1 },
      { label: "No idea", points: 0 },
    ],
    fix: "Move what the model must know into files you can read, diff and edit.",
  },
  {
    key: "memory-size",
    topic: "memory",
    prompt: "How long is your always-on memory file (CLAUDE.md, AGENTS.md, project brief)?",
    options: [
      { label: "Under 50 lines", points: 3 },
      { label: "50–150 lines", points: 2 },
      { label: "150–300 lines", points: 1 },
      { label: "Over 300, or I don't know", points: 0 },
    ],
    fix: "Keep only rules the model breaks without being told; move detail to on-demand files. Run the setup audit.",
  },
  {
    key: "memory-author",
    topic: "memory",
    prompt: "Who writes that file?",
    options: [
      { label: "Me, by hand", points: 3 },
      { label: "Me, with small model edits I review", points: 2 },
      { label: "The model rewrites it", points: 1 },
      { label: "It was auto-generated and never pruned", points: 0 },
    ],
    fix: "Generated files lowered success in the ETH study; rewrites erode detail (ACE). Hand-write, edit by small deltas.",
  },
  {
    key: "memory-history",
    topic: "memory",
    prompt: "Where do past decisions and rejected options live?",
    options: [
      { label: "A separate append-only log", points: 3 },
      { label: "Nowhere written down", points: 1 },
      { label: "Mixed into the main memory file", points: 0 },
    ],
    fix: "Split current state from history: a small core file plus a log you look things up in.",
  },
  {
    key: "profile-critique",
    topic: "memory",
    prompt: "When you ask for critique, does the assistant know facts about you?",
    options: [
      { label: "No — critique runs get task context only", points: 3 },
      { label: "Sometimes", points: 1 },
      { label: "Yes, my profile is always loaded", points: 0 },
    ],
    fix: "Profiles raise agreement sycophancy (CHI 2026). Run critique in a profile-free session.",
  },
  {
    key: "skill-descriptions",
    topic: "skills",
    prompt: "Do your skills / saved procedures have a clear one-line “use when…” description?",
    options: [
      { label: "All of them", points: 3 },
      { label: "Most", points: 2 },
      { label: "Few, or I have no skills yet", points: 1 },
      { label: "I paste long prompts each time", points: 0 },
    ],
    fix: "A skill that never triggers is dead weight. Write the routing description first.",
  },
  {
    key: "scripts",
    topic: "skills",
    prompt: "Do deterministic steps (formatting, counting, conversions) run as scripts?",
    options: [
      { label: "Yes", points: 3 },
      { label: "Some", points: 2 },
      { label: "No, the model does them", points: 0 },
    ],
    fix: "Scripts do the deterministic part for zero tokens and no drift.",
  },
  {
    key: "server-scope",
    topic: "connectors",
    prompt: "How are your MCP servers / connectors enabled?",
    options: [
      { label: "Per project, only what's needed", points: 3 },
      { label: "A few globally", points: 2 },
      { label: "Everything, everywhere", points: 0 },
    ],
    fix: "Tool definitions load before you type: ~55k tokens for five servers. Enable per project.",
  },
  {
    key: "trifecta",
    topic: "connectors",
    prompt: "Can one session read private data, read web content AND send data out?",
    options: [
      { label: "Never", points: 3 },
      { label: "Rarely", points: 1 },
      { label: "Often, or I don't know", points: 0 },
    ],
    fix: "That combination can be prompt-injected into leaking. Break one leg per session.",
  },
  {
    key: "fresh-sessions",
    topic: "cost",
    prompt: "How often do you start a fresh session?",
    options: [
      { label: "One task per session", points: 3 },
      { label: "Daily", points: 2 },
      { label: "Rarely — one long session", points: 0 },
    ],
    fix: "Long sessions accumulate stale context (Context Rot). Clear between unrelated tasks.",
  },
  {
    key: "edit-timing",
    topic: "cost",
    prompt: "When do you edit memory files?",
    options: [
      { label: "Between sessions", points: 3 },
      { label: "Whenever something comes up", points: 1 },
    ],
    fix: "Editing early in the prefix busts the cache: everything after it bills at full price again.",
  },
  {
    key: "measure-window",
    topic: "cost",
    prompt: "Have you checked what fills the context window at session start?",
    options: [
      { label: "Yes, regularly", points: 3 },
      { label: "Once", points: 2 },
      { label: "Never", points: 0 },
    ],
    fix: "Measure before optimizing: system prompt, memory, tools, skills.",
  },
  {
    key: "sensitive-routing",
    topic: "local",
    prompt: "Where does sensitive material (interviews, personal data) get processed?",
    options: [
      { label: "Only on local models", points: 3 },
      { label: "Approved cloud services with an agreement", points: 2 },
      { label: "Whatever tool is open", points: 0 },
    ],
    fix: "Route sensitive and bulk work locally; keep cloud for hard reasoning.",
  },
  {
    key: "timed-tasks",
    topic: "human-cost",
    prompt: "Have you timed real tasks with and without AI?",
    options: [
      { label: "Yes", points: 3 },
      { label: "I've estimated", points: 1 },
      { label: "No", points: 0 },
    ],
    fix: "Felt and measured speed diverged by ~39 points (METR). Log a timed experiment.",
  },
  {
    key: "learning-mode",
    topic: "human-cost",
    prompt: "When learning something new, how do you use AI?",
    options: [
      { label: "I ask for explanations, then do it", points: 3 },
      { label: "A mix", points: 2 },
      { label: "It writes it; I fix what breaks", points: 0 },
    ],
    fix: "Delegation patterns scored < 40% on follow-up quizzes; explanation patterns 65–86%.",
  },
  {
    key: "rule-per-failure",
    topic: "mistakes",
    prompt: "When the model gets something wrong, what do you usually do?",
    options: [
      { label: "Fix the structure (split or remove context)", points: 3 },
      { label: "Correct it in the chat", points: 2 },
      { label: "Add another rule to the memory file", points: 0 },
    ],
    fix: "Defensive rules pile up and get silently dropped at density. Fix structure; prune quarterly.",
  },
  {
    key: "private-ids",
    topic: "mistakes",
    prompt: "Do your notes use private ID schemes (D-139, SEC-2.0) instead of plain names?",
    options: [
      { label: "No, plain language", points: 3 },
      { label: "A few", points: 1 },
      { label: "Yes, lots", points: 0 },
    ],
    fix: "The model reasons inside symbols you can no longer check. Use plain names.",
  },
];

export const ASSESSED_TOPICS = [...new Set(QUESTIONS.map((q) => q.topic))];

/** One-word axis labels for charts. */
export const SHORT_LABEL: Record<string, string> = {
  framing: "Control",
  memory: "Memory",
  skills: "Skills",
  connectors: "Connectors",
  cost: "Cost",
  local: "Data routing",
  "human-cost": "Calibration",
  mistakes: "Mistakes",
};

export interface AssessmentResult {
  scores: Record<string, number>;
  overall: number;
  fixes: Question[];
}

export function scoreAnswers(answers: Record<string, number>): AssessmentResult {
  const totals = new Map<string, { got: number; max: number }>();
  const fixes: Question[] = [];
  for (const q of QUESTIONS) {
    const idx = answers[q.key];
    const t = totals.get(q.topic) ?? { got: 0, max: 0 };
    t.max += 3;
    if (idx !== undefined) {
      const pts = q.options[idx]?.points ?? 0;
      t.got += pts;
      if (pts <= 1) fixes.push(q);
    }
    totals.set(q.topic, t);
  }
  const scores = Object.fromEntries([...totals].map(([k, t]) => [k, Math.round((t.got / t.max) * 100)]));
  const vals = Object.values(scores);
  const overall = vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  return { scores, overall, fixes };
}
