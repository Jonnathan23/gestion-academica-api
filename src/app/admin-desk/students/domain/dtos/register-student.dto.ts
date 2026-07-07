import { Validators } from "@/core/utils";
import type { CertificateType } from "@/data/models/admin-desk/student.model";

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

    public static create(object: { [key: string]: any }): [string?, RegisterStudentDto?] {
        const { identificationCard, fullName, phoneNumber, email, dateOfBirth, nationality, certificateType, startDate } = object;

        if (!identificationCard) return ["Missing identificationCard"];
        if (!fullName) return ["Missing fullName"];
        if (!phoneNumber) return ["Missing phoneNumber"];
        if (!email) return ["Missing email"];
        if (!dateOfBirth) return ["Missing dateOfBirth"];
        if (!nationality) return ["Missing nationality"];
        if (!certificateType) return ["Missing certificateType"];
        if (!startDate) return ["Missing startDate"];

        if (!Validators.isIdentificationCard(identificationCard)) return ["Invalid identificationCard"];
        if (!Validators.isPhoneNumber(phoneNumber)) return ["Invalid phoneNumber"];
        if (fullName.length < 3) return ["Invalid fullName"];

        if (!Validators.isEmail(email)) return ["Invalid email"];

        const parsedBirthDate = new Date(dateOfBirth);

        if (isNaN(parsedBirthDate.getTime())) return ["Invalid dateOfBirth"];

        if (!Validators.isMinValidateAge(parsedBirthDate)) return ["Invalid dateOfBirth"];

        const parsedStartDate = new Date(startDate);

        if (isNaN(parsedStartDate.getTime())) return ["Invalid startDate"];

        if (!Validators.isCertificateType(certificateType)) return ["Invalid certificateType"];

        return [
            undefined,
            new RegisterStudentDto(
                identificationCard,
                fullName,
                phoneNumber,
                email,
                parsedStartDate,
                parsedBirthDate,
                nationality,
                certificateType,
            ),
        ];
    }
}
