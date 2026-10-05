# AI Workflow Habits

An interactive website for the research brief *AI Workflow Habits*. React + TanStack, FastAPI on Granian, and
Postgres, all in Docker. Nothing is installed on your machine.

```bash
docker compose up --watch
```

Open http://localhost:8088. The UI and the API both hot-reload.

## What each part is for — and its honest status

Nothing here has been used by anyone yet. Each tool was built from a hypothesis, not a request; the "status"
column says what it would take to earn its place.

| Part | Who it's for | When you'd use it | Input → output | Status |
|---|---|---|---|---|
| **Topics** (10 pages) | Lab members after the talk | Looking up why a habit works | — → findings, sources, interactive explainers | Reference. Works. |
| **Setup audit** | People who keep a memory file (CLAUDE.md, project instructions) | When the assistant starts ignoring rules or getting sycophantic | Pasted file + skills + connectors → findings with fixes | Only fits Claude Code/Cursor users. Re-scope to ChatGPT/Claude *project instructions* to fit the lab. |
| **Self-assessment** | Anyone | Once, to pick which habit to adopt first | 18 answers → score per topic + fixes | Questions are mine, unvalidated. Should map 1:1 to the takeaway habits. |
| **Experiments** | People who doubt a claim | When you want your own evidence | A/B runs → comparison | Heavier than anyone will do. Keep one template ("time one real task") or cut. |
| **Knowledge base** | The presenter | Collecting findings while preparing | Notes/sources by topic | Personal tool, not for the audience. |

The real example of an information system is this repository itself: `CLAUDE.md` (the always-on core),
`docs/` (reference read on demand), `docs/decisions.md` (append-only log), `.claude/skills/` (procedures),
`frontend/scripts/check-content.ts` (the deterministic part). Open questions and gaps: `docs/open-questions.md`.

- Rules for anyone (human or agent) working here: [`CLAUDE.md`](CLAUDE.md)
- How it's built: [`docs/architecture.md`](docs/architecture.md) · [`docs/design.md`](docs/design.md) ·
  [`docs/content.md`](docs/content.md) · [`docs/dev-env.md`](docs/dev-env.md)
- Where it's going: [`docs/target.md`](docs/target.md) · why it is the way it is: [`docs/decisions.md`](docs/decisions.md)
