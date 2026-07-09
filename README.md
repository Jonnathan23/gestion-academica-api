# Gestión Académica API

API para la gestión académica, construida con TypeScript y utilizando los principios de Clean Architecture. Provee los servicios necesarios para la administración de estudiantes, contratos, módulos y pagos de la institución.

## Instalación de dependencias

```bash
pnpm install
```

## Habilitar Husky

```bash
pnpx husky install
```

_(Normalmente se ejecuta automáticamente al instalar las dependencias si existe un script `prepare`)_

## Crear envs

Copia el archivo de plantilla para crear tus archivos de variables de entorno:

```bash
cp .env.template .env.local
cp .env.template .env.test
```

---

## Scripts de Utilidad (Testing y Clean Code)

**Testing:**

- `bun run test`: Ejecuta la suite de pruebas.
- `bun run test:coverage`: Ejecuta las pruebas y muestra el reporte de cobertura.
- `bun run test:local`: Ejecuta las pruebas utilizando las variables de entorno de `.env.test.local`.
- `bun run test:coverage:local`: Ejecuta pruebas con reporte de cobertura para el entorno local.

**Clean Code (Linting y Formateo):**

- `bun run lint`: Ejecuta ESLint en el código TypeScript (`src/**/*.ts`).
- `bun run lint:fs`: Verifica convenciones de nombres de archivos con `ls-lint`.
- `bun run lint:editorconfig`: Revisa el cumplimiento de las reglas de `.editorconfig`.
- `bun run lint:fix`: Intenta corregir automáticamente los problemas detectados por ESLint.
- `bun run format`: Formatea el código fuente utilizando Prettier.
- `bun run typecheck`: Verifica los tipos de TypeScript sin emitir código compilado.

---

## Base de datos

### Iniciar base de datos

Para iniciar la base de datos debes tener docker instalado y luego ejecutar el siguiente comando:

```bash
docker compose --env-file .env.local -f docker-compose.prod.yml up --build
```

### Base de datos para pruebas

Para iniciar la base de datos de test debes tener docker instalado y luego ejecutar el siguiente comando:

```bash
docker compose --env-file .env.test -f docker-compose.test.yml up --build
```
