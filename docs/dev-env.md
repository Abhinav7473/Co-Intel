# Dev environment

## Commands
| Do | Command |
|---|---|
| Run dev (hot reload) | `docker compose up --watch` |
| Run prod images | `docker compose --profile prod up --build db api proxy` |
| Lint everything | `make lint` (ESLint, tsc, Ruff, content check) |
| Check copy limits | `make check-content` |
| Format backend | `make fmt` |
| New migration | `make revision m="..."` |
| Backup / restore | `make backup` · `make restore f=backups/<file>.sql` |
| DB shell | `make psql` |

## How watch behaves (read before debugging "my change isn't showing")
- Watch syncs files changed **after** start. Dev images use `pull_policy: build`, so every `up` rebuilds
  them from cache and the containers start from current files. Without that, edits made while the stack
  was down are silently missing.
- `package.json` / `requirements*.txt` changes trigger an image rebuild; `vite.config.ts` restarts Vite.
- `backend/alembic/` is a bind mount (two-way) so generated migrations land in the repo.
- Compose 2.38 quirk: a rebuild of one service plus a sync to another in the same instant can leave
  `api-dev` stopped. Fix: `docker compose start api-dev`.
- `initial_sync` is not supported by Compose 2.38 (schema rejects it).

## Linting
`make lint` runs in throwaway containers with your source mounted. Never lint with `exec` into a running
container: that checks the container's copy, which can be stale.

## No host installs
Your editor shows unresolved imports (no `node_modules` locally). Types are checked by `make lint`.
