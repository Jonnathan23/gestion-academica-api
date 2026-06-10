# Arquitectura y Flujo de Datos (Workflow)

Este documento describe el Patrón de Funcionamiento de la arquitectura backend (SALC - Domain, Infrastructure, Application, Presentation), utilizando como referencia la feature `modules` ubicada en `src/app/AdminDesk/modules`.

---

## 1. Capa de Dominio (`domain`) - El Contrato

La capa de Dominio representa la esencia del negocio. No contiene implementaciones de bases de datos ni frameworks externos; únicamente define contratos, reglas y modelos puros.

### 1.1 Entities

Las **Entities** son los modelos de datos puros del negocio. Representan el estado y las propiedades de un concepto fundamental de la aplicación.

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

Los **DTOs** son responsables de asegurar que los datos que ingresan al sistema sean válidos y cumplan con las reglas de negocio antes de ser procesados. Se utiliza un método estático `create()` que valida la estructura y retorna un arreglo con un error (si lo hay) o la instancia del DTO.

```typescript
// domain/dtos/CreateModule.dto.ts

export class CreateModuleDto {
    private constructor(
        public readonly mo_name: string,
        public readonly mo_description: string,
    ) {}

    // El método create actúa como un Factory y validador de entrada
    static create(object: { [key: string]: any }): [string?, CreateModuleDto?] {
        const { mo_name, mo_description } = object;

        if (!mo_name) return ["Missing name"];
        if (!mo_description) return ["Missing description"];

        return [undefined, new CreateModuleDto(mo_name, mo_description)];
    }
}
```

### 1.3 Datasource (Abstract)

El **Datasource** abstracto define el contrato u origen de los datos crudos. Es la interfaz que dicta qué operaciones de persistencia son requeridas, pero no cómo se implementan.

```typescript
// domain/datasource/module.datasource.ts

import type { UpdateModuleDto, CreateModuleDto } from "@/app/AdminDesk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/AdminDesk/modules/domain/entities/Module.entity";

export abstract class ModuleDataSource {
    abstract getAllModules(): Promise<ModuleEntity[]>;
    abstract getModuleById(moduleId: string): Promise<ModuleEntity>;
    abstract createModule(module: CreateModuleDto): Promise<void>;
    abstract updateModule(id: string, module: UpdateModuleDto): Promise<void>;
    abstract deleteModule(id: string): Promise<void>;
}
```

### 1.4 Repositories (Abstract)

El **Repository** abstracto actúa como el "puente" del dominio. Es la interfaz de alto nivel que será consumida por los Casos de Uso. En general, su firma es muy similar o idéntica al Datasource, pero su propósito es abstraer el origen de datos (pudiendo orquestar múltiples datasources si fuera necesario).

```typescript
// domain/repositories/Module.repository.ts

import type { CreateModuleDto, UpdateModuleDto } from "@/app/AdminDesk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/AdminDesk/modules/domain/entities/Module.entity";

export abstract class ModuleRepository {
    abstract getAllModules(): Promise<ModuleEntity[]>;
    abstract getModuleById(moduleId: string): Promise<ModuleEntity>;
    abstract createModule(module: CreateModuleDto): Promise<void>;
    abstract updateModule(id: string, module: UpdateModuleDto): Promise<void>;
    abstract deleteModule(id: string): Promise<void>;
}
```

---

## 2. Capa de Infraestructura (`infrastructure`) - La Implementación

La capa de Infraestructura contiene los detalles técnicos. Aquí es donde se cumple el contrato establecido por el Dominio, interactuando con la base de datos real (ORM, SQL, etc.).

### 2.1 Datasource Implementation

Es la implementación real del origen de datos. Aquí se ejecutan las consultas a la base de datos (por ejemplo, usando Sequelize) y se hace uso del Mapper para devolver una entidad pura del dominio.

