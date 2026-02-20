# AdminDesk & ClassTrack API 🎓

RESTful API backend designed to manage the academic and operational ecosystem of an educational institute. It features a Monolithic Modular design, divided into two main bounded contexts: **AdminDesk** (academic and commercial management) and **ClassTrack** (daily operations, attendance, and student performance).


## 🚀 Getting Started

### Prerequisites
- Install [Bun](https://bun.sh/)
- Have a running instance of PostgreSQL.

### 1. Install Dependencies

```bash
bun install
```
### 2. Configure Environment Variables

Copy the `.env.template` file to `.env` and fill in the required values.

### 3. Run the server & Available Scripts

We use specific scripts to manage CORS policies and environments efficiently during development:

- `bun run dev`: Starts the development server with strict CORS. It only accepts requests from the configured `FRONTEND_URL`. (Use this when working with the React frontend).

```bash
bun run dev
```

- `bun run dev:api`: Starts the server in API mode by passing the `--api` flag. This relaxes CORS to allow `undefined` origins, which is perfect for testing endpoints using tools like Postman or Insomnia.
```bash
bun run dev:api
```

- `bun run dev:test`: Forces the application to use the `.env.test` file. Useful for manual testing against a separate test database without affecting local development data.
```bash
bun run dev:test
```

- `bun run test`: Executes the automated test suite using Bun's native test runner (it automatically reads the `.env.test` environment).
```bash
bun run test
```

## 🛠️ Tech Stack

This project is built focusing on strict typing, high performance, and clean code practices:
- **Runtime & Package Manager:** [Bun](http://bun.com) (v1.3+)
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize (via `sequelize-typescript`)
- **Architecture:** Clean Architecture & Screaming Architecture
- **API Documentation:** Swagger UI

## 📂 Project Structure

The source code follows the Screaming Architecture pattern, making the business features immediately visible:
- `src/app/AdminDesk/` - Core features for student enrollment, contracts, and module catalogs.
- `src/app/ClassTrack/` - Core features for daily attendance check-ins, lesson logs, and retention alerts.
- `src/app/Shared/` - Transversal domains (e.g., Identity and Authentication).
- `src/core/` - Global infrastructure, server configuration, and environment setup.


## 📝 Documentation

📝 **Comprehensive Documentation & Architecture Planning:**
[View the full project documentation on Notion](https://www.notion.so/Backend-30830f3b03918075bb59eacddfbc1ed1?source=copy_link)

📝 **Comprehensive Database Documentation:**
[View the full database documentation on Notion](https://www.notion.so/Base-de-datos-30b30f3b0391804ca41fd92239fea414?source=copy_link)
