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
