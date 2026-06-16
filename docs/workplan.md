# Fase 1: Implementación de la Identidad Compartida (Capa Core / Middlewares)

**Archivo:** auth.mid.ts

## Acciones:

- Definir la interfaz `StudentTokenPayload` e inyectarla en `AuthRequest`.
- Crear el método estricto `validateStudentJWT` (para uso exclusivo de las rutas de estudiantes).
- Crear el método híbrido `validateSharedAccess` (que intente validar primero al estudiante y luego al docente).

---

# Fase 2: Adaptación de la Autorización Híbrida (Capa Core / Middlewares)

**Archivo:** role.mid.ts

## Acciones:

- Crear el método `requireSharedPermissions`.

**Lógica:** Si existe `request.studentSession`, permite el paso. Si no, aplica la validación estricta de `rolePermissionsMapping` usando el `request.userSession`.

---

# Fase 3: Módulo de Identidad y Verificación (Capa de Presentación - Shared/Auth)

**Archivos implicados:** Tu controlador y enrutador de Autenticación principal (fuera de ClassTrack).

## Acciones:

- Crear un endpoint `GET /verify-user` protegido por `AuthMiddleware.validateJWT`.
- Crear un endpoint `GET /verify-student` protegido por `AuthMiddleware.validateStudentJWT`.

Ambos endpoints simplemente retornarán un `SuccessResponse.ok` si el middleware los deja pasar.

---

# Fase 4: Actualización de la Ruta de Check-Out (Capa de Presentación - ClassTrack)

**Archivo:** attendanceSession.router.ts

## Acciones:

- Modificar la ruta `PATCH /check-out`.
- Aplicar la nueva cadena de middlewares híbridos:
    - `[AuthMiddleware.validateSharedAccess, RoleMiddleware.requireSharedPermissions([systemPermissions.CLASSTRACK_SESSIONS_WRITE])]`.

---

# Fase 5: Blindaje de las Reglas de Negocio (Capa de Aplicación y Dominio)

**Archivos implicados:** EndAttendanceSession.dto.ts y EndAttendanceSessionUseCase.ts.

## Acciones:

- En `attendanceSession.controller.ts`, interceptar quién hace la petición (`studentSession` o `userSession`) y pasarlo al DTO.
- En el Caso de Uso, validar que si el actor es un estudiante, solo pueda manipular la sesión que le pertenece criptográficamente a su token.
