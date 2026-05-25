import { studentContractStatus, type StudentContractStatus } from "@/app/admin-desk/students/domain/interfaces/Students.interface";

export class ChangeContractStatusDto {
    private constructor(public readonly contractStatus: StudentContractStatus) {}

    static create(object: { [key: string]: any }): [string?, ChangeContractStatusDto?] {
        const { contractStatus } = object;

        if (!contractStatus) return ["Missing contractStatus"];

        if (!Object.values(studentContractStatus).includes(contractStatus as StudentContractStatus)) {
            return ["Invalid contractStatus"];
        }

        return [undefined, new ChangeContractStatusDto(contractStatus as StudentContractStatus)];
    }
}
