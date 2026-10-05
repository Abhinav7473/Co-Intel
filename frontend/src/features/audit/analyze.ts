/**
 * Setup audit: pure, deterministic rules derived from the brief. Runs in the
 * browser on every keystroke; the saved report is exactly this output.
 *
 * Token estimates are rough on purpose (chars / 4; ~950 tokens per tool,
 * from Anthropic's 58 tools ≈ 55k). They rank problems; they are not a bill.
 */
export type Severity = "good" | "info" | "warn" | "risk";
export type Area = "memory" | "skills" | "servers" | "session";

export interface Skill {
  name: string;
  description: string;
  body: string;
}
export interface Server {
  name: string;
  tools: number;
  scope: "global" | "project";
}
export interface Setup {
  memory: string;
  skills: Skill[];
  servers: Server[];
  legs: { private: boolean; untrusted: boolean; outbound: boolean };
}
export interface Finding {
  rule: string;
  severity: Severity;
  area: Area;
  title: string;
  evidence: string;
  fix: string;
  topic: string;
}
export interface Report {
  score: number;
  findings: Finding[];
  budget: { memory: number; skills: number; tools: number };
}

export const EMPTY_SETUP: Setup = {
  memory: "",
  skills: [],
  servers: [],
  legs: { private: false, untrusted: false, outbound: false },
};

export const TOKENS_PER_TOOL = 950;
export const TOKENS_PER_SKILL_HEADER = 100;
const PENALTY: Record<Severity, number> = { good: 0, info: 2, warn: 8, risk: 18 };

const tokens = (s: string) => Math.ceil(s.length / 4);
const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

/** Lines matching `re`, as "L12: text" snippets for evidence. */
function hits(lines: string[], re: RegExp, max = 3) {
  const found: string[] = [];
  lines.forEach((l, i) => {
    if (re.test(l)) found.push(`L${i + 1}: ${l.trim().slice(0, 70)}`);
  });
  return { count: found.length, sample: found.slice(0, max).join(" · ") };
}

