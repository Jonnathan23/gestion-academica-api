import { studentModuleStatus } from "@/app/admin-desk/student-level/domain/interfaces/Contracts.interface";
import { Validators } from "@/core/utils";

export class UpdateStudentLevelDto {
    private constructor(
        public readonly studentLevelId: string,
        public readonly studentId: string,
    ) {}

    get values() {
        const returnObject: { [key: string]: any } = {};
        if (this.studentLevelId) returnObject.studentLevelId = this.studentLevelId;
        if (this.studentId) returnObject.studentId = this.studentId;
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

        return [undefined, new UpdateStudentLevelDto(contractId, studentId)];
    }
}
