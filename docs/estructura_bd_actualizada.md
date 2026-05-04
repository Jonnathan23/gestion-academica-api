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
            await this.sequelizeInstance.sync({ force: this.forceSynchronization });
        } catch (error) {
            console.error('Error connecting to the database', error);
        }
    }
}
```

---

## Esquema de Datos por Módulo

### Módulo: Shared (Identidad y Transversales)

#### Tabla: `Users`

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

---

### Módulo: AdminDesk (Gestión Académica)

#### Tabla: `Students`

| Columna | Tipo de Dato (Postgres) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `st_id` | UUID | PK, Unique, Not Null | Identificador único del estudiante. |
| `st_identification_card` | VARCHAR(255) | Unique, Not Null | Cédula o DNI del estudiante. |
| `st_full_name` | VARCHAR(255) | Not Null | Nombre completo. |
| `st_phone_number` | VARCHAR(255) | Not Null | Teléfono de contacto. |
| `st_email` | VARCHAR(255) | Unique, Not Null | Correo electrónico personal. |
| `st_date_of_birth` | DATE | Not Null | Fecha de nacimiento. |
| `st_nationality` | VARCHAR(255) | Not Null | País de origen. |
| `st_certificate_type` | ENUM | Not Null | Tipo de certificación. |
| `st_start_date` | DATE | Not Null | Fecha de inicio del programa. |
| `st_is_graduated` | BOOLEAN | Not Null, Default: false | Indica si completó sus estudios. |
| `st_contract_status` | ENUM | Not Null | Estado del contrato. |
| `st_progress_category` | ENUM | Not Null | Categoría de avance. |

---

#### Tabla: `StudentModules`

| Columna | Tipo de Dato (Postgres) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `st_mod_id` | UUID | PK, Unique, Not Null | Identificador. |
| `st_mod_student_id` | UUID | FK (Students), Not Null | Estudiante. |
| `st_mod_module_id` | UUID | FK (Modules), Not Null | Módulo. |
| `st_mod_seller_id` | UUID | FK (Users), Not Null | Asesor. |
| `st_mod_status` | ENUM | Not Null | Estado. |
| `st_mod_purchase_date` | DATE | Not Null | Fecha de adquisición. |

---

#### Tabla: `PaymentQuotas`

| Columna | Tipo de Dato (Postgres) | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `pq_id` | UUID | PK, Unique, Not Null | Identificador. |
| `pq_payment_plan_id` | UUID | FK | Plan. |
| `pq_quota_number` | INTEGER | Not Null | Número de cuota. |
| `pq_due_date` | DATE | Not Null | Fecha de vencimiento. |
| `pq_amount_paid` | DECIMAL | Not Null | Monto pagado. |

---

### Módulo: ClassTrack

#### Tabla: `AttendanceSessions`

| Columna | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `at_se_session_date` | DATE | Fecha de sesión. |
| `at_se_entry_time` | TIMESTAMPTZ | Hora de entrada. |
| `at_se_exit_time` | TIMESTAMPTZ | Hora de salida. |

---

#### Tabla: `RetentionAlerts`

| Columna | Tipo de Dato | Descripción |
| :--- | :--- | :--- |
| `re_al_contact_date` | DATE | Fecha de contacto. |
| `re_al_return_deadline` | DATE | Fecha de retorno. |
| `re_al_resolution_date` | DATE | Fecha de resolución. |

---

## Nota

Se ha estandarizado el uso de `DATE` (DATEONLY) para todos los campos de tipo fecha donde no es necesaria la precisión de tiempo, manteniendo `TIMESTAMPTZ` únicamente para campos de auditoría como `created_at` y `updated_at`, o eventos que requieren registro horario exacto.
