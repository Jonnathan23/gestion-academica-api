# Domain Structure: Lesson Logs

## Entities

### `LessonLogEntity`

Represents a single lesson log recorded during an attendance session.

- `id` (string): Identificador único del registro de lección (UUID).
- `attendanceSessionId` (string): ID de la sesión de asistencia a la que pertenece este registro.
- `lessonNumber` (string): Número o identificador de la lección impartida durante la sesión.
- `oralPracticeScore` (number | null): Puntuación de la práctica oral (nulo si la lección sigue en progreso o no fue evaluada).
- `isCompleted` (boolean): Indica si el estudiante aprobó el oral practice y completó la lección.
- `createdAt` (Date): Fecha de creación del registro.
- `updatedAt` (Date): Fecha de última actualización del registro.

## DTOs

### `CreateLessonLogsDto`

Data Transfer Object para la creación de 1 a 3 registros de lecciones en una misma petición para una sesión específica.

- `attendanceSessionId` (string, required): ID de la sesión de asistencia sobre la que se están reportando las lecciones.
- `lessonsStudied` (LessonItemDto[], required): Arreglo de lecciones estudiadas (máximo 3).

### `LessonItemDto`

Data Transfer Object secundario usado dentro de `CreateLessonLogsDto` para representar el estado y puntuación de cada lección individual.

- `lessonNumber` (number, required): Número absoluto de la lección impartida.
- `oralPracticeScore` (number | null, optional): Puntuación de la práctica oral (si aplica).
- `isCompleted` (boolean, required): Indica si la lección fue completada.

### `GetLastLessonLogDto`

Data Transfer Object para solicitar la última lección impartida a un estudiante.

- `studentId` (string, required): UUID del estudiante del cual se desea obtener el último registro de lección.

## Interfaces

### `LessonLogDataSource` / `LessonLogRepository`

Define los contratos para interactuar con la base de datos de los registros de lecciones (Lesson Logs).

- `createLessonLogs(dto: CreateLessonLogsDto): Promise<LessonLogEntity[]>`
- `getLastLessonLog(dto: GetLastLessonLogDto): Promise<LessonLogEntity | null>`
