import { studentModuleStatus, type StudentModuleStatus } from "@/app/admin-desk/student-level/domain/interfaces/Contracts.interface";
import { Validators } from "@/core/utils";

export class UpdateStudentLevelDto {
    private constructor(
        public readonly contractId: string,
        public readonly studentId: string,
        public readonly status: StudentModuleStatus,
    ) {}

    get values() {
        const returnObject: { [key: string]: any } = {};
        if (this.contractId) returnObject.contractId = this.contractId;
        if (this.studentId) returnObject.studentId = this.studentId;
        if (this.status) returnObject.status = this.status;
        return returnObject;
    }

    static create(object: { [key: string]: any }): [string?, UpdateStudentLevelDto?] {
        const { contractId, studentId, status } = object;

        if (!contractId) return ["Missing contract"];
        if (!status) return ["Missing status"];
        if (!studentId) return ["Missing student"];

        if (!Validators.IsUUID(contractId)) return ["Invalid contract format"];
        if (!Validators.IsUUID(studentId)) return ["Invalid student format"];

        if (![studentModuleStatus.Active, studentModuleStatus.Approved, studentModuleStatus.Locked].includes(status)) {
            return ["status must be ACTIVE, APPROVED or LOCKED"];
        }

        return [undefined, new UpdateStudentLevelDto(contractId, studentId, status)];
    }
}
