# Endpoint Structure: Modules

## `POST /api/modules/`
* **Description**: Registra un nuevo módulo en el sistema.
* **Body**: `CreateModuleDto`
* **Response**: `SuccessResponse<void>`

## `GET /api/modules/`
* **Description**: Obtiene la lista completa de módulos registrados.
* **Response**: `SuccessResponse<ModuleEntity[]>`

## `GET /api/modules/:id`
* **Description**: Obtiene el detalle de un módulo específico en base a su identificador.
* **Params**: 
    * `id` (string): UUID del módulo.
* **Response**: `SuccessResponse<ModuleEntity>`

## `PATCH /api/modules/:id`
* **Description**: Actualiza parcialmente la información de un módulo existente.
* **Params**: 
    * `id` (string): UUID del módulo.
* **Body**: `UpdateModuleDto`
* **Response**: `SuccessResponse<void>`

## `DELETE /api/modules/:id`
* **Description**: Elimina un módulo en el sistema de manera definitiva o lógica.
* **Params**: 
    * `id` (string): UUID del módulo a eliminar.
* **Response**: `SuccessResponse<void>`
