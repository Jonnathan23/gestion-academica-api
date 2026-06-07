# Etapa 1: Base (Configuración compartida)
FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lock ./

# Etapa 2: Desarrollo
FROM base AS development
RUN bun install
COPY . .

CMD ["bun", "run", "dev:api"]


# Etapa 3: Testing
FROM base AS testing
RUN bun install
COPY . .

CMD ["bun", "run", "test"]


# Etapa 4: Producción
FROM base AS production

RUN bun install --production
COPY . .

CMD ["bun", "run", "src/app.ts"]