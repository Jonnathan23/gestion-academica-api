# Endpoint Structure: Contracts

## `POST /api/contracts/student/:studentId`

- **Description**: Registra y asocia la compra de nuevos módulos a un estudiante.
- **Params**:
    - `studentId` (string): UUID del estudiante.
- **Body**: `PurchaseModulesDto`
- **Response**: `SuccessResponse<StudentLevelEntity[]>`

## `GET /api/contracts/student/:studentId`

- **Description**: Obtiene la lista de contratos o módulos adquiridos por un estudiante.
- **Params**:
    - `studentId` (string): UUID del estudiante.
- **Response**: `SuccessResponse<StudentLevelEntity[]>`

## `PATCH /api/contracts/:contractId/status`

- **Description**: Actualiza el estado de un contrato o nivel específico.
- **Params**:
    - `contractId` (string): UUID del contrato/nivel.
- **Body**: `UpdateStudentLevelDto`
- **Response**: `SuccessResponse<StudentLevelEntity[]>`

## `DELETE /api/contracts/:studentLevelId`

- **Description**: Elimina un nivel de estudiante determinado.
- **Params**:
    - `studentLevelId` (string): UUID del nivel de estudiante.
- **Response**: `SuccessResponse<void>`
