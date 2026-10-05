import type { Slide } from "./types";

/**
 * The deck. Rule of thumb: a slide carries one idea in a few short lines.
 * Anything longer goes in `details` (opened with "i") or a line's `more`
 * (opened by clicking the line). Each fact appears once.
 */
export const SLIDES: Slide[] = [
  { id: "title", chapter: "intro", kind: "title", transition: "zoom" },

  // ── 01 framing ───────────────────────────────────────────────────────────
  { id: "framing", chapter: "framing", kind: "chapter", transition: "iris" },
  {
    id: "framing-compare",
    chapter: "framing",
    kind: "compare",
    transition: "wipe",
    heading: "Two different objects",
    columns: [
      { title: "Workflow", lines: ["Predefined code paths.", "You own the control flow."], emphasis: true },
      { title: "Agent", lines: ["The model directs its own process.", "It picks its own tools."] },
    ],
    details: [
      "A memory-backed workflow: the human owns the control flow; the model executes steps inside it.",
      "Same source: start with the simplest solution — for many applications a single well-prompted call with retrieval is enough.",
      "Caveat: reviewers note Anthropic's definitions of agentic, workflow and agent are not fully consistent; practitioners treat it as a gradient of autonomy, not two boxes.",
    ],
    sources: [
      { label: "Anthropic — Building effective agents", href: "https://www.anthropic.com/engineering/building-effective-agents" },
      { label: "AgentPatterns map", href: "https://agentpatterns.ai/patterns/agent-design/anthropic-effective-agents-framework/" },
    ],
  },
  {
    id: "framing-axis",
    chapter: "framing",
    kind: "statement",
    transition: "rise",
    heading: "Ask every tool two questions.",
    lines: [
      { text: "Who owns the control flow — you or the model?" },
      { text: "Who owns the memory — readable by you, or extracted and opaque?" },
      { text: "The workflow thesis: the human owns both." },
    ],
    details: ["User agency and transparency become design properties, not afterthoughts."],
  },
  { id: "framing-board", chapter: "framing", kind: "widget", widget: "control-memory-board", transition: "push" },

  // ── 02 evidence ──────────────────────────────────────────────────────────
  { id: "evidence", chapter: "evidence", kind: "chapter", transition: "iris" },
  {
    id: "evidence-rot",
    chapter: "evidence",
    kind: "stat",
    transition: "zoom",
    value: "300 > 113k",
    label: "tokens — the focused prompt wins",
    line: "Across every model family. One distractor hurts; four compound.",
    source: "Context Rot · Chroma 2025",
    details: ["18 models, task difficulty held constant. Performance degrades with input length even on simple tasks (LongMemEval)."],
    sources: [{ label: "Context Rot (Chroma)", href: "https://www.trychroma.com/research/context-rot" }],
  },
  {
    id: "evidence-ifscale",
    chapter: "evidence",
    kind: "stat",
    transition: "zoom",
    value: "68%",
    label: "best score at 500 simultaneous instructions",
    line: "Failures are silent omissions, biased toward earlier rules.",
    source: "IFScale · Distyl 2025",
    sources: [{ label: "IFScale", href: "https://arxiv.org/pdf/2507.11538" }],
  },
  {
    id: "evidence-agentsmd",
    chapter: "evidence",
    kind: "stat",
    transition: "zoom",
    value: "+20%",
    label: "cost from context files — no reliable gain",
    line: "LLM-generated files were the one condition that lowered success.",
    source: "Evaluating AGENTS.md · ETH 2026",
    details: ["Instructions were followed; repo overviews were not helpful. The September revision reports success-rate effects as not significant; the cost increase held."],
    sources: [{ label: "Evaluating AGENTS.md", href: "https://arxiv.org/abs/2602.11988" }],
  },
  { id: "evidence-deck", chapter: "evidence", kind: "widget", widget: "evidence-deck", transition: "push" },
  {
    id: "evidence-resolve",
    chapter: "evidence",
    kind: "statement",
    transition: "rise",
    heading: "Structure, not brevity.",
    lines: [
      { text: "A small, human-written always-on layer." },
      { text: "Detail lives in files loaded on demand." },
      { text: "Edit by small deltas — never a full rewrite.", more: "ACE: repeated LLM rewrites cause brevity bias and context collapse. Incremental, itemized updates win." },
    ],
    details: [
      "Less-is-more (Context Rot, IFScale, ETH, SkillReducer, Index Sickness) and brevity bias (ACE) are both true — at different layers.",
      "Caveat: Index Sickness is a single-case study where the author was also the evaluator, and the paper was written by an AI collaborator.",
    ],
  },

  // ── 03 memory ────────────────────────────────────────────────────────────
  { id: "memory", chapter: "memory", kind: "chapter", transition: "iris" },
  { id: "memory-tiers", chapter: "memory", kind: "widget", widget: "memory-tiers", transition: "push" },
  {
    id: "memory-delete",
    chapter: "memory",
    kind: "statement",
    transition: "rise",
    heading: "Delete. Don't annotate.",
    lines: [
      { text: "“Ignore the old approach” still sits in context." },
      { text: "Physical removal is the only reliable fix." },
    ],
    details: ["Index Sickness argues removal over annotation, which matches Chroma's distractor results."],
    sources: [{ label: "Zhang & Song — Index Sickness", href: "https://arxiv.org/abs/2606.19121" }],
  },
  { id: "memory-sycophancy", chapter: "memory", kind: "widget", widget: "sycophancy-bars", transition: "push" },
  {
    id: "memory-critique",
    chapter: "memory",
    kind: "statement",
    transition: "rise",
    heading: "Critique runs get task context only.",
    lines: [
      { text: "An assistant that knows you grades you softer." },
      { text: "Carry the rubric in a skill — not your profile." },
    ],
    details: [
      "CHI 2026: two weeks of real interaction data from 38 people; condensed user-memory profiles produced the largest jumps in agreement sycophancy.",
      "WRITER's MIST: the extraction step is the culprit. Raw history roughly halved sycophancy; a prose summary was the strongest mitigation.",
    ],
    sources: [
      { label: "Jain et al. (CHI 2026)", href: "https://dl.acm.org/doi/10.1145/3772318.3791915" },
      { label: "WRITER — MIST", href: "https://writer.com/engineering/personalized-context-degrades-ai-accuracy/" },
    ],
  },

  // ── 04 skills ────────────────────────────────────────────────────────────
  { id: "skills", chapter: "skills", kind: "chapter", transition: "iris" },
  {
    id: "skills-levels",
    chapter: "skills",
    kind: "widget",
    widget: "skill-levels",
    transition: "push",
    details: ["Agent Skills became an open standard on 18 Dec 2025; Codex, Cursor, Copilot and others read the same SKILL.md format."],
    sources: [
      { label: "Agent Skills overview", href: "https://inference.sh/blog/skills/agent-skills-overview" },
      { label: "Skills best practices", href: "https://github.com/devskale/skale-skills/blob/main/docs/agent-skills-best-practices.md" },
    ],
  },
  {
    id: "skills-wrong",
    chapter: "skills",
    kind: "list",
    transition: "fade",
    heading: "What goes wrong",
    numbered: true,
    lines: [
      { text: "Vague description — it never fires.", more: "26.4% of 55,315 public skills lack a routing description (SkillReducer)." },
      { text: "Padded body.", more: "Over 60% of the average body is non-actionable. Compressing descriptions 48% and bodies 39% improved quality 2.8%." },
      { text: "One giant skill.", more: "Prefer a short core plus reference files." },
      { text: "Self-rewriting skills.", more: "ACE's context-collapse finding predicts drift toward generic text unless edits are small and reviewed." },
    ],
    sources: [{ label: "SkillReducer", href: "https://arxiv.org/abs/2603.29919" }],
  },
  {
    id: "skills-split",
    chapter: "skills",
    kind: "compare",
    transition: "wipe",
    heading: "Three containers",
    columns: [
      { title: "Memory file", lines: ["What is true about this project."] },
      { title: "Skill", lines: ["How to do a recurring job."], emphasis: true },
      { title: "Script", lines: ["The deterministic part.", "Zero tokens re-deriving it."] },
    ],
  },

  // ── 05 connectors ────────────────────────────────────────────────────────
  { id: "connectors", chapter: "connectors", kind: "chapter", transition: "iris" },
  {
    id: "connectors-bill",
    chapter: "connectors",
    kind: "stat",
    transition: "zoom",
    value: "~55k",
    label: "tokens of tool definitions — before you type",
    line: "Five servers, 58 tools. Setups of 134k have been seen.",
    source: "Anthropic testing",
    sources: [{ label: "Summary of Anthropic's post", href: "https://waleedk.medium.com/the-evolution-of-ai-tool-use-mcp-went-sideways-8ef4b1268126" }],
  },
  {
    id: "connectors-overhead",
    chapter: "connectors",
    kind: "widget",
    widget: "tool-overhead",
    transition: "push",
    details: [
      "Fixes, lightest first: fewer servers; on-demand tool search (~77k → ~8.7k); code execution against tools exposed as files (one task ~150k → ~2k).",
      "Code execution adds a sandbox you now have to secure.",
    ],
    sources: [{ label: "Code execution with MCP", href: "https://particula.tech/blog/code-execution-mcp-token-reduction-pattern" }],
  },
  {
    id: "connectors-trifecta",
    chapter: "connectors",
    kind: "widget",
    widget: "trifecta",
    transition: "push",
    details: [
      "Private data + untrusted content + a way out = a session that can be prompt-injected into leaking.",
      "Real case: an Atlassian MCP server where a public support ticket could steal private data. MCP pushes the security decision onto the end user.",
    ],
    sources: [{ label: "Simon Willison — lethal trifecta", href: "https://simonwillison.net/2025/Aug/9/bay-area-ai/" }],
  },

  // ── 06 cost ──────────────────────────────────────────────────────────────
  { id: "cost", chapter: "cost", kind: "chapter", transition: "iris" },
  {
    id: "cost-prefix",
    chapter: "cost",
    kind: "statement",
    transition: "rise",
    heading: "The bill is the prefix.",
    lines: [
      { text: "Cache reads cost ~10% of input.", more: "Writes cost 1.25× (5-min) or 2× (1-hour): one reuse already breaks even." },
      { text: "Change anything early — everything after re-bills.", more: "Editing CLAUDE.md mid-session, reshuffling tools, switching models." },
      { text: "97% of one user's tokens were cache reads.", more: "74,493 logged turns. Anecdotal, but it shows where cost sits." },
    ],
    sources: [
      { label: "Prompt caching mechanics", href: "https://www.buildthisnow.com/blog/guide/development/claude-code-prompt-caching" },
      { label: "Reducing token usage", href: "https://app.stationx.net/articles/reduce-claude-code-token-usage" },
      { label: "Log analysis", href: "https://www.aakashx.com/blog/how-to-cut-claude-code-cost/" },
    ],
  },
  { id: "cost-calculator", chapter: "cost", kind: "widget", widget: "cache-calculator", transition: "push" },
  { id: "cost-checklist", chapter: "cost", kind: "widget", widget: "guardrail-checklist", transition: "push" },
  {
    id: "cost-hierarchy",
    chapter: "cost",
    kind: "compare",
    transition: "wipe",
    heading: "Fetch one level deeper, only when needed",
    columns: [
      { title: "Core file", lines: ["Names pointers."], emphasis: true },
      { title: "Reference files", lines: ["Hold the detail."] },
      { title: "Scripts", lines: ["Do the work."] },
    ],
  },

  // ── 07 local ─────────────────────────────────────────────────────────────
  { id: "local", chapter: "local", kind: "chapter", transition: "iris" },
  {
    id: "local-routing",
    chapter: "local",
    kind: "statement",
    transition: "rise",
    heading: "The case for local is data, not cost.",
    lines: [
      { text: "Research data may not be allowed to leave the machine." },
      { text: "Local for sensitive and bulk; cloud for hard reasoning." },
      { text: "16 GB → gpt-oss:20b · 24 GB → qwen3.6:27b", more: "From one 2026 guide. Verify on your actual machines before relying on it." },
    ],
    details: ['The "80% local" ratios quoted online are blog estimates, not measurements.'],
    sources: [
      { label: "Local vs cloud overview", href: "https://freeacademy.ai/blog/local-llms-vs-cloud-llms-ollama-privacy-comparison-2026" },
      { label: "Hardware guide", href: "https://aithinkerlab.com/best-local-llm-models-privacy-dev/" },
    ],
  },
  {
    id: "local-odysseus",
    chapter: "local",
    kind: "widget",
    widget: "odysseus-grid",
    transition: "push",
    details: [
      "Odysseus: released by Felix Kjellberg on 31 May 2026, MIT licensed.",
      "On 2 Oct 2026 he released Ajax, a 9B fine-tune of Qwen3.5 for agentic tool use inside Odysseus. Coverage is one day old — check before citing.",
    ],
    sources: [
      { label: "Odysseus repository", href: "https://github.com/pewdiepie-archdaemon/odysseus" },
      { label: "XDA hands-on", href: "https://www.xda-developers.com/tried-pewdiepie-open-source-ai-workspace-odysseus-weirdly-great/" },
      { label: "Ajax coverage", href: "https://tech-insider.org/pewdiepie-ajax-ai-model-openai-bans-2026/" },
    ],
  },
  {
    id: "local-verdict",
    chapter: "local",
    kind: "compare",
    transition: "wipe",
    heading: "Strong on ownership. Weak on restraint.",
    columns: [
      { title: "Shows ownership", lines: ["Compare: blind local vs cloud", "Cookbook: what your hardware runs"], emphasis: true },
      { title: "Shows the risks", lines: ["Brain: extracted, self-rewriting memory", "Agent: the agent quadrant"] },
    ],
  },

  // ── 08 human cost ────────────────────────────────────────────────────────
  { id: "human-cost", chapter: "human-cost", kind: "chapter", transition: "iris" },
  {
    id: "human-gap",
    chapter: "human-cost",
    kind: "widget",
    widget: "perception-gap",
    transition: "push",
    details: [
      "METR RCT: 16 experienced open-source devs, 246 tasks, early-2025 tools. 19% slower with AI; they believed 20% faster. CI +2% to +39%.",
      "METR's 2026 follow-up changed design after 30–50% of invited developers declined to work without AI, which biases the sample.",
      "Anthropic RCT: 52 mostly junior devs learning an unfamiliar library. Debugging showed the largest gap.",
    ],
    sources: [
      { label: "METR RCT coverage", href: "https://scienceblog.com/t-a-randomized-trial-by-metr-found-that-experienced-developers-completed-real-coding-tasks-19-slower-when-allowed-to-use-ai-tools-yet-afterwards-they-estimated-on-average-that-ai-had-made-them-20-fast/" },
      { label: "Anthropic — AI assistance and coding skills", href: "https://www.anthropic.com/research/AI-assistance-coding-skills" },
    ],
  },
  {
    id: "human-framing",
    chapter: "human-cost",
    kind: "statement",
    transition: "rise",
    heading: "Measure. Don't trust the feeling.",
    lines: [
      { text: "Ask for explanations while learning." },
      { text: "Delegate once you know the terrain." },
      { text: "Critique over authorship." },
    ],
  },

  // ── 09 mistakes ──────────────────────────────────────────────────────────
  { id: "mistakes", chapter: "mistakes", kind: "chapter", transition: "iris" },
  { id: "mistakes-audit", chapter: "mistakes", kind: "widget", widget: "mistakes-audit", transition: "push" },
  {
    id: "mistakes-exhibit",
    chapter: "mistakes",
    kind: "widget",
    widget: "spec-exhibit",
    transition: "push",
    details: [
      "Both specs were written to be pasted into an AI site generator and reproduce a page to the pixel.",
      "Together they show four catalog mistakes at once: instruction overload, invented data, borrowed assets, and directions mixed with content.",
    ],
  },

  // ── 10 tensions ──────────────────────────────────────────────────────────
  { id: "tensions", chapter: "tensions", kind: "chapter", transition: "iris" },
  {
    id: "tensions-evidence",
    chapter: "tensions",
    kind: "list",
    transition: "fade",
    heading: "Tensions in the evidence",
    lines: [
      { text: "Less-is-more vs brevity bias.", more: "Section 2 resolves it by layer. Convincing, or papering over a real disagreement?" },
      { text: "Coding evidence, research audience.", more: "Most rigorous studies are coding agents on repos; much research work is papers, tools and studies." },
      { text: "Curation costs time.", more: "When does curating memory cost more than re-explaining context?" },
      { text: "Personalization vs agency.", more: "The yes-man data suggests personalization can quietly undermine transparency. Sharpens the thesis, or complicates it?" },
    ],
  },
  { id: "end", chapter: "end", kind: "end", transition: "fade" },
];
