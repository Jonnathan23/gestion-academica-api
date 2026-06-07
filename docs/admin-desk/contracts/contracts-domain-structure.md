# Domain Structure: Contracts

## Entities

### `StudentLevelEntity`

Clase principal del dominio de contratos/niveles de estudiante.

- `id` (string): Identificador único.
- `studentId` (string): Identificador del estudiante.
- `moduleId` (string): Identificador del módulo asociado.
- `sellerId` (string): Identificador del vendedor.
- `status` (StudentModuleStatus): Estado del módulo (ACTIVE, APPROVED, LOCKED).
- `purchaseDate` (Date): Fecha de la compra.
- `createdAt` (Date): Fecha de creación del registro.
- `updatedAt` (Date): Fecha de la última actualización.

## DTOs

### `PurchaseModulesDto`

Objeto de transferencia para comprar u obtener nuevos módulos.

- `studentId` (string, required): Identificador del estudiante.
- `sellerId` (string, required): Identificador del vendedor.
- `moduleIds` (string[], required): Arreglo de identificadores de los módulos a comprar.

### `UpdateStudentLevelDto`

Objeto de transferencia para actualizar el estado del nivel/contrato.

- `contractId` (string, required): Identificador del contrato.
- `studentId` (string, required): Identificador del estudiante.
- `status` (StudentModuleStatus, required): Nuevo estado del módulo (ACTIVE, APPROVED, LOCKED).

### `DeleteStudentLevelDto`

Objeto de transferencia para eliminar un nivel de estudiante.

- `studentLevelId` (string, required): Identificador del nivel de estudiante a eliminar.

## Interfaces

### `studentModuleStatus` / `StudentModuleStatus`

Valores constantes para el estado de los módulos.

- Posibles valores: `"ACTIVE"`, `"APPROVED"`, `"LOCKED"`.

### `StudentLevelDataSource` / `StudentLevelRepository`

Contrato para la capa de persistencia y acceso a datos.

- `purchaseModules(dto: PurchaseModulesDto): Promise<StudentLevelEntity[]>`
- `getStudentContracts(studentId: string): Promise<StudentLevelEntity[]>`
- `updateStudentLevel(dto: UpdateStudentLevelDto): Promise<StudentLevelEntity[]>`
- `deleteStudentLevel(studentLevelId: string): Promise<boolean>`