```typescript
// infrastructure/datasource/module.datasource.impl.ts

import type { ModuleDataSource } from "@/app/AdminDesk/modules/domain/datasource/module.datasource";
import type { CreateModuleDto } from "@/app/AdminDesk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/AdminDesk/modules/domain/entities/Module.entity";
import { ModuleMapper } from "@/app/AdminDesk/modules/infrastructure/mappers/module.mapper";
import { CustomError } from "@/core/error";
import { Module } from "@/data/models/AdminDesk";

type moduleEntityFromObject = typeof ModuleMapper.moduleModelToEntity;

export class ModuleDataSourceImpl implements ModuleDataSource {
    constructor(private readonly moduleEntityFromObject: moduleEntityFromObject = ModuleMapper.moduleModelToEntity) {}

    async createModule(module: CreateModuleDto): Promise<void> {
        const { mo_name, mo_description } = module;
        try {
            // Interacción directa con el ORM / Base de datos
            const moduleExist = await Module.findOne({ where: { mo_name } });

            if (moduleExist) {
                throw CustomError.badRequest("Module already exists");
            }

            await Module.create({
                mo_name: mo_name,
                mo_description: mo_description,
            });
        } catch (error) {
            throw error;
        }
    }

    // ... otras implementaciones como getAllModules utilizando this.moduleEntityFromObject()
}
```

### 2.2 Mappers

El **Mapper** es un componente crucial. Su trabajo es transformar la respuesta "sucia" o específica del ORM (base de datos) en una **Entity** pura de dominio. En este proceso, actúa como una barrera o esquema de protección, asegurando que los datos persistidos cumplen con la estructura esperada de la Entity.

```typescript
// infrastructure/mappers/module.mapper.ts

import { ModuleEntity } from "@/app/AdminDesk/modules/domain/entities/Module.entity";
import { CustomError } from "@/core/error";

export const ModuleMapper = {
    // Transformación desde la BD hacia la Entidad de Dominio
    moduleModelToEntity(object: { [key: string]: any }): ModuleEntity {
        const { mo_id, mo_name, mo_description, mo_created_at, mo_updated_at, student_modules } = object;

        // Validación o Schema para proteger la integridad del Mapper y de la Entidad
        if (!mo_id || !mo_name || !mo_description || !mo_created_at || !mo_updated_at) {
            throw CustomError.internalServer("Invalid user model");
        }

        return new ModuleEntity(mo_id, mo_name, mo_description, mo_created_at, mo_updated_at, student_modules ?? []);
    },
};
```

### 2.3 Repositories Implementation

Esta clase es la implementación del contrato del Repositorio de dominio. Funciona inyectando el `ModuleDataSource` a través de su constructor, delegando la responsabilidad de la obtención y manipulación de datos al Datasource y retornando los objetos puros al Caso de Uso.

```typescript
// infrastructure/repositories/module.repository.impl.ts

import type { ModuleDataSource } from "@/app/AdminDesk/modules/domain/datasource/module.datasource";
import type { CreateModuleDto, UpdateModuleDto } from "@/app/AdminDesk/modules/domain/dtos";
import type { ModuleEntity } from "@/app/AdminDesk/modules/domain/entities/Module.entity";
import type { ModuleRepository } from "@/app/AdminDesk/modules/domain/repositories/Module.repository";

export class ModuleRepositoryImpl implements ModuleRepository {
    // Inyección de dependencia del DataSource
    constructor(private readonly moduleDataSource: ModuleDataSource) {}

    createModule(module: CreateModuleDto): Promise<void> {
        // Delegación de la lógica de persistencia al DataSource
        return this.moduleDataSource.createModule(module);
    }

    // ... resto de implementaciones que delegan a this.moduleDataSource
}
```

---

## 3. Capa de Aplicación (`application`) - La Orquestación

Aquí es donde ocurre la orquestación principal de las reglas del negocio. Los **Use Cases** consumen las abstracciones (repositorios) para ejecutar una acción específica en el sistema.

### 3.1 UseCases

Cada Caso de Uso representa una única acción de negocio. Recibe el repositorio por el constructor (Inyección de Dependencias) y llama al método correspondiente.

