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
`vercel.json` builds `frontend/` with `VITE_BACKEND=local` (data lives in the browser) and serves `frontend/dist`.
`.vercelignore` keeps `backend/` out. Headers mirror `infra/nginx/prod.conf`: change both together.
1. Run `make facts` / `make previews`, commit, then `git push origin main` (Vercel builds what is on GitHub).
2. vercel.com → sign in with GitHub → **Add New… → Project** → import `Abhinav7473/Co-Intel`.
3. Root Directory: leave as `./` (repo root). Framework Preset: leave as detected; `vercel.json` sets "Other".
4. Build / Output / Install overrides: leave all off. `vercel.json` supplies them. No env vars needed.
5. **Deploy**. Wait for the build log to finish (tsc, then vite build).
6. Open the URL, go to `/intro`, then press reload on a deep link (e.g. `/intro`): it must not 404.
7. Optional: Settings → Domains → add your domain and set the DNS record Vercel shows.
8. Redeploys: every push to `main` deploys to production; other branches get preview URLs.
Node is 24.x (Vercel's default; pin it in Settings → Build and Deployment if that changes).
The Vercel Toolbar on preview URLs is blocked by the CSP (`script-src 'self'`); that is expected.
