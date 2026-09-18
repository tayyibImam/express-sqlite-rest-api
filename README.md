# Task API

A RESTful task management API built with Node.js and Express, backed by persistent SQLite storage. Built as a hands-on exercise in core backend fundamentals — HTTP semantics, input validation, error handling, and data persistence — rather than a framework-first tutorial project.

## Features

- **Full CRUD** — Create, Read, Update, and Delete tasks via standard REST routes
- **Persistent storage** — data is stored in SQLite and survives server restarts
- **Input validation** — rejects missing, empty, or incorrectly typed input before it reaches the database
- **Correct HTTP status codes** — `200`, `201`, `400`, `404`, and `500` used according to their actual meaning, not defaulted
- **Centralized error handling** — a global error-handling middleware prevents unhandled errors from crashing the server or leaking internal details
- **Custom request logging middleware** — logs the method and URL of every incoming request

## Tech Stack

- **Node.js** — runtime
- **Express** — routing and middleware
- **better-sqlite3** — synchronous, file-based SQL database

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)

### Installation

```bash
git clone https://github.com/tayyibImam/task-api.git
cd task-api
npm install
```

### Running the server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
node index.js
```

The server starts on `http://localhost:3000`. A `tasks.db` SQLite file is created automatically on first run.

## API Reference

| Method | Endpoint     | Description             | Success | Failure                |
| ------ | ------------ | ----------------------- | ------- | ---------------------- |
| GET    | `/tasks`     | List all tasks          | `200`   | —                      |
| GET    | `/tasks/:id` | Get a single task by ID | `200`   | `404` if not found     |
| POST   | `/tasks`     | Create a new task       | `201`   | `400` if title invalid |
| PUT    | `/tasks/:id` | Update a task's title   | `200`   | `400` / `404`          |
| DELETE | `/tasks/:id` | Delete a task           | `200`   | `404` if not found     |

## Example Requests

**Create a task**

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy milk"}'
```

**List all tasks**

```bash
curl http://localhost:3000/tasks
```

**Update a task**

```bash
curl -X PUT http://localhost:3000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy oat milk"}'
```

**Delete a task**

```bash
curl -X DELETE http://localhost:3000/tasks/1
```

## Validation Rules

A task's `title` must be present, a string, and non-empty after trimming whitespace. Requests that fail validation return `400 Bad Request` with a descriptive message, without ever reaching the database.

## Error Handling

Errors thrown inside route handlers are caught by a global error-handling middleware, which logs the underlying error server-side and returns a generic `500` response to the client — preventing raw stack traces or internal file paths from being exposed.

## Project Structure

```
.
├── index.js        # Application entry point — routes, middleware, and DB setup
├── tasks.db         # SQLite database file (auto-generated, git-ignored)
├── package.json
└── .gitignore
```

## License

MIT
