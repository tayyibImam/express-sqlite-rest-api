# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the server with nodemon (auto-restart on changes)
- `node index.js` — start the server directly
- Server runs on port 3000
- No test suite is configured (`npm test` is a placeholder that exits with an error)
- No lint/format tooling is configured

## Architecture

This is a minimal single-file Express.js API (`index.js`) with no database — all state lives in an in-memory `tasks` array that resets on every restart. There is no routing/controller/model separation; all routes are defined directly on the `app` instance in one file.

Not a git repository — there is no version control history to consult.