function memoryFindings(memory: string): Finding[] {
  const text = memory.trim();
  if (!text) return [];
  const lines = text.split("\n");
  const nonEmpty = lines.filter((l) => l.trim()).length;
  const f: Finding[] = [];
  const add = (x: Omit<Finding, "area">) => f.push({ area: "memory", ...x });

  if (nonEmpty > 300) {
    add({ rule: "memory-length", severity: "risk", title: `${nonEmpty} lines, loaded every turn`, evidence: "Index Sickness: 308 lines of patches → false 'completed' states.", fix: "Cut to the rules the model breaks without being told (~50–80 lines); move detail to referenced files.", topic: "memory" });
  } else if (nonEmpty > 150) {
    add({ rule: "memory-length", severity: "warn", title: `${nonEmpty} lines in the always-on file`, evidence: "Every line is paid on every turn.", fix: "Move reference material out; keep pointers to it.", topic: "memory" });
  } else {
    add({ rule: "memory-length", severity: "good", title: `${nonEmpty} lines — compact core`, evidence: "", fix: "", topic: "memory" });
  }

  const tour = hits(lines, /(├──|└──|^#+\s*(project|directory|folder|repo(sitory)?)\s+(structure|layout|overview|tour)|^#+\s*architecture overview)/i);
  if (tour.count) add({ rule: "repo-tour", severity: "warn", title: "Repo tour in the always-on file", evidence: tour.sample, fix: "Overviews didn't help in the ETH study. Replace with a pointer to a doc read on demand.", topic: "evidence" });

  const profile = hits(lines, /\b(i am|i'm a|my name is|about me|i prefer|i believe|i like|the user (is|prefers|likes))\b/i);
  if (profile.count) add({ rule: "profile-facts", severity: "risk", title: `${plural(profile.count, "line")} of facts about you`, evidence: profile.sample, fix: "Profiles raise agreement sycophancy. Keep task context; drop the biography, at least for critique.", topic: "memory" });

  const defensive = hits(lines, /^\s*[-*]?\s*(\*\*)?(never|always|do not|don't|must not|important|critical)\b|!!!/i);
  if (defensive.count > 15) add({ rule: "defensive-rules", severity: "risk", title: `${defensive.count} defensive rules`, evidence: defensive.sample, fix: "At density, models silently drop instructions (IFScale). Fix the structure behind repeated failures; prune.", topic: "mistakes" });
  else if (defensive.count > 8) add({ rule: "defensive-rules", severity: "warn", title: `${defensive.count} NEVER/ALWAYS-style rules`, evidence: defensive.sample, fix: "Check which still earn their place; each was probably added after one failure.", topic: "mistakes" });

  const ids = hits(lines, /\b[A-Z]{1,5}-\d+(\.\d+)?\b/);
  if (ids.count >= 3) add({ rule: "private-ids", severity: "warn", title: `${ids.count} lines use ID codes`, evidence: ids.sample, fix: "Use plain-language names so you can still check the model's reasoning.", topic: "mistakes" });

  const history = hits(lines, /\b(we (tried|decided|used to)|previously|deprecated|rejected|old approach|no longer|ignore (the )?(old|previous))\b/i);
  if (history.count) add({ rule: "history-in-core", severity: history.count > 3 ? "warn" : "info", title: "History mixed into current rules", evidence: history.sample, fix: "Move decisions and rejected options to an append-only log; old text still sits in context.", topic: "memory" });

  const ignore = hits(lines, /\bignore (the )?(old|previous|above|earlier)\b/i);
  if (ignore.count) add({ rule: "ignore-notes", severity: "risk", title: "“Ignore the old…” instead of deleting", evidence: ignore.sample, fix: "Physical removal is the only reliable fix.", topic: "memory" });

  const dates = hits(lines, /\b20\d\d-\d\d-\d\d\b/);
  if (dates.count >= 5) add({ rule: "changelog", severity: "info", title: `${dates.count} dated lines`, evidence: dates.sample, fix: "Dates suggest a changelog; logs belong outside the always-loaded file.", topic: "memory" });

  if (/(auto-?generated|generated by|\/init\b)/i.test(text)) add({ rule: "generated", severity: "warn", title: "Looks generated", evidence: "A generated marker is present.", fix: "LLM-generated context files were the one condition that lowered success (ETH). Rewrite by hand.", topic: "evidence" });

  // directory-tree drawings mention paths too; they are a tour, not a pointer
  const pointers = hits(lines.map((l) => (/[├└│]/.test(l) ? "" : l)), /\b[\w./-]+\.(md|txt|json|ya?ml)\b|\bdocs?\//i);
  if (pointers.count) add({ rule: "pointers", severity: "good", title: `${plural(pointers.count, "pointer")} to on-demand files`, evidence: pointers.sample, fix: "", topic: "cost" });
  else if (nonEmpty > 60) add({ rule: "pointers", severity: "info", title: "No pointers to reference files", evidence: "", fix: "Name detail files by path and purpose; let the model read one level deeper only when needed.", topic: "cost" });

  return f;
}

function skillFindings(skills: Skill[]): Finding[] {
  const f: Finding[] = [];
  for (const s of skills) {
    const name = s.name || "Unnamed skill";
    const d = s.description.trim();
    if (d.length < 25) f.push({ rule: "skill-description", area: "skills", severity: "warn", title: `${name}: description too thin to route`, evidence: d ? `“${d}”` : "No description.", fix: "Write when to use it (task, trigger words). 26% of public skills lack this.", topic: "skills" });
    else if (!/\b(use (when|for|to)|when (the user|you)|triggers?)\b/i.test(d)) f.push({ rule: "skill-trigger", area: "skills", severity: "info", title: `${name}: no explicit “use when”`, evidence: `“${d.slice(0, 80)}”`, fix: "Lead with the situation that should trigger it.", topic: "skills" });
    const bodyLines = s.body.split("\n").filter((l) => l.trim()).length;
    if (bodyLines > 400) f.push({ rule: "skill-giant", area: "skills", severity: "warn", title: `${name}: ${bodyLines}-line body`, evidence: "", fix: "Short core plus referenced files; scripts for deterministic steps.", topic: "skills" });
    if (/\b(update|rewrite|improve) (this|the) skill\b/i.test(s.body)) f.push({ rule: "skill-self-edit", area: "skills", severity: "warn", title: `${name}: rewrites itself`, evidence: "", fix: "Self-evolving skills drift to generic text (ACE). Review edits; keep them small.", topic: "skills" });
  }
  return f;
}

function serverFindings(servers: Server[]): Finding[] {
  if (!servers.length) return [];
  const f: Finding[] = [];
  const total = servers.reduce((a, s) => a + s.tools, 0);
  const tok = total * TOKENS_PER_TOOL;
  const global = servers.filter((s) => s.scope === "global");
  const sev: Severity = tok > 50_000 ? "risk" : tok > 20_000 ? "warn" : "good";
  f.push({ rule: "tool-overhead", area: "servers", severity: sev, title: `~${Math.round(tok / 1000)}k tokens of tool definitions`, evidence: `${plural(servers.length, "server")}, ${plural(total, "tool")}.`, fix: sev === "good" ? "" : "Enable per project, or use tool search (~85% fewer definition tokens).", topic: "connectors" });
  if (global.length > 3) f.push({ rule: "global-servers", area: "servers", severity: "warn", title: `${global.length} servers enabled globally`, evidence: global.map((s) => s.name).join(", "), fix: "Connect servers per project.", topic: "connectors" });
  return f;
}

function sessionFindings(legs: Setup["legs"]): Finding[] {
  const n = Number(legs.private) + Number(legs.untrusted) + Number(legs.outbound);
  if (n === 3) return [{ rule: "trifecta", area: "session", severity: "risk", title: "Lethal trifecta: all three legs in one session", evidence: "Private data + untrusted content + a way out.", fix: "Split the work so no session has all three.", topic: "connectors" }];
  if (n === 2) return [{ rule: "trifecta", area: "session", severity: "info", title: "Two of three trifecta legs present", evidence: "", fix: "Don't add the third leg to this session.", topic: "connectors" }];
  return [];
}

export function analyze(setup: Setup): Report {
  const findings = [
    ...memoryFindings(setup.memory),
    ...skillFindings(setup.skills),
    ...serverFindings(setup.servers),
    ...sessionFindings(setup.legs),
  ];
  const penalty = findings.reduce((a, f) => a + PENALTY[f.severity], 0);
  return {
    // diminishing returns: one warning ≈ −10, a disaster still lands around 20 instead of flooring at 0
    score: Math.round(100 * Math.exp(-penalty / 75)),
    findings,
    budget: {
      memory: tokens(setup.memory),
      skills: setup.skills.length * TOKENS_PER_SKILL_HEADER,
      tools: setup.servers.reduce((a, s) => a + s.tools, 0) * TOKENS_PER_TOOL,
    },
  };
}

/** A deliberately messy example so the tool demonstrates itself on first open. */
export const SAMPLE_SETUP: Setup = {
  memory: `# Project notes (auto-generated by /init, then edited)

I am a PhD student and I prefer concise answers. I believe tests are overrated.

## Project structure
├── src/
│   ├── api/
│   └── ui/
└── docs/

## Rules
- NEVER use default exports
- ALWAYS run the linter
- IMPORTANT: do not touch SEC-2.0 files
- NEVER change D-139 behaviour
- Do not rename AUTH-12 helpers
- We tried Redux previously but rejected it; ignore the old approach in /legacy
- 2026-01-04 switched to Vite
- 2026-02-11 moved CI
- 2026-03-02 dropped Jest
- 2026-05-19 new router
- 2026-06-30 new DB driver
`,
  skills: [
    { name: "critique", description: "critique", body: "Review the draft." },
    { name: "format-paper", description: "Use when formatting a paper draft to the lab template (headings, citations, figures).", body: "1. Apply template\n2. Run scripts/cite.py" },
  ],
  servers: [
    { name: "github", tools: 40, scope: "global" },
    { name: "drive", tools: 12, scope: "global" },
    { name: "slack", tools: 18, scope: "global" },
    { name: "browser", tools: 9, scope: "global" },
    { name: "postgres", tools: 6, scope: "project" },
  ],
  legs: { private: true, untrusted: true, outbound: true },
};
