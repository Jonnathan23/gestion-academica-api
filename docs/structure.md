### 🗂️ Estructura de Directorios (Backend)

```text
src
├── app
│   ├── AdminDesk                   # Módulo de gestión administrativa
│   │   ├── contracts               # Gestión de contratos y matrículas
│   │   ├── modules                 # Gestión de catálogo de módulos
│   │   ├── payments                # Gestión de pagos y finanzas
│   │   └── students                # Gestión de expedientes de estudiantes
│   │
│   ├───ClassTrack                  # Módulo de control de academica
│   │   ├── Attendance              # Feature: Control de Ingreso/Salida
│   │   ├── Lessons                 # Feature: Registro de Lecciones
│   │   ├── RetentionAlerts         # Feature: Alertas de Inasistencia
│   │   ├── Performance             # Feature: Cálculo de Avance diario (Cron/Fantasma)
│   │   └── Core                    # Middlewares, utilidades y routers EXCLUSIVOS de ClassTrack
│   │
│   │   └───Shared                  # Features transversales para todo el negocio
│   │       └───Identity            # Feature: Login, Autenticación y Tokens
│   │
├── core                            # Kernel del sistema y configuraciones globales
│   ├── config                      # Variables de entorno y ajustes de apps
│   ├── constants                   # Valores constantes y enumeraciones
│   ├── error                       # Manejo centralizado de excepciones
│   ├── interfaces                  # Definiciones de tipos y contratos globales
│   ├── middleware                  # Interceptores de peticiones HTTP
│   ├── server                      # Configuración del servidor (Express/Bun)
│   └── utils                       # Utilidades y funciones auxiliares
├── data                            # Capa de persistencia (Infraestructura)
│   ├── config                      # Configuración de base de datos (ORM)
│   ├── errors                      # Errores específicos de la capa de datos
│   └── models                      # Definiciones de esquemas y modelos
└── app.ts                          # Punto de entrada de la aplicación
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