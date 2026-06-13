# Endpoint Structure: Students

## `POST /api/students/register`

- **Description**: Registra un nuevo estudiante en el sistema.
- **Body**: `RegisterStudentDto`
- **Response**: `SuccessResponse<StudentEntity>`

## `GET /api/students/search`

- **Description**: Busca estudiantes en el sistema. Si se envía el query parameter `q`, realiza filtros por coincidencias de identificación o nombres.
- **Query**:
    - `q` (string): Término de búsqueda (ej. nombre o cédula).
- **Response**: `SuccessResponse<StudentEntity[]>`

## `GET /api/students/search/criteria`

- **Description**: Busca estudiantes en el sistema mediante múltiples parámetros opcionales y retorna resultados paginados.
- **Query**: (Recibe los parámetros del `SearchStudentsByCriteriaDto`)
    - `page` (number, required): Página de resultados (cada página trae 10 estudiantes máximo).
    - `searchTerm` (string, optional): Término general (cédula, nombre, teléfono o correo).
    - `st_nationality` (string, optional): Nacionalidad.
    - `st_certificate_type` (CertificateType, optional): Tipo de certificado.
    - `st_is_graduated` (boolean, optional): Estado de graduado.
    - `st_contract_status` (StudentContractStatus, optional): Estado de contrato.
    - `st_progress_category` (StudentProgressCategory, optional): Categoría de progreso.
- **Response**: `SuccessResponse<PaginatedResult<StudentEntity>>`

## `PATCH /api/students/:id`

- **Description**: Actualiza la información parcial de un estudiante en específico.
- **Params**:
    - `id` (string): UUID del estudiante a actualizar.
- **Body**: `UpdateStudentDto`
- **Response**: `SuccessResponse<StudentEntity>`

## `PATCH /api/students/:id/contract-status`

- **Description**: Modifica el estado del contrato de un estudiante.
- **Params**:
    - `id` (string): UUID del estudiante.
- **Body**: `ChangeContractStatusDto`
- **Response**: `SuccessResponse<StudentEntity>`

## `PATCH /api/students/:id/graduated`

- **Description**: Invierte el estado de graduación de un estudiante (si es true pasa a false y viceversa).
- **Params**:
    - `id` (string): UUID del estudiante.
- **Response**: `SuccessResponse<StudentEntity>`

## `PATCH /api/students/:id/deactivate`

- **Description**: Desactiva el estudiante (marcando el contrato en una manera inactiva o deshabilitando la entidad en general).
- **Params**:
    - `id` (string): UUID del estudiante.
- **Response**: `SuccessResponse<StudentEntity>`
