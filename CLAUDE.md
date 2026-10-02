# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the server with nodemon (auto-restart on changes)
- `node index.js` — start the server directly
- Server runs on port 3000
- No test suite is configured (`npm test` is a placeholder that exits with an error)
- No lint/format tooling is configured

## Architecture

This is a minimal single-file Express.js API (`index.js`) with no routing/controller/model separation — all routes, middleware, and DB setup live directly on the `app` instance in one file.

- **Storage**: `better-sqlite3`, synchronous and file-based. The `tasks` table (`id`, `title`) is created on startup via `CREATE TABLE IF NOT EXISTS`. The DB file `tasks.db` is created automatically at the project root on first run and is git-ignored — it persists across restarts, unlike an in-memory store.
- **Routes**: full CRUD on `/tasks` (`GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`), plus two unrelated demo routes (`GET /hello`, `GET /bye`).
- **Validation**: `title` must be a non-empty string after trimming; invalid input returns `400` before touching the database (see POST/PUT handlers).
- **Error handling**: a global error-handling middleware (last `app.use`) logs the stack server-side and returns a generic `500` — route handlers should let errors propagate rather than catching and formatting them individually.
- **Logging**: a request-logging middleware logs `METHOD URL` for every incoming request.
- **Express 5**: errors thrown (or rejected promises) in route handlers reach the global error handler automatically — no `try/catch` or `next(err)` needed. Keep the error handler registered after all routes.
- **Responses**: errors are sent as plain-text strings via `res.send` (not JSON); successful task responses are the DB row objects. Note `title` is validated after trimming but stored untrimmed.

## Repo notes

- `recap/` and `roadmap/` hold PDF learning materials (this is a learning project), not code or docs about the API.
- `package-lock.json` is the tracked lockfile; use `npm`. An untracked `pnpm-lock.yaml` exists but isn't part of the project.

This is a git repository.
