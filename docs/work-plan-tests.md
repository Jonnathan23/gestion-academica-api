# Plan de Trabajo: Cobertura de Pruebas

Tras analizar el reporte de cobertura (`bun run test:coverage`), la cobertura actual de la aplicación se sitúa en un **81.18% de líneas** y **67.22% de funciones**. Se ha detectado 1 test fallido y varias áreas (especialmente en `class-track`) que carecen de cobertura de integración.

A continuación se detalla el plan de trabajo sugerido, organizado por módulos y nivel de prioridad.

## Prioridad 0: Reparar Tests Fallidos

1. **Class Track - AttendanceSession Router**
    - **Archivo:** `src/app/class-track/feats/attendance/presentation/__tests__/attendanceSession.router.integration.test.ts`
    - **Fallo:** `[201] Valid payload should create an IN_PROGRESS session`
    - **Causa:** El test esperaba el mensaje `"Check-in successful"` pero el backend responde con `"Student check-in successful"`.
    - **Acción:** Actualizar el string esperado en el test para que coincida con la respuesta real del servidor.

## Prioridad 1: Módulos con Cobertura Nula (0%)

Estos módulos son funcionalidades que actualmente carecen de pruebas o tienen una cobertura mínima. Se deben priorizar ya que son features de negocio clave.

### 1. Retention Alerts (`src/app/class-track/feats/retention-alerts/`)

Casi todo el flujo de _Retention Alerts_ está en 0%.

- **Endpoints a probar:** `retentionAlert.routes.ts`
- **Casos de Uso involucrados:** `changeRetentionAlertStatus`, `getRetentionAlerts`, `updateRetentionAlert`
- **Acción:** Utilizar el skill `create-test` para generar la suite de pruebas de integración completa (`retentionAlert.router.integration.test.ts`), cubriendo la creación, actualización y obtención de alertas, así como las políticas de RBAC correspondientes.

### 2. Dashboard (`src/app/class-track/feats/dashboard/`)

- **Endpoints a probar:** `dashboard.router.ts`
- **Casos de Uso involucrados:** `getDashboardSummary`
- **Acción:** Crear suite de tests de integración para validar la correcta agregación de datos en el resumen del dashboard, incluyendo validación de tokens y permisos.

### 3. Attendance - Lesson Log (`src/app/class-track/feats/attendance/`)

- **Endpoints a probar:** `lessonLog.router.ts`
- **Casos de Uso involucrados:** `registerLessonLog`
- **Acción:** Crear tests de integración específicos para el registro de bitácoras (Lesson Logs) y validación de estudiantes ausentes (`absentStudent.mapper`).

## Prioridad 2: Casos de Uso y Rutas Parciales (Baja Cobertura)

### 1. Class Track - Core Students (`src/app/class-track/core/students/`)

- Falta cobertura en los endpoints de búsqueda y en el caso de uso `searchStudents`.
- **Acción:** Agregar tests de integración para `student.router.ts` enfocados en validar `SearchStudentDto.dto.ts` y las proyecciones devueltas.

### 2. Admin Desk - Student Levels (`src/app/admin-desk/student-level/`)

- Falta cobertura en `infoStudentsLevel` (Controller, Datasource, Mapper).
- Faltan pruebas para los casos de uso: `blockLevel`, `unlockLevel`, `getStudentTimeline`, `searchStudents`.
- **Acción:** Extender los tests de integración actuales o crear nuevos para abarcar estos flujos específicos de bloqueos de niveles y líneas de tiempo.

### 3. Admin Desk - Students (`src/app/admin-desk/students/`)

- Caso de uso faltante de cobertura: `getAllStudents.use-case.ts`.
- **Acción:** Incluir pruebas para la obtención global de estudiantes en `students.router.integration.test.ts`.

## Próximos Pasos

Para ejecutar este plan te sugiero los siguientes pasos en orden:

1. Corregir el test fallido de `attendanceSession`.
2. Usar el comando `/goal` o indicar a tu agente: _"Crea las pruebas de integración para el módulo de Retention Alerts"_ (utilizará el skill `create-test`).
3. Repetir el paso anterior con `Dashboard` y `Lesson Log`.
4. Ejecutar nuevamente `bun run test:coverage` para re-evaluar el porcentaje global de cobertura.
