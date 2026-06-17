# Endpoint Structure: Lesson Logs

## `POST /api/class-track/lesson-log/`

- **Description**: Crea de manera atómica entre 1 y 3 registros de lecciones (`LessonLogs`) vinculados a una sesión de asistencia en curso (`AttendanceSession`).
- **Body**: `CreateLessonLogsDto`
- **Response**: `SuccessResponse<LessonLogEntity[]>`

## `GET /api/class-track/lesson-log/student/:studentId/last`

- **Description**: Obtiene el registro de lección más reciente de un estudiante específico, buscando su historial de sesiones de asistencia y ordenando por la fecha de creación del registro. Útil para conocer el estado y la lección en la que quedó el alumno la última vez.
- **Params**:
    - `studentId` (string, UUID): Identificador único del estudiante.
- **Response**: `SuccessResponse<LessonLogEntity>` (Si no existe arroja un error 404 NotFound).

_(Nota: En el `AppRouter`, la ruta base se define como `/lesson-log`, por lo tanto los endpoints completos típicamente empiezan con `.../api/lesson-log/` o según el prefijo del enrutador principal)_