```typescript
// application/useCases/createModule.use-case.ts

import type { CreateModuleDto } from "@/app/AdminDesk/modules/domain/dtos";
import type { ModuleRepository } from "@/app/AdminDesk/modules/domain/repositories/Module.repository";

// Interfaz para estandarizar el Caso de Uso
interface CreateModuleUseCase {
    execute(module: CreateModuleDto): Promise<void>;
}

export class CreateModule implements CreateModuleUseCase {
    // Inyección del contrato abstracto del Repositorio (no la implementación real)
    constructor(private readonly moduleRepository: ModuleRepository) {}

    async execute(module: CreateModuleDto): Promise<void> {
        await this.moduleRepository.createModule(module);
    }
}
```

---

## 4. Capa de Presentación (`presentation`) - El Punto de Entrada

Esta capa recibe las peticiones HTTP del exterior, delega el trabajo a los Casos de Uso pasándoles los DTOs y retorna la respuesta al cliente.

### 4.1 Controllers

El controlador es el encargado de extraer los datos del Request de Express (o similar), instanciar los DTOs para la validación inicial de entrada, instanciar los Casos de Uso inyectando el Repositorio, y devolver una respuesta estructurada.

```typescript
// presentation/controllers/Module.controller.ts

import type { Request, Response, NextFunction } from "express";
import { ModuleRepository } from "@/app/AdminDesk/modules/domain/repositories/Module.repository";
import { CreateModuleDto } from "@/app/AdminDesk/modules/domain/dtos";
import { CustomError } from "@/core/error";
import { CreateModule } from "@/app/AdminDesk/modules/application";
import { SuccessResponse } from "@/core/utils";

export class ModuleController {
    // Recibe el Repositorio inyectado desde el Router
    constructor(private readonly moduleRepository: ModuleRepository) {}

    createModule = (req: Request, res: Response, next: NextFunction) => {
        // 1. Instanciación y validación del DTO
        const [error, createModuleDto] = CreateModuleDto.create(req.body);

        if (error) throw CustomError.badRequest(error);

        // 2. Instanciación del Caso de Uso, inyectando la abstracción del Repositorio
        const createModule = new CreateModule(this.moduleRepository);

        // 3. Ejecución y respuesta
        createModule
            .execute(createModuleDto!)
            .then(() => {
                const successMessage = "Module created successfully";
                SuccessResponse.created(res, successMessage);
            })
            .catch((error) => {
                next(error);
            });
    };
}
```

### 4.2 Router

El **Router** es el punto crítico para la **Inyección de Dependencias**. Es aquí donde las implementaciones concretas (de Infraestructura) se conectan con los contratos abstractos (de Dominio) y se les entregan a los Controladores. Actúa como el contenedor principal o "Composition Root" de la feature.

```typescript
// presentation/router.ts

import { Router } from "express";
import { ModuleDataSourceImpl } from "@/app/AdminDesk/modules/infrastructure/datasource/module.datasource.impl";
import { ModuleRepositoryImpl } from "@/app/AdminDesk/modules/infrastructure/repositories/module.repository.impl";
import { ModuleController } from "@/app/AdminDesk/modules/presentation/controllers/Module.controller";
import { AuthMiddleware, RoleMiddleware, VerifyUUID } from "@/core/middleware";
import { systemPermissions } from "@/core/constants";

export class ModulesRouter {
    static get routes(): Router {
        const router = Router();

        // 1. Inyección de Dependencias (DI Container)
        // Se instancia la capa técnica (DataSource Impl)
        const moduleDatasource = new ModuleDataSourceImpl();

        // Se pasa la implementación al Repository
        const moduleRespository = new ModuleRepositoryImpl(moduleDatasource);

        // Se entrega el Repository listo para usar al Controlador
        const moduleController = new ModuleController(moduleRespository);

        // 2. Configuración de Middlewares globales para estas rutas
        router.use(AuthMiddleware.validateJWT);
        router.param("id", VerifyUUID.validate);

        // 3. Definición de Rutas y delegación al Controlador
        router.post(
            "/",
            RoleMiddleware.requirePermissions([systemPermissions.ADMINDESK_MODULES_READ, systemPermissions.ADMINDESK_MODULES_WRITE]),
            moduleController.createModule,
        );

        // ... otras rutas (GET, PATCH, DELETE)

        return router;
    }
}
```
