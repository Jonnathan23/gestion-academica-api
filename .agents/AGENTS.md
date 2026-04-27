# Repository Guidelines

## Project Structure & Module Organization
This backend uses a modular Clean Architecture layout under `src/`:
- `src/app/Shared/` for cross-cutting features such as Identity.
- `src/app/AdminDesk/` for academic and commercial domains like students, contracts, modules, and payments.
- `src/core/` for shared infrastructure: server bootstrapping, middleware, config, error handling, and utilities.
- `src/data/` for Sequelize models, database configuration, and persistence errors.
- `public/` for static assets and `docs/` for endpoint and workflow documentation.

Keep feature code grouped by layer (`presentation`, `application`, `domain`, `infrastructure`) inside each bounded context.

## Build, Test, and Development Commands
Use Bun for all local work:
- `bun install` - install dependencies.
- `bun run dev` - start the API in watch mode.
- `bun run dev:api` - start in API mode with the `--api` flag.
- `bun start` - run the server once without watch mode.
- `bun test` - run the full test suite.
- `bun test --coverage` - run tests with coverage output.
- `docker compose -f docker-compose-dev.yml up` - start the app and dev database.
- `bun run docker:test` - run the isolated Docker test environment.

## Coding Style & Naming Conventions
TypeScript is strict, path aliases use `@/*`, and the codebase follows K&R brace style with 4-space indentation. Use `camelCase` for variables/functions, `PascalCase` for classes, interfaces, entities, and DTOs. Prefer English names in code and test descriptions. No formatter or linter is configured in the repo, so keep changes consistent with nearby files.

## Testing Guidelines
Tests use `bun:test` and `supertest`. Place unit and integration tests in `__tests__` folders or files named `*.test.ts`. Integration test descriptions should include the HTTP status code, for example `test("[201] ...")`. Follow the existing response contracts: success payloads come from `SuccessResponse`, and errors are returned as `errors[0].message`.

## Commit & Pull Request Guidelines
Recent commits are short, task-focused, and usually written in lowercase Spanish. Match that style when practical, for example `correccion de puertos`. Pull requests should summarize the behavior change, list affected routes or modules, note any `.env` or Docker changes, and include screenshots only when documentation or observable output changes.

## Security & Configuration Tips
Copy `.env.template` to `.env` for development and `.env.test` for tests. Never commit secrets. When running inside Docker, use container hostnames in database URLs instead of `localhost`.
