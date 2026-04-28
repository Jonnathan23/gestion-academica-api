# Estructura de Base de Datos (SALC)

Este documento describe la arquitectura de persistencia del backend, detallando la configuración del motor de base de datos, el mapeo objeto-relacional (ORM) y el diccionario de datos para cada módulo del sistema.

**Tecnologías Utilizadas:**
- **Motor:** PostgreSQL 17
- **ORM:** Sequelize TypeScript (sequelize-typescript)

---

## Configuración de Conexión

La gestión de la conexión se centraliza en la clase `DatabaseConnection`, la cual encapsula la instancia de Sequelize y maneja el ciclo de vida de la base de datos.

```typescript
export class DatabaseConnection {
    private readonly sequelizeInstance: Sequelize;
    private readonly forceSynchronization: boolean;

    constructor(options: DatabaseConnectionOptions) {
        const { databaseUrl, enableLogging = false, forceSynchronization = false } = options;

        this.sequelizeInstance = new Sequelize(databaseUrl, {
            models: [
                User,
                Student, Module, StudentModule, PaymentPlan, PaymentQuota,
                AttendanceSession, RetentionAlert, LessonLog,                
            ],
            logging: enableLogging
        });

        this.forceSynchronization = forceSynchronization;
    }

    async connect(): Promise<void> {
        try {
            await this.sequelizeInstance.authenticate();
            // Sincronización controlada por el flag forceSynchronization
            await this.sequelizeInstance.sync({ force: this.forceSynchronization });
        } catch (error) {
            console.error('Error connecting to the database', error);
        }
    }
}
```

### Lógica de Sincronización
La sincronización de esquemas se maneja mediante el flag `forceSynchronization`. En entornos de desarrollo, este flag puede estar activo para reflejar cambios rápidos en los modelos, mientras que en producción se desactiva para preservar la integridad de los datos. El valor de este flag se deriva usualmente de la variable de entorno `NODE_ENV`.

---

## Esquema de Datos por Módulo

### Módulo: Shared (Identidad y Transversales)

#### Tabla: `Users`
Almacena la información de los usuarios del sistema, incluyendo personal administrativo y docentes.

| Columna | Tipo de Dato (Postgres) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `us_id` | UUID | PK, Unique, Not Null | Identificador único del usuario. |
| `us_full_name` | VARCHAR(255) | Unique, Not Null | Nombre completo del usuario. |
| `us_email` | VARCHAR(255) | Unique, Not Null | Correo electrónico institucional. |
| `us_password_hash` | VARCHAR(255) | Not Null | Hash de la contraseña. |
| `us_role` | ENUM | Not Null | Rol (ADMIN, TEACHER, ADVISOR, ACADEMIC_DIRECTOR). |
| `us_is_active` | BOOLEAN | Not Null, Default: true | Estado de actividad del usuario. |
| `us_created_at` | TIMESTAMPTZ | Not Null | Fecha de creación del registro. |
| `us_updated_at` | TIMESTAMPTZ | Not Null | Fecha de última actualización. |

**Relaciones:**
- **1:N con `StudentModules`**: Un asesor puede vender múltiples módulos.
- **1:N con `AttendanceSessions`**: Un docente puede supervisar múltiples sesiones.
- **1:N con `RetentionAlerts`**: Un asesor gestiona múltiples alertas de retención.

---

### Módulo: AdminDesk (Gestión Académica)

#### Tabla: `Students`
Contiene la información maestra de los estudiantes inscritos.

