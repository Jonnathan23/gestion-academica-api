import Student from "@/data/models/AdminDesk/Student.model";
import { CustomError } from "@/core/error/customError.error";
import type { ActiveStudentProjection } from "@/app/class-track/core/interfaces/StudentProjection.interface";

export class StudentProjectionMapper {
    public static entityFromObject(object: Student): ActiveStudentProjection {
        const { st_id, st_full_name, student_modules } = object;

        if (!student_modules || student_modules.length === 0) {
            throw CustomError.internalServer("Mapper Error: Student modules not included in query");
        }

        const activeOrFrozenModule = student_modules.find((m) => m.st_mod_status === "ACTIVE" || m.st_mod_status === "FROZEN");

        if (!activeOrFrozenModule) {
            throw CustomError.notFound("Active student profile not found");
        }

        return {
            studentId: st_id,
            fullName: st_full_name,
            activeModule: activeOrFrozenModule.st_mod_module_id,
            isContractFrozen: activeOrFrozenModule.st_mod_status === "FROZEN",
            freezeCount: activeOrFrozenModule.st_mod_freeze_count,
            reactivationCount: activeOrFrozenModule.st_mod_reactivation_count,
        };
    }
}
