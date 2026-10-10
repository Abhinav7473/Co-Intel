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

2026-10-05 — Navigation is a map, not a table. `/map` (and the home page) show the five themes as blocks; whole topic
cards are links, scene squares jump to a scene, seen squares fill in, and "You are here" follows the reader (scene crossing
40% of the viewport, IntersectionObserver ref callback → external store; visited in localStorage). Topic pages: mini-map
rail with the live scene ring, mobile pill, "Where next" = two hand-picked cross-links (each in its theme's hue) + prev/next
+ map. Each theme has a hue, each topic an emblem. The hero diagram got the same guide as every widget. New icon: token
grid (the old one read as "an L and a ball"). Old `SiteMap` table removed. Skills used: frontend-design.
*Owner: "I wasn't expecting a table that forces the user to click on the tiny subheading … reduce information cost."*
(Rejected: overriding `--color-accent` per topic — widget data colours would collide with the orange/purple themes.)

2026-10-05 — Premise before data. Every study/estimate widget names its study first (`guide.basis`, enforced by
`make check-content`); Chroma's stat says how "better" was scored (GPT-4.1 grader tuned to >99% agreement with ~600
hand labels, 306 questions). Index Sickness stat now precedes the tiers widget. Yes-man run labelled GPT 5.6 Luna.
Skills: rubric → "where each kind of instruction lives" (with examples) → new script exhibit (citation check, with vs
without a script; scripts run outside the chat, only output enters — Anthropic Agent Skills docs) → what goes wrong.
Connectors widget shows an example per loading mode; the −98.7% figure is now attributed to the one transcript task it
measured, not to tool definitions (that was wrong). Cost: caching explained as a scene (resend → cache → invalidation →
habit, from Anthropic's caching docs); the 97% is its own stat naming its source (one developer's blog, own logs).
Feeling-vs-stopwatch is now guess-then-reveal (the reader's input answers a question instead of moving a decorative dot).
Primary sources replace blog summaries where they exist (Anthropic engineering posts). Hero: see design.md.
*Owner: "By putting the studies up, it increases trust"; "97% … which study??? man cmon"; "why is the user getting agency
… when the stopwatch result does not change."*

2026-10-05 — Takeaway bar after every topic (`content/takeaways.ts`, `topic/TakeawayBar`): what it found, what to do,
how long it takes, who can skip it. Unprestiged on purpose: plain verbs, no new facts. Audited with web-design-guidelines
(first person → neutral, checkbox-looking bullets → arrows, numerals). Rejected: a summary of the scenes (restates facts,
breaks "each fact appears once"). `grill-me` is user-invocable only; the owner runs `/grill-me`.
*Owner: "not a summary, unprestiged takeaways."*

2026-10-07 — Undergrad version: `/intro`, a separate 15-minute path (7 scenes, `content/intro.ts`) reusing the scene
renderer and the sycophancy widget; the grad site is unchanged. Two ideas only (memory flatters you, learn don't
outsource), UX framing (design rationale critique, Nielsen's heuristics as criteria), presenter demo. Same copy limits
via `make check-content`. Rejected: cutting the grad site down (loses depth for the lab); slides only (two artefacts to
keep in sync). *Owner: "I could only get through 40% in 30 minutes … make this for undergrads … maximize clarity, don't
overshoot."* `grill-me` points to a `grilling` skill that isn't installed.

2026-10-07 — /intro gets "umph": a 3D opening (exploded chat app, scroll-driven) that the Habit 1 widget reuses (toggle
removes the memory layer), two act headers in the hues of the topics they come from, a bigger closing card. "15-minute
version" wording removed (the home link reads "Start with two habits"). Added three 0.186.1, @react-three/fiber 9.8.1,
@react-three/drei 10.7.9, @types/three 0.186.0 (pinned, installed in the image). Reverses the 2026-10-05 parking of
react-three-fiber for this page only. *Owner: "Give it some umph. Make each change coherent … use three js components
wherever necessary."* Rejected: 3D elsewhere on /intro (the bars and the stat read better flat).

2026-10-07 — /intro rebuilt as one persistent Three.js scroll world (8 chapters, `features/intro/{World,chapters,
conductor,Panels}`), replacing the 3D opening + text scenes. Skills: installed `find-skills` (vercel-labs/skills), then
via it `scroll-world-storytelling` + `build-threejs-scroll-worlds` (mengto/skills, 6.7K★, MIT), `impeccable`
(pbakaus, 78K★) and `high-end-visual-design` (leonxlnx/taste-skill). Rejected: cloudai-x threejs-skills (no licence),
r3f-skills / three-agent-skills (<130★), GSAP skills (would add GSAP beside Motion). `impeccable`'s launcher was not run
(downloads a binary). The `memory-stack` widget and `ChatStack` were removed; the world carries both. The installs
recreated `agent/skills/` duplicates; removed again. *Owner: "You can do way better!! run /find-skills"; fix "all of it".*

2026-10-07 — /intro world restyled to the site's palette (white hairline cards, ink, accent only on memory; no glossy
fills) and given a formation per chapter. The model is now a pearl blob with a particle halo (was a cube). Skills found
via `find-skills` and installed: `shader-dev` (minimax-ai/skills, 13.7K★, MIT), `algorithmic-art` (anthropics/skills),
`globe-particles` + `gooey-blob-system` (mengto/skills; gooey is SVG-only, unused here). Rejected: iart-ai (51★),
cloudai-x threejs-shaders (no licence). *Owner: "It looks tacky because of the colors"; "arrange them in different
wireframes"; "the model block kinda look awful; more like a blob with particles".*

2026-10-07 — Junior seminar restarted from the content, not the page. Audit in `docs/seminar-audit.md` (inventory, Kvale
lens via Ivey et al. 2026, SUCCESs score 27/60, bounds). Skills installed via `find-skills`: `grilling` + `teach`
(mattpocock/skills, 280K★; `grilling` makes `/grill-me` work), `made-to-stick` (wondelai/skills), `workshop-facilitation`
(deanpeters/product-manager-skills, licence unstated). Rejected: samber/dev-event-organizer-skills (2★).
*Owner: 0/10 for /intro; "without the proper skills or plugins you can't design coherent things".*

2026-10-07 — Grilled the junior seminar (via `/grill-me` → `grilling`). Settled: the question ("what can you change … that
makes its answer measurably better?"), bounds (chat apps; two levers: what it has seen, what you hand over), story = our
own proof, not preaching ("what we do now", never "should"), the spine "Same prompt. Different answer." (holds the
prompt fixed, which separates this from prompting), three earned words revealed only after they're seen (context rot,
hallucination, sycophancy: the savvy factor without skills or connectors), guess-then-reveal per proof, honest marketing
(no fake urgency or social proof). Rebuilt /intro to 6 chapters; `make check-content` bans preaching words and jargon in
intro copy and fails if an earned word appears before its reveal. *Owner: "Dejargonize; carry through pragmatism; don't
preach; prove something works better"; "use marketing tactics"; "work around what you have".*

2026-10-07 — /intro motion pass. Skills via `find-skills`: `cinematic-scroll-storytelling` + `scroll-scrubbed-word-reveal`
(mengto/skills), `scroll-craft` (nateherkai, 3K★, MIT; its encode script and engine not run), `design-motion-principles`
(kylezantos, 11K installs), `animation-vocabulary` (emilkowalski). GitHub inspiration: ibelick/motion-primitives (text
scramble), basementstudio/scrollytelling, russellsamora/scrollama. Changes: copy alternates sides per chapter
(`COPY_SIDE` in chapters.ts; camera targets mirror through the subject; scrims cross-fade sides); chapter titles are
scroll-scrubbed word by word (reversible); earned words decode into place; evidence plates settle with a spring; the
hook's looping dots removed (no looped attention motion). Rejected: GSAP/Lenis (Motion already does this; native scroll
only). *Owner: "animations are still basic … the text and animation can swap positions".*