| Columna | Tipo de Dato (Postgres) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `st_id` | UUID | PK, Unique, Not Null | Identificador único del estudiante. |
| `st_identification_card` | VARCHAR(255) | Unique, Not Null | Cédula o DNI del estudiante. |
| `st_full_name` | VARCHAR(255) | Not Null | Nombre completo. |
| `st_phone_number` | VARCHAR(255) | Not Null | Teléfono de contacto. |
| `st_email` | VARCHAR(255) | Unique, Not Null | Correo electrónico personal. |
| `st_date_of_birth` | DATE | Not Null | Fecha de nacimiento. |
| `st_nationality` | VARCHAR(255) | Not Null | País de origen. |
| `st_certificate_type` | ENUM | Not Null | Tipo de certificación (ONE_TONNE, TOEFL, etc). |
| `st_start_date` | TIMESTAMPTZ | Not Null | Fecha de inicio del programa. |
| `st_is_graduated` | BOOLEAN | Not Null, Default: false | Indica si completó sus estudios. |
| `st_contract_status` | ENUM | Not Null | Estado del contrato (ACTIVE, FROZEN, INACTIVE). |
| `st_progress_category` | ENUM | Not Null | Categoría de avance (FAST, MODERATE, SLOW). |

---

#### Tabla: `Modules`
Catálogo de módulos académicos disponibles.

| Columna | Tipo de Dato (Postgres) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `mo_id` | UUID | PK, Unique, Not Null | Identificador del módulo. |
| `mo_name` | VARCHAR(255) | Unique, Not Null | Nombre del módulo. |
| `mo_description` | VARCHAR(255) | Not Null | Descripción breve del contenido. |

---

#### Tabla: `StudentModules`
Tabla de rotura que vincula estudiantes con sus módulos adquiridos.

| Columna | Tipo de Dato (Postgres) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `st_mod_id` | UUID | PK, Unique, Not Null | Identificador de la inscripción al módulo. |
| `st_mod_student_id` | UUID | FK (Students), Not Null | Referencia al estudiante. |
| `st_mod_module_id` | UUID | FK (Modules), Not Null | Referencia al módulo. |
| `st_mod_seller_id` | UUID | FK (Users), Not Null | Referencia al asesor que realizó la venta. |
| `st_mod_status` | ENUM | Not Null | Estado (ACTIVE, APPROVED, LOCKED). |
| `st_mod_purchase_date` | TIMESTAMPTZ | Not Null | Fecha de adquisición. |

---

#### Tabla: `PaymentPlans`
Registra los acuerdos de pago de los estudiantes.

| Columna | Tipo de Dato (Postgres) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `pp_id` | UUID | PK, Unique, Not Null | Identificador del plan. |
| `pp_student_id` | UUID | FK (Students), Not Null | Estudiante titular del plan. |
| `pp_seller_id` | UUID | FK (Users), Not Null | Asesor que generó el plan. |
| `pp_enrollment_fee` | DECIMAL(10,2) | Not Null, Default: 0 | Costo de matrícula. |
| `pp_total_amount` | DECIMAL(10,2) | Not Null | Monto total del plan. |
| `pp_is_single_payment` | BOOLEAN | Not Null | Indica si es pago de contado. |
| `pp_status` | ENUM | Not Null | Estado (PENDING, COMPLETED, CANCELLED). |

---

#### Tabla: `PaymentQuotas`
Detalle de las cuotas individuales de un plan de pago.

| Columna | Tipo de Dato (Postgres) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `pq_id` | UUID | PK, Unique, Not Null | Identificador de la cuota. |
| `pq_payment_plan_id` | UUID | FK (PaymentPlans), Not Null | Referencia al plan de pago. |
| `pq_quota_number` | INTEGER | Not Null | Número correlativo de cuota. |
| `pq_payment_method` | ENUM | Nullable | Método de pago (CASH, TRANSFER, etc). |
| `pq_base_amount` | DECIMAL(10,2) | Not Null | Monto base de la cuota. |
| `pq_rollover_debt` | DECIMAL(10,2) | Not Null, Default: 0 | Deuda arrastrada de meses anteriores. |
| `pq_total_expected` | DECIMAL(10,2) | Not Null | Monto total a pagar en el mes. |
| `pq_amount_paid` | DECIMAL(10,2) | Not Null, Default: 0 | Monto efectivamente pagado. |
| `pq_due_date` | DATE | Not Null | Fecha de vencimiento. |
| `pq_status` | ENUM | Not Null | Estado (PENDING, PARTIAL, PAID, OVERDUE). |

---

### Módulo: ClassTrack (Seguimiento de Clases)

