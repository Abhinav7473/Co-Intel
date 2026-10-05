# Open questions & gaps

Questions for Abhinav and known gaps. **Not** for the website: the site is audience material for the talk.
Answer inline (write under the question); answered items move to `docs/decisions.md` and are deleted here.

## Questions

### 1. Skills — why haven't we been using them?
We should have started here. Established skills exist for most of what was hand-rolled:
- Already available in the session, unused: `dataviz` (charts), `code-review`, `simplify`, `security-review`, `run`.
- Suggested for install (card shown 2026-10-04): **frontend-design**, **Design** (design-critique, accessibility-review,
  design-system, ux-copy), **code-review**, **Data** (create-viz, data-visualization).
- **Your call:** which do we install and use for building? Which do you want to *show* in the talk
  (community skills vs. skills you wrote)?

**Installed 2026-10-04 (all twelve below), into `.agents/skills` + `.claude/skills` symlinks.** Note: the CLI also wrote
`skills-lock.json` (sources + hashes). It records skill provenance, not package versions — keep it, or does it break your no-lockfile rule?

**Shortlist from `find-skills` (skills.sh, 2026-10-04).** Verified: install count ≥ 1K and source repo stars.
| Need | Skill | Installs | Repo ★ |
|---|---|---|---|
| UI design | `anthropics/skills@frontend-design` | 952K | 180K |
| Design/a11y review | `vercel-labs/agent-skills@web-design-guidelines` | 697K | 32K |
| React practice | `vercel-labs/agent-skills@vercel-react-best-practices` | 769K | 32K |
| Taste / polish | `leonxlnx/taste-skill@design-taste-frontend` | 560K | 92K |
| Motion | `emilkowalski/skills@emil-design-eng`, `@review-animations`, `@improve-animations` | 320K / 199K / 169K | 43K |
| Tailwind system | `wshobson/agents@tailwind-design-system` | 67K | 40K |
| Browser testing | `anthropics/skills@webapp-testing` | 170K | 180K |
| Plan interrogation | `mattpocock/skills@grill-me` | 1.3M | 276K |
| Architecture | `mattpocock/skills@improve-codebase-architecture` | 1.0M | 276K |
| Writing skills (talk + info system) | `anthropics/skills@skill-creator` | 398K | 180K |
Not found / skipped: no reputable FastAPI or charting skill (session `dataviz` covers charts);
`currents-dev@playwright-best-practices` has 90K installs but a 388★ repo — treat with caution.
Install into the repo (not global) so the skills become part of the information system you present:
`npx skills add <owner/repo@skill> -y` — run inside the node container, like the find step.

### 2. What does the talk show from this site?
You said: various skills, your information system, and the research. Proposed structure — confirm or correct:
1. The research (topics, short scenes) — exists.
2. **Skills**: a page that renders real `SKILL.md` files (yours + community), what triggers them, what they cost in context.
3. **Information system**: a page that renders this repo's own system live — `CLAUDE.md` (core), `docs/` (reference),
   `decisions.md` (log), skills, scripts — with token counts per tier.
4. The tools (audit, assessment, experiments, knowledge base) — keep as live demos, or cut?

### 3. Your information system — what is it, concretely?
"Which we haven't built yet, practically within the codebase." Options:
- (a) This repo's own `CLAUDE.md` + `docs/` + log + skills, grown into the reference example you present.
- (b) A separate example project (e.g. a research-paper workflow) built with the same tiers, shown side by side.
- (c) Your real personal setup (memory files, skills, connectors), sanitized.
Which one — and where does your real material live today (folders, tools)?

### 4. Should the site read the information system from the repo?
If the site renders `CLAUDE.md`, `docs/*.md` and `.claude/skills/*/SKILL.md` directly (imported at build time), the
talk always shows the true current state and nothing is duplicated. Cost: a markdown renderer and a build step. Yes?

### 5. Audience and format
Who (the brief mentions a lab of 8), how long, projector or laptops, live demo or walkthrough?
Do attendees use the tools themselves (needs multi-user thinking) or only watch you?

### 6. Visual assets
Pending your pick from the asset review: Paper Shaders (mesh gradient hero, liquid-metal logo, pulsing border),
3D context window (react-three-fiber). Also: links for "Frakt backgrounds" and the Framer components you meant.

### 8. Higgsfield setup — how, and with what guardrails?
Checked 2026-10-04: `@higgsfield/cli` 1.1.26 (MIT, official maintainers, ~27.6k downloads/week; postinstall downloads a
checksum-verified binary from their GitHub releases). `higgsfield-ai/skills`: MIT, 1.2k★, 8 skills.
Decide:
- **Install location:** global on the host (breaks the Docker-only rule, but it's a tool, not a project dependency) or a
  container with a mounted config volume for the auth token?
- **Which skills:** all 8, or only `higgsfield-generate` (+ `higgsfield-video-explainer`)? Install with `--skill`.
- **Spending rule:** the skill says "don't pre-estimate cost" and defaults to top-quality models. Proposed project rule:
  always run `higgsfield generate cost …` and get your yes before every generation.
- **Assets:** generated files are downloaded into the repo (never hotlinked). What would you generate — and for which part
  of the talk/site? (`frontend-design` warns against decorative media.)
- **Auth:** `higgsfield auth login` is yours to run (browser sign-in); the stored token lets any agent session spend credits.

## Gaps (known, not yet fixed)
- No projector/mobile pass: verify at 1920×1080 and 1280×720 with the room's actual screen.
- Assessment questions and weights are mine, unvalidated.
- Audit rules are pattern matching; expect false positives on real files.
- Brief facts not re-verified (e.g. Ajax coverage was one day old).
- Charts are hand-built; `dataviz` skill / Bklit not applied yet.
- Redesign is partial: the hero is redone, the rest of the site still carries the tells listed in `docs/design.md`.
- One unexplained console error once: view transition aborted on first load.
- No CI; checks run only via `make lint`.
