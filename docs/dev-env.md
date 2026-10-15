# Dev environment

## Commands
| Do | Command |
|---|---|
| Run dev (hot reload) | `docker compose up --watch` |
| Run prod images | `docker compose --profile prod up --build db api proxy` |
| Lint everything | `make lint` (ESLint, tsc, Ruff, content check) |
| Check copy limits | `make check-content` |
| Check /intro in a real browser | `make check-intro` (headless Chromium in Docker; screenshots in `.shots/`) |
| Preview the Vercel build | `make static` (http://localhost:4173, no API, data in browser storage) |
| Format backend | `make fmt` |
| New migration | `make revision m="..."` |
| Backup / restore | `make backup` · `make restore f=backups/<file>.sql` |
| DB shell | `make psql` |

## How watch behaves (read before debugging "my change isn't showing")
- Watch syncs files changed **after** start. Dev images use `pull_policy: build`, so every `up` rebuilds
  them from cache and the containers start from current files. Without that, edits made while the stack
  was down are silently missing.
- `package.json` / `requirements*.txt` changes trigger an image rebuild; `vite.config.ts` restarts Vite.
- `backend/migrations/` is a bind mount (two-way) so generated migrations land in the repo.
- Compose 2.38 quirk: a rebuild of one service plus a sync to another in the same instant can leave
  `api-dev` stopped. Fix: `docker compose start api-dev`.
- `initial_sync` is not supported by Compose 2.38 (schema rejects it).

- The owner runs the watch. A `package.json` change rebuilds `web-dev` and can stop `api-dev` (quirk above).

## Linting
`make lint` runs in throwaway containers with your source mounted. Never lint with `exec` into a running
container: that checks the container's copy, which can be stale.

## No host installs
Your editor shows unresolved imports (no `node_modules` locally). Types are checked by `make lint`.

## Deploy (Vercel, frontend only)
`vercel.json` at the root builds `frontend/` with `VITE_BACKEND=local` and serves `frontend/dist` with an SPA rewrite.
Import the repo in Vercel and leave Root Directory as the repo root. Security headers are copied from
`infra/nginx/prod.conf`: change both together. `content/build-facts.json` and `previews.json` are committed build
inputs, so run `make facts` / `make previews` and commit before deploying.
