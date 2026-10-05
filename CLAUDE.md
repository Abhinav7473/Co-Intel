# AI Workflow Habits — project core

A website + toolkit for the research brief "AI Workflow Habits": topics explain, tools apply them to
your own setup (audit, self-assessment, experiments, knowledge base). Single user, no login.
This file holds only rules that get broken without being told. Detail lives in `docs/`.

## Rules
- Everything runs in Docker. Never install packages on the host (no venv, no node_modules, no lockfiles).
- Dev = `docker compose up --watch` from the root, served on :8088. Do not add steps to that.
- No `useEffect` / `useLayoutEffect` / `useInsertionEffect` (ESLint enforces). Use route loaders,
  TanStack Query, `useSyncExternalStore`, ref callbacks, event handlers, Motion values.
- It is a **website**: native scroll only. Never hijack wheel or keys.
- One light theme. Colours only via tokens in `styles.css` (accent, warn, caution, series-b). No raw hex in components
  except Okabe-Ito data colours. Body text must stay ≥ 4.5:1 contrast.
- Radii: panels 20px, controls 12px, top bar 16px. Every page uses `CONTAINER` (`shell/layout.ts`).
- Scenes carry short lines; long text goes in `details`. Run `make check-content` after editing copy.
- The website is audience material for a talk. Never use it to communicate with the owner: no notes, questions,
  plans or "for you" copy in the site. Questions and gaps go in `docs/open-questions.md`; presenter notes in `docs/talk-notes.md`.
- Before building anything by hand, check for an established skill/plugin that does it (and say which you used).
  Installed community skills: `.claude/skills/` (symlinks into `.agents/skills/`, provenance in `skills-lock.json`).
  For UI work load `frontend-design`, `design-taste-frontend`, `emil-design-eng`; review with `web-design-guidelines`.
- Pin dependency versions exactly. TypeScript stays < 6.1 until typescript-eslint supports 7.

## Where things are (read only when the task needs it)
- `docs/architecture.md` — routes, folders, data flow, API, tables, migrations
- `docs/design.md` — palette, knobs, glass, motion and transition types, component sources
- `docs/content.md` — topics/scenes model, assessment questions, experiment templates, audit rules, copy limits
- `docs/dev-env.md` — Docker/watch behaviour, lint, backups, known Compose quirks
- `docs/target.md` — where it's heading next and which outside libraries to use
- `docs/open-questions.md` — questions for the owner and known gaps (read at session start; add, don't ask in the site)
- `docs/decisions.md` — append-only log of decisions and rejected options. Look things up; don't load it whole.

## Editing this system
Edit these files between sessions, by small deltas. Add a decision to the log instead of a new rule here
unless the rule is broken repeatedly.
