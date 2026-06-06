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

# Descripción de Capas (Clean Architecture)

Cada sub-módulo dentro de `app/` (ej. `students`, `Identity`) sigue una estructura interna basada en Clean Architecture para garantizar el desacoplamiento:

| Capa           | Propósito (Humano/IA)                                                                                                                               |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Domain**     | **Núcleo del Negocio**: Contiene entidades, objetos de valor y las reglas de negocio más puras. Es la capa de mayor nivel y no tiene dependencias.  |
| **Application**| **Casos de Uso**: Orquestación de la lógica de negocio. Define las acciones que el usuario puede realizar. Semánticamente: Implementación de Command/Query. |
| **Infrastructure**| **Detalles Técnicos**: Implementaciones de repositorios, adaptadores de APIs externas y mappers de datos. Responsable de la comunicación con el exterior. |
| **Presentation**| **Interfaz de Entrada**: Controladores, routers y validadores de esquemas (DTOs). Es la puerta de entrada a los casos de uso desde el protocolo HTTP. |

# Organización Global

| Carpeta        | Propósito (Humano/IA)                                                                                                                               |
| :------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| **App**        | **Módulos Funcionales**: Organización por dominios de negocio (Features). Cada carpeta es un micro-ecosistema independiente.                        |
| **Core**       | **Cross-Cutting Concerns**: Servicios y utilidades que proporcionan infraestructura básica a todas las capas sin pertenecer a un dominio específico. |
| **Data**       | **Data Access Layer**: Centraliza el conocimiento del esquema físico de la base de datos y la configuración del ORM (Sequelize/PostgreSQL).         |