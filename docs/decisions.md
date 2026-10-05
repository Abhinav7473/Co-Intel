# Decision log

Append-only. Newest at the bottom. Never edit old entries; supersede them with a new one.
Format: date — decision. *Why.* (Rejected: …)

---

2026-10-03 — Stack: React 19 + TanStack Router/Query + Tailwind 4 + Vite; FastAPI on Granian; Postgres 18; Alembic.
*User spec.* (Rejected: plain uvicorn — user asked for something current.)

2026-10-03 — No `useEffect` family; enforced by ESLint `no-restricted-imports`.
*User spec; forces loaders, Query, external stores, ref callbacks.*

2026-10-03 — No lockfiles, no host installs; versions pinned exactly in `package.json` / `requirements.txt`.
*User spec. Trade-off: transitive deps can drift between builds.*

2026-10-03 — TypeScript pinned to 6.0.3. *typescript-eslint 8.71 supports TS < 6.1 only.* (Rejected: TS 7.0.)

2026-10-03 — nginx is the edge in both dev and prod on :8088; prod nginx image contains the built SPA.
*User asked for the frontend build to ship beside the backend; nginx gives rate limits + CSP in one place.*

2026-10-03 — Rate limiting lives in nginx, not the app. *Multiple Granian workers would each keep their own counters.*

2026-10-03 — Vite assets are never inlined (`assetsInlineLimit: 0`). *Inlined fonts became `data:` URIs that the CSP blocked.*

2026-10-03 — Real refraction glass via SVG displacement maps, Chromium only, frosted fallback elsewhere.
*User wanted bending glass, not frosted.* (Rejected: CSS-only blur glass as the primary effect.)

2026-10-03 — Branding is "AI Workflow Habits" / "Workflow Habits". (Rejected: "Co-Intel" — user disliked it.)

2026-10-03 — One theme: graphite + one blue accent + warn for risk only. Per-section tone system deleted.
(Rejected: per-section rainbow palette — user called the colours poor.)

2026-10-03 — Radii 20/12/16; top bar no longer a full pill. *User: bar edges too round.*

2026-10-03 — Dev is the default compose profile: `docker compose up --watch` is the whole command.
(Rejected: Makefile-only entry and a `dev` profile — the plain command started only Postgres.)

2026-10-03 — Dev images use `pull_policy: build`. *Watch only syncs changes after start; containers ran stale code.*
(Rejected: `initial_sync` — unsupported by Compose 2.38.)

2026-10-03 — `make lint` mounts host source into throwaway containers. *`exec` linted a stale container copy and passed.*

2026-10-03 — Content split into short scenes with three depths of detail (scene → line `more` → Details & sources).
*User: walls of text won't be read; info on demand.*

2026-10-03 — Tried a full-screen slideshow (keyboard + wheel navigation, builds, overview). **Reverted.**
*User: buggy, and it looked like a presentation, not a website.* (Rejected: wheel hijacking, URL-per-slide.)

2026-10-03 — Website with screen-height scenes, native scroll, `scroll-snap-type: y proximity`, per-kind reveal transitions.

2026-10-03 — Reveal triggers sit on the unclipped `<article>`; the clipped child animates.
*A fully clipped element never intersects, so iris/wipe scenes stayed invisible.*

2026-10-03 — Information system in the repo: `CLAUDE.md` (core) + `docs/*` (reference) + this log + a skill + a content check.
*Apply the brief's own findings to the codebase.* (Rejected: Notion/Obsidian connectors — plain files are enough.)

2026-10-03 — Libraries: keep Motion; adopt Bklit charts selectively; port Kokonut ideas; reject anime.js. See `docs/target.md`.

2026-10-03 — The site is a toolkit, not a stat show: setup audit, self-assessment, experiment log, knowledge base.
*User: "glorified stat show"; asked for real self-dissection and picked all four functions.*

2026-10-03 — Light theme only, chosen by contrast math: off-white canvas, near-black ink, Okabe-Ito blue accent,
dark vermilion for risk, Okabe orange as second data series. (Rejected: dark theme — user; research favours dark text on light for reading/projecting.)

2026-10-03 — Information architecture: landing hub → one page per topic → tools. (Rejected: one long page; slideshow.)

2026-10-03 — Transition types: route changes use View Transitions with types (topic-next/prev, enter-topic, page);
sub-scenes use scroll-linked Motion envelopes, entry-only. *User asked for different transitions for topics vs sub-slides.*

2026-10-03 — Content de-coupled from presenting: talk material moved to optional `presenting` topic. *User: presentation is undecided.*

2026-10-03 — Notes became knowledge-base entries (kinds: finding/source/question/note); data migrated, `notes` dropped.

2026-10-03 — Audit analysis runs client-side and is stored as-is. Score = 100·e^(−penalty/75) so messy setups don't floor at 0.

2026-10-03 — Range knob and toggle redesigned (white knob, hairline, shadow, accent halo). *User: knobs looked ugly.*
Removed the "drag the lens" label. *User: unnecessary.*

