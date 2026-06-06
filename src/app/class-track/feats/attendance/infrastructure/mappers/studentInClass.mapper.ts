import { StudentInClassProjection } from "@/app/class-track/feats/dashboard/domain/projections/StudentInClass.projection";
import { studentContractStatus, type StudentContractStatus } from "@/core/interfaces/Students.interface";
import { CustomError } from "@/core/error/customError.error";

export interface AttendanceSessionDbRecord {
    at_se_id: string;
    at_se_student_id: string;
    at_se_entry_time: Date;
    student?: {
        st_full_name: string;
        StudentModules?: Array<{
            st_mod_status: StudentContractStatus;
        }>;
    };
}

export class StudentInClassMapper {
    public static projectionFromDbRecord(record: AttendanceSessionDbRecord): StudentInClassProjection {
        if (!record.student || !record.student.StudentModules || record.student.StudentModules.length === 0) {
            throw CustomError.notFound("Student has no active contract or data is missing");
        }

        const contractStatus = record.student.StudentModules[0]?.st_mod_status ?? studentContractStatus.Inactive;

        return new StudentInClassProjection(
            record.at_se_id,
            record.at_se_student_id,
            record.student.st_full_name,
            contractStatus,
            record.at_se_entry_time,
        );
    }
}
