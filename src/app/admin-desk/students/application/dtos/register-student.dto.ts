import type { CertificateType } from "@/data/models/admin-desk/student.model";
import type { RegisterStudentProps } from "@/app/admin-desk/students/application/dtos/interfaces/register-student.interface";
import type { EntityValidator } from "@/core/utils/adapters/validators/interfaces/entity-validator.interface";

export class RegisterStudentDto {
    private constructor(
        public readonly identificationCard: string,
        public readonly fullName: string,
        public readonly phoneNumber: string,
        public readonly email: string,
        public readonly startDate: Date,
        public readonly dateOfBirth: Date,
        public readonly nationality: string,
        public readonly certificateType: CertificateType,
    ) {}

    public static create(object: Record<string, unknown>, validator: EntityValidator<RegisterStudentProps>): RegisterStudentDto {
        const validatedData = validator.validate(object);

        return new RegisterStudentDto(
            validatedData.identificationCard,
            validatedData.fullName,
            validatedData.phoneNumber,
            validatedData.email,
            new Date(validatedData.startDate),
            new Date(validatedData.dateOfBirth),
            validatedData.nationality,
            validatedData.certificateType,
        );
    }
}
