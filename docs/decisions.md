# Standing decisions

What binds now, phrased as what we do. Superseded, reverted and rejected options live in
`docs/archive/decisions-history.md` (not loaded by default; look things up there only when asked "why").
When a decision changes: edit it here (new date), and append one entry to the history.

**Relevance**: **Core** = applies to every task · **Area** = when touching that part · **Local** = one feature.
**Durability**: **Durable** = holds until the product's purpose changes · **Volatile** = names the condition that would change it.
Date = when last decided or confirmed.

## Core
| Date | Decision | Durability |
|---|---|---|
| 2026-10-03 | Everything runs in Docker; nothing installed on the host. Versions pinned exactly; no lockfiles (`skills-lock.json` records skill provenance and stays). | Durable |
| 2026-10-09 | The owner runs `docker compose up --watch`. Check it's running before debugging; leave containers to the owner. | Durable |
| 2026-10-03 | Effects-free React: loaders, TanStack Query, `useSyncExternalStore`, ref callbacks, event handlers (ESLint enforces). | Durable |
| 2026-10-09 | It's a website: native scroll. CSS scroll-snap is fine; nothing listens to wheel or keys. | Durable |
| 2026-10-03 | One light theme; colours only via tokens in `styles.css` (Okabe-Ito data colours excepted); body text ≥ 4.5:1. | Durable |
| 2026-10-04 | The site is audience material. Questions go in `docs/open-questions.md`, presenter notes in `docs/talk-notes.md`. | Durable |
| 2026-10-04 | Check for an established skill or plugin before building by hand, and say which was used. | Durable |
| 2026-10-09 | Evidence: primary sources; the study is named before its number; inferences are worded as inferences; results are never invented. | Durable |
| 2026-10-10 | Docs: this file holds standing decisions; current-state docs (`architecture`, `design`, `content`, `dev-env`, `target`) are updated in the same change as the code. | Durable |
| 2026-10-09 | Scope: change what was asked. When the build and the brief diverge, say so as a question. | Durable |

## Area: stack and infrastructure
| Date | Decision | Durability |
|---|---|---|
| 2026-10-03 | React 19, TanStack Router/Query, Tailwind 4, Vite; FastAPI on Granian; Postgres 18; Alembic (`backend/migrations/`). | Durable |
| 2026-10-03 | TypeScript pinned to 6.0.3. | Volatile: when typescript-eslint supports TS ≥ 6.1 |
| 2026-10-03 | nginx is the edge on :8088 in dev and prod; rate limits and CSP live there. Vite never inlines assets (`assetsInlineLimit: 0`, CSP). | Durable |
| 2026-10-03 | Dev images use `pull_policy: build`; `make lint` lints mounted source in throwaway containers. | Volatile: if Compose gains a working `initial_sync` |
| 2026-10-10 | `make check-intro` runs headless Chromium (Playwright, Docker) against the dev site; it's the ground truth for /intro layout and paging. | Durable |

## Area: design
| Date | Decision | Durability |
|---|---|---|
| 2026-10-03 | Radii: panels 20px, controls 12px, top bar 16px. Every page uses `CONTAINER`. | Durable |
| 2026-10-03 | Motion is the one animation engine. Route changes use View Transitions with types. | Durable |
| 2026-10-03 | Glass: SVG displacement refraction in Chromium, frosted fallback elsewhere. | Volatile: if other engines support SVG backdrop filters |
| 2026-10-03 | Branding: "AI Workflow Habits" / "Workflow Habits". | Durable |

## Area: grad site content (topics, map, tools)
| Date | Decision | Durability |
|---|---|---|
| 2026-10-03 | Scenes carry short lines; three depths (scene, `more`, details + sources); each fact once. Limits enforced by `make check-content`. | Durable |
| 2026-10-05 | Widgets carry a guide (shows, try, point) and a data badge; study/estimate widgets name the study first. Stat scenes carry `study` and `meaning`. | Durable |
| 2026-10-05 | Each topic ends in a takeaway bar (found, do, effort, skip): no new facts. | Durable |
| 2026-10-05 | Navigation is the theme map (`/map`) with "You are here"; topics open with an outline. | Durable |
| 2026-10-05 | Topic 11 numbers come from `make facts`; source previews from `make previews` (no network at runtime). | Durable |

## Local: junior seminar (/intro)
| Date | Decision | Durability |
|---|---|---|
| 2026-10-10 | The talk follows `docs/seminar/brief.md`: a hook into Claude Code on students' own projects; the toolkit demystified; three researched failures; tonight's steps. | Volatile: when the brief changes |
| 2026-10-10 | Editorial poster design (owner's pick after the impeccable audit): 14 screens of 7 kinds (split, diagram, list, ask, answer, do, steps); about 50 words per screen; a test is ask → answer → what we do now. | Volatile: if the talk stops being presenter-paced |
| 2026-10-10 | The context strip, pinned to the bottom of every screen, is the signature and the progress indicator: the talk as one session that grows, dims in the middle (test 1), loses its CLAUDE.md tail (test 2) and starts fresh. | Durable |
| 2026-10-10 | `/intro` has no site chrome (AppShell hides the top bar and backdrop) and uses `STAGE` (full width, 6vw gutters) instead of `CONTAINER`. Flat white ground; artifacts on `sunken` sheets; no ghost cards. | Volatile: if the owner wants `CONTAINER` everywhere (CLAUDE.md rule) |
| 2026-10-10 | Four type sizes scaled by min(vw, vh): statement ≈ 127px, head ≈ 80px, body ≈ 33px, meta ≈ 19px at 1080p; screens fit at 720p. Display above 6rem is deliberate (poster). | Volatile: if the room's screen is known and different |
| 2026-10-10 | Colour jobs: accent = the session segment and the two earned words; warn = the failure numbers and "No"; ink for everything else. | Durable |
| 2026-10-10 | Every audience string lives in `content/intro.ts`; `make check-content` checks it; `make check-intro` checks layout and paging. Snap at ≥ 1024px with `scroll-padding-top: 0`. | Durable |
| 2026-10-10 | Toolkit facts come from the Claude Code docs ("Extend Claude Code", "Cloud environments: what carries over"); recheck before each talk. | Volatile: Claude Code releases |
