# AdminDesk & ClassTrack API 🎓

API backend para gestionar el ecosistema académico y operativo de un instituto educativo. Cuenta con un diseño Modular, dividido en dos dominios principales: **AdminDesk** (gestión académica y comercial) y **ClassTrack** (operaciones diarias, asistencia y rendimiento estudiantil).


## 🚀 Inicio

### Requisitos Previos
- Instalar [Bun](https://bun.sh/)
- Instalar Docker & Docker Compose [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### 1. Instalar Dependencias (Local)
Si planeas ejecutar el proyecto localmente fuera de Docker, instala las dependencias:

```bash
bun install
```

### 2. ⚙️ Configuración de Entornos y Variables
El sistema utiliza **Docker** para ejecutar sus servicios, pero te ofrece dos modalidades de trabajo:
1. **Full Docker:** Dockerizar tanto el backend como la base de datos.
2. **Híbrido (Database-Only):** Dockerizar solo la base de datos y ejecutar el backend localmente de forma nativa.

Para que no existan conflictos de red entre tu máquina y los contenedores, los puertos y dominios cambian. Por ello, debes crear **cuatro archivos de entorno** basándote en las variables declaradas en [`.env.template`](.env.template). 

Aunque todos comparten variables base como `PORT` o `JWT_SEED`, su responsabilidad principal radica en configurar correctamente `DATABASE_URL` y `NODE_ENV`:

* **`.env` (Full Docker - Desarrollo):** Utilizado por Docker Compose para levantar toda el API. 
  * **DATABASE_URL:** Apunta a la red interna de Docker usando el nombre del servicio (ej. *postgresql://user:password@postgres-db-dev:5432/bd_name*).
  * **NODE_ENV:** **development**.

* **`.env.local` (Híbrido - Desarrollo):** Utilizado cuando desarrollas corriendo Bun en tu terminal, atacando al contenedor de la BD expuesto a tu SO.
  * **DATABASE_URL:** Apunta a tu máquina local y al puerto expuesto (ej. *postgresql://user:password@localhost:5433/bd_name*).
  * **NODE_ENV:** **development**.

* **`.env.test` (Full Docker - Testing):** Utilizado para levantar el ecosistema aislado de pruebas dentro de Docker.
  * **DATABASE_URL:** Apunta al contenedor de pruebas dentro de la red Docker (ej. *postgres://usuario:password@postgres-db-test:5432/bd_test*).
  * **NODE_ENV:** **test**.
  
* **`.env.test.local` (Híbrido - Testing):** Utilizado cuando ejecutas los tests de integración localmente (`bun test`), conectándote a la BD de pruebas dockerizada.
  * **DATABASE_URL:** Apunta a `localhost` y al puerto de pruebas (ej. *postgres://usuario:password@localhost:5434/data_base_name_test*).
  * **NODE_ENV:** **test**.

---

## 🚀 Modos de Ejecución y Scripts

Dependiendo del entorno que hayas elegido arriba, ejecuta la aplicación usando los scripts de nuestro `package.json`.

### Opción A: Full Docker (Recomendado)
Levanta todo el ecosistema (PostgreSQL y el backend Bun) en contenedores. Garantiza consistencia total.

* **Modo Desarrollo:** Levanta la BD y el servidor, leyendo automáticamente el archivo .env

    ```bash
    bun run docker:dev
    ```

* **Modo Testing:** Levanta la BD y el servidor, leyendo automáticamente el archivo .env.test (es de un solo uso, no persiste datos)

    ```bash
    bun run docker:test
    ```

* **Limpiar el entorno:** bun run docker:down o bun run docker:down:test para eliminar redes y contenedores.

### Opción B: Híbrido (Database-only)
Si prefieres la velocidad del runtime nativo en tu máquina para depurar más rápido, pero quieres mantener la base de datos contenida para no ensuciar tu SO.

1. Levantar únicamente la Base de Datos:
Debes inicializar el servicio de BD explícitamente desde Docker Compose:
   * **Para desarrollo:**
        ```bash
        docker compose -f docker-compose-dev.yml up postgres-db-dev -d
        ```
   * **Para testing:** (asegúrate de levantar la base de datos correcta según tu docker-compose-test.yml)
        ```bash
        docker compose -f docker-compose-test.yml up postgres-db-test -d
        ```
2. Ejecutar el Backend o Tests Localmente:
Una vez las bases de datos están listas en el fondo, utiliza los scripts locales. Estos inyectan el flag --env-file para forzar a Bun a ignorar su comportamiento por defecto y conectarse a los puertos localhost:

    * **bun run dev:local:** Inicia el entorno de desarrollo leyendo .env.local.
    * **bun run test:local:** Ejecuta las pruebas de integración con bun:test, leyendo .env.test.local.
    * **bun run test:coverage:local:** Genera el reporte de cobertura leyendo las credenciales locales de prueba.

---

## 🛠️ Tecnologías Utilizadas

Este proyecto está construido centrándose el tipado estricto, el alto rendimiento y las buenas prácticas de código:

- **Runtime & Package Manager:** [Bun](http://bun.com) (v1.3+)
- **Language:** TypeScript
- **Architecture:** Clean Architecture & Screaming Architecture
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize (via `sequelize-typescript`)
- **API Documentation:** Swagger UI

**Nota:**
> Recuerda: Gracias a la arquitectura se puede cambiar de base de datos sin afectar el resto del proyecto.
> Solo se debería modificar la capa de infraestructura e inyectar las dependencias correspondientes en cada módulo.
> Por lo tanto, si en el futuro desea cambiar de base de datos (por ejemplo, a MongoDB),
> no será necesario modificar las capas de dominio o aplicación.

## 📂 Project Structure

The source code follows the Screaming Architecture pattern, making the business features immediately visible:
- `src/app/AdminDesk/` - Core features for student enrollment, contracts, and module catalogs.
- `src/app/ClassTrack/` - Core features for daily attendance check-ins, lesson logs, and retention alerts.
- `src/app/Shared/` - Transversal domains (e.g., Identity and Authentication).
- `src/core/` - Global infrastructure, server configuration, and environment setup.

## 📝 Documentación

📝 **Arquitectura y Diseño del Proyecto:**
[architecture.md](docs/architecture.md)

📝 **Documentación y ejemplo del flujo de trabajo en:**
[workflow.md](docs/workflow.md)

📝 **Documentación de los endpoints de la API:**
[AdminDesk](docs/admin-desk/admin-desk-endpoints.md)

