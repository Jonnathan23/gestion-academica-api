# Etapa 1: Base (Configuración compartida)
FROM oven/bun:1 AS base
WORKDIR /app
COPY package.json bun.lockb ./

# Etapa 2: Desarrollo
FROM base AS development
RUN bun install
COPY . .
# Llamamos al script optimizado para Docker
CMD ["bun", "run", "dev:docker"]


# Etapa 3: Testing

FROM base AS testing
RUN bun install
COPY . .
# En el Docker compose de test, podemos sobreescribir el comando a test:docker
CMD ["bun", "run", "test:docker"]


# Etapa 4: Producción
FROM base AS production
# Instalamos SOLO las dependencias necesarias para producción
RUN bun install --production
COPY . .
# Ejecutamos el archivo principal directamente
CMD ["bun", "run", "src/app.ts"]