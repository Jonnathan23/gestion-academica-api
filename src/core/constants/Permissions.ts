import { userRoles } from "@/core/interfaces";

export const systemPermissions = {
    // Feature: AdminDesk/students
    ADMINDESK_MAIN_ACCESS: "admindesk:main:access",

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
    CLASSTRACK_MAIN_ACCESS: "classtrack:main:access",

    CLASSTRACK_ATTENDANCE_READ: "classtrack:attendance:read",
    CLASSTRACK_ATTENDANCE_WRITE: "classtrack:attendance:write",

    CLASSTRACK_STUDENTS_READ: "classtrack:students:read",
    CLASSTRACK_STUDENTS_WRITE: "classtrack:students:write",

    CLASSTRACK_SESSIONS_READ: "classtrack:sessions:read",
    CLASSTRACK_SESSIONS_WRITE: "classtrack:sessions:write",

    CLASSTRACK_OBSERVATIONS_READ: "classtrack:observations:read",
    CLASSTRACK_OBSERVATIONS_WRITE: "classtrack:observations:write",

    CLASSTRACK_RETENTION_ALERTS_READ: "classtrack:retention_alerts:read",
    CLASSTRACK_RETENTION_ALERTS_WRITE: "classtrack:retention_alerts:write",
} as const;

export type SystemPermission = (typeof systemPermissions)[keyof typeof systemPermissions];

export const rolePermissionsMapping: Record<string, SystemPermission[]> = {
    [userRoles.ADMIN]: Object.values(systemPermissions),

    [userRoles.ADVISOR]: [
        systemPermissions.ADMINDESK_MAIN_ACCESS,

        systemPermissions.ADMINDESK_STUDENTS_READ,
        systemPermissions.ADMINDESK_STUDENTS_WRITE,

        systemPermissions.ADMINDESK_CONTRACTS_READ,
        systemPermissions.ADMINDESK_CONTRACTS_WRITE,

        systemPermissions.ADMINDESK_PAYMENTS_READ,
        systemPermissions.ADMINDESK_PAYMENTS_WRITE,

        systemPermissions.ADMINDESK_MODULES_READ,
    ],

    [userRoles.ACADEMIC_DIRECTOR]: [
        systemPermissions.CLASSTRACK_MAIN_ACCESS,

        systemPermissions.ADMINDESK_CONTRACTS_READ,

        systemPermissions.ADMINDESK_MODULES_READ,

        systemPermissions.ADMINDESK_PAYMENTS_READ,

        systemPermissions.CLASSTRACK_ATTENDANCE_READ,
        systemPermissions.CLASSTRACK_ATTENDANCE_WRITE,

        systemPermissions.CLASSTRACK_STUDENTS_READ,
        systemPermissions.CLASSTRACK_STUDENTS_WRITE,

        systemPermissions.CLASSTRACK_SESSIONS_READ,
        systemPermissions.CLASSTRACK_SESSIONS_WRITE,

        systemPermissions.CLASSTRACK_OBSERVATIONS_READ,
        systemPermissions.CLASSTRACK_OBSERVATIONS_WRITE,

        systemPermissions.CLASSTRACK_RETENTION_ALERTS_READ,
        systemPermissions.CLASSTRACK_RETENTION_ALERTS_WRITE,
    ],

    [userRoles.TEACHER]: [
        systemPermissions.CLASSTRACK_MAIN_ACCESS,
        systemPermissions.CLASSTRACK_STUDENTS_READ,

        systemPermissions.CLASSTRACK_ATTENDANCE_READ,
        systemPermissions.CLASSTRACK_ATTENDANCE_WRITE,

        systemPermissions.CLASSTRACK_SESSIONS_READ,
        systemPermissions.CLASSTRACK_SESSIONS_WRITE,

        systemPermissions.CLASSTRACK_OBSERVATIONS_READ,

        systemPermissions.CLASSTRACK_RETENTION_ALERTS_READ,
    ],
};
