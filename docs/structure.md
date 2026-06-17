### 🗂️ Estructura de Directorios (Backend)

```text
src/
├── core/                           <-- Kernel del sistema y configuraciones globales
│   ├── config/                     <-- Variables de entorno y ajustes de apps
│   ├── constants/                  <-- Valores constantes y enumeraciones
│   ├── error/                      <-- Manejo centralizado de excepciones
│   ├── interfaces/                 <-- Definiciones de tipos y contratos globales
│   ├── middleware/                 <-- Interceptores de peticiones HTTP
│   ├── server/                     <-- Configuración del servidor (Express/Bun)
│   ├── types/                      <-- Tipos globales
│   └── utils/                      <-- Utilidades y funciones auxiliares
│
├── data/                           <-- Capa de persistencia (Infraestructura de DB)
│   ├── config/                     <-- Configuración de base de datos (ORM)
│   ├── errors/                     <-- Errores específicos de la capa de datos
│   └── models/                     <-- Definiciones de esquemas y modelos
│       ├── admin-desk/
│       ├── class-track/
│       └── shared/
│
├── app/                            <-- Reglas de negocio divididas por módulos (Features)
│   ├── admin-desk/                 <-- Lógica exclusiva de AdminDesk (Administración)
│   │   ├── modules/                <-- Gestión de catálogo de módulos
│   │   │   ├── application/        <-- (Casos de uso)
│   │   │   ├── domain/             <-- (Entidades, DTOs, interfaces de datasources)
│   │   │   ├── infrastructure/     <-- (Repositorios, mappers, datasources impl)
│   │   │   └── presentation/       <-- (Controladores, rutas, DI)
│   │   ├── payments/               <-- Gestión de pagos y finanzas
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   ├── student-level/          <-- Gestión de niveles/contratos
│   │   │   ├── application/
│   │   │   ├── domain/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   └── students/               <-- Gestión de expedientes de estudiantes
│   │       ├── application/
│   │       ├── domain/
│   │       ├── infrastructure/
│   │       └── presentation/
│   │
│   ├── class-track/                <-- Módulo de control académico
│   │   ├── core/                   <-- Middlewares, utilidades, enums y sub-módulos core
│   │   │   ├── enums/
│   │   │   └── students/           <-- Core de estudiantes para class-track
│   │   └── feats/                  <-- Features de control académico
│   │       ├── attendance/         <-- Feature: Control de Ingreso/Salida
│   │       │   ├── application/
│   │       │   ├── domain/
│   │       │   ├── infrastructure/
│   │       │   └── presentation/
│   │       ├── dashboard/          <-- Feature: Panel de control académico
│   │       │   ├── application/
│   │       │   ├── domain/
│   │       │   └── presentation/
│   │       ├── observation/        <-- Feature: Observaciones académicas
│   │       │   ├── application/
│   │       │   ├── domain/
│   │       │   ├── infrastructure/
│   │       │   └── presentation/
│   │       └── retention-alerts/   <-- Feature: Alertas de Inasistencia / Retención
│   │           ├── application/
│   │           ├── domain/
│   │           ├── infrastructure/
│   │           └── presentation/
│   │
│   └── shared/                     <-- Lógica compartida entre aplicaciones
│       ├── identity/               <-- Login, Autenticación y Tokens
│       │   ├── application/
│       │   ├── domain/
│       │   ├── infrastructure/
│       │   └── presentation/
│       └── verify/                 <-- Verificación y utilidades compartidas
│           └── presentation/
│
└── __test__/                       <-- Pruebas de integración o e2e globales
```

# Descripción de Capas (Clean Architecture)

Cada sub-módulo dentro de `app/` (ej. `students`, `Identity`) sigue una estructura interna basada en Clean Architecture para garantizar el desacoplamiento:

| Capa               | Propósito (Humano/IA)                                                                                                                                       |
| :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Domain**         | **Núcleo del Negocio**: Contiene entidades, objetos de valor y las reglas de negocio más puras. Es la capa de mayor nivel y no tiene dependencias.          |
| **Application**    | **Casos de Uso**: Orquestación de la lógica de negocio. Define las acciones que el usuario puede realizar. Semánticamente: Implementación de Command/Query. |
| **Infrastructure** | **Detalles Técnicos**: Implementaciones de repositorios, adaptadores de APIs externas y mappers de datos. Responsable de la comunicación con el exterior.   |
| **Presentation**   | **Interfaz de Entrada**: Controladores, routers y validadores de esquemas (DTOs). Es la puerta de entrada a los casos de uso desde el protocolo HTTP.       |

# Organización Global

| Carpeta  | Propósito (Humano/IA)                                                                                                                                |
| :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| **App**  | **Módulos Funcionales**: Organización por dominios de negocio (Features). Cada carpeta es un micro-ecosistema independiente.                         |
| **Core** | **Cross-Cutting Concerns**: Servicios y utilidades que proporcionan infraestructura básica a todas las capas sin pertenecer a un dominio específico. |
| **Data** | **Data Access Layer**: Centraliza el conocimiento del esquema físico de la base de datos y la configuración del ORM (Sequelize/PostgreSQL).          |
