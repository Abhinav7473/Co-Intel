/** Metrics an experiment run can record. All optional; record what you measured. */
export type Metric = "tokens" | "cost" | "minutes" | "corrections" | "quality";

export const METRICS: Record<Metric, { label: string; unit: string; better: "lower" | "higher"; step: number }> = {
  tokens: { label: "Tokens at start", unit: "tok", better: "lower", step: 100 },
  cost: { label: "Cost", unit: "$", better: "lower", step: 0.01 },
  minutes: { label: "Time", unit: "min", better: "lower", step: 0.5 },
  corrections: { label: "Corrections needed", unit: "", better: "lower", step: 1 },
  quality: { label: "Quality (1–5)", unit: "/5", better: "higher", step: 1 },
};

export interface Template {
  key: string;
  title: string;
  topic: string;
  hypothesis: string;
  a: string;
  b: string;
  /** metrics that matter for this template, in display order */
  metrics: Metric[];
  /** how to run it, short steps */
  protocol: string[];
  /** what "quality" means here, if used */
  qualityMeans?: string;
}

/** The brief's own testable claims, turned into experiments you can run on your setup. */
export const TEMPLATES: Template[] = [
  {
    key: "memory-tiering",
    title: "Bloated vs tiered memory",
    topic: "memory",
    hypothesis: "A small core file plus on-demand references needs fewer corrections at lower cost.",
    a: "One big memory file",
    b: "Tiered: core + references",
    metrics: ["tokens", "corrections", "quality", "cost"],
    protocol: [
      "Pick 3 real tasks you do often.",
      "Run each with your current memory file; note tokens at session start and corrections needed.",
      "Split the file (core ≤ 50 lines, rest in referenced files) and run the same tasks fresh.",
    ],
    qualityMeans: "How usable the result was without edits",
  },
  {
    key: "yes-man",
    title: "Profile vs task-only critique",
    topic: "memory",
    hypothesis: "Critique is harsher (more honest) without a stored profile of me.",
    a: "Profile in context",
    b: "Task context only",
    metrics: ["quality", "corrections"],
    protocol: [
      "Take one draft you care about.",
      "Ask for critique in a session that knows your profile/preferences.",
      "Ask again in a fresh session with only the task and rubric. Rate how critical each was.",
    ],
    qualityMeans: "How critical the feedback was (1 = flattering, 5 = rigorous)",
  },
  {
    key: "cache-discipline",
    title: "Mid-session edits vs between sessions",
    topic: "cost",
    hypothesis: "Editing memory between sessions keeps cache reads and cost down.",
    a: "Edit memory mid-session",
    b: "Edit between sessions",
    metrics: ["cost", "tokens"],
    protocol: ["Run a comparable 20-turn session twice.", "In A, edit CLAUDE.md halfway. In B, don't.", "Compare the session cost reports."],
  },
  {
    key: "connector-diet",
    title: "All servers vs per-project",
    topic: "connectors",
    hypothesis: "Per-project servers cut start-of-session tokens without hurting the task.",
    a: "All servers enabled",
    b: "Only this project's servers",
    metrics: ["tokens", "quality", "minutes"],
    protocol: ["Note context usage at session start with everything connected.", "Disable servers this project doesn't need; restart.", "Run the same task in both."],
    qualityMeans: "Task success",
  },
  {
    key: "explain-vs-delegate",
    title: "Delegate vs ask for explanations",
    topic: "human-cost",
    hypothesis: "Asking for explanations takes longer now but I understand (and can debug) more.",
    a: "Delegate: 'just fix it'",
    b: "Explain first, then I do it",
    metrics: ["minutes", "quality"],
    protocol: ["Pick two similar unfamiliar tasks.", "Time each approach.", "A day later, quiz yourself or debug a variant; rate your understanding."],
    qualityMeans: "Understanding a day later",
  },
  {
    key: "custom",
    title: "Your own comparison",
    topic: "evidence",
    hypothesis: "",
    a: "Variant A",
    b: "Variant B",
    metrics: ["tokens", "cost", "minutes", "corrections", "quality"],
    protocol: ["Change one thing between A and B.", "Run each at least 3 times.", "Record the same metrics for both."],
  },
];

export const TEMPLATE_BY_KEY: Record<string, Template | undefined> = Object.fromEntries(TEMPLATES.map((t) => [t.key, t]));
