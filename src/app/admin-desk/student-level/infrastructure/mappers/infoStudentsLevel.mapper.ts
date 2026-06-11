import { StudentSearchProjection } from "@/app/admin-desk/student-level/domain/projections/StudentSearch.projection";
import {
    StudentTimelineProjection,
    type TimelineStudentInfo,
    type TimelineEnrolledLevel,
    type TimelineAvailableModule,
} from "@/app/admin-desk/student-level/domain/projections/StudentTimeline.projection";
import { CustomError } from "@/core/error";

export class InfoStudentsLevelMapper {
    public static studentSearchFromObject(object: { [key: string]: any }): StudentSearchProjection {
        const { st_id, st_identification_card, st_full_name, st_email, totalEnrolledLevels } = object;

        if (!st_id) throw CustomError.internalServer("Missing st_id for StudentSearchProjection");
        if (!st_identification_card) throw CustomError.internalServer("Missing st_identification_card for StudentSearchProjection");
        if (!st_full_name) throw CustomError.internalServer("Missing st_full_name for StudentSearchProjection");
        if (!st_email) throw CustomError.internalServer("Missing st_email for StudentSearchProjection");

        // Use parseInt to ensure the COUNT() result from SQL is parsed as a number. In PG COUNT returns string.
        const enrolledCount = totalEnrolledLevels ? parseInt(totalEnrolledLevels, 10) : 0;

        return new StudentSearchProjection(st_id, st_identification_card, st_full_name, st_email, isNaN(enrolledCount) ? 0 : enrolledCount);
    }

    public static timelineStudentInfoFromObject(object: { [key: string]: any }): TimelineStudentInfo {
        const { st_id, st_full_name, st_phone_number, st_start_date } = object;

        if (!st_id) throw CustomError.internalServer("Missing st_id for TimelineStudentInfo");
        if (!st_full_name) throw CustomError.internalServer("Missing st_full_name for TimelineStudentInfo");
        if (!st_phone_number) throw CustomError.internalServer("Missing st_phone_number for TimelineStudentInfo");
        if (!st_start_date) throw CustomError.internalServer("Missing st_start_date for TimelineStudentInfo");

        return {
            id: st_id,
            fullName: st_full_name,
            phoneNumber: st_phone_number,
            startDate: new Date(st_start_date),
        };
    }

    public static timelineEnrolledLevelFromObject(object: { [key: string]: any }): TimelineEnrolledLevel {
        const { st_mod_id, st_mod_status, st_mod_purchase_date, module } = object;

        if (!st_mod_id) throw CustomError.internalServer("Missing st_mod_id for TimelineEnrolledLevel");
        if (!st_mod_status) throw CustomError.internalServer("Missing st_mod_status for TimelineEnrolledLevel");
        if (!st_mod_purchase_date) throw CustomError.internalServer("Missing st_mod_purchase_date for TimelineEnrolledLevel");
        if (!module) throw CustomError.internalServer("Missing module relation for TimelineEnrolledLevel");
        if (!module.mo_id) throw CustomError.internalServer("Missing module.mo_id for TimelineEnrolledLevel");
        if (!module.mo_name) throw CustomError.internalServer("Missing module.mo_name for TimelineEnrolledLevel");
        if (module.mo_level === undefined || module.mo_level === null) {
            throw CustomError.internalServer("Missing module.mo_level for TimelineEnrolledLevel");
        }

        return {
            contractId: st_mod_id,
            status: st_mod_status,
            purchaseDate: new Date(st_mod_purchase_date),
            module: {
                moduleId: module.mo_id,
                name: module.mo_name,
                level: module.mo_level,
            },
        };
    }

    public static timelineAvailableModuleFromObject(object: { [key: string]: any }): TimelineAvailableModule {
        const { mo_id, mo_name, mo_level, mo_description } = object;

        if (!mo_id) throw CustomError.internalServer("Missing mo_id for TimelineAvailableModule");
        if (!mo_name) throw CustomError.internalServer("Missing mo_name for TimelineAvailableModule");
        if (mo_level === undefined || mo_level === null) {
            throw CustomError.internalServer("Missing mo_level for TimelineAvailableModule");
        }
        if (!mo_description) throw CustomError.internalServer("Missing mo_description for TimelineAvailableModule");

        return {
            moduleId: mo_id,
            name: mo_name,
            level: mo_level,
            description: mo_description,
        };
    }

    public static studentTimelineFromObject(object: { [key: string]: any }): StudentTimelineProjection {
        const { studentRaw, enrolledLevelsRaw, availableModulesRaw } = object;

        if (!studentRaw) throw CustomError.internalServer("Missing studentRaw for StudentTimelineProjection");
        if (!enrolledLevelsRaw || !Array.isArray(enrolledLevelsRaw)) {
            throw CustomError.internalServer("Missing or invalid enrolledLevelsRaw for StudentTimelineProjection");
        }
        if (!availableModulesRaw || !Array.isArray(availableModulesRaw)) {
            throw CustomError.internalServer("Missing or invalid availableModulesRaw for StudentTimelineProjection");
        }

        const studentInfo = this.timelineStudentInfoFromObject(studentRaw);
        const enrolledLevels = enrolledLevelsRaw.map((levelRaw: any) => this.timelineEnrolledLevelFromObject(levelRaw));
        const availableModules = availableModulesRaw.map((moduleRaw: any) => this.timelineAvailableModuleFromObject(moduleRaw));

        return new StudentTimelineProjection(studentInfo, enrolledLevels, availableModules);
    }
}