#### Tabla: `AttendanceSessions`
Registro de asistencia diaria de los estudiantes.

| Columna | Tipo de Dato (Postgres) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `at_se_id` | UUID | PK, Unique, Not Null | Identificador de la sesión. |
| `at_se_student_id` | UUID | FK (Students), Not Null | Estudiante que asiste. |
| `at_se_teacher_id` | UUID | FK (Users), Nullable | Docente que supervisa. |
| `at_se_session_date` | TIMESTAMPTZ | Not Null | Fecha de la sesión. |
| `at_se_entry_time` | TIMESTAMPTZ | Not Null | Hora de entrada registrada. |
| `at_se_exit_time` | TIMESTAMPTZ | Nullable | Hora de salida registrada. |
| `at_se_total_minutes` | INTEGER | Nullable | Tiempo total de permanencia. |
| `at_se_status` | ENUM | Not Null | Estado (IN_PROGRESS, PENDING_APPROVAL, APPROVED). |

---

#### Tabla: `LessonLogs`
Detalle pedagógico de lo avanzado en una sesión de asistencia.

| Columna | Tipo de Dato (Postgres) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `le_lo_id` | UUID | PK, Unique, Not Null | Identificador del log. |
| `le_lo_attendance_session_id` | UUID | FK (AttendanceSessions), Not Null | Sesión vinculada. |
| `le_lo_lesson_number` | VARCHAR(255) | Not Null | Número de lección impartida. |
| `le_lo_notes` | TEXT | Not Null | Observaciones pedagógicas del docente. |

---

#### Tabla: `RetentionAlerts`
Gestión de alertas para estudiantes en riesgo de deserción.

| Columna | Tipo de Dato (Postgres) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `re_al_id` | UUID | PK, Unique, Not Null | Identificador de la alerta. |
| `re_al_student_id` | UUID | FK (Students), Not Null | Estudiante afectado. |
| `re_al_user_id` | UUID | FK (Users), Not Null | Asesor que gestiona la alerta. |
| `re_al_contact_date` | TIMESTAMPTZ | Not Null | Fecha de contacto. |
| `re_al_has_responded` | BOOLEAN | Not Null, Default: false | Indica si el estudiante contestó. |
| `re_al_days_absent` | INTEGER | Not Null, Default: 0 | Días de ausencia acumulados. |
| `re_al_is_justified` | BOOLEAN | Not Null, Default: false | Indica si la falta es justificada. |
| `re_al_justification_reason` | TEXT | Nullable | Razón de la justificación. |
| `re_al_return_deadline` | TIMESTAMPTZ | Nullable | Fecha pactada de retorno. |
| `re_al_observations` | TEXT | Not Null | Notas sobre la gestión de retención. |
| `re_al_status` | ENUM | Not Null | Estado (PENDING, RESOLVED, CLOSED_FROZEN). |
| `re_al_resolution_date` | TIMESTAMPTZ | Nullable | Fecha de resolución de la alerta. |

---

## Manejo de Excepciones de Persistencia

Los errores generados por Sequelize son interceptados por la clase `SequelizeErrorHandler`, la cual mapea las excepciones técnicas a respuestas HTTP estandarizadas para el cliente.

```typescript
export class SequelizeErrorHandler implements DatabaseErrorHandler {
    public handleDatabaseError(error: unknown): FormattedErrorResponse | null {
        // Violación de restricción de unicidad (Ej: Email duplicado)
        if (error instanceof UniqueConstraintError) {
            return { statusCode: 409, errors: [/*...*/] };
        }

        // Violación de clave foránea (Ej: Eliminar estudiante con pagos)
        if (error instanceof ForeignKeyConstraintError) {
            return { statusCode: 409, errors: [/*...*/] };
        }

        // Error de validación a nivel de modelo (Ej: Campo null no permitido)
        if (error instanceof ValidationError) {
            return { statusCode: 400, errors: [/*...*/] };
        }

        // Error genérico de base de datos o conexión
        if (error instanceof DatabaseError) {
            return { statusCode: 503, errors: [/*...*/] };
        }

        return null;
    }
}
```
