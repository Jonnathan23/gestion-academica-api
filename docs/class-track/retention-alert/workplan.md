# Workplan Backend: Centro de Retención (Retention Alerts)

## 1. Endpoints Necesarios

Basado en la vista `RetentionCenterView.tsx`, necesitamos los siguientes endpoints:

1. **`GET /api/class-track/retention-alerts`**
   - **Propósito:** Obtener el listado de alertas de retención. Debe permitir filtrar por estado (`PENDING`, `RESOLVED`, `CLOSED_FROZEN`) para alimentar ambas tablas (Alertas Activas e Historial).
   - **Query Params:** `status` (opcional, enum), `page`, `limit`.

2. **`PATCH /api/class-track/retention-alerts/:id`**
   - **Propósito:** Actualizar una alerta existente cuando el asesor la gestiona en el modal.
   - **Body:** `contactDate`, `hasResponded`, `isJustified`, `justificationReason`, `returnDeadline`.

## 2. Métodos a Crear y Reutilizar

### A Crear:
- `RetentionAlertRepository.getAlerts(filters)`: Obtener alertas con información del estudiante cruzada.
- `RetentionAlertRepository.updateAlert(id, data)`: Actualizar los campos de una alerta.

### A Reutilizar:
- `StudentClassTrackRepository` (ubicado en `src/app/class-track/core/students`): Para obtener datos y validaciones del estudiante sin romper la arquitectura ni depender del módulo Admin Desk. Cuenta con métodos útiles como `findStudentWithLevelActive(studentId)` o `searchStudents(dto)`.
- El cronjob/fantasma del módulo `performance` o `attendance` que cuenta los días de ausencia (`at_se_total_minutes` o faltas) debería ser el encargado de CREAR estas alertas de retención automáticamente cuando `re_al_days_absent` alcanza ciertos umbrales. *Nota: Este workplan se enfoca en la gestión, la creación se asume delegada al proceso background.*

## 3. Proyecciones (Inner Joins)

Para evitar múltiples llamadas desde el frontend, el método `GET` debe retornar una proyección que incluya los datos del estudiante:

**`RetentionAlertWithStudentProjection`**
- Datos de Alerta: `id`, `contactDate`, `hasResponded`, `daysAbsent`, `isJustified`, `justificationReason`, `returnDeadline`, `status`.
- Datos del Estudiante (Inner Join con tabla `Students`): `id`, `fullName`, `identificationCard`, `phoneNumber`, `contractStatus`.

## 4. DTOs

- **`GetRetentionAlertsDto`:** Valida parámetros de query (`status` opcional).
- **`UpdateRetentionAlertDto`:**
  - `contactDate`: Date (opcional)
  - `hasResponded`: Boolean
  - `isJustified`: Boolean
  - `justificationReason`: String (obligatorio si `isJustified` es true)
  - `returnDeadline`: Date (opcional)
  - *Lógica interna:* Si `hasResponded` es true, el status podría cambiar a `RESOLVED` automáticamente en la lógica de negocio o requerir un campo `status` explícito en el DTO.

## 5. Entidades

- **`RetentionAlertEntity`:** Mapeo directo de la tabla `RetentionAlerts` pura.
- **`RetentionAlertWithStudentEntity` (Proyección):** Entidad enriquecida para el retorno del listado hacia la vista, combinando `RetentionAlerts` y los datos resumidos de `Students`.

## 6. Casos de Uso (Application Layer)

- **`GetRetentionAlertsUseCase`:** Recibe `GetRetentionAlertsDto`, invoca al repositorio y retorna un array de `RetentionAlertWithStudentEntity`.
- **`UpdateRetentionAlertUseCase`:** Recibe `id` y `UpdateRetentionAlertDto`. Valida la existencia de la alerta, aplica reglas de negocio (ej. cambio de estado a `RESOLVED` si se cumplieron condiciones) e invoca la actualización en el repositorio.
