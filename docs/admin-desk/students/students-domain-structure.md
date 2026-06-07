# Domain Structure: Students

## Entities

### `StudentEntity`

Clase principal del dominio que representa a un estudiante en el sistema.

- `id` (string): Identificador único.
- `identificationCard` (string): Número de cédula o identificación ciudadana.
- `fullName` (string): Nombre completo del estudiante.
- `phoneNumber` (string): Número de teléfono de contacto.
- `email` (string): Correo electrónico del estudiante.
- `dateOfBirth` (Date): Fecha de nacimiento.
- `nationality` (string): Nacionalidad.
- `certificateType` (string): Tipo de certificado o documento de identidad.
- `startDate` (Date): Fecha de inicio de clases o ingreso.
- `isGraduated` (boolean): Indica si el estudiante ya finalizó el programa (graduado).
- `contractStatus` (StudentContractStatus): Estado del contrato actual (ACTIVE, FROZEN, INACTIVE).
- `progressCategory` (StudentProgressCategory): Categoria de progreso (FAST, MODERATE, SLOW, NOT_ENOUGH_DATA).
- `createdAt` (Date): Fecha de creación del registro.
- `updatedAt` (Date): Fecha de última actualización.

## DTOs

### `RegisterStudentDto`

Objeto de transferencia para registrar/crear un nuevo estudiante.

- `identificationCard` (string, required): Número de identificación (Min 10 caracteres).
- `fullName` (string, required): Nombre completo (Min 3 caracteres).
- `phoneNumber` (string, required): Número telefónico (10 caracteres).
- `email` (string, required): Correo electrónico (Formato válido).
- `dateOfBirth` (Date, required): Fecha de nacimiento.
- `nationality` (string, required): Nacionalidad del estudiante.
- `certificateType` (string, required): Tipo de documento.
- `startDate` (Date, required): Fecha de inicio en el sistema.

### `UpdateStudentDto`

Objeto de transferencia para actualizar la información de un estudiante existente.

- `identificationCard` (string, optional): Nuevo número de identificación.
- `fullName` (string, optional): Nuevo nombre completo.
- `phoneNumber` (string, optional): Nuevo número celular/telefónico.
- `startDate` (Date, optional): Nueva fecha de inicio.
- `contractStatus` (StudentContractStatus, optional): Nuevo estado de contrato.
- `isGraduated` (boolean, optional): Nuevo estado de graduación.

### `ChangeContractStatusDto`

Objeto de transferencia específico para cambiar el estado del contrato.

- `contractStatus` (StudentContractStatus, required): El nuevo estado a asignar al contrato.

## Interfaces

### Tipos Constantes

- **`studentContractStatus`**: Posibles valores (`"ACTIVE"`, `"FROZEN"`, `"INACTIVE"`).
- **`studentProgressCategory`**: Posibles valores (`"FAST"`, `"MODERATE"`, `"SLOW"`, `"NOT_ENOUGH_DATA"`).

### `StudentDataSource` / `StudentRepository`

Contrato para la capa de persistencia (Base de Datos).

- `register(dto: RegisterStudentDto): Promise<StudentEntity>`
- `search(query: string): Promise<StudentEntity[]>`
- `update(id: string, dto: UpdateStudentDto): Promise<StudentEntity>`
- `changeContractStatus(id: string, dto: ChangeContractStatusDto): Promise<StudentEntity>`
- `toggleGraduated(id: string): Promise<StudentEntity>`
- `deactivate(id: string): Promise<StudentEntity>`
