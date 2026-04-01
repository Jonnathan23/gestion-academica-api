# Endpoint Structure: Students

## `POST /api/students/register`
* **Description**: Registra un nuevo estudiante en el sistema.
* **Body**: `RegisterStudentDto`
* **Response**: `SuccessResponse<StudentEntity>`

## `GET /api/students/search`
* **Description**: Busca estudiantes en el sistema. Si se envía el query parameter `q`, realiza filtros por coincidencias de identificación o nombres.
* **Query**: 
    * `q` (string): Término de búsqueda (ej. nombre o cédula).
* **Response**: `SuccessResponse<StudentEntity[]>`

## `PATCH /api/students/:id`
* **Description**: Actualiza la información parcial de un estudiante en específico.
* **Params**: 
    * `id` (string): UUID del estudiante a actualizar.
* **Body**: `UpdateStudentDto`
* **Response**: `SuccessResponse<StudentEntity>`

## `PATCH /api/students/:id/contract-status`
* **Description**: Modifica el estado del contrato de un estudiante.
* **Params**: 
    * `id` (string): UUID del estudiante.
* **Body**: `ChangeContractStatusDto`
* **Response**: `SuccessResponse<StudentEntity>`

## `PATCH /api/students/:id/graduated`
* **Description**: Invierte el estado de graduación de un estudiante (si es true pasa a false y viceversa).
* **Params**: 
    * `id` (string): UUID del estudiante.
* **Response**: `SuccessResponse<StudentEntity>`

## `PATCH /api/students/:id/deactivate`
* **Description**: Desactiva el estudiante (marcando el contrato en una manera inactiva o deshabilitando la entidad en general).
* **Params**: 
    * `id` (string): UUID del estudiante.
* **Response**: `SuccessResponse<StudentEntity>`