2026-10-07 — Seminar re-scoped to Claude Code on the web (owner: "a class about teaching the students to use the claude
code web option … saving time and saving tokens"). 7 chapters; four earned words (token added); meter of tokens resent
per message (illustrative, brief figures); real numbers from this repo (~3k always loaded vs ~119k on demand, ≈4 chars per
token); new evidence: Panickssery et al. NeurIPS 2024 (self-preference) for the reviewer chapter; Claude Code docs for
`/context`, `/compact`, no `/clear` on the web, subagents, parallel cloud sessions. 3D cards are now Claude Code's parts
(your message, the session so far = accent, CLAUDE.md, skills and tools). Motion: clutter → order (ORDER per chapter;
copy, plates and 3D cards tilt and scatter early, square up by the close; close cards converge), after motionprompts.dev's
"Photo Dump Scatter" and "Converging Card Stack". `make check-content`: "token"/"agent" no longer banned; earned words
are checked against the chapter that reveals them.

2026-10-08 — Rolled back the v4 content re-scope (7 chapters, token meter, new studies, Claude Code-part cards). Restored the
6-chapter seminar with light Claude Code wording only (chat → session, temporary chat → fresh session; study descriptions
unchanged). Kept the motion work: clutter → order (ORDER per chapter, chaos jitter on 3D cards, tilted plates), converging
close, sides swapping, title scrub, word decode. *Owner: "kinda overdid it. I just asked for the animations."*
Lesson: when asked for animation, change only animation; raise content ideas as questions.

2026-10-09 — From the owner's repo list (impeccable, chrome-devtools-mcp, emilkowalski/skills, taste-skill, hairline, …):
added `@lucasmarkes/hairline` 0.5.0 (MIT, no dependencies, no install scripts). One figure, `Exploded` (an app window in
four layers), is the 2D twin of the /intro world: shown under reduced motion instead of the 3D scene, and as the WebGL
fallback (playing). Themed to the site's tokens (`.hairline-site` in styles.css; lit = accent). Performance pass from a
production build: the /intro chunk carried three.js (1,081 kB, 308 kB gzip); the World is now lazy-loaded (IntroPage
147 kB / 58 kB gzip; World 934 kB loads after the text; reduced-motion visitors never fetch it). Not done:
`review-animations` (user-invocable only); chrome-devtools-mcp (MCP servers load at session start; needs a new session).
Rejected from the list: shadcn-ui-mcp-server (no shadcn here; standing tool cost), img2threejs (no photographed object),
awesome-design (link list, stale), addyosmani/agent-skills (overlaps installed skills). ponytail noted as a possible
seminar exhibit; its −45% token figure is the author's own benchmark, unverified.

2026-10-09 — /intro motion fixes from `/review-animations` (verdict: block). Applied, motion only: the copy column's
tilt is a static pose (it swung straight/tilted on every scroll past); chapter-title scrub drops the per-word blur
(opacity + transform only, over WebGL); the pointer lean on the camera is damped (λ 2.5) instead of following the mouse
raw; the guess question exits in 150 ms and the answer enters in 250 ms (was a hard cut, 450 ms); plates only fade under
reduced motion; opening title 0.7 s / 4 px blur / 60 ms stagger; close cards stagger 70 ms; rail tick animates `scaleX`,
not `width`; word slots 300 ms strong ease-out. Motion's x/y/rotate shorthands replaced with transform strings where
touched. Not done: the `reduce` branches inside World/Blob/Tokens are dead (World never mounts under reduced motion);
left for a cleanup pass. Hover gating not needed: Tailwind v4's `hover:` is already `@media (hover: hover)`.

2026-10-09 — /intro rebuilt as a stepped talk (v5), from the outside critique (seminar-audit §8, 3/10) and the owner's
"fix these" (taken as yes to the six recommendations: AI habits taught through Claude Code; Claude Code moves shown, not
done by the room; clicker/keyboard; adopt the six-beat rebuild; architecture first; 5×5 before class). Nine screens, six
beats (a test = question screen, then answer screen); each screen is one viewport and snaps on desktop (CSS
`scroll-snap-type` on `html:has([data-snap])`, ≥1024px), so PageDown/Space/a clicker moves one screen with native
scroll; nothing listens to keys. No click interactions in the talk: hands up, numeric options. One earned word
(sycophancy, decoded); context rot is a plain label; hallucination, the GPT-vs-Claude twist, the words HUD, the n = 1
GPT 5.6 Luna table, clutter → order, title scrub, the blob/tokens/formations/ledger and the grad-site CTA are gone. The
3D is one beat ("What it reads"): Claude Code's four inputs (your message, the session so far, CLAUDE.md, its own
instructions; labelled as an illustration) go from a stack to a 2×2 facing the room. Opening and close show the same
two sessions with the same prompt; the close fills in the answers (CHI 2026) and lists three habits. Projector type:
evidence ≈ 28px at 1080p, numbers ≥ 64px. Every audience string is in `content/intro.ts` (architecture candidate 2);
chapter tables (`chapters.ts`, `formations.ts`) are gone, so a screen is one record (candidate 1 by deletion).
Removed files are kept in the session scratchpad, not the repo. Not verified: scroll snap under real keyboard input (the
test pane neither snapped programmatic scrolls nor delivered PageDown); in-view animations and the 3D explode run only
with the pane in front. Rejected: fabricating a "7 vs 4" opening screenshot (the 5×5 isn't run); a keyboard handler for
stepping (CLAUDE.md: never hijack keys).