2026-10-03 — `backend/alembic/` renamed `backend/migrations/` (the folder shadowed the library name).

2026-10-04 — The site is audience material for the talk, not a channel to the owner. Presenter-only topic removed
(demo plan + framing → `docs/talk-notes.md`); questions and gaps live in `docs/open-questions.md`.
*User: "Stop treating the website itself as a medium to communicate with me."*

2026-10-04 — Check established skills/plugins before hand-building. *User: the first question should have been why we
weren't using skills that many people use.* Suggested: frontend-design, Design, code-review, Data.

2026-10-04 — Installed 12 community skills into the repo via `npx skills add` (run in a node container): frontend-design,
web-design-guidelines, vercel-react-best-practices, design-taste-frontend, emil-design-eng, review-animations,
improve-animations, tailwind-design-system, webapp-testing, grill-me, improve-codebase-architecture, skill-creator.
Removed the CLI's duplicate `agent/skills/` copies (variants for another agent). *User: "Run them all."*

2026-10-04 — From the two pasted generator specs: (a) exhibit + (b) port the scrub idea. No third-party (Higgsfield/CloudFront)
assets. Hero is now the context scrubber: one 200k window, bloated vs tiered, comparison-slider pattern (clip-path inset,
hover/drag/keys, ±4% centre dead zone, one sweep on first view). Lens, flow paths, hero eyebrow, gradient accent word and the
widget "Interactive" eyebrow removed. Exhibit added to the mistakes topic. Skills used: frontend-design, emil-design-eng,
design-taste-frontend. *User: "Build what you can, don't use those higgsfield assets."*

2026-10-05 — Versioning: git initialised by the owner (first commit "Init"); `.env`, backups and node_modules are not tracked.

2026-10-05 — Higgsfield: not installing now. *Owner: "I don't think I need cool 3D assets to get my point through."*
Also parked: Paper Shaders, react-three-fiber.

2026-10-05 — Direction under review: de-prestige the talk toward zero-setup habits for busy lab members (see open-questions #0).

2026-10-05 — Added evidence on screen: what "residue" is (evidence), Index Sickness stat + "methods section vs lab notebook"
(memory), SkillReducer stat + "rubrics, not prompts" (skills), learning-RCT stat with scope caveat (human cost).
Trifecta reframed: it needs an assistant that can act; uploading anonymised data is a privacy/IRB question, not this one.
*Owner: habits lacked premise and mechanism; stats must be on the slides; inferences must be worded as inferences.*

2026-10-05 — Stat scenes now require `study` (what the researchers did, plain language) and `meaning` (what it means
for the reader); `make check-content` enforces both. Jargon removed from scenes (IFScale, ACE, "false completed state",
"lossy compression", "boundary condition"). *Owner: "pushing out stats without clearly explaining what they're for will
frustrate people."* Talk abstract + yes-man test kit drafted in `docs/talk-notes.md`.

2026-10-05 — Truncation/compaction evidence added to Evidence: "Hitting the limit doesn't clean the chat" (Liu et al., Lost
in the Middle) and the compaction stat (Wang et al. 2026, preprint). Product truncation behaviour is labelled "reported"
(third-party guides only). Sources render as preview cards from publisher og:images fetched once by `make previews`
(rejected: hot-linking — CSP and link rot; screenshots — heavier, more copyright exposure).
Skills audit: `vercel-react-best-practices` → lazy routes (index 666→305 KB), unused italic font dropped;
`web-design-guidelines` → skip link, confirm on deletes, live regions, reduced motion via `MotionConfig`, text-wrap
balance/pretty, touch-action; `tailwind-design-system` → radius tokens + one `field` utility (inputs were 10px, now 12px).
`improve-animations` findings recorded in open-questions, not yet planned.

2026-10-05 — Every widget scene carries a guide (what you're looking at · try · the point) and a data badge (study,
estimate, your input, diagram, our judgement, from this repository); `make check-content` enforces it. Feeling-vs-stopwatch
rebuilt: the measured dot is fixed by design and now says so, "they felt" marker added, what-if line, link to a new
`speed-check` experiment (`/experiments?template=`); the learning-quiz chart split into its own widget.
*Owner: the diagrams felt decorative; "shows 19% regardless of how fast the user feels."*

2026-10-05 — "9 → 0" re-checked against the paper: corrections matching Index Sickness, 9 of 45 (sessions 136–214) vs
0 of 20 (253–395); the −56% cut was spec documents, not the rules file. Copy fixed. *Owner: "What's 9 → 0 though?"*

2026-10-05 — Topic 11 "How this site was built": the AI's files and the code layers, the decision log, honest tool status,
what was built on a whim. Numbers come from the repo via `make facts` (`scripts/build-facts.ts` → `content/build-facts.json`).
Home topic grid replaced by a site map (5 groups × topics × scene classes × tools); every topic opens with an outline.
Yes-man run 1 added to memory. *Owner: present how the app was built; navigate with meta-diagrams; be honest that the
tools have no users and some parts were whims.* (Rejected: hand-typed counts — they go stale.)
