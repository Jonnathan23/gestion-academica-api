# ---- Base Stage ----
FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lockb ./

# ---- Development Stage ----
FROM base AS development
# Install all dependencies (including devDependencies)
RUN bun install
COPY . .
# Start development server with hot-reload
CMD ["bun", "run", "dev"]

# ---- Testing Stage ----
FROM base AS testing
RUN bun install
COPY . .
# We don't define a CMD here usually, as we pass it via docker-compose
# but we can set a default test command
CMD ["bun", "run", "test"]

# ---- Production Stage ----
FROM base AS production
# Install ONLY production dependencies
RUN bun install --production
COPY . .
# Start the production-ready server
CMD ["bun", "run", "start"]