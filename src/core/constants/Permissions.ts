import { userRoles } from "@/core/interfaces";

export const systemPermissions = {
    // Feature: AdminDesk/students
    ADMINDESK_STUDENTS_READ: "admindesk:students:read",
    ADMINDESK_STUDENTS_WRITE: "admindesk:students:write",

    // Feature: AdminDesk/contracts (Student Levels)
    ADMINDESK_CONTRACTS_READ: "admindesk:contracts:read",
    ADMINDESK_CONTRACTS_WRITE: "admindesk:contracts:write",

    // Feature: AdminDesk/modules (El catálogo base: A1, A2, B1...)
    ADMINDESK_MODULES_READ: "admindesk:modules:read",
    ADMINDESK_MODULES_WRITE: "admindesk:modules:write",

    // Feature: AdminDesk/payments (Lo que construiremos para facturación)
    ADMINDESK_PAYMENTS_READ: "admindesk:payments:read",
    ADMINDESK_PAYMENTS_WRITE: "admindesk:payments:write",

    // Feature: Shared/Identity (Usuarios, Contraseñas, Roles)
    SHARED_IDENTITY_READ: "shared:identity:read",
    SHARED_IDENTITY_WRITE: "shared:identity:write",

    // Feature: ClassTrack (Asistencia, Sesiones)
    CLASSTRACK_READ: "classtrack:read",
    CLASSTRACK_WRITE: "classtrack:write",
} as const;

export type SystemPermission = (typeof systemPermissions)[keyof typeof systemPermissions];

// 2. Mapa de asignación: Repartiendo las "pulseras" a cada Rol
export const rolePermissionsMapping: Record<string, SystemPermission[]> = {
    // ADMIN: Dios del sistema. Lo puede hacer todo.
    [userRoles.ADMIN]: Object.values(systemPermissions),

    // ADVISOR (Asesor): El motor de ventas y matrículas.
    [userRoles.ADVISOR]: [
        systemPermissions.ADMINDESK_STUDENTS_READ,
        systemPermissions.ADMINDESK_STUDENTS_WRITE,

        systemPermissions.ADMINDESK_CONTRACTS_READ,
        systemPermissions.ADMINDESK_CONTRACTS_WRITE,

        systemPermissions.ADMINDESK_PAYMENTS_READ,
        systemPermissions.ADMINDESK_PAYMENTS_WRITE,

        // El asesor necesita LEER los módulos para armar el paquete de venta, pero NO puede CREAR nuevos módulos en el sistema.
        systemPermissions.ADMINDESK_MODULES_READ,
    ],

    // ACADEMIC_DIRECTOR: El jefe académico.
    [userRoles.ACADEMIC_DIRECTOR]: [
        // En AdminDesk solo audita (Solo Lectura)
        systemPermissions.ADMINDESK_STUDENTS_READ,
        systemPermissions.ADMINDESK_CONTRACTS_READ,
        systemPermissions.ADMINDESK_MODULES_READ,
        systemPermissions.ADMINDESK_PAYMENTS_READ,
        // En ClassTrack es el jefe absoluto
        systemPermissions.CLASSTRACK_READ,
        systemPermissions.CLASSTRACK_WRITE,
    ],

    // TEACHER: Enfoque 100% en el aula.
    [userRoles.TEACHER]: [
        systemPermissions.CLASSTRACK_READ,
        systemPermissions.CLASSTRACK_WRITE,
        // Le damos lectura a estudiantes por si necesita ver el perfil o nivel de su alumno
        systemPermissions.ADMINDESK_STUDENTS_READ,
    ],
};
