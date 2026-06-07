---
description: Arquitectura Clean Architecture Backend: Domain (Entities, DTOs, interfaces), Infrastructure (BD, Mappers), Application (Use Cases) y Presentation (Controllers, DI Router).
---

# Arquitectura y Flujo de Datos Backend

Descripción del patrón SALC (Domain, Infrastructure, Application, Presentation), usando `modules` como referencia.

## 1. Domain - El Contrato

Representa la esencia del negocio. Define contratos, reglas y modelos puros sin frameworks externos.

### 1.1 Entities

Modelos puros de datos.

```typescript
export class ModuleEntity {
    constructor(
        public mo_id: string,
        public mo_name: string,
        public mo_description: string,
        public mo_created_at: string,
        public mo_updated_at: string,
        private student_modules: StudenModules[],
    ) {}
}
```

### 1.2 DTOs (Data Transfer Objects)

Valida entrada antes de procesar usando `create()`.

```typescript
export class CreateModuleDto {
    private constructor(
        public readonly mo_name: string,
        public readonly mo_description: string,
    ) {}
    static create(object: { [key: string]: any }): [string?, CreateModuleDto?] {
        const { mo_name, mo_description } = object;
        if (!mo_name) return ["Missing name"];
        if (!mo_description) return ["Missing description"];
        return [undefined, new CreateModuleDto(mo_name, mo_description)];
    }
}
```

### 1.3 Datasource (Abstract)

Contrato de persistencia requerida.

```typescript
export abstract class ModuleDataSource {
    abstract createModule(module: CreateModuleDto): Promise<void>;
}
```

### 1.4 Repositories (Abstract)

Puente del dominio, consumido por UseCases.

```typescript
export abstract class ModuleRepository {
    abstract createModule(module: CreateModuleDto): Promise<void>;
}
```

## 2. Infrastructure - La Implementación

Detalles técnicos y base de datos (Sequelize).

### 2.1 Datasource Implementation

Implementación real hacia la BD.

```typescript
export class ModuleDataSourceImpl implements ModuleDataSource {
    async createModule(module: CreateModuleDto): Promise<void> {
        const { mo_name, mo_description } = module;
        const moduleExist = await Module.findOne({ where: { mo_name } });
        if (moduleExist) throw CustomError.badRequest("Module exists");
        await Module.create({ mo_name, mo_description });
    }
}
```

### 2.2 Mappers

Transforma la respuesta ORM en Entity pura.

```typescript
export const ModuleMapper = {
    moduleModelToEntity(object: { [key: string]: any }): ModuleEntity {
        // ... validación y return new ModuleEntity(...)
        return new ModuleEntity(object.mo_id, object.mo_name, object.mo_description, object.mo_created_at, object.mo_updated_at, []);
    },
};
```

### 2.3 Repositories Implementation

Delega la persistencia al Datasource inyectado.

```typescript
export class ModuleRepositoryImpl implements ModuleRepository {
    constructor(private readonly moduleDataSource: ModuleDataSource) {}
    createModule(module: CreateModuleDto): Promise<void> {
        return this.moduleDataSource.createModule(module);
    }
}
```

## 3. Application - La Orquestación

### 3.1 UseCases

Acciones de negocio. Reciben repositorio y lo ejecutan.

```typescript
export class CreateModule {
    constructor(private readonly moduleRepository: ModuleRepository) {}
    async execute(module: CreateModuleDto): Promise<void> {
        await this.moduleRepository.createModule(module);
    }
}
```

## 4. Presentation - Punto de Entrada

### 4.1 Controllers

Reciben peticiones HTTP, validan DTOs, inyectan Repo a UseCases y retornan respuesta.

```typescript
export class ModuleController {
    constructor(private readonly moduleRepository: ModuleRepository) {}
    createModule = (req: Request, res: Response, next: NextFunction) => {
        const [error, createModuleDto] = CreateModuleDto.create(req.body);
        if (error) throw CustomError.badRequest(error);
        new CreateModule(this.moduleRepository)
            .execute(createModuleDto!)
            .then(() => SuccessResponse.created(res, "Module created"))
            .catch((error) => {
                next(error);
            });
    };
}
```

### 4.2 Router

Compositor principal (DI). Instancia Infra, inyecta a Controladores y maneja Middlewares.

```typescript
export class ModulesRouter {
    static get routes(): Router {
        const router = Router();
        const moduleDatasource = new ModuleDataSourceImpl();
        const moduleRespository = new ModuleRepositoryImpl(moduleDatasource);
        const moduleController = new ModuleController(moduleRespository);

        router.post("/", RoleMiddleware.requirePermissions([...]), moduleController.createModule);
        return router;
    }
}
```

### Estructura de Directorios (Backend)

```text
src/
├── core/                           <-- Kernel del sistema y configuraciones globales
│   ├── config/                     <-- Variables de entorno y ajustes de apps
│   ├── constants/                  <-- Valores constantes y enumeraciones
│   ├── error/                      <-- Manejo centralizado de excepciones
│   ├── interfaces/                 <-- Definiciones de tipos y contratos globales
│   ├── middleware/                 <-- Interceptores de peticiones HTTP
│   ├── server/                     <-- Configuración del servidor (Express/Bun)
│   └── utils/                      <-- Utilidades y funciones auxiliares
│
├── data/                           <-- Capa de persistencia (Infraestructura de DB)
│   ├── config/                     <-- Configuración de base de datos (ORM)
│   ├── errors/                     <-- Errores específicos de la capa de datos
│   └── models/                     <-- Definiciones de esquemas y modelos
│
└── app/                            <-- Reglas de negocio divididas por módulos (Features)
    ├── admin-desk/                 <-- Lógica exclusiva de AdminDesk (Administración)
    │   ├── contracts/              <-- Gestión de contratos y matrículas
    │   │   ├── application/        <-- (Casos de uso)
    │   │   ├── domain/             <-- (Entidades, DTOs, interfaces de datasources)
    │   │   ├── infrastructure/     <-- (Repositorios, mappers, datasources impl)
    │   │   └── presentation/       <-- (Controladores, rutas, DI)
    │   ├── modules/                <-- Gestión de catálogo de módulos
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── payments/               <-- Gestión de pagos y finanzas
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   └── students/               <-- Gestión de expedientes de estudiantes
    │       ├── application/
    │       ├── domain/
    │       ├── infrastructure/
    │       └── presentation/
    │
    ├── class-track/                <-- Módulo de control académico
    │   ├── attendance/             <-- Feature: Control de Ingreso/Salida
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── lessons/                <-- Feature: Registro de Lecciones
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── retention-alerts/       <-- Feature: Alertas de Inasistencia
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   ├── performance/            <-- Feature: Cálculo de Avance diario (Cron/Fantasma)
    │   │   ├── application/
    │   │   ├── domain/
    │   │   ├── infrastructure/
    │   │   └── presentation/
    │   └── core/                   <-- Middlewares, utilidades y routers EXCLUSIVOS
    │
    └── shared/                     <-- Lógica compartida entre aplicaciones
        └── identity/               <-- Login, Autenticación y Tokens
            ├── application/
            ├── domain/
            ├── infrastructure/
            └── presentation/

```
