import type { CertificateType, StudentContractStatus } from "@/core/interfaces/students.interface";
import type { UpdateStudentProps } from "@/app/admin-desk/students/application/dtos/interfaces/update-student.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class UpdateStudentDto {
    private constructor(
        public readonly identificationCard?: string,
        public readonly fullName?: string,
        public readonly phoneNumber?: string,
        public readonly email?: string,
        public readonly startDate?: Date,
        public readonly dateOfBirth?: Date,
        public readonly nationality?: string,
        public readonly certificateType?: CertificateType,

        public readonly contractStatus?: StudentContractStatus,
        public readonly isGraduated?: boolean,
    ) {}

    public get value() {
        const returnObject: Record<string, unknown> = {};

        if (this.identificationCard) returnObject.st_identification_card = this.identificationCard;
        if (this.fullName) returnObject.st_full_name = this.fullName;
        if (this.phoneNumber) returnObject.st_phone_number = this.phoneNumber;
        if (this.email) returnObject.st_email = this.email;
        if (this.startDate) returnObject.st_start_date = this.startDate;
        if (this.dateOfBirth) returnObject.st_date_of_birth = this.dateOfBirth;
        if (this.nationality) returnObject.st_nationality = this.nationality;
        if (this.certificateType) returnObject.st_certificate_type = this.certificateType;

        if (this.contractStatus) returnObject.st_contract_status = this.contractStatus;
        if (this.isGraduated !== undefined) returnObject.st_is_graduated = this.isGraduated;

        return returnObject;
    }

    public static create(object: Record<string, unknown>, validator: EntityValidator<UpdateStudentProps>): UpdateStudentDto {
        const validatedData = validator.validate(object);

        const startDate = validatedData.startDate ? new Date(validatedData.startDate) : undefined;
        const dateOfBirth = validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined;
        let isGraduated: boolean | undefined = undefined;

        if (validatedData.isGraduated !== undefined) {
            isGraduated = validatedData.isGraduated === "true" || validatedData.isGraduated === true;
        }

        return new UpdateStudentDto(
            validatedData.identificationCard,
            validatedData.fullName,
            validatedData.phoneNumber,
            validatedData.email,
            startDate,
            dateOfBirth,
            validatedData.nationality,
            validatedData.certificateType,
            validatedData.contractStatus,
            isGraduated,
        );
    }
}
