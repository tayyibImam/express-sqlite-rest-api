# AGENTS.md

Single-file Express 5 REST API (`index.js`) backed by `better-sqlite3`. All routes, middleware, and DB setup live in one file — no controllers, models, or routers to navigate.

## Commands

- `npm run dev` — start server with nodemon (auto-restart), port 3000
- `node index.js` — start directly
- `npm test` is a placeholder that exits with error — no test suite, no lint, no formatter
- Use `npm` (package-lock.json is tracked). The untracked `pnpm-lock.yaml` is not part of the project — don't switch to pnpm.

## Architecture

- **Storage**: `better-sqlite3`, synchronous, file-based. `tasks.db` at project root, git-ignored, created on first run. Table `tasks` (`id INTEGER PRIMARY KEY AUTOINCREMENT`, `title TEXT NOT NULL`) via `CREATE TABLE IF NOT EXISTS` at startup.
- **Routes are inconsistently versioned** — check `index.js` before guessing paths:
  - `POST /v1/tasks`, `GET /v1/tasks`, `DELETE /v1/tasks/:id`
  - `GET /v2/tasks` (same query, reshapes rows to `{id, name}`)
  - `GET /tasks/:id`, `PUT /tasks/:id` (unversioned), `GET /tasks-offset`
  - `GET /hello`, `GET /bye` (demo)
- **Pagination**: cursor-style `?after=` (`id > after`, limit 5) on `/v1/tasks` and `/v2/tasks`; offset-style `?page=` on `/tasks-offset`.
- **Validation**: `title` must be a non-empty string after trimming; 400 before any DB access. Stored untrimmed.
- **Error handling**: handlers let errors propagate; the last `app.use` is the error middleware (logs stack, generic 500). Express 5 forwards thrown errors automatically. Register nothing after it.
- **Responses**: errors are plain text via `res.send`, not JSON; successes are DB row objects.

## Gotchas

- **GET /v1/tasks response cache is keyed by nothing**: the first response is cached wholesale (`tasksCache`), so a later `?after=` request still returns the cached first page. POST/PUT/DELETE set `tasksCache = null` to invalidate. `/v2/tasks` is not cached.
- **Idempotency is implemented but in-memory**: `POST /v1/tasks` honors the `idempotency-key` header, replays `{status, body}` from a Map — resets every restart, and a different key re-runs the insert.
- **Express 5 + express.json()**: requests without a JSON Content-Type leave `req.body` undefined, so POST/PUT handlers throw a TypeError → 500 instead of 400. Guard `req.body` if you touch this.
- **String IDs**: `req.params.id` is a string; SQLite coerces for INTEGER comparisons.
- Don't commit `tasks.db`.
- `recap/` and `roadmap/` are PDF learning materials (this is a learning project), not code.

## Related guidance

- `CLAUDE.md` — same overview but its route list predates the /v1//v2 split; trust `index.js`.
- `README.md` — also stale on routes (describes unversioned `/tasks` CRUD).
