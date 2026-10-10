# Open questions & gaps

Questions for Abhinav and known gaps. **Not** for the website: the site is audience material for the talk.
Answer inline (write under the question); answered items move to `docs/decisions.md` and are deleted here.

## Next session: start here (handoff 2026-10-09, v5)
1. **/intro is now a stepped talk** (v5): 9 screens, 6 beats, one viewport each, snapped on desktop; outline from the
   outside critique (seminar-audit §8). Run sheet in talk-notes ("v5"). Decisions log 2026-10-09 has what was cut.
2. **Verify in a real, visible Chrome window:** PageDown/Space/clicker lands exactly on each screen (snap could not be
   verified in the test pane); the 3D 2×2 comes apart on screen 2; bars grow on screen 6; the room's projector at 1080p.
3. **Owner to-dos:** run the yes-man 5×5 *in Claude Code* on the on-screen rationale (then counts go on screen 6 and
   real screenshots on 1 and 9); confirm the web version of Claude Code reads CLAUDE.md the way the 3D cards say.
4. **Open:** a QR code / public URL for the take-home (needs a deploy URL); whether students have claude.ai/code open.
5. **Nothing committed since `887f904`.** The v3 versions of IntroPage/Panels/World were untracked and are replaced;
   the four removed files are only in the old session scratchpad. Commit soon.
Working rules: change only what was asked; the owner runs `compose watch`; a hidden test pane pauses rAF/IO.

## Questions

### 0. Reframe (2026-10-05): what does the lab actually take home?
Audience: busy lab members. No one will set up MCPs, maintain a tool, or keep compressed memory files current.
Corrected by owner (2026-10-05): **the site stays maximalist** — it's tokens we minimize, not visuals.
"Information system" = **this codebase and its files** (CLAUDE.md, docs/, decisions log, skills, scripts).
The habits need premise → mechanism → action → fine print, not slogans (rewritten in chat 2026-10-05).
Open: the four tools are "abstraction voids" (unused, unexplained). README now states purpose + status per tool.
Decide per tool: re-scope (audit → project instructions; assessment → the habits; experiments → "time one task"),
keep as presenter-only (knowledge base), or cut.

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

### 7. Preview images if the site goes public
`public/previews/` stores publishers' own og:images (link-preview use, attributed, linked). Fine for a lab talk; if the
site is deployed publicly, keep them, or switch to title-only cards?

### 8. Animation fixes — which to plan? (`improve-animations` audit, 2026-10-05)
| # | Sev | Where | Finding | Fix |
|---|---|---|---|---|
| 1 | MED | `styles.css` `--ease-spring` on `.range` thumb | Overshoot bezier on a control used constantly | `cubic-bezier(0.23,1,0.32,1)` 160ms |
| 2 | MED | `features/assess/AssessPage.tsx` step transition 0.35s | Over 300ms on a step you click through 18 times | 200ms ease-out |
| 3 | MED | `Scene.tsx` compare cards, `OdysseusGrid`, home topic cards | Hover lift `y:-4` — common AI-design tell | border/shadow change only |
| 4 | LOW | widgets: Radar `scale:0.2`, Trifecta `scale:0.4` | Near-zero scale entrances look like popping | start at 0.95 + opacity |
| 5 | LOW | ~15 hand-typed springs (stiffness 60–600) | No shared spring tokens | 2–3 named springs in `ui/motion.ts` |
Missed opportunities: no press feedback on `Button` (scale 0.97, 160ms); KB filter changes jump instead of crossfading.

### 9. Topic 11 says the tools have no users
True today. After the talk, if people try them, update `build-status` in `deck.ts` (the honest-status list).

## Gaps (known, not yet fixed)
- Script exhibit token counts are estimates (12-page draft ≈ 6k, 300-entry .bib ≈ 30k). Swap in a real draft's count if you demo it.
- Yes-man scene assumes GPT 5.6 Luna was the model in all three chats; correct the details line if not.
- Hero bloom/grain is subtle by design; check it reads on the projector, or raise the 18% in `HomePage.tsx` `Bloom`.
- Map "seen" counts any scene scrolled past the reading line, read or not. The 22 cross-link reasons (`links` in
  `brief.ts`) are my reading of how topics connect; check them before the talk.
- Theme hues are untested on the room's projector (orange and purple themes especially).
- No projector/mobile pass: verify at 1920×1080 and 1280×720 with the room's actual screen.
- Assessment questions and weights are mine, unvalidated.
- Audit rules are pattern matching; expect false positives on real files.
- Brief facts not re-verified (e.g. Ajax coverage was one day old).
- Charts are hand-built; `dataviz` skill / Bklit not applied yet.
- Redesign is partial: the hero is redone, the rest of the site still carries the tells listed in `docs/design.md`.
- One unexplained console error once: view transition aborted on first load.
- No CI; checks run only via `make lint`.
- Site-map squares and topic outlines link to `#scene-id`. Direct loads land correctly; in-app jumps couldn't be verified
  (the test browser pane was hidden, which aborts view transitions and pauses animation frames). Check in a real window.
- `build-facts.json` goes stale unless `make facts` is rerun after doc edits (no check enforces it).
- ~40 hard-coded radii (`rounded-[8|10|14|18px]`) and 12 font sizes (10–16px) outside the token set; migrate when touched.
- Inputs lack `name`/`autocomplete`; KB kind/search and the assessment step aren't in the URL (web-design-guidelines).
- Guidelines want Title Case buttons; the site uses sentence case on purpose (kept).
