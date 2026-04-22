# AdminDesk & ClassTrack API 🎓

RESTful API backend designed to manage the academic and operational ecosystem of an educational institute. It features a Monolithic Modular design, divided into two main bounded contexts: **AdminDesk** (academic and commercial management) and **ClassTrack** (daily operations, attendance, and student performance).


## 🚀 Getting Started

### Prerequisites
- Install [Bun](https://bun.sh/)
- Install Docker & Docker Compose [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Install Dependencies (Local)
If you plan to run the project locally outside of Docker, install the dependencies:

```bash
bun install
```

### 2. Configure Environment Variables
Copy the ``.env.template`` file to ``.env`` (for development) and ``.env.test`` (for testing). Fill in the required values.

**Note:** If using Docker, ensure your DATABASE_URL points to the container names (e.g., postgres-db-dev) instead of localhost.

---

## 🐳 Running with Docker (Recommended)

We use Docker Compose to guarantee consistent environments across development and testing.

### Development Environment (Backend + Database)
To spin up the entire ecosystem (PostgreSQL database and the Bun backend API) with hot-reloading enabled:

```bash
docker compose -f docker-compose-dev.yml up -d
```

The backend will automatically use the `dev:docker` script and read from the `.env` file.

### Database-Only Mode (Hybrid Approach)
If you prefer to run the backend natively on your machine (e.g., for faster debugging) but still want Docker to handle the database:

```bash
docker compose -f docker-compose-dev.yml up postgres-db-dev -d
```

Once the database is running, you can start your local server using:

```bash
bun run dev:local
```

### Testing Environment (Isolated)
To run the automated test suite in a completely isolated environment that will not affect your development data:

```bash
docker compose -f docker-compose-test.yml up --build
```

This spins up a separate database and runs the `test:docker` script using the `.env.test` file.

### Stopping the Containers
To stop and remove the containers, networks, and volumes for a specific environment:

```bash
docker compose -f docker-compose-dev.yml down
```

---

## 💻 Running Locally (Without Docker)

If you are running the backend directly on your machine (ensure your local database is running or you used the Database-Only Docker command), use the following scripts:

- `bun run dev:local`: Starts the development server with strict CORS, reading from the physical `.env` file.
- `bun run dev:api:local`: Starts the server in API mode (`--api` flag), relaxing CORS for tools like Postman.
- `bun run test:local`: Executes the test suite reading from `.env.test`.

---

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
