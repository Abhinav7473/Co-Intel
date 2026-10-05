# Architecture

## Request path
Browser → nginx :8088 → `/api/*` → Granian (FastAPI) → Postgres 18.
Dev: nginx proxies everything else to Vite (HMR). Prod: nginx serves the built SPA from its own image.
`/api/setup-audits` allows 512 KB bodies (pasted memory files); everything else 32 KB.

## Routes (`frontend/src/router.tsx`)
| Path | Page | Purpose |
|---|---|---|
| `/` | `features/home/HomePage` | Hero with context scrubber, status, topic hub, tools, sources |
| `/topics/$slug` | `features/topic/TopicPage` | One topic: header, scroll-linked scenes, your entries, prev/next |
| `/audit`, `/audit/$id` | `features/audit/*` | Paste setup → live report → save; saved report + diff vs previous |
| `/assess` | `features/assess/AssessPage` | 18 questions by topic → radar, fixes, history |
| `/experiments`, `/experiments/$id` | `features/experiments/*` | Templates → A/B experiment → logged runs → comparison |
| `/kb` (`?topic=`) | `features/kb/KnowledgePage` | Entries (finding/source/question/note) by topic, search, pin |

Loaders prefetch with `ensureQueryData`; components read via hooks in `hooks/`. Topic changes run through the
View Transitions API with types (see `docs/design.md`).

## Frontend (`frontend/src`)
| Folder | Holds |
|---|---|
| `content/` | Data only: `brief.ts` (topics), `deck.ts` (scenes), `data.ts` (widget datasets), `assessment.ts`, `experiments.ts`, `tools.ts` |
| `features/<page>/` | One folder per route group; pure logic next to it (`audit/analyze.ts`, `experiments/compare.ts`) |
| `features/widgets/` | Interactive explainers used inside topic scenes, registered by id |
| `shell/` | `AppShell` (backdrop, top bar, `Page` frame), `TopBar`, `layout.ts` |
| `ui/` | Shared primitives: `LiquidGlass`, `Panel`, `Button`, `Segmented`, `Toggle`, `Slider`, `Spotlight`, `FlowPaths`, `charts/` |
| `hooks/` | Query hooks per resource + `useElementSize` |
| `api/` | `client.ts`, `queries.ts`, `types.ts` (mirror of backend schemas) |

The setup audit runs entirely in the browser (`audit/analyze.ts`); the API stores input + report.

## Backend (`backend/app`)
Every feature folder has `models.py` + `schemas.py` + `router.py`.
- `entries` — knowledge base (replaced `notes`; migration copied notes in as kind `note`)
- `setup_audits` — setup JSONB + report JSONB + score
- `assessments` — answers + per-topic scores + overall
- `experiments` — experiments + `experiment_runs` (cascade delete)
- `board`, `checklist`, `audit` (anonymous mistakes poll) — used by topic widgets
`core/limits.py` caps every table (no auth). Client keys are `Slug`s; pydantic models use `extra="forbid"`.

## Database & migrations
`backend/migrations/versions/` (folder renamed from `alembic/`). Applied by the container entrypoint.
New migration: change a model → `make revision m="..."`. Data moves need hand-written migrations (see b7e2a91c4d10).
