import type { Guardrail, Mistake, OdysseusFeature, SourceLink, Study } from "./types";

export const STUDIES: Study[] = [
  {
    key: "context-rot",
    name: "Context Rot",
    href: "https://www.trychroma.com/research/context-rot",
    org: "Chroma · Jul 2025",
    setting: "18 models, task difficulty held constant",
    finding:
      "Performance degrades with input length even on simple tasks. One distractor hurts; four compound it. On LongMemEval, focused prompts (~300 tokens) beat full ones (~113k) across every model family.",
    stance: "less-is-more",
  },
  {
    key: "ifscale",
    name: "IFScale",
    href: "https://arxiv.org/pdf/2507.11538",
    org: "Distyl · Jul 2025",
    setting: "10 to 500 simultaneous instructions, 20 models",
    finding:
      "Best frontier model hit 68% at 500. Failures shift to silent omission, with a bias toward earlier instructions.",
    stance: "less-is-more",
  },
  {
    key: "agents-md",
    name: "Evaluating AGENTS.md",
    href: "https://arxiv.org/abs/2602.11988",
    org: "ETH Zurich · Feb 2026, rev. Sep 2026",
    setting: "SWE-bench Lite plus a new benchmark of repos with real context files",
    finding:
      "Context files did not generally improve success and raised cost by over 20%. Instructions were followed; repo overviews were not helpful. LLM-generated files were the one condition that lowered success.",
    stance: "less-is-more",
  },
  {
    key: "skillreducer",
    name: "SkillReducer",
    href: "https://arxiv.org/abs/2603.29919",
    org: "Mar 2026",
    setting: "55,315 public skills",
    finding:
      "26.4% lack routing descriptions; over 60% of body content is non-actionable. Compressing descriptions 48% and bodies 39% improved quality 2.8%.",
    stance: "less-is-more",
  },
  {
    key: "index-sickness",
    name: "Index Sickness",
    href: "https://arxiv.org/abs/2606.19121",
    org: "Jun 2026",
    setting: "One project, 391 sessions, action research",
    finding:
      'Instructions ballooned to 308 lines of defensive patches and symbol IDs; the model built self-consistent but false "completed" states. Cutting lines alone (56%) did not fix it. Separating current state from history did: instructions to ~80 lines, owner corrections 0.79 → 0.53 per session, 9 confirmed cases → 0.',
    stance: "less-is-more",
  },
  {
    key: "ace",
    name: "ACE",
    href: "https://arxiv.org/pdf/2510.04618",
    org: "Stanford / SambaNova · ICLR 2026",
    setting: "Agent benchmarks, evolving contexts",
    finding:
      "The counterweight. Repeated LLM rewrites cause brevity bias (detail dropped for generic summaries) and context collapse (accumulated knowledge erodes). Incremental, itemized updates beat monolithic rewrites.",
    stance: "counterweight",
  },
  {
    key: "codified-context",
    name: "Codified Context",
    href: "https://arxiv.org/abs/2602.20478",
    org: "Feb 2026",
    setting: "108k-line C# system, 283 sessions",
    finding: 'A small always-on "hot" constitution plus 34 "cold" spec docs loaded on demand.',
    stance: "pattern",
  },
];

export const MISTAKES: Mistake[] = [
  { key: "autogen-memory", mistake: "Auto-generating the memory file and never pruning it", why: "Generated files lowered success and raised cost", replace: "Hand-written, minimal rules only", evidence: "ETH AGENTS.md" },
  { key: "repo-tour", mistake: "Repo tour or bio in the always-on file", why: "Overviews did not help; every line is paid each turn", replace: "Pointers to on-demand files", evidence: "ETH AGENTS.md, caching" },
  { key: "rule-per-failure", mistake: "Adding a rule after every failure", why: "Defensive patches pile up; models drop instructions silently at density", replace: "Fix the structure; prune quarterly", evidence: "Index Sickness, IFScale" },
  { key: "model-rewrites-memory", mistake: "Letting the model rewrite the whole memory file", why: "Detail erodes into generic summaries", replace: "Small, reviewed edits", evidence: "ACE" },
  { key: "decisions-with-debate", mistake: "Decisions and debate in the same file", why: "Rejected options leak back into new work", replace: "Current-state file plus append-only log", evidence: "Index Sickness" },
  { key: "private-ids", mistake: "Private ID schemes (D-139, SEC-2.0)", why: "Model reasons inside symbols; human can no longer check", replace: "Plain-language names", evidence: "Index Sickness" },
  { key: "facts-about-me", mistake: 'Extracted "facts about me" memory', why: "Raises agreement sycophancy", replace: "Task context; profile-free critique sessions", evidence: "CHI 2026, MIST" },
  { key: "global-servers", mistake: "Connecting every server globally", why: "Tens of thousands of tokens before the first message", replace: "Per-project servers, tool search", evidence: "Anthropic MCP posts" },
  { key: "trifecta", mistake: "Private data, web content and outbound tools in one session", why: "Prompt injection can exfiltrate", replace: "Break one leg of the trifecta", evidence: "Willison" },
  { key: "endless-session", mistake: "One endless session", why: "Context rot; stale content distracts", replace: "One task per session, clear often", evidence: "Context Rot" },
  { key: "mid-session-edits", mistake: "Editing memory mid-session", why: "Busts the cache; full price again", replace: "Edit between sessions", evidence: "Caching guides" },
  { key: "delegate-while-learning", mistake: "Delegating while still learning", why: "Lower comprehension, especially debugging", replace: "Ask for explanations first", evidence: "Anthropic RCT" },
  { key: "trust-speed-feeling", mistake: "Trusting the feeling of speed", why: "Perceived and measured speed diverged by ~39 points", replace: "Time a few real tasks", evidence: "METR" },
];

