# Domain Structure: Modules

## Entities

### `ModuleEntity`

Clase principal del dominio de módulos.

- `mo_id` (string): Identificador único.
- `mo_name` (string): Nombre del módulo.
- `mo_description` (string): Descripción detallada del módulo.
- `mo_created_at` (string): Fecha de creación.
- `mo_updated_at` (string): Fecha de la última actualización.
- `student_modules` (StudenModules[]): Relación con los módulos de los estudiantes (Pendiente a reemplazar por la entidad específica).

## DTOs

### `CreateModuleDto`

Objeto de transferencia para crear un nuevo módulo.

- `mo_name` (string, required): Nombre del nuevo módulo.
- `mo_description` (string, required): Descripción del módulo a crear.

### `UpdateModuleDto`

Objeto de transferencia para actualizar la información de un módulo existente.

- `mo_name` (string, optional): Nuevo nombre a asignar al módulo.
- `mo_description` (string, optional): Nueva descripción del módulo.

## Interfaces

### `ModuleDataSource` / `ModuleRepository`

Contrato para la capa de persistencia y acceso a datos.

- `getAllModules(): Promise<ModuleEntity[]>`
- `getModuleById(moduleId: string): Promise<ModuleEntity>`
- `createModule(module: CreateModuleDto): Promise<void>`
- `updateModule(id: string, module: UpdateModuleDto): Promise<void>`
- `deleteModule(id: string): Promise<void>`
