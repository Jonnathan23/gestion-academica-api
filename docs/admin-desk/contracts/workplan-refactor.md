# Plan de Trabajo Backend: Refactorización de Contracts (Admin Desk)

## Objetivo

Delegar la responsabilidad de filtrado, búsqueda y cruce de datos desde el Frontend hacia el Backend. Se crearán endpoints optimizados y proyecciones específicas que limiten el payload y usen funciones nativas de la base de datos (COUNT, exclusiones) para agilizar el sistema.

---

## 1. Proyecciones (Projections)

### 1.1 `StudentSearch.projection.ts`

Proyección ligera utilizada para el buscador (ComboBox) del Frontend.

- **Atributos:**
    - `id` (UUID)
    - `identificationCard` (String)
    - `fullName` (String)
    - `email` (String)
    - `totalEnrolledLevels` (Number): Calculado desde el backend (vía `COUNT` con la tabla `StudentModules` u obtener el tamaño de la relación) para indicar cuántos módulos tiene el alumno.

### 1.2 `StudentTimeline.projection.ts`

Proyección agregada que consolida la vista de progreso al seleccionar un estudiante.

- **Atributos:**
    - `studentInfo`: Objeto con `id`, `fullName`, `phoneNumber`, `startDate`.
    - `enrolledLevels`: Arreglo de contratos activos/completados.
        - `contractId` (`st_mod_id`)
        - `status` (`st_mod_status`)
        - `purchaseDate` (`st_mod_purchase_date`)
        - `module`: `{ moduleId, name, level }`
        - _(Nota: Se ha eliminado la relación con el `seller` por ser innecesaria en la UI de Timeline)._
    - `availableModules`: Arreglo de módulos (`moduleId`, `name`, `level`, `description`) disponibles para Upsell.
        - **Regla de negocio:** El backend deberá devolver **únicamente** los módulos en los que el estudiante **no** esté inscrito actualmente (usando `NOT IN`, subconsultas, etc).

---

## 2. Endpoints Requeridos

### 2.1 Endpoint de Búsqueda

- **Ruta sugerida:** `GET /students/search`
- **Query Params:**
    - `searchTerm` (String): El texto a buscar (por nombre o cédula).
    - `limit` (Number): Default `10` (para no saturar el ComboBox).
- **Controlador/Servicio:** `StudentController` / `StudentService`
- **Comportamiento:** Buscar coincidencias por aproximación (ILIKE en Postgres) y retornar `StudentSearchProjection[]`.

### 2.2 Endpoint de Timeline

- **Ruta sugerida:** `GET /student-levels/student/:studentId/timeline`
- **Path Params:** `studentId` (UUID)
- **Controlador/Servicio:** `StudentLevelController` / `StudentLevelService`
- **Comportamiento:** Retornar la estructura única de `StudentTimelineProjection` con los datos descritos, ejecutando las consultas correspondientes a `Students`, `StudentModules` y `Modules`.

---

## 3. Modificaciones en el Frontend (Resumen para contexto Backend)

- El frontend incluirá el hook `useDebounce` (300ms) para llamar al endpoint de búsqueda.
- En `AccesControl.page.tsx` o similar, se limitará a 10 resultados para el renderizado del ComboBox.
- Se removerán las peticiones masivas de listados totales de módulos y estudiantes.