export const GUARDRAILS: Guardrail[] = [
  { key: "measure-first", text: "Measure before optimizing: check what fills the window (system prompt, memory file, tool definitions, skills) at session start." },
  { key: "one-task", text: "One task per session; clear or compact between unrelated tasks." },
  { key: "edit-between", text: "Edit memory files between sessions, not during." },
  { key: "per-project-servers", text: "Connect servers per project, not globally." },
  { key: "push-verbose-out", text: "Push verbose output (logs, search dumps, test runs) to a script or subagent that returns a summary." },
  { key: "match-model", text: "Match model and effort to the task; frontier models for judgment, smaller or local ones for bulk." },
];

export const ODYSSEUS: OdysseusFeature[] = [
  { feature: "Chat", does: "Local or API models: vLLM, llama.cpp, Ollama, OpenRouter, OpenAI", fit: "One front end for hybrid routing", verdict: "neutral" },
  { feature: "Cookbook", does: "Scans hardware, recommends and serves models that fit", fit: 'Answers "what can my laptop run"', verdict: "demo" },
  { feature: "Compare", does: "Blind side-by-side model testing", fit: "Blind local vs cloud on the same prompt", verdict: "demo" },
  { feature: "Agent", does: "Built on opencode with MCP, web, files, shell, skills, memory", fit: "Agent quadrant, not the workflow quadrant", verdict: "counter" },
  { feature: 'Memory & Skills ("Brain")', does: "ChromaDB vector plus keyword memory; skills described as self-evolving", fit: "Extracted memory and self-rewriting skills are exactly the risks in sections 3 and 4", verdict: "counter" },
  { feature: "Email, calendar, docs, research", does: "IMAP triage, CalDAV, editor, deep research", fit: "Kitchen sink; email plus web plus private files assembles the lethal trifecta by default", verdict: "counter" },
];

export const SOURCES: { group: string; links: SourceLink[] }[] = [
  {
    group: "Papers and studies",
    links: [
      { label: "Hong, Troynikov, Huber. Context Rot (Chroma, 2025)", href: "https://www.trychroma.com/research/context-rot" },
      { label: "Jaroslawicz et al. How Many Instructions Can LLMs Follow at Once? (2025)", href: "https://arxiv.org/pdf/2507.11538" },
      { label: "Gloaguen et al. Evaluating AGENTS.md (2026)", href: "https://arxiv.org/abs/2602.11988" },
      { label: "Summary of AGENTS.md v1 vs v2 results", href: "https://gethrbr.com/blog/is-agents-md-useful" },
      { label: "Gao et al. SkillReducer (2026)", href: "https://arxiv.org/abs/2603.29919" },
      { label: "Zhang and Song. Index Sickness, 391 sessions (2026)", href: "https://arxiv.org/abs/2606.19121" },
      { label: "Zhang et al. Agentic Context Engineering (ICLR 2026)", href: "https://arxiv.org/pdf/2510.04618" },
      { label: "Vasilopoulos. Codified Context (2026)", href: "https://arxiv.org/abs/2602.20478" },
      { label: "Jain et al. Interaction Context Often Increases Sycophancy in LLMs (CHI 2026)", href: "https://dl.acm.org/doi/10.1145/3772318.3791915" },
      { label: "WRITER. Memory systems amplifying sycophancy (MIST, 2026)", href: "https://writer.com/engineering/personalized-context-degrades-ai-accuracy/" },
      { label: "Anthropic. How AI assistance impacts the formation of coding skills (2026)", href: "https://www.anthropic.com/research/AI-assistance-coding-skills" },
      { label: "METR RCT coverage (2025)", href: "https://scienceblog.com/t-a-randomized-trial-by-metr-found-that-experienced-developers-completed-real-coding-tasks-19-slower-when-allowed-to-use-ai-tools-yet-afterwards-they-estimated-on-average-that-ai-had-made-them-20-fast/" },
    ],
  },
  {
    group: "Practice and tooling",
    links: [
      { label: "Anthropic. Building effective agents", href: "https://www.anthropic.com/engineering/building-effective-agents" },
      { label: "Anthropic. Effective context engineering for AI agents", href: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
      { label: "Code execution with MCP, token comparisons", href: "https://particula.tech/blog/code-execution-mcp-token-reduction-pattern" },
      { label: "Simon Willison. Lethal trifecta talk", href: "https://simonwillison.net/2025/Aug/9/bay-area-ai/" },
      { label: "Agent Skills best practices", href: "https://github.com/devskale/skale-skills/blob/main/docs/agent-skills-best-practices.md" },
      { label: "Prompt caching mechanics in Claude Code", href: "https://www.buildthisnow.com/blog/guide/development/claude-code-prompt-caching" },
      { label: "Odysseus repository", href: "https://github.com/pewdiepie-archdaemon/odysseus" },
      { label: "XDA hands-on with Odysseus", href: "https://www.xda-developers.com/tried-pewdiepie-open-source-ai-workspace-odysseus-weirdly-great/" },
    ],
  },
];
