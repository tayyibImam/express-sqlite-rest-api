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

This is a git repository.
