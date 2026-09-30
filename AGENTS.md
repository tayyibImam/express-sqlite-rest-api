# AGENTS.md

Single-file Express.js REST API (`index.js`) backed by `better-sqlite3`. All routes, middleware, and DB setup live in one file — no controllers, models, or routers to navigate.

## Commands

- `npm run dev` — start server with nodemon (auto-restart on file changes), port 3000
- `node index.js` — start directly (production)
- `npm test` is a placeholder that exits with error — there is no test suite, no lint, no formatter

## Architecture

- **Storage**: `better-sqlite3` synchronous, file-based. `tasks.db` is created at project root on first run, git-ignored, and persists across restarts. Table `tasks` (`id INTEGER PRIMARY KEY AUTOINCREMENT`, `title TEXT NOT NULL`) is created via `CREATE TABLE IF NOT EXISTS` at startup.
- **Routes**: `/tasks` CRUD plus two unrelated demo routes (`GET /hello`, `GET /bye`).
- **Validation**: `title` must be a non-empty string after trimming; checked before any DB access. Returns `400` on failure.
- **Error handling**: global error middleware (last `app.use`) logs the stack server-side and returns generic `500`. Let errors propagate — do not catch and reformat in handlers.
- **Logging**: middleware logs `METHOD URL` for every request via `console.log`.

## Gotchas

- **Incomplete idempotency code (uncommitted)**: `index.js` has an `idempotencyStore` Map and reads the `idempotency-key` header in `POST /tasks`, but the cached-response branch is empty — it does nothing. Don't treat this as implemented idempotency. The store is in-memory, so it resets on every restart.
- **String IDs**: `req.params.id` is a string; SQLite coerces it for `INTEGER` comparisons, but compare explicitly if correctness matters.
- **Don't commit `tasks.db`**: it's in `.gitignore` and is local state, not source.
- **`app.use((err, req, res, next) => ...)`** is the error handler — it's the last middleware. Adding middleware after it won't catch errors.

## Related guidance

- `CLAUDE.md` — contains the same command/architecture overview; kept in sync manually.